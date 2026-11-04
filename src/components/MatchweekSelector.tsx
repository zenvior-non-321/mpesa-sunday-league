import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Sparkles, Clock } from "lucide-react";

export interface MatchweekSelectorProps {
  currentWeek: number;
  totalWeeks?: number;
  onSelectWeek: (week: number) => void;
  deadlineDate?: string;
  isDeadlinePassed?: boolean;
  className?: string;
}

/**
 * Reusable Matchweek Selector Component
 * Allows users to toggle between different game weeks to view stats, fixtures,
 * and fantasy leaderboards specific to that week.
 * Matches the official FPL / eFootball top navigation bar design.
 */
export function MatchweekSelector({
  currentWeek,
  totalWeeks = 10,
  onSelectWeek,
  deadlineDate = "Sunday 17:00",
  isDeadlinePassed = false,
  className = "",
}: MatchweekSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const canGoPrev = currentWeek > 1;
  const canGoNext = currentWeek < totalWeeks;

  const handlePrev = () => {
    if (canGoPrev) onSelectWeek(currentWeek - 1);
  };

  const handleNext = () => {
    if (canGoNext) onSelectWeek(currentWeek + 1);
  };

  return (
    <div
      className={`w-full flex items-center justify-between py-2.5 px-3 sm:px-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md relative select-none ${className}`}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Previous Gameweek"
        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
          canGoPrev
            ? "bg-white text-gray-900 hover:bg-gray-100 hover:shadow active:scale-95 border border-gray-200"
            : "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5 opacity-40"
        }`}
      >
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        <span className="hidden xs:inline">Previous</span>
      </button>

      {/* Center Gameweek Display with Direct Picker */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-header text-lg sm:text-2xl font-black text-white tracking-wide uppercase group-hover:text-cyan-400 transition">
                Gameweek {currentWeek}
              </span>
              <span className="text-[10px] text-gray-400 group-hover:text-gray-300">▼</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-gray-300">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>
                {isDeadlinePassed ? (
                  <span className="text-rose-400 font-bold">Deadline Passed</span>
                ) : (
                  <span>Deadline: <strong className="text-amber-300 font-mono">{deadlineDate}</strong></span>
                )}
              </span>
            </div>
          </div>
        </button>

        {/* Quick Dropdown Picker */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#0d0926] border border-[#382b6b] rounded-2xl shadow-2xl p-2.5 w-64 animate-in fade-in zoom-in-95">
              <div className="text-[10px] uppercase font-bold text-gray-400 px-2 pb-1.5 border-b border-white/10 flex items-center justify-between">
                <span>Jump to Gameweek</span>
                <span className="text-cyan-400">1 to {totalWeeks}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 mt-2">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((gw) => (
                  <button
                    key={gw}
                    type="button"
                    onClick={() => {
                      onSelectWeek(gw);
                      setShowDropdown(false);
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      gw === currentWeek
                        ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-md shadow-cyan-500/30 scale-105"
                        : "bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/5"
                    }`}
                  >
                    GW{gw}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Next Gameweek"
        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
          canGoNext
            ? "bg-white text-gray-900 hover:bg-gray-100 hover:shadow active:scale-95 border border-gray-200"
            : "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5 opacity-40"
        }`}
      >
        <span className="hidden xs:inline">Next</span>
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
