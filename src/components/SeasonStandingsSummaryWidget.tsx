// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Crown,
  TrendingUp,
  Shield,
  Flame,
  ArrowRight,
  Activity,
  Award,
  Vote,
  Sparkles,
} from "lucide-react";
import { DEFAULT_STANDINGS, type TeamStanding } from "./LeagueStandings";
import { isTeamDeleted } from "../lib/fixturesData";

interface SeasonStandingsSummaryWidgetProps {
  onNavigateTab?: (
    tab: "standings" | "fixtures" | "radar" | "stats" | "calendar" | "voting",
  ) => void;
}

export function SeasonStandingsSummaryWidget({ onNavigateTab }: SeasonStandingsSummaryWidgetProps) {
  const [standings, setStandings] = useState<TeamStanding[]>(DEFAULT_STANDINGS);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("mpesa_pes_standings_v6") ||
        localStorage.getItem("mpesa_pes_teams_v6");
      let activeList: TeamStanding[] = DEFAULT_STANDINGS;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const active = parsed.filter(
            (t: Record<string, unknown>) =>
              !isTeamDeleted(Number(t.id), typeof t.name === "string" ? t.name : ""),
          );
          if (active.length > 0) {
            activeList = active as unknown as TeamStanding[];
          }
        }
      } else {
        const activeDefault = DEFAULT_STANDINGS.filter((t) => !isTeamDeleted(t.id, t.name));
        if (activeDefault.length > 0) activeList = activeDefault;
      }

      setStandings(activeList);
    } catch {
      setStandings(DEFAULT_STANDINGS);
    }
  }, []);

  // Sort standings by points desc, then goal difference desc, then goals for desc
  const sortedStandings = useMemo(() => {
    return [...standings]
      .map((item: Record<string, unknown>, idx) => {
        const gf = Number(item.gf) || 0;
        const ga = Number(item.ga) || 0;
        const gd = typeof item.gd === "number" && Number.isFinite(item.gd) ? item.gd : gf - ga;
        const pts = Number(item.pts ?? item.points) || 0;
        const mp = Number(item.mp ?? item.played) || 0;
        const w = Number(item.w ?? item.won) || 0;
        const d = Number(item.d ?? item.drawn) || 0;
        const l = Number(item.l ?? item.lost) || 0;

        return {
          ...item,
          id: item.id ?? idx + 1,
          name: item.name || `Club #${idx + 1}`,
          shortCode:
            item.shortCode || (item.name ? item.name.slice(0, 3).toUpperCase() : `C${idx + 1}`),
          color: item.color || "#00f0ff",
          homePitch: item.homePitch || "Official Home Ground",
          mp,
          played: mp,
          w,
          won: w,
          d,
          drawn: d,
          l,
          lost: l,
          gf,
          ga,
          gd,
          pts,
          points: pts,
        };
      })
      .sort((a, b) => {
        if (b.pts !== a.pts) return (b.pts || 0) - (a.pts || 0);
        if (b.gd !== a.gd) return (b.gd || 0) - (a.gd || 0);
        return (b.gf || 0) - (a.gf || 0);
      });
  }, [standings]);

  // Compute key season stats
  const seasonStats = useMemo(() => {
    const leader = sortedStandings[0] || null;
    const topAttack = [...sortedStandings].sort((a, b) => (b.gf || 0) - (a.gf || 0))[0] || null;
    const bestDefense = [...sortedStandings].sort((a, b) => (a.ga || 0) - (b.ga || 0))[0] || null;
    const totalGoals = sortedStandings.reduce((sum, t) => sum + (Number(t.gf) || 0), 0);
    const totalMatches = sortedStandings.reduce((sum, t) => sum + (Number(t.mp) || 0), 0);

    return { leader, topAttack, bestDefense, totalGoals, totalMatches };
  }, [sortedStandings]);

  return (
    <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#261f4d] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black">
              Official Table Snapshot
            </span>
            <span className="text-xs text-gray-400 font-mono">Season 2026/27 Active</span>
          </div>
          <h3 className="font-header text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Current Season Standings & Form</span>
          </h3>
        </div>

        {onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab("standings")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-black text-xs transition cursor-pointer self-start sm:self-auto"
          >
            <span>View Full Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Season KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Table Leader */}
        <div className="bg-[#141029] border border-amber-400/30 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-black tracking-wider">Table Leader</span>
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white truncate">
              {seasonStats.leader ? seasonStats.leader.name : "—"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-300 font-bold block">
            {seasonStats.leader ? `${seasonStats.leader.pts} PTS` : "0 PTS"} • #1 Rank
          </span>
        </div>

        {/* Top Attack */}
        <div className="bg-[#141029] border border-cyan-400/30 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-black tracking-wider">Top Attack</span>
            <Flame className="w-3.5 h-3.5 text-[#00f0ff]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white truncate">
              {seasonStats.topAttack ? seasonStats.topAttack.name : "—"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 font-bold block">
            {seasonStats.topAttack ? `${seasonStats.topAttack.gf} Goals` : "0"} Scored
          </span>
        </div>

        {/* Best Defense */}
        <div className="bg-[#141029] border border-emerald-400/30 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-black tracking-wider">Best Defense</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white truncate">
              {seasonStats.bestDefense ? seasonStats.bestDefense.name : "—"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 font-bold block">
            {seasonStats.bestDefense ? `${seasonStats.bestDefense.ga} Conceded` : "0"}
          </span>
        </div>

        {/* Total Goals */}
        <div className="bg-[#141029] border border-purple-400/30 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-black tracking-wider">Total Goals</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {seasonStats.totalGoals}
            </span>
            <span className="text-xs text-purple-300 font-bold">Goals</span>
          </div>
          <span className="text-[11px] font-mono text-gray-400 block">
            Across active championship rounds
          </span>
        </div>
      </div>

      {/* Visual Standings Table Component */}
      <div className="overflow-x-auto rounded-2xl border border-[#2e2554] bg-[#090615] shadow-inner custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#141029] text-gray-400 font-mono uppercase text-[10px] tracking-wider border-b border-[#2e2554]">
              <th className="py-3 px-3 text-center w-12 font-black">#</th>
              <th className="py-3 px-3 font-black">Club</th>
              <th className="py-3 px-2 text-center font-bold">P</th>
              <th className="py-3 px-2 text-center font-bold">W</th>
              <th className="py-3 px-2 text-center font-bold">D</th>
              <th className="py-3 px-2 text-center font-bold">L</th>
              <th className="py-3 px-2 text-center font-bold hidden sm:table-cell">GF</th>
              <th className="py-3 px-2 text-center font-bold hidden sm:table-cell">GA</th>
              <th className="py-3 px-2 text-center font-bold">GD</th>
              <th className="py-3 px-3 text-center font-black text-white">PTS</th>
              <th className="py-3 px-3 text-center font-bold hidden md:table-cell">Form Guide</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1744]">
            {sortedStandings.map((team, idx) => {
              const rank = idx + 1;
              const isFirst = rank === 1;
              const isTop3 = rank <= 3;

              return (
                <tr
                  key={team.id}
                  className={`transition-all duration-200 ${
                    isFirst
                      ? "bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border-l-4 border-amber-400 shadow-sm shadow-amber-400/5 hover:from-amber-500/25 hover:via-yellow-500/15"
                      : "hover:bg-[#150f38]"
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {rank === 1 ? (
                        <>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs shadow-md shadow-amber-400/30">
                            1
                          </span>
                          <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 animate-pulse hidden sm:inline" />
                        </>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-black font-black text-xs shadow-sm">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/80 text-white font-black text-xs shadow-sm">
                          3
                        </span>
                      ) : (
                        <span className="text-gray-400 font-mono font-bold">{rank}</span>
                      )}
                    </div>
                  </td>

                  {/* Club */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-black shrink-0 shadow-sm ${
                          isFirst ? "ring-2 ring-amber-400/40" : ""
                        }`}
                        style={{ backgroundColor: team.color || "#00f0ff" }}
                      >
                        {team.shortCode}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`block truncate text-xs sm:text-sm font-black ${
                              isFirst ? "text-amber-200" : "text-white"
                            }`}
                          >
                            {team.name}
                          </span>
                          {isFirst && (
                            <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded-full font-black flex items-center gap-1">
                              <Trophy className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              <span>1ST</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 block truncate">
                          {team.homePitch}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Played */}
                  <td className="py-3 px-2 text-center font-mono font-bold text-gray-300">
                    {team.mp ?? 0}
                  </td>

                  {/* Wins */}
                  <td className="py-3 px-2 text-center font-mono font-bold text-emerald-400">
                    {team.w ?? 0}
                  </td>

                  {/* Draws */}
                  <td className="py-3 px-2 text-center font-mono font-bold text-gray-400">
                    {team.d ?? 0}
                  </td>

                  {/* Losses */}
                  <td className="py-3 px-2 text-center font-mono font-bold text-rose-400">
                    {team.l ?? 0}
                  </td>

                  {/* Goals For */}
                  <td className="py-3 px-2 text-center font-mono text-gray-300 hidden sm:table-cell">
                    {team.gf ?? 0}
                  </td>

                  {/* Goals Against */}
                  <td className="py-3 px-2 text-center font-mono text-gray-400 hidden sm:table-cell">
                    {team.ga ?? 0}
                  </td>

                  {/* Goal Difference */}
                  <td className="py-3 px-2 text-center font-mono font-bold">
                    <span
                      className={
                        team.gd > 0
                          ? "text-emerald-400"
                          : team.gd < 0
                            ? "text-rose-400"
                            : "text-gray-400"
                      }
                    >
                      {team.gd > 0 ? `+${team.gd}` : (team.gd ?? 0)}
                    </span>
                  </td>

                  {/* Points */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-mono text-sm font-black px-2.5 py-1 rounded-xl ${
                        isFirst
                          ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                          : isTop3
                            ? "bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/30"
                            : "bg-[#141029] text-white"
                      }`}
                    >
                      {team.pts ?? 0}
                    </span>
                  </td>

                  {/* Form Guide */}
                  <td className="py-3 px-3 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {team.form && team.form.length > 0 ? (
                        team.form.slice(-5).map((f, fIdx) => (
                          <span
                            key={fIdx}
                            className={`w-5 h-5 rounded-md text-[10px] font-mono font-black flex items-center justify-center ${
                              f === "W"
                                ? "bg-emerald-500 text-black"
                                : f === "D"
                                  ? "bg-gray-600 text-white"
                                  : "bg-rose-500 text-white"
                            }`}
                          >
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-500">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Quick Hub Action Pills */}
      {onNavigateTab && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#261f4d]">
          <span className="text-[11px] text-gray-400 font-mono">Interactive League Hub:</span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab("radar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white font-bold text-xs transition cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Tactical Radar</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("fixtures")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-bold text-xs transition cursor-pointer"
            >
              <span>Matchday Schedule</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("voting")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-bold text-xs transition cursor-pointer"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>MVP Balloting</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
