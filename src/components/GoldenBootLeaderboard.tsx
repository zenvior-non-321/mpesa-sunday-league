import React, { useState, useMemo } from "react";
import {
  Trophy,
  Flame,
  TrendingUp,
  Target,
  Award,
  Crown,
  ChevronRight,
  Filter,
  BarChart2,
} from "lucide-react";

export interface GoldenBootContender {
  id: number;
  name: string;
  clubName: string;
  clubShortCode: string;
  clubColor: string;
  position: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  shotsOnTarget: number;
  penalties: number;
  openPlayGoals: number;
  photoUrl?: string;
  matchweekGoals: number[]; // Cumulative goals after MW1, MW2, MW3, MW4, MW5
}

interface GoldenBootLeaderboardProps {
  customContenders?: GoldenBootContender[];
}

const DEFAULT_CONTENDERS: GoldenBootContender[] = [
  {
    id: 1,
    name: "Kevin Omondi",
    clubName: "Samba Boys",
    clubShortCode: "SMB",
    clubColor: "#00ff85",
    position: "Forward",
    matchesPlayed: 5,
    goals: 7,
    assists: 3,
    shotsOnTarget: 14,
    penalties: 1,
    openPlayGoals: 6,
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    matchweekGoals: [2, 3, 4, 6, 7],
  },
  {
    id: 2,
    name: "Emmanuel Kip",
    clubName: "Grade 10 A",
    clubShortCode: "G10A",
    clubColor: "#00f0ff",
    position: "Forward",
    matchesPlayed: 5,
    goals: 5,
    assists: 2,
    shotsOnTarget: 11,
    penalties: 0,
    openPlayGoals: 5,
    photoUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    matchweekGoals: [1, 2, 3, 4, 5],
  },
  {
    id: 3,
    name: "Alex Rono",
    clubName: "DP 2 A",
    clubShortCode: "DP2A",
    clubColor: "#ff0077",
    position: "Striker",
    matchesPlayed: 5,
    goals: 4,
    assists: 2,
    shotsOnTarget: 9,
    penalties: 1,
    openPlayGoals: 3,
    photoUrl:
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80",
    matchweekGoals: [1, 1, 2, 3, 4],
  },
  {
    id: 4,
    name: "Elly Adams Otieno",
    clubName: "Young Stars City",
    clubShortCode: "YSC",
    clubColor: "#f97316",
    position: "Captain / Forward",
    matchesPlayed: 4,
    goals: 4,
    assists: 1,
    shotsOnTarget: 8,
    penalties: 0,
    openPlayGoals: 4,
    matchweekGoals: [0, 1, 2, 3, 4],
  },
  {
    id: 5,
    name: "Hamard Adan",
    clubName: "Mzinga Boyz",
    clubShortCode: "MZB",
    clubColor: "#eab308",
    position: "Forward",
    matchesPlayed: 4,
    goals: 3,
    assists: 2,
    shotsOnTarget: 7,
    penalties: 0,
    openPlayGoals: 3,
    matchweekGoals: [0, 1, 2, 2, 3],
  },
  {
    id: 6,
    name: "Wokabi",
    clubName: "Royal Rangers",
    clubShortCode: "RR",
    clubColor: "#3b82f6",
    position: "Forward",
    matchesPlayed: 4,
    goals: 3,
    assists: 1,
    shotsOnTarget: 7,
    penalties: 1,
    openPlayGoals: 2,
    matchweekGoals: [0, 1, 2, 3, 3],
  },
  {
    id: 7,
    name: "Brian Mwangi",
    clubName: "Samba Boys",
    clubShortCode: "SMB",
    clubColor: "#00ff85",
    position: "Winger",
    matchesPlayed: 5,
    goals: 3,
    assists: 4,
    shotsOnTarget: 6,
    penalties: 0,
    openPlayGoals: 3,
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    matchweekGoals: [1, 1, 2, 2, 3],
  },
  {
    id: 8,
    name: "Kelvin Njoroge",
    clubName: "Grade 10 B",
    clubShortCode: "G10B",
    clubColor: "#ffe600",
    position: "Forward",
    matchesPlayed: 5,
    goals: 3,
    assists: 1,
    shotsOnTarget: 7,
    penalties: 0,
    openPlayGoals: 3,
    matchweekGoals: [1, 2, 2, 2, 3],
  },
];

export function GoldenBootLeaderboard({ customContenders }: GoldenBootLeaderboardProps) {
  const [selectedClub, setSelectedClub] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"race" | "trends" | "efficiency">("race");
  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>("Kevin Omondi");

  const contenders = customContenders || DEFAULT_CONTENDERS;

  const filteredContenders = useMemo(() => {
    return contenders
      .filter((c) => selectedClub === "ALL" || c.clubShortCode === selectedClub)
      .sort(
        (a, b) => b.goals - a.goals || b.assists - a.assists || a.matchesPlayed - b.matchesPlayed,
      );
  }, [contenders, selectedClub]);

  const leader = contenders[0];
  const clubs = Array.from(new Set(contenders.map((c) => c.clubShortCode)));
  const totalLeagueGoals = contenders.reduce((sum, c) => sum + c.goals, 0);

  // SVG Chart Dimensions for Scoring Trends
  const chartWidth = 580;
  const chartHeight = 220;
  const padding = 35;
  const maxGoalVal = Math.max(...contenders.map((c) => Math.max(...c.matchweekGoals)), 8);
  const matchweeks = [1, 2, 3, 4, 5];

  const getX = (mwIndex: number) => {
    return padding + (mwIndex / (matchweeks.length - 1)) * (chartWidth - padding * 2);
  };

  const getY = (goals: number) => {
    return chartHeight - padding - (goals / maxGoalVal) * (chartHeight - padding * 2);
  };

  return (
    <div className="space-y-6">
      {/* Golden Boot Trophy Header */}
      <div className="bg-gradient-to-r from-[#171033] via-[#0d0926] to-[#150f3b] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-lg shadow-amber-400/20">
                Official Golden Boot Trophy Race
              </span>
              <span className="text-xs text-amber-300 font-mono font-bold">Season 2026/27</span>
            </div>
            <h2 className="font-header text-3xl sm:text-5xl font-black text-white uppercase tracking-wider leading-none flex items-center gap-3">
              <span>Golden Boot</span>
              <span className="text-amber-400 text-3xl sm:text-4xl">👑</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Tracking the sharpest marksmen across the Sunday League with dynamic matchweek goal
              progression curves, conversion metrics, and club attacking trends.
            </p>
          </div>

          {/* Current Frontrunner Hero Card */}
          {leader && (
            <div className="bg-[#09061c]/90 border border-amber-400/40 p-4 sm:p-5 rounded-3xl shadow-xl flex items-center gap-4 shrink-0 sm:min-w-[280px]">
              <div className="relative">
                {leader.photoUrl ? (
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center font-black text-amber-300 text-xl">
                    👑
                  </div>
                )}
                <span className="absolute -top-2 -right-2 text-base">🥇</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Current Golden Boot Leader
                </span>
                <h4 className="text-base font-black text-white truncate">{leader.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#00f0ff] font-bold">{leader.clubName}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-emerald-400 font-mono font-black text-sm">
                    {leader.goals} Goals
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs & Club Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d0926]/90 border border-[#2e2554] p-3 rounded-2xl shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("race")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "race"
                ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-[#00f0ff] text-black font-black shadow-lg"
                : "bg-[#141029] text-gray-300 hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Marksman Standings</span>
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "trends"
                ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-[#00f0ff] text-black font-black shadow-lg"
                : "bg-[#141029] text-gray-300 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Goal Trajectory Charts</span>
          </button>
          <button
            onClick={() => setActiveTab("efficiency")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "efficiency"
                ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-[#00f0ff] text-black font-black shadow-lg"
                : "bg-[#141029] text-gray-300 hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Conversion & Open Play</span>
          </button>
        </div>

        {/* Club Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#00f0ff]" /> Club:
          </span>
          <button
            onClick={() => setSelectedClub("ALL")}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
              selectedClub === "ALL"
                ? "bg-[#00f0ff] text-black font-black"
                : "bg-[#141029] text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
          {clubs.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedClub(code)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                selectedClub === code
                  ? "bg-gradient-to-r from-emerald-400 to-[#00f0ff] text-black font-black"
                  : "bg-[#141029] text-gray-400 hover:text-white"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: MARKSMAN STANDINGS PODIUM & LIST */}
      {activeTab === "race" && (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredContenders.slice(0, 3).map((contender, idx) => {
              const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉";
              const border =
                idx === 0
                  ? "border-amber-400/50 bg-gradient-to-b from-[#1b143a] to-[#0e0a26]"
                  : idx === 1
                    ? "border-cyan-400/40 bg-gradient-to-b from-[#131538] to-[#0e0a26]"
                    : "border-purple-400/30 bg-gradient-to-b from-[#161033] to-[#0e0a26]";

              return (
                <div
                  key={contender.id}
                  onClick={() => setHighlightedPlayer(contender.name)}
                  className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 cursor-pointer hover:scale-[1.02] transition duration-200 ${border}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{medal}</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-black"
                      style={{ backgroundColor: contender.clubColor }}
                    >
                      {contender.clubShortCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {contender.photoUrl ? (
                      <img
                        src={contender.photoUrl}
                        alt={contender.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#1c1642] flex items-center justify-center font-black text-white text-base border border-white/10 shrink-0">
                        {contender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-base text-white truncate">
                        {contender.name}
                      </h4>
                      <span className="text-xs text-gray-400 block truncate">
                        {contender.clubName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {contender.position}
                      </span>
                    </div>
                  </div>

                  {/* Stat Strip */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2e2554] text-center">
                    <div className="bg-[#09061c] p-2 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        Goals
                      </span>
                      <span className="font-mono text-base font-black text-emerald-400">
                        {contender.goals}
                      </span>
                    </div>
                    <div className="bg-[#09061c] p-2 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        Assists
                      </span>
                      <span className="font-mono text-base font-black text-[#00f0ff]">
                        {contender.assists}
                      </span>
                    </div>
                    <div className="bg-[#09061c] p-2 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">
                        G/Match
                      </span>
                      <span className="font-mono text-base font-black text-amber-300">
                        {(contender.goals / contender.matchesPlayed).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Scorers Table */}
          <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#2e2554] flex items-center justify-between">
              <h3 className="font-header text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>All Contenders</span>
                <span className="text-xs font-mono text-gray-400 font-normal">
                  ({filteredContenders.length} players)
                </span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                {totalLeagueGoals} Total League Goals
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141029] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-[#2e2554]">
                  <tr>
                    <th className="py-3 px-4 text-center">Rank</th>
                    <th className="py-3 px-4">Player & Club</th>
                    <th className="py-3 px-3 text-center">Matches</th>
                    <th className="py-3 px-3 text-center font-black text-emerald-400">Goals ⚽</th>
                    <th className="py-3 px-3 text-center text-[#00f0ff]">Assists 👟</th>
                    <th className="py-3 px-3 text-center hidden sm:table-cell">Shots (Target)</th>
                    <th className="py-3 px-3 text-center hidden md:table-cell">Open Play</th>
                    <th className="py-3 px-4 text-right">Goals / Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2e2554]/50 font-semibold">
                  {filteredContenders.map((c, index) => {
                    const isSelected = highlightedPlayer === c.name;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setHighlightedPlayer(c.name)}
                        className={`hover:bg-[#181339] transition cursor-pointer ${
                          isSelected ? "bg-[#1b1442] border-l-4 border-amber-400" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`w-6 h-6 rounded-lg inline-flex items-center justify-center font-black text-xs ${
                              index === 0
                                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                                : index === 1
                                  ? "bg-cyan-400/20 text-[#00f0ff] border border-cyan-400/40"
                                  : index === 2
                                    ? "bg-purple-400/20 text-purple-300 border border-purple-400/40"
                                    : "text-gray-400"
                            }`}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow"
                              style={{ backgroundColor: c.clubColor }}
                            >
                              {c.clubShortCode}
                            </div>
                            <div className="min-w-0">
                              <span className="font-extrabold text-white text-sm block truncate">
                                {c.name}
                              </span>
                              <span className="text-[10px] text-gray-400 block truncate">
                                {c.clubName} • {c.position}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-gray-300">
                          {c.matchesPlayed}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-black text-base text-emerald-400">
                          {c.goals}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-sm text-[#00f0ff]">
                          {c.assists}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-gray-300 hidden sm:table-cell">
                          {c.shotsOnTarget}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-gray-300 hidden md:table-cell">
                          {c.openPlayGoals}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-300">
                          {(c.goals / c.matchesPlayed).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOAL TRAJECTORY CHARTS (SVG DATA VISUALIZATION) */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
              <div>
                <span className="text-[10px] uppercase font-black text-[#00f0ff] tracking-wider block">
                  Scoring Velocity & Trend Analysis
                </span>
                <h3 className="font-header text-2xl font-black text-white uppercase tracking-wider">
                  Matchweek Goal Progression Curve
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Cumulative goal trajectory plotted across Matchweeks 1 through 5.
                </p>
              </div>

              {/* Player selector badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                {contenders.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setHighlightedPlayer(c.name)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 ${
                      highlightedPlayer === c.name
                        ? "bg-white text-black font-black shadow"
                        : "bg-[#141029] text-gray-400 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.clubColor }}
                    />
                    <span>{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[580px] p-2 bg-[#09061c] rounded-2xl border border-[#2e2554]">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto overflow-visible"
                >
                  {/* Grid Lines */}
                  {[0, 2, 4, 6, 8].map((g) => {
                    const y = getY(g);
                    return (
                      <g key={g}>
                        <line
                          x1={padding}
                          y1={y}
                          x2={chartWidth - padding}
                          y2={y}
                          stroke="#231b47"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={padding - 10}
                          y={y + 4}
                          fill="#6b7280"
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {g}G
                        </text>
                      </g>
                    );
                  })}

                  {/* Matchweek X-axis Labels */}
                  {matchweeks.map((mw, idx) => {
                    const x = getX(idx);
                    return (
                      <g key={mw}>
                        <line
                          x1={x}
                          y1={padding}
                          x2={x}
                          y2={chartHeight - padding}
                          stroke="#231b47"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={chartHeight - padding + 18}
                          fill="#9ca3af"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          MW {mw}
                        </text>
                      </g>
                    );
                  })}

                  {/* Plot curves for top 5 contenders */}
                  {contenders.slice(0, 5).map((contender) => {
                    const isSelected = highlightedPlayer === contender.name;
                    const strokeWidth = isSelected ? 3.5 : 2;
                    const strokeOpacity = isSelected ? 1 : 0.45;

                    const points = contender.matchweekGoals
                      .map((goals, idx) => {
                        return `${getX(idx)},${getY(goals)}`;
                      })
                      .join(" ");

                    return (
                      <g key={contender.id}>
                        {/* Connecting Line */}
                        <polyline
                          fill="none"
                          stroke={contender.clubColor}
                          strokeWidth={strokeWidth}
                          strokeOpacity={strokeOpacity}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />

                        {/* Data Points */}
                        {contender.matchweekGoals.map((goals, idx) => {
                          const x = getX(idx);
                          const y = getY(goals);
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r={isSelected ? 5 : 3.5}
                              fill={contender.clubColor}
                              stroke="#09061c"
                              strokeWidth="2"
                              className="cursor-pointer hover:r-6 transition-all"
                            >
                              <title>
                                {contender.name} (MW {idx + 1}): {goals} Goals
                              </title>
                            </circle>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Trajectory Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {contenders.slice(0, 6).map((c) => {
                const recentForm = c.matchweekGoals.slice(-3);
                return (
                  <div
                    key={c.id}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: c.clubColor }}
                        />
                        <span className="font-bold text-white text-xs">{c.name}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-black text-xs">
                        {c.goals} Goals
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>Recent 3 Matchweeks:</span>
                      <span className="font-mono text-amber-300 font-bold">
                        {recentForm.join(" ➔ ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONVERSION & OPEN PLAY EFFICIENCY */}
      {activeTab === "efficiency" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contenders.slice(0, 6).map((c) => {
              const conversion = ((c.goals / (c.shotsOnTarget || 1)) * 100).toFixed(1);
              const openPlayPct = ((c.openPlayGoals / c.goals) * 100).toFixed(0);

              return (
                <div
                  key={c.id}
                  className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-5 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white"
                        style={{ backgroundColor: c.clubColor }}
                      >
                        {c.clubShortCode}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{c.name}</h4>
                        <span className="text-[10px] text-gray-400">{c.clubName}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-xs">
                      {c.goals} Total Goals
                    </span>
                  </div>

                  {/* Shot Conversion Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
                      <span>Shot Conversion Rate</span>
                      <span className="text-[#00f0ff] font-mono">{conversion}% Efficiency</span>
                    </div>
                    <div className="w-full bg-[#080517] rounded-full h-2 overflow-hidden border border-[#2e2554]">
                      <div
                        className="bg-gradient-to-r from-[#00f0ff] to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${Math.min(Number(conversion) * 1.5, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Goal Composition Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                    <div className="bg-[#141029] p-2 rounded-xl border border-[#2e2554]">
                      <span className="text-gray-400 block uppercase font-bold">Open Play</span>
                      <span className="font-mono text-emerald-400 font-bold text-xs">
                        {c.openPlayGoals} ({openPlayPct}%)
                      </span>
                    </div>
                    <div className="bg-[#141029] p-2 rounded-xl border border-[#2e2554]">
                      <span className="text-gray-400 block uppercase font-bold">Penalties</span>
                      <span className="font-mono text-amber-300 font-bold text-xs">
                        {c.penalties}
                      </span>
                    </div>
                    <div className="bg-[#141029] p-2 rounded-xl border border-[#2e2554]">
                      <span className="text-gray-400 block uppercase font-bold">Assists</span>
                      <span className="font-mono text-[#00f0ff] font-bold text-xs">
                        {c.assists}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
