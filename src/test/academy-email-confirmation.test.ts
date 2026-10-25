import { describe, expect, it } from "vitest";
import {
  CONFIRMED_ACADEMY_EMAILS,
  isEmailInConfirmedList,
  getEmailDisplayName,
  normalizeAcademyEmail,
} from "../lib/academyAuthorizedEmails";
import { isRegisteredSchoolEmail } from "../lib/voterVerification";

describe("M-Pesa Foundation Academy Email Confirmation", () => {
  it("contains all 344 confirmed student and staff emails", () => {
    expect(CONFIRMED_ACADEMY_EMAILS.length).toBe(344);
  });

  it("confirms valid emails from the official authorized list", () => {
    const testCases = [
      "abdiaziz.ali@mpesafoundationacademy.ac.ke",
      "abdirashid.hacho@mpesafoundationacademy.ac.ke",
      "cheryl.cosmas@mpesafoundationacademy.ac.ke",
      "joseph.kamande@mpesafoundationacademy.ac.ke",
      "mitchele.muthoni@mpesafoundationacademy.ac.ke",
      "tonny.odundo@mpesafoundationacademy.ac.ke",
      "trady.lewis@mpesafoundationacademy.ac.ke",
      "sturridge.omaido@mpesafoundationacademy.ac.ke",
      "zuena.njoki@mpesafoundationacademy.ac.ke",
    ];

    for (const email of testCases) {
      expect(isEmailInConfirmedList(email)).toBe(true);
      expect(isRegisteredSchoolEmail(email)).toBe(true);
    }
  });

  it("handles case-insensitivity and leading/trailing whitespace", () => {
    expect(isEmailInConfirmedList("  ABDIAZIZ.ALI@mpesafoundationacademy.ac.ke ")).toBe(true);
    expect(isEmailInConfirmedList("Sturridge.Omaido@mpesafoundationacademy.ac.ke")).toBe(true);
    expect(isRegisteredSchoolEmail("  CHERYL.COSMAS@mpesafoundationacademy.ac.ke  ")).toBe(true);
  });

  it("rejects unauthorized and random emails not in the confirmed list", () => {
    const invalidCases = [
      "unauthorized.person@mpesafoundationacademy.ac.ke",
      "fake.student@mpesafoundationacademy.ac.ke",
      "random.user@gmail.com",
      "hacker@yahoo.com",
      "",
      "   ",
      "not-an-email",
    ];

    for (const email of invalidCases) {
      expect(isEmailInConfirmedList(email)).toBe(false);
      expect(isRegisteredSchoolEmail(email)).toBe(false);
    }
  });

  it("properly extracts friendly display names from confirmed emails", () => {
    expect(getEmailDisplayName("abdiaziz.ali@mpesafoundationacademy.ac.ke")).toBe("Abdiaziz Ali");
    expect(getEmailDisplayName("cheryl.cosmas@mpesafoundationacademy.ac.ke")).toBe("Cheryl Cosmas");
    expect(getEmailDisplayName("sturridge.omaido@mpesafoundationacademy.ac.ke")).toBe(
      "Sturridge Omaido",
    );
  });

  it("normalizes emails cleanly", () => {
    expect(normalizeAcademyEmail("  Test.User@Academy.AC.KE  ")).toBe("test.user@academy.ac.ke");
  });
});
