// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { getCurrentRbacUser } from "../lib/rbacSystem";
import { LeagueCalendarView } from "./LeagueCalendarView";
import { MatchMvpVoting } from "./MatchMvpVoting";
import { MatchNotificationDispatch } from "./MatchNotificationDispatch";
import { OfficialMatchSheetModal } from "./OfficialMatchSheetModal";
import { Trophy, Mail, Trash2, FileText, CheckCircle2 } from "lucide-react";

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

import {
  DEFAULT_TEAMS,
  DEFAULT_FIXTURES,
  isTeamDeleted,
  sanitizeTeamsList,
} from "../lib/fixturesData";

export { DEFAULT_TEAMS, DEFAULT_FIXTURES };

export function Fixtures() {
  const { currentRole, isSuperAdmin } = useRoleAccess();
  const [rbacRole, setRbacRole] = useState<string>("public");

  useEffect(() => {
    const updateRole = () => {
      const user = getCurrentRbacUser();
      setRbacRole(user?.role || "public");
    };
    updateRole();
    window.addEventListener("mpesa_rbac_changed", updateRole);
    window.addEventListener("mpesa_role_changed", updateRole);
    window.addEventListener("storage", updateRole);
    return () => {
      window.removeEventListener("mpesa_rbac_changed", updateRole);
      window.removeEventListener("mpesa_role_changed", updateRole);
      window.removeEventListener("storage", updateRole);
    };
  }, []);

  // Public viewers and students are strictly read-only spectators (scores, fixtures, status).
  // Editing, creating, quick closing, and deleting matches is reserved for Board Members & Admins.
  const canManageFixtures =
    rbacRole !== "public" &&
    (isSuperAdmin ||
      rbacRole === "admin" ||
      (rbacRole === "board" &&
        (currentRole === "RECORDS_MANAGER" ||
          currentRole === "TECH_MANAGER" ||
          currentRole === "ASST_TECH_MANAGER" ||
          currentRole === "PRESIDENT")));

  const [fixtures, setFixtures] = useState<MatchFixture[]>([]);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [selectedWeek, setSelectedWeek] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Deletion modal state (in-app confirmation, NO window.confirm)
  const [fixtureToDelete, setFixtureToDelete] = useState<MatchFixture | null>(null);
  const [matchweekToDelete, setMatchweekToDelete] = useState<number | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);

  // MVP & 24h Alert Modals
  const [activeMvpMatchId, setActiveMvpMatchId] = useState<number | null>(null);
  const [activeAlertMatchId, setActiveAlertMatchId] = useState<number | null>(null);
  const [showMvpPanel, setShowMvpPanel] = useState<boolean>(false);
  const [showAlertPanel, setShowAlertPanel] = useState<boolean>(false);

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
    homeId: 6,
    awayId: 7,
    date: "Sunday, Nov 1, 2026",
    time: "2:00 PM",
    venue: "School Pitch Arena",
    referee: "FIFA Center Referee",
    status: "UPCOMING",
  });

  const [selectedMatchSheetFixture, setSelectedMatchSheetFixture] = useState<MatchFixture | null>(null);

  // Load from localStorage or defaults with smart merging
  useEffect(() => {
    try {
      const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
      const storedDeletedFixtures = new Set<number>(
        JSON.parse(localStorage.getItem("mpesa_pes_deleted_fixtures_v6") || "[]"),
      );

      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      const initialTeams = storedTeams ? JSON.parse(storedTeams) : DEFAULT_TEAMS;
      const cleanTeams = sanitizeTeamsList(
        Array.isArray(initialTeams) ? initialTeams : DEFAULT_TEAMS,
      );
      setTeams(cleanTeams);

      const activeTeamIds = new Set(cleanTeams.map((t) => t.id));

      if (storedFixtures) {
        const parsed: MatchFixture[] = JSON.parse(storedFixtures);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((f: MatchFixture) => f.id));
          const missing = DEFAULT_FIXTURES.filter(
            (df) =>
              !existingIds.has(df.id) &&
              !storedDeletedFixtures.has(df.id) &&
              activeTeamIds.has(df.homeId) &&
              activeTeamIds.has(df.awayId),
          );
          const combined = [...parsed, ...missing].filter(
            (f) =>
              !storedDeletedFixtures.has(f.id) &&
              activeTeamIds.has(f.homeId) &&
              activeTeamIds.has(f.awayId) &&
              !isTeamDeleted(f.homeId) &&
              !isTeamDeleted(f.awayId),
          );
          setFixtures(combined);
        } else {
          setFixtures(
            DEFAULT_FIXTURES.filter(
              (df) =>
                !storedDeletedFixtures.has(df.id) &&
                activeTeamIds.has(df.homeId) &&
                activeTeamIds.has(df.awayId),
            ),
          );
        }
      } else {
        setFixtures(
          DEFAULT_FIXTURES.filter(
            (df) =>
              !storedDeletedFixtures.has(df.id) &&
              activeTeamIds.has(df.homeId) &&
              activeTeamIds.has(df.awayId),
          ),
        );
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

  const showToast = (msg: string) => {
    setDeleteSuccessToast(msg);
    setTimeout(() => setDeleteSuccessToast(null), 4000);
  };

  // Close and conclude match: locks in scoreline as final and marks status as FINISHED
  const handleQuickCloseMatch = (fixture: MatchFixture) => {
    const homeTeam = getTeam(fixture.homeId).name;
    const awayTeam = getTeam(fixture.awayId).name;
    const updated = fixtures.map((f) => {
      if (f.id === fixture.id) {
        return {
          ...f,
          status: "FINISHED" as const,
          homeScore: f.homeScore ?? 0,
          awayScore: f.awayScore ?? 0,
        };
      }
      return f;
    });
    persistFixtures(updated);
    showToast(
      `✓ Matchweek ${fixture.matchweek}: ${homeTeam} vs ${awayTeam} officially closed! Scoreline certified.`,
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("mpesa_fixtures_updated"));
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
    const topScorer =
      firstGoal?.scorerName || (homeWon ? "Wokabi" : "Elly Adams Otieno");

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
            ...(homeGoals > 0
              ? [{ player: `${home.shortCode} Top Scorer`, team: home.name, count: homeGoals }]
              : []),
            ...(awayGoals > 0
              ? [{ player: `${away.shortCode} Top Scorer`, team: away.name, count: awayGoals }]
              : []),
          ];

    const parsedAssists = [
      ...(homeGoals > 0
        ? [
            {
              player: `${home.shortCode} Playmaker`,
              team: home.name,
              count: Math.max(1, homeGoals - 1),
            },
          ]
        : []),
      ...(awayGoals > 0
        ? [
            {
              player: `${away.shortCode} Wing Creator`,
              team: away.name,
              count: Math.max(1, awayGoals - 1),
            },
          ]
        : []),
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
      setDeleteSuccessToast("⚠️ Home team and Away team must be different!");
      setTimeout(() => setDeleteSuccessToast(null), 4000);
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
      setDeleteSuccessToast("⚠️ Home team and Away team must be different!");
      setTimeout(() => setDeleteSuccessToast(null), 4000);
      return;
    }

    const updated = fixtures.map((f) => (f.id === editingFixture.id ? editingFixture : f));
    persistFixtures(updated);
    setOpenEditModal(false);
    setEditingFixture(null);
  };

  // Trigger Delete confirmation modal (in-app dialog, NO window.confirm)
  const promptDeleteFixture = (fixture: MatchFixture) => {
    setFixtureToDelete(fixture);
  };

  // Perform confirmed deletion
  const confirmDeleteFixture = () => {
    if (!fixtureToDelete) return;
    const targetId = fixtureToDelete.id;
    const homeTeam = getTeam(fixtureToDelete.homeId).name;
    const awayTeam = getTeam(fixtureToDelete.awayId).name;
    const week = fixtureToDelete.matchweek;

    const updated = fixtures.filter((f) => f.id !== targetId);
    persistFixtures(updated);

    try {
      const storedDeleted: number[] = JSON.parse(
        localStorage.getItem("mpesa_pes_deleted_fixtures_v6") || "[]",
      );
      if (!storedDeleted.includes(targetId)) {
        storedDeleted.push(targetId);
        localStorage.setItem("mpesa_pes_deleted_fixtures_v6", JSON.stringify(storedDeleted));
      }
    } catch {
      // Ignore
    }

    setFixtureToDelete(null);
    if (openEditModal && editingFixture?.id === targetId) {
      setOpenEditModal(false);
      setEditingFixture(null);
    }

    setDeleteSuccessToast(`✓ Fixture MW ${week}: ${homeTeam} vs ${awayTeam} successfully deleted.`);
    setTimeout(() => {
      setDeleteSuccessToast(null);
    }, 4000);
  };

  // Perform confirmed deletion of an entire Matchweek
  const confirmDeleteMatchweek = () => {
    if (matchweekToDelete === null) return;
    const week = matchweekToDelete;
    const targetFixtures = fixtures.filter((f) => f.matchweek === week);
    const targetIds = targetFixtures.map((f) => f.id);

    const updated = fixtures.filter((f) => f.matchweek !== week);
    persistFixtures(updated);

    try {
      const storedDeleted: number[] = JSON.parse(
        localStorage.getItem("mpesa_pes_deleted_fixtures_v6") || "[]",
      );
      targetIds.forEach((id) => {
        if (!storedDeleted.includes(id)) {
          storedDeleted.push(id);
        }
      });
      localStorage.setItem("mpesa_pes_deleted_fixtures_v6", JSON.stringify(storedDeleted));
    } catch {
      // Ignore
    }

    setMatchweekToDelete(null);
    if (selectedWeek === String(week)) {
      setSelectedWeek("ALL");
    }
    setDeleteSuccessToast(
      `✓ Matchweek ${week} and all ${targetFixtures.length} of its fixtures permanently deleted.`,
    );
    setTimeout(() => {
      setDeleteSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {deleteSuccessToast && (
        <div className="bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 p-3.5 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span>🗑️</span>
            <span>{deleteSuccessToast}</span>
          </div>
          <button
            onClick={() => setDeleteSuccessToast(null)}
            className="text-emerald-400 hover:text-white text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}

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

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle: List vs Interactive Calendar */}
          <div className="flex items-center gap-1 bg-[#141029] border border-[#2e2554] p-1 rounded-2xl shadow-inner">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Season Calendar</span>
            </button>
          </div>

          {/* Match MVP Balloting Button */}
          <button
            onClick={() => setShowMvpPanel(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/30 text-xs font-black transition cursor-pointer shadow"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Match MVP Ballots</span>
          </button>

          {/* 24-Hour Notification Button */}
          {canManageFixtures && (
            <button
              onClick={() => setShowAlertPanel(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cyan-400/15 hover:bg-cyan-400 text-cyan-300 hover:text-black border border-cyan-400/30 text-xs font-black transition cursor-pointer shadow"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>24h Pre-Match Alerts</span>
            </button>
          )}

          {canManageFixtures && (
            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black font-black text-xs hover:shadow-lg hover:shadow-cyan-500/25 transition transform active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>+ Schedule Match</span>
            </button>
          )}
        </div>
      </div>

      {/* Season Calendar View vs List View */}
      {viewMode === "calendar" ? (
        <LeagueCalendarView
          fixtures={fixtures}
          teams={teams}
          onSelectFixture={(f) => {
            if (canManageFixtures) {
              setEditingFixture({ ...f });
              setOpenEditModal(true);
            }
          }}
        />
      ) : (
        <>
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

              {canManageFixtures && selectedWeek !== "ALL" && (
                <button
                  onClick={() => setMatchweekToDelete(Number(selectedWeek))}
                  className="ml-auto px-3 py-1.5 rounded-xl text-xs font-black bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition flex items-center gap-1.5 shrink-0 shadow cursor-pointer whitespace-nowrap"
                  title={`Permanently delete all fixtures in Matchweek ${selectedWeek}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete MW {selectedWeek}</span>
                </button>
              )}
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
                          <span className="text-xl font-black text-white">
                            {fixture.homeScore ?? 0}
                          </span>
                          <span className="text-gray-500 text-xs font-bold">-</span>
                          <span className="text-xl font-black text-white">
                            {fixture.awayScore ?? 0}
                          </span>
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
                  {fixture.status === "FINISHED" &&
                    (() => {
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
                                <span className="text-[9px] text-gray-400">
                                  Matchday Outstanding Performance
                                </span>
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
                                <h5 className="font-extrabold text-sm text-white truncate">
                                  {motm.playerName}
                                </h5>
                                <span className="text-xs text-[#00f0ff] font-bold block truncate">
                                  {motm.teamName}
                                </span>
                              </div>
                            </div>

                            {/* Performance Metric Badges */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-center min-w-[42px]">
                                <span className="block text-[8px] uppercase font-bold text-gray-400">
                                  Goals
                                </span>
                                <span className="font-mono font-black text-emerald-400 text-xs">
                                  ⚽ {motm.goals}
                                </span>
                              </div>
                              <div className="px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-center min-w-[42px]">
                                <span className="block text-[8px] uppercase font-bold text-gray-400">
                                  Assists
                                </span>
                                <span className="font-mono font-black text-[#00f0ff] text-xs">
                                  👟 {motm.assists}
                                </span>
                              </div>
                              {typeof motm.shotsOnTarget === "number" && (
                                <div className="hidden sm:block px-2 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-center min-w-[42px]">
                                  <span className="block text-[8px] uppercase font-bold text-gray-400">
                                    Shots
                                  </span>
                                  <span className="font-mono font-black text-purple-300 text-xs">
                                    🎯 {motm.shotsOnTarget}
                                  </span>
                                </div>
                              )}
                              {typeof motm.keyPasses === "number" && (
                                <div className="hidden sm:block px-2 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 text-center min-w-[42px]">
                                  <span className="block text-[8px] uppercase font-bold text-gray-400">
                                    Passes
                                  </span>
                                  <span className="font-mono font-black text-pink-300 text-xs">
                                    🔑 {motm.keyPasses}
                                  </span>
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
                                <span className="text-emerald-400">
                                  {home.shortCode} {metrics.homePossession || 50}%
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-[#00f0ff]">
                                  {metrics.awayPossession || 50}% {away.shortCode}
                                </span>
                              </div>
                            </div>

                            {/* Goals & Key Assists Breakdown Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                              {/* Scorers */}
                              <div className="bg-[#0a071e] p-2.5 rounded-xl border border-[#2e2554]/60 space-y-1.5">
                                <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider">
                                  ⚽ Goals (
                                  {metrics.goals?.reduce((s, g) => s + g.count, 0) ||
                                    fixture.homeScore + fixture.awayScore}
                                  )
                                </span>
                                <div className="space-y-1">
                                  {metrics.goals && metrics.goals.length > 0 ? (
                                    metrics.goals.map((g, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between text-gray-300"
                                      >
                                        <span className="truncate">{g.player}</span>
                                        <span className="font-mono text-[10px] text-emerald-400 font-bold shrink-0 ml-1">
                                          {g.count > 1 ? `x${g.count}` : "1"} (
                                          {g.team.substring(0, 4)})
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-gray-500 italic text-[10px]">
                                      No goals recorded
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Assists */}
                              <div className="bg-[#0a071e] p-2.5 rounded-xl border border-[#2e2554]/60 space-y-1.5">
                                <span className="text-[9px] uppercase font-bold text-[#00f0ff] block tracking-wider">
                                  👟 Key Assists (
                                  {metrics.assists?.reduce((s, a) => s + a.count, 0) || 0})
                                </span>
                                <div className="space-y-1">
                                  {metrics.assists && metrics.assists.length > 0 ? (
                                    metrics.assists.map((a, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between text-gray-300"
                                      >
                                        <span className="truncate">{a.player}</span>
                                        <span className="font-mono text-[10px] text-[#00f0ff] font-bold shrink-0 ml-1">
                                          {a.count > 1 ? `x${a.count}` : "1"} (
                                          {a.team.substring(0, 4)})
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-gray-500 italic text-[10px]">
                                      No assists recorded
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  {/* Fixture Card Action Bar */}
                  <div className="pt-3 border-t border-[#2e2554]/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveMvpMatchId(fixture.id)}
                        className="px-2.5 py-1 rounded-xl bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black font-extrabold text-[11px] transition flex items-center gap-1 shadow-sm cursor-pointer"
                        title="Vote for Match MVP"
                      >
                        <Trophy className="w-3 h-3" />
                        <span>MVP Vote</span>
                      </button>

                      {fixture.status === "UPCOMING" && (
                        <button
                          onClick={() => setActiveAlertMatchId(fixture.id)}
                          className="px-2.5 py-1 rounded-xl bg-cyan-400/15 hover:bg-cyan-400 text-cyan-300 hover:text-black font-extrabold text-[11px] transition flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Preview & Send 24h Match Notification Email"
                        >
                          <Mail className="w-3 h-3" />
                          <span>24h Alert</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedMatchSheetFixture(fixture)}
                        className="px-2.5 py-1 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 font-extrabold text-[11px] transition flex items-center gap-1 cursor-pointer border border-indigo-500/30"
                        title="View official FKF/FIFA match sheet and download PDF"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Match Sheet (PDF)</span>
                      </button>
                    </div>

                    {canManageFixtures && (

                      <div className="flex items-center gap-1.5 ml-auto">
                        {fixture.status !== "FINISHED" ? (
                          <button
                            type="button"
                            onClick={() => handleQuickCloseMatch(fixture)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-extrabold text-[11px] transition flex items-center gap-1 cursor-pointer border border-emerald-500/30"
                            title="Conclude and close this match fixture (locks in final score)"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Close Match</span>
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Closed</span>
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setEditingFixture({ ...fixture });
                            setOpenEditModal(true);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-extrabold text-[11px] transition flex items-center gap-1 cursor-pointer"
                        >
                          <svg
                            className="w-3 h-3"
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
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => promptDeleteFixture(fixture)}
                          className="px-2 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-[11px] transition cursor-pointer"
                          title="Delete this match fixture"
                        >
                          <svg
                            className="w-3 h-3"
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFixtures.length === 0 && (
            <div className="text-center py-16 bg-[#070512]/60 rounded-3xl border border-dashed border-[#2e2554] space-y-2">
              <p className="text-gray-400 font-bold">
                No match fixtures found matching this filter.
              </p>
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
        </>
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
                  placeholder="e.g. Wokabi 24', Elvis Kingoo 68'"
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
                        placeholder="e.g. Wokabi"
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
                  onClick={() => promptDeleteFixture(editingFixture)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
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
                  {editingFixture.status !== "FINISHED" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFixture({ ...editingFixture, status: "FINISHED" });
                        showToast("Match status set to FINISHED. Click Save Changes to finalize.");
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-extrabold transition flex items-center gap-1.5 cursor-pointer border border-emerald-500/30 text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conclude & Close</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFixture({ ...editingFixture, status: "UPCOMING" });
                        showToast("Match status reopened to UPCOMING.");
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-extrabold transition flex items-center gap-1.5 cursor-pointer border border-amber-500/30 text-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reopen Match</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenEditModal(false)}
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black font-black hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL FOR DELETING FIXTURES (NO WINDOW.CONFIRM) */}
      {fixtureToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] rounded-3xl max-w-md w-full p-6 border-2 border-rose-500/60 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-xl shrink-0">
                🗑️
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase leading-tight">
                  Delete Match Fixture
                </h3>
                <span className="text-xs text-rose-400 font-bold">Permanent Schedule Removal</span>
              </div>
            </div>

            <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400 font-bold uppercase text-[10px]">
                <span>Matchweek {fixtureToDelete.matchweek}</span>
                <span className="font-mono text-[#00f0ff]">{fixtureToDelete.time}</span>
              </div>
              <div className="text-sm font-black text-white flex items-center justify-between">
                <span>{getTeam(fixtureToDelete.homeId).name}</span>
                <span className="text-gray-500 text-xs font-normal">vs</span>
                <span>{getTeam(fixtureToDelete.awayId).name}</span>
              </div>
              <div className="text-[11px] text-gray-400 pt-1 border-t border-[#2e2554]">
                📍 {fixtureToDelete.venue || getTeam(fixtureToDelete.homeId).homePitch}
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete this fixture? This will update league
              standings, match schedules, and results immediately across all workspaces.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFixtureToDelete(null)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteFixture}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-rose-500/25 transition cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Entire Matchweek Confirmation Modal */}
      {matchweekToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e0a26] border-2 border-rose-500/50 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase leading-tight">
                  Delete Matchweek {matchweekToDelete}
                </h3>
                <span className="text-xs text-rose-400 font-bold">
                  Bulk Schedule Removal (
                  {fixtures.filter((f) => f.matchweek === matchweekToDelete).length} matches)
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2 text-xs">
              <p className="text-gray-300">
                You are about to permanently delete <strong>all fixtures</strong> scheduled for{" "}
                <span className="text-rose-400 font-bold">Matchweek {matchweekToDelete}</span>.
              </p>
              <div className="space-y-1 pt-1 text-[11px] text-gray-400 font-mono">
                {fixtures
                  .filter((f) => f.matchweek === matchweekToDelete)
                  .map((f) => (
                    <div key={f.id} className="flex justify-between">
                      <span>
                        • {getTeam(f.homeId).shortCode} vs {getTeam(f.awayId).shortCode}
                      </span>
                      <span>{f.time}</span>
                    </div>
                  ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              This action cannot be undone. Standings, calendars, and leaderboards will recompute
              immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMatchweekToDelete(null)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMatchweek}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-rose-500/25 transition cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All MW {matchweekToDelete} Matches</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match MVP Voting Modal */}
      {(showMvpPanel || activeMvpMatchId !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-5xl w-full my-8">
            <button
              onClick={() => {
                setShowMvpPanel(false);
                setActiveMvpMatchId(null);
              }}
              className="absolute -top-3 -right-3 z-50 w-9 h-9 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shadow-lg hover:bg-rose-600 transition"
              title="Close MVP Voting"
            >
              ✕
            </button>
            <MatchMvpVoting
              initialMatchId={activeMvpMatchId || 1}
              onClose={() => {
                setShowMvpPanel(false);
                setActiveMvpMatchId(null);
              }}
            />
          </div>
        </div>
      )}

      {/* 24-Hour Pre-Match Alert Dispatcher Modal */}
      {(showAlertPanel || activeAlertMatchId !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-5xl w-full my-8">
            <button
              onClick={() => {
                setShowAlertPanel(false);
                setActiveAlertMatchId(null);
              }}
              className="absolute -top-3 -right-3 z-50 w-9 h-9 rounded-full bg-rose-500 text-white font-black flex items-center justify-center shadow-lg hover:bg-rose-600 transition"
              title="Close Alerts"
            >
              ✕
            </button>
            <MatchNotificationDispatch />
          </div>
        </div>
      )}


      {/* Official Match Sheet Modal (Print / PDF) */}
      {selectedMatchSheetFixture && (
        <OfficialMatchSheetModal
          isOpen={!!selectedMatchSheetFixture}
          onClose={() => setSelectedMatchSheetFixture(null)}
          fixture={selectedMatchSheetFixture}
          teams={teams}
        />
      )}
    </div>
  );
}


