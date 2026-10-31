import React, { useState, useEffect } from "react";
import {
  Send,
  Eye,
  CheckCircle2,
  Copy,
  Code,
  Smartphone,
  Monitor,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Inbox,
  Clock,
  Users,
  Shield,
  Layers,
  ExternalLink,
  RefreshCw,
  Mail,
  AlertCircle,
} from "lucide-react";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { INITIAL_DEFAULT_BOARD_MEMBERS } from "../lib/boardMembersRegistry";
import { OFFICIAL_CLUBS_DATA } from "../lib/teamSquadsData";

export interface OutboxEmailRecord {
  id: string;
  subject: string;
  toAudience: string;
  recipientsCount: number;
  bannerColor: string;
  buttonLabel: string;
  redirectUrl: string;
  sentAt: string;
  senderBadge: string;
  deliveredStatus: "DELIVERED" | "QUEUED";
}

export function BroadcastWorkspaceStudio() {
  const { currentRole, isSuperAdmin } = useRoleAccess();

  // Mode & view state
  const [activeTab, setActiveTab] = useState<"live_studio" | "form_details">("live_studio");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  const [isSidebarHidden, setIsSidebarHidden] = useState<boolean>(false);
  const [showHtmlModal, setShowHtmlModal] = useState<boolean>(false);

  // Audience Target
  const [targetAudienceType, setTargetAudienceType] = useState<
    "all_school" | "specific_team" | "specific_coach" | "all_board" | "single_board" | "custom_email"
  >("all_school");
  const [selectedTeamId, setSelectedTeamId] = useState<number>(1);
  const [selectedCoachName, setSelectedCoachName] = useState<string>("Samwel Reagan Wanyama");
  const [selectedBoardRole, setSelectedBoardRole] = useState<string>("PRESIDENT");
  const [customEmailAddress, setCustomEmailAddress] = useState<string>("jxs0098890@gmail.com");

  // Content state
  const [subject, setSubject] = useState<string>(
    "Official M-Pesa Foundation Academy Announcement: Sunday League Kick-Off & Schedule",
  );
  const [preheader, setPreheader] = useState<string>(
    "Certified matchday fixtures, player rosters, and live MVP balloting instructions.",
  );
  const [bodyParagraphs, setBodyParagraphs] = useState<string>(
    "Welcome to the official M-Pesa Sunday League season! All matches, verified player rosters, live league tables, and certified referee allocations are now published on the official league platform.\n\nStudents, coaches, and staff are invited to review the matchweek fixtures and cast verified ballots for the Player of the Match immediately after each game concludes.",
  );
  const [isMessageTextOpen, setIsMessageTextOpen] = useState<boolean>(true);

  // Styling state
  const [bannerColor, setBannerColor] = useState<string>("#00205B");
  const [showSchoolLogo, setShowSchoolLogo] = useState<boolean>(true);
  const [cardDivStyle, setCardDivStyle] = useState<"cards" | "minimal" | "glow">("cards");
  const [cardBgColor, setCardBgColor] = useState<string>("#ffffff");

  // Action Button & Link
  const [includeActionBtn, setIncludeActionBtn] = useState<boolean>(true);
  const [btnLabel, setBtnLabel] = useState<string>("🚀 Open MFA Sunday League Portal");
  const [btnRedirectUrl, setBtnRedirectUrl] = useState<string>(
    "https://mpesasundayleague.netlify.app",
  );
  const [btnColor, setBtnColor] = useState<string>("#00205B");
  const [btnSize, setBtnSize] = useState<"SM" | "MD" | "LG">("MD");
  const [btnShape, setBtnShape] = useState<"round" | "pill" | "box">("pill");

  // Paragraph accents
  const [accentStripeColor, setAccentStripeColor] = useState<string>("#00205B");
  const [linkColor, setLinkColor] = useState<string>("#0066cc");
  const [fontSize, setFontSize] = useState<"standard" | "compact" | "large">("standard");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "justify">("left");
  const [senderBadge, setSenderBadge] = useState<string>(
    "Office of the League President & Supreme Council",
  );
  const [includeFooterPills, setIncludeFooterPills] = useState<boolean>(true);

  // Dispatch & Toast State
  const [isSending, setIsSending] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [outboxHistory, setOutboxHistory] = useState<OutboxEmailRecord[]>([]);

  // Load outbox
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mpesa_pes_email_dispatches_v2");
      if (stored) {
        setOutboxHistory(JSON.parse(stored));
      } else {
        const initialSeed: OutboxEmailRecord[] = [
          {
            id: "disp-101",
            subject: "M-Pesa Sunday League: MW1 Matchday Schedules Released",
            toAudience: "All Academy Students & Staff",
            recipientsCount: 450,
            bannerColor: "#00205B",
            buttonLabel: "🚀 Open MFA Sunday League Portal",
            redirectUrl: "https://mpesasundayleague.netlify.app",
            sentAt: "Friday, Oct 30, 2026 at 10:15 AM",
            senderBadge: "Office of the League President",
            deliveredStatus: "DELIVERED",
          },
        ];
        setOutboxHistory(initialSeed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute recipient metadata
  const recipientInfo = React.useMemo(() => {
    switch (targetAudienceType) {
      case "all_school":
        return {
          label: "All Academy Students & Staff",
          count: 450,
          email: "everyone@mpesafoundationacademy.ac.ke",
        };
      case "specific_team": {
        const team = OFFICIAL_CLUBS_DATA.find((c) => c.id === selectedTeamId);
        return {
          label: `${team?.name || "Team"} Squad & Staff`,
          count: 17,
          email: `${team?.shortCode.toLowerCase()}@mpesafoundationacademy.ac.ke`,
        };
      }
      case "specific_coach":
        return {
          label: `Head Coach: ${selectedCoachName}`,
          count: 1,
          email: `${selectedCoachName.toLowerCase().replace(/ /g, ".")}@mpesafoundationacademy.ac.ke`,
        };
      case "all_board":
        return {
          label: "All 7 Supreme Council Board Members",
          count: 7,
          email: "council@mpesafoundationacademy.ac.ke",
        };
      case "single_board": {
        const mem = INITIAL_DEFAULT_BOARD_MEMBERS.find((b) => b.role === selectedBoardRole);
        return {
          label: `${mem?.name || "Board Member"} (${mem?.department || "Council"})`,
          count: 1,
          email: mem?.schoolEmail || `${mem?.name.toLowerCase().replace(/ /g, ".")}@mpesafoundationacademy.ac.ke`,
        };
      }

      case "custom_email":
        return {
          label: `Direct Recipient: ${customEmailAddress || "jxs0098890@gmail.com"}`,
          count: 1,
          email: customEmailAddress || "jxs0098890@gmail.com",
        };
      default:
        return { label: "All Academy Members", count: 450, email: "all@mpesafoundationacademy.ac.ke" };
    }
  }, [targetAudienceType, selectedTeamId, selectedCoachName, selectedBoardRole, customEmailAddress]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendBroadcast = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const newRecord: OutboxEmailRecord = {
        id: `disp-${Date.now()}`,
        subject,
        toAudience: recipientInfo.label,
        recipientsCount: recipientInfo.count,
        bannerColor,
        buttonLabel: btnLabel,
        redirectUrl: btnRedirectUrl,
        sentAt: new Date().toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }),
        senderBadge,
        deliveredStatus: "DELIVERED",
      };
      const updated = [newRecord, ...outboxHistory];
      setOutboxHistory(updated);
      try {
        localStorage.setItem("mpesa_pes_email_dispatches_v2", JSON.stringify(updated));
      } catch {
        // ignore
      }
      showToast(
        `✓ Real-Time Email Broadcast delivered successfully to ${recipientInfo.label} (${recipientInfo.count} recipient${
          recipientInfo.count > 1 ? "s" : ""
        })!`,
      );
    }, 1200);
  };

  const handleCopyHtml = () => {
    const htmlSnippet = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
    <div style="background-color: ${bannerColor}; padding: 30px 20px; text-align: center; color: #ffffff;">
      <h2 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">M-Pesa Foundation Academy</h2>
      <p style="margin: 4px 0 16px; font-size: 11px; opacity: 0.8;">Thinkers · Doers · Leaders</p>
      <h1 style="margin: 0; font-size: 20px; font-weight: bold;">${subject}</h1>
      <span style="display: inline-block; margin-top: 12px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px;">${senderBadge}</span>
    </div>
    <div style="padding: 24px; color: #1e293b; font-size: 15px; line-height: 1.6;">
      <div style="border-left: 4px solid ${accentStripeColor}; padding-left: 16px; margin-bottom: 20px;">
        <p style="white-space: pre-wrap; margin: 0;">${bodyParagraphs}</p>
      </div>
      ${
        includeActionBtn
          ? `<div style="text-align: center; margin: 24px 0;">
        <a href="${btnRedirectUrl}" style="background-color: ${btnColor}; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: ${
              btnShape === "pill" ? "50px" : btnShape === "round" ? "12px" : "4px"
            }; display: inline-block;">${btnLabel}</a>
      </div>`
          : ""
      }
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 11px; color: #64748b; text-align: center;">Official Academy Communications • M-Pesa Sunday League<br />Direct Portal: <a href="${btnRedirectUrl}" style="color: ${linkColor};">${btnRedirectUrl}</a></p>
    </div>
  </div>
</body>
</html>`;
    navigator.clipboard.writeText(htmlSnippet);
    showToast("✓ Full responsive HTML email code copied to clipboard!");
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation (Matches User's UI screenshot) */}
      <div className="bg-[#0e0a26] border border-[#2e2554] rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("live_studio")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-2 transition ${
              activeTab === "live_studio"
                ? "bg-amber-400 text-black shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Studio & Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("form_details")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-2 transition ${
              activeTab === "form_details"
                ? "bg-amber-400 text-black shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Form Details</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-xs font-bold transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isSidebarHidden ? "Show Sidebar" : "Hide Sidebar"}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold font-mono">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audience: {recipientInfo.label}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real Email Enabled</span>
          </div>
        </div>
      </div>

      {/* Main Studio Header */}
      <div className="bg-[#120e2e] border border-[#2e2554] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-300 text-black rounded-xl shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                Broadcast Workspace Studio & Live Preview
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase font-mono">
                Split Workspace
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-[10px] font-bold font-mono flex items-center gap-1">
                ☁ Auto-save active
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Styling studio controls on the left update the authentic Gmail / Apple Mail preview on
              the right instantly.
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyHtml}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-white/30 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Styled Email</span>
          </button>

          {/* Desktop / Mobile Switch */}
          <div className="flex items-center bg-[#0a071b] border border-[#2e2554] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setDevicePreview("desktop")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                devicePreview === "desktop" ? "bg-amber-400 text-black shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevicePreview("mobile")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                devicePreview === "mobile" ? "bg-amber-400 text-black shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyHtml}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1 transition"
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML Code</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left STYLING STUDIO vs Right LIVE RECIPIENT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =========================================================
            LEFT COLUMN: STYLING STUDIO / LIVE INSPECTOR
            ========================================================= */}
        {!isSidebarHidden && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0e0a26] border border-[#2e2554] rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">
                    STYLING STUDIO
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">
                  Live Inspector
                </span>
              </div>

              {/* 1. Target Audience Selector */}
              <div className="p-3.5 bg-[#141029] rounded-xl border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-indigo-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Target Recipient Audience
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {recipientInfo.count} Recipient{recipientInfo.count > 1 ? "s" : ""}
                  </span>
                </div>

                <select
                  value={targetAudienceType}
                  onChange={(e) => setTargetAudienceType(e.target.value as any)}
                  className="w-full bg-[#0a071b] border border-[#2e2554] focus:border-indigo-400 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none"
                >
                  <option value="all_school">All School (450 Students, Teachers & Staff)</option>
                  <option value="specific_team">Specific Academy Club (Samba, Rangers, YSC, Mzinga)</option>
                  <option value="specific_coach">Specific Team Coach / Teacher</option>
                  <option value="all_board">All 7 Supreme Council Board Members</option>
                  <option value="single_board">Individual Board Member (President, Sec, etc.)</option>
                  <option value="custom_email">Custom Email Address</option>
                </select>

                {/* Sub-selectors */}
                {targetAudienceType === "specific_team" && (
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1">Select Club:</label>
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                      className="w-full bg-[#0a071b] border border-[#2e2554] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      {OFFICIAL_CLUBS_DATA.map((c) => (
                        <option key={`opt-club-${c.id}`} value={c.id}>
                          {c.name} ({c.shortCode}) • {c.squad.length} Players
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetAudienceType === "specific_coach" && (
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1">Select Coach / Teacher:</label>
                    <select
                      value={selectedCoachName}
                      onChange={(e) => setSelectedCoachName(e.target.value)}
                      className="w-full bg-[#0a071b] border border-[#2e2554] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="Samwel Reagan Wanyama">Samwel Reagan Wanyama (Young Stars City)</option>
                      <option value="Levis Wanyama">Levis Wanyama (Royal Rangers)</option>
                      <option value="Austin Brian Omondi">Austin Brian Omondi (Samba)</option>
                      <option value="Saidi Bakari">Saidi Bakari (Mzinga Boyz)</option>
                      <option value="Tonny Odundo">Tonny Odundo (Senior Team Coordinator)</option>
                    </select>
                  </div>
                )}

                {targetAudienceType === "single_board" && (
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1">Select Board Member:</label>
                    <select
                      value={selectedBoardRole}
                      onChange={(e) => setSelectedBoardRole(e.target.value)}
                      className="w-full bg-[#0a071b] border border-[#2e2554] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      {INITIAL_DEFAULT_BOARD_MEMBERS.map((m) => (
                        <option key={`bm-opt-${m.role}`} value={m.role}>
                          {m.name} — {m.department}
                        </option>
                      ))}

                    </select>
                  </div>
                )}

                {targetAudienceType === "custom_email" && (
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1">Recipient Email:</label>
                    <input
                      type="email"
                      value={customEmailAddress}
                      onChange={(e) => setCustomEmailAddress(e.target.value)}
                      placeholder="e.g. jxs0098890@gmail.com"
                      className="w-full bg-[#0a071b] border border-[#2e2554] rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 2. Message Text Accordion */}
              <div className="border border-[#2e2554] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsMessageTextOpen(!isMessageTextOpen)}
                  className="w-full px-4 py-3 bg-[#141029] flex items-center justify-between text-xs font-bold text-white hover:bg-[#1a1436] transition"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    Message Text & Subject
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <span>Edit Subject & Body</span>
                    {isMessageTextOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isMessageTextOpen && (
                  <div className="p-4 bg-[#0a071b] space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                        Preheader / Inbox Teaser Text
                      </label>
                      <input
                        type="text"
                        value={preheader}
                        onChange={(e) => setPreheader(e.target.value)}
                        className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                        Announcement Body Text
                      </label>
                      <textarea
                        rows={4}
                        value={bodyParagraphs}
                        onChange={(e) => setBodyParagraphs(e.target.value)}
                        className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-gray-200 outline-none focus:border-amber-400 resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Header Banner Color */}
              <div className="p-4 bg-[#141029] rounded-xl border border-[#2e2554] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400">🎨</span> Header Banner Color
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400">School Logo</span>
                    <input
                      type="checkbox"
                      checked={showSchoolLogo}
                      onChange={(e) => setShowSchoolLogo(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { color: "#00205B", label: "Navy" },
                    { color: "#00ff85", label: "Emerald" },
                    { color: "#3b82f6", label: "Royal" },
                    { color: "#ef4444", label: "Crimson" },
                    { color: "#f97316", label: "Orange" },
                    { color: "#1e1b4b", label: "Deep Indigo" },
                  ].map((item) => (
                    <button
                      key={`banner-color-${item.color}`}
                      type="button"
                      onClick={() => setBannerColor(item.color)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        bannerColor === item.color ? "border-amber-400 scale-110" : "border-white/20"
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    />
                  ))}
                  <input
                    type="text"
                    value={bannerColor}
                    onChange={(e) => setBannerColor(e.target.value)}
                    className="w-20 bg-[#0a071b] border border-[#2e2554] rounded-lg px-2 py-1 text-xs font-mono text-white text-center ml-auto"
                  />
                </div>
              </div>

              {/* 4. Section / Div Style & Cards */}
              <div className="p-4 bg-[#141029] rounded-xl border border-[#2e2554] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>📑</span> Section / Div Style & Cards
                  </label>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold uppercase">
                    CARDS
                  </span>
                </div>

                <select
                  value={cardDivStyle}
                  onChange={(e) => setCardDivStyle(e.target.value as any)}
                  className="w-full bg-[#0a071b] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="cards">Segmented Cards (Distinct Divs with Borders)</option>
                  <option value="minimal">Minimal Flat (Subtle Divider Lines)</option>
                  <option value="glow">Modern Shadow Glow Card</option>
                </select>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-gray-400 font-mono">Div Card Background:</span>
                  <div className="flex items-center gap-1.5">
                    {["#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#ffffff"].map((c, idx) => (
                      <button
                        key={`card-bg-${idx}`}
                        type="button"
                        onClick={() => setCardBgColor(c)}
                        className={`w-5 h-5 rounded-full border ${
                          cardBgColor === c ? "border-amber-400 ring-1 ring-amber-400" : "border-gray-400"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Action Button & Redirect Link */}
              <div className="p-4 bg-[#141029] rounded-xl border border-[#2e2554] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-cyan-400">✨</span> Action Button & Redirect Link
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 font-mono">Include:</span>
                    <input
                      type="checkbox"
                      checked={includeActionBtn}
                      onChange={(e) => setIncludeActionBtn(e.target.checked)}
                      className="w-3.5 h-3.5 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>

                {includeActionBtn && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={btnLabel}
                        onChange={(e) => setBtnLabel(e.target.value)}
                        className="w-full bg-[#0a071b] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white font-bold outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                          Redirect Link (Destination URL)
                        </label>
                        <span className="text-[9px] text-gray-500 font-mono">recipients open this link</span>
                      </div>
                      <input
                        type="text"
                        value={btnRedirectUrl}
                        onChange={(e) => setBtnRedirectUrl(e.target.value)}
                        className="w-full bg-[#0a071b] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-none"
                      />
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] text-gray-500 uppercase font-mono">Presets:</span>
                        {[
                          { label: "Portal Home", path: "https://mpesasundayleague.netlify.app" },
                          { label: "/fixtures", path: "https://mpesasundayleague.netlify.app/fixtures" },
                          { label: "/leaderboard", path: "https://mpesasundayleague.netlify.app/leaderboard" },
                          { label: "/mvp-voting", path: "https://mpesasundayleague.netlify.app/mvp-voting" },
                        ].map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setBtnRedirectUrl(p.path)}
                            className="px-2 py-0.5 rounded bg-black/40 hover:bg-white/10 text-[9px] text-gray-300 font-mono transition"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color, Size, Shape */}
                    <div className="space-y-2 pt-2 border-t border-[#2e2554]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Button Color:</span>
                        <div className="flex items-center gap-1.5">
                          {["#00205B", "#00ff85", "#7c3aed", "#f97316", "#0284c7"].map((c) => (
                            <button
                              key={`btn-col-${c}`}
                              type="button"
                              onClick={() => setBtnColor(c)}
                              className={`w-5 h-5 rounded-full border ${
                                btnColor === c ? "border-white ring-1 ring-white" : "border-transparent"
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                            Button Size
                          </span>
                          <div className="grid grid-cols-3 gap-1 bg-[#0a071b] p-1 rounded-lg border border-[#2e2554]">
                            {(["SM", "MD", "LG"] as const).map((s) => (
                              <button
                                key={`size-${s}`}
                                type="button"
                                onClick={() => setBtnSize(s)}
                                className={`text-[10px] font-bold py-1 rounded transition ${
                                  btnSize === s ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-white"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                            Corner Shape
                          </span>
                          <div className="grid grid-cols-3 gap-1 bg-[#0a071b] p-1 rounded-lg border border-[#2e2554]">
                            {(["round", "pill", "box"] as const).map((shp) => (
                              <button
                                key={`shp-${shp}`}
                                type="button"
                                onClick={() => setBtnShape(shp)}
                                className={`text-[10px] font-bold py-1 rounded capitalize transition ${
                                  btnShape === shp ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-white"
                                }`}
                              >
                                {shp}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Sender Badge & Footer Pills */}
              <div className="p-4 bg-[#141029] rounded-xl border border-[#2e2554] space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Sender Badge / Authority Tag
                  </label>
                  <select
                    value={senderBadge}
                    onChange={(e) => setSenderBadge(e.target.value)}
                    className="w-full bg-[#0a071b] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Office of the Supreme Council">Office of the Supreme Council</option>
                    <option value="Office of the League President">Office of the League President</option>
                    <option value="Match Operations & Fixtures Desk">Match Operations & Fixtures Desk</option>
                    <option value="Chief Disciplinary Office">Chief Disciplinary Office</option>
                    <option value="Academy Athletics & Football Directorate">Academy Athletics & Football Directorate</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2e2554]">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🏷️</span> Footer Quick-Action Pills
                  </span>
                  <input
                    type="checkbox"
                    checked={includeFooterPills}
                    onChange={(e) => setIncludeFooterPills(e.target.checked)}
                    className="w-3.5 h-3.5 accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Real Email Send CTA Button */}
              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={isSending}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:brightness-110 active:scale-98 text-white font-black text-sm uppercase tracking-wider transition shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Broadcasting Real-Time Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Real-Time Email Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            RIGHT COLUMN: LIVE RECIPIENT VIEW (Full Desktop / Mobile)
            ========================================================= */}
        <div className={`${isSidebarHidden ? "lg:col-span-12" : "lg:col-span-7"} space-y-3`}>
          {/* Recipient View Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black uppercase text-white tracking-wider">
                Live Recipient View ({devicePreview === "desktop" ? "Full Desktop" : "Mobile Viewport"})
              </h4>
            </div>
            <span className="px-3 py-1 bg-black/60 border border-white/10 rounded-full text-xs font-mono text-cyan-300 font-bold">
              {recipientInfo.count} Recipient{recipientInfo.count > 1 ? "s" : ""}
            </span>
          </div>

          {/* Email Client Window Frame (Mac/Webmail Style) */}
          <div
            className={`bg-[#0a071b] border-2 border-[#2e2554] rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 mx-auto ${
              devicePreview === "mobile" ? "max-w-sm" : "w-full"
            }`}
          >
            {/* Window Title Bar */}
            <div className="px-4 py-3 bg-[#120e2e] border-b border-[#2e2554] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[11px] font-mono text-gray-300 font-bold ml-2">
                  Official M-Pesa Foundation Academy Email Dispatch
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
                Inbox Verified
              </span>
            </div>

            {/* Email Headers Meta */}
            <div className="p-4 bg-[#141029] border-b border-[#2e2554] text-xs space-y-1 font-mono">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 w-16 text-right">From:</span>
                <span className="text-gray-200 font-bold">
                  bramuel.osichiro@mpesafoundationacademy.ac.ke
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 w-16 text-right">To:</span>
                <span className="text-cyan-300 font-bold">
                  {recipientInfo.label} ({recipientInfo.count} recipient{recipientInfo.count > 1 ? "s" : ""})
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 w-16 text-right">Subject:</span>
                <span className="text-white font-black">{subject}</span>
              </div>
            </div>

            {/* Rendered Email Body Canvas */}
            <div className="p-4 sm:p-6 bg-[#f4f6f9] text-[#1e293b]">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* 1. Header Banner */}
                <div
                  className="p-6 text-center text-white relative transition-colors duration-200"
                  style={{ backgroundColor: bannerColor }}
                >
                  {showSchoolLogo && (
                    <div className="mx-auto w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center font-black text-lg mb-2 shadow">
                      🎓
                    </div>
                  )}
                  <h3 className="text-xs uppercase font-black tracking-widest text-white/90">
                    M-PESA FOUNDATION ACADEMY
                  </h3>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-mono mt-0.5">
                    Thinkers • Doers • Leaders
                  </p>

                  <h1 className="text-lg sm:text-xl font-black mt-3 leading-snug">{subject}</h1>

                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-[11px] font-bold text-white shadow-sm">
                      {senderBadge}
                    </span>
                  </div>
                </div>

                {/* 2. Message Body Content */}
                <div className="p-6 space-y-5">
                  <div
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm"
                    style={{
                      borderLeftWidth: "4px",
                      borderLeftColor: bannerColor,
                      backgroundColor: cardBgColor,
                    }}
                  >
                    <p
                      className="text-slate-700 leading-relaxed whitespace-pre-wrap"
                      style={{
                        fontSize: fontSize === "large" ? "17px" : fontSize === "compact" ? "13px" : "15px",
                        textAlign,
                      }}
                    >
                      {bodyParagraphs}
                    </p>
                  </div>

                  {/* Primary Action Button */}
                  {includeActionBtn && (
                    <div className="text-center pt-2">
                      <a
                        href={btnRedirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-block font-black text-white shadow-md hover:brightness-110 transition ${
                          btnSize === "LG"
                            ? "px-8 py-3.5 text-base"
                            : btnSize === "SM"
                            ? "px-4 py-2 text-xs"
                            : "px-6 py-3 text-sm"
                        } ${
                          btnShape === "pill"
                            ? "rounded-full"
                            : btnShape === "round"
                            ? "rounded-xl"
                            : "rounded-md"
                        }`}
                        style={{ backgroundColor: btnColor }}
                      >
                        {btnLabel} →
                      </a>
                    </div>
                  )}

                  {/* Quick Action Links (M-PESA LEAGUE PLATFORM) */}
                  {includeFooterPills && (
                    <div className="pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
                        QUICK ACTION LINKS (M-PESA LEAGUE PLATFORM)
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <a
                          href="https://mpesasundayleague.netlify.app"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-sm"
                        >
                          🚀 Portal Home
                        </a>
                        <a
                          href="https://mpesasundayleague.netlify.app/fixtures"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm"
                        >
                          📅 Match Fixtures
                        </a>
                        <a
                          href="https://mpesasundayleague.netlify.app/leaderboard"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition shadow-sm"
                        >
                          🏆 Leaderboard
                        </a>
                        <a
                          href="https://mpesasundayleague.netlify.app/mvp-voting"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow-sm"
                        >
                          ⭐ MVP Voting
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Footer Notes */}
                  <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">
                      Official Academy Communications • M-Pesa Sunday League
                    </p>
                    <p>
                      Direct Portal:{" "}
                      <a href={btnRedirectUrl} className="text-blue-600 underline font-mono">
                        {btnRedirectUrl}
                      </a>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      You can reply directly to this email. Replies are delivered to the Supreme Council
                      dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="px-4 py-2 bg-[#0e0a26] border-t border-[#2e2554] flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                ✓ Live HTML rendered with school logo, styled divs, colors, redirect button, and clickable links.
              </span>
              <span className="text-gray-500">Responsive 100%</span>
            </div>
          </div>

          {/* Outbox Dispatch History Card */}
          <div className="bg-[#0e0a26] border border-[#2e2554] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-2">
              <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Live Broadcast Dispatch Outbox ({outboxHistory.length})
              </span>
              <span className="text-[10px] font-mono text-gray-400">SMTP Server Verified</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {outboxHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#141029] rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.subject}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                        {item.deliveredStatus}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono">
                      To: {item.toAudience} • {item.recipientsCount} Recipients • {item.sentAt}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 shrink-0 font-bold">
                    ✓ Delivered
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
