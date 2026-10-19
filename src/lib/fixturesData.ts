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
  try {
    const stored = JSON.parse(localStorage.getItem("mpesa_pes_deleted_teams_v6") || "[]");
    if (Array.isArray(stored)) {
      if (id && stored.includes(id)) return true;
      if (name && stored.some((s: string | number) => typeof s === "string" && s.toLowerCase() === name.toLowerCase())) {
        return true;
      }
    }
  } catch {
    // Ignore
  }
  return false;
}

export function sanitizeTeamsList(teams: Team[]): Team[] {
  if (!Array.isArray(teams)) return OFFICIAL_ACTIVE_TEAMS;
  const filtered = teams.filter((t) => !isTeamDeleted(t.id, t.name));
  return filtered.length > 0 ? filtered : OFFICIAL_ACTIVE_TEAMS;
}

export const DEFAULT_FIXTURES: MatchFixture[] = [
  {
    id: 1,
    matchweek: 1,
    time: "2:00 PM",
    date: "Sunday, Oct 25, 2026",
    venue: "Samba Arena (School Lower Pitch)",
    homeId: 1,
    awayId: 7,
    homeScore: 3,
    awayScore: 2,
    status: "FINISHED",
    scorers: "Kevin Omondi 14', 68', Levis Wanyama 44' | Elly Adams Otieno 32', Raila Junior 79'",
    referee: "Center Ref: Ian Muli (FIFA Badge)",
    goalEvents: [
      { id: 101, team: "HOME", scorerName: "Kevin Omondi", minute: "14'" },
      { id: 102, team: "AWAY", scorerName: "Elly Adams Otieno", minute: "32'" },
      { id: 103, team: "HOME", scorerName: "Levis Wanyama", minute: "44'" },
      { id: 104, team: "HOME", scorerName: "Kevin Omondi", minute: "68'" },
      { id: 105, team: "AWAY", scorerName: "Raila Junior", minute: "79'" },
    ],
    manOfTheMatch: {
      playerName: "Kevin Omondi",
      teamName: "Samba",
      rating: 9.6,
      goals: 2,
      assists: 1,
      shotsOnTarget: 4,
      keyPasses: 3,
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      highlightSummary:
        "Commanding masterclass: Scored a breathtaking brace (14', 68') and delivered the precision assist for the 44' winner.",
    },
    metrics: {
      homePossession: 56,
      awayPossession: 44,
      homeShotsOnTarget: 7,
      awayShotsOnTarget: 5,
      goals: [
        { player: "Kevin Omondi", team: "Samba", count: 2 },
        { player: "Levis Wanyama", team: "Samba", count: 1 },
        { player: "Elly Adams Otieno", team: "Young Stars City", count: 1 },
        { player: "Raila Junior", team: "Young Stars City", count: 1 },
      ],
      assists: [
        { player: "Kevin Omondi", team: "Samba", count: 1 },
        { player: "Tonny Odundo", team: "Samba", count: 1 },
        { player: "Gabriel Maluki", team: "Young Stars City", count: 1 },
      ],
    },
  },
  {
    id: 2,
    matchweek: 1,
    time: "4:00 PM",
    date: "Sunday, Oct 25, 2026",
    venue: "Ranger Fortress Field (Academy East)",
    homeId: 6,
    awayId: 8,
    homeScore: 2,
    awayScore: 1,
    status: "FINISHED",
    scorers: "Wokabi 23', Carson 76' | Hamard Adan 41'",
    referee: "Center Ref: Mercy Chebet",
    goalEvents: [
      { id: 106, team: "HOME", scorerName: "Wokabi", minute: "23'" },
      { id: 107, team: "AWAY", scorerName: "Hamard Adan", minute: "41'" },
      { id: 108, team: "HOME", scorerName: "Carson", minute: "76'" },
    ],
    manOfTheMatch: {
      playerName: "Jaycrack",
      teamName: "Royal Rangers",
      rating: 9.3,
      goals: 0,
      assists: 2,
      shotsOnTarget: 2,
      keyPasses: 5,
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      highlightSummary:
        "Midfield commander: Orchestrated the engine room, supplied two pinpoint assists, and shielded the back four.",
    },
    metrics: {
      homePossession: 53,
      awayPossession: 47,
      homeShotsOnTarget: 6,
      awayShotsOnTarget: 4,
      goals: [
        { player: "Wokabi", team: "Royal Rangers", count: 1 },
        { player: "Carson", team: "Royal Rangers", count: 1 },
        { player: "Hamard Adan", team: "Mzinga", count: 1 },
      ],
      assists: [
        { player: "Jaycrack", team: "Royal Rangers", count: 2 },
        { player: "Jeff Njoroge", team: "Mzinga", count: 1 },
      ],
    },
  },
  {
    id: 3,
    matchweek: 2,
    time: "2:00 PM",
    date: "Sunday, Nov 1, 2026",
    venue: "The Hive Stadium (West Campus Ground)",
    homeId: 8,
    awayId: 1,
    homeScore: 1,
    awayScore: 2,
    status: "FINISHED",
    scorers: "Brandon Wandera 55' | Kevin Omondi 19', Tonny Odundo 83'",
    referee: "Center Ref: Ian Muli (FIFA Badge)",
    goalEvents: [
      { id: 109, team: "AWAY", scorerName: "Kevin Omondi", minute: "19'" },
      { id: 110, team: "HOME", scorerName: "Brandon Wandera", minute: "55'" },
      { id: 111, team: "AWAY", scorerName: "Tonny Odundo", minute: "83'" },
    ],
    manOfTheMatch: {
      playerName: "Tonny Odundo",
      teamName: "Samba",
      rating: 9.2,
      goals: 1,
      assists: 1,
      shotsOnTarget: 3,
      keyPasses: 4,
      photoUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      highlightSummary:
        "Decisive winner: Placed a sensational 83' strike in the top corner to seal all three points on the road.",
    },
    metrics: {
      homePossession: 46,
      awayPossession: 54,
      homeShotsOnTarget: 4,
      awayShotsOnTarget: 7,
      goals: [
        { player: "Kevin Omondi", team: "Samba", count: 1 },
        { player: "Tonny Odundo", team: "Samba", count: 1 },
        { player: "Brandon Wandera", team: "Mzinga", count: 1 },
      ],
      assists: [
        { player: "Levis Wanyama", team: "Samba", count: 1 },
        { player: "Jeff Njoroge", team: "Mzinga", count: 1 },
      ],
    },
  },
  {
    id: 4,
    matchweek: 2,
    time: "4:00 PM",
    date: "Sunday, Nov 1, 2026",
    venue: "Young Stars City Arena (North Pavilion)",
    homeId: 7,
    awayId: 6,
    homeScore: 2,
    awayScore: 2,
    status: "FINISHED",
    scorers: "Elly Adams Otieno 34', Moffat Osoro 61' | Edwin 49', Haron 88'",
    referee: "Center Ref: David Otieno",
    goalEvents: [
      { id: 112, team: "HOME", scorerName: "Elly Adams Otieno", minute: "34'" },
      { id: 113, team: "AWAY", scorerName: "Edwin", minute: "49'" },
      { id: 114, team: "HOME", scorerName: "Moffat Osoro", minute: "61'" },
      { id: 115, team: "AWAY", scorerName: "Haron", minute: "88'" },
    ],
    manOfTheMatch: {
      playerName: "Elly Adams Otieno",
      teamName: "Young Stars City",
      rating: 9.4,
      goals: 1,
      assists: 1,
      shotsOnTarget: 4,
      keyPasses: 3,
      photoUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      highlightSummary:
        "Electric captain's performance: Drilled home an electric opener and set up the second goal in a dramatic 4-goal thriller.",
    },
    metrics: {
      homePossession: 51,
      awayPossession: 49,
      homeShotsOnTarget: 6,
      awayShotsOnTarget: 6,
      goals: [
        { player: "Elly Adams Otieno", team: "Young Stars City", count: 1 },
        { player: "Moffat Osoro", team: "Young Stars City", count: 1 },
        { player: "Edwin", team: "Royal Rangers", count: 1 },
        { player: "Haron", team: "Royal Rangers", count: 1 },
      ],
      assists: [
        { player: "Gabriel Maluki", team: "Young Stars City", count: 1 },
        { player: "Jaycrack", team: "Royal Rangers", count: 1 },
      ],
    },
  },
  {
    id: 5,
    matchweek: 3,
    time: "2:00 PM",
    date: "Sunday, Nov 8, 2026",
    venue: "Ranger Fortress Field (Academy East)",
    homeId: 6,
    awayId: 1,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: Ian Muli (FIFA Badge)",
    goalEvents: [],
  },
  {
    id: 6,
    matchweek: 3,
    time: "4:00 PM",
    date: "Sunday, Nov 8, 2026",
    venue: "Young Stars City Arena (North Pavilion)",
    homeId: 7,
    awayId: 8,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: Mercy Chebet",
    goalEvents: [],
  },
  {
    id: 7,
    matchweek: 4,
    time: "2:00 PM",
    date: "Sunday, Nov 15, 2026",
    venue: "Young Stars City Arena (North Pavilion)",
    homeId: 7,
    awayId: 1,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: David Otieno",
    goalEvents: [],
  },
  {
    id: 8,
    matchweek: 4,
    time: "4:00 PM",
    date: "Sunday, Nov 15, 2026",
    venue: "The Hive Stadium (West Campus Ground)",
    homeId: 8,
    awayId: 6,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: Ian Muli",
    goalEvents: [],
  },
  {
    id: 9,
    matchweek: 5,
    time: "2:00 PM",
    date: "Sunday, Nov 22, 2026",
    venue: "Samba Arena (School Lower Pitch)",
    homeId: 1,
    awayId: 8,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: Ian Muli",
    goalEvents: [],
  },
  {
    id: 10,
    matchweek: 5,
    time: "4:00 PM",
    date: "Sunday, Nov 22, 2026",
    venue: "Ranger Fortress Field (Academy East)",
    homeId: 6,
    awayId: 7,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: Mercy Chebet",
    goalEvents: [],
  },
];
