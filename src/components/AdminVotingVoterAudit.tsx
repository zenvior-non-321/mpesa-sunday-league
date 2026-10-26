import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Users,
  Trophy,
  Trash2,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  FileText,
} from "lucide-react";
import {
  getMvpWinnersHistory,
  archiveMvpWinner,
  deleteWinnerFromHistory,
  DEFAULT_MVP_WINNERS,
  type MvpWinnerRecord,
} from "../lib/mvpWinnersHistory";
import type { MvpVoteRecord } from "./MatchMvpVoting";

interface VoterEntry {
  name: string;
  email: string;
  votedAt: string;
}

interface AdminVotingVoterAuditProps {
  matchId: number;
  matchweek: number;
  matchTitle: string;
  matchDate: string;
  currentPoll: MvpVoteRecord;
  onUpdatePoll: (updated: MvpVoteRecord) => void;
  onShowToast: (msg: string) => void;
}

export function AdminVotingVoterAudit({
  matchId,
  matchweek,
  matchTitle,
  matchDate,
  currentPoll,
  onUpdatePoll,
  onShowToast,
}: AdminVotingVoterAuditProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [winnersHistory, setWinnersHistory] = useState<MvpWinnerRecord[]>(DEFAULT_MVP_WINNERS);

  // Listen to winners history changes
  React.useEffect(() => {
    setWinnersHistory(getMvpWinnersHistory());
    const handleUpdate = () => setWinnersHistory(getMvpWinnersHistory());
    window.addEventListener("mpesa_mvp_winners_updated", handleUpdate);
    return () => window.removeEventListener("mpesa_mvp_winners_updated", handleUpdate);
  }, []);

  // Total votes for this fixture
  const totalVotes = useMemo(() => {
    return Object.values(currentPoll.votes).reduce((sum, item) => sum + item.votesCount, 0);
  }, [currentPoll.votes]);

  // Candidate vote items
  const candidateEntries = useMemo(() => {
    return Object.entries(currentPoll.votes).map(([playerName, data]) => {
      const votersList = (data.voters || []) as VoterEntry[];
      return {
        playerName,
        ...data,
        votersList,
        percentage: totalVotes > 0 ? Math.round((data.votesCount / totalVotes) * 100) : 0,
      };
    });
  }, [currentPoll.votes, totalVotes]);

  // Leading candidate
  const leadingCandidate = useMemo(() => {
    if (candidateEntries.length === 0) return null;
    return [...candidateEntries].sort((a, b) => b.votesCount - a.votesCount)[0];
  }, [candidateEntries]);

  // Filtered candidate list based on search
  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) return candidateEntries;
    const term = searchTerm.toLowerCase();
    return candidateEntries.filter(
      (c) =>
        c.playerName.toLowerCase().includes(term) ||
        c.teamName.toLowerCase().includes(term) ||
        c.votersList.some(
          (v) => v.name.toLowerCase().includes(term) || v.email.toLowerCase().includes(term),
        ),
    );
  }, [candidateEntries, searchTerm]);

  // Export Voter Audit Log to CSV
  const handleExportCsv = () => {
    const rows: string[] = [
      [
        "Fixture",
        "Matchweek",
        "Player Candidate",
        "Team",
        "Voter Name",
        "Voter Email",
        "Vote Timestamp",
      ].join(","),
    ];

    candidateEntries.forEach((c) => {
      if (c.votersList.length === 0) {
        rows.push(
          `"${matchTitle}",${matchweek},"${c.playerName}","${c.teamName}","N/A","N/A","N/A"`,
        );
      } else {
        c.votersList.forEach((v) => {
          rows.push(
            `"${matchTitle}",${matchweek},"${c.playerName}","${c.teamName}","${v.name}","${v.email}","${v.votedAt}"`,
          );
        });
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `mvp_voter_log_mw${matchweek}_match${matchId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast("✓ Voter log CSV audit exported successfully!");
  };

  // Archive certified winner & delete/clear the voting log for this match
  const handleArchiveAndClearVotingLog = () => {
    // 1. If there is a leading candidate or existing official winner, preserve in cumulative history
    const winnerCandidate = leadingCandidate;
    if (winnerCandidate && winnerCandidate.votesCount > 0) {
      archiveMvpWinner({
        matchId,
        matchweek,
        fixtureTitle: matchTitle,
        date: matchDate,
        winnerName: winnerCandidate.playerName,
        teamName: winnerCandidate.teamName,
        position: winnerCandidate.position,
        number: winnerCandidate.number,
        photoUrl: winnerCandidate.playerPhoto,
        votesCount: winnerCandidate.votesCount,
        votePercentage: winnerCandidate.percentage,
        totalBallotsCast: totalVotes,
        certifiedBy: "Supreme Council",
        notes: `Certified with ${winnerCandidate.votesCount} of ${totalVotes} total verified votes (${winnerCandidate.percentage}%).`,
      });
    }

    // 2. Clear this match's active voting log so a new one can be created
    const resetPoll: MvpVoteRecord = {
      ...currentPoll,
      isOpen: true,
      officialWinner: winnerCandidate
        ? {
            playerName: winnerCandidate.playerName,
            teamName: winnerCandidate.teamName,
            photoUrl: winnerCandidate.playerPhoto,
            votes: winnerCandidate.votesCount,
            percentage: winnerCandidate.percentage,
          }
        : undefined,
      votes: Object.fromEntries(
        Object.entries(currentPoll.votes).map(([name, data]) => [
          name,
          {
            ...data,
            votesCount: 0,
            voters: [],
          },
        ]),
      ),
      voterEmails: [],
    };

    onUpdatePoll(resetPoll);
    setShowClearConfirmModal(false);
    onShowToast(
      "✓ Match voting log cleared! Certified winner preserved in permanent honours records.",
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Audit Controls */}
      <div className="bg-[#100c2a] border-2 border-cyan-400/40 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2554] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="font-header text-base font-black text-white uppercase tracking-wider">
                Voter Audit Desk • Match #{matchId} ({matchTitle})
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Verify exact voter names per candidate. Reset and clear ballot logs for upcoming
              fixtures while permanently preserving winners in the records hall of fame.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-[#00f0ff] border border-cyan-400/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirmModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear & Reset Voting Log</span>
            </button>
          </div>
        </div>

        {/* Audit Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#080517] p-3 rounded-2xl border border-cyan-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Verified Ballots
            </span>
            <div className="text-lg font-black text-white font-mono">{totalVotes} Cast</div>
          </div>
          <div className="bg-[#080517] p-3 rounded-2xl border border-emerald-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Leading Candidate
            </span>
            <div className="text-sm font-black text-emerald-300 truncate">
              {leadingCandidate ? leadingCandidate.playerName : "No votes yet"}
            </div>
          </div>
          <div className="bg-[#080517] p-3 rounded-2xl border border-amber-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Unique Voters
            </span>
            <div className="text-lg font-black text-amber-300 font-mono">
              {currentPoll.voterEmails.length} Students
            </div>
          </div>
          <div className="bg-[#080517] p-3 rounded-2xl border border-purple-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Preserved Winners
            </span>
            <div className="text-lg font-black text-purple-300 font-mono">
              {winnersHistory.length} Champions
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate name or voter name/email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#080517] border border-[#2e2554] focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
          />
        </div>

        {/* Candidate & Voter Names List */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Voter Names by Player Candidate ({filteredCandidates.length})</span>
          </span>

          {filteredCandidates.length === 0 ? (
            <div className="p-6 bg-[#080517] rounded-2xl border border-[#2e2554] text-center text-xs text-gray-400">
              No voting records matching &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filteredCandidates.map((c) => {
              const isExpanded = expandedPlayer === c.playerName;
              return (
                <div
                  key={c.playerName}
                  className="bg-[#0a071b] border border-[#261f4d] rounded-2xl overflow-hidden transition"
                >
                  {/* Candidate Header Row */}
                  <div
                    onClick={() => setExpandedPlayer(isExpanded ? null : c.playerName)}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#141029] border border-[#2e2554] flex items-center justify-center font-bold text-sm text-cyan-300 shrink-0">
                        {c.number ?? "★"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-sm">{c.playerName}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            ({c.position || "FWD"})
                          </span>
                        </div>
                        <span className="text-xs text-cyan-300 font-medium">{c.teamName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black text-amber-300 font-mono">
                          {c.votesCount} {c.votesCount === 1 ? "Vote" : "Votes"}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-mono">
                          {c.percentage}% of tally
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Expand voter list"
                        className="p-1 rounded-lg text-gray-400 hover:text-white"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Voter Names Details */}
                  {isExpanded && (
                    <div className="p-3.5 bg-[#070512] border-t border-[#261f4d] space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 pb-1 border-b border-[#1f1744]">
                        <span>Verified Voter Name</span>
                        <span>Official Academy Email & Time</span>
                      </div>

                      {c.votersList.length === 0 ? (
                        <p className="text-xs text-gray-500 italic py-2">
                          No registered students have cast a vote for {c.playerName} yet.
                        </p>
                      ) : (
                        <div className="divide-y divide-[#1b153b] max-h-48 overflow-y-auto">
                          {c.votersList.map((v, vIdx) => (
                            <div
                              key={vIdx}
                              className="py-1.5 flex items-center justify-between text-xs gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="font-bold text-white">{v.name}</span>
                              </div>
                              <div className="flex items-center gap-3 text-right">
                                <span className="text-[11px] font-mono text-cyan-300">
                                  {v.email}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {v.votedAt}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Permanent Cumulative MVP Winners Records Table */}
      <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
          <div>
            <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Cumulative MVP Winners Records Table (Permanent Hall of Fame)
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Certified matchweek winners remain permanently preserved in this ledger even when
              individual match voter logs are cleared.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
            {winnersHistory.length} Historic Champions
          </span>
        </div>

        {winnersHistory.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-4 text-center">
            No MVP champions certified yet. Certify and archive a match to record the first winner!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#2e2554] text-[10px] uppercase font-bold text-gray-400 bg-[#141029]/60">
                  <th className="py-2.5 px-3">Matchweek</th>
                  <th className="py-2.5 px-3">MVP Champion</th>
                  <th className="py-2.5 px-3">Club</th>
                  <th className="py-2.5 px-3 text-center">Votes Won</th>
                  <th className="py-2.5 px-3 text-center">Share</th>
                  <th className="py-2.5 px-3">Certified Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1742]">
                {winnersHistory.map((w) => (
                  <tr key={w.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-3 font-mono font-black text-cyan-300">
                      MW {w.matchweek}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0">
                          👑
                        </div>
                        <div>
                          <span className="font-black text-white block">{w.winnerName}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {w.fixtureTitle}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-200">{w.teamName}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                      {w.votesCount} / {w.totalBallotsCast}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-amber-300">
                      {w.votePercentage}%
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                      {w.certifiedAt}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(`Delete ${w.winnerName}'s MVP record from hall of fame?`)
                          ) {
                            deleteWinnerFromHistory(w.id);
                            onShowToast(`✓ Removed ${w.winnerName} from MVP history`);
                          }
                        }}
                        className="p-1 rounded-lg text-gray-500 hover:text-rose-400 transition"
                        title="Delete from hall of fame"
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

      {/* Confirmation Modal to Clear Voting Log */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400 border-b border-[#2e2554] pb-3">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-header text-base font-black text-white uppercase">
                  Reset Match Voting Log
                </h4>
                <p className="text-[11px] text-gray-400">
                  Fixture #{matchId} • {matchTitle}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-300 space-y-2">
              <p>Are you sure you want to clear the voting log for this match?</p>
              <div className="p-3 bg-emerald-950/30 border border-emerald-400/30 rounded-xl space-y-1 text-emerald-200">
                <span className="font-bold flex items-center gap-1.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Winner Preservation Guaranteed:
                </span>
                <p className="text-[11px]">
                  <strong>
                    {leadingCandidate ? leadingCandidate.playerName : "Current Winner"}
                  </strong>{" "}
                  will be permanently saved into the Cumulative MVP Winners Records Table.
                </p>
              </div>
              <p className="text-gray-400 text-[11px]">
                The voter ballots and tallies for this match will be reset to 0 so fresh votes can
                be cast for the next match.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchiveAndClearVotingLog}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black text-xs font-black uppercase transition cursor-pointer"
              >
                Archive & Clear Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
