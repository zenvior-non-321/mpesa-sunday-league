import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  Trophy,
  Shield,
  ArrowRight,
  Flame,
  CheckCircle2,
  MapPin,
  UserCheck,
} from "lucide-react";
import { getDbFixtures, getDbTeams, type DbFixture, type DbTeam } from "../lib/inbuiltDbSync";
import { MatchweekSelector } from "./MatchweekSelector";

interface UpcomingMatchweekSectionProps {
  onNavigateToFantasy?: () => void;
  className?: string;
}

interface CountdownUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export function UpcomingMatchweekSection({
  onNavigateToFantasy,
  className = "",
}: UpcomingMatchweekSectionProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [fixtures, setFixtures] = useState<DbFixture[]>([]);
  const [teams, setTeams] = useState<DbTeam[]>([]);
  const [countdown, setCountdown] = useState<CountdownUnits>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  // Load live fixtures and teams from database
  useEffect(() => {
    const refresh = () => {
      const allFixtures = getDbFixtures();
      setFixtures(allFixtures);
      setTeams(getDbTeams());

      // Auto-detect first upcoming matchweek if not yet set
      const nextUpcoming = allFixtures.find(
        (f) => f.status === "SCHEDULED" || f.status === "UPCOMING",
      );
      if (nextUpcoming?.matchweek) {
        setSelectedWeek(nextUpcoming.matchweek);
      }
    };

    refresh();
    window.addEventListener("mpesa_db_updated", refresh);
    return () => window.removeEventListener("mpesa_db_updated", refresh);
  }, []);

  // Filter fixtures for selected matchweek
  const weekFixtures = useMemo(() => {
    return fixtures.filter((f) => f.matchweek === selectedWeek);
  }, [fixtures, selectedWeek]);

  // Target deadline for selected week (e.g., Sunday 14:00 of the matchweek)
  const targetDeadline = useMemo(() => {
    if (weekFixtures.length > 0 && weekFixtures[0].date) {
      // Parse match date string e.g. "Sunday, Nov 1, 2026 2:00 PM"
      const parsed = Date.parse(
        `${weekFixtures[0].date} ${weekFixtures[0].time || "14:00"}`,
      );
      if (!isNaN(parsed)) return new Date(parsed);
    }
    // Fallback: 3 days, 14 hours ahead for simulation
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(14, 0, 0, 0);
    return d;
  }, [weekFixtures]);

  // Real-time ticking countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetDeadline.getTime() - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, isPassed: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDeadline]);

  const teamColorMap = useMemo(() => {
    const map: Record<number, string> = {
      1: "#00ff85", // Samba
      6: "#3b82f6", // Royal Rangers
      7: "#f97316", // Young Stars City
      8: "#eab308", // Mzinga
    };
    teams.forEach((t) => {
      if (t.color) map[t.id] = t.color;
    });
    return map;
  }, [teams]);

  return (
    <section
      className={`bg-gradient-to-br from-[#0c0824] via-[#100a30] to-[#080517] border border-[#2e235e] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 text-black">
              Official Schedule
            </span>
            <span className="text-xs text-amber-300 font-mono flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Matchweek Countdown
            </span>
          </div>
          <h2 className="font-header text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1">
            Upcoming Matchweek {selectedWeek} Fixtures
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Real-time kickoff countdown, verified venue assignments, and fantasy lineup deadlines.
          </p>
        </div>

        {/* Live Countdown Clock Badge */}
        <div className="bg-[#150f38] border border-cyan-400/30 rounded-2xl p-3.5 flex items-center gap-3 shrink-0 shadow-lg shadow-cyan-500/10">
          <Clock className="w-6 h-6 text-cyan-400 shrink-0 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              {countdown.isPassed ? "Match In Progress / Completed" : "Kickoff Countdown"}
            </span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-xl sm:text-2xl font-black text-white">
                {String(countdown.days).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400">d</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {String(countdown.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400">h</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {String(countdown.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400">m</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400">
                {String(countdown.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400">s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matchweek Selector Bar */}
      <MatchweekSelector
        currentWeek={selectedWeek}
        totalWeeks={10}
        onSelectWeek={(w) => setSelectedWeek(w)}
        deadlineDate={weekFixtures[0]?.date ? `${weekFixtures[0].date} ${weekFixtures[0].time || "14:00"}` : "Sunday 14:00"}
        isDeadlinePassed={countdown.isPassed}
      />

      {/* Fixtures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weekFixtures.length === 0 ? (
          <div className="col-span-2 py-12 text-center bg-black/30 rounded-2xl border border-white/5 space-y-2">
            <Calendar className="w-8 h-8 text-gray-500 mx-auto" />
            <p className="text-sm text-gray-400">
              No fixtures scheduled for Matchweek {selectedWeek} yet.
            </p>
          </div>
        ) : (
          weekFixtures.map((fixture) => {
            const homeColor = teamColorMap[fixture.homeId] || "#00f0ff";
            const awayColor = teamColorMap[fixture.awayId] || "#3b82f6";

            return (
              <div
                key={fixture.id}
                className="bg-[#120d2e]/90 border border-white/10 hover:border-cyan-400/40 rounded-2xl p-4 sm:p-5 transition-all shadow-md hover:shadow-cyan-500/10 space-y-4"
              >
                {/* Top Meta info */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-white/5 pb-2.5">
                  <span className="flex items-center gap-1.5 font-mono text-cyan-300">
                    <Calendar className="w-3.5 h-3.5" />
                    {fixture.date} • {fixture.time}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      fixture.status === "LIVE"
                        ? "bg-rose-500 text-white animate-pulse"
                        : fixture.status === "COMPLETED" || fixture.status === "FINISHED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {fixture.status}
                  </span>
                </div>

                {/* Teams Row */}
                <div className="flex items-center justify-between gap-3 py-1">
                  {/* Home Team */}
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-black shadow-md shrink-0"
                      style={{ backgroundColor: homeColor }}
                    >
                      {fixture.homeTeamName.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-header text-sm sm:text-base font-black text-white truncate block">
                        {fixture.homeTeamName}
                      </span>
                      <span className="text-[10px] text-gray-400">Home Club</span>
                    </div>
                  </div>

                  {/* VS Badge / Score */}
                  <div className="px-3 py-1.5 bg-black/60 rounded-xl border border-white/10 text-center shrink-0">
                    {typeof fixture.homeScore === "number" &&
                    typeof fixture.awayScore === "number" &&
                    fixture.status !== "SCHEDULED" &&
                    fixture.status !== "UPCOMING" ? (
                      <span className="font-mono text-base font-black text-cyan-400">
                        {fixture.homeScore} : {fixture.awayScore}
                      </span>
                    ) : (
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
                        VS
                      </span>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 flex items-center justify-end gap-3 text-right">
                    <div className="min-w-0">
                      <span className="font-header text-sm sm:text-base font-black text-white truncate block">
                        {fixture.awayTeamName}
                      </span>
                      <span className="text-[10px] text-gray-400">Away Club</span>
                    </div>
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-black shadow-md shrink-0"
                      style={{ backgroundColor: awayColor }}
                    >
                      {fixture.awayTeamName.slice(0, 3).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Venue and Referee Details */}
                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 gap-1.5">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{fixture.venue}</span>
                  </span>
                  {fixture.referee && (
                    <span className="flex items-center gap-1.5 text-gray-400 truncate">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{fixture.referee}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Call to Action for Fantasy Lineup */}
      <div className="p-4 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">
              Build Your Matchweek {selectedWeek} Fantasy Squad
            </h4>
            <p className="text-xs text-gray-300">
              Pick 11 starting players under the £100m budget and 3-player-per-club maximum quota before the deadline passes.
            </p>
          </div>
        </div>

        {onNavigateToFantasy ? (
          <button
            type="button"
            onClick={onNavigateToFantasy}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Pick Fantasy Squad</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <a
            href="/fantasy"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Pick Fantasy Squad</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </section>
  );
}
