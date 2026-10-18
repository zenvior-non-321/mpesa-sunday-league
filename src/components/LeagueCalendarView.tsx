import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import type { MatchFixture, Team } from "./Fixtures";

interface LeagueCalendarViewProps {
  fixtures: MatchFixture[];
  teams: Team[];
  onSelectFixture?: (fixture: MatchFixture) => void;
}

export function LeagueCalendarView({ fixtures, teams, onSelectFixture }: LeagueCalendarViewProps) {
  // Calendar month state (default to October 2026 where league fixtures are active)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-10-25"); // Oct 25, 2026 matchday
  const [teamFilter, setTeamFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

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

    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    // Parse "Sunday, Oct 25, 2026" or "Oct 25, 2026"
    const parsed = Date.parse(raw);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Matchweek fallbacks
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
    const days: { dayNumber: number | null; dateStr: string; matches: MatchFixture[] }[] = [];

    // Empty padding cells for previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateStr: "", matches: [] });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthFormatted = String(month + 1).padStart(2, "0");
      const dayFormatted = String(day).padStart(2, "0");
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
      const matches = fixturesByDate.get(dateStr) || [];
      days.push({
        dayNumber: day,
        dateStr,
        matches,
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayIndex, fixturesByDate]);

  // Matches on the currently selected day
  const selectedDayMatches = useMemo(() => {
    if (!selectedDateStr) return [];
    return fixturesByDate.get(selectedDateStr) || [];
  }, [selectedDateStr, fixturesByDate]);

  // Overall statistics for the calendar
  const calendarStats = useMemo(() => {
    const total = fixtures.length;
    const completed = fixtures.filter((f) => f.status === "FINISHED").length;
    const upcoming = fixtures.filter((f) => f.status === "UPCOMING").length;
    const live = fixtures.filter((f) => f.status === "LIVE").length;
    return { total, completed, upcoming, live };
  }, [fixtures]);

  return (
    <div className="space-y-6">
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
            Past Results
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {calendarStats.completed}
            </span>
            <span className="text-xs text-gray-400">Completed</span>
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
            Active Season
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white font-mono">2026/27</span>
            <span className="text-[10px] text-amber-400 font-bold">Matchweek 1-6</span>
          </div>
        </div>
      </div>

      {/* Main Calendar Card & Selected Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Monthly Calendar Grid (7 Cols on LG) */}
        <div className="lg:col-span-7 bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
          {/* Calendar Header with Controls */}
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
                  Season Matchday Schedule
                </span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={jumpToOctober}
                className="px-3 py-1.5 rounded-xl bg-[#141029] hover:bg-[#1f1744] border border-[#2e2554] text-[11px] font-bold text-[#00f0ff] transition"
              >
                Oct 2026 (Active)
              </button>
              <div className="flex items-center gap-1 bg-[#141029] border border-[#2e2554] p-1 rounded-2xl">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Club Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#00f0ff]" />
                Club:
              </span>
              <button
                onClick={() => setTeamFilter("ALL")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap ${
                  teamFilter === "ALL"
                    ? "bg-[#00f0ff] text-black font-black"
                    : "bg-[#141029] text-gray-400 hover:text-white"
                }`}
              >
                All Clubs
              </button>
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTeamFilter(t.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap ${
                    teamFilter === t.id
                      ? "bg-gradient-to-r from-emerald-400 to-[#00f0ff] text-black font-black"
                      : "bg-[#141029] text-gray-400 hover:text-white"
                  }`}
                >
                  {t.shortCode || t.name}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  statusFilter === "ALL"
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                    : "text-gray-500"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("FINISHED")}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  statusFilter === "FINISHED"
                    ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                    : "text-gray-500"
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setStatusFilter("UPCOMING")}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  statusFilter === "UPCOMING"
                    ? "bg-cyan-500/30 text-[#00f0ff] border border-cyan-500/50"
                    : "text-gray-500"
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-gray-400 uppercase tracking-wider border-b border-[#2e2554] pb-2">
            <span className="text-amber-400">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-[#00f0ff]">Sat</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {daysArray.map((dayObj, index) => {
              if (dayObj.dayNumber === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-20 sm:h-24 rounded-2xl bg-white/[0.01] border border-transparent"
                  />
                );
              }

              const hasMatches = dayObj.matches.length > 0;
              const isSelected = selectedDateStr === dayObj.dateStr;
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
                  className={`h-20 sm:h-24 p-1.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? "bg-[#1d1645] border-[#00f0ff] shadow-xl shadow-cyan-500/20 scale-[1.02]"
                      : hasMatches
                        ? "bg-[#141029] hover:bg-[#1a1438] border-[#2e2554] hover:border-gray-400"
                        : "bg-[#0b081e]/60 hover:bg-[#100c2a] border-[#2e2554]/40"
                  }`}
                >
                  {/* Day number & match indicator */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected
                          ? "text-[#00f0ff] font-black"
                          : hasMatches
                            ? "text-white"
                            : "text-gray-400"
                      }`}
                    >
                      {dayObj.dayNumber}
                    </span>

                    {hasMatches && (
                      <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00f0ff] to-emerald-400 text-black font-mono font-black text-[10px] flex items-center justify-center shadow-md">
                        {dayObj.matches.length}
                      </span>
                    )}
                  </div>

                  {/* Match indicators on the day */}
                  {hasMatches && (
                    <div className="space-y-1 overflow-hidden">
                      {dayObj.matches.slice(0, 2).map((m) => {
                        const h = getTeam(m.homeId);
                        const a = getTeam(m.awayId);
                        const isFinished = m.status === "FINISHED";

                        return (
                          <div
                            key={m.id}
                            className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold truncate flex items-center justify-between ${
                              isFinished
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/30"
                            }`}
                          >
                            <span className="truncate">
                              {h.shortCode} v {a.shortCode}
                            </span>
                            {isFinished && (
                              <span className="font-mono text-[8px] ml-1">
                                {m.homeScore}-{m.awayScore}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {dayObj.matches.length > 2 && (
                        <span className="text-[8px] text-gray-400 font-bold block text-center">
                          +{dayObj.matches.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom indicator status dot */}
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
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2e2554] text-[11px] text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Past Matches (Results)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]" />
                <span>Upcoming Matches</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 italic">
              Click any date to inspect match schedule & lineups
            </span>
          </div>
        </div>

        {/* Right Column: Selected Date Clashes & Matchday Details (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div>
                <span className="text-[10px] text-[#00f0ff] uppercase font-black tracking-wider block">
                  Matchday Schedule Details
                </span>
                <h4 className="font-header text-xl font-black text-white">
                  {selectedDateStr
                    ? new Date(selectedDateStr).toLocaleDateString("default", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select a match date"}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                {selectedDayMatches.length} {selectedDayMatches.length === 1 ? "Match" : "Matches"}
              </span>
            </div>

            {/* List of matches for the selected date */}
            {selectedDayMatches.length > 0 ? (
              <div className="space-y-4">
                {selectedDayMatches.map((fixture) => {
                  const home = getTeam(fixture.homeId);
                  const away = getTeam(fixture.awayId);
                  const isFinished = fixture.status === "FINISHED";

                  return (
                    <div
                      key={fixture.id}
                      className="bg-[#141029] border border-[#2e2554] hover:border-[#00f0ff]/50 rounded-2xl p-4 shadow-lg space-y-3 transition duration-200"
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
                        <div className="flex items-center gap-2.5 w-5/12">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow border border-white/20 shrink-0"
                            style={{ backgroundColor: home.color }}
                          >
                            {home.shortCode}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-sm text-white truncate">{home.name}</h5>
                            <span className="text-[10px] text-gray-400 block">Home</span>
                          </div>
                        </div>

                        {/* Result / VS */}
                        <div className="flex items-center justify-center w-2/12">
                          {isFinished ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0a071d] rounded-xl border border-[#2e2554] font-mono text-base font-black text-white shadow-inner">
                              <span>{fixture.homeScore}</span>
                              <span className="text-gray-500 text-xs">-</span>
                              <span>{fixture.awayScore}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-[#00f0ff] uppercase bg-[#0a071d] px-2.5 py-1 rounded-xl border border-[#2e2554]">
                              VS
                            </span>
                          )}
                        </div>

                        {/* Away Club */}
                        <div className="flex items-center justify-end gap-2.5 w-5/12 text-right">
                          <div className="min-w-0">
                            <h5 className="font-bold text-sm text-white truncate">{away.name}</h5>
                            <span className="text-[10px] text-gray-400 block">Away</span>
                          </div>
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow border border-white/20 shrink-0"
                            style={{ backgroundColor: away.color }}
                          >
                            {away.shortCode}
                          </div>
                        </div>
                      </div>

                      {/* Venue & Scorers */}
                      <div className="text-[11px] text-gray-400 pt-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">{fixture.venue || home.homePitch}</span>
                        </div>

                        {fixture.scorers && (
                          <div className="p-2 bg-[#09061c] rounded-xl border border-white/5 text-emerald-300 text-[10px] truncate">
                            ⚽ <span className="font-semibold">{fixture.scorers}</span>
                          </div>
                        )}

                        {fixture.manOfTheMatch && (
                          <div className="p-2 bg-gradient-to-r from-amber-500/10 to-yellow-300/10 border border-amber-400/30 rounded-xl flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-amber-300">
                              <Trophy className="w-3.5 h-3.5" />
                              <span className="font-bold">
                                MOTM: {fixture.manOfTheMatch.playerName}
                              </span>
                            </div>
                            <span className="font-mono text-amber-400 font-bold text-[10px]">
                              ★ {fixture.manOfTheMatch.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl bg-[#141029]/50 border border-dashed border-[#2e2554] space-y-2">
                <CalendarCheck2 className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-sm font-bold text-gray-300">
                  No fixtures scheduled on this date
                </p>
                <p className="text-xs text-gray-400">
                  Select another day or click <strong className="text-[#00f0ff]">Oct 2026</strong>{" "}
                  above to view Sunday matchday clashes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
