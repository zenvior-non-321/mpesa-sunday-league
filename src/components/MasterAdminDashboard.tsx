import React, { useState, useEffect, useCallback } from "react";
import {
  Crown,
  Users,
  Shield,
  Trophy,
  Calendar,
  Award,
  Music,
  Vote,
  Camera,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RefreshCw,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Search,
  Sparkles,
  Lock,
  Save,
  DollarSign,
  Send,
  BookOpen,
  Layers,
  Clock,
  Filter,
  Phone,
  Mail,
  UserCheck,
  Share2,
  Database,
  Download,
  Upload,
  HardDrive,
  MessageSquare,
} from "lucide-react";
import { BoardMemberManager } from "./BoardMemberManager";
import { AnthemStudioAndPlaylist } from "./AnthemStudioAndPlaylist";
import { FanCommunityComments } from "./FanCommunityComments";
import { DEFAULT_TEAMS, DEFAULT_FIXTURES, isTeamDeleted } from "../lib/fixturesData";
import { DEFAULT_STANDINGS, type TeamStanding } from "./LeagueStandings";
import { useRoleAccess } from "../hooks/useRoleAccess";

export type AdminSection =
  | "board_members"
  | "seasons_leagues"
  | "teams_clubs"
  | "fixtures_scores"
  | "standings_ledger"
  | "player_stats"
  | "finances_fees"
  | "broadcasts_alerts"
  | "anthem_studio"
  | "fan_comments"
  | "voting_center"
  | "media_photos"
  | "decrees_minutes"
  | "system_backup";

export interface AdminSquadPlayer {
  name: string;
  number?: number;
  position?: string;
  photoUrl?: string;
  admissionNumber?: string;
  email?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  documentsVerified?: boolean;
}

export interface AdminTeam {
  id: number;
  name: string;
  shortCode?: string;
  color?: string;
  homePitch?: string;
  coach?: { name?: string; role?: string; email?: string; photoUrl?: string };
  assistantCoach?: string;
  captain?: string;
  parishOrMinistry?: string;
  squad?: AdminSquadPlayer[];
}

export interface AdminFixture {
  id: number;
  matchweek: number;
  time: string;
  date: string;
  venue: string;
  homeId: number;
  awayId: number;
  homeScore?: number;
  awayScore?: number;
  status?: "SCHEDULED" | "LIVE" | "COMPLETED" | "POSTPONED" | "CANCELLED";
  referee?: string;
  chaplain?: string;
  scorers?: string;
  spiritualBonusHome?: number;
  spiritualBonusAway?: number;
  conductNotes?: string;
}

export interface AdminPlayerStat {
  id?: number | string;
  name: string;
  team: string;
  teamId?: number;
  goals: number;
  assists: number;
  matchesPlayed: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  mvpAwards: number;
  photoUrl?: string;
}

export interface AnthemSettings {
  title: string;
  artist: string;
  youtubeId: string;
  volume: number;
  mode: "audio" | "youtube";
  autoPlay: boolean;
  loop: boolean;
}

export interface LeagueSeason {
  id: string;
  name: string;
  year: number;
  status: "ACTIVE" | "UPCOMING" | "CONCLUDED";
  division: string;
  rulebookExcerpt: string;
  bibleVerseCurriculum: string;
}

export interface FinancialRecord {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  amount: number;
  method: "MPESA" | "CASH" | "BANK_TRANSFER";
  reference: string;
  date: string;
  status: "CONFIRMED" | "PENDING";
}

export interface BroadcastAlert {
  id: string;
  channel: "SMS_ALERT" | "EMAIL_BROADCAST" | "PORTAL_NOTICE";
  recipientGroup: string;
  title: string;
  body: string;
  sentAt: string;
}

const DEFAULT_ANTHEM_SETTINGS: AnthemSettings = {
  title: "M-Pesa Sunday League Official Stadium Anthem",
  artist: "eFootball Championship Edition",
  youtubeId: "2yJgwwDcgV8",
  volume: 0.65,
  mode: "youtube",
  autoPlay: true,
  loop: true,
};

const DEFAULT_SEASONS: LeagueSeason[] = [
  {
    id: "season-2026-spring",
    name: "Spring 2026 Sunday League Championship",
    year: 2026,
    status: "ACTIVE",
    division: "Youth & Parish Premier Division (Under-19)",
    rulebookExcerpt:
      "All teams must maintain strict 15-player rosters. Standard FIFA rules apply with 10-minute halftime. Fair-play sportsmanship bonus points awarded per clean conduct fixture.",
    bibleVerseCurriculum:
      "Philippians 4:13 & 1 Timothy 4:12 — 'Let no one despise your youth, but be an example to the believers in speech, in conduct, in love, in faith, in purity.'",
  },
  {
    id: "season-2026-cup",
    name: "Easter Resurrection Tournament Cup",
    year: 2026,
    status: "UPCOMING",
    division: "Inter-Church Open Knockout Cup",
    rulebookExcerpt:
      "Single-elimination knockout format. Extra time (15 mins each half) followed by FIFA penalty shootout if level.",
    bibleVerseCurriculum:
      "Hebrews 12:1-2 — 'Let us run with endurance the race that is set before us.'",
  },
];

const DEFAULT_FINANCES: FinancialRecord[] = [
  {
    id: "fin-1",
    type: "INCOME",
    category: "Team Registration",
    description: "Thunder FC Season Affiliation Dues",
    amount: 15000,
    method: "MPESA",
    reference: "QKH7829X1A",
    date: "2026-10-18",
    status: "CONFIRMED",
  },
  {
    id: "fin-2",
    type: "INCOME",
    category: "Team Registration",
    description: "Phoenix FC Official Season Entry Fee",
    amount: 15000,
    method: "MPESA",
    reference: "QLM9012B3C",
    date: "2026-10-19",
    status: "CONFIRMED",
  },
  {
    id: "fin-3",
    type: "EXPENSE",
    category: "Referee Fees",
    description: "Matchday 1 & 2 Center & Line Officials Allowances",
    amount: 8000,
    method: "MPESA",
    reference: "QMA4412K9Z",
    date: "2026-10-21",
    status: "CONFIRMED",
  },
  {
    id: "fin-4",
    type: "EXPENSE",
    category: "Pitch Maintenance",
    description: "Academy Ground Line Marking & Corner Flags",
    amount: 4500,
    method: "CASH",
    reference: "VOUCHER-084",
    date: "2026-10-22",
    status: "CONFIRMED",
  },
];

const DEFAULT_BROADCASTS: BroadcastAlert[] = [
  {
    id: "bc-1",
    channel: "SMS_ALERT",
    recipientGroup: "All Coaches & Team Managers",
    title: "Matchday 2 Pitch Inspection Notice",
    body: "Academy Main Stadium pitch passed safety inspection. All teams must report 45 minutes before kickoff for kit verification.",
    sentAt: "2026-10-22 09:30 EAT",
  },
  {
    id: "bc-2",
    channel: "EMAIL_BROADCAST",
    recipientGroup: "All Board Members & Referees",
    title: "FIFA Rules & Conduct Point Guidelines",
    body: "Please review the updated conduct point rubric for spiritual recitation and sportsmanship bonus tracking before this weekend's matches.",
    sentAt: "2026-10-23 14:15 EAT",
  },
];

export function MasterAdminDashboard({ onExitToViewer }: { onExitToViewer?: () => void }) {
  const { switchRole } = useRoleAccess();
  const [activeSection, setActiveSection] = useState<AdminSection>("board_members");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Teams & Clubs state
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number>(6);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<AdminTeam | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamShortCode, setNewTeamShortCode] = useState("");
  const [newTeamColor, setNewTeamColor] = useState("#00f0ff");
  const [newTeamPitch, setNewTeamPitch] = useState("");
  const [newTeamCoach, setNewTeamCoach] = useState("");
  const [newTeamAsstCoach, setNewTeamAsstCoach] = useState("");
  const [newTeamCaptain, setNewTeamCaptain] = useState("");
  const [newTeamParish, setNewTeamParish] = useState("");

  // Squad Player Modal State
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [editingPlayerIndex, setEditingPlayerIndex] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] = useState<number>(10);
  const [playerPosition, setPlayerPosition] = useState("MID");
  const [playerAdmission, setPlayerAdmission] = useState("");
  const [playerPhoto, setPlayerPhoto] = useState("");
  const [playerEmergencyPhone, setPlayerEmergencyPhone] = useState("");
  const [playerMedical, setPlayerMedical] = useState("None reported");
  const [playerDocVerified, setPlayerDocVerified] = useState(true);

  // Player Transfer State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferPlayerName, setTransferPlayerName] = useState("");
  const [transferFromTeamId, setTransferFromTeamId] = useState<number>(6);
  const [transferToTeamId, setTransferToTeamId] = useState<number>(1);

  // Fixtures State
  const [fixtures, setFixtures] = useState<AdminFixture[]>([]);
  const [showAddFixtureModal, setShowAddFixtureModal] = useState(false);
  const [newFixMatchweek, setNewFixMatchweek] = useState<number>(1);
  const [newFixHomeId, setNewFixHomeId] = useState<number>(1);
  const [newFixAwayId, setNewFixAwayId] = useState<number>(7);
  const [newFixDate, setNewFixDate] = useState("Sunday, Oct 25, 2026");
  const [newFixTime, setNewFixTime] = useState("3:00 PM");
  const [newFixVenue, setNewFixVenue] = useState("Academy Main Stadium Ground");
  const [newFixReferee, setNewFixReferee] = useState("Ian Muli (FIFA Badge)");
  const [newFixChaplain, setNewFixChaplain] = useState("Pastor David M.");

  // Score Certification State
  const [certifyingFixture, setCertifyingFixture] = useState<AdminFixture | null>(null);
  const [certHomeScore, setCertHomeScore] = useState<number>(0);
  const [certAwayScore, setCertAwayScore] = useState<number>(0);
  const [certStatus, setCertStatus] = useState<
    "SCHEDULED" | "LIVE" | "COMPLETED" | "POSTPONED" | "CANCELLED"
  >("COMPLETED");
  const [certScorers, setCertScorers] = useState("");
  const [certSpiritualHome, setCertSpiritualHome] = useState<number>(1);
  const [certSpiritualAway, setCertSpiritualAway] = useState<number>(1);
  const [certConductNotes, setCertConductNotes] = useState(
    "Fair play maintained. Scripture recitation conducted.",
  );

  // Standings State
  const [standings, setStandings] = useState<TeamStanding[]>(DEFAULT_STANDINGS);
  const [editingStanding, setEditingStanding] = useState<TeamStanding | null>(null);

  // Player Stats State
  const [playerStats, setPlayerStats] = useState<AdminPlayerStat[]>([]);
  const [editingStat, setEditingStat] = useState<AdminPlayerStat | null>(null);
  const [showAddStatModal, setShowAddStatModal] = useState(false);
  const [newStatName, setNewStatName] = useState("");
  const [newStatTeam, setNewStatTeam] = useState("");
  const [newStatGoals, setNewStatGoals] = useState(0);
  const [newStatAssists, setNewStatAssists] = useState(0);
  const [newStatMatches, setNewStatMatches] = useState(1);
  const [newStatCleanSheets, setNewStatCleanSheets] = useState(0);
  const [newStatYellow, setNewStatYellow] = useState(0);
  const [newStatRed, setNewStatRed] = useState(0);
  const [newStatRating, setNewStatRating] = useState(7.5);
  const [newStatMvp, setNewStatMvp] = useState(0);

  // Anthem Studio State
  const [anthem, setAnthem] = useState<AnthemSettings>(DEFAULT_ANTHEM_SETTINGS);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Seasons State
  const [seasons, setSeasons] = useState<LeagueSeason[]>(DEFAULT_SEASONS);
  const [showAddSeasonModal, setShowAddSeasonModal] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [newSeasonYear, setNewSeasonYear] = useState(2026);
  const [newSeasonDivision, setNewSeasonDivision] = useState("Youth Premier Division");
  const [newSeasonRules, setNewSeasonRules] = useState("FIFA Standard with Fair Play bonus.");
  const [newSeasonVerses, setNewSeasonVerses] = useState("1 Cor 9:24-27 — Run to win the prize.");

  // Finances State
  const [finances, setFinances] = useState<FinancialRecord[]>(DEFAULT_FINANCES);
  const [showAddFinanceModal, setShowAddFinanceModal] = useState(false);
  const [finType, setFinType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [finCategory, setFinCategory] = useState("Team Registration");
  const [finDesc, setFinDesc] = useState("");
  const [finAmount, setFinAmount] = useState(5000);
  const [finMethod, setFinMethod] = useState<"MPESA" | "CASH" | "BANK_TRANSFER">("MPESA");
  const [finRef, setFinRef] = useState("");

  // Broadcasts State
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>(DEFAULT_BROADCASTS);
  const [showSendBroadcastModal, setShowSendBroadcastModal] = useState(false);
  const [bcChannel, setBcChannel] = useState<"SMS_ALERT" | "EMAIL_BROADCAST" | "PORTAL_NOTICE">(
    "SMS_ALERT",
  );
  const [bcRecipient, setBcRecipient] = useState("All Coaches & Team Managers");
  const [bcTitle, setBcTitle] = useState("");
  const [bcBody, setBcBody] = useState("");

  // Voting Center State
  const [votingMatchId, setVotingMatchId] = useState<number>(1);
  const [votingDeadline, setVotingDeadline] = useState<string>("Sunday, Oct 25, 2026 at 23:59 EAT");
  const [votedEmailsCount, setVotedEmailsCount] = useState<number>(0);

  // Direct Photo Upload State
  const [selectedPhotoTeamId, setSelectedPhotoTeamId] = useState<number>(6);
  const [selectedPhotoPlayer, setSelectedPhotoPlayer] = useState<string>("Jaycrack");
  const [photoPreview, setPhotoPreview] = useState<string>("");

  // Decrees State
  const [decrees, setDecrees] = useState<
    Array<{ id: string; title: string; category: string; content: string; date: string }>
  >([
    {
      id: "dec-1",
      title: "Supreme Directive No. 01: Official 15-Player Squad Cap Enacted",
      category: "Executive Governance",
      content:
        "All 4 official Sunday League clubs are strictly bound to a 15-player squad limit. All student admission numbers and identity credentials must be certified before kickoff.",
      date: "2026-10-20",
    },
    {
      id: "dec-2",
      title: "Council Resolution No. 04: Spiritual Conduct Bonus Point System",
      category: "Spiritual & Conduct Oversight",
      content:
        "Each matchday awards up to +1 conduct point for scripture recitation attendance and +1 fair-play bonus point for teams with zero red cards and sporting conduct.",
      date: "2026-10-22",
    },
  ]);
  const [newDecreeTitle, setNewDecreeTitle] = useState("");
  const [newDecreeCategory, setNewDecreeCategory] = useState("Executive Governance");
  const [newDecreeContent, setNewDecreeContent] = useState("");

  // Global Athlete Search State
  const [globalPlayerSearch, setGlobalPlayerSearch] = useState("");

  // System Audit Log State
  const [auditLog, setAuditLog] = useState<
    Array<{ id: string; action: string; timestamp: string; operator: string }>
  >([
    {
      id: "log-1",
      action: "System Initialized & Security Hardened",
      timestamp: "Today, 08:30 EAT",
      operator: "msl-27 (Super Admin)",
    },
    {
      id: "log-2",
      action: "Council Board Registry Verified",
      timestamp: "Today, 09:15 EAT",
      operator: "msl-27 (Super Admin)",
    },
    {
      id: "log-3",
      action: "15-Player Squad Cap Audit Complete",
      timestamp: "Today, 10:00 EAT",
      operator: "Cheryl Cosmas (Registrar)",
    },
    {
      id: "log-4",
      action: "Stadium Anthem Preset Synchronized",
      timestamp: "Today, 10:45 EAT",
      operator: "Trady Lewis (Tech Manager)",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // Data Synchronizers
  // -------------------------------------------------------------
  const loadAllData = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      // 1. Teams
      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const nonDeleted = parsed.filter((t: AdminTeam) => !isTeamDeleted(t.id, t.name));
          setTeams(nonDeleted.length > 0 ? nonDeleted : (DEFAULT_TEAMS as AdminTeam[]));
        } else {
          setTeams(DEFAULT_TEAMS as AdminTeam[]);
        }
      } else {
        setTeams(DEFAULT_TEAMS as AdminTeam[]);
      }

      // 2. Fixtures
      const storedMatches = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedMatches) {
        const parsed = JSON.parse(storedMatches);
        setFixtures(
          Array.isArray(parsed) && parsed.length > 0
            ? parsed
            : (DEFAULT_FIXTURES as AdminFixture[]),
        );
      } else {
        setFixtures(DEFAULT_FIXTURES as AdminFixture[]);
      }

      // 3. Standings
      const storedStandings = localStorage.getItem("mpesa_pes_standings_v6");
      let rawStandings: TeamStanding[] = DEFAULT_STANDINGS;
      if (storedStandings) {
        const parsed = JSON.parse(storedStandings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rawStandings = parsed;
        }
      }
      const normalizedStandings = rawStandings.map((st: TeamStanding, idx) => {
        const gf = Number(st.gf) || 0;
        const ga = Number(st.ga) || 0;
        const gd = typeof st.gd === "number" && !isNaN(st.gd) ? st.gd : gf - ga;
        const pts = Number(st.points ?? st.pts) || 0;
        const mp = Number(st.played ?? st.mp) || 0;
        const w = Number(st.won ?? st.w) || 0;
        const d = Number(st.drawn ?? st.d) || 0;
        const l = Number(st.lost ?? st.l) || 0;
        return {
          ...st,
          id: st.id ?? idx + 1,
          name: st.name || `Club #${idx + 1}`,
          played: mp,
          mp,
          won: w,
          w,
          drawn: d,
          d,
          lost: l,
          l,
          gf,
          ga,
          gd,
          points: pts,
          pts,
        };
      });
      setStandings(normalizedStandings);

      // 4. Anthem
      const storedAnthem = localStorage.getItem("mpesa_pes_anthem_v3");
      if (storedAnthem) {
        const parsed = JSON.parse(storedAnthem);
        setAnthem({
          title: parsed.title || DEFAULT_ANTHEM_SETTINGS.title,
          artist: parsed.artist || DEFAULT_ANTHEM_SETTINGS.artist,
          youtubeId: parsed.youtubeId || DEFAULT_ANTHEM_SETTINGS.youtubeId,
          volume:
            typeof parsed.volume === "number" ? parsed.volume : DEFAULT_ANTHEM_SETTINGS.volume,
          mode: parsed.mode || DEFAULT_ANTHEM_SETTINGS.mode,
          autoPlay: typeof parsed.autoPlay === "boolean" ? parsed.autoPlay : true,
          loop: typeof parsed.loop === "boolean" ? parsed.loop : true,
        });
      }

      // 5. Player Stats
      const storedStats = localStorage.getItem("mpesa_pes_stats_v6");
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlayerStats(parsed);
        } else {
          initDefaultPlayerStats();
        }
      } else {
        initDefaultPlayerStats();
      }

      // 6. Voting count
      const storedVotes = localStorage.getItem("mpesa_pes_voted_emails_v2");
      if (storedVotes) {
        const parsed = JSON.parse(storedVotes);
        setVotedEmailsCount(Array.isArray(parsed) ? parsed.length : 0);
      }

      // 7. Decrees
      const storedDecrees = localStorage.getItem("mpesa_pes_decrees_v2");
      if (storedDecrees) {
        const parsed = JSON.parse(storedDecrees);
        if (Array.isArray(parsed) && parsed.length > 0) setDecrees(parsed);
      }

      // 8. Seasons
      const storedSeasons = localStorage.getItem("mpesa_pes_seasons_v2");
      if (storedSeasons) {
        const parsed = JSON.parse(storedSeasons);
        if (Array.isArray(parsed) && parsed.length > 0) setSeasons(parsed);
      }

      // 9. Finances
      const storedFin = localStorage.getItem("mpesa_pes_finances_v2");
      if (storedFin) {
        const parsed = JSON.parse(storedFin);
        if (Array.isArray(parsed) && parsed.length > 0) setFinances(parsed);
      }

      // 10. Broadcasts
      const storedBc = localStorage.getItem("mpesa_pes_broadcasts_v2");
      if (storedBc) {
        const parsed = JSON.parse(storedBc);
        if (Array.isArray(parsed) && parsed.length > 0) setBroadcasts(parsed);
      }
    } catch {
      // Ignore
    }
  }, []);

  const initDefaultPlayerStats = () => {
    const defaults: AdminPlayerStat[] = [
      {
        id: "stat-1",
        name: "Jaycrack",
        team: "Thunder FC",
        teamId: 6,
        goals: 5,
        assists: 3,
        matchesPlayed: 4,
        cleanSheets: 0,
        yellowCards: 1,
        redCards: 0,
        rating: 8.9,
        mvpAwards: 2,
        photoUrl: "",
      },
      {
        id: "stat-2",
        name: "Kelvin Mutua",
        team: "Phoenix FC",
        teamId: 1,
        goals: 4,
        assists: 2,
        matchesPlayed: 4,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 8.4,
        mvpAwards: 1,
        photoUrl: "",
      },
      {
        id: "stat-3",
        name: "Brian Ochieng",
        team: "Royal Rangers",
        teamId: 7,
        goals: 3,
        assists: 4,
        matchesPlayed: 4,
        cleanSheets: 1,
        yellowCards: 2,
        redCards: 0,
        rating: 8.1,
        mvpAwards: 1,
        photoUrl: "",
      },
      {
        id: "stat-4",
        name: "Daniel Mwangi",
        team: "Victory Stars",
        teamId: 8,
        goals: 2,
        assists: 2,
        matchesPlayed: 4,
        cleanSheets: 2,
        yellowCards: 0,
        redCards: 0,
        rating: 7.9,
        mvpAwards: 0,
        photoUrl: "",
      },
    ];
    setPlayerStats(defaults);
    localStorage.setItem("mpesa_pes_stats_v6", JSON.stringify(defaults));
  };

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Save helpers
  const saveTeams = (newTeams: AdminTeam[]) => {
    setTeams(newTeams);
    localStorage.setItem("mpesa_pes_teams_v6", JSON.stringify(newTeams));
    window.dispatchEvent(new Event("storage"));
  };

  const saveFixtures = (newFix: AdminFixture[]) => {
    setFixtures(newFix);
    localStorage.setItem("mpesa_pes_matches_v6", JSON.stringify(newFix));
    window.dispatchEvent(new Event("storage"));
  };

  const saveStandings = (newStandings: TeamStanding[]) => {
    setStandings(newStandings);
    localStorage.setItem("mpesa_pes_standings_v6", JSON.stringify(newStandings));
    window.dispatchEvent(new Event("storage"));
  };

  const saveAnthemSettings = (newAnthem: AnthemSettings) => {
    setAnthem(newAnthem);
    localStorage.setItem("mpesa_pes_anthem_v3", JSON.stringify(newAnthem));
    window.dispatchEvent(new Event("storage"));
    showToast("✓ Stadium Soundtrack and Auto-Play preferences saved!");
  };

  const savePlayerStats = (newStats: AdminPlayerStat[]) => {
    setPlayerStats(newStats);
    localStorage.setItem("mpesa_pes_stats_v6", JSON.stringify(newStats));
    window.dispatchEvent(new Event("storage"));
  };

  const saveFinances = (newFin: FinancialRecord[]) => {
    setFinances(newFin);
    localStorage.setItem("mpesa_pes_finances_v2", JSON.stringify(newFin));
  };

  const saveSeasons = (newSeas: LeagueSeason[]) => {
    setSeasons(newSeas);
    localStorage.setItem("mpesa_pes_seasons_v2", JSON.stringify(newSeas));
  };

  const saveBroadcasts = (newBc: BroadcastAlert[]) => {
    setBroadcasts(newBc);
    localStorage.setItem("mpesa_pes_broadcasts_v2", JSON.stringify(newBc));
  };

  // -------------------------------------------------------------
  // Team & Squad Handlers
  // -------------------------------------------------------------
  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newId = teams.length > 0 ? Math.max(...teams.map((t) => t.id)) + 1 : 1;
    const createdTeam: AdminTeam = {
      id: newId,
      name: newTeamName.trim(),
      shortCode: newTeamShortCode.trim().toUpperCase() || newTeamName.slice(0, 3).toUpperCase(),
      color: newTeamColor,
      homePitch: newTeamPitch.trim() || "Sunday Arena Grounds",
      parishOrMinistry: newTeamParish.trim() || "Youth Outreach Ministry",
      coach: { name: newTeamCoach.trim() || "Head Coach" },
      assistantCoach: newTeamAsstCoach.trim() || "Assistant Coach",
      captain: newTeamCaptain.trim() || "Captain",
      squad: [],
    };

    const updatedTeams = [...teams, createdTeam];
    saveTeams(updatedTeams);

    // Also append to standings
    const newStanding: TeamStanding = {
      id: newId,
      name: createdTeam.name,
      shortCode: createdTeam.shortCode || "NEW",
      color: createdTeam.color || "#00f0ff",
      homePitch: createdTeam.homePitch || "Home Pitch",
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      coach: { name: createdTeam.coach?.name || "Coach", role: "Head Coach" },
      squad: [],
    };
    saveStandings([...standings, newStanding]);

    setShowAddTeamModal(false);
    setSelectedTeamId(newId);
    setNewTeamName("");
    setNewTeamShortCode("");
    setNewTeamPitch("");
    setNewTeamCoach("");
    setNewTeamAsstCoach("");
    setNewTeamCaptain("");
    setNewTeamParish("");
    showToast(`✓ Club "${createdTeam.name}" registered into league!`);
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    const updatedTeams = teams.map((t) => (t.id === editingTeam.id ? editingTeam : t));
    saveTeams(updatedTeams);

    // Synchronize standings
    const updatedStandings = standings.map((st) => {
      if (st.id === editingTeam.id) {
        return {
          ...st,
          name: editingTeam.name,
          shortCode: editingTeam.shortCode || st.shortCode,
          color: editingTeam.color || st.color,
          homePitch: editingTeam.homePitch || st.homePitch,
        };
      }
      return st;
    });
    saveStandings(updatedStandings);

    setEditingTeam(null);
    showToast(`✓ Updated profile for ${editingTeam.name}`);
  };

  const handleDeleteTeam = (teamId: number, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${name}" and all associated squad records?`,
      )
    ) {
      const updatedTeams = teams.filter((t) => t.id !== teamId);
      saveTeams(updatedTeams);

      const updatedStandings = standings.filter((st) => st.id !== teamId);
      saveStandings(updatedStandings);

      if (selectedTeamId === teamId && updatedTeams.length > 0) {
        setSelectedTeamId(updatedTeams[0].id);
      }
      showToast(`✓ Club "${name}" deleted permanently.`);
    }
  };

  const handleSaveSquadPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTeam = teams.find((t) => t.id === selectedTeamId);
    if (!targetTeam) return;

    const currentSquad = [...(targetTeam.squad || [])];
    const playerRecord: AdminSquadPlayer = {
      name: playerName.trim(),
      number: Number(playerNumber) || 10,
      position: playerPosition,
      admissionNumber: playerAdmission.trim(),
      photoUrl: playerPhoto.trim() || undefined,
      emergencyPhone: playerEmergencyPhone.trim(),
      medicalNotes: playerMedical.trim(),
      documentsVerified: playerDocVerified,
    };

    if (editingPlayerIndex !== null) {
      currentSquad[editingPlayerIndex] = playerRecord;
    } else {
      if (currentSquad.length >= 15) {
        if (
          !window.confirm(
            "Notice: This club is at or exceeding the 15-player squad limit. Proceed?",
          )
        ) {
          return;
        }
      }
      currentSquad.push(playerRecord);
    }

    const updatedTeams = teams.map((t) =>
      t.id === selectedTeamId ? { ...t, squad: currentSquad } : t,
    );
    saveTeams(updatedTeams);
    setShowAddPlayerModal(false);
    setEditingPlayerIndex(null);
    setPlayerName("");
    setPlayerAdmission("");
    setPlayerPhoto("");
    setPlayerEmergencyPhone("");
    setPlayerMedical("None reported");
    showToast(`✓ Squad member saved for ${targetTeam.name}`);
  };

  const handleDeleteSquadPlayer = (teamId: number, playerIdx: number, pName: string) => {
    if (window.confirm(`Delete ${pName} from squad roster?`)) {
      const updated = teams.map((t) => {
        if (t.id === teamId) {
          const sq = [...(t.squad || [])];
          sq.splice(playerIdx, 1);
          return { ...t, squad: sq };
        }
        return t;
      });
      saveTeams(updated);
      showToast(`✓ Removed ${pName} from squad.`);
    }
  };

  const handleTransferPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferPlayerName || transferFromTeamId === transferToTeamId) {
      showToast("Select different source and destination clubs.");
      return;
    }

    const sourceTeam = teams.find((t) => t.id === transferFromTeamId);
    const destTeam = teams.find((t) => t.id === transferToTeamId);
    if (!sourceTeam || !destTeam) return;

    const player = (sourceTeam.squad || []).find((p) => p.name === transferPlayerName);
    if (!player) {
      showToast(`Player ${transferPlayerName} not found in source club.`);
      return;
    }

    const updatedSourceSquad = (sourceTeam.squad || []).filter(
      (p) => p.name !== transferPlayerName,
    );
    const updatedDestSquad = [...(destTeam.squad || []), player];

    const updatedTeams = teams.map((t) => {
      if (t.id === transferFromTeamId) return { ...t, squad: updatedSourceSquad };
      if (t.id === transferToTeamId) return { ...t, squad: updatedDestSquad };
      return t;
    });

    saveTeams(updatedTeams);
    setShowTransferModal(false);
    showToast(`✓ Transferred ${transferPlayerName} from ${sourceTeam.name} to ${destTeam.name}!`);
  };

  // -------------------------------------------------------------
  // Fixtures & Match Scoring Handlers
  // -------------------------------------------------------------
  const handleAddFixture = (e: React.FormEvent) => {
    e.preventDefault();
    const newFix: AdminFixture = {
      id: Date.now(),
      matchweek: Number(newFixMatchweek),
      homeId: Number(newFixHomeId),
      awayId: Number(newFixAwayId),
      date: newFixDate,
      time: newFixTime,
      venue: newFixVenue,
      referee: newFixReferee,
      chaplain: newFixChaplain,
      status: "SCHEDULED",
    };
    const updated = [newFix, ...fixtures];
    saveFixtures(updated);
    setShowAddFixtureModal(false);
    showToast(`✓ Scheduled Matchweek ${newFix.matchweek} fixture!`);
  };

  const handleDeleteFixture = (id: number) => {
    if (window.confirm("Permanently delete this fixture?")) {
      const updated = fixtures.filter((f) => f.id !== id);
      saveFixtures(updated);
      showToast("✓ Fixture deleted.");
    }
  };

  const handleGenerateRoundRobin = () => {
    if (teams.length < 2) {
      showToast("⚠ Need at least 2 registered clubs to generate round-robin fixtures.");
      return;
    }
    const teamIds = teams.map((t) => t.id);
    const generated: AdminFixture[] = [];
    let fixIdCounter = Date.now();
    let mw = 1;

    const venues = [
      "M-Pesa Foundation Main Arena (Pitch A)",
      "Kibiko Youth Stadium (Pitch B)",
      "St. Paul's Sports Ground",
      "Cornerstone Arena (Pitch 1)",
    ];
    const referees = [
      "Mitchelle Muthoni (National Ref)",
      "Kevin Ombati (Senior Official)",
      "Sarah Wanjiku (Youth Official)",
      "David Kibet (FIFA Accredited)",
    ];
    const chaplains = [
      "Pastor Daniel Omondi",
      "Rev. Grace Njeri",
      "Elder Peter Kamau",
      "Chaplain Joseph",
    ];

    for (let i = 0; i < teamIds.length; i++) {
      for (let j = 0; j < teamIds.length; j++) {
        if (i !== j) {
          generated.push({
            id: fixIdCounter++,
            matchweek: mw,
            homeId: teamIds[i],
            awayId: teamIds[j],
            date: `2026-11-${String(((mw * 4) % 28) + 1).padStart(2, "0")}`,
            time: `${14 + (generated.length % 3)}:00`,
            venue: venues[generated.length % venues.length],
            referee: referees[generated.length % referees.length],
            chaplain: chaplains[generated.length % chaplains.length],
            status: "SCHEDULED",
            homeScore: 0,
            awayScore: 0,
            spiritualBonusHome: 1,
            spiritualBonusAway: 1,
          });
          if (generated.length % 2 === 0) mw++;
        }
      }
    }

    const updated = [...generated, ...fixtures];
    saveFixtures(updated);
    setAuditLog((prev) => [
      {
        id: `log-${Date.now()}`,
        action: `Generated ${generated.length} Round-Robin fixtures across ${mw} matchweeks`,
        timestamp: new Date().toLocaleTimeString(),
        operator: "msl-27 (Super Admin)",
      },
      ...prev,
    ]);
    showToast(`✓ Generated ${generated.length} balanced round-robin fixtures!`);
  };

  const exportSystemBackup = () => {
    const backupData = {
      version: "2026.1",
      exportedAt: new Date().toISOString(),
      teams,
      fixtures,
      standings,
      playerStats,
      finances,
      seasons,
      broadcasts,
      anthem,
      decrees,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpesa-sunday-league-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Full League Database exported to JSON!");
  };

  const exportStandingsCSV = () => {
    let csv = "Rank,Club,Played,Won,Drawn,Lost,GF,GA,GD,Points\n";
    standings.forEach((st, idx) => {
      csv += `${idx + 1},"${st.name}",${st.played},${st.won},${st.drawn},${st.lost},${st.gf},${st.ga},${st.gd},${st.points}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpesa-league-standings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Official League Standings exported to CSV!");
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.teams) saveTeams(parsed.teams);
        if (parsed.fixtures) saveFixtures(parsed.fixtures);
        if (parsed.standings) saveStandings(parsed.standings);
        if (parsed.playerStats) savePlayerStats(parsed.playerStats);
        if (parsed.finances) saveFinances(parsed.finances);
        if (parsed.seasons) saveSeasons(parsed.seasons);
        if (parsed.broadcasts) saveBroadcasts(parsed.broadcasts);
        if (parsed.anthem) saveAnthemSettings(parsed.anthem);
        showToast("✓ System database successfully restored!");
      } catch {
        showToast("⚠ Failed to restore: Invalid JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleCertifyScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certifyingFixture) return;

    const updatedFixtures = fixtures.map((f) =>
      f.id === certifyingFixture.id
        ? {
            ...f,
            homeScore: Number(certHomeScore),
            awayScore: Number(certAwayScore),
            status: certStatus,
            scorers: certScorers.trim(),
            spiritualBonusHome: Number(certSpiritualHome),
            spiritualBonusAway: Number(certSpiritualAway),
            conductNotes: certConductNotes.trim(),
          }
        : f,
    );
    saveFixtures(updatedFixtures);

    // Auto-update standings table when match is completed
    if (certStatus === "COMPLETED") {
      updateStandingsFromMatch(
        certifyingFixture.homeId,
        certifyingFixture.awayId,
        Number(certHomeScore),
        Number(certAwayScore),
        Number(certSpiritualHome),
        Number(certSpiritualAway),
      );
    }

    setCertifyingFixture(null);
    showToast(`✓ Match scorecard certified: ${certHomeScore} - ${certAwayScore}`);
  };

  const updateStandingsFromMatch = (
    homeId: number,
    awayId: number,
    homeScore: number,
    awayScore: number,
    spiritualBonusHome = 0,
    spiritualBonusAway = 0,
  ) => {
    const updated = standings.map((st: TeamStanding) => {
      const curPlayed = Number(st.played ?? st.mp) || 0;
      const curWon = Number(st.won ?? st.w) || 0;
      const curDrawn = Number(st.drawn ?? st.d) || 0;
      const curLost = Number(st.lost ?? st.l) || 0;
      const curGf = Number(st.gf) || 0;
      const curGa = Number(st.ga) || 0;
      const curPoints = Number(st.points ?? st.pts) || 0;

      if (st.id === homeId) {
        const won = homeScore > awayScore;
        const drawn = homeScore === awayScore;
        const lost = homeScore < awayScore;
        const matchPoints = won ? 3 : drawn ? 1 : 0;
        const newPlayed = curPlayed + 1;
        const newWon = curWon + (won ? 1 : 0);
        const newDrawn = curDrawn + (drawn ? 1 : 0);
        const newLost = curLost + (lost ? 1 : 0);
        const newGf = curGf + homeScore;
        const newGa = curGa + awayScore;
        const newGd = newGf - newGa;
        const newPoints = curPoints + matchPoints + spiritualBonusHome;

        return {
          ...st,
          played: newPlayed,
          mp: newPlayed,
          won: newWon,
          w: newWon,
          drawn: newDrawn,
          d: newDrawn,
          lost: newLost,
          l: newLost,
          gf: newGf,
          ga: newGa,
          gd: newGd,
          points: newPoints,
          pts: newPoints,
        };
      }
      if (st.id === awayId) {
        const won = awayScore > homeScore;
        const drawn = homeScore === awayScore;
        const lost = awayScore < homeScore;
        const matchPoints = won ? 3 : drawn ? 1 : 0;
        const newPlayed = curPlayed + 1;
        const newWon = curWon + (won ? 1 : 0);
        const newDrawn = curDrawn + (drawn ? 1 : 0);
        const newLost = curLost + (lost ? 1 : 0);
        const newGf = curGf + awayScore;
        const newGa = curGa + homeScore;
        const newGd = newGf - newGa;
        const newPoints = curPoints + matchPoints + spiritualBonusAway;

        return {
          ...st,
          played: newPlayed,
          mp: newPlayed,
          won: newWon,
          w: newWon,
          drawn: newDrawn,
          d: newDrawn,
          lost: newLost,
          l: newLost,
          gf: newGf,
          ga: newGa,
          gd: newGd,
          points: newPoints,
          pts: newPoints,
        };
      }
      return {
        ...st,
        played: curPlayed,
        mp: curPlayed,
        won: curWon,
        w: curWon,
        drawn: curDrawn,
        d: curDrawn,
        lost: curLost,
        l: curLost,
        gf: curGf,
        ga: curGa,
        gd: typeof st.gd === "number" && !isNaN(st.gd) ? st.gd : curGf - curGa,
        points: curPoints,
        pts: curPoints,
      };
    });

    updated.sort(
      (a, b) =>
        (b.points || 0) - (a.points || 0) || (b.gd || 0) - (a.gd || 0) || (b.gf || 0) - (a.gf || 0),
    );
    saveStandings(updated);
  };

  // -------------------------------------------------------------
  // YouTube Anthem Helpers
  // -------------------------------------------------------------
  const parseYouTubeId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (trimmed.length === 11 && !trimmed.includes("/")) return trimmed;
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    );
    return match ? match[1] : trimmed;
  };

  // -------------------------------------------------------------
  // Photo & Media Helpers
  // -------------------------------------------------------------
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setPhotoPreview(res);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhotoDirectly = () => {
    if (!photoPreview) {
      showToast("Please choose a photo image first.");
      return;
    }
    const updated = teams.map((t) => {
      if (t.id === Number(selectedPhotoTeamId)) {
        const updatedSquad = (t.squad || []).map((p) => {
          if (p.name === selectedPhotoPlayer) {
            return { ...p, photoUrl: photoPreview };
          }
          return p;
        });
        return { ...t, squad: updatedSquad };
      }
      return t;
    });
    saveTeams(updated);

    const updatedStats = playerStats.map((s) => {
      if (s.name === selectedPhotoPlayer) {
        return { ...s, photoUrl: photoPreview };
      }
      return s;
    });
    savePlayerStats(updatedStats);

    showToast(`✓ Official portrait saved for ${selectedPhotoPlayer}!`);
    setPhotoPreview("");
  };

  // -------------------------------------------------------------
  // Decrees & Directives
  // -------------------------------------------------------------
  const handleIssueDecree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecreeTitle.trim() || !newDecreeContent.trim()) return;
    const created = {
      id: `dec-${Date.now()}`,
      title: newDecreeTitle.trim(),
      category: newDecreeCategory,
      content: newDecreeContent.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [created, ...decrees];
    setDecrees(updated);
    localStorage.setItem("mpesa_pes_decrees_v2", JSON.stringify(updated));
    setNewDecreeTitle("");
    setNewDecreeContent("");
    showToast(`✓ Issued: "${created.title}"`);
  };

  // -------------------------------------------------------------
  // Seasons & Leagues Handlers
  // -------------------------------------------------------------
  const handleAddSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeasonName.trim()) return;
    const newSeas: LeagueSeason = {
      id: `season-${Date.now()}`,
      name: newSeasonName.trim(),
      year: Number(newSeasonYear),
      status: "ACTIVE",
      division: newSeasonDivision,
      rulebookExcerpt: newSeasonRules.trim(),
      bibleVerseCurriculum: newSeasonVerses.trim(),
    };
    const updated = [newSeas, ...seasons];
    saveSeasons(updated);
    setShowAddSeasonModal(false);
    setNewSeasonName("");
    showToast(`✓ New season & curriculum configured: ${newSeas.name}`);
  };

  // -------------------------------------------------------------
  // Finances Handlers
  // -------------------------------------------------------------
  const handleAddFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finDesc.trim() || finAmount <= 0) return;
    const newRecord: FinancialRecord = {
      id: `fin-${Date.now()}`,
      type: finType,
      category: finCategory,
      description: finDesc.trim(),
      amount: Number(finAmount),
      method: finMethod,
      reference: finRef.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "CONFIRMED",
    };
    const updated = [newRecord, ...finances];
    saveFinances(updated);
    setShowAddFinanceModal(false);
    setFinDesc("");
    setFinRef("");
    showToast(
      `✓ Recorded ${finType === "INCOME" ? "Receipt" : "Expense"}: KES ${newRecord.amount.toLocaleString()}`,
    );
  };

  // -------------------------------------------------------------
  // Broadcasts Handlers
  // -------------------------------------------------------------
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcBody.trim()) return;
    const newBc: BroadcastAlert = {
      id: `bc-${Date.now()}`,
      channel: bcChannel,
      recipientGroup: bcRecipient,
      title: bcTitle.trim(),
      body: bcBody.trim(),
      sentAt: `${new Date().toISOString().split("T")[0]} ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} EAT`,
    };
    const updated = [newBc, ...broadcasts];
    saveBroadcasts(updated);
    setShowSendBroadcastModal(false);
    setBcTitle("");
    setBcBody("");
    showToast(`✓ Broadcast dispatched via ${bcChannel.replace("_", " ")}!`);
  };

  const selectedTeamData = teams.find((t) => t.id === selectedTeamId) || teams[0];

  // Financial KPI totals
  const totalIncome = finances
    .filter((f) => f.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finances
    .filter((f) => f.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-yellow-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Super Admin Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-[#160f33] to-[#080517] border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-400/20 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/25 shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Master Super Admin Nexus • Supreme League Control
                </span>
              </div>
              <h2 className="font-header text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-0.5">
                M-Pesa Sunday League Supreme Council Command Center
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onExitToViewer && (
              <button
                type="button"
                onClick={onExitToViewer}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <span>View Public Spectator Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                switchRole("GUEST");
                if (onExitToViewer) onExitToViewer();
              }}
              className="px-4 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Logout Admin</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          <div className="bg-[#0e0924] p-3 rounded-2xl border border-amber-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Clubs</span>
            <div className="text-lg font-black text-white font-mono">{teams.length} Active</div>
          </div>
          <div className="bg-[#0e0924] p-3 rounded-2xl border border-cyan-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Fixtures</span>
            <div className="text-lg font-black text-cyan-300 font-mono">
              {fixtures.length} Total
            </div>
          </div>
          <div className="bg-[#0e0924] p-3 rounded-2xl border border-emerald-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Certified</span>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {fixtures.filter((f) => f.status === "COMPLETED").length} Results
            </div>
          </div>
          <div className="bg-[#0e0924] p-3 rounded-2xl border border-emerald-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Treasury</span>
            <div className="text-lg font-black text-emerald-400 font-mono truncate">
              KES {netBalance.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#0e0924] p-3 rounded-2xl border border-purple-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Soundtrack</span>
            <div className="text-lg font-black text-purple-300 font-mono truncate">
              {anthem.autoPlay ? "Auto-Play ON" : "Manual"}
            </div>
          </div>
          <div className="bg-[#0e0924] p-3 rounded-2xl border border-pink-400/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Decrees</span>
            <div className="text-lg font-black text-pink-300 font-mono">
              {decrees.length} Sealed
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Console Layout: Dedicated Sidebar + Active Feature Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Admin Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-3 sm:p-4 shadow-xl space-y-1">
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider px-3 block mb-2">
              Supreme Admin Hub
            </span>

            {[
              {
                id: "board_members",
                label: "Council Board Members",
                sublabel: "Add, Edit, Suspend & RBAC",
                icon: Users,
                color: "text-amber-400",
              },
              {
                id: "seasons_leagues",
                label: "Seasons & Curriculum",
                sublabel: "Divisions & Bible Verses",
                icon: BookOpen,
                color: "text-indigo-400",
              },
              {
                id: "teams_clubs",
                label: "Clubs & Squad Rosters",
                sublabel: "15-Player Cap & Transfers",
                icon: Shield,
                color: "text-emerald-400",
              },
              {
                id: "fixtures_scores",
                label: "Fixtures & Live Scoring",
                sublabel: "Referees & Conduct Points",
                icon: Calendar,
                color: "text-cyan-400",
              },
              {
                id: "standings_ledger",
                label: "Standings & Points Ledger",
                sublabel: "Tiebreakers & Overrides",
                icon: Trophy,
                color: "text-yellow-400",
              },
              {
                id: "player_stats",
                label: "Golden Boot & Player Stats",
                sublabel: "Goals, Assists & MVP Count",
                icon: Award,
                color: "text-amber-300",
              },
              {
                id: "finances_fees",
                label: "Finances & Fee Tracking",
                sublabel: "MPESA Invoices & Expenses",
                icon: DollarSign,
                color: "text-emerald-400",
              },
              {
                id: "broadcasts_alerts",
                label: "Mass Alerts & Broadcasts",
                sublabel: "Instant SMS & Email Blasts",
                icon: Send,
                color: "text-blue-400",
              },
              {
                id: "anthem_studio",
                label: "Stadium Soundtrack Studio",
                sublabel: "YouTube Songs & Auto-Play",
                icon: Music,
                color: "text-purple-400",
              },
              {
                id: "fan_comments",
                label: "Fan Cheers & Community",
                sublabel: "Moderation, Pinning & Prayers",
                icon: MessageSquare,
                color: "text-emerald-400",
              },
              {
                id: "voting_center",
                label: "MVP Balloting Dispatcher",
                sublabel: "Voting Links & Ballot Tallies",
                icon: Vote,
                color: "text-pink-400",
              },
              {
                id: "media_photos",
                label: "Athlete Photos & Media",
                sublabel: "Direct Upload & Share Links",
                icon: Camera,
                color: "text-blue-400",
              },
              {
                id: "decrees_minutes",
                label: "Decrees & Council Minutes",
                sublabel: "Directives & Formal Minutes",
                icon: FileText,
                color: "text-indigo-400",
              },
              {
                id: "system_backup",
                label: "Database Backup & Audit",
                sublabel: "JSON/CSV Export & Disaster Recovery",
                icon: Database,
                color: "text-emerald-400",
              },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeSection === nav.id;

              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => setActiveSection(nav.id as AdminSection)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition duration-200 cursor-pointer text-left ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-lg shadow-amber-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-black" : nav.color}`} />
                    <div className="min-w-0">
                      <div className="text-xs truncate">{nav.label}</div>
                      <div
                        className={`text-[10px] truncate ${isActive ? "text-black/80 font-bold" : "text-gray-500"}`}
                      >
                        {nav.sublabel}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-black" : "text-gray-500"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* =========================================================
              PANEL 1: BOARD MEMBERS REGISTRY (FULL CRUD + RBAC)
              ========================================================= */}
          {activeSection === "board_members" && (
            <div>
              <BoardMemberManager />
            </div>
          )}

          {/* =========================================================
              PANEL 2: SEASONS & LEAGUE CONFIGURATION
              ========================================================= */}
          {activeSection === "seasons_leagues" && (
            <div className="bg-[#0b0821] border-2 border-indigo-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    Season Setup, Age Divisions & Rulebook Curriculum
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Configure active championship seasons, division categories (U-10, U-15, Youth),
                    and official scripture memory requirements.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddSeasonModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wide transition shadow-lg shadow-indigo-500/20 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Setup New Season</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seasons.map((season, sIdx) => (
                  <div
                    key={season.id || `season-${sIdx}`}
                    className="p-5 bg-[#141029] rounded-2xl border border-[#2e2554] hover:border-indigo-400/40 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold uppercase">
                          {season.year} Season
                        </span>
                        <h4 className="text-sm font-black text-white mt-1">{season.name}</h4>
                        <span className="text-xs text-cyan-300 font-semibold">
                          {season.division}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          season.status === "ACTIVE"
                            ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {season.status}
                      </span>
                    </div>

                    <div className="p-3 bg-[#0a071b] rounded-xl border border-[#261f4d] space-y-1.5 text-xs">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">
                        Official Rulebook & Fair Play Guidelines:
                      </span>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {season.rulebookExcerpt}
                      </p>
                    </div>

                    <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/20 space-y-1.5 text-xs">
                      <span className="text-[10px] text-amber-400 uppercase font-bold block">
                        Spiritual Curriculum & Memory Verse:
                      </span>
                      <p className="text-amber-200 text-xs font-serif italic">
                        {season.bibleVerseCurriculum}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#261f4d] text-xs">
                      <span className="text-[10px] text-gray-500 font-mono">ID: {season.id}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete season ${season.name}?`)) {
                            const updated = seasons.filter((s) => s.id !== season.id);
                            saveSeasons(updated);
                            showToast("✓ Season removed.");
                          }
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 3: TEAMS & CLUBS MASTER MANAGER (CRUD + 15-PLAYER ROSTER CAP + TRANSFERS)
              ========================================================= */}
          {activeSection === "teams_clubs" && (
            <div className="bg-[#0b0821] border-2 border-emerald-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Parish Clubs & Squad Roster Master
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Register parish ministries, enforce strict 15-player limits, audit student
                    admission IDs, and execute player transfers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wide transition border border-cyan-500/30 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Transfer Player</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddTeamModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Club</span>
                  </button>
                </div>
              </div>

              {/* Global Master Athlete Search Input */}
              <div className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-3">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search master athlete database (name, admission #, emergency phone, position)..."
                    value={globalPlayerSearch}
                    onChange={(e) => setGlobalPlayerSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none"
                  />
                  {globalPlayerSearch && (
                    <button
                      type="button"
                      onClick={() => setGlobalPlayerSearch("")}
                      className="text-gray-400 hover:text-white p-1 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Instant Search Results across ALL clubs */}
                {globalPlayerSearch.trim() !== "" && (
                  <div className="pt-2 border-t border-[#261f4d] space-y-2 max-h-60 overflow-y-auto">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Matching Registered Athletes across all clubs:
                    </span>
                    {(() => {
                      const q = globalPlayerSearch.toLowerCase().trim();
                      const matches: Array<{
                        team: AdminTeam;
                        player: AdminSquadPlayer;
                        index: number;
                      }> = [];
                      teams.forEach((t) => {
                        (t.squad || []).forEach((p, idx) => {
                          if (
                            p.name.toLowerCase().includes(q) ||
                            (p.admissionNumber && p.admissionNumber.toLowerCase().includes(q)) ||
                            (p.position && p.position.toLowerCase().includes(q)) ||
                            (p.emergencyPhone && p.emergencyPhone.includes(q))
                          ) {
                            matches.push({ team: t, player: p, index: idx });
                          }
                        });
                      });

                      if (matches.length === 0) {
                        return (
                          <div className="text-xs text-gray-400 italic py-2">
                            No athletes found matching "{globalPlayerSearch}".
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matches.map(({ team: t, player: p, index: idx }) => (
                            <div
                              key={`search-match-${t.id}-${p.name}-${idx}`}
                              className="p-2.5 bg-[#0a071b] border border-[#2e2554] hover:border-emerald-400/40 rounded-xl flex items-center justify-between text-xs"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white truncate">{p.name}</span>
                                  <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-emerald-400/20 text-emerald-300 font-bold">
                                    #{p.number || "—"} {p.position || "MID"}
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                                  <span
                                    style={{ color: t.color || "#00f0ff" }}
                                    className="font-bold"
                                  >
                                    {t.name}
                                  </span>
                                  <span>•</span>
                                  <span>Adm: {p.admissionNumber || "Pending"}</span>
                                  <span>•</span>
                                  <span>{p.emergencyPhone || "No emergency #"}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTeamId(t.id);
                                  setEditingPlayerIndex(idx);
                                  setPlayerName(p.name);
                                  setPlayerNumber(p.number || 10);
                                  setPlayerPosition(p.position || "MID");
                                  setPlayerAdmission(p.admissionNumber || "");
                                  setPlayerPhoto(p.photoUrl || "");
                                  setPlayerEmergencyPhone(p.emergencyPhone || "");
                                  setPlayerMedical(p.medicalNotes || "None reported");
                                  setPlayerDocVerified(p.documentsVerified ?? true);
                                  setShowAddPlayerModal(true);
                                }}
                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold shrink-0 ml-2 cursor-pointer"
                              >
                                Edit Athlete
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Clubs Selection Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {teams.map((t, tIdx) => (
                  <button
                    key={t.id ?? `team-pill-${tIdx}`}
                    onClick={() => setSelectedTeamId(t.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      selectedTeamId === t.id
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-lg shadow-emerald-500/20"
                        : "bg-[#141029] text-gray-300 hover:text-white border border-[#2e2554]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.color || "#00f0ff" }}
                    />
                    <span>{t.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">
                      ({t.squad?.length || 0}/15)
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Club Details Card */}
              {selectedTeamData && (
                <div className="bg-[#141029] border border-[#2e2554] rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-black text-sm shadow"
                        style={{ backgroundColor: selectedTeamData.color || "#00f0ff" }}
                      >
                        {selectedTeamData.shortCode || selectedTeamData.name.slice(0, 3)}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{selectedTeamData.name}</h4>
                        <span className="text-xs text-gray-400">
                          {selectedTeamData.homePitch || "Official Home Ground"} •{" "}
                          {selectedTeamData.parishOrMinistry || "Parish Ministry"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingTeam(selectedTeamData)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Club Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTeam(selectedTeamData.id, selectedTeamData.name)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Club</span>
                      </button>
                    </div>
                  </div>

                  {/* Club Quick Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-[#090615] rounded-xl border border-[#261f4d]">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">
                        Head Coach
                      </span>
                      <span className="font-black text-white truncate block">
                        {selectedTeamData.coach?.name || "Assigned Coach"}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#090615] rounded-xl border border-[#261f4d]">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">
                        Captain
                      </span>
                      <span className="font-black text-amber-300 truncate block">
                        {selectedTeamData.captain || "Team Captain"}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#090615] rounded-xl border border-[#261f4d]">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">
                        Squad Limit Cap
                      </span>
                      <span className="font-black text-emerald-400 block font-mono">
                        {selectedTeamData.squad?.length || 0} / 15 Athletes
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#090615] rounded-xl border border-[#261f4d]">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">
                        Kit Color
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: selectedTeamData.color || "#00f0ff" }}
                        />
                        <span className="font-mono text-gray-300">{selectedTeamData.color}</span>
                      </div>
                    </div>
                  </div>

                  {/* Squad Members Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-black uppercase text-gray-300">
                          Official Certified Squad Roster
                        </h5>
                        <p className="text-[11px] text-gray-500">
                          Maximum 15 players per team. Student admission and emergency details
                          audited.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPlayerIndex(null);
                          setPlayerName("");
                          setPlayerNumber(10);
                          setPlayerPosition("MID");
                          setPlayerAdmission("");
                          setPlayerPhoto("");
                          setPlayerEmergencyPhone("");
                          setPlayerMedical("None reported");
                          setPlayerDocVerified(true);
                          setShowAddPlayerModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Athlete to Squad</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {(selectedTeamData.squad || []).map((p, idx) => (
                        <div
                          key={`${p.name}-${p.number || idx}-${idx}`}
                          className="p-3 bg-[#0a071b] rounded-xl border border-[#2e2554] flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-white/10 text-emerald-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                              #{p.number || idx + 1}
                            </span>
                            <div className="min-w-0">
                              <h6 className="text-xs font-black text-white truncate">{p.name}</h6>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                                <span className="text-cyan-400 font-bold">
                                  {p.position || "MID"}
                                </span>
                                <span>•</span>
                                <span className="truncate">
                                  {p.admissionNumber || "ADM verified"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPlayerIndex(idx);
                                setPlayerName(p.name);
                                setPlayerNumber(p.number || 10);
                                setPlayerPosition(p.position || "MID");
                                setPlayerAdmission(p.admissionNumber || "");
                                setPlayerPhoto(p.photoUrl || "");
                                setPlayerEmergencyPhone(p.emergencyPhone || "");
                                setPlayerMedical(p.medicalNotes || "None reported");
                                setPlayerDocVerified(p.documentsVerified ?? true);
                                setShowAddPlayerModal(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                              title="Edit Athlete"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSquadPlayer(selectedTeamData.id, idx, p.name)
                              }
                              className="p-1.5 text-gray-400 hover:text-rose-400 rounded hover:bg-white/10 cursor-pointer"
                              title="Delete Athlete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              PANEL 4: FIXTURES & LIVE SCORECARD CERTIFIER
              ========================================================= */}
          {activeSection === "fixtures_scores" && (
            <div className="bg-[#0b0821] border-2 border-cyan-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Match Center, Live Scoring & Spiritual Bonus Certification
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Schedule matchweeks, assign referees & chaplains, and certify scores with
                    spiritual conduct bonuses.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateRoundRobin}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-400/30 transition shadow cursor-pointer shrink-0"
                    title="Generate balanced fixtures pairing every active team"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Auto Round-Robin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddFixtureModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Fixture</span>
                  </button>
                </div>
              </div>

              {/* Fixtures List */}
              <div className="space-y-3">
                {fixtures.map((fix, fIdx) => {
                  const homeTeam = teams.find((t) => t.id === fix.homeId);
                  const awayTeam = teams.find((t) => t.id === fix.awayId);

                  return (
                    <div
                      key={fix.id ?? `fix-${fIdx}`}
                      className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] hover:border-cyan-400/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-gray-400">
                          <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold">
                            Matchweek {fix.matchweek}
                          </span>
                          <span>•</span>
                          <span>{fix.date}</span>
                          <span>•</span>
                          <span className="text-white font-bold">{fix.time}</span>
                          <span>•</span>
                          <span>{fix.venue}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white">
                            {homeTeam?.name || `Team #${fix.homeId}`}
                          </span>
                          <span className="px-2.5 py-1 rounded-xl bg-[#090615] font-mono font-black text-xs text-amber-300 border border-[#261f4d]">
                            {fix.status === "COMPLETED"
                              ? `${fix.homeScore ?? 0} - ${fix.awayScore ?? 0}`
                              : fix.status || "VS"}
                          </span>
                          <span className="text-sm font-black text-white">
                            {awayTeam?.name || `Team #${fix.awayId}`}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 font-mono">
                          {fix.referee && <span>👤 Ref: {fix.referee}</span>}
                          {fix.chaplain && <span>🕊️ Chaplain: {fix.chaplain}</span>}
                          {fix.scorers && <span>⚽ Goals: {fix.scorers}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setCertifyingFixture(fix);
                            setCertHomeScore(fix.homeScore || 0);
                            setCertAwayScore(fix.awayScore || 0);
                            setCertStatus(fix.status || "COMPLETED");
                            setCertScorers(fix.scorers || "");
                            setCertSpiritualHome(fix.spiritualBonusHome ?? 1);
                            setCertSpiritualAway(fix.spiritualBonusAway ?? 1);
                            setCertConductNotes(fix.conductNotes || "Fair play verified.");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs uppercase transition shadow cursor-pointer"
                        >
                          Certify Score
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteFixture(fix.id)}
                          className="p-2 text-gray-400 hover:text-rose-400 rounded-xl hover:bg-white/10 transition cursor-pointer"
                          title="Delete Fixture"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 5: LEAGUE STANDINGS & POINTS OVERRIDE
              ========================================================= */}
          {activeSection === "standings_ledger" && (
            <div className="bg-[#0b0821] border-2 border-yellow-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Championship Table & Points Override Ledger
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Live championship standings table. Apply manual disciplinary points deductions
                    or fair play conduct bonuses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const sorted = [...standings].sort(
                      (a, b) => b.points - a.points || b.gd - a.gd,
                    );
                    saveStandings(sorted);
                    showToast("✓ Standings sorted by Points and Goal Difference!");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
                >
                  Recalculate Table
                </button>
              </div>

              {/* Standings Table Editor */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#2e2554] text-gray-400 text-[10px] uppercase">
                      <th className="py-2.5 px-3">Pos</th>
                      <th className="py-2.5 px-3">Club</th>
                      <th className="py-2.5 px-2 text-center">P</th>
                      <th className="py-2.5 px-2 text-center">W</th>
                      <th className="py-2.5 px-2 text-center">D</th>
                      <th className="py-2.5 px-2 text-center">L</th>
                      <th className="py-2.5 px-2 text-center">GF</th>
                      <th className="py-2.5 px-2 text-center">GA</th>
                      <th className="py-2.5 px-2 text-center">GD</th>
                      <th className="py-2.5 px-3 text-center">Pts</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#261f4d]">
                    {standings.map((st, pos) => (
                      <tr key={st.id ?? `standing-${pos}`} className="hover:bg-white/5 transition">
                        <td className="py-3 px-3 font-black text-white">#{pos + 1}</td>
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: st.color || "#00f0ff" }}
                          />
                          <span className="truncate">{st.name}</span>
                        </td>
                        <td className="py-3 px-2 text-center text-gray-300">
                          {st.played ?? st.mp ?? 0}
                        </td>
                        <td className="py-3 px-2 text-center text-emerald-400 font-bold">
                          {st.won ?? st.w ?? 0}
                        </td>
                        <td className="py-3 px-2 text-center text-gray-400">
                          {st.drawn ?? st.d ?? 0}
                        </td>
                        <td className="py-3 px-2 text-center text-rose-400">
                          {st.lost ?? st.l ?? 0}
                        </td>
                        <td className="py-3 px-2 text-center text-gray-300">{st.gf ?? 0}</td>
                        <td className="py-3 px-2 text-center text-gray-400">{st.ga ?? 0}</td>
                        <td className="py-3 px-2 text-center text-cyan-300 font-bold">
                          {st.gd > 0 ? `+${st.gd}` : (st.gd ?? 0)}
                        </td>
                        <td className="py-3 px-3 text-center font-black text-amber-300 text-sm">
                          {st.points ?? st.pts ?? 0}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setEditingStanding(st)}
                            className="px-2.5 py-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold text-[11px] transition cursor-pointer"
                          >
                            Edit Points
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 6: PLAYER LEADERBOARD & GOLDEN BOOT
              ========================================================= */}
          {activeSection === "player_stats" && (
            <div className="bg-[#0b0821] border-2 border-amber-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Golden Boot & Player Leaderboard Records
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update goals, assists, clean sheets, match ratings, and MVP accolades.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddStatModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Player Stat Entry</span>
                </button>
              </div>

              {/* Player Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {playerStats.map((stat, sIdx) => (
                  <div
                    key={stat.id || `${stat.name}-${sIdx}`}
                    className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] hover:border-amber-400/40 transition space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-black text-white">{stat.name}</h5>
                        <span className="text-[11px] text-gray-400 font-mono">{stat.team}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold text-xs">
                        {stat.rating} Rating
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
                      <div className="p-1.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">
                          Goals
                        </span>
                        <span className="font-black text-emerald-400">{stat.goals}</span>
                      </div>
                      <div className="p-1.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">
                          Assists
                        </span>
                        <span className="font-black text-cyan-300">{stat.assists}</span>
                      </div>
                      <div className="p-1.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">
                          MVP
                        </span>
                        <span className="font-black text-amber-300">{stat.mvpAwards}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#261f4d] text-xs">
                      <button
                        type="button"
                        onClick={() => setEditingStat(stat)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Stats</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete stat entry for ${stat.name}?`)) {
                            const updated = playerStats.filter((_, idx) => idx !== sIdx);
                            savePlayerStats(updated);
                            showToast(`✓ Removed stats for ${stat.name}`);
                          }
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 7: FINANCIAL & FEE MANAGEMENT (MPESA, CASH, BANK, EXPENSES)
              ========================================================= */}
          {activeSection === "finances_fees" && (
            <div className="bg-[#0b0821] border-2 border-emerald-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Treasury, Registration Fees & Expense Ledger
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Audit MPESA affiliation payments, referee allowances, pitch rentals, and net
                    treasury balance.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddFinanceModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Transaction</span>
                </button>
              </div>

              {/* Treasury Balance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#141029] rounded-2xl border border-emerald-400/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Total Income (Receipts)
                  </span>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    KES {totalIncome.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-500 block">
                    Registration & Affiliation Dues
                  </span>
                </div>

                <div className="p-4 bg-[#141029] rounded-2xl border border-rose-400/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Total Disbursed Expenses
                  </span>
                  <div className="text-xl font-black text-rose-400 font-mono">
                    KES {totalExpense.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-500 block">
                    Referees, Pitches & Equipment
                  </span>
                </div>

                <div className="p-4 bg-[#141029] rounded-2xl border border-amber-400/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Net Treasury Surplus
                  </span>
                  <div className="text-xl font-black text-amber-300 font-mono">
                    KES {netBalance.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-500 block">
                    Solvent & Verified Balance
                  </span>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#2e2554] text-gray-400 text-[10px] uppercase">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Category & Details</th>
                      <th className="py-2.5 px-2 text-center">Method</th>
                      <th className="py-2.5 px-2 text-center">Ref Code</th>
                      <th className="py-2.5 px-2 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#261f4d]">
                    {finances.map((fin, fIdx) => (
                      <tr key={fin.id ?? `fin-${fIdx}`} className="hover:bg-white/5 transition">
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              fin.type === "INCOME"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            {fin.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          <div>{fin.description}</div>
                          <span className="text-[10px] text-gray-400 font-normal">
                            {fin.category}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center text-cyan-300">{fin.method}</td>
                        <td className="py-3 px-2 text-center text-amber-300 font-bold">
                          {fin.reference}
                        </td>
                        <td
                          className={`py-3 px-2 text-right font-black ${
                            fin.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {fin.type === "INCOME" ? "+" : "-"}KES {fin.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-400">{fin.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 8: MASS BROADCASTS & NOTIFICATIONS (SMS, EMAIL, WHATSAPP)
              ========================================================= */}
          {activeSection === "broadcasts_alerts" && (
            <div className="bg-[#0b0821] border-2 border-blue-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-400" />
                    Mass Communication, SMS & Broadcast Dispatcher
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Send urgent SMS alerts and email announcements to team managers, coaches,
                    referees, and parents.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSendBroadcastModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wide transition shadow cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Compose Broadcast</span>
                </button>
              </div>

              {/* Broadcasts Archive */}
              <div className="space-y-3">
                {broadcasts.map((bc, bIdx) => (
                  <div
                    key={bc.id ?? `bc-${bIdx}`}
                    className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase font-mono">
                          {bc.channel.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          To: {bc.recipientGroup}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{bc.sentAt}</span>
                    </div>

                    <h5 className="text-sm font-black text-white">{bc.title}</h5>
                    <p className="text-xs text-gray-300 leading-relaxed">{bc.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 9: STADIUM SOUNDTRACK & ANTHEM STUDIO (YOUTUBE + AUTOPLAY)
              ========================================================= */}
          {activeSection === "anthem_studio" && (
            <div className="space-y-4 animate-in fade-in">
              <AnthemStudioAndPlaylist />
            </div>
          )}

          {/* =========================================================
              PANEL 9B: FAN CHEERS & COMMUNITY MODERATION
              ========================================================= */}
          {activeSection === "fan_comments" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#0b0821] border-2 border-emerald-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4 mb-6">
                  <div>
                    <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      Fan Cheers & Community Moderation Console
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Audit community submissions, prayers, and chants. Pin inspiring messages to
                      the top or remove inappropriate posts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                      Super Admin Moderation
                    </span>
                  </div>
                </div>

                <FanCommunityComments />
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 10: MVP VOTING CENTER DISPATCHER
              ========================================================= */}
          {activeSection === "voting_center" && (
            <div className="bg-[#0b0821] border-2 border-pink-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Vote className="w-5 h-5 text-pink-400" />
                    MVP Voting Center Dispatcher
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Configure active voting matches, generate custom voting links, and audit
                    certified school email ballots.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono font-bold text-xs border border-pink-500/30">
                    {votedEmailsCount} Verified Ballots Cast
                  </span>
                </div>
              </div>

              {/* Voting Configuration Card */}
              <div className="bg-[#141029] border border-[#2e2554] rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                      Active Match For Balloting
                    </label>
                    <select
                      value={votingMatchId}
                      onChange={(e) => setVotingMatchId(Number(e.target.value))}
                      className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-pink-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                    >
                      {fixtures.map((fix, fIdx) => {
                        const h = teams.find((t) => t.id === fix.homeId)?.name || `#${fix.homeId}`;
                        const a = teams.find((t) => t.id === fix.awayId)?.name || `#${fix.awayId}`;
                        return (
                          <option key={fix.id ?? `vote-fix-${fIdx}`} value={fix.id}>
                            MW {fix.matchweek}: {h} vs {a} ({fix.date})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                      Voting Deadline / Closing Notice
                    </label>
                    <input
                      type="text"
                      value={votingDeadline}
                      onChange={(e) => setVotingDeadline(e.target.value)}
                      placeholder="e.g. Sunday, Oct 25, 2026 at 23:59 EAT"
                      className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-pink-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {/* Shareable Link Box */}
                <div className="p-3 bg-[#0a071b] rounded-xl border border-[#261f4d] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Shareable MVP Voting Link:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/mvp-voting?matchId=${votingMatchId}`}
                      className="w-full bg-black/40 border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const origin = typeof window !== "undefined" ? window.location.origin : "";
                        const url = `${origin}/mvp-voting?matchId=${votingMatchId}`;
                        navigator.clipboard.writeText(url);
                        showToast("✓ MVP Voting link copied to clipboard!");
                      }}
                      className="px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 11: ATHLETE PHOTOS & MEDIA UPLOAD
              ========================================================= */}
          {activeSection === "media_photos" && (
            <div className="bg-[#0b0821] border-2 border-blue-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-400" />
                    Athlete Photos & Official Media Hub
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Directly upload player headshots or dispatch shareable upload links to team
                    captains.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== "undefined" ? window.location.origin : "";
                    const url = `${origin}/upload-photo`;
                    navigator.clipboard.writeText(url);
                    showToast("✓ Shareable Player Photo Upload link copied!");
                  }}
                  className="px-4 py-2 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Copy Player Upload Portal Link</span>
                </button>
              </div>

              {/* Direct Photo Uploader */}
              <div className="bg-[#141029] border border-[#2e2554] rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                      Select Team
                    </label>
                    <select
                      value={selectedPhotoTeamId}
                      onChange={(e) => setSelectedPhotoTeamId(Number(e.target.value))}
                      className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                    >
                      {teams.map((t, tIdx) => (
                        <option key={t.id ?? `photo-team-${tIdx}`} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                      Select Athlete
                    </label>
                    <select
                      value={selectedPhotoPlayer}
                      onChange={(e) => setSelectedPhotoPlayer(e.target.value)}
                      className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                    >
                      {(teams.find((t) => t.id === Number(selectedPhotoTeamId))?.squad || []).map(
                        (p, pIdx) => (
                          <option key={`${p.name}-${pIdx}`} value={p.name}>
                            #{p.number || pIdx + 1} - {p.name} ({p.position || "MID"})
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {/* File input & Preview */}
                <div className="p-4 bg-[#0a071b] rounded-xl border border-[#261f4d] space-y-3">
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">
                    Choose Portrait Photo File (PNG, JPG, WebP):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 cursor-pointer"
                  />

                  {photoPreview && (
                    <div className="flex items-center gap-4 pt-2">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-400 shadow shrink-0">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs">
                        <span className="font-black text-white block">Ready to apply photo</span>
                        <span className="text-gray-400 text-[11px]">
                          Target: {selectedPhotoPlayer}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2e2554]">
                  <button
                    type="button"
                    onClick={handleSavePhotoDirectly}
                    disabled={!photoPreview}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                  >
                    Save & Update Athlete Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 12: PRESIDENTIAL DECREES & COUNCIL MINUTES
              ========================================================= */}
          {activeSection === "decrees_minutes" && (
            <div className="bg-[#0b0821] border-2 border-indigo-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Presidential Decrees & Executive Minutes
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Issue binding executive directives and archive timestamped council meeting
                    resolutions.
                  </p>
                </div>
              </div>

              {/* Form: Issue Decree */}
              <form
                onSubmit={handleIssueDecree}
                className="bg-[#141029] border border-[#2e2554] rounded-2xl p-5 space-y-4"
              >
                <h4 className="text-xs font-black uppercase text-indigo-300">
                  Issue Official League Decree
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                      Decree Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Directive No. 05: Sunday Hall Reservation"
                      value={newDecreeTitle}
                      onChange={(e) => setNewDecreeTitle(e.target.value)}
                      className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-indigo-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                      Council Category
                    </label>
                    <select
                      value={newDecreeCategory}
                      onChange={(e) => setNewDecreeCategory(e.target.value)}
                      className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-indigo-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                    >
                      <option value="Executive Governance">Executive Governance</option>
                      <option value="Match Officiating">Match Officiating</option>
                      <option value="Spiritual & Conduct Oversight">
                        Spiritual & Conduct Oversight
                      </option>
                      <option value="Disciplinary Resolution">Disciplinary Resolution</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Decree Text & Statutory Content
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter formal decree text..."
                    value={newDecreeContent}
                    onChange={(e) => setNewDecreeContent(e.target.value)}
                    className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-indigo-400 rounded-xl p-3 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-500/20 cursor-pointer"
                  >
                    Seal & Publish Decree
                  </button>
                </div>
              </form>

              {/* Decrees Archive */}
              <div className="space-y-3">
                {decrees.map((dec, dIdx) => (
                  <div
                    key={dec.id ?? `decree-${dIdx}`}
                    className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                        {dec.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{dec.date}</span>
                    </div>
                    <h5 className="text-sm font-black text-white">{dec.title}</h5>
                    <p className="text-xs text-gray-300 leading-relaxed">{dec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              PANEL 13: DATABASE BACKUP, DISASTER RECOVERY & AUDIT
              ========================================================= */}
          {activeSection === "system_backup" && (
            <div className="bg-[#0b0821] border-2 border-emerald-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
                <div>
                  <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    System Security, Database Backup & Audit Ledger
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Export complete database snapshots to JSON, download official standings CSV
                    reports, restore system records, and review operator audit trails.
                  </p>
                </div>
              </div>

              {/* Data Export & Backup Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Full Database JSON Export */}
                <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-3">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-black text-white uppercase">Full JSON Snapshot</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Downloads an encrypted database file with all teams, 15-player squad limit
                    rosters, match results, standings, finances, and decrees.
                  </p>
                  <button
                    type="button"
                    onClick={exportSystemBackup}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* 2. Standings & Stats CSV Export */}
                <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-black text-white uppercase">Official CSV Report</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Generates clean, spreadsheet-ready CSV report of official standings, points,
                    goal difference, and fair play records for council meetings.
                  </p>
                  <button
                    type="button"
                    onClick={exportStandingsCSV}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 font-bold text-xs uppercase tracking-wide transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Standings CSV</span>
                  </button>
                </div>

                {/* 3. System Restore */}
                <div className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] space-y-3">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-black text-white uppercase">Disaster Restore</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Select a previously exported JSON backup file to overwrite and restore current
                    league data safely.
                  </p>
                  <label className="w-full py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 font-bold text-xs uppercase tracking-wide transition cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Restore</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* System Audit Ledger */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
                  <h4 className="text-xs font-black uppercase text-gray-300 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    Master System Audit Ledger & Access Security Log
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    🛡️ Verified Tamper-Resistant
                  </span>
                </div>

                <div className="space-y-2">
                  {auditLog.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-[#141029] rounded-xl border border-[#2e2554] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-semibold text-white">{log.action}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                        <span>{log.operator}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          INTERACTIVE MODALS
          ========================================================= */}

      {/* 1. Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-emerald-400/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Register New Parish Club
              </h4>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeam} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Club Official Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thunder FC"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Short Code (3 Letters)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. THU"
                    value={newTeamShortCode}
                    onChange={(e) => setNewTeamShortCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Kit Primary Color
                  </label>
                  <input
                    type="color"
                    value={newTeamColor}
                    onChange={(e) => setNewTeamColor(e.target.value)}
                    className="w-full h-9 bg-[#161138] border border-[#2e2554] rounded-xl cursor-pointer p-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Parish / Sunday Ministry Affiliation
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. Peters Youth Parish"
                  value={newTeamParish}
                  onChange={(e) => setNewTeamParish(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Assigned Home Stadium Ground
                </label>
                <input
                  type="text"
                  placeholder="e.g. Academy Main Arena"
                  value={newTeamPitch}
                  onChange={(e) => setNewTeamPitch(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Head Coach
                  </label>
                  <input
                    type="text"
                    placeholder="Coach Name"
                    value={newTeamCoach}
                    onChange={(e) => setNewTeamCoach(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Team Captain
                  </label>
                  <input
                    type="text"
                    placeholder="Captain Name"
                    value={newTeamCaptain}
                    onChange={(e) => setNewTeamCaptain(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Team Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                Edit Club Profile: {editingTeam.name}
              </h4>
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeam} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Club Name
                </label>
                <input
                  type="text"
                  required
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Short Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editingTeam.shortCode || ""}
                    onChange={(e) =>
                      setEditingTeam({ ...editingTeam, shortCode: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Kit Color
                  </label>
                  <input
                    type="color"
                    value={editingTeam.color || "#00f0ff"}
                    onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                    className="w-full h-9 bg-[#161138] border border-[#2e2554] rounded-xl cursor-pointer p-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Home Pitch Ground
                </label>
                <input
                  type="text"
                  value={editingTeam.homePitch || ""}
                  onChange={(e) => setEditingTeam({ ...editingTeam, homePitch: e.target.value })}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Coach
                  </label>
                  <input
                    type="text"
                    value={editingTeam.coach?.name || ""}
                    onChange={(e) =>
                      setEditingTeam({
                        ...editingTeam,
                        coach: { ...editingTeam.coach, name: e.target.value },
                      })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Captain
                  </label>
                  <input
                    type="text"
                    value={editingTeam.captain || ""}
                    onChange={(e) => setEditingTeam({ ...editingTeam, captain: e.target.value })}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Squad Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-emerald-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                {editingPlayerIndex !== null ? "Edit Squad Member" : "Add Squad Athlete"}
              </h4>
              <button
                type="button"
                onClick={() => setShowAddPlayerModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSquadPlayer} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Athlete Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brian Ochieng"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    required
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(parseInt(e.target.value) || 10)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Position
                  </label>
                  <select
                    value={playerPosition}
                    onChange={(e) => setPlayerPosition(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="FWD">Forward (FWD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Student Admission / ID Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026-ADM-0841"
                  value={playerAdmission}
                  onChange={(e) => setPlayerAdmission(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 700 000000"
                    value={playerEmergencyPhone}
                    onChange={(e) => setPlayerEmergencyPhone(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Medical Info
                  </label>
                  <input
                    type="text"
                    placeholder="Allergies / Asthma"
                    value={playerMedical}
                    onChange={(e) => setPlayerMedical(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="doc-verify-cb"
                  checked={playerDocVerified}
                  onChange={(e) => setPlayerDocVerified(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                />
                <label
                  htmlFor="doc-verify-cb"
                  className="text-xs text-white font-bold cursor-pointer"
                >
                  Identity and Parental Consent Verified
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Save Athlete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Player Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                Transfer Athlete Between Clubs
              </h4>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferPlayer} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Source Club (Transfer From)
                </label>
                <select
                  value={transferFromTeamId}
                  onChange={(e) => setTransferFromTeamId(Number(e.target.value))}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                >
                  {teams.map((t, idx) => (
                    <option key={t.id ?? `tr-src-${idx}`} value={t.id}>
                      {t.name} ({t.squad?.length || 0} players)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Select Athlete to Move
                </label>
                <select
                  value={transferPlayerName}
                  onChange={(e) => setTransferPlayerName(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                >
                  <option value="">-- Choose Player --</option>
                  {(teams.find((t) => t.id === transferFromTeamId)?.squad || []).map((p, pIdx) => (
                    <option key={`${p.name}-${pIdx}`} value={p.name}>
                      #{p.number || pIdx + 1} - {p.name} ({p.position || "MID"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Destination Club (Transfer To)
                </label>
                <select
                  value={transferToTeamId}
                  onChange={(e) => setTransferToTeamId(Number(e.target.value))}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                >
                  {teams.map((t, idx) => (
                    <option key={t.id ?? `tr-dst-${idx}`} value={t.id}>
                      {t.name} ({t.squad?.length || 0}/15 cap)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!transferPlayerName}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-black uppercase hover:brightness-110 shadow disabled:opacity-50"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Scorecard Certification Modal */}
      {certifyingFixture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Certify Match Scorecard (MW {certifyingFixture.matchweek})
              </h4>
              <button
                type="button"
                onClick={() => setCertifyingFixture(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCertifyScore} className="space-y-4">
              <div className="text-center p-3 bg-[#0a071b] rounded-2xl border border-[#2e2554]">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-right flex-1">
                    <span className="text-sm font-black text-white block">
                      {teams.find((t) => t.id === certifyingFixture.homeId)?.name || "Home"}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase">Home Pitch</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={certHomeScore}
                      onChange={(e) => setCertHomeScore(parseInt(e.target.value) || 0)}
                      className="w-14 h-12 bg-[#161138] border-2 border-cyan-400 rounded-2xl text-center text-lg font-black font-mono text-cyan-300 outline-none"
                    />
                    <span className="text-gray-500 font-bold">:</span>
                    <input
                      type="number"
                      min={0}
                      value={certAwayScore}
                      onChange={(e) => setCertAwayScore(parseInt(e.target.value) || 0)}
                      className="w-14 h-12 bg-[#161138] border-2 border-cyan-400 rounded-2xl text-center text-lg font-black font-mono text-cyan-300 outline-none"
                    />
                  </div>

                  <div className="text-left flex-1">
                    <span className="text-sm font-black text-white block">
                      {teams.find((t) => t.id === certifyingFixture.awayId)?.name || "Away"}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase">Visiting Side</span>
                  </div>
                </div>
              </div>

              {/* Spiritual & Conduct Bonus Point Rubric */}
              <div className="p-3 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-2">
                <span className="text-[10px] text-amber-300 uppercase font-black block">
                  🕊️ Sunday School Conduct & Scripture Bonus Points:
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-400 text-[10px] mb-1">
                      Home Spiritual Bonus (+Pts)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={2}
                      value={certSpiritualHome}
                      onChange={(e) => setCertSpiritualHome(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-2.5 py-1.5 text-xs font-mono text-amber-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] mb-1">
                      Away Spiritual Bonus (+Pts)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={2}
                      value={certSpiritualAway}
                      onChange={(e) => setCertSpiritualAway(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-2.5 py-1.5 text-xs font-mono text-amber-300 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Match Status
                  </label>
                  <select
                    value={certStatus}
                    onChange={(e) =>
                      setCertStatus(
                        e.target.value as
                          "SCHEDULED" | "LIVE" | "COMPLETED" | "POSTPONED" | "CANCELLED",
                      )
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="COMPLETED">COMPLETED (Certify Result)</option>
                    <option value="LIVE">LIVE IN PLAY</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="POSTPONED">POSTPONED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Goal Scorers (Minutes)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaycrack 24', Mutua 68'"
                    value={certScorers}
                    onChange={(e) => setCertScorers(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setCertifyingFixture(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Certify & Update Standings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Standing Points Modal */}
      {editingStanding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-yellow-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Adjust Points for {editingStanding.name}
              </h4>
              <button
                type="button"
                onClick={() => setEditingStanding(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updated = standings.map((st) =>
                  st.id === editingStanding.id ? editingStanding : st,
                );
                saveStandings(updated);
                setEditingStanding(null);
                showToast(`✓ Updated table record for ${editingStanding.name}`);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Points (Total)
                  </label>
                  <input
                    type="number"
                    value={editingStanding.points}
                    onChange={(e) =>
                      setEditingStanding({
                        ...editingStanding,
                        points: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-yellow-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Goal Difference (GD)
                  </label>
                  <input
                    type="number"
                    value={editingStanding.gd}
                    onChange={(e) =>
                      setEditingStanding({ ...editingStanding, gd: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-yellow-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Won (W)
                  </label>
                  <input
                    type="number"
                    value={editingStanding.won}
                    onChange={(e) =>
                      setEditingStanding({ ...editingStanding, won: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Drawn (D)
                  </label>
                  <input
                    type="number"
                    value={editingStanding.drawn}
                    onChange={(e) =>
                      setEditingStanding({
                        ...editingStanding,
                        drawn: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Lost (L)
                  </label>
                  <input
                    type="number"
                    value={editingStanding.lost}
                    onChange={(e) =>
                      setEditingStanding({
                        ...editingStanding,
                        lost: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setEditingStanding(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Save Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Edit Player Stat Modal */}
      {editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-amber-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Edit Player Stats: {editingStat.name}
              </h4>
              <button
                type="button"
                onClick={() => setEditingStat(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updated = playerStats.map((s) =>
                  s.name === editingStat.name ? editingStat : s,
                );
                savePlayerStats(updated);
                setEditingStat(null);
                showToast(`✓ Updated statistics for ${editingStat.name}`);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Goals Scored
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingStat.goals}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, goals: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Assists
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingStat.assists}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, assists: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Matches Played
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingStat.matchesPlayed}
                    onChange={(e) =>
                      setEditingStat({
                        ...editingStat,
                        matchesPlayed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    MVP Awards
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingStat.mvpAwards}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, mvpAwards: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono text-amber-300 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setEditingStat(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Save Stats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Add Player Stat Modal */}
      {showAddStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-amber-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Add Player Leaderboard Entry
              </h4>
              <button
                type="button"
                onClick={() => setShowAddStatModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStatName.trim()) return;
                const newEntry: AdminPlayerStat = {
                  id: `stat-${Date.now()}`,
                  name: newStatName.trim(),
                  team: newStatTeam.trim() || "Thunder FC",
                  goals: Number(newStatGoals) || 0,
                  assists: Number(newStatAssists) || 0,
                  matchesPlayed: Number(newStatMatches) || 1,
                  cleanSheets: Number(newStatCleanSheets) || 0,
                  yellowCards: Number(newStatYellow) || 0,
                  redCards: Number(newStatRed) || 0,
                  rating: Number(newStatRating) || 7.0,
                  mvpAwards: Number(newStatMvp) || 0,
                };
                const updated = [newEntry, ...playerStats];
                savePlayerStats(updated);
                setShowAddStatModal(false);
                setNewStatName("");
                showToast(`✓ Added stats for ${newEntry.name}`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Athlete Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Karanja"
                  value={newStatName}
                  onChange={(e) => setNewStatName(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Club Team
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thunder FC"
                  value={newStatTeam}
                  onChange={(e) => setNewStatTeam(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Goals
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newStatGoals}
                    onChange={(e) => setNewStatGoals(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Assists
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newStatAssists}
                    onChange={(e) => setNewStatAssists(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowAddStatModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Add Fixture Modal */}
      {showAddFixtureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Schedule New Match Fixture
              </h4>
              <button
                type="button"
                onClick={() => setShowAddFixtureModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFixture} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Home Team
                  </label>
                  <select
                    value={newFixHomeId}
                    onChange={(e) => setNewFixHomeId(Number(e.target.value))}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    {teams.map((t, idx) => (
                      <option key={t.id ?? `fh-${idx}`} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Away Team
                  </label>
                  <select
                    value={newFixAwayId}
                    onChange={(e) => setNewFixAwayId(Number(e.target.value))}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    {teams.map((t, idx) => (
                      <option key={t.id ?? `fa-${idx}`} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Matchweek
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newFixMatchweek}
                    onChange={(e) => setNewFixMatchweek(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newFixTime}
                    onChange={(e) => setNewFixTime(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newFixDate}
                    onChange={(e) => setNewFixDate(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Stadium Pitch Venue
                </label>
                <input
                  type="text"
                  value={newFixVenue}
                  onChange={(e) => setNewFixVenue(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Appointed Center Referee
                  </label>
                  <input
                    type="text"
                    value={newFixReferee}
                    onChange={(e) => setNewFixReferee(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Field Chaplain / Steward
                  </label>
                  <input
                    type="text"
                    value={newFixChaplain}
                    onChange={(e) => setNewFixChaplain(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowAddFixtureModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Schedule Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Add Season Modal */}
      {showAddSeasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-indigo-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Setup Season & Curriculum
              </h4>
              <button
                type="button"
                onClick={() => setShowAddSeasonModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSeason} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Season Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn 2026 Diocese Cup"
                  value={newSeasonName}
                  onChange={(e) => setNewSeasonName(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-indigo-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newSeasonYear}
                    onChange={(e) => setNewSeasonYear(parseInt(e.target.value) || 2026)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Division Category
                  </label>
                  <input
                    type="text"
                    value={newSeasonDivision}
                    onChange={(e) => setNewSeasonDivision(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Rulebook & Guidelines
                </label>
                <textarea
                  rows={2}
                  value={newSeasonRules}
                  onChange={(e) => setNewSeasonRules(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] rounded-xl p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Spiritual Memory Verse Curriculum
                </label>
                <textarea
                  rows={2}
                  value={newSeasonVerses}
                  onChange={(e) => setNewSeasonVerses(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] rounded-xl p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowAddSeasonModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Save Season
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Add Finance Modal */}
      {showAddFinanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-emerald-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Record Treasury Transaction
              </h4>
              <button
                type="button"
                onClick={() => setShowAddFinanceModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFinance} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Entry Type
                  </label>
                  <select
                    value={finType}
                    onChange={(e) => setFinType(e.target.value as "INCOME" | "EXPENSE")}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="INCOME">INCOME (Receipt)</option>
                    <option value="EXPENSE">EXPENSE (Disbursement)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={finCategory}
                    onChange={(e) => setFinCategory(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="Team Registration">Team Registration</option>
                    <option value="Player Card Dues">Player Card Dues</option>
                    <option value="Referee Fees">Referee Fees</option>
                    <option value="Pitch Maintenance">Pitch Maintenance</option>
                    <option value="Trophies & Medals">Trophies & Medals</option>
                    <option value="First Aid & Logistics">First Aid & Logistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Description / Payee
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thunder FC Season Affiliation Dues"
                  value={finDesc}
                  onChange={(e) => setFinDesc(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={finAmount}
                    onChange={(e) => setFinAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={finMethod}
                    onChange={(e) =>
                      setFinMethod(e.target.value as "MPESA" | "CASH" | "BANK_TRANSFER")
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="MPESA">MPESA</option>
                    <option value="CASH">CASH</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Reference Code / Receipt #
                </label>
                <input
                  type="text"
                  placeholder="e.g. QKH7829X1A"
                  value={finRef}
                  onChange={(e) => setFinRef(e.target.value.toUpperCase())}
                  className="w-full bg-[#161138] border border-[#2e2554] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowAddFinanceModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. Send Broadcast Modal */}
      {showSendBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-blue-400/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                Dispatch Mass Notification
              </h4>
              <button
                type="button"
                onClick={() => setShowSendBroadcastModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Channel
                  </label>
                  <select
                    value={bcChannel}
                    onChange={(e) =>
                      setBcChannel(
                        e.target.value as "SMS_ALERT" | "EMAIL_BROADCAST" | "PORTAL_NOTICE",
                      )
                    }
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="SMS_ALERT">SMS Alert</option>
                    <option value="EMAIL_BROADCAST">Email Broadcast</option>
                    <option value="PORTAL_NOTICE">Portal Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Audience
                  </label>
                  <select
                    value={bcRecipient}
                    onChange={(e) => setBcRecipient(e.target.value)}
                    className="w-full bg-[#161138] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="All Coaches & Team Managers">All Coaches & Team Managers</option>
                    <option value="All Board Members & Referees">
                      All Board Members & Referees
                    </option>
                    <option value="All Registered Athletes">All Registered Athletes</option>
                    <option value="General Public Spectators">General Public Spectators</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Subject / Alert Header
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pitch Relocation Notice for MW 2"
                  value={bcTitle}
                  onChange={(e) => setBcTitle(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-blue-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Message Body
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter message text to broadcast..."
                  value={bcBody}
                  onChange={(e) => setBcBody(e.target.value)}
                  className="w-full bg-[#161138] border border-[#2e2554] focus:border-blue-400 rounded-xl p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowSendBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black uppercase hover:brightness-110 shadow"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
