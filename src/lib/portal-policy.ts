export type AccessClass = "SUPER_ADMIN" | "BOARD_MEMBER" | "VIEWER";
export const boardRoles = [
  "PRESIDENT",
  "DEPUTY_PRESIDENT",
  "REGULATIONS_MANAGER",
  "MATCH_OFFICIATING_MANAGER",
  "RECORDS_MANAGER",
  "TECH_MANAGER",
  "ASST_TECH_MANAGER",
] as const;
export const writableFields: Record<string, string[]> = {
  PRESIDENT: ["newsArticles", "leagueRules"],
  DEPUTY_PRESIDENT: ["newsArticles"],
  REGULATIONS_MANAGER: ["teams", "leagueRules"],
  MATCH_OFFICIATING_MANAGER: ["matches", "injuryReports"],
  RECORDS_MANAGER: ["matches", "playerStatsList"],
  TECH_MANAGER: ["matches", "newsArticles", "highlightVideos", "mediaGallery"],
  ASST_TECH_MANAGER: ["matches", "newsArticles", "highlightVideos", "mediaGallery"],
};
export const stateFields = [
  "teams",
  "matches",
  "playerStatsList",
  "newsArticles",
  "highlightVideos",
  "injuryReports",
  "leagueRules",
  "mediaGallery",
];
export function mayManageCodes(role: string | null) {
  return role === "SUPER_ADMIN";
}
export function mayDeleteTeam(role: string | null) {
  return role === "SUPER_ADMIN";
}
export function allowedFields(role: string | null) {
  return role === "SUPER_ADMIN" ? stateFields : writableFields[role || ""] || [];
}

interface TeamRecord {
  id: number;
  [key: string]: unknown;
}

interface MatchRecord {
  homeId: number;
  awayId: number;
  [key: string]: unknown;
}

interface StatRecord {
  teamId?: number;
  [key: string]: unknown;
}

interface InjuryRecord {
  teamId?: number;
  [key: string]: unknown;
}

export function removeDeletedTeams(data: Record<string, unknown>, deleted: number[]) {
  const blocked = new Set(deleted);
  const rawTeams = Array.isArray(data["teams"]) ? (data["teams"] as TeamRecord[]) : [];
  const teams = rawTeams.filter((t) => typeof t?.id === "number" && !blocked.has(t.id));
  const present = new Set(teams.map((t) => t.id));

  const rawMatches = Array.isArray(data["matches"]) ? (data["matches"] as MatchRecord[]) : [];
  const rawStats = Array.isArray(data["playerStatsList"])
    ? (data["playerStatsList"] as StatRecord[])
    : [];
  const rawInjuries = Array.isArray(data["injuryReports"])
    ? (data["injuryReports"] as InjuryRecord[])
    : [];

  return {
    ...data,
    teams,
    matches: rawMatches.filter((m) => present.has(m.homeId) && present.has(m.awayId)),
    playerStatsList: rawStats.filter((p) => p.teamId !== undefined && present.has(p.teamId)),
    injuryReports: rawInjuries.filter((p) => !p.teamId || present.has(p.teamId)),
  };
}
