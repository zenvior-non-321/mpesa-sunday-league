import { useState, useEffect, useCallback, useMemo } from "react";

export type LeagueRole =
  | "SUPER_ADMIN"
  | "PRESIDENT"
  | "DEPUTY_PRESIDENT"
  | "REGULATIONS_MANAGER"
  | "MATCH_OFFICIATING_MANAGER"
  | "RECORDS_MANAGER"
  | "TECH_MANAGER"
  | "ASST_TECH_MANAGER"
  | "GUEST";

export type PermissionKey =
  // Executive Governance (Tiers 0, 1, 2)
  | "GOVERNANCE_OVERVIEW"
  | "ISSUE_PRESIDENTIAL_DECREES"
  | "RESOLVE_DISPUTES"
  | "HEAR_DISCIPLINARY_APPEALS"
  | "OVERSEE_ADMIN_CREW"
  | "ISSUE_OPERATIONAL_DIRECTIVES"
  | "MONITOR_DEPARTMENTS"
  | "COORDINATE_LOGISTICS"
  // Register & Regulations (Tier 3)
  | "REGISTER_CLUBS"
  | "EDIT_CLUBS"
  | "DELETE_CLUBS"
  | "MANAGE_SQUADS"
  | "VERIFY_PLAYER_ELIGIBILITY"
  | "FILE_REGULATION_VIOLATIONS"
  // Match Officiating (Tier 4)
  | "ASSIGN_MATCH_REFEREES"
  | "EVALUATE_REFEREE_PERFORMANCE"
  | "CONDUCT_CARD_HEARINGS"
  | "COORDINATE_OFFICIATING_STANDARDS"
  // Records & Files (Tier 5)
  | "CERTIFY_MATCH_SCORECARDS"
  | "RECORD_COUNCIL_MINUTES"
  | "EDIT_PLAYER_STATS"
  | "DELETE_PLAYER_STATS"
  | "ARCHIVE_LEAGUE_DOCUMENTS"
  | "EXPORT_LEAGUE_REPORTS"
  // Technological Management (Tier 6)
  | "MANAGE_SCOREBOARD_TICKER"
  | "MANAGE_WEBSITE_ANTHEM"
  | "PUBLISH_LEAGUE_NEWS"
  | "UPLOAD_MATCHDAY_MEDIA"
  | "OVERSEE_DIGITAL_PLATFORMS"
  // Assistant Technological (Tier 7)
  | "ASSIST_NEWS_PUBLISHING"
  | "ASSIST_MEDIA_UPLOADS"
  | "ASSIST_SCOREBOARD_UPDATES"
  // Master Super Admin (Tier 0)
  | "SUPER_ADMIN_MASTER_OVERRIDE"
  | "RESET_LEAGUE_DATABASE"
  | "MANAGE_OFFICIAL_PASSWORDS";

export interface AuthorizedAction {
  id: PermissionKey;
  category:
    | "Governance"
    | "Registration"
    | "Match Officiating"
    | "Records & Stats"
    | "Digital & Media"
    | "Master Administrative";
  action: string;
  description: string;
}

export interface RoleMetadata {
  key: LeagueRole;
  tier: number;
  title: string;
  officialName: string;
  department: string;
  badgeColor: string;
  responsibilities: string[];
  permissions: PermissionKey[];
}

export const ROLE_HIERARCHY_DATA: Record<LeagueRole, RoleMetadata> = {
  SUPER_ADMIN: {
    key: "SUPER_ADMIN",
    tier: 0,
    title: "Super Administrator",
    officialName: "Master League Controller",
    department: "Supreme League Council",
    badgeColor: "from-amber-400 via-rose-500 to-efootball-magenta",
    responsibilities: [
      "Master administrative override over all 7 executive tiers.",
      "Manage security credentials, official access codes, and system settings.",
      "Approve, reject, or modify all submitted decisions, scores, and media.",
      "Control portal anthem broadcasting and stadium sound studio.",
    ],
    permissions: [
      "SUPER_ADMIN_MASTER_OVERRIDE",
      "RESET_LEAGUE_DATABASE",
      "MANAGE_OFFICIAL_PASSWORDS",
      "GOVERNANCE_OVERVIEW",
      "ISSUE_PRESIDENTIAL_DECREES",
      "RESOLVE_DISPUTES",
      "HEAR_DISCIPLINARY_APPEALS",
      "OVERSEE_ADMIN_CREW",
      "ISSUE_OPERATIONAL_DIRECTIVES",
      "MONITOR_DEPARTMENTS",
      "COORDINATE_LOGISTICS",
      "REGISTER_CLUBS",
      "EDIT_CLUBS",
      "DELETE_CLUBS",
      "MANAGE_SQUADS",
      "VERIFY_PLAYER_ELIGIBILITY",
      "FILE_REGULATION_VIOLATIONS",
      "ASSIGN_MATCH_REFEREES",
      "EVALUATE_REFEREE_PERFORMANCE",
      "CONDUCT_CARD_HEARINGS",
      "COORDINATE_OFFICIATING_STANDARDS",
      "CERTIFY_MATCH_SCORECARDS",
      "RECORD_COUNCIL_MINUTES",
      "EDIT_PLAYER_STATS",
      "DELETE_PLAYER_STATS",
      "ARCHIVE_LEAGUE_DOCUMENTS",
      "EXPORT_LEAGUE_REPORTS",
      "MANAGE_SCOREBOARD_TICKER",
      "MANAGE_WEBSITE_ANTHEM",
      "PUBLISH_LEAGUE_NEWS",
      "UPLOAD_MATCHDAY_MEDIA",
      "OVERSEE_DIGITAL_PLATFORMS",
      "ASSIST_NEWS_PUBLISHING",
      "ASSIST_MEDIA_UPLOADS",
      "ASSIST_SCOREBOARD_UPDATES",
    ],
  },
  PRESIDENT: {
    key: "PRESIDENT",
    tier: 1,
    title: "President",
    officialName: "Alex Haro",
    department: "Office of the League President",
    badgeColor: "from-yellow-400 to-amber-500",
    responsibilities: [
      "Provides overall leadership and strategic direction for the league.",
      "Oversees the work of the administrative crew and ensures league rules and policies are strictly enforced.",
      "Leads executive council meetings and delivers final rulings on major disputes and disciplinary appeals.",
      "Signs off on official league decrees, policy changes, and tournament guidelines.",
    ],
    permissions: [
      "GOVERNANCE_OVERVIEW",
      "ISSUE_PRESIDENTIAL_DECREES",
      "RESOLVE_DISPUTES",
      "HEAR_DISCIPLINARY_APPEALS",
      "OVERSEE_ADMIN_CREW",
      "ISSUE_OPERATIONAL_DIRECTIVES",
      "MONITOR_DEPARTMENTS",
      "COORDINATE_LOGISTICS",
      "PUBLISH_LEAGUE_NEWS",
      "RECORD_COUNCIL_MINUTES",
      "ARCHIVE_LEAGUE_DOCUMENTS",
      "EXPORT_LEAGUE_REPORTS",
    ],
  },
  DEPUTY_PRESIDENT: {
    key: "DEPUTY_PRESIDENT",
    tier: 2,
    title: "Deputy President",
    officialName: "Babra Nandako",
    department: "Executive Operations & Logistics",
    badgeColor: "from-blue-400 to-cyan-500",
    responsibilities: [
      "Assists the President in managing league activities and day-to-day operations.",
      "Acts with full presidential authority on behalf of the President when necessary.",
      "Monitors the progress of different departments and helps ensure responsibilities are fulfilled.",
      "Coordinates logistics, emergency scheduling, and administrative liaison between clubs.",
    ],
    permissions: [
      "GOVERNANCE_OVERVIEW",
      "ISSUE_OPERATIONAL_DIRECTIVES",
      "MONITOR_DEPARTMENTS",
      "COORDINATE_LOGISTICS",
      "PUBLISH_LEAGUE_NEWS",
      "RECORD_COUNCIL_MINUTES",
      "EXPORT_LEAGUE_REPORTS",
    ],
  },
  REGULATIONS_MANAGER: {
    key: "REGULATIONS_MANAGER",
    tier: 3,
    title: "Register and Regulations Manager",
    officialName: "Whitney Juma",
    department: "Registration & Regulatory Compliance",
    badgeColor: "from-emerald-400 to-teal-500",
    responsibilities: [
      "Maintains accurate records of registered clubs, players, coaches, and managers.",
      "Ensures that registration requirements, squad caps (15-player limits), and regulations are strictly followed.",
      "Handles student admission eligibility checks and files formal violation reports.",
      "Approves new team registrations, kit selections, and home pitch assignments.",
    ],
    permissions: [
      "REGISTER_CLUBS",
      "EDIT_CLUBS",
      "MANAGE_SQUADS",
      "VERIFY_PLAYER_ELIGIBILITY",
      "FILE_REGULATION_VIOLATIONS",
      "EXPORT_LEAGUE_REPORTS",
    ],
  },
  MATCH_OFFICIATING_MANAGER: {
    key: "MATCH_OFFICIATING_MANAGER",
    tier: 4,
    title: "Match Officiating Programmes Manager",
    officialName: "Idi Sebantu",
    department: "Match Officiating & Refereeing Standards",
    badgeColor: "from-purple-400 to-violet-600",
    responsibilities: [
      "Organises match officiating schedules and assigns center and assistant referees to all fixtures.",
      "Ensures matches are officiated fairly, transparently, and impartially.",
      "Coordinates refereeing standards and conducts disciplinary card hearings (yellow & red card sanctions).",
      "Submits referee evaluation scorecards and fair-play assessments post-match.",
    ],
    permissions: [
      "ASSIGN_MATCH_REFEREES",
      "EVALUATE_REFEREE_PERFORMANCE",
      "CONDUCT_CARD_HEARINGS",
      "COORDINATE_OFFICIATING_STANDARDS",
    ],
  },
  RECORDS_MANAGER: {
    key: "RECORDS_MANAGER",
    tier: 5,
    title: "Records and File Manager",
    officialName: "Tonnie Mark Odundo",
    department: "Official Records, Archives & Player Leaderboards",
    badgeColor: "from-cyan-400 to-blue-600",
    responsibilities: [
      "Maintains official league documents, reports, fixtures, results, standings, and disciplinary records.",
      "Ensures important league information is properly organised, securely stored, and accessible when required.",
      "Keeps an accurate, timestamped record of administrative council minutes and proceedings.",
      "Certifies match scorecards and updates official player statistics (goals, assists, clean sheets).",
    ],
    permissions: [
      "CERTIFY_MATCH_SCORECARDS",
      "RECORD_COUNCIL_MINUTES",
      "EDIT_PLAYER_STATS",
      "DELETE_PLAYER_STATS",
      "ARCHIVE_LEAGUE_DOCUMENTS",
      "EXPORT_LEAGUE_REPORTS",
    ],
  },
  TECH_MANAGER: {
    key: "TECH_MANAGER",
    tier: 6,
    title: "Technological Manager",
    officialName: "Victor Kiplagat",
    department: "Digital Systems, Media Broadcasting & Pitchside LED",
    badgeColor: "from-fuchsia-400 to-pink-600",
    responsibilities: [
      "Oversees the league’s digital platforms, official website, and live online updates.",
      "Controls the pitchside LED scoreboard ticker and stadium anthem soundtrack broadcasts.",
      "Publishes fixtures, results, standings, announcements, and matchday news promptly.",
      "Ensures high system availability, technical diagnostics, and digital media uploads.",
    ],
    permissions: [
      "MANAGE_SCOREBOARD_TICKER",
      "MANAGE_WEBSITE_ANTHEM",
      "PUBLISH_LEAGUE_NEWS",
      "UPLOAD_MATCHDAY_MEDIA",
      "OVERSEE_DIGITAL_PLATFORMS",
      "CERTIFY_MATCH_SCORECARDS",
    ],
  },
  ASST_TECH_MANAGER: {
    key: "ASST_TECH_MANAGER",
    tier: 7,
    title: "Assistant Technological Manager",
    officialName: "Sturridge Ochongoi",
    department: "Digital Support & Media Operations",
    badgeColor: "from-indigo-400 to-cyan-400",
    responsibilities: [
      "Supports the Technological Manager in updating and maintaining digital platforms.",
      "Assists in drafting and publishing match reports, results, and league announcements.",
      "Assists with matchday video highlights, photo uploads, and fan media galleries.",
      "Helps ensure continuity of digital operations when the Technological Manager is unavailable.",
    ],
    permissions: [
      "ASSIST_NEWS_PUBLISHING",
      "ASSIST_MEDIA_UPLOADS",
      "ASSIST_SCOREBOARD_UPDATES",
      "PUBLISH_LEAGUE_NEWS",
      "UPLOAD_MATCHDAY_MEDIA",
    ],
  },
  GUEST: {
    key: "GUEST",
    tier: 8,
    title: "Public Visitor / Fan",
    officialName: "League Supporter",
    department: "General Public",
    badgeColor: "from-gray-500 to-gray-700",
    responsibilities: [
      "View public league standings, fixtures, results, and player statistics.",
      "Enjoy match highlights, photo galleries, and stadium anthem broadcast.",
      "Read official news announcements, rules, and executive appointment directory.",
    ],
    permissions: [],
  },
};

export const ALL_ACTION_DEFINITIONS: Record<PermissionKey, AuthorizedAction> = {
  SUPER_ADMIN_MASTER_OVERRIDE: {
    id: "SUPER_ADMIN_MASTER_OVERRIDE",
    category: "Master Administrative",
    action: "Master Authority Override",
    description: "Grant or revoke permissions, override any decision across all 7 executive tiers.",
  },
  RESET_LEAGUE_DATABASE: {
    id: "RESET_LEAGUE_DATABASE",
    category: "Master Administrative",
    action: "Database Maintenance & Reset",
    description: "Perform factory reset or repair local storage for the entire league system.",
  },
  MANAGE_OFFICIAL_PASSWORDS: {
    id: "MANAGE_OFFICIAL_PASSWORDS",
    category: "Master Administrative",
    action: "Security Desk & Access Codes",
    description: "Issue, update, and manage official security access codes.",
  },
  GOVERNANCE_OVERVIEW: {
    id: "GOVERNANCE_OVERVIEW",
    category: "Governance",
    action: "Executive League Governance",
    description:
      "Provide overarching leadership, set tournament policy, and oversee executive administration.",
  },
  ISSUE_PRESIDENTIAL_DECREES: {
    id: "ISSUE_PRESIDENTIAL_DECREES",
    category: "Governance",
    action: "Issue Presidential Decrees",
    description: "Enact binding executive directives and regulatory clarifications.",
  },
  RESOLVE_DISPUTES: {
    id: "RESOLVE_DISPUTES",
    category: "Governance",
    action: "Executive Dispute Resolution",
    description: "Mediate and deliver final binding rulings on inter-club disputes.",
  },
  HEAR_DISCIPLINARY_APPEALS: {
    id: "HEAR_DISCIPLINARY_APPEALS",
    category: "Governance",
    action: "Disciplinary Appeals Court",
    description: "Review and rule on sanctions appealed by coaches or student players.",
  },
  OVERSEE_ADMIN_CREW: {
    id: "OVERSEE_ADMIN_CREW",
    category: "Governance",
    action: "Administrative Crew Supervision",
    description: "Monitor all 7 departments to ensure compliance with executive directives.",
  },
  ISSUE_OPERATIONAL_DIRECTIVES: {
    id: "ISSUE_OPERATIONAL_DIRECTIVES",
    category: "Governance",
    action: "Issue Operational Directives",
    description: "Dispatch operational instructions to department managers.",
  },
  MONITOR_DEPARTMENTS: {
    id: "MONITOR_DEPARTMENTS",
    category: "Governance",
    action: "Departmental Progress Monitoring",
    description: "Track department deliverables, timelines, and logistics fulfillment.",
  },
  COORDINATE_LOGISTICS: {
    id: "COORDINATE_LOGISTICS",
    category: "Governance",
    action: "Inter-Department Logistics",
    description: "Coordinate pitch allocation, timing, and equipment across matchdays.",
  },
  REGISTER_CLUBS: {
    id: "REGISTER_CLUBS",
    category: "Registration",
    action: "Register New Clubs",
    description: "Create and officially register new clubs into the Sunday League.",
  },
  EDIT_CLUBS: {
    id: "EDIT_CLUBS",
    category: "Registration",
    action: "Modify Club Profiles & Kits",
    description: "Update club badges, tactical kits, assigned Pia coaches, and home pitches.",
  },
  DELETE_CLUBS: {
    id: "DELETE_CLUBS",
    category: "Registration",
    action: "De-register / Delete Clubs",
    description: "Remove clubs from active league competition (Super Admin reserved).",
  },
  MANAGE_SQUADS: {
    id: "MANAGE_SQUADS",
    category: "Registration",
    action: "Squad Roster Management",
    description: "Add, transfer, and edit players, enforce squad limits and tactical positions.",
  },
  VERIFY_PLAYER_ELIGIBILITY: {
    id: "VERIFY_PLAYER_ELIGIBILITY",
    category: "Registration",
    action: "Student Admission Verification",
    description: "Verify student admission numbers against official academy student records.",
  },
  FILE_REGULATION_VIOLATIONS: {
    id: "FILE_REGULATION_VIOLATIONS",
    category: "Registration",
    action: "Regulatory Violation Filing",
    description:
      "Issue formal citations for unregistered players, kit clashes, or roster tampering.",
  },
  ASSIGN_MATCH_REFEREES: {
    id: "ASSIGN_MATCH_REFEREES",
    category: "Match Officiating",
    action: "Appoint Match Referees",
    description: "Assign center referees, assistant linesmen, and 4th officials to fixtures.",
  },
  EVALUATE_REFEREE_PERFORMANCE: {
    id: "EVALUATE_REFEREE_PERFORMANCE",
    category: "Match Officiating",
    action: "Referee Performance Auditing",
    description: "Audit and rate match referee impartiality, decision-making, and positioning.",
  },
  CONDUCT_CARD_HEARINGS: {
    id: "CONDUCT_CARD_HEARINGS",
    category: "Match Officiating",
    action: "Disciplinary Card Hearings",
    description: "Determine match ban duration and fines for yellow and red card recipients.",
  },
  COORDINATE_OFFICIATING_STANDARDS: {
    id: "COORDINATE_OFFICIATING_STANDARDS",
    category: "Match Officiating",
    action: "Fair-Play Standards Coordination",
    description: "Enforce FIFA / eFootball fair-play regulations and conduct briefings.",
  },
  CERTIFY_MATCH_SCORECARDS: {
    id: "CERTIFY_MATCH_SCORECARDS",
    category: "Records & Stats",
    action: "Certify Match Scorecards",
    description: "Enter and certify official full-time scores, goal scorers, and assists.",
  },
  RECORD_COUNCIL_MINUTES: {
    id: "RECORD_COUNCIL_MINUTES",
    category: "Records & Stats",
    action: "Record Official Minutes",
    description: "Archive official executive council proceedings, resolutions, and meetings.",
  },
  EDIT_PLAYER_STATS: {
    id: "EDIT_PLAYER_STATS",
    category: "Records & Stats",
    action: "Edit Player Leaderboard Stats",
    description: "Update Golden Boot goal tallies, assists, clean sheets, and player ratings.",
  },
  DELETE_PLAYER_STATS: {
    id: "DELETE_PLAYER_STATS",
    category: "Records & Stats",
    action: "Delete Player Stat Entries",
    description: "Remove erroneous or duplicated player statistical records.",
  },
  ARCHIVE_LEAGUE_DOCUMENTS: {
    id: "ARCHIVE_LEAGUE_DOCUMENTS",
    category: "Records & Stats",
    action: "Archive Official Documents",
    description: "Seal and maintain historical match records, rosters, and disciplinary files.",
  },
  EXPORT_LEAGUE_REPORTS: {
    id: "EXPORT_LEAGUE_REPORTS",
    category: "Records & Stats",
    action: "Export Official League Reports",
    description: "Generate and export printable standings, rosters, and match summaries.",
  },
  MANAGE_SCOREBOARD_TICKER: {
    id: "MANAGE_SCOREBOARD_TICKER",
    category: "Digital & Media",
    action: "Pitchside LED Scoreboard Controller",
    description: "Update real-time scoreboard ticker messages and match announcements.",
  },
  MANAGE_WEBSITE_ANTHEM: {
    id: "MANAGE_WEBSITE_ANTHEM",
    category: "Digital & Media",
    action: "Stadium Anthem & Song Studio",
    description: "Upload custom audio songs or link YouTube stadium anthems for website playback.",
  },
  PUBLISH_LEAGUE_NEWS: {
    id: "PUBLISH_LEAGUE_NEWS",
    category: "Digital & Media",
    action: "Publish Official League Articles",
    description: "Broadcast match previews, matchday reviews, and press releases.",
  },
  UPLOAD_MATCHDAY_MEDIA: {
    id: "UPLOAD_MATCHDAY_MEDIA",
    category: "Digital & Media",
    action: "Upload Matchday Photos & Videos",
    description: "Add match action photos, video highlights, and pitchside camera reels.",
  },
  OVERSEE_DIGITAL_PLATFORMS: {
    id: "OVERSEE_DIGITAL_PLATFORMS",
    category: "Digital & Media",
    action: "Platform Continuity & Diagnostics",
    description: "Monitor portal performance, CDN status, and high-availability operations.",
  },
  ASSIST_NEWS_PUBLISHING: {
    id: "ASSIST_NEWS_PUBLISHING",
    category: "Digital & Media",
    action: "Draft & Assist News Publishing",
    description: "Draft match reports and submit them for executive review and release.",
  },
  ASSIST_MEDIA_UPLOADS: {
    id: "ASSIST_MEDIA_UPLOADS",
    category: "Digital & Media",
    action: "Assist Media Processing",
    description: "Upload and tag photos and video clips to the matchday media gallery.",
  },
  ASSIST_SCOREBOARD_UPDATES: {
    id: "ASSIST_SCOREBOARD_UPDATES",
    category: "Digital & Media",
    action: "Assist Scoreboard Operations",
    description: "Input live score feeds and ticker updates alongside the Tech Manager.",
  },
};

/**
 * Custom React hook that checks user's role and restricts access to specific UI components
 * based on the defined 7-tier role hierarchy.
 */
export function useRoleAccess(initialRole?: LeagueRole) {
  const [currentRole, setCurrentRole] = useState<LeagueRole>(initialRole || "GUEST");

  // Read stored role on client mount after hydration to prevent SSR mismatch
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedRole = localStorage.getItem("mpesa_pes_auth_role");
        if (storedRole && storedRole in ROLE_HIERARCHY_DATA) {
          setCurrentRole(storedRole as LeagueRole);
          return;
        }
        const isSuper = localStorage.getItem("mpesa_pes_super_admin") === "true";
        if (isSuper) {
          setCurrentRole("SUPER_ADMIN");
          return;
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Listen to cross-component role changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedRole = localStorage.getItem("mpesa_pes_auth_role");
      if (storedRole && storedRole in ROLE_HIERARCHY_DATA) {
        setCurrentRole(storedRole as LeagueRole);
      } else {
        const isSuper = localStorage.getItem("mpesa_pes_super_admin") === "true";
        setCurrentRole(isSuper ? "SUPER_ADMIN" : "GUEST");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("mpesa_role_changed", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("mpesa_role_changed", handleStorageChange);
    };
  }, []);

  const switchRole = useCallback((newRole: LeagueRole) => {
    setCurrentRole(newRole);
    if (typeof window !== "undefined") {
      if (newRole === "SUPER_ADMIN") {
        localStorage.setItem("mpesa_pes_super_admin", "true");
        localStorage.setItem("mpesa_pes_auth_role", "SUPER_ADMIN");
      } else if (newRole === "GUEST") {
        localStorage.removeItem("mpesa_pes_super_admin");
        localStorage.removeItem("mpesa_pes_auth_role");
      } else {
        localStorage.removeItem("mpesa_pes_super_admin");
        localStorage.setItem("mpesa_pes_auth_role", newRole);
      }
      window.dispatchEvent(new Event("mpesa_role_changed"));
    }
  }, []);

  const roleDetails = useMemo(() => {
    return ROLE_HIERARCHY_DATA[currentRole] || ROLE_HIERARCHY_DATA.GUEST;
  }, [currentRole]);

  const canAccess = useCallback(
    (permission: PermissionKey): boolean => {
      if (currentRole === "SUPER_ADMIN") return true;
      return roleDetails.permissions.includes(permission);
    },
    [currentRole, roleDetails],
  );

  const isAtLeastRole = useCallback(
    (targetTier: number): boolean => {
      // Lower tier number means higher authority in the hierarchy (0 = Super Admin, 1 = President, ..., 7 = Asst Tech)
      return roleDetails.tier <= targetTier;
    },
    [roleDetails.tier],
  );

  const hasRole = useCallback(
    (roles: LeagueRole | LeagueRole[]): boolean => {
      if (currentRole === "SUPER_ADMIN") return true;
      const targetRoles = Array.isArray(roles) ? roles : [roles];
      return targetRoles.includes(currentRole);
    },
    [currentRole],
  );

  const authorizedActions = useMemo<AuthorizedAction[]>(() => {
    return roleDetails.permissions
      .map((p) => ALL_ACTION_DEFINITIONS[p])
      .filter((a): a is AuthorizedAction => Boolean(a));
  }, [roleDetails]);

  const restrictedActions = useMemo<AuthorizedAction[]>(() => {
    const authorizedSet = new Set(roleDetails.permissions);
    return Object.values(ALL_ACTION_DEFINITIONS).filter((a) => !authorizedSet.has(a.id));
  }, [roleDetails]);

  return {
    currentRole,
    roleTier: roleDetails.tier,
    roleDetails,
    canAccess,
    isAtLeastRole,
    hasRole,
    switchRole,
    authorizedActions,
    restrictedActions,

    // High-convenience permissions
    isSuperAdmin: currentRole === "SUPER_ADMIN",
    isPresident: currentRole === "PRESIDENT",
    isExecutive: roleDetails.tier <= 2,
    canManageClubs: canAccess("REGISTER_CLUBS") || canAccess("EDIT_CLUBS"),
    canDeleteClubs: canAccess("DELETE_CLUBS"),
    canManageSquads: canAccess("MANAGE_SQUADS"),
    canEditScores: canAccess("CERTIFY_MATCH_SCORECARDS"),
    canEditPlayerStats: canAccess("EDIT_PLAYER_STATS"),
    canAssignReferees: canAccess("ASSIGN_MATCH_REFEREES"),
    canConductHearings: canAccess("CONDUCT_CARD_HEARINGS"),
    canPublishNews: canAccess("PUBLISH_LEAGUE_NEWS"),
    canUploadMedia: canAccess("UPLOAD_MATCHDAY_MEDIA"),
    canManageSong: canAccess("MANAGE_WEBSITE_ANTHEM"),
    canRecordMinutes: canAccess("RECORD_COUNCIL_MINUTES"),
  };
}
