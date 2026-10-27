// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import {
  Trophy,
  Calendar,
  Award,
  Crown,
  PanelLeftClose,
  PanelLeft,
  Shield,
  Briefcase,
  Activity,
  CalendarDays,
  KeyRound,
  LogOut,
  Vote,
  Users,
  Music,
  X,
  ExternalLink,
  Globe,
  FileCheck2,
  MessageSquare,
  CheckCircle2,
  BookOpen,
  DollarSign,
  Send,
  Camera,
  FileText,
  Database,
  Flag,
  Layers,
} from "lucide-react";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { AnthemPlayerWidget } from "./AnthemPlayerWidget";
import { UnifiedAccessModal } from "./UnifiedAccessModal";
import {
  getCurrentRbacUser,
  logoutRbacUser,
  type RbacRole,
  type RbacUser,
} from "../lib/rbacSystem";

interface PermanentSidebarLayoutProps {
  children: React.ReactNode;
}

interface LeagueOfficial {
  name: string;
  role: string;
  responsibilities: string[];
}

export function PermanentSidebarLayout({ children }: PermanentSidebarLayoutProps) {
  const router = useRouter();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { currentRole, isSuperAdmin, switchRole } = useRoleAccess();
  const isLoggedIn = currentRole !== "GUEST";

  // Desktop defaults to open as permanent sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showOfficialsModal, setShowOfficialsModal] = useState<boolean>(false);
  const [showAccessModal, setShowAccessModal] = useState<boolean>(false);
  const [officialsList, setOfficialsList] = useState<LeagueOfficial[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSidebarOpen(window.innerWidth >= 1024);
      // Load public appointments from window.leagueOfficials if present
      if ((window as unknown as { leagueOfficials?: LeagueOfficial[] }).leagueOfficials) {
        setOfficialsList(
          (window as unknown as { leagueOfficials: LeagueOfficial[] }).leagueOfficials,
        );
      } else {
        // Fallback public list from directory
        setOfficialsList([
          {
            name: "Alex Haro",
            role: "1. President",
            responsibilities: [
              "Provides overall leadership and executive direction for the league.",
              "Oversees the work of the administrative crew and ensures rules are followed.",
              "Leads meetings and helps resolve major disputes.",
            ],
          },
          {
            name: "Babra Nandako",
            role: "2. Deputy President",
            responsibilities: [
              "Assists the President in managing league activities.",
              "Acts on behalf of the President when necessary.",
              "Monitors the progress of different departments.",
            ],
          },
          {
            name: "Whitney Juma",
            role: "3. Register and Regulations Manager",
            responsibilities: [
              "Maintains accurate records of registered clubs, players, coaches, and managers.",
              "Ensures that registration requirements and league regulations are followed.",
              "Handles eligibility checks and reports violations.",
            ],
          },
          {
            name: "Idi Sebantu",
            role: "4. Match Officiating Programmes Manager",
            responsibilities: [
              "Organises match officiating schedules and assigns referees to fixtures.",
              "Ensures matches are officiated fairly and impartially.",
              "Coordinates refereeing standards and addresses officiating concerns.",
            ],
          },
          {
            name: "Tonnie Mark Odundo",
            role: "5. Records and File Manager",
            responsibilities: [
              "Maintains official league documents, reports, fixtures, results, standings, and disciplinary records.",
              "Ensures important league information is properly organised and accessible.",
              "Keeps an accurate record of administrative decisions.",
            ],
          },
          {
            name: "Victor Kiplagat",
            role: "6. Technological Manager",
            responsibilities: [
              "Oversees the league’s digital platforms, website, and online updates.",
              "Publishes fixtures, results, standings, announcements, and match reports.",
              "Ensures that league information is presented accurately and promptly.",
            ],
          },
          {
            name: "Sturridge Ochongoi",
            role: "7. Assistant Technological Manager",
            responsibilities: [
              "Supports the Technological Manager in updating and maintaining digital platforms.",
              "Assists in publishing match reports, results, and announcements.",
              "Helps ensure continuity of digital operations.",
            ],
          },
          {
            name: "Bidan Mwaura",
            role: "Official Match Referee",
            responsibilities: [
              "Presides over official league fixtures and ensures fair play.",
              "Files post-match referee match reports and card sanctions.",
              "Enforces constitutional on-pitch rules and regulations.",
            ],
          },
        ]);
      }
    }
  }, []);

  // Public viewer features: strictly limited to League Table, Teams, Fixtures, Radar, Calendar, Voting, and Comments
  const publicNavItems = useMemo(
    () => [
      {
        to: "/standings",
        label: "League Table",
        icon: Trophy,
        badge: "Standings",
        badgeColor: "bg-cyan-400/20 text-[#00f0ff] border-cyan-400/30",
      },
      {
        to: "/clubs",
        label: "Teams & Squads",
        icon: Shield,
        badge: "Rosters",
        badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
      },
      {
        to: "/fixtures",
        label: "Fixtures & Scores",
        icon: Calendar,
        badge: "Schedule",
        badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
      },
      {
        to: "/performance",
        label: "Radar Analytics",
        icon: Activity,
        badge: "Tactics",
        badgeColor: "bg-pink-400/20 text-pink-300 border-pink-400/30",
      },
      {
        to: "/calendar",
        label: "Season Calendar",
        icon: CalendarDays,
        badge: "Events",
        badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
      },
      {
        to: "/mvp-voting",
        label: "MVP Balloting",
        icon: Vote,
        badge: "Voting",
        badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
      },
      {
        to: "/community",
        label: "Fan Cheers & Comments",
        icon: MessageSquare,
        badge: "Community",
        badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
      },
    ],
    [],
  );

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [rbacUser, setRbacUser] = useState<RbacUser | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setRbacUser(getCurrentRbacUser());
    const handleRbacUpdate = () => {
      setRbacUser(getCurrentRbacUser());
    };
    window.addEventListener("mpesa_rbac_changed", handleRbacUpdate);
    window.addEventListener("mpesa_role_changed", handleRbacUpdate);
    window.addEventListener("storage", handleRbacUpdate);
    return () => {
      window.removeEventListener("mpesa_rbac_changed", handleRbacUpdate);
      window.removeEventListener("mpesa_role_changed", handleRbacUpdate);
      window.removeEventListener("storage", handleRbacUpdate);
    };
  }, []);

  // Determine active RBAC role from state & whitelist
  // Active section state for MasterAdminDashboard synchronization
  const [activeAdminSection, setActiveAdminSection] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mpesa_admin_active_section") || "board_members";
    }
    return "board_members";
  });

  useEffect(() => {
    const handleSection = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail) setActiveAdminSection(custom.detail);
    };
    window.addEventListener("mpesa_select_admin_section", handleSection);
    return () => {
      window.removeEventListener("mpesa_select_admin_section", handleSection);
    };
  }, []);

  // Determine active RBAC role from state & whitelist
  // Default to 'public' during SSR and initial hydration to prevent server/client HTML divergence
  const activeRbacRole: RbacRole = useMemo(() => {
    if (!isMounted) return "public";
    if (isSuperAdmin || rbacUser?.role === "admin") return "admin";
    if ((currentRole !== "GUEST" && currentRole) || rbacUser?.role === "board") return "board";
    return "public";
  }, [isMounted, isSuperAdmin, currentRole, rbacUser]);

  // Handle sidebar navigation clicks with section/tab dispatch
  const handleNavClick = (item: {
    to: string;
    adminSection?: string;
    boardRole?: LeagueRole;
    boardSubTab?: string;
  }) => {
    if (item.adminSection && typeof window !== "undefined") {
      localStorage.setItem("mpesa_admin_active_section", item.adminSection);
      setActiveAdminSection(item.adminSection);
      window.dispatchEvent(
        new CustomEvent("mpesa_select_admin_section", { detail: item.adminSection }),
      );
    }
    if (item.boardSubTab && typeof window !== "undefined") {
      localStorage.setItem("mpesa_board_sub_tab", item.boardSubTab);
      window.dispatchEvent(
        new CustomEvent("mpesa_select_board_sub_tab", {
          detail: { role: item.boardRole || currentRole, tab: item.boardSubTab },
        }),
      );
    }
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // 1. SUPREME ADMIN HUB: Exact 14-item navigation menu requested by Super Admin
  const supremeAdminNavItems = useMemo(
    () => [
      {
        to: "/workspaces",
        adminSection: "board_members",
        label: "Council Board Members",
        subLabel: "Add, Edit, Suspend & RBAC",
        icon: Crown,
        badge: "Officials",
        badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "seasons_leagues",
        label: "Seasons & Curriculum",
        subLabel: "Divisions & Bible Verses",
        icon: BookOpen,
        badge: "Curriculum",
        badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "teams_clubs",
        label: "Clubs & Squad Rosters",
        subLabel: "15-Player Cap & Transfers",
        icon: Shield,
        badge: "15-Cap",
        badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "fixtures_scores",
        label: "Fixtures & Live Scoring",
        subLabel: "Referees & Conduct Points",
        icon: Calendar,
        badge: "Scores",
        badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "standings_ledger",
        label: "Standings & Points Ledger",
        subLabel: "Tiebreakers & Overrides",
        icon: Trophy,
        badge: "Ledger",
        badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "player_stats",
        label: "Golden Boot & Player Stats",
        subLabel: "Goals, Assists & MVP Count",
        icon: Award,
        badge: "Stats",
        badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "finances_fees",
        label: "Finances & Fee Tracking",
        subLabel: "MPESA Invoices & Expenses",
        icon: DollarSign,
        badge: "M-PESA",
        badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "broadcasts_alerts",
        label: "Mass Alerts & Broadcasts",
        subLabel: "Instant SMS & Email Blasts",
        icon: Send,
        badge: "SMS/Email",
        badgeColor: "bg-pink-400/20 text-pink-300 border-pink-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "anthem_studio",
        label: "Stadium Soundtrack Studio",
        subLabel: "YouTube Songs & Auto-Play",
        icon: Music,
        badge: "YouTube",
        badgeColor: "bg-red-400/20 text-red-300 border-red-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "fan_comments",
        label: "Fan Cheers & Community",
        subLabel: "Moderation, Pinning & Prayers",
        icon: MessageSquare,
        badge: "Admin Only",
        badgeColor: "bg-teal-400/20 text-teal-300 border-teal-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "voting_center",
        label: "MVP Balloting Dispatcher",
        subLabel: "Voting Links & Ballot Tallies",
        icon: Vote,
        badge: "Audits",
        badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "media_photos",
        label: "Athlete Photos & Media",
        subLabel: "Direct Upload & Share Links",
        icon: Camera,
        badge: "Uploads",
        badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "decrees_minutes",
        label: "Decrees & Council Minutes",
        subLabel: "Directives & Formal Minutes",
        icon: FileText,
        badge: "Decrees",
        badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
      },
      {
        to: "/workspaces",
        adminSection: "system_backup",
        label: "Database Backup & Audit",
        subLabel: "JSON/CSV Export & Disaster Recovery",
        icon: Database,
        badge: "Backup",
        badgeColor: "bg-violet-400/20 text-violet-300 border-violet-400/30",
      },
    ],
    [],
  );

  // 2. COUNCIL BOARD WORKSPACES: Tailored unique dashboard functions per role
  const boardRoleNavItems = useMemo(() => {
    const roleKey = rbacUser?.leagueRole || currentRole || "PRESIDENT";

    if (roleKey === "PRESIDENT") {
      return [
        {
          to: "/workspaces",
          boardRole: "PRESIDENT" as LeagueRole,
          boardSubTab: "overview",
          label: "Executive Overview",
          subLabel: "Leadership Decrees & Status",
          icon: Crown,
          badge: "President",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "PRESIDENT" as LeagueRole,
          boardSubTab: "hearings",
          label: "Dispute & Hearing Center",
          subLabel: "Protests, Appeals & Formal Rulings",
          icon: Award,
          badge: "Hearings",
          badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "PRESIDENT" as LeagueRole,
          boardSubTab: "policy",
          label: "Policy & Constitution",
          subLabel: "Rulebook Amendments & Conduct",
          icon: BookOpen,
          badge: "By-Laws",
          badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "PRESIDENT" as LeagueRole,
          boardSubTab: "voting",
          label: "Board Voting & Motions",
          subLabel: "Table Motions, Tallies & Resolutions",
          icon: Vote,
          badge: "Motions",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "PRESIDENT" as LeagueRole,
          boardSubTab: "approvals",
          label: "Executive Approvals",
          subLabel: "New Club Affiliations & Budgets",
          icon: CheckCircle2,
          badge: "Sign-offs",
          badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "PRESIDENT" as LeagueRole,
          boardSubTab: "meeting",
          label: "Board Meeting Planner",
          subLabel: "Council Agendas & Meeting Schedule",
          icon: CalendarDays,
          badge: "Planner",
          badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
        },
      ];
    }

    if (roleKey === "DEPUTY_PRESIDENT") {
      return [
        {
          to: "/workspaces",
          boardRole: "DEPUTY_PRESIDENT" as LeagueRole,
          boardSubTab: "overview",
          label: "Executive Operations Hub",
          subLabel: "Supervision & Stand-in Powers",
          icon: Shield,
          badge: "Operations",
          badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "DEPUTY_PRESIDENT" as LeagueRole,
          boardSubTab: "monitoring",
          label: "Department Progress Monitor",
          subLabel: "4 Core Departments Tracking",
          icon: Activity,
          badge: "Progress",
          badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "DEPUTY_PRESIDENT" as LeagueRole,
          boardSubTab: "acting_override",
          label: "Acting Presidential Override",
          subLabel: "Emergency Stand-in Hearing Desk",
          icon: Crown,
          badge: "Override",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "DEPUTY_PRESIDENT" as LeagueRole,
          boardSubTab: "task_force",
          label: "Special Task Force Manager",
          subLabel: "Active Inspections & Projects",
          icon: Briefcase,
          badge: "Task Force",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "DEPUTY_PRESIDENT" as LeagueRole,
          boardSubTab: "escalations",
          label: "Inter-Department Escalations",
          subLabel: "Fast-Track Council Resolutions",
          icon: FileText,
          badge: "Escalate",
          badgeColor: "bg-rose-400/20 text-rose-300 border-rose-400/30",
        },
      ];
    }

    if (roleKey === "REGULATIONS_MANAGER") {
      return [
        {
          to: "/workspaces",
          boardRole: "REGULATIONS_MANAGER" as LeagueRole,
          boardSubTab: "dashboard",
          label: "Registration Dashboard",
          subLabel: "Compliance & Squad Cap Monitor",
          icon: FileText,
          badge: "Registrar",
          badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "REGULATIONS_MANAGER" as LeagueRole,
          boardSubTab: "licensing",
          label: "Club & Staff Licensing",
          subLabel: "Affiliations & Manager Approvals",
          icon: Shield,
          badge: "Licensing",
          badgeColor: "bg-teal-400/20 text-teal-300 border-teal-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "REGULATIONS_MANAGER" as LeagueRole,
          boardSubTab: "player_verification",
          label: "Player Verification Desk",
          subLabel: "Digital Passes & School ID Audits",
          icon: Users,
          badge: "Passes",
          badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "REGULATIONS_MANAGER" as LeagueRole,
          boardSubTab: "eligibility_violations",
          label: "Eligibility & Violations",
          subLabel: "15-Player Cap & Suspensions",
          icon: Award,
          badge: "Audits",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "REGULATIONS_MANAGER" as LeagueRole,
          boardSubTab: "compliance_waivers",
          label: "Compliance & Waivers",
          subLabel: "Parental Consent & Medical Records",
          icon: FileCheck2,
          badge: "Waivers",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
      ];
    }

    if (roleKey === "MATCH_OFFICIATING_MANAGER") {
      return [
        {
          to: "/workspaces",
          boardRole: "MATCH_OFFICIATING_MANAGER" as LeagueRole,
          boardSubTab: "overview",
          label: "Officiating Center Overview",
          subLabel: "Matchday Referee Readiness",
          icon: Flag,
          badge: "Officiating",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "MATCH_OFFICIATING_MANAGER" as LeagueRole,
          boardSubTab: "scheduler",
          label: "Referee Match Scheduler",
          subLabel: "Ref Bidan Mwaura & Pitch Chaplains",
          icon: Calendar,
          badge: "Appointments",
          badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "MATCH_OFFICIATING_MANAGER" as LeagueRole,
          boardSubTab: "ref_reports",
          label: "Post-Match Referee Reports",
          subLabel: "Scorecard Ratings & Evaluations",
          icon: FileText,
          badge: "Scorecards",
          badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "MATCH_OFFICIATING_MANAGER" as LeagueRole,
          boardSubTab: "performance",
          label: "Disciplinary Card Hearings",
          subLabel: "Yellow/Red Sanction Reviews",
          icon: Award,
          badge: "Hearings",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "MATCH_OFFICIATING_MANAGER" as LeagueRole,
          boardSubTab: "disputes",
          label: "Officiating Disputes Desk",
          subLabel: "Club Protests & Fair-Play Arbitrations",
          icon: Shield,
          badge: "Disputes",
          badgeColor: "bg-rose-400/20 text-rose-300 border-rose-400/30",
        },
      ];
    }

    if (roleKey === "RECORDS_MANAGER") {
      return [
        {
          to: "/workspaces",
          boardRole: "RECORDS_MANAGER" as LeagueRole,
          boardSubTab: "vault_home",
          label: "Records & Archives Overview",
          subLabel: "Historical Files & Registry Vault",
          icon: BookOpen,
          badge: "Vault",
          badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "RECORDS_MANAGER" as LeagueRole,
          boardSubTab: "doc_vault",
          label: "Official Document Vault",
          subLabel: "Constitution, By-Laws & PDF Archive",
          icon: FileText,
          badge: "Documents",
          badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "RECORDS_MANAGER" as LeagueRole,
          boardSubTab: "results_archive",
          label: "Results & Standings Archive",
          subLabel: "Certify Fixture Scorecards & Points",
          icon: Trophy,
          badge: "Standings",
          badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "RECORDS_MANAGER" as LeagueRole,
          boardSubTab: "disciplinary_ledger",
          label: "Disciplinary Ledger",
          subLabel: "Historical Card & Incident Registry",
          icon: Award,
          badge: "Ledger",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "RECORDS_MANAGER" as LeagueRole,
          boardSubTab: "decisions_registry",
          label: "Council Decisions Registry",
          subLabel: "Timestamped Minutes & Decree Vault",
          icon: Database,
          badge: "Minutes",
          badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
        },
      ];
    }

    if (roleKey === "TECH_MANAGER") {
      return [
        {
          to: "/workspaces",
          boardRole: "TECH_MANAGER" as LeagueRole,
          boardSubTab: "tech_overview",
          label: "Tech Operations Overview",
          subLabel: "Digital Platforms & Live Engine",
          icon: Activity,
          badge: "Tech Lead",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "TECH_MANAGER" as LeagueRole,
          boardSubTab: "website_cms",
          label: "Website CMS & Banners",
          subLabel: "Headline & Multimedia Graphics",
          icon: Globe,
          badge: "CMS",
          badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "TECH_MANAGER" as LeagueRole,
          boardSubTab: "live_publishing",
          label: "Live Publishing & Scoreboard",
          subLabel: "Pitchside LED Scoreboard Ticker",
          icon: Send,
          badge: "Broadcast",
          badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "TECH_MANAGER" as LeagueRole,
          boardSubTab: "infrastructure",
          label: "Digital Infrastructure",
          subLabel: "Server Uptime & Diagnostics",
          icon: Database,
          badge: "Uptime",
          badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
        },
        {
          to: "/workspaces",
          boardRole: "TECH_MANAGER" as LeagueRole,
          boardSubTab: "integrity_audit",
          label: "System Integrity Audits",
          subLabel: "Security Protocols & Data Health",
          icon: Shield,
          badge: "Security",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
        },
      ];
    }

    // Default to ASST_TECH_MANAGER
    return [
      {
        to: "/workspaces",
        boardRole: "ASST_TECH_MANAGER" as LeagueRole,
        boardSubTab: "support_desk",
        label: "Assistant Tech Support Desk",
        subLabel: "Operations & Queue Overview",
        icon: Layers,
        badge: "Support",
        badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30",
      },
      {
        to: "/workspaces",
        boardRole: "ASST_TECH_MANAGER" as LeagueRole,
        boardSubTab: "content_queue",
        label: "Content Queue & Previews",
        subLabel: "Match Recaps & Devotionals Drafts",
        icon: FileText,
        badge: "Drafts",
        badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
      },
      {
        to: "/workspaces",
        boardRole: "ASST_TECH_MANAGER" as LeagueRole,
        boardSubTab: "media_library",
        label: "Media Library & Gallery",
        subLabel: "Matchday Highlights & Photo Vault",
        icon: Camera,
        badge: "Media",
        badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
      },
      {
        to: "/workspaces",
        boardRole: "ASST_TECH_MANAGER" as LeagueRole,
        boardSubTab: "user_support",
        label: "User Helpdesk & Tickets",
        subLabel: "Staff & Referee Tech Support",
        icon: MessageSquare,
        badge: "Helpdesk",
        badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
      },
      {
        to: "/workspaces",
        boardRole: "ASST_TECH_MANAGER" as LeagueRole,
        boardSubTab: "data_backup",
        label: "Data Backup Assistant",
        subLabel: "Manual JSON & Archive Integrity",
        icon: Database,
        badge: "Backup",
        badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30",
      },
    ];
  }, [rbacUser, currentRole]);

  // Sidebar navigation items selection based strictly on active role
  const allNavItems = useMemo(() => {
    if (activeRbacRole === "admin") {
      return supremeAdminNavItems;
    }
    if (activeRbacRole === "board") {
      return boardRoleNavItems;
    }
    // Public spectator role: strictly view-only features and send comments
    return publicNavItems;
  }, [activeRbacRole, supremeAdminNavItems, boardRoleNavItems, publicNavItems]);

  return (
    <div className="min-h-screen bg-[#070512] text-white flex flex-col">
      {/* Mobile Backdrop Overlay (only on mobile) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Permanent Fixed Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#080517] border-r border-[#261f4d] shadow-2xl flex flex-col justify-between p-4 sm:p-5 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-4">
          {/* Brand & Collapse Header */}
          <div className="flex items-center justify-between border-b border-[#261f4d] pb-3">
            <Link to="/standings" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-400 p-1 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition">
                <img
                  src="/mpesa-academy-icon.png"
                  alt="M-Pesa Academy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-header text-base font-black text-white leading-none uppercase">
                  Sunday League
                </h3>
                <p className="text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider">
                  Official eFootball
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              title="Hide Sidebar"
              className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <PanelLeftClose className="w-5 h-5 text-[#00f0ff]" />
            </button>
          </div>

          {/* Navigation Links Group Header */}
          <div className="space-y-1.5 text-xs">
            <div className="px-2 pb-1 flex items-center justify-between border-b border-[#1b153b]">
              <span className="text-[10px] uppercase font-black tracking-wider flex items-center gap-1.5 text-amber-300">
                {activeRbacRole === "admin" && (
                  <>
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Supreme Admin Hub</span>
                  </>
                )}
                {activeRbacRole === "board" && (
                  <>
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Council Workspace</span>
                  </>
                )}
                {activeRbacRole === "public" && (
                  <>
                    <Trophy className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Public Spectator Suite</span>
                  </>
                )}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#141029] text-gray-400 border border-[#2e2554]">
                {activeRbacRole === "admin"
                  ? "14 Modules"
                  : activeRbacRole === "board"
                    ? "Executive"
                    : "View Only"}
              </span>
            </div>

            {/* Menu Items with Title, Subtitle, Icon & Badges */}
            <div className="space-y-1 max-h-[50vh] lg:max-h-[54vh] overflow-y-auto pr-1">
              {allNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.adminSection
                  ? currentPath === "/workspaces" && activeAdminSection === item.adminSection
                  : currentPath === item.to;

                return (
                  <Link
                    key={`${item.to}-${item.adminSection || item.boardSubTab || index}`}
                    to={item.to}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition duration-150 group cursor-pointer ${
                      isActive
                        ? activeRbacRole === "admin"
                          ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-lg shadow-amber-500/20"
                          : "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:text-white hover:bg-white/5 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? "text-black"
                            : activeRbacRole === "admin"
                              ? "text-amber-400"
                              : "text-[#00f0ff]"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs truncate font-bold leading-tight">{item.label}</div>
                        {item.subLabel && (
                          <div
                            className={`text-[9.5px] truncate leading-tight mt-0.5 ${
                              isActive ? "text-black/80 font-bold" : "text-gray-400 font-normal"
                            }`}
                          >
                            {item.subLabel}
                          </div>
                        )}
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-bold border shrink-0 ml-1.5 ${
                          isActive
                            ? "bg-black/20 text-black border-black/30"
                            : item.badgeColor || "bg-white/10 text-gray-300 border-white/20"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Public Spectator Switcher for Admin & Board */}
            {activeRbacRole !== "public" && (
              <div className="pt-2 border-t border-[#1b153b] space-y-1">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider px-2 block">
                  Public Perspective
                </span>
                <Link
                  to="/standings"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Public Standings & Table</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">View Only</span>
                </Link>
                <Link
                  to="/fixtures"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Public Fixtures Schedule</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">View Only</span>
                </Link>
              </div>
            )}

            {/* Public League Officials Directory Button */}
            <button
              type="button"
              onClick={() => setShowOfficialsModal(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition cursor-pointer text-xs mt-1"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <span>League Officials Directory</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold border bg-purple-500/20 text-purple-300 border-purple-500/30">
                Council
              </span>
            </button>
          </div>

          {/* DOCKED STADIUM ANTHEM & SONG PLAYER WIDGET */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider px-3 block mb-1.5 flex items-center gap-1.5">
              <Music className="w-3 h-3 text-cyan-400" />
              <span>Stadium Soundtrack</span>
            </span>
            <AnthemPlayerWidget isCompact />
          </div>
        </div>

        {/* Sidebar Footer with RBAC Active Identity & Login/Logout */}
        <div className="pt-4 border-t border-[#261f4d] space-y-2">
          {!isLoggedIn && !rbacUser ? (
            <button
              type="button"
              onClick={() => setShowAccessModal(true)}
              className="w-full bg-[#141029] hover:bg-[#1f1744] border border-amber-400/30 text-amber-300 hover:text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Council & Academy Login</span>
            </button>
          ) : (
            <div className="space-y-2">
              {/* Active RBAC User Pill */}
              <div className="p-2.5 rounded-2xl bg-[#141029] border border-[#2e2554] space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      activeRbacRole === "admin"
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/30"
                        : activeRbacRole === "board"
                          ? "bg-indigo-400/20 text-indigo-300 border-indigo-400/30"
                          : "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
                    }`}
                  >
                    {activeRbacRole === "admin"
                      ? "👑 Super Admin"
                      : activeRbacRole === "board"
                        ? "👔 Council Member"
                        : "🎓 Verified Student"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">RBAC</span>
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {rbacUser?.displayName ||
                    (isSuperAdmin ? "Master Administrator" : "League Official")}
                </div>
                {rbacUser?.email && (
                  <div className="text-[10px] text-gray-400 font-mono truncate">
                    {rbacUser.email}
                  </div>
                )}
              </div>

              {/* Workspace Link for Admin & Board */}
              {activeRbacRole !== "public" && (
                <Link
                  to="/workspaces"
                  className="w-full bg-[#141029] hover:bg-[#1f1744] border border-amber-400/30 text-amber-300 hover:text-white py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  {activeRbacRole === "admin" ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>{activeRbacRole === "admin" ? "Master Command" : "Council Workspace"}</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => {
                  logoutRbacUser();
                  switchRole("GUEST");
                }}
                className="w-full bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out ({activeRbacRole})</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Left-Side Floating Toggle Tab when Sidebar is Hidden */}
      {!isSidebarOpen && (
        <div className="fixed left-0 top-32 z-40">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black py-2.5 px-3 rounded-r-2xl shadow-2xl shadow-cyan-500/30 flex items-center gap-2 hover:translate-x-1 transition duration-200 border-y border-r border-cyan-300 cursor-pointer"
            title="Show League Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider hidden sm:inline">Menu</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:pl-72" : "pl-0"
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#080517]/90 backdrop-blur-md border-b border-[#261f4d] px-4 py-3 sm:px-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Expand Navigation"
                className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <PanelLeft className="w-5 h-5 text-[#00f0ff]" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider hidden sm:inline">
                M-Pesa Sunday League
              </span>
              <span className="text-xs text-gray-400 font-mono hidden md:inline">
                • Season 2026/27
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 font-mono hidden sm:inline">
                  {isSuperAdmin ? "👑 Master Admin" : "👔 Council Active"}
                </span>
                <Link
                  to="/workspaces"
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-md shadow-amber-400/20"
                >
                  Workspace
                </Link>
              </div>
            ) : (
              <Link
                to="/workspaces"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141029] hover:bg-[#1f1744] border border-amber-400/30 text-amber-300 text-xs font-bold transition shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Council Login</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Render Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-61px)]">{children}</main>
      </div>

      {/* Public League Officials Directory Modal */}
      {showOfficialsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] border-2 border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2.5">
                <Users className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase">
                    Public League Officials Appointments
                  </h3>
                  <p className="text-xs text-gray-400">
                    Directory of appointed council leaders and official roles.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOfficialsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {officialsList.map((official, idx) => (
                <div
                  key={idx}
                  className="bg-[#141029] border border-[#2e2554] rounded-2xl p-4 space-y-2 hover:border-purple-400/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-purple-300 font-mono font-bold uppercase block">
                        {official.role}
                      </span>
                      <h4 className="text-sm font-black text-white">{official.name}</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      Official
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-gray-300 pt-1 border-t border-[#261f4d]">
                    {official.responsibilities.map((resp, rIdx) => (
                      <p key={rIdx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-purple-400 shrink-0">•</span>
                        <span>{resp}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#2e2554] flex items-center justify-between text-xs text-gray-400">
              <span className="font-mono text-[10px]">
                Public League Directory • Sourced from public/league-officials.js
              </span>
              <button
                type="button"
                onClick={() => setShowOfficialsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Official & Admin Access Modal */}
      <UnifiedAccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        onSuccess={() => {
          router.navigate({ to: "/workspaces" });
        }}
      />
    </div>
  );
}
