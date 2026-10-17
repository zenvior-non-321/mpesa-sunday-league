import React, { useState, useEffect, useMemo } from "react";
import { useRoleAccess } from "../hooks/useRoleAccess";

export interface MatchGoalEvent {
  id: number;
  team: "HOME" | "AWAY";
  scorerName: string;
  assisterName?: string;
  isOwnGoal?: boolean;
  minute?: string;
}

export interface ManOfTheMatch {
  playerName: string;
  teamName: string;
  rating: number; // e.g. 9.6
  goals: number;
  assists: number;
  shotsOnTarget?: number;
  keyPasses?: number;
  photoUrl?: string;
  highlightSummary?: string;
}

export interface MatchMetrics {
  homePossession?: number;
  awayPossession?: number;
  homeShotsOnTarget?: number;
  awayShotsOnTarget?: number;
  assists?: { player: string; team: string; count: number }[];
  goals?: { player: string; team: string; count: number }[];
}

export interface MatchFixture {
  id: number;
  matchweek: number;
  time: string;
  date: string;
  venue: string;
  homeId: number;
  awayId: number;
  homeScore: number;
  awayScore: number;
  status: "UPCOMING" | "LIVE" | "FINISHED" | "POSTPONED";
  scorers?: string;
  goalEvents?: MatchGoalEvent[];
  referee?: string;
  notes?: string;
  manOfTheMatch?: ManOfTheMatch;
  metrics?: MatchMetrics;
}

export interface Team {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  homePitch: string;
  logoUrl?: string;
}

const DEFAULT_TEAMS: Team[] = [
  {
    id: 1,
    name: "Samba Boys",
    shortCode: "SMB",
    color: "#00ff85",
    homePitch: "Samba Arena (School Lower Pitch)",
  },
  {
    id: 2,
    name: "Grade 10 A",
    shortCode: "G10A",
    color: "#00f0ff",
    homePitch: "Academy Main Stadium",
  },
  {
    id: 3,
    name: "Grade 10 B",
    shortCode: "G10B",
    color: "#ffe600",
    homePitch: "Yellow Fortress Pitch B",
  },
  {
    id: 4,
    name: "DP 2 A",
    shortCode: "DP2A",
    color: "#ff0055",
    homePitch: "Senior Arena North Pitch",
  },
  {
    id: 5,
    name: "DP 2 B",
    shortCode: "DP2B",
    color: "#9d00ff",
    homePitch: "Championship Pavilion Field",
  },
];

const DEFAULT_FIXTURES: MatchFixture[] = [
  {
    id: 1,
    matchweek: 1,
    time: "2:00 PM",
    date: "Sunday, Oct 25, 2026",
    venue: "School Pitch Arena",
    homeId: 1,
    awayId: 2,
    homeScore: 3,
    awayScore: 1,
    status: "FINISHED",
    scorers: "Kevin Omondi 14', 68', Brian Mwangi 44' | Emmanuel Kip 82'",
    referee: "Center Ref: Ian Muli (FIFA Badge)",
    goalEvents: [
      { id: 101, team: "HOME", scorerName: "Kevin Omondi", minute: "14'" },
      { id: 102, team: "HOME", scorerName: "Brian Mwangi", minute: "44'" },
      { id: 103, team: "HOME", scorerName: "Kevin Omondi", minute: "68'" },
      { id: 104, team: "AWAY", scorerName: "Emmanuel Kip", minute: "82'" },
    ],
    manOfTheMatch: {
      playerName: "Kevin Omondi",
      teamName: "Samba Boys",
      rating: 9.6,
      goals: 2,
      assists: 1,
      shotsOnTarget: 4,
      keyPasses: 3,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      highlightSummary: "Commanding masterclass: Scored a breathtaking brace (14', 68') and delivered the precision assist for the 44' winner.",
    },
    metrics: {
      homePossession: 57,
      awayPossession: 43,
      homeShotsOnTarget: 7,
      awayShotsOnTarget: 3,
      goals: [
        { player: "Kevin Omondi", team: "Samba Boys", count: 2 },
        { player: "Brian Mwangi", team: "Samba Boys", count: 1 },
        { player: "Emmanuel Kip", team: "Grade 10 A", count: 1 },
      ],
      assists: [
        { player: "Kevin Omondi", team: "Samba Boys", count: 1 },
        { player: "Dan Kiprop", team: "Samba Boys", count: 1 },
        { player: "Bradley Barasa", team: "Grade 10 A", count: 1 },
      ],
    },
  },
  {
    id: 2,
    matchweek: 1,
    time: "4:00 PM",
    date: "Sunday, Oct 25, 2026",
    venue: "Academy Main Stadium",
    homeId: 3,
    awayId: 4,
    homeScore: 2,
    awayScore: 2,
    status: "FINISHED",
    scorers: "Kelvin Njoroge 31', Chrispinus Wafula 77' | Alex Rono 19', Kelvin Korir 89'",
    referee: "Center Ref: FIFA Badge",
    goalEvents: [
      { id: 201, team: "AWAY", scorerName: "Alex Rono", minute: "19'" },
      { id: 202, team: "HOME", scorerName: "Kelvin Njoroge", minute: "31'" },
      { id: 203, team: "HOME", scorerName: "Chrispinus Wafula", minute: "77'" },
      { id: 204, team: "AWAY", scorerName: "Kelvin Korir", minute: "89'" },
    ],
    manOfTheMatch: {
      playerName: "Alex Rono",
      teamName: "DP 2 A",
      rating: 9.2,
      goals: 1,
      assists: 1,
      shotsOnTarget: 3,
      keyPasses: 4,
      photoUrl: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80",
      highlightSummary: "Crucial talismanic impact: Drilled home an electric opener at 19' and supplied the dramatic 89' equalizer assist.",
    },
    metrics: {
      homePossession: 48,
      awayPossession: 52,
      homeShotsOnTarget: 5,
      awayShotsOnTarget: 6,
      goals: [
        { player: "Kelvin Njoroge", team: "Grade 10 B", count: 1 },
        { player: "Chrispinus Wafula", team: "Grade 10 B", count: 1 },
        { player: "Alex Rono", team: "DP 2 A", count: 1 },
        { player: "Kelvin Korir", team: "DP 2 A", count: 1 },
      ],
      assists: [
        { player: "Alex Rono", team: "DP 2 A", count: 1 },
        { player: "Ian Mercer", team: "Grade 10 B", count: 1 },
      ],
    },
  },
  {
    id: 3,
    matchweek: 2,
    time: "2:00 PM",
    date: "Sunday, Nov 1, 2026",
    venue: "School Pitch Arena",
    homeId: 5,
    awayId: 1,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: FIFA Badge",
  },
  {
    id: 4,
    matchweek: 2,
    time: "4:00 PM",
    date: "Sunday, Nov 1, 2026",
    venue: "Yellow Fortress Pitch B",
    homeId: 2,
    awayId: 3,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: FIFA Badge",
  },
  {
    id: 5,
    matchweek: 3,
    time: "2:00 PM",
    date: "Sunday, Nov 8, 2026",
    venue: "Senior Arena North Pitch",
    homeId: 4,
    awayId: 5,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: FIFA Badge",
  },
  {
    id: 6,
    matchweek: 3,
    time: "4:00 PM",
    date: "Sunday, Nov 15, 2026",
    venue: "Samba Arena (School Lower Pitch)",
    homeId: 1,
    awayId: 3,
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    scorers: "",
    referee: "Center Ref: FIFA Badge",
  },
];

export function Fixtures() {
  const { currentRole, isSuperAdmin, hasRoleOrHigher } = useRoleAccess();
  const canManageFixtures =
    isSuperAdmin ||
    currentRole === "RECORDS_MANAGER" ||
    currentRole === "TECH_MANAGER" ||
    currentRole === "ASST_TECH_MANAGER" ||
    currentRole === "PRESIDENT";

  const [fixtures, setFixtures] = useState<MatchFixture[]>([]);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [selectedWeek, setSelectedWeek] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Modals state
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editingFixture, setEditingFixture] = useState<MatchFixture | null>(null);

  // New Fixture Form state
  const [newFixture, setNewFixture] = useState<{
    matchweek: number;
    homeId: number;
    awayId: number;
    date: string;
    time: string;
    venue: string;
    referee: string;
    status: MatchFixture["status"];
  }>({
    matchweek: 1,
    homeId: 1,
    awayId: 2,
    date: "Sunday, Nov 1, 2026",
    time: "2:00 PM",
    venue: "School Pitch Arena",
    referee: "FIFA Center Referee",
    status: "UPCOMING",
  });

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedFixtures) {
        const parsed = JSON.parse(storedFixtures);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFixtures(parsed);
        } else {
          setFixtures(DEFAULT_FIXTURES);
        }
      } else {
        setFixtures(DEFAULT_FIXTURES);
      }

      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
        }
      }
    } catch {
      setFixtures(DEFAULT_FIXTURES);
    }
  }, []);

  // Save fixtures helper
  const persistFixtures = (updated: MatchFixture[]) => {
    setFixtures(updated);
    try {
      localStorage.setItem("mpesa_pes_matches_v6", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save fixtures to localStorage:", e);
    }
  };

  const getTeam = (teamId: number): Team => {
    return (
      teams.find((t) => t.id === teamId) || {
        id: teamId,
        name: `Club #${teamId}`,
        shortCode: `C${teamId}`,
        color: "#00f0ff",
        homePitch: "School Pitch",
      }
    );
  };

  // Helper to resolve or compute Man of the Match
  const getFixtureMotm = (fixture: MatchFixture, home: Team, away: Team): ManOfTheMatch | null => {
    if (fixture.status !== "FINISHED") return null;
    if (fixture.manOfTheMatch) return fixture.manOfTheMatch;

    const homeWon = fixture.homeScore > fixture.awayScore;
    const awayWon = fixture.awayScore > fixture.homeScore;
    const winningTeam = homeWon ? home : awayWon ? away : home;

    const firstGoal = fixture.goalEvents?.[0];
    const topScorer = firstGoal?.scorerName || (homeWon ? "Kevin Omondi" : "Star Midfielder");

    return {
      playerName: topScorer,
      teamName: winningTeam.name,
      rating: 9.3,
      goals: Math.max(1, homeWon ? fixture.homeScore : fixture.awayScore),
      assists: 1,
      shotsOnTarget: 3,
      keyPasses: 4,
      highlightSummary: `Delivered an inspiring match-winning performance for ${winningTeam.name}, dictating pace and controlling the middle third.`,
    };
  };

  // Helper to resolve or compute key match metrics (assists/goals/possession)
  const getFixtureMetrics = (fixture: MatchFixture, home: Team, away: Team): MatchMetrics => {
    if (fixture.metrics) return fixture.metrics;

    const homeGoals = fixture.homeScore || 0;
    const awayGoals = fixture.awayScore || 0;
    const totalGoals = homeGoals + awayGoals;

    const homePossession =
      totalGoals === 0
        ? 50
        : Math.min(68, Math.max(32, Math.round(50 + (homeGoals - awayGoals) * 4)));
    const awayPossession = 100 - homePossession;

    const parsedGoals =
      fixture.goalEvents && fixture.goalEvents.length > 0
        ? fixture.goalEvents.map((g) => ({
            player: g.scorerName,
            team: g.team === "HOME" ? home.name : away.name,
            count: 1,
          }))
        : [
            ...(homeGoals > 0 ? [{ player: `${home.shortCode} Top Scorer`, team: home.name, count: homeGoals }] : []),
            ...(awayGoals > 0 ? [{ player: `${away.shortCode} Top Scorer`, team: away.name, count: awayGoals }] : []),
          ];

    const parsedAssists = [
      ...(homeGoals > 0 ? [{ player: `${home.shortCode} Playmaker`, team: home.name, count: Math.max(1, homeGoals - 1) }] : []),
      ...(awayGoals > 0 ? [{ player: `${away.shortCode} Wing Creator`, team: away.name, count: Math.max(1, awayGoals - 1) }] : []),
    ];

    return {
      homePossession,
      awayPossession,
      homeShotsOnTarget: Math.max(homeGoals + 2, 4),
      awayShotsOnTarget: Math.max(awayGoals + 2, 3),
      goals: parsedGoals,
      assists: parsedAssists,
    };
  };

  // Filter fixtures
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      const matchWeekFilter = selectedWeek === "ALL" || f.matchweek === Number(selectedWeek);
      const matchStatusFilter = selectedStatus === "ALL" || f.status === selectedStatus;
      return matchWeekFilter && matchStatusFilter;
    });
  }, [fixtures, selectedWeek, selectedStatus]);

  // Group by matchweek
  const matchweeks = useMemo(() => {
    const weeks = Array.from(new Set(fixtures.map((f) => f.matchweek))).sort((a, b) => a - b);
    return weeks.length > 0 ? weeks : [1, 2, 3, 4, 5];
  }, [fixtures]);

  // Create Fixture Handler
  const handleCreateFixture = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFixture.homeId === newFixture.awayId) {
      alert("Home team and Away team must be different!");
      return;
    }

    const created: MatchFixture = {
      id: Date.now(),
      matchweek: Number(newFixture.matchweek),
      homeId: Number(newFixture.homeId),
      awayId: Number(newFixture.awayId),
      date: newFixture.date.trim() || "Sunday Matchday",
      time: newFixture.time.trim() || "2:00 PM",
      venue:
        newFixture.venue.trim() ||
        getTeam(Number(newFixture.homeId)).homePitch ||
        "School Pitch Arena",
      referee: newFixture.referee.trim() || "Official Referee",
      homeScore: 0,
      awayScore: 0,
      status: newFixture.status,
      scorers: "",
    };

    const updated = [...fixtures, created];
    persistFixtures(updated);
    setOpenCreateModal(false);
  };

  // Edit Fixture Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFixture) return;
    if (editingFixture.homeId === editingFixture.awayId) {
      alert("Home team and Away team must be different!");
      return;
    }

    const updated = fixtures.map((f) => (f.id === editingFixture.id ? editingFixture : f));
    persistFixtures(updated);
    setOpenEditModal(false);
    setEditingFixture(null);
  };

  // Delete Fixture Handler
  const handleDeleteFixture = (fixtureId: number) => {
    const fixture = fixtures.find((f) => f.id === fixtureId);
    const label = fixture
      ? `MW ${fixture.matchweek}: ${getTeam(fixture.homeId).name} vs ${getTeam(fixture.awayId).name}`
      : `Fixture #${fixtureId}`;
    if (window.confirm(`Are you sure you want to delete this fixture?\n${label}`)) {
      const updated = fixtures.filter((f) => f.id !== fixtureId);
      persistFixtures(updated);
      if (openEditModal && editingFixture?.id === fixtureId) {
        setOpenEditModal(false);
        setEditingFixture(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black shadow">
              Official Schedule
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Total Fixtures: {fixtures.length}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mt-1">
            Championship Fixtures
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Sunday League matchday clashes across official school pitches and arenas.
          </p>
        </div>

        {canManageFixtures && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black font-black text-xs hover:shadow-lg hover:shadow-cyan-500/25 transition transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>+ Schedule New Match</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070512]/60 border border-[#2e2554] p-3 rounded-2xl">
        {/* Matchweek Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
            Week:
          </span>
          <button
            onClick={() => setSelectedWeek("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedWeek === "ALL"
                ? "bg-[#00f0ff] text-black font-black shadow-md"
                : "bg-[#141029] text-gray-300 hover:text-white"
            }`}
          >
            All Weeks
          </button>
          {matchweeks.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(String(week))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedWeek === String(week)
                  ? "bg-[#00f0ff] text-black font-black shadow-md"
                  : "bg-[#141029] text-gray-300 hover:text-white"
              }`}
            >
              MW {week}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          {["ALL", "UPCOMING", "LIVE", "FINISHED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                selectedStatus === st
                  ? "bg-gradient-to-r from-purple-500 to-[#e6007e] text-white font-black"
                  : "bg-[#141029] text-gray-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFixtures.map((fixture) => {
          const home = getTeam(fixture.homeId);
          const away = getTeam(fixture.awayId);

          return (
            <div
              key={fixture.id}
              className="bg-[#0e0a26]/90 border border-[#2e2554] hover:border-[#00f0ff]/60 rounded-3xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              {/* Fixture Top Bar: Matchweek, Date & Status */}
              <div className="flex items-center justify-between border-b border-[#2e2554]/70 pb-3 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#1a1438] text-[#00f0ff] font-extrabold text-[10px] uppercase tracking-wider border border-[#2e2554]">
                    Matchweek {fixture.matchweek}
                  </span>
                  <span className="font-semibold text-gray-300">
                    {fixture.date || "Sunday Schedule"}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="font-mono text-[#00ff85] font-bold">{fixture.time}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    fixture.status === "FINISHED"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : fixture.status === "LIVE"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {fixture.status}
                </span>
              </div>

              {/* Competing Teams & Scoreboard */}
              <div className="flex items-center justify-between py-2">
                {/* Home Club */}
                <div className="flex items-center gap-3 w-5/12">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-md border border-white/20 shrink-0 overflow-hidden relative"
                    style={{ backgroundColor: home.color }}
                  >
                    {home.logoUrl ? (
                      <img
                        src={home.logoUrl}
                        alt={home.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{home.shortCode}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-black text-sm text-white block truncate">
                      {home.name}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Home</span>
                  </div>
                </div>

                {/* Score / VS Display */}
                <div className="flex items-center justify-center w-2/12">
                  {fixture.status === "UPCOMING" ? (
                    <div className="bg-[#141029] border border-[#2e2554] px-3 py-1.5 rounded-xl text-center">
                      <span className="text-xs font-black text-[#00f0ff] uppercase tracking-wider">
                        VS
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#141029] border border-[#2e2554] px-3.5 py-1.5 rounded-xl shadow-inner font-mono">
                      <span className="text-xl font-black text-white">{fixture.homeScore}</span>
                      <span className="text-gray-500 text-xs font-bold">-</span>
                      <span className="text-xl font-black text-white">{fixture.awayScore}</span>
                    </div>
                  )}
                </div>

                {/* Away Club */}
                <div className="flex items-center justify-end gap-3 w-5/12 text-right">
                  <div className="min-w-0">
                    <span className="font-black text-sm text-white block truncate">
                      {away.name}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Away</span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-md border border-white/20 shrink-0 overflow-hidden relative"
                    style={{ backgroundColor: away.color }}
                  >
                    {away.logoUrl ? (
                      <img
                        src={away.logoUrl}
                        alt={away.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{away.shortCode}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Venue & Scorers Information */}
              <div className="flex flex-col gap-1.5 text-xs text-gray-400 pt-1">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <svg
                    className="w-3.5 h-3.5 text-purple-400 shrink-0"
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
                  <span className="truncate">
                    {fixture.venue || home.homePitch || "School Pitch"}
                  </span>
                </div>

                {fixture.scorers && (
                  <div className="p-2 bg-[#080517] rounded-xl border border-[#2e2554]/50 text-[11px] text-emerald-300 flex items-center gap-2">
                    <span className="text-amber-400">⚽</span>
                    <span className="truncate italic">{fixture.scorers}</span>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* 🌟 MAN OF THE MATCH & KEY PERFORMANCE METRICS (COMPLETED MATCHES) */}
              {/* ========================================================================= */}
              {fixture.status === "FINISHED" && (() => {
                const motm = getFixtureMotm(fixture, home, away);
                const metrics = getFixtureMetrics(fixture, home, away);
                if (!motm) return null;
                return (
                  <div className="mt-1 pt-3 border-t border-[#2e2554] space-y-3 bg-gradient-to-b from-[#120d30] via-[#0b0821] to-[#080517] p-4 rounded-2xl border border-amber-400/30 shadow-xl">
                    {/* MOTM Top Banner */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center text-xs font-black">
                          ⭐
                        </span>
                        <div>
                          <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block leading-tight">
                            Official Man of the Match
                          </span>
                          <span className="text-[9px] text-gray-400">Matchday Outstanding Performance</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-amber-400 via-yellow-300 to-[#00f0ff] text-black shadow-md shadow-amber-500/20">
                        ★ {motm.rating.toFixed(1)} Rating
                      </span>
                    </div>

                    {/* MOTM Player Card Capsule */}
                    <div className="flex items-center justify-between gap-3 bg-[#16103b] p-3 rounded-xl border border-[#2e2554]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          {motm.photoUrl ? (
                            <img
                              src={motm.photoUrl}
                              alt={motm.playerName}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center font-black text-sm border-2 border-amber-400">
                              {motm.playerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 text-xs">👑</span>
                        </div>

                        <div className="min-w-0">
                          <h5 className="font-extrabold text-sm text-white truncate">{motm.playerName}</h5>
                          <span className="text-xs text-[#00f0ff] font-bold block truncate">{motm.teamName}</span>
                        </div>
                      </div>

                      {/* Performance Metric Badges */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-center min-w-[42px]">
                          <span className="block text-[8px] uppercase font-bold text-gray-400">Goals</span>
                          <span className="font-mono font-black text-emerald-400 text-xs">⚽ {motm.goals}</span>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-center min-w-[42px]">
                          <span className="block text-[8px] uppercase font-bold text-gray-400">Assists</span>
                          <span className="font-mono font-black text-[#00f0ff] text-xs">👟 {motm.assists}</span>
                        </div>
                        {typeof motm.shotsOnTarget === "number" && (
                          <div className="hidden sm:block px-2 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-center min-w-[42px]">
                            <span className="block text-[8px] uppercase font-bold text-gray-400">Shots</span>
                            <span className="font-mono font-black text-purple-300 text-xs">🎯 {motm.shotsOnTarget}</span>
                          </div>
                        )}
                        {typeof motm.keyPasses === "number" && (
                          <div className="hidden sm:block px-2 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 text-center min-w-[42px]">
                            <span className="block text-[8px] uppercase font-bold text-gray-400">Passes</span>
                            <span className="font-mono font-black text-pink-300 text-xs">🔑 {motm.keyPasses}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {motm.highlightSummary && (
                      <p className="text-[11px] text-gray-300 italic px-3 py-2 bg-[#09061b] rounded-xl border border-white/5 leading-relaxed">
                        "{motm.highlightSummary}"
                      </p>
                    )}

                    {/* Key Performance Metrics (Goals & Assists Breakdown) */}
                    <div className="pt-2 border-t border-[#2e2554]/70 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>Key Match Performance Metrics</span>
                        <span className="text-[#00f0ff] font-mono">Ball Possession</span>
                      </div>

                      {/* Possession Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-[#080517] rounded-full h-2 flex overflow-hidden border border-[#2e2554]">
                          <div
                            className="bg-emerald-400 h-full transition-all duration-300"
                            style={{ width: `${metrics.homePossession || 50}%` }}
                            title={`${home.name}: ${metrics.homePossession || 50}%`}
                          />
                          <div
                            className="bg-[#00f0ff] h-full transition-all duration-300"
                            style={{ width: `${metrics.awayPossession || 50}%` }}
                            title={`${away.name}: ${metrics.awayPossession || 50}%`}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                          <span className="text-emerald-400">{home.shortCode} {metrics.homePossession || 50}%</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-[#00f0ff]">{metrics.awayPossession || 50}% {away.shortCode}</span>
                        </div>
                      </div>

                      {/* Goals & Key Assists Breakdown Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                        {/* Scorers */}
                        <div className="bg-[#0a071e] p-2.5 rounded-xl border border-[#2e2554]/60 space-y-1.5">
                          <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider">
                            ⚽ Goals ({metrics.goals?.reduce((s, g) => s + g.count, 0) || (fixture.homeScore + fixture.awayScore)})
                          </span>
                          <div className="space-y-1">
                            {metrics.goals && metrics.goals.length > 0 ? (
                              metrics.goals.map((g, idx) => (
                                <div key={idx} className="flex items-center justify-between text-gray-300">
                                  <span className="truncate">{g.player}</span>
                                  <span className="font-mono text-[10px] text-emerald-400 font-bold shrink-0 ml-1">
                                    {g.count > 1 ? `x${g.count}` : "1"} ({g.team.substring(0, 4)})
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-500 italic text-[10px]">No goals recorded</span>
                            )}
                          </div>
                        </div>

                        {/* Assists */}
                        <div className="bg-[#0a071e] p-2.5 rounded-xl border border-[#2e2554]/60 space-y-1.5">
                          <span className="text-[9px] uppercase font-bold text-[#00f0ff] block tracking-wider">
                            👟 Key Assists ({metrics.assists?.reduce((s, a) => s + a.count, 0) || 0})
                          </span>
                          <div className="space-y-1">
                            {metrics.assists && metrics.assists.length > 0 ? (
                              metrics.assists.map((a, idx) => (
                                <div key={idx} className="flex items-center justify-between text-gray-300">
                                  <span className="truncate">{a.player}</span>
                                  <span className="font-mono text-[10px] text-[#00f0ff] font-bold shrink-0 ml-1">
                                    {a.count > 1 ? `x${a.count}` : "1"} ({a.team.substring(0, 4)})
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-500 italic text-[10px]">No assists recorded</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Admin Action Buttons (Edit & Delete) */}
              {canManageFixtures && (
                <div className="pt-3 border-t border-[#2e2554]/60 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">ID: #{fixture.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingFixture({ ...fixture });
                        setOpenEditModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-extrabold text-xs transition flex items-center gap-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit Match & Score</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFixture(fixture.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-xs transition"
                      title="Delete this match fixture"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFixtures.length === 0 && (
        <div className="text-center py-16 bg-[#070512]/60 rounded-3xl border border-dashed border-[#2e2554] space-y-2">
          <p className="text-gray-400 font-bold">No match fixtures found matching this filter.</p>
          {canManageFixtures && (
            <button
              onClick={() => setOpenCreateModal(true)}
              className="text-xs text-[#00f0ff] hover:underline font-bold"
            >
              + Create a new match fixture now
            </button>
          )}
        </div>
      )}

      {/* CREATE FIXTURE MODAL */}
      {openCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] rounded-3xl max-w-lg w-full p-6 border-2 border-[#00f0ff]/50 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div>
                <h3 className="text-xl font-black text-white uppercase">
                  Schedule New Match Fixture
                </h3>
                <p className="text-xs text-[#00f0ff]">
                  Create official fixture for the championship schedule
                </p>
              </div>
              <button
                onClick={() => setOpenCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFixture} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Matchweek</label>
                  <select
                    value={newFixture.matchweek}
                    onChange={(e) =>
                      setNewFixture({ ...newFixture, matchweek: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                      <option key={w} value={w}>
                        Matchweek {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Kickoff Time
                  </label>
                  <input
                    type="text"
                    value={newFixture.time}
                    onChange={(e) => setNewFixture({ ...newFixture, time: e.target.value })}
                    placeholder="2:00 PM / 4:00 PM"
                    required
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Home Club</label>
                  <select
                    value={newFixture.homeId}
                    onChange={(e) =>
                      setNewFixture({ ...newFixture, homeId: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Away Club</label>
                  <select
                    value={newFixture.awayId}
                    onChange={(e) =>
                      setNewFixture({ ...newFixture, awayId: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Match Date</label>
                  <input
                    type="text"
                    value={newFixture.date}
                    onChange={(e) => setNewFixture({ ...newFixture, date: e.target.value })}
                    placeholder="Sunday, Nov 1, 2026"
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Venue / Ground
                  </label>
                  <input
                    type="text"
                    value={newFixture.venue}
                    onChange={(e) => setNewFixture({ ...newFixture, venue: e.target.value })}
                    placeholder="School Pitch Arena"
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">
                  Assigned Referee
                </label>
                <input
                  type="text"
                  value={newFixture.referee}
                  onChange={(e) => setNewFixture({ ...newFixture, referee: e.target.value })}
                  placeholder="Official Referee (FIFA Badge)"
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setOpenCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black font-black hover:brightness-110 shadow-lg"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FIXTURE MODAL */}
      {openEditModal && editingFixture && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] rounded-3xl max-w-lg w-full p-6 border-2 border-[#00f0ff]/50 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div>
                <h3 className="text-xl font-black text-white uppercase">Edit Match & Scores</h3>
                <p className="text-xs text-[#00f0ff]">
                  Update scoreline, date, time, status, or delete
                </p>
              </div>
              <button
                onClick={() => setOpenEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Score HUD */}
              <div className="p-4 bg-[#141029] border border-[#2e2554] rounded-2xl flex items-center justify-between gap-4">
                <div className="text-center w-5/12">
                  <span className="font-extrabold text-white block truncate mb-1">
                    {getTeam(editingFixture.homeId).name}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={editingFixture.homeScore}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, homeScore: Number(e.target.value) })
                    }
                    className="w-16 text-center bg-[#080517] border border-[#2e2554] rounded-xl py-1 text-2xl font-black text-white font-mono"
                  />
                </div>

                <span className="text-lg font-black text-gray-400">-</span>

                <div className="text-center w-5/12">
                  <span className="font-extrabold text-white block truncate mb-1">
                    {getTeam(editingFixture.awayId).name}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={editingFixture.awayScore}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, awayScore: Number(e.target.value) })
                    }
                    className="w-16 text-center bg-[#080517] border border-[#2e2554] rounded-xl py-1 text-2xl font-black text-white font-mono"
                  />
                </div>
              </div>

              {/* Status and Matchweek */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Status</label>
                  <select
                    value={editingFixture.status}
                    onChange={(e) =>
                      setEditingFixture({
                        ...editingFixture,
                        status: e.target.value as MatchFixture["status"],
                      })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE</option>
                    <option value="FINISHED">FINISHED</option>
                    <option value="POSTPONED">POSTPONED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Matchweek</label>
                  <select
                    value={editingFixture.matchweek}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, matchweek: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                      <option key={w} value={w}>
                        Matchweek {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Time & Venue */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Kickoff Time
                  </label>
                  <input
                    type="text"
                    value={editingFixture.time}
                    onChange={(e) => setEditingFixture({ ...editingFixture, time: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Kickoff Date
                  </label>
                  <input
                    type="text"
                    value={editingFixture.date}
                    onChange={(e) => setEditingFixture({ ...editingFixture, date: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">
                  Venue / Pitch
                </label>
                <input
                  type="text"
                  value={editingFixture.venue}
                  onChange={(e) => setEditingFixture({ ...editingFixture, venue: e.target.value })}
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">
                  Goalscorers Summary
                </label>
                <input
                  type="text"
                  value={editingFixture.scorers || ""}
                  onChange={(e) =>
                    setEditingFixture({ ...editingFixture, scorers: e.target.value })
                  }
                  placeholder="e.g. Kevin 24', Emmanuel 68'"
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Man of the Match & Metrics Editor for Completed Matches */}
              {editingFixture.status === "FINISHED" && (
                <div className="p-3 bg-[#080517] border border-amber-400/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-amber-300 font-black uppercase text-[11px]">
                    <span>⭐</span>
                    <span>Assign Man of the Match & Metrics</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-gray-400 text-[10px] font-bold uppercase mb-1">
                        MOTM Player Name
                      </label>
                      <input
                        type="text"
                        value={editingFixture.manOfTheMatch?.playerName || ""}
                        onChange={(e) =>
                          setEditingFixture({
                            ...editingFixture,
                            manOfTheMatch: {
                              playerName: e.target.value,
                              teamName:
                                editingFixture.manOfTheMatch?.teamName ||
                                getTeam(editingFixture.homeId).name,
                              rating: editingFixture.manOfTheMatch?.rating || 9.4,
                              goals: editingFixture.manOfTheMatch?.goals || 1,
                              assists: editingFixture.manOfTheMatch?.assists || 1,
                              shotsOnTarget: editingFixture.manOfTheMatch?.shotsOnTarget || 3,
                              highlightSummary:
                                editingFixture.manOfTheMatch?.highlightSummary ||
                                "Star performance commanding the matchday.",
                            },
                          })
                        }
                        placeholder="e.g. Kevin Omondi"
                        className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-[10px] font-bold uppercase mb-1">
                        MOTM Rating (1.0 - 10.0)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        value={editingFixture.manOfTheMatch?.rating || 9.5}
                        onChange={(e) =>
                          setEditingFixture({
                            ...editingFixture,
                            manOfTheMatch: {
                              playerName: editingFixture.manOfTheMatch?.playerName || "Star Player",
                              teamName:
                                editingFixture.manOfTheMatch?.teamName ||
                                getTeam(editingFixture.homeId).name,
                              rating: Number(e.target.value),
                              goals: editingFixture.manOfTheMatch?.goals || 1,
                              assists: editingFixture.manOfTheMatch?.assists || 0,
                              shotsOnTarget: editingFixture.manOfTheMatch?.shotsOnTarget || 3,
                              highlightSummary: editingFixture.manOfTheMatch?.highlightSummary,
                            },
                          })
                        }
                        className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-gray-400 text-[10px] font-bold uppercase mb-1">
                        MOTM Goals Scored
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingFixture.manOfTheMatch?.goals ?? 1}
                        onChange={(e) =>
                          setEditingFixture({
                            ...editingFixture,
                            manOfTheMatch: {
                              playerName: editingFixture.manOfTheMatch?.playerName || "Star Player",
                              teamName:
                                editingFixture.manOfTheMatch?.teamName ||
                                getTeam(editingFixture.homeId).name,
                              rating: editingFixture.manOfTheMatch?.rating || 9.4,
                              goals: Number(e.target.value),
                              assists: editingFixture.manOfTheMatch?.assists || 0,
                              shotsOnTarget: editingFixture.manOfTheMatch?.shotsOnTarget || 3,
                            },
                          })
                        }
                        className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-[10px] font-bold uppercase mb-1">
                        MOTM Key Assists
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingFixture.manOfTheMatch?.assists ?? 1}
                        onChange={(e) =>
                          setEditingFixture({
                            ...editingFixture,
                            manOfTheMatch: {
                              playerName: editingFixture.manOfTheMatch?.playerName || "Star Player",
                              teamName:
                                editingFixture.manOfTheMatch?.teamName ||
                                getTeam(editingFixture.homeId).name,
                              rating: editingFixture.manOfTheMatch?.rating || 9.4,
                              goals: editingFixture.manOfTheMatch?.goals || 0,
                              assists: Number(e.target.value),
                              shotsOnTarget: editingFixture.manOfTheMatch?.shotsOnTarget || 3,
                            },
                          })
                        }
                        className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-[10px] font-bold uppercase mb-1">
                      Performance Summary / Highlight
                    </label>
                    <input
                      type="text"
                      value={editingFixture.manOfTheMatch?.highlightSummary || ""}
                      onChange={(e) =>
                        setEditingFixture({
                          ...editingFixture,
                          manOfTheMatch: {
                            playerName: editingFixture.manOfTheMatch?.playerName || "Star Player",
                            teamName:
                              editingFixture.manOfTheMatch?.teamName ||
                              getTeam(editingFixture.homeId).name,
                            rating: editingFixture.manOfTheMatch?.rating || 9.4,
                            goals: editingFixture.manOfTheMatch?.goals || 1,
                            assists: editingFixture.manOfTheMatch?.assists || 0,
                            shotsOnTarget: editingFixture.manOfTheMatch?.shotsOnTarget || 3,
                            highlightSummary: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Scored crucial brace and dictated midfield tempo"
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => handleDeleteFixture(editingFixture.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete Fixture</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenEditModal(false)}
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black font-black hover:brightness-110 shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
