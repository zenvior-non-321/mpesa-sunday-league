/**
 * Role-Based Access Control (RBAC) System
 * Resolves user roles ('admin' | 'board' | 'public') based on the official 344-member
 * M-Pesa Foundation Academy whitelist and Board Member Registry.
 */

import {
  isEmailInConfirmedList,
  getEmailDisplayName,
  normalizeAcademyEmail,
} from "./academyAuthorizedEmails";
import { getRegisteredBoardMembers, isBoardRoleLocked } from "./boardMembersRegistry";
import type { LeagueRole } from "../hooks/useRoleAccess";

export type RbacRole = "admin" | "board" | "public";

export interface RbacUser {
  email: string;
  role: RbacRole;
  leagueRole: LeagueRole;
  displayName: string;
  department?: string;
  isSuperAdmin?: boolean;
}

const RBAC_USER_STORAGE_KEY = "mpesa_pes_auth_user_v2";

// Admin designated academy emails
export const KNOWN_ADMIN_EMAILS = [
  "bramuel.osichiro@mpesafoundationacademy.ac.ke",
  "bramuel.amirah@mpesa.ac.ke",
  "admin@mpesafoundationacademy.ac.ke",
  "supreme.council@mpesafoundationacademy.ac.ke",
];

/**
 * Checks an input email or passcode against the whitelist and determines
 * whether they receive 'admin', 'board', or 'public' access.
 */
export function authenticateWithRbac(input: string): {
  success: boolean;
  user?: RbacUser;
  error?: string;
} {
  if (!input) {
    return { success: false, error: "Please enter your school email or authorized access code." };
  }

  const cleaned = input.trim();

  // 1. Direct Master Passcode Check (msl-27)
  if (cleaned.toLowerCase() === "msl-27") {
    const adminUser: RbacUser = {
      email: "bramuel.osichiro@mpesafoundationacademy.ac.ke",
      role: "admin",
      leagueRole: "SUPER_ADMIN",
      displayName: "Master League Administrator",
      department: "Supreme League Council",
      isSuperAdmin: true,
    };
    persistRbacUser(adminUser);
    return { success: true, user: adminUser };
  }

  // 2. Check if input is a board member access code (e.g. PRES-8491, DEP-3914, etc.)
  const boardMembers = getRegisteredBoardMembers();
  const matchedByCode = boardMembers.find(
    (m) => m.accessCode.trim().toUpperCase() === cleaned.toUpperCase(),
  );
  if (matchedByCode) {
    if (!matchedByCode.active || isBoardRoleLocked(matchedByCode.role)) {
      return {
        success: false,
        error: `ACCESS DENIED: Access for ${matchedByCode.name} (${matchedByCode.role.replace(/_/g, " ")}) has been locked and suspended by the Super Administrator.`,
      };
    }
    const boardUser: RbacUser = {
      email: matchedByCode.schoolEmail,
      role: matchedByCode.role === "PRESIDENT" ? "admin" : "board",
      leagueRole: matchedByCode.role,
      displayName: matchedByCode.name,
      department: matchedByCode.department,
      isSuperAdmin: matchedByCode.role === "PRESIDENT",
    };
    persistRbacUser(boardUser);
    return { success: true, user: boardUser };
  }

  // 3. Email-based authentication
  const normalizedEmail = normalizeAcademyEmail(cleaned);
  if (!normalizedEmail.includes("@")) {
    return {
      success: false,
      error: "Please enter a valid school email address or confidential access code.",
    };
  }

  // A. Check Super Admin Email Whitelist
  const isAdminEmail = KNOWN_ADMIN_EMAILS.some(
    (adm) => normalizeAcademyEmail(adm) === normalizedEmail,
  );
  if (isAdminEmail) {
    const adminUser: RbacUser = {
      email: normalizedEmail,
      role: "admin",
      leagueRole: "SUPER_ADMIN",
      displayName: getEmailDisplayName(normalizedEmail),
      department: "Supreme League Council",
      isSuperAdmin: true,
    };
    persistRbacUser(adminUser);
    return { success: true, user: adminUser };
  }

  // B. Check Council Board Member Registry (by email)
  const matchedBoard = boardMembers.find((m) => {
    if (!m.active) return false;
    const memberEmail = normalizeAcademyEmail(m.schoolEmail);
    if (memberEmail === normalizedEmail) return true;
    // Also match username before @
    const inputUser = normalizedEmail.split("@")[0];
    const memberUser = memberEmail.split("@")[0];
    return inputUser === memberUser;
  });

  if (matchedBoard) {
    const boardUser: RbacUser = {
      email: normalizedEmail,
      role: matchedBoard.role === "PRESIDENT" ? "admin" : "board",
      leagueRole: matchedBoard.role,
      displayName: matchedBoard.name,
      department: matchedBoard.department,
      isSuperAdmin: matchedBoard.role === "PRESIDENT",
    };
    persistRbacUser(boardUser);
    return { success: true, user: boardUser };
  }

  // C. Check Official 344-Member Academy Whitelist (Public Spectator / Student Role)
  if (isEmailInConfirmedList(normalizedEmail)) {
    const publicUser: RbacUser = {
      email: normalizedEmail,
      role: "public",
      leagueRole: "GUEST",
      displayName: getEmailDisplayName(normalizedEmail),
      department: "Student & Spectator Gallery",
      isSuperAdmin: false,
    };
    persistRbacUser(publicUser);
    return { success: true, user: publicUser };
  }

  // D. Not in whitelist
  return {
    success: false,
    error:
      "Access restricted. This email is not on the authorized 344-member M-Pesa Foundation Academy roster.",
  };
}

/**
 * Persist the current RBAC user to storage and dispatch event
 */
export function persistRbacUser(user: RbacUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(RBAC_USER_STORAGE_KEY, JSON.stringify(user));
      // Sync legacy role keys for full backward compatibility
      if (user.role === "admin" || user.isSuperAdmin) {
        localStorage.setItem("mpesa_pes_super_admin", "true");
        localStorage.setItem("mpesa_pes_auth_role", "SUPER_ADMIN");
      } else if (user.role === "board") {
        localStorage.removeItem("mpesa_pes_super_admin");
        localStorage.setItem("mpesa_pes_auth_role", user.leagueRole);
      } else {
        // public role
        localStorage.removeItem("mpesa_pes_super_admin");
        localStorage.setItem("mpesa_pes_auth_role", "GUEST");
      }
    } else {
      localStorage.removeItem(RBAC_USER_STORAGE_KEY);
      localStorage.removeItem("mpesa_pes_super_admin");
      localStorage.removeItem("mpesa_pes_auth_role");
    }
    window.dispatchEvent(new Event("mpesa_rbac_changed"));
    window.dispatchEvent(new Event("mpesa_role_changed"));
  } catch {
    // Ignore storage quota
  }
}

/**
 * Retrieve the current logged-in RBAC user
 */
export function getCurrentRbacUser(): RbacUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RBAC_USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.role === "string") {
        return parsed as RbacUser;
      }
    }

    // Fallback: check legacy keys
    const isSuper = localStorage.getItem("mpesa_pes_super_admin") === "true";
    if (isSuper) {
      return {
        email: "bramuel.osichiro@mpesafoundationacademy.ac.ke",
        role: "admin",
        leagueRole: "SUPER_ADMIN",
        displayName: "Master League Administrator",
        isSuperAdmin: true,
      };
    }

    const legacyRole = localStorage.getItem("mpesa_pes_auth_role");
    if (legacyRole && legacyRole !== "GUEST") {
      return {
        email: "board.council@mpesafoundationacademy.ac.ke",
        role: "board",
        leagueRole: legacyRole as LeagueRole,
        displayName: "Council Board Member",
        isSuperAdmin: false,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function logoutRbacUser(): void {
  persistRbacUser(null);
}
