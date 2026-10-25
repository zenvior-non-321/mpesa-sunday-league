import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Trophy,
  Filter,
  CheckCircle2,
  CalendarCheck2,
  PlusCircle,
  X,
  Trash2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type { MatchFixture, Team } from "./Fixtures";
import { useRoleAccess } from "../hooks/useRoleAccess";
import {
  getLeagueActivities,
  createLeagueActivity,
  deleteLeagueActivity,
  CATEGORY_CONFIG,
  type LeagueActivity,
  type ActivityCategory,
} from "../lib/calendarActivities";

interface LeagueCalendarViewProps {
  fixtures: MatchFixture[];
  teams: Team[];
  onSelectFixture?: (fixture: MatchFixture) => void;
}

export function LeagueCalendarView({ fixtures, teams, onSelectFixture }: LeagueCalendarViewProps) {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const canAdminCalendar = isSuperAdmin || currentRole !== "GUEST";

  // Calendar month state (default to October 2026 where league fixtures are active)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-10-25"); // Oct 25, 2026 matchday
  const [teamFilter, setTeamFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Activities state
  const [activities, setActivities] = useState<LeagueActivity[]>([]);
  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New activity form state
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityCategory, setNewActivityCategory] = useState<ActivityCategory>("TRAINING");
  const [newActivityDate, setNewActivityDate] = useState(selectedDateStr);
  const [newActivityTime, setNewActivityTime] = useState("16:00 - 18:00");
  const [newActivityVenue, setNewActivityVenue] = useState("Academy Main Stadium Ground");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setActivities(getLeagueActivities());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  // Helper to parse fixture date into YYYY-MM-DD
  const parseFixtureDate = (fixture: MatchFixture): string => {
    const raw = fixture.date;
    if (!raw) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    const parsed = Date.parse(raw);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    const mwMap: Record<number, string> = {
      1: "2026-10-25",
      2: "2026-11-01",
      3: "2026-11-08",
      4: "2026-11-15",
      5: "2026-11-22",
      6: "2026-11-29",
    };
    return mwMap[fixture.matchweek] || "2026-10-25";
  };

  // Map of date string -> MatchFixture[]
  const fixturesByDate = useMemo(() => {
    const map = new Map<string, MatchFixture[]>();
    for (const f of fixtures) {
      if (teamFilter !== "ALL" && f.homeId !== teamFilter && f.awayId !== teamFilter) {
        continue;
      }
      if (statusFilter !== "ALL" && f.status !== statusFilter) {
        continue;
      }

      const dateStr = parseFixtureDate(f);
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)!.push(f);
    }
    return map;
  }, [fixtures, teamFilter, statusFilter]);

  // Map of date string -> LeagueActivity[]
  const activitiesByDate = useMemo(() => {
    const map = new Map<string, LeagueActivity[]>();
    for (const act of activities) {
      if (!map.has(act.date)) {
        map.set(act.date, []);
      }
      map.get(act.date)!.push(act);
    }
    return map;
  }, [activities]);

  // Calendar month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToOctober = () => {
    setCurrentDate(new Date(2026, 9, 1));
    setSelectedDateStr("2026-10-25");
  };

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const daysArray = useMemo(() => {
    const days: {
      dayNumber: number | null;
      dateStr: string;
      matches: MatchFixture[];
      activities: LeagueActivity[];
    }[] = [];

    // Empty padding cells for previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateStr: "", matches: [], activities: [] });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthFormatted = String(month + 1).padStart(2, "0");
      const dayFormatted = String(day).padStart(2, "0");
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
      const matches = fixturesByDate.get(dateStr) || [];
      const acts = activitiesByDate.get(dateStr) || [];
      days.push({
        dayNumber: day,
        dateStr,
        matches,
        activities: acts,
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayIndex, fixturesByDate, activitiesByDate]);

  // Items on the currently selected day
  const selectedDayMatches = useMemo(() => {
    if (!selectedDateStr) return [];
    return fixturesByDate.get(selectedDateStr) || [];
  }, [selectedDateStr, fixturesByDate]);

  const selectedDayActivities = useMemo(() => {
    if (!selectedDateStr) return [];
    return activitiesByDate.get(selectedDateStr) || [];
  }, [selectedDateStr, activitiesByDate]);

  // Overall statistics for the calendar
  const calendarStats = useMemo(() => {
    const total = fixtures.length;
    const completed = fixtures.filter((f) => f.status === "FINISHED").length;
    const upcoming = fixtures.filter((f) => f.status === "UPCOMING").length;
    const totalActivities = activities.length;
    return { total, completed, upcoming, totalActivities };
  }, [fixtures, activities]);

  // Open add activity form for a given date
  const handleOpenAddModal = (dateStr?: string) => {
    const targetDate = dateStr || selectedDateStr || "2026-10-25";
    setNewActivityDate(targetDate);
    setNewActivityTitle("");
    setNewActivityCategory("TRAINING");
    setNewActivityTime("16:00 - 18:00");
    setNewActivityVenue("Academy Main Stadium Ground");
    setNewActivityDescription("");
    setFormError(null);
    setShowAddActivityModal(true);
  };

  // Submit new activity (Admin only)
  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newActivityTitle.trim()) {
      setFormError("Please enter an activity title.");
      return;
    }
    if (!newActivityDate) {
      setFormError("Please select a valid date.");
      return;
    }

    const created = createLeagueActivity({
      date: newActivityDate,
      title: newActivityTitle.trim(),
      category: newActivityCategory,
      time: newActivityTime.trim() || "TBA",
      venue: newActivityVenue.trim() || "Academy Ground",
      description: newActivityDescription.trim(),
      createdBy: isSuperAdmin ? "Super Admin" : "Executive Council",
    });

    setActivities(getLeagueActivities());
    setSelectedDateStr(newActivityDate);
    setShowAddActivityModal(false);
    showToast(`✓ Activity "${created.title}" published to public calendar!`);
  };

  // Delete activity (Admin only)
  const handleDeleteActivity = (id: string, title: string) => {
    if (window.confirm(`Delete calendar activity "${title}"?`)) {
      const updated = deleteLeagueActivity(id);
      setActivities(updated);
      showToast(`✓ Activity "${title}" removed from calendar.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0e0a26]/90 border border-[#2e2554] p-4 rounded-3xl shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Total Matches
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{calendarStats.total}</span>
            <span className="text-xs text-[#00f0ff] font-bold">Scheduled</span>
          </div>
        </div>

        <div className="bg-[#0e0a26]/90 border border-emerald-500/30 p-4 rounded-3xl shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Matchday Results
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {calendarStats.completed}
            </span>
            <span className="text-xs text-gray-400">Played</span>
          </div>
        </div>

        <div className="bg-[#0e0a26]/90 border border-[#00f0ff]/30 p-4 rounded-3xl shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Upcoming Fixtures
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#00f0ff] font-mono">
              {calendarStats.upcoming}
            </span>
            <span className="text-xs text-gray-400">Pending Kickoff</span>
          </div>
        </div>

        <div className="bg-[#0e0a26]/90 border border-amber-500/30 p-4 rounded-3xl shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
            Calendar Activities
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300 font-mono">
              {calendarStats.totalActivities}
            </span>
            <span className="text-[10px] text-amber-400 font-bold">Public Events</span>
          </div>
        </div>
      </div>

      {/* Main Calendar Card & Selected Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Monthly Calendar Grid (7 Cols on LG) */}
        <div className="lg:col-span-7 bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
          {/* Calendar Header with Controls & Admin Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00f0ff]/20 to-emerald-400/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-header text-2xl font-black text-white tracking-wider uppercase leading-none">
                  {monthName} {year}
                </h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Season Matchdays & Activities Calendar
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Admin Create Activity Button */}
              {canAdminCalendar && (
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(selectedDateStr)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase hover:brightness-110 shadow-md shadow-amber-500/20 transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              )}

              {/* Jump to Active October */}
              <button
                type="button"
                onClick={jumpToOctober}
                className="px-2.5 py-1.5 rounded-xl bg-[#141029] hover:bg-[#1a1438] border border-[#2e2554] text-xs font-bold text-[#00f0ff] transition cursor-pointer"
                title="Jump to current active matchweek month"
              >
                Oct 2026
              </button>

              {/* Month Navigation Prev / Next */}
              <div className="flex items-center gap-1 bg-[#141029] p-1 rounded-xl border border-[#2e2554]">
                <button
                  type="button"
                  onClick={prevMonth}
                  aria-label="Previous month"
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Bar: Team & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141029] p-3 rounded-2xl border border-[#2e2554] text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Filter:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={teamFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setTeamFilter(val === "ALL" ? "ALL" : Number(val));
                }}
                aria-label="Filter calendar by team"
                className="bg-[#090615] border border-[#2e2554] focus:border-[#00f0ff] rounded-xl px-2.5 py-1 text-xs text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Clubs</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter calendar by fixture status"
                className="bg-[#090615] border border-[#2e2554] focus:border-[#00f0ff] rounded-xl px-2.5 py-1 text-xs text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Match Statuses</option>
                <option value="FINISHED">Concluded Results</option>
                <option value="UPCOMING">Upcoming Fixtures</option>
                <option value="LIVE">Live Matches</option>
              </select>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-black uppercase tracking-wider text-gray-400">
            <span className="text-rose-400">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysArray.map((dayObj, index) => {
              if (dayObj.dayNumber === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-20 sm:h-24 rounded-2xl bg-black/10 border border-transparent opacity-20"
                  />
                );
              }

              const isSelected = selectedDateStr === dayObj.dateStr;
              const hasMatches = dayObj.matches.length > 0;
              const hasActivities = dayObj.activities.length > 0;
              const hasPastMatches = dayObj.matches.some((m) => m.status === "FINISHED");
              const hasUpcomingMatches = dayObj.matches.some((m) => m.status === "UPCOMING");

              return (
                <div
                  key={dayObj.dateStr}
                  onClick={() => {
                    setSelectedDateStr(dayObj.dateStr);
                    if (dayObj.matches.length > 0 && onSelectFixture) {
                      onSelectFixture(dayObj.matches[0]);
                    }
                  }}
                  className={`h-22 sm:h-24 p-1.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? "bg-[#1d1645] border-[#00f0ff] shadow-xl shadow-cyan-500/20 scale-[1.02]"
                      : hasMatches || hasActivities
                        ? "bg-[#141029] hover:bg-[#1a1438] border-[#2e2554] hover:border-gray-400"
                        : "bg-[#0b081e]/60 hover:bg-[#100c2a] border-[#2e2554]/40"
                  }`}
                >
                  {/* Day number & indicators */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected
                          ? "text-[#00f0ff] font-black"
                          : hasMatches || hasActivities
                            ? "text-white"
                            : "text-gray-400"
                      }`}
                    >
                      {dayObj.dayNumber}
                    </span>

                    <div className="flex items-center gap-1">
                      {hasActivities && (
                        <span
                          className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold flex items-center justify-center"
                          title={`${dayObj.activities.length} Activity`}
                        >
                          {dayObj.activities.length}
                        </span>
                      )}

                      {hasMatches && (
                        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00f0ff] to-emerald-400 text-black font-mono font-black text-[10px] flex items-center justify-center shadow-md">
                          {dayObj.matches.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges in Day Cell: Matches and Activities */}
                  <div className="space-y-0.5 overflow-hidden">
                    {/* Activity Pill preview */}
                    {hasActivities && (
                      <div className="px-1 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[8px] font-bold truncate">
                        {CATEGORY_CONFIG[dayObj.activities[0].category]?.iconText || "📌"}{" "}
                        {dayObj.activities[0].title}
                      </div>
                    )}

                    {/* Match fixture preview */}
                    {hasMatches &&
                      dayObj.matches.slice(0, 1).map((m) => {
                        const h = getTeam(m.homeId);
                        const a = getTeam(m.awayId);
                        const isFinished = m.status === "FINISHED";

                        return (
                          <div
                            key={m.id}
                            className={`px-1 py-0.5 rounded text-[8px] font-bold truncate flex items-center justify-between ${
                              isFinished
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/30"
                            }`}
                          >
                            <span className="truncate">
                              {h.shortCode} v {a.shortCode}
                            </span>
                            {isFinished && (
                              <span className="font-mono ml-0.5">
                                {m.homeScore}-{m.awayScore}
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Bottom indicator status dots */}
                  <div className="flex items-center gap-1">
                    {hasPastMatches && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        title="Completed Matches"
                      />
                    )}
                    {hasUpcomingMatches && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"
                        title="Upcoming Fixture"
                      />
                    )}
                    {hasActivities && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-400"
                        title="Scheduled Activity"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2e2554] text-[11px] text-gray-400">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Results</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]" />
                <span>Upcoming Matches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>League Activities</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 italic">
              Click any date to view scheduled matches & activities
            </span>
          </div>
        </div>

        {/* Right Column: Selected Date Schedule & Activities (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div>
                <span className="text-[10px] text-[#00f0ff] uppercase font-black tracking-wider block">
                  Date Schedule & Operations
                </span>
                <h4 className="font-header text-xl font-black text-white">
                  {selectedDateStr
                    ? new Date(selectedDateStr).toLocaleDateString("default", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select a date"}
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                {canAdminCalendar && (
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal(selectedDateStr)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition cursor-pointer"
                    title="Add activity on this date"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}

                <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                  {selectedDayMatches.length} M • {selectedDayActivities.length} Act
                </span>
              </div>
            </div>

            {/* SECTION 1: OFFICIAL LEAGUE ACTIVITIES ON THIS DATE */}
            {selectedDayActivities.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Official League Activities ({selectedDayActivities.length})
                </span>

                <div className="space-y-2">
                  {selectedDayActivities.map((act) => {
                    const cfg = CATEGORY_CONFIG[act.category];

                    return (
                      <div
                        key={act.id}
                        className={`p-3.5 rounded-2xl bg-[#141029] border ${cfg.border} space-y-2 transition hover:brightness-105`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${cfg.badgeColor}`}
                            >
                              {cfg.iconText} {cfg.label}
                            </span>
                            <h5 className="font-black text-sm text-white mt-1">{act.title}</h5>
                          </div>

                          {canAdminCalendar && (
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(act.id, act.title)}
                              title="Delete Activity"
                              className="text-gray-500 hover:text-rose-400 p-1 rounded transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-400">
                          <div className="flex items-center gap-1 font-mono text-cyan-300">
                            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{act.time}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="truncate">{act.venue}</span>
                          </div>
                        </div>

                        {act.description && (
                          <p className="text-xs text-gray-300 bg-[#090615] p-2 rounded-xl border border-white/5">
                            {act.description}
                          </p>
                        )}

                        <div className="text-[10px] text-gray-500 font-mono">
                          Posted by: <strong className="text-amber-300">{act.createdBy}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 2: MATCH FIXTURES ON THIS DATE */}
            {selectedDayMatches.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-black text-[#00f0ff] tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Championship Matches ({selectedDayMatches.length})
                </span>

                <div className="space-y-3">
                  {selectedDayMatches.map((fixture) => {
                    const home = getTeam(fixture.homeId);
                    const away = getTeam(fixture.awayId);
                    const isFinished = fixture.status === "FINISHED";

                    return (
                      <div
                        key={fixture.id}
                        className="bg-[#141029] border border-[#2e2554] hover:border-[#00f0ff]/50 rounded-2xl p-3.5 shadow-lg space-y-2.5 transition duration-200"
                      >
                        {/* Top Bar */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#1e1744] text-[#00f0ff] font-extrabold text-[10px] uppercase">
                              MW {fixture.matchweek}
                            </span>
                            <span className="font-mono text-[#00ff85] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {fixture.time}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              isFinished
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-cyan-500/20 text-[#00f0ff] border-cyan-500/30"
                            }`}
                          >
                            {fixture.status}
                          </span>
                        </div>

                        {/* Clubs Scoreboard */}
                        <div className="flex items-center justify-between py-1">
                          {/* Home Club */}
                          <div className="flex items-center gap-2 w-5/12">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow border border-white/20 shrink-0"
                              style={{ backgroundColor: home.color }}
                            >
                              {home.shortCode}
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs sm:text-sm text-white truncate">
                                {home.name}
                              </h5>
                              <span className="text-[9px] text-gray-400 block">Home</span>
                            </div>
                          </div>

                          {/* Result / VS */}
                          <div className="flex items-center justify-center w-2/12">
                            {isFinished ? (
                              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#0a071d] rounded-xl border border-[#2e2554] font-mono text-sm font-black text-white shadow-inner">
                                <span>{fixture.homeScore}</span>
                                <span className="text-gray-500 text-xs">-</span>
                                <span>{fixture.awayScore}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black text-[#00f0ff] uppercase bg-[#0a071d] px-2 py-0.5 rounded-xl border border-[#2e2554]">
                                VS
                              </span>
                            )}
                          </div>

                          {/* Away Club */}
                          <div className="flex items-center justify-end gap-2 w-5/12 text-right">
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs sm:text-sm text-white truncate">
                                {away.name}
                              </h5>
                              <span className="text-[9px] text-gray-400 block">Away</span>
                            </div>
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow border border-white/20 shrink-0"
                              style={{ backgroundColor: away.color }}
                            >
                              {away.shortCode}
                            </div>
                          </div>
                        </div>

                        {/* Venue & Scorers */}
                        <div className="text-[11px] text-gray-400 pt-0.5 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="truncate">{fixture.venue || home.homePitch}</span>
                          </div>

                          {fixture.scorers && (
                            <div className="p-1.5 bg-[#09061c] rounded-xl border border-white/5 text-emerald-300 text-[10px] truncate">
                              ⚽ <span className="font-semibold">{fixture.scorers}</span>
                            </div>
                          )}

                          {fixture.manOfTheMatch && (
                            <div className="p-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-300/10 border border-amber-400/30 rounded-xl flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1 text-amber-300">
                                <Trophy className="w-3 h-3" />
                                <span className="font-bold truncate">
                                  MOTM: {fixture.manOfTheMatch.playerName}
                                </span>
                              </div>
                              <span className="font-mono text-amber-400 font-bold shrink-0">
                                ★ {fixture.manOfTheMatch.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state when no matches and no activities on selected date */}
            {selectedDayMatches.length === 0 && selectedDayActivities.length === 0 && (
              <div className="text-center py-10 px-4 rounded-2xl bg-[#141029]/50 border border-dashed border-[#2e2554] space-y-3">
                <CalendarCheck2 className="w-8 h-8 text-gray-500 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-gray-300">
                    No matches or activities scheduled
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedDateStr} is currently open on the league calendar.
                  </p>
                </div>

                {canAdminCalendar && (
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal(selectedDateStr)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-black text-xs uppercase transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Activity on This Date</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADMIN ADD ACTIVITY MODAL */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] border-2 border-amber-400/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <h4 className="font-header text-lg font-black text-white uppercase">
                  Schedule New League Activity
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddActivityModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captains Technical Briefing or Tactical Scrimmage"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Event Category
                  </label>
                  <select
                    value={newActivityCategory}
                    onChange={(e) => setNewActivityCategory(e.target.value as ActivityCategory)}
                    className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="TRAINING">🏃 Training & Conditioning</option>
                    <option value="MATCHDAY">⚽ Matchday Event</option>
                    <option value="HEARING">⚖️ Council Hearing / Audit</option>
                    <option value="MEETING">📋 Executive Briefing</option>
                    <option value="CEREMONY">🏆 Ceremony & Awards Gala</option>
                    <option value="FRIENDLY">🤝 Friendly Match</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Activity Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newActivityDate}
                    onChange={(e) => setNewActivityDate(e.target.value)}
                    className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Time / Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15:00 - 17:30"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Venue / Ground
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Stadium / Chambers"
                    value={newActivityVenue}
                    onChange={(e) => setNewActivityVenue(e.target.value)}
                    className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Description / Operations Brief (Publicly Visible)
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide context, agenda, or guidelines for student viewers and participants..."
                  value={newActivityDescription}
                  onChange={(e) => setNewActivityDescription(e.target.value)}
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Publish to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
