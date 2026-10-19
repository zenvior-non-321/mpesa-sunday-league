import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Crown,
  Award,
  Vote,
  Share2,
  CheckCircle2,
  Flame,
  UserCheck,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import { useRoleAccess } from "../hooks/useRoleAccess";
import type { MatchFixture, Team } from "./Fixtures";
import { DEFAULT_FIXTURES, DEFAULT_TEAMS } from "../lib/fixturesData";

export interface MvpVoteRecord {
  matchId: number;
  isOpen: boolean;
  officialWinner?: {
    playerName: string;
    teamName: string;
    photoUrl?: string;
    votes: number;
    percentage: number;
  };
  votes: {
    [playerName: string]: {
      votesCount: number;
      teamName: string;
      playerPhoto?: string;
      position?: string;
      number?: number;
    };
  };
  voterEmails: string[];
}

interface MatchMvpVotingProps {
  initialMatchId?: number;
  onClose?: () => void;
}

export function MatchMvpVoting({ initialMatchId, onClose }: MatchMvpVotingProps) {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const canAdminVoting =
    isSuperAdmin ||
    currentRole === "TECH_MANAGER" ||
    currentRole === "ASST_TECH_MANAGER" ||
    currentRole === "RECORDS_MANAGER" ||
    currentRole === "PRESIDENT";

  const [matches, setMatches] = useState<MatchFixture[]>(DEFAULT_FIXTURES);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [selectedMatchId, setSelectedMatchId] = useState<number>(initialMatchId || 1);
  const [pollData, setPollData] = useState<{ [matchId: number]: MvpVoteRecord }>({});

  // Voter form state
  const [voterName, setVoterName] = useState<string>("");
  const [voterEmail, setVoterEmail] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load matches and stored votes
  useEffect(() => {
    try {
      const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedFixtures) {
        const parsed = JSON.parse(storedFixtures);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMatches(parsed);
        }
      }

      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
        }
      }

      const storedPolls = localStorage.getItem("mpesa_pes_mvp_votes_v1");
      if (storedPolls) {
        setPollData(JSON.parse(storedPolls));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Update selected match if initialMatchId changes
  useEffect(() => {
    if (initialMatchId) {
      setSelectedMatchId(initialMatchId);
    }
  }, [initialMatchId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const persistPollData = (updated: { [matchId: number]: MvpVoteRecord }) => {
    setPollData(updated);
    try {
      localStorage.setItem("mpesa_pes_mvp_votes_v1", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const currentMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId) || matches[0],
    [matches, selectedMatchId],
  );

  const homeTeam = useMemo(
    () =>
      teams.find((t) => t.id === currentMatch.homeId) || {
        id: currentMatch.homeId,
        name: "Home Team",
        shortCode: "HOM",
        color: "#00f0ff",
        homePitch: "School Pitch",
      },
    [teams, currentMatch.homeId],
  );

  const awayTeam = useMemo(
    () =>
      teams.find((t) => t.id === currentMatch.awayId) || {
        id: currentMatch.awayId,
        name: "Away Team",
        shortCode: "AWY",
        color: "#ffe600",
        homePitch: "School Pitch",
      },
    [teams, currentMatch.awayId],
  );

  // Extract squad candidates from both teams
  const matchCandidates = useMemo(() => {
    // If teams have squad arrays, gather them
    const homeSquad = (
      homeTeam as unknown as {
        squad?: { name: string; position?: string; number?: number; photoUrl?: string }[];
      }
    ).squad || [
      { name: "Kevin Omondi", position: "FWD", number: 9 },
      { name: "Dan Kiprop", position: "MID", number: 8 },
      { name: "Levis Wanyama", position: "MID", number: 10 },
      { name: "Brian Mwangi", position: "DEF", number: 4 },
    ];

    const awaySquad = (
      awayTeam as unknown as {
        squad?: { name: string; position?: string; number?: number; photoUrl?: string }[];
      }
    ).squad || [
      { name: "Emmanuel Kip", position: "FWD", number: 10 },
      { name: "Joshua Mutua", position: "MID", number: 7 },
      { name: "Bradley Barasa", position: "MID", number: 8 },
      { name: "Collins Wekesa", position: "MID", number: 6 },
    ];

    return [
      ...homeSquad.map((p) => ({ ...p, teamName: homeTeam.name, teamColor: homeTeam.color })),
      ...awaySquad.map((p) => ({ ...p, teamName: awayTeam.name, teamColor: awayTeam.color })),
    ];
  }, [homeTeam, awayTeam]);

  // Current match poll record with fallback initialization
  const currentPoll: MvpVoteRecord = useMemo(() => {
    if (pollData[selectedMatchId]) {
      return pollData[selectedMatchId];
    }
    // Default seeded poll for match 1
    if (selectedMatchId === 1) {
      return {
        matchId: 1,
        isOpen: true,
        votes: {
          "Kevin Omondi": {
            votesCount: 18,
            teamName: "Samba Boys",
            position: "FWD",
            number: 9,
            playerPhoto:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          },
          "Emmanuel Kip": {
            votesCount: 9,
            teamName: "Grade 10 A",
            position: "FWD",
            number: 10,
            playerPhoto:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
          },
          "Dan Kiprop": {
            votesCount: 5,
            teamName: "Samba Boys",
            position: "MID",
            number: 8,
          },
          "Bradley Barasa": {
            votesCount: 2,
            teamName: "Grade 10 A",
            position: "MID",
            number: 8,
          },
        },
        voterEmails: ["demo@mpesa.ac.ke"],
      };
    }
    return {
      matchId: selectedMatchId,
      isOpen: true,
      votes: {},
      voterEmails: [],
    };
  }, [pollData, selectedMatchId]);

  // Total votes cast
  const totalVotes = useMemo(() => {
    return Object.values(currentPoll.votes).reduce((sum, item) => sum + item.votesCount, 0);
  }, [currentPoll]);

  // Sorted candidates by vote count
  const sortedVoteTally = useMemo(() => {
    const list = Object.entries(currentPoll.votes).map(([name, data]) => ({
      name,
      ...data,
      percentage: totalVotes > 0 ? Math.round((data.votesCount / totalVotes) * 100) : 0,
    }));
    return list.sort((a, b) => b.votesCount - a.votesCount);
  }, [currentPoll, totalVotes]);

  // Leading candidate
  const leadingCandidate = sortedVoteTally.length > 0 ? sortedVoteTally[0] : null;

  // Handle member casting a vote
  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPoll.isOpen) {
      showToast("⚠️ MVP Voting for this match is currently closed.");
      return;
    }
    if (!selectedCandidate) {
      showToast("⚠️ Please select a player candidate to cast your vote.");
      return;
    }
    const emailNorm = voterEmail.trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes("@")) {
      showToast("⚠️ Please enter a valid email address.");
      return;
    }
    if (currentPoll.voterEmails.includes(emailNorm)) {
      showToast(
        "⛔ You have already voted for this match MVP. Only 1 vote per member is permitted.",
      );
      return;
    }

    const candidateObj = matchCandidates.find((c) => c.name === selectedCandidate);
    const existingCandidateVotes = currentPoll.votes[selectedCandidate] || {
      votesCount: 0,
      teamName: candidateObj?.teamName || "Academy Player",
      position: candidateObj?.position || "FWD",
      number: candidateObj?.number || 10,
      playerPhoto: candidateObj?.photoUrl,
    };

    const updatedPoll: MvpVoteRecord = {
      ...currentPoll,
      votes: {
        ...currentPoll.votes,
        [selectedCandidate]: {
          ...existingCandidateVotes,
          votesCount: existingCandidateVotes.votesCount + 1,
        },
      },
      voterEmails: [...currentPoll.voterEmails, emailNorm],
    };

    const updatedAll = {
      ...pollData,
      [selectedMatchId]: updatedPoll,
    };

    persistPollData(updatedAll);
    showToast(`✓ Vote successfully submitted for ${selectedCandidate}!`);
    setSelectedCandidate(null);
  };

  // Super Admin: Copy Shareable Voting Link
  const handleCopyVotingLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/mvp-voting?matchId=${selectedMatchId}`;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        showToast(`✓ Shareable MVP Voting link copied to clipboard! (${shareUrl})`);
      } else {
        showToast(`Share URL: ${shareUrl}`);
      }
    } catch {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  // Super Admin: Toggle Open/Close Voting
  const handleToggleVotingStatus = () => {
    const newStatus = !currentPoll.isOpen;
    let officialWinner = currentPoll.officialWinner;

    if (!newStatus && leadingCandidate) {
      officialWinner = {
        playerName: leadingCandidate.name,
        teamName: leadingCandidate.teamName,
        photoUrl: leadingCandidate.playerPhoto,
        votes: leadingCandidate.votesCount,
        percentage: leadingCandidate.percentage,
      };
    }

    const updatedPoll: MvpVoteRecord = {
      ...currentPoll,
      isOpen: newStatus,
      officialWinner: !newStatus ? officialWinner : undefined,
    };

    persistPollData({
      ...pollData,
      [selectedMatchId]: updatedPoll,
    });

    showToast(
      newStatus
        ? "✓ Voting opened for league members!"
        : `✓ Voting closed. Official MVP crowned: ${leadingCandidate?.name || "None"}`,
    );
  };

  // Super Admin: Reset Poll
  const handleResetPoll = () => {
    const updatedPoll: MvpVoteRecord = {
      matchId: selectedMatchId,
      isOpen: true,
      votes: {},
      voterEmails: [],
      officialWinner: undefined,
    };

    persistPollData({
      ...pollData,
      [selectedMatchId]: updatedPoll,
    });
    showToast("✓ MVP poll reset for this match.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 p-3.5 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-white text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-md flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-black" />
              <span>Match MVP Ballots</span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                currentPoll.isOpen
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-400 border-rose-500/40"
              }`}
            >
              {currentPoll.isOpen ? "Voting Live" : "Voting Concluded"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-3">
            <span>Match MVP Voting</span>
            <Trophy className="w-8 h-8 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Vote for the most outstanding performer. Super Admin distributes voting links to league
            members.
          </p>
        </div>

        {/* Fixture Selector & Super Admin Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Match Picker */}
          <div className="flex items-center gap-2 bg-[#141029] border border-[#2e2554] p-2 rounded-2xl">
            <span className="text-[10px] text-gray-400 font-bold uppercase pl-1">Match:</span>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(Number(e.target.value))}
              aria-label="Select match for MVP voting"
              className="bg-transparent text-xs font-black text-[#00f0ff] focus:outline-none cursor-pointer pr-2"
            >
              {matches.map((m) => {
                const h = teams.find((t) => t.id === m.homeId)?.shortCode || `C${m.homeId}`;
                const a = teams.find((t) => t.id === m.awayId)?.shortCode || `C${m.awayId}`;
                return (
                  <option key={m.id} value={m.id} className="bg-[#141029] text-white">
                    MW {m.matchweek}: {h} vs {a} ({m.status})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Copy Shareable Voting Link */}
          <button
            onClick={handleCopyVotingLink}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            title="Copy shareable link for league members to vote"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Voting Link</span>
          </button>

          {/* Super Admin Control Buttons */}
          {canAdminVoting && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleVotingStatus}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer border ${
                  currentPoll.isOpen
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500 hover:text-white"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500 hover:text-black"
                }`}
              >
                {currentPoll.isOpen ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
                <span>{currentPoll.isOpen ? "Close Poll & Crown" : "Reopen Poll"}</span>
              </button>

              <button
                onClick={handleResetPoll}
                className="p-2.5 rounded-2xl bg-[#141029] border border-[#2e2554] text-gray-400 hover:text-rose-400 transition cursor-pointer"
                title="Reset Poll Votes"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Match Clásico Header Banner */}
      <div className="bg-gradient-to-r from-[#141029] via-[#1a1438] to-[#141029] border border-[#2e2554] p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1.5 rounded-xl font-black text-xs text-black"
              style={{ backgroundColor: homeTeam.color || "#00f0ff" }}
            >
              {homeTeam.shortCode}
            </span>
            <span className="font-black text-sm text-white">{homeTeam.name}</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 font-mono text-xs font-black text-amber-300">
            {currentMatch.status === "FINISHED"
              ? `${currentMatch.homeScore} - ${currentMatch.awayScore}`
              : "VS"}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-white">{awayTeam.name}</span>
            <span
              className="px-3 py-1.5 rounded-xl font-black text-xs text-black"
              style={{ backgroundColor: awayTeam.color || "#ffe600" }}
            >
              {awayTeam.shortCode}
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-gray-400">
          <span className="font-bold text-gray-300 block">
            📍 {currentMatch.venue || "Academy Ground"}
          </span>
          <span className="font-mono text-[11px] text-[#00f0ff]">{currentMatch.date}</span>
        </div>
      </div>

      {/* Main Grid: Voting Ballot (Left) + Official MVP Results Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voting Ballot Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                Cast Your MVP Ballot
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Total Votes Cast: <strong className="text-[#00f0ff]">{totalVotes}</strong>
            </span>
          </div>

          {currentPoll.isOpen ? (
            <form onSubmit={handleCastVote} className="space-y-4">
              {/* Voter Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Player"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                    Your Email (1 vote per person)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. j.doe@mpesafoundationacademy.ac.ke"
                    value={voterEmail}
                    onChange={(e) => setVoterEmail(e.target.value)}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Candidate Selection List */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-400 block">
                  Select Match Candidate
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {matchCandidates.map((c, idx) => {
                    const isSelected = selectedCandidate === c.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCandidate(c.name)}
                        className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-amber-400/20 border-amber-400 shadow-lg shadow-amber-400/10"
                            : "bg-[#141029]/80 border-[#2e2554] hover:border-gray-500 hover:bg-[#181335]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-black shrink-0"
                            style={{ backgroundColor: c.teamColor || "#00f0ff" }}
                          >
                            #{c.number || idx + 1}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-black text-white block truncate">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-gray-400 block truncate">
                              {c.position || "FWD"} • {c.teamName}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-amber-400 bg-amber-400 text-black"
                              : "border-gray-600"
                          }`}
                        >
                          {isSelected && <span className="text-[10px] font-black">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Ballot Button */}
              <button
                type="submit"
                disabled={!selectedCandidate}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Vote className="w-4 h-4" />
                <span>Submit Official MVP Vote</span>
              </button>
            </form>
          ) : (
            <div className="p-6 bg-[#141029] rounded-2xl border border-rose-500/30 text-center space-y-2">
              <Lock className="w-8 h-8 text-rose-400 mx-auto" />
              <h4 className="text-sm font-black text-white uppercase">Voting Has Concluded</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                The ballot box for this match is locked. The final winner has been certified below.
              </p>
            </div>
          )}

          {/* Real-time Vote Breakdown Bars */}
          <div className="pt-3 border-t border-[#2e2554] space-y-2.5">
            <span className="text-[11px] font-black uppercase text-gray-400 block">
              Live Vote Distribution
            </span>

            {sortedVoteTally.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                No votes recorded yet for this fixture.
              </p>
            ) : (
              <div className="space-y-2">
                {sortedVoteTally.map((item, idx) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-gray-400">#{idx + 1}</span>
                        <span className="font-black text-white">{item.name}</span>
                        <span className="text-[10px] text-gray-400">({item.teamName})</span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-black">
                            LEADER
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-amber-300">
                        {item.votesCount} {item.votesCount === 1 ? "vote" : "votes"} (
                        {item.percentage}%)
                      </span>
                    </div>

                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Official MVP Winner Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-gradient-to-b from-[#1c1538] via-[#141029] to-[#0d0a21] border-2 border-amber-400/60 p-6 rounded-3xl shadow-2xl shadow-amber-500/10 relative overflow-hidden flex flex-col items-center text-center space-y-4">
            {/* Golden Ribbon Banner */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1.5 text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md">
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {currentPoll.officialWinner ? "OFFICIAL MATCH MVP WINNER" : "CURRENT POLL LEADER"}
              </span>
            </div>

            {/* Glowing Backdrop Pulse */}
            <div className="w-36 h-36 rounded-full bg-amber-400/20 blur-3xl absolute top-12 pointer-events-none" />

            {/* Player Avatar Card */}
            <div className="pt-4 relative">
              <div className="relative w-28 h-28 rounded-3xl border-2 border-amber-400 p-1 bg-black/60 shadow-2xl mx-auto flex items-center justify-center overflow-hidden">
                {leadingCandidate?.playerPhoto ? (
                  <img
                    src={leadingCandidate.playerPhoto}
                    alt={leadingCandidate.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-yellow-400 rounded-2xl flex items-center justify-center text-black font-black text-2xl">
                    {leadingCandidate?.name ? leadingCandidate.name.charAt(0) : "★"}
                  </div>
                )}
              </div>

              {/* Golden Crown Badge */}
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black flex items-center justify-center shadow-lg border border-amber-200">
                <Crown className="w-4 h-4 fill-current" />
              </div>
            </div>

            {/* Player Details */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                {leadingCandidate?.teamName || "Championship Performer"}
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                {leadingCandidate?.name || "No Leader Yet"}
              </h3>
              <p className="text-xs text-gray-400">
                Position: <strong>{leadingCandidate?.position || "Forward"}</strong> • Shirt:{" "}
                <strong>#{leadingCandidate?.number || 10}</strong>
              </p>
            </div>

            {/* Voting Stats Display Box */}
            <div className="w-full grid grid-cols-2 gap-3 p-3 bg-black/40 rounded-2xl border border-amber-400/30 font-mono">
              <div className="text-center">
                <span className="text-[10px] uppercase text-gray-400 block font-bold">
                  Poll Votes
                </span>
                <span className="text-lg font-black text-amber-300">
                  {leadingCandidate?.votesCount || 0}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase text-gray-400 block font-bold">
                  Vote Share
                </span>
                <span className="text-lg font-black text-amber-300">
                  {leadingCandidate?.percentage || 0}%
                </span>
              </div>
            </div>

            {/* Match Performance Snapshot */}
            <div className="w-full p-3 bg-[#141029] rounded-2xl border border-[#2e2554] text-left text-xs space-y-1.5">
              <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Performance Highlights</span>
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {currentMatch.manOfTheMatch?.highlightSummary ||
                  "Decisive presence on the pitch, commanding aerial duels, playmaking transitions, and relentless goal threat."}
              </p>
            </div>

            {/* Share Voting Prompt */}
            <div className="w-full pt-2">
              <button
                onClick={handleCopyVotingLink}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share MVP Poll With Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
