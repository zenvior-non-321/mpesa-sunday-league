/**
 * Inbuilt Real-Time Database Engine & Synchronizer
 * Connects Teams, Squad Players, Fixtures, Match Reports, and Standings
 * Enforces permanent deletions ("once deleted, gone forever") and automatic
 * real-time recalculation of standings from verified match reports.
 */

import { OFFICIAL_CLUBS_DATA, getAllRegisteredPlayers, type SquadMember } from "./teamSquadsData";
import { DEFAULT_FIXTURES, isTeamDeleted, markTeamAsDeleted } from "./fixturesData";
import { DEFAULT_STANDINGS, type TeamStanding } from "../components/LeagueStandings";

export interface DbTeam {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  homePitch: string;
  coachName?: string;
  assistantCoach?: string;
  captainName?: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  squadCount?: number;
  isDeleted?: boolean;
}

export interface DbPlayer {
  id: number;
  name: string;
  teamId: number;
  teamName: string;
  teamColor: string;
  teamCode: string;
  number: number;
  position: "GK" | "DEF" | "MID" | "FWD";
  role?: string;
  foot?: "Right" | "Left" | "Both";
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  isDeleted?: boolean;
}

export interface DbFixture {
  id: number;
  matchweek: number;
  homeId: number;
  awayId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "POSTPONED" | "CANCELLED" | "FINISHED" | "UPCOMING";
  referee?: string;
  scorersSummary?: string;
}

export interface DbMatchReport {
  id: string;
  matchId: number;
  matchweek: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  refereeName: string;
  homeCoachName?: string;
  awayCoachName?: string;
  homeCaptainName?: string;
  awayCaptainName?: string;
  hasRefereeSig: boolean;
  hasHomeCoachSig: boolean;
  hasAwayCoachSig: boolean;
  hasHomeCaptainSig: boolean;
  hasAwayCaptainSig: boolean;
  submittedAt: string;
  submittedBy?: string;
  scorers: Array<{ playerName: string; team: string; minute: number }>;
  assists: Array<{ playerName: string; team: string; minute: number }>;
}

const STORAGE_KEYS = {
  TEAMS: "mpesa_pes_teams_v6",
  STANDINGS: "mpesa_pes_standings_v6",
  PLAYERS: "mpesa_pes_players_v6",
  DELETED_PLAYERS: "mpesa_pes_deleted_players_v6",
  FIXTURES: "mpesa_pes_matches_v6",
  DELETED_FIXTURES: "mpesa_pes_deleted_fixtures_v6",
  REPORTS: "mpesa_pes_matchreports_v1",
  TABLE_CLEARED: "mpesa_table_cleared_v6",
};

/**
 * Dispatch real-time cross-tab & component update events
 */
export function broadcastDbChange(tableName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("mpesa_db_updated", { detail: { tableName } }));
  window.dispatchEvent(new CustomEvent("mpesa_standings_updated"));
  window.dispatchEvent(new CustomEvent("mpesa_matchsheet_updated"));
  window.dispatchEvent(new CustomEvent("mpesa_matchreport_saved"));
  window.dispatchEvent(new Event("storage"));
}

/**
 * Load all active teams from database
 */
export function getDbTeams(): DbTeam[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAMS);
    const tableCleared = localStorage.getItem(STORAGE_KEYS.TABLE_CLEARED) === "true";

    let teams: DbTeam[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        teams = parsed;
      }
    }

    if (teams.length === 0) {
      // Seed from authentic official clubs
      teams = OFFICIAL_CLUBS_DATA.map((c) => ({
        id: c.id,
        name: c.name,
        shortCode: c.shortCode,
        color: c.color,
        homePitch: c.homePitch,
        coachName: c.coachName,
        assistantCoach: c.assistantCoach,
        captainName: c.squad.find((s) => s.isCaptain)?.name || "Team Captain",
        mp: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0,
        squadCount: c.squad.length,
      }));
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(teams));
    }

    // Filter out permanently deleted clubs
    const active = teams.filter((t) => !isTeamDeleted(t.id, t.name));

    // If table was cleared to zero by admin, strictly enforce zero
    if (tableCleared) {
      return active.map((t) => ({
        ...t,
        mp: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0,
      }));
    }

    return active;
  } catch {
    return [];
  }
}

/**
 * Save updated teams to database
 */
export function saveDbTeams(teams: DbTeam[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(teams));
  broadcastDbChange("teams");
}

/**
 * Permanently delete a team ("once deleted, gone forever")
 */
export function permanentlyDeleteDbTeam(teamId: number, teamName: string) {
  markTeamAsDeleted(teamId, teamName);
  const current = getDbTeams().filter((t) => t.id !== teamId);
  saveDbTeams(current);
}

/**
 * Load all active players from database
 */
export function getDbPlayers(): DbPlayer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_PLAYERS);
    const deletedIds: number[] = deletedRaw ? JSON.parse(deletedRaw) : [];

    let players: DbPlayer[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        players = parsed;
      }
    }

    if (players.length === 0) {
      // Seed registered players from the 4 official clubs
      players = getAllRegisteredPlayers().map((p, pIdx) => ({
        id: p.id ?? p.teamId * 100 + (p.number || pIdx + 1),
        name: p.name,
        teamId: p.teamId,
        teamName: p.teamName,
        teamColor: p.teamColor,
        teamCode: p.teamCode,
        number: p.number,
        position: p.position,
        role: p.role,
        foot: p.foot,
        goals: 0,
        assists: 0,
        cleanSheets: p.position === "GK" ? 0 : 0,
        yellowCards: 0,
        redCards: 0,
      }));
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    }

    // Filter out deleted players
    return players.filter((p) => !deletedIds.includes(p.id));
  } catch {
    return [];
  }
}

/**
 * Save players list to database
 */
export function saveDbPlayers(players: DbPlayer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  broadcastDbChange("players");
}

/**
 * Permanently delete a player ("once deleted, gone forever")
 */
export function permanentlyDeleteDbPlayer(playerId: number) {
  if (typeof window === "undefined") return;
  try {
    const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_PLAYERS);
    const deletedIds: number[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedIds.includes(playerId)) {
      deletedIds.push(playerId);
      localStorage.setItem(STORAGE_KEYS.DELETED_PLAYERS, JSON.stringify(deletedIds));
    }

    const current = getDbPlayers().filter((p) => p.id !== playerId);
    saveDbPlayers(current);
  } catch {
    // Ignore
  }
}

/**
 * Load all active fixtures from database
 */
export function getDbFixtures(): DbFixture[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FIXTURES);
    const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_FIXTURES);
    const deletedIds: number[] = deletedRaw ? JSON.parse(deletedRaw) : [];

    let fixtures: DbFixture[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        fixtures = parsed.map((f) => ({
          id: f.id,
          matchweek: f.matchweek || 1,
          homeId: f.homeId,
          awayId: f.awayId,
          homeTeamName: f.homeTeamName || f.homeTeam?.name || "Home",
          awayTeamName: f.awayTeamName || f.awayTeam?.name || "Away",
          homeScore: f.homeScore,
          awayScore: f.awayScore,
          date: f.date || "Sunday, Nov 1, 2026",
          time: f.time || "3:00 PM",
          venue: f.venue || "M-Pesa Academy Main Arena",
          status: f.status || "SCHEDULED",
          referee: f.referee,
          scorersSummary: f.scorers || f.scorersSummary || "",
        }));
      }
    }

    if (fixtures.length === 0) {
      // Seed from DEFAULT_FIXTURES
      fixtures = DEFAULT_FIXTURES.map((f: any) => {
        const homeClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === f.homeId);
        const awayClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === f.awayId);
        return {
          id: f.id,
          matchweek: f.matchweek,
          homeId: f.homeId,
          awayId: f.awayId,
          homeTeamName: homeClub?.name || `Club #${f.homeId}`,
          awayTeamName: awayClub?.name || `Club #${f.awayId}`,
          homeScore: f.homeScore,
          awayScore: f.awayScore,
          date: f.date,
          time: f.time,
          venue: f.venue,
          status: f.status || "SCHEDULED",
          referee: f.referee,
          scorersSummary: f.scorers || "",
        };
      });
      localStorage.setItem(STORAGE_KEYS.FIXTURES, JSON.stringify(fixtures));
    }

    return fixtures.filter((f) => !deletedIds.includes(f.id));
  } catch {
    return [];
  }
}

/**
 * Save fixtures to database
 */
export function saveDbFixtures(fixtures: DbFixture[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.FIXTURES, JSON.stringify(fixtures));
  broadcastDbChange("fixtures");
}

/**
 * Permanently delete a fixture ("once deleted, gone forever")
 */
export function permanentlyDeleteDbFixture(fixtureId: number) {
  if (typeof window === "undefined") return;
  try {
    const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_FIXTURES);
    const deletedIds: number[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedIds.includes(fixtureId)) {
      deletedIds.push(fixtureId);
      localStorage.setItem(STORAGE_KEYS.DELETED_FIXTURES, JSON.stringify(deletedIds));
    }

    const current = getDbFixtures().filter((f) => f.id !== fixtureId);
    saveDbFixtures(current);
  } catch {
    // Ignore
  }
}

/**
 * Load all submitted match reports from database
 */
export function getDbMatchReports(): DbMatchReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Permanently delete a match report ("once deleted, gone forever")
 */
export function permanentlyDeleteDbMatchReport(reportId: string) {
  if (typeof window === "undefined") return;
  try {
    const reports = getDbMatchReports().filter((r) => r.id !== reportId);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    broadcastDbChange("match_reports");
    // Also recalculate standings to reflect deletion
    recalculateStandingsFromReports();
  } catch {
    // Ignore
  }
}

/**
 * Hard Reset Standings Table to Absolute Zero (0-0-0-0, 0 Pts)
 * Sets persistent flag so no stale cache can revive old points.
 */
export function purgeStandingsTableToZero() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TABLE_CLEARED, "true");
    const teams = getDbTeams().map((t) => ({
      ...t,
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
    }));

    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(teams));
    broadcastDbChange("standings");
  } catch {
    // Ignore
  }
}

/**
 * Recalculate Standings strictly based on submitted match reports and completed fixtures
 * No bonus points, no fair-play point padding: Standard FIFA (Win=3, Draw=1, Loss=0)
 */
export function recalculateStandingsFromReports() {
  if (typeof window === "undefined") return;
  try {
    const teams = getDbTeams();
    const reports = getDbMatchReports();
    const fixtures = getDbFixtures().filter((f) => f.status === "COMPLETED");

    // Initialize fresh zero record for each active club
    const statsMap: Record<
      number,
      { mp: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }
    > = {};

    teams.forEach((t) => {
      statsMap[t.id] = { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    });

    // 1. Process from submitted Match Reports
    const processedMatchIds = new Set<number>();
    reports.forEach((rep) => {
      processedMatchIds.add(rep.matchId);
      // Find matching teams
      const homeTeam = teams.find(
        (t) => t.name.toLowerCase() === rep.homeTeamName.toLowerCase() || t.id === rep.matchId,
      );
      const awayTeam = teams.find(
        (t) => t.name.toLowerCase() === rep.awayTeamName.toLowerCase(),
      );

      if (homeTeam && awayTeam && statsMap[homeTeam.id] && statsMap[awayTeam.id]) {
        const hId = homeTeam.id;
        const aId = awayTeam.id;
        const hs = Number(rep.homeScore) || 0;
        const as = Number(rep.awayScore) || 0;

        statsMap[hId].mp += 1;
        statsMap[aId].mp += 1;
        statsMap[hId].gf += hs;
        statsMap[hId].ga += as;
        statsMap[aId].gf += as;
        statsMap[aId].ga += hs;

        if (hs > as) {
          statsMap[hId].w += 1;
          statsMap[hId].pts += 3;
          statsMap[aId].l += 1;
        } else if (as > hs) {
          statsMap[aId].w += 1;
          statsMap[aId].pts += 3;
          statsMap[hId].l += 1;
        } else {
          statsMap[hId].d += 1;
          statsMap[hId].pts += 1;
          statsMap[aId].d += 1;
          statsMap[aId].pts += 1;
        }
      }
    });

    // 2. Also process completed fixtures not covered by reports
    fixtures.forEach((fix) => {
      if (!processedMatchIds.has(fix.id)) {
        if (
          typeof fix.homeScore === "number" &&
          typeof fix.awayScore === "number" &&
          statsMap[fix.homeId] &&
          statsMap[fix.awayId]
        ) {
          const hId = fix.homeId;
          const aId = fix.awayId;
          const hs = fix.homeScore;
          const as = fix.awayScore;

          statsMap[hId].mp += 1;
          statsMap[aId].mp += 1;
          statsMap[hId].gf += hs;
          statsMap[hId].ga += as;
          statsMap[aId].gf += as;
          statsMap[aId].ga += hs;

          if (hs > as) {
            statsMap[hId].w += 1;
            statsMap[hId].pts += 3;
            statsMap[aId].l += 1;
          } else if (as > hs) {
            statsMap[aId].w += 1;
            statsMap[aId].pts += 3;
            statsMap[hId].l += 1;
          } else {
            statsMap[hId].d += 1;
            statsMap[hId].pts += 1;
            statsMap[aId].d += 1;
            statsMap[aId].pts += 1;
          }
        }
      }
    });

    // Update teams with fresh calculated numbers
    const updated = teams.map((t) => {
      const s = statsMap[t.id] || { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
      return {
        ...t,
        mp: s.mp,
        w: s.w,
        d: s.d,
        l: s.l,
        gf: s.gf,
        ga: s.ga,
        gd: s.gf - s.ga,
        pts: s.pts,
      };
    });

    // Clear the reset flag since we now calculated from live verified reports
    localStorage.removeItem(STORAGE_KEYS.TABLE_CLEARED);
    saveDbTeams(updated);
  } catch {
    // Ignore
  }
}
