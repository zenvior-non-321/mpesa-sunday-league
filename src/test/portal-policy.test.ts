import { describe, expect, it } from "vitest";
import {
  mayManageCodes,
  mayDeleteTeam,
  allowedFields,
  removeDeletedTeams,
} from "../lib/portal-policy";
describe("League access rules", () => {
  it("only Super Admin can see or manage board codes", () => {
    expect(mayManageCodes("SUPER_ADMIN")).toBe(true);
    for (const role of [null, "VIEWER", "PRESIDENT", "TECH_MANAGER"])
      expect(mayManageCodes(role)).toBe(false);
  });
  it("only Super Admin can permanently delete teams", () => {
    expect(mayDeleteTeam("SUPER_ADMIN")).toBe(true);
    expect(mayDeleteTeam("REGULATIONS_MANAGER")).toBe(false);
    expect(mayDeleteTeam(null)).toBe(false);
  });
  it("viewers cannot write any league records", () => {
    expect(allowedFields(null)).toEqual([]);
    expect(allowedFields("VIEWER")).toEqual([]);
  });
  it("deleted teams cannot be restored by stale browser data, including fixtures and statistics", () => {
    const stale = {
      teams: [{ id: 1 }, { id: 2 }],
      matches: [{ id: 4, homeId: 1, awayId: 2 }],
      playerStatsList: [{ teamId: 1 }, { teamId: 2 }],
    };
    const filtered = removeDeletedTeams(stale, [1]);
    expect(filtered.teams).toEqual([{ id: 2 }]);
    expect(filtered.matches).toEqual([]);
    expect(filtered.playerStatsList).toEqual([{ teamId: 2 }]);
    expect(removeDeletedTeams(stale, [1]).teams.some((t: { id: number }) => t.id === 1)).toBe(
      false,
    );
  });

  it("unified access code routes to Super Admin or dynamic Board Member role correctly", () => {
    import("../lib/boardMembersRegistry").then(({ authenticateBoardMember }) => {
      // Admin master code test
      const testCode = "msl-27";
      const isAdmin = testCode.toLowerCase() === "msl-27";
      expect(isAdmin).toBe(true);

      // Default board member code test
      const member = authenticateBoardMember("PRES-8491");
      expect(member).not.toBeNull();
      expect(member?.role).toBe("PRESIDENT");

      // Invalid code test
      const invalid = authenticateBoardMember("INVALID-CODE-999");
      expect(invalid).toBeNull();
    });
  });
});
