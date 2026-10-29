import React, { useState, useEffect, useMemo } from "react";
import {
  Upload,
  Camera,
  CheckCircle2,
  UserCheck,
  Shield,
  Sparkles,
  Copy,
  ExternalLink,
} from "lucide-react";

interface PlayerInfo {
  name: string;
  number?: number;
  position?: string;
  foot?: string;
  admissionNumber?: string;
  email?: string;
  photoUrl?: string;
}

interface TeamData {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  homePitch: string;
  squad?: PlayerInfo[];
}

export function PlayerPhotoUploadPortal() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | "">("");
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>("");
  const [previewPhoto, setPreviewPhoto] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Load teams & squads from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mpesa_pes_teams_v6");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
          setSelectedTeamId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load teams:", e);
    }

    // Default fallback squads
    const defaultTeams: TeamData[] = [
      {
        id: 1,
        name: "Samba Boys",
        shortCode: "SMB",
        color: "#00ff85",
        homePitch: "Samba Arena (School Lower Pitch)",
        squad: [
          {
            name: "Wokabi",
            number: 9,
            position: "FWD",
            foot: "Right",
            admissionNumber: "ADM-2024-0101",
            photoUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          },
          {
            name: "Brian Mwangi",
            number: 7,
            position: "MID",
            foot: "Right",
            admissionNumber: "ADM-2024-0102",
            photoUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          },
          {
            name: "Dan Kiprop",
            number: 1,
            position: "GK",
            foot: "Both",
            admissionNumber: "ADM-2024-0103",
            photoUrl:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
          },
          {
            name: "Samuel Otieno",
            number: 4,
            position: "DEF",
            foot: "Right",
            admissionNumber: "ADM-2024-0104",
          },
          {
            name: "Faith Chemutai",
            number: 8,
            position: "MID",
            foot: "Left",
            admissionNumber: "ADM-2024-0105",
          },
          {
            name: "Victor Maina",
            number: 11,
            position: "FWD",
            foot: "Right",
            admissionNumber: "ADM-2024-0106",
          },
        ],
      },
      {
        id: 2,
        name: "Grade 10 A",
        shortCode: "G10A",
        color: "#00f0ff",
        homePitch: "Academy Main Stadium",
        squad: [
          {
            name: "Emmanuel Kip",
            number: 9,
            position: "FWD",
            foot: "Left",
            admissionNumber: "ADM-2024-0201",
            photoUrl:
              "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
          },
          {
            name: "John Doe",
            number: 1,
            position: "GK",
            foot: "Right",
            admissionNumber: "ADM-2024-0202",
            photoUrl:
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
          },
          {
            name: "Bradley Barasa",
            number: 6,
            position: "DEF",
            foot: "Right",
            admissionNumber: "ADM-2024-0203",
          },
          {
            name: "George Ochieng",
            number: 8,
            position: "MID",
            foot: "Both",
            admissionNumber: "ADM-2024-0204",
          },
          {
            name: "Ryan Gitonga",
            number: 11,
            position: "FWD",
            foot: "Left",
            admissionNumber: "ADM-2024-0205",
          },
        ],
      },
      {
        id: 3,
        name: "Grade 10 B",
        shortCode: "G10B",
        color: "#ffe600",
        homePitch: "Yellow Fortress Pitch B",
        squad: [
          {
            name: "Joshua Mutua",
            number: 5,
            position: "DEF",
            foot: "Right",
            admissionNumber: "ADM-2024-0301",
          },
          {
            name: "Ian Mercer",
            number: 10,
            position: "MID",
            foot: "Both",
            admissionNumber: "ADM-2024-0303",
          },
          {
            name: "Peter Kariuki",
            number: 1,
            position: "GK",
            foot: "Right",
            admissionNumber: "ADM-2024-0304",
          },
          {
            name: "Kelvin Njoroge",
            number: 7,
            position: "FWD",
            foot: "Right",
            admissionNumber: "ADM-2024-0305",
          },
        ],
      },
      {
        id: 4,
        name: "DP 2 A",
        shortCode: "DP2A",
        color: "#ff0077",
        homePitch: "Senior DP Complex",
        squad: [
          {
            name: "Collins Wekesa",
            number: 8,
            position: "MID",
            foot: "Right",
            admissionNumber: "ADM-2023-0401",
          },
          {
            name: "Alex Rono",
            number: 11,
            position: "FWD",
            foot: "Left",
            admissionNumber: "ADM-2023-0403",
          },
          {
            name: "Timothy Cheruiyot",
            number: 1,
            position: "GK",
            foot: "Both",
            admissionNumber: "ADM-2023-0404",
          },
          {
            name: "Kelvin Korir",
            number: 9,
            position: "FWD",
            foot: "Right",
            admissionNumber: "ADM-2023-0406",
          },
        ],
      },
      {
        id: 5,
        name: "DP 2 B",
        shortCode: "DP2B",
        color: "#a855f7",
        homePitch: "Purple Pitch Arena",
        squad: [
          {
            name: "Hassan Ali",
            number: 10,
            position: "MID",
            foot: "Both",
            admissionNumber: "ADM-2023-0501",
          },
          {
            name: "Rashid Mohamed",
            number: 6,
            position: "DEF",
            foot: "Right",
            admissionNumber: "ADM-2023-0503",
          },
          {
            name: "Brian Koech",
            number: 1,
            position: "GK",
            foot: "Right",
            admissionNumber: "ADM-2023-0504",
          },
          {
            name: "Caleb Kibet",
            number: 9,
            position: "FWD",
            foot: "Right",
            admissionNumber: "ADM-2023-0505",
          },
        ],
      },
    ];

    setTeams(defaultTeams);
    setSelectedTeamId(defaultTeams[0].id);
  }, []);

  const currentTeam = teams.find((t) => t.id === Number(selectedTeamId));
  const currentSquad = useMemo(() => currentTeam?.squad || [], [currentTeam]);

  const currentPlayer = currentSquad.find((p) => p.name === selectedPlayerName) || null;

  // Set default player when team changes
  useEffect(() => {
    if (currentSquad.length > 0 && !selectedPlayerName) {
      setSelectedPlayerName(currentSquad[0].name);
      setPreviewPhoto(currentSquad[0].photoUrl || "");
    }
  }, [currentSquad, selectedPlayerName]);

  const handlePlayerChange = (name: string) => {
    setSelectedPlayerName(name);
    const p = currentSquad.find((item) => item.name === name);
    setPreviewPhoto(p?.photoUrl || "");
    setUploadSuccess(false);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewPhoto(result);
        setUploadSuccess(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = () => {
    if (!selectedTeamId || !selectedPlayerName || !previewPhoto) {
      alert("Please select your club, player profile, and upload an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update team squads
      const updatedTeams = teams.map((team) => {
        if (team.id === Number(selectedTeamId)) {
          const updatedSquad = (team.squad || []).map((player) => {
            if (player.name === selectedPlayerName) {
              return { ...player, photoUrl: previewPhoto };
            }
            return player;
          });
          return { ...team, squad: updatedSquad };
        }
        return team;
      });

      setTeams(updatedTeams);
      localStorage.setItem("mpesa_pes_teams_v6", JSON.stringify(updatedTeams));

      // Also update playerStatsList if present
      const storedStats = localStorage.getItem("mpesa_pes_stats_v6");
      if (storedStats) {
        try {
          const stats = JSON.parse(storedStats);
          if (Array.isArray(stats)) {
            const updatedStats = stats.map((s) => {
              if (s.name === selectedPlayerName) {
                return { ...s, photoUrl: previewPhoto };
              }
              return s;
            });
            localStorage.setItem("mpesa_pes_stats_v6", JSON.stringify(updatedStats));
          }
        } catch (e) {
          console.warn("Stats sync warning:", e);
        }
      }

      // Notify window listeners
      window.dispatchEvent(new Event("storage"));

      setIsSubmitting(false);
      setUploadSuccess(true);
    } catch (e) {
      console.error("Error saving player photo:", e);
      setIsSubmitting(false);
      alert("Failed to save photo. Please try again.");
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/upload-photo`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-[#0d0926] via-[#1a123f] to-[#0d0926] border border-[#2e2554] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
                Official Player Self-Service Portal
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Instant Live Sync
              </span>
            </div>
            <h1 className="font-header text-3xl sm:text-4xl font-black text-white uppercase tracking-wider leading-none">
              Player Profile Photo Upload
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Student athletes: Select your club and name, then upload your official headshot. Once
              saved, your portrait immediately reflects across the Admin Personnel Module, Matchday
              Lineups, and Player Leaderboard!
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              onClick={copyShareLink}
              className="bg-[#141029] hover:bg-[#1f1744] border border-[#2e2554] hover:border-[#00f0ff] text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
              title="Copy link to share with players"
            >
              <Copy className="w-4 h-4 text-[#00f0ff]" />
              <span>{copiedLink ? "Link Copied!" : "Copy Share Link"}</span>
            </button>
            <a
              href="/league.html"
              className="bg-gradient-to-r from-purple-600 to-[#e6007e] text-white px-3.5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-lg"
            >
              <span>Back to League Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Upload Card */}
      <div className="bg-[#0e0a26]/95 border border-[#2e2554] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Step 1 & 2: Select Club & Select Player */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-300 tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#00f0ff]" /> 1. Select Your Club
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => {
                const newId = Number(e.target.value);
                setSelectedTeamId(newId);
                const t = teams.find((item) => item.id === newId);
                if (t && t.squad && t.squad.length > 0) {
                  setSelectedPlayerName(t.squad[0].name);
                  setPreviewPhoto(t.squad[0].photoUrl || "");
                } else {
                  setSelectedPlayerName("");
                  setPreviewPhoto("");
                }
                setUploadSuccess(false);
              }}
              className="w-full bg-[#141029] border border-[#2e2554] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f0ff]"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.shortCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-300 tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" /> 2. Select Your Player Profile
            </label>
            <select
              value={selectedPlayerName}
              onChange={(e) => handlePlayerChange(e.target.value)}
              className="w-full bg-[#141029] border border-[#2e2554] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f0ff]"
            >
              {currentSquad.map((player, idx) => (
                <option key={idx} value={player.name}>
                  #{player.number || idx + 1} • {player.name} ({player.position || "Player"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Player Profile Details Capsule */}
        {currentPlayer && (
          <div className="p-4 bg-[#141029] border border-[#2e2554] rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md border border-white/20 shrink-0"
                style={{ backgroundColor: currentTeam?.color || "#00f0ff" }}
              >
                #{currentPlayer.number || 10}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">{currentPlayer.name}</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    {currentPlayer.position || "FWD"}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {currentPlayer.admissionNumber
                    ? `ADM: ${currentPlayer.admissionNumber}`
                    : "Student Athlete"}{" "}
                  • Foot: {currentPlayer.foot || "Right"}
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-gray-400">
              <span className="block text-[10px] uppercase font-bold text-gray-500">Club</span>
              <span className="font-bold text-[#00f0ff]">{currentTeam?.name}</span>
            </div>
          </div>
        )}

        {/* Step 3: Photo Upload & Live Preview Area */}
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-purple-400" /> 3. Upload Your Portrait Picture
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Live Portrait Preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#070512] border border-[#2e2554] rounded-3xl space-y-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">
                Live Headshot Preview
              </span>

              <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-2 border-[#00f0ff] shadow-xl shadow-cyan-500/20 bg-[#120d29] flex items-center justify-center">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Player Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500 gap-1">
                    <UserCheck className="w-10 h-10 text-gray-600" />
                    <span className="text-[10px] font-bold">No Photo Yet</span>
                  </div>
                )}

                {previewPhoto && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black" />
                )}
              </div>

              <span className="text-[11px] text-gray-400 font-mono text-center">
                {selectedPlayerName} • #{currentPlayer?.number || 1}
              </span>
            </div>

            {/* Dropzone & File Input */}
            <div className="md:col-span-2 space-y-3">
              <div className="border-2 border-dashed border-[#2e2554] hover:border-[#00f0ff] rounded-3xl p-6 text-center cursor-pointer transition relative group bg-[#070512]/60">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageFile}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] mx-auto flex items-center justify-center group-hover:scale-110 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-200 font-extrabold">
                    Click to browse or drag & drop photo
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PNG, JPG, or WebP (headshot / portrait recommended)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1">
                  Or paste direct image URL:
                </label>
                <input
                  type="text"
                  value={previewPhoto.startsWith("data:") ? "" : previewPhoto}
                  onChange={(e) => {
                    setPreviewPhoto(e.target.value);
                    setUploadSuccess(false);
                  }}
                  placeholder="https://example.com/photos/player-photo.jpg"
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {uploadSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-black text-white text-sm">
                Profile Photo Updated Live!
              </span>
              Your new picture has been synchronized across the admin personnel directory, player
              stats leaderboard, and club roster.
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-4 border-t border-[#2e2554] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">
            Changes save immediately to the official league roster and admin records.
          </span>

          <button
            onClick={handleSavePhoto}
            disabled={isSubmitting || !previewPhoto}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xl ${
              !previewPhoto
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black hover:shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? "Saving Photo..." : "Publish Official Profile Picture"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
