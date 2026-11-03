/**
 * Fantasy MSL Points Calculation Service
 * 
 * Calculates points for a fantasy squad based on real-world match event data.
 * Specific rules enforced:
 * - Goals: Forward (+4), Midfielder (+5), Defender/GK (+6)
 * - Assists: +3 points
 * - Clean Sheets: Goalkeeper/Defender (+4), Midfielder (+1) (requires >=60 mins and 0 goals conceded)
 * - Card Deductions: Yellow (-1), Red (-3)
 * - Additional Actions: Own Goal (-2), Penalty Miss (-2), Penalty Save (+5), GK Saves (+1 per 3 saves)
 * - Goals Conceded: -1 pt per 2 goals conceded (DEF & GK)
 * - Minutes Played: 1-59 mins (+1 pt), 60+ mins (+2 pts)
 * - Multipliers: Captain (2x), Triple Captain (3x)
 * - Bench Boost: All 15 score if active, otherwise starters + auto-subs
 */

import type { FantasyPlayer, FantasyChipType } from "./fantasyEngine";

export interface MatchEventData {
  id?: string;
  matchId: number;
  minute: number;
  type:
    | "goal"
    | "assist"
    | "yellow_card"
    | "red_card"
    | "own_goal"
    | "penalty_miss"
    | "penalty_save"
    | "save";
  playerId: number;
  playerName?: string;
  clubId?: number;
}

export interface MatchContextData {
  matchId: number;
  matchweek: number;
  homeClubId: number;
  awayClubId: number;
  homeScore: number;
  awayScore: number;
  playerMinutesPlayed?: Record<number, number>; // playerId -> minutes
}

export interface PlayerPointsCalculation {
  player: FantasyPlayer;
  points: number;
  rawPoints: number;
  breakdown: Array<{ action: string; pts: number }>;
  minutesPlayed: number;
  goals: number;
  assists: number;
  cleanSheet: boolean;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  penaltySaves: number;
  penaltyMisses: number;
  saves: number;
  goalsConceded: number;
  isCaptain: boolean;
  isTripleCaptain: boolean;
}

export interface SquadPointsResult {
  totalSquadPoints: number;
  startingPoints: number;
  benchPoints: number;
  transferPenaltyDeduction: number;
  netGameweekScore: number;
  playerCalculations: Record<number, PlayerPointsCalculation>;
  activeStarters: FantasyPlayer[];
  activeBench: FantasyPlayer[];
  activeChip: FantasyChipType | null;
}

/**
 * Calculate match points for a single player from event streams and match context
 */
export function calculatePlayerPointsFromMatchEvents(
  player: FantasyPlayer,
  matchEvents: MatchEventData[],
  matchContexts: MatchContextData[],
  isCaptain: boolean = false,
  isTripleCaptain: boolean = false
): PlayerPointsCalculation {
  const breakdown: Array<{ action: string; pts: number }> = [];

  // 1. Find match context for player's club
  const playerMatch = matchContexts.find(
    (m) => m.homeClubId === player.clubId || m.awayClubId === player.clubId
  );

  // Determine minutes played
  let minutesPlayed = 0;
  if (playerMatch?.playerMinutesPlayed && typeof playerMatch.playerMinutesPlayed[player.id] === "number") {
    minutesPlayed = playerMatch.playerMinutesPlayed[player.id];
  } else if (playerMatch) {
    // Default starter/sub minutes if context exists
    minutesPlayed = player.isStarter ? 90 : 25;
  }

  // Determine goals conceded by player's club
  let goalsConceded = 0;
  if (playerMatch) {
    const isHome = playerMatch.homeClubId === player.clubId;
    goalsConceded = isHome ? playerMatch.awayScore : playerMatch.homeScore;
  }

  // 2. Playing Time Points
  if (minutesPlayed >= 60) {
    breakdown.push({ action: "Played 60+ minutes", pts: 2 });
  } else if (minutesPlayed > 0) {
    breakdown.push({ action: "Played 1-59 minutes", pts: 1 });
  }

  // 3. Count player events
  const playerEvents = matchEvents.filter((e) => e.playerId === player.id);
  const goals = playerEvents.filter((e) => e.type === "goal").length;
  const assists = playerEvents.filter((e) => e.type === "assist").length;
  const yellowCards = playerEvents.filter((e) => e.type === "yellow_card").length;
  const redCards = playerEvents.filter((e) => e.type === "red_card").length;
  const ownGoals = playerEvents.filter((e) => e.type === "own_goal").length;
  const penaltyMisses = playerEvents.filter((e) => e.type === "penalty_miss").length;
  const penaltySaves = playerEvents.filter((e) => e.type === "penalty_save").length;
  const saves = playerEvents.filter((e) => e.type === "save").length;

  // 4. Goal points by position: FWD (+4), MID (+5), DEF/GK (+6)
  if (goals > 0) {
    const ptsPerGoal = player.position === "FWD" ? 4 : player.position === "MID" ? 5 : 6;
    const goalPts = goals * ptsPerGoal;
    breakdown.push({
      action: `${goals} Goal${goals > 1 ? "s" : ""} (${player.position})`,
      pts: goalPts,
    });
  }

  // 5. Assists: +3 points
  if (assists > 0) {
    breakdown.push({
      action: `${assists} Assist${assists > 1 ? "s" : ""}`,
      pts: assists * 3,
    });
  }

  // 6. Clean Sheet: GK & DEF (+4), MID (+1) (Requires >=60 mins & 0 goals conceded)
  const isCleanSheet = minutesPlayed >= 60 && goalsConceded === 0;
  if (isCleanSheet) {
    if (player.position === "GK" || player.position === "DEF") {
      breakdown.push({ action: "Clean Sheet (GK/DEF)", pts: 4 });
    } else if (player.position === "MID") {
      breakdown.push({ action: "Clean Sheet (MID)", pts: 1 });
    }
  }

  // 7. Goalkeeper Saves & Penalty Saves
  if (player.position === "GK") {
    const savePts = Math.floor(saves / 3);
    if (savePts > 0) {
      breakdown.push({ action: `${saves} Saves made`, pts: savePts });
    }
    if (penaltySaves > 0) {
      breakdown.push({ action: `${penaltySaves} Penalty Save`, pts: penaltySaves * 5 });
    }
  }

  // 8. Goals Conceded deduction (-1 per 2 goals for DEF and GK)
  if ((player.position === "GK" || player.position === "DEF") && goalsConceded >= 2) {
    const deduction = Math.floor(goalsConceded / 2);
    breakdown.push({ action: `${goalsConceded} Goals Conceded`, pts: -deduction });
  }

  // 9. Card Deductions: Yellow (-1), Red (-3)
  if (yellowCards > 0) {
    breakdown.push({ action: `${yellowCards} Yellow Card`, pts: -yellowCards });
  }
  if (redCards > 0) {
    breakdown.push({ action: `${redCards} Red Card`, pts: -3 * redCards });
  }

  // 10. Negative events: Own Goal (-2), Penalty Miss (-2)
  if (ownGoals > 0) {
    breakdown.push({ action: `${ownGoals} Own Goal`, pts: -2 * ownGoals });
  }
  if (penaltyMisses > 0) {
    breakdown.push({ action: `${penaltyMisses} Penalty Miss`, pts: -2 * penaltyMisses });
  }

  // Calculate raw total before multiplier
  const rawPoints = breakdown.reduce((acc, item) => acc + item.pts, 0);

  // Multiplier logic
  let finalMultiplier = 1;
  if (isTripleCaptain) {
    finalMultiplier = 3;
    breakdown.push({ action: "Triple Captain Active (3x)", pts: rawPoints * 2 });
  } else if (isCaptain) {
    finalMultiplier = 2;
    breakdown.push({ action: "Captain Multiplier (2x)", pts: rawPoints });
  }

  return {
    player,
    points: rawPoints * finalMultiplier,
    rawPoints,
    breakdown,
    minutesPlayed,
    goals,
    assists,
    cleanSheet: isCleanSheet,
    yellowCards,
    redCards,
    ownGoals,
    penaltySaves,
    penaltyMisses,
    saves,
    goalsConceded,
    isCaptain,
    isTripleCaptain,
  };
}

/**
 * Service function: Calculates total points for an entire fantasy squad based on match event data.
 * Handles:
 * - Starting 11 vs Bench scoring
 * - Vice-captain inheritance if captain played 0 minutes
 * - Auto-substitution for non-playing starters
 * - Bench Boost chip activation (all 15 score)
 * - Triple Captain chip activation (3x)
 * - Transfer point penalty deductions
 */
export function calculateSquadPointsFromMatchEvents(
  squad: FantasyPlayer[],
  matchEvents: MatchEventData[],
  matchContexts: MatchContextData[],
  activeChip: FantasyChipType | null = null,
  transferPenaltyDeduction: number = 0
): SquadPointsResult {
  const starters = squad.filter((p) => p.isStarter);
  const bench = squad
    .filter((p) => !p.isStarter)
    .sort((a, b) => (a.benchIndex ?? 0) - (b.benchIndex ?? 0));

  // Determine Captain and Vice Captain
  const designatedCaptain = squad.find((p) => p.isCaptain) || starters[0];
  const designatedViceCaptain = squad.find((p) => p.isViceCaptain) || starters[1];

  // Pre-calculate minutes to check if Captain played
  const captainMatch = matchContexts.find(
    (m) => m.homeClubId === designatedCaptain?.clubId || m.awayClubId === designatedCaptain?.clubId
  );
  const captainMinutes =
    captainMatch?.playerMinutesPlayed?.[designatedCaptain?.id ?? -1] ?? (designatedCaptain?.isStarter ? 90 : 0);

  const captainPlayed = captainMinutes > 0;
  const activeCaptainId = captainPlayed ? designatedCaptain?.id : designatedViceCaptain?.id;

  const isTripleCaptain = activeChip === "triple_captain";
  const isBenchBoost = activeChip === "bench_boost";

  // Calculate points for all 15 squad members
  const playerCalculations: Record<number, PlayerPointsCalculation> = {};

  squad.forEach((player) => {
    const isPlayerCaptain = player.id === activeCaptainId;
    const calc = calculatePlayerPointsFromMatchEvents(
      player,
      matchEvents,
      matchContexts,
      isPlayerCaptain,
      isPlayerCaptain && isTripleCaptain
    );
    playerCalculations[player.id] = calc;
  });

  // Calculate Starter Points
  let startingPoints = 0;
  starters.forEach((player) => {
    startingPoints += playerCalculations[player.id]?.points ?? 0;
  });

  // Calculate Bench Points
  let benchPoints = 0;
  bench.forEach((player) => {
    benchPoints += playerCalculations[player.id]?.points ?? 0;
  });

  // Handle Bench Boost vs Normal Auto-Subs
  let totalSquadPoints = 0;
  if (isBenchBoost) {
    // All 15 players score
    totalSquadPoints = startingPoints + benchPoints;
  } else {
    // Starters score; auto-subs step in for non-playing starters
    let activeStartersPoints = 0;
    const benchUsedIds = new Set<number>();

    starters.forEach((starter) => {
      const starterCalc = playerCalculations[starter.id];
      if (starterCalc && starterCalc.minutesPlayed > 0) {
        activeStartersPoints += starterCalc.points;
      } else {
        // Find bench substitute of same or compatible position
        const eligibleSub = bench.find(
          (b) =>
            !benchUsedIds.has(b.id) &&
            (starter.position === "GK" ? b.position === "GK" : b.position !== "GK") &&
            (playerCalculations[b.id]?.minutesPlayed ?? 0) > 0
        );

        if (eligibleSub) {
          benchUsedIds.add(eligibleSub.id);
          activeStartersPoints += playerCalculations[eligibleSub.id]?.points ?? 0;
        }
      }
    });

    totalSquadPoints = activeStartersPoints;
  }

  // Net score deducting any transfer penalty
  const netGameweekScore = totalSquadPoints - transferPenaltyDeduction;

  return {
    totalSquadPoints,
    startingPoints,
    benchPoints,
    transferPenaltyDeduction,
    netGameweekScore,
    playerCalculations,
    activeStarters: starters,
    activeBench: bench,
    activeChip,
  };
}
