import React, { useState, useEffect } from "react";
import { Calendar, Clock, Trophy, FileText, CheckCircle2, ChevronRight, Award } from "lucide-react";
import type { MatchFixture, Team } from "./Fixtures";
import { OfficialMatchSheetModal } from "./OfficialMatchSheetModal";
import { MatchReportForm } from "./MatchReportForm";

interface RecentMatchHistoryProps {
  maxItems?: number;
  showFilters?: boolean;
}

export function RecentMatchHistory({ maxItems = 10, showFilters = true }: RecentMatchHistoryProps) {
  const [fixtures, setFixtures] = useState<MatchFixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatchweek, setSelectedMatchweek] = useState<string>("ALL");
  const [selectedSheetFixture, setSelectedSheetFixture] = useState<MatchFixture | null>(null);
  const [selectedReportFixture, setSelectedReportFixture] = useState<MatchFixture | null>(null);

  const loadData = () => {
    try {
      const rawMatches = localStorage.getItem("mpesa_pes_matches_v6");
      if (rawMatches) {
        setFixtures(JSON.parse(rawMatches));
      }
      const rawTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (rawTeams) {
        setTeams(JSON.parse(rawTeams));
      }
    } catch (err) {
      console.warn("Could not load recent matches data:", err);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("mpesa_matchsheet_updated", handleUpdate);
    window.addEventListener("mpesa_matchreport_saved", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("mpesa_matchsheet_updated", handleUpdate);
      window.removeEventListener("mpesa_matchreport_saved", handleUpdate);
    };
  }, []);

  const getTeam = (teamId: number): Team => {
    return (
      teams.find((t) => t.id === teamId) || {
        id: teamId,
        name: `Club #${teamId}`,
        shortCode: `C${teamId}`,
        color: "#00f0ff",
        homePitch: "M-Pesa Academy Arena",
      }
    );
  };

  // Filter for completed/finished matches
  const completedMatches = fixtures.filter((f) => {
    const statusStr = String(f.status || "");
    const isCompleted =
      statusStr === "FINISHED" ||
      statusStr === "COMPLETED" ||
      (f.homeScore !== undefined && f.awayScore !== undefined && statusStr !== "POSTPONED" && statusStr !== "UPCOMING" && statusStr !== "SCHEDULED");
    const matchWeek = selectedMatchweek === "ALL" || f.matchweek === Number(selectedMatchweek);
    return isCompleted && matchWeek;
  });

  const displayList = completedMatches.slice(0, maxItems);

  return (
    <div className="bg-[#0e0a26]/90 border border-[#2e2554] rounded-3xl p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-header text-lg font-black uppercase text-white tracking-wide">
              Recent Match Results & History
            </h3>
            <p className="text-xs text-gray-400">
              Verified final scores recorded from signed official referee match sheets
            </p>
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Matchweek:</span>
            <select
              value={selectedMatchweek}
              onChange={(e) => setSelectedMatchweek(e.target.value)}
              className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-1.5 text-xs text-white font-bold"
            >
              <option value="ALL">All Matchweeks</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                <option key={w} value={w}>
                  MW {w}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* List */}
      {displayList.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-xs italic">
          No completed matches recorded yet. Submit a match report or conclude an active fixture to view results.
        </div>
      ) : (
        <div className="divide-y divide-[#2e2554]/50">
          {displayList.map((match) => {
            const home = getTeam(match.homeId);
            const away = getTeam(match.awayId);
            const homeWon = match.homeScore > match.awayScore;
            const awayWon = match.awayScore > match.homeScore;

            return (
              <div
                key={match.id}
                className="py-4 hover:bg-white/[0.02] rounded-2xl px-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Match Metadata & Date */}
                <div className="space-y-1 sm:w-44 shrink-0">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase text-[9px]">
                      MW {match.matchweek}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      {match.date}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 block truncate">{match.venue}</span>
                </div>

                {/* Scoreline Center */}
                <div className="flex items-center justify-center flex-1 max-w-md gap-4">
                  {/* Home Side */}
                  <div className="flex items-center justify-end gap-2.5 flex-1 text-right">
                    <span
                      className={`text-sm font-black truncate ${
                        homeWon ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {home.name}
                    </span>
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: home.color }}
                    />
                  </div>

                  {/* Score Pill */}
                  <div className="px-3.5 py-1.5 bg-black/60 border border-white/10 rounded-xl flex items-center gap-2 shadow-inner font-mono text-base font-black text-white">
                    <span className={homeWon ? "text-emerald-400" : ""}>{match.homeScore}</span>
                    <span className="text-gray-500 text-xs">:</span>
                    <span className={awayWon ? "text-blue-400" : ""}>{match.awayScore}</span>
                  </div>

                  {/* Away Side */}
                  <div className="flex items-center justify-start gap-2.5 flex-1 text-left">
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: away.color }}
                    />
                    <span
                      className={`text-sm font-black truncate ${
                        awayWon ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {away.name}
                    </span>
                  </div>
                </div>

                {/* MOTM & Action Buttons */}
                <div className="flex items-center justify-end gap-2 sm:w-56 shrink-0">
                  {match.manOfTheMatch && (
                    <div className="text-[10px] text-gray-400 truncate hidden lg:block text-right">
                      <span className="text-amber-400 font-bold">⭐ MOTM:</span>{" "}
                      {match.manOfTheMatch.playerName}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedSheetFixture(match)}
                    className="p-1.5 bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="View Certified Match Sheet"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Sheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedReportFixture(match)}
                    className="p-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="View Official Referee Match Report Form"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Report</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Match Sheet Modal */}
      {selectedSheetFixture && (
        <OfficialMatchSheetModal
          isOpen={!!selectedSheetFixture}
          onClose={() => setSelectedSheetFixture(null)}
          fixture={selectedSheetFixture}
          teams={teams}
        />
      )}

      {/* Match Report Form Modal */}
      {selectedReportFixture && (
        <MatchReportForm
          isOpen={!!selectedReportFixture}
          onClose={() => setSelectedReportFixture(null)}
          fixture={selectedReportFixture}
          teams={teams}
        />
      )}
    </div>
  );
}
