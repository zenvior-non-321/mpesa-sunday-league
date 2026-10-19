export type AccessClass = 'SUPER_ADMIN' | 'BOARD_MEMBER' | 'VIEWER';
export const boardRoles = ['PRESIDENT', 'DEPUTY_PRESIDENT', 'REGULATIONS_MANAGER', 'MATCH_OFFICIATING_MANAGER', 'RECORDS_MANAGER', 'TECH_MANAGER', 'ASST_TECH_MANAGER'] as const;
export const writableFields: Record<string, string[]> = {
  PRESIDENT: ['newsArticles', 'leagueRules'],
  DEPUTY_PRESIDENT: ['newsArticles'],
  REGULATIONS_MANAGER: ['teams', 'leagueRules'],
  MATCH_OFFICIATING_MANAGER: ['matches', 'injuryReports'],
  RECORDS_MANAGER: ['matches', 'playerStatsList'],
  TECH_MANAGER: ['matches', 'newsArticles', 'highlightVideos', 'mediaGallery'],
  ASST_TECH_MANAGER: ['matches', 'newsArticles', 'highlightVideos', 'mediaGallery'],
};
export const stateFields = ['teams', 'matches', 'playerStatsList', 'newsArticles', 'highlightVideos', 'injuryReports', 'leagueRules', 'mediaGallery'];
export function mayManageCodes(role: string | null) { return role === 'SUPER_ADMIN'; }
export function mayDeleteTeam(role: string | null) { return role === 'SUPER_ADMIN'; }
export function allowedFields(role: string | null) { return role === 'SUPER_ADMIN' ? stateFields : writableFields[role || ''] || []; }
export function removeDeletedTeams(data: Record<string, any>, deleted: number[]) {
  const blocked = new Set(deleted);
  const teams = (data['teams'] || []).filter((t: any) => !blocked.has(t.id));
  const present = new Set(teams.map((t: any) => t.id));
  return {
    ...data, teams,
    matches: (data['matches'] || []).filter((m: any) => present.has(m.homeId) && present.has(m.awayId)),
    playerStatsList: (data['playerStatsList'] || []).filter((p: any) => present.has(p.teamId)),
    injuryReports: (data['injuryReports'] || []).filter((p: any) => !p.teamId || present.has(p.teamId)),
  };
}