import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Calendar,
  Award,
  Shield,
  FileText,
  Download,
  Clock,
  Sparkles,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Heart,
  Flame,
  Send,
  UserPlus,
  Mail,
  Phone,
  HelpCircle,
  X,
  Play,
  RotateCcw,
  Star,
  Activity,
  Layers,
  Check,
} from "lucide-react";
import { DEFAULT_TEAMS, DEFAULT_FIXTURES, isTeamDeleted } from "../lib/fixturesData";
import { DEFAULT_STANDINGS, type TeamStanding, type SquadMember } from "./LeagueStandings";

export interface PublicNewsArticle {
  id: string;
  title: string;
  category: "MATCH_RECAP" | "DEVOTIONAL" | "ANNOUNCEMENT" | "SPOTLIGHT";
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  readTime: string;
}

export interface MatchTimelineEvent {
  minute: number;
  type: "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUB" | "WHISTLE";
  team: "HOME" | "AWAY";
  player: string;
  detail?: string;
}

const DEFAULT_NEWS_ARTICLES: PublicNewsArticle[] = [
  {
    id: "news-1",
    title: "Matchweek 1 Thriller: Samba Edges Young Stars City in 5-Goal Spectacular",
    category: "MATCH_RECAP",
    excerpt:
      "Kevin Omondi nets a brace as Samba claims a 3-2 victory in the Sunday League season opener with fair play conduct points awarded to both clubs.",
    content:
      "Under radiant autumn skies at the Samba Arena, the 2026/27 M-Pesa Sunday League eFootball Championship kicked off with an electric contest. Both sides displayed exceptional Christian sportsmanship, reciting the opening scripture (1 Corinthians 9:24) in unison prior to kickoff. Kevin Omondi proved decisive with clinical finishing in the 14th and 68th minutes.",
    author: "League Editorial Desk",
    date: "Sunday, Oct 25, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    readTime: "3 min read",
  },
  {
    id: "news-2",
    title: "Christian Sportsmanship Spotlight: Royal Rangers Zero-Card Milestone",
    category: "SPOTLIGHT",
    excerpt:
      "Rangers captain Levis Wanyama commends defensive discipline and scripture memorization as squad leads Fair Play standings.",
    content:
      "The Royal Rangers have set the benchmark for league sportsmanship, completing consecutive matchweeks without a single disciplinary card while maintaining a 100% completion rate on Sunday school scripture memory verses. Head coach George Kibet highlighted the team's weekly devotionals as the foundation of their calm, disciplined play.",
    author: "Spiritual Oversight Committee",
    date: "Friday, Oct 23, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80",
    readTime: "2 min read",
  },
  {
    id: "news-3",
    title: "Official 15-Player Squad Cap and Admission Verification In Effect",
    category: "ANNOUNCEMENT",
    excerpt:
      "All participating clubs confirm compliance with the executive registration directive and student eligibility standards.",
    content:
      "Regulations Manager Cheryl Cosmas officially confirmed that all 4 active league clubs have successfully verified their 15-player squad limit rosters. Verified student admission cards, medical emergency numbers, and parental consent waivers are now secured in the digital league vault.",
    author: "Registrar Office",
    date: "Wednesday, Oct 21, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&auto=format&fit=crop&q=80",
    readTime: "2 min read",
  },
];

export function PublicViewerHub({
  initialSubTab = "hub",
  onNavigateTab,
  hideSubNav = false,
}: {
  initialSubTab?: "hub" | "standings" | "fixtures" | "clubs" | "leaderboards" | "desk";
  onNavigateTab?: (tab: string) => void;
  hideSubNav?: boolean;
}) {
  const [activeSubTab, setActiveSubTab] = useState<
    "hub" | "standings" | "fixtures" | "clubs" | "leaderboards" | "desk"
  >(initialSubTab);

  // Synchronize when prop changes
  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Selected Division Filter for Standings & Fixtures
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");

  // Detailed Match Center Modal State
  const [selectedMatchCenterId, setSelectedMatchCenterId] = useState<number | null>(null);

  // Dedicated Club Profile Modal State
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);

  // Selected Player Profile Modal State
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<{
    name: string;
    club: string;
    number?: number;
    position?: string;
    photoUrl?: string;
  } | null>(null);

  // League Documents Modal State
  const [activeDocModal, setActiveDocModal] = useState<
    "constitution" | "rulebook" | "fairplay" | "consent" | null
  >(null);

  // Read News Modal State
  const [readingNewsArticle, setReadingNewsArticle] = useState<PublicNewsArticle | null>(null);

  // Registration & Contact Desk Form States
  const [clubAppForm, setClubAppForm] = useState({
    clubName: "",
    parishName: "",
    coachName: "",
    contactEmail: "",
    phone: "",
    division: "Youth Division (U-19)",
    notes: "",
  });
  const [playerTryoutForm, setPlayerTryoutForm] = useState({
    playerName: "",
    age: "16",
    preferredPosition: "MID",
    parishChurch: "",
    parentName: "",
    parentPhone: "",
    email: "",
  });
  const [contactDeskForm, setContactDeskForm] = useState({
    fullName: "",
    email: "",
    category: "General Inquiry",
    subject: "",
    message: "",
  });
  const [deskToast, setDeskToast] = useState<string | null>(null);

  // Fixtures filter state
  const [fixtureClubFilter, setFixtureClubFilter] = useState<string>("ALL");
  const [fixtureStatusFilter, setFixtureStatusFilter] = useState<string>("ALL");

  // Load live data from localStorage
  const [teams, setTeams] = useState<TeamStanding[]>(DEFAULT_STANDINGS);
  const [fixtures, setFixtures] = useState(DEFAULT_FIXTURES);

  useEffect(() => {
    try {
      const storedStandings =
        localStorage.getItem("mpesa_pes_standings_v6") ||
        localStorage.getItem("mpesa_pes_teams_v6");
      let activeList: TeamStanding[] = DEFAULT_STANDINGS;
      if (storedStandings) {
        const parsed = JSON.parse(storedStandings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const nonDeleted = parsed.filter(
            (t: Record<string, unknown>) =>
              !isTeamDeleted(Number(t.id), typeof t.name === "string" ? t.name : ""),
          );
          if (nonDeleted.length > 0) activeList = nonDeleted as unknown as TeamStanding[];
        }
      }

      // Strict number normalization so NaN can never occur
      const sanitized = activeList.map((t: Record<string, unknown>, idx) => {
        const gf = Number(t.gf) || 0;
        const ga = Number(t.ga) || 0;
        const gd = typeof t.gd === "number" && Number.isFinite(t.gd) ? t.gd : gf - ga;
        const pts = Number(t.pts ?? t.points) || 0;
        const mp = Number(t.mp ?? t.played) || 0;
        const w = Number(t.w ?? t.won) || 0;
        const d = Number(t.d ?? t.drawn) || 0;
        const l = Number(t.l ?? t.lost) || 0;

        return {
          ...t,
          id: t.id ?? idx + 1,
          name: t.name || `Club #${idx + 1}`,
          shortCode: t.shortCode || (t.name ? t.name.slice(0, 3).toUpperCase() : `C${idx + 1}`),
          color: t.color || "#00f0ff",
          homePitch: t.homePitch || "Official Home Ground",
          mp,
          played: mp,
          w,
          won: w,
          d,
          drawn: d,
          l,
          lost: l,
          gf,
          ga,
          gd,
          pts,
          points: pts,
        };
      });
      setTeams(sanitized);

      const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedFixtures) {
        const parsed = JSON.parse(storedFixtures);
        if (Array.isArray(parsed) && parsed.length > 0) setFixtures(parsed);
      }
    } catch {
      // Ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setDeskToast(msg);
    setTimeout(() => setDeskToast(null), 3500);
  };

  // Form Handlers
  const handleClubAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubAppForm.clubName || !clubAppForm.contactEmail) return;
    const existing = JSON.parse(localStorage.getItem("mpesa_pes_club_applications_v1") || "[]");
    const record = { ...clubAppForm, submittedAt: new Date().toISOString() };
    localStorage.setItem("mpesa_pes_club_applications_v1", JSON.stringify([record, ...existing]));
    setClubAppForm({
      clubName: "",
      parishName: "",
      coachName: "",
      contactEmail: "",
      phone: "",
      division: "Youth Division (U-19)",
      notes: "",
    });
    showToast("✓ Football Club application submitted! The Council will review your registration.");
  };

  const handlePlayerTryoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerTryoutForm.playerName || !playerTryoutForm.parentPhone) return;
    const existing = JSON.parse(localStorage.getItem("mpesa_pes_tryout_requests_v1") || "[]");
    const record = { ...playerTryoutForm, submittedAt: new Date().toISOString() };
    localStorage.setItem("mpesa_pes_tryout_requests_v1", JSON.stringify([record, ...existing]));
    setPlayerTryoutForm({
      playerName: "",
      age: "16",
      preferredPosition: "MID",
      parishChurch: "",
      parentName: "",
      parentPhone: "",
      email: "",
    });
    showToast(
      "✓ Tryout interest logged! Local registered clubs will contact parents with schedule.",
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactDeskForm.message || !contactDeskForm.email) return;
    const existing = JSON.parse(localStorage.getItem("mpesa_pes_inquiries_v1") || "[]");
    const record = { ...contactDeskForm, submittedAt: new Date().toISOString() };
    localStorage.setItem("mpesa_pes_inquiries_v1", JSON.stringify([record, ...existing]));
    setContactDeskForm({
      fullName: "",
      email: "",
      category: "General Inquiry",
      subject: "",
      message: "",
    });
    showToast("✓ Inquiries dispatched to the League Secretariat desk!");
  };

  // Standings with Bonus Points (BP) calculation and strict sorting
  const sortedStandingsWithBonus = useMemo(() => {
    return teams
      .map((st: Record<string, unknown>, idx) => {
        const played = Number(st.played ?? st.mp) || 0;
        const won = Number(st.won ?? st.w) || 0;
        const drawn = Number(st.drawn ?? st.d) || 0;
        const lost = Number(st.lost ?? st.l) || 0;
        const gf = Number(st.gf) || 0;
        const ga = Number(st.ga) || 0;
        const gd = typeof st.gd === "number" && Number.isFinite(st.gd) ? st.gd : gf - ga;
        const points = Number(st.points ?? st.pts) || 0;

        // Bonus Points (BP): fair play + spiritual recitation bonus points
        const bonusPoints =
          typeof st.bonusPoints === "number" && !isNaN(st.bonusPoints)
            ? st.bonusPoints
            : st.id === 6
              ? 2
              : st.id === 1
                ? 1
                : st.id === 7
                  ? 2
                  : 1;
        const totalPoints = points + bonusPoints;

        return {
          ...st,
          played,
          won,
          drawn,
          lost,
          gf,
          ga,
          gd,
          points,
          bonusPoints,
          totalPoints,
        };
      })
      .sort(
        (a, b) =>
          (b.totalPoints || 0) - (a.totalPoints || 0) ||
          (b.gd || 0) - (a.gd || 0) ||
          (b.gf || 0) - (a.gf || 0),
      );
  }, [teams]);

  // Selected match for Match Center
  const selectedMatch = useMemo(() => {
    if (!selectedMatchCenterId) return null;
    return fixtures.find((f) => f.id === selectedMatchCenterId) || fixtures[0];
  }, [selectedMatchCenterId, fixtures]);

  const homeClub = useMemo(() => {
    if (!selectedMatch) return null;
    return teams.find((t) => t.id === selectedMatch.homeId);
  }, [selectedMatch, teams]);

  const awayClub = useMemo(() => {
    if (!selectedMatch) return null;
    return teams.find((t) => t.id === selectedMatch.awayId);
  }, [selectedMatch, teams]);

  // Active match center timeline events
  const matchTimeline: MatchTimelineEvent[] = useMemo(() => {
    return [
      {
        minute: 0,
        type: "WHISTLE",
        team: "HOME",
        player: "Match Commenced",
        detail: "Opening Scripture Recitation: Phil 4:13",
      },
      {
        minute: 14,
        type: "GOAL",
        team: "HOME",
        player: "Kevin Omondi",
        detail: "Clinical finish into bottom-right corner",
      },
      {
        minute: 28,
        type: "YELLOW_CARD",
        team: "AWAY",
        player: "Ali Guyo",
        detail: "Tactical foul on counter-attack",
      },
      {
        minute: 32,
        type: "GOAL",
        team: "AWAY",
        player: "Elly Adams Otieno",
        detail: "Powerful 22-yard strike",
      },
      {
        minute: 44,
        type: "GOAL",
        team: "HOME",
        player: "Levis Wanyama",
        detail: "Direct free-kick over the wall",
      },
      {
        minute: 45,
        type: "WHISTLE",
        team: "HOME",
        player: "Halftime Whistle",
        detail: "Halftime prayer & water break",
      },
      {
        minute: 58,
        type: "SUB",
        team: "HOME",
        player: "Chris Koome IN ➔ Tonny Odundo OUT",
        detail: "Tactical substitution",
      },
      {
        minute: 68,
        type: "GOAL",
        team: "HOME",
        player: "Kevin Omondi",
        detail: "Assisted by Levis Wanyama",
      },
      {
        minute: 79,
        type: "GOAL",
        team: "AWAY",
        player: "Raila Junior",
        detail: "Header from corner kick",
      },
      {
        minute: 90,
        type: "WHISTLE",
        team: "HOME",
        player: "Full Time Whistle",
        detail: "Final sportsmanship handshake & joint prayer",
      },
    ];
  }, []);

  // Filtered fixtures
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      if (fixtureClubFilter !== "ALL") {
        const cId = Number(fixtureClubFilter);
        if (f.homeId !== cId && f.awayId !== cId) return false;
      }
      if (fixtureStatusFilter !== "ALL") {
        if (
          fixtureStatusFilter === "FINISHED" &&
          f.status !== "FINISHED" &&
          f.status !== "COMPLETED"
        )
          return false;
        if (
          fixtureStatusFilter === "UPCOMING" &&
          f.status !== "UPCOMING" &&
          f.status !== "SCHEDULED"
        )
          return false;
        if (fixtureStatusFilter === "LIVE" && f.status !== "LIVE") return false;
      }
      return true;
    });
  }, [fixtures, fixtureClubFilter, fixtureStatusFilter]);

  // Selected Club details
  const activeClubProfile = useMemo(() => {
    if (!selectedClubId) return null;
    return teams.find((t) => t.id === selectedClubId) || teams[0];
  }, [selectedClubId, teams]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {deskToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span className="text-xs">{deskToast}</span>
        </div>
      )}

      {/* Public Hub Top Navigation Bar */}
      {!hideSubNav && (
        <div className="bg-[#0b0821] border border-[#2e2554] p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "hub", label: "Home & Hub", icon: Sparkles },
              { id: "standings", label: "Standings & Table", icon: Trophy },
              { id: "fixtures", label: "Schedule & Match Center", icon: Calendar },
              { id: "clubs", label: "Clubs & Squads", icon: Shield },
              { id: "leaderboards", label: "Golden Boot & Honors", icon: Award },
              { id: "desk", label: "Registration & Inquiries", icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                    isActive
                      ? "bg-[#00f0ff] text-black shadow-md shadow-cyan-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-mono hidden sm:inline">
              Public Spectator Portal
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 1: MAIN HOME & LEAGUE HUB
          ======================================================== */}
      {activeSubTab === "hub" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Hero Banner & Media Carousel */}
          <div className="relative rounded-3xl overflow-hidden border border-cyan-400/30 bg-gradient-to-r from-indigo-950 via-[#100a2f] to-[#080517] p-6 sm:p-8 shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sunday League Match-of-the-Week Spotlight</span>
              </div>

              <h2 className="font-header text-2xl sm:text-4xl font-black text-white uppercase tracking-wider leading-tight">
                Championship Matchweek 2: The Academy Derby Clásico
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                Experience high-octane youth football powered by faith and fair play. Watch the
                league's top offenses clash at the Academy Arena this Sunday at 3:00 PM EAT.
              </p>

              {/* Devotional Quote of the Week Card */}
              <div className="p-3.5 bg-black/40 border border-yellow-400/30 rounded-2xl flex items-start gap-3 backdrop-blur-md max-w-xl">
                <Heart className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-black text-yellow-300 uppercase block text-[10px]">
                    Weekly Spiritual Devotional Scripture:
                  </span>
                  <p className="text-gray-200 font-serif italic mt-0.5">
                    "Do you not know that in a race all the runners run, but only one gets the
                    prize? Run in such a way as to get the prize." — 1 Corinthians 9:24
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("fixtures")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black text-xs uppercase tracking-wide transition shadow-lg shadow-cyan-500/20 hover:brightness-110 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>View All Fixtures</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab("standings")}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wide transition cursor-pointer"
                >
                  <span>Championship Table</span>
                </button>
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
          </div>

          {/* Latest News & Editorial Articles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Latest News & Match Previews
              </h3>
              <span className="text-xs text-gray-400 font-mono">Official Editorial Desk</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEFAULT_NEWS_ARTICLES.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#0b0821] border border-[#2e2554] hover:border-cyan-400/40 rounded-3xl overflow-hidden transition flex flex-col justify-between group shadow-lg"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                      {article.category.replace("_", " ")}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h4 className="font-black text-sm text-white group-hover:text-cyan-300 transition line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#261f4d] flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-mono">
                        By {article.author}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReadingNewsArticle(article)}
                        className="text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* League Information & Downloads Vault */}
          <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div>
                <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  Official League Information & Downloads
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Access official documents, season rulebooks, Christian conduct charters, and
                  player eligibility waivers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: "constitution",
                  title: "League Constitution",
                  desc: "Supreme governance bylaws & executive framework",
                  badge: "PDF Vault",
                  color: "border-indigo-400/40 text-indigo-300",
                },
                {
                  id: "rulebook",
                  title: "Official Rulebook 2026",
                  desc: "Match play, pitch dimensions & substitution rules",
                  badge: "FIFA + Bonus",
                  color: "border-cyan-400/40 text-cyan-300",
                },
                {
                  id: "fairplay",
                  title: "Fair Play Guidelines",
                  desc: "Christian sportsmanship & conduct point rubric",
                  badge: "Spiritual Charter",
                  color: "border-amber-400/40 text-amber-300",
                },
                {
                  id: "consent",
                  title: "Parental Consent Waiver",
                  desc: "Under-18 medical waiver & emergency form",
                  badge: "Downloadable",
                  color: "border-emerald-400/40 text-emerald-300",
                },
              ].map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-[#141029] rounded-2xl border border-[#2e2554] hover:border-white/30 transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border bg-black/40 ${doc.color}`}
                    >
                      {doc.badge}
                    </span>
                    <h5 className="text-sm font-black text-white">{doc.title}</h5>
                    <p className="text-xs text-gray-400 leading-snug">{doc.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveDocModal(doc.id as typeof activeDocModal)}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View & Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsor & Partner Showcase Marquee */}
          <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 space-y-3 shadow-xl">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block text-center">
              Official League Partners & Community Grounds
            </span>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-2 grayscale hover:grayscale-0 transition opacity-80 hover:opacity-100">
              <div className="flex items-center gap-2">
                <span className="font-black text-emerald-400 text-lg font-mono">M-PESA</span>
                <span className="text-xs text-gray-400 font-bold">Foundation Academy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-cyan-300 text-lg font-mono">SAFARICOM</span>
                <span className="text-xs text-gray-400 font-bold">Community Link</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-400 text-lg font-mono">DIOCESE</span>
                <span className="text-xs text-gray-400 font-bold">Youth Ministries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-purple-400 text-lg font-mono">KIBIKO ARENA</span>
                <span className="text-xs text-gray-400 font-bold">Main Grounds</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: INTERACTIVE LEAGUE STANDINGS TABLE WITH BONUS POINTS
          ======================================================== */}
      {activeSubTab === "standings" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
            <div>
              <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Interactive League Standings & Conduct Points
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Ranked by Total Points (Match Points + Spiritual & Conduct Bonus Points) → Goal
                Difference → Goals Scored.
              </p>
            </div>

            {/* Division Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Division:</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-[#141029] border border-[#2e2554] focus:border-yellow-400 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Age Divisions</option>
                <option value="U10">Under-10 Junior Stars</option>
                <option value="U13">Under-13 Cadets</option>
                <option value="U17">Under-17 Intermediates</option>
                <option value="OPEN">Open Youth Division</option>
              </select>
            </div>
          </div>

          {/* Standings Table with MP, W, D, L, GF, GA, GD, Pts, BP, Total Pts */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2e2554] text-gray-400 text-[10px] uppercase">
                  <th className="py-3 px-3">Pos</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-2 text-center" title="Matches Played">
                    MP
                  </th>
                  <th className="py-3 px-2 text-center" title="Won">
                    W
                  </th>
                  <th className="py-3 px-2 text-center" title="Drawn">
                    D
                  </th>
                  <th className="py-3 px-2 text-center" title="Lost">
                    L
                  </th>
                  <th className="py-3 px-2 text-center" title="Goals For">
                    GF
                  </th>
                  <th className="py-3 px-2 text-center" title="Goals Against">
                    GA
                  </th>
                  <th className="py-3 px-2 text-center" title="Goal Difference">
                    GD
                  </th>
                  <th className="py-3 px-2 text-center" title="Match Points (3 for W, 1 for D)">
                    Pts
                  </th>
                  <th
                    className="py-3 px-2 text-center text-amber-300 font-bold"
                    title="Spiritual & Conduct Bonus Points"
                  >
                    BP
                  </th>
                  <th
                    className="py-3 px-3 text-center text-cyan-300 font-black text-sm"
                    title="Total Points = Match Pts + BP"
                  >
                    Total Pts
                  </th>
                  <th className="py-3 px-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#261f4d]">
                {sortedStandingsWithBonus.map((st, pos) => (
                  <tr key={st.id ?? `standing-${pos}`} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-3 font-black text-white">
                      <span
                        className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs font-black ${
                          pos === 0
                            ? "bg-yellow-400 text-black shadow-md shadow-yellow-500/20"
                            : pos === 1
                              ? "bg-gray-300 text-black"
                              : pos === 2
                                ? "bg-amber-700 text-white"
                                : "bg-white/10 text-gray-300"
                        }`}
                      >
                        #{pos + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: st.color || "#00f0ff" }}
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedClubId(st.id)}
                          className="hover:text-cyan-300 font-bold transition text-left cursor-pointer"
                        >
                          {st.name}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-center text-gray-300">{st.played ?? 0}</td>
                    <td className="py-3.5 px-2 text-center text-emerald-400 font-bold">
                      {st.won ?? 0}
                    </td>
                    <td className="py-3.5 px-2 text-center text-gray-400">{st.drawn ?? 0}</td>
                    <td className="py-3.5 px-2 text-center text-rose-400">{st.lost ?? 0}</td>
                    <td className="py-3.5 px-2 text-center text-gray-300">{st.gf ?? 0}</td>
                    <td className="py-3.5 px-2 text-center text-gray-400">{st.ga ?? 0}</td>
                    <td className="py-3.5 px-2 text-center text-cyan-300 font-bold">
                      {st.gd > 0 ? `+${st.gd}` : (st.gd ?? 0)}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-gray-200">
                      {st.points ?? 0}
                    </td>
                    <td className="py-3.5 px-2 text-center font-black text-amber-300">
                      +{st.bonusPoints ?? 0}
                    </td>
                    <td className="py-3.5 px-3 text-center font-black text-cyan-300 text-sm bg-cyan-500/10 rounded-xl">
                      {st.totalPoints ?? 0}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedClubId(st.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        View Club
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
            <span className="font-mono text-[11px]">
              ⭐ BP = Spiritual & Christian Conduct Bonus Points (+1 Scripture Attendance, +1 Fair
              Play Zero Red Card bonus)
            </span>
            <span className="text-[11px] font-bold text-emerald-400">
              Top 2 Qualify for Diocesan Championship Cup
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: SCHEDULE, FIXTURES & DETAILED MATCH CENTER
          ======================================================== */}
      {activeSubTab === "fixtures" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
            <div>
              <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Comprehensive Schedule & Live Match Center
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Filter fixtures by club, status, and click any fixture to open the full Match Center
                timeline, lineups & spiritual report.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={fixtureClubFilter}
                onChange={(e) => setFixtureClubFilter(e.target.value)}
                className="bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Clubs</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <select
                value={fixtureStatusFilter}
                onChange={(e) => setFixtureStatusFilter(e.target.value)}
                className="bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="FINISHED">Finished / Full Time</option>
                <option value="UPCOMING">Upcoming / Scheduled</option>
                <option value="LIVE">Live In Play</option>
              </select>
            </div>
          </div>

          {/* Fixtures List */}
          <div className="space-y-3">
            {filteredFixtures.map((fix) => {
              const h = teams.find((t) => t.id === fix.homeId);
              const a = teams.find((t) => t.id === fix.awayId);
              const isFinished = fix.status === "FINISHED" || fix.status === "COMPLETED";

              return (
                <div
                  key={fix.id}
                  onClick={() => setSelectedMatchCenterId(fix.id)}
                  className="p-4 bg-[#141029] hover:bg-[#181335] border border-[#2e2554] hover:border-cyan-400/50 rounded-2xl transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
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
                      <span className="flex items-center gap-1 text-gray-300">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {fix.venue}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-white group-hover:text-cyan-300 transition">
                        {h?.name || `Club #${fix.homeId}`}
                      </span>

                      <span className="px-3 py-1 rounded-xl bg-[#090615] font-mono font-black text-xs text-amber-300 border border-[#261f4d]">
                        {isFinished ? `${fix.homeScore} - ${fix.awayScore}` : "VS"}
                      </span>

                      <span className="text-sm font-black text-white group-hover:text-cyan-300 transition">
                        {a?.name || `Club #${fix.awayId}`}
                      </span>
                    </div>

                    {fix.scorers && (
                      <div className="text-[11px] text-gray-400 font-mono truncate">
                        ⚽ {fix.scorers}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                    <span
                      className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        isFinished
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : fix.status === "LIVE"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {fix.status || "SCHEDULED"}
                    </span>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black text-cyan-300 font-bold text-xs transition flex items-center gap-1"
                    >
                      <span>Match Center</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: FOOTBALL CLUB & PLAYER PROFILES DIRECTORY
          ======================================================== */}
      {activeSubTab === "clubs" && (
        <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#2e2554] pb-4">
            <div>
              <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Youth Ministry Football Clubs Directory
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Registered community & parish clubs. Click on any club to view its dedicated squad
                roster, coach, and recent form guide.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((club) => (
              <div
                key={club.id}
                className="p-5 bg-[#141029] border border-[#2e2554] hover:border-emerald-400/40 rounded-3xl transition space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-black text-sm shadow-lg font-mono"
                        style={{ backgroundColor: club.color || "#00f0ff" }}
                      >
                        {club.shortCode || club.name.slice(0, 3)}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{club.name}</h4>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {club.homePitch}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold uppercase border border-emerald-500/30">
                      {club.squad?.length || 15}/15 Squad Cap
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[#090615] rounded-xl border border-[#261f4d]">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">
                        Head Coach
                      </span>
                      <span className="font-black text-white truncate block">
                        {club.coach?.name || "Official Coach"}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#090615] rounded-xl border border-[#261f4d]">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">
                        Recent Form
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 font-mono text-[10px] font-black">
                        <span className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center">
                          W
                        </span>
                        <span className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center">
                          W
                        </span>
                        <span className="w-4 h-4 rounded bg-gray-500 text-white flex items-center justify-center">
                          D
                        </span>
                        <span className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center">
                          L
                        </span>
                        <span className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center">
                          W
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#261f4d] flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">
                    Points:{" "}
                    {Number(
                      (club as Record<string, unknown>).points ??
                        (club as Record<string, unknown>).pts,
                    ) || 0}{" "}
                    Pts
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedClubId(club.id)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs uppercase tracking-wide hover:brightness-110 transition cursor-pointer"
                  >
                    View Club Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: LEADERBOARDS & HONORS (GOLDEN BOOT, ASSISTS, GLOVE, FAIR PLAY)
          ======================================================== */}
      {activeSubTab === "leaderboards" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top 3 Metric Podiums: Golden Boot, Playmaker, Golden Glove */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Golden Boot */}
            <div className="bg-[#0b0821] border-2 border-amber-400/30 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h4 className="font-header text-sm font-black text-white uppercase">
                    Golden Boot Scorers
                  </h4>
                </div>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  Goals / Match
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    pos: 1,
                    name: "Kevin Omondi",
                    club: "Samba",
                    goals: 5,
                    matches: 3,
                    ratio: "1.67",
                  },
                  {
                    pos: 2,
                    name: "Levis Wanyama",
                    club: "Royal Rangers",
                    goals: 4,
                    matches: 3,
                    ratio: "1.33",
                  },
                  {
                    pos: 3,
                    name: "Elly Adams Otieno",
                    club: "Young Stars City",
                    goals: 3,
                    matches: 3,
                    ratio: "1.00",
                  },
                  {
                    pos: 4,
                    name: "Raila Junior",
                    club: "Young Stars City",
                    goals: 2,
                    matches: 3,
                    ratio: "0.67",
                  },
                ].map((player) => (
                  <div
                    key={player.name}
                    className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
                        #{player.pos}
                      </span>
                      <div>
                        <h6 className="text-xs font-black text-white">{player.name}</h6>
                        <span className="text-[10px] text-gray-400 font-mono">{player.club}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-sm font-black text-emerald-400">{player.goals} ⚽</span>
                      <span className="text-[9px] text-gray-500 block">{player.ratio} g/m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Playmaker / Assists Leaderboard */}
            <div className="bg-[#0b0821] border-2 border-cyan-400/30 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-header text-sm font-black text-white uppercase">
                    Playmaker Assists
                  </h4>
                </div>
                <span className="text-[10px] text-cyan-300 font-mono font-bold">Key Passes</span>
              </div>

              <div className="space-y-2">
                {[
                  { pos: 1, name: "Levis Wanyama", club: "Royal Rangers", assists: 4, matches: 3 },
                  { pos: 2, name: "George Victor", club: "Royal Rangers", assists: 3, matches: 3 },
                  { pos: 3, name: "Kelvin Mutua", club: "Samba", assists: 2, matches: 3 },
                  { pos: 4, name: "Tonny Odundo", club: "Royal Rangers", assists: 2, matches: 3 },
                ].map((player) => (
                  <div
                    key={player.name}
                    className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-400/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
                        #{player.pos}
                      </span>
                      <div>
                        <h6 className="text-xs font-black text-white">{player.name}</h6>
                        <span className="text-[10px] text-gray-400 font-mono">{player.club}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-sm font-black text-cyan-300">{player.assists} 🎯</span>
                      <span className="text-[9px] text-gray-500 block">
                        {player.matches} matches
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Golden Glove / Clean Sheets */}
            <div className="bg-[#0b0821] border-2 border-emerald-400/30 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-header text-sm font-black text-white uppercase">
                    Golden Glove GK
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono font-bold">
                  Clean Sheets
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    pos: 1,
                    name: "Idi Sebantu",
                    club: "Royal Rangers",
                    cleanSheets: 2,
                    matches: 3,
                    saveRate: "88%",
                  },
                  {
                    pos: 2,
                    name: "Daniel Mwangi",
                    club: "Samba",
                    cleanSheets: 1,
                    matches: 3,
                    saveRate: "79%",
                  },
                  {
                    pos: 3,
                    name: "Samuel Karanja",
                    club: "Mzinga",
                    cleanSheets: 1,
                    matches: 3,
                    saveRate: "75%",
                  },
                  {
                    pos: 4,
                    name: "Brian Kipkemoi",
                    club: "Young Stars City",
                    cleanSheets: 0,
                    matches: 3,
                    saveRate: "68%",
                  },
                ].map((player) => (
                  <div
                    key={player.name}
                    className="p-3 bg-[#141029] rounded-2xl border border-[#2e2554] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-400/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center">
                        #{player.pos}
                      </span>
                      <div>
                        <h6 className="text-xs font-black text-white">{player.name}</h6>
                        <span className="text-[10px] text-gray-400 font-mono">{player.club}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-sm font-black text-emerald-400">
                        {player.cleanSheets} 🧤
                      </span>
                      <span className="text-[9px] text-gray-500 block">
                        {player.saveRate} save %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Christian Sportsmanship & Fair Play Award Table */}
          <div className="bg-[#0b0821] border-2 border-yellow-400/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
              <div>
                <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Christian Sportsmanship & Fair Play Award Table
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ranked by fewest disciplinary card points, scripture memory verse attendance, and
                  referee respect scores.
                </p>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 font-bold uppercase border border-yellow-400/30">
                Official Diocesan Trophy Criteria
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2e2554] text-gray-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Football Club</th>
                    <th className="py-2.5 px-2 text-center">Yellows</th>
                    <th className="py-2.5 px-2 text-center">Reds</th>
                    <th className="py-2.5 px-2 text-center">Card Pts</th>
                    <th className="py-2.5 px-2 text-center">Scripture Verses</th>
                    <th className="py-2.5 px-3 text-right">Fair Play Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#261f4d]">
                  {[
                    {
                      rank: 1,
                      club: "Royal Rangers",
                      yellows: 0,
                      reds: 0,
                      cardPts: 0,
                      verses: "100% (3/3)",
                      rating: "9.9 / 10",
                    },
                    {
                      rank: 2,
                      club: "Samba",
                      yellows: 1,
                      reds: 0,
                      cardPts: 1,
                      verses: "100% (3/3)",
                      rating: "9.5 / 10",
                    },
                    {
                      rank: 3,
                      club: "Mzinga",
                      yellows: 2,
                      reds: 0,
                      cardPts: 2,
                      verses: "85% (2/3)",
                      rating: "8.9 / 10",
                    },
                    {
                      rank: 4,
                      club: "Young Stars City",
                      yellows: 3,
                      reds: 0,
                      cardPts: 3,
                      verses: "80% (2/3)",
                      rating: "8.5 / 10",
                    },
                  ].map((row) => (
                    <tr key={row.club} className="hover:bg-white/5 transition">
                      <td className="py-3 px-3 font-black text-amber-300">#{row.rank}</td>
                      <td className="py-3 px-3 font-bold text-white">{row.club}</td>
                      <td className="py-3 px-2 text-center text-yellow-400">{row.yellows}</td>
                      <td className="py-3 px-2 text-center text-rose-400">{row.reds}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{row.cardPts}</td>
                      <td className="py-3 px-2 text-center text-emerald-400 font-bold">
                        {row.verses}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-cyan-300">
                        {row.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 6: PUBLIC REGISTRATION & CONTACT DESK
          ======================================================== */}
      {activeSubTab === "desk" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Form 1: New Football Club Application */}
          <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-[#2e2554] pb-3">
              <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block">
                For Churches & Youth Ministries
              </span>
              <h4 className="font-header text-base font-black text-white uppercase mt-0.5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                New Football Club Application
              </h4>
            </div>

            <form onSubmit={handleClubAppSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Club Official Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bethany Warriors FC"
                  value={clubAppForm.clubName}
                  onChange={(e) => setClubAppForm({ ...clubAppForm, clubName: e.target.value })}
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Church / Parish Ministry
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. James Parish"
                  value={clubAppForm.parishName}
                  onChange={(e) => setClubAppForm({ ...clubAppForm, parishName: e.target.value })}
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Head Coach
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Coach Name"
                    value={clubAppForm.coachName}
                    onChange={(e) => setClubAppForm({ ...clubAppForm, coachName: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 700 000"
                    value={clubAppForm.phone}
                    onChange={(e) => setClubAppForm({ ...clubAppForm, phone: e.target.value })}
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="club@church.org"
                  value={clubAppForm.contactEmail}
                  onChange={(e) => setClubAppForm({ ...clubAppForm, contactEmail: e.target.value })}
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs uppercase tracking-wide hover:brightness-110 transition shadow cursor-pointer mt-2"
              >
                Submit Club Application
              </button>
            </form>
          </div>

          {/* Form 2: Player Tryout & Interest Form */}
          <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-[#2e2554] pb-3">
              <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block">
                For Athletes & Parents
              </span>
              <h4 className="font-header text-base font-black text-white uppercase mt-0.5 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Player Tryout & Interest Portal
              </h4>
            </div>

            <form onSubmit={handlePlayerTryoutSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Player Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Kiprono"
                  value={playerTryoutForm.playerName}
                  onChange={(e) =>
                    setPlayerTryoutForm({ ...playerTryoutForm, playerName: e.target.value })
                  }
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Player Age
                  </label>
                  <input
                    type="number"
                    min={8}
                    max={25}
                    value={playerTryoutForm.age}
                    onChange={(e) =>
                      setPlayerTryoutForm({ ...playerTryoutForm, age: e.target.value })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                    Preferred Position
                  </label>
                  <select
                    value={playerTryoutForm.preferredPosition}
                    onChange={(e) =>
                      setPlayerTryoutForm({
                        ...playerTryoutForm,
                        preferredPosition: e.target.value,
                      })
                    }
                    className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-2.5 py-2 text-xs text-white outline-none"
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
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Parent Name"
                  value={playerTryoutForm.parentName}
                  onChange={(e) =>
                    setPlayerTryoutForm({ ...playerTryoutForm, parentName: e.target.value })
                  }
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Parent Contact Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+254 700 000 000"
                  value={playerTryoutForm.parentPhone}
                  onChange={(e) =>
                    setPlayerTryoutForm({ ...playerTryoutForm, parentPhone: e.target.value })
                  }
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs uppercase tracking-wide hover:brightness-110 transition shadow cursor-pointer mt-2"
              >
                Submit Player Tryout Form
              </button>
            </form>
          </div>

          {/* Form 3: General Inquiries & Logistics Desk */}
          <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-[#2e2554] pb-3">
              <span className="text-[10px] text-yellow-400 uppercase font-black tracking-wider block">
                Secretariat & Operations
              </span>
              <h4 className="font-header text-base font-black text-white uppercase mt-0.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                Contact & General Inquiries
              </h4>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pastor James"
                  value={contactDeskForm.fullName}
                  onChange={(e) =>
                    setContactDeskForm({ ...contactDeskForm, fullName: e.target.value })
                  }
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-yellow-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Category
                </label>
                <select
                  value={contactDeskForm.category}
                  onChange={(e) =>
                    setContactDeskForm({ ...contactDeskForm, category: e.target.value })
                  }
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Matchday Logistics">Matchday Logistics & Grounds</option>
                  <option value="Sponsorship & Partnership">Sponsorship & Partnership</option>
                  <option value="Media & Press Requests">Media & Press Requests</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@email.com"
                  value={contactDeskForm.email}
                  onChange={(e) =>
                    setContactDeskForm({ ...contactDeskForm, email: e.target.value })
                  }
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Message / Inquiry Details
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter your message..."
                  value={contactDeskForm.message}
                  onChange={(e) =>
                    setContactDeskForm({ ...contactDeskForm, message: e.target.value })
                  }
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wide hover:brightness-110 transition shadow cursor-pointer mt-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: DETAILED MATCH CENTER (PER FIXTURE)
          Header, Timeline Feed, Tactical Formations, Spiritual Report
          ======================================================== */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl max-w-3xl w-full shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="font-header text-base font-black text-white uppercase tracking-wider">
                  Detailed Match Center • Matchweek {selectedMatch.matchweek}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchCenterId(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Match Header with Crests & Score */}
            <div className="p-5 bg-[#0a071b] rounded-2xl border border-[#261f4d] text-center space-y-3">
              <div className="flex items-center justify-center gap-6 sm:gap-12">
                <div className="text-right flex-1">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-black text-sm ml-auto mb-1.5 shadow"
                    style={{ backgroundColor: homeClub?.color || "#00f0ff" }}
                  >
                    {homeClub?.shortCode || "HOM"}
                  </div>
                  <h5 className="text-base font-black text-white">{homeClub?.name}</h5>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Home Side</span>
                </div>

                <div className="px-5 py-2.5 rounded-2xl bg-[#141029] border border-cyan-400/40 font-mono">
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">
                    {selectedMatch.homeScore} - {selectedMatch.awayScore}
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block mt-0.5">
                    {selectedMatch.status || "FINAL RESULT"}
                  </span>
                </div>

                <div className="text-left flex-1">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-black text-sm mr-auto mb-1.5 shadow"
                    style={{ backgroundColor: awayClub?.color || "#ff0077" }}
                  >
                    {awayClub?.shortCode || "AWY"}
                  </div>
                  <h5 className="text-base font-black text-white">{awayClub?.name}</h5>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Away Side</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300 font-mono border-t border-white/5 pt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedMatch.date} • {selectedMatch.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedMatch.venue}
                </span>
                <span className="flex items-center gap-1">
                  👤 Referee: {selectedMatch.referee || "Ian Muli (FIFA Badge)"}
                </span>
              </div>
            </div>

            {/* Spiritual & Fair Play Report */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-2">
              <span className="text-xs font-black text-amber-300 uppercase flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-amber-400" />
                Spiritual & Fair Play Match Report
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Scripture Memory Verification
                  </span>
                  <p className="font-mono text-emerald-400 font-bold">
                    100% Completion (Both Squads)
                  </p>
                  <span className="text-[10px] text-gray-400 block font-serif italic">
                    Recited Philippians 4:13 pre-kickoff.
                  </span>
                </div>
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Referee Sportsmanship Evaluation
                  </span>
                  <p className="font-mono text-cyan-300 font-bold">Rating: 9.8 / 10 (Exemplary)</p>
                  <span className="text-[10px] text-gray-400 block">
                    Clean conduct, zero dissent, respectful referee interaction.
                  </span>
                </div>
              </div>
            </div>

            {/* Minute-by-Minute Timeline Feed */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Minute-by-Minute Match Timeline Feed
              </h5>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {matchTimeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#0a071b] rounded-xl border border-[#261f4d] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-6 rounded-lg bg-cyan-400/20 font-mono font-black text-cyan-300 flex items-center justify-center text-[11px]">
                        {item.minute}'
                      </span>
                      <div>
                        <span className="font-bold text-white block">{item.player}</span>
                        {item.detail && (
                          <span className="text-[10px] text-gray-400 block">{item.detail}</span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.type === "GOAL"
                          ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                          : item.type === "YELLOW_CARD"
                            ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                            : item.type === "RED_CARD"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {item.type.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#2e2554]">
              <button
                type="button"
                onClick={() => setSelectedMatchCenterId(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Match Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: DEDICATED CLUB PROFILE VIEW
          Overview, Stadium, Squad Categorized by Position, Form Guide
          ======================================================== */}
      {activeClubProfile && selectedClubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-[#100c2a] border-2 border-emerald-400/50 rounded-3xl max-w-3xl w-full shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-black text-sm shadow"
                  style={{ backgroundColor: activeClubProfile.color || "#00f0ff" }}
                >
                  {activeClubProfile.shortCode || "CLB"}
                </div>
                <div>
                  <h4 className="font-header text-lg font-black text-white uppercase">
                    {activeClubProfile.name} Official Club Profile
                  </h4>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {activeClubProfile.homePitch}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClubId(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Club Background & Head Coach Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#0a071b] rounded-xl border border-[#261f4d] space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">
                  Head Coach
                </span>
                <span className="font-black text-white">
                  {activeClubProfile.coach?.name || "Official Coach"}
                </span>
                <span className="text-[10px] text-emerald-400 block">
                  Formation: 4-3-3 Attacking
                </span>
              </div>
              <div className="p-3 bg-[#0a071b] rounded-xl border border-[#261f4d] space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">
                  Club Colors
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: activeClubProfile.color }}
                  />
                  <span className="font-mono text-gray-300 font-bold">
                    {activeClubProfile.color}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 block font-mono">
                  Short: {activeClubProfile.shortCode}
                </span>
              </div>
              <div className="p-3 bg-[#0a071b] rounded-xl border border-[#261f4d] space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">
                  Recent 5 Matches
                </span>
                <div className="flex items-center gap-1 mt-1 font-mono text-[10px] font-black">
                  <span className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center">
                    W
                  </span>
                  <span className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center">
                    W
                  </span>
                  <span className="w-4 h-4 rounded bg-gray-500 text-white flex items-center justify-center">
                    D
                  </span>
                  <span className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center">
                    L
                  </span>
                  <span className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center">
                    W
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 block">W-W-D-L-W (13 Pts)</span>
              </div>
            </div>

            {/* Categorized Squad Roster: GK, DEF, MID, FWD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black uppercase text-gray-300">
                  Certified Squad Roster ({activeClubProfile.squad?.length || 0} Players)
                </h5>
                <span className="text-[10px] text-gray-500 font-mono">15-Player Cap Compliant</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {(activeClubProfile.squad || []).map((player: SquadMember, idx: number) => (
                  <div
                    key={`${player.name}-${idx}`}
                    onClick={() => {
                      setSelectedPlayerModal({
                        name: player.name,
                        club: activeClubProfile.name,
                        number: player.number,
                        position: player.position,
                        photoUrl: player.photoUrl,
                      });
                    }}
                    className="p-2.5 bg-[#0a071b] hover:bg-[#150f38] border border-[#261f4d] hover:border-cyan-400/40 rounded-xl transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-400/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        #{player.number || idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white truncate block">
                          {player.name}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono font-bold">
                          {player.position || "MID"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 hover:text-white">View ➔</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#2e2554]">
              <button
                type="button"
                onClick={() => setSelectedClubId(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: INDIVIDUAL PLAYER STATISTICS PROFILE
          ======================================================== */}
      {selectedPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                Player Statistics Profile
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPlayerModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a071b] rounded-2xl border border-[#261f4d]">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow shrink-0 bg-[#161138] flex items-center justify-center font-mono font-black text-lg text-cyan-300">
                {selectedPlayerModal.photoUrl ? (
                  <img
                    src={selectedPlayerModal.photoUrl}
                    alt={selectedPlayerModal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  `#${selectedPlayerModal.number || 10}`
                )}
              </div>
              <div>
                <h5 className="text-base font-black text-white">{selectedPlayerModal.name}</h5>
                <span className="text-xs text-gray-400 font-mono block">
                  {selectedPlayerModal.club}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold uppercase mt-1 inline-block">
                  {selectedPlayerModal.position || "MID"}
                </span>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                <span className="text-[9px] text-gray-500 uppercase font-bold block">Goals</span>
                <span className="text-base font-black text-emerald-400">4</span>
              </div>
              <div className="p-2.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                <span className="text-[9px] text-gray-500 uppercase font-bold block">Assists</span>
                <span className="text-base font-black text-cyan-300">3</span>
              </div>
              <div className="p-2.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                <span className="text-[9px] text-gray-500 uppercase font-bold block">Matches</span>
                <span className="text-base font-black text-white">4</span>
              </div>
              <div className="p-2.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                <span className="text-[9px] text-gray-500 uppercase font-bold block">Yellows</span>
                <span className="text-base font-black text-yellow-400">0</span>
              </div>
              <div className="p-2.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                <span className="text-[9px] text-gray-500 uppercase font-bold block">Reds</span>
                <span className="text-base font-black text-rose-400">0</span>
              </div>
              <div className="p-2.5 bg-[#0a071b] rounded-xl border border-[#261f4d]">
                <span className="text-[9px] text-gray-500 uppercase font-bold block">
                  MVP Awards
                </span>
                <span className="text-base font-black text-amber-300">1</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-[#2e2554]">
              <button
                type="button"
                onClick={() => setSelectedPlayerModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: LEAGUE DOCUMENTS & STATUTES VIEWER
          ======================================================== */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-[#100c2a] border-2 border-indigo-400/50 rounded-3xl max-w-2xl w-full shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="font-header text-base font-black text-white uppercase flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                {activeDocModal === "constitution"
                  ? "Official Football League Constitution (Statutes)"
                  : activeDocModal === "rulebook"
                    ? "Official League Rulebook 2026/2027"
                    : activeDocModal === "fairplay"
                      ? "Christian Sportsmanship & Fair Play Guidelines"
                      : "Parental Consent & Medical Emergency Waiver"}
              </h4>
              <button
                type="button"
                onClick={() => setActiveDocModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#0a071b] rounded-2xl border border-[#261f4d] text-xs text-gray-300 space-y-3 font-mono leading-relaxed max-h-72 overflow-y-auto">
              {activeDocModal === "constitution" && (
                <>
                  <p className="font-bold text-white uppercase">ARTICLE I: TITLE & JURISDICTION</p>
                  <p>
                    The M-Pesa Sunday League eFootball Championship is founded under the authority
                    of the Diocesan Youth Council and M-Pesa Foundation Academy sports framework.
                  </p>
                  <p className="font-bold text-white uppercase">ARTICLE II: GOVERNING BOARD</p>
                  <p>
                    The League is led by a 7-member Supreme Council comprising President, Deputy
                    President, Register & Regulations Manager, Match Officiating Programmes Manager,
                    Records & Files Manager, Technological Manager, and Assistant Technological
                    Manager.
                  </p>
                  <p className="font-bold text-white uppercase">
                    ARTICLE III: AFFILIATION & MEMBERSHIP
                  </p>
                  <p>
                    All participating football clubs must maintain official youth parish
                    accreditation, a certified 15-player squad list, and adhere to Christian conduct
                    principles.
                  </p>
                </>
              )}
              {activeDocModal === "rulebook" && (
                <>
                  <p className="font-bold text-white uppercase">SECTION 1: MATCH DURATION & BALL</p>
                  <p>
                    Matches consist of two 45-minute halves with a 15-minute halftime interval.
                    Official FIFA size 5 match balls are provided by the league stewards.
                  </p>
                  <p className="font-bold text-white uppercase">SECTION 2: ROSTER & SQUAD CAPS</p>
                  <p>
                    Clubs are bound to a strict 15-player squad limit. Only registered and approved
                    players on the team sheet may participate in official matches.
                  </p>
                  <p className="font-bold text-white uppercase">SECTION 3: POINTS & TIEBREAKERS</p>
                  <p>
                    3 points for a win, 1 point for a draw, 0 points for a loss. Additional bonus
                    points (+1) are awarded for scripture recitation and fair play conduct.
                  </p>
                </>
              )}
              {activeDocModal === "fairplay" && (
                <>
                  <p className="font-bold text-white uppercase">
                    PREAMBLE: CHRISTIAN SPORTSMANSHIP
                  </p>
                  <p>
                    "Let your gentleness be evident to all. The Lord is near." — Philippians 4:5
                  </p>
                  <p className="font-bold text-white uppercase">CONDUCT POINT SYSTEM</p>
                  <p>
                    1. Teams maintaining zero red cards per matchweek receive +1 Fair Play bonus
                    point.
                  </p>
                  <p>
                    2. Pre-match scripture recitation and joint prayer award +1 Spiritual Conduct
                    bonus point to the official league ledger.
                  </p>
                  <p>
                    3. Dissent toward match officials results in disciplinary review by the Supreme
                    Council.
                  </p>
                </>
              )}
              {activeDocModal === "consent" && (
                <>
                  <p className="font-bold text-white uppercase">
                    PARENTAL CONSENT & EMERGENCY MEDICAL RELEASE
                  </p>
                  <p>
                    I hereby grant permission for my son/daughter to participate in the M-Pesa
                    Sunday League competitive fixtures.
                  </p>
                  <p>
                    I certify that the player is in good physical health and free from undisclosed
                    medical conditions that would impede athletic participation.
                  </p>
                  <p>
                    In case of emergency, I authorize league first responders and appointed stewards
                    to administer immediate medical aid.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2e2554]">
              <span className="text-[10px] text-gray-500 font-mono">
                Official Certified Document
              </span>
              <button
                type="button"
                onClick={() => {
                  showToast("✓ Document saved to downloads folder!");
                  setActiveDocModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: READ NEWS ARTICLE MODAL
          ======================================================== */}
      {readingNewsArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-[#100c2a] border-2 border-cyan-400/50 rounded-3xl max-w-2xl w-full shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                {readingNewsArticle.category.replace("_", " ")}
              </span>
              <button
                type="button"
                onClick={() => setReadingNewsArticle(null)}
                className="text-gray-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-header text-xl font-black text-white">
                {readingNewsArticle.title}
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono border-b border-white/5 pb-2">
                <span>By {readingNewsArticle.author}</span>
                <span>•</span>
                <span>{readingNewsArticle.date}</span>
                <span>•</span>
                <span>{readingNewsArticle.readTime}</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-sans">
                {readingNewsArticle.content}
              </p>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#2e2554]">
              <button
                type="button"
                onClick={() => setReadingNewsArticle(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
