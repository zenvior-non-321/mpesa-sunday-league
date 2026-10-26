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
  Mail,
  ShieldCheck,
  KeyRound,
  Send,
} from "lucide-react";
import { useRoleAccess } from "../hooks/useRoleAccess";
import type { MatchFixture, Team } from "./Fixtures";
import { DEFAULT_FIXTURES, DEFAULT_TEAMS } from "../lib/fixturesData";
import {
  isRegisteredSchoolEmail,
  generateVerificationCode,
  verifySchoolEmailCode,
  getRegisteredSchoolEmails,
  addRegisteredSchoolEmail,
  getEmailDisplayName,
  CONFIRMED_ACADEMY_EMAILS,
} from "../lib/voterVerification";
import { AdminVotingVoterAudit } from "./AdminVotingVoterAudit";
import {
  getMvpWinnersHistory,
  DEFAULT_MVP_WINNERS,
  type MvpWinnerRecord,
} from "../lib/mvpWinnersHistory";

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
      voters?: Array<{
        name: string;
        email: string;
        votedAt: string;
      }>;
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

  // Verification flow state
  const [verificationStep, setVerificationStep] = useState<"unverified" | "code_sent" | "verified">(
    "unverified",
  );
  const [verificationCodeInput, setVerificationCodeInput] = useState<string>("");
  const [dispatchedPasscode, setDispatchedPasscode] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const [newSchoolEmailInput, setNewSchoolEmailInput] = useState<string>("");
  const [showVoterAudit, setShowVoterAudit] = useState<boolean>(false);
  const [mvpHistory, setMvpHistory] = useState<MvpWinnerRecord[]>(DEFAULT_MVP_WINNERS);

  useEffect(() => {
    setMvpHistory(getMvpWinnersHistory());
    const handleUpdate = () => setMvpHistory(getMvpWinnersHistory());
    window.addEventListener("mpesa_mvp_winners_updated", handleUpdate);
    return () => window.removeEventListener("mpesa_mvp_winners_updated", handleUpdate);
  }, []);

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

  // Live email confirmation against the official academy 344-member roster
  const emailStatus = useMemo(() => {
    const raw = voterEmail.trim();
    if (!raw) return null;
    const isConfirmed = isRegisteredSchoolEmail(raw);
    const displayName = getEmailDisplayName(raw);
    return { isConfirmed, displayName };
  }, [voterEmail]);

  // Reset verification when changing match or changing email
  const handleEmailChange = (newVal: string) => {
    setVoterEmail(newVal);
    if (verifiedEmail && newVal.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
      setVerificationStep("unverified");
      setVerifiedEmail(null);
      setVerificationError(null);
      setDispatchedPasscode(null);
      setVerificationCodeInput("");
    }
    // Auto-suggest student name if empty and valid confirmed academy email
    if (!voterName && isRegisteredSchoolEmail(newVal)) {
      setVoterName(getEmailDisplayName(newVal));
    }
  };

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
      { name: "Eric Mwangi", position: "FWD", number: 7 },
      { name: "Samuel Kariuki", position: "MID", number: 6 },
      { name: "John Kamau", position: "GK", number: 1 },
      { name: "Peter Otieno", position: "DEF", number: 3 },
    ];

    return [
      ...homeSquad.map((p) => ({ ...p, teamName: homeTeam.name, teamColor: homeTeam.color })),
      ...awaySquad.map((p) => ({ ...p, teamName: awayTeam.name, teamColor: awayTeam.color })),
    ];
  }, [homeTeam, awayTeam]);

  // Current match poll data
  const currentPoll: MvpVoteRecord = useMemo(() => {
    if (pollData[selectedMatchId]) {
      return pollData[selectedMatchId];
    }
    // Default seed if Match 1
    if (selectedMatchId === 1) {
      return {
        matchId: 1,
        isOpen: true,
        votes: {
          "Kevin Omondi": {
            votesCount: 18,
            teamName: homeTeam.name,
            position: "FWD",
            number: 9,
          },
          "Dan Kiprop": {
            votesCount: 9,
            teamName: homeTeam.name,
            position: "MID",
            number: 8,
          },
          "Eric Mwangi": {
            votesCount: 5,
            teamName: awayTeam.name,
            position: "FWD",
            number: 7,
          },
          "John Kamau": {
            votesCount: 2,
            teamName: awayTeam.name,
            position: "GK",
            number: 1,
          },
        },
        voterEmails: ["student.council@mpesa.ac.ke", "sports.captain@mpesa.ac.ke"],
      };
    }
    return {
      matchId: selectedMatchId,
      isOpen: true,
      votes: {},
      voterEmails: [],
    };
  }, [pollData, selectedMatchId, homeTeam.name, awayTeam.name]);

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

  // Check if voter email has already voted for this match
  const normalizedInputEmail = voterEmail.trim().toLowerCase();
  const hasAlreadyVoted = Boolean(
    normalizedInputEmail && currentPoll.voterEmails.includes(normalizedInputEmail),
  );

  // Step 1: Send School Email Verification Code
  const handleRequestVerification = () => {
    setVerificationError(null);
    const emailNorm = voterEmail.trim().toLowerCase();

    if (!emailNorm || !emailNorm.includes("@")) {
      setVerificationError("Please enter a valid school email address.");
      return;
    }

    if (!isRegisteredSchoolEmail(emailNorm)) {
      setVerificationError(
        "Email address not confirmed in the official academy voter roster. Only verified M-Pesa Foundation Academy student and staff emails from the authorized list are permitted to vote.",
      );
      return;
    }

    if (currentPoll.voterEmails.includes(emailNorm)) {
      setVerificationError(
        "⛔ You have already voted for this match MVP. Only 1 vote per registered school email is permitted.",
      );
      return;
    }

    // Generate 4-digit verification passcode
    const { code } = generateVerificationCode(emailNorm);
    setDispatchedPasscode(code);
    setVerificationStep("code_sent");
    setVerificationCodeInput("");
    showToast(`✓ Verification passcode dispatched for ${emailNorm}`);
  };

  // Step 2: Confirm 4-Digit Verification Code
  const handleConfirmVerificationCode = () => {
    setVerificationError(null);
    const emailNorm = voterEmail.trim().toLowerCase();
    const result = verifySchoolEmailCode(emailNorm, verificationCodeInput);

    if (result.valid) {
      setVerificationStep("verified");
      setVerifiedEmail(emailNorm);
      setDispatchedPasscode(null);
      showToast("✓ School email verified! You may now cast your single official ballot.");
    } else {
      setVerificationError(result.message);
    }
  };

  // Step 3: Handle member casting a vote
  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPoll.isOpen) {
      showToast("⚠️ MVP Voting for this match is currently closed.");
      return;
    }

    const emailNorm = voterEmail.trim().toLowerCase();

    // Verification check
    if (verificationStep !== "verified" || verifiedEmail !== emailNorm) {
      showToast(
        "⚠️ Your registered school email must be verified first before casting your ballot.",
      );
      return;
    }

    // Single vote check
    if (currentPoll.voterEmails.includes(emailNorm)) {
      showToast(
        "⛔ You have already voted for this match MVP. Only 1 vote per member is permitted.",
      );
      return;
    }

    if (!selectedCandidate) {
      showToast("⚠️ Please select a player candidate to cast your vote.");
      return;
    }

    const candidateObj = matchCandidates.find((c) => c.name === selectedCandidate);
    const existingCandidateVotes = currentPoll.votes[selectedCandidate] || {
      votesCount: 0,
      teamName: candidateObj?.teamName || "Academy Player",
      position: candidateObj?.position || "FWD",
      number: candidateObj?.number || 10,
      playerPhoto: candidateObj?.photoUrl,
      voters: [],
    };

    const voterEntry = {
      name: voterName.trim() || getEmailDisplayName(emailNorm),
      email: emailNorm,
      votedAt:
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " • " +
        new Date().toLocaleDateString(),
    };

    const currentVoters = existingCandidateVotes.voters || [];

    const updatedPoll: MvpVoteRecord = {
      ...currentPoll,
      votes: {
        ...currentPoll.votes,
        [selectedCandidate]: {
          ...existingCandidateVotes,
          votesCount: existingCandidateVotes.votesCount + 1,
          voters: [...currentVoters, voterEntry],
        },
      },
      voterEmails: [...currentPoll.voterEmails, emailNorm],
    };

    const updatedAll = {
      ...pollData,
      [selectedMatchId]: updatedPoll,
    };

    persistPollData(updatedAll);
    showToast(`✓ Ballot officially recorded for ${selectedCandidate}!`);
    setSelectedCandidate(null);
  };

  // Super Admin: Copy Shareable Voting Link
  const handleCopyVotingLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/mvp-voting?matchId=${selectedMatchId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast("✓ Shareable MVP Voting link copied to clipboard!");
    }
  };

  // Super Admin: Close/Reopen Poll
  const handleToggleVotingStatus = () => {
    if (!canAdminVoting) return;
    const newStatus = !currentPoll.isOpen;

    let winnerObj = currentPoll.officialWinner;
    if (!newStatus && leadingCandidate) {
      winnerObj = {
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
      officialWinner: winnerObj,
    };

    const updatedAll = {
      ...pollData,
      [selectedMatchId]: updatedPoll,
    };

    persistPollData(updatedAll);
    showToast(
      newStatus
        ? "✓ Voting poll reopened for ballots."
        : `✓ Poll concluded! ${leadingCandidate ? leadingCandidate.name : "Winner"} officially crowned MVP.`,
    );
  };

  // Super Admin: Reset Poll
  const handleResetPoll = () => {
    if (!canAdminVoting) return;
    if (window.confirm("Are you sure you want to reset all votes for this match?")) {
      const updatedPoll: MvpVoteRecord = {
        matchId: selectedMatchId,
        isOpen: true,
        votes: {},
        voterEmails: [],
      };
      const updatedAll = {
        ...pollData,
        [selectedMatchId]: updatedPoll,
      };
      persistPollData(updatedAll);
      showToast("✓ Match poll has been reset.");
    }
  };

  // Super Admin: Register new school email
  const handleAddSchoolEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolEmailInput.trim()) return;
    addRegisteredSchoolEmail(newSchoolEmailInput.trim());
    setNewSchoolEmailInput("");
    showToast("✓ School email added to verified voter roster.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black">
              Official eFootball Ballot
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                currentPoll.isOpen
                  ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-rose-400/20 text-rose-300 border border-rose-400/30"
              }`}
            >
              {currentPoll.isOpen ? "Voting Live" : "Voting Concluded"}
            </span>
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified School Emails Only (1 Vote)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-3">
            <span>Match MVP Voting</span>
            <Trophy className="w-7 h-7 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Cast your official vote for the match's most outstanding performer. Strict single-vote
            enforcement.
          </p>
        </div>

        {/* Fixture Selector & Super Admin Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Match Picker */}
          <div className="flex items-center gap-2 bg-[#141029] border border-[#2e2554] p-2 rounded-2xl">
            <span className="text-[10px] text-gray-400 font-bold uppercase pl-1">Match:</span>
            <select
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(Number(e.target.value));
                setVerificationStep("unverified");
                setVerifiedEmail(null);
                setDispatchedPasscode(null);
              }}
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            title="Copy shareable link for league members to vote"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          {/* Super Admin Control Buttons */}
          {canAdminVoting && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleVotingStatus}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
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
                <span>{currentPoll.isOpen ? "Close Poll" : "Reopen"}</span>
              </button>

              <button
                onClick={() => setShowVoterAudit(!showVoterAudit)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                  showVoterAudit
                    ? "bg-cyan-500/20 text-[#00f0ff] border-cyan-400/40"
                    : "bg-[#141029] text-gray-300 border-[#2e2554] hover:text-white"
                }`}
              >
                Voter Audit ({currentPoll.voterEmails.length})
              </button>

              <button
                onClick={handleResetPoll}
                className="p-2 rounded-xl bg-[#141029] border border-[#2e2554] text-gray-400 hover:text-rose-400 transition cursor-pointer"
                title="Reset Poll Votes"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Super Admin Voter Audit Desk & Reset Interface */}
      {canAdminVoting && showVoterAudit && (
        <AdminVotingVoterAudit
          matchId={selectedMatchId}
          matchweek={currentMatch.matchweek}
          matchTitle={`${homeTeam.name} vs ${awayTeam.name}`}
          matchDate={currentMatch.date}
          currentPoll={currentPoll}
          onUpdatePoll={(updated) => {
            const updatedAll = {
              ...pollData,
              [selectedMatchId]: updated,
            };
            persistPollData(updatedAll);
          }}
          onShowToast={showToast}
        />
      )}

      {/* Match Clásico Header Banner */}
      <div className="bg-gradient-to-r from-[#141029] via-[#1a1438] to-[#141029] border border-[#2e2554] p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
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
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Student Name"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-black uppercase text-gray-400 block">
                        Registered School Email
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono">
                        1 vote per member
                      </span>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="e.g. student@mpesa.ac.ke"
                      value={voterEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      disabled={verificationStep === "verified"}
                      className={`w-full bg-[#141029] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        verificationStep === "verified"
                          ? "border-emerald-400/60 bg-emerald-950/20 text-emerald-200"
                          : "border-[#2e2554] focus:border-amber-400"
                      }`}
                    />
                    {/* Live Confirmation Status Badge */}
                    {voterEmail.trim().length > 3 && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                        {emailStatus?.isConfirmed ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Confirmed Academy Voter: {emailStatus.displayName}</span>
                          </span>
                        ) : voterEmail.includes("@") ? (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Email not found in confirmed 344-member academy voter list</span>
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {/* Already Voted Notice */}
                {hasAlreadyVoted && (
                  <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                    <div>
                      <strong className="block font-black uppercase">Ballot Already Cast</strong>
                      <span>
                        This registered school email (<strong>{normalizedInputEmail}</strong>) has
                        already voted for this fixture. Exactly 1 vote per member is permitted.
                      </span>
                    </div>
                  </div>
                )}

                {/* Email Verification Step Box */}
                {!hasAlreadyVoted && (
                  <div className="p-3.5 rounded-2xl bg-[#141029] border border-[#2e2554] space-y-2.5">
                    {/* State A: Unverified */}
                    {verificationStep === "unverified" && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="text-xs text-gray-300">
                            Registered school emails must be verified first before balloting.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRequestVerification}
                          disabled={!voterEmail.trim()}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify School Email</span>
                        </button>
                      </div>
                    )}

                    {/* State B: Code Sent */}
                    {verificationStep === "code_sent" && (
                      <div className="space-y-3">
                        {/* Simulated School Mailbox Alert Banner */}
                        {dispatchedPasscode && (
                          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-cyan-200">
                              <Send className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>
                                Passcode dispatched to <strong>{voterEmail}</strong>.
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg border border-cyan-400/30">
                              <span className="text-[10px] text-gray-400 uppercase font-mono">
                                Code:
                              </span>
                              <strong className="text-cyan-300 font-mono tracking-widest text-sm">
                                {dispatchedPasscode}
                              </strong>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <div className="relative flex-1 w-full">
                            <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="Enter 4-Digit Passcode"
                              value={verificationCodeInput}
                              onChange={(e) => setVerificationCodeInput(e.target.value)}
                              className="w-full bg-[#090615] border border-amber-400/40 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-amber-300 tracking-widest placeholder-gray-500 outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={handleConfirmVerificationCode}
                              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase transition cursor-pointer"
                            >
                              Confirm Code
                            </button>
                            <button
                              type="button"
                              onClick={handleRequestVerification}
                              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition"
                            >
                              Resend
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* State C: Verified */}
                    {verificationStep === "verified" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Verified School Voter: {verifiedEmail}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationStep("unverified");
                            setVerifiedEmail(null);
                          }}
                          className="text-[10px] text-gray-400 hover:text-white underline font-mono"
                        >
                          Change Email
                        </button>
                      </div>
                    )}

                    {/* Verification Error */}
                    {verificationError && (
                      <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{verificationError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Candidate Selection List (Locked until verified) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase text-gray-400 block">
                    Select Match MVP Candidate
                  </label>
                  {verificationStep !== "verified" && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Verify school email first to unlock candidates
                    </span>
                  )}
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar ${
                    verificationStep !== "verified" ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {matchCandidates.map((c, idx) => {
                    const isSelected = selectedCandidate === c.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (verificationStep === "verified") {
                            setSelectedCandidate(c.name);
                          }
                        }}
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
                disabled={
                  verificationStep !== "verified" ||
                  !selectedCandidate ||
                  hasAlreadyVoted ||
                  !currentPoll.isOpen
                }
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <Vote className="w-4 h-4" />
                <span>
                  {hasAlreadyVoted
                    ? "Ballot Already Cast for This Match (1 Allowed)"
                    : verificationStep !== "verified"
                      ? "Verify School Email to Cast Ballot"
                      : !selectedCandidate
                        ? "Select Player Candidate Above"
                        : "Submit Official MVP Vote (1 Vote Allowed)"}
                </span>
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
              <p className="text-xs text-gray-500 italic py-2">
                No votes recorded yet for this fixture.
              </p>
            ) : (
              sortedVoteTally.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-1.5">
                      {idx === 0 && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{item.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        ({item.teamName})
                      </span>
                    </span>
                    <span className="font-mono text-gray-300">
                      {item.votesCount} {item.votesCount === 1 ? "vote" : "votes"} (
                      {item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#141029] h-2 rounded-full overflow-hidden border border-[#2e2554]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                          : "bg-gradient-to-r from-cyan-400 to-blue-500"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Official MVP Podium Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#18113c] via-[#100c2a] to-[#0a071d] border-2 border-amber-400/40 p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-5">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>
                  {currentPoll.isOpen ? "Current Poll Leader" : "Official Match MVP Winner"}
                </span>
              </span>

              {leadingCandidate && (
                <span className="text-xs font-mono font-bold text-[#00f0ff]">
                  {leadingCandidate.percentage}% of Ballots
                </span>
              )}
            </div>

            {leadingCandidate ? (
              <div className="text-center space-y-3 py-2">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 mx-auto shadow-2xl shadow-amber-500/30">
                    <div className="w-full h-full bg-[#0e0a26] rounded-[22px] flex items-center justify-center overflow-hidden">
                      {leadingCandidate.playerPhoto ? (
                        <img
                          src={leadingCandidate.playerPhoto}
                          alt={leadingCandidate.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Award className="w-12 h-12 text-amber-400" />
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>#1 MVP</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-wider">
                    {leadingCandidate.name}
                  </h4>
                  <p className="text-xs text-amber-300 font-bold">
                    {leadingCandidate.teamName} • #{leadingCandidate.number || 10} •{" "}
                    {leadingCandidate.position || "FWD"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-left">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554]">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Poll Votes
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      {leadingCandidate.votesCount}
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554]">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Vote Share
                    </span>
                    <span className="text-lg font-black text-[#00f0ff] font-mono">
                      {leadingCandidate.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <Award className="w-12 h-12 text-gray-600 mx-auto" />
                <h4 className="text-sm font-bold text-gray-400 uppercase">Awaiting First Ballot</h4>
                <p className="text-xs text-gray-500">
                  Verify your school email and cast the opening vote for this match.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cumulative MVP Winners Records Table (Permanent Feature) */}
      <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
          <div>
            <h3 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Official MVP Hall of Fame • Cumulative Winners Records Table
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Certified matchweek winners remain permanently preserved in this records table even
              when individual match voting logs are cleared.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
            {mvpHistory.length} Certified Champions
          </span>
        </div>

        {mvpHistory.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-4 text-center">
            No MVP champions certified yet. Once a matchweek poll concludes, the winner will be
            archived here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#2e2554] text-[10px] uppercase font-bold text-gray-400 bg-[#141029]/60">
                  <th className="py-2.5 px-3">MW</th>
                  <th className="py-2.5 px-3">MVP Champion</th>
                  <th className="py-2.5 px-3">Club</th>
                  <th className="py-2.5 px-3 text-center">Ballots Won</th>
                  <th className="py-2.5 px-3 text-center">Vote Share</th>
                  <th className="py-2.5 px-3">Certified On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1742]">
                {mvpHistory.map((w) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
