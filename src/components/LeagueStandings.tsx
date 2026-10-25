import React, { useState, useEffect, useMemo } from "react";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { isTeamDeleted } from "../lib/fixturesData";
import { Trash2, Trophy, Crown } from "lucide-react";

export interface PiaCoach {
  name: string;
  role: string;
  email?: string;
  photoUrl?: string;
}

export interface StadiumInfo {
  name: string;
  capacity: string;
  surface: string;
  dimensions?: string;
  record?: string;
  notes?: string;
}

export interface CoachTactics {
  formation: string;
  philosophy: string;
  winRate: string;
  tenure: string;
  assistantCoach?: string;
}

export interface HistoricalSummary {
  founded: string;
  honors: string[];
  allTimeRecord: string;
  highestWin: string;
  derbyRival: string;
  historicWinRate: string;
  seasons: { season: string; finish: string; points: number; note: string }[];
}

export interface SquadMember {
  name: string;
  number: number;
  position: string;
  photoUrl?: string;
  role?: string;
  email?: string;
}

export interface TeamStanding {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  homePitch: string;
  coach?: PiaCoach;
  stadium?: StadiumInfo;
  coachDetails?: CoachTactics;
  history?: HistoricalSummary;
  squad?: SquadMember[];
  logoUrl?: string;
  mp: number; // Matches Played
  w: number; // Wins
  d: number; // Draws
  l: number; // Losses
  gf: number; // Goals For
  ga: number; // Goals Against
  gd: number; // Goal Difference
  pts: number; // Points
  form: string[]; // ['W', 'D', 'L', ...]
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  points?: number;
  spiritualBonus?: number;
}

export const DEFAULT_STANDINGS: TeamStanding[] = [
  {
    id: 1,
    name: "Samba Boys",
    shortCode: "SMB",
    color: "#00ff85",
    homePitch: "Samba Arena (School Lower Pitch)",
    coach: {
      name: "Aron Charito",
      role: "Head Coach",
      email: "aron.charito@mpesafoundationacademy.ac.ke",
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    stadium: {
      name: "Samba Arena (School Lower Pitch Ground)",
      capacity: "1,200 Student Spectators",
      surface: "Hybrid Bermuda Turf & FIFA Quality AstroTurf",
      dimensions: "105m × 68m (Standard Pitch)",
      record: "85% Home Win Rate • 0 Defeats at Home (2026/27)",
      notes:
        "Known as the 'Samba Cauldron' due to energetic student drums and brass section during Sunday games.",
    },
    coachDetails: {
      formation: "4-3-3 Attacking Gegenpress",
      philosophy:
        "Fluid attacking soccer with aggressive counter-pressing and rapid wing overloads.",
      winRate: "78.4% All-Time (29W - 5D - 3L)",
      tenure: "3 Seasons (Appointed Sep 2024)",
      assistantCoach: "George Victor (george.kibet@mpesafoundationacademy.ac.ke)",
    },
    history: {
      founded: "2023 at M-Pesa Foundation Academy",
      honors: [
        "🏆 Sunday League Champions (2024/2025)",
        "🥇 Academy Inter-House Super Cup (2025)",
        "🥈 M-Pesa Youth Shield Finalist (2024)",
      ],
      allTimeRecord: "48 Matches: 34 Wins, 8 Draws, 6 Losses",
      highestWin: "5 - 0 vs DP 2 B (Matchweek 4, 2025)",
      derbyRival: "The Academy Clásico vs Grade 10 A",
      historicWinRate: "70.8%",
      seasons: [
        {
          season: "2024/25",
          finish: "1st Place (Champions)",
          points: 28,
          note: "Undefeated home record",
        },
        {
          season: "2025/26",
          finish: "2nd Place (Runners-Up)",
          points: 25,
          note: "Highest goals scored (34)",
        },
        {
          season: "2026/27",
          finish: "1st Place (Current)",
          points: 13,
          note: "Active matchweek 5 leader",
        },
      ],
    },
    squad: [
      {
        name: "Levis Wanyama",
        number: 10,
        position: "MID",
        role: "Owner & Captain",
        email: "levis.wanyama@mpesafoundationacademy.ac.ke",
        photoUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Tonny Odundo",
        number: 7,
        position: "MID",
        role: "Member",
        email: "tonny.odundo@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Ali Guyo",
        number: 2,
        position: "DEF",
        role: "Member",
        email: "ali.diba@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Chris Koome",
        number: 8,
        position: "MID",
        role: "Member",
        email: "chris.koome@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Dennis Thoya",
        number: 3,
        position: "DEF",
        role: "Member",
        email: "dennis.thoya@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Elvis Kingoo",
        number: 9,
        position: "FWD",
        role: "Member",
        email: "elvis.kingoo@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Gabriel Ekitui",
        number: 4,
        position: "DEF",
        role: "Member",
        email: "gabriel.alukwar@mpesafoundationacademy.ac.ke",
      },
      {
        name: "George Victor",
        number: 6,
        position: "MID",
        role: "Assistant Coach & Member",
        email: "george.kibet@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Grout Olal",
        number: 11,
        position: "FWD",
        role: "Member",
        email: "grout.olal@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Idi Sebantu",
        number: 1,
        position: "GK",
        role: "Member",
        email: "idi.sebantu@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Ken Neepe",
        number: 5,
        position: "DEF",
        role: "Member",
        email: "ken.leneepa@mpesafoundationacademy.ac.ke",
      },
      {
        name: "King David",
        number: 14,
        position: "MID",
        role: "Member",
        email: "king.amani@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Lewis Trady",
        number: 17,
        position: "FWD",
        role: "Member",
        email: "trady.lewis@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Mahad Abdi",
        number: 12,
        position: "MID",
        role: "Member",
        email: "mahad.sihal@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Mark Tonny",
        number: 15,
        position: "MID",
        role: "Member",
        email: "tonny.odundo@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Nimrod Khayumbi",
        number: 16,
        position: "DEF",
        role: "Member",
        email: "nimrod.khayumbi@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Reagan Ogora",
        number: 18,
        position: "DEF",
        role: "Member",
        email: "reagan.onsongo@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Ryan Kiarago",
        number: 20,
        position: "MID",
        role: "Member",
        email: "ryan.kiarago@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Ryan Odiwuor",
        number: 21,
        position: "GK",
        role: "Member",
        email: "ryan.odiwuor@mpesafoundationacademy.ac.ke",
      },
      {
        name: "Wayne Kiptoo",
        number: 22,
        position: "MID",
        role: "Member",
        email: "wayne.kiptoo@mpesafoundationacademy.ac.ke",
      },
    ],
    mp: 5,
    w: 4,
    d: 1,
    l: 0,
    gf: 14,
    ga: 3,
    gd: 11,
    pts: 13,
    form: ["W", "W", "D", "W", "W"],
  },
  {
    id: 6,
    name: "Royal Rangers",
    shortCode: "RR",
    color: "#3b82f6",
    homePitch: "Ranger Fortress Field (Academy East)",
    coach: {
      name: "Amirah Bramuel",
      role: "Team Manager & Head of Operations",
      email: "amirah.bramuel@mpesafoundationacademy.ac.ke",
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    stadium: {
      name: "Ranger Fortress Field (Academy East)",
      capacity: "1,100 Spectators",
      surface: "All-Weather Hybrid Turf",
      dimensions: "105m × 68m",
      record: "80% Home Win Rate",
      notes: "The Royal Rangers stronghold known for blue banners and disciplined defending.",
    },
    coachDetails: {
      formation: "4-3-3 Balanced Attack",
      philosophy: "High defensive discipline, quick midfield switches, and clinical winger pace.",
      winRate: "68.0% All-Time",
      tenure: "Inaugural Season",
      assistantCoach: "Captain Haron & Captain Jaycrack",
    },
    history: {
      founded: "2024 at M-Pesa Foundation Academy",
      honors: ["🥇 Regional Shield Winners (2025)", "🥈 Inter-Class Cup Finalist (2025)"],
      allTimeRecord: "28 Matches: 18 Wins, 5 Draws, 5 Losses",
      highestWin: "4 - 0 vs DP 2 B",
      derbyRival: "Academy Derby vs Young Stars City",
      historicWinRate: "64.3%",
      seasons: [
        { season: "2025/26", finish: "2nd Place", points: 24, note: "Strong debut run" },
        { season: "2026/27", finish: "3rd Place (Current)", points: 10, note: "Top 3 race" },
      ],
    },
    squad: [
      { name: "Brian", number: 1, position: "GK", role: "Goalkeeper" },
      { name: "Gregory", number: 13, position: "GK", role: "Goalkeeper" },
      { name: "Jattan", number: 2, position: "DEF", role: "Defender" },
      { name: "Atibu", number: 3, position: "DEF", role: "Defender" },
      { name: "Haron", number: 4, position: "DEF", role: "Team Captain & Defender" },
      { name: "Edgar", number: 5, position: "DEF", role: "Defender" },
      { name: "Mutwiri", number: 6, position: "DEF", role: "Defender" },
      { name: "Kichuma", number: 12, position: "DEF", role: "Defender" },
      { name: "Abdiaziz", number: 15, position: "DEF", role: "Defender" },
      { name: "Eugene", number: 7, position: "MID", role: "Midfielder" },
      { name: "Shawn", number: 8, position: "MID", role: "Midfielder" },
      { name: "Jaycrack", number: 10, position: "MID", role: "Team Captain & Playmaker" },
      { name: "Phisael", number: 14, position: "MID", role: "Midfielder" },
      { name: "Opiyo", number: 16, position: "MID", role: "Midfielder" },
      { name: "Abdirashid", number: 17, position: "MID", role: "Midfielder" },
      { name: "Stafford", number: 18, position: "MID", role: "Midfielder" },
      { name: "Vincent", number: 20, position: "MID", role: "Midfielder" },
      { name: "Wokabi", number: 9, position: "FWD", role: "Forward" },
      { name: "Edwin", number: 11, position: "FWD", role: "Forward" },
      { name: "Carson", number: 19, position: "FWD", role: "Forward" },
    ],
    mp: 5,
    w: 3,
    d: 1,
    l: 1,
    gf: 10,
    ga: 5,
    gd: 5,
    pts: 10,
    form: ["W", "W", "D", "W", "L"],
  },
  {
    id: 7,
    name: "Young Stars City",
    shortCode: "YSC",
    color: "#f97316",
    homePitch: "Young Stars City Arena (North Pavilion)",
    coach: {
      name: "Samwel Reagan Wanyama",
      role: "Head Coach",
      email: "samwel.wanyama@mpesafoundationacademy.ac.ke",
      photoUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    stadium: {
      name: "Young Stars City Arena (North Pavilion)",
      capacity: "1,350 Spectators",
      surface: "Fine Bermuda Grass & Modern Drainage",
      dimensions: "105m × 68m",
      record: "75% Home Win Rate",
      notes:
        "Dynamic youth academy arena renowned for rapid passing interchanges and high-octane tempo.",
    },
    coachDetails: {
      formation: "4-2-3-1 Explosive Pressing",
      philosophy:
        "High energy vertical transitions, fast diagonal through-balls, and total academy football.",
      winRate: "65.0% All-Time",
      tenure: "Inaugural Season",
      assistantCoach: "Adams Technical Bench",
    },
    history: {
      founded: "2024 at M-Pesa Foundation Academy",
      honors: ["🏆 Academy Youth Cup (2025)", "🥇 Rising Stars Shield (2025)"],
      allTimeRecord: "26 Matches: 16 Wins, 4 Draws, 6 Losses",
      highestWin: "5 - 1 vs Grade 10 B",
      derbyRival: "The Young Derby vs Royal Rangers & Samba Boys",
      historicWinRate: "61.5%",
      seasons: [
        { season: "2025/26", finish: "3rd Place", points: 22, note: "Youth Cup Champions" },
        { season: "2026/27", finish: "4th Place (Current)", points: 9, note: "Aggressive attack" },
      ],
    },
    squad: [
      { name: "Elly Adams Otieno", number: 10, position: "FWD", role: "Team Captain (C)" },
      { name: "Hassan Siad", number: 2, position: "DEF", role: "Defender" },
      { name: "Ibrahim Salat", number: 8, position: "MID", role: "Midfielder" },
      { name: "Bidan Mwaura", number: 3, position: "DEF", role: "Defender" },
      { name: "Raila Junior", number: 7, position: "FWD", role: "Forward" },
      { name: "Washington Murithi", number: 6, position: "MID", role: "Midfielder" },
      { name: "Ebeneza Moses", number: 1, position: "GK", role: "Goalkeeper" },
      { name: "John Owino", number: 4, position: "DEF", role: "Defender" },
      { name: "Gabriel Maluki", number: 11, position: "MID", role: "Midfielder" },
      { name: "Moffat Osoro", number: 9, position: "FWD", role: "Forward" },
      { name: "Mark Kwemoi", number: 5, position: "DEF", role: "Defender" },
      { name: "Abdifatah", number: 12, position: "MID", role: "Midfielder" },
      { name: "Dennis Macharia", number: 13, position: "DEF", role: "Defender" },
      { name: "Lucas Nawakan", number: 14, position: "FWD", role: "Forward" },
      { name: "Emmanuel Kariuki", number: 16, position: "GK", role: "Goalkeeper" },
    ],
    mp: 5,
    w: 3,
    d: 0,
    l: 2,
    gf: 11,
    ga: 8,
    gd: 3,
    pts: 9,
    form: ["L", "W", "W", "L", "W"],
  },
  {
    id: 8,
    name: "Mzinga Boyz",
    shortCode: "MZB",
    color: "#eab308",
    homePitch: "The Hive Stadium (West Campus Ground)",
    coach: {
      name: "Saidi Bakari",
      role: "Head Coach",
      email: "saidi.bakari@mpesafoundationacademy.ac.ke",
      photoUrl:
        "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80",
    },
    stadium: {
      name: "The Hive Stadium (West Campus Grounds)",
      capacity: "1,000 Spectators",
      surface: "Natural Kikuyu Grass",
      dimensions: "104m × 66m",
      record: "70% Home Win Rate",
      notes:
        "The stinging home ground of the Mzinga Boyz with relentless pressing and energetic swarm tactics.",
    },
    coachDetails: {
      formation: "3-4-3 Swarm Attack",
      philosophy: "High-tempo collective pressing, relentless wing runs, and quick counter-surges.",
      winRate: "62.5% All-Time",
      tenure: "Inaugural Season",
      assistantCoach: "Meshach Wanjala",
    },
    history: {
      founded: "2024 at M-Pesa Foundation Academy",
      honors: ["🥇 West Campus Shield (2025)", "🥈 Academy Trophy Runner-up (2025)"],
      allTimeRecord: "24 Matches: 14 Wins, 5 Draws, 5 Losses",
      highestWin: "3 - 0 vs DP 2 A",
      derbyRival: "The Swarm Clásico vs Royal Rangers",
      historicWinRate: "58.3%",
      seasons: [
        { season: "2025/26", finish: "4th Place", points: 20, note: "Debut season" },
        { season: "2026/27", finish: "5th Place (Current)", points: 8, note: "Hard to break down" },
      ],
    },
    squad: [
      { name: "Hamard Adan", number: 10, position: "FWD", role: "Team Captain" },
      { name: "Jeff Njoroge", number: 7, position: "MID", role: "Midfielder" },
      { name: "Bavian Kipkorir", number: 8, position: "MID", role: "Midfielder" },
      { name: "Brandon Wandera", number: 11, position: "FWD", role: "Forward" },
      { name: "Collins Kiptum", number: 4, position: "DEF", role: "Defender" },
      { name: "Eliud Mwaiza", number: 2, position: "DEF", role: "Defender" },
      { name: "Enock Kiptoo", number: 3, position: "DEF", role: "Defender" },
      { name: "Felix Okoth", number: 5, position: "DEF", role: "Defender" },
      { name: "Bill Kipkoech", number: 1, position: "GK", role: "Goalkeeper" },
      { name: "Said Bakari", number: 6, position: "MID", role: "Midfielder" },
      { name: "Samuel Ekuwam", number: 12, position: "DEF", role: "Defender" },
      { name: "Samuel Wanyama", number: 9, position: "FWD", role: "Forward" },
      { name: "Simon Omondi Obara", number: 14, position: "MID", role: "Midfielder" },
      { name: "Stephen Kipsang", number: 15, position: "MID", role: "Midfielder" },
      { name: "Haron Lemmy", number: 13, position: "GK", role: "Goalkeeper" },
    ],
    mp: 5,
    w: 2,
    d: 2,
    l: 1,
    gf: 8,
    ga: 6,
    gd: 2,
    pts: 8,
    form: ["D", "W", "L", "W", "D"],
  },
];

type SortColumn = "rank" | "name" | "mp" | "w" | "d" | "l" | "gf" | "ga" | "gd" | "pts";
type SortDirection = "asc" | "desc";
type ClubModalTab = "overview" | "stadium" | "coach" | "history" | "squad";

export function LeagueStandings() {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const canDeleteTeam =
    isSuperAdmin || currentRole === "TECH_MANAGER" || currentRole === "RECORDS_MANAGER";

  const [standings, setStandings] = useState<TeamStanding[]>(DEFAULT_STANDINGS);
  const [sortColumn, setSortColumn] = useState<SortColumn>("pts");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<TeamStanding | null>(null);
  const [clubModalTab, setClubModalTab] = useState<ClubModalTab>("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage and sanitize against deleted teams
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      let activeList: TeamStanding[] = DEFAULT_STANDINGS;
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize teams with fallback stats and filter out deleted legacy clubs
          const nonDeleted = parsed.filter((t) => !isTeamDeleted(t.id, t.name));
          if (nonDeleted.length > 0) {
            activeList = nonDeleted.map((t, idx) => ({
              id: t.id ?? idx + 1,
              name: t.name || `Club #${idx + 1}`,
              shortCode: t.shortCode || `C${idx + 1}`,
              color: t.color || "#00f0ff",
              homePitch: t.homePitch || "School Main Arena",
              coach: t.coach,
              stadium: t.stadium,
              coachDetails: t.coachDetails,
              history: t.history,
              squad: t.squad,
              logoUrl: t.logoUrl,
              mp: Number.isFinite(t.mp) ? t.mp : Number(t.played) || 5,
              w: Number.isFinite(t.w) ? t.w : Number(t.won) || 0,
              d: Number.isFinite(t.d) ? t.d : Number(t.drawn) || 0,
              l: Number.isFinite(t.l) ? t.l : Number(t.lost) || 0,
              gf: Number.isFinite(t.gf) ? t.gf : 0,
              ga: Number.isFinite(t.ga) ? t.ga : 0,
              gd: Number.isFinite(t.gd) ? t.gd : (Number(t.gf) || 0) - (Number(t.ga) || 0),
              pts: Number.isFinite(t.pts)
                ? t.pts
                : Number(t.points) || (Number(t.w) || 0) * 3 + (Number(t.d) || 0),
              form: Array.isArray(t.form) ? t.form : ["W", "D", "W", "L", "W"],
            }));
          }
        }
      }
      setStandings(activeList);
      // Persist cleaned list so legacy teams don't linger
      try {
        localStorage.setItem("mpesa_pes_teams_v6", JSON.stringify(activeList));
      } catch {
        // Ignore
      }
    } catch {
      setStandings(DEFAULT_STANDINGS);
    }
  }, []);

  const handleDeleteTeam = (teamId: number, teamName: string) => {
    const updated = standings.filter((t) => t.id !== teamId);
    setStandings(updated);
    try {
      const storedDeleted: (number | string)[] = JSON.parse(
        localStorage.getItem("mpesa_pes_deleted_teams_v6") || "[]",
      );
      if (!storedDeleted.includes(teamId)) storedDeleted.push(teamId);
      if (!storedDeleted.includes(teamName.toLowerCase()))
        storedDeleted.push(teamName.toLowerCase());
      localStorage.setItem("mpesa_pes_deleted_teams_v6", JSON.stringify(storedDeleted));
      localStorage.setItem("mpesa_pes_teams_v6", JSON.stringify(updated));

      // Also clean up any fixtures referencing this team
      const storedMatches = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedMatches) {
        const matches = JSON.parse(storedMatches);
        if (Array.isArray(matches)) {
          const filteredMatches = matches.filter(
            (m: { homeId: number; awayId: number }) => m.homeId !== teamId && m.awayId !== teamId,
          );
          localStorage.setItem("mpesa_pes_matches_v6", JSON.stringify(filteredMatches));
        }
      }
    } catch {
      // Ignore
    }
    setSelectedTeam(null);
    setToastMessage(`✓ Club "${teamName}" permanently deleted from league.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      // Sensible defaults: alphabetical starts asc, numbers start desc
      setSortDirection(
        col === "name" || col === "rank" || col === "l" || col === "ga" ? "asc" : "desc",
      );
    }
  };

  // Sorted and filtered list
  const sortedStandings = useMemo(() => {
    let list = [...standings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortCode.toLowerCase().includes(q) ||
          t.homePitch.toLowerCase().includes(q),
      );
    }

    const dir = sortDirection === "asc" ? 1 : -1;

    return list.sort((a, b) => {
      switch (sortColumn) {
        case "name":
          return dir * a.name.localeCompare(b.name);
        case "pts":
          if (b.pts !== a.pts) return dir * (a.pts - b.pts);
          if (b.gd !== a.gd) return dir * (a.gd - b.gd);
          return dir * (a.gf - b.gf);
        case "gd":
          if (b.gd !== a.gd) return dir * (a.gd - b.gd);
          return dir * (a.pts - b.pts);
        case "mp":
          return dir * (a.mp - b.mp);
        case "w":
          return dir * (a.w - b.w);
        case "d":
          return dir * (a.d - b.d);
        case "l":
          return dir * (a.l - b.l);
        case "gf":
          return dir * (a.gf - b.gf);
        case "ga":
          return dir * (a.ga - b.ga);
        case "rank":
        default:
          if (b.pts !== a.pts) return dir * (a.pts - b.pts);
          if (b.gd !== a.gd) return dir * (a.gd - b.gd);
          return dir * (a.gf - b.gf);
      }
    });
  }, [standings, sortColumn, sortDirection, searchQuery]);

  // Key KPI stats
  const leaderTeam = useMemo(() => {
    return [...standings].sort((a, b) => b.pts - a.pts || b.gd - a.gd)[0] || standings[0];
  }, [standings]);

  const bestAttack = useMemo(() => {
    return [...standings].sort((a, b) => b.gf - a.gf)[0] || standings[0];
  }, [standings]);

  const bestDefense = useMemo(() => {
    return [...standings].sort((a, b) => a.ga - b.ga)[0] || standings[0];
  }, [standings]);

  const totalMatches = useMemo(() => {
    return Math.floor(standings.reduce((sum, t) => sum + t.mp, 0) / 2);
  }, [standings]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2e2554] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
              Official eFootball Championship
            </span>
            <span className="text-xs text-gray-400 font-mono">Season 2026/2027</span>
          </div>
          <h2 className="font-header text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-3">
            <span>League Standings</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Sortable table featuring team rankings, match performance, points, and goal difference.
            Click any header to sort.
          </p>
        </div>

        {/* Search & Reset */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search club or pitch..."
              className="bg-[#141029] border border-[#2e2554] rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00f0ff] w-48 sm:w-60 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#141029] border border-[#2e2554] p-1 rounded-2xl text-xs">
            <span className="text-[10px] text-gray-400 font-bold px-2 uppercase">Quick:</span>
            <button
              onClick={() => handleSort("pts")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                sortColumn === "pts"
                  ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Points
            </button>
            <button
              onClick={() => handleSort("gd")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                sortColumn === "gd"
                  ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              GD
            </button>
            <button
              onClick={() => handleSort("mp")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                sortColumn === "mp"
                  ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Played
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Leader */}
        <div className="bg-[#0e0a26]/90 border border-amber-500/30 rounded-3xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-black text-xl shrink-0">
            👑
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
              1st Place Leader
            </span>
            <h4 className="text-sm font-black text-white truncate">{leaderTeam.name}</h4>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {leaderTeam.pts} PTS • GD +{leaderTeam.gd}
            </span>
          </div>
        </div>

        {/* Best Attack */}
        <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 flex items-center justify-center font-black text-sm shrink-0">
            ⚽
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Top Scoring Club
            </span>
            <h4 className="text-sm font-black text-white truncate">{bestAttack.name}</h4>
            <span className="text-xs text-[#00f0ff] font-mono font-bold">
              {bestAttack.gf} Goals ({(bestAttack.gf / (bestAttack.mp || 1)).toFixed(1)} / match)
            </span>
          </div>
        </div>

        {/* Best Defense */}
        <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm shrink-0">
            🛡️
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Best Defense
            </span>
            <h4 className="text-sm font-black text-white truncate">{bestDefense.name}</h4>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {bestDefense.ga} Conceded ({(bestDefense.ga / (bestDefense.mp || 1)).toFixed(1)} /
              match)
            </span>
          </div>
        </div>

        {/* Matchweeks */}
        <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-sm shrink-0">
            📅
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Championship Status
            </span>
            <h4 className="text-sm font-black text-white truncate">Matchweek 5 Concluded</h4>
            <span className="text-xs text-purple-300 font-mono font-bold">
              {totalMatches} Matches Logged
            </span>
          </div>
        </div>
      </div>

      {/* Standings Table Card */}
      <div className="bg-[#0e0a26]/95 border border-[#2e2554] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-[#070512]/95 text-xs font-black text-gray-400 uppercase border-b border-[#2e2554]">
                {/* Pos */}
                <th
                  onClick={() => handleSort("rank")}
                  className="py-4 px-4 text-center w-14 cursor-pointer hover:text-white transition group"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Pos</span>
                    {sortColumn === "rank" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* Team */}
                <th
                  onClick={() => handleSort("name")}
                  className="py-4 px-6 cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center gap-1.5 ${
                      sortColumn === "name" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>Club & Home Pitch</span>
                    {sortColumn === "name" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* Pia Coach */}
                <th className="py-4 px-4 hidden sm:table-cell">Pia Coach</th>

                {/* MP */}
                <th
                  onClick={() => handleSort("mp")}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      sortColumn === "mp" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>MP</span>
                    {sortColumn === "mp" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* W */}
                <th
                  onClick={() => handleSort("w")}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      sortColumn === "w" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>W</span>
                    {sortColumn === "w" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* D */}
                <th
                  onClick={() => handleSort("d")}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      sortColumn === "d" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>D</span>
                    {sortColumn === "d" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* L */}
                <th
                  onClick={() => handleSort("l")}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      sortColumn === "l" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>L</span>
                    {sortColumn === "l" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* GF */}
                <th
                  onClick={() => handleSort("gf")}
                  className="py-4 px-3 text-center hidden md:table-cell cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      sortColumn === "gf" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>GF</span>
                    {sortColumn === "gf" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* GA */}
                <th
                  onClick={() => handleSort("ga")}
                  className="py-4 px-3 text-center hidden md:table-cell cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      sortColumn === "ga" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>GA</span>
                    {sortColumn === "ga" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* GD */}
                <th
                  onClick={() => handleSort("gd")}
                  className="py-4 px-3 text-center cursor-pointer hover:text-white transition"
                >
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      sortColumn === "gd" ? "text-[#00f0ff] font-black" : ""
                    }`}
                  >
                    <span>GD</span>
                    {sortColumn === "gd" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* PTS */}
                <th
                  onClick={() => handleSort("pts")}
                  className="py-4 px-4 text-center cursor-pointer hover:text-white transition font-black text-[#00f0ff]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Pts</span>
                    {sortColumn === "pts" && (
                      <span className="text-[#00f0ff] text-xs">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>

                {/* Form */}
                <th className="py-4 px-4 text-center hidden lg:table-cell">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e2554]/60 text-sm font-semibold">
              {sortedStandings.map((team, index) => {
                const isLeader =
                  (index === 0 && sortColumn === "pts" && sortDirection === "desc") ||
                  (index === 0 && sortColumn === "rank" && sortDirection === "asc") ||
                  (sortColumn === "pts" && index === 0);

                return (
                  <tr
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`transition-all duration-200 group cursor-pointer ${
                      isLeader
                        ? "bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border-l-4 border-amber-400 shadow-sm shadow-amber-500/5 hover:from-amber-500/25 hover:via-yellow-500/20"
                        : "hover:bg-[#1a1438]/80"
                    }`}
                  >
                    {/* Pos */}
                    <td className="py-4 px-4 text-center font-black">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                            isLeader
                              ? "bg-gradient-to-tr from-amber-400 to-yellow-500 text-black shadow-md shadow-amber-400/30"
                              : index === 1
                                ? "bg-cyan-400/20 text-[#00f0ff] border border-cyan-400/30"
                                : index === 2
                                  ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                                  : "text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {isLeader && (
                          <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse hidden sm:inline shrink-0" />
                        )}
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-lg border relative overflow-hidden shrink-0 ${
                            isLeader
                              ? "border-amber-400 ring-2 ring-amber-400/30"
                              : "border-white/20"
                          }`}
                          style={{ backgroundColor: team.color }}
                        >
                          {team.logoUrl ? (
                            <img
                              src={team.logoUrl}
                              alt={team.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{team.shortCode}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-extrabold transition-colors ${
                                isLeader
                                  ? "text-amber-200 group-hover:text-amber-100"
                                  : "text-white group-hover:text-[#00f0ff]"
                              }`}
                            >
                              {team.name}
                            </span>
                            {isLeader && (
                              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
                                <Trophy className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span>LEAGUE LEADERS</span>
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <svg
                              className="w-3 h-3 text-[#00f0ff]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{team.homePitch}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Pia Coach */}
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {team.coach?.photoUrl ? (
                          <img
                            src={team.coach.photoUrl}
                            alt={team.coach.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#00f0ff]/40"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#1e1744] flex items-center justify-center text-[10px] font-bold text-[#00f0ff]">
                            PC
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-gray-200 block truncate max-w-[130px]">
                            {team.coach?.name || "Pia Coach Assigned"}
                          </span>
                          <span className="text-[10px] text-[#00f0ff] font-semibold block">
                            {team.coach?.role || "Head Coach"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* MP */}
                    <td className="py-4 px-3 text-center font-bold text-gray-300 font-mono">
                      {team.mp}
                    </td>

                    {/* W */}
                    <td className="py-4 px-3 text-center text-emerald-400 font-bold font-mono">
                      {team.w}
                    </td>

                    {/* D */}
                    <td className="py-4 px-3 text-center text-amber-400 font-bold font-mono">
                      {team.d}
                    </td>

                    {/* L */}
                    <td className="py-4 px-3 text-center text-rose-400 font-bold font-mono">
                      {team.l}
                    </td>

                    {/* GF */}
                    <td className="py-4 px-3 text-center text-gray-400 font-mono hidden md:table-cell">
                      {team.gf}
                    </td>

                    {/* GA */}
                    <td className="py-4 px-3 text-center text-gray-400 font-mono hidden md:table-cell">
                      {team.ga}
                    </td>

                    {/* GD */}
                    <td
                      className={`py-4 px-3 text-center font-black font-mono ${
                        team.gd > 0
                          ? "text-emerald-400"
                          : team.gd < 0
                            ? "text-rose-400"
                            : "text-gray-400"
                      }`}
                    >
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>

                    {/* PTS */}
                    <td className="py-4 px-4 text-center font-black text-base text-[#00f0ff] bg-[#00f0ff]/10 font-mono">
                      {team.pts}
                    </td>

                    {/* Form */}
                    <td className="py-4 px-4 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {team.form.map((res, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black text-white uppercase ${
                              res === "W"
                                ? "bg-emerald-500 shadow-sm shadow-emerald-500/20"
                                : res === "D"
                                  ? "bg-amber-500 shadow-sm shadow-amber-500/20"
                                  : res === "L"
                                    ? "bg-rose-500 shadow-sm shadow-rose-500/20"
                                    : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-[#070512]/90 border-t border-[#2e2554] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>1st Place Champion Zone</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Top 3 Podium Spots</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-gray-500">
            Rules: 3 pts for Win • 1 pt for Draw • 0 pts for Loss
          </span>
        </div>
      </div>

      {/* Detailed Club Profile Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b0821] border-2 border-cyan-400/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-xl text-lg border-2 border-white/20 shrink-0"
                  style={{ backgroundColor: selectedTeam.color }}
                >
                  {selectedTeam.shortCode}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-header text-2xl sm:text-3xl font-black text-white uppercase leading-none">
                      {selectedTeam.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 font-bold border border-white/20">
                      {selectedTeam.shortCode}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-semibold mt-1 flex items-center gap-1.5">
                    <span className="text-emerald-400">🏟️</span>
                    <span>{selectedTeam.stadium?.name || selectedTeam.homePitch}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTeam(null);
                  setClubModalTab("overview");
                }}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#2e2554]/70">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                { id: "stadium", label: "Home Stadium", icon: "🏟️" },
                { id: "coach", label: "Coach & Tactics", icon: "👔" },
                { id: "history", label: "Historical Summary", icon: "📜" },
                { id: "squad", label: "Squad & Photos", icon: "👥" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setClubModalTab(tab.id as ClubModalTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    clubModalTab === tab.id
                      ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-md"
                      : "bg-[#141029] text-gray-400 hover:text-white border border-[#2e2554]"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {clubModalTab === "overview" && (
              <div className="space-y-4 text-xs">
                {/* 4 Key Metrics */}
                <div className="grid grid-cols-4 gap-2.5 text-center">
                  <div className="bg-[#141029] p-3 rounded-2xl border border-[#2e2554]">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                      Points
                    </span>
                    <span className="text-2xl font-black text-[#00f0ff] font-mono">
                      {selectedTeam.pts}
                    </span>
                  </div>
                  <div className="bg-[#141029] p-3 rounded-2xl border border-[#2e2554]">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                      Played
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedTeam.mp}
                    </span>
                  </div>
                  <div className="bg-[#141029] p-3 rounded-2xl border border-[#2e2554]">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                      Record
                    </span>
                    <span className="text-sm font-black text-emerald-400 font-mono mt-1 block">
                      {selectedTeam.w}W - {selectedTeam.d}D - {selectedTeam.l}L
                    </span>
                  </div>
                  <div className="bg-[#141029] p-3 rounded-2xl border border-[#2e2554]">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">GD</span>
                    <span
                      className={`text-2xl font-black font-mono ${
                        selectedTeam.gd > 0
                          ? "text-emerald-400"
                          : selectedTeam.gd < 0
                            ? "text-rose-400"
                            : "text-gray-300"
                      }`}
                    >
                      {selectedTeam.gd > 0 ? `+${selectedTeam.gd}` : selectedTeam.gd}
                    </span>
                  </div>
                </div>

                {/* Goals & Form Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#141029] p-4 rounded-2xl border border-[#2e2554] space-y-2">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">
                      Scoring Metrics
                    </span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Goals Scored (GF):</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {selectedTeam.gf}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Goals Conceded (GA):</span>
                      <span className="font-mono font-bold text-rose-400">{selectedTeam.ga}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Goal Ratio:</span>
                      <span className="font-mono font-bold text-cyan-300">
                        {(selectedTeam.gf / (selectedTeam.ga || 1)).toFixed(2)}x
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#141029] p-4 rounded-2xl border border-[#2e2554] space-y-2">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">
                      Current Form Guide
                    </span>
                    <div className="flex items-center gap-1.5 pt-1">
                      {selectedTeam.form.map((res, i) => (
                        <span
                          key={i}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white uppercase ${
                            res === "W"
                              ? "bg-emerald-500 shadow-md shadow-emerald-500/20"
                              : res === "D"
                                ? "bg-amber-500 shadow-md shadow-amber-500/20"
                                : "bg-rose-500 shadow-md shadow-rose-500/20"
                          }`}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 pt-1">
                      Last 5 championship matches • Most recent on right
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HOME STADIUM */}
            {clubModalTab === "stadium" && (
              <div className="space-y-4 text-xs">
                <div className="bg-[#141029] p-5 rounded-2xl border border-[#2e2554] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏟️</span>
                      <div>
                        <h4 className="font-black text-white text-base">
                          {selectedTeam.stadium?.name || selectedTeam.homePitch}
                        </h4>
                        <span className="text-[10px] text-[#00f0ff] uppercase font-bold">
                          Official Home Ground
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                      Fortress Ground
                    </span>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">
                    {selectedTeam.stadium?.notes ||
                      "The official grounds for home league matches, featuring matchday spectator zones, technical benches, and full regulation marking."}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    <div className="bg-[#09061c] p-3 rounded-xl border border-[#2e2554]">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        Capacity
                      </span>
                      <span className="font-bold text-white text-xs">
                        {selectedTeam.stadium?.capacity || "1,200 Spectators"}
                      </span>
                    </div>

                    <div className="bg-[#09061c] p-3 rounded-xl border border-[#2e2554]">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        Pitch Surface
                      </span>
                      <span className="font-bold text-emerald-400 text-xs">
                        {selectedTeam.stadium?.surface || "Hybrid Bermuda & AstroTurf"}
                      </span>
                    </div>

                    <div className="bg-[#09061c] p-3 rounded-xl border border-[#2e2554] col-span-2 sm:col-span-1">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        Pitch Dimensions
                      </span>
                      <span className="font-mono font-bold text-cyan-300 text-xs">
                        {selectedTeam.stadium?.dimensions || "105m × 68m (FIFA Standard)"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-300">
                      Home Fortress Record:
                    </span>
                    <span className="font-mono font-black text-white text-xs">
                      {selectedTeam.stadium?.record || "85% Win Rate at Home"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COACH & TACTICS */}
            {clubModalTab === "coach" && (
              <div className="space-y-4 text-xs">
                {/* Coach Profile Card */}
                {selectedTeam.coach && (
                  <div className="p-4 bg-[#141029] border border-[#2e2554] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      {selectedTeam.coach.photoUrl ? (
                        <img
                          src={selectedTeam.coach.photoUrl}
                          alt={selectedTeam.coach.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00f0ff]/50 shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#1e1744] flex items-center justify-center font-black text-[#00f0ff] text-base border border-[#00f0ff]/40">
                          PC
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">
                          {selectedTeam.coach.role}
                        </span>
                        <h4 className="text-base font-black text-white">
                          {selectedTeam.coach.name}
                        </h4>
                        {selectedTeam.coach.email && (
                          <span className="text-xs text-[#00f0ff] font-mono">
                            {selectedTeam.coach.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-[10px]">
                      Licensed Pia
                    </span>
                  </div>
                )}

                {/* Tactical Setup */}
                <div className="bg-[#141029] p-5 rounded-2xl border border-[#2e2554] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                    <span className="font-extrabold text-white text-xs uppercase flex items-center gap-1.5">
                      <span>⚡</span> Tactical Blueprint & Managerial Philosophy
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-400">
                      {selectedTeam.coachDetails?.formation || "4-3-3 Attacking"}
                    </span>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">
                    {selectedTeam.coachDetails?.philosophy ||
                      "Direct vertical transitions, fluid attacking football with high defensive line and relentless counter-pressing."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-[#09061c] rounded-xl border border-[#2e2554]">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        Managerial Win Rate
                      </span>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {selectedTeam.coachDetails?.winRate || "78.4% All-Time"}
                      </span>
                    </div>

                    <div className="p-3 bg-[#09061c] rounded-xl border border-[#2e2554]">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        Tenure & Staff
                      </span>
                      <span className="font-bold text-white text-xs">
                        {selectedTeam.coachDetails?.tenure || "3 Seasons in Charge"}
                      </span>
                    </div>
                  </div>

                  {selectedTeam.coachDetails?.assistantCoach && (
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1">
                      <span className="text-cyan-300">Assistant Coach:</span>
                      <span className="text-white font-bold">
                        {selectedTeam.coachDetails.assistantCoach}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: HISTORICAL PERFORMANCE SUMMARY */}
            {clubModalTab === "history" && (
              <div className="space-y-4 text-xs">
                {/* Honors & Cups */}
                <div className="bg-[#141029] p-5 rounded-2xl border border-amber-400/30 space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#2e2554] pb-2">
                    <span className="text-base">🏆</span>
                    <h5 className="font-extrabold text-amber-300 uppercase text-xs">
                      Championship Honors & Silverware
                    </h5>
                  </div>
                  <div className="space-y-1.5">
                    {(
                      selectedTeam.history?.honors || [
                        "🏆 Sunday League Champions (2024/2025)",
                        "🥇 Academy Super Cup Winners",
                      ]
                    ).map((h, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#09061c] border border-amber-400/20 text-white font-bold flex items-center justify-between"
                      >
                        <span>{h}</span>
                        <span className="text-[10px] text-amber-400 font-mono">Official</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All-time stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="bg-[#141029] p-3 rounded-xl border border-[#2e2554]">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">
                      All-Time League Record
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      {selectedTeam.history?.allTimeRecord || "48 Matches: 34W-8D-6L"}
                    </span>
                  </div>

                  <div className="bg-[#141029] p-3 rounded-xl border border-[#2e2554]">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">
                      Historical Win %
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {selectedTeam.history?.historicWinRate || "70.8%"}
                    </span>
                  </div>

                  <div className="bg-[#141029] p-3 rounded-xl border border-[#2e2554] col-span-2 sm:col-span-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">
                      Biggest Historic Win
                    </span>
                    <span className="font-bold text-cyan-300 text-xs">
                      {selectedTeam.history?.highestWin || "5 - 0 vs Rivals"}
                    </span>
                  </div>
                </div>

                {/* Derby Rivalry */}
                {selectedTeam.history?.derbyRival && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
                    <span className="text-gray-300">Marquee Derby Rival:</span>
                    <span className="font-bold text-rose-300">
                      {selectedTeam.history.derbyRival}
                    </span>
                  </div>
                )}

                {/* Season Log */}
                {selectedTeam.history?.seasons && (
                  <div className="bg-[#141029] p-4 rounded-2xl border border-[#2e2554] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Season-by-Season Performance Log
                    </span>
                    <div className="divide-y divide-[#2e2554]">
                      {selectedTeam.history.seasons.map((s, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white block">Season {s.season}</span>
                            <span className="text-[10px] text-gray-400">{s.note}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-cyan-300 block">{s.finish}</span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              {s.points} PTS
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SQUAD & PLAYER PORTRAITS */}
            {clubModalTab === "squad" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs uppercase flex items-center gap-1.5">
                    <span>👥</span> Official Squad Roster & Portraits
                  </span>
                  <a
                    href="/upload-photo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black text-[11px] shadow hover:scale-105 transition"
                  >
                    + Upload Player Photo
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(selectedTeam.squad || []).map((player, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center gap-3"
                    >
                      <div className="relative shrink-0">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-400 shadow"
                          />
                        ) : (
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-xs shadow"
                            style={{ backgroundColor: selectedTeam.color }}
                          >
                            #{player.number}
                          </div>
                        )}
                        {player.photoUrl && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-white block truncate">
                          {player.name}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-cyan-300">
                            {player.position}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            #{player.number}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 italic">
                  💡 Athletes: Click "+ Upload Player Photo" above to upload your official headshot
                  and update your profile across the portal.
                </p>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-[#2e2554] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
                  M-Pesa Sunday League • Official Dossier
                </span>
                {canDeleteTeam && selectedTeam && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTeam(selectedTeam.id, selectedTeam.name)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Permanently delete this club from the league"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Club</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedTeam(null);
                  setClubModalTab("overview");
                }}
                className="bg-[#141029] hover:bg-[#1f1744] text-white px-5 py-2 rounded-xl text-xs font-bold border border-[#2e2554] transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e0a26] border-2 border-emerald-400/80 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="text-base text-emerald-400">✓</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
