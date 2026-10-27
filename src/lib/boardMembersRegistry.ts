import type { LeagueRole } from "../hooks/useRoleAccess";

export interface RegisteredBoardMember {
  id: string;
  name: string;
  role: LeagueRole;
  department: string;
  schoolEmail: string;
  accessCode: string; // Confidential code assigned by Super Admin
  assignedBy: string;
  createdAt: string;
  active: boolean;
}

const STORAGE_KEY = "mpesa_pes_registered_board_members_v4";

export const ROLE_DEPARTMENT_MAP: Record<Exclude<LeagueRole, "SUPER_ADMIN" | "GUEST">, string> = {
  PRESIDENT: "Executive Governance (Tier 1)",
  DEPUTY_PRESIDENT: "Executive Governance (Tier 2)",
  REGULATIONS_MANAGER: "Register & Regulations (Tier 3)",
  MATCH_OFFICIATING_MANAGER: "Match Officiating Programmes (Tier 4)",
  RECORDS_MANAGER: "Records & Files (Tier 5)",
  TECH_MANAGER: "Technological Management (Tier 6)",
  ASST_TECH_MANAGER: "Assistant Technological Management (Tier 7)",
};

export const INITIAL_DEFAULT_BOARD_MEMBERS: RegisteredBoardMember[] = [
  {
    id: "bm-1",
    name: "Alex Haro",
    role: "PRESIDENT",
    department: "Executive Governance (Tier 1)",
    schoolEmail: "alex.haro@mpesafoundationacademy.ac.ke",
    accessCode: "PRES-8491",
    assignedBy: "Super Admin",
    createdAt: "2026-10-27",
    active: true,
  },
  {
    id: "bm-2",
    name: "Babra Nandako",
    role: "DEPUTY_PRESIDENT",
    department: "Executive Governance (Tier 2)",
    schoolEmail: "babra.nandako@mpesafoundationacademy.ac.ke",
    accessCode: "DEP-3914",
    assignedBy: "Super Admin",
    createdAt: "2026-10-27",
    active: true,
  },
  {
    id: "bm-3",
    name: "Whitney Juma",
    role: "REGULATIONS_MANAGER",
    department: "Register & Regulations (Tier 3)",
    schoolEmail: "whitney.achieng@mpesafoundationacademy.ac.ke",
    accessCode: "REG-6274",
    assignedBy: "Super Admin",
    createdAt: "2026-10-27",
    active: true,
  },
  {
    id: "bm-4",
    name: "Idi Sebantu",
    role: "MATCH_OFFICIATING_MANAGER",
    department: "Match Officiating Programmes (Tier 4)",
    schoolEmail: "idi.sebantu@mpesafoundationacademy.ac.ke",
    accessCode: "OFF-5182",
    assignedBy: "Super Admin",
    createdAt: "2026-10-27",
    active: true,
  },
  {
    id: "bm-5",
    name: "Tonnie Mark Odundo",
    role: "RECORDS_MANAGER",
    department: "Records & Files (Tier 5)",
    schoolEmail: "tonny.odundo@mpesafoundationacademy.ac.ke",
    accessCode: "REC-9301",
    assignedBy: "Super Admin",
    createdAt: "2026-10-27",
    active: true,
  },
  {
    id: "bm-6",
    name: "Victor Kiplagat",
    role: "TECH_MANAGER",
    department: "Technological Management (Tier 6)",
    schoolEmail: "victor.kiplagat@mpesafoundationacademy.ac.ke",
    accessCode: "TECH-7419",
    assignedBy: "Super Admin",
    createdAt: "2026-10-27",
    active: true,
  },
  {
    id: "bm-7",
    name: "Sturridge Ochongoi",
    role: "ASST_TECH_MANAGER",
    department: "Assistant Technological Management (Tier 7)",
    schoolEmail: "sturridge.omaido@mpesafoundationacademy.ac.ke",
    accessCode: "AST-2840",
    assignedBy: "Super Admin",
    createdAt: "2026-10-27",
    active: true,
  },
];

export function getRegisteredBoardMembers(): RegisteredBoardMember[] {
  if (typeof window === "undefined") {
    return INITIAL_DEFAULT_BOARD_MEMBERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_BOARD_MEMBERS));
      return INITIAL_DEFAULT_BOARD_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_BOARD_MEMBERS));
    return INITIAL_DEFAULT_BOARD_MEMBERS;
  } catch {
    return INITIAL_DEFAULT_BOARD_MEMBERS;
  }
}

export function saveRegisteredBoardMembers(members: RegisteredBoardMember[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {
    // Ignore storage quota
  }
}

export function registerBoardMember(
  data: Omit<RegisteredBoardMember, "id" | "createdAt">,
): RegisteredBoardMember {
  const current = getRegisteredBoardMembers();
  const newMember: RegisteredBoardMember = {
    ...data,
    id: `bm-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0] || "2026-10-22",
  };
  const updated = [newMember, ...current];
  saveRegisteredBoardMembers(updated);
  return newMember;
}

export function updateBoardMember(
  id: string,
  updates: Partial<RegisteredBoardMember>,
): RegisteredBoardMember[] {
  const current = getRegisteredBoardMembers();
  const updated = current.map((m) => (m.id === id ? { ...m, ...updates } : m));
  saveRegisteredBoardMembers(updated);
  return updated;
}

export function deleteBoardMember(id: string): RegisteredBoardMember[] {
  const current = getRegisteredBoardMembers();
  const updated = current.filter((m) => m.id !== id);
  saveRegisteredBoardMembers(updated);
  return updated;
}

export function authenticateBoardMember(code: string): RegisteredBoardMember | null {
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) return null;
  const current = getRegisteredBoardMembers();
  const matched = current.find((m) => m.active && m.accessCode.trim().toUpperCase() === cleaned);
  return matched || null;
}
