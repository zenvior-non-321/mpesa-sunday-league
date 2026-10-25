export type ActivityCategory =
  "MATCHDAY" | "TRAINING" | "HEARING" | "MEETING" | "CEREMONY" | "FRIENDLY";

export interface LeagueActivity {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: ActivityCategory;
  time: string;
  venue: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

const STORAGE_KEY = "mpesa_pes_calendar_activities_v1";

export const CATEGORY_CONFIG: Record<
  ActivityCategory,
  { label: string; badgeColor: string; iconText: string; border: string }
> = {
  MATCHDAY: {
    label: "Matchday",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
    iconText: "⚽",
    border: "border-emerald-500/40",
  },
  TRAINING: {
    label: "Training Session",
    badgeColor: "bg-cyan-500/20 text-[#00f0ff]",
    iconText: "🏃",
    border: "border-cyan-500/40",
  },
  HEARING: {
    label: "Council Hearing",
    badgeColor: "bg-purple-500/20 text-purple-300",
    iconText: "⚖️",
    border: "border-purple-500/40",
  },
  MEETING: {
    label: "Executive Briefing",
    badgeColor: "bg-blue-500/20 text-blue-300",
    iconText: "📋",
    border: "border-blue-500/40",
  },
  CEREMONY: {
    label: "Ceremony & Gala",
    badgeColor: "bg-amber-500/20 text-amber-300",
    iconText: "🏆",
    border: "border-amber-500/40",
  },
  FRIENDLY: {
    label: "Friendly Match",
    badgeColor: "bg-pink-500/20 text-pink-300",
    iconText: "🤝",
    border: "border-pink-500/40",
  },
};

export const INITIAL_LEAGUE_ACTIVITIES: LeagueActivity[] = [
  {
    id: "act-1",
    date: "2026-10-24",
    title: "Opening Weekend Captains & Referees Technical Briefing",
    category: "MEETING",
    time: "10:00 - 11:30 AM",
    venue: "Academy Assembly Auditorium",
    description:
      "Rules harmonisation, fair play charter signing, and officiating guidelines for 2026/27.",
    createdBy: "Super Admin",
    createdAt: "2026-10-20",
  },
  {
    id: "act-2",
    date: "2026-10-25",
    title: "M-Pesa Sunday League Kickoff Matchday 1",
    category: "MATCHDAY",
    time: "14:00 - 18:00",
    venue: "Main Stadium Ground & Field 2",
    description: "Official inaugural fixtures featuring Samba Boys, Gunners FC, and High Voltage.",
    createdBy: "Super Admin",
    createdAt: "2026-10-20",
  },
  {
    id: "act-3",
    date: "2026-10-28",
    title: "Midweek Tactical Analysis & Conditioning",
    category: "TRAINING",
    time: "16:30 - 18:00",
    venue: "Lower Pitch Conditioning Ground",
    description: "Sprint training, recovery drills, and coach tactical video review.",
    createdBy: "Tech Manager",
    createdAt: "2026-10-22",
  },
  {
    id: "act-4",
    date: "2026-10-31",
    title: "Council Disciplinary & Eligibility Verification Hearing",
    category: "HEARING",
    time: "11:00 - 12:30",
    venue: "Council Board Chambers",
    description: "Quarterly player card reviews and academic compliance audits.",
    createdBy: "President",
    createdAt: "2026-10-22",
  },
  {
    id: "act-5",
    date: "2026-11-01",
    title: "Super Clásico Matchday 2 Showdown",
    category: "MATCHDAY",
    time: "14:00 - 18:00",
    venue: "Main Stadium Ground",
    description: "Head-to-head championship clash between top 4 table contenders.",
    createdBy: "Super Admin",
    createdAt: "2026-10-22",
  },
  {
    id: "act-6",
    date: "2026-11-07",
    title: "Refereeing & Match Officiating Workshop",
    category: "MEETING",
    time: "09:30 - 11:00",
    venue: "Media & Strategy Hub Room 4",
    description: "Advanced VAR simulation and foul interpretation standards.",
    createdBy: "Match Officiating Manager",
    createdAt: "2026-10-22",
  },
  {
    id: "act-7",
    date: "2026-11-08",
    title: "Matchday 3 Fixtures & Balloting",
    category: "MATCHDAY",
    time: "14:00 - 18:00",
    venue: "Academy Pitch 1 & 2",
    description: "Championship fixtures followed by verified student MVP balloting.",
    createdBy: "Super Admin",
    createdAt: "2026-10-22",
  },
  {
    id: "act-8",
    date: "2026-11-15",
    title: "Mid-Season Championship Derby Day",
    category: "MATCHDAY",
    time: "14:00 - 18:00",
    venue: "Main Stadium",
    description: "Crucial points on the line for Golden Boot and top 2 qualification.",
    createdBy: "Super Admin",
    createdAt: "2026-10-22",
  },
  {
    id: "act-9",
    date: "2026-11-20",
    title: "Golden Boot & Player Honours Media Showcase",
    category: "CEREMONY",
    time: "16:00 - 17:30",
    venue: "Digital Media Amphitheatre",
    description: "Public presentation of top scorers, assist leaders, and clean sheet contenders.",
    createdBy: "Tech Manager",
    createdAt: "2026-10-22",
  },
  {
    id: "act-10",
    date: "2026-11-29",
    title: "Championship Finale & Season Awards Gala",
    category: "CEREMONY",
    time: "15:00 - 19:30",
    venue: "Academy Grand Auditorium & Podium",
    description: "Trophy coronation, Golden Boot award handover, and closing celebration.",
    createdBy: "Super Admin",
    createdAt: "2026-10-22",
  },
];

export function getLeagueActivities(): LeagueActivity[] {
  if (typeof window === "undefined") {
    return INITIAL_LEAGUE_ACTIVITIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEAGUE_ACTIVITIES));
      return INITIAL_LEAGUE_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEAGUE_ACTIVITIES));
    return INITIAL_LEAGUE_ACTIVITIES;
  } catch {
    return INITIAL_LEAGUE_ACTIVITIES;
  }
}

export function saveLeagueActivities(activities: LeagueActivity[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // Ignore
  }
}

export function createLeagueActivity(
  data: Omit<LeagueActivity, "id" | "createdAt">,
): LeagueActivity {
  const current = getLeagueActivities();
  const newActivity: LeagueActivity = {
    ...data,
    id: `act-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0] || "2026-10-22",
  };
  const updated = [newActivity, ...current];
  saveLeagueActivities(updated);
  return newActivity;
}

export function deleteLeagueActivity(id: string): LeagueActivity[] {
  const current = getLeagueActivities();
  const updated = current.filter((a) => a.id !== id);
  saveLeagueActivities(updated);
  return updated;
}
