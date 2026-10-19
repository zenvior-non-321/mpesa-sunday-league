import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Zap,
  TrendingUp,
  Award,
  ChevronDown,
  Activity,
  ArrowUpRight,
  Flame,
  Scale,
} from "lucide-react";

export interface TeamRadarMetric {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  cleanSheets: number;
  form: string[];
}

const DEFAULT_RADAR_TEAMS: TeamRadarMetric[] = [
  {
    id: 1,
    name: "Samba Boys",
    shortCode: "SMB",
    color: "#00ff85",
    mp: 5,
    w: 4,
    d: 1,
    l: 0,
    gf: 14,
    ga: 3,
    gd: 11,
    pts: 13,
    cleanSheets: 3,
    form: ["W", "W", "D", "W", "W"],
  },
  {
    id: 2,
    name: "Grade 10 A",
    shortCode: "G10A",
    color: "#00f0ff",
    mp: 5,
    w: 3,
    d: 1,
    l: 1,
    gf: 10,
    ga: 5,
    gd: 5,
    pts: 10,
    cleanSheets: 2,
    form: ["W", "L", "W", "D", "W"],
  },
  {
    id: 6,
    name: "Royal Rangers",
    shortCode: "RR",
    color: "#3b82f6",
    mp: 5,
    w: 3,
    d: 1,
    l: 1,
    gf: 10,
    ga: 5,
    gd: 5,
    pts: 10,
    cleanSheets: 2,
    form: ["W", "W", "D", "W", "L"],
  },
  {
    id: 7,
    name: "Young Stars City",
    shortCode: "YSC",
    color: "#f97316",
    mp: 5,
    w: 3,
    d: 0,
    l: 2,
    gf: 11,
    ga: 8,
    gd: 3,
    pts: 9,
    cleanSheets: 1,
    form: ["L", "W", "W", "L", "W"],
  },
  {
    id: 8,
    name: "Mzinga Boyz",
    shortCode: "MZB",
    color: "#eab308",
    mp: 5,
    w: 2,
    d: 2,
    l: 1,
    gf: 8,
    ga: 6,
    gd: 2,
    pts: 8,
    cleanSheets: 2,
    form: ["D", "W", "L", "W", "D"],
  },
  {
    id: 3,
    name: "Grade 10 B",
    shortCode: "G10B",
    color: "#ffe600",
    mp: 5,
    w: 1,
    d: 2,
    l: 2,
    gf: 6,
    ga: 8,
    gd: -2,
    pts: 5,
    cleanSheets: 1,
    form: ["D", "D", "L", "W", "L"],
  },
  {
    id: 4,
    name: "DP 2 A",
    shortCode: "DP2A",
    color: "#ff0077",
    mp: 5,
    w: 1,
    d: 1,
    l: 3,
    gf: 5,
    ga: 11,
    gd: -6,
    pts: 4,
    cleanSheets: 0,
    form: ["L", "D", "W", "L", "L"],
  },
  {
    id: 5,
    name: "DP 2 B",
    shortCode: "DP2B",
    color: "#a855f7",
    mp: 5,
    w: 0,
    d: 1,
    l: 4,
    gf: 2,
    ga: 17,
    gd: -15,
    pts: 1,
    cleanSheets: 0,
    form: ["L", "L", "L", "D", "L"],
  },
];

interface RadarAxis {
  key: string;
  label: string;
  max: number;
  getValue: (t: TeamRadarMetric) => number;
  format: (val: number) => string;
}

const RADAR_AXES: RadarAxis[] = [
  {
    key: "wins",
    label: "Wins",
    max: 5,
    getValue: (t) => t.w,
    format: (v) => `${v}W`,
  },
  {
    key: "goalsScored",
    label: "Goals Scored",
    max: 15,
    getValue: (t) => t.gf,
    format: (v) => `${v} GF`,
  },
  {
    key: "defensiveSecurity",
    label: "Defense (Low GA)",
    max: 15,
    // Inverted so fewer goals conceded = higher radar score
    getValue: (t) => Math.max(0, 15 - t.ga),
    format: (v) => `${15 - v} GA`,
  },
  {
    key: "lossesInverted",
    label: "Loss Avoidance",
    max: 5,
    // Inverted so fewer losses = higher radar score
    getValue: (t) => Math.max(0, 5 - t.l),
    format: (v) => `${5 - v}L`,
  },
  {
    key: "goalDifference",
    label: "Goal Difference",
    max: 20,
    // Shifted scale: -10 to +10 mapped to 0 to 20
    getValue: (t) => Math.max(0, Math.min(20, t.gd + 10)),
    format: (v) => (v - 10 > 0 ? `+${v - 10}` : `${v - 10}`),
  },
  {
    key: "pointsRate",
    label: "Points Rate",
    max: 3.0,
    getValue: (t) => (t.mp > 0 ? Number((t.pts / t.mp).toFixed(2)) : 0),
    format: (v) => `${v} PPG`,
  },
];

export function TeamPerformanceRadar() {
  const [teams, setTeams] = useState<TeamRadarMetric[]>(DEFAULT_RADAR_TEAMS);
  const [primaryTeamId, setPrimaryTeamId] = useState<number>(1); // Samba Boys
  const [compareTeamId, setCompareTeamId] = useState<number | null>(6); // Royal Rangers
  const [isCompareMode, setIsCompareMode] = useState<boolean>(true);

  // Sync teams from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mpesa_pes_teams_v6");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: TeamRadarMetric[] = parsed.map((item, idx) => ({
            id: item.id ?? idx + 1,
            name: item.name || `Club #${idx + 1}`,
            shortCode: item.shortCode || `C${idx + 1}`,
            color: item.color || "#00f0ff",
            mp: Number(item.mp) || 0,
            w: Number(item.w) || 0,
            d: Number(item.d) || 0,
            l: Number(item.l) || 0,
            gf: Number(item.gf) || 0,
            ga: Number(item.ga) || 0,
            gd: (Number(item.gf) || 0) - (Number(item.ga) || 0),
            pts: Number(item.pts) || 0,
            cleanSheets: item.cleanSheets ? Number(item.cleanSheets) : 1,
            form: Array.isArray(item.form) ? item.form : ["-", "-", "-", "-", "-"],
          }));
          setTeams(mapped);
        }
      }
    } catch {
      // Use fallback
    }
  }, []);

  const primaryTeam = useMemo(
    () => teams.find((t) => t.id === primaryTeamId) || teams[0] || DEFAULT_RADAR_TEAMS[0],
    [teams, primaryTeamId],
  );

  const compareTeam = useMemo(() => {
    if (!isCompareMode || compareTeamId === null) return null;
    return teams.find((t) => t.id === compareTeamId) || null;
  }, [teams, compareTeamId, isCompareMode]);

  // Geometry calculations for SVG radar
  const size = 380;
  const center = size / 2;
  const radius = center - 55;
  const numAxes = RADAR_AXES.length;
  const angleStep = (2 * Math.PI) / numAxes;

  // Compute coordinate on axis at ratio [0, 1]
  const getCoordinates = (index: number, ratio: number) => {
    // Start at top (-PI/2) and rotate clockwise
    const angle = -Math.PI / 2 + index * angleStep;
    const r = radius * Math.max(0.05, Math.min(1, ratio));
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build SVG polygon points string for a team
  const buildPolygonPoints = (team: TeamRadarMetric) => {
    return RADAR_AXES.map((axis, idx) => {
      const rawVal = axis.getValue(team);
      const ratio = rawVal / axis.max;
      const { x, y } = getCoordinates(idx, ratio);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  };

  // Concentric polygon web rings (20%, 40%, 60%, 80%, 100%)
  const webRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00f0ff] via-indigo-400 to-[#00ff85] text-black shadow">
              Tactical Analytics
            </span>
            <span className="text-xs text-gray-400 font-mono">Season 2026/27</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-3">
            <span>Team Performance Radar</span>
            <Activity className="w-7 h-7 text-[#00f0ff]" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Multi-metric spider radar visualizing wins, losses, and goal potency across all clubs.
          </p>
        </div>

        {/* Selection Dropdowns & Compare Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Team Picker */}
          <div className="flex items-center gap-2 bg-[#141029] border border-[#2e2554] p-2 rounded-2xl">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: primaryTeam.color || "#00f0ff" }}
            />
            <select
              value={primaryTeamId}
              onChange={(e) => setPrimaryTeamId(Number(e.target.value))}
              aria-label="Primary Club for Radar Analysis"
              className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer pr-2"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#141029] text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Head-to-Head Comparison */}
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition cursor-pointer border ${
              isCompareMode
                ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/20"
                : "bg-[#141029] border-[#2e2554] text-gray-400 hover:text-white"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isCompareMode ? "Compare Active" : "+ Compare Rival"}</span>
          </button>

          {/* Compare Team Picker */}
          {isCompareMode && (
            <div className="flex items-center gap-2 bg-[#141029] border border-purple-500/40 p-2 rounded-2xl animate-in fade-in">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: compareTeam?.color || "#f43f5e" }}
              />
              <select
                value={compareTeamId ?? ""}
                onChange={(e) => setCompareTeamId(Number(e.target.value))}
                aria-label="Rival Club for Head-to-Head Comparison"
                className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer pr-2"
              >
                {teams
                  .filter((t) => t.id !== primaryTeamId)
                  .map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#141029] text-white">
                      vs {t.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Radar Visualizer & Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Display (5 cols) */}
        <div className="lg:col-span-5 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle Cyber Glow in background */}
          <div
            className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: primaryTeam.color || "#00f0ff" }}
          />
          {compareTeam && (
            <div
              className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: compareTeam.color || "#f43f5e" }}
            />
          )}

          {/* Radar Header & Legend */}
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-xs font-black uppercase text-white tracking-wider">
                Multi-Axis Spider Plot
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-black">
              <span className="flex items-center gap-1.5 text-gray-200">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: primaryTeam.color || "#00f0ff" }}
                />
                {primaryTeam.shortCode}
              </span>
              {compareTeam && (
                <span className="flex items-center gap-1.5 text-purple-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: compareTeam.color || "#f43f5e" }}
                  />
                  {compareTeam.shortCode}
                </span>
              )}
            </div>
          </div>

          {/* SVG Radar Chart */}
          <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center my-2">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full drop-shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            >
              <defs>
                <linearGradient id="primaryPolyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={primaryTeam.color || "#00f0ff"} stopOpacity="0.45" />
                  <stop
                    offset="100%"
                    stopColor={primaryTeam.color || "#00f0ff"}
                    stopOpacity="0.1"
                  />
                </linearGradient>
                {compareTeam && (
                  <linearGradient id="comparePolyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop
                      offset="0%"
                      stopColor={compareTeam.color || "#f43f5e"}
                      stopOpacity="0.45"
                    />
                    <stop
                      offset="100%"
                      stopColor={compareTeam.color || "#f43f5e"}
                      stopOpacity="0.1"
                    />
                  </linearGradient>
                )}
              </defs>

              {/* Concentric Web Rings */}
              {webRings.map((ringRatio, rIdx) => {
                const ringPoints = RADAR_AXES.map((_, aIdx) => {
                  const { x, y } = getCoordinates(aIdx, ringRatio);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(" ");

                return (
                  <polygon
                    key={rIdx}
                    points={ringPoints}
                    fill="none"
                    stroke="#2e2554"
                    strokeWidth="1"
                    strokeDasharray={rIdx === webRings.length - 1 ? "none" : "3,3"}
                    className="opacity-70"
                  />
                );
              })}

              {/* Spoke Axis Lines */}
              {RADAR_AXES.map((_, aIdx) => {
                const { x, y } = getCoordinates(aIdx, 1.0);
                return (
                  <line
                    key={aIdx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#2e2554"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Primary Team Radar Polygon */}
              <polygon
                points={buildPolygonPoints(primaryTeam)}
                fill="url(#primaryPolyGradient)"
                stroke={primaryTeam.color || "#00f0ff"}
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="transition-all duration-500"
              />

              {/* Primary Team Data Point Circles */}
              {RADAR_AXES.map((axis, idx) => {
                const raw = axis.getValue(primaryTeam);
                const ratio = raw / axis.max;
                const { x, y } = getCoordinates(idx, ratio);
                return (
                  <circle
                    key={`p-${idx}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={primaryTeam.color || "#00f0ff"}
                    stroke="#070512"
                    strokeWidth="1.5"
                    className="transition-all duration-500 hover:scale-150"
                  />
                );
              })}

              {/* Compare Team Radar Polygon (if active) */}
              {compareTeam && (
                <>
                  <polygon
                    points={buildPolygonPoints(compareTeam)}
                    fill="url(#comparePolyGradient)"
                    stroke={compareTeam.color || "#f43f5e"}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeDasharray="4,2"
                    className="transition-all duration-500"
                  />
                  {RADAR_AXES.map((axis, idx) => {
                    const raw = axis.getValue(compareTeam);
                    const ratio = raw / axis.max;
                    const { x, y } = getCoordinates(idx, ratio);
                    return (
                      <circle
                        key={`c-${idx}`}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill={compareTeam.color || "#f43f5e"}
                        stroke="#070512"
                        strokeWidth="1.5"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </>
              )}

              {/* Axis Label Badges around perimeter */}
              {RADAR_AXES.map((axis, idx) => {
                const angle = -Math.PI / 2 + idx * angleStep;
                const labelRadius = radius + 32;
                const lx = center + labelRadius * Math.cos(angle);
                const ly = center + labelRadius * Math.sin(angle);

                return (
                  <g key={`lbl-${idx}`}>
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-300 text-[10px] font-black uppercase tracking-wider"
                    >
                      {axis.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Metrics Footer */}
          <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#2e2554] text-center text-xs">
            <div className="p-2 rounded-xl bg-[#141029]/80 border border-[#2e2554]">
              <span className="text-[10px] text-gray-400 uppercase block font-bold">Win Rate</span>
              <span className="font-mono text-sm font-black text-emerald-400">
                {primaryTeam.mp > 0 ? Math.round((primaryTeam.w / primaryTeam.mp) * 100) : 0}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[#141029]/80 border border-[#2e2554]">
              <span className="text-[10px] text-gray-400 uppercase block font-bold">Goals / M</span>
              <span className="font-mono text-sm font-black text-[#00f0ff]">
                {primaryTeam.mp > 0 ? (primaryTeam.gf / primaryTeam.mp).toFixed(1) : 0}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[#141029]/80 border border-[#2e2554]">
              <span className="text-[10px] text-gray-400 uppercase block font-bold">Goal Diff</span>
              <span
                className={`font-mono text-sm font-black ${
                  primaryTeam.gd > 0
                    ? "text-emerald-400"
                    : primaryTeam.gd < 0
                      ? "text-rose-400"
                      : "text-gray-300"
                }`}
              >
                {primaryTeam.gd > 0 ? `+${primaryTeam.gd}` : primaryTeam.gd}
              </span>
            </div>
          </div>
        </div>

        {/* Head-to-Head & Analytical Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Club Showcase & Season Form */}
          <div className="bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-black shadow-lg"
                  style={{ backgroundColor: primaryTeam.color || "#00f0ff" }}
                >
                  {primaryTeam.shortCode}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight uppercase">
                    {primaryTeam.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    Record: {primaryTeam.w}W - {primaryTeam.d}D - {primaryTeam.l}L (
                    {primaryTeam.pts} pts)
                  </span>
                </div>
              </div>

              {/* Form Guide Pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-gray-400 mr-1">Form:</span>
                {primaryTeam.form.map((res, i) => (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                      res === "W"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : res === "D"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : res === "L"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>

            {/* Compare Club Bar (if active) */}
            {compareTeam && (
              <div className="p-3 bg-[#141029] rounded-2xl border border-purple-500/30 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-black"
                    style={{ backgroundColor: compareTeam.color || "#f43f5e" }}
                  >
                    {compareTeam.shortCode}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white leading-tight uppercase">
                      vs {compareTeam.name}
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      {compareTeam.w}W - {compareTeam.d}D - {compareTeam.l}L ({compareTeam.pts} pts)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {compareTeam.form.map((res, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${
                        res === "W"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : res === "D"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metric Comparison Table */}
          <div className="bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Direct Axis Comparison</span>
            </h4>

            <div className="space-y-2.5">
              {RADAR_AXES.map((axis) => {
                const valA = axis.getValue(primaryTeam);
                const valB = compareTeam ? axis.getValue(compareTeam) : null;
                const ratioA = Math.min(100, Math.round((valA / axis.max) * 100));
                const ratioB =
                  valB !== null ? Math.min(100, Math.round((valB / axis.max) * 100)) : null;

                return (
                  <div
                    key={axis.key}
                    className="p-3 bg-[#141029]/80 rounded-2xl border border-[#2e2554] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-300">{axis.label}</span>
                      <div className="flex items-center gap-3 font-mono font-black">
                        <span style={{ color: primaryTeam.color || "#00f0ff" }}>
                          {axis.format(valA)}
                        </span>
                        {valB !== null && compareTeam && (
                          <>
                            <span className="text-gray-500 text-[10px]">vs</span>
                            <span style={{ color: compareTeam.color || "#f43f5e" }}>
                              {axis.format(valB)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-1">
                      {/* Primary Bar */}
                      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${ratioA}%`,
                            backgroundColor: primaryTeam.color || "#00f0ff",
                          }}
                        />
                      </div>

                      {/* Compare Bar (if active) */}
                      {ratioB !== null && compareTeam && (
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden flex">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${ratioB}%`,
                              backgroundColor: compareTeam.color || "#f43f5e",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
