import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRoleAccess, ROLE_HIERARCHY_DATA, type LeagueRole } from "../hooks/useRoleAccess";
import { DEFAULT_TEAMS, DEFAULT_FIXTURES, isTeamDeleted } from "../lib/fixturesData";
import {
  Crown,
  Shield,
  Users,
  Award,
  Calendar,
  FileText,
  Vote,
  Activity,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  Search,
  Copy,
  ExternalLink,
  Trash2,
  RefreshCw,
  Edit3,
  Plus,
  Send,
  Download,
  Upload,
  Lock,
  Unlock,
  Eye,
  Radio,
  BookOpen,
  DollarSign,
  Briefcase,
  Layers,
  Flag,
} from "lucide-react";
import { BoardMemberManager } from "./BoardMemberManager";

interface AdminSquadPlayer {
  name: string;
  number?: number;
  position?: string;
  photoUrl?: string;
  admissionNumber?: string;
  email?: string;
  age?: number;
  isSuspended?: boolean;
  documentsVerified?: boolean;
}

interface AdminTeam {
  id: number;
  name: string;
  color?: string;
  shortCode?: string;
  homePitch?: string;
  squad?: AdminSquadPlayer[];
  captain?: string;
  coach?: { name?: string; role?: string; email?: string; photoUrl?: string };
}

export function BoardWorkspaces() {
  const { currentRole, isSuperAdmin, roleDetails, switchRole } = useRoleAccess();

  // Active workspace role
  const [activeWorkspaceRole, setActiveWorkspaceRole] = useState<LeagueRole | "TEAM_MANAGERS">(
    isSuperAdmin ? "SUPER_ADMIN" : currentRole === "GUEST" ? "PRESIDENT" : currentRole,
  );

  useEffect(() => {
    if (isSuperAdmin) {
      setActiveWorkspaceRole("SUPER_ADMIN");
    } else if (currentRole && currentRole !== "GUEST") {
      setActiveWorkspaceRole(currentRole);
    }
  }, [currentRole, isSuperAdmin]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Shared state loaded from localStorage
  const [teams, setTeams] = useState<AdminTeam[]>(DEFAULT_TEAMS as unknown as AdminTeam[]);
  const [fixtures, setFixtures] = useState(DEFAULT_FIXTURES);

  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const nonDeleted = parsed.filter((t: AdminTeam) => !isTeamDeleted(t.id, t.name));
          if (nonDeleted.length > 0) setTeams(nonDeleted);
        }
      }
      const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedFixtures) {
        const parsed = JSON.parse(storedFixtures);
        if (Array.isArray(parsed) && parsed.length > 0) setFixtures(parsed);
      }
    } catch {
      // Ignore
    }
  }, []);

  // -------------------------------------------------------------
  // 1. PRESIDENT — Bramuel Amirah State
  // -------------------------------------------------------------
  const [appeals, setAppeals] = useState([
    {
      id: "app-1",
      club: "Young Stars City",
      matchId: 1,
      subject: "Protest regarding Matchweek 1 Pitch Condition & Added Time",
      submittedBy: "Head Coach Kimani",
      status: "UNDER_REVIEW",
      evidenceSummary: "Referee report and timekeeper sheet submitted.",
      ruling: "Pending final review by Supreme Council.",
    },
    {
      id: "app-2",
      club: "Royal Rangers",
      matchId: 2,
      subject: "Clarification on Conduct Bonus Points Allocation",
      submittedBy: "Captain Levis Wanyama",
      status: "RESOLVED",
      evidenceSummary: "Scripture recitation confirmed by field chaplain.",
      ruling: "Bonus points verified and recorded to official ledger.",
    },
  ]);
  const [hearingMinutes, setHearingMinutes] = useState("");
  const [hearingVerdict, setHearingVerdict] = useState("UPHELD");
  const [selectedAppealId, setSelectedAppealId] = useState("app-1");

  // Policy & Constitution Amendment Portal State
  const [amendmentTitle, setAmendmentTitle] = useState("");
  const [amendmentArticle, setAmendmentArticle] = useState(
    "Article IV: Eligibility & Squad Limits",
  );
  const [amendmentText, setAmendmentText] = useState("");
  const [publishedAmendments, setPublishedAmendments] = useState([
    {
      id: "amend-1",
      title: "Mandatory 15-Player Squad Cap Restriction",
      article: "Article IV, Section 2",
      text: "All registered clubs must strictly maintain a roster of no more than 15 players per competitive season.",
      date: "2026-10-18",
    },
  ]);

  // Board Voting & Motions Console State
  const [activeMotions, setActiveMotions] = useState([
    {
      id: "motion-1",
      title: "Motion to Approve Easter Knockout Cup Schedule & Venues",
      deadline: "Sunday, Oct 25, 2026 at 23:59 EAT",
      yesVotes: ["Bramuel Amirah (President)", "Joseph Kamande (Deputy)", "Tonnie Mark (Records)"],
      noVotes: [],
      status: "OPEN",
    },
  ]);
  const [newMotionTitle, setNewMotionTitle] = useState("");
  const [newMotionDeadline, setNewMotionDeadline] = useState("Sunday, Nov 01, 2026 at 23:59 EAT");

  // -------------------------------------------------------------
  // 2. DEPUTY PRESIDENT — Joseph Kamande State
  // -------------------------------------------------------------
  const [actingPresidentOverride, setActingPresidentOverride] = useState(false);
  const [taskForces, setTaskForces] = useState([
    {
      id: "tf-1",
      name: "Tournament Grounds Safety & Line Marking Inspection",
      assignedTo: "Joseph Kamande & Field Stewards",
      progress: 85,
      status: "IN_PROGRESS",
    },
    {
      id: "tf-2",
      name: "Emergency First Aid & Medical Defibrillator Readiness",
      assignedTo: "Parish Health Officers",
      progress: 100,
      status: "COMPLETED",
    },
  ]);
  const [newTaskForceName, setNewTaskForceName] = useState("");
  const [newTaskForceAssignee, setNewTaskForceAssignee] = useState("");

  const [escalations, setEscalations] = useState([
    {
      id: "esc-1",
      department: "Match Officiating",
      issue: "Assistant referee assignment pending for Samba Arena Pitch 2",
      priority: "HIGH",
      sentAt: "2026-10-23 11:20 EAT",
    },
  ]);
  const [escalationDept, setEscalationDept] = useState("Match Officiating");
  const [escalationNote, setEscalationNote] = useState("");

  // -------------------------------------------------------------
  // 3. REGISTER & REGULATIONS — Cheryl Cosmas State
  // -------------------------------------------------------------
  const [clubRegistrations, setClubRegistrations] = useState([
    {
      id: "reg-1",
      clubName: "Royal Rangers",
      parish: "St. Mark Parish",
      staffVerified: true,
      licenseIssued: true,
      status: "APPROVED",
    },
    {
      id: "reg-2",
      clubName: "Bethany Warriors FC",
      parish: "Bethany Youth Ministry",
      staffVerified: true,
      licenseIssued: false,
      status: "PENDING_REVIEW",
    },
  ]);

  const [eligibilityAuditLogs, setEligibilityAuditLogs] = useState([
    {
      id: "ea-1",
      player: "Kevin Omondi",
      club: "Samba",
      age: 17,
      division: "Youth Division",
      status: "PASSED",
      notes: "School ID and parental consent verified.",
    },
    {
      id: "ea-2",
      player: "Junior Kibet",
      club: "Mzinga",
      age: 18,
      division: "Under-15 Cadets",
      status: "FLAGGED_OVERAGE",
      notes: "Age exceeds division limit. Transfer to Open Youth required.",
    },
  ]);

  const [violations, setViolations] = useState([
    {
      id: "viol-1",
      club: "Young Stars City",
      type: "Kit Non-Compliance",
      details: "Away kit colors collided with referee uniform.",
      action: "Notice Issued",
      date: "2026-10-20",
    },
  ]);
  const [newViolationClub, setNewViolationClub] = useState("Young Stars City");
  const [newViolationType, setNewViolationType] = useState("Ineligible Player");
  const [newViolationDetails, setNewViolationDetails] = useState("");

  // -------------------------------------------------------------
  // 4. MATCH OFFICIATING — Mitchelle Muthoni State
  // -------------------------------------------------------------
  const [refereeAssignments, setRefereeAssignments] = useState([
    {
      matchId: 1,
      matchweek: 1,
      fixture: "Samba vs Young Stars City",
      centerRef: "Ian Muli (FIFA Badge)",
      assistant1: "David Kariuki",
      assistant2: "Samuel Ouma",
      fourthOfficial: "Peter Kiptoo",
      fieldDelegate: "Pastor Francis",
      conflictCheck: "PASSED (No Home Club Affiliation)",
    },
    {
      matchId: 2,
      matchweek: 2,
      fixture: "Royal Rangers vs Mzinga",
      centerRef: "Moses Mwangi",
      assistant1: "George Mutiso",
      assistant2: "Charles Ndwiga",
      fourthOfficial: "Simon Lagat",
      fieldDelegate: "Deacon John",
      conflictCheck: "PASSED (Neutral Official)",
    },
  ]);

  const [refereeReports, setRefereeReports] = useState([
    {
      matchId: 1,
      referee: "Ian Muli",
      score: "3 - 2",
      conductScore: "9.8/10",
      pitchRating: "Grade A (Excellent)",
      incidents: "No verbal or physical dissent. Joint prayer observed.",
    },
  ]);

  const [refereeGrievances, setRefereeGrievances] = useState<
    Array<{ id: string; referee: string; incident: string; action: string }>
  >([]);
  const [newGrievanceRef, setNewGrievanceRef] = useState("Ian Muli");
  const [newGrievanceIncident, setNewGrievanceIncident] = useState("");

  // -------------------------------------------------------------
  // 5. RECORDS & FILE MANAGER — Tonnie Mark Odundo State
  // -------------------------------------------------------------
  const [digitalVaultFiles, setDigitalVaultFiles] = useState([
    {
      id: "vault-1",
      name: "Supreme_Council_Constitution_2026.pdf",
      category: "Constitution",
      date: "2026-10-15",
      size: "2.4 MB",
    },
    {
      id: "vault-2",
      name: "Matchweek_1_Certified_Scorecard_Ledger.pdf",
      category: "Match Reports",
      date: "2026-10-25",
      size: "1.1 MB",
    },
    {
      id: "vault-3",
      name: "Pitch_Lease_Agreement_Academy_Grounds.pdf",
      category: "Contracts",
      date: "2026-09-01",
      size: "3.8 MB",
    },
  ]);

  const [disciplinaryCardLedger, setDisciplinaryCardLedger] = useState([
    {
      player: "Ali Guyo",
      club: "Royal Rangers",
      yellows: 1,
      reds: 0,
      suspensionStatus: "CLEARED (0 Match Ban)",
    },
    {
      player: "Kelvin Mutua",
      club: "Samba",
      yellows: 2,
      reds: 0,
      suspensionStatus: "WARNING (1 Yellow away from 1-match ban)",
    },
    {
      player: "Jaycrack",
      club: "Thunder FC",
      yellows: 1,
      reds: 0,
      suspensionStatus: "CLEARED",
    },
  ]);

  // -------------------------------------------------------------
  // 6. TECHNOLOGICAL MANAGER — Trady Lewis State
  // -------------------------------------------------------------
  const [webPublishQueue, setWebPublishQueue] = useState([
    {
      id: "pub-1",
      title: "Matchweek 1 Official Standings & Fair Play Points Published",
      pushedToLive: true,
      time: "2026-10-25 18:00 EAT",
    },
    {
      id: "pub-2",
      title: "Championship Derby Matchweek 2 Media Carousel Banner",
      pushedToLive: true,
      time: "2026-10-25 19:30 EAT",
    },
  ]);
  const [systemUptime] = useState("99.98%");
  const [dataSyncStatus, setDataSyncStatus] = useState("SYNCHRONIZED");

  // -------------------------------------------------------------
  // 7. ASSISTANT TECH MANAGER — Ahmed Kusow State
  // -------------------------------------------------------------
  const [contentDrafts, setContentDrafts] = useState([
    {
      id: "draft-1",
      title: "Player of the Week: Kevin Omondi's Opening Day Brace",
      status: "READY_FOR_APPROVAL",
      submittedBy: "Ahmed Kusow",
    },
    {
      id: "draft-2",
      title: "Upcoming Derby Preview: Defense vs Attack",
      status: "DRAFTING",
      submittedBy: "Ahmed Kusow",
    },
  ]);
  const [helpdeskTickets, setHelpdeskTickets] = useState([
    {
      id: "tick-1",
      requester: "Coach Kibet (Royal Rangers)",
      issue: "Password reset for Team Manager portal",
      status: "RESOLVED",
    },
    {
      id: "tick-2",
      requester: "Referee Moses Mwangi",
      issue: "Match sheet PDF upload verification",
      status: "OPEN",
    },
  ]);

  const currentMeta =
    activeWorkspaceRole === "TEAM_MANAGERS"
      ? {
          key: "TEAM_MANAGERS" as unknown as LeagueRole,
          tier: 8,
          title: "Team Managers & Captains Hub",
          officialName: "Club Leadership Delegation",
          department: "4 Official League Clubs",
          badgeColor: "from-emerald-400 to-cyan-500",
          responsibilities: [
            "Official starter roster confirmation & check-in",
            "Player photo upload dispatch to squad members",
            "Matchday kit coordination and captain briefing",
          ],
        }
      : ROLE_HIERARCHY_DATA[activeWorkspaceRole] || ROLE_HIERARCHY_DATA.PRESIDENT;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black px-6 py-3 rounded-2xl shadow-2xl font-black flex items-center gap-2 border border-cyan-100 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0a21]/90 border border-[#2e2554] p-5 sm:p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-500 via-pink-500 to-[#00f0ff] text-white shadow">
              Executive Governance Suite
            </span>
            <span className="text-xs text-[#00f0ff] font-mono">
              Tier {currentMeta.tier} • {currentMeta.title}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1">
            {currentMeta.title} Workspace
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Dedicated operational command desk for {currentMeta.officialName} (
            {currentMeta.department}).
          </p>
        </div>

        {/* Role Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a071b] p-1.5 rounded-2xl border border-[#2e2554]">
          {[
            { id: "PRESIDENT", label: "President", icon: Crown },
            { id: "DEPUTY_PRESIDENT", label: "Deputy", icon: Shield },
            { id: "REGULATIONS_MANAGER", label: "Registrar", icon: FileText },
            { id: "MATCH_OFFICIATING_MANAGER", label: "Officiating", icon: Flag },
            { id: "RECORDS_MANAGER", label: "Records", icon: BookOpen },
            { id: "TECH_MANAGER", label: "Tech Mgr", icon: Activity },
            { id: "ASST_TECH_MANAGER", label: "Asst Tech", icon: Layers },
          ].map((r) => {
            const Icon = r.icon;
            const isActive = activeWorkspaceRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveWorkspaceRole(r.id as LeagueRole)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          ROLE 1: PRESIDENT — BRAMUEL AMIRAH
          Executive KPI, Disputes Desk, Policy Amendment, Board Voting
          ======================================================== */}
      {activeWorkspaceRole === "PRESIDENT" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Executive KPI Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Active Clubs
              </span>
              <span className="text-xl font-black text-white font-mono">{teams.length} Clubs</span>
            </div>
            <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Registered Athletes
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {teams.reduce((acc, t) => acc + (t.squad?.length || 0), 0)} Players
              </span>
            </div>
            <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Treasury Status
              </span>
              <span className="text-xl font-black text-cyan-300 font-mono">Solvent</span>
            </div>
            <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Active Appeals
              </span>
              <span className="text-xl font-black text-yellow-300 font-mono">
                {appeals.length} Open
              </span>
            </div>
            <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Championship Rounds
              </span>
              <span className="text-xl font-black text-purple-300 font-mono">6 Matchweeks</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tool 1: Dispute & Appeals Hearing Desk */}
            <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Dispute & Appeals Hearing Desk
                </h4>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  Appellate Jurisdiction
                </span>
              </div>

              <div className="space-y-3">
                {appeals.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">
                        {app.club}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold uppercase">
                        {app.status}
                      </span>
                    </div>
                    <h6 className="text-xs font-black text-white">{app.subject}</h6>
                    <p className="text-[11px] text-gray-400">{app.evidenceSummary}</p>
                    <div className="text-[11px] text-emerald-400 font-mono bg-black/30 p-2 rounded-xl">
                      Ruling: {app.ruling}
                    </div>
                  </div>
                ))}

                {/* Hearing Minutes Input */}
                <div className="p-3 bg-[#0a071b] rounded-2xl border border-[#261f4d] space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">
                    Log Hearing Minutes & Final Board Ruling:
                  </label>
                  <textarea
                    rows={2}
                    value={hearingMinutes}
                    onChange={(e) => setHearingMinutes(e.target.value)}
                    placeholder="Enter official hearing evidence and binding decision..."
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl p-2.5 text-xs text-white outline-none resize-none"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={hearingVerdict}
                      onChange={(e) => setHearingVerdict(e.target.value)}
                      className="bg-[#141029] border border-[#2e2554] rounded-xl px-2.5 py-1 text-xs text-white"
                    >
                      <option value="UPHELD">Ruling: Result Upheld</option>
                      <option value="ORDER_REPLAY">Ruling: Order Match Replay</option>
                      <option value="FINE_ISSUED">Ruling: Disciplinary Fine Issued</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!hearingMinutes.trim()) return;
                        showToast(`✓ Appellate ruling logged: ${hearingVerdict}`);
                        setHearingMinutes("");
                      }}
                      className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-black text-xs uppercase hover:brightness-110"
                    >
                      Issue Ruling
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool 2: Board Voting & Motions Console */}
            <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Vote className="w-5 h-5 text-amber-400" />
                  Board Voting & Motions Console
                </h4>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  7-Member Quorum
                </span>
              </div>

              <div className="space-y-3">
                {activeMotions.map((motion) => (
                  <div
                    key={motion.id}
                    className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold uppercase">
                        {motion.status}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Closes: {motion.deadline}
                      </span>
                    </div>
                    <h5 className="text-xs font-black text-white">{motion.title}</h5>

                    <div className="p-2.5 bg-black/40 rounded-xl space-y-1 text-[11px] font-mono">
                      <div className="text-emerald-400 font-bold">
                        ✓ In Favor ({motion.yesVotes.length}/7): {motion.yesVotes.join(", ")}
                      </div>
                      <div className="text-rose-400 font-bold">
                        ✗ Against ({motion.noVotes.length}/7): None
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => showToast("✓ Presidential Aye vote confirmed!")}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-black transition"
                      >
                        Vote Aye (Yes)
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("✓ Presidential Nay vote recorded.")}
                        className="flex-1 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-black transition"
                      >
                        Vote Nay (No)
                      </button>
                    </div>
                  </div>
                ))}

                {/* Initiate New Board Motion */}
                <div className="p-3 bg-[#0a071b] rounded-2xl border border-[#261f4d] space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    Initiate Digital Board Vote:
                  </span>
                  <input
                    type="text"
                    value={newMotionTitle}
                    onChange={(e) => setNewMotionTitle(e.target.value)}
                    placeholder="Motion topic (e.g. Expand Roster Cap to 18 Players next season)"
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMotionTitle.trim()) return;
                      const created = {
                        id: `motion-${Date.now()}`,
                        title: newMotionTitle.trim(),
                        deadline: newMotionDeadline,
                        yesVotes: ["Bramuel Amirah (President)"],
                        noVotes: [],
                        status: "OPEN",
                      };
                      setActiveMotions([created, ...activeMotions]);
                      setNewMotionTitle("");
                      showToast("✓ Motion tabled for digital voting across all 7 board members!");
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase hover:brightness-110"
                  >
                    Table Motion for Council Vote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ROLE 2: DEPUTY PRESIDENT — JOSEPH KAMANDE
          Departmental Tracker, Acting Override, Task Forces, Escalations
          ======================================================== */}
      {activeWorkspaceRole === "DEPUTY_PRESIDENT" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Acting President Override Bar */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-[#0e0a26] border border-cyan-400/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  Acting President Authority Status:
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    actingPresidentOverride
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {actingPresidentOverride ? "FULL POWERS ACTIVE" : "STANDBY ASSISTANT"}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Toggle emergency executive approval powers when President Bramuel Amirah is absent
                or in session.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !actingPresidentOverride;
                setActingPresidentOverride(next);
                showToast(next ? "✓ Acting President Override ENGAGED." : "Override disengaged.");
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs uppercase transition cursor-pointer ${
                actingPresidentOverride
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                  : "bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
              }`}
            >
              {actingPresidentOverride ? "Disengage Override" : "Engage Acting President Powers"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Departmental Performance Tracker */}
            <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Departmental Performance Tracker (5 Departments)
              </h4>

              <div className="space-y-3">
                {[
                  {
                    dept: "Registration & Regulations",
                    lead: "Cheryl Cosmas",
                    task: "15-Player Cap & Age Checks",
                    progress: 100,
                  },
                  {
                    dept: "Match Officiating",
                    lead: "Mitchelle Muthoni",
                    task: "Referees Assigned for MW 2",
                    progress: 95,
                  },
                  {
                    dept: "Records & Files",
                    lead: "Tonnie Mark Odundo",
                    task: "MW 1 Match Sheets Certified",
                    progress: 100,
                  },
                  {
                    dept: "Technology & Digital",
                    lead: "Trady Lewis",
                    task: "Public Live Score Engine",
                    progress: 90,
                  },
                  {
                    dept: "Media & Continuity",
                    lead: "Ahmed Kusow",
                    task: "Weekend Match Recap Drafts",
                    progress: 85,
                  },
                ].map((item) => (
                  <div
                    key={item.dept}
                    className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-white">{item.dept}</span>
                        <span className="text-[10px] text-gray-400 block">Lead: {item.lead}</span>
                      </div>
                      <span className="font-mono text-cyan-300 font-bold">{item.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Task Force Manager */}
            <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                Special Operational Task Force Manager
              </h4>

              <div className="space-y-3">
                {taskForces.map((tf) => (
                  <div
                    key={tf.id}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-white">{tf.name}</h5>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold uppercase">
                        {tf.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 block">
                      Assigned: {tf.assignedTo}
                    </span>
                  </div>
                ))}

                <div className="p-3 bg-[#0a071b] rounded-2xl border border-[#261f4d] space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    Create Target-Specific Task Force:
                  </span>
                  <input
                    type="text"
                    value={newTaskForceName}
                    onChange={(e) => setNewTaskForceName(e.target.value)}
                    placeholder="Task force name (e.g. Derby Crowd Control Unit)"
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newTaskForceAssignee}
                    onChange={(e) => setNewTaskForceAssignee(e.target.value)}
                    placeholder="Assignee names (e.g. Joseph Kamande, Moses Mwangi)"
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTaskForceName.trim()) return;
                      const created = {
                        id: `tf-${Date.now()}`,
                        name: newTaskForceName.trim(),
                        assignedTo: newTaskForceAssignee.trim() || "Operational Crew",
                        progress: 0,
                        status: "IN_PROGRESS",
                      };
                      setTaskForces([created, ...taskForces]);
                      setNewTaskForceName("");
                      setNewTaskForceAssignee("");
                      showToast("✓ Operational Task Force commissioned!");
                    }}
                    className="w-full py-2 rounded-xl bg-cyan-400 text-black font-black text-xs uppercase hover:brightness-110"
                  >
                    Commission Task Force
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ROLE 3: REGISTER & REGULATIONS — CHERYL COSMAS
          Club Licenses, Player Eligibility Engine, Roster Disciplinary Check
          ======================================================== */}
      {activeWorkspaceRole === "REGULATIONS_MANAGER" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Club Verification & License Desk */}
            <div className="bg-[#0b0821] border border-emerald-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Club Registration & License Issuance
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  Regulatory Authority
                </span>
              </div>

              <div className="space-y-2.5">
                {clubRegistrations.map((club) => (
                  <div
                    key={club.id}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-black text-white">{club.clubName}</h5>
                      <span className="text-[10px] text-gray-400 block">{club.parish}</span>
                      <span className="text-[9px] text-emerald-400 font-mono">
                        {club.licenseIssued
                          ? "✓ Digital Participation License Active"
                          : "Pending License Seal"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = clubRegistrations.map((c) =>
                          c.id === club.id ? { ...c, licenseIssued: true, status: "APPROVED" } : c,
                        );
                        setClubRegistrations(updated);
                        showToast(`✓ Official Participation License sealed for ${club.clubName}!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-xs transition"
                    >
                      Issue License
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Player Eligibility & Age Verification Engine */}
            <div className="bg-[#0b0821] border border-emerald-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  Player Eligibility & Age Verification
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  15-Player Cap Audit
                </span>
              </div>

              <div className="space-y-2.5">
                {eligibilityAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">
                        {log.player} ({log.club})
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          log.status === "PASSED"
                            ? "bg-emerald-400/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">{log.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ROLE 4: MATCH OFFICIATING — MITCHELLE MUTHONI
          Referee Assignments, Conflict of Interest Filter, Match Reports
          ======================================================== */}
      {activeWorkspaceRole === "MATCH_OFFICIATING_MANAGER" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referee Assignment Console with Conflict of Interest Filter */}
            <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Flag className="w-5 h-5 text-cyan-400" />
                  Referee & Officials Match Scheduling Console
                </h4>
                <span className="text-[10px] text-cyan-300 font-mono font-bold">
                  Neutrality Filter Active
                </span>
              </div>

              <div className="space-y-3">
                {refereeAssignments.map((ra) => (
                  <div
                    key={ra.matchId}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{ra.fixture}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono font-bold">
                        {ra.conflictCheck}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-300 space-y-0.5 font-mono">
                      <div>
                        Center Ref: <span className="text-cyan-300 font-bold">{ra.centerRef}</span>
                      </div>
                      <div>
                        Lines: {ra.assistant1} & {ra.assistant2}
                      </div>
                      <div>
                        4th Official: {ra.fourthOfficial} • Chaplain: {ra.fieldDelegate}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "✓ Automated Neutrality & Conflict-of-Interest Filter verified for all fixtures!",
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-cyan-400 text-black font-black text-xs uppercase hover:brightness-110"
                >
                  Verify Neutral Referees Assignment
                </button>
              </div>
            </div>

            {/* Post-Match Referee Report Review Desk */}
            <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Referee Match Report Review Desk
                </h4>
                <span className="text-[10px] text-cyan-300 font-mono font-bold">
                  Official Score Sheets
                </span>
              </div>

              <div className="space-y-3">
                {refereeReports.map((rr, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-white">Referee: {rr.referee}</span>
                      <span className="font-mono text-amber-300 font-bold">Score: {rr.score}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Conduct Score: {rr.conductScore} • Pitch: {rr.pitchRating}
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug">{rr.incidents}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ROLE 5: RECORDS & FILES — TONNIE MARK ODUNDO
          Digital Vault, Scorecard Certification, Disciplinary Card Ledger
          ======================================================== */}
      {activeWorkspaceRole === "RECORDS_MANAGER" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Official League Digital Vault */}
            <div className="bg-[#0b0821] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-yellow-400" />
                  Official League Digital Vault & Contracts
                </h4>
                <span className="text-[10px] text-yellow-300 font-mono font-bold">
                  Archival Seal
                </span>
              </div>

              <div className="space-y-2.5">
                {digitalVaultFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div>
                      <h6 className="text-xs font-black text-white">{file.name}</h6>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {file.category} • {file.date} ({file.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`✓ File downloaded: ${file.name}`)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Disciplinary Card Tracking System & Auto-Calculated Bans */}
            <div className="bg-[#0b0821] border border-yellow-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Disciplinary Card Ledger & Ban Calculator
                </h4>
                <span className="text-[10px] text-yellow-300 font-mono font-bold">
                  3 Yellows = 1 Match Ban
                </span>
              </div>

              <div className="space-y-2.5">
                {disciplinaryCardLedger.map((record) => (
                  <div
                    key={record.player}
                    className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div>
                      <h6 className="text-xs font-black text-white">
                        {record.player} ({record.club})
                      </h6>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                        <span className="text-yellow-400 font-bold">{record.yellows} Yellows</span>
                        <span>•</span>
                        <span className="text-rose-400 font-bold">{record.reds} Reds</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-black/40 px-2 py-1 rounded-xl">
                      {record.suspensionStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ROLE 6: TECHNOLOGICAL MANAGER — TRADY LEWIS
          Public Publishing Console, Infrastructure Health, Live Score Engine
          ======================================================== */}
      {activeWorkspaceRole === "TECH_MANAGER" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Public Web Publishing Console */}
            <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Public Web Publishing Console
                </h4>
                <span className="text-[10px] text-purple-300 font-mono font-bold">
                  Live Stream Push
                </span>
              </div>

              <div className="space-y-3">
                {webPublishQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-black text-white">{item.title}</h5>
                      <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold uppercase">
                      LIVE ON SITE
                    </span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setDataSyncStatus("VERIFIED & RE-INDEXED");
                    showToast(
                      "✓ All player goal tallies verified against match sheets & pushed live!",
                    );
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs uppercase hover:brightness-110 shadow-lg"
                >
                  Push & Sync Live Standings to Public Viewer
                </button>
              </div>
            </div>

            {/* Platform Health & Infrastructure Monitor */}
            <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                Platform Health & Live Engine Status
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554]">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">
                    Server Uptime
                  </span>
                  <span className="text-base font-black text-emerald-400">{systemUptime}</span>
                </div>
                <div className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554]">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">
                    Data Integrity
                  </span>
                  <span className="text-base font-black text-cyan-300">{dataSyncStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ROLE 7: ASSISTANT TECH MANAGER — AHMED KUSOW
          Draft Queue, Media Asset Manager, Technical User Helpdesk
          ======================================================== */}
      {activeWorkspaceRole === "ASST_TECH_MANAGER" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Draft Queue */}
            <div className="bg-[#0b0821] border border-pink-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Layers className="w-5 h-5 text-pink-400" />
                  Editorial Drafts & Media Queue
                </h4>
                <span className="text-[10px] text-pink-300 font-mono font-bold">
                  Awaiting Tech Approval
                </span>
              </div>

              <div className="space-y-2.5">
                {contentDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-black text-white">{draft.title}</h5>
                      <span className="text-[10px] text-gray-400 font-mono">
                        By {draft.submittedBy}
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold uppercase">
                      {draft.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical User Helpdesk */}
            <div className="bg-[#0b0821] border border-pink-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-pink-400" />
                  Technical User Helpdesk & Support Queue
                </h4>
                <span className="text-[10px] text-pink-300 font-mono font-bold">
                  Club Managers & Refs
                </span>
              </div>

              <div className="space-y-2.5">
                {helpdeskTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-black text-white">{ticket.requester}</h5>
                      <p className="text-[11px] text-gray-300">{ticket.issue}</p>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ticket.status === "RESOLVED"
                          ? "bg-emerald-400/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ROLE 0: SUPER ADMIN (MASTER ADMINISTRATIVE HUB)
          ======================================================== */}
      {activeWorkspaceRole === "SUPER_ADMIN" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#0b0821] border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-black font-black">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase">
                    Supreme Council Board Member Management & Access Desk
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Assign, edit, regenerate access codes, or suspend board members across all 7
                    council tiers.
                  </p>
                </div>
              </div>
            </div>

            <BoardMemberManager />
          </div>
        </div>
      )}
    </div>
  );
}
