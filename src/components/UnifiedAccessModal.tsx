import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  Lock,
  UserCheck,
  Users,
  Compass,
} from "lucide-react";
import { useRoleAccess, type LeagueRole } from "../hooks/useRoleAccess";
import { authenticateWithRbac } from "../lib/rbacSystem";

interface UnifiedAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (role: LeagueRole, mode: "admin" | "board" | "viewer", memberName?: string) => void;
}

export function UnifiedAccessModal({ isOpen, onClose, onSuccess }: UnifiedAccessModalProps) {
  const { switchRole } = useRoleAccess();
  const [activeTab, setActiveTab] = useState<"staff" | "spectator">("staff");
  const [selectedOffice, setSelectedOffice] = useState<string>("executive");
  const [accessCredential, setAccessCredential] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = accessCredential.trim();

    if (!cleaned) {
      setError("Please enter your assigned authorization passkey.");
      return;
    }

    setIsSubmitting(true);

    // Authenticate via secure RBAC verification
    const result = authenticateWithRbac(cleaned);

    if (result.success && result.user) {
      const user = result.user;
      switchRole(user.leagueRole);

      if (onSuccess) {
        onSuccess(
          user.leagueRole,
          user.role === "admin" ? "admin" : user.role === "board" ? "board" : "viewer",
          user.displayName,
        );
      }

      setAccessCredential("");
      setIsSubmitting(false);
      onClose();
      return;
    }

    setIsSubmitting(false);
    setError(
      result.error ||
        "Invalid authorization credentials. Please verify your confidential passkey or contact the League Operations Secretariat.",
    );
  };

  const handleSpectatorEnter = () => {
    switchRole("GUEST");
    if (onSuccess) {
      onSuccess("GUEST", "viewer", "Spectator / Student");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e0927] border border-[#3b2d6e] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branded Academy Header with School Crest */}
        <div className="flex items-center gap-3.5 border-b border-[#261e4f] pb-4">
          <img
            src="/mpesa-academy-logo.svg"
            alt="M-Pesa Foundation Academy Crest"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-md"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              M-Pesa Foundation Academy
            </span>
            <h3 className="font-header text-lg font-black text-white uppercase tracking-wide">
              League Management Portal
            </h3>
            <span className="text-[11px] text-gray-400">
              Official Sports Management & Records Gateway
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#140f35] rounded-2xl border border-[#2e2554]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("staff");
              setError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "staff"
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md shadow-amber-400/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Staff Sign-In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("spectator");
              setError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "spectator"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Public Spectator</span>
          </button>
        </div>

        {/* TAB 1: OFFICIAL STAFF AUTHENTICATION */}
        {activeTab === "staff" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5">
                Authorized Department / Office
              </label>
              <select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                className="w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
              >
                <option value="executive">Executive Council & League Administration</option>
                <option value="referees">Match Officiating & Referee Bench</option>
                <option value="technical">Technical Bench & Pia Coaches</option>
                <option value="records">Records & Disciplinary Desk</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5 flex items-center justify-between">
                <span>Confidential Authorization Passkey</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Protected Gateway
                </span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  value={accessCredential}
                  onChange={(e) => {
                    setAccessCredential(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your authorization passkey"
                  className="w-full bg-[#161033] border border-[#3b2d6e] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl px-4 py-3 text-sm text-white outline-none pr-12 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition cursor-pointer"
                  title={showPassword ? "Hide passkey" : "Show passkey"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Authorize & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PUBLIC SPECTATOR & STUDENT ACCESS */}
        {activeTab === "spectator" && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-cyan-950/20 border border-cyan-400/30 rounded-2xl space-y-2 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto" />
              <h4 className="text-white font-bold text-sm uppercase">
                Open Spectator & Student Viewer
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Explore real-time match schedules, certified league standings, live scorecards, match highlight reels, and the official Golden Boot race.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSpectatorEnter}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Spectator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Privacy & Governance Notice */}
        <div className="pt-3 border-t border-[#261f4d] flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Code Exposure Policy
          </span>
          <span>Verified League Registry</span>
        </div>
      </div>
    </div>
  );
}
