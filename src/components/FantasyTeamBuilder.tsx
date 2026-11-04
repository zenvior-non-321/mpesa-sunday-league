import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Shield,
  Users,
  Coins,
  Sparkles,
  Zap,
  ArrowRightLeft,
  Crown,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  X,
  Plus,
  RefreshCw,
  Award,
  SlidersHorizontal,
  Flame,
  Info,
  Trash2,
  Edit3,
  Check,
  ChevronRight,
  TrendingUp,
  Lock,
  Calendar,
} from "lucide-react";
import {
  type FantasyPlayer,
  type FantasyChipType,
  type FantasyChipStatus,
  type FantasyTeamState,
  type MiniLeague,
  type MiniLeagueEntry,
  type AdminPlayerRating,
  generateFantasyMarket,
  validateFormation,
  checkClubLimit,
  calculatePlayerFantasyPoints,
  getDefaultFantasySquad,
  getAdminPlayerRatings,
  saveAdminPlayerRating,
  getGameweekLeaderboard,
  getOverallSeasonLeaderboard,
  DEFAULT_CHIPS,
  DEFAULT_PUBLIC_LEAGUE_ENTRIES,
} from "../lib/fantasyEngine";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { JoinMiniLeagueModal } from "./JoinMiniLeagueModal";
import { FantasyTeamSelection } from "./FantasyTeamSelection";
import { MyFantasySquad } from "./MyFantasySquad";

const STORAGE_KEY = "fantasy_msl_squad_v3";
const MINI_LEAGUES_STORAGE_KEY = "fantasy_msl_minileagues_real_v3";

// 15 Squad Slot Identifiers: 11 Pitch Grid Slots + 4 Bench Grid Slots
export type SquadSlotId =
  | "pitch_gk_1"
  | "pitch_def_1"
  | "pitch_def_2"
  | "pitch_def_3"
  | "pitch_def_4"
  | "pitch_def_5"
  | "pitch_mid_1"
  | "pitch_mid_2"
  | "pitch_mid_3"
  | "pitch_mid_4"
  | "pitch_mid_5"
  | "pitch_fwd_1"
  | "pitch_fwd_2"
  | "pitch_fwd_3"
  | "bench_gk_sub"
  | "bench_sub_1"
  | "bench_sub_2"
  | "bench_sub_3";

export interface SquadSlotDef {
  slotId: SquadSlotId;
  position: "GK" | "DEF" | "MID" | "FWD";
  label: string;
  isStarter: boolean;
  benchIndex?: number;
}

export const SQUAD_SLOT_DEFINITIONS: SquadSlotDef[] = [
  // Starting Pitch Slots (11)
  { slotId: "pitch_gk_1", position: "GK", label: "Goalkeeper", isStarter: true },
  { slotId: "pitch_def_1", position: "DEF", label: "Def 1", isStarter: true },
  { slotId: "pitch_def_2", position: "DEF", label: "Def 2", isStarter: true },
  { slotId: "pitch_def_3", position: "DEF", label: "Def 3", isStarter: true },
  { slotId: "pitch_def_4", position: "DEF", label: "Def 4", isStarter: true },
  { slotId: "pitch_def_5", position: "DEF", label: "Def 5", isStarter: true },
  { slotId: "pitch_mid_1", position: "MID", label: "Mid 1", isStarter: true },
  { slotId: "pitch_mid_2", position: "MID", label: "Mid 2", isStarter: true },
  { slotId: "pitch_mid_3", position: "MID", label: "Mid 3", isStarter: true },
  { slotId: "pitch_mid_4", position: "MID", label: "Mid 4", isStarter: true },
  { slotId: "pitch_mid_5", position: "MID", label: "Mid 5", isStarter: true },
  { slotId: "pitch_fwd_1", position: "FWD", label: "Fwd 1", isStarter: true },
  { slotId: "pitch_fwd_2", position: "FWD", label: "Fwd 2", isStarter: true },
  { slotId: "pitch_fwd_3", position: "FWD", label: "Fwd 3", isStarter: true },
  // Bench Slots (4)
  { slotId: "bench_gk_sub", position: "GK", label: "GK Sub", isStarter: false, benchIndex: 0 },
  { slotId: "bench_sub_1", position: "DEF", label: "Sub 1", isStarter: false, benchIndex: 1 },
  { slotId: "bench_sub_2", position: "MID", label: "Sub 2", isStarter: false, benchIndex: 2 },
  { slotId: "bench_sub_3", position: "FWD", label: "Sub 3", isStarter: false, benchIndex: 3 },
];

export function FantasyTeamBuilder() {
  // Admin player ratings state
  const [adminRatingsMap, setAdminRatingsMap] = useState<Record<number, AdminPlayerRating>>(() =>
    getAdminPlayerRatings()
  );

  // Sync ratings on global custom event
  useEffect(() => {
    const handleRatingsUpdate = () => {
      setAdminRatingsMap(getAdminPlayerRatings());
    };
    window.addEventListener("mpesa_fantasy_ratings_updated", handleRatingsUpdate);
    window.addEventListener("storage", handleRatingsUpdate);
    return () => {
      window.removeEventListener("mpesa_fantasy_ratings_updated", handleRatingsUpdate);
      window.removeEventListener("storage", handleRatingsUpdate);
    };
  }, []);

  // Market players dynamically generated and priced strictly below 10M, powered by admin ratings
  const marketPlayers = useMemo(() => {
    return generateFantasyMarket(adminRatingsMap);
  }, [adminRatingsMap]);

  // Squad mapping state: SlotId -> FantasyPlayer | null
  const [slotAssignments, setSlotAssignments] = useState<Record<SquadSlotId, FantasyPlayer | null>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.slotAssignments === "object") {
            return parsed.slotAssignments;
          }
        }
      } catch (e) {
        console.error("Failed to load saved fantasy squad slots", e);
      }
    }
    // Default initial populated squad
    const initialMarket = generateFantasyMarket();
    const defaultList = getDefaultFantasySquad(initialMarket, 2);
    const initialMap: Partial<Record<SquadSlotId, FantasyPlayer | null>> = {};
    SQUAD_SLOT_DEFINITIONS.forEach((slot) => {
      initialMap[slot.slotId] = null;
    });

    // Populate initial default slots
    const gks = defaultList.filter((p) => p.position === "GK");
    const defs = defaultList.filter((p) => p.position === "DEF");
    const mids = defaultList.filter((p) => p.position === "MID");
    const fwds = defaultList.filter((p) => p.position === "FWD");

    if (gks[0]) initialMap["pitch_gk_1"] = { ...gks[0], isStarter: true };
    if (gks[1]) initialMap["bench_gk_sub"] = { ...gks[1], isStarter: false, benchIndex: 0 };

    defs.slice(0, 4).forEach((d, idx) => {
      initialMap[`pitch_def_${idx + 1}` as SquadSlotId] = { ...d, isStarter: true };
    });
    if (defs[4]) initialMap["bench_sub_1"] = { ...defs[4], isStarter: false, benchIndex: 1 };

    mids.slice(0, 4).forEach((m, idx) => {
      initialMap[`pitch_mid_${idx + 1}` as SquadSlotId] = { ...m, isStarter: true };
    });
    if (mids[4]) initialMap["bench_sub_2"] = { ...mids[4], isStarter: false, benchIndex: 2 };

    fwds.slice(0, 2).forEach((f, idx) => {
      initialMap[`pitch_fwd_${idx + 1}` as SquadSlotId] = { ...f, isStarter: true };
    });
    if (fwds[2]) initialMap["bench_sub_3"] = { ...fwds[2], isStarter: false, benchIndex: 3 };

    return initialMap as Record<SquadSlotId, FantasyPlayer | null>;
  });

  // Captain & Vice Captain
  const [captainId, setCaptainId] = useState<number | null>(() => {
    return 9; // Default to Wokabi or first available
  });
  const [viceCaptainId, setViceCaptainId] = useState<number | null>(() => {
    return 10; // Default to Jaycrack
  });

  // Chips
  const [activeChip, setActiveChip] = useState<FantasyChipType | null>(null);
  const [chipsState, setChipsState] = useState<Record<FantasyChipType, FantasyChipStatus>>({
    ...DEFAULT_CHIPS,
  });

  // Active Tab: "selection" | "my_squad" | "pitch" | "market" | "ratings" | "leagues" | "rules"
  const [activeTab, setActiveTab] = useState<
    "selection" | "my_squad" | "pitch" | "market" | "ratings" | "leagues" | "rules"
  >("selection");

  // Slot Selector Modal (When user clicks a slot to add/change a player)
  const [selectedSlotForPicker, setSelectedSlotForPicker] = useState<SquadSlotDef | null>(null);
  const [pickerSearch, setPickerSearch] = useState<string>("");
  const [pickerClubFilter, setPickerClubFilter] = useState<string>("ALL");

  // Inspecting Player Breakdown Modal
  const [inspectingPlayer, setInspectingPlayer] = useState<FantasyPlayer | null>(null);

  // Role Access Control: Public viewers cannot update ratings!
  const { currentRole, isSuperAdmin } = useRoleAccess();
  const canEditRatings = useMemo(() => {
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

  // Matchweek & Lineup Registration System
  const [selectedMatchweek, setSelectedMatchweek] = useState<number>(5);
  const [lockedMatchweeks, setLockedMatchweeks] = useState<Record<number, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("mpesa_fantasy_locked_weeks");
        if (raw) return JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    return { 1: true, 2: true, 3: true, 4: true, 5: false };
  });

  // Leaderboard View Mode: Gameweek Specific vs. Overall Cumulative (Sum of All Weeks)
  const [leaderboardViewMode, setLeaderboardViewMode] = useState<"gameweek" | "overall">("overall");

  // Admin Rating Editor Modal
  const [adminRatingTargetPlayer, setAdminRatingTargetPlayer] = useState<FantasyPlayer | null>(null);
  const [adminScoreInput, setAdminScoreInput] = useState<number>(8.0);
  const [adminBonusInput, setAdminBonusInput] = useState<number>(0);
  const [adminNotesInput, setAdminNotesInput] = useState<string>("");

  // Real Mini-Leagues State
  const [realLeagues, setRealLeagues] = useState<MiniLeague[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(MINI_LEAGUES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [
      DEFAULT_PUBLIC_LEAGUE_ENTRIES,
      {
        id: "acacia-dorm-cup",
        name: "Acacia Dormitory Championship",
        code: "ACA-101",
        type: "classic",
        creator: "Levis Wanyama",
        createdAt: "2026-09-05",
        membersCount: 4,
        entries: [
          {
            rank: 1,
            managerName: "Levis Wanyama",
            teamName: "Royal Ranger Elite",
            gameweekPoints: 61,
            totalPoints: 238,
            gameweekScores: { 1: 45, 2: 46, 3: 44, 4: 42, 5: 61 },
          },
          {
            rank: 2,
            managerName: "You (Your Squad)",
            teamName: "M-Pesa Academy XI",
            gameweekPoints: 59,
            totalPoints: 231,
            gameweekScores: { 1: 42, 2: 43, 3: 45, 4: 42, 5: 59 },
          },
          {
            rank: 3,
            managerName: "Bidan Mwaura",
            teamName: "Mara Strikers",
            gameweekPoints: 47,
            totalPoints: 209,
            gameweekScores: { 1: 41, 2: 39, 3: 40, 4: 42, 5: 47 },
          },
          {
            rank: 4,
            managerName: "Alex Haro",
            teamName: "Acacia Lions",
            gameweekPoints: 38,
            totalPoints: 185,
            gameweekScores: { 1: 36, 2: 37, 3: 36, 4: 38, 5: 38 },
          },
        ],
      },
    ];
  });

  // Mini-League create/join modals
  const [showCreateLeagueModal, setShowCreateLeagueModal] = useState<boolean>(false);
  const [showJoinLeagueModal, setShowJoinLeagueModal] = useState<boolean>(false);
  const [newLeagueName, setNewLeagueName] = useState<string>("");
  const [newLeagueType, setNewLeagueType] = useState<"classic" | "head_to_head">("classic");
  const [joinLeagueCodeInput, setJoinLeagueCodeInput] = useState<string>("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Derive Current Squad List (all non-null slots)
  const currentSquadList = useMemo(() => {
    const list: FantasyPlayer[] = [];
    Object.entries(slotAssignments).forEach(([slotId, player]) => {
      if (player) {
        const def = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === slotId);
        list.push({
          ...player,
          isStarter: def ? def.isStarter : true,
          benchIndex: def ? def.benchIndex : undefined,
          isCaptain: player.id === captainId,
          isViceCaptain: player.id === viceCaptainId,
        });
      }
    });
    return list;
  }, [slotAssignments, captainId, viceCaptainId]);

  // Derive Starters List (only pitch slots)
  const starters = useMemo(() => {
    return currentSquadList.filter((p) => p.isStarter);
  }, [currentSquadList]);

  // Derive Bench List
  const bench = useMemo(() => {
    return currentSquadList.filter((p) => !p.isStarter);
  }, [currentSquadList]);

  // Derive Financials (Total Budget £100.0m)
  const currentSquadValue = useMemo(() => {
    const sum = currentSquadList.reduce((acc, p) => acc + p.price, 0);
    return Number(sum.toFixed(1));
  }, [currentSquadList]);

  const bankRemaining = useMemo(() => {
    return Number((100.0 - currentSquadValue).toFixed(1));
  }, [currentSquadValue]);

  // ENFORCE 3-PLAYER-PER-CLUB LIMIT in component state
  const clubCompliance = useMemo(() => {
    return checkClubLimit(currentSquadList, 3);
  }, [currentSquadList]);

  // FORMATION VALIDATION LOGIC BLOCK (Monitors lineup and identifies invalid formations)
  const formationStatus = useMemo(() => {
    return validateFormation(starters);
  }, [starters]);

  // Check specific row minimums for targeted red highlighting on pitch grid
  const gkCount = starters.filter((p) => p.position === "GK").length;
  const defCount = starters.filter((p) => p.position === "DEF").length;
  const midCount = starters.filter((p) => p.position === "MID").length;
  const fwdCount = starters.filter((p) => p.position === "FWD").length;

  const isGkInvalid = gkCount !== 1;
  const isDefInvalid = defCount < 3 || defCount > 5;
  const isMidInvalid = midCount < 2 || midCount > 5;
  const isFwdInvalid = fwdCount < 1 || fwdCount > 3;

  // Persist squad state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          slotAssignments,
          captainId,
          viceCaptainId,
          activeChip,
        })
      );
    } catch {
      // ignore
    }
  }, [slotAssignments, captainId, viceCaptainId, activeChip]);

  useEffect(() => {
    try {
      localStorage.setItem(MINI_LEAGUES_STORAGE_KEY, JSON.stringify(realLeagues));
    } catch {
      // ignore
    }
  }, [realLeagues]);

  // Lock In Gameweek Lineup: Every matchweek users must confirm & lock their 15 squad players
  const handleLockGameweekLineup = () => {
    if (!formationStatus.isValid) {
      showToast(`⚠ Cannot lock lineup: ${formationStatus.errorMessage || "Invalid formation"}`);
      return;
    }
    if (!clubCompliance.isCompliant) {
      showToast(`⚠ Cannot lock lineup: Exceeds 3 players per club (${clubCompliance.violatedClubs.join(", ")})`);
      return;
    }
    if (currentSquadList.length !== 15) {
      showToast(`⚠ Lineup incomplete: ${currentSquadList.length}/15 squad members selected.`);
      return;
    }
    setLockedMatchweeks((prev) => {
      const updated = { ...prev, [selectedMatchweek]: true };
      try {
        localStorage.setItem("mpesa_fantasy_locked_weeks", JSON.stringify(updated));
        // Save copy of this specific week's squad
        localStorage.setItem(`mpesa_fantasy_squad_gw_${selectedMatchweek}`, JSON.stringify(slotAssignments));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(`✓ Matchweek ${selectedMatchweek} Lineup Officially Locked & Registered for Scoring!`);
  };

  // Clear Entire Team to start from a blank tactical grid
  const handleClearTeam = () => {
    const emptyMap: Partial<Record<SquadSlotId, FantasyPlayer | null>> = {};
    SQUAD_SLOT_DEFINITIONS.forEach((slot) => {
      emptyMap[slot.slotId] = null;
    });
    setSlotAssignments(emptyMap as Record<SquadSlotId, FantasyPlayer | null>);
    setCaptainId(null);
    setViceCaptainId(null);
    showToast("✓ Squad cleared. Click any slot on the pitch grid to draft your players!");
  };

  // Auto-Fill 15-player squad within £100m and 3-player-per-club rule
  const handleAutoFillTeam = () => {
    const defaultList = getDefaultFantasySquad(marketPlayers, 3);
    const newMap: Partial<Record<SquadSlotId, FantasyPlayer | null>> = {};
    SQUAD_SLOT_DEFINITIONS.forEach((slot) => {
      newMap[slot.slotId] = null;
    });

    const gks = defaultList.filter((p) => p.position === "GK");
    const defs = defaultList.filter((p) => p.position === "DEF");
    const mids = defaultList.filter((p) => p.position === "MID");
    const fwds = defaultList.filter((p) => p.position === "FWD");

    if (gks[0]) newMap["pitch_gk_1"] = { ...gks[0], isStarter: true };
    if (gks[1]) newMap["bench_gk_sub"] = { ...gks[1], isStarter: false, benchIndex: 0 };

    defs.slice(0, 4).forEach((d, idx) => {
      newMap[`pitch_def_${idx + 1}` as SquadSlotId] = { ...d, isStarter: true };
    });
    if (defs[4]) newMap["bench_sub_1"] = { ...defs[4], isStarter: false, benchIndex: 1 };

    mids.slice(0, 4).forEach((m, idx) => {
      newMap[`pitch_mid_${idx + 1}` as SquadSlotId] = { ...m, isStarter: true };
    });
    if (mids[4]) newMap["bench_sub_2"] = { ...mids[4], isStarter: false, benchIndex: 2 };

    fwds.slice(0, 2).forEach((f, idx) => {
      newMap[`pitch_fwd_${idx + 1}` as SquadSlotId] = { ...f, isStarter: true };
    });
    if (fwds[2]) newMap["bench_sub_3"] = { ...fwds[2], isStarter: false, benchIndex: 3 };

    setSlotAssignments(newMap as Record<SquadSlotId, FantasyPlayer | null>);
    const firstStarter = defaultList.find((p) => p.isStarter);
    const secondStarter = defaultList.filter((p) => p.isStarter)[1];
    setCaptainId(firstStarter ? firstStarter.id : null);
    setViceCaptainId(secondStarter ? secondStarter.id : null);
    showToast("✓ Recommended 15-player balanced squad loaded within £100m budget and 3-players/club rule.");
  };

  // Remove player from a specific slot
  const handleRemoveSlot = (slotId: SquadSlotId, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const removedPlayer = slotAssignments[slotId];
    if (!removedPlayer) return;

    setSlotAssignments((prev) => ({
      ...prev,
      [slotId]: null,
    }));

    if (captainId === removedPlayer.id) setCaptainId(null);
    if (viceCaptainId === removedPlayer.id) setViceCaptainId(null);

    showToast(`Removed ${removedPlayer.name} from slot.`);
  };

  // Select Player from Picker into Current Active Slot
  const handleSelectPlayerForSlot = (player: FantasyPlayer) => {
    if (!selectedSlotForPicker) return;
    const targetSlotId = selectedSlotForPicker.slotId;
    const existingPlayerInSlot = slotAssignments[targetSlotId];

    // Check if player is already assigned elsewhere in the squad
    const alreadyAssignedSlot = (Object.keys(slotAssignments) as SquadSlotId[]).find(
      (sId) => sId !== targetSlotId && slotAssignments[sId]?.id === player.id
    );
    if (alreadyAssignedSlot) {
      showToast(`⚠ ${player.name} is already in your squad!`);
      return;
    }

    // Check budget
    const priceDelta = player.price - (existingPlayerInSlot ? existingPlayerInSlot.price : 0);
    if (bankRemaining - priceDelta < 0) {
      showToast(`⚠ Insufficient budget! Need £${(priceDelta - bankRemaining).toFixed(1)}m more.`);
      return;
    }

    // Check 3-player-per-club limit
    const tentativeSquad = currentSquadList
      .filter((p) => !existingPlayerInSlot || p.id !== existingPlayerInSlot.id)
      .concat({
        ...player,
        isStarter: selectedSlotForPicker.isStarter,
        benchIndex: selectedSlotForPicker.benchIndex,
      });

    const compliance = checkClubLimit(tentativeSquad, 3);
    if (!compliance.isCompliant) {
      showToast(`⚠ Club limit exceeded: Maximum 3 players permitted from ${compliance.violatedClubs.join(", ")}.`);
      return;
    }

    // Place player in slot
    setSlotAssignments((prev) => ({
      ...prev,
      [targetSlotId]: {
        ...player,
        isStarter: selectedSlotForPicker.isStarter,
        benchIndex: selectedSlotForPicker.benchIndex,
      },
    }));

    // Auto assign captain if none
    if (!captainId && selectedSlotForPicker.isStarter) {
      setCaptainId(player.id);
    }

    setSelectedSlotForPicker(null);
    showToast(`✓ Added ${player.name} (${player.clubShortCode}) to ${selectedSlotForPicker.label}!`);
  };

  // Open Admin Rating Editor (Blocked for public viewers)
  const handleOpenRatingEditor = (player: FantasyPlayer) => {
    if (!canEditRatings) {
      showToast("🔒 Official Ratings are certified by the MSL Board. Viewers have read-only access.");
      return;
    }
    setAdminRatingTargetPlayer(player);
    setAdminScoreInput(player.adminRating || 7.5);
    setAdminBonusInput(player.adminBonusPoints || 0);
    setAdminNotesInput("");
  };

  // Save Admin Rating (Guarded: Admin only)
  const handleSaveAdminRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditRatings) {
      showToast("🔒 Permission Denied: Viewers cannot update official player ratings.");
      setAdminRatingTargetPlayer(null);
      return;
    }
    if (!adminRatingTargetPlayer) return;

    const newRatingRecord: AdminPlayerRating = {
      playerId: adminRatingTargetPlayer.id,
      playerName: adminRatingTargetPlayer.name,
      clubName: adminRatingTargetPlayer.clubName,
      position: adminRatingTargetPlayer.position,
      matchRating: Number(adminScoreInput.toFixed(1)),
      bonusPoints: Number(adminBonusInput),
      matchweek: selectedMatchweek,
      notes: adminNotesInput.trim() || "Official Admin Match Performance Rating",
      ratedByAdmin: "MSL Chief Match Commissioner",
      updatedAt: new Date().toISOString(),
    };

    saveAdminPlayerRating(newRatingRecord);
    setAdminRatingsMap(getAdminPlayerRatings());
    setAdminRatingTargetPlayer(null);
    showToast(`✓ Saved official rating for ${newRatingRecord.playerName}: ${newRatingRecord.matchRating} / 10 ⭐ (${newRatingRecord.bonusPoints} bonus pts)`);
  };

  // Create Mini League
  const handleCreateMiniLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) return;
    const randomCode = `MSL-${Math.floor(100 + Math.random() * 900)}`;
    const newLeague: MiniLeague = {
      id: `real-league-${Date.now()}`,
      name: newLeagueName.trim(),
      code: randomCode,
      type: newLeagueType,
      creator: "Academy Manager",
      createdAt: new Date().toISOString().split("T")[0],
      membersCount: 1,
      entries: [
        {
          rank: 1,
          managerName: "You (Your Squad)",
          teamName: "M-Pesa Academy XI",
          gameweekPoints: 59,
          totalPoints: 231,
          gameweekScores: {},
        },
      ],
    };

    setRealLeagues((prev) => [...prev, newLeague]);
    setNewLeagueName("");
    setShowCreateLeagueModal(false);
    showToast(`✓ Created Mini-League "${newLeague.name}"! Share code [${newLeague.code}] with friends.`);
  };

  // Join Mini League
  const handleJoinMiniLeague = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinLeagueCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    const targetLeague = realLeagues.find((l) => l.code.toUpperCase() === cleanCode);
    if (!targetLeague) {
      showToast(`⚠ League code [${cleanCode}] not found. Please verify the code.`);
      return;
    }

    if (targetLeague.entries.some((entry) => entry.managerName.includes("You"))) {
      showToast(`⚠ You are already registered in ${targetLeague.name}!`);
      return;
    }

    const updated = realLeagues.map((l) => {
      if (l.id === targetLeague.id) {
        const newEntries = [
          ...l.entries,
          {
            rank: l.entries.length + 1,
            managerName: "You (Your Squad)",
            teamName: "M-Pesa Academy XI",
            gameweekPoints: 59,
            totalPoints: 231,
            gameweekScores: {},
          },
        ].sort((a, b) => b.totalPoints - a.totalPoints);

        return {
          ...l,
          membersCount: l.membersCount + 1,
          entries: newEntries.map((item, idx) => ({ ...item, rank: idx + 1 })),
        };
      }
      return l;
    });

    setRealLeagues(updated);
    setJoinLeagueCodeInput("");
    setShowJoinLeagueModal(false);
    showToast(`✓ Successfully joined "${targetLeague.name}"!`);
  };

  // Filter candidate players when Picker Modal is open
  const pickerCandidates = useMemo(() => {
    if (!selectedSlotForPicker) return [];
    return marketPlayers
      .filter((p) => {
        // Enforce slot position
        if (p.position !== selectedSlotForPicker.position) return false;
        // Filter by club if set
        if (pickerClubFilter !== "ALL" && p.clubName !== pickerClubFilter) return false;
        // Search query
        if (pickerSearch.trim()) {
          const q = pickerSearch.toLowerCase();
          return p.name.toLowerCase().includes(q) || p.clubName.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => (b.adminRating || 0) - (a.adminRating || 0) || b.totalPoints - a.totalPoints);
  }, [marketPlayers, selectedSlotForPicker, pickerClubFilter, pickerSearch]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a1020] border-2 border-[#00ff85] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#00ff85] shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: FANTASY MSL CHAMPIONSHIP */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1527] via-[#101b38] to-[#0d1527] border border-cyan-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-[#00ff85]/20 text-[#00ff85] border border-[#00ff85]/40 rounded-full flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                Matchweek {selectedMatchweek} Active
              </span>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/30 rounded-full">
                Virtual £100.0m Budget
              </span>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                Strict Max 3 / Club Rule
              </span>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                Points Driven by Admin Match Ratings
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#00ff85]" />
              Fantasy MSL Football
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              Build your 15-player squad on the tactical pitch grid. Select and lock in your fantasy lineup every matchweek within £100M budget and 3-player-per-club rule.
            </p>
          </div>

          {/* Quick Actions & Budget Card */}
          <div className="bg-[#080d1a]/90 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-4 sm:gap-6 backdrop-blur-md">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Remaining Bank</p>
              <p className={`text-2xl font-black ${bankRemaining < 0 ? "text-red-400" : "text-[#00ff85]"}`}>
                £{bankRemaining.toFixed(1)}m
              </p>
              <p className="text-[11px] text-slate-400">Total: £100.0m</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Squad Value</p>
              <p className="text-2xl font-black text-white">£{currentSquadValue.toFixed(1)}m</p>
              <p className="text-[11px] text-cyan-400">{currentSquadList.length}/15 Selected</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleClearTeam}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Clear all 15 squad slots to start from scratch"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Team
              </button>
              <button
                onClick={handleAutoFillTeam}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Auto-fill recommended balanced squad"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Auto-Fill 15
              </button>
            </div>
          </div>
        </div>

        {/* MATCHWEEK SELECTION & LINEUP LOCKING BAR */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Gameweek:
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((gw) => (
                <button
                  key={gw}
                  type="button"
                  onClick={() => {
                    setSelectedMatchweek(gw);
                    showToast(`Switched view to Matchweek ${gw}`);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                    selectedMatchweek === gw
                      ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                      : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  <span>GW {gw}</span>
                  {lockedMatchweeks[gw] && <Lock className="w-3 h-3 text-slate-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lockedMatchweeks[selectedMatchweek] ? (
              <span className="px-3.5 py-1.5 rounded-xl bg-[#00ff85]/20 text-[#00ff85] border border-[#00ff85]/40 text-xs font-black flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                Matchweek {selectedMatchweek} Lineup Locked & Certified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleLockGameweekLineup}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00ff85] to-emerald-400 hover:brightness-110 text-slate-950 text-xs font-black transition shadow-lg shadow-[#00ff85]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                Confirm & Lock Matchweek {selectedMatchweek} Lineup
              </button>
            )}
          </div>
        </div>

        {/* 3-PLAYERS-PER-CLUB ENFORCEMENT COUNTER BAR */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Shield className="w-4 h-4 text-[#00f0ff]" />
            <span>Strict Club Quota (Max 3 Players per Club):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {["Samba", "Royal Rangers", "Young Stars City", "Mzinga Boyz"].map((club) => {
              const count = clubCompliance.clubCounts[club] || 0;
              const isFull = count === 3;
              const isOver = count > 3;
              return (
                <span
                  key={club}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 border transition ${
                    isOver
                      ? "bg-red-500/30 text-red-200 border-red-500 shadow-md shadow-red-500/30 animate-pulse"
                      : isFull
                      ? "bg-[#00ff85]/20 text-[#00ff85] border-[#00ff85]/40 font-black"
                      : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                >
                  <span>{club}:</span>
                  <span className={isOver ? "text-red-400 font-black text-sm" : isFull ? "text-[#00ff85] font-black" : "text-white"}>
                    {count}/3 {isOver ? "(Limit Exceeded!)" : isFull ? "(Max 3)" : ""}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2 bg-[#0d1527] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab("selection")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "selection"
                ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-400/25"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            11-Player Pitch Selection
          </button>
          <button
            onClick={() => setActiveTab("my_squad")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "my_squad"
                ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Shield className="w-4 h-4 text-cyan-300" />
            My Fantasy Squad
          </button>
          <button
            onClick={() => setActiveTab("pitch")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "pitch"
                ? "bg-[#00ff85] text-slate-950 shadow-md shadow-[#00ff85]/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            15-Squad Roster (11 + 4)
          </button>
          <button
            onClick={() => setActiveTab("ratings")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "ratings"
                ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Star className="w-4 h-4 text-amber-300" />
            Admin Match Ratings Desk
          </button>
          <button
            onClick={() => setActiveTab("leagues")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "leagues"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Real Mini-Leagues
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "rules"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Info className="w-4 h-4" />
            Scoring Rules Matrix
          </button>
        </div>

        <div className="flex items-center gap-2">
          {formationStatus.isValid ? (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-[#00ff85] border border-emerald-500/40 text-xs font-black flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              Valid Formation: {formationStatus.formationName}
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 border-2 border-red-500 text-xs font-black flex items-center gap-1.5 animate-pulse shadow-md shadow-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400" />
              Invalid Formation ({starters.length}/11 Starters)
            </span>
          )}
        </div>
      </div>

      {/* FORMATION VALIDATION LOGIC BLOCK (HIGHLIGHTS IN RED ANY VIOLATIONS) */}
      {!formationStatus.isValid && (
        <div className="bg-red-950/80 border-2 border-red-500/90 rounded-2xl p-4 shadow-xl shadow-red-500/20 text-red-100 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 animate-bounce" />
            <h3 className="text-sm font-black uppercase tracking-wider text-red-300">
              Formation Validation Alert: Formation Does Not Meet Official League Requirements
            </h3>
          </div>
          <p className="text-xs text-red-200 pl-8 leading-relaxed">
            {formationStatus.errorMessage || "Lineup incomplete or fails minimum tactical balance rules."}
          </p>
          <div className="pl-8 flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
            <span className={`px-2 py-0.5 rounded border ${isGkInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
              GK: {gkCount}/1 {isGkInvalid ? "(Requires exactly 1 GK)" : "✓"}
            </span>
            <span className={`px-2 py-0.5 rounded border ${isDefInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
              DEF: {defCount}/5 {defCount < 3 ? "(Needs at least 3 Defenders)" : defCount > 5 ? "(Max 5 Defenders)" : "✓"}
            </span>
            <span className={`px-2 py-0.5 rounded border ${isMidInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
              MID: {midCount}/5 {midCount < 2 ? "(Needs at least 2 Midfielders)" : midCount > 5 ? "(Max 5 Midfielders)" : "✓"}
            </span>
            <span className={`px-2 py-0.5 rounded border ${isFwdInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
              FWD: {fwdCount}/3 {fwdCount < 1 ? "(Needs at least 1 Forward)" : fwdCount > 3 ? "(Max 3 Forwards)" : "✓"}
            </span>
          </div>
        </div>
      )}

      {/* CLUB LIMIT VIOLATION ALERT BLOCK */}
      {!clubCompliance.isCompliant && (
        <div className="bg-red-950/80 border-2 border-red-500 rounded-2xl p-4 shadow-xl text-red-100 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-red-300">Club Limit Rule Violation: </span>
            A maximum of 2 players is permitted from any single club. Overloaded clubs:{" "}
            <strong>{clubCompliance.violatedClubs.join(", ")}</strong>. Please remove surplus players to comply with the 2-player rule.
          </div>
        </div>
      )}

      {/* ========================================================
          TAB: 11-PLAYER PITCH SELECTION (MATCHES ATTACHED SCREENSHOTS)
          ======================================================== */}
      {activeTab === "selection" && (
        <FantasyTeamSelection
          initialGameweek={selectedMatchweek}
          onSaved={() => {
            showToast("Lineup saved! Check 'My Fantasy Squad' to view match performance.");
          }}
        />
      )}

      {/* ========================================================
          TAB: MY FANTASY SQUAD (VALIDATES 3-PLAYER CLUB RULE)
          ======================================================== */}
      {activeTab === "my_squad" && (
        <MyFantasySquad
          initialGameweek={selectedMatchweek}
          onEditLineup={() => setActiveTab("selection")}
        />
      )}

      {/* ========================================================
          TAB 1: TACTICAL PITCH GRID (CLICK-TO-ADD 15 SLOTS)
          ======================================================== */}
      {activeTab === "pitch" && (
        <div className="space-y-6">
          {/* TACTICAL PITCH GRID CONTAINER */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-[#0b2416]">
            {/* Turf Stripe Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18) 70px, transparent 70px, transparent 140px),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)
                `,
              }}
            />

            {/* Pitch Field Markings */}
            <div className="absolute inset-4 pointer-events-none border-2 border-white/20 rounded-2xl">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border-2 border-white/20 rounded-full" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-20 border-b-2 border-x-2 border-white/20 rounded-b-xl" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-20 border-t-2 border-x-2 border-white/20 rounded-t-xl" />
            </div>

            {/* Pitch Header Status */}
            <div className="relative z-10 flex flex-wrap items-center justify-between p-4 bg-slate-950/60 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff85] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Starting 11 Pitch Grid · {formationStatus.formationName} Formation
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Click any position slot to draft or change players. All prices below £10M.
              </p>
            </div>

            {/* 4 TACTICAL GRID ROWS ON PITCH */}
            <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between gap-6 min-h-[620px]">
              {/* GRID ROW 1: GOALKEEPER (Center Slot) */}
              <div className={`p-2.5 rounded-2xl transition ${isGkInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`}>
                <div className="text-[10px] uppercase font-bold text-center mb-2 tracking-wider text-amber-300">
                  Goalkeeper (1 Slot)
                </div>
                <div className="flex justify-center items-center">
                  <TacticalGridSlot
                    slotDef={SQUAD_SLOT_DEFINITIONS[0]}
                    player={slotAssignments["pitch_gk_1"]}
                    captainId={captainId}
                    viceCaptainId={viceCaptainId}
                    onClickSlot={() => setSelectedSlotForPicker(SQUAD_SLOT_DEFINITIONS[0])}
                    onRemoveSlot={() => handleRemoveSlot("pitch_gk_1")}
                    onSetCaptain={() => setCaptainId(slotAssignments["pitch_gk_1"]?.id || null)}
                    onSetViceCaptain={() => setViceCaptainId(slotAssignments["pitch_gk_1"]?.id || null)}
                    onInspect={() => setInspectingPlayer(slotAssignments["pitch_gk_1"])}
                  />
                </div>
              </div>

              {/* GRID ROW 2: DEFENDERS (3-5 Grid Slots) */}
              <div className={`p-2.5 rounded-2xl transition ${isDefInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`}>
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isDefInvalid ? "text-red-400 font-black animate-pulse" : "text-blue-300"}`}>
                    Defensive Line (Currently {defCount} DEF · Required: 3 to 5)
                  </span>
                  {isDefInvalid && (
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-black">
                      Formation Alert: Need at least 3 Defenders
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 justify-items-center">
                  {[1, 2, 3, 4, 5].map((idx) => {
                    const slotDef = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === `pitch_def_${idx}`);
                    if (!slotDef) return null;
                    return (
                      <TacticalGridSlot
                        key={slotDef.slotId}
                        slotDef={slotDef}
                        player={slotAssignments[slotDef.slotId]}
                        captainId={captainId}
                        viceCaptainId={viceCaptainId}
                        onClickSlot={() => setSelectedSlotForPicker(slotDef)}
                        onRemoveSlot={() => handleRemoveSlot(slotDef.slotId)}
                        onSetCaptain={() => setCaptainId(slotAssignments[slotDef.slotId]?.id || null)}
                        onSetViceCaptain={() => setViceCaptainId(slotAssignments[slotDef.slotId]?.id || null)}
                        onInspect={() => setInspectingPlayer(slotAssignments[slotDef.slotId])}
                      />
                    );
                  })}
                </div>
              </div>

              {/* GRID ROW 3: MIDFIELDERS (2-5 Grid Slots) */}
              <div className={`p-2.5 rounded-2xl transition ${isMidInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`}>
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isMidInvalid ? "text-red-400 font-black animate-pulse" : "text-emerald-300"}`}>
                    Midfield Line (Currently {midCount} MID · Required: 2 to 5)
                  </span>
                  {isMidInvalid && (
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-black">
                      Formation Alert: Need at least 2 Midfielders
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 justify-items-center">
                  {[1, 2, 3, 4, 5].map((idx) => {
                    const slotDef = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === `pitch_mid_${idx}`);
                    if (!slotDef) return null;
                    return (
                      <TacticalGridSlot
                        key={slotDef.slotId}
                        slotDef={slotDef}
                        player={slotAssignments[slotDef.slotId]}
                        captainId={captainId}
                        viceCaptainId={viceCaptainId}
                        onClickSlot={() => setSelectedSlotForPicker(slotDef)}
                        onRemoveSlot={() => handleRemoveSlot(slotDef.slotId)}
                        onSetCaptain={() => setCaptainId(slotAssignments[slotDef.slotId]?.id || null)}
                        onSetViceCaptain={() => setViceCaptainId(slotAssignments[slotDef.slotId]?.id || null)}
                        onInspect={() => setInspectingPlayer(slotAssignments[slotDef.slotId])}
                      />
                    );
                  })}
                </div>
              </div>

              {/* GRID ROW 4: FORWARDS (1-3 Grid Slots) */}
              <div className={`p-2.5 rounded-2xl transition ${isFwdInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`}>
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isFwdInvalid ? "text-red-400 font-black animate-pulse" : "text-red-300"}`}>
                    Forward Attackers (Currently {fwdCount} FWD · Required: 1 to 3)
                  </span>
                  {isFwdInvalid && (
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-black">
                      Formation Alert: Need at least 1 Forward
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-6 justify-items-center max-w-xl mx-auto">
                  {[1, 2, 3].map((idx) => {
                    const slotDef = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === `pitch_fwd_${idx}`);
                    if (!slotDef) return null;
                    return (
                      <TacticalGridSlot
                        key={slotDef.slotId}
                        slotDef={slotDef}
                        player={slotAssignments[slotDef.slotId]}
                        captainId={captainId}
                        viceCaptainId={viceCaptainId}
                        onClickSlot={() => setSelectedSlotForPicker(slotDef)}
                        onRemoveSlot={() => handleRemoveSlot(slotDef.slotId)}
                        onSetCaptain={() => setCaptainId(slotAssignments[slotDef.slotId]?.id || null)}
                        onSetViceCaptain={() => setViceCaptainId(slotAssignments[slotDef.slotId]?.id || null)}
                        onInspect={() => setInspectingPlayer(slotAssignments[slotDef.slotId])}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* GRID ROW 5: BENCH DUGOUT (4 SLOTS) */}
          <div className="bg-[#0b1222] border border-white/10 rounded-3xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Substitutes Bench Dugout (4 Squad Members)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                1 Goalkeeper Sub + 3 Outfield Reserves (Auto-substitute if a starter doesn't play)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SQUAD_SLOT_DEFINITIONS.filter((s) => !s.isStarter).map((slotDef) => {
                const player = slotAssignments[slotDef.slotId];
                return (
                  <div
                    key={slotDef.slotId}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        {slotDef.label} ({slotDef.position})
                      </span>
                      {player && (
                        <span className="text-xs font-black text-[#00ff85]">£{player.price.toFixed(1)}m</span>
                      )}
                    </div>

                    {player ? (
                      <div className="my-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white truncate">{player.name}</p>
                          <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                            ⭐ {player.adminRating || 7.5}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {player.clubShortCode} · {player.totalPoints} pts
                        </p>
                        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10">
                          <button
                            onClick={() => setSelectedSlotForPicker(slotDef)}
                            className="flex-1 py-1 text-[11px] font-bold rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-[#00f0ff] transition"
                          >
                            Replace
                          </button>
                          <button
                            onClick={(e) => handleRemoveSlot(slotDef.slotId, e)}
                            className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedSlotForPicker(slotDef)}
                        className="my-3 py-6 rounded-xl border-2 border-dashed border-white/20 hover:border-cyan-400 bg-white/[0.02] hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 transition flex flex-col items-center justify-center gap-1"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-xs font-bold">+ Add {slotDef.label}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: ADMIN MATCH RATINGS DESK (REAL-TIME FANTASY POINTS)
          ======================================================== */}
      {activeTab === "ratings" && (
        <div className="bg-[#0b1222] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-400" />
                Admin Match Ratings Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official Match Commissioners grade player performances (1.0 to 10.0 scale) and award bonus points. Fantasy points recalculate instantly!
              </p>
            </div>
            <div className="flex items-center gap-2">
              {canEditRatings ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-[#00ff85] border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Admin Editing Clearance
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Public Viewer (Read-Only)
                </span>
              )}
            </div>
          </div>

          {/* Access Banner */}
          {!canEditRatings ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-200 text-xs">
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">Public Viewer Mode Active: Read-Only Ratings</p>
                <p className="text-xs text-amber-300/80 mt-0.5">
                  Public viewers and spectators cannot modify match ratings. All athlete scores and bonus points are certified exclusively by MSL League Commissioners & Referees.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-purple-200 text-xs">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">Official Commissioner Clearance Active</p>
                <p className="text-xs text-purple-300/80 mt-0.5">
                  You are authorized as an official to grade players and award bonus points. Changes immediately update all fantasy league scores.
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-3">Pos</th>
                  <th className="py-3 px-3 text-right">Price (&lt;10M)</th>
                  <th className="py-3 px-3 text-center">Admin Rating</th>
                  <th className="py-3 px-3 text-center">Bonus Pts</th>
                  <th className="py-3 px-3 text-right">Total Pts</th>
                  <th className="py-3 px-4 text-center">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {marketPlayers.map((player) => {
                  const rating = player.adminRating || 7.0;
                  const bonus = player.adminBonusPoints || 0;
                  return (
                    <tr key={player.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span>{player.name}</span>
                        {player.id === captainId && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                            (C)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{player.clubName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                          {player.position}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#00ff85]">
                        £{player.price.toFixed(1)}m
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-black border border-amber-400/30">
                          ⭐ {rating.toFixed(1)} / 10
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-cyan-300">
                        +{bonus}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-white text-sm">
                        {player.totalPoints}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {canEditRatings ? (
                          <button
                            type="button"
                            onClick={() => handleOpenRatingEditor(player)}
                            className="px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-bold transition flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Update Rating
                          </button>
                        ) : (
                          <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-bold text-[11px] flex items-center gap-1.5 mx-auto w-fit">
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            Official Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: REAL MINI-LEAGUES & GLOBAL COMPETITIONS
          ======================================================== */}
      {activeTab === "leagues" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                Real MSL Fantasy Leagues & Competitions
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Every matchweek managers pick fantasy squads. Review the Matchweek Leaderboard or the Overall Season Standings that sum up all weeks played.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Leaderboard View Mode Toggle: Gameweek vs. Overall Season Sum */}
              <div className="bg-[#0b1222] border border-white/10 p-1 rounded-2xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLeaderboardViewMode("gameweek")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    leaderboardViewMode === "gameweek"
                      ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  GW {selectedMatchweek} Leaderboard
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardViewMode("overall")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    leaderboardViewMode === "overall"
                      ? "bg-[#00ff85] text-slate-950 shadow-md shadow-[#00ff85]/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  Overall (Sum All Weeks)
                </button>
              </div>

              <button
                onClick={() => setShowJoinLeagueModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Join with Code
              </button>
              <button
                onClick={() => setShowCreateLeagueModal(true)}
                className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                Create Mini-League
              </button>
            </div>
          </div>

          {/* Gameweek vs. Overall Leaderboard Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {leaderboardViewMode === "gameweek"
                  ? `Displaying verified scores strictly earned during Matchweek ${selectedMatchweek}.`
                  : `Displaying overall cumulative standings summing all completed matchweeks (Weeks 1 to 5).`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Matchweek:</span>
              {[1, 2, 3, 4, 5].map((gw) => (
                <button
                  key={gw}
                  type="button"
                  onClick={() => setSelectedMatchweek(gw)}
                  className={`px-2 py-0.5 rounded text-[11px] font-black transition cursor-pointer ${
                    selectedMatchweek === gw
                      ? "bg-amber-400 text-slate-950 font-black"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  GW{gw}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {realLeagues.map((league) => {
              // Calculate entries based on selected mode
              const sortedEntries =
                leaderboardViewMode === "gameweek"
                  ? getGameweekLeaderboard(league.entries, selectedMatchweek)
                  : getOverallSeasonLeaderboard(league.entries, 5);

              return (
                <div
                  key={league.id}
                  className="bg-[#0b1222] border border-white/10 rounded-3xl p-5 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                          <span>{league.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                            {leaderboardViewMode === "gameweek" ? `GW ${selectedMatchweek} View` : "Cumulative Overall"}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Format: <span className="text-cyan-400 capitalize">{league.type.replace("_", " ")}</span> · Created by {league.creator} · {league.membersCount} Managers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Code:</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/15 text-white font-mono text-xs font-bold rounded-xl">
                        {league.code}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                        <tr>
                          <th className="py-2.5 px-3 text-center">Rank</th>
                          <th className="py-2.5 px-4">Manager & Squad</th>
                          <th className="py-2.5 px-3 text-center">GW Breakdown</th>
                          <th className="py-2.5 px-3 text-right">
                            {leaderboardViewMode === "gameweek" ? `GW ${selectedMatchweek} Pts` : "Active GW"}
                          </th>
                          <th className="py-2.5 px-4 text-right">Overall Total Pts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sortedEntries.map((entry) => {
                          const isUser = entry.managerName.includes("You");
                          const gwPointsForDisplay =
                            entry.gameweekScores?.[selectedMatchweek] ?? entry.gameweekPoints;

                          return (
                            <tr
                              key={entry.rank}
                              className={isUser ? "bg-[#00ff85]/10 font-bold" : "hover:bg-white/[0.02]"}
                            >
                              <td className="py-2.5 px-3 text-center">
                                {entry.rank === 1 ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                                    1
                                  </span>
                                ) : entry.rank === 2 ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs">
                                    2
                                  </span>
                                ) : entry.rank === 3 ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs">
                                    3
                                  </span>
                                ) : (
                                  <span className="text-slate-400">{entry.rank}</span>
                                )}
                              </td>
                              <td className="py-2.5 px-4">
                                <p className={`text-sm ${isUser ? "text-[#00ff85] font-black" : "text-white"}`}>
                                  {entry.teamName}
                                </p>
                                <p className="text-[11px] text-slate-400">{entry.managerName}</p>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-[10px]">
                                  {[1, 2, 3, 4, 5].map((w) => (
                                    <span
                                      key={w}
                                      className={`px-1.5 py-0.5 rounded font-mono ${
                                        selectedMatchweek === w
                                          ? "bg-amber-400/30 text-amber-300 font-bold border border-amber-400/40"
                                          : "bg-white/5 text-slate-400"
                                      }`}
                                    >
                                      W{w}:{entry.gameweekScores?.[w] ?? "-"}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span
                                  className={`font-mono font-bold ${
                                    leaderboardViewMode === "gameweek" ? "text-amber-300 text-sm font-black" : "text-slate-300"
                                  }`}
                                >
                                  {gwPointsForDisplay} pts
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <span
                                  className={`text-base font-black ${
                                    leaderboardViewMode === "overall" ? "text-[#00ff85]" : "text-white"
                                  }`}
                                >
                                  {entry.totalPoints} pts
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: OFFICIAL SCORING RULES MATRIX
          ======================================================== */}
      {activeTab === "rules" && (
        <div className="bg-[#0b1222] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-[#00ff85]" />
              Official Fantasy MSL Scoring & Rulebook
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Virtual players score points based on Admin Match Ratings and official Sunday on-pitch events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#00ff85] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Points Awarded
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between text-purple-200">
                  <span>Official Admin Match Rating (e.g. 8.5/10)</span>
                  <span className="font-black text-purple-300 text-sm">Rating x 2 pts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span>Goal scored by a Forward (FWD)</span>
                  <span className="font-black text-[#00ff85] text-sm">+4 pts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span>Goal scored by a Midfielder (MID)</span>
                  <span className="font-black text-[#00ff85] text-sm">+5 pts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span>Goal scored by a Defender or Goalkeeper (DEF/GK)</span>
                  <span className="font-black text-[#00ff85] text-sm">+6 pts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span>Assist (Final pass or touch before goal)</span>
                  <span className="font-black text-cyan-400 text-sm">+3 pts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span>Clean Sheet by Goalkeeper or Defender (played 60+ mins)</span>
                  <span className="font-black text-[#00ff85] text-sm">+4 pts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <span>Every 3 Saves made by a Goalkeeper</span>
                  <span className="font-black text-amber-400 text-sm">+1 pt</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Deductions & Squad Governance
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-red-200">
                  <span>Red Card</span>
                  <span className="font-black text-red-400 text-sm">-3 pts</span>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-red-200">
                  <span>Yellow Card</span>
                  <span className="font-black text-red-400 text-sm">-1 pt</span>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-red-200">
                  <span>Every 2 Goals Conceded by DEF / GK</span>
                  <span className="font-black text-red-400 text-sm">-1 pt</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white text-sm">Squad Rules:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Budget:</strong> £100.0m Virtual Budget.</li>
                  <li><strong>Player Prices:</strong> All players priced strictly below 10M.</li>
                  <li><strong>Club Limit:</strong> Strictly max 2 players per real club.</li>
                  <li><strong>Starting 11:</strong> Exactly 1 GK, 3-5 DEF, 2-5 MID, 1-3 FWD.</li>
                  <li><strong>Captaincy:</strong> Captain scores 2x; Vice-Captain inherits 2x if Captain is absent.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CLICK-TO-ADD POSITION PLAYER PICKER
          ======================================================== */}
      {selectedSlotForPicker && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1222] border-2 border-cyan-400 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative text-left max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedSlotForPicker(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-4 pb-3 border-b border-white/10">
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/40">
                Selecting {selectedSlotForPicker.label} ({selectedSlotForPicker.position})
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Pick a Real {selectedSlotForPicker.position === "GK" ? "Goalkeeper" : selectedSlotForPicker.position === "DEF" ? "Defender" : selectedSlotForPicker.position === "MID" ? "Midfielder" : "Forward"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bank Remaining: <strong className="text-[#00ff85]">£{bankRemaining.toFixed(1)}m</strong> · Club Limit: <strong className="text-amber-300">Max 3 per Club</strong>
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${selectedSlotForPicker.position} by name...`}
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <select
                value={pickerClubFilter}
                onChange={(e) => setPickerClubFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All MSL Clubs</option>
                <option value="Samba">Samba</option>
                <option value="Royal Rangers">Royal Rangers</option>
                <option value="Young Stars City">Young Stars City</option>
                <option value="Mzinga Boyz">Mzinga Boyz</option>
              </select>
            </div>

            {/* Candidate List */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {pickerCandidates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No {selectedSlotForPicker.position} found matching your filters.
                </div>
              ) : (
                pickerCandidates.map((candidate) => {
                  const existingInSlot = slotAssignments[selectedSlotForPicker.slotId];
                  const alreadyInSlot = existingInSlot?.id === candidate.id;
                  const alreadyInSquad = currentSquadList.some((p) => p.id === candidate.id && p.id !== existingInSlot?.id);

                  const clubCount = clubCompliance.clubCounts[candidate.clubName] || 0;
                  const isExistingFromSameClub = existingInSlot && existingInSlot.clubName === candidate.clubName;
                  const clubLimitReached = !alreadyInSlot && !isExistingFromSameClub && clubCount >= 3;

                  const costDiff = candidate.price - (existingInSlot ? existingInSlot.price : 0);
                  const canAfford = bankRemaining - costDiff >= 0;

                  return (
                    <div
                      key={candidate.id}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        alreadyInSlot
                          ? "bg-[#00ff85]/10 border-[#00ff85]/40"
                          : clubLimitReached || !canAfford || alreadyInSquad
                          ? "bg-white/[0.02] border-white/5 opacity-60"
                          : "bg-slate-900/60 border-white/10 hover:border-cyan-400/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border"
                          style={{
                            backgroundColor: `${candidate.clubColor}22`,
                            borderColor: candidate.clubColor,
                            color: candidate.clubColor,
                          }}
                        >
                          {candidate.jerseyNumber}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{candidate.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                              ⭐ {candidate.adminRating || 7.5}
                            </span>
                          </p>
                          <p className="text-xs text-slate-400">
                            {candidate.clubName} · {candidate.totalPoints} pts
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-black text-[#00ff85]">£{candidate.price.toFixed(1)}m</p>
                          <p className="text-[10px] text-slate-400">Club: {clubCount}/3</p>
                        </div>

                        {alreadyInSlot ? (
                          <span className="px-3 py-1.5 rounded-xl bg-[#00ff85] text-slate-950 font-black text-xs">
                            Active Slot
                          </span>
                        ) : alreadyInSquad ? (
                          <span className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-bold">
                            In Squad
                          </span>
                        ) : clubLimitReached ? (
                          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                            Club Max (3/3)
                          </span>
                        ) : !canAfford ? (
                          <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold">
                            Over Budget
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSelectPlayerForSlot(candidate)}
                            className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition shadow-sm"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADMIN RATING EDITOR
          ======================================================== */}
      {adminRatingTargetPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1222] border-2 border-purple-500 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setAdminRatingTargetPlayer(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-amber-400" />
              Set Admin Match Rating
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              For <strong>{adminRatingTargetPlayer.name}</strong> ({adminRatingTargetPlayer.position} - {adminRatingTargetPlayer.clubName})
            </p>

            <form onSubmit={handleSaveAdminRating} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Match Performance Rating (1.0 - 10.0)</span>
                  <span className="text-amber-400 font-black text-sm">⭐ {adminScoreInput.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={adminScoreInput}
                  onChange={(e) => setAdminScoreInput(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Bonus Points (0 to 5 pts)
                </label>
                <select
                  value={adminBonusInput}
                  onChange={(e) => setAdminBonusInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value={0}>0 Bonus Points</option>
                  <option value={1}>+1 Bonus Point</option>
                  <option value={2}>+2 Bonus Points</option>
                  <option value={3}>+3 Bonus Points (Man of the Match)</option>
                  <option value={4}>+4 Bonus Points</option>
                  <option value={5}>+5 Bonus Points (Outstanding Record)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Commissioner Match Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Masterclass defensive coordination in Derby"
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="p-3 bg-white/5 rounded-xl text-xs text-slate-300">
                Formula Result: <strong>{Math.round(adminScoreInput * 2) + adminBonusInput} fantasy base points</strong> will be instantly awarded.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminRatingTargetPlayer(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-black text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition shadow-md shadow-purple-600/30"
                >
                  Save & Update Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PLAYER BREAKDOWN
          ======================================================== */}
      {inspectingPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1222] border-2 border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setInspectingPlayer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00ff85]/20 border border-[#00ff85]/30 flex items-center justify-center text-[#00ff85] font-black text-lg">
                {inspectingPlayer.jerseyNumber}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{inspectingPlayer.name}</h3>
                <p className="text-xs text-slate-400">
                  {inspectingPlayer.position} · {inspectingPlayer.clubName} ({inspectingPlayer.clubShortCode})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Price</p>
                <p className="text-base font-black text-[#00ff85]">£{inspectingPlayer.price.toFixed(1)}m</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Admin Rating</p>
                <p className="text-base font-black text-amber-400">⭐ {inspectingPlayer.adminRating || 7.5}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Pts</p>
                <p className="text-base font-black text-cyan-400">{inspectingPlayer.totalPoints}</p>
              </div>
            </div>

            <button
              onClick={() => setInspectingPlayer(null)}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-xs font-bold text-white rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE MINI-LEAGUE
          ======================================================== */}
      {showCreateLeagueModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1222] border-2 border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowCreateLeagueModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-amber-400" />
              Create Real Mini-League
            </h3>
            <form onSubmit={handleCreateMiniLeague} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Mini-League Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mara Dormitory Invitational"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Competition Format
                </label>
                <select
                  value={newLeagueType}
                  onChange={(e) => setNewLeagueType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="classic">Classic Points League (Cumulative Points)</option>
                  <option value="head_to_head">Head-to-Head League (Weekly 1v1)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateLeagueModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition"
                >
                  Create & Get Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: JOIN MINI-LEAGUE (WITH DATABASE CODE VALIDATION)
          ======================================================== */}
      <JoinMiniLeagueModal
        isOpen={showJoinLeagueModal}
        onClose={() => setShowJoinLeagueModal(false)}
        userSquadName="M-Pesa Academy XI"
        userGameweekPoints={59}
        userTotalPoints={231}
        onJoinSuccess={(joinedLeague) => {
          showToast(`✓ Welcome to "${joinedLeague.name}"! Standings synchronized.`);
        }}
      />
    </div>
  );
}

/**
 * Tactical Grid Slot Component for Pitch Grid
 */
interface TacticalGridSlotProps {
  slotDef: SquadSlotDef;
  player: FantasyPlayer | null;
  captainId: number | null;
  viceCaptainId: number | null;
  onClickSlot: () => void;
  onRemoveSlot: () => void;
  onSetCaptain: () => void;
  onSetViceCaptain: () => void;
  onInspect: () => void;
}

function TacticalGridSlot({
  slotDef,
  player,
  captainId,
  viceCaptainId,
  onClickSlot,
  onRemoveSlot,
  onSetCaptain,
  onSetViceCaptain,
  onInspect,
}: TacticalGridSlotProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (!player) {
    return (
      <button
        onClick={onClickSlot}
        className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 border-dashed border-white/30 hover:border-[#00ff85] bg-black/30 hover:bg-[#00ff85]/10 text-white/70 hover:text-white transition flex flex-col items-center justify-center gap-1 group shadow-lg"
      >
        <div className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-[#00ff85]/20 flex items-center justify-center transition">
          <Plus className="w-4 h-4 text-slate-300 group-hover:text-[#00ff85]" />
        </div>
        <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-[#00ff85]">
          + {slotDef.position}
        </span>
      </button>
    );
  }

  const isCaptain = player.id === captainId;
  const isViceCaptain = player.id === viceCaptainId;

  return (
    <div className="relative group flex flex-col items-center">
      {/* Captain / Vice Captain Armband Badge */}
      {isCaptain && (
        <span
          className="absolute -top-2.5 -right-2 z-20 px-1.5 py-0.5 text-[10px] font-black rounded-full shadow-lg bg-amber-400 text-slate-950 border border-slate-900"
          title="Captain (2x Points)"
        >
          (C)
        </span>
      )}
      {isViceCaptain && (
        <span
          className="absolute -top-2.5 -right-2 z-20 px-1.5 py-0.5 text-[10px] font-black rounded-full shadow-lg bg-[#00f0ff] text-slate-950 border border-slate-900"
          title="Vice-Captain (Inherits 2x)"
        >
          VC
        </span>
      )}

      {/* Jersey Token Button */}
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition transform group-hover:scale-105 shadow-xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-white/20 hover:border-[#00ff85]"
      >
        <span className="text-[11px] sm:text-xs font-black text-white">{player.jerseyNumber}</span>
        <span
          className="text-[9px] font-black uppercase px-1 rounded"
          style={{ backgroundColor: `${player.clubColor}33`, color: player.clubColor }}
        >
          {player.clubShortCode}
        </span>
      </button>

      {/* Player Label Pill */}
      <div className="mt-1 bg-slate-950/95 border border-white/20 rounded-md px-1.5 py-0.5 text-center shadow-lg max-w-[85px] sm:max-w-[95px]">
        <p className="text-[11px] font-bold text-white truncate leading-tight">{player.name}</p>
        <p className="text-[10px] font-black text-[#00ff85] leading-none mt-0.5">
          £{player.price.toFixed(1)}m · ⭐{player.adminRating || 7.5}
        </p>
      </div>

      {/* Slot Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-16 z-30 bg-[#090e1c] border border-cyan-500/40 rounded-xl p-2 shadow-2xl w-44 flex flex-col gap-1 text-left backdrop-blur-md animate-in fade-in zoom-in-95">
          <button
            onClick={() => {
              onClickSlot();
              setShowMenu(false);
            }}
            className="w-full px-2.5 py-1.5 text-xs text-white hover:bg-[#00f0ff] hover:text-slate-950 rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Change Player
          </button>
          <button
            onClick={() => {
              onSetCaptain();
              setShowMenu(false);
            }}
            className="w-full px-2.5 py-1.5 text-xs text-white hover:bg-amber-400 hover:text-slate-950 rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Make Captain (2x)
          </button>
          <button
            onClick={() => {
              onSetViceCaptain();
              setShowMenu(false);
            }}
            className="w-full px-2.5 py-1.5 text-xs text-white hover:bg-cyan-400 hover:text-slate-950 rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <Star className="w-3.5 h-3.5 text-cyan-400" />
            Make Vice-Captain
          </button>
          <button
            onClick={() => {
              onInspect();
              setShowMenu(false);
            }}
            className="w-full px-2.5 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg font-medium flex items-center gap-1.5 transition"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Stats Breakdown
          </button>
          <button
            onClick={() => {
              onRemoveSlot();
              setShowMenu(false);
            }}
            className="w-full px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/20 rounded-lg font-bold flex items-center gap-1.5 transition border-t border-white/5 pt-1 mt-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Slot
          </button>
        </div>
      )}
    </div>
  );
}
