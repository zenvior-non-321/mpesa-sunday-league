/**
 * Fantasy MSL (MSL Fantasy Football) Engine
 * Virtual management game based on real-world M-Pesa Sunday League matches.
 * 
 * Rules:
 * - Fixed £100.0m Virtual Budget
 * - 15-Player Squad: 2 GK, 5 DEF, 5 MID, 3 FWD
 * - Starting 11 + 4 Bench
 * - Maximum 2 players per real-world MSL club
 * - Valid Formations: At least 1 GK, 3 DEF, 2 MID, 1 FWD
 * - Captain (2x points) & Vice-Captain
 * - Special Chips: Wildcard, Triple Captain (3x), Bench Boost, Free Hit
 * - Realistic FIFA/FPL point matrix (Goals by pos, assists, clean sheets, saves, cards)
 */

import { OFFICIAL_CLUBS_DATA, getAllRegisteredPlayers, type SquadMember } from "./teamSquadsData";
import { getDbFixtures, getDbMatchReports, getDbPlayers, getDbTeams } from "./inbuiltDbSync";
import { isTeamDeleted } from "./fixturesData";

export interface GameweekChallenge {
  gameweek: number;
  title: string;
  description: string;
  badgeText?: string;
  specialBonus?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export const DEFAULT_GAMEWEEK_CHALLENGES: Record<number, GameweekChallenge> = {
  1: {
    gameweek: 1,
    title: "Championship Kickoff",
    description: "Earn +2 points for every clean sheet kept and +3 points for team captains who score first in the opening round. Maximum 3 players per club.",
    badgeText: "Season Opener",
    specialBonus: "+2 Clean Sheet Bonus",
  },
  2: {
    gameweek: 2,
    title: "Academy Derby Clásico",
    description: "Double bonus points (+4) for midfielders providing assists from open play in local rivalry fixtures. Maximum 3 players per club.",
    badgeText: "Rivalry Round",
    specialBonus: "Double Assist Points",
  },
  3: {
    gameweek: 3,
    title: "Tactical Masterclass",
    description: "Defenders who complete 90 minutes without conceding a goal or receiving cards receive +3 tactical bonus points. Maximum 3 players per club.",
    badgeText: "Defensive Fortress",
    specialBonus: "+3 Discipline Points",
  },
  4: {
    gameweek: 4,
    title: "Midfield Maestros",
    description: "All midfielders receive +1 point for every 3 successful key passes and +5 points for outside-the-box goals. Maximum 3 players per club.",
    badgeText: "Playmaker Focus",
    specialBonus: "+5 Long Range Goals",
  },
  5: {
    gameweek: 5,
    title: "Golden Boot Sprint",
    description: "Forwards earn +6 points per goal (boosted from +4) and an extra +3 bonus for hat-tricks. Maximum 3 players per club.",
    badgeText: "Striker Surge",
    specialBonus: "+6 Forward Goals",
  },
  10: {
    gameweek: 10,
    title: "Spectacular",
    description: "Your players earn +1 point for every shot on target from outside the penalty area and +5 points for every goal scored from outside the penalty area. Maximum 3 players per club. Unlimited budget.",
    badgeText: "Spectacular",
    specialBonus: "+5 Long Range Goals",
  },
};

export const GW_CHALLENGES_STORAGE_KEY = "mpesa_fantasy_gw_challenges_v1";

export function getGameweekChallenge(gameweek: number): GameweekChallenge {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(GW_CHALLENGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[gameweek]) return parsed[gameweek];
      }
    } catch {
      // ignore
    }
  }
  return (
    DEFAULT_GAMEWEEK_CHALLENGES[gameweek] || {
      gameweek,
      title: `Gameweek ${gameweek} Challenge`,
      description: `Compete for maximum matchweek points under certified MSL rules. Maximum 3 players per club.`,
      badgeText: `GW${gameweek}`,
      specialBonus: "Standard Rules",
    }
  );
}

export function saveGameweekChallenge(challenge: GameweekChallenge): void {
  if (typeof window === "undefined") return;
  try {
    let all: Record<number, GameweekChallenge> = { ...DEFAULT_GAMEWEEK_CHALLENGES };
    const stored = localStorage.getItem(GW_CHALLENGES_STORAGE_KEY);
    if (stored) {
      all = { ...all, ...JSON.parse(stored) };
    }
    all[challenge.gameweek] = {
      ...challenge,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(GW_CHALLENGES_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("mpesa_fantasy_challenge_updated", { detail: challenge }));
  } catch {
    // ignore
  }
}

export interface AdminPlayerRating {
  playerId: number;
  playerName: string;
  clubName: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  matchRating: number; // Official rating e.g. 8.5 / 10
  bonusPoints: number; // Official bonus pts e.g. 0 to 5
  matchweek?: number; // Official Matchweek (e.g. 1 to 10)
  goalsScored?: number;
  assistsLogged?: number;
  cleanSheetLogged?: boolean;
  notes?: string;
  ratedByAdmin: string;
  updatedAt: string;
}

export const ADMIN_RATINGS_STORAGE_KEY = "mpesa_fantasy_admin_ratings_v2";

export function getAdminPlayerRatings(matchweek?: number): Record<number, AdminPlayerRating> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ADMIN_RATINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (matchweek) {
        const filtered: Record<number, AdminPlayerRating> = {};
        Object.entries(parsed).forEach(([key, val]: [string, any]) => {
          if (val && (val.matchweek === matchweek || key.startsWith(`gw${matchweek}_`))) {
            filtered[val.playerId] = val;
          }
        });
        // If matchweek specific ratings exist, return them
        if (Object.keys(filtered).length > 0) return filtered;
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return {};
}

export function saveAdminPlayerRating(rating: AdminPlayerRating): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ADMIN_RATINGS_STORAGE_KEY);
    const current: Record<string | number, AdminPlayerRating> = raw ? JSON.parse(raw) : {};
    current[rating.playerId] = rating;
    if (rating.matchweek) {
      current[`gw${rating.matchweek}_p${rating.playerId}`] = rating;
    }
    localStorage.setItem(ADMIN_RATINGS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("mpesa_fantasy_ratings_updated", { detail: rating }));
  } catch {
    // ignore
  }
}

export interface FantasyPlayer {
  id: number;
  isRatedByAdmin?: boolean;
  name: string;
  clubId: number;
  clubName: string;
  clubShortCode: string;
  clubColor: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  price: number; // in Millions, strictly below 10M, e.g. 5.5 = £5.5m
  jerseyNumber: number;
  totalPoints: number;
  gameweekPoints: number;
  adminRating?: number; // e.g. 8.5 / 10
  adminBonusPoints?: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  saves: number;
  yellowCards: number;
  redCards: number;
  form: number; // e.g. 6.2
  selectedPercent: number; // e.g. 34.5%
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isStarter?: boolean;
  benchIndex?: number; // 0: GK Sub, 1: Sub 1, 2: Sub 2, 3: Sub 3
}

export type FantasyChipType = "wildcard" | "triple_captain" | "bench_boost" | "free_hit";

export interface FantasyChipStatus {
  id: FantasyChipType;
  name: string;
  description: string;
  isAvailable: boolean;
  isActiveThisGameweek: boolean;
  usedInGameweek?: number;
}

export interface FantasyTeamState {
  teamName: string;
  managerName: string;
  bankBudget: number; // remaining in £m
  totalSquadValue: number;
  squad: FantasyPlayer[]; // exactly 15 players (11 starters + 4 bench)
  captainId: number | null;
  viceCaptainId: number | null;
  activeChip: FantasyChipType | null;
  chips: Record<FantasyChipType, FantasyChipStatus>;
  freeTransfers: number; // 1 per week, rolls over to max 2
  transfersMadeThisWeek: number;
  gameweekPoints: number;
  totalSeasonPoints: number;
  overallRank: number;
}

export interface MiniLeagueEntry {
  rank: number;
  managerName: string;
  teamName: string;
  gameweekPoints: number;
  totalPoints: number;
  chipActive?: string;
  gameweekScores: Record<number, number>; // Points per matchweek: { 1: 52, 2: 48, ... }
}

export interface MiniLeague {
  id: string;
  name: string;
  code: string;
  type: "classic" | "head_to_head";
  creator: string;
  createdAt: string;
  membersCount: number;
  entries: MiniLeagueEntry[];
}

// Player price determination algorithm based on registered role & position from real website data
export function generateFantasyMarket(
  customRatings?: Record<number, AdminPlayerRating>,
  matchweek?: number,
): FantasyPlayer[] {
  // Load real registered players and clubs from live database, fallback to official clubs
  const dbPlayers = getDbPlayers();
  const dbTeams = getDbTeams().filter((t) => !isTeamDeleted(t.id, t.name));
  const teamColorMap: Record<number, { name: string; code: string; color: string }> = {};
  dbTeams.forEach((t) => {
    teamColorMap[t.id] = { name: t.name, code: t.shortCode, color: t.color };
  });

  const clubMap: Record<number, { name: string; code: string; color: string }> = {
    1: { name: "Samba", code: "SAM", color: "#00ff85" },
    6: { name: "Royal Rangers", code: "RR", color: "#3b82f6" },
    7: { name: "Young Stars City", code: "YSC", color: "#f97316" },
    8: { name: "Mzinga Boyz", code: "MZB", color: "#eab308" },
    ...teamColorMap,
  };

  const registeredSource =
    dbPlayers.length > 0
      ? dbPlayers.filter((p) => !isTeamDeleted(p.teamId, p.teamName))
      : getAllRegisteredPlayers().filter((p) => !isTeamDeleted(p.teamId, p.teamName));

  const adminRatings = customRatings || getAdminPlayerRatings(matchweek);

  // Base pricing calibrated strictly below 10.0m (max 8.8m)
  return registeredSource.map((p: any, idx: number) => {
    const playerId = p.id || p.teamId * 100 + (p.number || idx + 1);
    const club = clubMap[p.teamId] || { name: p.teamName || "Club", code: p.teamCode || "CLB", color: p.teamColor || "#00f0ff" };
    let rawPrice = 5.0;
    if (p.position === "FWD") {
      rawPrice = p.isCaptain ? 8.5 : 6.5 + (idx % 3) * 0.5;
    } else if (p.position === "MID") {
      rawPrice = p.isCaptain ? 7.5 : 5.5 + (idx % 4) * 0.5;
    } else if (p.position === "DEF") {
      rawPrice = p.isCaptain ? 6.0 : 4.5 + (idx % 3) * 0.5;
    } else if (p.position === "GK") {
      rawPrice = idx % 2 === 0 ? 5.5 : 4.5;
    }

    // Strict ceiling: Everyone is strictly below 10.0M
    const price = Math.min(Number(rawPrice.toFixed(1)), 8.8);

    // Official Admin match rating and bonus points (specific to matchweek if provided)
    const adminData =
      (matchweek ? (adminRatings as any)[`gw${matchweek}_p${playerId}`] : undefined) ||
      adminRatings[playerId];
    const isRatedByAdmin = Boolean(adminData && typeof adminData.matchRating === "number");
    const matchRating = isRatedByAdmin ? adminData.matchRating : undefined;
    const adminBonus = isRatedByAdmin ? (adminData.bonusPoints || 0) : 0;

    // Verified on-pitch stats
    const goals = adminData?.goalsScored ?? p.goals ?? 0;
    const assists = adminData?.assistsLogged ?? p.assists ?? 0;
    const cleanSheets = (adminData?.cleanSheetLogged ? 1 : p.cleanSheets) ?? 0;
    const saves = p.saves ?? (p.position === "GK" ? 4 : 0);

    // Points rule: Counted after admin has logged the player ratings
    let gameweekPoints = 0;
    if (isRatedByAdmin && matchRating !== undefined) {
      const ratingBasePts = Math.round(matchRating * 2) + adminBonus;
      gameweekPoints =
        ratingBasePts +
        goals * (p.position === "FWD" ? 4 : 5) +
        assists * 3 +
        cleanSheets * 4 +
        Math.floor(saves / 3);
    } else if (customRatings && adminData?.matchRating) {
      gameweekPoints = Math.round(adminData.matchRating * 2) + adminBonus;
    }

    const totalPoints = gameweekPoints + goals * 4 + assists * 3;
    const form = isRatedByAdmin && matchRating !== undefined ? matchRating : Number((6.5 + (idx % 4) * 0.4).toFixed(1));

    return {
      id: playerId,
      name: p.name,
      clubId: p.teamId,
      clubName: club.name,
      clubShortCode: club.code,
      clubColor: club.color,
      position: p.position,
      price,
      jerseyNumber: p.number,
      totalPoints,
      gameweekPoints,
      isRatedByAdmin,
      adminRating: matchRating,
      adminBonusPoints: adminBonus,
      goals,
      assists,
      cleanSheets,
      saves,
      yellowCards: p.yellowCards || 0,
      redCards: p.redCards || 0,
      form,
      selectedPercent: Number((14.0 + (idx % 7) * 4.2).toFixed(1)),
    };
  });
}

/**
 * Validate Formation:
 * Must have exactly 11 starting players:
 * - Exactly 1 Goalkeeper
 * - At least 3 Defenders (Max 5)
 * - At least 2 Midfielders (Max 5)
 * - At least 1 Forward (Max 3)
 */
export function validateFormation(starters: FantasyPlayer[]): {
  isValid: boolean;
  gkCount: number;
  defCount: number;
  midCount: number;
  fwdCount: number;
  formationName: string;
  errorMessage?: string;
} {
  const gkCount = starters.filter((p) => p.position === "GK").length;
  const defCount = starters.filter((p) => p.position === "DEF").length;
  const midCount = starters.filter((p) => p.position === "MID").length;
  const fwdCount = starters.filter((p) => p.position === "FWD").length;
  const total = starters.length;

  const formationName = `${defCount}-${midCount}-${fwdCount}`;

  if (total !== 11) {
    return {
      isValid: false,
      gkCount,
      defCount,
      midCount,
      fwdCount,
      formationName,
      errorMessage: `Starting 11 incomplete: ${total}/11 selected.`,
    };
  }

  if (gkCount !== 1) {
    return {
      isValid: false,
      gkCount,
      defCount,
      midCount,
      fwdCount,
      formationName,
      errorMessage: `Must field exactly 1 Goalkeeper (Currently ${gkCount}).`,
    };
  }

  if (defCount < 3 || defCount > 5) {
    return {
      isValid: false,
      gkCount,
      defCount,
      midCount,
      fwdCount,
      formationName,
      errorMessage: `Defenders must be between 3 and 5 (Currently ${defCount}).`,
    };
  }

  if (midCount < 2 || midCount > 5) {
    return {
      isValid: false,
      gkCount,
      defCount,
      midCount,
      fwdCount,
      formationName,
      errorMessage: `Midfielders must be between 2 and 5 (Currently ${midCount}).`,
    };
  }

  if (fwdCount < 1 || fwdCount > 3) {
    return {
      isValid: false,
      gkCount,
      defCount,
      midCount,
      fwdCount,
      formationName,
      errorMessage: `Forwards must be between 1 and 3 (Currently ${fwdCount}).`,
    };
  }

  return {
    isValid: true,
    gkCount,
    defCount,
    midCount,
    fwdCount,
    formationName,
  };
}

/**
 * Check Maximum 3-Players Per Club Rule
 */
export function checkClubLimit(squad: FantasyPlayer[], maxPerClub = 3): {
  isCompliant: boolean;
  clubCounts: Record<string, number>;
  violatedClubs: string[];
} {
  const clubCounts: Record<string, number> = {};
  const violatedClubs: string[] = [];

  squad.forEach((p) => {
    clubCounts[p.clubName] = (clubCounts[p.clubName] || 0) + 1;
  });

  Object.entries(clubCounts).forEach(([club, count]) => {
    if (count > maxPerClub) {
      violatedClubs.push(`${club} (${count}/${maxPerClub})`);
    }
  });

  return {
    isCompliant: violatedClubs.length === 0,
    clubCounts,
    violatedClubs,
  };
}

/**
 * Calculate Individual Player Match Gameweek Points based on official Fantasy MSL Scoring rules
 */
export function calculatePlayerFantasyPoints(
  player: FantasyPlayer,
  stats: {
    minutesPlayed: number;
    goals: number;
    assists: number;
    cleanSheet: boolean;
    saves: number;
    penaltySaves: number;
    penaltyMisses: number;
    yellowCards: number;
    redCards: number;
    ownGoals: number;
    goalsConceded: number;
  },
  isCaptain: boolean = false,
  isTripleCaptain: boolean = false,
): {
  total: number;
  breakdown: Array<{ action: string; pts: number }>;
} {
  const breakdown: Array<{ action: string; pts: number }> = [];

  // 1. Minutes Played
  if (stats.minutesPlayed >= 60) {
    breakdown.push({ action: "Played 60+ mins", pts: 2 });
  } else if (stats.minutesPlayed > 0) {
    breakdown.push({ action: "Played 1-59 mins", pts: 1 });
  }

  // 2. Goals by Position
  if (stats.goals > 0) {
    const goalMultiplier = player.position === "FWD" ? 4 : player.position === "MID" ? 5 : 6;
    breakdown.push({
      action: `${stats.goals} Goal${stats.goals > 1 ? "s" : ""} (${player.position})`,
      pts: stats.goals * goalMultiplier,
    });
  }

  // 3. Assists
  if (stats.assists > 0) {
    breakdown.push({
      action: `${stats.assists} Assist${stats.assists > 1 ? "s" : ""}`,
      pts: stats.assists * 3,
    });
  }

  // 4. Clean Sheet (Must play >=60 mins)
  if (stats.cleanSheet && stats.minutesPlayed >= 60) {
    if (player.position === "GK" || player.position === "DEF") {
      breakdown.push({ action: "Clean Sheet (GK/DEF)", pts: 4 });
    } else if (player.position === "MID") {
      breakdown.push({ action: "Clean Sheet (MID)", pts: 1 });
    }
  }

  // 5. Goalkeeper Saves
  if (player.position === "GK") {
    const savePts = Math.floor(stats.saves / 3);
    if (savePts > 0) {
      breakdown.push({ action: `${stats.saves} Saves (${savePts} pts)`, pts: savePts });
    }
    if (stats.penaltySaves > 0) {
      breakdown.push({ action: "Penalty Save", pts: stats.penaltySaves * 5 });
    }
  }

  // 6. Goals Conceded deduction (-1 per 2 goals for DEF & GK)
  if ((player.position === "GK" || player.position === "DEF") && stats.goalsConceded >= 2) {
    const deduction = Math.floor(stats.goalsConceded / 2);
    breakdown.push({ action: `${stats.goalsConceded} Goals Conceded`, pts: -deduction });
  }

  // 7. Deductions
  if (stats.yellowCards > 0) {
    breakdown.push({ action: `${stats.yellowCards} Yellow Card`, pts: -stats.yellowCards });
  }
  if (stats.redCards > 0) {
    breakdown.push({ action: "Red Card", pts: -3 });
  }
  if (stats.ownGoals > 0) {
    breakdown.push({ action: `${stats.ownGoals} Own Goal`, pts: stats.ownGoals * -2 });
  }
  if (stats.penaltyMisses > 0) {
    breakdown.push({ action: "Penalty Miss", pts: stats.penaltyMisses * -2 });
  }

  const subTotal = breakdown.reduce((sum, item) => sum + item.pts, 0);

  // Apply Captain multiplier
  let finalMultiplier = 1;
  if (isTripleCaptain) {
    finalMultiplier = 3;
    breakdown.push({ action: "Triple Captain Active (3x)", pts: subTotal * 2 });
  } else if (isCaptain) {
    finalMultiplier = 2;
    breakdown.push({ action: "Captain Multiplier (2x)", pts: subTotal });
  }

  return {
    total: subTotal * finalMultiplier,
    breakdown,
  };
}

/**
 * Generate default seed fantasy squad conforming to £100m budget and club quota rules
 */
export function getDefaultFantasySquad(
  market: FantasyPlayer[],
  maxPerClub = 4,
): FantasyPlayer[] {
  const squad: FantasyPlayer[] = [];
  const clubCount: Record<number, number> = {};

  const canAdd = (p: FantasyPlayer) => {
    return (clubCount[p.clubId] || 0) < maxPerClub;
  };

  const addPlayer = (p: FantasyPlayer, isStarter: boolean, benchIdx?: number) => {
    squad.push({
      ...p,
      isStarter,
      benchIndex: benchIdx,
    });
    clubCount[p.clubId] = (clubCount[p.clubId] || 0) + 1;
  };

  // 1. Pick 2 GKs (1 Starter, 1 Bench)
  const gks = market.filter((p) => p.position === "GK");
  for (const gk of gks) {
    if (squad.filter((p) => p.position === "GK").length === 0 && canAdd(gk)) {
      addPlayer(gk, true);
    } else if (squad.filter((p) => p.position === "GK").length === 1 && canAdd(gk)) {
      addPlayer(gk, false, 0); // GK Bench
      break;
    }
  }

  // 2. Pick 5 DEFs (4 Starters, 1 Bench)
  const defs = market.filter((p) => p.position === "DEF");
  for (const def of defs) {
    const currentDefs = squad.filter((p) => p.position === "DEF");
    if (currentDefs.length < 4 && canAdd(def)) {
      addPlayer(def, true);
    } else if (currentDefs.length === 4 && canAdd(def)) {
      addPlayer(def, false, 1); // Bench Sub 1
      if (squad.filter((p) => p.position === "DEF").length === 5) break;
    }
  }

  // 3. Pick 5 MIDs (4 Starters, 1 Bench)
  const mids = market.filter((p) => p.position === "MID");
  for (const mid of mids) {
    const currentMids = squad.filter((p) => p.position === "MID");
    if (currentMids.length < 4 && canAdd(mid)) {
      addPlayer(mid, true);
    } else if (currentMids.length === 4 && canAdd(mid)) {
      addPlayer(mid, false, 2); // Bench Sub 2
      if (squad.filter((p) => p.position === "MID").length === 5) break;
    }
  }

  // 4. Pick 3 FWDs (2 Starters, 1 Bench)
  const fwds = market.filter((p) => p.position === "FWD");
  for (const fwd of fwds) {
    const currentFwds = squad.filter((p) => p.position === "FWD");
    if (currentFwds.length < 2 && canAdd(fwd)) {
      addPlayer(fwd, true);
    } else if (currentFwds.length === 2 && canAdd(fwd)) {
      addPlayer(fwd, false, 3); // Bench Sub 3
      if (squad.filter((p) => p.position === "FWD").length === 3) break;
    }
  }

  // Designate Captain and Vice Captain
  if (squad.length > 0) {
    const starters = squad.filter((p) => p.isStarter);
    if (starters[0]) starters[0].isCaptain = true;
    if (starters[1]) starters[1].isViceCaptain = true;
  }

  return squad;
}

export const DEFAULT_CHIPS: Record<FantasyChipType, FantasyChipStatus> = {
  wildcard: {
    id: "wildcard",
    name: "Wildcard",
    description: "Make unlimited free transfers for a Gameweek to permanently overhaul your squad.",
    isAvailable: true,
    isActiveThisGameweek: false,
  },
  triple_captain: {
    id: "triple_captain",
    name: "Triple Captain",
    description: "Triples (3x) your captain's score for one Gameweek instead of the usual double.",
    isAvailable: true,
    isActiveThisGameweek: false,
  },
  bench_boost: {
    id: "bench_boost",
    name: "Bench Boost",
    description: "Allows all 4 bench players to score points alongside your starting 11 for one Gameweek.",
    isAvailable: true,
    isActiveThisGameweek: false,
  },
  free_hit: {
    id: "free_hit",
    name: "Free Hit",
    description: "Make unlimited transfers for one Gameweek, after which your squad reverts to its exact previous setup.",
    isAvailable: true,
    isActiveThisGameweek: false,
  },
};

// Seed Global Public Leaderboard entries with authentic per-gameweek scoring history
export const DEFAULT_PUBLIC_LEAGUE_ENTRIES: MiniLeague = {
  id: "global-overall",
  name: "Overall Public League (All MSL Managers)",
  code: "MSL-GLOBAL",
  type: "classic",
  creator: "MSL Executive Secretariat",
  createdAt: "2026-09-01",
  membersCount: 8,
  entries: [
    {
      rank: 1,
      managerName: "Austin Brian Omondi",
      teamName: "Samba Galácticos",
      gameweekPoints: 68,
      totalPoints: 245,
      chipActive: "None",
      gameweekScores: { 1: 48, 2: 44, 3: 42, 4: 43, 5: 68 },
    },
    {
      rank: 2,
      managerName: "Levis Wanyama",
      teamName: "Royal Ranger Elite",
      gameweekPoints: 61,
      totalPoints: 238,
      chipActive: "None",
      gameweekScores: { 1: 45, 2: 46, 3: 44, 4: 42, 5: 61 },
    },
    {
      rank: 3,
      managerName: "You (Your Squad)",
      teamName: "M-Pesa Academy XI",
      gameweekPoints: 59,
      totalPoints: 231,
      chipActive: "None",
      gameweekScores: { 1: 42, 2: 43, 3: 45, 4: 42, 5: 59 },
    },
    {
      rank: 4,
      managerName: "George Victor Kibet",
      teamName: "Tactical Counterpress FC",
      gameweekPoints: 54,
      totalPoints: 224,
      chipActive: "None",
      gameweekScores: { 1: 44, 2: 42, 3: 43, 4: 41, 5: 54 },
    },
    {
      rank: 5,
      managerName: "Mitchelle Muthoni",
      teamName: "Golden Whistle United",
      gameweekPoints: 49,
      totalPoints: 216,
      chipActive: "None",
      gameweekScores: { 1: 40, 2: 42, 3: 41, 4: 44, 5: 49 },
    },
    {
      rank: 6,
      managerName: "Bidan Mwaura",
      teamName: "Clean Sheet Crusaders",
      gameweekPoints: 47,
      totalPoints: 209,
      chipActive: "None",
      gameweekScores: { 1: 41, 2: 39, 3: 40, 4: 42, 5: 47 },
    },
    {
      rank: 7,
      managerName: "Tonny Odundo",
      teamName: "Disciplinary Dominators",
      gameweekPoints: 42,
      totalPoints: 198,
      chipActive: "None",
      gameweekScores: { 1: 38, 2: 39, 3: 39, 4: 40, 5: 42 },
    },
    {
      rank: 8,
      managerName: "Alex Haro",
      teamName: "Presidential Strikers",
      gameweekPoints: 38,
      totalPoints: 185,
      chipActive: "None",
      gameweekScores: { 1: 36, 2: 37, 3: 36, 4: 38, 5: 38 },
    },
  ],
};

/**
 * Return Gameweek Leaderboard sorted strictly by the points earned in that specific matchweek
 */
export function getGameweekLeaderboard(entries: MiniLeagueEntry[], matchweek: number): MiniLeagueEntry[] {
  return [...entries]
    .map((e) => {
      const gwPts = e.gameweekScores?.[matchweek] ?? e.gameweekPoints;
      return {
        ...e,
        gameweekPoints: gwPts,
      };
    })
    .sort((a, b) => b.gameweekPoints - a.gameweekPoints)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

/**
 * Return Overall Season Leaderboard sorted by the cumulative sum of all weeks played
 */
export function getOverallSeasonLeaderboard(entries: MiniLeagueEntry[], maxWeek = 5): MiniLeagueEntry[] {
  return [...entries]
    .map((e) => {
      let sum = 0;
      if (e.gameweekScores) {
        for (let w = 1; w <= maxWeek; w++) {
          if (typeof e.gameweekScores[w] === "number") {
            sum += e.gameweekScores[w];
          }
        }
      } else {
        sum = e.totalPoints;
      }
      return {
        ...e,
        totalPoints: sum,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}
