import { i as normalizeAcademyEmail, n as getEmailDisplayName, r as isEmailInConfirmedList } from "./academyAuthorizedEmails-BDXqxAI_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rbacSystem-BzvRxIUR.js
var STORAGE_KEY = "mpesa_pes_registered_board_members_v4";
var ROLE_DEPARTMENT_MAP = {
	PRESIDENT: "Executive Governance (Tier 1)",
	DEPUTY_PRESIDENT: "Executive Governance (Tier 2)",
	REGULATIONS_MANAGER: "Register & Regulations (Tier 3)",
	MATCH_OFFICIATING_MANAGER: "Match Officiating Programmes (Tier 4)",
	RECORDS_MANAGER: "Records & Files (Tier 5)",
	TECH_MANAGER: "Technological Management (Tier 6)",
	ASST_TECH_MANAGER: "Assistant Technological Management (Tier 7)"
};
var INITIAL_DEFAULT_BOARD_MEMBERS = [
	{
		id: "bm-1",
		name: "Alex Haro",
		role: "PRESIDENT",
		department: "Executive Governance (Tier 1)",
		schoolEmail: "alex.haro@mpesafoundationacademy.ac.ke",
		accessCode: "PRES-8491",
		assignedBy: "Super Admin",
		createdAt: "2026-10-27",
		active: true
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
		active: true
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
		active: true
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
		active: true
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
		active: true
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
		active: true
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
		active: true
	}
];
function getRegisteredBoardMembers() {
	if (typeof window === "undefined") return INITIAL_DEFAULT_BOARD_MEMBERS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_BOARD_MEMBERS));
			return INITIAL_DEFAULT_BOARD_MEMBERS;
		}
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_BOARD_MEMBERS));
		return INITIAL_DEFAULT_BOARD_MEMBERS;
	} catch {
		return INITIAL_DEFAULT_BOARD_MEMBERS;
	}
}
function saveRegisteredBoardMembers(members) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
	} catch {}
}
function registerBoardMember(data) {
	const current = getRegisteredBoardMembers();
	const newMember = {
		...data,
		id: `bm-${Date.now()}`,
		createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] || "2026-10-22"
	};
	saveRegisteredBoardMembers([newMember, ...current]);
	return newMember;
}
function updateBoardMember(id, updates) {
	const updated = getRegisteredBoardMembers().map((m) => m.id === id ? {
		...m,
		...updates
	} : m);
	saveRegisteredBoardMembers(updated);
	return updated;
}
function deleteBoardMember(id) {
	const updated = getRegisteredBoardMembers().filter((m) => m.id !== id);
	saveRegisteredBoardMembers(updated);
	return updated;
}
var BOARD_LOCKS_STORAGE_KEY = "mpesa_board_access_locks_v2";
function getBoardAccessLocks() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(BOARD_LOCKS_STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function isBoardRoleLocked(role) {
	if (!role) return false;
	return !!getBoardAccessLocks()[role];
}
function setBoardRoleLock(role, locked) {
	const locks = getBoardAccessLocks();
	locks[role] = locked;
	if (typeof window !== "undefined") try {
		localStorage.setItem(BOARD_LOCKS_STORAGE_KEY, JSON.stringify(locks));
		window.dispatchEvent(new CustomEvent("mpesa_board_locks_changed", { detail: locks }));
	} catch {}
	return locks;
}
function authenticateBoardMember(code) {
	const cleaned = code.trim().toUpperCase();
	if (!cleaned) return null;
	const matched = getRegisteredBoardMembers().find((m) => m.accessCode.trim().toUpperCase() === cleaned);
	if (!matched) return null;
	if (!matched.active || isBoardRoleLocked(matched.role)) return null;
	return matched;
}
/**
* Role-Based Access Control (RBAC) System
* Resolves user roles ('admin' | 'board' | 'public') based on the official 344-member
* M-Pesa Foundation Academy whitelist and Board Member Registry.
*/
var RBAC_USER_STORAGE_KEY = "mpesa_pes_auth_user_v2";
var KNOWN_ADMIN_EMAILS = [
	"bramuel.osichiro@mpesafoundationacademy.ac.ke",
	"bramuel.amirah@mpesa.ac.ke",
	"admin@mpesafoundationacademy.ac.ke",
	"supreme.council@mpesafoundationacademy.ac.ke"
];
/**
* Checks an input email or passcode against the whitelist and determines
* whether they receive 'admin', 'board', or 'public' access.
*/
function authenticateWithRbac(input) {
	if (!input) return {
		success: false,
		error: "Please enter your school email or authorized access code."
	};
	const cleaned = input.trim();
	if (cleaned.toLowerCase() === "msl-27") {
		const adminUser = {
			email: "bramuel.osichiro@mpesafoundationacademy.ac.ke",
			role: "admin",
			leagueRole: "SUPER_ADMIN",
			displayName: "Master League Administrator",
			department: "Supreme League Council",
			isSuperAdmin: true
		};
		persistRbacUser(adminUser);
		return {
			success: true,
			user: adminUser
		};
	}
	const boardMembers = getRegisteredBoardMembers();
	const matchedByCode = boardMembers.find((m) => m.accessCode.trim().toUpperCase() === cleaned.toUpperCase());
	if (matchedByCode) {
		if (!matchedByCode.active || isBoardRoleLocked(matchedByCode.role)) return {
			success: false,
			error: `ACCESS DENIED: Access for ${matchedByCode.name} (${matchedByCode.role.replace(/_/g, " ")}) has been locked and suspended by the Super Administrator.`
		};
		const boardUser = {
			email: matchedByCode.schoolEmail,
			role: matchedByCode.role === "PRESIDENT" ? "admin" : "board",
			leagueRole: matchedByCode.role,
			displayName: matchedByCode.name,
			department: matchedByCode.department,
			isSuperAdmin: matchedByCode.role === "PRESIDENT"
		};
		persistRbacUser(boardUser);
		return {
			success: true,
			user: boardUser
		};
	}
	const normalizedEmail = normalizeAcademyEmail(cleaned);
	if (!normalizedEmail.includes("@")) return {
		success: false,
		error: "Please enter a valid school email address or confidential access code."
	};
	if (KNOWN_ADMIN_EMAILS.some((adm) => normalizeAcademyEmail(adm) === normalizedEmail)) {
		const adminUser = {
			email: normalizedEmail,
			role: "admin",
			leagueRole: "SUPER_ADMIN",
			displayName: getEmailDisplayName(normalizedEmail),
			department: "Supreme League Council",
			isSuperAdmin: true
		};
		persistRbacUser(adminUser);
		return {
			success: true,
			user: adminUser
		};
	}
	const matchedBoard = boardMembers.find((m) => {
		if (!m.active) return false;
		const memberEmail = normalizeAcademyEmail(m.schoolEmail);
		if (memberEmail === normalizedEmail) return true;
		return normalizedEmail.split("@")[0] === memberEmail.split("@")[0];
	});
	if (matchedBoard) {
		const boardUser = {
			email: normalizedEmail,
			role: matchedBoard.role === "PRESIDENT" ? "admin" : "board",
			leagueRole: matchedBoard.role,
			displayName: matchedBoard.name,
			department: matchedBoard.department,
			isSuperAdmin: matchedBoard.role === "PRESIDENT"
		};
		persistRbacUser(boardUser);
		return {
			success: true,
			user: boardUser
		};
	}
	if (isEmailInConfirmedList(normalizedEmail)) {
		const publicUser = {
			email: normalizedEmail,
			role: "public",
			leagueRole: "GUEST",
			displayName: getEmailDisplayName(normalizedEmail),
			department: "Student & Spectator Gallery",
			isSuperAdmin: false
		};
		persistRbacUser(publicUser);
		return {
			success: true,
			user: publicUser
		};
	}
	return {
		success: false,
		error: "Access restricted. This email is not on the authorized 344-member M-Pesa Foundation Academy roster."
	};
}
/**
* Persist the current RBAC user to storage and dispatch event
*/
function persistRbacUser(user) {
	if (typeof window === "undefined") return;
	try {
		if (user) {
			localStorage.setItem(RBAC_USER_STORAGE_KEY, JSON.stringify(user));
			if (user.role === "admin" || user.isSuperAdmin) {
				localStorage.setItem("mpesa_pes_super_admin", "true");
				localStorage.setItem("mpesa_pes_auth_role", "SUPER_ADMIN");
			} else if (user.role === "board") {
				localStorage.removeItem("mpesa_pes_super_admin");
				localStorage.setItem("mpesa_pes_auth_role", user.leagueRole);
			} else {
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
	} catch {}
}
/**
* Retrieve the current logged-in RBAC user
*/
function getCurrentRbacUser() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(RBAC_USER_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed.role === "string") return parsed;
		}
		if (localStorage.getItem("mpesa_pes_super_admin") === "true") return {
			email: "bramuel.osichiro@mpesafoundationacademy.ac.ke",
			role: "admin",
			leagueRole: "SUPER_ADMIN",
			displayName: "Master League Administrator",
			isSuperAdmin: true
		};
		const legacyRole = localStorage.getItem("mpesa_pes_auth_role");
		if (legacyRole && legacyRole !== "GUEST") return {
			email: "board.council@mpesafoundationacademy.ac.ke",
			role: "board",
			leagueRole: legacyRole,
			displayName: "Council Board Member",
			isSuperAdmin: false
		};
		return null;
	} catch {
		return null;
	}
}
function logoutRbacUser() {
	persistRbacUser(null);
}
//#endregion
export { deleteBoardMember as a, getRegisteredBoardMembers as c, registerBoardMember as d, setBoardRoleLock as f, authenticateWithRbac as i, isBoardRoleLocked as l, ROLE_DEPARTMENT_MAP as n, getBoardAccessLocks as o, updateBoardMember as p, authenticateBoardMember as r, getCurrentRbacUser as s, INITIAL_DEFAULT_BOARD_MEMBERS as t, logoutRbacUser as u };
