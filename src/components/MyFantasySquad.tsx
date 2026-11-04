import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Zap,
  Edit3,
} from "lucide-react";
import {
  type FantasyPlayer,
  checkClubLimit,
  validateFormation,
  getAdminPlayerRatings,
} from "../lib/fantasyEngine";
import { MatchweekSelector } from "./MatchweekSelector";

export interface MyFantasySquadProps {
  initialGameweek?: number;
  onEditLineup?: () => void;
  className?: string;
}

export function MyFantasySquad({
  initialGameweek = 10,
  onEditLineup,
  className = "",
}: MyFantasySquadProps) {
  const [selectedGameweek, setSelectedGameweek] = useState<number>(initialGameweek);
  const [savedData, setSavedData] = useState<{
    gameweek: number;
    teamName: string;
    managerName: string;
    formation: string;
    lineup: Record<string, FantasyPlayer | null>;
    captainId: number | null;
    viceCaptainId: number | null;
    savedAt?: string;
  } | null>(null);

  // Load saved lineup for selected gameweek
  useEffect(() => {
    const loadSquad = () => {
      if (typeof window === "undefined") return;
      try {
        const key = `fantasy_selection_gw_${selectedGameweek}_v1`;
        const raw = localStorage.getItem(key);
        if (raw) {
          setSavedData(JSON.parse(raw));
          return;
        }

        // Fallback: check general last active lineup
        const fallbackRaw = localStorage.getItem("fantasy_msl_last_active_lineup");
        if (fallbackRaw) {
          setSavedData(JSON.parse(fallbackRaw));
          return;
        }
      } catch (e) {
        // ignore
      }
      setSavedData(null);
    };

    loadSquad();
    window.addEventListener("mpesa_fantasy_lineup_saved", loadSquad);
    return () => window.removeEventListener("mpesa_fantasy_lineup_saved", loadSquad);
  }, [selectedGameweek]);

  // Extract non-null starting players
  const starters = useMemo<FantasyPlayer[]>(() => {
    if (!savedData || !savedData.lineup) return [];
    return Object.values(savedData.lineup).filter((p): p is FantasyPlayer => p !== null);
  }, [savedData]);

  // Validate the 3-player maximum rule per club
  const clubValidation = useMemo(() => {
    return checkClubLimit(starters, 3);
  }, [starters]);

  // Validate formation
  const formationValidation = useMemo(() => {
    return validateFormation(starters);
  }, [starters]);

  // Compute total weekly points
  const captainId = savedData?.captainId || null;
  const viceCaptainId = savedData?.viceCaptainId || null;

  const totalPoints = useMemo(() => {
    return starters.reduce((acc, p) => {
      const isCap = p.id === captainId;
      const multiplier = isCap ? 2 : 1;
      return acc + (p.gameweekPoints || 0) * multiplier;
    }, 0);
  }, [starters, captainId]);

  // Group players by position
  const grouped = useMemo(() => {
    return {
      Goalkeeper: starters.filter((p) => p.position === "GK"),
      Defenders: starters.filter((p) => p.position === "DEF"),
      Midfielders: starters.filter((p) => p.position === "MID"),
      Forwards: starters.filter((p) => p.position === "FWD"),
    };
  }, [starters]);

  return (
    <div
      className={`bg-gradient-to-br from-[#0c0824] via-[#100a30] to-[#080517] border border-[#2e235e] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Top Gameweek Selector */}
      <MatchweekSelector
        currentWeek={selectedGameweek}
        totalWeeks={10}
        onSelectWeek={(w) => setSelectedGameweek(w)}
        deadlineDate="Sun 08 Nov 17:00"
      />

      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shrink-0">
            <div className="w-full h-full bg-[#120b33] rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 text-black">
                My Fantasy Squad
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Gameweek {selectedGameweek}
              </span>
            </div>
            <h2 className="font-header text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-0.5">
              {savedData?.teamName || "Zenvior"}
            </h2>
            <span className="text-xs text-gray-300">
              Manager: <strong>{savedData?.managerName || "Tonnie Mark"}</strong> • Formation:{" "}
              <strong className="text-cyan-400">{savedData?.formation || "4-3-3"}</strong>
            </span>
          </div>
        </div>

        {/* Action Button & Total Points */}
        <div className="flex items-center gap-3">
          <div className="bg-[#150f38] border border-cyan-400/30 rounded-2xl p-3 text-center min-w-[110px]">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Gameweek Points
            </span>
            <span className="font-header text-2xl sm:text-3xl font-black text-cyan-400">
              {totalPoints} pts
            </span>
          </div>

          {onEditLineup && (
            <button
              type="button"
              onClick={onEditLineup}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Modify Squad</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          3-PLAYER MAXIMUM CLUB RULE VALIDATION BANNER
          ========================================================================= */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          clubValidation.isCompliant
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : "bg-rose-500/15 border-rose-500/40 text-rose-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {clubValidation.isCompliant ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div>
            <strong className="block font-black uppercase text-sm">
              {clubValidation.isCompliant
                ? "3-Player Club Quota: Fully Compliant"
                : "Rule Violation: 3-Player Club Quota Exceeded"}
            </strong>
            <span className="text-gray-300">
              {clubValidation.isCompliant
                ? "Every real-world club has 3 or fewer players selected in this starting 11."
                : `Violated clubs: ${clubValidation.violatedClubs.join(", ")}. Maximum 3 players allowed per team.`}
            </span>
          </div>
        </div>

        {/* Club Counts Breakdown Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(clubValidation.clubCounts).map(([club, count]) => (
            <span
              key={club}
              className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                count > 3
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-white/10 text-gray-200"
              }`}
            >
              {club}: {count}/3
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          STARTING 11 SQUAD LIST
          ========================================================================= */}
      {starters.length === 0 ? (
        <div className="py-14 text-center bg-black/30 rounded-2xl border border-white/5 space-y-3">
          <Users className="w-10 h-10 text-gray-500 mx-auto" />
          <h4 className="text-white font-bold text-base">No Lineup Saved Yet for Gameweek {selectedGameweek}</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Build and lock your starting 11 players before the final matchweek kickoff to participate in public and mini-league leaderboards.
          </p>
          {onEditLineup && (
            <button
              type="button"
              onClick={onEditLineup}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg"
            >
              Select 11 Players Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([posTitle, players]) => {
            if (players.length === 0) return null;

            return (
              <div key={posTitle} className="space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <span className="font-header text-sm font-black text-gray-300 uppercase tracking-wider">
                    {posTitle} ({players.length})
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Points • Value
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {players.map((player) => {
                    const isCap = player.id === captainId;
                    const isVice = player.id === viceCaptainId;
                    const pts = isCap ? player.gameweekPoints * 2 : player.gameweekPoints;

                    return (
                      <div
                        key={player.id}
                        className="bg-[#120d2e] border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md hover:border-cyan-400/40 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Jersey SVG Icon */}
                          <div className="relative shrink-0">
                            {isCap && (
                              <div
                                className="absolute -top-1.5 -left-1.5 z-10 w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[8px] flex items-center justify-center border border-black shadow"
                                title="Captain (2x Points)"
                              >
                                C
                              </div>
                            )}
                            {isVice && (
                              <div
                                className="absolute -top-1.5 -left-1.5 z-10 w-4 h-4 rounded-full bg-cyan-400 text-black font-black text-[7px] flex items-center justify-center border border-black shadow"
                                title="Vice Captain"
                              >
                                VC
                              </div>
                            )}
                            <svg viewBox="0 0 64 64" className="w-8 h-8">
                              <path
                                d="M16 14 L24 4 L40 4 L48 14 L56 22 L48 30 L44 26 L44 58 L20 58 L20 26 L16 30 L8 22 Z"
                                fill={player.clubColor || "#00ff85"}
                                stroke="#111827"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <span className="font-black text-white text-xs block truncate">
                              {player.name}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate block">
                              {player.clubShortCode} • {player.position}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono">
                          <span className="text-xs font-black text-cyan-300 block">
                            {pts} pts {isCap && <span className="text-[9px] text-amber-300">(2x)</span>}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            £{player.price.toFixed(1)}m
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
