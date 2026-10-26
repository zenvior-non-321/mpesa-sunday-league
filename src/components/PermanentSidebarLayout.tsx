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
            name: "Bramuel Amirah",
            role: "President",
            responsibilities: [
              "Provides overall leadership and direction for the league.",
              "Oversees the work of the administrative crew and ensures rules are followed.",
              "Leads meetings and helps resolve major disputes.",
            ],
          },
          {
            name: "Joseph Kamande",
            role: "Deputy President",
            responsibilities: [
              "Assists the President in managing league activities.",
              "Acts on behalf of the President when necessary.",
              "Monitors the progress of different departments.",
            ],
          },
          {
            name: "Cheryl Cosmas",
            role: "Register and Regulations Manager",
            responsibilities: [
              "Maintains accurate records of registered clubs, players, coaches, and managers.",
              "Ensures that registration requirements and league regulations are followed.",
              "Handles eligibility checks and reports violations.",
            ],
          },
          {
            name: "Mitchelle Muthoni",
            role: "Match Officiating Programmes Manager",
            responsibilities: [
              "Organises match officiating schedules and assigns referees to fixtures.",
              "Ensures matches are officiated fairly and impartially.",
              "Coordinates refereeing standards and addresses officiating concerns.",
            ],
          },
          {
            name: "Tonnie Mark Odundo",
            role: "Records and File Manager",
            responsibilities: [
              "Maintains official league documents, reports, fixtures, results, standings, and disciplinary records.",
              "Ensures important league information is properly organised and accessible.",
              "Keeps an accurate record of administrative decisions.",
            ],
          },
          {
            name: "Trady Lewis",
            role: "Technological Manager",
            responsibilities: [
              "Oversees the league’s digital platforms, website, and online updates.",
              "Publishes fixtures, results, standings, announcements, and match reports.",
              "Ensures that league information is presented accurately and promptly.",
            ],
          },
          {
            name: "Ahmed Kusow",
            role: "Assistant Technological Manager",
            responsibilities: [
              "Supports the Technological Manager in updating and maintaining digital platforms.",
              "Assists in publishing match reports, results, and announcements.",
              "Helps ensure continuity of digital operations.",
            ],
          },
        ]);
      }
    }
  }, []);

  // Public viewer features: strictly limited to League Table, Teams, Fixtures, Radar, Calendar, Voting, and Comments
  const publicNavItems = [
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
  ];

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
  // Default to 'public' during SSR and initial hydration to prevent server/client HTML divergence
  const activeRbacRole: RbacRole = useMemo(() => {
    if (!isMounted) return "public";
    if (isSuperAdmin || rbacUser?.role === "admin") return "admin";
    if ((currentRole !== "GUEST" && currentRole) || rbacUser?.role === "board") return "board";
    return "public";
  }, [isMounted, isSuperAdmin, currentRole, rbacUser]);

  // Dynamically render sidebar menu items strictly based on role:
  // - Admin: Master Command, YouTube Studio, Public Suite, Honours, Registration Desk
  // - Board: Council Workspace, YouTube Studio, Public Suite, Honours
  // - Public: Strictly League Table, Teams, Fixtures, Radar, Calendar, Voting, and Comments
  const allNavItems = useMemo(() => {
    if (activeRbacRole === "admin") {
      return [
        {
          to: "/workspaces",
          label: "👑 Master Command",
          icon: Crown,
          badge: "Super Admin",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
        },
        {
          to: "/anthem",
          label: "YouTube & Playlist Studio",
          icon: Music,
          badge: "Media Studio",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
        ...publicNavItems,
        {
          to: "/leaderboard",
          label: "Honours & Golden Boot",
          icon: Award,
          badge: "Records",
          badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
        },
        {
          to: "/desk",
          label: "Registration Desk",
          icon: FileCheck2,
          badge: "Forms",
          badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
        },
      ];
    }

    if (activeRbacRole === "board") {
      return [
        {
          to: "/workspaces",
          label: "👔 Council Workspace",
          icon: Briefcase,
          badge: "Board",
          badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30",
        },
        {
          to: "/anthem",
          label: "YouTube & Playlist Studio",
          icon: Music,
          badge: "Media Studio",
          badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
        },
        ...publicNavItems,
        {
          to: "/leaderboard",
          label: "Honours & Golden Boot",
          icon: Award,
          badge: "Records",
          badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
        },
      ];
    }

    // Public Spectator role
    return publicNavItems;
  }, [activeRbacRole]);

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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#080517] border-r border-[#261f4d] shadow-2xl flex flex-col justify-between p-5 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-5">
          {/* Brand & Collapse Header */}
          <div className="flex items-center justify-between border-b border-[#261f4d] pb-4">
            <Link to="/standings" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-400 p-1 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition">
                <img
                  src="/mpesa-academy-icon.png"
                  alt="M-Pesa Academy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-header text-lg font-black text-white leading-none uppercase">
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

          {/* Navigation Links — ALL FEATURES INCLUDED */}
          <div className="space-y-1 text-xs">
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider px-3 block mb-1">
              Championship Hub
            </span>

            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-lg shadow-cyan-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-[#00f0ff]"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
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

            {/* Public League Officials Directory Button */}
            <button
              type="button"
              onClick={() => setShowOfficialsModal(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-purple-400" />
                <span>League Officials</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold border bg-purple-500/20 text-purple-300 border-purple-500/30">
                Directory
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
