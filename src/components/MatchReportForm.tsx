import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Award,
  Plus,
  Trash2,
  X,
  Save,
  Check,
  AlertCircle,
  PenTool,
  RotateCcw,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OFFICIAL_CLUBS_DATA, SquadMember } from "../lib/teamSquadsData";
import type { MatchFixture, Team } from "./Fixtures";

export interface GoalEventEntry {
  id: string;
  minute: string;
  team: "Home" | "Away";
  scorerName: string;
  assisterName: string;
  type: "Open Play" | "Penalty" | "Free Kick" | "Header" | "Own Goal";
}

export interface DisciplinaryEventEntry {
  id: string;
  minute: string;
  team: "Home" | "Away";
  playerName: string;
  card: "Yellow" | "Red";
  reason: string;
}

export interface SignatureEntry {
  name: string;
  signed: boolean;
  signedAt: string;
  signatureDataUrl?: string;
  licenseNumber?: string;
}

export interface MatchReportData {
  fixtureId: number;
  matchweek: number;
  date: string;
  time: string;
  venue: string;
  city: string;
  weatherNotes: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeHtScore: number;
  awayHtScore: number;
  homeStarters: string[];
  homeSubs: string[];
  awayStarters: string[];
  awaySubs: string[];
  goalEvents: GoalEventEntry[];
  cards: DisciplinaryEventEntry[];
  refereeNotes: string;
  manOfTheMatch: string;
  signatures: {
    homeCaptain: SignatureEntry;
    homeCoach: SignatureEntry;
    awayCaptain: SignatureEntry;
    awayCoach: SignatureEntry;
    referee: SignatureEntry;
  };
  submittedToAdmin: boolean;
  submittedAt: string;
}

interface MatchReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: MatchFixture | null;
  teams?: Team[];
  onReportSaved?: (report: MatchReportData) => void;
}

export function MatchReportForm({
  isOpen,
  onClose,
  fixture,
  teams = [],
  onReportSaved,
}: MatchReportFormProps) {
  if (!isOpen || !fixture) return null;

  const homeClub =
    OFFICIAL_CLUBS_DATA.find((c) => c.id === fixture.homeId) || {
      id: fixture.homeId,
      name: teams.find((t) => t.id === fixture.homeId)?.name || "Home Team",
      shortCode: teams.find((t) => t.id === fixture.homeId)?.shortCode || "HOM",
      color: "#00ff85",
      homePitch: fixture.venue || "M-Pesa Academy Stadium",
      coachName: "Austin Brian Omondi",
      squad: [],
    };

  const awayClub =
    OFFICIAL_CLUBS_DATA.find((c) => c.id === fixture.awayId) || {
      id: fixture.awayId,
      name: teams.find((t) => t.id === fixture.awayId)?.name || "Away Team",
      shortCode: teams.find((t) => t.id === fixture.awayId)?.shortCode || "AWY",
      color: "#3b82f6",
      homePitch: "Away Pitch",
      coachName: "Samwel Reagan Wanyama",
      squad: [],
    };

  const reportStorageKey = `mpesa_match_report_form_${fixture.id}`;

  const buildDefaultReport = (): MatchReportData => {
    const homeSquad = homeClub.squad || [];
    const awaySquad = awayClub.squad || [];

    const homeCaptainPlayer = homeSquad.find((p) => p.isCaptain)?.name || "Home Captain";
    const awayCaptainPlayer = awaySquad.find((p) => p.isCaptain)?.name || "Away Captain";

    const initialGoals: GoalEventEntry[] = [];
    if (fixture.goalEvents && fixture.goalEvents.length > 0) {
      fixture.goalEvents.forEach((ge, idx) => {
        initialGoals.push({
          id: `goal-${idx}-${Date.now()}`,
          minute: ge.minute || `${15 + idx * 20}'`,
          team: ge.team === "HOME" ? "Home" : "Away",
          scorerName: ge.scorerName,
          assisterName: ge.assisterName || "Unassisted",
          type: ge.isOwnGoal ? "Own Goal" : "Open Play",
        });
      });
    }

    return {
      fixtureId: fixture.id,
      matchweek: fixture.matchweek || 1,
      date: fixture.date || "Sunday, Oct 25, 2026",
      time: fixture.time || "16:00 EAT",
      venue: fixture.venue || "M-Pesa Academy Stadium Main Pitch",
      city: "Thika, Kenya",
      weatherNotes: "Good conditions • Dry Pitch",
      homeTeamName: homeClub.name,
      awayTeamName: awayClub.name,
      homeScore: fixture.homeScore ?? (initialGoals.filter((g) => g.team === "Home").length || 0),
      awayScore: fixture.awayScore ?? (initialGoals.filter((g) => g.team === "Away").length || 0),
      homeHtScore: 0,
      awayHtScore: 0,
      homeStarters: homeSquad.slice(0, 11).map((p) => p.name),
      homeSubs: homeSquad.slice(11).map((p) => p.name),
      awayStarters: awaySquad.slice(0, 11).map((p) => p.name),
      awaySubs: awaySquad.slice(11).map((p) => p.name),
      goalEvents: initialGoals,
      cards: [],
      refereeNotes: "Match completed in full accordance with football regulatory standards.",
      manOfTheMatch: fixture.manOfTheMatch?.playerName || homeSquad[0]?.name || "Player of the Match",
      signatures: {
        homeCaptain: {
          name: homeCaptainPlayer,
          signed: false,
          signedAt: "",
        },
        homeCoach: {
          name: homeClub.coachName || "Home Coach",
          signed: false,
          signedAt: "",
        },
        awayCaptain: {
          name: awayCaptainPlayer,
          signed: false,
          signedAt: "",
        },
        awayCoach: {
          name: awayClub.coachName || "Away Coach",
          signed: false,
          signedAt: "",
        },
        referee: {
          name: fixture.referee?.replace("Center Ref: ", "").split("(")[0]?.trim() || "Bidan Mwaura",
          licenseNumber: "FKF-PRO-8492",
          signed: false,
          signedAt: "",
        },
      },
      submittedToAdmin: false,
      submittedAt: "",
    };
  };

  const [report, setReport] = useState<MatchReportData>(() => {
    try {
      const saved = localStorage.getItem(reportStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...buildDefaultReport(), ...parsed };
      }
    } catch {
      // fallback
    }
    return buildDefaultReport();
  });

  const [activeSignModal, setActiveSignModal] = useState<keyof MatchReportData["signatures"] | null>(null);
  const [signerInputName, setSignerInputName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // New Goal Input Draft State
  const [newMinute, setNewMinute] = useState("35'");
  const [newTeam, setNewTeam] = useState<"Home" | "Away">("Home");
  const [newScorer, setNewScorer] = useState("");
  const [newAssister, setNewAssister] = useState("Unassisted");
  const [newGoalType, setNewGoalType] = useState<GoalEventEntry["type"]>("Open Play");

  // Sync state if fixture changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(reportStorageKey);
      if (saved) {
        setReport({ ...buildDefaultReport(), ...JSON.parse(saved) });
      } else {
        setReport(buildDefaultReport());
      }
    } catch {
      setReport(buildDefaultReport());
    }
  }, [fixture.id, reportStorageKey]);

  // Set default draft player names when roster loads
  useEffect(() => {
    if (!newScorer) {
      const homeSquad = homeClub.squad || [];
      if (homeSquad.length > 0) setNewScorer(homeSquad[0].name);
    }
  }, [homeClub]);

  const handleAddGoal = () => {
    if (!newScorer) return;
    const entry: GoalEventEntry = {
      id: `goal-${Date.now()}`,
      minute: newMinute || "45'",
      team: newTeam,
      scorerName: newScorer,
      assisterName: newAssister || "Unassisted",
      type: newGoalType,
    };

    setReport((prev) => {
      const nextGoals = [...prev.goalEvents, entry];
      const hCount = nextGoals.filter((g) => g.team === "Home").length;
      const aCount = nextGoals.filter((g) => g.team === "Away").length;
      return {
        ...prev,
        goalEvents: nextGoals,
        homeScore: hCount,
        awayScore: aCount,
      };
    });
  };

  const handleRemoveGoal = (id: string) => {
    setReport((prev) => {
      const nextGoals = prev.goalEvents.filter((g) => g.id !== id);
      const hCount = nextGoals.filter((g) => g.team === "Home").length;
      const aCount = nextGoals.filter((g) => g.team === "Away").length;
      return {
        ...prev,
        goalEvents: nextGoals,
        homeScore: hCount,
        awayScore: aCount,
      };
    });
  };

  // Signature Modal Helpers (Direct Signature Capture, Zero Email Required)
  const openSignatureModal = (roleKey: keyof MatchReportData["signatures"]) => {
    setActiveSignModal(roleKey);
    setSignerInputName(report.signatures[roleKey].name);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
        }
      }
    }, 50);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleConfirmSignature = () => {
    if (!activeSignModal) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas ? canvas.toDataURL("image/png") : undefined;
    const now = new Date().toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });

    setReport((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [activeSignModal]: {
          ...prev.signatures[activeSignModal],
          name: signerInputName.trim() || prev.signatures[activeSignModal].name,
          signed: true,
          signedAt: now,
          signatureDataUrl: dataUrl,
        },
      },
    }));

    setActiveSignModal(null);
  };

  const handleSaveAndSubmit = () => {
    const now = new Date().toLocaleString("en-KE");
    const updated: MatchReportData = {
      ...report,
      submittedToAdmin: true,
      submittedAt: now,
    };

    try {
      localStorage.setItem(reportStorageKey, JSON.stringify(updated));

      // Sync fixture score and status in mpesa_pes_matches_v6
      try {
        const raw = localStorage.getItem("mpesa_pes_matches_v6");
        if (raw) {
          const fixturesArr: any[] = JSON.parse(raw);
          const idx = fixturesArr.findIndex((f) => f.id === fixture.id);
          if (idx !== -1) {
            fixturesArr[idx] = {
              ...fixturesArr[idx],
              homeScore: updated.homeScore,
              awayScore: updated.awayScore,
              status: "COMPLETED",
              goalEvents: updated.goalEvents.map((g) => ({
                team: g.team === "Home" ? "HOME" : "AWAY",
                scorerName: g.scorerName,
                assisterName: g.assisterName !== "Unassisted" ? g.assisterName : undefined,
                minute: g.minute,
                isOwnGoal: g.type === "Own Goal",
              })),
              manOfTheMatch: {
                playerName: updated.manOfTheMatch,
                teamName:
                  homeClub.squad.some((p) => p.name === updated.manOfTheMatch)
                    ? homeClub.name
                    : awayClub.name,
                rating: 9.3,
                goals: updated.goalEvents.filter((g) => g.scorerName === updated.manOfTheMatch).length,
                assists: updated.goalEvents.filter((g) => g.assisterName === updated.manOfTheMatch).length,
              },
            };
            localStorage.setItem("mpesa_pes_matches_v6", JSON.stringify(fixturesArr));
          }
        }
      } catch (err) {
        console.warn("Could not sync fixtures array:", err);
      }

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("mpesa_matchreport_saved", { detail: updated }));

      setSaveSuccess("✓ Official Match Report signed and recorded into the league database!");
      setTimeout(() => setSaveSuccess(null), 3500);
      if (onReportSaved) onReportSaved(updated);
    } catch {
      setSaveSuccess("⚠ Failed to save report locally.");
    }
  };

  // Reusable PDF Form Generation
  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 1. Navy Top Header
      doc.setFillColor(0, 32, 91);
      doc.rect(0, 0, 210, 36, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("M-PESA SUNDAY LEAGUE • OFFICIAL MATCH REPORT", 105, 12, { align: "center" });

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text("STATUTORY MATCH RECORD CERTIFIED BY REFEREE & TEAM BENCHES", 105, 18, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(
        `MATCHWEEK ${report.matchweek} • ${report.date} • KICK-OFF: ${report.time}`,
        105,
        25,
        { align: "center" }
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(`Venue: ${report.venue} • ${report.city}`, 105, 31, { align: "center" });

      // 2. Score Summary Box
      doc.setFillColor(245, 247, 250);
      doc.rect(14, 40, 182, 18, "F");
      doc.setDrawColor(0, 32, 91);
      doc.rect(14, 40, 182, 18, "S");

      doc.setTextColor(0, 32, 91);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${homeClub.name.toUpperCase()} (HOME)`, 45, 48, { align: "center" });
      doc.text(`${awayClub.name.toUpperCase()} (AWAY)`, 165, 48, { align: "center" });

      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text(`${report.homeScore}   -   ${report.awayScore}`, 105, 51, { align: "center" });

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Half-Time: (${report.homeHtScore} - ${report.awayHtScore})`, 105, 56, { align: "center" });

      // 3. Registered Player Rosters Table
      const maxSquad = Math.max(homeClub.squad.length, awayClub.squad.length);
      const rosterRows: (string | number)[][] = [];

      for (let i = 0; i < maxSquad; i++) {
        const hp = homeClub.squad[i];
        const ap = awayClub.squad[i];
        rosterRows.push([
          hp ? hp.number || i + 1 : "",
          hp ? hp.name : "",
          hp ? hp.position : "",
          hp ? (report.homeStarters.includes(hp.name) ? "XI" : "SUB") : "",
          "|",
          ap ? ap.number || i + 1 : "",
          ap ? ap.name : "",
          ap ? ap.position : "",
          ap ? (report.awayStarters.includes(ap.name) ? "XI" : "SUB") : "",
        ]);
      }

      autoTable(doc, {
        startY: 61,
        head: [
          [
            "#",
            `${homeClub.name} Registered Squad`,
            "Pos",
            "Role",
            "",
            "#",
            `${awayClub.name} Registered Squad`,
            "Pos",
            "Role",
          ],
        ],
        body: rosterRows,
        theme: "grid",
        styles: { fontSize: 7, cellPadding: 1.4, halign: "center" },
        headStyles: { fillColor: [0, 32, 91], textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 46, halign: "left" },
          2: { cellWidth: 10 },
          3: { cellWidth: 14 },
          4: { cellWidth: 3, halign: "center", fontStyle: "bold" },
          5: { cellWidth: 8 },
          6: { cellWidth: 46, halign: "left" },
          7: { cellWidth: 10 },
          8: { cellWidth: 14 },
        },
      });

      let currentY = ((doc as any).lastAutoTable?.finalY ?? 61) + 5;

      // 4. Goals & Assists Log
      const goalRows =
        report.goalEvents.length > 0
          ? report.goalEvents.map((g) => [
              g.minute,
              g.team === "Home" ? homeClub.name : awayClub.name,
              g.scorerName,
              g.assisterName,
              g.type,
            ])
          : [["-", "None", "No goals recorded during this match", "-", "-"]];

      autoTable(doc, {
        startY: currentY,
        head: [["Minute", "Team", "Goal Scorer (#)", "Assist by", "Goal Type"]],
        body: goalRows,
        theme: "grid",
        styles: { fontSize: 7.5, cellPadding: 1.6 },
        headStyles: { fillColor: [0, 32, 91], textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 18, halign: "center", fontStyle: "bold" },
          1: { cellWidth: 38 },
          2: { cellWidth: 48, fontStyle: "bold" },
          3: { cellWidth: 44 },
          4: { cellWidth: 34 },
        },
      });

      currentY = ((doc as any).lastAutoTable?.finalY ?? 130) + 5;

      // 5. Multi-Signature & Certification Block
      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFillColor(241, 245, 249);
      doc.rect(14, currentY, 182, 48, "F");
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, currentY, 182, 48, "S");

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("OFFICIAL MULTI-SIGNATURE RECORD & MATCHDAY HANDOVER", 105, currentY + 5.5, {
        align: "center",
      });

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");

      // Home Side Sign
      const hCapText = report.signatures.homeCaptain.signed
        ? `[SIGNED] ${report.signatures.homeCaptain.name} (${report.signatures.homeCaptain.signedAt})`
        : `Home Captain: ${report.signatures.homeCaptain.name} ____________________`;
      const hCoachText = report.signatures.homeCoach.signed
        ? `[SIGNED] ${report.signatures.homeCoach.name} (${report.signatures.homeCoach.signedAt})`
        : `Home Head Coach: ${report.signatures.homeCoach.name} __________________`;

      doc.text(hCapText, 18, currentY + 12);
      doc.text(hCoachText, 18, currentY + 19);

      // Away Side Sign
      const aCapText = report.signatures.awayCaptain.signed
        ? `[SIGNED] ${report.signatures.awayCaptain.name} (${report.signatures.awayCaptain.signedAt})`
        : `Away Captain: ${report.signatures.awayCaptain.name} ____________________`;
      const aCoachText = report.signatures.awayCoach.signed
        ? `[SIGNED] ${report.signatures.awayCoach.name} (${report.signatures.awayCoach.signedAt})`
        : `Away Head Coach: ${report.signatures.awayCoach.name} __________________`;

      doc.text(aCapText, 112, currentY + 12);
      doc.text(aCoachText, 112, currentY + 19);

      // Referee Certification
      const refText = report.signatures.referee.signed
        ? `[CERTIFIED] Ref: ${report.signatures.referee.name} • Badge ${report.signatures.referee.licenseNumber} (${report.signatures.referee.signedAt})`
        : `Center Referee: ${report.signatures.referee.name} • Badge: ${report.signatures.referee.licenseNumber} ____________`;

      doc.setFont("helvetica", "bold");
      doc.text(refText, 18, currentY + 28);

      // Handover Notice
      doc.setFillColor(254, 243, 199);
      doc.rect(16, currentY + 34, 178, 10, "F");
      doc.setTextColor(146, 64, 14);
      doc.setFontSize(6.5);
      doc.text(
        "STATUTORY HANDOVER NOTICE: This signed match report is recorded directly by the League Administrator",
        105,
        currentY + 37.5,
        { align: "center" }
      );
      doc.text(
        "and forms the sole authoritative basis for league table calculation, Golden Boot top scorers, and assist tallies.",
        105,
        currentY + 41.5,
        { align: "center" }
      );

      const fileName = `Official_MatchReport_MW${report.matchweek}_${homeClub.shortCode}_vs_${awayClub.shortCode}.pdf`;
      doc.save(fileName);

      setIsExportingPdf(false);
      setSaveSuccess(`✓ ${fileName} downloaded successfully!`);
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err) {
      console.error("Match report PDF export failed:", err);
      setIsExportingPdf(false);
      setSaveSuccess("⚠ Failed to generate PDF document.");
      setTimeout(() => setSaveSuccess(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b0821] border border-[#2e2554] text-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden my-auto">
        {/* Top Control Bar */}
        <div className="p-4 bg-[#141029] border-b border-[#2e2554] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-header text-sm sm:text-base font-black uppercase text-white tracking-wide">
                Referee Match Report Form • MW {report.matchweek}
              </h3>
              <p className="text-xs text-gray-400">
                {homeClub.name} vs {awayClub.name} • {report.date}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndSubmit}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Submit & Sync Report</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="bg-emerald-600/90 text-white text-xs font-bold px-4 py-2 text-center">
            {saveSuccess}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Section 1: Score & Metadata Banner */}
          <div className="bg-[#120e2e] border border-indigo-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Official Match Details
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-300 mt-1">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    MW {report.matchweek} • {report.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Clock className="w-3.5 h-3.5" />
                    {report.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-rose-300">
                    <MapPin className="w-3.5 h-3.5" />
                    {report.venue}
                  </span>
                </div>
              </div>

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  report.submittedToAdmin
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                }`}
              >
                {report.submittedToAdmin ? "✓ Signed & Recorded" : "Awaiting Signatures"}
              </span>
            </div>

            {/* Score Entry Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="space-y-1">
                <span className="text-lg font-black text-emerald-400 block">{homeClub.name}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Coach: {homeClub.coachName}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={report.homeScore}
                    onChange={(e) =>
                      setReport((prev) => ({
                        ...prev,
                        homeScore: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-16 h-14 bg-[#141029] border-2 border-emerald-500/40 rounded-xl text-center font-black text-2xl text-white font-mono"
                  />
                  <span className="text-xl font-bold text-gray-400">:</span>
                  <input
                    type="number"
                    min="0"
                    value={report.awayScore}
                    onChange={(e) =>
                      setReport((prev) => ({
                        ...prev,
                        awayScore: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-16 h-14 bg-[#141029] border-2 border-blue-500/40 rounded-xl text-center font-black text-2xl text-white font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Half-Time:</span>
                  <input
                    type="number"
                    min="0"
                    value={report.homeHtScore}
                    onChange={(e) =>
                      setReport((prev) => ({
                        ...prev,
                        homeHtScore: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-10 bg-[#141029] border border-white/10 rounded px-1 text-center font-bold text-white text-xs"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    value={report.awayHtScore}
                    onChange={(e) =>
                      setReport((prev) => ({
                        ...prev,
                        awayHtScore: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-10 bg-[#141029] border border-white/10 rounded px-1 text-center font-bold text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-lg font-black text-blue-400 block">{awayClub.name}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Coach: {awayClub.coachName}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Registered Squads */}
          <div className="bg-[#120e2e] border border-indigo-500/30 rounded-2xl p-5 space-y-4">
            <h4 className="font-header text-sm font-black uppercase text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Registered Team Rosters
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Home Squad List */}
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-400">{homeClub.name} Squad</span>
                  <span className="text-gray-400 text-[10px]">{homeClub.squad.length} Players</span>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-white/5 text-xs">
                  {homeClub.squad.map((p, idx) => (
                    <div key={`hp-${idx}`} className="py-1 flex items-center justify-between">
                      <span className="text-gray-300">
                        #{p.number} {p.name}
                        {p.isCaptain && <span className="ml-1 text-[9px] bg-amber-400 text-black px-1 rounded font-bold">C</span>}
                      </span>
                      <span className="text-gray-400 text-[10px] font-mono">{p.position}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Squad List */}
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-blue-400">{awayClub.name} Squad</span>
                  <span className="text-gray-400 text-[10px]">{awayClub.squad.length} Players</span>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-white/5 text-xs">
                  {awayClub.squad.map((p, idx) => (
                    <div key={`ap-${idx}`} className="py-1 flex items-center justify-between">
                      <span className="text-gray-300">
                        #{p.number} {p.name}
                        {p.isCaptain && <span className="ml-1 text-[9px] bg-amber-400 text-black px-1 rounded font-bold">C</span>}
                      </span>
                      <span className="text-gray-400 text-[10px] font-mono">{p.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Goal Scorers & Assists Entry */}
          <div className="bg-[#120e2e] border border-indigo-500/30 rounded-2xl p-5 space-y-4">
            <h4 className="font-header text-sm font-black uppercase text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Goal Scorers & Assists Entry
            </h4>

            {/* Input Row for adding goal */}
            <div className="p-4 bg-[#0a071b] border border-indigo-500/20 rounded-xl space-y-3">
              <span className="text-xs font-bold text-gray-300 block">Record Match Goal Incident:</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {/* Minute */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Minute</label>
                  <input
                    type="text"
                    value={newMinute}
                    onChange={(e) => setNewMinute(e.target.value)}
                    placeholder="23'"
                    className="w-full bg-[#141029] border border-white/10 rounded-lg px-2 py-1.5 text-white font-mono text-xs"
                  />
                </div>

                {/* Team */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Scoring Side</label>
                  <select
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value as "Home" | "Away")}
                    className="w-full bg-[#141029] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                  >
                    <option value="Home">{homeClub.name}</option>
                    <option value="Away">{awayClub.name}</option>
                  </select>
                </div>

                {/* Scorer */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Goal Scorer</label>
                  <select
                    value={newScorer}
                    onChange={(e) => setNewScorer(e.target.value)}
                    className="w-full bg-[#141029] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                  >
                    {(newTeam === "Home" ? homeClub.squad : awayClub.squad).map((p, idx) => (
                      <option key={`scorer-opt-${idx}`} value={p.name}>
                        #{p.number} {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assist */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Assist By</label>
                  <select
                    value={newAssister}
                    onChange={(e) => setNewAssister(e.target.value)}
                    className="w-full bg-[#141029] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                  >
                    <option value="Unassisted">None (Unassisted / Solo)</option>
                    {(newTeam === "Home" ? homeClub.squad : awayClub.squad).map((p, idx) => (
                      <option key={`assist-opt-${idx}`} value={p.name}>
                        #{p.number} {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Goal Type */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Type</label>
                  <select
                    value={newGoalType}
                    onChange={(e) => setNewGoalType(e.target.value as any)}
                    className="w-full bg-[#141029] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                  >
                    <option value="Open Play">Open Play</option>
                    <option value="Penalty">Penalty</option>
                    <option value="Header">Header</option>
                    <option value="Free Kick">Free Kick</option>
                    <option value="Own Goal">Own Goal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wide rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>
              </div>
            </div>

            {/* Recorded Goals Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2 px-3">Minute</th>
                    <th className="py-2 px-3">Team</th>
                    <th className="py-2 px-3">Goal Scorer</th>
                    <th className="py-2 px-3">Assist</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {report.goalEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-3 text-center text-gray-500 italic">
                        No goals added yet. Use the inputs above to add match scorers and assists.
                      </td>
                    </tr>
                  ) : (
                    report.goalEvents.map((g) => (
                      <tr key={g.id} className="hover:bg-white/5">
                        <td className="py-2 px-3 font-mono font-bold text-amber-300">{g.minute}</td>
                        <td className="py-2 px-3 font-bold">
                          {g.team === "Home" ? homeClub.name : awayClub.name}
                        </td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{g.scorerName}</td>
                        <td className="py-2 px-3 text-cyan-300">{g.assisterName}</td>
                        <td className="py-2 px-3 text-gray-300">{g.type}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveGoal(g.id)}
                            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Man of the Match */}
          <div className="bg-[#120e2e] border border-indigo-500/30 rounded-2xl p-5 space-y-4">
            <h4 className="font-header text-sm font-black uppercase text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Player of the Match & Referee Report
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  ⭐ Man of the Match Nominee
                </label>
                <select
                  value={report.manOfTheMatch}
                  onChange={(e) => setReport((prev) => ({ ...prev, manOfTheMatch: e.target.value }))}
                  className="w-full bg-[#141029] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm"
                >
                  <optgroup label={`${homeClub.name} Players`}>
                    {homeClub.squad.map((p, idx) => (
                      <option key={`motm-h-${idx}`} value={p.name}>
                        {p.name} (#{p.number} - {p.position})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={`${awayClub.name} Players`}>
                    {awayClub.squad.map((p, idx) => (
                      <option key={`motm-a-${idx}`} value={p.name}>
                        {p.name} (#{p.number} - {p.position})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Referee Matchday Notes
                </label>
                <input
                  type="text"
                  value={report.refereeNotes}
                  onChange={(e) => setReport((prev) => ({ ...prev, refereeNotes: e.target.value }))}
                  placeholder="Notes on conduct, pitch, fair play..."
                  className="w-full bg-[#141029] border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Multi-Signature Sign-off Area */}
          <div className="bg-[#120e2e] border-2 border-indigo-500/40 rounded-2xl p-5 space-y-4">
            <div className="border-b border-indigo-500/20 pb-2">
              <h4 className="font-header text-sm font-black uppercase text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Statutory Sign-off & Direct Signature Capture
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Direct signature confirmation by team captains, coaches, and center referee. No email required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Home Signatures */}
              <div className="p-4 bg-black/40 rounded-xl border border-emerald-500/30 space-y-3">
                <span className="font-black text-emerald-400 uppercase text-xs block">
                  {homeClub.name} Bench
                </span>

                {/* Captain */}
                <div className="p-2.5 bg-[#141029] rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">Captain</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        report.signatures.homeCaptain.signed
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {report.signatures.homeCaptain.signed ? "✓ Signed" : "Pending"}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs">{report.signatures.homeCaptain.name}</div>
                  {!report.signatures.homeCaptain.signed ? (
                    <button
                      type="button"
                      onClick={() => openSignatureModal("homeCaptain")}
                      className="w-full py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Sign as Captain
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {report.signatures.homeCaptain.signedAt}
                    </span>
                  )}
                </div>

                {/* Head Coach */}
                <div className="p-2.5 bg-[#141029] rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">Head Coach</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        report.signatures.homeCoach.signed
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {report.signatures.homeCoach.signed ? "✓ Signed" : "Pending"}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs">{report.signatures.homeCoach.name}</div>
                  {!report.signatures.homeCoach.signed ? (
                    <button
                      type="button"
                      onClick={() => openSignatureModal("homeCoach")}
                      className="w-full py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Sign as Head Coach
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {report.signatures.homeCoach.signedAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Away Signatures */}
              <div className="p-4 bg-black/40 rounded-xl border border-blue-500/30 space-y-3">
                <span className="font-black text-blue-400 uppercase text-xs block">
                  {awayClub.name} Bench
                </span>

                {/* Captain */}
                <div className="p-2.5 bg-[#141029] rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">Captain</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        report.signatures.awayCaptain.signed
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {report.signatures.awayCaptain.signed ? "✓ Signed" : "Pending"}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs">{report.signatures.awayCaptain.name}</div>
                  {!report.signatures.awayCaptain.signed ? (
                    <button
                      type="button"
                      onClick={() => openSignatureModal("awayCaptain")}
                      className="w-full py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Sign as Captain
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {report.signatures.awayCaptain.signedAt}
                    </span>
                  )}
                </div>

                {/* Head Coach */}
                <div className="p-2.5 bg-[#141029] rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">Head Coach</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        report.signatures.awayCoach.signed
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {report.signatures.awayCoach.signed ? "✓ Signed" : "Pending"}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs">{report.signatures.awayCoach.name}</div>
                  {!report.signatures.awayCoach.signed ? (
                    <button
                      type="button"
                      onClick={() => openSignatureModal("awayCoach")}
                      className="w-full py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Sign as Head Coach
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {report.signatures.awayCoach.signedAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Referee Crew Signature */}
              <div className="p-4 bg-black/40 rounded-xl border border-amber-500/30 space-y-3">
                <span className="font-black text-amber-300 uppercase text-xs block">
                  Match Official Crew
                </span>

                <div className="p-2.5 bg-[#141029] rounded-lg border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold">Center Referee</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        report.signatures.referee.signed
                          ? "bg-amber-400/20 text-amber-300"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {report.signatures.referee.signed ? "✓ Certified" : "Pending"}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs">{report.signatures.referee.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Badge: {report.signatures.referee.licenseNumber}
                  </div>
                  {!report.signatures.referee.signed ? (
                    <button
                      type="button"
                      onClick={() => openSignatureModal("referee")}
                      className="w-full py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Certify as Referee
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {report.signatures.referee.signedAt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Capture Modal */}
      {activeSignModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#120e2e] border border-[#2e2554] rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h5 className="font-header text-sm font-black uppercase text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-400" />
                Capture Sign-off
              </h5>
              <button
                type="button"
                onClick={() => setActiveSignModal(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                Signatory Legal Full Name
              </label>
              <input
                type="text"
                value={signerInputName}
                onChange={(e) => setSignerInputName(e.target.value)}
                className="w-full bg-[#141029] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold">
                  Draw Signature (Optional)
                </label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={360}
                height={120}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={(e) => {
                  if (!isDrawing) return;
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;
                  const rect = canvas.getBoundingClientRect();
                  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                  ctx.stroke();
                }}
                className="w-full h-28 bg-black/60 border border-white/10 rounded-xl cursor-crosshair touch-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveSignModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignature}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-lg"
              >
                Confirm Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
