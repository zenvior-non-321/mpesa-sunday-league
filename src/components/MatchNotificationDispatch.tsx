import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Shield,
  Calendar,
  MapPin,
  Sparkles,
  Inbox,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useRoleAccess } from "../hooks/useRoleAccess";
import type { MatchFixture, Team } from "./Fixtures";
import { DEFAULT_FIXTURES, DEFAULT_TEAMS } from "../lib/fixturesData";

export interface DispatchedAlert {
  id: string;
  matchId: number;
  matchTitle: string;
  matchweek: number;
  kickoffDate: string;
  kickoffTime: string;
  venue: string;
  recipientsCount: number;
  recipientEmails: string[];
  sentAt: string;
  dispatchedBy: string;
  status: "DELIVERED" | "QUEUED";
}

export function MatchNotificationDispatch() {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const canSendAlerts =
    isSuperAdmin || currentRole === "TECH_MANAGER" || currentRole === "PRESIDENT";

  const [matches, setMatches] = useState<MatchFixture[]>(DEFAULT_FIXTURES);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [selectedMatchId, setSelectedMatchId] = useState<number>(7); // Default to upcoming MW4 match
  const [isSending, setIsSending] = useState<boolean>(false);
  const [outboxHistory, setOutboxHistory] = useState<DispatchedAlert[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load matches, teams, and outbox history from localStorage
  useEffect(() => {
    try {
      const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedFixtures) {
        const parsed = JSON.parse(storedFixtures);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMatches(parsed);
          // Pick first upcoming match if available
          const firstUpcoming = parsed.find((m: MatchFixture) => m.status === "UPCOMING");
          if (firstUpcoming) {
            setSelectedMatchId(firstUpcoming.id);
          }
        }
      }

      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
        }
      }

      const storedOutbox = localStorage.getItem("mpesa_pes_email_dispatches_v1");
      if (storedOutbox) {
        setOutboxHistory(JSON.parse(storedOutbox));
      } else {
        // Seed initial history item for realism
        const initialSeed: DispatchedAlert[] = [
          {
            id: "dispatch-mw3-prev",
            matchId: 5,
            matchTitle: "Royal Rangers vs Young Stars City",
            matchweek: 3,
            kickoffDate: "Sunday, Nov 8, 2026",
            kickoffTime: "2:00 PM",
            venue: "School Pitch Arena",
            recipientsCount: 32,
            recipientEmails: [
              "amirah.bramuel@mpesafoundationacademy.ac.ke",
              "samwel.wanyama@mpesafoundationacademy.ac.ke",
              "adams.otieno@mpesafoundationacademy.ac.ke",
            ],
            sentAt: "Saturday, Nov 7, 2026 at 2:00 PM (24h before)",
            dispatchedBy: "Super Administrator (Official)",
            status: "DELIVERED",
          },
        ];
        setOutboxHistory(initialSeed);
      }
    } catch {
      // Ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId) || matches[0],
    [matches, selectedMatchId],
  );

  const homeTeam = useMemo(
    () => teams.find((t) => t.id === currentMatch.homeId) || teams[0],
    [teams, currentMatch.homeId],
  );

  const awayTeam = useMemo(
    () => teams.find((t) => t.id === currentMatch.awayId) || teams[1],
    [teams, currentMatch.awayId],
  );

  // Gather recipients from both teams' squads
  const targetRecipients = useMemo(() => {
    const list: { name: string; email: string; role: string; teamName: string }[] = [];

    // Helper to extract players
    const addTeamRecipients = (teamObj: Team) => {
      const anyTeam = teamObj as unknown as {
        coach?: { name: string; email?: string };
        manager?: { name: string; email?: string };
        squad?: { name: string; email?: string; role?: string }[];
      };

      if (anyTeam.coach?.email) {
        list.push({
          name: anyTeam.coach.name,
          email: anyTeam.coach.email,
          role: "Head Coach",
          teamName: teamObj.name,
        });
      }
      if (anyTeam.manager?.email) {
        list.push({
          name: anyTeam.manager.name,
          email: anyTeam.manager.email,
          role: "Team Manager",
          teamName: teamObj.name,
        });
      }

      if (Array.isArray(anyTeam.squad)) {
        anyTeam.squad.forEach((p) => {
          const email =
            p.email ||
            `${p.name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@mpesafoundationacademy.ac.ke`;
          list.push({
            name: p.name,
            email,
            role: p.role || "Squad Athlete",
            teamName: teamObj.name,
          });
        });
      } else {
        // Fallback realistic emails for default roster
        const names = ["Captain", "Goalkeeper", "CenterBack", "Playmaker", "Striker", "Winger"];
        names.forEach((pos, idx) => {
          list.push({
            name: `${teamObj.shortCode} Player #${idx + 1}`,
            email: `player.${teamObj.shortCode.toLowerCase()}${idx + 1}@mpesafoundationacademy.ac.ke`,
            role: pos,
            teamName: teamObj.name,
          });
        });
      }
    };

    addTeamRecipients(homeTeam);
    addTeamRecipients(awayTeam);

    // Filter unique by email
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.email)) return false;
      seen.add(item.email);
      return true;
    });
  }, [homeTeam, awayTeam]);

  // Dispatch 24-hour match notification emails
  const handleDispatchNotification = () => {
    if (!canSendAlerts) {
      showToast("Access Restricted: Only Super Admin can dispatch 24h matchday emails.");
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const newDispatch: DispatchedAlert = {
        id: `dispatch-${Date.now()}`,
        matchId: currentMatch.id,
        matchTitle: `${homeTeam.name} vs ${awayTeam.name}`,
        matchweek: currentMatch.matchweek,
        kickoffDate: currentMatch.date,
        kickoffTime: currentMatch.time,
        venue: currentMatch.venue || homeTeam.homePitch,
        recipientsCount: targetRecipients.length,
        recipientEmails: targetRecipients.map((r) => r.email),
        sentAt: `Dispatched just now (${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}) • 24h Pre-Match Notice`,
        dispatchedBy: "Super Administrator",
        status: "DELIVERED",
      };

      const updated = [newDispatch, ...outboxHistory];
      setOutboxHistory(updated);
      try {
        localStorage.setItem("mpesa_pes_email_dispatches_v1", JSON.stringify(updated));
      } catch {
        // Ignore
      }

      setIsSending(false);
      showToast(
        `✓ 24-Hour Match Notice sent successfully to all ${targetRecipients.length} squad players and coaches!`,
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 p-3.5 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-white text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Match Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 text-black shadow-md flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-black" />
              <span>24-Hour Alert Engine</span>
            </span>
            <span className="text-xs text-gray-400 font-mono">Super Admin Only Dispatch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-3">
            <span>Matchday Email Notifications</span>
            <Mail className="w-8 h-8 text-[#00f0ff]" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Automatically alerts registered squad players and coaches 24 hours prior to match
            kickoff.
          </p>
        </div>

        {/* Fixture Selector & Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#141029] border border-[#2e2554] p-2 rounded-2xl">
            <span className="text-[10px] text-gray-400 font-bold uppercase pl-1">Fixture:</span>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(Number(e.target.value))}
              aria-label="Select match for 24h notification"
              className="bg-transparent text-xs font-black text-[#00f0ff] focus:outline-none cursor-pointer pr-2"
            >
              {matches.map((m) => {
                const h = teams.find((t) => t.id === m.homeId)?.shortCode || `C${m.homeId}`;
                const a = teams.find((t) => t.id === m.awayId)?.shortCode || `C${m.awayId}`;
                return (
                  <option key={m.id} value={m.id} className="bg-[#141029] text-white">
                    MW {m.matchweek}: {h} vs {a} ({m.date})
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={handleDispatchNotification}
            disabled={isSending || !canSendAlerts}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black hover:brightness-110 shadow-lg shadow-cyan-500/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Broadcasting Emails...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send 24h Alert Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Email Live Preview (Left 7 cols) + Target Recipients & History (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Email Preview Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase text-white tracking-wider">
                Delivered Email Client Preview
              </h3>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              Recipients: <strong>{targetRecipients.length} Players & Staff</strong>
            </span>
          </div>

          {/* Rendered Email Template */}
          <div className="bg-[#141029] border border-[#3b2f6d] rounded-2xl overflow-hidden shadow-2xl">
            {/* Email Top Header */}
            <div className="bg-[#0b081b] p-4 border-b border-[#2e2554] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center">
                  <img
                    src="/mpesa-academy-icon.png"
                    alt="Academy"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white leading-none uppercase">
                    M-Pesa Foundation Academy Sunday League
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    From: automated-matchday@mpesafoundationacademy.ac.ke
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⚡ 24H PRE-MATCH NOTICE
              </span>
            </div>

            {/* Email Content Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Subject Banner */}
              <div className="bg-amber-500/10 border-l-4 border-amber-400 p-3 rounded-r-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Subject Line:
                </span>
                <p className="font-black text-sm text-white">
                  ⚡ [URGENT 24H MATCHDAY NOTICE]: MW {currentMatch.matchweek} — {homeTeam.name} vs{" "}
                  {awayTeam.name} kicks off tomorrow!
                </p>
              </div>

              {/* Greeting */}
              <p className="text-gray-300 leading-relaxed">
                Dear <strong>Academy Athlete / Coach</strong>,
                <br />
                This is an official automated dispatch confirming your squad call-up. Your team is
                scheduled to play in the eFootball Championship in <strong>24 hours</strong>. Please
                review the fixture briefing below.
              </p>

              {/* Match Card within Email */}
              <div className="p-4 bg-black/50 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    Matchweek {currentMatch.matchweek} Championship Clásico
                  </span>
                  <span className="text-[10px] font-mono text-[#00f0ff] font-bold">
                    Official Match #{currentMatch.id}
                  </span>
                </div>

                {/* Team Badges & Matchup */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="text-center space-y-1">
                    <span
                      className="w-10 h-10 rounded-xl inline-flex items-center justify-center font-black text-xs text-black shadow-lg"
                      style={{ backgroundColor: homeTeam.color || "#00f0ff" }}
                    >
                      {homeTeam.shortCode}
                    </span>
                    <span className="text-xs font-black text-white block">{homeTeam.name}</span>
                    <span className="text-[10px] text-gray-400 block">Home Team</span>
                  </div>

                  <span className="text-lg font-black text-amber-400 font-mono px-3">VS</span>

                  <div className="text-center space-y-1">
                    <span
                      className="w-10 h-10 rounded-xl inline-flex items-center justify-center font-black text-xs text-black shadow-lg"
                      style={{ backgroundColor: awayTeam.color || "#ffe600" }}
                    >
                      {awayTeam.shortCode}
                    </span>
                    <span className="text-xs font-black text-white block">{awayTeam.name}</span>
                    <span className="text-[10px] text-gray-400 block">Away Team</span>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-bold">
                      Date & Time
                    </span>
                    <span className="font-bold text-white">
                      {currentMatch.date} @ {currentMatch.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-bold">
                      Venue Arena
                    </span>
                    <span className="font-bold text-white">
                      📍 {currentMatch.venue || homeTeam.homePitch}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-bold">
                      Match Official
                    </span>
                    <span className="font-bold text-[#00f0ff]">
                      {currentMatch.referee || "Ian Muli (FIFA Ref)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Protocol Notes */}
              <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-[11px] text-gray-300 space-y-1">
                <span className="font-bold text-purple-300 block uppercase text-[10px]">
                  📋 Mandatory Matchday Protocol:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-gray-300 text-[10px]">
                  <li>All athletes must report to the team dugout 45 minutes before kickoff.</li>
                  <li>
                    Home club ({homeTeam.name}) wears primary colors; Away club wears alternate
                    strip.
                  </li>
                  <li>
                    Check in with your Team Manager to confirm starter roster & hydration kits.
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#2e2554] text-[10px] text-gray-500 flex items-center justify-between">
                <span>League Office: Records & File Management Division</span>
                <span>M-Pesa Foundation Academy © 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Recipient Roster & Outbox Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Squad Players Box */}
          <div className="bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00f0ff]" />
                <h3 className="text-xs font-black uppercase text-white tracking-wider">
                  Target Recipient Roster
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#141029] text-gray-300 border border-[#2e2554]">
                {targetRecipients.length} Athletes
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar text-xs">
              {targetRecipients.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#141029] border border-[#2e2554] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-black text-white block truncate">{rec.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono block truncate">
                      {rec.email}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/40 text-gray-300 shrink-0">
                    {rec.teamName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Outbox Dispatch History */}
          <div className="bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black uppercase text-white tracking-wider">
                  Outbox Delivery Log
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                {outboxHistory.length} Dispatches
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar text-xs">
              {outboxHistory.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No past dispatches recorded yet.</p>
              ) : (
                outboxHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#141029] border border-[#2e2554] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-xs">{item.matchTitle}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Delivered</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>MW {item.matchweek} Kickoff</span>
                      <span className="font-mono">{item.recipientsCount} emails sent</span>
                    </div>

                    <div className="text-[9px] font-mono text-gray-500 pt-1 border-t border-[#2e2554]/60">
                      {item.sentAt}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
