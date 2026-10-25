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

export function FanCommunityComments() {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const canModerate = isSuperAdmin || currentRole !== "GUEST";

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
            Fan Cheers & Community Prayer Wall
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
            Cheer on your parish youth football team, post words of spiritual encouragement, and
            celebrate Christian fellowship across the M-Pesa Sunday League.
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
              Post a Cheer or Prayer
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
                placeholder="e.g. Deacon Mark"
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
                  <option value="Youth Pastor">Youth Pastor</option>
                  <option value="Church Member">Church Member</option>
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
                  { id: "PRAYER", label: "Prayer & Faith", icon: "🙏" },
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
                placeholder="Share a verse, cheering message, or word of encouragement..."
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

        {/* Right Column: Community Feed (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3">
            <div>
              <h4 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Community Feed ({filteredComments.length})
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                {canModerate ? (
                  <span className="text-amber-400 font-bold">
                    🔒 Administrator Moderation Mode Active
                  </span>
                ) : (
                  "Public Christian fellowship and matchday cheers"
                )}
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
                <option value="PRAYER">🙏 Prayer & Faith</option>
                <option value="SPORTSMANSHIP">🤝 Fair Play</option>
              </select>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredComments.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No messages found in this category. Be the first to share a cheer!
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
                          <span className="font-black text-xs text-white">{comment.author}</span>
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
                          comment.category === "PRAYER"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : comment.category === "SPORTSMANSHIP"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {comment.category}
                      </span>

                      {/* Admin Moderation Actions */}
                      {canModerate && (
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
                      )}
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
                      <span>Verified League Supporter</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
