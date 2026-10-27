import type { MatchFixture, Team } from "../components/Fixtures";

// The 4 official clubs of the M-Pesa Sunday League
export const OFFICIAL_ACTIVE_TEAMS: Team[] = [
  {
    id: 6,
    name: "Royal Rangers",
    shortCode: "RR",
    color: "#3b82f6",
    homePitch: "Ranger Fortress Field (Academy East)",
  },
  {
    id: 7,
    name: "Young Stars City",
    shortCode: "YSC",
    color: "#f97316",
    homePitch: "Young Stars City Arena (North Pavilion)",
  },
  {
    id: 1,
    name: "Samba",
    shortCode: "SAM",
    color: "#00ff85",
    homePitch: "Samba Arena (School Lower Pitch)",
  },
  {
    id: 8,
    name: "Mzinga",
    shortCode: "MZB",
    color: "#eab308",
    homePitch: "The Hive Stadium (West Campus Ground)",
  },
];

export const DEFAULT_TEAMS: Team[] = OFFICIAL_ACTIVE_TEAMS;

// Permanently deleted legacy teams (Grade 10 A, Grade 10 B, DP 2 A, DP 2 B)
export const DELETED_LEGACY_TEAM_IDS = [2, 3, 4, 5];
export const DELETED_LEGACY_TEAM_NAMES = [
  "grade 10 a",
  "grade 10 b",
  "dp 2 a",
  "dp 2 b",
  "grade 10a",
  "grade 10b",
  "dp2a",
  "dp2b",
];

export function isTeamDeleted(id: number | undefined, name?: string): boolean {
  if (id && DELETED_LEGACY_TEAM_IDS.includes(id)) return true;
  if (name && DELETED_LEGACY_TEAM_NAMES.includes(name.trim().toLowerCase())) return true;
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(localStorage.getItem("mpesa_pes_deleted_teams_v6") || "[]");
      if (Array.isArray(stored)) {
        if (id && stored.includes(id)) return true;
        if (
          name &&
          stored.some(
            (s: string | number) => typeof s === "string" && s.toLowerCase() === name.toLowerCase(),
          )
        ) {
          return true;
        }
      }
    } catch {
      // Ignore
    }
  }
  return false;
}

export function sanitizeTeamsList(teams: Team[]): Team[] {
  if (!Array.isArray(teams)) return OFFICIAL_ACTIVE_TEAMS;
  const filtered = teams.filter((t) => !isTeamDeleted(t.id, t.name));
  return filtered.length > 0 ? filtered : OFFICIAL_ACTIVE_TEAMS;
}

export const DEFAULT_FIXTURES: MatchFixture[] = [];
