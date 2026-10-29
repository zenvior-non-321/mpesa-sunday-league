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
import {
  BOARD_ROLES_CATALOG,
  type BoardRoleDefinition,
  type BoardRoleFeature,
} from "../lib/boardRolesCatalog";

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

  // Active workspace role selection (Super admin defaults to PRESIDENT, board members strictly locked to their assigned role)
  const [activeWorkspaceRole, setActiveWorkspaceRole] = useState<LeagueRole>(() => {
    if (isSuperAdmin) return "PRESIDENT";
    if (currentRole && currentRole !== "GUEST") return currentRole;
    return "PRESIDENT";
  });

  // Modal state when a board member tries to access another member's desk
  const [restrictedRoleTarget, setRestrictedRoleTarget] = useState<LeagueRole | null>(null);

  useEffect(() => {
    if (!isSuperAdmin && currentRole && currentRole !== "GUEST") {
      setActiveWorkspaceRole(currentRole);
    }
  }, [currentRole, isSuperAdmin]);

  const handleSwitchWorkspaceRole = (targetRole: LeagueRole) => {
    if (isSuperAdmin) {
      setActiveWorkspaceRole(targetRole);
      return;
    }
    // Board member isolation rule:
    if (currentRole && currentRole !== "GUEST") {
      if (targetRole === currentRole) {
        setActiveWorkspaceRole(targetRole);
      } else {
        // Access strictly locked to the assigned board member
        setRestrictedRoleTarget(targetRole);
      }
    } else {
      setRestrictedRoleTarget(targetRole);
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 20+ Features Matrix State
  const [featureSearchQuery, setFeatureSearchQuery] = useState("");
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState("ALL");
  const [selectedFeature, setSelectedFeature] = useState<BoardRoleFeature | null>(null);
  const [featureStatusMap, setFeatureStatusMap] = useState<
    Record<string, "ACTIVE" | "PENDING" | "COMPLETED">
  >({});
  const [featureNotes, setFeatureNotes] = useState<Record<string, string>>({});

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
        if (role) {
          if (isSuperAdmin || currentRole === role) {
            setActiveWorkspaceRole(role);
          } else {
            setRestrictedRoleTarget(role);
            return;
          }
        }
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

  const [appeals, setAppeals] = useState<
    Array<{
      id: string;
      club: string;
      matchId?: number;
      subject: string;
      submittedBy: string;
      status: "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
      evidenceSummary: string;
      ruling?: string;
    }>
  >([]);
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
      title: "Fair Play & Matchday Sportsmanship Charter",
      article: "Article II, Section 1",
      text: "Every matchday shall commence with unified pre-match fair play handshake protocol and captain declarations.",
      date: "2026-10-22",
    },
    {
      id: "amend-3",
      title: "Direct Quad-Crew Match Officiating Mandate",
      article: "Article VII, Section 3",
      text: "Every competitive fixture requires Center Referee, Senior Assistant, Assistant Referee, Fourth Official, and Match Commissioner certification.",
      date: "2026-10-26",
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
      title: "Ratification of 2026 Sunday League Competition Venues & Schedules",
      deadline: "Sunday, Nov 15, 2026 at 23:59 EAT",
      yesVotes: ["Alex Haro (President)", "Babra Nandako (Deputy)", "Tonnie Mark (Records)"],
      noVotes: [] as string[],
      status: "OPEN",
    },
  ]);
  const [newMotionTitle, setNewMotionTitle] = useState("");

  const [clubApprovals, setClubApprovals] = useState([
    {
      id: "ca-1",
      name: "Samba Boys",
      division: "Youth Premier Division",
      status: "APPROVED",
      requestedBy: "Samba Club Secretary",
    },
    {
      id: "ca-2",
      name: "Royal Rangers",
      division: "Youth Premier Division",
      status: "APPROVED",
      requestedBy: "Rangers Operations Officer",
    },
    {
      id: "ca-3",
      name: "Young Stars City",
      division: "Youth Premier Division",
      status: "APPROVED",
      requestedBy: "Young Stars Technical Director",
    },
    {
      id: "ca-4",
      name: "Mzinga Boyz",
      division: "Youth Premier Division",
      status: "APPROVED",
      requestedBy: "Mzinga Boyz Representative",
    },
  ]);

  const [boardMeetings, setBoardMeetings] = useState([
    {
      id: "bm-1",
      title: "Supreme Council Executive Strategy & Match Operations Session",
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
      name: "Emergency First Aid & Sports Medical Readiness",
      assignedTo: "League Medical & Health Stewards",
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

  const [escalations, setEscalations] = useState<
    Array<{
      id: string;
      department: string;
      issue: string;
      priority: "HIGH" | "MEDIUM" | "LOW";
      sentAt: string;
      resolved: boolean;
    }>
  >([]);

  // =========================================================================
  // 3. REGISTER & REGULATIONS — Whitney Juma State & Sub-Menu Tabs
  // =========================================================================
  const [regulationsTab, setRegulationsTab] = useState<
    | "dashboard"
    | "licensing"
    | "player_verification"
    | "transfers_desk"
    | "eligibility_violations"
    | "compliance_waivers"
  >("dashboard");

  const [regTransferFromId, setRegTransferFromId] = useState<number>(1);
  const [regTransferToId, setRegTransferToId] = useState<number>(6);
  const [regTransferPlayer, setRegTransferPlayer] = useState<string>("");

  const [clubRegistrations, setClubRegistrations] = useState([
    {
      id: "reg-1",
      clubName: "Samba Boys",
      clubZone: "Academy East District",
      staffVerified: true,
      licenseIssued: true,
      status: "APPROVED",
    },
    {
      id: "reg-2",
      clubName: "Royal Rangers",
      clubZone: "Academy West District",
      staffVerified: true,
      licenseIssued: true,
      status: "APPROVED",
    },
    {
      id: "reg-3",
      clubName: "Young Stars City",
      clubZone: "Academy North District",
      staffVerified: true,
      licenseIssued: true,
      status: "APPROVED",
    },
    {
      id: "reg-4",
      clubName: "Mzinga Boyz",
      clubZone: "Academy South District",
      staffVerified: true,
      licenseIssued: true,
      status: "APPROVED",
    },
  ]);

  const [eligibilityAuditLogs, setEligibilityAuditLogs] = useState<
    Array<{
      id: string;
      player: string;
      club: string;
      age: number;
      division: string;
      status: "PASSED" | "FLAGGED_OVERAGE" | "FLAGGED_DOCUMENTS";
      notes: string;
    }>
  >([]);

  const [pendingPlayerApprovals, setPendingPlayerApprovals] = useState<
    Array<{
      id: string;
      name: string;
      club: string;
      admissionNo: string;
      age: number;
      docType: string;
      approved: boolean;
    }>
  >([]);

  const [waiversTracker, setWaiversTracker] = useState<
    Array<{
      id: string;
      athlete: string;
      club: string;
      consentSubmitted: boolean;
      medicalClearance: boolean;
      expiryDate: string;
    }>
  >([]);

  // =========================================================================
  // 4. MATCH OFFICIATING — Idi Sebantu State & Sub-Menu Tabs
  // =========================================================================
  const [officiatingTab, setOfficiatingTab] = useState<
    "overview" | "scheduler" | "ref_reports" | "performance" | "disputes"
  >("overview");

  const [referees, setReferees] = useState<
    Array<{
      id: string;
      name: string;
      badge: string;
      phone?: string;
      email?: string;
      assignedMatches: number;
      rating: number;
      active: boolean;
    }>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mpesa_pes_referees_v2");
        if (stored) return JSON.parse(stored);
      } catch {
        // Ignore
      }
    }
    return [
      {
        id: "ref-bm",
        name: "Bidan Mwaura",
        badge: "Center Referee",
        phone: "+254 712 345 678",
        email: "bidan.ref@mpesa.org",
        assignedMatches: 5,
        rating: 5.0,
        active: true,
      },
      {
        id: "ref-1",
        name: "Ian Muli",
        badge: "Center Referee",
        phone: "+254 722 111 222",
        email: "ian.ref@mpesa.org",
        assignedMatches: 4,
        rating: 4.9,
        active: true,
      },
      {
        id: "ref-2",
        name: "Francis Ndirangu",
        badge: "Linesman 1 (Senior Assistant)",
        phone: "+254 733 444 555",
        email: "francis.ref@mpesa.org",
        assignedMatches: 3,
        rating: 4.8,
        active: true,
      },
      {
        id: "ref-3",
        name: "Peter Otieno",
        badge: "Linesman 2 (Assistant Referee)",
        phone: "+254 744 777 888",
        email: "peter.ref@mpesa.org",
        assignedMatches: 2,
        rating: 4.6,
        active: true,
      },
      {
        id: "ref-4",
        name: "Victor Kamau",
        badge: "Fourth Official",
        phone: "+254 755 999 000",
        email: "victor.k@mpesa.org",
        assignedMatches: 2,
        rating: 4.7,
        active: true,
      },
      {
        id: "ref-5",
        name: "Mitchelle Muthoni",
        badge: "Match Commissioner (Technical Delegate)",
        phone: "+254 711 222 333",
        email: "commissioner.muthoni@mpesa.org",
        assignedMatches: 3,
        rating: 5.0,
        active: true,
      },
    ];
  });

  const [newRefName, setNewRefName] = useState("");
  const [newRefBadge, setNewRefBadge] = useState("Center Referee");
  const [newRefPhone, setNewRefPhone] = useState("");
  const [newRefEmail, setNewRefEmail] = useState("");

  const [schedFixtureId, setSchedFixtureId] = useState<number>(1);
  const [schedCenterRef, setSchedCenterRef] = useState("Bidan Mwaura");
  const [schedLinesman1, setSchedLinesman1] = useState("Francis Ndirangu");
  const [schedLinesman2, setSchedLinesman2] = useState("Peter Otieno");
  const [schedFourthOfficial, setSchedFourthOfficial] = useState("Victor Kamau");
  const [schedChaplain, setSchedChaplain] = useState("Mitchelle Muthoni (Match Commissioner)");

  const [chaplainAssignments, setChaplainAssignments] = useState([
    {
      id: "comm-1",
      matchweek: 1,
      fixture: "Samba Boys vs Young Stars City",
      chaplain: "Mitchelle Muthoni",
      prayerFocus: "FIFA Fair Play Handshake & Timekeeping",
    },
    {
      id: "comm-2",
      matchweek: 2,
      fixture: "Royal Rangers vs Mzinga Boyz",
      chaplain: "Idi Sebantu",
      prayerFocus: "Conduct Protocol & Pitch Safety",
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
      title: "Player of the Week: Wokabi's Opening Day Brace",
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
      title: "Tactical Breakdown: High-Press Systems in Youth Football",
      status: "READY_FOR_APPROVAL",
      submittedBy: "Sturridge Ochongoi",
      type: "Match Analysis",
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
            { id: "PRESIDENT", label: "1. President (Alex Haro)", icon: Crown },
            { id: "DEPUTY_PRESIDENT", label: "2. Deputy (Babra Nandako)", icon: Shield },
            { id: "REGULATIONS_MANAGER", label: "3. Registrar (Whitney Juma)", icon: FileText },
            { id: "MATCH_OFFICIATING_MANAGER", label: "4. Officiating (Idi Sebantu)", icon: Flag },
            { id: "RECORDS_MANAGER", label: "5. Records (Tonnie Odundo)", icon: BookOpen },
            { id: "TECH_MANAGER", label: "6. Tech Mgr (Victor Kiplagat)", icon: Activity },
            { id: "ASST_TECH_MANAGER", label: "7. Asst Tech (Sturridge)", icon: Layers },
          ].map((r) => {
            const Icon = r.icon;
            const isActive = activeWorkspaceRole === r.id;
            const isAccessible = isSuperAdmin || currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSwitchWorkspaceRole(r.id as LeagueRole)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md"
                    : isAccessible
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-amber-300 opacity-80"
                }`}
                title={
                  isAccessible
                    ? `Operate ${r.label}`
                    : `Protected Desk: ${r.label} (Council Separation of Powers)`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
                {!isAccessible && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC ROLE PROFILE CARD & 20+ FEATURES CATALOG (BOARD_ROLES_CATALOG)
          ========================================================================= */}
      {(() => {
        const roleKey = (
          activeWorkspaceRole === "SUPER_ADMIN" ? "PRESIDENT" : activeWorkspaceRole
        ) as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">;
        const roleDef = BOARD_ROLES_CATALOG[roleKey];
        if (!roleDef) return null;

        const categories = ["ALL", ...Array.from(new Set(roleDef.features.map((f) => f.category)))];
        const filteredFeatures = roleDef.features.filter((f) => {
          const matchesCat =
            featureCategoryFilter === "ALL" || f.category === featureCategoryFilter;
          const q = featureSearchQuery.toLowerCase().trim();
          const matchesQ =
            !q ||
            f.title.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q);
          return matchesCat && matchesQ;
        });

        return (
          <div className="space-y-4">
            {/* Role Header Card */}
            <div className="p-5 bg-gradient-to-r from-[#120d2d] via-[#18113c] to-[#0d0924] border-2 border-indigo-400/40 rounded-3xl shadow-xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow">
                    {roleDef.iconSymbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {roleDef.tier} • {roleDef.department}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">
                        Lead: {roleDef.officialLead}
                      </span>
                    </div>
                    <h3 className="font-header text-lg sm:text-xl font-black text-white uppercase mt-0.5">
                      {roleDef.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 font-mono font-bold">
                    {roleDef.features.length} Features Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#0a071b] rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Core Mandate & Function:
                  </span>
                  <p className="text-gray-300 leading-relaxed">{roleDef.roleDescription}</p>
                </div>
                <div className="p-3 bg-[#0a071b] rounded-2xl border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    ⚡ Web Flow & Public Impact:
                  </span>
                  <p className="text-emerald-200 leading-relaxed font-mono text-[11px]">
                    {roleDef.webFlowImpact}
                  </p>
                </div>
              </div>

              {/* 20+ Features Matrix Drawer / Quick Browser */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Assigned 20+ Functional Features & Workspaces ({filteredFeatures.length}/
                      {roleDef.features.length})
                    </span>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search features..."
                      value={featureSearchQuery}
                      onChange={(e) => setFeatureSearchQuery(e.target.value)}
                      className="w-full bg-[#0a071b] border border-[#2e2554] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeatureCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold tracking-wide transition cursor-pointer whitespace-nowrap ${
                        featureCategoryFilter === cat
                          ? "bg-amber-400 text-black font-black shadow"
                          : "bg-[#0a071b] text-gray-400 hover:text-white border border-[#2e2554]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Features Mini-Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {filteredFeatures.map((feat) => {
                    const status = featureStatusMap[feat.id] || "ACTIVE";
                    return (
                      <div
                        key={feat.id}
                        onClick={() => setSelectedFeature(feat)}
                        className="p-3 bg-[#0e0926] hover:bg-[#150f38] border border-[#2e2554] hover:border-amber-400/40 rounded-2xl transition cursor-pointer flex flex-col justify-between gap-1 group shadow"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#1d1645] text-amber-300 border border-amber-400/20">
                            {feat.category}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              status === "ACTIVE"
                                ? "bg-emerald-400/20 text-emerald-300"
                                : "bg-cyan-400/20 text-cyan-300"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                        <h5 className="text-xs font-black text-white group-hover:text-amber-300 transition line-clamp-1 mt-1">
                          {feat.title}
                        </h5>
                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                          {feat.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Feature Interactive Drawer/Modal */}
            {selectedFeature && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#100c2a] border-2 border-amber-400/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <div>
                        <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                          {selectedFeature.category} • {roleDef.officialLead}
                        </span>
                        <h4 className="text-sm font-black text-white uppercase">
                          {selectedFeature.title}
                        </h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFeature(null)}
                      className="text-gray-400 hover:text-white p-1 rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed bg-[#0a071b] p-3 rounded-2xl border border-white/5">
                    {selectedFeature.description}
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-gray-400">
                      Module Execution Notes / Decision Record:
                    </label>
                    <textarea
                      rows={2}
                      value={featureNotes[selectedFeature.id] || ""}
                      onChange={(e) =>
                        setFeatureNotes({ ...featureNotes, [selectedFeature.id]: e.target.value })
                      }
                      placeholder="Add executive comments, verification stamps, or audit references..."
                      className="w-full bg-[#161138] border border-[#2e2554] rounded-xl p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2e2554]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setFeatureStatusMap({
                            ...featureStatusMap,
                            [selectedFeature.id]: "ACTIVE",
                          });
                          showToast(`✓ ${selectedFeature.title} marked ACTIVE`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 cursor-pointer"
                      >
                        Set Active
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFeatureStatusMap({
                            ...featureStatusMap,
                            [selectedFeature.id]: "COMPLETED",
                          });
                          showToast(`✓ ${selectedFeature.title} marked CERTIFIED / COMPLETED`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 cursor-pointer"
                      >
                        Certify Module
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        showToast(
                          `✓ Executed task for "${selectedFeature.title}"! Changes synchronized.`,
                        );
                        setSelectedFeature(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase hover:brightness-110 shadow cursor-pointer"
                    >
                      Execute Module
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* =========================================================================
          ROLE 1: PRESIDENT — BRAMUEL AMIRAH
          Sidebar Menu: Executive Overview, Dispute & Hearing Center, Policy & Constitution Portal,
                        Board Voting & Motions, Executive Approvals, Board Meeting Planner
          ========================================================================= */}
      {activeWorkspaceRole === "PRESIDENT" && (
        <div className="w-full space-y-6 animate-in fade-in">
          {/* Top Desk Pill Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#0a071b] border border-amber-400/30 rounded-2xl shadow-lg">
            {[
              { id: "overview", label: "📊 Executive Overview", count: "KPIs" },
              { id: "hearings", label: "⚖️ Dispute & Hearing Center", count: appeals.length },
              { id: "policy", label: "📜 Policy & Constitution", count: publishedAmendments.length },
              { id: "voting", label: "🗳️ Board Voting & Motions", count: activeMotions.length },
              { id: "approvals", label: "🤝 Executive Approvals", count: clubApprovals.length },
              { id: "meeting", label: "📅 Board Meeting Planner", count: boardMeetings.length },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPresidentTab(item.id as typeof presidentTab)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  presidentTab === item.id
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    presidentTab === item.id ? "bg-black/20 text-black" : "bg-white/10 text-gray-400"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Full Width Main Workspace Content */}
          <div className="space-y-6">
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
        <div className="w-full space-y-6 animate-in fade-in">
          {/* Top Desk Pill Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#0a071b] border border-cyan-400/30 rounded-2xl shadow-lg">
            {[
              { id: "overview", label: "📊 Operations Hub", count: "Readiness" },
              { id: "monitoring", label: "📈 Department Progress", count: "4 Depts" },
              {
                id: "acting_override",
                label: "⚡ Acting Presidential Override",
                count: actingPresidentOverride ? "ACTIVE" : "STANDBY",
              },
              { id: "task_force", label: "🎯 Task Force Manager", count: taskForces.length },
              { id: "escalations", label: "⚠️ Escalations Desk", count: escalations.length },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDeputyTab(item.id as typeof deputyTab)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  deputyTab === item.id
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    deputyTab === item.id ? "bg-black/20 text-black" : "bg-white/10 text-gray-400"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Full Width Main Workspace Content */}
          <div className="space-y-6">
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
        <div className="w-full space-y-6 animate-in fade-in">
          {/* Top Desk Pill Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#0a071b] border border-blue-400/30 rounded-2xl shadow-lg">
            {[
              { id: "dashboard", label: "📋 Registration Dashboard", count: `${teams.length} Clubs` },
              { id: "licensing", label: "🛡️ Club & Staff Licensing", count: clubRegistrations.length },
              {
                id: "player_verification",
                label: "⚽ Player Verification Desk",
                count: pendingPlayerApprovals.length,
              },
              { id: "transfers_desk", label: "🔄 Squad Transfers & 15-Cap", count: "15-Cap" },
              {
                id: "eligibility_violations",
                label: "🚨 Eligibility & Violations",
                count: eligibilityAuditLogs.length,
              },
              {
                id: "compliance_waivers",
                label: "📑 Compliance & Waivers",
                count: waiversTracker.length,
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRegulationsTab(item.id as typeof regulationsTab)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  regulationsTab === item.id
                    ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-black font-black shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    regulationsTab === item.id ? "bg-black/20 text-black" : "bg-white/10 text-gray-400"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Full Width Main Workspace Content */}
          <div className="space-y-6">
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

            {regulationsTab === "transfers_desk" && (
              <div className="bg-[#0b0821] border border-blue-400/30 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="border-b border-[#2e2554] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Inter-Club Squad Transfers & 15-Player Cap Regulator
                    </h4>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Enforce strict 15-player squad limits (Article IV, Section 2) and process
                      certified athlete transfer clearances.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
                    Regulation Desk Active
                  </span>
                </div>

                {/* Transfer Form Card */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!regTransferPlayer || regTransferFromId === regTransferToId) {
                      showToast("⚠ Please choose a player and two different clubs.");
                      return;
                    }
                    const destTeam = teams.find((t) => t.id === Number(regTransferToId));
                    if (destTeam && (destTeam.squad?.length || 0) >= 15) {
                      showToast(
                        `⚠ TRANSFER BLOCKED: ${destTeam.name} already has 15 players (Max Cap Reached).`,
                      );
                      return;
                    }
                    const sourceTeam = teams.find((t) => t.id === Number(regTransferFromId));
                    const playerObj = sourceTeam?.squad?.find((p) => p.name === regTransferPlayer);
                    if (!playerObj) {
                      showToast("⚠ Athlete not found in source club squad.");
                      return;
                    }

                    const updatedTeams = teams.map((t) => {
                      if (t.id === Number(regTransferFromId)) {
                        return {
                          ...t,
                          squad: (t.squad || []).filter((p) => p.name !== regTransferPlayer),
                        };
                      }
                      if (t.id === Number(regTransferToId)) {
                        return {
                          ...t,
                          squad: [...(t.squad || []), playerObj],
                        };
                      }
                      return t;
                    });

                    setTeams(updatedTeams);
                    localStorage.setItem("mpesa_pes_teams_v6", JSON.stringify(updatedTeams));
                    window.dispatchEvent(new Event("storage"));
                    showToast(`✓ Player ${regTransferPlayer} transferred to ${destTeam?.name}!`);
                    setRegTransferPlayer("");
                  }}
                  className="bg-[#141029] border border-[#2e2554] rounded-2xl p-5 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                        Origin Club
                      </label>
                      <select
                        value={regTransferFromId}
                        onChange={(e) => {
                          const newFrom = Number(e.target.value);
                          setRegTransferFromId(newFrom);
                          const firstP = teams.find((t) => t.id === newFrom)?.squad?.[0]?.name;
                          if (firstP) setRegTransferPlayer(firstP);
                        }}
                        className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      >
                        {teams.map((t) => (
                          <option key={`reg-from-${t.id}`} value={t.id}>
                            {t.name} ({t.squad?.length || 0}/15)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                        Select Athlete
                      </label>
                      <select
                        value={regTransferPlayer}
                        onChange={(e) => setRegTransferPlayer(e.target.value)}
                        className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      >
                        <option value="">-- Choose Athlete --</option>
                        {(teams.find((t) => t.id === Number(regTransferFromId))?.squad || []).map(
                          (p, pIdx) => (
                            <option key={`reg-p-${p.name}-${pIdx}`} value={p.name}>
                              #{p.number || pIdx + 1} - {p.name} ({p.position || "MID"})
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                        Destination Club
                      </label>
                      <select
                        value={regTransferToId}
                        onChange={(e) => setRegTransferToId(Number(e.target.value))}
                        className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      >
                        {teams.map((t) => (
                          <option key={`reg-to-${t.id}`} value={t.id}>
                            {t.name} ({t.squad?.length || 0}/15){" "}
                            {(t.squad?.length || 0) >= 15 ? "⚠ FULL" : "✓ Cap OK"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 15-Player Cap Warning Indicator */}
                  {(() => {
                    const dest = teams.find((t) => t.id === Number(regTransferToId));
                    const isFull = (dest?.squad?.length || 0) >= 15;
                    if (isFull) {
                      return (
                        <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>
                            <strong>Squad Cap Warning:</strong> {dest?.name} has reached the maximum
                            15-player roster limit. Transfer will be blocked by system regulations.
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="flex items-center justify-between pt-2 border-t border-[#2e2554]">
                    <span className="text-[11px] text-gray-400 font-mono">
                      Target Cap:{" "}
                      {teams.find((t) => t.id === Number(regTransferToId))?.squad?.length || 0}/15
                      Players
                    </span>
                    <button
                      type="submit"
                      disabled={!regTransferPlayer || regTransferFromId === regTransferToId}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wide transition shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                    >
                      Authorize & Execute Transfer
                    </button>
                  </div>
                </form>

                {/* Clubs Squad Roster Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {teams.map((t) => (
                    <div
                      key={`reg-team-squad-${t.id}`}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.color || "#00f0ff" }}
                          />
                          <span className="font-bold text-white text-xs">{t.name}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            (t.squad?.length || 0) >= 15
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {t.squad?.length || 0} / 15 Players
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                        {(t.squad || []).map((p, idx) => (
                          <span
                            key={`p-tag-${t.id}-${p.name}-${idx}`}
                            className="text-[10px] px-2 py-0.5 rounded-lg bg-[#0a071b] text-gray-300 border border-[#261f4d]"
                          >
                            #{p.number || idx + 1} {p.name}
                          </span>
                        ))}
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
              <div className="bg-[#0b0821] border border-purple-400/30 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="border-b border-[#2e2554] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      Match Officiating Programmes Manager & Quad-Crew Allocator
                    </h4>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Register certified referees and assign complete quad-crews (Center Ref,
                      Linesman 1, Linesman 2, 4th Official & Chaplain) to match fixtures.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-xs border border-purple-500/30">
                    Idi Sebantu • Officiating Lead
                  </span>
                </div>

                {/* 1. Register New Referee Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newRefName.trim()) return;
                    const createdRef = {
                      id: `ref-${Date.now()}`,
                      name: newRefName.trim(),
                      badge: newRefBadge,
                      phone: newRefPhone.trim() || "+254 700 000 000",
                      email:
                        newRefEmail.trim() ||
                        `${newRefName.toLowerCase().replace(/\s+/g, ".")}@mpesa.org`,
                      assignedMatches: 0,
                      rating: 5.0,
                      active: true,
                    };
                    const updated = [createdRef, ...referees];
                    setReferees(updated);
                    localStorage.setItem("mpesa_pes_referees_v2", JSON.stringify(updated));
                    setNewRefName("");
                    setNewRefPhone("");
                    setNewRefEmail("");
                    showToast(
                      `✓ Registered match official: ${createdRef.name} (${createdRef.badge})!`,
                    );
                  }}
                  className="bg-[#141029] border border-[#2e2554] rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                    <h5 className="text-xs font-black uppercase text-purple-300 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-purple-400" />
                      Register New Certified Match Referee
                    </h5>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Total Roster: {referees.length} Certified Officials
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                        Official's Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel Karanja"
                        value={newRefName}
                        onChange={(e) => setNewRefName(e.target.value)}
                        className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                        Primary Certification / Badge
                      </label>
                      <select
                        value={newRefBadge}
                        onChange={(e) => setNewRefBadge(e.target.value)}
                        className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-purple-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      >
                        <option value="Center Referee">Center Referee (Main)</option>
                        <option value="Linesman 1 (Senior Assistant)">
                          Linesman 1 (Senior Assistant)
                        </option>
                        <option value="Linesman 2 (Assistant Referee)">
                          Linesman 2 (Assistant Referee)
                        </option>
                        <option value="Fourth Official">Fourth Official (Table & Subs)</option>
                        <option value="Match Commissioner (Technical Delegate)">
                          Match Commissioner (Technical Delegate)
                        </option>
                        <option value="Senior VAR / Reviewer">Senior VAR / Reviewer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                        Phone Contact
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +254 712 999 888"
                        value={newRefPhone}
                        onChange={(e) => setNewRefPhone(e.target.value)}
                        className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. official@mpesa.org"
                        value={newRefEmail}
                        onChange={(e) => setNewRefEmail(e.target.value)}
                        className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wide transition shadow cursor-pointer"
                    >
                      Register Match Official
                    </button>
                  </div>
                </form>

                {/* 2. Quad-Crew Fixture Officiating Allocator */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const updatedFixtures = fixtures.map((f) => {
                      if (f.id === schedFixtureId) {
                        return {
                          ...f,
                          referee: `Center: ${schedCenterRef} • Linesmen: ${schedLinesman1} & ${schedLinesman2} • 4th Official: ${schedFourthOfficial}`,
                          chaplain: schedChaplain,
                        };
                      }
                      return f;
                    });

                    setFixtures(updatedFixtures);
                    localStorage.setItem("mpesa_pes_matches_v6", JSON.stringify(updatedFixtures));
                    window.dispatchEvent(new Event("storage"));

                    // Increment assigned counts for the assigned officials
                    const assignedNames = [
                      schedCenterRef,
                      schedLinesman1,
                      schedLinesman2,
                      schedFourthOfficial,
                      schedChaplain,
                    ];
                    const updatedRefs = referees.map((r) =>
                      assignedNames.includes(r.name)
                        ? { ...r, assignedMatches: (r.assignedMatches || 0) + 1 }
                        : r,
                    );
                    setReferees(updatedRefs);
                    localStorage.setItem("mpesa_pes_referees_v2", JSON.stringify(updatedRefs));

                    const fixObj = fixtures.find((f) => f.id === schedFixtureId);
                    showToast(
                      `✓ Published complete Quad-Crew to MW ${fixObj?.matchweek || 1} fixture!`,
                    );
                  }}
                  className="bg-[#141029] border border-[#2e2554] rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                    <h5 className="text-xs font-black uppercase text-purple-300 flex items-center gap-1.5">
                      <Flag className="w-4 h-4 text-purple-400" />
                      Deploy Quad-Crew Match Officials to Fixture
                    </h5>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Center Ref + 2 Linesmen + 4th Official + Chaplain
                    </span>
                  </div>

                  {/* Target Fixture Select */}
                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                      Select Match Fixture to Assign *
                    </label>
                    <select
                      value={schedFixtureId}
                      onChange={(e) => {
                        const newId = Number(e.target.value);
                        setSchedFixtureId(newId);
                        const match = fixtures.find((f) => f.id === newId);
                        if (match?.chaplain) setSchedChaplain(match.chaplain);
                      }}
                      className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-purple-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                    >
                      {fixtures.map((f, fIdx) => {
                        const h = teams.find((t) => t.id === f.homeId)?.name || `#${f.homeId}`;
                        const a = teams.find((t) => t.id === f.awayId)?.name || `#${f.awayId}`;
                        return (
                          <option key={f.id ?? `sched-f-${fIdx}`} value={f.id}>
                            Matchweek {f.matchweek}: {h} vs {a} ({f.date || "Nov 2026"} @{" "}
                            {f.venue || "Academy Stadium"})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* 4 Officials + Chaplain Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Center Referee */}
                    <div className="p-3 bg-[#0a071b] rounded-xl border border-purple-500/30 space-y-1">
                      <label className="block text-purple-300 font-bold uppercase text-[10px]">
                        1. Center Referee
                      </label>
                      <select
                        value={schedCenterRef}
                        onChange={(e) => setSchedCenterRef(e.target.value)}
                        className="w-full bg-[#141029] border border-[#2e2554] focus:border-purple-400 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none"
                      >
                        {referees.map((r) => (
                          <option key={`c-ref-${r.id}`} value={r.name}>
                            {r.name} ({r.badge})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Linesman 1 */}
                    <div className="p-3 bg-[#0a071b] rounded-xl border border-cyan-500/30 space-y-1">
                      <label className="block text-cyan-300 font-bold uppercase text-[10px]">
                        2. Linesman 1 (Senior Asst)
                      </label>
                      <select
                        value={schedLinesman1}
                        onChange={(e) => setSchedLinesman1(e.target.value)}
                        className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none"
                      >
                        {referees.map((r) => (
                          <option key={`l1-ref-${r.id}`} value={r.name}>
                            {r.name} ({r.badge})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Linesman 2 */}
                    <div className="p-3 bg-[#0a071b] rounded-xl border border-cyan-500/30 space-y-1">
                      <label className="block text-cyan-300 font-bold uppercase text-[10px]">
                        3. Linesman 2 (Assistant)
                      </label>
                      <select
                        value={schedLinesman2}
                        onChange={(e) => setSchedLinesman2(e.target.value)}
                        className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none"
                      >
                        {referees.map((r) => (
                          <option key={`l2-ref-${r.id}`} value={r.name}>
                            {r.name} ({r.badge})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 4th Official */}
                    <div className="p-3 bg-[#0a071b] rounded-xl border border-amber-500/30 space-y-1">
                      <label className="block text-amber-300 font-bold uppercase text-[10px]">
                        4. Fourth Official
                      </label>
                      <select
                        value={schedFourthOfficial}
                        onChange={(e) => setSchedFourthOfficial(e.target.value)}
                        className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none"
                      >
                        {referees.map((r) => (
                          <option key={`fo-ref-${r.id}`} value={r.name}>
                            {r.name} ({r.badge})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Match Commissioner */}
                    <div className="p-3 bg-[#0a071b] rounded-xl border border-emerald-500/30 space-y-1">
                      <label className="block text-emerald-300 font-bold uppercase text-[10px]">
                        5. Match Commissioner
                      </label>
                      <input
                        type="text"
                        value={schedChaplain}
                        onChange={(e) => setSchedChaplain(e.target.value)}
                        placeholder="e.g. Mitchelle Muthoni (Technical Delegate)"
                        className="w-full bg-[#141029] border border-[#2e2554] focus:border-emerald-400 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2e2554]">
                    <span className="text-[11px] text-gray-400 font-mono">
                      Current:{" "}
                      {fixtures.find((f) => f.id === schedFixtureId)?.referee ||
                        "Pending Crew Assignment"}
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wide transition shadow-lg shadow-purple-500/20 cursor-pointer"
                    >
                      Confirm & Deploy Quad-Crew to Fixture
                    </button>
                  </div>
                </form>

                {/* 3. Published Quad-Crew Assignments for All Fixtures */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Published Fixture Quad-Crew Assignments
                  </span>
                  <div className="space-y-2.5">
                    {fixtures.map((f, fIdx) => {
                      const h = teams.find((t) => t.id === f.homeId)?.name || `#${f.homeId}`;
                      const a = teams.find((t) => t.id === f.awayId)?.name || `#${f.awayId}`;
                      return (
                        <div
                          key={f.id ?? `crew-f-${fIdx}`}
                          className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#261f4d] pb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                                MW {f.matchweek}
                              </span>
                              <span className="text-xs font-black text-white">
                                {h} vs {a}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                ({f.date || "Nov 2026"} @ {f.venue || "Academy Stadium"})
                              </span>
                            </div>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                              {f.status || "SCHEDULED"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                              <span className="text-[10px] text-purple-300 uppercase font-bold block">
                                Officiating Crew:
                              </span>
                              <span className="text-gray-200 text-xs font-mono">
                                {f.referee ||
                                  "Center: Bidan Mwaura • Linesmen: Francis Ndirangu & Peter Otieno"}
                              </span>
                            </div>
                            <div className="p-2 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                              <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                                Pitch Chaplain:
                              </span>
                              <span className="text-gray-200 text-xs font-mono">
                                {f.chaplain || "Pastor David M."}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Registered Match Officials Roster Directory */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Certified Match Officials Directory & Contact Roster
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {referees.map((r, rIdx) => (
                      <div
                        key={r.id ?? `ref-dir-${rIdx}`}
                        className="p-3.5 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h6 className="text-xs font-black text-white">{r.name}</h6>
                            <span className="text-[10px] text-purple-300 font-bold block">
                              {r.badge}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
                            ★ {r.rating}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono space-y-0.5">
                          <div>Phone: {r.phone || "+254 700 000 000"}</div>
                          <div>Email: {r.email || "official@mpesa.org"}</div>
                          <div className="text-cyan-400 font-bold">
                            Matches Officiated: {r.assignedMatches || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

      {/* =========================================================================
          COUNCIL SEPARATION OF POWERS & ISOLATED WORKSPACE MODAL
          ========================================================================= */}
      {restrictedRoleTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] border-2 border-amber-400/50 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#2e2554] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Council Separation of Powers
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">
                      Operational Access Restricted
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white uppercase mt-0.5">
                    {ROLE_HIERARCHY_DATA[restrictedRoleTarget]?.title || "Board Workspace"}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRestrictedRoleTarget(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-2 text-amber-300">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Department Operational Autonomy Enforced</span>
              </p>
              <p className="text-gray-300 text-xs">
                Under the M-Pesa Sunday League Governance Charter, individual council members hold
                sovereign jurisdiction over their assigned department. You are currently
                authenticated with the role of{" "}
                <span className="text-white font-bold font-mono">
                  {ROLE_HIERARCHY_DATA[currentRole]?.title || currentRole}
                </span>
                .
              </p>
              <p className="text-gray-300 text-xs">
                To prevent conflicts of interest and unauthorized policy modifications, board
                members cannot access or execute tools within another official's workspace. Only the
                designated lead{" "}
                <span className="text-amber-300 font-bold">
                  ({ROLE_HIERARCHY_DATA[restrictedRoleTarget]?.officialName})
                </span>{" "}
                or the Supreme Admin may operate this desk.
              </p>
            </div>

            {/* Department Overview for Council Transparency */}
            {BOARD_ROLES_CATALOG[
              restrictedRoleTarget as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">
            ] && (
              <div className="bg-[#14102c] border border-white/10 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-black uppercase text-gray-400 font-mono block">
                  Designated Official & Department Mandate
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-bold">Official Lead:</span>
                  <span className="text-[#00f0ff] font-mono font-bold">
                    {
                      BOARD_ROLES_CATALOG[
                        restrictedRoleTarget as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">
                      ].officialLead
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-bold">Department:</span>
                  <span className="text-yellow-400 font-mono">
                    {
                      BOARD_ROLES_CATALOG[
                        restrictedRoleTarget as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">
                      ].department
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-bold">Governed Modules:</span>
                  <span className="text-cyan-300 font-mono">
                    {
                      BOARD_ROLES_CATALOG[
                        restrictedRoleTarget as Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">
                      ].features.length
                    }{" "}
                    Specialized Desks
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2e2554]">
              <button
                type="button"
                onClick={() => setRestrictedRoleTarget(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
              >
                Understood • Return to My Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
