import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Heart,
  Sparkles,
  Pin,
  Trash2,
  CheckCircle2,
  Shield,
  Filter,
  Crown,
} from "lucide-react";
import {
  type FanComment,
  getComments,
  submitFanComment,
  deleteComment,
  togglePinComment,
} from "../lib/communityComments";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { getCurrentRbacUser } from "../lib/rbacSystem";

export function FanCommunityComments() {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmin = () => {
      const rbacUser = getCurrentRbacUser();
      const admin =
        isSuperAdmin ||
        currentRole === "SUPER_ADMIN" ||
        rbacUser?.role === "admin" ||
        rbacUser?.isSuperAdmin === true;
      setIsAdmin(Boolean(admin));
    };
    checkAdmin();
    window.addEventListener("mpesa_rbac_changed", checkAdmin);
    window.addEventListener("mpesa_role_changed", checkAdmin);
    window.addEventListener("storage", checkAdmin);
    return () => {
      window.removeEventListener("mpesa_rbac_changed", checkAdmin);
      window.removeEventListener("mpesa_role_changed", checkAdmin);
      window.removeEventListener("storage", checkAdmin);
    };
  }, [isSuperAdmin, currentRole]);

  const canModerate = isAdmin;

  const [comments, setComments] = useState<FanComment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedClub, setSelectedClub] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Comment Form
  const [authorName, setAuthorName] = useState("");
  const [role, setRole] = useState<FanComment["role"]>("Supporter");
  const [clubSupported, setClubSupported] = useState("Samba Boys");
  const [category, setCategory] = useState<FanComment["category"]>("CHEER");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComments(getComments());
    const handleUpdate = () => setComments(getComments());
    window.addEventListener("mpesa_comments_updated", handleUpdate);
    return () => window.removeEventListener("mpesa_comments_updated", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    submitFanComment({
      author: authorName.trim(),
      role,
      clubSupported,
      message: message.trim(),
      category,
    });

    setMessage("");
    setIsSubmitting(false);
    showToast("✓ Message posted to the Fan & Community Board!");
  };

  const handleDelete = (id: string) => {
    deleteComment(id);
    showToast("✓ Comment removed by administrator.");
  };

  const handleTogglePin = (id: string) => {
    togglePinComment(id);
    showToast("✓ Pin status updated.");
  };

  // Filtered list: pinned comments first, then sorted by date
  const filteredComments = comments
    .filter((c) => {
      const matchCat = selectedCategory === "ALL" || c.category === selectedCategory;
      const matchClub = selectedClub === "ALL" || c.clubSupported === selectedClub;
      return matchCat && matchClub;
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-400/30 bg-gradient-to-r from-[#0d0726] via-[#120a36] to-[#070512] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-cyan-400" />
            <span>Christian Sportsmanship & Fan Encouragement Hub</span>
          </div>

          <h2 className="font-header text-2xl sm:text-4xl font-black text-white uppercase tracking-wider leading-tight">
            Fan Cheers & Community Stadium Wall
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
            Cheer on your academy youth football club, post matchday encouragement, and celebrate
            fair play across the M-Pesa Sunday League.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout: Submit Form & Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Submit Comment Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="border-b border-[#2e2554] pb-3">
            <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block">
              Share Your Voice
            </span>
            <h4 className="font-header text-lg font-black text-white uppercase mt-0.5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Post a Matchday Cheer
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Mark"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  I am a...
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as FanComment["role"])}
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none font-semibold"
                >
                  <option value="Supporter">Supporter</option>
                  <option value="Parent">Parent / Guardian</option>
                  <option value="Student Athlete">Student Athlete</option>
                  <option value="Club Staff">Club Staff</option>
                  <option value="Alumni Supporter">Alumni Supporter</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Team Supported
                </label>
                <select
                  value={clubSupported}
                  onChange={(e) => setClubSupported(e.target.value)}
                  className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none font-semibold"
                >
                  <option value="Samba Boys">Samba Boys</option>
                  <option value="Royal Rangers">Royal Rangers</option>
                  <option value="Mzinga Boyz">Mzinga Boyz</option>
                  <option value="Young Stars City">Young Stars City</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                Message Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CHEER", label: "Match Cheer", icon: "⚽" },
                  { id: "TACTICAL", label: "Tactical Note", icon: "📋" },
                  { id: "SPORTSMANSHIP", label: "Fair Play", icon: "🤝" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as FanComment["category"])}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      category === cat.id
                        ? "bg-[#00f0ff] text-black border-cyan-300 font-black shadow-md shadow-cyan-500/20"
                        : "bg-[#141029] text-gray-300 border-[#2e2554] hover:text-white"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                Your Words of Encouragement
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share a cheering message, tactical reaction, or word of encouragement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Post Encouragement</span>
            </button>
          </form>
        </div>

        {/* Right Column: Community Feed (Admin Only View) */}
        <div className="lg:col-span-7 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          {isAdmin ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3">
                <div>
                  <h4 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Admin Moderation Feed ({filteredComments.length})
                  </h4>
                  <p className="text-xs text-amber-300 font-bold mt-0.5">
                    👑 Exclusive Administrator View: Only admins can view and moderate submitted
                    messages.
                  </p>
                </div>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#141029] border border-[#2e2554] rounded-xl px-2.5 py-1 text-xs text-white font-bold outline-none"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="CHEER">⚽ Match Cheers</option>
                    <option value="TACTICAL">📋 Tactical Notes</option>
                    <option value="SPORTSMANSHIP">🤝 Fair Play</option>
                  </select>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {filteredComments.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No submitted messages found in this category.
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-2xl border transition space-y-2.5 ${
                        comment.isPinned
                          ? "bg-amber-950/20 border-amber-400/50 shadow-lg shadow-amber-500/10"
                          : "bg-[#141029] border-[#2e2554]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-black text-xs flex items-center justify-center shrink-0">
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-white">
                                {comment.author}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                • {comment.role}
                              </span>
                              {comment.isPinned && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 flex items-center gap-0.5">
                                  <Pin className="w-2.5 h-2.5 fill-amber-300" />
                                  <span>Pinned</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold">
                              Supporting: {comment.clubSupported}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                              comment.category === "TACTICAL"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                : comment.category === "SPORTSMANSHIP"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                            }`}
                          >
                            {comment.category}
                          </span>

                          {/* Admin Moderation Actions */}
                          <div className="flex items-center gap-1 ml-1 pl-1 border-l border-white/10">
                            <button
                              type="button"
                              onClick={() => handleTogglePin(comment.id)}
                              title={comment.isPinned ? "Unpin comment" : "Pin comment to top"}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer"
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(comment.id)}
                              title="Delete comment (Admin action)"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Message body */}
                      <p className="text-xs text-gray-200 leading-relaxed font-sans pl-1">
                        "{comment.message}"
                      </p>

                      <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between pt-1">
                        <span>{comment.timestamp}</span>
                        <span className="text-emerald-500 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>Verified Submitter</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-14 px-6 space-y-5 bg-[#0e0a26] rounded-2xl border border-amber-400/20">
              <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-xl">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Confidential Administration Desk</span>
                </div>
                <h4 className="font-header text-xl font-black text-white uppercase tracking-wider">
                  Comments Can Only Be Seen by Admin
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  In accordance with M-Pesa Sunday League policies and competition integrity
                  standards, all fan cheers, tactical feedback, and community notes are submitted
                  directly to League Administration.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Public spectators cannot view submitted comments. Only authorized administrators
                  have access to view and moderate the community feed.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open_unified_login"));
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Administrator Sign-In</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#2e2554]/60 text-[11px] text-gray-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  You can still submit comments and cheers on the left; they will be delivered
                  privately to admins.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
