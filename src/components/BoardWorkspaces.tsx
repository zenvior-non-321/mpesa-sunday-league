import React, { useState, useEffect, useMemo } from "react";
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
  BookOpen,
  DollarSign,
  Briefcase,
  Layers,
  Flag,
  BarChart3,
  Scale,
  Scroll,
  CalendarDays,
  Sliders,
  ClipboardCheck,
  AlertTriangle,
  FolderArchive,
  HardDrive,
  Globe,
  Cpu,
  FileCheck,
  Headphones,
  Database,
  Sparkles,
  Star,
  Camera,
  QrCode,
  ShieldAlert,
  Flame,
  CheckSquare,
} from "lucide-react";

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
  const { currentRole, isSuperAdmin } = useRoleAccess();

  // Active workspace role selection (Defaults to user's assigned role or PRESIDENT)
  const [activeWorkspaceRole, setActiveWorkspaceRole] = useState<LeagueRole>(
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

  useEffect(() => {
    const handleSelectBoardSubTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ role?: LeagueRole; tab: string }>;
      if (customEvent.detail) {
        const { role, tab } = customEvent.detail;
        if (role) setActiveWorkspaceRole(role);
        if (tab) {
          if (["overview", "hearings", "policy", "voting", "approvals", "meeting"].includes(tab)) {
            setPresidentTab(tab as typeof presidentTab);
          }
          if (
            ["overview", "monitoring", "acting_override", "task_force", "escalations"].includes(tab)
          ) {
            setDeputyTab(tab as typeof deputyTab);
          }
          if (
            [
              "dashboard",
              "licensing",
              "player_verification",
              "eligibility_violations",
              "compliance_waivers",
            ].includes(tab)
          ) {
            setRegulationsTab(tab as typeof regulationsTab);
          }
          if (["overview", "scheduler", "ref_reports", "performance", "disputes"].includes(tab)) {
            setOfficiatingTab(tab as typeof officiatingTab);
          }
          if (
            [
              "vault_home",
              "doc_vault",
              "results_archive",
              "disciplinary_ledger",
              "decisions_registry",
            ].includes(tab)
          ) {
            setRecordsTab(tab as typeof recordsTab);
          }
          if (
            [
              "tech_overview",
              "website_cms",
              "live_publishing",
              "infrastructure",
              "integrity_audit",
            ].includes(tab)
          ) {
            setTechTab(tab as typeof techTab);
          }
          if (
            [
              "support_desk",
              "content_queue",
              "media_library",
              "user_support",
              "data_backup",
            ].includes(tab)
          ) {
            setAsstTechTab(tab as typeof asstTechTab);
          }
        }
      }
    };
    window.addEventListener("mpesa_select_board_sub_tab", handleSelectBoardSubTab);
    return () => {
      window.removeEventListener("mpesa_select_board_sub_tab", handleSelectBoardSubTab);
    };
  }, []);

  // =========================================================================
  // 1. PRESIDENT — Alex Haro State & Sub-Menu Tabs
  // =========================================================================
  const [presidentTab, setPresidentTab] = useState<
    "overview" | "hearings" | "policy" | "voting" | "approvals" | "meeting"
  >("overview");

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

  const [publishedAmendments, setPublishedAmendments] = useState([
    {
      id: "amend-1",
      title: "Mandatory 15-Player Squad Cap Restriction",
      article: "Article IV, Section 2",
      text: "All registered clubs must strictly maintain a roster of no more than 15 players per competitive season.",
      date: "2026-10-18",
    },
    {
      id: "amend-2",
      title: "Christian Fellowship & Sportsmanship Conduct Pledge",
      article: "Article II, Section 1",
      text: "Every matchday shall commence with unified pastoral prayer and scripture reading.",
      date: "2026-10-22",
    },
  ]);
  const [newAmendmentTitle, setNewAmendmentTitle] = useState("");
  const [newAmendmentArticle, setNewAmendmentArticle] = useState(
    "Article V: Match Disciplinary Protocol",
  );
  const [newAmendmentText, setNewAmendmentText] = useState("");

  const [activeMotions, setActiveMotions] = useState([
    {
      id: "motion-1",
      title: "Motion to Approve Easter Knockout Cup Schedule & Venues",
      deadline: "Sunday, Oct 25, 2026 at 23:59 EAT",
      yesVotes: ["Alex Haro (President)", "Babra Nandako (Deputy)", "Tonnie Mark (Records)"],
      noVotes: [] as string[],
      status: "OPEN",
    },
    {
      id: "motion-2",
      title: "Ratification of Digital YouTube Studio Anthem Playlist",
      deadline: "Friday, Oct 30, 2026 at 18:00 EAT",
      yesVotes: [
        "Alex Haro (President)",
        "Victor Kiplagat (Tech)",
        "Sturridge Ochongoi (Asst Tech)",
      ],
      noVotes: [] as string[],
      status: "PASSED",
    },
  ]);
  const [newMotionTitle, setNewMotionTitle] = useState("");

  const [clubApprovals, setClubApprovals] = useState([
    {
      id: "ca-1",
      name: "Bethany Warriors FC",
      parish: "Bethany Youth Ministry",
      status: "PENDING",
      requestedBy: "Pastor Silas O.",
    },
    {
      id: "ca-2",
      name: "Nazareth United",
      parish: "St. Luke Parish",
      status: "APPROVED",
      requestedBy: "Coach Dan K.",
    },
  ]);

  const [boardMeetings, setBoardMeetings] = useState([
    {
      id: "bm-1",
      title: "Quarterly Disciplinary Review & Trophy Planning",
      date: "Wednesday, Nov 04, 2026",
      time: "17:00 - 18:30 EAT",
      venue: "Executive Council Boardroom",
      status: "SCHEDULED",
    },
  ]);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("Wednesday, Nov 11, 2026");

  // =========================================================================
  // 2. DEPUTY PRESIDENT — Babra Nandako State & Sub-Menu Tabs
  // =========================================================================
  const [deputyTab, setDeputyTab] = useState<
    "overview" | "monitoring" | "acting_override" | "task_force" | "escalations"
  >("overview");

  const [actingPresidentOverride, setActingPresidentOverride] = useState(false);
  const [taskForces, setTaskForces] = useState([
    {
      id: "tf-1",
      name: "Tournament Grounds Safety & Line Marking Inspection",
      assignedTo: "Babra Nandako & Field Stewards",
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
    {
      id: "tf-3",
      name: "Matchday Water & Hydration Stations Audit",
      assignedTo: "Logistics Team",
      progress: 60,
      status: "IN_PROGRESS",
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
      resolved: false,
    },
    {
      id: "esc-2",
      department: "Registration",
      issue: "Duplicate student admission registration flagged in Young Stars",
      priority: "MEDIUM",
      sentAt: "2026-10-24 14:10 EAT",
      resolved: true,
    },
  ]);

  // =========================================================================
  // 3. REGISTER & REGULATIONS — Whitney Juma State & Sub-Menu Tabs
  // =========================================================================
  const [regulationsTab, setRegulationsTab] = useState<
    | "dashboard"
    | "licensing"
    | "player_verification"
    | "eligibility_violations"
    | "compliance_waivers"
  >("dashboard");

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
      club: "Samba Boys",
      age: 17,
      division: "Youth Division",
      status: "PASSED",
      notes: "School ID and parental consent verified.",
    },
    {
      id: "ea-2",
      player: "Junior Kibet",
      club: "Mzinga Boyz",
      age: 19,
      division: "Under-17 League",
      status: "FLAGGED_OVERAGE",
      notes: "Born 2007; exceeds division cutoff date.",
    },
    {
      id: "ea-3",
      player: "Dan Kiprop",
      club: "Royal Rangers",
      age: 16,
      division: "Youth Division",
      status: "PASSED",
      notes: "Medical waiver signed by parish physician.",
    },
  ]);

  const [pendingPlayerApprovals, setPendingPlayerApprovals] = useState([
    {
      id: "pa-1",
      name: "Moses Lengushuru",
      club: "Young Stars City",
      admissionNo: "ADM-9481",
      age: 16,
      docType: "Student ID Card",
      approved: false,
    },
    {
      id: "pa-2",
      name: "Gabriel Kathele",
      club: "Samba Boys",
      admissionNo: "ADM-7729",
      age: 17,
      docType: "Birth Certificate",
      approved: true,
    },
  ]);

  const [waiversTracker, setWaiversTracker] = useState([
    {
      id: "wv-1",
      athlete: "Kevin Omondi",
      club: "Samba Boys",
      consentSubmitted: true,
      medicalClearance: true,
      expiryDate: "2027-06-30",
    },
    {
      id: "wv-2",
      athlete: "Mark Musa",
      club: "Young Stars City",
      consentSubmitted: true,
      medicalClearance: false,
      expiryDate: "2026-12-31",
    },
  ]);

  // =========================================================================
  // 4. MATCH OFFICIATING — Idi Sebantu State & Sub-Menu Tabs
  // =========================================================================
  const [officiatingTab, setOfficiatingTab] = useState<
    "overview" | "scheduler" | "ref_reports" | "performance" | "disputes"
  >("overview");

  const [referees, setReferees] = useState([
    {
      id: "ref-bm",
      name: "Bidan Mwaura",
      badge: "Official League Referee",
      assignedMatches: 5,
      rating: 5.0,
      active: true,
    },
    {
      id: "ref-1",
      name: "Ian Muli",
      badge: "FIFA Center Referee",
      assignedMatches: 4,
      rating: 4.9,
      active: true,
    },
    {
      id: "ref-2",
      name: "Francis Ndirangu",
      badge: "Senior Assistant Referee",
      assignedMatches: 3,
      rating: 4.8,
      active: true,
    },
    {
      id: "ref-3",
      name: "Peter Otieno",
      badge: "Development Referee",
      assignedMatches: 2,
      rating: 4.6,
      active: true,
    },
  ]);

  const [chaplainAssignments, setChaplainAssignments] = useState([
    {
      id: "chap-1",
      matchweek: 1,
      fixture: "Samba Boys vs Young Stars City",
      chaplain: "Pastor David M.",
      prayerFocus: "Christian Brotherhood",
    },
    {
      id: "chap-2",
      matchweek: 2,
      fixture: "Royal Rangers vs Mzinga Boyz",
      chaplain: "Deaconess Grace W.",
      prayerFocus: "Fair Play & Peacemaking",
    },
  ]);

  const [incidentReports, setIncidentReports] = useState([
    {
      id: "inc-1",
      matchweek: 1,
      match: "Samba Boys vs Young Stars City",
      player: "Emmanuel Kipkorir",
      team: "Samba Boys",
      sanction: "YELLOW_CARD",
      minute: "42'",
      reason: "Reckless sliding tackle",
      refereeSignoff: "Ian Muli",
    },
    {
      id: "inc-2",
      matchweek: 2,
      match: "Royal Rangers vs Mzinga Boyz",
      player: "Vincent Andara",
      team: "Mzinga Boyz",
      sanction: "WARNING",
      minute: "78'",
      reason: "Dissent towards assistant flag call",
      refereeSignoff: "Francis Ndirangu",
    },
  ]);

  // =========================================================================
  // 5. RECORDS & FILE MANAGER — Tonnie Mark Odundo State & Sub-Menu Tabs
  // =========================================================================
  const [recordsTab, setRecordsTab] = useState<
    "vault_home" | "doc_vault" | "results_archive" | "disciplinary_ledger" | "decisions_registry"
  >("vault_home");

  const [documentVault, setDocumentVault] = useState([
    {
      id: "doc-1",
      title: "M-Pesa Sunday League Official Constitution & By-Laws (2026/27)",
      category: "Constitution & Regulations",
      date: "2026-10-01",
      verified: true,
    },
    {
      id: "doc-2",
      title: "Executive Council Minutes — Inaugural Season Opening Session",
      category: "Board Meeting Minutes",
      date: "2026-10-15",
      verified: true,
    },
    {
      id: "doc-3",
      title: "Grounds Lease & Pitch Facility Contract — Main Stadium Arena",
      category: "Grounds Contracts & Leases",
      date: "2026-10-10",
      verified: true,
    },
  ]);

  const [disciplinaryLedger, setDisciplinaryLedger] = useState([
    {
      id: "dl-1",
      player: "Emmanuel Kipkorir",
      team: "Samba Boys",
      yellows: 1,
      reds: 0,
      suspensionStatus: "CLEARED",
      finePaid: "Ksh 0",
    },
    {
      id: "dl-2",
      player: "Vincent Andara",
      team: "Mzinga Boyz",
      yellows: 0,
      reds: 0,
      suspensionStatus: "CLEARED",
      finePaid: "Ksh 0",
    },
  ]);

  const [seasonStandingsLocked, setSeasonStandingsLocked] = useState(false);

  // =========================================================================
  // 6. TECHNOLOGICAL MANAGER — Victor Kiplagat State & Sub-Menu Tabs
  // =========================================================================
  const [techTab, setTechTab] = useState<
    "tech_overview" | "website_cms" | "live_publishing" | "infrastructure" | "integrity_audit"
  >("tech_overview");

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
  const [cmsHeroHeadline, setCmsHeroHeadline] = useState(
    "M-Pesa Sunday League | eFootball Edition 2026",
  );
  const [liveFeedEnabled, setLiveFeedEnabled] = useState(true);

  // =========================================================================
  // 7. ASSISTANT TECH MANAGER — Sturridge Ochongoi State & Sub-Menu Tabs
  // =========================================================================
  const [asstTechTab, setAsstTechTab] = useState<
    "support_desk" | "content_queue" | "media_library" | "user_support" | "data_backup"
  >("support_desk");

  const [contentDrafts, setContentDrafts] = useState([
    {
      id: "draft-1",
      title: "Player of the Week: Kevin Omondi's Opening Day Brace",
      status: "READY_FOR_APPROVAL",
      submittedBy: "Sturridge Ochongoi",
      type: "Match Recap",
    },
    {
      id: "draft-2",
      title: "Upcoming Derby Preview: Defense vs Attack",
      status: "DRAFTING",
      submittedBy: "Sturridge Ochongoi",
      type: "Match Preview",
    },
    {
      id: "draft-3",
      title: "Midweek Devotional: 1 Cor 9:24 — Running for the Imperishable Crown",
      status: "READY_FOR_APPROVAL",
      submittedBy: "Sturridge Ochongoi",
      type: "Devotional",
    },
  ]);
  const [newDraftTitle, setNewDraftTitle] = useState("");
  const [newDraftType, setNewDraftType] = useState("Match Recap");

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

  const currentMeta = ROLE_HIERARCHY_DATA[activeWorkspaceRole] || ROLE_HIERARCHY_DATA.PRESIDENT;

  // Export full JSON backup
  const handleExportDatabase = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        teams,
        fixtures,
        appeals,
        amendments: publishedAmendments,
        motions: activeMotions,
        referees,
        disciplinaryLedger,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mpesa-sunday-league-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("✓ Comprehensive league database export downloaded successfully!");
    } catch {
      showToast("Database export completed.");
    }
  };

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
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2">
            {activeWorkspaceRole === "PRESIDENT" && "👑"}
            {activeWorkspaceRole === "DEPUTY_PRESIDENT" && "🥈"}
            {activeWorkspaceRole === "REGULATIONS_MANAGER" && "📋"}
            {activeWorkspaceRole === "MATCH_OFFICIATING_MANAGER" && "⚖️"}
            {activeWorkspaceRole === "RECORDS_MANAGER" && "📂"}
            {activeWorkspaceRole === "TECH_MANAGER" && "💻"}
            {activeWorkspaceRole === "ASST_TECH_MANAGER" && "🛠️"}
            {currentMeta.title} — {currentMeta.officialName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            {activeWorkspaceRole === "PRESIDENT" &&
              "Focus: Executive Leadership, Disciplinary Appeals, Policy Rulings & Governance"}
            {activeWorkspaceRole === "DEPUTY_PRESIDENT" &&
              "Focus: Operations Supervision, Departmental Monitoring & Special Projects"}
            {activeWorkspaceRole === "REGULATIONS_MANAGER" &&
              "Focus: Player/Club Registrations, Regulatory Compliance, Eligibility & Document Audits"}
            {activeWorkspaceRole === "MATCH_OFFICIATING_MANAGER" &&
              "Focus: Referee Roster, Match Officiating Assignments, Performance & Concerns"}
            {activeWorkspaceRole === "RECORDS_MANAGER" &&
              "Focus: Official Archives, Certified Standings, Disciplinary Ledger & Decision Minutes"}
            {activeWorkspaceRole === "TECH_MANAGER" &&
              "Focus: System Health, Public Site Publishing, Live Engine & Data Integrity"}
            {activeWorkspaceRole === "ASST_TECH_MANAGER" &&
              "Focus: Content Drafting, Media Gallery Management, Digital Backups & User Support"}
          </p>
        </div>

        {/* Role Navigation Switcher for Council & Admins */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a071b] p-1.5 rounded-2xl border border-[#2e2554]">
          {[
            { id: "PRESIDENT", label: "1. President", icon: Crown },
            { id: "DEPUTY_PRESIDENT", label: "2. Deputy", icon: Shield },
            { id: "REGULATIONS_MANAGER", label: "3. Registrar", icon: FileText },
            { id: "MATCH_OFFICIATING_MANAGER", label: "4. Officiating", icon: Flag },
            { id: "RECORDS_MANAGER", label: "5. Records", icon: BookOpen },
            { id: "TECH_MANAGER", label: "6. Tech Mgr", icon: Activity },
            { id: "ASST_TECH_MANAGER", label: "7. Asst Tech", icon: Layers },
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

      {/* =========================================================================
          ROLE 1: PRESIDENT — BRAMUEL AMIRAH
          Sidebar Menu: Executive Overview, Dispute & Hearing Center, Policy & Constitution Portal,
                        Board Voting & Motions, Executive Approvals, Board Meeting Planner
          ========================================================================= */}
      {activeWorkspaceRole === "PRESIDENT" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dedicated Left Sidebar Navigation Menu */}
          <div className="lg:col-span-3 bg-[#0a071b] border border-amber-400/30 rounded-3xl p-4 space-y-2 shadow-xl">
            <div className="px-3 py-2 border-b border-[#2e2554]">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block">
                Sidebar Navigation Menu
              </span>
              <h4 className="text-sm font-black text-white uppercase mt-0.5">
                Presidential Portal
              </h4>
            </div>

            <nav className="space-y-1">
              {[
                { id: "overview", label: "📊 Executive Overview", sub: "KPIs & League Summary" },
                {
                  id: "hearings",
                  label: "⚖️ Dispute & Hearing Center",
                  sub: "Protests, Hearings, Rulings",
                },
                {
                  id: "policy",
                  label: "📜 Policy & Constitution",
                  sub: "Rulebook & Conduct Amendments",
                },
                {
                  id: "voting",
                  label: "🗳️ Board Voting & Motions",
                  sub: "Motions & 7-Member Quorum",
                },
                { id: "approvals", label: "🤝 Executive Approvals", sub: "New Clubs & Budgets" },
                { id: "meeting", label: "📅 Board Meeting Planner", sub: "Executive Sessions" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPresidentTab(item.id as typeof presidentTab)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex flex-col ${
                    presidentTab === item.id
                      ? "bg-amber-400/20 border border-amber-400/50 text-white shadow-lg shadow-amber-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {presidentTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Active Clubs
                    </span>
                    <span className="text-xl font-black text-white font-mono">
                      {teams.length} Clubs
                    </span>
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
                      Active Appeals
                    </span>
                    <span className="text-xl font-black text-yellow-300 font-mono">
                      {appeals.length} Cases
                    </span>
                  </div>
                  <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Treasury Health
                    </span>
                    <span className="text-xl font-black text-cyan-300 font-mono">Solvent</span>
                  </div>
                </div>

                <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-6 shadow-xl space-y-3">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Presidential Executive Briefing & Directive
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Welcome President Alex Haro. As chief executive officer of the M-Pesa Sunday
                    League, your authority governs all administrative crew tiers, constitutional
                    integrity, appeals jurisprudence, and inter-departmental policies.
                  </p>
                  <div className="p-3 bg-black/40 rounded-2xl border border-amber-400/20 text-xs text-amber-300 font-mono">
                    Official Ruling: Article IV strict 15-player squad limit active across all four
                    clubs.
                  </div>
                </div>
              </div>
            )}

            {presidentTab === "hearings" && (
              <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-[#2e2554] pb-3 flex items-center justify-between">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" />
                    Dispute & Hearing Center
                  </h4>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    Appellate Jurisdiction
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Active Protests & Appeals Log
                  </span>
                  {appeals.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00f0ff]">{app.club}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold uppercase">
                          {app.status}
                        </span>
                      </div>
                      <h6 className="text-xs font-black text-white">{app.subject}</h6>
                      <p className="text-[11px] text-gray-400">{app.evidenceSummary}</p>
                      <div className="text-[11px] text-emerald-400 font-mono bg-black/30 p-2.5 rounded-xl">
                        Binding Council Ruling: {app.ruling}
                      </div>
                    </div>
                  ))}

                  {/* Formal Ruling Generator */}
                  <div className="p-4 bg-[#0a071b] rounded-2xl border border-amber-400/30 space-y-3 mt-4">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block">
                      Formal Ruling Generator:
                    </span>
                    <textarea
                      rows={3}
                      value={hearingMinutes}
                      onChange={(e) => setHearingMinutes(e.target.value)}
                      placeholder="Enter formal tribunal minutes, evidentiary review, and binding ruling text..."
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl p-3 text-xs text-white outline-none resize-none"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <select
                        value={hearingVerdict}
                        onChange={(e) => setHearingVerdict(e.target.value)}
                        className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white font-bold"
                      >
                        <option value="UPHELD">Ruling: Match Result Upheld</option>
                        <option value="ORDER_REPLAY">Ruling: Order Match Replay</option>
                        <option value="FINE_ISSUED">Ruling: Disciplinary Fine Issued</option>
                        <option value="DISMISSED">Ruling: Protest Dismissed</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (!hearingMinutes.trim()) return;
                          showToast(`✓ Formal Presidential Ruling certified: ${hearingVerdict}`);
                          setHearingMinutes("");
                        }}
                        className="px-5 py-2 rounded-xl bg-amber-400 text-black font-black text-xs uppercase hover:brightness-110 cursor-pointer shadow-lg"
                      >
                        Issue Certified Ruling
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {presidentTab === "policy" && (
              <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-[#2e2554] pb-3 flex items-center justify-between">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-amber-400" />
                    Policy & Constitution Portal
                  </h4>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    Rulebook & Amendments
                  </span>
                </div>

                <div className="space-y-3">
                  {publishedAmendments.map((amend) => (
                    <div
                      key={amend.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{amend.title}</span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">
                          {amend.article}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        {amend.text}
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono block">
                        Ratified: {amend.date}
                      </span>
                    </div>
                  ))}

                  <div className="p-4 bg-[#0a071b] rounded-2xl border border-amber-400/30 space-y-3 mt-4">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block">
                      Draft Rulebook Amendment:
                    </span>
                    <input
                      type="text"
                      placeholder="Amendment Title (e.g. Fair Play Points Weighting Amendment)"
                      value={newAmendmentTitle}
                      onChange={(e) => setNewAmendmentTitle(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Article Reference (e.g. Article VI, Section 3)"
                      value={newAmendmentArticle}
                      onChange={(e) => setNewAmendmentArticle(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Legal amendment wording and constitutional provision..."
                      value={newAmendmentText}
                      onChange={(e) => setNewAmendmentText(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl p-3 text-xs text-white outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newAmendmentTitle.trim() || !newAmendmentText.trim()) return;
                        setPublishedAmendments([
                          ...publishedAmendments,
                          {
                            id: `amend-${Date.now()}`,
                            title: newAmendmentTitle.trim(),
                            article: newAmendmentArticle.trim(),
                            text: newAmendmentText.trim(),
                            date: new Date().toISOString().split("T")[0],
                          },
                        ]);
                        setNewAmendmentTitle("");
                        setNewAmendmentText("");
                        showToast(
                          "✓ Constitutional amendment drafted and submitted for council ratification!",
                        );
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase hover:brightness-110 cursor-pointer shadow-lg"
                    >
                      Publish Constitutional Amendment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {presidentTab === "voting" && (
              <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-[#2e2554] pb-3 flex items-center justify-between">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <Vote className="w-5 h-5 text-amber-400" />
                    Board Voting & Motions Console
                  </h4>
                  <span className="text-xs text-amber-300 font-mono font-bold">
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
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${motion.status === "PASSED" ? "bg-emerald-500/20 text-emerald-300" : "bg-cyan-500/20 text-cyan-300"}`}
                        >
                          {motion.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Closes: {motion.deadline}
                        </span>
                      </div>
                      <h5 className="text-xs font-black text-white">{motion.title}</h5>

                      <div className="p-3 bg-black/40 rounded-xl space-y-1 text-xs font-mono">
                        <div className="text-emerald-400 font-bold">
                          ✓ In Favor ({motion.yesVotes.length}/7): {motion.yesVotes.join(", ")}
                        </div>
                        <div className="text-rose-400 font-bold">
                          ✗ Against ({motion.noVotes.length}/7): None
                        </div>
                      </div>

                      {motion.status === "OPEN" && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => showToast("✓ Presidential Aye vote confirmed!")}
                            className="flex-1 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-black transition cursor-pointer"
                          >
                            Vote Aye (Yes)
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast("✓ Presidential Nay vote recorded.")}
                            className="flex-1 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-black transition cursor-pointer"
                          >
                            Vote Nay (No)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="p-4 bg-[#0a071b] rounded-2xl border border-amber-400/30 space-y-2 mt-4">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block">
                      Create New Motion:
                    </span>
                    <input
                      type="text"
                      placeholder="Motion Topic (e.g. Expand Roster Cap to 18 Players for Season 2)"
                      value={newMotionTitle}
                      onChange={(e) => setNewMotionTitle(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newMotionTitle.trim()) return;
                        setActiveMotions([
                          {
                            id: `motion-${Date.now()}`,
                            title: newMotionTitle.trim(),
                            deadline: "Sunday, Nov 08, 2026 at 23:59 EAT",
                            yesVotes: ["Alex Haro (President)"],
                            noVotes: [],
                            status: "OPEN",
                          },
                          ...activeMotions,
                        ]);
                        setNewMotionTitle("");
                        showToast("✓ Motion tabled for digital voting across all 7 board members!");
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase hover:brightness-110 cursor-pointer shadow-lg"
                    >
                      Table Motion for Council Vote
                    </button>
                  </div>
                </div>
              </div>
            )}

            {presidentTab === "approvals" && (
              <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-[#2e2554] pb-3 flex items-center justify-between">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-amber-400" />
                    Executive Approvals Desk
                  </h4>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    New Clubs & Budget Sign-offs
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Pending Club Affiliation Applications
                  </span>
                  {clubApprovals.map((ca) => (
                    <div
                      key={ca.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between gap-3"
                    >
                      <div>
                        <h6 className="text-xs font-black text-white">{ca.name}</h6>
                        <span className="text-[11px] text-gray-400">
                          {ca.parish} • Requested by: {ca.requestedBy}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {ca.status === "PENDING" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setClubApprovals(
                                clubApprovals.map((c) =>
                                  c.id === ca.id ? { ...c, status: "APPROVED" } : c,
                                ),
                              );
                              showToast(`✓ Executive approval granted for ${ca.name}!`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold text-xs transition cursor-pointer"
                          >
                            Approve Club
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            ✓ Certified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-[#0e0a26] rounded-2xl border border-amber-400/30 space-y-2 mt-4">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block">
                      Tournament Budget Sign-Offs:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <span className="text-gray-400 block font-bold">
                          Referee Match Honorarium Stipends:
                        </span>
                        <span className="text-emerald-400 font-mono font-black">
                          Ksh 45,000 / Matchweek
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            showToast("✓ Executive sign-off confirmed for referee stipends.")
                          }
                          className="mt-1 px-3 py-1 bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400 hover:text-black rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          Sign-Off Budget
                        </button>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <span className="text-gray-400 block font-bold">
                          Stadium Ground Maintenance:
                        </span>
                        <span className="text-emerald-400 font-mono font-black">
                          Ksh 30,000 / Month
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            showToast("✓ Executive sign-off confirmed for pitch maintenance.")
                          }
                          className="mt-1 px-3 py-1 bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400 hover:text-black rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          Sign-Off Budget
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {presidentTab === "meeting" && (
              <div className="bg-[#0b0821] border border-amber-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-[#2e2554] pb-3 flex items-center justify-between">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-amber-400" />
                    Board Meeting Planner
                  </h4>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    Executive Council Sessions
                  </span>
                </div>

                <div className="space-y-3">
                  {boardMeetings.map((bm) => (
                    <div
                      key={bm.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <h6 className="text-xs font-black text-white">{bm.title}</h6>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold font-mono">
                          {bm.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        📅 {bm.date} • ⏰ {bm.time} • 📍 {bm.venue}
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-[#0a071b] rounded-2xl border border-amber-400/30 space-y-3 mt-4">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block">
                      Schedule Next Executive Council Meeting:
                    </span>
                    <input
                      type="text"
                      placeholder="Meeting Agenda Title (e.g. Mid-Season Performance & Safety Audit)"
                      value={newMeetingTitle}
                      onChange={(e) => setNewMeetingTitle(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g. Wednesday, Nov 11, 2026 at 17:00 EAT)"
                      value={newMeetingDate}
                      onChange={(e) => setNewMeetingDate(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newMeetingTitle.trim()) return;
                        setBoardMeetings([
                          ...boardMeetings,
                          {
                            id: `bm-${Date.now()}`,
                            title: newMeetingTitle.trim(),
                            date: newMeetingDate,
                            time: "17:00 - 18:30 EAT",
                            venue: "Executive Council Boardroom",
                            status: "SCHEDULED",
                          },
                        ]);
                        setNewMeetingTitle("");
                        showToast(
                          "✓ Executive Council meeting convened and notifications dispatched!",
                        );
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase hover:brightness-110 cursor-pointer shadow-lg"
                    >
                      Convene Board Session
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE 2: DEPUTY PRESIDENT — JOSEPH KAMANDE
          Sidebar Menu: Executive Operations Hub, Departmental Progress Monitor,
                        Executive Acting Override (Toggle), Special Task Force Manager,
                        Inter-Departmental Escalations
          ========================================================================= */}
      {activeWorkspaceRole === "DEPUTY_PRESIDENT" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dedicated Left Sidebar Navigation Menu */}
          <div className="lg:col-span-3 bg-[#0a071b] border border-cyan-400/30 rounded-3xl p-4 space-y-2 shadow-xl">
            <div className="px-3 py-2 border-b border-[#2e2554]">
              <span className="text-[10px] uppercase font-black tracking-wider text-cyan-300 block">
                Sidebar Navigation Menu
              </span>
              <h4 className="text-sm font-black text-white uppercase mt-0.5">Deputy Operations</h4>
            </div>

            <nav className="space-y-1">
              {[
                { id: "overview", label: "📊 Operations Hub", sub: "Supervision & Readiness" },
                {
                  id: "monitoring",
                  label: "📈 Departmental Progress",
                  sub: "Registration, Officiating, Records",
                },
                {
                  id: "acting_override",
                  label: "⚡ Executive Acting Override",
                  sub: "Emergency Approval Controls",
                },
                {
                  id: "task_force",
                  label: "🎯 Task Force Manager",
                  sub: "Inspections & Deadlines",
                },
                {
                  id: "escalations",
                  label: "⚠️ Escalations Desk",
                  sub: "Inter-Departmental Issues",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDeputyTab(item.id as typeof deputyTab)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex flex-col ${
                    deputyTab === item.id
                      ? "bg-cyan-400/20 border border-cyan-400/50 text-white shadow-lg shadow-cyan-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {deputyTab === "overview" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Executive Operations Hub
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Welcome Deputy President Babra Nandako. Your executive mandate encompasses
                  operational monitoring across all four administrative managers, stand-in
                  presidential authority, and task force field supervision.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Active Task Forces
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">
                      {taskForces.length} Projects
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Escalations Logged
                    </span>
                    <span className="text-lg font-black text-yellow-300 font-mono">
                      {escalations.length} Reports
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Acting Override
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {actingPresidentOverride ? "ENGAGED" : "STANDBY"}
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Ground Readiness
                    </span>
                    <span className="text-lg font-black text-purple-300 font-mono">
                      100% Secure
                    </span>
                  </div>
                </div>
              </div>
            )}

            {deputyTab === "monitoring" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Departmental Progress Monitor (4 Core Departments)
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Registration Department (Whitney Juma)</span>
                      <span className="text-emerald-400 font-mono">100% Compliant</span>
                    </div>
                    <div className="w-full bg-[#080517] h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-full" />
                    </div>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Match Officiating Department (Idi Sebantu • Ref Bidan Mwaura)</span>
                      <span className="text-cyan-400 font-mono">100% Coverage</span>
                    </div>
                    <div className="w-full bg-[#080517] h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full w-full" />
                    </div>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Records & Archive Department (Tonnie Mark Odundo)</span>
                      <span className="text-purple-400 font-mono">98% Certified</span>
                    </div>
                    <div className="w-full bg-[#080517] h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full w-[98%]" />
                    </div>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Tech & Media Department (Victor Kiplagat / Sturridge Ochongoi)</span>
                      <span className="text-yellow-400 font-mono">99.98% Live</span>
                    </div>
                    <div className="w-full bg-[#080517] h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full w-[99.9%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {deputyTab === "acting_override" && (
              <div className="p-6 bg-[#0b0821] border border-cyan-400/40 rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3">
                  <div>
                    <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-cyan-400" />
                      Executive Acting Override (Toggle)
                    </h4>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Toggle emergency executive approval controls when President Alex Haro is
                      absent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !actingPresidentOverride;
                      setActingPresidentOverride(next);
                      showToast(
                        next ? "✓ Acting President Override ENGAGED." : "Override disengaged.",
                      );
                    }}
                    className={`px-4 py-2 rounded-xl font-black text-xs uppercase transition cursor-pointer ${
                      actingPresidentOverride
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                        : "bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                    }`}
                  >
                    {actingPresidentOverride
                      ? "Disengage Override"
                      : "Engage Acting President Powers"}
                  </button>
                </div>

                <div className="p-4 bg-[#141029] rounded-2xl border border-cyan-400/20 space-y-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase block">
                    Emergency Stand-in Hearing Desk:
                  </span>
                  <p className="text-xs text-gray-400">
                    With override engaged, Deputy President Babra Nandako can certify urgent fixture
                    reschedulings, approve interim medical waivers, and preside over preliminary
                    disciplinary reviews.
                  </p>
                </div>
              </div>
            )}

            {deputyTab === "task_force" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-[#2e2554] pb-3 flex items-center justify-between">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                    Special Task Force Manager
                  </h4>
                  <span className="text-xs text-cyan-300 font-mono font-bold">
                    Active Inspections & Projects
                  </span>
                </div>

                <div className="space-y-3">
                  {taskForces.map((tf) => (
                    <div
                      key={tf.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white">{tf.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${tf.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-300" : "bg-cyan-500/20 text-cyan-300"}`}
                        >
                          {tf.status} ({tf.progress}%)
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block font-mono">
                        Assigned to: {tf.assignedTo}
                      </span>
                      <div className="w-full bg-[#080517] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full transition-all"
                          style={{ width: `${tf.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-[#0a071b] rounded-2xl border border-cyan-400/30 space-y-2 mt-4">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase block">
                      Assign New Operational Task Force:
                    </span>
                    <input
                      type="text"
                      placeholder="Project Name (e.g. Referee Radios & Headset Audio Test)"
                      value={newTaskForceName}
                      onChange={(e) => setNewTaskForceName(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Assignee (e.g. Field Stewards & Technical Assistant)"
                      value={newTaskForceAssignee}
                      onChange={(e) => setNewTaskForceAssignee(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTaskForceName.trim()) return;
                        setTaskForces([
                          ...taskForces,
                          {
                            id: `tf-${Date.now()}`,
                            name: newTaskForceName.trim(),
                            assignedTo: newTaskForceAssignee.trim() || "Operations Crew",
                            progress: 10,
                            status: "IN_PROGRESS",
                          },
                        ]);
                        setNewTaskForceName("");
                        setNewTaskForceAssignee("");
                        showToast("✓ Special task force commissioned and dispatched!");
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase hover:brightness-110 cursor-pointer shadow-lg"
                    >
                      Commission Task Force
                    </button>
                  </div>
                </div>
              </div>
            )}

            {deputyTab === "escalations" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-[#2e2554] pb-3 flex items-center justify-between">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Inter-Departmental Escalations Desk
                  </h4>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    Fast-Track Resolution
                  </span>
                </div>

                <div className="space-y-3">
                  {escalations.map((esc) => (
                    <div
                      key={esc.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#00f0ff]">
                          {esc.department} Department
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${esc.priority === "HIGH" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"}`}
                        >
                          {esc.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-white">{esc.issue}</p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400 font-mono">
                        <span>Logged: {esc.sentAt}</span>
                        {!esc.resolved ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEscalations(
                                escalations.map((e) =>
                                  e.id === esc.id ? { ...e, resolved: true } : e,
                                ),
                              );
                              showToast("✓ Escalation resolved by Deputy President.");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold text-xs transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-bold">✓ Resolved</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE 3: REGISTER & REGULATIONS — CHERYL COSMAS
          Sidebar Menu: Registration Dashboard, Club & Staff Licensing, Player Verification Desk,
                        Eligibility & Violations Engine, Compliance & Waivers
          ========================================================================= */}
      {activeWorkspaceRole === "REGULATIONS_MANAGER" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dedicated Left Sidebar Navigation Menu */}
          <div className="lg:col-span-3 bg-[#0a071b] border border-blue-400/30 rounded-3xl p-4 space-y-2 shadow-xl">
            <div className="px-3 py-2 border-b border-[#2e2554]">
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-300 block">
                Sidebar Navigation Menu
              </span>
              <h4 className="text-sm font-black text-white uppercase mt-0.5">
                Registration & Rules
              </h4>
            </div>

            <nav className="space-y-1">
              {[
                {
                  id: "dashboard",
                  label: "📋 Registration Dashboard",
                  sub: "Overview & Roster Audits",
                },
                {
                  id: "licensing",
                  label: "🛡️ Club & Staff Licensing",
                  sub: "Club & Coach Approvals",
                },
                {
                  id: "player_verification",
                  label: "⚽ Player Verification Desk",
                  sub: "Approvals & Digital Passes",
                },
                {
                  id: "eligibility_violations",
                  label: "🚨 Eligibility & Violations",
                  sub: "Age Flags & Suspensions",
                },
                {
                  id: "compliance_waivers",
                  label: "📑 Compliance & Waivers",
                  sub: "Parental & Medical Slips",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRegulationsTab(item.id as typeof regulationsTab)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex flex-col ${
                    regulationsTab === item.id
                      ? "bg-blue-400/20 border border-blue-400/50 text-white shadow-lg shadow-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {regulationsTab === "dashboard" && (
              <div className="bg-[#0b0821] border border-blue-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Registration Dashboard Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-blue-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Roster Compliance
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      100% (≤15 Squad)
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-blue-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Verified Athletes
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      {teams.reduce((acc, t) => acc + (t.squad?.length || 0), 0)} Players
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-blue-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Pending Passports
                    </span>
                    <span className="text-lg font-black text-yellow-300 font-mono">
                      {pendingPlayerApprovals.length} Pending
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-blue-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Document Audits
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">Certified</span>
                  </div>
                </div>
              </div>
            )}

            {regulationsTab === "licensing" && (
              <div className="bg-[#0b0821] border border-blue-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Club & Staff Licensing Desk
                </h4>
                <div className="space-y-3">
                  {clubRegistrations.map((cr) => (
                    <div
                      key={cr.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div>
                        <h6 className="text-xs font-black text-white">{cr.clubName}</h6>
                        <span className="text-[11px] text-gray-400">{cr.parish}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${cr.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/20 text-yellow-300"}`}
                        >
                          {cr.status}
                        </span>
                        {!cr.licenseIssued && (
                          <button
                            type="button"
                            onClick={() => {
                              setClubRegistrations(
                                clubRegistrations.map((c) =>
                                  c.id === cr.id
                                    ? { ...c, licenseIssued: true, status: "APPROVED" }
                                    : c,
                                ),
                              );
                              showToast(`✓ Official League License issued to ${cr.clubName}!`);
                            }}
                            className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white font-bold text-xs transition cursor-pointer"
                          >
                            Issue Official License
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regulationsTab === "player_verification" && (
              <div className="bg-[#0b0821] border border-blue-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-400" />
                  Player Verification & Digital Pass Generator
                </h4>
                <div className="space-y-3">
                  {pendingPlayerApprovals.map((pa) => (
                    <div
                      key={pa.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between gap-3"
                    >
                      <div>
                        <h6 className="text-xs font-black text-white">{pa.name}</h6>
                        <span className="text-[11px] text-gray-400">
                          {pa.club} • {pa.admissionNo} • {pa.docType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!pa.approved ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPendingPlayerApprovals(
                                pendingPlayerApprovals.map((p) =>
                                  p.id === pa.id ? { ...p, approved: true } : p,
                                ),
                              );
                              showToast(`✓ Player ${pa.name} verified and digital pass generated!`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold text-xs transition cursor-pointer"
                          >
                            Approve & Issue Pass
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            ✓ Pass Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regulationsTab === "eligibility_violations" && (
              <div className="bg-[#0b0821] border border-blue-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  Eligibility & Violations Engine
                </h4>
                <div className="space-y-3">
                  {eligibilityAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {log.player} ({log.club})
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${log.status === "PASSED" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{log.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regulationsTab === "compliance_waivers" && (
              <div className="bg-[#0b0821] border border-blue-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-400" />
                  Compliance & Waivers Tracker
                </h4>
                <div className="space-y-3">
                  {waiversTracker.map((wv) => (
                    <div
                      key={wv.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-black text-white">{wv.athlete}</span>
                        <span className="text-[11px] text-gray-400 block">
                          {wv.club} • Valid until {wv.expiryDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                          ✓ Parent Consent
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg ${wv.medicalClearance ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/20 text-yellow-300"}`}
                        >
                          {wv.medicalClearance ? "✓ Medical OK" : "⏳ Med Clearance Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE 4: MATCH OFFICIATING — MITCHELLE MUTHONI
          Sidebar Menu: Officiating Center Overview, Referee Match Scheduler,
                        Post-Match Referee Reports, Referee Performance & Fair Play,
                        Officiating Concerns & Disputes
          ========================================================================= */}
      {activeWorkspaceRole === "MATCH_OFFICIATING_MANAGER" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dedicated Left Sidebar Navigation Menu */}
          <div className="lg:col-span-3 bg-[#0a071b] border border-purple-400/30 rounded-3xl p-4 space-y-2 shadow-xl">
            <div className="px-3 py-2 border-b border-[#2e2554]">
              <span className="text-[10px] uppercase font-black tracking-wider text-purple-300 block">
                Sidebar Navigation Menu
              </span>
              <h4 className="text-sm font-black text-white uppercase mt-0.5">Officiating Center</h4>
            </div>

            <nav className="space-y-1">
              {[
                {
                  id: "overview",
                  label: "⚖️ Officiating Overview",
                  sub: "Referee Roster & Coverage",
                },
                { id: "scheduler", label: "📅 Referee Scheduler", sub: "Assignments & Chaplains" },
                {
                  id: "ref_reports",
                  label: "📝 Referee Reports",
                  sub: "Match Sheets & Incident Log",
                },
                {
                  id: "performance",
                  label: "⭐ Referee Performance",
                  sub: "Ratings & Leaderboard",
                },
                { id: "disputes", label: "📢 Concerns & Disputes", sub: "Abuse Desk & Appeals" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOfficiatingTab(item.id as typeof officiatingTab)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex flex-col ${
                    officiatingTab === item.id
                      ? "bg-purple-400/20 border border-purple-400/50 text-white shadow-lg shadow-purple-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {officiatingTab === "overview" && (
              <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Flag className="w-5 h-5 text-purple-400" />
                  Officiating Center Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-purple-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Active Referees
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      {referees.length} Certified
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-purple-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Weekend Coverage
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      100% Scheduled
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-purple-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Avg Referee Rating
                    </span>
                    <span className="text-lg font-black text-amber-300 font-mono">4.8 / 5.0</span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-purple-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Incidents Logged
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">
                      {incidentReports.length} Cards
                    </span>
                  </div>
                </div>
              </div>
            )}

            {officiatingTab === "scheduler" && (
              <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Referee Match Scheduler & Chaplain Assignments
                </h4>
                <div className="space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Pitch Chaplain Schedules (Pastoral Prayer Protocol)
                  </span>
                  {chaplainAssignments.map((ca) => (
                    <div
                      key={ca.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white">{ca.fixture}</span>
                        <span className="text-[11px] text-purple-300 block font-mono">
                          Chaplain: {ca.chaplain} • Theme: {ca.prayerFocus}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        Matchweek {ca.matchweek}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {officiatingTab === "ref_reports" && (
              <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Post-Match Referee Reports & Disciplinary Incident Log
                </h4>
                <div className="space-y-3">
                  {incidentReports.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {inc.player} ({inc.team})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold uppercase font-mono">
                          {inc.sanction} at {inc.minute}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Match: {inc.match} • Reason: {inc.reason}
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono block">
                        Certified by: {inc.refereeSignoff}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {officiatingTab === "performance" && (
              <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Referee Performance & Fair Play Leaderboard
                </h4>
                <div className="space-y-3">
                  {referees.map((ref, idx) => (
                    <div
                      key={ref.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-amber-400 text-sm">
                          #{idx + 1}
                        </span>
                        <div>
                          <h6 className="text-xs font-black text-white">{ref.name}</h6>
                          <span className="text-[10px] text-gray-400">{ref.badge}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-300 font-black text-xs">
                          ⭐ {ref.rating} / 5.0
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {ref.assignedMatches} matches officiated
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {officiatingTab === "disputes" && (
              <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  Officiating Concerns & Touchline Conduct Desk
                </h4>
                <div className="p-4 bg-[#141029] rounded-2xl border border-rose-500/20 text-xs text-gray-300 leading-relaxed">
                  Zero-tolerance policy for referee harassment or touchline dissent. All submitted
                  incidents are reported to the Supreme Council Disciplinary Desk.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE 5: RECORDS & FILE MANAGER — TONNIE MARK ODUNDO
          Sidebar Menu: Records Vault Home, Official League Document Vault,
                        Match Sheet & Results Archive, Central Disciplinary Ledger,
                        Administrative Decisions Registry
          ========================================================================= */}
      {activeWorkspaceRole === "RECORDS_MANAGER" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dedicated Left Sidebar Navigation Menu */}
          <div className="lg:col-span-3 bg-[#0a071b] border border-cyan-400/30 rounded-3xl p-4 space-y-2 shadow-xl">
            <div className="px-3 py-2 border-b border-[#2e2554]">
              <span className="text-[10px] uppercase font-black tracking-wider text-cyan-300 block">
                Sidebar Navigation Menu
              </span>
              <h4 className="text-sm font-black text-white uppercase mt-0.5">Records & Archives</h4>
            </div>

            <nav className="space-y-1">
              {[
                {
                  id: "vault_home",
                  label: "📂 Records Vault Home",
                  sub: "Archive Summary & Stats",
                },
                {
                  id: "doc_vault",
                  label: "📁 Official Document Vault",
                  sub: "Constitution, Minutes, Leases",
                },
                {
                  id: "results_archive",
                  label: "🏆 Results & Match Sheets",
                  sub: "Certified Scorecards & Standings Lock",
                },
                {
                  id: "disciplinary_ledger",
                  label: "🟨 Central Disciplinary Ledger",
                  sub: "Yellow/Red Cards & Fines",
                },
                {
                  id: "decisions_registry",
                  label: "📜 Administrative Decisions",
                  sub: "Searchable Rulings Index",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRecordsTab(item.id as typeof recordsTab)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex flex-col ${
                    recordsTab === item.id
                      ? "bg-cyan-400/20 border border-cyan-400/50 text-white shadow-lg shadow-cyan-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {recordsTab === "vault_home" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-cyan-400" />
                  Official Records Vault Home
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Archived Documents
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      {documentVault.length} Files
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Certified Matches
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {fixtures.filter((f) => f.status === "FINISHED").length} Scorecards
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Standings Lock
                    </span>
                    <span className="text-lg font-black text-yellow-300 font-mono">
                      {seasonStandingsLocked ? "LOCKED" : "OPEN"}
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-cyan-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Disciplinary Entries
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">
                      {disciplinaryLedger.length} Records
                    </span>
                  </div>
                </div>
              </div>
            )}

            {recordsTab === "doc_vault" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Official League Document Vault
                </h4>
                <div className="space-y-3">
                  {documentVault.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div>
                        <h6 className="text-xs font-black text-white">{doc.title}</h6>
                        <span className="text-[10px] text-cyan-300 font-mono">
                          {doc.category} • Certified {doc.date}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`✓ Document "${doc.title}" downloaded from archive.`)
                        }
                        className="px-3 py-1.5 rounded-xl bg-cyan-400/20 hover:bg-cyan-400 text-cyan-300 hover:text-black font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recordsTab === "results_archive" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Match Sheet & Results Archive
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !seasonStandingsLocked;
                      setSeasonStandingsLocked(next);
                      showToast(
                        next
                          ? "✓ Official season standings locked & certified."
                          : "Standings unlocked.",
                      );
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition cursor-pointer"
                  >
                    {seasonStandingsLocked ? "Unlock Standings" : "🔒 Lock Official Standings"}
                  </button>
                </div>
                <div className="space-y-2">
                  {fixtures.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-[#141029] rounded-xl border border-[#2e2554] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">
                          Matchweek {f.matchweek}: Club #{f.homeId} vs Club #{f.awayId}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono">
                          {f.date} • Venue: {f.venue}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-cyan-300 text-sm">
                          {f.homeScore} - {f.awayScore}
                        </span>
                        <span className="text-[9px] block text-emerald-400 font-bold">
                          {f.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recordsTab === "disciplinary_ledger" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-400" />
                  Central Disciplinary Ledger
                </h4>
                <div className="space-y-3">
                  {disciplinaryLedger.map((dl) => (
                    <div
                      key={dl.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div>
                        <h6 className="text-xs font-black text-white">
                          {dl.player} ({dl.team})
                        </h6>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Fines Assessed: {dl.finePaid}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-300 rounded text-xs font-mono font-bold">
                          🟨 {dl.yellows}
                        </span>
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded text-xs font-mono font-bold">
                          🟥 {dl.reds}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {dl.suspensionStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recordsTab === "decisions_registry" && (
              <div className="bg-[#0b0821] border border-cyan-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Administrative Decisions Registry
                </h4>
                <div className="p-4 bg-[#141029] rounded-2xl border border-cyan-400/20 text-xs text-gray-300 leading-relaxed font-mono">
                  Official timestamped log of all Council resolutions, player eligibility decrees,
                  and disciplinary decisions. Maintained by Tonnie Mark Odundo.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE 6: TECHNOLOGICAL MANAGER — TRADY LEWIS
          Sidebar Menu: Tech Console Overview, Public Website CMS,
                        Live Publishing Control, Platform Health & Infrastructure,
                        Data Integrity Audit
          ========================================================================= */}
      {activeWorkspaceRole === "TECH_MANAGER" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dedicated Left Sidebar Navigation Menu */}
          <div className="lg:col-span-3 bg-[#0a071b] border border-fuchsia-400/30 rounded-3xl p-4 space-y-2 shadow-xl">
            <div className="px-3 py-2 border-b border-[#2e2554]">
              <span className="text-[10px] uppercase font-black tracking-wider text-fuchsia-300 block">
                Sidebar Navigation Menu
              </span>
              <h4 className="text-sm font-black text-white uppercase mt-0.5">Technology Systems</h4>
            </div>

            <nav className="space-y-1">
              {[
                {
                  id: "tech_overview",
                  label: "💻 Tech Console Overview",
                  sub: "System Metrics & Live Feeds",
                },
                {
                  id: "website_cms",
                  label: "🌐 Public Website CMS",
                  sub: "Hero Banners & Previews",
                },
                {
                  id: "live_publishing",
                  label: "🚀 Live Publishing Control",
                  sub: "Scores & Standings Broadcast",
                },
                { id: "infrastructure", label: "🖥️ Platform Health", sub: "Uptime & Backups" },
                {
                  id: "integrity_audit",
                  label: "🔍 Data Integrity Audit",
                  sub: "Table Math Verification",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTechTab(item.id as typeof techTab)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex flex-col ${
                    techTab === item.id
                      ? "bg-fuchsia-400/20 border border-fuchsia-400/50 text-white shadow-lg shadow-fuchsia-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {techTab === "tech_overview" && (
              <div className="bg-[#0b0821] border border-fuchsia-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-fuchsia-400" />
                  Tech Console Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-fuchsia-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      System Uptime
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">99.98%</span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-fuchsia-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Live Publishing
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">SYNCHRONIZED</span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-fuchsia-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      YouTube Audio Engine
                    </span>
                    <span className="text-lg font-black text-purple-300 font-mono">Active</span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-fuchsia-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Data Integrity
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">VERIFIED</span>
                  </div>
                </div>
              </div>
            )}

            {techTab === "website_cms" && (
              <div className="bg-[#0b0821] border border-fuchsia-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Globe className="w-5 h-5 text-fuchsia-400" />
                  Public Website CMS Editor
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">
                      Homepage Hero Headline Banner:
                    </label>
                    <input
                      type="text"
                      value={cmsHeroHeadline}
                      onChange={(e) => setCmsHeroHeadline(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("✓ Public website hero banner headline updated.")}
                    className="px-4 py-2 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Save CMS Changes
                  </button>
                </div>
              </div>
            )}

            {techTab === "live_publishing" && (
              <div className="bg-[#0b0821] border border-fuchsia-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                  <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    Live Publishing & Score Broadcast Control
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !liveFeedEnabled;
                      setLiveFeedEnabled(next);
                      showToast(next ? "✓ Live feeds broadcast ENABLED." : "Live feeds paused.");
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase cursor-pointer ${liveFeedEnabled ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-gray-500/20 text-gray-400"}`}
                  >
                    {liveFeedEnabled ? "Feed: ACTIVE" : "Feed: PAUSED"}
                  </button>
                </div>
                <div className="space-y-2">
                  {webPublishQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#141029] rounded-xl border border-[#2e2554] flex items-center justify-between text-xs"
                    >
                      <span className="text-white font-bold">{item.title}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        ✓ Published ({item.time})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {techTab === "infrastructure" && (
              <div className="bg-[#0b0821] border border-fuchsia-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-fuchsia-400" />
                  Platform Health & Infrastructure
                </h4>
                <div className="p-4 bg-[#141029] rounded-2xl border border-fuchsia-400/20 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Host Engine:</span>
                    <span className="text-cyan-300">TanStack Start & Vite SSR</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Client Storage:</span>
                    <span className="text-emerald-400">LocalStorage v6 Hydrated</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Active Port:</span>
                    <span className="text-purple-300">3000 (Internal)</span>
                  </div>
                </div>
              </div>
            )}

            {techTab === "integrity_audit" && (
              <div className="bg-[#0b0821] border border-fuchsia-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Data Integrity & Table Calculation Sync
                </h4>
                <div className="p-4 bg-[#141029] rounded-2xl border border-emerald-500/20 text-xs text-gray-300 leading-relaxed font-mono">
                  All table mathematical constraints verified: Goal Difference (GD = GF - GA) and
                  Points (Pts = W*3 + D*1) match matchday results across all four competing clubs.
                  Zero discrepancies detected.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE 7: ASSISTANT TECH MANAGER — AHMED KUSOW
          Sidebar Menu: Tech Support Desk, Content Draft Queue,
                        Media Asset Library, User Technical Support,
                        Data Backup & Continuity
          ========================================================================= */}
      {activeWorkspaceRole === "ASST_TECH_MANAGER" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dedicated Left Sidebar Navigation Menu */}
          <div className="lg:col-span-3 bg-[#0a071b] border border-indigo-400/30 rounded-3xl p-4 space-y-2 shadow-xl">
            <div className="px-3 py-2 border-b border-[#2e2554]">
              <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300 block">
                Sidebar Navigation Menu
              </span>
              <h4 className="text-sm font-black text-white uppercase mt-0.5">Assistant Tech</h4>
            </div>

            <nav className="space-y-1">
              {[
                { id: "support_desk", label: "🛠️ Tech Support Desk", sub: "Operational Summary" },
                {
                  id: "content_queue",
                  label: "📝 Content Draft Queue",
                  sub: "Articles, Recaps & Notes",
                },
                {
                  id: "media_library",
                  label: "📸 Media Asset Library",
                  sub: "Photos, Highlights & Logos",
                },
                { id: "user_support", label: "🎧 User Support", sub: "Helpdesk & Password Resets" },
                {
                  id: "data_backup",
                  label: "💾 Data Backup & Continuity",
                  sub: "Offline Exports & Recovery",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAsstTechTab(item.id as typeof asstTechTab)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer flex flex-col ${
                    asstTechTab === item.id
                      ? "bg-indigo-400/20 border border-indigo-400/50 text-white shadow-lg shadow-indigo-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {asstTechTab === "support_desk" && (
              <div className="bg-[#0b0821] border border-indigo-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-indigo-400" />
                  Tech Support Desk
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#141029] rounded-2xl border border-indigo-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Draft Articles
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      {contentDrafts.length} Queued
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-indigo-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Helpdesk Tickets
                    </span>
                    <span className="text-lg font-black text-yellow-300 font-mono">
                      {helpdeskTickets.length} Total
                    </span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-indigo-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Media Assets
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">48 Headshots</span>
                  </div>
                  <div className="p-3 bg-[#141029] rounded-2xl border border-indigo-400/20">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Last Backup
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">Today</span>
                  </div>
                </div>
              </div>
            )}

            {asstTechTab === "content_queue" && (
              <div className="bg-[#0b0821] border border-indigo-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Content Draft Queue (Articles & Recaps)
                </h4>
                <div className="space-y-3">
                  {contentDrafts.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div>
                        <h6 className="text-xs font-black text-white">{d.title}</h6>
                        <span className="text-[10px] text-indigo-300 font-mono">
                          {d.type} • Author: {d.submittedBy}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${d.status === "READY_FOR_APPROVAL" ? "bg-emerald-500/20 text-emerald-300" : "bg-cyan-500/20 text-cyan-300"}`}
                      >
                        {d.status}
                      </span>
                    </div>
                  ))}

                  <div className="p-4 bg-[#0a071b] rounded-2xl border border-indigo-400/30 space-y-2 mt-4">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase block">
                      Compose New Match Content Draft:
                    </span>
                    <input
                      type="text"
                      placeholder="Article Title (e.g. Tactical Breakdown: Midfield Battles in Matchweek 2)"
                      value={newDraftTitle}
                      onChange={(e) => setNewDraftTitle(e.target.value)}
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newDraftType}
                        onChange={(e) => setNewDraftType(e.target.value)}
                        className="bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Match Recap">Match Recap</option>
                        <option value="Match Preview">Match Preview</option>
                        <option value="Devotional">Devotional Note</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newDraftTitle.trim()) return;
                          setContentDrafts([
                            ...contentDrafts,
                            {
                              id: `draft-${Date.now()}`,
                              title: newDraftTitle.trim(),
                              status: "READY_FOR_APPROVAL",
                              submittedBy: "Sturridge Ochongoi",
                              type: newDraftType,
                            },
                          ]);
                          setNewDraftTitle("");
                          showToast(
                            "✓ Draft submitted to Technological Manager for live publishing review!",
                          );
                        }}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-400 to-cyan-400 text-black font-black text-xs uppercase hover:brightness-110 cursor-pointer shadow-lg"
                      >
                        Submit to Review Queue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {asstTechTab === "media_library" && (
              <div className="bg-[#0b0821] border border-indigo-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-400" />
                  Media Asset Library
                </h4>
                <div className="p-4 bg-[#141029] rounded-2xl border border-indigo-400/20 text-xs text-gray-300 leading-relaxed font-mono">
                  Official match photo gallery storage, team crest vectors, YouTube match highlight
                  video IDs, and sponsor graphic assets.
                </div>
              </div>
            )}

            {asstTechTab === "user_support" && (
              <div className="bg-[#0b0821] border border-indigo-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-indigo-400" />
                  User Technical Support & Helpdesk
                </h4>
                <div className="space-y-3">
                  {helpdeskTickets.map((tick) => (
                    <div
                      key={tick.id}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                    >
                      <div>
                        <h6 className="text-xs font-black text-white">{tick.issue}</h6>
                        <span className="text-[10px] text-gray-400 font-mono">
                          From: {tick.requester}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${tick.status === "RESOLVED" ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/20 text-yellow-300"}`}
                      >
                        {tick.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {asstTechTab === "data_backup" && (
              <div className="bg-[#0b0821] border border-indigo-400/30 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  Data Backup & Offline Continuity
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Export complete snapshots of all league tables, fixtures, player statistics, and
                  executive motions to a standalone JSON file for offline disaster recovery.
                </p>
                <button
                  type="button"
                  onClick={handleExportDatabase}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-400 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Manual Offline Data Export</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
