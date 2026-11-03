import React, { useState } from "react";
import {
  Trophy,
  Plus,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { MiniLeague } from "../lib/fantasyEngine";

const MINI_LEAGUES_STORAGE_KEY = "fantasy_msl_minileagues_real_v3";

interface JoinMiniLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSquadName?: string;
  userGameweekPoints?: number;
  userTotalPoints?: number;
  onJoinSuccess: (league: MiniLeague) => void;
}

export function JoinMiniLeagueModal({
  isOpen,
  onClose,
  userSquadName = "M-Pesa Academy XI",
  userGameweekPoints = 59,
  userTotalPoints = 231,
  onJoinSuccess,
}: JoinMiniLeagueModalProps) {
  const [codeInput, setCodeInput] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [foundLeague, setFoundLeague] = useState<MiniLeague | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Retrieve current leagues from database/storage
  const getPersistedLeagues = (): MiniLeague[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(MINI_LEAGUES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  };

  // Validation logic: check if code exists in database
  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFoundLeague(null);

    const cleanCode = codeInput.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage("Please enter a valid mini-league code.");
      return;
    }

    setIsValidating(true);

    setTimeout(() => {
      const allLeagues = getPersistedLeagues();
      const target = allLeagues.find((l) => l.code.toUpperCase() === cleanCode);

      if (!target) {
        setErrorMessage(
          `League code "${cleanCode}" was not found in the official database. Please verify the code with your league commissioner.`
        );
        setIsValidating(false);
        return;
      }

      // Check if user is already in this league
      const alreadyJoined = target.entries.some((entry) =>
        entry.managerName.toLowerCase().includes("you") || entry.teamName === userSquadName
      );

      if (alreadyJoined) {
        setErrorMessage(
          `You are already a member of "${target.name}". Check your active standings in the leagues tab.`
        );
        setIsValidating(false);
        return;
      }

      // Found and valid
      setFoundLeague(target);
      setIsValidating(false);
    }, 250);
  };

  // Confirm and persist joining the mini-league in database
  const handleConfirmJoin = () => {
    if (!foundLeague) return;

    try {
      const allLeagues = getPersistedLeagues();
      const newEntry = {
        rank: foundLeague.entries.length + 1,
        managerName: "You (Your Squad)",
        teamName: userSquadName,
        gameweekPoints: userGameweekPoints,
        totalPoints: userTotalPoints,
        gameweekScores: {},
      };

      const updatedEntries = [...foundLeague.entries, newEntry].sort(
        (a, b) => b.totalPoints - a.totalPoints
      );

      const updatedLeague: MiniLeague = {
        ...foundLeague,
        membersCount: foundLeague.membersCount + 1,
        entries: updatedEntries.map((item, idx) => ({ ...item, rank: idx + 1 })),
      };

      const updatedAllLeagues = allLeagues.map((l) =>
        l.id === updatedLeague.id ? updatedLeague : l
      );

      localStorage.setItem(MINI_LEAGUES_STORAGE_KEY, JSON.stringify(updatedAllLeagues));
      window.dispatchEvent(new CustomEvent("mpesa_fantasy_leagues_updated", { detail: updatedLeague }));
      window.dispatchEvent(new Event("storage"));

      setIsSuccess(true);
      setTimeout(() => {
        onJoinSuccess(updatedLeague);
        handleClose();
      }, 1200);
    } catch {
      setErrorMessage("Failed to join league. Please try again.");
    }
  };

  const handleClose = () => {
    setCodeInput("");
    setFoundLeague(null);
    setErrorMessage(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0b1222] border-2 border-cyan-400 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-[#00f0ff]">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Join Private Mini-League</h3>
            <p className="text-xs text-slate-400">
              Enter your invitation code to verify and enter the league.
            </p>
          </div>
        </div>

        {/* Success Feedback View */}
        {isSuccess && foundLeague ? (
          <div className="p-6 text-center space-y-3 bg-[#00ff85]/10 border border-[#00ff85]/30 rounded-2xl my-2">
            <CheckCircle2 className="w-10 h-10 text-[#00ff85] mx-auto animate-bounce" />
            <h4 className="text-base font-black text-white">Joined Successfully!</h4>
            <p className="text-xs text-slate-300">
              Your squad <strong>{userSquadName}</strong> is now competing in{" "}
              <strong className="text-[#00ff85]">{foundLeague.name}</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Code Input Form */}
            <form onSubmit={handleValidateCode} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Unique League Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. ACA-101 or MSL-782"
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value.toUpperCase());
                      if (errorMessage) setErrorMessage(null);
                      if (foundLeague) setFoundLeague(null);
                    }}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl text-sm font-mono text-white tracking-wider outline-none transition uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isValidating || !codeInput.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isValidating ? "Checking..." : "Verify"}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Validated League Preview Card */}
            {foundLeague && (
              <div className="p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/50 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-[#00f0ff] border border-cyan-400/30 text-[10px] font-black uppercase">
                    League Verified in Database
                  </span>
                  <span className="text-xs font-mono text-white font-bold">{foundLeague.code}</span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">{foundLeague.name}</h4>
                  <div className="text-xs text-slate-300 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Format: <strong className="text-white capitalize">{foundLeague.type.replace("_", " ")}</strong></span>
                    <span>Created by: <strong className="text-white">{foundLeague.creator}</strong></span>
                    <span>Members: <strong className="text-[#00ff85]">{foundLeague.membersCount}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFoundLeague(null)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmJoin}
                    className="px-4 py-2 rounded-xl bg-[#00ff85] hover:bg-[#00ff85]/90 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-[#00ff85]/20"
                  >
                    <span>Confirm & Enter League</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
