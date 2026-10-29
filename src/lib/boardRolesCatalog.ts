import type { LeagueRole } from "../hooks/useRoleAccess";

export interface BoardRoleFeature {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName?: string;
  badge?: string;
}

export interface BoardRoleDefinition {
  role: Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">;
  title: string;
  officialLead: string;
  department: string;
  tier: string;
  iconSymbol: string;
  roleDescription: string;
  webFlowImpact: string;
  features: BoardRoleFeature[];
}

export const BOARD_ROLES_CATALOG: Record<
  Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">,
  BoardRoleDefinition
> = {
  PRESIDENT: {
    role: "PRESIDENT",
    title: "President — Executive Leadership",
    officialLead: "Alex Haro",
    department: "Executive Council & Governance",
    tier: "Tier 1",
    iconSymbol: "👑",
    roleDescription:
      "Provides supreme leadership, oversees league governance, leads executive meetings, handles major dispute resolutions, and authorizes final policy changes and emergency actions.",
    webFlowImpact:
      "Rulings and rulebook updates made here instantly lock disciplinary statuses and update public documents across all divisions.",
    features: [
      {
        id: "health_analytics",
        title: "Global League Health Analytics",
        category: "Analytics & Oversight",
        description:
          "Real-time metrics tracking total clubs, active players, revenue, and open disputes.",
      },
      {
        id: "alert_feed",
        title: "Executive Alert Feed",
        category: "Analytics & Oversight",
        description:
          "High-priority notification center for match abandonment, protests, or critical incidents.",
      },
      {
        id: "financial_summary",
        title: "Financial Summary Overview",
        category: "Analytics & Oversight",
        description: "High-level overview of league treasury health sync'd with admin accounts.",
      },
      {
        id: "protests_appeals",
        title: "Club Protests & Appeals Queue",
        category: "Disputes & Hearings",
        description: "Inbox for formal protests submitted by clubs regarding referee decisions.",
      },
      {
        id: "dossier_viewer",
        title: "Disciplinary Case Dossier Viewer",
        category: "Disputes & Hearings",
        description:
          "File hub compiling match reports, video clips, and statements for active hearings.",
      },
      {
        id: "video_vault",
        title: "Video & Evidence Review Vault",
        category: "Disputes & Hearings",
        description: "Integrated media player for reviewing match footage during dispute hearings.",
      },
      {
        id: "ruling_generator",
        title: "Formal Ruling Letter Generator",
        category: "Disputes & Hearings",
        description:
          "Auto-generates official PDF letters detailing fines, point deductions, or match replays.",
      },
      {
        id: "suspension_desk",
        title: "Executive Suspension Approval Desk",
        category: "Disputes & Hearings",
        description:
          "Master sign-off interface required to approve long-term player or coach bans.",
      },
      {
        id: "rulebook_editor",
        title: "Official Rulebook Amendment Editor",
        category: "Governance & Policies",
        description:
          "Draft competition rule changes; updates auto-sync to the public rulebook download.",
      },
      {
        id: "conduct_policy",
        title: "Code of Conduct Policy Manager",
        category: "Governance & Policies",
        description: "Update codes of ethics for players, coaches, parents, and fans.",
      },
      {
        id: "compliance_desk",
        title: "Club Compliance Review Desk",
        category: "Governance & Policies",
        description: "Overview of clubs meeting or failing annual league requirements.",
      },
      {
        id: "motion_engine",
        title: "New Motion Creation Engine",
        category: "Voting & Resolutions",
        description:
          "Form to launch official votes for board members (e.g., division restructuring).",
      },
      {
        id: "voting_tally",
        title: "Live Board Voting Tally Monitor",
        category: "Voting & Resolutions",
        description: "Live graphical tracker of votes (Yes/No/Abstain) from all 7 board members.",
      },
      {
        id: "motion_reminder",
        title: "Motion Expiration & Reminder Trigger",
        category: "Voting & Resolutions",
        description: "Auto-sends reminders to board members who haven't voted within set windows.",
      },
      {
        id: "resolutions_archive",
        title: "Passed Resolutions Archive",
        category: "Voting & Resolutions",
        description: "Searchable database of all historic board policies and votes.",
      },
      {
        id: "club_affiliation",
        title: "New Club Affiliation Final Sign-off",
        category: "Executive Clearances",
        description: "Final executive authorization admitting a new club into active divisions.",
      },
      {
        id: "budget_approval",
        title: "Season Budget Final Approval",
        category: "Executive Clearances",
        description: "Review and grant authorization for operational budget disbursements.",
      },
      {
        id: "rescheduling_signoff",
        title: "Match Rescheduling Sign-off",
        category: "Executive Clearances",
        description: "Authorize emergency game postponements or venue alterations.",
      },
      {
        id: "agenda_builder",
        title: "Board Meeting Agenda Builder",
        category: "Meetings & Communications",
        description:
          "Interactive tool to construct meeting agendas distributed to all board members.",
      },
      {
        id: "directives_broadcast",
        title: "Executive Directives Broadcast Tool",
        category: "Meetings & Communications",
        description: "Dispatch priority notices directly to all Club Managers via SMS/Email.",
      },
      {
        id: "audit_review",
        title: "Inter-Departmental Audit Review",
        category: "Operations Oversight",
        description: "View performance ratings and task velocity across all 5 board departments.",
      },
      {
        id: "emergency_lockdown",
        title: "Emergency League Lockdown Toggle",
        category: "Operations Oversight",
        description:
          "Safety override to pause all scheduled matches league-wide due to severe weather.",
      },
    ],
  },

  DEPUTY_PRESIDENT: {
    role: "DEPUTY_PRESIDENT",
    title: "Deputy President — Operations & Supervision",
    officialLead: "Babra Nandako",
    department: "Executive Operations & Supervisions",
    tier: "Tier 2",
    iconSymbol: "🥈",
    roleDescription:
      "Assists the President, monitors departmental progress across all boards, manages special task forces, and operates the emergency Acting President override when needed.",
    webFlowImpact:
      "Ensures all operational gears turn smoothly so match days run without administrative gridlock.",
    features: [
      {
        id: "activity_stream",
        title: "Real-Time Operational Activity Stream",
        category: "Operational Monitoring",
        description: "Live ticker displaying administrative actions across all departments.",
      },
      {
        id: "task_health",
        title: "Departmental Task Health Index",
        category: "Operational Monitoring",
        description: "Color-coded gauge measuring performance speed per department.",
      },
      {
        id: "matchday_readiness",
        title: "Match-Day Readiness Dashboard",
        category: "Operational Monitoring",
        description:
          "Pre-weekend checklist verifying pitches, referees, and medical staff are cleared.",
      },
      {
        id: "registration_velocity",
        title: "Registration Department Velocity Tracker",
        category: "Operational Monitoring",
        description: "Monitor how fast player applications are being cleared.",
      },
      {
        id: "officiating_monitor",
        title: "Officiating Assignment Completion Monitor",
        category: "Operational Monitoring",
        description: "Track progress in filling referee slots for upcoming weekend fixtures.",
      },
      {
        id: "records_compliance",
        title: "Records Archival Compliance Check",
        category: "Operational Monitoring",
        description: "Ensure match sheets from the previous weekend are certified and locked.",
      },
      {
        id: "tech_pulse",
        title: "Tech & Media Publishing Pulse",
        category: "Operational Monitoring",
        description: "Verify that tables, news recaps, and photos have been pushed live.",
      },
      {
        id: "acting_power",
        title: "Emergency Executive Power Activation",
        category: "Acting President Powers",
        description: "One-click toggle granting temporary presidential powers during absences.",
      },
      {
        id: "standin_dispute",
        title: "Stand-in Dispute Ruling Console",
        category: "Acting President Powers",
        description: "Handle urgent match protests when operating in Acting President mode.",
      },
      {
        id: "standin_approval",
        title: "Stand-in Approval Clearance Desk",
        category: "Acting President Powers",
        description: "Clear time-sensitive club applications when the President is unavailable.",
      },
      {
        id: "taskforce_creator",
        title: "Project Task Force Creation Module",
        category: "Special Task Forces",
        description: "Set up special committees (e.g., End of Season Gala Committee).",
      },
      {
        id: "personnel_assignment",
        title: "Personnel Assignment Console",
        category: "Special Task Forces",
        description: "Assign specific board members or volunteers to operational task forces.",
      },
      {
        id: "milestone_tracker",
        title: "Task Deadline & Milestone Tracker",
        category: "Special Task Forces",
        description: "Gantt chart tracking special project progress against deadlines.",
      },
      {
        id: "committee_budget",
        title: "Project Budget Allocation Monitor",
        category: "Special Task Forces",
        description: "Track micro-budgets allocated to operational committees.",
      },
      {
        id: "bottleneck_resolver",
        title: "Inter-Departmental Bottleneck Resolver",
        category: "Logistics & Venues",
        description: "Intervene in cross-department delays holding up league operations.",
      },
      {
        id: "venue_inspection",
        title: "Pitch Venue Inspection Auditor",
        category: "Logistics & Venues",
        description: "Upload inspection reports and photos evaluating pitch turf and goalposts.",
      },
      {
        id: "pitch_safety",
        title: "Pitch Safety & Equipment Compliance Log",
        category: "Logistics & Venues",
        description: "Track availability of corner flags, stretchers, and match balls per ground.",
      },
      {
        id: "delegate_briefing",
        title: "Match-Day Delegate Briefing Manager",
        category: "Logistics & Venues",
        description: "Send instructions and checklists to neutral match delegates.",
      },
      {
        id: "emergency_transfer",
        title: "Emergency Venue Transfer Trigger",
        category: "Logistics & Venues",
        description:
          "Relocate a match to a backup venue and notify clubs and referees automatically.",
      },
      {
        id: "operational_alerts",
        title: "Operational Delay Alert System",
        category: "Logistics & Venues",
        description: "Automated warnings when match sheets or player approvals are overdue.",
      },
      {
        id: "task_reassignment",
        title: "Cross-Department Task Reassignment Tool",
        category: "Logistics & Venues",
        description: "Reallocate pending tasks from an overwhelmed official to another member.",
      },
    ],
  },

  REGULATIONS_MANAGER: {
    role: "REGULATIONS_MANAGER",
    title: "Register & Regulations Manager — Compliance",
    officialLead: "Whitney Juma / Cheryl Cosmas",
    department: "Registrar & Eligibility Commission",
    tier: "Tier 3",
    iconSymbol: "📋",
    roleDescription:
      "Maintains accurate records of clubs, players, coaches, and managers; enforces eligibility rules; audits age documents; handles player passes and violation reporting.",
    webFlowImpact:
      "Approved players instantly appear on public team squad pages and can be selected on match sheets.",
    features: [
      {
        id: "queue_overview",
        title: "Registration Queue Overview",
        category: "Queue & Metrics",
        description:
          "Real-time summary of pending club applications, player approvals, and transfers.",
      },
      {
        id: "roster_metrics",
        title: "Division Capacity & Roster Metrics",
        category: "Queue & Metrics",
        description: "Track registered player counts per age division.",
      },
      {
        id: "enrollment_countdown",
        title: "Season Enrollment Countdown Engine",
        category: "Queue & Metrics",
        description:
          "Set registration opening and closing dates; auto-locks public forms upon deadline.",
      },
      {
        id: "club_review",
        title: "New Club Registration Review Desk",
        category: "Club Licensing",
        description: "Verify incoming club registration details, team colors, and home grounds.",
      },
      {
        id: "coach_credentials",
        title: "Head Coach & Manager Credential Auditor",
        category: "Club Licensing",
        description: "Check and approve coaching licenses before granting dugout access.",
      },
      {
        id: "staff_background",
        title: "Technical Staff Background Check Tracker",
        category: "Club Licensing",
        description: "Verify safeguarding clearances for adult staff managing youth teams.",
      },
      {
        id: "club_license_gen",
        title: "Official Club License Generator",
        category: "Club Licensing",
        description:
          "Issue downloadable digital certificates granting legal entry into the league.",
      },
      {
        id: "staff_id_pass",
        title: "Staff ID Pass Issuance Console",
        category: "Club Licensing",
        description: "Generate digital badges for coaches and team managers for pitch-side checks.",
      },
      {
        id: "pending_players",
        title: "Pending Player Application Queue",
        category: "Player Verification",
        description: "Main workspace to process player join requests submitted by clubs.",
      },
      {
        id: "age_calculator",
        title: "Automated Age-Verification Calculator",
        category: "Player Verification",
        description: "Automatically compares a player's birth date against division cutoff limits.",
      },
      {
        id: "doc_inspector",
        title: "Document Inspection Viewer (IDs/Birth Certs)",
        category: "Player Verification",
        description:
          "High-resolution image viewer to inspect uploaded birth certificates or school IDs.",
      },
      {
        id: "player_pass_qr",
        title: "Digital Player Pass Generator (with QR Code)",
        category: "Player Verification",
        description: "Creates scannable player IDs used for match-day verification.",
      },
      {
        id: "roster_lock",
        title: "Official Squad Roster Lock Console",
        category: "Squad Cap & Roster Lock",
        description:
          "Lock team rosters prior to match deadlines so unverified players cannot play.",
      },
      {
        id: "overage_flags",
        title: "Over-Age Player Flagging System",
        category: "Eligibility Enforcement",
        description: "Automatic red alerts on rosters containing players exceeding age limits.",
      },
      {
        id: "duplicate_detection",
        title: "Duplicate Player Identity Detection",
        category: "Eligibility Enforcement",
        description: "Smart audit tool detecting if a player is registered under multiple clubs.",
      },
      {
        id: "suspension_lockout",
        title: "Suspended Player Lineup Lockout Tool",
        category: "Eligibility Enforcement",
        description: "Automatically blocks suspended players from appearing on match lineups.",
      },
      {
        id: "ineligible_auditor",
        title: "Ineligible Player Field Usage Auditor",
        category: "Eligibility Enforcement",
        description:
          "Cross-reference post-match sheets with official rosters to flag illegal players.",
      },
      {
        id: "waiver_ledger",
        title: "Parental/Guardian Waiver Audit Ledger",
        category: "Health & Waivers",
        description:
          "Verify that every player has a signed parental consent and photo waiver on file.",
      },
      {
        id: "medical_tracker",
        title: "Medical Clearance & Allergy Tracker",
        category: "Health & Waivers",
        description: "Maintain emergency medical notes linked to player passes for pitch safety.",
      },
      {
        id: "transfer_portal",
        title: "Player Transfer & Release Approval Portal",
        category: "Transfers & 15-Cap",
        description:
          "Process transfer paperwork between clubs ensuring 15-player squad limit is strictly enforced.",
      },
      {
        id: "noncompliance_dispatcher",
        title: "Non-Compliance Notice Dispatcher",
        category: "Sanctions & Fines",
        description: "Send automated warning notices to clubs missing required documentation.",
      },
      {
        id: "violation_fine_logger",
        title: "Regulatory Violation Fine Logger",
        category: "Sanctions & Fines",
        description: "Issue financial penalties to clubs breaching registration rules.",
      },
    ],
  },

  MATCH_OFFICIATING_MANAGER: {
    role: "MATCH_OFFICIATING_MANAGER",
    title: "Match Officiating Programmes Manager — Operations",
    officialLead: "Idi Sebantu / Mitchelle Muthoni",
    department: "Officiating & Refereeing Department",
    tier: "Tier 4",
    iconSymbol: "⚖️",
    roleDescription:
      "Organizes match officiating schedules, assigns referees to fixtures, manages referee impartiality, tracks performance ratings, and addresses officiating concerns.",
    webFlowImpact:
      "Referee assignments and post-match goal/card data feed directly into match center timelines and public standings.",
    features: [
      {
        id: "coverage_gauge",
        title: "Weekly Officiating Coverage Gauge",
        category: "Referee Roster & Coverage",
        description: "Visual percentage showing how many upcoming matches have assigned referees.",
      },
      {
        id: "availability_matrix",
        title: "Referee Availability Matrix",
        category: "Referee Roster & Coverage",
        description: "Weekly calendar displaying referee availability, injuries, or leaves.",
      },
      {
        id: "commissioner_monitor",
        title: "Match Commissioner Allocation Monitor",
        category: "Referee Roster & Coverage",
        description:
          "Assign certified match commissioners to oversee match operations and fair play.",
      },
      {
        id: "referee_assigner",
        title: "Fixture Referee Quad-Crew Assigner",
        category: "Appointments & Quad-Crews",
        description:
          "Visual fixture list to assign certified Center Referees, Linesmen, and 4th Officials.",
      },
      {
        id: "conflict_filter",
        title: "Automated Conflict-of-Interest Filter",
        category: "Appointments & Quad-Crews",
        description:
          "System warning preventing referees from officiating their affiliated club's matches.",
      },
      {
        id: "linesmen_scheduler",
        title: "Linesperson & 4th Official Scheduler",
        category: "Appointments & Quad-Crews",
        description:
          "Assign qualified assistant referees (Linesman 1 & 2) and sideline table stewards.",
      },
      {
        id: "delegate_assigner",
        title: "Match Delegate & Steward Assigner",
        category: "Appointments & Quad-Crews",
        description: "Appoint independent match delegates to observe high-tension fixtures.",
      },
      {
        id: "ref_notifications",
        title: "Automated Referee Match Notification System",
        category: "Appointments & Quad-Crews",
        description: "Auto-send SMS/email fixture confirmations with kickoff times and venues.",
      },
      {
        id: "matchsheet_queue",
        title: "Digital Match Sheet Audit Queue",
        category: "Match Reports & Incidents",
        description:
          "Receive submitted post-match reports directly from referees after final whistles.",
      },
      {
        id: "goal_assist_verifier",
        title: "Goal Scorer & Assist Verification",
        category: "Match Reports & Incidents",
        description: "Audit and confirm goal scorer jersey numbers and assist entries.",
      },
      {
        id: "card_extractor",
        title: "Red/Yellow Card Incident Extractor",
        category: "Match Reports & Incidents",
        description: "Extract yellow and red card details to push into the disciplinary ledger.",
      },
      {
        id: "ref_comments",
        title: "Referee Match Comments Inspector",
        category: "Match Reports & Incidents",
        description:
          "Read referee notes regarding pitch conditions or team sportsmanship behavior.",
      },
      {
        id: "certification_trigger",
        title: "Match Sheet Certification Trigger",
        category: "Match Reports & Incidents",
        description:
          "Approve and send verified match reports to the Records Manager for archiving.",
      },
      {
        id: "coach_feedback",
        title: "Post-Match Coach Feedback Aggregator",
        category: "Performance & Rankings",
        description:
          "Compile post-match ratings submitted by team coaches evaluating referee impartiality.",
      },
      {
        id: "impartiality_matrix",
        title: "Referee Impartiality Rating Matrix",
        category: "Performance & Rankings",
        description: "Track referee fairness scores across different teams to detect bias.",
      },
      {
        id: "ranking_leaderboard",
        title: "Official Referee Ranking Leaderboard",
        category: "Performance & Rankings",
        description: "Rank match officials based on experience, performance, and fitness tests.",
      },
      {
        id: "highstakes_selector",
        title: "High-Stakes Fixture Assignment Selector",
        category: "Performance & Rankings",
        description:
          "Reserve top-tier referees exclusively for derby matches and championship finals.",
      },
      {
        id: "abuse_desk",
        title: "Referee Abuse Incident Desk",
        category: "Disputes & Discipline",
        description:
          "Dedicated portal to investigate instances of harassment toward match officials.",
      },
      {
        id: "disputed_calls",
        title: "Disputed Calls Review Queue",
        category: "Disputes & Discipline",
        description:
          "Log and inspect contentious decisions using match footage and match commissioner logs.",
      },
      {
        id: "retraining_logger",
        title: "Officiating Retraining & Directive Logger",
        category: "Disputes & Discipline",
        description: "Issue mandatory rule refresher workshops for refereeing errors.",
      },
      {
        id: "ref_payout_ledger",
        title: "Referee Payout & Match Fee Ledger",
        category: "Administration & Badges",
        description:
          "Calculate match allowance fees per referee and sync payout requests with treasury.",
      },
      {
        id: "badge_renewal",
        title: "Referee Registration & Badge Renewal Desk",
        category: "Administration & Badges",
        description:
          "Manage annual registration, fitness tests, and exam certifications for referees.",
      },
    ],
  },

  RECORDS_MANAGER: {
    role: "RECORDS_MANAGER",
    title: "Records & File Manager — Archives & Standings",
    officialLead: "Tonnie Mark Odundo / Ian Muli",
    department: "Central Archives & Statistical Office",
    tier: "Tier 5",
    iconSymbol: "📂",
    roleDescription:
      "Maintains official league documents, manages match sheet archives, locks official season standings, oversees the central disciplinary ledger, and records administrative decisions.",
    webFlowImpact:
      "Certified standings and locked match sheets ensure the public viewer displays tamper-proof, official league tables.",
    features: [
      {
        id: "repo_health",
        title: "Central Repository Health Monitor",
        category: "Vault & Storage",
        description: "Overview of all archived files, indexing status, and data security.",
      },
      {
        id: "storage_log",
        title: "Storage Capacity & Archival Log",
        category: "Vault & Storage",
        description: "Monitor cloud file storage usage for document PDFs and match sheets.",
      },
      {
        id: "quick_search",
        title: "Quick-Search Document Index",
        category: "Vault & Storage",
        description: "Search engine to instantly find any document using tags or dates.",
      },
      {
        id: "constitution_archive",
        title: "League Constitution & Charter Archive",
        category: "Vault & Storage",
        description: "Version-controlled storage of founding rules and bylaws.",
      },
      {
        id: "minutes_depository",
        title: "Board Meeting Minutes Depository",
        category: "Official Documents",
        description: "Upload, index, and secure signed copies of all board meeting minutes.",
      },
      {
        id: "pitch_agreements",
        title: "Pitch Lease & Ground Agreements Vault",
        category: "Official Documents",
        description: "Secure repository for contract agreements signed with stadium owners.",
      },
      {
        id: "contracts_repo",
        title: "Sponsorship & Media Contracts Repository",
        category: "Official Documents",
        description: "Archive corporate sponsorship agreements and payment schedules.",
      },
      {
        id: "season_archives",
        title: "Historical Season Archives (PDF Exports)",
        category: "Official Documents",
        description:
          "Complete historical archives of previous seasons' final standings and champions.",
      },
      {
        id: "matchsheet_vault",
        title: "Certified Match Sheet Vault",
        category: "Standings & Stats Locks",
        description:
          "Permanent digital archive of referee-certified match sheets protected against tampering.",
      },
      {
        id: "standings_certifier",
        title: "Master Season Standings Certifier & Locker",
        category: "Standings & Stats Locks",
        description: "Formally lock division standings at the end of every match-week.",
      },
      {
        id: "golden_boot_lock",
        title: "Official Golden Boot & Scorer Log Lock",
        category: "Standings & Stats Locks",
        description: "Verify and lock player goal totals to prevent unauthorized stat edits.",
      },
      {
        id: "cleansheet_ledger",
        title: "Clean Sheet & Defense Record Ledger",
        category: "Standings & Stats Locks",
        description: "Record and lock goalkeeper clean sheets and defensive stats.",
      },
      {
        id: "h2h_database",
        title: "Historical Head-to-Head Database",
        category: "Standings & Stats Locks",
        description: "Lifetime match records comparing any two clubs across past encounters.",
      },
      {
        id: "cards_index",
        title: "Master Yellow & Red Card Cumulative Index",
        category: "Disciplinary Ledger",
        description: "Central database tracking every booking across all divisions.",
      },
      {
        id: "card_ban_calculator",
        title: "Automated Card-Threshold Ban Calculator",
        category: "Disciplinary Ledger",
        description: "Calculates automatic suspensions based on card accumulation.",
      },
      {
        id: "suspension_publisher",
        title: "Official Suspension List Publisher",
        category: "Disciplinary Ledger",
        description: "Export and publish the official weekly suspended players list to all clubs.",
      },
      {
        id: "disciplinary_fines",
        title: "Club Disciplinary Fine Tracking Ledger",
        category: "Disciplinary Ledger",
        description: "Track fines issued to clubs for card accumulation or misconduct.",
      },
      {
        id: "fairplay_auditor",
        title: "Fair Play & Sportsmanship Points Auditor",
        category: "Disciplinary Ledger",
        description:
          "Calculate and lock fair play points based on low card counts and conduct scores.",
      },
      {
        id: "rulings_index",
        title: "Searchable Board Rulings & Precedents Index",
        category: "Legal & Rulings",
        description: "Database of past board rulings used as legal reference.",
      },
      {
        id: "executive_order_log",
        title: "Executive Order Legal Registry",
        category: "Legal & Rulings",
        description: "Formal archive of all executive orders signed by the presidential desk.",
      },
      {
        id: "amendment_versioning",
        title: "Constitutional Amendment Version Control",
        category: "Legal & Rulings",
        description: "Track every modification made to league regulations over time.",
      },
      {
        id: "award_generator",
        title: "Official Certificate & Award Generator",
        category: "Legal & Rulings",
        description:
          "Generate printable certificates for League Champions and Golden Boot winners.",
      },
      {
        id: "backup_audit",
        title: "Data Backup Audit Log",
        category: "Legal & Rulings",
        description: "Log daily archives of all league records to prevent data loss.",
      },
    ],
  },

  TECH_MANAGER: {
    role: "TECH_MANAGER",
    title: "Technological Manager — Digital Platforms & CMS",
    officialLead: "Victor Kiplagat / Carson",
    department: "Information Technology & Web Infrastructure",
    tier: "Tier 6",
    iconSymbol: "💻",
    roleDescription:
      "Oversees digital platforms, manages public website CMS publishing, controls live match score engines, monitors server health, and ensures data integrity.",
    webFlowImpact:
      "Directly controls what the public sees, acting as the publishing gateway for all league data and media.",
    features: [
      {
        id: "system_health",
        title: "Platform System Health Monitor",
        category: "Infrastructure & Health",
        description: "Real-time dashboard showing server status, CPU load, and database speeds.",
      },
      {
        id: "visitor_traffic",
        title: "Live Public Visitor Traffic Gauge",
        category: "Infrastructure & Health",
        description: "Track active parents, players, and fans browsing public pages.",
      },
      {
        id: "server_metrics",
        title: "API & Server Performance Metrics",
        category: "Infrastructure & Health",
        description: "Monitor data load speeds to ensure fast mobile performance on match days.",
      },
      {
        id: "hero_editor",
        title: "Homepage Hero Banner & Slider Editor",
        category: "CMS & Publishing",
        description: "Update main home page graphics, match banners, and call-to-action buttons.",
      },
      {
        id: "news_publisher",
        title: "News Article & Match Preview Publisher",
        category: "CMS & Publishing",
        description: "Format and publish match preview stories, weekly recaps, and announcements.",
      },
      {
        id: "sponsor_marquee",
        title: "Sponsor Logo & Partner Marquee Manager",
        category: "CMS & Publishing",
        description: "Add, remove, or order sponsor branding images displayed on public footers.",
      },
      {
        id: "gallery_embed",
        title: "Photo Gallery & Video Embed Controller",
        category: "CMS & Publishing",
        description: "Manage public photo galleries and embed match highlight videos.",
      },
      {
        id: "nav_customizer",
        title: "Public Navigation Menu Customizer",
        category: "CMS & Publishing",
        description: "Edit or rearrange links on the public navigation bar.",
      },
      {
        id: "score_sync_switch",
        title: "Instant Score & Standings Sync Switch",
        category: "Live Match Engine",
        description:
          "The master trigger button pushing certified match scores live to the public site.",
      },
      {
        id: "ticker_config",
        title: "Live Match Ticker Configuration",
        category: "Live Match Engine",
        description: "Customize the scrolling live score banner running across the public website.",
      },
      {
        id: "live_center_ctrl",
        title: "Match-Day Live Center Controller",
        category: "Live Match Engine",
        description:
          "Manage real-time minute-by-minute live commentary feeds during tournament matches.",
      },
      {
        id: "push_notifications",
        title: "Push Notification Dispatcher",
        category: "Live Match Engine",
        description:
          "Send instant web push notifications to subscribed users regarding live goals.",
      },
      {
        id: "uptime_monitor",
        title: "System Uptime & Status Monitor",
        category: "System Integrity",
        description:
          "Track uptime history ensuring 99.9% availability during peak weekend match hours.",
      },
      {
        id: "daily_backup",
        title: "Automated Daily Database Backup Controller",
        category: "System Integrity",
        description: "Schedule and verify automated cloud backups taken every midnight.",
      },
      {
        id: "ssl_security",
        title: "Security & SSL Certificate Status",
        category: "System Integrity",
        description:
          "Monitor platform security protocols, encryption, and protection against threats.",
      },
      {
        id: "db_optimizer",
        title: "Database Optimization & Indexer",
        category: "System Integrity",
        description:
          "Run maintenance routines to clean up cache files and keep database queries fast.",
      },
      {
        id: "table_math_check",
        title: "League Table Math Auto-Sync Check",
        category: "Integrity & Permissions",
        description:
          "Verify that points, goal differences, and head-to-head calculations match across all views.",
      },
      {
        id: "discrepancy_detector",
        title: "Discrepancy Error Detector",
        category: "Integrity & Permissions",
        description:
          "Automated tool flagging discrepancies between referee sheets and public tables.",
      },
      {
        id: "audit_log_viewer",
        title: "System Audit Log Viewer",
        category: "Integrity & Permissions",
        description: "Track every admin and board user login, edit, or deletion with timestamps.",
      },
      {
        id: "rbac_matrix",
        title: "Role-Based Access Permission Matrix",
        category: "Integrity & Permissions",
        description: "Define what each user role can see or edit across dashboards.",
      },
      {
        id: "thirdparty_api",
        title: "Third-Party API Integration Monitor",
        category: "Integrity & Permissions",
        description: "Manage integrations (SMS gateways, payment portals, cloud storage).",
      },
      {
        id: "maintenance_switch",
        title: "Emergency Web Maintenance Mode Switch",
        category: "Integrity & Permissions",
        description:
          "Toggle a temporary Under Maintenance landing page during major system upgrades.",
      },
    ],
  },

  ASST_TECH_MANAGER: {
    role: "ASST_TECH_MANAGER",
    title: "Assistant Tech Manager — Support & Content",
    officialLead: "Sturridge Ochongoi / Brian",
    department: "Media Assets, Content & Helpdesk Support",
    tier: "Tier 7",
    iconSymbol: "🛠️",
    roleDescription:
      "Assists the Technological Manager, drafts news and match previews, manages media assets and photo galleries, provides technical helpdesk support, and assists with backups.",
    webFlowImpact:
      "Supplies the rich media content, news, and frontline technical support that keeps public engagement high and systems running smoothly.",
    features: [
      {
        id: "helpdesk_workspace",
        title: "User Helpdesk Ticket Workspace",
        category: "Support & Helpdesk",
        description:
          "Manage incoming support requests from club managers, coaches, and board members.",
      },
      {
        id: "account_recovery",
        title: "Password Reset & Account Recovery Desk",
        category: "Support & Helpdesk",
        description: "Safely unlock user accounts and dispatch temporary login links.",
      },
      {
        id: "club_onboarding",
        title: "Club Manager Onboarding Assistant",
        category: "Support & Helpdesk",
        description: "Walk new club managers through their team dashboard setup.",
      },
      {
        id: "recap_draft_queue",
        title: "Match Preview & Recap Draft Queue",
        category: "Content & Editorial",
        description: "Draft weekend match stories and send them to the Tech Manager for review.",
      },
      {
        id: "sportsmanship_editor",
        title: "Sportsmanship & Fair Play Note Editor",
        category: "Content & Editorial",
        description:
          "Draft weekly sportsmanship quotes and fair-play reflections for public match pages.",
      },
      {
        id: "spotlight_builder",
        title: "Weekly Spotlight Article Builder",
        category: "Content & Editorial",
        description:
          "Write feature stories highlighting top players or sportsmanship award winners.",
      },
      {
        id: "tech_submission",
        title: "Tech Manager Content Submission Portal",
        category: "Content & Editorial",
        description: "Submit completed drafts directly into the Tech Manager's approval inbox.",
      },
      {
        id: "photo_compressor",
        title: "Match Photo Upload & Compression Tool",
        category: "Media Assets Vault",
        description: "Upload match day photography; automatically resizes and compresses images.",
      },
      {
        id: "headshot_organizer",
        title: "Player Headshot Asset Organizer",
        category: "Media Assets Vault",
        description:
          "Upload, crop, and link official player photos to player passes and public profiles.",
      },
      {
        id: "crest_library",
        title: "Club Badge & Crest Library",
        category: "Media Assets Vault",
        description:
          "Store and manage high-resolution club logos used across standings and match graphics.",
      },
      {
        id: "highlight_organizer",
        title: "Highlight Reel Video Organizer",
        category: "Media Assets Vault",
        description: "Organize match video links and tag timestamps for goals and saves.",
      },
      {
        id: "branding_applier",
        title: "Watermark & Branding Auto-Applier",
        category: "Media Assets Vault",
        description:
          "Automatically overlay official league logos on match day photos prior to publishing.",
      },
      {
        id: "referee_support",
        title: "Referee Mobile Dashboard Support Desk",
        category: "Technical Frontline",
        description:
          "Provide technical assistance to referees submitting live scorecards at pitches.",
      },
      {
        id: "manager_guidance",
        title: "Club Manager Portal Guidance Desk",
        category: "Technical Frontline",
        description: "Assist coaches with submitting match lineups digitally prior to deadlines.",
      },
      {
        id: "bug_feedback",
        title: "Public Bug & Feedback Inbox",
        category: "Technical Frontline",
        description: "Collect and resolve user feedback regarding broken links reported by fans.",
      },
      {
        id: "device_compatibility",
        title: "Device Compatibility Inspector",
        category: "Technical Frontline",
        description: "Test how public pages display across iPhones, Android phones, and tablets.",
      },
      {
        id: "offline_exporter",
        title: "Manual Offline CSV/Excel Data Exporter",
        category: "Data Backups & Cache",
        description:
          "Generate offline backup files of squad lists and schedules for local storage.",
      },
      {
        id: "matchsheet_scan",
        title: "Match Sheet Scan & Upload Assistant",
        category: "Data Backups & Cache",
        description: "Scan physical paper match sheets and attach them to digital match records.",
      },
      {
        id: "backup_verifier",
        title: "Backup Integrity Verification Tool",
        category: "Data Backups & Cache",
        description: "Test backup files to ensure they can be fully restored in system failures.",
      },
      {
        id: "cache_cleaner",
        title: "System Asset Cache Cleaner",
        category: "Data Backups & Cache",
        description:
          "Clear site cache so newly published graphics load instantly on public devices.",
      },
      {
        id: "livestream_setup",
        title: "Live Stream Setup & Technical Assistant",
        category: "Data Backups & Cache",
        description: "Manage technical settings and camera feeds for live-streamed matches.",
      },
    ],
  },
};
