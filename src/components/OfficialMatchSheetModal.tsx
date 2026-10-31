import React, { useState, useEffect } from "react";
import {
  Printer,
  Download,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Award,
  Save,
  Plus,
  Trash2,
  FileText,
  Sliders,
  Check,
  ClipboardCheck,
  UserCheck,
  Flame,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { MatchFixture, Team } from "./Fixtures";
import { OFFICIAL_CLUBS_DATA, SquadMember } from "../lib/teamSquadsData";

export interface LineupPlayerRow {
  number: number;
  name: string;
  position: string;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isStarting: boolean;
  isSub: boolean;
}

export interface MatchEventRow {
  id: string;
  minute: string;
  team: "Home" | "Away";
  playerName: string;
  eventType:
    | "Goal (Open Play)"
    | "Goal (Penalty)"
    | "Goal (Header)"
    | "Yellow Card"
    | "Red Card"
    | "Sub Out"
    | "Own Goal";
  assistOrSubIn: string;
}

export interface MatchSheetRecord {
  fixtureId: number;
  competitionName: string;
  matchweek: number;
  date: string;
  time: string;
  venue: string;
  city: string;
  weatherPitchNotes: string;
  // Home & Away Lineups
  homeLineup: LineupPlayerRow[];
  awayLineup: LineupPlayerRow[];
  // Match Events
  events: MatchEventRow[];
  // Technical Staff
  homeStaff: { coach: string; assistantCoach: string; medicalStaff: string };
  awayStaff: { coach: string; assistantCoach: string; medicalStaff: string };
  // Coach-to-Coach Evaluation
  homeRateAway: {
    tacticalFairPlay: number;
    benchConduct: number;
    postMatchRespect: number;
    notes: string;
  };
  awayRateHome: {
    tacticalFairPlay: number;
    benchConduct: number;
    postMatchRespect: number;
    notes: string;
  };
  // Measurable Official Match Records ONLY (No unmeasurable possession or passes)
  stats: {
    homeScore: number;
    awayScore: number;
    homeHtScore: number;
    awayHtScore: number;
    homeYellowCards: number;
    awayYellowCards: number;
    homeRedCards: number;
    awayRedCards: number;
    homePenaltiesAwarded: number;
    awayPenaltiesAwarded: number;
    homePenaltiesScored: number;
    awayPenaltiesScored: number;
    manOfTheMatch: string;
    manOfTheMatchTeam: string;
    refereeNotes: string;
  };
  // Post-Match Statutory Signatures & Handover to Admin
  signatures: {
    homeCaptainSigned: boolean;
    homeCaptainName: string;
    homeSignedAt: string;
    homeCoachSigned: boolean;
    homeCoachName: string;
    awayCaptainSigned: boolean;
    awayCaptainName: string;
    awaySignedAt: string;
    awayCoachSigned: boolean;
    awayCoachName: string;
    refereeSigned: boolean;
    refereeSignerName: string;
    refereeLicence: string;
    refereeSignedAt: string;
    commissionerSigned: boolean;
    commissionerName: string;
  };
  // Admin Physical Handover Record
  adminHandover: {
    isHandedOver: boolean;
    handedOverAt: string;
    recordedByAdmin: string;
    notes: string;
  };
  // Match Officials Directory
  officials: {
    referee: string;
    assistantRef1: string;
    assistantRef2: string;
    fourthOfficial: string;
    commissioner: string;
  };
}

interface OfficialMatchSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: MatchFixture | null;
  teams?: Team[];
  onSave?: (saved: MatchSheetRecord) => void;
}

export function OfficialMatchSheetModal({
  isOpen,
  onClose,
  fixture,
  teams = [],
  onSave,
}: OfficialMatchSheetModalProps) {
  if (!isOpen || !fixture) return null;

  const homeClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === fixture.homeId) || {
    id: fixture.homeId,
    name: teams.find((t) => t.id === fixture.homeId)?.name || "Home Team",
    shortCode: teams.find((t) => t.id === fixture.homeId)?.shortCode || "HOM",
    color: teams.find((t) => t.id === fixture.homeId)?.color || "#00ff85",
    homePitch: fixture.venue || "M-Pesa Academy Stadium",
    coachName: "Austin Brian Omondi",
    assistantCoach: "Carson Technical Bench",
    medicalStaff: "MFA Medical Staff",
    squad: [],
  };

  const awayClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === fixture.awayId) || {
    id: fixture.awayId,
    name: teams.find((t) => t.id === fixture.awayId)?.name || "Away Team",
    shortCode: teams.find((t) => t.id === fixture.awayId)?.shortCode || "AWY",
    color: teams.find((t) => t.id === fixture.awayId)?.color || "#3b82f6",
    homePitch: "School Pitch",
    coachName: "Samwel Reagan Wanyama",
    assistantCoach: "Adams Technical Bench",
    medicalStaff: "MFA Medical Staff",
    squad: [],
  };

  const storageKey = `mpesa_pes_matchsheet_v2_${fixture.id}`;

  const buildInitialSheet = (): MatchSheetRecord => {
    const buildLineup = (squad: SquadMember[]): LineupPlayerRow[] => {
      if (squad.length === 0) {
        return [
          { number: 1, name: "Goalkeeper", position: "GK", isCaptain: false, isViceCaptain: false, isStarting: true, isSub: false },
          { number: 4, name: "Defender", position: "DEF", isCaptain: false, isViceCaptain: false, isStarting: true, isSub: false },
          { number: 8, name: "Midfielder", position: "MID", isCaptain: true, isViceCaptain: false, isStarting: true, isSub: false },
          { number: 10, name: "Forward", position: "FWD", isCaptain: false, isViceCaptain: true, isStarting: true, isSub: false },
        ];
      }

      return squad.map((p, idx) => ({
        number: p.number || idx + 1,
        name: p.name,
        position: p.position || "MID",
        isCaptain: Boolean(p.isCaptain),
        isViceCaptain: Boolean(p.isViceCaptain),
        isStarting: idx < 11,
        isSub: idx >= 11,
      }));
    };

    const initialEvents: MatchEventRow[] = [];
    if (fixture.goalEvents && fixture.goalEvents.length > 0) {
      fixture.goalEvents.forEach((ge, idx) => {
        initialEvents.push({
          id: `init-ev-${idx}`,
          minute: ge.minute || `${20 + idx * 15}'`,
          team: ge.team === "HOME" ? "Home" : "Away",
          playerName: ge.scorerName,
          eventType: ge.isOwnGoal ? "Own Goal" : "Goal (Open Play)",
          assistOrSubIn: ge.assisterName || "-",
        });
      });
    }

    return {
      fixtureId: fixture.id,
      competitionName: "M-Pesa Sunday League (2026/27)",
      matchweek: fixture.matchweek || 1,
      date: fixture.date || "Sunday, Oct 25, 2026",
      time: fixture.time || "16:00 EAT",
      venue: fixture.venue || "M-Pesa Academy Stadium Main Arena",
      city: "Thika, Kenya",
      weatherPitchNotes: "Natural Grass • Dry Condition • Ambient Temp 24°C",
      homeLineup: buildLineup(homeClub.squad || []),
      awayLineup: buildLineup(awayClub.squad || []),
      events: initialEvents,
      homeStaff: {
        coach: homeClub.coachName || "Austin Brian Omondi",
        assistantCoach: homeClub.assistantCoach || "Technical Assistant",
        medicalStaff: homeClub.medicalStaff || "MFA Medical Staff",
      },
      awayStaff: {
        coach: awayClub.coachName || "Samwel Reagan Wanyama",
        assistantCoach: awayClub.assistantCoach || "Technical Assistant",
        medicalStaff: awayClub.medicalStaff || "MFA Medical Staff",
      },
      homeRateAway: {
        tacticalFairPlay: 5,
        benchConduct: 5,
        postMatchRespect: 5,
        notes: "Exemplary sportsmanship throughout",
      },
      awayRateHome: {
        tacticalFairPlay: 5,
        benchConduct: 5,
        postMatchRespect: 5,
        notes: "Respectful contest throughout",
      },
      stats: {
        homeScore: fixture.homeScore ?? 0,
        awayScore: fixture.awayScore ?? 0,
        homeHtScore: 0,
        awayHtScore: 0,
        homeYellowCards: 1,
        awayYellowCards: 1,
        homeRedCards: 0,
        awayRedCards: 0,
        homePenaltiesAwarded: 0,
        awayPenaltiesAwarded: 0,
        homePenaltiesScored: 0,
        awayPenaltiesScored: 0,
        manOfTheMatch: fixture.manOfTheMatch?.playerName || homeClub.squad?.[0]?.name || "Match MVP",
        manOfTheMatchTeam: fixture.manOfTheMatch?.teamName || homeClub.name,
        refereeNotes: "Match conducted under FIFA fair play regulations with zero violent conduct.",
      },
      officials: {
        referee: fixture.referee?.replace("Center Ref: ", "").split("(")[0]?.trim() || "Bidan Mwaura",
        assistantRef1: "Francis Ndirangu",
        assistantRef2: "Peter Otieno",
        fourthOfficial: "Victor Kamau",
        commissioner: fixture.matchCommissioner || "Mitchelle Muthoni",
      },
      signatures: {
        homeCaptainSigned: false,
        homeCaptainName: homeClub.squad?.find((p) => p.isCaptain)?.name || "Home Captain",
        homeSignedAt: "",
        homeCoachSigned: false,
        homeCoachName: homeClub.coachName,
        awayCaptainSigned: false,
        awayCaptainName: awayClub.squad?.find((p) => p.isCaptain)?.name || "Away Captain",
        awaySignedAt: "",
        awayCoachSigned: false,
        awayCoachName: awayClub.coachName,
        refereeSigned: false,
        refereeSignerName: "Bidan Mwaura (Official Match Referee)",
        refereeLicence: "FKF-PRO-8492",
        refereeSignedAt: "",
        commissionerSigned: false,
        commissionerName: "Mitchelle Muthoni (Match Commissioner)",
      },
      adminHandover: {
        isHandedOver: false,
        handedOverAt: "",
        recordedByAdmin: "League Records Administrator",
        notes: "Verified against physical paper signed by both coaches, captains, and referee.",
      },
    };
  };

  const [sheet, setSheet] = useState<MatchSheetRecord>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return buildInitialSheet();
  });

  const [showAdminRecordingDesk, setShowAdminRecordingDesk] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSheet(JSON.parse(stored));
      } else {
        setSheet(buildInitialSheet());
      }
    } catch {
      setSheet(buildInitialSheet());
    }
  }, [fixture.id]);

  const handleSaveSheet = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(sheet));

      // Sync updated score and events back into global fixtures
      try {
        const rawFixtures = localStorage.getItem("mpesa_pes_matches_v6");
        if (rawFixtures) {
          const fixturesArr: any[] = JSON.parse(rawFixtures);
          const fIdx = fixturesArr.findIndex((f) => f.id === fixture.id);
          if (fIdx !== -1) {
            fixturesArr[fIdx] = {
              ...fixturesArr[fIdx],
              homeScore: sheet.stats.homeScore,
              awayScore: sheet.stats.awayScore,
              status: sheet.adminHandover.isHandedOver ? "COMPLETED" : fixturesArr[fIdx].status,
              manOfTheMatch: {
                playerName: sheet.stats.manOfTheMatch,
                teamName: sheet.stats.manOfTheMatchTeam,
                rating: 9.2,
                goals: sheet.events.filter((e) => e.playerName === sheet.stats.manOfTheMatch && e.eventType.includes("Goal")).length,
                assists: sheet.events.filter((e) => e.assistOrSubIn === sheet.stats.manOfTheMatch).length,
              },
            };
            localStorage.setItem("mpesa_pes_matches_v6", JSON.stringify(fixturesArr));
          }
        }
      } catch (e) {
        console.warn("Could not sync fixtures with match sheet:", e);
      }

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("mpesa_matchsheet_updated", { detail: sheet }));

      setSaveToast("✓ Match sheet & official physical record saved successfully!");
      setTimeout(() => setSaveToast(null), 3000);
      if (onSave) onSave(sheet);
    } catch {
      setSaveToast("⚠ Failed to save match sheet locally.");
    }
  };

  // Real jsPDF document generation supporting both Blank Pre-Match and Completed Post-Match modes
  const handleDownloadPdf = (mode: "blank_form" | "completed") => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const isBlank = mode === "blank_form";

      // 1. Navy Header Banner
      doc.setFillColor(0, 32, 91); // #00205B Deep Navy
      doc.rect(0, 0, 210, 36, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(
        isBlank
          ? "M-PESA SUNDAY LEAGUE • OFFICIAL MATCH DAY SHEET & SCORECARD"
          : "M-PESA SUNDAY LEAGUE • CERTIFIED OFFICIAL MATCH REPORT",
        105,
        12,
        { align: "center" }
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(
        isBlank
          ? "PRINTABLE PRE-FILLED ROSTER & PHYSICAL FILL-IN FORM FOR MATCH OFFICIALS & COACHES"
          : "OFFICIAL VERIFIED RECORD ARCHIVED IN SUPREME LEAGUE DATABASE",
        105,
        18,
        { align: "center" }
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        `MATCHWEEK ${sheet.matchweek} • ${sheet.date} • KICKOFF: ${sheet.time}`,
        105,
        25,
        { align: "center" }
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(`Venue: ${sheet.venue} • City: ${sheet.city}`, 105, 31, { align: "center" });

      // 2. Score Banner
      doc.setFillColor(245, 247, 250);
      doc.rect(14, 40, 182, 18, "F");
      doc.setDrawColor(0, 32, 91);
      doc.rect(14, 40, 182, 18, "S");

      doc.setTextColor(0, 32, 91);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${homeClub.name.toUpperCase()} (HOME)`, 45, 48, { align: "center" });
      doc.text(`${awayClub.name.toUpperCase()} (AWAY)`, 165, 48, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      if (isBlank) {
        doc.text("[  ___  ]      VS      [  ___  ]", 105, 50, { align: "center" });
      } else {
        doc.text(`${sheet.stats.homeScore}   -   ${sheet.stats.awayScore}`, 105, 50, { align: "center" });
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      if (isBlank) {
        doc.text("Half-Time Score: [  ___  ] - [  ___  ]", 105, 55, { align: "center" });
      } else {
        doc.text(`Half-Time Score: (${sheet.stats.homeHtScore} - ${sheet.stats.awayHtScore})`, 105, 55, {
          align: "center",
        });
      }

      // 3. Lineups - Split Table (Starters ordered first, followed by Reserves)
      const sortedHomeLineup = [...sheet.homeLineup].sort((x, y) =>
        x.isStarting === y.isStarting ? 0 : x.isStarting ? -1 : 1
      );
      const sortedAwayLineup = [...sheet.awayLineup].sort((x, y) =>
        x.isStarting === y.isStarting ? 0 : x.isStarting ? -1 : 1
      );
      const maxRows = Math.max(sortedHomeLineup.length, sortedAwayLineup.length);
      const combinedLineups: (string | number)[][] = [];

      for (let i = 0; i < maxRows; i++) {
        const h = sortedHomeLineup[i];
        const a = sortedAwayLineup[i];

        combinedLineups.push([
          h ? h.number : "",
          h ? h.name : "",
          h ? h.position : "",
          isBlank ? "[ ]" : h ? (h.isStarting ? "Start" : "Sub") : "",
          isBlank ? "[ ]" : h ? (h.isCaptain ? "C" : h.isViceCaptain ? "VC" : "-") : "",
          "|",
          a ? a.number : "",
          a ? a.name : "",
          a ? a.position : "",
          isBlank ? "[ ]" : a ? (a.isStarting ? "Start" : "Sub") : "",
          isBlank ? "[ ]" : a ? (a.isCaptain ? "C" : a.isViceCaptain ? "VC" : "-") : "",
        ]);
      }

      autoTable(doc, {
        startY: 61,
        head: [
          [
            "#",
            `${homeClub.name} (Roster)`,
            "Pos",
            isBlank ? "Start/Sub" : "Role",
            "C",
            "",
            "#",
            `${awayClub.name} (Roster)`,
            "Pos",
            isBlank ? "Start/Sub" : "Role",
            "C",
          ],
        ],
        body: combinedLineups,
        theme: "grid",
        styles: { fontSize: 7, cellPadding: 1.4, halign: "center" },
        headStyles: { fillColor: [0, 32, 91], textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 7 },
          1: { cellWidth: 43, halign: "left" },
          2: { cellWidth: 10 },
          3: { cellWidth: 14 },
          4: { cellWidth: 8 },
          5: { cellWidth: 3, halign: "center", fontStyle: "bold" },
          6: { cellWidth: 7 },
          7: { cellWidth: 43, halign: "left" },
          8: { cellWidth: 10 },
          9: { cellWidth: 14 },
          10: { cellWidth: 8 },
        },
      });

      let currentY = ((doc as any).lastAutoTable?.finalY ?? 61) + 5;

      // 4. Match Events & Scoring Log Table
      if (isBlank) {
        // Blank ruled lines for the referee to record incidents
        const blankEventRows: string[][] = [];
        for (let r = 1; r <= 8; r++) {
          blankEventRows.push([`___'`, "Home / Away", "________________________", "Goal / YC / RC / Sub", "________________________"]);
        }
        autoTable(doc, {
          startY: currentY,
          head: [["Minute", "Team", "Scorer / Carded Player (#)", "Event Type (Goal, Pen, YC, RC)", "Assist / Sub-In Player"]],
          body: blankEventRows,
          theme: "grid",
          styles: { fontSize: 7, cellPadding: 2, halign: "center" },
          headStyles: { fillColor: [0, 32, 91], textColor: [255, 255, 255], fontStyle: "bold" },
          columnStyles: {
            0: { cellWidth: 18 },
            1: { cellWidth: 28 },
            2: { cellWidth: 50, halign: "left" },
            3: { cellWidth: 44 },
            4: { cellWidth: 42, halign: "left" },
          },
        });
      } else {
        // Completed events table
        const eventRows =
          sheet.events.length > 0
            ? sheet.events.map((e) => [
                e.minute,
                e.team === "Home" ? homeClub.name : awayClub.name,
                e.playerName,
                e.eventType,
                e.assistOrSubIn,
              ])
            : [["-", "None", "No goals or cards recorded", "-", "-"]];

        autoTable(doc, {
          startY: currentY,
          head: [["Minute", "Team", "Player Name (#)", "Event Type", "Assist / Sub In"]],
          body: eventRows,
          theme: "grid",
          styles: { fontSize: 7.5, cellPadding: 1.6 },
          headStyles: { fillColor: [0, 32, 91], textColor: [255, 255, 255], fontStyle: "bold" },
          columnStyles: {
            0: { cellWidth: 18, halign: "center", fontStyle: "bold" },
            1: { cellWidth: 35 },
            2: { cellWidth: 48, fontStyle: "bold" },
            3: { cellWidth: 40 },
            4: { cellWidth: 41 },
          },
        });
      }

      currentY = ((doc as any).lastAutoTable?.finalY ?? 130) + 5;

      // 5. Official Measurable Statistics (No unmeasurable possession/passes)
      autoTable(doc, {
        startY: currentY,
        head: [[homeClub.name, "OFFICIAL MEASURABLE MATCH DATA", awayClub.name]],
        body: [
          [isBlank ? "[     ]" : sheet.stats.homeScore, "Final Score (Full-Time)", isBlank ? "[     ]" : sheet.stats.awayScore],
          [isBlank ? "[     ]" : sheet.stats.homeHtScore, "Half-Time Score", isBlank ? "[     ]" : sheet.stats.awayHtScore],
          [isBlank ? "[     ]" : sheet.stats.homeYellowCards, "Yellow Cards", isBlank ? "[     ]" : sheet.stats.awayYellowCards],
          [isBlank ? "[     ]" : sheet.stats.homeRedCards, "Red Cards (Expulsions)", isBlank ? "[     ]" : sheet.stats.awayRedCards],
          [
            isBlank ? "[     /     ]" : `${sheet.stats.homePenaltiesScored} / ${sheet.stats.homePenaltiesAwarded}`,
            "Penalties (Scored / Awarded)",
            isBlank ? "[     /     ]" : `${sheet.stats.awayPenaltiesScored} / ${sheet.stats.awayPenaltiesAwarded}`,
          ],
        ],
        theme: "striped",
        styles: { fontSize: 7, cellPadding: 1.5, halign: "center" },
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: "bold" },
          1: { cellWidth: 92, fontStyle: "bold" },
          2: { cellWidth: 45, fontStyle: "bold" },
        },
      });

      currentY = ((doc as any).lastAutoTable?.finalY ?? 180) + 5;

      if (currentY > 230) {
        doc.addPage();
        currentY = 18;
      }

      // 6. Signatures & Official Handover Block
      doc.setFillColor(241, 245, 249);
      doc.rect(14, currentY, 182, 42, "F");
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, currentY, 182, 42, "S");

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("POST-MATCH MUTUAL SIGN-OFF & STATUTORY HANDOVER TO LEAGUE ADMINISTRATOR", 105, currentY + 5, {
        align: "center",
      });

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(`Home Captain Sign: _______________________ Date: ________`, 18, currentY + 11);
      doc.text(`Away Captain Sign: _______________________ Date: ________`, 112, currentY + 11);

      doc.text(`Home Head Coach Sign: ___________________ Date: ________`, 18, currentY + 18);
      doc.text(`Away Head Coach Sign: ___________________ Date: ________`, 112, currentY + 18);

      doc.text(`Center Referee Sign: _____________________ Licence: ________`, 18, currentY + 25);
      doc.text(`Match Commissioner: _____________________ Stamp: ________`, 112, currentY + 25);

      // Official Handover Clause
      doc.setFillColor(254, 243, 199);
      doc.rect(16, currentY + 30, 178, 10, "F");
      doc.setTextColor(146, 64, 14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text(
        "OFFICIAL STATUTORY HANDOVER CLAUSE: Upon mutual signing after final whistle, this physical document is handed over to the",
        105,
        currentY + 33.5,
        { align: "center" }
      );
      doc.text(
        "Supreme League Administrator for official verification, digital entry into the league standings table, and player leaderboard calculations.",
        105,
        currentY + 37.5,
        { align: "center" }
      );

      // Save PDF to client
      const filePrefix = isBlank ? "Blank_MatchDay_Sheet" : "Certified_Match_Sheet";
      const fileName = `${filePrefix}_MW${sheet.matchweek}_${homeClub.shortCode}_vs_${awayClub.shortCode}.pdf`;
      doc.save(fileName);

      setIsGeneratingPdf(false);
      setSaveToast(`✓ ${fileName} generated and downloaded successfully!`);
      setTimeout(() => setSaveToast(null), 3500);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setIsGeneratingPdf(false);
      setSaveToast("⚠ Failed to generate PDF. Please use the Print button as fallback.");
      setTimeout(() => setSaveToast(null), 3500);
    }
  };

  const handleToggleLineup = (
    side: "home" | "away",
    index: number,
    field: "isStarting" | "isSub" | "isCaptain" | "isViceCaptain"
  ) => {
    setSheet((prev) => {
      const target = side === "home" ? [...prev.homeLineup] : [...prev.awayLineup];
      if (field === "isStarting") {
        target[index].isStarting = !target[index].isStarting;
        if (target[index].isStarting) target[index].isSub = false;
      } else if (field === "isSub") {
        target[index].isSub = !target[index].isSub;
        if (target[index].isSub) target[index].isStarting = false;
      } else if (field === "isCaptain") {
        target[index].isCaptain = !target[index].isCaptain;
        if (target[index].isCaptain) target[index].isViceCaptain = false;
      } else if (field === "isViceCaptain") {
        target[index].isViceCaptain = !target[index].isViceCaptain;
        if (target[index].isViceCaptain) target[index].isCaptain = false;
      }
      return side === "home" ? { ...prev, homeLineup: target } : { ...prev, awayLineup: target };
    });
  };

  const handleAddEvent = () => {
    const newEv: MatchEventRow = {
      id: `ev-${Date.now()}`,
      minute: "45'",
      team: "Home",
      playerName: sheet.homeLineup[0]?.name || "Player",
      eventType: "Goal (Open Play)",
      assistOrSubIn: "-",
    };
    setSheet((prev) => ({ ...prev, events: [...prev.events, newEv] }));
  };

  const handleRemoveEvent = (id: string) => {
    setSheet((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));
  };

  const handleSign = (role: "home" | "away" | "referee" | "commissioner") => {
    const now = new Date().toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
    setSheet((prev) => {
      const sigs = { ...prev.signatures };
      if (role === "home") {
        sigs.homeCaptainSigned = true;
        sigs.homeCoachSigned = true;
        sigs.homeSignedAt = now;
      } else if (role === "away") {
        sigs.awayCaptainSigned = true;
        sigs.awayCoachSigned = true;
        sigs.awaySignedAt = now;
      } else if (role === "referee") {
        sigs.refereeSigned = true;
        sigs.refereeSignedAt = now;
      } else if (role === "commissioner") {
        sigs.commissionerSigned = true;
      }
      return { ...prev, signatures: sigs };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="bg-[#0b0821] border border-[#2e2554] print:border-none print:shadow-none print:bg-white print:text-black text-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[96vh] print:max-h-none overflow-hidden my-auto">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="p-4 bg-[#141029] border-b border-[#2e2554] flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-header text-sm sm:text-base font-black uppercase text-white tracking-wide">
                Official Match Sheet & Inspection Report • MW {fixture.matchweek}
              </h3>
              <p className="text-xs text-gray-400">
                {homeClub.name} vs {awayClub.name} • {fixture.date}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Admin Handover & Digital Recording Desk */}
            <button
              type="button"
              onClick={() => setShowAdminRecordingDesk(!showAdminRecordingDesk)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer ${
                showAdminRecordingDesk
                  ? "bg-amber-400 text-black font-black"
                  : "bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>{showAdminRecordingDesk ? "Hide Admin Desk" : "Admin Recording Desk"}</span>
            </button>

            {/* Save Changes */}
            <button
              type="button"
              onClick={handleSaveSheet}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>

            {/* BUTTON 1: DOWNLOAD OFFICIAL BLANK PRE-MATCH SHEET FOR MATCH DAY */}
            <button
              type="button"
              onClick={() => handleDownloadPdf("blank_form")}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg cursor-pointer disabled:opacity-50"
              title="Download official printable blank form with team player names for coaches and referees to fill on matchday"
            >
              <Download className="w-4 h-4" />
              <span>Blank Matchday PDF</span>
            </button>

            {/* BUTTON 2: DOWNLOAD COMPLETED MATCH SHEET */}
            <button
              type="button"
              onClick={() => handleDownloadPdf("completed")}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:brightness-110 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg cursor-pointer disabled:opacity-50"
              title="Download certified completed match report with recorded scores and events"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Certified PDF</span>
            </button>

            {/* Browser Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Print via Browser"
            >
              <Printer className="w-4 h-4" />
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

        {saveToast && (
          <div className="bg-emerald-600/90 text-white text-xs font-bold px-4 py-2 text-center print:hidden">
            {saveToast}
          </div>
        )}

        {/* =========================================================
            ADMIN PHYSICAL HANDOVER & DIGITAL RECORDING DESK
            ========================================================= */}
        {showAdminRecordingDesk && (
          <div className="bg-[#120e2e] border-b border-[#2e2554] p-5 space-y-4 print:hidden animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2554] pb-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">
                    Admin Physical Match Sheet Recording Desk
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Handed over by match referee and signed by both coaches. Enter verified paper records to sync to the league table and player leaderboard.
                  </p>
                </div>
              </div>

              {/* Handover Status Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-[#0a071b] px-3 py-1.5 rounded-xl border border-amber-400/40">
                <input
                  type="checkbox"
                  checked={sheet.adminHandover.isHandedOver}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSheet((prev) => ({
                      ...prev,
                      adminHandover: {
                        ...prev.adminHandover,
                        isHandedOver: checked,
                        handedOverAt: checked ? new Date().toLocaleString("en-KE") : "",
                      },
                    }));
                  }}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
                <span className="text-xs font-black text-amber-300">
                  {sheet.adminHandover.isHandedOver ? "✓ Physical Sheet Handed Over to Admin" : "Pending Official Handover"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Score Recording */}
              <div className="p-3 bg-[#0a071b] rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-gray-400 uppercase text-[10px] block">
                  Final Score (Full-Time)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-emerald-400 font-mono block">{homeClub.name} Goals</label>
                    <input
                      type="number"
                      min="0"
                      value={sheet.stats.homeScore}
                      onChange={(e) =>
                        setSheet((prev) => ({
                          ...prev,
                          stats: { ...prev.stats, homeScore: Math.max(0, parseInt(e.target.value) || 0) },
                        }))
                      }
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-lg px-2 py-1.5 text-center font-black text-white text-base"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-blue-400 font-mono block">{awayClub.name} Goals</label>
                    <input
                      type="number"
                      min="0"
                      value={sheet.stats.awayScore}
                      onChange={(e) =>
                        setSheet((prev) => ({
                          ...prev,
                          stats: { ...prev.stats, awayScore: Math.max(0, parseInt(e.target.value) || 0) },
                        }))
                      }
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-lg px-2 py-1.5 text-center font-black text-white text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Half-Time Score */}
              <div className="p-3 bg-[#0a071b] rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-gray-400 uppercase text-[10px] block">
                  Half-Time Score (HT)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-emerald-400 font-mono block">{homeClub.shortCode} HT</label>
                    <input
                      type="number"
                      min="0"
                      value={sheet.stats.homeHtScore}
                      onChange={(e) =>
                        setSheet((prev) => ({
                          ...prev,
                          stats: { ...prev.stats, homeHtScore: Math.max(0, parseInt(e.target.value) || 0) },
                        }))
                      }
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-lg px-2 py-1.5 text-center font-black text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-blue-400 font-mono block">{awayClub.shortCode} HT</label>
                    <input
                      type="number"
                      min="0"
                      value={sheet.stats.awayHtScore}
                      onChange={(e) =>
                        setSheet((prev) => ({
                          ...prev,
                          stats: { ...prev.stats, awayHtScore: Math.max(0, parseInt(e.target.value) || 0) },
                        }))
                      }
                      className="w-full bg-[#141029] border border-[#2e2554] rounded-lg px-2 py-1.5 text-center font-black text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Disciplinary Cards & MOTM */}
              <div className="p-3 bg-[#0a071b] rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-gray-400 uppercase text-[10px] block">
                  Cards & Man of the Match
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-amber-300 font-mono block">Total Yellows (H/A)</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min="0"
                        value={sheet.stats.homeYellowCards}
                        onChange={(e) =>
                          setSheet((prev) => ({
                            ...prev,
                            stats: { ...prev.stats, homeYellowCards: Math.max(0, parseInt(e.target.value) || 0) },
                          }))
                        }
                        className="w-1/2 bg-[#141029] border border-[#2e2554] rounded px-1.5 py-1 text-center font-bold text-amber-300 text-xs"
                      />
                      <input
                        type="number"
                        min="0"
                        value={sheet.stats.awayYellowCards}
                        onChange={(e) =>
                          setSheet((prev) => ({
                            ...prev,
                            stats: { ...prev.stats, awayYellowCards: Math.max(0, parseInt(e.target.value) || 0) },
                          }))
                        }
                        className="w-1/2 bg-[#141029] border border-[#2e2554] rounded px-1.5 py-1 text-center font-bold text-amber-300 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-rose-300 font-mono block">Total Reds (H/A)</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min="0"
                        value={sheet.stats.homeRedCards}
                        onChange={(e) =>
                          setSheet((prev) => ({
                            ...prev,
                            stats: { ...prev.stats, homeRedCards: Math.max(0, parseInt(e.target.value) || 0) },
                          }))
                        }
                        className="w-1/2 bg-[#141029] border border-[#2e2554] rounded px-1.5 py-1 text-center font-bold text-rose-300 text-xs"
                      />
                      <input
                        type="number"
                        min="0"
                        value={sheet.stats.awayRedCards}
                        onChange={(e) =>
                          setSheet((prev) => ({
                            ...prev,
                            stats: { ...prev.stats, awayRedCards: Math.max(0, parseInt(e.target.value) || 0) },
                          }))
                        }
                        className="w-1/2 bg-[#141029] border border-[#2e2554] rounded px-1.5 py-1 text-center font-bold text-rose-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2e2554]">
              <span className="text-[11px] text-gray-400">
                {sheet.adminHandover.isHandedOver
                  ? `✓ Handed over on ${sheet.adminHandover.handedOverAt || "Matchday"}`
                  : "Please obtain signed paper sheet before final recording"}
              </span>
              <button
                type="button"
                onClick={handleSaveSheet}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-wide rounded-xl shadow cursor-pointer"
              >
                Verify & Save Paper Record
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
          {/* ==========================================
              SECTION 1: HEADER & MATCH METADATA
              ========================================== */}
          <div className="border border-indigo-500/30 print:border-black rounded-2xl p-5 bg-[#120e2e] print:bg-white text-white print:text-black space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 print:border-black pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 print:text-black">
                  1. Competition & Fixture Details
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white print:text-black">
                  {sheet.competitionName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 print:text-black mt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-300 print:text-black">
                    <Calendar className="w-3.5 h-3.5" />
                    Matchweek {sheet.matchweek}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
                    {sheet.date} ({sheet.time})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 print:text-black" />
                    {sheet.venue}, {sheet.city}
                  </span>
                </div>
              </div>

              {/* Match Officials Assigned */}
              <div className="p-3 bg-black/40 print:bg-gray-100 rounded-xl border border-white/10 print:border-black text-xs space-y-1">
                <span className="font-bold text-gray-400 print:text-black text-[10px] uppercase block">
                  Assigned Match Officials:
                </span>
                <div className="text-gray-200 print:text-black font-mono text-[11px]">
                  <strong>Ref:</strong> {sheet.officials.referee}
                </div>
                <div className="text-gray-400 print:text-black text-[10px]">
                  <strong>AR1/AR2:</strong> {sheet.officials.assistantRef1} • {sheet.officials.assistantRef2}
                </div>
                <div className="text-gray-400 print:text-black text-[10px]">
                  <strong>4th / Comm:</strong> {sheet.officials.fourthOfficial} • {sheet.officials.commissioner}
                </div>
              </div>
            </div>

            {/* Scorecard Hero Banner */}
            <div className="grid grid-cols-3 items-center text-center p-4 bg-gradient-to-r from-emerald-950/30 via-[#0a071b] to-blue-950/30 print:bg-gray-100 rounded-2xl border border-white/10 print:border-black">
              <div className="space-y-1">
                <span className="text-base sm:text-xl font-black text-emerald-400 print:text-black block">
                  {homeClub.name}
                </span>
                <span className="text-[10px] text-gray-400 print:text-gray-700 uppercase font-bold">
                  Home Side • Coach {homeClub.coachName}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-white print:text-black">
                  {sheet.stats.homeScore} : {sheet.stats.awayScore}
                </div>
                <span className="text-[10px] font-mono text-gray-400 print:text-black block uppercase font-bold">
                  HT: ({sheet.stats.homeHtScore} - {sheet.stats.awayHtScore})
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-base sm:text-xl font-black text-blue-400 print:text-black block">
                  {awayClub.name}
                </span>
                <span className="text-[10px] text-gray-400 print:text-gray-700 uppercase font-bold">
                  Visiting Side • Coach {awayClub.coachName}
                </span>
              </div>
            </div>
          </div>

          {/* ==========================================
              SECTION 2: TEAM LINEUPS & PLAYER ROSTER
              ========================================== */}
          <div className="border border-indigo-500/30 print:border-black rounded-2xl p-5 bg-[#120e2e] print:bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 print:border-black pb-2">
              <h3 className="font-header text-sm font-black uppercase text-white print:text-black flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400 print:text-black" />
                2. Team Lineups & Official Player Roster (Pre-filled for Verification)
              </h3>
              <span className="text-[10px] font-mono text-gray-400 print:text-black">
                Tick Starting XI, Substitutes, and Captaincy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Home Lineup Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black uppercase text-emerald-400 print:text-black">
                    {homeClub.name} Roster
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 print:text-black">
                    {sheet.homeLineup.filter((p) => p.isStarting).length} Starters •{" "}
                    {sheet.homeLineup.filter((p) => p.isSub).length} Subs
                  </span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/10 print:border-black">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/50 print:bg-gray-200 text-gray-400 print:text-black uppercase text-[10px] font-bold border-b border-white/10 print:border-black">
                      <tr>
                        <th className="py-1.5 px-2 text-center w-8">#</th>
                        <th className="py-1.5 px-2">Player Name</th>
                        <th className="py-1.5 px-2 text-center w-10">Pos</th>
                        <th className="py-1.5 px-1 text-center w-12">C / VC</th>
                        <th className="py-1.5 px-1 text-center w-10">Start</th>
                        <th className="py-1.5 px-1 text-center w-10">Sub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-black">
                      {sheet.homeLineup.map((p, idx) => (
                        <tr
                          key={`home-lineup-${idx}`}
                          className={`hover:bg-white/5 print:hover:bg-transparent ${
                            p.isStarting ? "bg-emerald-500/5 print:bg-transparent" : ""
                          }`}
                        >
                          <td className="py-1.5 px-2 text-center font-bold text-white print:text-black font-mono">
                            {p.number}
                          </td>
                          <td className="py-1.5 px-2 font-bold text-white print:text-black">
                            {p.name}
                          </td>
                          <td className="py-1.5 px-2 text-center text-gray-300 print:text-black font-mono text-[10px]">
                            {p.position}
                          </td>
                          <td className="py-1.5 px-1 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleLineup(
                                  "home",
                                  idx,
                                  p.isCaptain ? "isViceCaptain" : "isCaptain"
                                )
                              }
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono cursor-pointer print:border print:border-black ${
                                p.isCaptain
                                  ? "bg-amber-400 text-black font-black"
                                  : p.isViceCaptain
                                  ? "bg-cyan-400 text-black font-black"
                                  : "text-gray-500 hover:text-white"
                              }`}
                            >
                              {p.isCaptain ? "C" : p.isViceCaptain ? "VC" : "-"}
                            </button>
                          </td>
                          <td className="py-1.5 px-1 text-center">
                            <input
                              type="checkbox"
                              checked={p.isStarting}
                              onChange={() => handleToggleLineup("home", idx, "isStarting")}
                              className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-1.5 px-1 text-center">
                            <input
                              type="checkbox"
                              checked={p.isSub}
                              onChange={() => handleToggleLineup("home", idx, "isSub")}
                              className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Away Lineup Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black uppercase text-blue-400 print:text-black">
                    {awayClub.name} Roster
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 print:text-black">
                    {sheet.awayLineup.filter((p) => p.isStarting).length} Starters •{" "}
                    {sheet.awayLineup.filter((p) => p.isSub).length} Subs
                  </span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/10 print:border-black">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/50 print:bg-gray-200 text-gray-400 print:text-black uppercase text-[10px] font-bold border-b border-white/10 print:border-black">
                      <tr>
                        <th className="py-1.5 px-2 text-center w-8">#</th>
                        <th className="py-1.5 px-2">Player Name</th>
                        <th className="py-1.5 px-2 text-center w-10">Pos</th>
                        <th className="py-1.5 px-1 text-center w-12">C / VC</th>
                        <th className="py-1.5 px-1 text-center w-10">Start</th>
                        <th className="py-1.5 px-1 text-center w-10">Sub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-black">
                      {sheet.awayLineup.map((p, idx) => (
                        <tr
                          key={`away-lineup-${idx}`}
                          className={`hover:bg-white/5 print:hover:bg-transparent ${
                            p.isStarting ? "bg-blue-500/5 print:bg-transparent" : ""
                          }`}
                        >
                          <td className="py-1.5 px-2 text-center font-bold text-white print:text-black font-mono">
                            {p.number}
                          </td>
                          <td className="py-1.5 px-2 font-bold text-white print:text-black">
                            {p.name}
                          </td>
                          <td className="py-1.5 px-2 text-center text-gray-300 print:text-black font-mono text-[10px]">
                            {p.position}
                          </td>
                          <td className="py-1.5 px-1 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleLineup(
                                  "away",
                                  idx,
                                  p.isCaptain ? "isViceCaptain" : "isCaptain"
                                )
                              }
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono cursor-pointer print:border print:border-black ${
                                p.isCaptain
                                  ? "bg-amber-400 text-black font-black"
                                  : p.isViceCaptain
                                  ? "bg-cyan-400 text-black font-black"
                                  : "text-gray-500 hover:text-white"
                              }`}
                            >
                              {p.isCaptain ? "C" : p.isViceCaptain ? "VC" : "-"}
                            </button>
                          </td>
                          <td className="py-1.5 px-1 text-center">
                            <input
                              type="checkbox"
                              checked={p.isStarting}
                              onChange={() => handleToggleLineup("away", idx, "isStarting")}
                              className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-1.5 px-1 text-center">
                            <input
                              type="checkbox"
                              checked={p.isSub}
                              onChange={() => handleToggleLineup("away", idx, "isSub")}
                              className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
              SECTION 3: MATCH EVENTS & SCORING LOG
              ========================================== */}
          <div className="border border-indigo-500/30 print:border-black rounded-2xl p-5 bg-[#120e2e] print:bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 print:border-black pb-2">
              <h3 className="font-header text-sm font-black uppercase text-white print:text-black flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 print:text-black" />
                3. Match Events, Scorers & Chronological Log
              </h3>
              <button
                type="button"
                onClick={handleAddEvent}
                className="print:hidden px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Goal / Card Incident</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 print:border-black">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 print:bg-gray-200 text-gray-400 print:text-black uppercase text-[10px] font-bold border-b border-white/10 print:border-black">
                  <tr>
                    <th className="py-2 px-3 w-16">Minute</th>
                    <th className="py-2 px-3 w-28">Team</th>
                    <th className="py-2 px-3">Player Name (#)</th>
                    <th className="py-2 px-3">Event Type</th>
                    <th className="py-2 px-3">Assist / Sub In Player</th>
                    <th className="py-2 px-3 text-right print:hidden w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-black">
                  {sheet.events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500 italic">
                        No match incidents logged yet. Use "Add Goal / Card Incident" or input via Admin Recording Desk.
                      </td>
                    </tr>
                  ) : (
                    sheet.events.map((ev, idx) => (
                      <tr key={ev.id ?? `ev-${idx}`} className="hover:bg-white/5 print:hover:bg-transparent">
                        <td className="py-2 px-3 font-mono font-bold text-amber-300 print:text-black">
                          {ev.minute}
                        </td>
                        <td className="py-2 px-3 font-bold text-white print:text-black">
                          {ev.team === "Home" ? homeClub.name : awayClub.name}
                        </td>
                        <td className="py-2 px-3 font-bold text-white print:text-black">
                          {ev.playerName}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono print:border print:border-black ${
                              ev.eventType.includes("Goal")
                                ? "bg-emerald-500/20 text-emerald-300 print:bg-transparent print:text-black"
                                : ev.eventType.includes("Yellow")
                                ? "bg-amber-400/20 text-amber-300 print:bg-transparent print:text-black"
                                : ev.eventType.includes("Red")
                                ? "bg-red-500/20 text-red-300 print:bg-transparent print:text-black"
                                : "bg-blue-500/20 text-blue-300 print:bg-transparent print:text-black"
                            }`}
                          >
                            {ev.eventType}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-300 print:text-black">
                          {ev.assistOrSubIn}
                        </td>
                        <td className="py-2 px-3 text-right print:hidden">
                          <button
                            type="button"
                            onClick={() => handleRemoveEvent(ev.id)}
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

          {/* ==========================================
              SECTION 4: MEASURABLE PHYSICAL MATCH SUMMARY
              ========================================== */}
          <div className="border border-indigo-500/30 print:border-black rounded-2xl p-5 bg-[#120e2e] print:bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 print:border-black pb-2">
              <h3 className="font-header text-sm font-black uppercase text-white print:text-black flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400 print:text-black" />
                4. Measurable Match Data & Official Accolades
              </h3>
              <span className="text-[10px] font-mono text-gray-400 print:text-black">
                Physical indicators recorded by match officials
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-black/40 print:bg-gray-100 rounded-xl border border-white/5 print:border-black">
                <span className="text-[10px] text-gray-400 print:text-gray-700 uppercase font-bold block">
                  Final Score (FT)
                </span>
                <span className="text-xl font-black text-white print:text-black font-mono">
                  {sheet.stats.homeScore} : {sheet.stats.awayScore}
                </span>
              </div>

              <div className="p-3 bg-black/40 print:bg-gray-100 rounded-xl border border-white/5 print:border-black">
                <span className="text-[10px] text-gray-400 print:text-gray-700 uppercase font-bold block">
                  Half-Time Score (HT)
                </span>
                <span className="text-xl font-black text-gray-300 print:text-black font-mono">
                  {sheet.stats.homeHtScore} : {sheet.stats.awayHtScore}
                </span>
              </div>

              <div className="p-3 bg-black/40 print:bg-gray-100 rounded-xl border border-white/5 print:border-black">
                <span className="text-[10px] text-amber-400 print:text-gray-700 uppercase font-bold block">
                  Yellow Cards (H/A)
                </span>
                <span className="text-xl font-black text-amber-300 print:text-black font-mono">
                  {sheet.stats.homeYellowCards} : {sheet.stats.awayYellowCards}
                </span>
              </div>

              <div className="p-3 bg-black/40 print:bg-gray-100 rounded-xl border border-white/5 print:border-black">
                <span className="text-[10px] text-rose-400 print:text-gray-700 uppercase font-bold block">
                  Red Cards (H/A)
                </span>
                <span className="text-xl font-black text-rose-300 print:text-black font-mono">
                  {sheet.stats.homeRedCards} : {sheet.stats.awayRedCards}
                </span>
              </div>
            </div>

            {/* Man of the Match & Referee Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-black/30 print:bg-gray-50 rounded-xl border border-white/5 print:border-black space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 print:text-black block">
                  ⭐ Official Man of the Match Nominee:
                </span>
                <div className="text-white print:text-black font-black text-sm">
                  {sheet.stats.manOfTheMatch} ({sheet.stats.manOfTheMatchTeam})
                </div>
              </div>
              <div className="p-3 bg-black/30 print:bg-gray-50 rounded-xl border border-white/5 print:border-black space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 print:text-black block">
                  Referee Notes & Pitch Condition:
                </span>
                <p className="text-gray-300 print:text-black text-xs">
                  {sheet.stats.refereeNotes || "Match conducted smoothly under official league rules."}
                </p>
              </div>
            </div>
          </div>

          {/* ==========================================
              SECTION 5: STATUTORY SIGN-OFF & HANDOVER
              ========================================== */}
          <div className="border-2 border-indigo-500/40 print:border-black rounded-2xl p-5 bg-[#120e2e] print:bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 print:border-black pb-2">
              <h3 className="font-header text-sm font-black uppercase text-white print:text-black flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400 print:text-black" />
                5. Statutory Sign-offs & Post-Match Handover to League Administrator
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Home Bench Sign */}
              <div className="p-4 bg-black/40 print:bg-gray-50 rounded-xl border border-emerald-500/30 print:border-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-400 print:text-black uppercase text-xs">
                    {homeClub.name} Bench
                  </span>
                  {sheet.signatures.homeCaptainSigned && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      ✓ Signed
                    </span>
                  )}
                </div>
                <div className="text-gray-300 print:text-black text-[11px] space-y-1">
                  <div>Captain: <strong>{sheet.signatures.homeCaptainName}</strong></div>
                  <div>Head Coach: <strong>{sheet.signatures.homeCoachName}</strong></div>
                </div>
                {!sheet.signatures.homeCaptainSigned && (
                  <button
                    type="button"
                    onClick={() => handleSign("home")}
                    className="print:hidden w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    Sign as Home Bench
                  </button>
                )}
              </div>

              {/* Away Bench Sign */}
              <div className="p-4 bg-black/40 print:bg-gray-50 rounded-xl border border-blue-500/30 print:border-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-400 print:text-black uppercase text-xs">
                    {awayClub.name} Bench
                  </span>
                  {sheet.signatures.awayCaptainSigned && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                      ✓ Signed
                    </span>
                  )}
                </div>
                <div className="text-gray-300 print:text-black text-[11px] space-y-1">
                  <div>Captain: <strong>{sheet.signatures.awayCaptainName}</strong></div>
                  <div>Head Coach: <strong>{sheet.signatures.awayCoachName}</strong></div>
                </div>
                {!sheet.signatures.awayCaptainSigned && (
                  <button
                    type="button"
                    onClick={() => handleSign("away")}
                    className="print:hidden w-full py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    Sign as Away Bench
                  </button>
                )}
              </div>

              {/* Match Officials Sign */}
              <div className="p-4 bg-black/40 print:bg-gray-50 rounded-xl border border-amber-500/30 print:border-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-300 print:text-black uppercase text-xs">
                    Match Referee Crew
                  </span>
                  {sheet.signatures.refereeSigned && (
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      ✓ Certified
                    </span>
                  )}
                </div>
                <div className="text-gray-300 print:text-black text-[11px] space-y-1">
                  <div>Ref: <strong>{sheet.officials.referee}</strong></div>
                  <div>Badge: <strong>{sheet.signatures.refereeLicence}</strong></div>
                </div>
                {!sheet.signatures.refereeSigned && (
                  <button
                    type="button"
                    onClick={() => handleSign("referee")}
                    className="print:hidden w-full py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    Certify as Referee
                  </button>
                )}
              </div>
            </div>

            {/* Official Handover Statutory Notice */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-amber-300 font-black uppercase text-[10px] block">
                  📜 Mandatory Post-Match Statutory Handover
                </span>
                <p className="text-gray-300 text-[11px]">
                  After the final whistle and signing by both captains, coaches, and referee, this official physical sheet is handed directly to the League Administrator to be recorded into the official league database.
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shrink-0 ${
                sheet.adminHandover.isHandedOver
                  ? "bg-emerald-500 text-black"
                  : "bg-amber-400/20 text-amber-300"
              }`}>
                {sheet.adminHandover.isHandedOver ? "Handed Over & Verified" : "Awaiting Handover"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
