import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Shield,
  Search,
  Filter,
  X,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Award,
  ChevronDown,
  UserCheck,
  Flame,
  ChevronRight,
  Crown,
  Edit2,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  type FantasyPlayer,
  type AdminPlayerRating,
  type GameweekChallenge,
  generateFantasyMarket,
  validateFormation,
  checkClubLimit,
  getAdminPlayerRatings,
  saveAdminPlayerRating,
  getGameweekChallenge,
  saveGameweekChallenge,
} from "../lib/fantasyEngine";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { getDbFixtures, getDbTeams, type DbFixture } from "../lib/inbuiltDbSync";
import { MatchweekSelector } from "./MatchweekSelector";

export interface FantasyTeamSelectionProps {
  initialGameweek?: number;
  onSaved?: (lineup: FantasyPlayer[], gameweek: number) => void;
  className?: string;
}

// 11 Pitch Slot Types
export type PitchPositionType = "GK" | "DEF" | "MID" | "FWD";

export interface PitchSlot {
  slotId: string;
  position: PitchPositionType;
  label: string;
  rowIndex: number;
  colIndex: number;
}

export type SupportedFormation =
  | "4-4-2"
  | "4-3-3"
  | "3-5-2"
  | "3-4-3"
  | "5-3-2"
  | "5-4-1"
  | "4-5-1"
  | "1-1-3";

export function FantasyTeamSelection({
  initialGameweek = 10,
  onSaved,
  className = "",
}: FantasyTeamSelectionProps) {
  // Current active gameweek
  const [selectedGameweek, setSelectedGameweek] = useState<number>(initialGameweek);

  // Manager & Team Details (Customizable)
  const [teamName, setTeamName] = useState<string>("Zenvior");
  const [managerName, setManagerName] = useState<string>("Tonnie Mark");
  const [isEditingTeamName, setIsEditingTeamName] = useState<boolean>(false);

  // Selected Formation (Defaults to 4-3-3 or 4-4-2)
  const [formation, setFormation] = useState<SupportedFormation>("4-3-3");

  // Selected 11 Starting Players (SlotId -> FantasyPlayer | null)
  const [lineup, setLineup] = useState<Record<string, FantasyPlayer | null>>({});

  // Captain & Vice Captain IDs
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<number | null>(null);

  // Right Side Player Selection Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [positionFilter, setPositionFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"points" | "price" | "form" | "goals" | "selected">("points");
  const [maxCostFilter, setMaxCostFilter] = useState<number>(15.8);

  // Target Slot being picked from pitch
  const [activeSlotTarget, setActiveSlotTarget] = useState<PitchSlot | null>(null);

  // Inspecting Player Modal
  const [inspectingPlayer, setInspectingPlayer] = useState<FantasyPlayer | null>(null);

  // Deadlines Explanations Modal
  const [showDeadlinesModal, setShowDeadlinesModal] = useState<boolean>(false);

  // Role Access: Check if user is Super Admin or Council member to edit challenges & ratings
  const { currentRole, isSuperAdmin } = useRoleAccess();
  const canEditChallengeOrRatings = useMemo(() => {
    if (isSuperAdmin) return true;
    if (!currentRole || currentRole === "GUEST") return false;
    return [
      "SUPER_ADMIN",
      "PRESIDENT",
      "DEPUTY_PRESIDENT",
      "REGULATIONS_MANAGER",
      "MATCH_OFFICIATING_MANAGER",
      "RECORDS_MANAGER",
      "TECH_MANAGER",
    ].includes(currentRole);
  }, [isSuperAdmin, currentRole]);

  // Dynamic Gameweek Challenge (Loaded per selectedGameweek, editable by admin)
  const [challenge, setChallenge] = useState<GameweekChallenge>(() =>
    getGameweekChallenge(selectedGameweek),
  );
  const [showChallengeEditor, setShowChallengeEditor] = useState<boolean>(false);
  const [editChallengeTitle, setEditChallengeTitle] = useState<string>("");
  const [editChallengeDesc, setEditChallengeDesc] = useState<string>("");
  const [editChallengeBonus, setEditChallengeBonus] = useState<string>("");

  // Admin Quick Rating Modal State
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [targetPlayerForRating, setTargetPlayerForRating] = useState<FantasyPlayer | null>(null);
  const [ratingScoreInput, setRatingScoreInput] = useState<number>(8.0);
  const [ratingBonusInput, setRatingBonusInput] = useState<number>(0);
  const [ratingGoalsInput, setRatingGoalsInput] = useState<number>(0);
  const [ratingAssistsInput, setRatingAssistsInput] = useState<number>(0);
  const [ratingCleanSheetInput, setRatingCleanSheetInput] = useState<boolean>(false);

  // Synchronize challenge whenever gameweek changes or when admin writes an update
  useEffect(() => {
    setChallenge(getGameweekChallenge(selectedGameweek));
  }, [selectedGameweek]);

  useEffect(() => {
    const handleChallengeUpdate = (e: Event) => {
      const custom = e as CustomEvent<GameweekChallenge>;
      if (custom.detail && custom.detail.gameweek === selectedGameweek) {
        setChallenge(custom.detail);
      } else {
        setChallenge(getGameweekChallenge(selectedGameweek));
      }
    };
    window.addEventListener("mpesa_fantasy_challenge_updated", handleChallengeUpdate);
    return () => window.removeEventListener("mpesa_fantasy_challenge_updated", handleChallengeUpdate);
  }, [selectedGameweek]);

  // Toast Notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Storage key per gameweek
  const storageKey = `fantasy_selection_gw_${selectedGameweek}_v1`;

  // Dynamic admin ratings
  const [adminRatings, setAdminRatings] = useState<Record<number, AdminPlayerRating>>(() =>
    getAdminPlayerRatings(selectedGameweek),
  );

  useEffect(() => {
    const handleUpdate = () => setAdminRatings(getAdminPlayerRatings(selectedGameweek));
    window.addEventListener("mpesa_fantasy_ratings_updated", handleUpdate);
    return () => window.removeEventListener("mpesa_fantasy_ratings_updated", handleUpdate);
  }, [selectedGameweek]);

  // Generate market players strictly using real website data and matchweek-specific admin ratings
  // Note: unrated players have 0 gameweek points until admin logs their rating
  const marketPlayers = useMemo(() => {
    return generateFantasyMarket(adminRatings, selectedGameweek);
  }, [adminRatings, selectedGameweek]);

  // Dynamic slots based on current formation
  const pitchSlots = useMemo<PitchSlot[]>(() => {
    const slots: PitchSlot[] = [];

    // Always 1 GK in Row 0
    slots.push({
      slotId: "slot_gk_1",
      position: "GK",
      label: "Goalkeeper",
      rowIndex: 0,
      colIndex: 0,
    });

    if (formation === "1-1-3") {
      // 1 Def, 1 Mid, 3 Fwd (Matching attached image 0e25ceed layout)
      slots.push({
        slotId: "slot_def_1",
        position: "DEF",
        label: "Defender",
        rowIndex: 1,
        colIndex: 0,
      });
      slots.push({
        slotId: "slot_mid_1",
        position: "MID",
        label: "Midfielder",
        rowIndex: 2,
        colIndex: 0,
      });
      for (let i = 0; i < 3; i++) {
        slots.push({
          slotId: `slot_fwd_${i + 1}`,
          position: "FWD",
          label: "Forward",
          rowIndex: 3,
          colIndex: i,
        });
      }
      return slots;
    }

    // Standard 11-player formations: Parse e.g. "4-3-3" -> [4, 3, 3]
    const parts = formation.split("-").map(Number);
    const defCount = parts[0] || 4;
    const midCount = parts[1] || 3;
    const fwdCount = parts[2] || 3;

    // Row 1: Defenders
    for (let i = 0; i < defCount; i++) {
      slots.push({
        slotId: `slot_def_${i + 1}`,
        position: "DEF",
        label: "Defender",
        rowIndex: 1,
        colIndex: i,
      });
    }

    // Row 2: Midfielders
    for (let i = 0; i < midCount; i++) {
      slots.push({
        slotId: `slot_mid_${i + 1}`,
        position: "MID",
        label: "Midfielder",
        rowIndex: 2,
        colIndex: i,
      });
    }

    // Row 3: Forwards
    for (let i = 0; i < fwdCount; i++) {
      slots.push({
        slotId: `slot_fwd_${i + 1}`,
        position: "FWD",
        label: "Forward",
        rowIndex: 3,
        colIndex: i,
      });
    }

    return slots;
  }, [formation]);

  // Load saved lineup for selected gameweek
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lineup) setLineup(parsed.lineup);
        if (parsed.formation) setFormation(parsed.formation);
        if (parsed.captainId) setCaptainId(parsed.captainId);
        if (parsed.viceCaptainId) setViceCaptainId(parsed.viceCaptainId);
        if (parsed.teamName) setTeamName(parsed.teamName);
        if (parsed.managerName) setManagerName(parsed.managerName);
        return;
      }
    } catch (e) {
      // ignore
    }

    // If no saved lineup for this week, initialize empty slots for current formation
    const initialMap: Record<string, FantasyPlayer | null> = {};
    pitchSlots.forEach((slot) => {
      initialMap[slot.slotId] = null;
    });
    setLineup(initialMap);
    setCaptainId(null);
    setViceCaptainId(null);
  }, [selectedGameweek, storageKey, pitchSlots]);

  // Current selected players list (excluding nulls)
  const selectedPlayers = useMemo(() => {
    return Object.values(lineup).filter((p): p is FantasyPlayer => p !== null);
  }, [lineup]);

  // Validate 3-player maximum club rule
  const clubValidation = useMemo(() => {
    return checkClubLimit(selectedPlayers, 3);
  }, [selectedPlayers]);

  // Formation validation
  const formationValidation = useMemo(() => {
    return validateFormation(selectedPlayers);
  }, [selectedPlayers]);

  // Budget calculations
  const totalBudget = 100.0;
  const spentBudget = useMemo(() => {
    return Number(selectedPlayers.reduce((sum, p) => sum + p.price, 0).toFixed(1));
  }, [selectedPlayers]);
  const remainingBudget = Number(Math.max(0, totalBudget - spentBudget).toFixed(1));

  // Total Gameweek points earned by selected players (with Captain 2x multiplier)
  const currentTotalPoints = useMemo(() => {
    return selectedPlayers.reduce((sum, p) => {
      const multiplier = p.id === captainId ? 2 : 1;
      return sum + p.gameweekPoints * multiplier;
    }, 0);
  }, [selectedPlayers, captainId]);

  // Toast trigger helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Assign or swap a player directly into a specific target pitch slot
  const handleAssignToTargetSlot = (player: FantasyPlayer, targetSlot: PitchSlot) => {
    // If player is already in this target slot
    if (lineup[targetSlot.slotId]?.id === player.id) {
      showToast(`${player.name} is already assigned to this slot.`);
      return;
    }

    const existingInTarget = lineup[targetSlot.slotId];
    const isAlreadyInLineup = selectedPlayers.some((p) => p.id === player.id);

    // If new to the lineup, check club limit
    if (!isAlreadyInLineup) {
      const currentClubCount = selectedPlayers.filter(
        (p) => p.clubName === player.clubName && (!existingInTarget || p.id !== existingInTarget.id),
      ).length;
      if (currentClubCount >= 3) {
        showToast(`Club limit reached: Maximum 3 players allowed from ${player.clubName}.`, "error");
        return;
      }
    }

    // Budget check
    const existingCost = existingInTarget ? existingInTarget.price : 0;
    const netCost = isAlreadyInLineup ? 0 : player.price - existingCost;
    if (!isAlreadyInLineup && spentBudget + netCost > totalBudget) {
      showToast(`Budget exceeded: Remaining £${remainingBudget}m is not enough for £${player.price}m.`, "error");
      return;
    }

    // Construct updated lineup with clean swap if player already existed elsewhere
    const updatedLineup = { ...lineup };
    if (isAlreadyInLineup) {
      Object.keys(updatedLineup).forEach((sId) => {
        if (updatedLineup[sId]?.id === player.id) {
          updatedLineup[sId] = existingInTarget || null;
        }
      });
    }
    updatedLineup[targetSlot.slotId] = player;
    setLineup(updatedLineup);

    if (!captainId) setCaptainId(player.id);
    else if (!viceCaptainId && player.id !== captainId) setViceCaptainId(player.id);

    setActiveSlotTarget(null);
    showToast(`✓ Placed ${player.name} into ${targetSlot.label}!`);
  };

  // Add a player to a specific slot or next available matching slot
  const handleAddPlayer = (player: FantasyPlayer) => {
    // Check if player is already selected in another slot
    if (selectedPlayers.some((p) => p.id === player.id)) {
      showToast(`${player.name} is already in your starting lineup.`, "error");
      return;
    }

    // Enforce 3-player maximum per real-world club
    const currentClubCount = selectedPlayers.filter((p) => p.clubName === player.clubName).length;
    if (currentClubCount >= 3) {
      showToast(
        `Club limit reached: Maximum 3 players allowed from ${player.clubName}.`,
        "error",
      );
      return;
    }

    // Budget check
    if (spentBudget + player.price > totalBudget) {
      showToast(
        `Budget exceeded: Remaining £${remainingBudget}m is not enough for £${player.price}m.`,
        "error",
      );
      return;
    }

    // If an active slot target was clicked and matches player position, use it
    if (activeSlotTarget && activeSlotTarget.position === player.position) {
      handleAssignToTargetSlot(player, activeSlotTarget);
      return;
    }

    // Otherwise find the first empty slot for this position
    const emptySlot = pitchSlots.find(
      (s) => s.position === player.position && !lineup[s.slotId],
    );

    if (emptySlot) {
      setLineup((prev) => ({
        ...prev,
        [emptySlot.slotId]: player,
      }));
      if (!captainId) setCaptainId(player.id);
      else if (!viceCaptainId && player.id !== captainId) setViceCaptainId(player.id);
      showToast(`Added ${player.name} to your squad.`);
      return;
    }

    showToast(
      `No open ${player.position} slots in current formation (${formation}). Remove a player first.`,
      "error",
    );
  };

  // Remove player from slot
  const handleRemoveSlot = (slotId: string) => {
    const player = lineup[slotId];
    if (!player) return;

    if (captainId === player.id) setCaptainId(null);
    if (viceCaptainId === player.id) setViceCaptainId(null);

    setLineup((prev) => ({
      ...prev,
      [slotId]: null,
    }));
    showToast(`Removed ${player.name} from lineup.`);
  };

  // Reset entire lineup
  const handleReset = () => {
    const emptyMap: Record<string, FantasyPlayer | null> = {};
    pitchSlots.forEach((s) => {
      emptyMap[s.slotId] = null;
    });
    setLineup(emptyMap);
    setCaptainId(null);
    setViceCaptainId(null);
    setActiveSlotTarget(null);
    showToast("Lineup cleared.");
  };

  // Auto Pick smart squad with VARIATION on each click, strictly respecting £100m budget and 3-player-per-club rule
  const handleAutoPick = () => {
    const picked: Record<string, FantasyPlayer | null> = {};
    const clubCountMap: Record<string, number> = {};
    const usedPlayerIds = new Set<number>();
    let runningBudget = 0;

    pitchSlots.forEach((slot) => {
      // Find candidate matching position
      const candidates = marketPlayers
        .filter(
          (p) =>
            p.position === slot.position &&
            !usedPlayerIds.has(p.id) &&
            (clubCountMap[p.clubName] || 0) < 3 &&
            runningBudget + p.price <= totalBudget,
        )
        // Score with randomized weighting so squads vary every click while remaining competitive
        .map((p) => {
          const score =
            (p.totalPoints || 0) * 0.5 +
            (p.form || 6.0) * 2.5 +
            Math.random() * 25 -
            p.price * 0.4;
          return { player: p, score };
        })
        .sort((a, b) => b.score - a.score);

      if (candidates.length > 0) {
        // Pick one randomly among top 3 candidates to ensure fresh variety on every click
        const poolSize = Math.min(3, candidates.length);
        const choice = candidates[Math.floor(Math.random() * poolSize)].player;
        picked[slot.slotId] = choice;
        usedPlayerIds.add(choice.id);
        clubCountMap[choice.clubName] = (clubCountMap[choice.clubName] || 0) + 1;
        runningBudget += choice.price;
      } else {
        picked[slot.slotId] = null;
      }
    });

    setLineup(picked);

    const validList = Object.values(picked).filter((p): p is FantasyPlayer => p !== null);
    if (validList.length > 0) {
      const topCandidates = [...validList].sort((a, b) => b.totalPoints - a.totalPoints);
      setCaptainId(topCandidates[0]?.id || null);
      setViceCaptainId(topCandidates[1]?.id || null);
    }

    showToast(`✨ Generated varied squad: ${validList.length}/${pitchSlots.length} players selected within £100m!`);
  };

  // Save current team for gameweek
  const handleSaveTeam = () => {
    if (selectedPlayers.length !== 11 && formation !== "1-1-3") {
      showToast(
        `Incomplete lineup: ${selectedPlayers.length}/11 players selected. Please fill all slots.`,
        "error",
      );
      return;
    }

    if (!clubValidation.isCompliant) {
      showToast(
        `Club rule violated: ${clubValidation.violatedClubs.join(", ")}. Max 3 players per club.`,
        "error",
      );
      return;
    }

    if (spentBudget > totalBudget) {
      showToast(`Budget exceeded: Total value £${spentBudget}m exceeds £${totalBudget}m.`, "error");
      return;
    }

    if (!captainId && selectedPlayers.length > 0) {
      setCaptainId(selectedPlayers[0].id);
    }

    const payload = {
      gameweek: selectedGameweek,
      teamName,
      managerName,
      formation,
      lineup,
      captainId: captainId || selectedPlayers[0]?.id || null,
      viceCaptainId: viceCaptainId || selectedPlayers[1]?.id || null,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      localStorage.setItem("fantasy_msl_last_active_lineup", JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("mpesa_fantasy_lineup_saved", { detail: payload }));
      if (onSaved) onSaved(selectedPlayers, selectedGameweek);
      showToast(`✓ Gameweek ${selectedGameweek} fantasy lineup successfully saved and locked!`);
    } catch (e) {
      showToast("Failed to save lineup to local storage.", "error");
    }
  };

  // Fixture Opponent Helper for players
  const getPlayerOpponent = (player: FantasyPlayer) => {
    const fixtures = getDbFixtures();
    const fix = fixtures.find(
      (f) =>
        f.matchweek === selectedGameweek &&
        (f.homeTeamName.toLowerCase().includes(player.clubName.toLowerCase()) ||
          f.awayTeamName.toLowerCase().includes(player.clubName.toLowerCase()) ||
          f.homeId === player.clubId ||
          f.awayId === player.clubId),
    );

    if (!fix) {
      // Mock realistic opponent code
      const opps = ["TOT (H)", "HUL (H)", "SUN (A)", "BRE (H)", "ARS (A)", "CRY (A)", "NFO (A)"];
      return {
        badge: opps[player.id % opps.length],
        difficulty: (player.id % 3 === 0) ? "easy" : (player.id % 3 === 1) ? "med" : "hard",
      };
    }

    const isHome =
      fix.homeTeamName.toLowerCase().includes(player.clubName.toLowerCase()) ||
      fix.homeId === player.clubId;
    const oppName = isHome ? fix.awayTeamName : fix.homeTeamName;
    const oppCode = oppName.slice(0, 3).toUpperCase();
    const badge = `${oppCode} (${isHome ? "H" : "A"})`;
    const difficulty = isHome ? "easy" : "med";
    return { badge, difficulty };
  };

  // Filtered player selection list for the right-hand panel
  const filteredPlayers = useMemo(() => {
    return marketPlayers.filter((p) => {
      // Search filter
      if (
        searchQuery.trim() &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.clubName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Position filter
      if (positionFilter !== "ALL" && p.position !== positionFilter) {
        return false;
      }
      // Max cost filter
      if (p.price > maxCostFilter) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "points") return b.totalPoints - a.totalPoints;
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "form") return b.form - a.form;
      if (sortBy === "goals") return b.goals - a.goals;
      if (sortBy === "selected") return b.selectedPercent - a.selectedPercent;
      return 0;
    });
  }, [marketPlayers, searchQuery, positionFilter, maxCostFilter, sortBy]);

  // Group filtered players by position
  const groupedPlayers = useMemo(() => {
    return {
      Goalkeepers: filteredPlayers.filter((p) => p.position === "GK"),
      Defenders: filteredPlayers.filter((p) => p.position === "DEF"),
      Midfielders: filteredPlayers.filter((p) => p.position === "MID"),
      Forwards: filteredPlayers.filter((p) => p.position === "FWD"),
    };
  }, [filteredPlayers]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border text-xs font-bold animate-in fade-in slide-in-from-top-3 ${
            toast.type === "success"
              ? "bg-[#00f0ff] text-black border-cyan-300 shadow-cyan-500/20"
              : "bg-rose-500 text-white border-rose-400 shadow-rose-500/20"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* =========================================================================
          TOP NAVIGATION: GAMEWEEK SELECTOR (MATCHES ATTACHED SCREENSHOT)
          ========================================================================= */}
      <MatchweekSelector
        currentWeek={selectedGameweek}
        totalWeeks={10}
        onSelectWeek={(w) => setSelectedGameweek(w)}
        deadlineDate="Sun 08 Nov 17:00"
      />

      {/* =========================================================================
          HERO BANNER: TEAL / EMERALD GRADIENT HEADER CARD
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#00f0ff] via-[#00df89] to-[#00ff85] rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Card: Team Branding & Points Summary */}
          <div className="bg-[#0e0927] border border-[#2b2158] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shrink-0">
                <div className="w-full h-full bg-[#120b33] rounded-[14px] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {isEditingTeamName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="bg-white/10 text-white font-header text-lg font-black px-2 py-0.5 rounded outline-none border border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingTeamName(false)}
                        className="p-1 rounded bg-cyan-400 text-black cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-header text-xl sm:text-2xl font-black text-white tracking-wide truncate">
                        {teamName}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditingTeamName(true)}
                        className="text-gray-400 hover:text-white transition cursor-pointer"
                        title="Edit squad name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 block truncate">
                  {managerName}
                </span>
              </div>
            </div>

            {/* Score Stats Box */}
            <div className="bg-[#08041a] rounded-xl p-3 border border-white/5 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-header text-4xl sm:text-5xl font-black text-white leading-none">
                  {currentTotalPoints}
                </span>
                <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                  Total points
                </span>
              </div>

              <div className="space-y-1 text-right text-[11px] font-mono">
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-400">Global rank</span>
                  <span className="text-white font-bold">-</span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-400">Highest points</span>
                  <span className="text-white font-bold">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Dynamic Gameweek Challenge & Quotas (Admin Controlled) */}
          <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 text-black">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0e0927] block">
                  Gameweek {selectedGameweek} Challenge
                </span>
                {canEditChallengeOrRatings && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditChallengeTitle(challenge.title);
                      setEditChallengeDesc(challenge.description);
                      setEditChallengeBonus(challenge.specialBonus || "");
                      setShowChallengeEditor(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#0e0927] hover:bg-black text-[#00ff85] font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition shadow cursor-pointer"
                    title="Admin: Edit what appears for this gameweek challenge"
                  >
                    <Edit2 className="w-3 h-3 text-[#00ff85]" />
                    <span>Admin Edit Challenge</span>
                  </button>
                )}
              </div>
              <h2 className="font-header text-2xl sm:text-3xl font-black text-[#0e0927] uppercase tracking-wide">
                {challenge.title}
              </h2>
              <p className="text-xs text-[#0e0927]/90 leading-relaxed mt-1 flex items-start gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-[#0e0927] shrink-0 mt-0.5 fill-[#0e0927]" />
                <span>{challenge.description}</span>
              </p>
              {challenge.specialBonus && (
                <div className="mt-1 text-[11px] font-bold text-[#0e0927] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#0e0927]" />
                  <span>Bonus: {challenge.specialBonus}</span>
                </div>
              )}
            </div>

            {/* Selection Status Pill */}
            <div className="bg-emerald-100/80 border border-emerald-300 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-black text-[#0e0927]">
              <span>
                Players selected: <strong>{selectedPlayers.length} / {pitchSlots.length}</strong>
              </span>
              <span>
                Remaining budget: <strong className="font-mono">£{remainingBudget}m</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN INTERFACE: SPLIT LAYOUT (PITCH ON LEFT, PLAYER SELECTION ON RIGHT)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =====================================================================
            LEFT SIDE (LG: 7 COLS): ANGLED SOCCER PITCH & CONTROLS
            ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Angled Perspective Green Pitch Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/40 bg-[#09351e]">
            {/* Top Pitch Signage Board */}
            <div className="bg-[#2a0e44] border-b-2 border-purple-400/30 px-6 py-2.5 flex items-center justify-between text-white font-header text-xs sm:text-sm font-black tracking-wider shadow-inner">
              <span className="flex items-center gap-1.5 text-purple-200">
                <Trophy className="w-4 h-4 text-amber-400" />
                Fantasy Challenge
              </span>
              <span className="flex items-center gap-1.5 text-purple-200">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                Fantasy Challenge
              </span>
            </div>

            {/* Pitch Surface with Real Grass Shading & Field Lines */}
            <div
              className="p-4 sm:p-6 min-h-[580px] sm:min-h-[640px] flex flex-col justify-between relative"
              style={{
                background:
                  "repeating-linear-gradient(0deg, #0b4928, #0b4928 40px, #0f5832 40px, #0f5832 80px)",
              }}
            >
              {/* White Pitch Markings */}
              <div className="absolute inset-x-6 top-0 h-28 border-x-2 border-b-2 border-white/20 rounded-b-xl pointer-events-none" />
              <div className="absolute inset-x-16 top-0 h-14 border-x-2 border-b-2 border-white/20 rounded-b-xl pointer-events-none" />
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40 pointer-events-none" />
              {/* Center Circle / Arc */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-x-2 border-white/20 rounded-t-full pointer-events-none" />

              {/* Rows of Pitch Slots */}
              {[0, 1, 2, 3].map((rowIdx) => {
                const rowSlots = pitchSlots.filter((s) => s.rowIndex === rowIdx);
                if (rowSlots.length === 0) return null;

                return (
                  <div
                    key={rowIdx}
                    className="flex items-center justify-around gap-2 sm:gap-4 relative z-10 py-1"
                  >
                    {rowSlots.map((slot) => {
                      const player = lineup[slot.slotId];
                      const isCaptain = player && player.id === captainId;
                      const isViceCaptain = player && player.id === viceCaptainId;
                      const isTargeted = activeSlotTarget?.slotId === slot.slotId;
                      const opp = player ? getPlayerOpponent(player) : null;

                      if (!player) {
                        // EMPTY SLOT (MATCHES ATTACHED SCREENSHOT)
                        return (
                          <button
                            key={slot.slotId}
                            type="button"
                            onClick={() => {
                              setActiveSlotTarget(slot);
                              setPositionFilter(slot.position);
                              showToast(`Targeting ${slot.label} slot. Click any ${slot.position} in the list to assign!`);
                            }}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer group ${
                              isTargeted
                                ? "bg-cyan-400/25 border-2 border-cyan-400 ring-4 ring-cyan-400/50 scale-105 shadow-lg shadow-cyan-500/30 animate-pulse"
                                : "bg-black/20 hover:bg-black/35 border border-white/20 hover:border-white/40"
                            }`}
                            style={{ minWidth: "90px" }}
                          >
                            <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white mb-1.5 transition">
                              <Plus className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-white border-b border-dotted border-white/60">
                              {slot.label}
                            </span>
                          </button>
                        );
                      }

                      // FILLED SLOT (MATCHES ATTACHED SCREENSHOT)
                      return (
                        <div
                          key={slot.slotId}
                          onClick={() => {
                            setActiveSlotTarget(slot);
                            setPositionFilter(slot.position);
                            showToast(`Targeting ${slot.label} (${player.name}). Click another ${slot.position} to replace!`);
                          }}
                          className={`flex flex-col items-center relative group cursor-pointer transition-all rounded-xl p-1 ${
                            isTargeted
                              ? "bg-cyan-400/25 ring-4 ring-cyan-400 ring-offset-2 ring-offset-[#09351e] shadow-lg shadow-cyan-500/30 scale-105"
                              : "hover:bg-black/20"
                          }`}
                          style={{ minWidth: "95px" }}
                        >
                          {/* Price Tag Pill on Top */}
                          <div className="bg-[#106b3a] border border-emerald-300/40 text-white font-mono text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-t-md shadow-md">
                            £{player.price.toFixed(1)}m
                          </div>

                          {/* Jersey Kit Graphic with Captain Indicator */}
                          <div className="relative my-0.5 cursor-pointer transform group-hover:scale-105 transition">
                            {/* Captain Badge */}
                            {isCaptain && (
                              <div
                                className="absolute -top-1 -left-2 z-20 w-5 h-5 rounded-full bg-amber-400 border border-black text-black font-black text-[9px] flex items-center justify-center shadow-lg"
                                title="Designated Captain (2x points)"
                              >
                                C
                              </div>
                            )}
                            {isViceCaptain && (
                              <div
                                className="absolute -top-1 -left-2 z-20 w-5 h-5 rounded-full bg-cyan-400 border border-black text-black font-black text-[8px] flex items-center justify-center shadow-lg"
                                title="Designated Vice Captain"
                              >
                                VC
                              </div>
                            )}

                            {/* Kit SVG Graphic */}
                            <svg
                              viewBox="0 0 64 64"
                              className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg"
                            >
                              <path
                                d="M16 14 L24 4 L40 4 L48 14 L56 22 L48 30 L44 26 L44 58 L20 58 L20 26 L16 30 L8 22 Z"
                                fill={player.clubColor || "#00ff85"}
                                stroke="#111827"
                                strokeWidth="2"
                              />
                              <path
                                d="M26 4 C28 10, 36 10, 38 4 Z"
                                fill="#ffffff"
                              />
                              <text
                                x="32"
                                y="44"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontWeight="900"
                                fontSize="16"
                                fontFamily="sans-serif"
                              >
                                {player.jerseyNumber}
                              </text>
                            </svg>
                          </div>

                          {/* White Player Name Badge */}
                          <div className="bg-white text-black font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-sm shadow-md w-full text-center truncate max-w-[110px]">
                            {player.name}
                          </div>

                          {/* Fixture Opponent Pill */}
                          {opp && (
                            <div
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-b-md shadow-md text-black mt-0.5 ${
                                opp.difficulty === "easy"
                                  ? "bg-[#00ff85]"
                                  : opp.difficulty === "med"
                                    ? "bg-amber-400"
                                    : "bg-rose-400 text-white"
                              }`}
                            >
                              {opp.badge}
                            </div>
                          )}

                          {/* Quick Action Popover on Hover */}
                          <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center gap-1 bg-black/90 p-1 rounded-xl shadow-xl border border-white/20">
                            <button
                              type="button"
                              onClick={() => setCaptainId(player.id)}
                              className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black hover:brightness-110"
                              title="Make Captain"
                            >
                              (C)
                            </button>
                            <button
                              type="button"
                              onClick={() => setViceCaptainId(player.id)}
                              className="px-1.5 py-0.5 rounded bg-cyan-400 text-black text-[9px] font-black hover:brightness-110"
                              title="Make Vice-Captain"
                            >
                              (VC)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(slot.slotId)}
                              className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-black hover:brightness-110"
                              title="Remove Player"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar Below Pitch (Matches Screenshot) */}
          <div className="bg-[#100a2a] border border-[#2c2058] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            {/* Choose Formation Select */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Choose formation
              </span>
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value as SupportedFormation)}
                className="bg-[#170e3b] border border-white/20 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="4-3-3">4-3-3 (Default)</option>
                <option value="4-4-2">4-4-2</option>
                <option value="3-5-2">3-5-2</option>
                <option value="3-4-3">3-4-3</option>
                <option value="5-3-2">5-3-2</option>
                <option value="5-4-1">5-4-1</option>
                <option value="4-5-1">4-5-1</option>
                <option value="1-1-3">1-1-3 (Challenge Preview)</option>
              </select>
            </div>

            {/* Buttons: Reset, Auto pick, Save team */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleAutoPick}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto pick</span>
              </button>

              <button
                type="button"
                onClick={handleSaveTeam}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save team</span>
              </button>
            </div>
          </div>

          {/* Gameweek Fixtures Deadline Purple Banner (Matches Screenshot) */}
          <div className="bg-[#1e0b38] border border-purple-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl">
            <div>
              <h4 className="font-header text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                Gameweek {selectedGameweek} Fixtures
              </h4>
              <p className="text-xs text-gray-300">
                Final Deadline: <strong className="text-amber-300 font-mono">Sun 08 Nov 17:00</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeadlinesModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow cursor-pointer shrink-0"
            >
              <span>Deadlines explained</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =====================================================================
            RIGHT SIDE (LG: 5 COLS): "PLAYER SELECTION" PANEL
            ===================================================================== */}
        <div className="lg:col-span-5 bg-[#0e0927] border border-[#2b2158] rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 flex flex-col">
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-header text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              Player Selection
            </h3>
            <span className="text-[10px] font-mono text-cyan-300">
              Max 3 per Club
            </span>
          </div>

          {/* Search Input with Magnifier */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for player..."
              className="w-full bg-[#160f38] border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none pr-9 transition"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown Filters Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* View Dropdown */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                View
              </label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full bg-[#160f38] border border-white/10 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400 cursor-pointer text-xs"
              >
                <option value="ALL">All players</option>
                <option value="GK">Goalkeepers</option>
                <option value="DEF">Defenders</option>
                <option value="MID">Midfielders</option>
                <option value="FWD">Forwards</option>
              </select>
            </div>

            {/* Sorted by Dropdown */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                Sorted by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#160f38] border border-white/10 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400 cursor-pointer text-xs"
              >
                <option value="points">Total points</option>
                <option value="price">Price</option>
                <option value="form">Form rating</option>
                <option value="goals">Goals scored</option>
                <option value="selected">Selected %</option>
              </select>
            </div>
          </div>

          {/* Max Cost Filter Slider / Input */}
          <div className="bg-[#140e33] border border-white/5 rounded-xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-gray-300">
              <span className="font-bold">Max cost:</span>
              <span className="font-mono text-cyan-300">Between 4.0 and {maxCostFilter}m</span>
            </div>
            <input
              type="range"
              min="4.5"
              max="15.8"
              step="0.1"
              value={maxCostFilter}
              onChange={(e) => setMaxCostFilter(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Result Count Banner (Purple Bar matching screenshot) */}
          <div className="bg-[#240e3d] text-purple-200 font-bold text-xs py-1.5 px-3 rounded-lg text-center shadow-inner">
            {filteredPlayers.length} players shown
          </div>

          {/* Active Target Slot Helper Banner */}
          {activeSlotTarget && (
            <div className="bg-cyan-500/15 border-2 border-cyan-400 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-lg shadow-cyan-500/15 animate-in fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span className="text-xs font-black text-cyan-300 truncate">
                  Targeting {activeSlotTarget.label} ({activeSlotTarget.position}): Click any player below to assign
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSlotTarget(null)}
                className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Position Sections List */}
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
            {Object.entries(groupedPlayers).map(([positionTitle, players]) => {
              if (players.length === 0) return null;

              return (
                <div key={positionTitle} className="space-y-1.5">
                  <h4 className="font-header text-sm font-black text-white uppercase tracking-wider sticky top-0 bg-[#0e0927] py-1 z-10 border-b border-white/10 flex items-center justify-between">
                    <span>{positionTitle}</span>
                    <span className="text-[10px] font-mono text-gray-400 font-normal">
                      {players.length} available
                    </span>
                  </h4>

                  {/* Table Header */}
                  <div className="grid grid-cols-12 text-[10px] font-bold uppercase text-gray-400 px-2 py-1 border-b border-white/5">
                    <span className="col-span-6">Player</span>
                    <span className="col-span-2 text-center">OPP</span>
                    <span className="col-span-2 text-center">Pts</span>
                    <span className="col-span-2 text-right">Price</span>
                  </div>

                  {/* Player Rows */}
                  <div className="space-y-1">
                    {players.map((p) => {
                      const isSelected = selectedPlayers.some((sp) => sp.id === p.id);
                      const clubCount = selectedPlayers.filter((sp) => sp.clubName === p.clubName).length;
                      const isClubLocked = clubCount >= 3 && !isSelected;
                      const isTargetEligible = Boolean(activeSlotTarget && activeSlotTarget.position === p.position);
                      const opp = getPlayerOpponent(p);

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (activeSlotTarget) {
                              if (activeSlotTarget.position === p.position) {
                                handleAssignToTargetSlot(p, activeSlotTarget);
                              } else {
                                handleAddPlayer(p);
                              }
                            } else if (!isSelected && !isClubLocked) {
                              handleAddPlayer(p);
                            }
                          }}
                          className={`grid grid-cols-12 items-center px-2 py-1.5 rounded-xl border transition-all text-xs cursor-pointer select-none ${
                            isTargetEligible
                              ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10 hover:bg-cyan-500/25"
                              : isSelected
                                ? "bg-emerald-500/10 border-emerald-500/40 text-white hover:bg-emerald-500/15"
                                : isClubLocked
                                  ? "bg-black/20 border-white/5 opacity-40 cursor-not-allowed"
                                  : "bg-black/30 hover:bg-black/50 hover:border-cyan-400/50 border-white/5 text-gray-200"
                          }`}
                        >
                          {/* Col 1-6: Info Icon, Kit Graphic, Name, Club, Position */}
                          <div className="col-span-6 flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectingPlayer(p);
                              }}
                              className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-[10px] font-serif shrink-0 cursor-pointer"
                              title="View full player stats"
                            >
                              i
                            </button>

                            {/* Kit SVG Thumbnail */}
                            <svg viewBox="0 0 64 64" className="w-6 h-6 shrink-0">
                              <path
                                d="M16 14 L24 4 L40 4 L48 14 L56 22 L48 30 L44 26 L44 58 L20 58 L20 26 L16 30 L8 22 Z"
                                fill={p.clubColor || "#00ff85"}
                                stroke="#111827"
                                strokeWidth="2"
                              />
                            </svg>

                            <div className="min-w-0 truncate">
                              <span className="font-black text-white truncate block text-[11px] sm:text-xs">
                                {p.name}
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono uppercase">
                                {p.clubShortCode} • {p.position === "GK" ? "GKP" : p.position}
                              </span>
                            </div>
                          </div>

                          {/* Col 7-8: OPP Badge */}
                          <div className="col-span-2 text-center">
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded text-black ${
                                opp.difficulty === "easy"
                                  ? "bg-[#00ff85]"
                                  : opp.difficulty === "med"
                                    ? "bg-amber-400"
                                    : "bg-rose-400 text-white"
                              }`}
                            >
                              {opp.badge}
                            </span>
                          </div>

                          {/* Col 9-10: Points (Counted After Admin Logs Rating) */}
                          <div className="col-span-2 text-center font-mono font-bold text-white text-xs flex items-center justify-center gap-1">
                            {p.isRatedByAdmin ? (
                              <span className="text-emerald-400 font-black" title="Admin Rated">
                                {p.gameweekPoints}
                              </span>
                            ) : (
                              <span className="text-gray-500 font-bold" title="Points count after admin logs rating">
                                0
                              </span>
                            )}

                            {/* Admin Quick Rate Button */}
                            {canEditChallengeOrRatings && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTargetPlayerForRating(p);
                                  setRatingScoreInput(p.adminRating || 8.0);
                                  setRatingBonusInput(p.adminBonusPoints || 0);
                                  setRatingGoalsInput(p.goals || 0);
                                  setRatingAssistsInput(p.assists || 0);
                                  setRatingCleanSheetInput(p.cleanSheets > 0);
                                  setShowRatingModal(true);
                                }}
                                className="w-3.5 h-3.5 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black flex items-center justify-center transition cursor-pointer"
                                title="Admin: Log matchweek rating & stats"
                              >
                                <Edit2 className="w-2 h-2" />
                              </button>
                            )}
                          </div>

                          {/* Col 11-12: Price & Add/Remove Action */}
                          <div className="col-span-2 flex items-center justify-end gap-1.5">
                            <span className="font-mono text-xs text-gray-300">
                              £{p.price.toFixed(1)}m
                            </span>

                            {isSelected ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const slotEntry = Object.entries(lineup).find(([_, pl]) => pl?.id === p.id);
                                  if (slotEntry) handleRemoveSlot(slotEntry[0]);
                                }}
                                className="w-5 h-5 rounded bg-emerald-500 text-black flex items-center justify-center font-black text-xs cursor-pointer hover:bg-rose-500 hover:text-white transition"
                                title="Click to remove from squad"
                              >
                                ✓
                              </button>
                            ) : isClubLocked ? (
                              <span
                                className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-bold"
                                title="Max 3 players from this club already selected"
                              >
                                Max 3
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeSlotTarget && activeSlotTarget.position === p.position) {
                                    handleAssignToTargetSlot(p, activeSlotTarget);
                                  } else {
                                    handleAddPlayer(p);
                                  }
                                }}
                                className="w-5 h-5 rounded bg-white/10 hover:bg-cyan-400 hover:text-black text-white flex items-center justify-center font-black text-xs transition cursor-pointer"
                                title="Add to lineup"
                              >
                                +
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PLAYER INSPECTION MODAL (When 'i' button is clicked)
          ========================================================================= */}
      {inspectingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100a2f] border border-[#3b2d6e] rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setInspectingPlayer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-black text-sm shadow-md"
                style={{ backgroundColor: inspectingPlayer.clubColor || "#00ff85" }}
              >
                {inspectingPlayer.clubShortCode}
              </div>
              <div>
                <h3 className="font-header text-xl font-black text-white uppercase">
                  {inspectingPlayer.name} (#{inspectingPlayer.jerseyNumber})
                </h3>
                <span className="text-xs text-cyan-300">
                  {inspectingPlayer.clubName} • {inspectingPlayer.position} • £{inspectingPlayer.price}m
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[10px]">Total Points</span>
                <strong className="text-lg font-black text-cyan-400">{inspectingPlayer.totalPoints}</strong>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[10px]">Gameweek Points</span>
                <strong className="text-lg font-black text-emerald-400">{inspectingPlayer.gameweekPoints}</strong>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[10px]">Admin Match Rating</span>
                <strong className="text-lg font-black text-amber-400">{inspectingPlayer.adminRating || 7.5} / 10</strong>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[10px]">Selected By</span>
                <strong className="text-lg font-black text-purple-400">{inspectingPlayer.selectedPercent}%</strong>
              </div>
            </div>

            <div className="space-y-1 text-xs text-gray-300 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span>Goals Scored:</span>
                <strong>{inspectingPlayer.goals}</strong>
              </div>
              <div className="flex justify-between">
                <span>Assists:</span>
                <strong>{inspectingPlayer.assists}</strong>
              </div>
              <div className="flex justify-between">
                <span>Clean Sheets:</span>
                <strong>{inspectingPlayer.cleanSheets}</strong>
              </div>
              <div className="flex justify-between">
                <span>Goalkeeper Saves:</span>
                <strong>{inspectingPlayer.saves}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleAddPlayer(inspectingPlayer);
                setInspectingPlayer(null);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              Add To Starting 11
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          DEADLINES EXPLAINED MODAL
          ========================================================================= */}
      {showDeadlinesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#120a33] border border-purple-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowDeadlinesModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-header text-xl font-black text-white uppercase">
                  Fantasy MSL Deadlines & Rules
                </h3>
                <span className="text-xs text-gray-400">
                  Certified Matchweek Protocol
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">1. Final Lineup Lock</span>
                <p>All squad submissions and captaincy designations lock 90 minutes before Sunday kickoff.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">2. Maximum 3 Players Per Club</span>
                <p>You can field at most 3 players from any single real-world MSL club (e.g. max 3 from Samba, max 3 from Royal Rangers).</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">3. Captain 2x Multiplier</span>
                <p>Your designated Captain earns double points (2x). If your Captain does not participate, Vice-Captain assumes the 2x multiplier.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">4. Official Admin Ratings Integration</span>
                <p>Weekly points combine real on-pitch statistical events (goals, assists, clean sheets, saves) and verified Admin Match Ratings (0–10).</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDeadlinesModal(false)}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN GAMEWEEK CHALLENGE EDITOR MODAL (Weekly Varying Admin Challenge)
          ========================================================================= */}
      {showChallengeEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f0927] border-2 border-cyan-400/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowChallengeEditor(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-header text-xl font-black text-white uppercase">
                  Edit Gameweek {selectedGameweek} Challenge
                </h3>
                <span className="text-xs text-gray-400">
                  What you write here appears dynamically on the Gameweek Challenge card
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
                  Challenge Title
                </label>
                <input
                  type="text"
                  value={editChallengeTitle}
                  onChange={(e) => setEditChallengeTitle(e.target.value)}
                  placeholder="e.g. Spectacular, Clean Sheet Wall, Derby Day"
                  className="w-full bg-[#18103d] border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
                  Challenge Description & Rules
                </label>
                <textarea
                  rows={3}
                  value={editChallengeDesc}
                  onChange={(e) => setEditChallengeDesc(e.target.value)}
                  placeholder="e.g. Your players earn +1 point for every shot on target from outside the penalty area and +5 points for outside goals..."
                  className="w-full bg-[#18103d] border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
                  Special Bonus / Multiplier Notice
                </label>
                <input
                  type="text"
                  value={editChallengeBonus}
                  onChange={(e) => setEditChallengeBonus(e.target.value)}
                  placeholder="e.g. +3 Outside Box Bonus, Double Clean Sheet Pts"
                  className="w-full bg-[#18103d] border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowChallengeEditor(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveGameweekChallenge({
                    gameweek: selectedGameweek,
                    title: editChallengeTitle.trim() || `Gameweek ${selectedGameweek} Challenge`,
                    description:
                      editChallengeDesc.trim() ||
                      `Compete for maximum matchweek points under certified MSL rules. Maximum 3 players per club.`,
                    specialBonus: editChallengeBonus.trim() || "Standard Rules",
                    badgeText: `GW${selectedGameweek}`,
                    updatedBy: managerName || "League Admin",
                  });
                  setShowChallengeEditor(false);
                  showToast(`✓ Gameweek ${selectedGameweek} challenge published!`);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Save & Publish Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN QUICK PLAYER RATING LOGGER MODAL
          ========================================================================= */}
      {showRatingModal && targetPlayerForRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#100a2f] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowRatingModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-xs shadow-md"
                style={{ backgroundColor: targetPlayerForRating.clubColor || "#00ff85" }}
              >
                {targetPlayerForRating.clubShortCode}
              </div>
              <div>
                <h3 className="font-header text-lg font-black text-white uppercase">
                  Log Rating: {targetPlayerForRating.name}
                </h3>
                <span className="text-xs text-amber-300 font-bold">
                  Gameweek {selectedGameweek} Official Performance
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
                    Match Rating (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={ratingScoreInput}
                    onChange={(e) => setRatingScoreInput(Number(e.target.value))}
                    className="w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
                    Bonus Points (0 - 5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={ratingBonusInput}
                    onChange={(e) => setRatingBonusInput(Number(e.target.value))}
                    className="w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
                    Goals Scored
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={ratingGoalsInput}
                    onChange={(e) => setRatingGoalsInput(Number(e.target.value))}
                    className="w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-300 mb-1">
                    Assists Logged
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={ratingAssistsInput}
                    onChange={(e) => setRatingAssistsInput(Number(e.target.value))}
                    className="w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ratingCleanSheetInput}
                  onChange={(e) => setRatingCleanSheetInput(e.target.checked)}
                  className="rounded text-amber-400 focus:ring-0 w-4 h-4"
                />
                <span className="text-gray-200 font-bold">
                  Clean Sheet Recorded (Played 60+ mins without conceding)
                </span>
              </label>

              <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-200">
                Points will calculate and count immediately for Gameweek {selectedGameweek} fantasy managers!
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveAdminPlayerRating({
                    playerId: targetPlayerForRating.id,
                    playerName: targetPlayerForRating.name,
                    clubName: targetPlayerForRating.clubName,
                    position: targetPlayerForRating.position,
                    matchRating: Number(ratingScoreInput),
                    bonusPoints: Number(ratingBonusInput),
                    matchweek: selectedGameweek,
                    goalsScored: Number(ratingGoalsInput),
                    assistsLogged: Number(ratingAssistsInput),
                    cleanSheetLogged: Boolean(ratingCleanSheetInput),
                    ratedByAdmin: managerName || "Super Admin",
                    updatedAt: new Date().toISOString(),
                  });
                  setShowRatingModal(false);
                  showToast(
                    `✓ Logged rating for ${targetPlayerForRating.name} (GW${selectedGameweek})! Points calculated.`,
                  );
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                Certify & Save Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
