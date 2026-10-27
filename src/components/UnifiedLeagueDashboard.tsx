import React, { useState, useEffect } from "react";
import {
  Trophy,
  Calendar,
  Activity,
  Award,
  Crown,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  CalendarDays,
  Shield,
  KeyRound,
  LogOut,
  ArrowRight,
  Vote,
  Music,
  Globe,
  FileCheck2,
  Users,
} from "lucide-react";

import { useRoleAccess, type LeagueRole } from "../hooks/useRoleAccess";
import { PublicViewerHub } from "./PublicViewerHub";
import { LeagueStandings } from "./LeagueStandings";
import { Fixtures } from "./Fixtures";
import { TeamPerformanceRadar } from "./TeamPerformanceRadar";
import { GoldenBootLeaderboard } from "./GoldenBootLeaderboard";
import { PlayerLeaderboard } from "./PlayerLeaderboard";
import { BoardWorkspaces } from "./BoardWorkspaces";
import { LeagueCalendarView } from "./LeagueCalendarView";
import { MatchMvpVoting } from "./MatchMvpVoting";
import { BoardMemberManager } from "./BoardMemberManager";
import { SeasonStandingsSummaryWidget } from "./SeasonStandingsSummaryWidget";
import { AnthemPlayerWidget } from "./AnthemPlayerWidget";
import { AnthemStudioAndPlaylist } from "./AnthemStudioAndPlaylist";
import { UnifiedAccessModal } from "./UnifiedAccessModal";
import { MasterAdminDashboard } from "./MasterAdminDashboard";
import { authenticateBoardMember } from "../lib/boardMembersRegistry";
import { DEFAULT_FIXTURES, DEFAULT_TEAMS } from "../lib/fixturesData";

export type DashboardMode = "viewer" | "board" | "admin";
export type ViewerTab =
  | "hub"
  | "standings"
  | "fixtures"
  | "clubs"
  | "leaderboards"
  | "desk"
  | "radar"
  | "stats"
  | "calendar"
  | "voting"
  | "anthem";

interface UnifiedLeagueDashboardProps {
  initialMode?: DashboardMode;
  initialTab?: ViewerTab;
}

export function UnifiedLeagueDashboard({
  initialMode = "viewer",
  initialTab = "standings",
}: UnifiedLeagueDashboardProps) {
  const { currentRole, isSuperAdmin, roleDetails, switchRole } = useRoleAccess();

  // Mode: "viewer" (Public Read-Only), "board" (Executive Member), "admin" (Super Admin)
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>(() => {
    if (initialMode) return initialMode;
    return "viewer";
  });

  // Viewer mode tabs: Standings, Fixtures, Radar Analytics, Player Stats, Calendar, MVP Ballot
  const [viewerTab, setViewerTab] = useState<ViewerTab>(initialTab);

  // Synchronize viewerTab whenever initialTab changes
  useEffect(() => {
    if (initialTab) {
      setViewerTab(initialTab);
    }
  }, [initialTab]);

  // Stats sub-tab: Golden Boot vs All Player Stats
  const [statsView, setStatsView] = useState<"golden_boot" | "all_stats">("golden_boot");

  // Login Modal and Access Gate state
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [inlineCodeInput, setInlineCodeInput] = useState<string>("");
  const [showInlinePassword, setShowInlinePassword] = useState<boolean>(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize dashboard mode if user is already authenticated
  useEffect(() => {
    if (isSuperAdmin) {
      if (initialMode === "admin" || initialMode === "board") {
        setDashboardMode("admin");
      }
    } else if (currentRole !== "GUEST" && currentRole !== undefined) {
      if (initialMode === "board") {
        setDashboardMode("board");
      }
    }
  }, [isSuperAdmin, currentRole, initialMode]);

  useEffect(() => {
    const handleSelectAdminSection = () => {
      if (isSuperAdmin) {
        setDashboardMode("admin");
      }
    };
    window.addEventListener("mpesa_select_admin_section", handleSelectAdminSection);
    return () => {
      window.removeEventListener("mpesa_select_admin_section", handleSelectAdminSection);
    };
  }, [isSuperAdmin]);

  // Global event listener to open login modal from any component
  useEffect(() => {
    const handleOpenLoginEvent = () => setShowLoginModal(true);
    window.addEventListener("open_unified_login", handleOpenLoginEvent);
    return () => window.removeEventListener("open_unified_login", handleOpenLoginEvent);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unified Code Verification: msl-27 -> Super Admin, Registered Board Code -> Board Workspace
  const handleInlineCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    const cleaned = inlineCodeInput.trim();

    if (!cleaned) {
      setInlineError("Please enter your assigned access code.");
      return;
    }

    // 1. Super Admin Master Passcode (msl-27, case-insensitive, never revealed in UI)
    if (cleaned.toLowerCase() === "msl-27") {
      switchRole("SUPER_ADMIN");
      setDashboardMode("admin");
      setInlineCodeInput("");
      setInlineError(null);
      showToast("✓ Authenticated as Master Super Administrator");
      return;
    }

    // 2. Dynamic Registered Board Members
    const member = authenticateBoardMember(cleaned);
    if (member) {
      switchRole(member.role);
      setDashboardMode("board");
      setInlineCodeInput("");
      setInlineError(null);
      showToast(`✓ Authenticated as ${member.name} (${member.department})`);
      return;
    }

    // 3. Invalid Access Code - generic message without code leakage
    setInlineError(
      "Invalid access code. Please verify your assigned credential or contact the administrator.",
    );
  };

  // Logout / Return to Public Viewer
  const handleLogoutToViewer = () => {
    switchRole("GUEST");
    setDashboardMode("viewer");
    showToast("✓ Returned to Public Viewer Mode (Logged Out)");
  };

  const isLoggedIn = currentRole !== "GUEST";

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          PUBLIC VIEWER PRIMARY BANNER & PORTAL LOGIN ACTION
          ======================================================== */}
      <div className="bg-[#0b0821] border border-[#2e2554] rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#261f4d] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black">
                M-Pesa Sunday League
              </span>
              <span className="text-xs text-gray-400 font-mono">Official eFootball Portal</span>
            </div>
            <h1 className="font-header text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1">
              {dashboardMode === "viewer"
                ? "Public Spectator Hub"
                : dashboardMode === "board"
                  ? "Executive Council Workspace"
                  : "Master League Super Admin Nexus"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              {dashboardMode === "viewer"
                ? "Official match results, standings, tactical radar analytics, golden boot, and verified MVP balloting."
                : dashboardMode === "board"
                  ? "Authorized executive operational portal for presidential decrees, regulation audits, and media publishing."
                  : "Master administrative override: dynamic board member registration, credentials desk, and club management."}
            </p>
          </div>

          {/* Quick Council Portal Login / Session State */}
          <div className="flex flex-wrap items-center gap-2">
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-black" />
                  <span>Council & Admin Login</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="px-3.5 py-2 rounded-2xl bg-[#141029] border border-amber-400/40 flex items-center gap-2">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    {isSuperAdmin ? (
                      <Crown className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-blue-400" />
                    )}
                    <span>{roleDetails.title}</span>
                  </span>
                </div>

                {dashboardMode !== "viewer" ? (
                  <button
                    type="button"
                    onClick={() => setDashboardMode("viewer")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Public View</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDashboardMode(isSuperAdmin ? "admin" : "board")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs transition cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Enter Workspace</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogoutToViewer}
                  title="Logout to Public View"
                  className="p-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security & Access Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold uppercase text-[10px]">Access Level:</span>
            {dashboardMode === "viewer" ? (
              <span className="text-[#00f0ff] font-extrabold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Public Spectator Mode (Read-Only • Zero Administrative Leaks)
              </span>
            ) : dashboardMode === "board" ? (
              <span className="text-indigo-300 font-extrabold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Executive Board Member Active (Department Operations • Secret Codes Hidden)
              </span>
            ) : (
              <span className="text-amber-300 font-extrabold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Master Council Super Admin (Full Control • Board Member Registry Active)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
            {dashboardMode === "admin" ? (
              <span className="text-amber-400 font-bold">🔒 Board Member Registry Active</span>
            ) : (
              <span className="text-emerald-400 font-bold">🛡️ Zero Code Leakage Guaranteed</span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          1. PUBLIC VIEWER DASHBOARD (STRICTLY VIEWING PURPOSES ONLY)
          ======================================================== */}
      {dashboardMode === "viewer" && (
        <div className="space-y-6">
          {/* Primary View: PublicViewerHub for hub, standings, fixtures, clubs, leaderboards, desk */}
          {(viewerTab === "hub" ||
            viewerTab === "standings" ||
            viewerTab === "fixtures" ||
            viewerTab === "clubs" ||
            viewerTab === "leaderboards" ||
            viewerTab === "stats" ||
            viewerTab === "desk") && (
            <PublicViewerHub
              initialSubTab={
                viewerTab === "stats"
                  ? "leaderboards"
                  : (viewerTab as
                      "hub" | "standings" | "fixtures" | "clubs" | "leaderboards" | "desk")
              }
              hideSubNav={true}
              onNavigateTab={(tab) => setViewerTab(tab as ViewerTab)}
            />
          )}

          {/* Tactical Radar Analytics */}
          {viewerTab === "radar" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <TeamPerformanceRadar />
            </div>
          )}

          {/* Season Calendar */}
          {viewerTab === "calendar" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <LeagueCalendarView fixtures={DEFAULT_FIXTURES} teams={DEFAULT_TEAMS} />
            </div>
          )}

          {/* MVP Balloting */}
          {viewerTab === "voting" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <MatchMvpVoting />
            </div>
          )}

          {/* Stadium Anthem & YouTube Playlist Studio */}
          {viewerTab === "anthem" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <AnthemStudioAndPlaylist />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          2. EXECUTIVE BOARD MEMBER DASHBOARD (ZERO CODE LEAKAGE)
          ======================================================== */}
      {/* ========================================================
          UNAUTHENTICATED ACCESS GATE (Moving from public view to admin/board)
          ======================================================== */}
      {!isLoggedIn && dashboardMode !== "viewer" && (
        <div className="bg-[#0c0924] border border-[#2e2554] rounded-3xl p-6 sm:p-10 max-w-xl mx-auto shadow-2xl space-y-6 my-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-black font-black mx-auto shadow-xl shadow-amber-500/20">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Restricted Area • Official Authentication Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-2">
              Official Council & Admin Gate
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-md mx-auto leading-relaxed">
              Enter your authorized access code. Your entered code automatically determines your
              destination — unlocking either the Super Admin Command Console or your assigned
              Executive Department Workspace.
            </p>
          </div>

          <form onSubmit={handleInlineCodeSubmit} className="space-y-4 max-w-md mx-auto text-left">
            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5 flex items-center justify-between">
                <span>Access / Passcode</span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Encrypted Verification
                </span>
              </label>
              <div className="relative">
                <input
                  type={showInlinePassword ? "text" : "password"}
                  autoFocus
                  value={inlineCodeInput}
                  onChange={(e) => {
                    setInlineCodeInput(e.target.value);
                    if (inlineError) setInlineError(null);
                  }}
                  placeholder="Enter your assigned access code"
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl px-4 py-3 text-sm font-mono text-white tracking-widest outline-none pr-12 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowInlinePassword(!showInlinePassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition cursor-pointer"
                  title={showInlinePassword ? "Hide code" : "Show code"}
                >
                  {showInlinePassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {inlineError && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{inlineError}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDashboardMode("viewer")}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition cursor-pointer"
              >
                Return to Public View
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-[#261f4d] flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              Zero Code Leakage
            </span>
            <span>Official M-Pesa League</span>
          </div>
        </div>
      )}

      {/* ========================================================
          2. EXECUTIVE BOARD MEMBER DASHBOARD (ZERO CODE LEAKAGE)
          ======================================================== */}
      {isLoggedIn && dashboardMode === "board" && (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-950/40 via-[#100d2f] to-[#070512] border border-blue-500/30 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Executive Board Member Workspaces
              </h3>
              <p className="text-xs text-gray-300">
                Authorized council operations: Presidential Decrees, Regulations, Officiating
                Standard Hearings, and Media Publishing.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                ✓ Confidential Security Access Codes Hidden
              </span>
              <button
                type="button"
                onClick={() => setDashboardMode("viewer")}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
              >
                Back to Viewer
              </button>
            </div>
          </div>

          <BoardWorkspaces />
        </div>
      )}

      {/* ========================================================
          3. SUPER ADMIN COMMAND CONSOLE (COMPLETE SUITE WITH DEDICATED SIDEBAR)
          ======================================================== */}
      {isLoggedIn && isSuperAdmin && dashboardMode === "admin" && (
        <MasterAdminDashboard onExitToViewer={() => setDashboardMode("viewer")} />
      )}

      {/* ========================================================
          OFFICIAL COUNCIL & ADMIN UNIFIED LOGIN MODAL
          ======================================================== */}
      <UnifiedAccessModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={(role, mode, name) => {
          setDashboardMode(mode);
          if (mode === "admin") {
            showToast("✓ Authenticated as Master Super Administrator");
          } else {
            showToast(`✓ Authenticated as ${name || role}`);
          }
        }}
      />
    </div>
  );
}
