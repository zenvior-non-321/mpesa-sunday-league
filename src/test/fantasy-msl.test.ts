import { describe, it, expect } from "vitest";
import {
  generateFantasyMarket,
  validateFormation,
  checkClubLimit,
  calculatePlayerFantasyPoints,
  getDefaultFantasySquad,
  getGameweekLeaderboard,
  getOverallSeasonLeaderboard,
  DEFAULT_CHIPS,
  DEFAULT_PUBLIC_LEAGUE_ENTRIES,
  type FantasyPlayer,
} from "../lib/fantasyEngine";
import {
  calculatePlayerPointsFromMatchEvents,
  calculateSquadPointsFromMatchEvents,
  type MatchEventData,
  type MatchContextData,
} from "../lib/fantasyPointsService";
import { OFFICIAL_CLUBS_DATA } from "../lib/teamSquadsData";

describe("Fantasy MSL Football Engine", () => {
  const market = generateFantasyMarket();

  it("should generate market players with valid roles, clubs, and prices strictly below 10M", () => {
    expect(market.length).toBeGreaterThanOrEqual(15);
    market.forEach((p) => {
      expect(p.price).toBeGreaterThan(0);
      expect(p.price).toBeLessThan(10.0); // Strict rule: below 10M
      expect(["GK", "DEF", "MID", "FWD"]).toContain(p.position);
      expect(p.clubName).toBeDefined();
    });
  });

  it("should integrate admin match ratings into player data", () => {
    const p = market[0];
    const customRating = {
      playerId: p.id,
      playerName: p.name,
      clubName: p.clubName,
      position: p.position,
      matchRating: 9.2,
      bonusPoints: 3,
      ratedByAdmin: "Commissioner",
      updatedAt: new Date().toISOString(),
    };
    const marketWithRating = generateFantasyMarket({ [p.id]: customRating });
    const ratedPlayer = marketWithRating.find((x) => x.id === p.id);
    expect(ratedPlayer?.adminRating).toBe(9.2);
    expect(ratedPlayer?.adminBonusPoints).toBe(3);
  });

  describe("Formation Validator", () => {
    it("should validate a valid 4-4-2 formation (1 GK, 4 DEF, 4 MID, 2 FWD)", () => {
      const gks = market.filter((p) => p.position === "GK").slice(0, 1);
      const defs = market.filter((p) => p.position === "DEF").slice(0, 4);
      const mids = market.filter((p) => p.position === "MID").slice(0, 4);
      const fwds = market.filter((p) => p.position === "FWD").slice(0, 2);

      const starters = [...gks, ...defs, ...mids, ...fwds];
      const result = validateFormation(starters);

      expect(result.isValid).toBe(true);
      expect(result.formationName).toBe("4-4-2");
      expect(result.gkCount).toBe(1);
      expect(result.defCount).toBe(4);
      expect(result.midCount).toBe(4);
      expect(result.fwdCount).toBe(2);
    });

    it("should validate a valid 3-5-2 formation", () => {
      const gks = market.filter((p) => p.position === "GK").slice(0, 1);
      const defs = market.filter((p) => p.position === "DEF").slice(0, 3);
      const mids = market.filter((p) => p.position === "MID").slice(0, 5);
      const fwds = market.filter((p) => p.position === "FWD").slice(0, 2);

      const starters = [...gks, ...defs, ...mids, ...fwds];
      const result = validateFormation(starters);

      expect(result.isValid).toBe(true);
      expect(result.formationName).toBe("3-5-2");
    });

    it("should reject an invalid lineup with 2 goalkeepers", () => {
      const gks = market.filter((p) => p.position === "GK").slice(0, 2);
      const defs = market.filter((p) => p.position === "DEF").slice(0, 3);
      const mids = market.filter((p) => p.position === "MID").slice(0, 4);
      const fwds = market.filter((p) => p.position === "FWD").slice(0, 2);

      const starters = [...gks, ...defs, ...mids, ...fwds];
      const result = validateFormation(starters);

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain("Must field exactly 1 Goalkeeper");
    });

    it("should reject an invalid lineup with fewer than 3 defenders", () => {
      const gks = market.filter((p) => p.position === "GK").slice(0, 1);
      const defs = market.filter((p) => p.position === "DEF").slice(0, 2);
      const mids = market.filter((p) => p.position === "MID").slice(0, 5);
      const fwds = market.filter((p) => p.position === "FWD").slice(0, 3);

      const starters = [...gks, ...defs, ...mids, ...fwds];
      const result = validateFormation(starters);

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain("Defenders must be between 3 and 5");
    });
  });

  describe("Club Limit Rule (Max 3 Players per Club)", () => {
    it("should confirm compliance for squad selections under the 3-player-per-club rule", () => {
      const dummySquad: FantasyPlayer[] = [
        { ...market[0], clubName: "Samba" },
        { ...market[1], clubName: "Samba" },
        { ...market[2], clubName: "Samba" },
      ];
      const compliance = checkClubLimit(dummySquad, 3);
      expect(compliance.isCompliant).toBe(true);
      expect(compliance.violatedClubs.length).toBe(0);
    });

    it("should confirm compliance for starters under the 3-player-per-club rule", () => {
      const squad = getDefaultFantasySquad(market, 3);
      const starters = squad.filter((p) => p.isStarter);
      const compliance = checkClubLimit(starters, 3);
      expect(compliance.isCompliant).toBe(true);
      expect(compliance.violatedClubs.length).toBe(0);
    });

    it("should flag violation when a club has more than 3 players (4 players)", () => {
      const dummySquad: FantasyPlayer[] = [
        { ...market[0], clubName: "Samba" },
        { ...market[1], clubName: "Samba" },
        { ...market[2], clubName: "Samba" },
        { ...market[3], clubName: "Samba" },
      ];
      const compliance = checkClubLimit(dummySquad, 3);
      expect(compliance.isCompliant).toBe(false);
      expect(compliance.violatedClubs[0]).toContain("Samba (4/3)");
    });
  });

  describe("Scoring Matrix Calculations", () => {
    it("should calculate correct points for a Forward with 2 goals, 1 assist, 90 mins", () => {
      const fwd = market.find((p) => p.position === "FWD")!;
      const stats = {
        minutesPlayed: 90,
        goals: 2,
        assists: 1,
        cleanSheet: false,
        saves: 0,
        penaltySaves: 0,
        penaltyMisses: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        goalsConceded: 1,
      };

      // FWD: 2 mins pts + (2 * 4 pts goals) + (1 * 3 pts assist) = 2 + 8 + 3 = 13 pts
      const result = calculatePlayerFantasyPoints(fwd, stats, false, false);
      expect(result.total).toBe(13);
    });

    it("should apply 2x multiplier for Captain", () => {
      const fwd = market.find((p) => p.position === "FWD")!;
      const stats = {
        minutesPlayed: 90,
        goals: 1,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        penaltySaves: 0,
        penaltyMisses: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        goalsConceded: 0,
      };

      // 2 mins + 4 goal = 6 pts; with 2x captain multiplier = 12 pts
      const normalResult = calculatePlayerFantasyPoints(fwd, stats, false, false);
      const captainResult = calculatePlayerFantasyPoints(fwd, stats, true, false);

      expect(normalResult.total).toBe(6);
      expect(captainResult.total).toBe(12);
    });

    it("should apply 3x multiplier when Triple Captain chip is active", () => {
      const mid = market.find((p) => p.position === "MID")!;
      const stats = {
        minutesPlayed: 75,
        goals: 1, // Midfielder goal = +5
        assists: 1, // Assist = +3
        cleanSheet: true, // Mid clean sheet = +1
        saves: 0,
        penaltySaves: 0,
        penaltyMisses: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        goalsConceded: 0,
      };

      // Base: 2 (mins) + 5 (goal) + 3 (assist) + 1 (CS) = 11 pts
      // Triple captain: 11 * 3 = 33 pts
      const result = calculatePlayerFantasyPoints(mid, stats, true, true);
      expect(result.total).toBe(33);
    });

    it("should calculate deductions for red cards and goals conceded for defenders", () => {
      const def = market.find((p) => p.position === "DEF")!;
      const stats = {
        minutesPlayed: 70, // +2
        goals: 0,
        assists: 0,
        cleanSheet: false,
        saves: 0,
        penaltySaves: 0,
        penaltyMisses: 0,
        yellowCards: 1, // -1
        redCards: 1, // -3
        ownGoals: 1, // -2
        goalsConceded: 4, // 4/2 = -2
      };

      // +2 - 1 - 3 - 2 - 2 = -6 pts
      const result = calculatePlayerFantasyPoints(def, stats, false, false);
      expect(result.total).toBe(-6);
    });
  });

  describe("Default Squad Generation", () => {
    it("should generate a complete 15-player squad within £100m budget", () => {
      const squad = getDefaultFantasySquad(market);
      expect(squad.length).toBe(15);

      const starters = squad.filter((p) => p.isStarter);
      const bench = squad.filter((p) => !p.isStarter);

      expect(starters.length).toBe(11);
      expect(bench.length).toBe(4);

      const totalCost = squad.reduce((sum, p) => sum + p.price, 0);
      expect(totalCost).toBeLessThanOrEqual(100.0);

      // Verify captain and vice captain are assigned
      const captain = squad.find((p) => p.isCaptain);
      const viceCaptain = squad.find((p) => p.isViceCaptain);

      expect(captain).toBeDefined();
      expect(viceCaptain).toBeDefined();
    });
  });

  describe("Chips & Competitions Constants", () => {
    it("should supply all 4 official chips: Wildcard, Triple Captain, Bench Boost, Free Hit", () => {
      expect(DEFAULT_CHIPS.wildcard).toBeDefined();
      expect(DEFAULT_CHIPS.triple_captain).toBeDefined();
      expect(DEFAULT_CHIPS.bench_boost).toBeDefined();
      expect(DEFAULT_CHIPS.free_hit).toBeDefined();
    });

    it("should supply initial global league leaderboard entries", () => {
      expect(DEFAULT_PUBLIC_LEAGUE_ENTRIES.entries.length).toBeGreaterThan(0);
      expect(DEFAULT_PUBLIC_LEAGUE_ENTRIES.entries[0].rank).toBe(1);
    });
  });

  describe("Match Event Points Calculation Service", () => {
    const fwdPlayer: FantasyPlayer = {
      id: 101,
      name: "Elvis Kingoo",
      position: "FWD",
      clubId: 6,
      clubName: "Royal Rangers",
      price: 8.5,
      isStarter: true,
      isCaptain: false,
      isViceCaptain: false,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      totalPoints: 0,
      clubShortCode: "TEST",
      clubColor: "",
      jerseyNumber: 1,
      gameweekPoints: 0,
      saves: 0,
      yellowCards: 0,
      redCards: 0,
      form: 0,
      selectedPercent: 0,
    };

    const midPlayer: FantasyPlayer = {
      id: 102,
      name: "Jaycrack",
      position: "MID",
      clubId: 1,
      clubName: "Samba",
      price: 8.0,
      isStarter: true,
      isCaptain: false,
      isViceCaptain: false,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      totalPoints: 0,
      clubShortCode: "TEST",
      clubColor: "",
      jerseyNumber: 1,
      gameweekPoints: 0,
      saves: 0,
      yellowCards: 0,
      redCards: 0,
      form: 0,
      selectedPercent: 0,
    };

    const defPlayer: FantasyPlayer = {
      id: 103,
      name: "Haron",
      position: "DEF",
      clubId: 1,
      clubName: "Samba",
      price: 6.5,
      isStarter: true,
      isCaptain: false,
      isViceCaptain: false,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      totalPoints: 0,
      clubShortCode: "TEST",
      clubColor: "",
      jerseyNumber: 1,
      gameweekPoints: 0,
      saves: 0,
      yellowCards: 0,
      redCards: 0,
      form: 0,
      selectedPercent: 0,
    };

    const gkPlayer: FantasyPlayer = {
      id: 104,
      name: "Brian",
      position: "GK",
      clubId: 1,
      clubName: "Samba",
      price: 5.5,
      isStarter: true,
      isCaptain: false,
      isViceCaptain: false,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      totalPoints: 0,
      clubShortCode: "TEST",
      clubColor: "",
      jerseyNumber: 1,
      gameweekPoints: 0,
      saves: 0,
      yellowCards: 0,
      redCards: 0,
      form: 0,
      selectedPercent: 0,
    };

    it("should award +4 for Forward goal, +5 for Midfielder goal, +6 for Defender goal", () => {
      const matchContext: MatchContextData[] = [
        {
          matchId: 1,
          matchweek: 5,
          homeClubId: 1,
          awayClubId: 6,
          homeScore: 2,
          awayScore: 1,
          playerMinutesPlayed: {
            101: 90,
            102: 90,
            103: 90,
          },
        },
      ];

      const fwdEvents: MatchEventData[] = [
        { matchId: 1, minute: 34, type: "goal", playerId: 101 },
      ];
      const midEvents: MatchEventData[] = [
        { matchId: 1, minute: 52, type: "goal", playerId: 102 },
      ];
      const defEvents: MatchEventData[] = [
        { matchId: 1, minute: 88, type: "goal", playerId: 103 },
      ];

      const fwdResult = calculatePlayerPointsFromMatchEvents(fwdPlayer, fwdEvents, matchContext);
      const midResult = calculatePlayerPointsFromMatchEvents(midPlayer, midEvents, matchContext);
      const defResult = calculatePlayerPointsFromMatchEvents(defPlayer, defEvents, matchContext);

      // FWD: 2 pts (60+ mins) + 4 pts (goal) = 6 pts
      expect(fwdResult.goals).toBe(1);
      expect(fwdResult.points).toBe(6);

      // MID: 2 pts (60+ mins) + 5 pts (goal) = 7 pts
      expect(midResult.goals).toBe(1);
      expect(midResult.points).toBe(7);

      // DEF: 2 pts (60+ mins) + 6 pts (goal) = 8 pts
      expect(defResult.goals).toBe(1);
      expect(defResult.points).toBe(8);
    });

    it("should award +3 for Assists", () => {
      const matchContext: MatchContextData[] = [
        {
          matchId: 1,
          matchweek: 5,
          homeClubId: 1,
          awayClubId: 6,
          homeScore: 1,
          awayScore: 0,
          playerMinutesPlayed: { 102: 90 },
        },
      ];
      const events: MatchEventData[] = [
        { matchId: 1, minute: 45, type: "assist", playerId: 102 },
      ];

      const result = calculatePlayerPointsFromMatchEvents(midPlayer, events, matchContext);
      // MID: 2 (60+ mins) + 3 (assist) + 1 (Clean sheet since Samba conceded 0) = 6 pts
      expect(result.assists).toBe(1);
      expect(result.points).toBe(6);
    });

    it("should award Clean Sheet points (+4 for GK/DEF, +1 for MID) when 0 goals conceded and >=60 mins", () => {
      const matchContext: MatchContextData[] = [
        {
          matchId: 1,
          matchweek: 5,
          homeClubId: 1,
          awayClubId: 6,
          homeScore: 2,
          awayScore: 0, // Clean sheet for club 1 (Samba)
          playerMinutesPlayed: {
            104: 90, // GK
            103: 75, // DEF
            102: 90, // MID
          },
        },
      ];

      const gkResult = calculatePlayerPointsFromMatchEvents(gkPlayer, [], matchContext);
      const defResult = calculatePlayerPointsFromMatchEvents(defPlayer, [], matchContext);
      const midResult = calculatePlayerPointsFromMatchEvents(midPlayer, [], matchContext);

      // GK: 2 (mins) + 4 (CS) = 6 pts
      expect(gkResult.cleanSheet).toBe(true);
      expect(gkResult.points).toBe(6);

      // DEF: 2 (mins) + 4 (CS) = 6 pts
      expect(defResult.cleanSheet).toBe(true);
      expect(defResult.points).toBe(6);

      // MID: 2 (mins) + 1 (CS) = 3 pts
      expect(midResult.cleanSheet).toBe(true);
      expect(midResult.points).toBe(3);
    });

    it("should apply deductions: -1 for yellow card, -3 for red card", () => {
      const matchContext: MatchContextData[] = [
        {
          matchId: 1,
          matchweek: 5,
          homeClubId: 1,
          awayClubId: 6,
          homeScore: 1,
          awayScore: 1,
          playerMinutesPlayed: { 103: 85 },
        },
      ];

      const events: MatchEventData[] = [
        { matchId: 1, minute: 25, type: "yellow_card", playerId: 103 },
        { matchId: 1, minute: 70, type: "red_card", playerId: 103 },
      ];

      const result = calculatePlayerPointsFromMatchEvents(defPlayer, events, matchContext);
      // DEF: 2 (mins) - 1 (yellow) - 3 (red) = -2 pts
      expect(result.yellowCards).toBe(1);
      expect(result.redCards).toBe(1);
      expect(result.points).toBe(-2);
    });

    it("should handle GK saves (+1 per 3 saves) and penalty saves (+5)", () => {
      const matchContext: MatchContextData[] = [
        {
          matchId: 1,
          matchweek: 5,
          homeClubId: 1,
          awayClubId: 6,
          homeScore: 0,
          awayScore: 1,
          playerMinutesPlayed: { 104: 90 },
        },
      ];

      const events: MatchEventData[] = [
        { matchId: 1, minute: 15, type: "save", playerId: 104 },
        { matchId: 1, minute: 30, type: "save", playerId: 104 },
        { matchId: 1, minute: 44, type: "save", playerId: 104 },
        { matchId: 1, minute: 60, type: "save", playerId: 104 },
        { matchId: 1, minute: 75, type: "save", playerId: 104 },
        { matchId: 1, minute: 88, type: "save", playerId: 104 },
        { matchId: 1, minute: 50, type: "penalty_save", playerId: 104 },
      ];

      const result = calculatePlayerPointsFromMatchEvents(gkPlayer, events, matchContext);
      // GK: 2 (mins) + 2 (6 saves = 6/3 = 2 pts) + 5 (penalty save) = 9 pts
      expect(result.saves).toBe(6);
      expect(result.penaltySaves).toBe(1);
      expect(result.points).toBe(9);
    });

    it("should double captain points (2x) and triple points on Triple Captain chip (3x)", () => {
      const matchContext: MatchContextData[] = [
        {
          matchId: 1,
          matchweek: 5,
          homeClubId: 6,
          awayClubId: 1,
          homeScore: 1,
          awayScore: 1,
          playerMinutesPlayed: { 101: 90 },
        },
      ];

      const events: MatchEventData[] = [
        { matchId: 1, minute: 40, type: "goal", playerId: 101 },
      ];

      // Base: 2 (mins) + 4 (FWD goal) = 6 pts
      const normalResult = calculatePlayerPointsFromMatchEvents(fwdPlayer, events, matchContext, false, false);
      const captainResult = calculatePlayerPointsFromMatchEvents(fwdPlayer, events, matchContext, true, false);
      const tripleCaptainResult = calculatePlayerPointsFromMatchEvents(fwdPlayer, events, matchContext, true, true);

      expect(normalResult.points).toBe(6);
      expect(captainResult.points).toBe(12);
      expect(tripleCaptainResult.points).toBe(18);
    });

    it("should calculate entire squad points including bench substitution and transfer deductions", () => {
      const squad = getDefaultFantasySquad(market);
      const captain = squad.find((p) => p.isCaptain)!;
      const viceCaptain = squad.find((p) => p.isViceCaptain)!;

      // Mock match context where Captain played 0 mins, Vice-captain played 90 mins
      const matchContext: MatchContextData[] = [
        {
          matchId: 1,
          matchweek: 5,
          homeClubId: captain.clubId,
          awayClubId: 99,
          homeScore: 1,
          awayScore: 0,
          playerMinutesPlayed: {
            [captain.id]: 0, // Captain benched/absent
            [viceCaptain.id]: 90, // VC inherits 2x multiplier
          },
        },
      ];

      const squadResult = calculateSquadPointsFromMatchEvents(
        squad,
        [],
        matchContext,
        null,
        4 // 1 extra transfer = -4 pts deduction
      );

      expect(squadResult.transferPenaltyDeduction).toBe(4);
      expect(squadResult.netGameweekScore).toBe(squadResult.totalSquadPoints - 4);
      // Vice-captain should inherit captaincy (2x)
      const vcCalc = squadResult.playerCalculations[viceCaptain.id];
      expect(vcCalc.isCaptain).toBe(true);
    });

    it("should include bench points when Bench Boost chip is active", () => {
      const squad = getDefaultFantasySquad(market);
      const squadResult = calculateSquadPointsFromMatchEvents(
        squad,
        [],
        [],
        "bench_boost",
        0
      );

      expect(squadResult.activeChip).toBe("bench_boost");
      expect(squadResult.totalSquadPoints).toBe(
        squadResult.startingPoints + squadResult.benchPoints
      );
    });
  });

  describe("Club Rosters Integrity (Samba vs Royal Rangers Verification)", () => {
    it("should correctly place official Samba players in Samba and not in Royal Rangers", () => {
      const samba = OFFICIAL_CLUBS_DATA.find((c) => c.name === "Samba");
      expect(samba).toBeDefined();

      const sambaPlayerNames = samba!.squad.map((p) => p.name);
      expect(sambaPlayerNames).toContain("Brian");
      expect(sambaPlayerNames).toContain("Haron");
      expect(sambaPlayerNames).toContain("Jaycrack");
      expect(sambaPlayerNames).toContain("Wokabi");
      expect(sambaPlayerNames).toContain("Edwin");

      // Ensure Samba does NOT have Royal Rangers players
      expect(sambaPlayerNames).not.toContain("Levis Wanyama");
      expect(sambaPlayerNames).not.toContain("Tonny Odundo");
      expect(sambaPlayerNames).not.toContain("Elvis Kingoo");
    });

    it("should correctly place official Royal Rangers players in Royal Rangers and not in Samba", () => {
      const rangers = OFFICIAL_CLUBS_DATA.find((c) => c.name === "Royal Rangers");
      expect(rangers).toBeDefined();

      const rangersPlayerNames = rangers!.squad.map((p) => p.name);
      expect(rangersPlayerNames).toContain("Levis Wanyama");
      expect(rangersPlayerNames).toContain("Tonny Odundo");
      expect(rangersPlayerNames).toContain("Chris Koome");
      expect(rangersPlayerNames).toContain("Elvis Kingoo");
      expect(rangersPlayerNames).toContain("Gabriel Ekitui");

      // Ensure Royal Rangers does NOT have Samba players
      expect(rangersPlayerNames).not.toContain("Haron");
      expect(rangersPlayerNames).not.toContain("Jaycrack");
      expect(rangersPlayerNames).not.toContain("Wokabi");
    });
  });

  describe("Matchweek Leaderboards & Cumulative Season Sum", () => {
    it("should rank managers strictly by points scored in a selected matchweek", () => {
      const gw5Leaderboard = getGameweekLeaderboard(DEFAULT_PUBLIC_LEAGUE_ENTRIES.entries, 5);
      expect(gw5Leaderboard.length).toBe(DEFAULT_PUBLIC_LEAGUE_ENTRIES.entries.length);

      // Verify rank 1 has highest GW 5 score
      expect(gw5Leaderboard[0].rank).toBe(1);
      for (let i = 0; i < gw5Leaderboard.length - 1; i++) {
        expect(gw5Leaderboard[i].gameweekPoints).toBeGreaterThanOrEqual(
          gw5Leaderboard[i + 1].gameweekPoints
        );
      }
    });

    it("should calculate overall leaderboard summing all matchweeks played", () => {
      const overallLeaderboard = getOverallSeasonLeaderboard(DEFAULT_PUBLIC_LEAGUE_ENTRIES.entries, 5);
      expect(overallLeaderboard.length).toBe(DEFAULT_PUBLIC_LEAGUE_ENTRIES.entries.length);

      // Verify entries are ranked by total sum
      expect(overallLeaderboard[0].rank).toBe(1);
      for (let i = 0; i < overallLeaderboard.length - 1; i++) {
        expect(overallLeaderboard[i].totalPoints).toBeGreaterThanOrEqual(
          overallLeaderboard[i + 1].totalPoints
        );
      }

      // Check sum of weeks 1 to 5 matches totalPoints
      overallLeaderboard.forEach((entry) => {
        if (entry.gameweekScores) {
          const expectedSum = Object.values(entry.gameweekScores).reduce((a, b) => a + b, 0);
          expect(entry.totalPoints).toBe(expectedSum);
        }
      });
    });
  });
});

