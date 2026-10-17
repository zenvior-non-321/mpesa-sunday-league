import React, { useState, useEffect, useMemo } from "react";
import { useRoleAccess } from "../hooks/useRoleAccess";

export interface PlayerStat {
  id: number;
  name: string;
  teamId: number;
  position: "FWD" | "MID" | "DEF" | "GK";
  foot: "Right" | "Left" | "Both";
  goals: number;
  assists: number;
  starts: number;
  matches: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  photoUrl?: string;
  rating?: number;
}

export interface Team {
  id: number;
  name: string;
  shortCode: string;
  color: string;
}

const DEFAULT_TEAMS: Team[] = [
  { id: 1, name: "Samba Boys", shortCode: "SMB", color: "#00ff85" },
  { id: 2, name: "Grade 10 A", shortCode: "G10A", color: "#00f0ff" },
  { id: 3, name: "Grade 10 B", shortCode: "G10B", color: "#ffe600" },
  { id: 4, name: "DP 2 A", shortCode: "DP2A", color: "#ff0055" },
  { id: 5, name: "DP 2 B", shortCode: "DP2B", color: "#9d00ff" },
];

const DEFAULT_STATS: PlayerStat[] = [
  {
    id: 1,
    name: "Kevin Omondi",
    teamId: 1,
    position: "FWD",
    foot: "Right",
    goals: 8,
    assists: 3,
    starts: 6,
    matches: 6,
    cleanSheets: 0,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: 2,
    name: "Emmanuel Kip",
    teamId: 2,
    position: "FWD",
    foot: "Left",
    goals: 6,
    assists: 2,
    starts: 5,
    matches: 5,
    cleanSheets: 0,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 3,
    name: "Brian Mwangi",
    teamId: 1,
    position: "MID",
    foot: "Right",
    goals: 4,
    assists: 7,
    starts: 6,
    matches: 6,
    cleanSheets: 0,
    yellowCards: 2,
    redCards: 0,
  },
  {
    id: 4,
    name: "Kelvin Njoroge",
    teamId: 3,
    position: "FWD",
    foot: "Right",
    goals: 5,
    assists: 1,
    starts: 5,
    matches: 6,
    cleanSheets: 0,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: 5,
    name: "Alex Rono",
    teamId: 4,
    position: "FWD",
    foot: "Left",
    goals: 4,
    assists: 4,
    starts: 5,
    matches: 5,
    cleanSheets: 0,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 6,
    name: "Dan Kiprop",
    teamId: 1,
    position: "GK",
    foot: "Both",
    goals: 0,
    assists: 0,
    starts: 6,
    matches: 6,
    cleanSheets: 4,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 7,
    name: "John Doe",
    teamId: 2,
    position: "GK",
    foot: "Right",
    goals: 0,
    assists: 0,
    starts: 5,
    matches: 5,
    cleanSheets: 3,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: 8,
    name: "Hassan Ali",
    teamId: 5,
    position: "MID",
    foot: "Both",
    goals: 3,
    assists: 5,
    starts: 5,
    matches: 5,
    cleanSheets: 0,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: 9,
    name: "Samuel Otieno",
    teamId: 1,
    position: "DEF",
    foot: "Right",
    goals: 1,
    assists: 2,
    starts: 6,
    matches: 6,
    cleanSheets: 4,
    yellowCards: 3,
    redCards: 0,
  },
  {
    id: 10,
    name: "Bradley Barasa",
    teamId: 2,
    position: "DEF",
    foot: "Right",
    goals: 0,
    assists: 1,
    starts: 5,
    matches: 5,
    cleanSheets: 3,
    yellowCards: 0,
    redCards: 0,
  },
];

type SortKey =
  | "rank"
  | "name"
  | "team"
  | "position"
  | "matches"
  | "goals"
  | "assists"
  | "cleanSheets"
  | "yellowCards"
  | "redCards"
  | "performance";

export function PlayerLeaderboard() {
  const { currentRole, isSuperAdmin } = useRoleAccess();
  const canManageStats =
    isSuperAdmin || currentRole === "RECORDS_MANAGER" || currentRole === "PRESIDENT";

  const [stats, setStats] = useState<PlayerStat[]>([]);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("ALL");
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>("ALL");

  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>("goals");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal State for Editing / Adding stats
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingStat, setEditingStat] = useState<PlayerStat | null>(null);

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem("mpesa_pes_stats_v6");
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStats(parsed);
        } else {
          setStats(DEFAULT_STATS);
        }
      } else {
        setStats(DEFAULT_STATS);
      }

      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
        }
      }
    } catch {
      setStats(DEFAULT_STATS);
    }
  }, []);

  const persistStats = (updated: PlayerStat[]) => {
    setStats(updated);
    try {
      localStorage.setItem("mpesa_pes_stats_v6", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  };

  const getTeam = (teamId: number): Team => {
    return (
      teams.find((t) => t.id === teamId) || {
        id: teamId,
        name: `Club #${teamId}`,
        shortCode: `C${teamId}`,
        color: "#00f0ff",
      }
    );
  };

  // Performance Rating formula: (G * 4) + (A * 3) + (CS * 4) + (M * 1) - (YC * 1) - (RC * 3)
  const calcPerformance = (s: PlayerStat): number => {
    return (
      s.goals * 4 +
      s.assists * 3 +
      s.cleanSheets * 4 +
      s.matches * 1 -
      s.yellowCards * 1 -
      s.redCards * 3
    );
  };

  // Top performers
  const topScorer = useMemo(() => {
    return [...stats].sort((a, b) => b.goals - a.goals)[0] || null;
  }, [stats]);

  const topPlaymaker = useMemo(() => {
    return [...stats].sort((a, b) => b.assists - a.assists)[0] || null;
  }, [stats]);

  const topKeeper = useMemo(() => {
    return (
      [...stats]
        .filter((s) => s.position === "GK")
        .sort((a, b) => b.cleanSheets - a.cleanSheets)[0] || null
    );
  }, [stats]);

  // Handle column header sort click
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  // Filtered & Sorted Rows
  const sortedPlayers = useMemo(() => {
    const result = stats.filter((player) => {
      const matchSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTeam =
        selectedTeamFilter === "ALL" || player.teamId === Number(selectedTeamFilter);
      const matchPosition =
        selectedPositionFilter === "ALL" || player.position === selectedPositionFilter;
      return matchSearch && matchTeam && matchPosition;
    });

    result.sort((a, b) => {
      let valA: string | number = 0;
      let valB: string | number = 0;

      switch (sortKey) {
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case "team":
          valA = getTeam(a.teamId).name.toLowerCase();
          valB = getTeam(b.teamId).name.toLowerCase();
          break;
        case "position":
          valA = a.position;
          valB = b.position;
          break;
        case "matches":
          valA = a.matches;
          valB = b.matches;
          break;
        case "goals":
          valA = a.goals;
          valB = b.goals;
          break;
        case "assists":
          valA = a.assists;
          valB = b.assists;
          break;
        case "cleanSheets":
          valA = a.cleanSheets;
          valB = b.cleanSheets;
          break;
        case "yellowCards":
          valA = a.yellowCards;
          valB = b.yellowCards;
          break;
        case "redCards":
          valA = a.redCards;
          valB = b.redCards;
          break;
        case "performance":
        default:
          valA = calcPerformance(a);
          valB = calcPerformance(b);
          break;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [stats, searchQuery, selectedTeamFilter, selectedPositionFilter, sortKey, sortOrder]);

  // Open modal to add new stat
  const handleOpenAddModal = () => {
    setEditingStat({
      id: Date.now(),
      name: "",
      teamId: teams[0]?.id || 1,
      position: "FWD",
      foot: "Right",
      goals: 0,
      assists: 0,
      starts: 1,
      matches: 1,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
    });
    setOpenModal(true);
  };

  // Save Modal
  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat || !editingStat.name.trim()) return;

    const existingIdx = stats.findIndex((s) => s.id === editingStat.id);
    let updated: PlayerStat[];

    if (existingIdx !== -1) {
      updated = stats.map((s) => (s.id === editingStat.id ? editingStat : s));
    } else {
      updated = [...stats, editingStat];
    }

    persistStats(updated);
    setOpenModal(false);
    setEditingStat(null);
  };

  // Delete Stat
  const handleDeleteStat = (statId: number) => {
    const item = stats.find((s) => s.id === statId);
    if (window.confirm(`Delete record for ${item?.name || "this player"}?`)) {
      const updated = stats.filter((s) => s.id !== statId);
      persistStats(updated);
      if (editingStat?.id === statId) {
        setOpenModal(false);
        setEditingStat(null);
      }
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <span className="text-gray-500 text-[10px] ml-1">⇅</span>;
    }
    return sortOrder === "asc" ? (
      <span className="text-[#00f0ff] font-black text-xs ml-1">▲</span>
    ) : (
      <span className="text-[#00f0ff] font-black text-xs ml-1">▼</span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow">
              Individual Honors
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Total Tracked Athletes: {stats.length}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mt-1">
            Player Leaderboard & Performance
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Interactive sortable rankings for Golden Boot top scorers, assist kings, and matchday
            MVPs.
          </p>
        </div>

        {canManageStats && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
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
              <span>+ Record Player Stat</span>
            </button>
          </div>
        )}
      </div>

      {/* Top Performer Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Golden Boot Leader */}
        {topScorer && (
          <div className="bg-gradient-to-br from-[#1a1438] to-[#0d0a21] border-2 border-amber-400/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                🥇 Golden Boot Leader
              </span>
              <span className="text-2xl">👟⚽</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20"
                style={{ backgroundColor: getTeam(topScorer.teamId).color }}
              >
                {getTeam(topScorer.teamId).shortCode}
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-black text-white truncate leading-tight">
                  {topScorer.name}
                </h4>
                <p className="text-xs text-gray-400 truncate">{getTeam(topScorer.teamId).name}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2e2554] flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Goals Scored</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {topScorer.goals} Goals
              </span>
            </div>
          </div>
        )}

        {/* Playmaker King */}
        {topPlaymaker && (
          <div className="bg-gradient-to-br from-[#1a1438] to-[#0d0a21] border-2 border-[#00f0ff]/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
                🥈 Assist King (Playmaker)
              </span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20"
                style={{ backgroundColor: getTeam(topPlaymaker.teamId).color }}
              >
                {getTeam(topPlaymaker.teamId).shortCode}
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-black text-white truncate leading-tight">
                  {topPlaymaker.name}
                </h4>
                <p className="text-xs text-gray-400 truncate">
                  {getTeam(topPlaymaker.teamId).name}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2e2554] flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Decisive Assists</span>
              <span className="text-2xl font-black text-[#00f0ff] font-mono">
                {topPlaymaker.assists} Assists
              </span>
            </div>
          </div>
        )}

        {/* Golden Glove Leader */}
        {topKeeper ? (
          <div className="bg-gradient-to-br from-[#1a1438] to-[#0d0a21] border-2 border-emerald-400/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🧤 Golden Glove (Clean Sheets)
              </span>
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20"
                style={{ backgroundColor: getTeam(topKeeper.teamId).color }}
              >
                {getTeam(topKeeper.teamId).shortCode}
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-black text-white truncate leading-tight">
                  {topKeeper.name}
                </h4>
                <p className="text-xs text-gray-400 truncate">{getTeam(topKeeper.teamId).name}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2e2554] flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Shutouts</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {topKeeper.cleanSheets} Clean Sheets
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-[#141029] border border-[#2e2554] rounded-3xl p-5 flex items-center justify-center text-gray-400 text-xs">
            Goalkeeper stats will appear once match clean sheets are recorded.
          </div>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#070512]/70 border border-[#2e2554] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student athlete by name..."
            className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Team Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-bold uppercase text-[10px]">Club:</span>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-xs text-white font-bold"
            >
              <option value="ALL">All Clubs</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-bold uppercase text-[10px]">Position:</span>
            <select
              value={selectedPositionFilter}
              onChange={(e) => setSelectedPositionFilter(e.target.value)}
              className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-xs text-white font-bold"
            >
              <option value="ALL">All Positions</option>
              <option value="FWD">Forward (FWD)</option>
              <option value="MID">Midfielder (MID)</option>
              <option value="DEF">Defender (DEF)</option>
              <option value="GK">Goalkeeper (GK)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SORTABLE TABLE LAYOUT */}
      <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header with Clickable Sorting */}
            <thead>
              <tr className="border-b border-[#2e2554] bg-[#141029]/80 text-gray-300 font-extrabold uppercase text-[10px] tracking-wider select-none">
                <th
                  className="py-4 px-4 text-center cursor-pointer hover:text-white"
                  onClick={() => handleSort("rank")}
                >
                  # {getSortIcon("rank")}
                </th>
                <th
                  className="py-4 px-4 cursor-pointer hover:text-white"
                  onClick={() => handleSort("name")}
                >
                  Player Name {getSortIcon("name")}
                </th>
                <th
                  className="py-4 px-4 cursor-pointer hover:text-white"
                  onClick={() => handleSort("team")}
                >
                  Club {getSortIcon("team")}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-white"
                  onClick={() => handleSort("position")}
                >
                  Pos {getSortIcon("position")}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-white"
                  onClick={() => handleSort("matches")}
                >
                  MP {getSortIcon("matches")}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-[#00ff85] bg-[#00ff85]/10 text-[#00ff85]"
                  onClick={() => handleSort("goals")}
                >
                  ⚽ Goals {getSortIcon("goals")}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]"
                  onClick={() => handleSort("assists")}
                >
                  🎯 Assists {getSortIcon("assists")}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-emerald-300"
                  onClick={() => handleSort("cleanSheets")}
                >
                  🧤 Clean {getSortIcon("cleanSheets")}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-amber-300"
                  onClick={() => handleSort("yellowCards")}
                >
                  🟨 YC {getSortIcon("yellowCards")}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-rose-400"
                  onClick={() => handleSort("redCards")}
                >
                  🟥 RC {getSortIcon("redCards")}
                </th>
                <th
                  className="py-4 px-4 text-right cursor-pointer hover:text-purple-300"
                  onClick={() => handleSort("performance")}
                >
                  Rating {getSortIcon("performance")}
                </th>
                {canManageStats && <th className="py-4 px-4 text-center">Actions</th>}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#2e2554]/40 font-semibold text-gray-200">
              {sortedPlayers.map((player, idx) => {
                const team = getTeam(player.teamId);
                const score = calcPerformance(player);

                return (
                  <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                    {/* Rank */}
                    <td className="py-3 px-4 text-center">
                      {idx === 0 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-black inline-flex items-center justify-center text-xs shadow-md">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-black font-black inline-flex items-center justify-center text-xs shadow-md">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black inline-flex items-center justify-center text-xs shadow-md">
                          3
                        </span>
                      ) : (
                        <span className="text-gray-400 font-mono text-xs">{idx + 1}</span>
                      )}
                    </td>

                    {/* Player Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-white text-sm group-hover:text-[#00f0ff] transition">
                          {player.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">({player.foot})</span>
                      </div>
                    </td>

                    {/* Club */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: team.color }}
                        ></span>
                        <span className="font-bold text-gray-300 truncate max-w-[140px]">
                          {team.name}
                        </span>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          player.position === "FWD"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : player.position === "MID"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : player.position === "DEF"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {player.position}
                      </span>
                    </td>

                    {/* Matches Played */}
                    <td className="py-3 px-3 text-center font-mono text-gray-300">
                      {player.matches}
                    </td>

                    {/* Goals */}
                    <td className="py-3 px-3 text-center font-mono font-black text-sm text-[#00ff85] bg-[#00ff85]/5">
                      {player.goals}
                    </td>

                    {/* Assists */}
                    <td className="py-3 px-3 text-center font-mono font-black text-sm text-[#00f0ff] bg-[#00f0ff]/5">
                      {player.assists}
                    </td>

                    {/* Clean Sheets */}
                    <td className="py-3 px-3 text-center font-mono text-emerald-300">
                      {player.cleanSheets}
                    </td>

                    {/* Yellow Cards */}
                    <td className="py-3 px-3 text-center font-mono text-amber-300">
                      {player.yellowCards}
                    </td>

                    {/* Red Cards */}
                    <td className="py-3 px-3 text-center font-mono text-rose-400">
                      {player.redCards}
                    </td>

                    {/* Performance Rating */}
                    <td className="py-3 px-4 text-right font-mono font-black text-[#00f0ff]">
                      {score > 0 ? `+${score}` : score}
                    </td>

                    {/* Actions for Admin */}
                    {canManageStats && (
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingStat({ ...player });
                              setOpenModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black transition"
                            title="Edit player stat"
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
                          </button>
                          <button
                            onClick={() => handleDeleteStat(player.id)}
                            className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white transition"
                            title="Delete stat record"
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
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedPlayers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No player stats found matching this filter criteria.</p>
          </div>
        )}
      </div>

      {/* EDIT / CREATE STAT MODAL */}
      {openModal && editingStat && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] rounded-3xl max-w-md w-full p-6 border-2 border-[#00f0ff]/50 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div>
                <h3 className="text-xl font-black text-white uppercase">
                  {stats.some((s) => s.id === editingStat.id)
                    ? "Edit Player Stat Record"
                    : "Record New Player Stat"}
                </h3>
                <p className="text-xs text-[#00f0ff]">
                  Certified records update for goals, assists and cards
                </p>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStat} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">
                  Athlete Full Name
                </label>
                <input
                  type="text"
                  value={editingStat.name}
                  onChange={(e) => setEditingStat({ ...editingStat, name: e.target.value })}
                  placeholder="e.g. Kevin Omondi"
                  required
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Club / Team
                  </label>
                  <select
                    value={editingStat.teamId}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, teamId: Number(e.target.value) })
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
                  <label className="block text-gray-400 font-bold uppercase mb-1">Position</label>
                  <select
                    value={editingStat.position}
                    onChange={(e) =>
                      setEditingStat({
                        ...editingStat,
                        position: e.target.value as PlayerStat["position"],
                      })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="FWD">Forward (FWD)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="GK">Goalkeeper (GK)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Goals (⚽)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingStat.goals}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, goals: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-mono text-center font-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Assists (🎯)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingStat.assists}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, assists: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-mono text-center font-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Clean Sheets
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingStat.cleanSheets}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, cleanSheets: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-mono text-center font-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Matches</label>
                  <input
                    type="number"
                    min="0"
                    value={editingStat.matches}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, matches: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Yellow Cards
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingStat.yellowCards}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, yellowCards: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Red Cards</label>
                  <input
                    type="number"
                    min="0"
                    value={editingStat.redCards}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, redCards: Number(e.target.value) })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black font-black hover:brightness-110 shadow-lg"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
