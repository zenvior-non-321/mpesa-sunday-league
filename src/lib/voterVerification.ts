import {
  CONFIRMED_ACADEMY_EMAILS,
  isEmailInConfirmedList,
  getEmailDisplayName,
  normalizeAcademyEmail,
} from "./academyAuthorizedEmails";

export { CONFIRMED_ACADEMY_EMAILS, isEmailInConfirmedList, getEmailDisplayName };

const REGISTERED_EMAILS_STORAGE_KEY = "mpesa_pes_registered_school_emails_v3";
const PENDING_VERIFICATION_KEY = "mpesa_pes_pending_verifications_v1";

// Default registered emails populated with official academy confirmed list
export const DEFAULT_REGISTERED_EMAILS: string[] = Array.from(CONFIRMED_ACADEMY_EMAILS);

export function getRegisteredSchoolEmails(): string[] {
  if (typeof window === "undefined") return DEFAULT_REGISTERED_EMAILS;
  try {
    const raw = localStorage.getItem(REGISTERED_EMAILS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        REGISTERED_EMAILS_STORAGE_KEY,
        JSON.stringify(DEFAULT_REGISTERED_EMAILS),
      );
      return DEFAULT_REGISTERED_EMAILS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_REGISTERED_EMAILS;
  } catch {
    return DEFAULT_REGISTERED_EMAILS;
  }
}

export function addRegisteredSchoolEmail(email: string): string[] {
  const current = getRegisteredSchoolEmails();
  const normalized = normalizeAcademyEmail(email);
  if (!normalized || current.includes(normalized)) return current;
  const updated = [normalized, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(REGISTERED_EMAILS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }
  return updated;
}

/**
 * Strict verification: returns true IF AND ONLY IF the email exists in the official
 * confirmed academy roster or has been specifically registered by the Council.
 */
export function isRegisteredSchoolEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const normalized = normalizeAcademyEmail(email);
  if (!normalized || !normalized.includes("@")) return false;

  // 1. Check official confirmed academy roster (344 verified students & staff)
  if (isEmailInConfirmedList(normalized)) {
    return true;
  }

  // 2. Check if explicitly in registered school email database
  const registered = getRegisteredSchoolEmails();
  return registered.includes(normalized);
}

interface PendingVerification {
  code: string;
  email: string;
  expiresAt: number;
}

export function generateVerificationCode(email: string): { code: string; expiresAt: number } {
  const normalized = email.trim().toLowerCase();
  // 4-digit numeric code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PENDING_VERIFICATION_KEY);
      const parsed: Record<string, PendingVerification> = stored ? JSON.parse(stored) : {};
      parsed[normalized] = { code, email: normalized, expiresAt };
      localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(parsed));
    } catch {
      // Ignore
    }
  }

  return { code, expiresAt };
}

export function verifySchoolEmailCode(
  email: string,
  inputCode: string,
): { valid: boolean; message: string } {
  const normalized = email.trim().toLowerCase();
  const cleanCode = inputCode.trim();

  if (!cleanCode) {
    return { valid: false, message: "Please enter the 4-digit verification code." };
  }

  if (typeof window === "undefined") {
    return { valid: true, message: "Verified" };
  }

  try {
    const stored = localStorage.getItem(PENDING_VERIFICATION_KEY);
    if (!stored) {
      return { valid: false, message: "No verification code requested for this email." };
    }
    const parsed: Record<string, PendingVerification> = JSON.parse(stored);
    const entry = parsed[normalized];

    if (!entry) {
      return {
        valid: false,
        message: "No active verification code found for this email. Please request a new code.",
      };
    }

    if (Date.now() > entry.expiresAt) {
      return { valid: false, message: "Verification code has expired. Please request a new one." };
    }

    if (entry.code !== cleanCode) {
      return { valid: false, message: "Incorrect verification code. Please check and try again." };
    }

    // Code matches! Clear the pending entry
    delete parsed[normalized];
    localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(parsed));

    return { valid: true, message: "School email verified successfully!" };
  } catch {
    return { valid: false, message: "Verification check failed. Please try again." };
  }
}
