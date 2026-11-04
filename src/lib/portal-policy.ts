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

export type StoreClass = "managed" | "community" | "private" | "device";
const skipStorePrefixes = [
  "mpesa_pes_auth_user", "mpesa_pes_super_admin", "mpesa_pes_auth_role", "mpesa_admin_active_section",
  "mpesa_board_sub_tab", "mpesa_shared_revision", "mpesa_sync_audit", "mpesa_audio_vault",
];
const privateStorePrefixes = [
  "mpesa_pes_registered_board_members", "mpesa_board_access_locks", "mpesa_pes_registered_school_emails",
  "mpesa_pes_pending_verifications", "mpesa_pes_voted_emails", "mpesa_pes_inquiries",
  "mpesa_pes_club_applications", "mpesa_pes_tryout_requests", "mpesa_pes_email_dispatches", "mpesa_pes_finances",
];
const communityStorePrefixes = ["mpesa_pes_comments", "mpesa_pes_mvp_votes"];
const deviceStorePrefixes = ["mpesa_fantasy_squad_gw_", "mpesa_match_report_form_"];

/** Decides who may read/write a saved app record; null means it never leaves the device. */
export function classifyStoreKey(key: string): StoreClass | null {
  if (!/^mpesa_[A-Za-z0-9_-]+$/.test(key)) return null;
  const has = (list: string[]) => list.some((p) => key.startsWith(p));
  if (has(skipStorePrefixes)) return null;
  if (has(privateStorePrefixes)) return "private";
  if (has(communityStorePrefixes)) return "community";
  if (has(deviceStorePrefixes)) return "device";
  return "managed";
}
