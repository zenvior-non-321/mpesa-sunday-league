import React, { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Trophy,
  Calendar,
  Award,
  Crown,
  User,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
  Shield,
  Briefcase,
  Camera,
} from "lucide-react";

interface PermanentSidebarLayoutProps {
  children: React.ReactNode;
}

export function PermanentSidebarLayout({ children }: PermanentSidebarLayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Don't render sidebar shell on pure index redirect
  const isIndex = currentPath === "/";

  // Desktop defaults to open as permanent sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  if (isIndex) {
    return <>{children}</>;
  }

  const navItems = [
    {
      to: "/workspaces",
      label: "👑 Master Command",
      icon: Crown,
      badge: "Admin",
      badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    },
    {
      to: "/standings",
      label: "Standings",
      icon: Trophy,
      badge: "Live",
      badgeColor: "bg-cyan-400/20 text-[#00f0ff] border-cyan-400/30",
    },
    {
      to: "/leaderboard",
      label: "Player Stats",
      icon: Award,
      badge: "Golden Boot",
      badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
    },
    {
      to: "/fixtures",
      label: "Fixtures",
      icon: Calendar,
      badge: "Schedule",
      badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
    },
    {
      to: "/upload-photo",
      label: "Upload Photo",
      icon: Camera,
      badge: "Player Portal",
      badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30",
    },
    {
      to: "/profile",
      label: "My Profile",
      icon: User,
    },
  ];

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
        <div className="space-y-6">
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
              className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
            >
              <PanelLeftClose className="w-5 h-5 text-[#00f0ff]" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider px-3 block mb-1">
              League Navigation
            </span>

            {navItems.map((item) => {
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
          </div>

          {/* Quick Hub Switcher Capsule */}
          <div className="p-3.5 bg-gradient-to-r from-[#140e2f] to-[#1c1445] border border-[#2e2554] rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-white">Full League Hub</span>
            </div>
            <p className="text-[11px] text-gray-300">
              Interactive match feeds, audio anthem player, and 7-tier official workspaces.
            </p>
            <a
              href="/league.html"
              className="inline-flex items-center gap-1.5 text-xs text-[#00f0ff] font-bold hover:underline pt-1"
            >
              <span>Launch Full League Experience</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#261f4d]">
          <a
            href="/league.html"
            className="w-full bg-[#141029] hover:bg-[#1f1744] border border-[#2e2554] text-gray-200 hover:text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <span>Switch to League Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00f0ff]" />
          </a>
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
            <span className="text-[11px] uppercase tracking-wider font-extrabold hidden md:inline">
              Sidebar
            </span>
          </button>
        </div>
      )}

      {/* Main Content Area with Responsive Sidebar Offset */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:pl-72" : "pl-0"
        }`}
      >
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-[#070512]/95 backdrop-blur-xl border-b border-[#261f4d] px-4 sm:px-6 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Permanent Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-md ${
                  isSidebarOpen
                    ? "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-cyan-500/20"
                    : "bg-[#141029] hover:bg-[#1e1744] border border-[#2e2554] text-white hover:border-[#00f0ff]"
                }`}
                title="Toggle Fixed League Sidebar"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeft className="w-4 h-4 text-[#00f0ff]" />
                )}
                <span className="hidden sm:inline">
                  {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                </span>
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  M-Pesa Academy
                </span>
                <span className="text-gray-500">•</span>
                <span className="font-header text-sm font-extrabold uppercase text-white">
                  Sunday League <span className="text-[#00f0ff]">eFootball</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/standings"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentPath === "/standings"
                    ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Standings
              </Link>
              <Link
                to="/fixtures"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentPath === "/fixtures"
                    ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Fixtures
              </Link>
              <Link
                to="/leaderboard"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentPath === "/leaderboard"
                    ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Player Stats
              </Link>
              <Link
                to="/upload-photo"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentPath === "/upload-photo"
                    ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Upload Photo
              </Link>
              <a
                href="/league.html"
                className="bg-gradient-to-r from-[#e6007e] to-purple-600 hover:brightness-110 text-white font-black px-3.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-pink-500/20"
              >
                <span>Full League App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </header>

        {/* Route Page Contents */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
