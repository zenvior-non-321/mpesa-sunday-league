import React, { useState, useEffect, useCallback } from "react";
import { useRoleAccess, ROLE_HIERARCHY_DATA, type LeagueRole } from "../hooks/useRoleAccess";

interface AdminSquadPlayer {
  name: string;
  number?: number;
  position?: string;
  photoUrl?: string;
}

interface AdminTeam {
  id: number;
  name: string;
  color?: string;
  shortCode?: string;
  homePitch?: string;
  squad?: AdminSquadPlayer[];
}

interface AdminPlayerStat {
  name: string;
  photoUrl?: string;
  [key: string]: unknown;
}

export function BoardWorkspaces() {
  const { currentRole, isSuperAdmin, roleDetails, roleTier, switchRole } = useRoleAccess();

  // Active workspace tab (defaults to currentRole or SUPER_ADMIN)
  const [activeWorkspaceRole, setActiveWorkspaceRole] = useState<LeagueRole>(
    isSuperAdmin ? "SUPER_ADMIN" : currentRole === "GUEST" ? "PRESIDENT" : currentRole,
  );

  useEffect(() => {
    if (isSuperAdmin) {
      setActiveWorkspaceRole("SUPER_ADMIN");
    } else if (currentRole && currentRole !== "GUEST") {
      setActiveWorkspaceRole(currentRole);
    }
  }, [currentRole, isSuperAdmin]);

  // Synchronized state with localStorage
  const [newsCount, setNewsCount] = useState<number>(1);
  const [fixturesCount, setFixturesCount] = useState<number>(6);
  const [teamsCount, setTeamsCount] = useState<number>(5);
  const [playersCount, setPlayersCount] = useState<number>(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Player Photo Management State
  const [adminTeams, setAdminTeams] = useState<AdminTeam[]>([]);
  const [selectedTeamIdForPhoto, setSelectedTeamIdForPhoto] = useState<number>(1);
  const [selectedPlayerForPhoto, setSelectedPlayerForPhoto] = useState<string>("Kevin Omondi");
  const [adminPhotoPreview, setAdminPhotoPreview] = useState<string>("");
  const [copiedPlayerLink, setCopiedPlayerLink] = useState<boolean>(false);

  // Forms state for workspace actions
  const [decreeForm, setDecreeForm] = useState({
    title: "",
    category: "Executive Directive",
    content: "",
  });
  const [appealForm, setAppealForm] = useState({
    club: "Samba Boys",
    verdict: "SANCTION_REDUCED",
    justification: "",
  });
  const [directiveForm, setDirectiveForm] = useState({
    dept: "Officiating Department",
    priority: "HIGH",
    title: "",
    instructions: "",
  });
  const [refereeForm, setRefereeForm] = useState({
    matchweek: "MW 1",
    centerRef: "FIFA Center Referee",
    linesman1: "Official Linesman A",
    linesman2: "Official Linesman B",
  });
  const [cardSanctionForm, setCardSanctionForm] = useState({
    player: "Kevin Omondi",
    type: "DIRECT_RED",
    sanction: "1 Match Ban",
  });
  const [adminMinuteForm, setAdminMinuteForm] = useState({
    title: "",
    attendees: "President, Deputy President, Tech Manager, Registrar",
    content: "",
  });
  const [scoreboardTicker, setScoreboardTicker] = useState(
    "M-PESA SUNDAY LEAGUE • OFFICIAL EFOOTBALL CHAMPIONSHIP",
  );
  const [standbyActive, setStandbyActive] = useState(false);

  const loadAdminTeams = useCallback(() => {
    try {
      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdminTeams(parsed);
          setTeamsCount(parsed.length);
          if (!selectedTeamIdForPhoto && parsed[0]) {
            setSelectedTeamIdForPhoto(parsed[0].id);
          }
          return;
        }
      }
    } catch {
      // Ignore
    }
  }, [selectedTeamIdForPhoto]);

  useEffect(() => {
    loadAdminTeams();
    try {
      const storedNews = localStorage.getItem("mpesa_pes_news_v6");
      if (storedNews) setNewsCount(JSON.parse(storedNews).length || 1);

      const storedMatches = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedMatches) setFixturesCount(JSON.parse(storedMatches).length || 6);

      const storedStats = localStorage.getItem("mpesa_pes_stats_v6");
      if (storedStats) setPlayersCount(JSON.parse(storedStats).length || 10);
    } catch {
      // Ignore
    }

    const handleStorageChange = () => {
      loadAdminTeams();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadAdminTeams]);

  const copyPlayerShareLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/upload-photo`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedPlayerLink(true);
    showToast("Shareable Player Photo Upload link copied to clipboard!");
    setTimeout(() => setCopiedPlayerLink(false), 3000);
  };

  const handleAdminPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, WebP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAdminPhotoPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdminSavePhoto = () => {
    if (!adminPhotoPreview || !selectedPlayerForPhoto) {
      showToast("Please select an image and athlete profile first.");
      return;
    }
    try {
      const updated = adminTeams.map((t) => {
        if (t.id === Number(selectedTeamIdForPhoto)) {
          const updatedSquad = (t.squad || []).map((p: AdminSquadPlayer) => {
            if (p.name === selectedPlayerForPhoto) {
              return { ...p, photoUrl: adminPhotoPreview };
            }
            return p;
          });
          return { ...t, squad: updatedSquad };
        }
        return t;
      });

      setAdminTeams(updated);
      localStorage.setItem("mpesa_pes_teams_v6", JSON.stringify(updated));

      // Also update player leaderboard stats
      const storedStats = localStorage.getItem("mpesa_pes_stats_v6");
      if (storedStats) {
        try {
          const stats = JSON.parse(storedStats);
          if (Array.isArray(stats)) {
            const updatedStats = stats.map((s: AdminPlayerStat) => {
              if (s.name === selectedPlayerForPhoto) {
                return { ...s, photoUrl: adminPhotoPreview };
              }
              return s;
            });
            localStorage.setItem("mpesa_pes_stats_v6", JSON.stringify(updatedStats));
          }
        } catch {
          // Ignore
        }
      }

      window.dispatchEvent(new Event("storage"));
      showToast(
        `✓ Photo for ${selectedPlayerForPhoto} updated successfully! Reflects across portal.`,
      );
      setAdminPhotoPreview("");
    } catch {
      showToast("Failed to save player photo. Please try again.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentMeta = ROLE_HIERARCHY_DATA[activeWorkspaceRole] || ROLE_HIERARCHY_DATA.PRESIDENT;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black px-6 py-3.5 rounded-2xl shadow-2xl font-black flex items-center gap-2.5 border border-cyan-100">
          <span>✓</span>
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Workspace Hub Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-500 via-pink-500 to-[#00f0ff] text-white shadow">
              Executive Governance Suite
            </span>
            <span className="text-xs text-[#00f0ff] font-mono">
              Tier {currentMeta.tier} • {currentMeta.title}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mt-1">
            {currentMeta.title} Workspace
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Dedicated operational command console synchronized across the entire Sunday League
            ecosystem.
          </p>
        </div>

        {/* Workspace Quick Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {(
            [
              "SUPER_ADMIN",
              "PRESIDENT",
              "DEPUTY_PRESIDENT",
              "REGULATIONS_MANAGER",
              "MATCH_OFFICIATING_MANAGER",
              "RECORDS_MANAGER",
              "TECH_MANAGER",
              "ASST_TECH_MANAGER",
            ] as LeagueRole[]
          ).map((role) => {
            const meta = ROLE_HIERARCHY_DATA[role];
            const isSelected = activeWorkspaceRole === role;
            return (
              <button
                key={role}
                onClick={() => {
                  setActiveWorkspaceRole(role);
                  switchRole(role);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black font-black shadow-lg scale-102"
                    : "bg-[#141029] text-gray-400 hover:text-white border border-[#2e2554]"
                }`}
              >
                <span className="text-[10px] opacity-75">T{meta.tier}</span>
                <span>{meta.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Profile & Key Departmental Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Officer Card */}
        <div className="bg-[#100c2a] border border-[#2e2554] rounded-3xl p-5 shadow-xl flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg bg-gradient-to-tr ${currentMeta.badgeColor}`}
          >
            T{currentMeta.tier}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block truncate">
              {currentMeta.department}
            </span>
            <h4 className="text-lg font-black text-white truncate">{currentMeta.officialName}</h4>
            <span className="text-xs text-[#00f0ff] font-semibold">{currentMeta.title}</span>
          </div>
        </div>

        {/* Metric 1 */}
        <div className="bg-[#100c2a] border border-[#2e2554] rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Total Championship Clubs
          </span>
          <div className="text-2xl font-black text-white font-mono">{teamsCount} Clubs</div>
          <span className="text-[10px] text-emerald-400">Rosters & Kits Cleared</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#100c2a] border border-[#2e2554] rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Scheduled Matchweeks
          </span>
          <div className="text-2xl font-black text-[#00f0ff] font-mono">
            {fixturesCount} Matches
          </div>
          <span className="text-[10px] text-cyan-300">Sunday Pitch Grounds</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#100c2a] border border-[#2e2554] rounded-3xl p-5 shadow-xl space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Tracked Athletes
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">{playersCount} Players</div>
          <span className="text-[10px] text-amber-300">Leaderboard & Stats Live</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📸 PLAYER PROFILE PICTURE & SHAREABLE UPLOAD LINK COMMAND CENTER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0d0926] via-[#170e38] to-[#0d0926] border-2 border-emerald-400/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2e2554] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                Official Roster Management
              </span>
              <span className="text-xs text-[#00f0ff] font-mono font-bold">
                Student Athlete Photo Hub
              </span>
            </div>
            <h3 className="font-header text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2.5">
              <span>📸</span> Player Profile Photo Upload & Shareable Link
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Share the official self-service upload link with student players, or upload athlete
              photos directly from this admin terminal. All uploaded portraits reflect in real-time
              across the Leaderboard, Matchday Lineups, and Roster Cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={copyPlayerShareLink}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-[#00f0ff] text-black font-black text-xs transition duration-200 shadow-lg shadow-cyan-500/20 hover:scale-105 flex items-center gap-2 cursor-pointer"
              title="Copy shareable link to send to athletes"
            >
              <span>📋</span>
              <span>{copiedPlayerLink ? "Link Copied!" : "Copy Player Share Link"}</span>
            </button>
            <a
              href="/upload-photo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-2xl bg-[#141029] hover:bg-[#1f1744] border border-[#2e2554] text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              <span>Open Upload Portal</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="p-4 bg-[#0a071d] border border-cyan-400/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Shareable Athlete Self-Service Link:
            </span>
            <span className="font-mono text-xs sm:text-sm text-emerald-300 truncate block font-bold">
              {typeof window !== "undefined"
                ? `${window.location.origin}/upload-photo`
                : "/upload-photo"}
            </span>
          </div>
          <button
            onClick={copyPlayerShareLink}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-400/20 text-[#00f0ff] border border-cyan-400/40 text-xs font-bold hover:bg-cyan-400 hover:text-black transition shrink-0"
          >
            {copiedPlayerLink ? "Copied!" : "Copy URL"}
          </button>
        </div>

        {/* Direct Admin Upload & Team Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Uploader Column */}
          <div className="bg-[#141029] p-5 rounded-2xl border border-[#2e2554] space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
              <h5 className="font-extrabold text-white text-xs uppercase flex items-center gap-1.5">
                <span>⚡</span> Admin Direct Upload
              </h5>
              <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">
                  1. Select Club
                </label>
                <select
                  value={selectedTeamIdForPhoto}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedTeamIdForPhoto(id);
                    const t = adminTeams.find((item) => item.id === id);
                    if (t && t.squad && t.squad[0]) {
                      setSelectedPlayerForPhoto(t.squad[0].name);
                      setAdminPhotoPreview(t.squad[0].photoUrl || "");
                    }
                  }}
                  className="w-full bg-[#0a071d] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                >
                  {adminTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.shortCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">
                  2. Select Player Profile
                </label>
                <select
                  value={selectedPlayerForPhoto}
                  onChange={(e) => {
                    const pName = e.target.value;
                    setSelectedPlayerForPhoto(pName);
                    const t = adminTeams.find((item) => item.id === Number(selectedTeamIdForPhoto));
                    const p = t?.squad?.find((item: AdminSquadPlayer) => item.name === pName);
                    setAdminPhotoPreview(p?.photoUrl || "");
                  }}
                  className="w-full bg-[#0a071d] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                >
                  {(
                    adminTeams.find((t) => t.id === Number(selectedTeamIdForPhoto))?.squad || []
                  ).map((p: AdminSquadPlayer, idx: number) => (
                    <option key={idx} value={p.name}>
                      #{p.number || idx + 1} • {p.name} ({p.position || "Player"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">
                  3. Upload Athlete Headshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAdminPhotoFile}
                  className="w-full bg-[#0a071d] border border-[#2e2554] rounded-xl p-2 text-xs text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00f0ff] file:text-black cursor-pointer"
                />
              </div>

              {adminPhotoPreview && (
                <div className="flex items-center gap-3 p-3 bg-[#0a071d] rounded-xl border border-emerald-400/30">
                  <img
                    src={adminPhotoPreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400 shrink-0"
                  />
                  <div className="min-w-0 text-xs">
                    <span className="font-bold text-white block truncate">
                      {selectedPlayerForPhoto}
                    </span>
                    <span className="text-[10px] text-emerald-400">Portrait Ready for Save</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAdminSavePhoto}
                disabled={!adminPhotoPreview}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00f0ff] text-black font-black text-xs hover:scale-102 transition duration-200 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-md"
              >
                Save & Broadcast Photo
              </button>
            </div>
          </div>

          {/* Roster Live Preview Column */}
          <div className="lg:col-span-2 bg-[#141029] p-5 rounded-2xl border border-[#2e2554] space-y-3">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
              <h5 className="font-extrabold text-white text-xs uppercase flex items-center gap-2">
                <span>👥</span> Live Club Roster & Profile Portraits
              </h5>
              <span className="text-[11px] text-[#00f0ff] font-bold">
                {adminTeams.find((t) => t.id === Number(selectedTeamIdForPhoto))?.name ||
                  "Selected Club"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {(adminTeams.find((t) => t.id === Number(selectedTeamIdForPhoto))?.squad || []).map(
                (player: AdminSquadPlayer, idx: number) => {
                  const isSelected = player.name === selectedPlayerForPhoto;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedPlayerForPhoto(player.name);
                        setAdminPhotoPreview(player.photoUrl || "");
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? "bg-[#1f1744] border-[#00f0ff] shadow-md shadow-cyan-500/10"
                          : "bg-[#0a071d] border-[#2e2554] hover:border-gray-500"
                      }`}
                    >
                      <div className="relative shrink-0">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#00f0ff]/50"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-purple-900/60 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-xs">
                            #{player.number || idx + 1}
                          </div>
                        )}
                        {player.photoUrl && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-white block truncate">
                          {player.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-gray-300">
                            {player.position || "FWD"}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            #{player.number || idx + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
            <p className="text-[10px] text-gray-400 italic">
              💡 Tip: Click any player above to load their profile directly into the editor. Green
              dot indicates uploaded photo.
            </p>
          </div>
        </div>
      </div>

      {/* WORKSPACE DETAILED WORKSTATIONS */}
      {/* 0. SUPER ADMINISTRATOR */}
      {activeWorkspaceRole === "SUPER_ADMIN" && (
        <div className="space-y-6">
          <div className="bg-[#0e0a26] border-2 border-amber-400/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👑</span>
                <div>
                  <h3 className="text-xl font-black text-white uppercase">
                    Master Command Nexus (Super Admin)
                  </h3>
                  <p className="text-xs text-amber-300">
                    Global System Override • Security Access Keys • Full Tournament Database
                    Authority
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-400 text-black">
                Master Override Armed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#141029] p-4 rounded-2xl border border-[#2e2554] space-y-2">
                <h5 className="font-extrabold text-white text-xs uppercase">
                  Officials Access Matrix
                </h5>
                <p className="text-[11px] text-gray-400">
                  7 Executive roles registered with cryptographic access tokens.
                </p>
                <button
                  onClick={() =>
                    showToast(
                      "Security Credentials Verified: All 7 Executive Passcodes Synchronized.",
                    )
                  }
                  className="w-full py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-bold text-xs transition"
                >
                  Verify Official Codes
                </button>
              </div>

              <div className="bg-[#141029] p-4 rounded-2xl border border-[#2e2554] space-y-2">
                <h5 className="font-extrabold text-white text-xs uppercase">
                  Master Fixture Overrides
                </h5>
                <p className="text-[11px] text-gray-400">
                  Full read/write/delete authority across all championship rounds.
                </p>
                <button
                  onClick={() =>
                    showToast("Fixture Engine: Synchronized across web and spectator feeds.")
                  }
                  className="w-full py-2 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-bold text-xs transition"
                >
                  Audit Fixtures Schedule
                </button>
              </div>

              <div className="bg-[#141029] p-4 rounded-2xl border border-[#2e2554] space-y-2">
                <h5 className="font-extrabold text-white text-xs uppercase">
                  Anthem Broadcast Hub
                </h5>
                <p className="text-[11px] text-gray-400">
                  Broadcast official YouTube anthem or uploaded audio files.
                </p>
                <button
                  onClick={() =>
                    showToast("Anthem Stream: Broadcasting to all visitors on the portal.")
                  }
                  className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-xs transition"
                >
                  Check Broadcast Stream
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. PRESIDENT (Bramuel Amirah) */}
      {activeWorkspaceRole === "PRESIDENT" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tool 1: Promulgate Formal Presidential Decree */}
            <div className="bg-[#0e0a26] border border-amber-400/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="text-base font-black text-amber-300 uppercase flex items-center gap-2">
                  <span>📜</span> Issue Formal Presidential Decree
                </h4>
                <span className="text-[10px] text-gray-400 font-mono">
                  Tier 1 Supreme Authority
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Decree Title
                  </label>
                  <input
                    type="text"
                    value={decreeForm.title}
                    onChange={(e) => setDecreeForm({ ...decreeForm, title: e.target.value })}
                    placeholder="e.g. Decree No. 06: Official Spectator Conduct & Derby Orders"
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Decree Classification
                  </label>
                  <select
                    value={decreeForm.category}
                    onChange={(e) => setDecreeForm({ ...decreeForm, category: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white font-bold"
                  >
                    <option value="Executive Directive">Executive Directive</option>
                    <option value="Official Bulletin">Official Bulletin</option>
                    <option value="Disciplinary Ruling">Disciplinary Ruling</option>
                    <option value="Championship Proclamation">Championship Proclamation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Binding Operational Instructions
                  </label>
                  <textarea
                    rows={4}
                    value={decreeForm.content}
                    onChange={(e) => setDecreeForm({ ...decreeForm, content: e.target.value })}
                    placeholder="Executive directives, rules enforced, and binding instructions for clubs and crew..."
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!decreeForm.title.trim()) return;
                    showToast(`Presidential Decree Promulgated: "${decreeForm.title}"`);
                    setDecreeForm({ title: "", category: "Executive Directive", content: "" });
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs hover:brightness-110 shadow-lg"
                >
                  Sign & Promulgate Decree to League Bulletin
                </button>
              </div>
            </div>

            {/* Tool 2: Presidential Appeals Tribunal */}
            <div className="bg-[#0e0a26] border border-[#2e2554] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <span>⚖️</span> Presidential Appeals Tribunal (Disputes)
                </h4>
                <span className="text-[10px] text-gray-400 font-mono">Final Appellate Chamber</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Appellant Club
                  </label>
                  <select
                    value={appealForm.club}
                    onChange={(e) => setAppealForm({ ...appealForm, club: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white font-bold"
                  >
                    <option value="Samba Boys">Samba Boys</option>
                    <option value="Grade 10 A">Grade 10 A</option>
                    <option value="Grade 10 B">Grade 10 B</option>
                    <option value="DP 2 A">DP 2 A</option>
                    <option value="DP 2 B">DP 2 B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Tribunal Ruling Verdict
                  </label>
                  <select
                    value={appealForm.verdict}
                    onChange={(e) => setAppealForm({ ...appealForm, verdict: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white font-bold"
                  >
                    <option value="SANCTION_REDUCED">Ruling: Sanction Reduced / Commuted</option>
                    <option value="SANCTION_UPHELD">Ruling: Sanction Upheld in Full</option>
                    <option value="RULING_OVERTURNED">Ruling: Sanction Overturned & Cleared</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Appellate Hearing Findings
                  </label>
                  <textarea
                    rows={4}
                    value={appealForm.justification}
                    onChange={(e) =>
                      setAppealForm({ ...appealForm, justification: e.target.value })
                    }
                    placeholder="Findings of the executive hearing, evidence considered, and final resolution..."
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    showToast(
                      `Appeals Ruling Issued for ${appealForm.club}: ${appealForm.verdict}`,
                    );
                    setAppealForm({
                      club: "Samba Boys",
                      verdict: "SANCTION_REDUCED",
                      justification: "",
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs transition shadow-lg"
                >
                  Deliver Binding Tribunal Ruling
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEPUTY PRESIDENT (Wayne Kiprop) */}
      {activeWorkspaceRole === "DEPUTY_PRESIDENT" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a26] border border-teal-400/40 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-teal-300 uppercase flex items-center gap-2">
                <span>📋</span> Issue Operational Directive (Acting on President's Behalf)
              </h4>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={directiveForm.dept}
                    onChange={(e) => setDirectiveForm({ ...directiveForm, dept: e.target.value })}
                    className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="Officiating Department">Officiating Department</option>
                    <option value="Registration Department">Registration Department</option>
                    <option value="Records Department">Records Department</option>
                    <option value="Technology Department">Technology Department</option>
                  </select>
                  <select
                    value={directiveForm.priority}
                    onChange={(e) =>
                      setDirectiveForm({ ...directiveForm, priority: e.target.value })
                    }
                    className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="HIGH">Priority: High</option>
                    <option value="CRITICAL">Priority: Critical</option>
                    <option value="STANDARD">Priority: Standard</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={directiveForm.title}
                  onChange={(e) => setDirectiveForm({ ...directiveForm, title: e.target.value })}
                  placeholder="Directive Title: e.g. Matchday Venue Clearance & Medical Kit Readiness"
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white"
                />
                <textarea
                  rows={4}
                  value={directiveForm.instructions}
                  onChange={(e) =>
                    setDirectiveForm({ ...directiveForm, instructions: e.target.value })
                  }
                  placeholder="Specific tasks, deadlines, and operational coordination instructions..."
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-white"
                />
                <button
                  onClick={() => {
                    if (!directiveForm.title.trim()) return;
                    showToast(`Operational Directive Dispatched to ${directiveForm.dept}`);
                    setDirectiveForm({
                      dept: "Officiating Department",
                      priority: "HIGH",
                      title: "",
                      instructions: "",
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-black font-black text-xs transition shadow-lg"
                >
                  Dispatch Operational Directive
                </button>
              </div>
            </div>

            <div className="bg-[#0e0a26] border border-[#2e2554] rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                <span>🛡️</span> Departmental Progress & Compliance Audit
              </h4>
              <p className="text-xs text-gray-300">
                Continuous monitoring of all 5 functional league departments:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#141029] rounded-xl border border-[#2e2554] flex items-center justify-between">
                  <span className="font-bold text-white">Registration & Regulations</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    100% Cleared (Cap: 25)
                  </span>
                </div>
                <div className="p-3 bg-[#141029] rounded-xl border border-[#2e2554] flex items-center justify-between">
                  <span className="font-bold text-white">Match Officiating</span>
                  <span className="text-[#00f0ff] font-mono font-bold">
                    Referees Roster Assigned
                  </span>
                </div>
                <div className="p-3 bg-[#141029] rounded-xl border border-[#2e2554] flex items-center justify-between">
                  <span className="font-bold text-white">Records & Files</span>
                  <span className="text-amber-400 font-mono font-bold">Scorecards Certified</span>
                </div>
                <div className="p-3 bg-[#141029] rounded-xl border border-[#2e2554] flex items-center justify-between">
                  <span className="font-bold text-white">Technology & Broadcast</span>
                  <span className="text-purple-400 font-mono font-bold">
                    Soundtrack & Ticker Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REGISTER AND REGULATIONS (Francis K. Nderitu) */}
      {activeWorkspaceRole === "REGULATIONS_MANAGER" && (
        <div className="space-y-6">
          <div className="bg-[#0e0a26] border border-emerald-400/40 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-black text-emerald-300 uppercase flex items-center gap-2">
              <span>📋</span> Student Athlete Eligibility & Squad Roster Desk
            </h4>
            <p className="text-xs text-gray-300">
              Direct verification of Admission Numbers (e.g. ADM-2024-0101), player licenses, and
              compliance with the 25-player maximum squad cap.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Squad Limit</span>
                <div className="text-lg font-black text-white">Max 25 Players / Club</div>
                <span className="text-[10px] text-emerald-400">Strictly Enforced</span>
              </div>
              <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Substitution Window
                </span>
                <div className="text-lg font-black text-white">Max 7 Subs / 3 Stoppages</div>
                <span className="text-[10px] text-[#00f0ff]">Standard Rulebook</span>
              </div>
              <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Pia Head Coaches
                </span>
                <div className="text-lg font-black text-white">5 Licensed Pia Coaches</div>
                <span className="text-[10px] text-amber-300">Assigned to Clubs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MATCH OFFICIATING (Mitchelle Muthoni) */}
      {activeWorkspaceRole === "MATCH_OFFICIATING_MANAGER" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a26] border border-indigo-400/40 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-indigo-300 uppercase flex items-center gap-2">
                <span>🚩</span> Matchweek Referees Deployment Desk
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Target Matchweek
                  </label>
                  <select
                    value={refereeForm.matchweek}
                    onChange={(e) => setRefereeForm({ ...refereeForm, matchweek: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                      <option key={w} value={`MW ${w}`}>
                        Matchweek {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={refereeForm.centerRef}
                    onChange={(e) => setRefereeForm({ ...refereeForm, centerRef: e.target.value })}
                    placeholder="Center Referee (FIFA Badge)"
                    className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={refereeForm.linesman1}
                    onChange={(e) => setRefereeForm({ ...refereeForm, linesman1: e.target.value })}
                    placeholder="Assistant Referee 1 (Linesman)"
                    className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  onClick={() =>
                    showToast(
                      `Referee Crew Assigned to ${refereeForm.matchweek}: ${refereeForm.centerRef}`,
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs transition shadow-lg"
                >
                  Deploy Match Officials to Fixtures
                </button>
              </div>
            </div>

            <div className="bg-[#0e0a26] border border-[#2e2554] rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-rose-400 uppercase flex items-center gap-2">
                <span>⚠️</span> Disciplinary Card Sanction Registry
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={cardSanctionForm.player}
                    onChange={(e) =>
                      setCardSanctionForm({ ...cardSanctionForm, player: e.target.value })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={cardSanctionForm.type}
                    onChange={(e) =>
                      setCardSanctionForm({ ...cardSanctionForm, type: e.target.value })
                    }
                    className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="DIRECT_RED">Direct Red Card</option>
                    <option value="SECOND_YELLOW">Second Yellow</option>
                    <option value="ACCUMULATED_YELLOW">5 Accumulated Yellows</option>
                  </select>
                  <input
                    type="text"
                    value={cardSanctionForm.sanction}
                    onChange={(e) =>
                      setCardSanctionForm({ ...cardSanctionForm, sanction: e.target.value })
                    }
                    className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  onClick={() =>
                    showToast(
                      `Disciplinary Sanction Logged: ${cardSanctionForm.player} (${cardSanctionForm.sanction})`,
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs transition shadow-lg"
                >
                  Record Official Suspension
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. RECORDS AND FILE (Tonnie Mark Odundo) */}
      {activeWorkspaceRole === "RECORDS_MANAGER" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a26] border border-pink-400/40 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-pink-300 uppercase flex items-center gap-2">
                <span>📑</span> Certify Matchweek Scorecards
              </h4>
              <p className="text-xs text-gray-300">
                Official validation of goal events, player statistics, and final standings
                recalculation.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() =>
                    showToast("Scorecards Certified: All matchweek scores stamped and archived.")
                  }
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs hover:brightness-110 shadow-lg"
                >
                  Certify All Current Matchweek Scorecards
                </button>
              </div>
            </div>

            <div className="bg-[#0e0a26] border border-[#2e2554] rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                <span>📝</span> Record Official Administrative Minutes
              </h4>
              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  value={adminMinuteForm.title}
                  onChange={(e) =>
                    setAdminMinuteForm({ ...adminMinuteForm, title: e.target.value })
                  }
                  placeholder="Minute Title: e.g. Council Meeting on Stoppage Time Rules"
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                />
                <textarea
                  rows={3}
                  value={adminMinuteForm.content}
                  onChange={(e) =>
                    setAdminMinuteForm({ ...adminMinuteForm, content: e.target.value })
                  }
                  placeholder="Document key decisions, resolutions passed, and disciplinary outcomes..."
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white"
                />
                <button
                  onClick={() => {
                    if (!adminMinuteForm.title.trim()) return;
                    showToast(`Administrative Minute Archived: "${adminMinuteForm.title}"`);
                    setAdminMinuteForm({ title: "", attendees: "", content: "" });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs transition shadow-lg"
                >
                  Archive Official Proceeding
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TECHNOLOGICAL MANAGER (Trady Lewis) */}
      {activeWorkspaceRole === "TECH_MANAGER" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a26] border border-cyan-400/40 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-[#00f0ff] uppercase flex items-center gap-2">
                <span>🖥️</span> Pitchside Digital Scoreboard Controller
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">
                    LED Scoreboard Ticker Text
                  </label>
                  <input
                    type="text"
                    value={scoreboardTicker}
                    onChange={(e) => setScoreboardTicker(e.target.value)}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <button
                  onClick={() => showToast(`Scoreboard Ticker Updated: "${scoreboardTicker}"`)}
                  className="w-full py-2.5 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs transition shadow-lg"
                >
                  Broadcast to Pitchside LED Scoreboards
                </button>
              </div>
            </div>

            <div className="bg-[#0e0a26] border border-[#2e2554] rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                <span>🎵</span> Website Anthem & Stadium Soundtrack Studio
              </h4>
              <p className="text-xs text-gray-300">
                Directly configure background matchday soundtrack, custom YouTube video songs, or
                uploaded audio tracks.
              </p>
              <div className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">Audio Engine: READY</span>
                <span className="text-gray-400 font-mono">Autoplay Enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ASSISTANT TECHNOLOGICAL MANAGER (Ahmed Kusow) */}
      {activeWorkspaceRole === "ASST_TECH_MANAGER" && (
        <div className="space-y-6">
          <div className="bg-[#0e0a26] border border-blue-400/40 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2">
                <span>📡</span>
                <h4 className="text-base font-black text-blue-300 uppercase">
                  Digital Broadcast Assistant & Continuity Bay
                </h4>
              </div>
              <button
                onClick={() => {
                  setStandbyActive(!standbyActive);
                  showToast(
                    standbyActive
                      ? "Standby Mode Deactivated. Supporting Technological Manager."
                      : "EMERGENCY STANDBY ACTIVATED: Full digital broadcast override enabled.",
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  standbyActive
                    ? "bg-amber-400 text-black"
                    : "bg-[#00f0ff] text-black hover:bg-cyan-300"
                }`}
              >
                {standbyActive ? "Stand Down Standby" : "Activate Emergency Standby"}
              </button>
            </div>
            <p className="text-xs text-gray-300">
              Supports the Technological Manager in publishing matchday reports, video cinema reels,
              and ensuring zero-downtime operations during championship fixtures.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
