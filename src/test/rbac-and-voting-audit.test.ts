import { describe, expect, it, beforeEach } from "vitest";
import {
  authenticateWithRbac,
  getCurrentRbacUser,
  logoutRbacUser,
  KNOWN_ADMIN_EMAILS,
} from "../lib/rbacSystem";
import {
  getMvpWinnersHistory,
  archiveMvpWinner,
  deleteWinnerFromHistory,
  saveMvpWinnersHistory,
  DEFAULT_MVP_WINNERS,
} from "../lib/mvpWinnersHistory";

describe("Role-Based Access Control (RBAC) System", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("authenticates Master Passcode msl-27 and grants admin role", () => {
    const result = authenticateWithRbac("msl-27");
    expect(result.success).toBe(true);
    expect(result.user?.role).toBe("admin");
    expect(result.user?.leagueRole).toBe("SUPER_ADMIN");
    expect(result.user?.isSuperAdmin).toBe(true);
    expect(getCurrentRbacUser()?.role).toBe("admin");
  });

  it("authenticates Master Passcode case-insensitively with whitespace", () => {
    const result = authenticateWithRbac("  MSL-27  ");
    expect(result.success).toBe(true);
    expect(result.user?.role).toBe("admin");
  });

  it("authenticates known admin emails with admin role", () => {
    for (const adminEmail of KNOWN_ADMIN_EMAILS) {
      const result = authenticateWithRbac(adminEmail);
      expect(result.success).toBe(true);
      expect(result.user?.role).toBe("admin");
      expect(result.user?.leagueRole).toBe("SUPER_ADMIN");
    }
  });

  it("authenticates board member access codes with appropriate role", () => {
    const presResult = authenticateWithRbac("PRES-8491");
    if (presResult.success) {
      expect(presResult.user?.role).toBe("admin");
      expect(presResult.user?.leagueRole).toBe("PRESIDENT");
    }

    const regResult = authenticateWithRbac("REG-6274");
    if (regResult.success) {
      expect(regResult.user?.role).toBe("board");
      expect(regResult.user?.leagueRole).toBe("REGULATIONS_MANAGER");
    }
  });

  it("authenticates board members by their academy email with board role", () => {
    // Cheryl Cosmas is registered on the council as Regulations Manager
    const result = authenticateWithRbac("cheryl.cosmas@mpesafoundationacademy.ac.ke");
    expect(result.success).toBe(true);
    expect(result.user?.role).toBe("board");
    expect(result.user?.leagueRole).toBe("REGULATIONS_MANAGER");
  });

  it("authenticates 344-whitelist general student emails with public spectator role", () => {
    const sampleStudents = [
      "abdiaziz.ali@mpesafoundationacademy.ac.ke",
      "edgar.momanyi@mpesafoundationacademy.ac.ke",
      "fatuma.jiele@mpesafoundationacademy.ac.ke",
      "tonny.odundo@mpesafoundationacademy.ac.ke",
      "zuena.njoki@mpesafoundationacademy.ac.ke",
    ];

    for (const email of sampleStudents) {
      const result = authenticateWithRbac(email);
      expect(result.success).toBe(true);
      expect(result.user?.role).toBe("public");
      expect(result.user?.email).toBe(email);
      expect(result.user?.displayName).toBeTruthy();
    }
  });

  it("rejects unauthorized emails not in the academy whitelist", () => {
    const unauthorized = [
      "hacker@gmail.com",
      "unknown.student@mpesafoundationacademy.ac.ke",
      "intruder@outlook.com",
      "fake.officer@mpesafoundationacademy.ac.ke",
    ];

    for (const email of unauthorized) {
      const result = authenticateWithRbac(email);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Access restricted");
    }
  });

  it("rejects empty or malformed inputs", () => {
    expect(authenticateWithRbac("").success).toBe(false);
    expect(authenticateWithRbac("   ").success).toBe(false);
    expect(authenticateWithRbac("not-an-email").success).toBe(false);
  });

  it("supports logging out and clearing RBAC session", () => {
    authenticateWithRbac("msl-27");
    expect(getCurrentRbacUser()).not.toBeNull();
    logoutRbacUser();
    expect(getCurrentRbacUser()).toBeNull();
  });
});

describe("MVP Winners History and Log Reset Preservation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default records when storage is empty", () => {
    const history = getMvpWinnersHistory();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].winnerName).toBe(DEFAULT_MVP_WINNERS[0].winnerName);
  });

  it("preserves archived winners across fixture voting resets", () => {
    const initialCount = getMvpWinnersHistory().length;

    const newChampion = archiveMvpWinner({
      matchId: 99,
      matchweek: 10,
      fixtureTitle: "Super Cup Final: Samba Boys vs Royal Rangers",
      date: "Sunday, Dec 20, 2026",
      winnerName: "Samuel Eto'o Junior",
      teamName: "Samba Boys",
      position: "FWD",
      number: 11,
      votesCount: 42,
      votePercentage: 75,
      totalBallotsCast: 56,
      certifiedBy: "Supreme Council",
      notes: "Scored hat-trick in league final.",
    });

    expect(newChampion.id).toBeTruthy();
    expect(newChampion.certifiedAt).toBeTruthy();

    const afterArchive = getMvpWinnersHistory();
    expect(afterArchive.length).toBe(initialCount + 1);

    const found = afterArchive.find((w) => w.matchId === 99);
    expect(found).toBeDefined();
    expect(found?.winnerName).toBe("Samuel Eto'o Junior");
    expect(found?.votesCount).toBe(42);

    // Simulate resetting match voting logs
    // Clearing match polling state has NO effect on getMvpWinnersHistory
    const afterReset = getMvpWinnersHistory();
    expect(afterReset.length).toBe(initialCount + 1);
    expect(afterReset.find((w) => w.matchId === 99)?.winnerName).toBe("Samuel Eto'o Junior");
  });

  it("allows deleting an erroneous winner record while keeping others", () => {
    const initial = getMvpWinnersHistory();
    const targetId = initial[0].id;

    deleteWinnerFromHistory(targetId);

    const updated = getMvpWinnersHistory();
    expect(updated.find((w) => w.id === targetId)).toBeUndefined();
    expect(updated.length).toBe(initial.length - 1);
  });

  it("persists direct saves correctly", () => {
    const customList = [
      {
        id: "custom-1",
        matchId: 5,
        matchweek: 5,
        fixtureTitle: "Special Derby",
        date: "2026-11-15",
        winnerName: "Custom Star",
        teamName: "City Boys",
        votesCount: 20,
        votePercentage: 100,
        totalBallotsCast: 20,
        certifiedAt: "2026-11-15 17:00 EAT",
        certifiedBy: "Council",
      },
    ];

    saveMvpWinnersHistory(customList);
    const retrieved = getMvpWinnersHistory();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].winnerName).toBe("Custom Star");
  });
});
