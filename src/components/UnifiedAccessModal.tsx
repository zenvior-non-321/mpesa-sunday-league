import React, { useState } from "react";
import {
  KeyRound,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  Lock,
  Mail,
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
      setError("Please enter your assigned confidential Access Code.");
      return;
    }

    if (cleaned.includes("@")) {
      setError(
        "Council login is strictly via confidential Access Code only. Email is not required or accepted here (email is exclusively reserved for Student MVP Voting).",
      );
      return;
    }

    setIsSubmitting(true);

    // Authenticate via RBAC System using access code
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
        "Invalid access code. Please verify your confidential Council or Admin access credential.",
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e0927] border border-[#3b2d6e] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Council & Admin Gateway • Code Only
              </span>
            </div>
            <h3 className="font-header text-xl font-black text-white uppercase tracking-wide mt-0.5">
              Portal Access Gateway
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Sign in exclusively with your confidential <strong>Council Access Code</strong> or{" "}
          <strong>Super Admin Passcode</strong>. No email is required for Council or Admin access
          (student email verification is strictly reserved for MVP Voting).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1.5 flex items-center justify-between">
              <span>Confidential Access Code</span>
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Code-Only RBAC Gate
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
                placeholder="Enter Code (e.g. msl-27 or PRES-8491)"
                className="w-full bg-[#161033] border border-[#3b2d6e] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl px-4 py-3 text-sm font-mono text-white outline-none pr-12 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition cursor-pointer"
                title={showPassword ? "Hide code" : "Show code"}
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
              <span>Authenticate</span>
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
    </div>
  );
}
