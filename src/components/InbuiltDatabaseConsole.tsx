import React, { useState, useEffect, useRef } from "react";
import {
  Database,
  Trash2,
  Edit2,
  Plus,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Users,
  Calendar,
  FileText,
  Music,
  Vote,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  HardDrive,
  X,
  Search,
  Filter,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  getDbTeams,
  saveDbTeams,
  permanentlyDeleteDbTeam,
  getDbPlayers,
  saveDbPlayers,
  permanentlyDeleteDbPlayer,
  getDbFixtures,
  saveDbFixtures,
  permanentlyDeleteDbFixture,
  getDbMatchReports,
  permanentlyDeleteDbMatchReport,
  purgeStandingsTableToZero,
  recalculateStandingsFromReports,
  type DbTeam,
  type DbPlayer,
  type DbFixture,
  type DbMatchReport,
} from "../lib/inbuiltDbSync";
import {
  saveAudioFileToVault,
  getAudioVaultBlobUrl,
  getAudioVaultMetadata,
  deleteAudioFromVault,
  type AudioVaultMetadata,
} from "../lib/audioVault";
import { OFFICIAL_CLUBS_DATA } from "../lib/teamSquadsData";

type DbTab = "teams" | "players" | "fixtures" | "reports" | "anthem" | "mvp_votes";

export function InbuiltDatabaseConsole() {
  const [activeTab, setActiveTab] = useState<DbTab>("teams");
  const [teams, setTeams] = useState<DbTeam[]>([]);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [fixtures, setFixtures] = useState<DbFixture[]>([]);
  const [reports, setReports] = useState<DbMatchReport[]>([]);
  const [anthemMeta, setAnthemMeta] = useState<AudioVaultMetadata | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filters & Search
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerClubFilter, setPlayerClubFilter] = useState<number | "ALL">("ALL");

  // Edit Modals
  const [editingTeam, setEditingTeam] = useState<DbTeam | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState<Partial<DbTeam>>({
    name: "",
    shortCode: "",
    color: "#00f0ff",
    homePitch: "M-Pesa Academy Arena",
    coachName: "",
  });

  const [editingPlayer, setEditingPlayer] = useState<DbPlayer | null>(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState<Partial<DbPlayer>>({
    name: "",
    teamId: 1,
    number: 10,
    position: "MID",
    foot: "Right",
  });

  const [editingFixture, setEditingFixture] = useState<DbFixture | null>(null);

  // Audio Vault state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.8);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = () => {
    setTeams(getDbTeams());
    setPlayers(getDbPlayers());
    setFixtures(getDbFixtures());
    setReports(getDbMatchReports());
    setAnthemMeta(getAudioVaultMetadata());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("mpesa_db_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("mpesa_anthem_changed", handleUpdate);
    return () => {
      window.removeEventListener("mpesa_db_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("mpesa_anthem_changed", handleUpdate);
    };
  }, []);

  // Load audio blob URL when anthem tab opens
  useEffect(() => {
    let active = true;
    getAudioVaultBlobUrl().then((url) => {
      if (active && url) {
        setAudioUrl(url);
      }
    });
    return () => {
      active = false;
    };
  }, [anthemMeta]);

  // Audio Play / Pause
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  // Upload Anthem Audio
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingAudio(true);
      const meta = await saveAudioFileToVault(file);
      setAnthemMeta(meta);
      const url = await getAudioVaultBlobUrl();
      setAudioUrl(url);
      showToast("✓ Anthem audio uploaded and permanently saved to Database!");
    } catch {
      showToast("⚠ Failed to save audio file to IndexedDB.");
    } finally {
      setIsUploadingAudio(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAudio = async () => {
    if (!confirm("Are you sure you want to permanently delete this anthem audio track?")) return;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    await deleteAudioFromVault();
    setAudioUrl(null);
    setAnthemMeta(null);
    showToast("✓ Anthem audio permanently deleted from Database Vault.");
  };

  // Team Actions
  const handleSaveTeamEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    const updated = teams.map((t) => (t.id === editingTeam.id ? editingTeam : t));
    saveDbTeams(updated);
    setTeams(updated);
    setEditingTeam(null);
    showToast(`✓ Updated team "${editingTeam.name}" in database.`);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name) return;
    const newId = teams.length > 0 ? Math.max(...teams.map((t) => t.id)) + 1 : 1;
    const created: DbTeam = {
      id: newId,
      name: newTeam.name,
      shortCode: newTeam.shortCode || newTeam.name.slice(0, 3).toUpperCase(),
      color: newTeam.color || "#00f0ff",
      homePitch: newTeam.homePitch || "Academy Main Arena",
      coachName: newTeam.coachName || "Head Coach",
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      squadCount: 0,
    };
    const updated = [...teams, created];
    saveDbTeams(updated);
    setTeams(updated);
    setShowAddTeamModal(false);
    setNewTeam({ name: "", shortCode: "", color: "#00f0ff", homePitch: "Academy Main Arena" });
    showToast(`✓ Registered new team "${created.name}" to database.`);
  };

  const handleDeleteTeam = (team: DbTeam) => {
    if (
      !confirm(
        `Are you sure you want to PERMANENTLY DELETE "${team.name}"? This will remove the team and all associated records forever.`,
      )
    )
      return;
    permanentlyDeleteDbTeam(team.id, team.name);
    setTeams((prev) => prev.filter((t) => t.id !== team.id));
    showToast(`✓ Permanently deleted team "${team.name}".`);
  };

  // Player Actions
  const handleSavePlayerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    const updated = players.map((p) => (p.id === editingPlayer.id ? editingPlayer : p));
    saveDbPlayers(updated);
    setPlayers(updated);
    setEditingPlayer(null);
    showToast(`✓ Updated player "${editingPlayer.name}".`);
  };

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name) return;
    const team = teams.find((t) => t.id === Number(newPlayer.teamId)) || teams[0];
    const newId = Date.now();
    const created: DbPlayer = {
      id: newId,
      name: newPlayer.name,
      teamId: team?.id || 1,
      teamName: team?.name || "Official Club",
      teamColor: team?.color || "#00f0ff",
      teamCode: team?.shortCode || "CLB",
      number: Number(newPlayer.number) || 10,
      position: (newPlayer.position as DbPlayer["position"]) || "MID",
      foot: (newPlayer.foot as DbPlayer["foot"]) || "Right",
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
    };
    const updated = [...players, created];
    saveDbPlayers(updated);
    setPlayers(updated);
    setShowAddPlayerModal(false);
    setNewPlayer({ name: "", teamId: 1, number: 10, position: "MID", foot: "Right" });
    showToast(`✓ Registered squad player "${created.name}" to ${team?.name}.`);
  };

  const handleDeletePlayer = (player: DbPlayer) => {
    if (!confirm(`Permanently delete player "${player.name}" from database? Once deleted, gone forever.`))
      return;
    permanentlyDeleteDbPlayer(player.id);
    setPlayers((prev) => prev.filter((p) => p.id !== player.id));
    showToast(`✓ Permanently removed "${player.name}".`);
  };

  // Fixture Actions
  const handleSaveFixtureEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFixture) return;
    const updated = fixtures.map((f) => (f.id === editingFixture.id ? editingFixture : f));
    saveDbFixtures(updated);
    setFixtures(updated);
    setEditingFixture(null);
    showToast(`✓ Saved fixture matchweek #${editingFixture.matchweek}.`);
    // If completed, recalculate
    if (editingFixture.status === "COMPLETED") {
      recalculateStandingsFromReports();
    }
  };

  const handleDeleteFixture = (fixture: DbFixture) => {
    if (!confirm(`Permanently delete this match fixture? Once deleted, gone forever.`)) return;
    permanentlyDeleteDbFixture(fixture.id);
    setFixtures((prev) => prev.filter((f) => f.id !== fixture.id));
    showToast("✓ Permanently deleted match fixture.");
  };

  // Report Actions
  const handleDeleteReport = (report: DbMatchReport) => {
    if (!confirm(`Permanently delete official match report for Match #${report.matchId}?`)) return;
    permanentlyDeleteDbMatchReport(report.id);
    setReports((prev) => prev.filter((r) => r.id !== report.id));
    showToast("✓ Permanently removed match report & recalculated table.");
  };

  // Master Global Standings Purge
  const handlePurgeTableToZero = () => {
    if (
      !confirm(
        "CRITICAL: Purge entire league standings table to 0-0-0-0 (0 Points) for all teams? This will clear all points and synchronize instantly to the public view.",
      )
    )
      return;
    purgeStandingsTableToZero();
    loadData();
    showToast("✓ League Table purged to 0-0-0-0 (0 Points). Public view synchronized in real-time!");
  };

  const handleRecalculateStandings = () => {
    recalculateStandingsFromReports();
    loadData();
    showToast("✓ Standings recalculated automatically from official submitted reports!");
  };

  // Filtered Players
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(playerSearch.toLowerCase());
    const matchesClub = playerClubFilter === "ALL" || p.teamId === playerClubFilter;
    return matchesSearch && matchesClub;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Banner Inspired by Attached Reference */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-xs font-mono font-bold tracking-wider uppercase mb-2">
              <Database className="w-3.5 h-3.5 text-cyan-300" />
              Inbuilt Database Console & Live Sync
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-header tracking-tight">
              Welcome to League Database Manager 👋
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-2xl mt-1">
              Direct table CRUD controls for Clubs, Squads, Fixtures, Match Reports, Anthem Audio, and Standings. Any edit or permanent deletion reflects in real-time across the entire web application.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePurgeTableToZero}
              className="px-4 py-2.5 rounded-2xl bg-black/40 hover:bg-rose-950/80 border border-rose-400/50 hover:border-rose-400 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
              title="Wipe table to zero points across all devices"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Clear Table to 0 Pts
            </button>
            <button
              type="button"
              onClick={handleRecalculateStandings}
              className="px-4 py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-cyan-300" />
              Auto-Sync Reports
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (Matching Styled Cards in Reference Image) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Clubs */}
        <div className="p-5 rounded-3xl bg-[#0f0b24] border-2 border-cyan-500/40 hover:border-cyan-400 transition shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="font-bold text-cyan-300">CLUBS IN DB</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-header text-white">{teams.length}</div>
          <div className="text-[11px] text-gray-400">Official registered clubs</div>
        </div>

        {/* Card 2: Players */}
        <div className="p-5 rounded-3xl bg-[#0f0b24] border-2 border-amber-500/40 hover:border-amber-400 transition shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="font-bold text-amber-300">SQUAD PLAYERS</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-header text-white">{players.length}</div>
          <div className="text-[11px] text-gray-400">Authenticated student athletes</div>
        </div>

        {/* Card 3: Match Reports */}
        <div className="p-5 rounded-3xl bg-[#0f0b24] border-2 border-purple-500/40 hover:border-purple-400 transition shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="font-bold text-purple-300">SIGNED REPORTS</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-header text-white">{reports.length}</div>
          <div className="text-[11px] text-gray-400">Tri-signed official sheets</div>
        </div>

        {/* Card 4: Anthem Status */}
        <div className="p-5 rounded-3xl bg-[#0f0b24] border-2 border-emerald-500/40 hover:border-emerald-400 transition shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="font-bold text-emerald-300">ANTHEM VAULT</span>
            <Music className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black font-header text-white truncate">
            {anthemMeta ? anthemMeta.fileName : "Standard Fanfare"}
          </div>
          <div className="text-[11px] text-emerald-400">
            {anthemMeta ? `${(anthemMeta.fileSize / 1024 / 1024).toFixed(2)} MB • IndexedDB` : "Ready for audio upload"}
          </div>
        </div>
      </div>

      {/* Database Table Navigator Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#2e2554] pb-3">
        {[
          { id: "teams", label: "Teams & Clubs", icon: Shield, count: teams.length },
          { id: "players", label: "Registered Squads", icon: Users, count: players.length },
          { id: "fixtures", label: "Fixtures & Scores", icon: Calendar, count: fixtures.length },
          { id: "reports", label: "Official Match Reports", icon: FileText, count: reports.length },
          { id: "anthem", label: "Anthem Audio Vault", icon: Music, count: anthemMeta ? 1 : 0 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as DbTab)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-[#141029] hover:bg-[#1f193d] text-gray-400 hover:text-white border border-[#2e2554]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-black/40 text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          TAB 1: TEAMS & CLUBS TABLE
          ========================================================= */}
      {activeTab === "teams" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black font-header text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Clubs & Teams Database Table
              </h3>
              <p className="text-xs text-gray-400">
                All records persist directly to database. Deleting a club removes it permanently across all views.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddTeamModal(true)}
              className="px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
            >
              <Plus className="w-4 h-4" />
              Add New Club
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2e2554] text-gray-400 font-mono text-[11px]">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Club Name</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Home Pitch</th>
                  <th className="py-3 px-3">Head Coach</th>
                  <th className="py-3 px-2 text-center">MP</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">D</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center">GD</th>
                  <th className="py-3 px-3 text-center">PTS</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e173e]">
                {teams.map((team, idx) => (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3 font-mono text-gray-500">{team.id}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: team.color || "#00f0ff" }}
                        />
                        <span>{team.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{team.shortCode}</td>
                    <td className="py-3 px-3 text-gray-300 max-w-[180px] truncate">{team.homePitch}</td>
                    <td className="py-3 px-3 text-gray-400">{team.coachName || "Coach Staff"}</td>
                    <td className="py-3 px-2 text-center text-gray-300">{team.mp}</td>
                    <td className="py-3 px-2 text-center text-emerald-400 font-bold">{team.w}</td>
                    <td className="py-3 px-2 text-center text-gray-400">{team.d}</td>
                    <td className="py-3 px-2 text-center text-rose-400">{team.l}</td>
                    <td className="py-3 px-2 text-center font-mono text-cyan-300">
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-cyan-300 text-sm bg-cyan-500/10 rounded-xl">
                      {team.pts}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingTeam(team)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white transition cursor-pointer"
                          title="Edit Club"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeam(team)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer"
                          title="Permanently Delete Team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: REGISTERED SQUADS & PLAYERS TABLE
          ========================================================= */}
      {activeTab === "players" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black font-header text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Registered Squad Players Database Table
              </h3>
              <p className="text-xs text-gray-400">
                Official student rosters from the 4 registered clubs. Edits or deletions update the entire league immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPlayerModal(true)}
              className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/25"
            >
              <Plus className="w-4 h-4" />
              Register New Player
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                placeholder="Search athlete by name..."
                className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-2xl pl-10 pr-4 py-2 text-xs text-white outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={playerClubFilter}
                onChange={(e) =>
                  setPlayerClubFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
                }
                className="bg-[#141029] border border-[#2e2554] rounded-2xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="ALL">All Clubs ({players.length})</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2e2554] text-gray-400 font-mono text-[11px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Player Name</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-3">Foot</th>
                  <th className="py-3 px-2 text-center">Goals</th>
                  <th className="py-3 px-2 text-center">Assists</th>
                  <th className="py-3 px-2 text-center">Clean Sheets</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e173e]">
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">#{player.number}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span>{player.name}</span>
                        {player.role && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-gray-400">
                            {player.role}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-300 font-medium">
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: player.teamColor || "#00f0ff" }}
                      />
                      {player.teamName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-mono">{player.foot || "Right"}</td>
                    <td className="py-3 px-2 text-center font-bold text-white">{player.goals}</td>
                    <td className="py-3 px-2 text-center text-cyan-300">{player.assists}</td>
                    <td className="py-3 px-2 text-center text-emerald-400">{player.cleanSheets}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingPlayer(player)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 hover:text-white transition cursor-pointer"
                          title="Edit Player"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlayer(player)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer"
                          title="Permanently Delete Player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: FIXTURES & SCORES TABLE
          ========================================================= */}
      {activeTab === "fixtures" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black font-header text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Fixtures & Scores Database Table
              </h3>
              <p className="text-xs text-gray-400">
                Match scheduling and live recorded results. Editing completed scores updates the standings.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2e2554] text-gray-400 font-mono text-[11px]">
                  <th className="py-3 px-3">MW</th>
                  <th className="py-3 px-3">Home Club</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3">Away Club</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Venue</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e173e]">
                {fixtures.map((fix) => (
                  <tr key={fix.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3 font-mono font-bold text-gray-400">MW {fix.matchweek}</td>
                    <td className="py-3 px-3 font-bold text-white">{fix.homeTeamName}</td>
                    <td className="py-3 px-3 text-center font-mono font-black text-sm">
                      {typeof fix.homeScore === "number" && typeof fix.awayScore === "number" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                          {fix.homeScore} - {fix.awayScore}
                        </span>
                      ) : (
                        <span className="text-gray-500">v</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">{fix.awayTeamName}</td>
                    <td className="py-3 px-3 text-gray-300 font-mono text-[11px]">
                      {fix.date} • {fix.time}
                    </td>
                    <td className="py-3 px-3 text-gray-400 max-w-[150px] truncate">{fix.venue}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          fix.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : fix.status === "LIVE"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {fix.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingFixture(fix)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white transition cursor-pointer"
                          title="Edit Match Score/Status"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFixture(fix)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer"
                          title="Delete Fixture"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: OFFICIAL MATCH REPORTS TABLE
          ========================================================= */}
      {activeTab === "reports" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black font-header text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Submitted Match Reports Table
              </h3>
              <p className="text-xs text-gray-400">
                Official physical/digital match sheets signed by coaches, captains, and referee. Standings automatically calculate from these.
              </p>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-gray-400 border border-dashed border-[#2e2554] rounded-2xl">
              <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="font-bold text-sm text-gray-300">No match reports recorded in database yet.</p>
              <p className="text-xs text-gray-500 mt-1">
                Referees and coaches submit signed reports via the Official Match Sheet portal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2e2554] text-gray-400 font-mono text-[11px]">
                    <th className="py-3 px-3">Report ID</th>
                    <th className="py-3 px-3">Match</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3">Center Referee</th>
                    <th className="py-3 px-3 text-center">Signatures Status</th>
                    <th className="py-3 px-3">Submitted At</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e173e]">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-3 font-mono text-gray-400">{rep.id.slice(0, 10)}...</td>
                      <td className="py-3 px-3 font-bold text-white">
                        {rep.homeTeamName} vs {rep.awayTeamName}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                        {rep.homeScore} - {rep.awayScore}
                      </td>
                      <td className="py-3 px-3 text-gray-300">{rep.refereeName || "Bidan Mwaura"}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          Tri-Signed
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 font-mono text-[10px]">
                        {new Date(rep.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteReport(rep)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer"
                          title="Permanently Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 5: ANTHEM AUDIO VAULT (INDEXEDDB & ALL DEVICES)
          ========================================================= */}
      {activeTab === "anthem" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl">
          <div>
            <h3 className="text-lg font-black font-header text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-emerald-400" />
              League Anthem & Audio Database Vault
            </h3>
            <p className="text-xs text-gray-400">
              Upload an official MP3 or WAV audio track. Stored in IndexedDB database storage so it plays reliably across every device (phones, tablets, and laptops).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="p-6 rounded-3xl bg-[#141029] border-2 border-dashed border-[#3d2e6e] hover:border-emerald-400 transition flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Upload Official Anthem Track</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Accepts MP3, WAV, AAC, M4A up to 50MB. Auto-saved to browser IndexedDB database.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
                id="anthem-file-upload"
              />
              <label
                htmlFor="anthem-file-upload"
                className="px-5 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-400/20"
              >
                {isUploadingAudio ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving to Database...
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4" />
                    Select Audio File
                  </>
                )}
              </label>
            </div>

            {/* Current Vault Track Player */}
            <div className="p-6 rounded-3xl bg-[#141029] border border-[#2e2554] space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    DATABASE ACTIVE TRACK
                  </span>
                  {anthemMeta && (
                    <button
                      type="button"
                      onClick={handleDeleteAudio}
                      className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer"
                      title="Permanently Delete Audio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-white text-base">
                    {anthemMeta?.title || "M-Pesa Sunday League Stadium Fanfare"}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {anthemMeta?.artist || "Live Brass Section & Student Chorus"}
                  </p>
                </div>

                {anthemMeta && (
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-[11px] font-mono text-gray-400">
                    <div>File: <span className="text-gray-200">{anthemMeta.fileName}</span></div>
                    <div>Size: <span className="text-emerald-400">{(anthemMeta.fileSize / 1024 / 1024).toFixed(2)} MB</span></div>
                    <div>Storage: <span className="text-cyan-300">IndexedDB Vault (Cross-Device Persistent)</span></div>
                  </div>
                )}
              </div>

              {/* Audio Controls */}
              {audioUrl ? (
                <div className="space-y-3">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlayingAudio(false)}
                    onError={() => setIsPlayingAudio(false)}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      className="w-10 h-10 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black flex items-center justify-center transition cursor-pointer shadow-lg shadow-emerald-400/20"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white mb-1">
                        {isPlayingAudio ? "Playing anthem audio..." : "Ready to test playback"}
                      </div>
                      <div className="w-full bg-[#241a4a] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-emerald-400 rounded-full transition-all ${
                            isPlayingAudio ? "w-3/4 animate-pulse" : "w-0"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 bg-black/30 p-3 rounded-xl border border-white/5">
                  No custom audio uploaded yet. Using built-in stadium fanfare synthesis.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALS: EDIT TEAM
          ========================================================= */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f0b24] border border-[#2e2554] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h3 className="font-bold text-white text-base">Edit Club Details</h3>
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Club Name</label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Short Code (3 Letters)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={editingTeam.shortCode}
                  onChange={(e) =>
                    setEditingTeam({ ...editingTeam, shortCode: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Home Pitch</label>
                <input
                  type="text"
                  value={editingTeam.homePitch}
                  onChange={(e) => setEditingTeam({ ...editingTeam, homePitch: e.target.value })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Head Coach</label>
                <input
                  type="text"
                  value={editingTeam.coachName || ""}
                  onChange={(e) => setEditingTeam({ ...editingTeam, coachName: e.target.value })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALS: ADD NEW CLUB
          ========================================================= */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f0b24] border border-[#2e2554] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h3 className="font-bold text-white text-base">Add New Football Club</h3>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Club Name</label>
                <input
                  type="text"
                  placeholder="e.g. Serengeti Stars"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Short Code</label>
                <input
                  type="text"
                  placeholder="SST"
                  maxLength={4}
                  value={newTeam.shortCode}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, shortCode: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Home Pitch</label>
                <input
                  type="text"
                  placeholder="Academy East Field"
                  value={newTeam.homePitch}
                  onChange={(e) => setNewTeam({ ...newTeam, homePitch: e.target.value })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALS: EDIT PLAYER
          ========================================================= */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f0b24] border border-[#2e2554] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h3 className="font-bold text-white text-base">Edit Player Details & Stats</h3>
              <button
                type="button"
                onClick={() => setEditingPlayer(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlayerEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Player Full Name</label>
                <input
                  type="text"
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Jersey Number</label>
                  <input
                    type="number"
                    value={editingPlayer.number}
                    onChange={(e) =>
                      setEditingPlayer({ ...editingPlayer, number: Number(e.target.value) })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Position</label>
                  <select
                    value={editingPlayer.position}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        position: e.target.value as DbPlayer["position"],
                      })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="FWD">Forward (FWD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Goals</label>
                  <input
                    type="number"
                    value={editingPlayer.goals}
                    onChange={(e) =>
                      setEditingPlayer({ ...editingPlayer, goals: Number(e.target.value) })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Assists</label>
                  <input
                    type="number"
                    value={editingPlayer.assists}
                    onChange={(e) =>
                      setEditingPlayer({ ...editingPlayer, assists: Number(e.target.value) })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Clean Sheets</label>
                  <input
                    type="number"
                    value={editingPlayer.cleanSheets}
                    onChange={(e) =>
                      setEditingPlayer({ ...editingPlayer, cleanSheets: Number(e.target.value) })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPlayer(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold"
                >
                  Save Stats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALS: ADD NEW SQUAD PLAYER
          ========================================================= */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f0b24] border border-[#2e2554] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h3 className="font-bold text-white text-base">Register Squad Player</h3>
              <button
                type="button"
                onClick={() => setShowAddPlayerModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Assign to Club</label>
                <select
                  value={newPlayer.teamId}
                  onChange={(e) => setNewPlayer({ ...newPlayer, teamId: Number(e.target.value) })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-bold"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Player Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Karanja"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Jersey Number</label>
                  <input
                    type="number"
                    value={newPlayer.number}
                    onChange={(e) =>
                      setNewPlayer({ ...newPlayer, number: Number(e.target.value) })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Position</label>
                  <select
                    value={newPlayer.position}
                    onChange={(e) =>
                      setNewPlayer({
                        ...newPlayer,
                        position: e.target.value as DbPlayer["position"],
                      })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="FWD">Forward (FWD)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold"
                >
                  Register Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALS: EDIT FIXTURE
          ========================================================= */}
      {editingFixture && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f0b24] border border-[#2e2554] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h3 className="font-bold text-white text-base">Edit Match Fixture</h3>
              <button
                type="button"
                onClick={() => setEditingFixture(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFixtureEdit} className="space-y-3 text-xs">
              <div className="text-center p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-gray-400 block text-[10px] font-mono">MATCHUP</span>
                <span className="text-sm font-black text-white">
                  {editingFixture.homeTeamName} vs {editingFixture.awayTeamName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">
                    {editingFixture.homeTeamName} Score
                  </label>
                  <input
                    type="number"
                    value={editingFixture.homeScore ?? ""}
                    onChange={(e) =>
                      setEditingFixture({
                        ...editingFixture,
                        homeScore: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">
                    {editingFixture.awayTeamName} Score
                  </label>
                  <input
                    type="number"
                    value={editingFixture.awayScore ?? ""}
                    onChange={(e) =>
                      setEditingFixture({
                        ...editingFixture,
                        awayScore: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-mono text-center text-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Match Status</label>
                <select
                  value={editingFixture.status}
                  onChange={(e) =>
                    setEditingFixture({
                      ...editingFixture,
                      status: e.target.value as DbFixture["status"],
                    })
                  }
                  className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="LIVE">Live in Progress</option>
                  <option value="COMPLETED">Completed (Recalculates Standings)</option>
                  <option value="POSTPONED">Postponed</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingFixture(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  Save Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
