import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { At as ChevronUp, D as Search, E as Send, J as Mail, N as RefreshCw, Nt as ChevronDown, Ot as CircleCheck, S as ShieldCheck, Vt as Award, X as Lock, Z as LockOpen, _t as Download, a as Users, f as Trash2, h as Sparkles, j as RotateCcw, kt as CircleAlert, l as Trophy, n as Vote, nt as KeyRound, w as Share2, xt as Crown } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as normalizeAcademyEmail, n as getEmailDisplayName, r as isEmailInConfirmedList, t as CONFIRMED_ACADEMY_EMAILS } from "./academyAuthorizedEmails-BDXqxAI_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MatchMvpVoting-BXP9mm0N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var DEFAULT_TEAMS = [
	{
		id: 6,
		name: "Royal Rangers",
		shortCode: "RR",
		color: "#3b82f6",
		homePitch: "Ranger Fortress Field (Academy East)"
	},
	{
		id: 7,
		name: "Young Stars City",
		shortCode: "YSC",
		color: "#f97316",
		homePitch: "Young Stars City Arena (North Pavilion)"
	},
	{
		id: 1,
		name: "Samba",
		shortCode: "SAM",
		color: "#00ff85",
		homePitch: "Samba Arena (School Lower Pitch)"
	},
	{
		id: 8,
		name: "Mzinga",
		shortCode: "MZB",
		color: "#eab308",
		homePitch: "The Hive Stadium (West Campus Ground)"
	}
];
var DELETED_LEGACY_TEAM_IDS = [
	2,
	3,
	4,
	5
];
var DELETED_LEGACY_TEAM_NAMES = [
	"grade 10 a",
	"grade 10 b",
	"dp 2 a",
	"dp 2 b",
	"grade 10a",
	"grade 10b",
	"dp2a",
	"dp2b"
];
function isTeamDeleted(id, name) {
	if (id && DELETED_LEGACY_TEAM_IDS.includes(id)) return true;
	if (name && DELETED_LEGACY_TEAM_NAMES.includes(name.trim().toLowerCase())) return true;
	if (typeof window !== "undefined") try {
		const stored = JSON.parse(localStorage.getItem("mpesa_pes_deleted_teams_v6") || "[]");
		if (Array.isArray(stored)) {
			if (id && stored.includes(id)) return true;
			if (name && stored.some((s) => typeof s === "string" && s.toLowerCase() === name.toLowerCase())) return true;
		}
	} catch {}
	return false;
}
var DEFAULT_FIXTURES = [
	{
		id: 1,
		matchweek: 1,
		time: "2:00 PM",
		date: "Sunday, Nov 1, 2026",
		venue: "Samba Arena (School Lower Pitch)",
		homeId: 1,
		awayId: 7,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Bidan Mwaura (Official Match Referee)",
		goalEvents: []
	},
	{
		id: 2,
		matchweek: 1,
		time: "4:00 PM",
		date: "Sunday, Nov 1, 2026",
		venue: "Ranger Fortress Field (Academy East)",
		homeId: 6,
		awayId: 8,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Idi Sebantu",
		goalEvents: []
	},
	{
		id: 3,
		matchweek: 2,
		time: "2:00 PM",
		date: "Sunday, Nov 8, 2026",
		venue: "The Hive Stadium (West Campus Ground)",
		homeId: 8,
		awayId: 1,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Bidan Mwaura (Official Match Referee)",
		goalEvents: []
	},
	{
		id: 4,
		matchweek: 2,
		time: "4:00 PM",
		date: "Sunday, Nov 8, 2026",
		venue: "Young Stars City Arena (North Pavilion)",
		homeId: 7,
		awayId: 6,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Idi Sebantu",
		goalEvents: []
	},
	{
		id: 5,
		matchweek: 3,
		time: "2:00 PM",
		date: "Sunday, Nov 8, 2026",
		venue: "Ranger Fortress Field (Academy East)",
		homeId: 6,
		awayId: 1,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Ian Muli (FIFA Badge)",
		goalEvents: []
	},
	{
		id: 6,
		matchweek: 3,
		time: "4:00 PM",
		date: "Sunday, Nov 8, 2026",
		venue: "Young Stars City Arena (North Pavilion)",
		homeId: 7,
		awayId: 8,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Mercy Chebet",
		goalEvents: []
	},
	{
		id: 7,
		matchweek: 4,
		time: "2:00 PM",
		date: "Sunday, Nov 15, 2026",
		venue: "Young Stars City Arena (North Pavilion)",
		homeId: 7,
		awayId: 1,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: David Otieno",
		goalEvents: []
	},
	{
		id: 8,
		matchweek: 4,
		time: "4:00 PM",
		date: "Sunday, Nov 15, 2026",
		venue: "The Hive Stadium (West Campus Ground)",
		homeId: 8,
		awayId: 6,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Ian Muli",
		goalEvents: []
	},
	{
		id: 9,
		matchweek: 5,
		time: "2:00 PM",
		date: "Sunday, Nov 22, 2026",
		venue: "Samba Arena (School Lower Pitch)",
		homeId: 1,
		awayId: 8,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Ian Muli",
		goalEvents: []
	},
	{
		id: 10,
		matchweek: 5,
		time: "4:00 PM",
		date: "Sunday, Nov 22, 2026",
		venue: "Ranger Fortress Field (Academy East)",
		homeId: 6,
		awayId: 7,
		homeScore: 0,
		awayScore: 0,
		status: "UPCOMING",
		scorers: "",
		referee: "Center Ref: Mercy Chebet",
		goalEvents: []
	}
];
var OFFICIAL_CLUBS_DATA = [
	{
		id: 1,
		name: "Samba",
		shortCode: "SAM",
		color: "#00ff85",
		homePitch: "Samba Arena (School Lower Pitch)",
		coachName: "Austin Brian Omondi",
		assistantCoach: "Carson Technical Bench",
		medicalStaff: "MFA Sports Medicine Staff",
		squad: [
			{
				name: "Brian",
				number: 1,
				position: "GK",
				role: "Goalkeeper",
				foot: "Right"
			},
			{
				name: "Gregory",
				number: 13,
				position: "GK",
				role: "Goalkeeper",
				foot: "Right"
			},
			{
				name: "Jattan",
				number: 2,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Atibu",
				number: 3,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Haron",
				number: 4,
				position: "DEF",
				role: "Team Captain & Defender",
				foot: "Right",
				isCaptain: true
			},
			{
				name: "Edgar",
				number: 5,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Mutwiri",
				number: 6,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Kichuma",
				number: 12,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Abdiaziz",
				number: 15,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Eugene",
				number: 7,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Shawn",
				number: 8,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Jaycrack",
				number: 10,
				position: "MID",
				role: "Team Captain & Playmaker",
				foot: "Right",
				isViceCaptain: true
			},
			{
				name: "Phisael",
				number: 14,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Opiyo",
				number: 16,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Abdirashid",
				number: 17,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Stafford",
				number: 18,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Vincent",
				number: 20,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Wokabi",
				number: 9,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			},
			{
				name: "Edwin",
				number: 11,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			},
			{
				name: "Carson",
				number: 19,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			}
		]
	},
	{
		id: 6,
		name: "Royal Rangers",
		shortCode: "RR",
		color: "#3b82f6",
		homePitch: "Ranger Fortress Field (Academy East)",
		coachName: "Levis Wanyama",
		assistantCoach: "George Victor Kibet",
		medicalStaff: "MFA Physical Therapy Unit",
		squad: [
			{
				name: "Idi Sebantu",
				number: 1,
				position: "GK",
				role: "Goalkeeper",
				foot: "Right",
				email: "idi.sebantu@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Ali Guyo",
				number: 2,
				position: "DEF",
				role: "Defender",
				foot: "Right",
				email: "ali.diba@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Dennis Thoya",
				number: 3,
				position: "DEF",
				role: "Defender",
				foot: "Right",
				email: "dennis.thoya@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Gabriel Ekitui",
				number: 4,
				position: "DEF",
				role: "Defender",
				foot: "Right",
				email: "gabriel.alukwar@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Ken Neepe",
				number: 5,
				position: "DEF",
				role: "Defender",
				foot: "Right",
				email: "ken.leneepa@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Levis Wanyama",
				number: 10,
				position: "MID",
				role: "Owner & Captain",
				foot: "Right",
				isCaptain: true,
				email: "levis.wanyama@mpesafoundationacademy.ac.ke",
				photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
			},
			{
				name: "Tonny Odundo",
				number: 7,
				position: "MID",
				role: "Vice Captain & Playmaker",
				foot: "Right",
				isViceCaptain: true,
				email: "tonny.odundo@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Chris Koome",
				number: 8,
				position: "MID",
				role: "Midfielder",
				foot: "Right",
				email: "chris.koome@mpesafoundationacademy.ac.ke"
			},
			{
				name: "George Victor",
				number: 6,
				position: "MID",
				role: "Midfielder",
				foot: "Right",
				email: "george.kibet@mpesafoundationacademy.ac.ke"
			},
			{
				name: "King David",
				number: 14,
				position: "MID",
				role: "Midfielder",
				foot: "Right",
				email: "king.amani@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Mahad Abdi",
				number: 12,
				position: "MID",
				role: "Midfielder",
				foot: "Right",
				email: "mahad.sihal@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Mark Tonny",
				number: 15,
				position: "MID",
				role: "Midfielder",
				foot: "Right",
				email: "tonny.odundo@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Elvis Kingoo",
				number: 9,
				position: "FWD",
				role: "Striker",
				foot: "Right",
				email: "elvis.kingoo@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Grout Olal",
				number: 11,
				position: "FWD",
				role: "Forward",
				foot: "Right",
				email: "grout.olal@mpesafoundationacademy.ac.ke"
			},
			{
				name: "Lewis Trady",
				number: 17,
				position: "FWD",
				role: "Forward",
				foot: "Right",
				email: "trady.lewis@mpesafoundationacademy.ac.ke"
			}
		]
	},
	{
		id: 7,
		name: "Young Stars City",
		shortCode: "YSC",
		color: "#f97316",
		homePitch: "Young Stars City Arena (North Pavilion)",
		coachName: "Samwel Reagan Wanyama",
		assistantCoach: "Adams Technical Bench",
		medicalStaff: "MFA Academy Health Unit",
		squad: [
			{
				name: "Ebeneza Moses",
				number: 1,
				position: "GK",
				role: "Goalkeeper",
				foot: "Right"
			},
			{
				name: "Emmanuel Kariuki",
				number: 16,
				position: "GK",
				role: "Goalkeeper",
				foot: "Right"
			},
			{
				name: "Hassan Siad",
				number: 2,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Bidan Mwaura",
				number: 3,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "John Owino",
				number: 4,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Mark Kwemoi",
				number: 5,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Dennis Macharia",
				number: 13,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Washington Murithi",
				number: 6,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Ibrahim Salat",
				number: 8,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Gabriel Maluki",
				number: 11,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Abdifatah",
				number: 12,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Elly Adams Otieno",
				number: 10,
				position: "FWD",
				role: "Team Captain (C)",
				foot: "Left",
				isCaptain: true
			},
			{
				name: "Raila Junior",
				number: 7,
				position: "FWD",
				role: "Forward",
				foot: "Right",
				isViceCaptain: true
			},
			{
				name: "Moffat Osoro",
				number: 9,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			},
			{
				name: "Lucas Nawakan",
				number: 14,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			}
		]
	},
	{
		id: 8,
		name: "Mzinga Boyz",
		shortCode: "MZB",
		color: "#eab308",
		homePitch: "The Hive Stadium (West Campus Ground)",
		coachName: "Saidi Bakari",
		assistantCoach: "Meshach Wanjala",
		medicalStaff: "MFA Campus Athletic Care",
		squad: [
			{
				name: "Meshach Wanjala",
				number: 1,
				position: "GK",
				role: "Goalkeeper",
				foot: "Right"
			},
			{
				name: "Dennis Mwenda",
				number: 16,
				position: "GK",
				role: "Goalkeeper",
				foot: "Right"
			},
			{
				name: "Collins Mutinda",
				number: 2,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Kelvin Kibet",
				number: 3,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Alvin Kiprop",
				number: 4,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Brian Kiptoo",
				number: 5,
				position: "DEF",
				role: "Defender",
				foot: "Right"
			},
			{
				name: "Jeff Njoroge",
				number: 7,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Bavian Kipkorir",
				number: 8,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Titus Kiprotich",
				number: 6,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Samson Lomor",
				number: 11,
				position: "MID",
				role: "Midfielder",
				foot: "Right"
			},
			{
				name: "Hamard Adan",
				number: 10,
				position: "FWD",
				role: "Team Captain (C)",
				foot: "Right",
				isCaptain: true
			},
			{
				name: "Brandon Wandera",
				number: 9,
				position: "FWD",
				role: "Forward",
				foot: "Right",
				isViceCaptain: true
			},
			{
				name: "Victor Kipchirchir",
				number: 14,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			},
			{
				name: "Daniel Epur",
				number: 15,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			},
			{
				name: "Francis Lokidor",
				number: 17,
				position: "FWD",
				role: "Forward",
				foot: "Right"
			}
		]
	}
];
var REGISTERED_EMAILS_STORAGE_KEY = "mpesa_pes_registered_school_emails_v3";
var PENDING_VERIFICATION_KEY = "mpesa_pes_pending_verifications_v1";
var DEFAULT_REGISTERED_EMAILS = Array.from(CONFIRMED_ACADEMY_EMAILS);
function getRegisteredSchoolEmails() {
	if (typeof window === "undefined") return DEFAULT_REGISTERED_EMAILS;
	try {
		const raw = localStorage.getItem(REGISTERED_EMAILS_STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(REGISTERED_EMAILS_STORAGE_KEY, JSON.stringify(DEFAULT_REGISTERED_EMAILS));
			return DEFAULT_REGISTERED_EMAILS;
		}
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		return DEFAULT_REGISTERED_EMAILS;
	} catch {
		return DEFAULT_REGISTERED_EMAILS;
	}
}
/**
* Strict verification: returns true IF AND ONLY IF the email exists in the official
* confirmed academy roster or has been specifically registered by the Council.
*/
function isRegisteredSchoolEmail(email) {
	if (!email || typeof email !== "string") return false;
	const normalized = normalizeAcademyEmail(email);
	if (!normalized || !normalized.includes("@")) return false;
	if (isEmailInConfirmedList(normalized)) return true;
	return getRegisteredSchoolEmails().includes(normalized);
}
function generateVerificationCode(email) {
	const normalized = email.trim().toLowerCase();
	const code = Math.floor(1e3 + Math.random() * 9e3).toString();
	const expiresAt = Date.now() + 6e5;
	if (typeof window !== "undefined") try {
		const stored = localStorage.getItem(PENDING_VERIFICATION_KEY);
		const parsed = stored ? JSON.parse(stored) : {};
		parsed[normalized] = {
			code,
			email: normalized,
			expiresAt
		};
		localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(parsed));
	} catch {}
	return {
		code,
		expiresAt
	};
}
function verifySchoolEmailCode(email, inputCode) {
	const normalized = email.trim().toLowerCase();
	const cleanCode = inputCode.trim();
	if (!cleanCode) return {
		valid: false,
		message: "Please enter the 4-digit verification code."
	};
	if (typeof window === "undefined") return {
		valid: true,
		message: "Verified"
	};
	try {
		const stored = localStorage.getItem(PENDING_VERIFICATION_KEY);
		if (!stored) return {
			valid: false,
			message: "No verification code requested for this email."
		};
		const parsed = JSON.parse(stored);
		const entry = parsed[normalized];
		if (!entry) return {
			valid: false,
			message: "No active verification code found for this email. Please request a new code."
		};
		if (Date.now() > entry.expiresAt) return {
			valid: false,
			message: "Verification code has expired. Please request a new one."
		};
		if (entry.code !== cleanCode) return {
			valid: false,
			message: "Incorrect verification code. Please check and try again."
		};
		delete parsed[normalized];
		localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(parsed));
		return {
			valid: true,
			message: "School email verified successfully!"
		};
	} catch {
		return {
			valid: false,
			message: "Verification check failed. Please try again."
		};
	}
}
var STORAGE_KEY = "mpesa_pes_mvp_winners_history_v1";
var DEFAULT_MVP_WINNERS = [{
	id: "mvp-win-1",
	matchId: 1,
	matchweek: 1,
	fixtureTitle: "Samba Boys vs Young Stars City",
	date: "Sunday, Oct 25, 2026",
	winnerName: "Wokabi",
	teamName: "Samba Boys",
	position: "FWD",
	number: 9,
	photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
	votesCount: 18,
	votePercentage: 53,
	totalBallotsCast: 34,
	certifiedAt: "2026-10-25 18:00 EAT",
	certifiedBy: "Supreme Council",
	notes: "Netted decisive goals with exceptional tactical discipline and fair play conduct."
}, {
	id: "mvp-win-2",
	matchId: 2,
	matchweek: 2,
	fixtureTitle: "Royal Rangers vs Mzinga Boyz",
	date: "Sunday, Nov 01, 2026",
	winnerName: "Dan Kiprop",
	teamName: "Royal Rangers",
	position: "MID",
	number: 8,
	photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
	votesCount: 16,
	votePercentage: 62,
	totalBallotsCast: 26,
	certifiedAt: "2026-11-01 18:30 EAT",
	certifiedBy: "Supreme Council",
	notes: "Controlled the midfield tempo with 2 key assists and zero fouls conceded."
}];
function getMvpWinnersHistory() {
	if (typeof window === "undefined") return DEFAULT_MVP_WINNERS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MVP_WINNERS));
			return DEFAULT_MVP_WINNERS;
		}
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		return DEFAULT_MVP_WINNERS;
	} catch {
		return DEFAULT_MVP_WINNERS;
	}
}
function saveMvpWinnersHistory(records) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
		window.dispatchEvent(new Event("mpesa_mvp_winners_updated"));
	} catch (err) {
		console.error("Failed to persist MVP winners history", err);
	}
}
function archiveMvpWinner(winner) {
	const current = getMvpWinnersHistory();
	const existingIdx = current.findIndex((w) => w.matchId === winner.matchId);
	const newRecord = {
		...winner,
		id: existingIdx >= 0 ? current[existingIdx].id : `mvp-win-${Date.now()}`,
		certifiedAt: (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
			dateStyle: "medium",
			timeStyle: "short"
		})
	};
	let updated;
	if (existingIdx >= 0) {
		updated = [...current];
		updated[existingIdx] = newRecord;
	} else updated = [newRecord, ...current];
	saveMvpWinnersHistory(updated);
	return newRecord;
}
function deleteWinnerFromHistory(id) {
	const updated = getMvpWinnersHistory().filter((w) => w.id !== id);
	saveMvpWinnersHistory(updated);
	return updated;
}
var _jsxFileName$1 = "/app/applet/src/components/AdminVotingVoterAudit.tsx";
function AdminVotingVoterAudit({ matchId, matchweek, matchTitle, matchDate, currentPoll, onUpdatePoll, onShowToast }) {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [expandedPlayer, setExpandedPlayer] = (0, import_react.useState)(null);
	const [showClearConfirmModal, setShowClearConfirmModal] = (0, import_react.useState)(false);
	const [winnersHistory, setWinnersHistory] = (0, import_react.useState)(DEFAULT_MVP_WINNERS);
	import_react.useEffect(() => {
		setWinnersHistory(getMvpWinnersHistory());
		const handleUpdate = () => setWinnersHistory(getMvpWinnersHistory());
		window.addEventListener("mpesa_mvp_winners_updated", handleUpdate);
		return () => window.removeEventListener("mpesa_mvp_winners_updated", handleUpdate);
	}, []);
	const totalVotes = (0, import_react.useMemo)(() => {
		return Object.values(currentPoll.votes).reduce((sum, item) => sum + item.votesCount, 0);
	}, [currentPoll.votes]);
	const candidateEntries = (0, import_react.useMemo)(() => {
		return Object.entries(currentPoll.votes).map(([playerName, data]) => {
			const votersList = data.voters || [];
			return {
				playerName,
				...data,
				votersList,
				percentage: totalVotes > 0 ? Math.round(data.votesCount / totalVotes * 100) : 0
			};
		});
	}, [currentPoll.votes, totalVotes]);
	const leadingCandidate = (0, import_react.useMemo)(() => {
		if (candidateEntries.length === 0) return null;
		return [...candidateEntries].sort((a, b) => b.votesCount - a.votesCount)[0];
	}, [candidateEntries]);
	const filteredCandidates = (0, import_react.useMemo)(() => {
		if (!searchTerm.trim()) return candidateEntries;
		const term = searchTerm.toLowerCase();
		return candidateEntries.filter((c) => c.playerName.toLowerCase().includes(term) || c.teamName.toLowerCase().includes(term) || c.votersList.some((v) => v.name.toLowerCase().includes(term) || v.email.toLowerCase().includes(term)));
	}, [candidateEntries, searchTerm]);
	const handleExportCsv = () => {
		const rows = [[
			"Fixture",
			"Matchweek",
			"Player Candidate",
			"Team",
			"Voter Name",
			"Voter Email",
			"Vote Timestamp"
		].join(",")];
		candidateEntries.forEach((c) => {
			if (c.votersList.length === 0) rows.push(`"${matchTitle}",${matchweek},"${c.playerName}","${c.teamName}","N/A","N/A","N/A"`);
			else c.votersList.forEach((v) => {
				rows.push(`"${matchTitle}",${matchweek},"${c.playerName}","${c.teamName}","${v.name}","${v.email}","${v.votedAt}"`);
			});
		});
		const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.join("\n"));
		const link = document.createElement("a");
		link.setAttribute("href", csvContent);
		link.setAttribute("download", `mvp_voter_log_mw${matchweek}_match${matchId}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		onShowToast("✓ Voter log CSV audit exported successfully!");
	};
	const handleArchiveAndClearVotingLog = () => {
		const winnerCandidate = leadingCandidate;
		if (winnerCandidate && winnerCandidate.votesCount > 0) archiveMvpWinner({
			matchId,
			matchweek,
			fixtureTitle: matchTitle,
			date: matchDate,
			winnerName: winnerCandidate.playerName,
			teamName: winnerCandidate.teamName,
			position: winnerCandidate.position,
			number: winnerCandidate.number,
			photoUrl: winnerCandidate.playerPhoto,
			votesCount: winnerCandidate.votesCount,
			votePercentage: winnerCandidate.percentage,
			totalBallotsCast: totalVotes,
			certifiedBy: "Supreme Council",
			notes: `Certified with ${winnerCandidate.votesCount} of ${totalVotes} total verified votes (${winnerCandidate.percentage}%).`
		});
		onUpdatePoll({
			...currentPoll,
			isOpen: true,
			officialWinner: winnerCandidate ? {
				playerName: winnerCandidate.playerName,
				teamName: winnerCandidate.teamName,
				photoUrl: winnerCandidate.playerPhoto,
				votes: winnerCandidate.votesCount,
				percentage: winnerCandidate.percentage
			} : void 0,
			votes: Object.fromEntries(Object.entries(currentPoll.votes).map(([name, data]) => [name, {
				...data,
				votesCount: 0,
				voters: []
			}])),
			voterEmails: []
		});
		setShowClearConfirmModal(false);
		onShowToast("✓ Match voting log cleared! Certified winner preserved in permanent honours records.");
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-[#100c2a] border-2 border-cyan-400/40 rounded-3xl p-5 shadow-2xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2554] pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "w-5 h-5 text-cyan-400" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 205,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-header text-base font-black text-white uppercase tracking-wider",
								children: [
									"Voter Audit Desk • Match #",
									matchId,
									" (",
									matchTitle,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 206,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 204,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-gray-400 mt-1",
							children: "Verify exact voter names per candidate. Reset and clear ballot logs for upcoming fixtures while permanently preserving winners in the records hall of fame."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 210,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 203,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: handleExportCsv,
								className: "px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-[#00f0ff] border border-cyan-400/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 222,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Export CSV" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 223,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 217,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setShowClearConfirmModal(true),
								className: "px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-black flex items-center gap-1.5 transition cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RotateCcw, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 231,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Clear & Reset Voting Log" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 232,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 226,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 216,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 202,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-[#080517] p-3 rounded-2xl border border-cyan-400/20",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-gray-400 uppercase font-bold block",
									children: "Verified Ballots"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 240,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-lg font-black text-white font-mono",
									children: [totalVotes, " Cast"]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 243,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 239,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-[#080517] p-3 rounded-2xl border border-emerald-400/20",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-gray-400 uppercase font-bold block",
									children: "Leading Candidate"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 246,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-sm font-black text-emerald-300 truncate",
									children: leadingCandidate ? leadingCandidate.playerName : "No votes yet"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 249,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 245,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-[#080517] p-3 rounded-2xl border border-amber-400/20",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-gray-400 uppercase font-bold block",
									children: "Unique Voters"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 254,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-lg font-black text-amber-300 font-mono",
									children: [currentPoll.voterEmails.length, " Students"]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 257,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 253,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-[#080517] p-3 rounded-2xl border border-purple-400/20",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-gray-400 uppercase font-bold block",
									children: "Preserved Winners"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 262,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-lg font-black text-purple-300 font-mono",
									children: [winnersHistory.length, " Champions"]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 265,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 261,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 238,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "w-4 h-4 text-gray-400 absolute left-3 top-2.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 273,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "text",
							placeholder: "Search candidate name or voter name/email...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value),
							className: "w-full bg-[#080517] border border-[#2e2554] focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 274,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 272,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "w-4 h-4 text-cyan-400" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 286,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								"Voter Names by Player Candidate (",
								filteredCandidates.length,
								")"
							] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 287,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 285,
							columnNumber: 11
						}, this), filteredCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-6 bg-[#080517] rounded-2xl border border-[#2e2554] text-center text-xs text-gray-400",
							children: [
								"No voting records matching \"",
								searchTerm,
								"\"."
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 291,
							columnNumber: 13
						}, this) : filteredCandidates.map((c) => {
							const isExpanded = expandedPlayer === c.playerName;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-[#0a071b] border border-[#261f4d] rounded-2xl overflow-hidden transition",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									onClick: () => setExpandedPlayer(isExpanded ? null : c.playerName),
									className: "p-3.5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-9 h-9 rounded-xl bg-[#141029] border border-[#2e2554] flex items-center justify-center font-bold text-sm text-cyan-300 shrink-0",
											children: c.number ?? "★"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 308,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-black text-white text-sm",
												children: c.playerName
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 313,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-gray-400 font-mono",
												children: [
													"(",
													c.position || "FWD",
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 314,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 312,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-cyan-300 font-medium",
											children: c.teamName
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 318,
											columnNumber: 25
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 311,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 307,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-sm font-black text-amber-300 font-mono",
												children: [
													c.votesCount,
													" ",
													c.votesCount === 1 ? "Vote" : "Votes"
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 324,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "block text-[10px] text-gray-400 font-mono",
												children: [c.percentage, "% of tally"]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 327,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 323,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											"aria-label": "Expand voter list",
											className: "p-1 rounded-lg text-gray-400 hover:text-white",
											children: isExpanded ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronUp, { className: "w-4 h-4" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 337,
												columnNumber: 27
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "w-4 h-4" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 339,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 331,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 322,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 303,
									columnNumber: 19
								}, this), isExpanded && /* @__PURE__ */ (void 0)("div", {
									className: "p-3.5 bg-[#070512] border-t border-[#261f4d] space-y-2 animate-in fade-in",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 pb-1 border-b border-[#1f1744]",
										children: [/* @__PURE__ */ (void 0)("span", { children: "Verified Voter Name" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 349,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Official Academy Email & Time" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 350,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 348,
										columnNumber: 23
									}, this), c.votersList.length === 0 ? /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-gray-500 italic py-2",
										children: [
											"No registered students have cast a vote for ",
											c.playerName,
											" yet."
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 354,
										columnNumber: 25
									}, this) : /* @__PURE__ */ (void 0)("div", {
										className: "divide-y divide-[#1b153b] max-h-48 overflow-y-auto",
										children: c.votersList.map((v, vIdx) => /* @__PURE__ */ (void 0)("div", {
											className: "py-1.5 flex items-center justify-between text-xs gap-2",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 365,
													columnNumber: 33
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "font-bold text-white",
													children: v.name
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 366,
													columnNumber: 33
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 364,
												columnNumber: 31
											}, this), /* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-3 text-right",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-[11px] font-mono text-cyan-300",
													children: v.email
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 369,
													columnNumber: 33
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "text-[10px] text-gray-500 font-mono",
													children: v.votedAt
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 372,
													columnNumber: 33
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 368,
												columnNumber: 31
											}, this)]
										}, vIdx, true, {
											fileName: _jsxFileName$1,
											lineNumber: 360,
											columnNumber: 29
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 358,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 347,
									columnNumber: 21
								}, this)]
							}, c.playerName, true, {
								fileName: _jsxFileName$1,
								lineNumber: 298,
								columnNumber: 17
							}, this);
						})]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 284,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 201,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
						className: "font-header text-base font-black text-white uppercase flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 394,
							columnNumber: 15
						}, this), "Cumulative MVP Winners Records Table (Permanent Hall of Fame)"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 393,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-gray-400 mt-0.5",
						children: "Certified matchweek winners remain permanently preserved in this ledger even when individual match voter logs are cleared."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 397,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 392,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30",
						children: [winnersHistory.length, " Historic Champions"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 403,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 391,
					columnNumber: 9
				}, this), winnersHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-gray-400 italic py-4 text-center",
					children: "No MVP champions certified yet. Certify and archive a match to record the first winner!"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 409,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
						className: "w-full text-xs text-left",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
							className: "border-b border-[#2e2554] text-[10px] uppercase font-bold text-gray-400 bg-[#141029]/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "Matchweek"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 417,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "MVP Champion"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 418,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "Club"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 419,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3 text-center",
									children: "Votes Won"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 420,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3 text-center",
									children: "Share"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 421,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "Certified Date"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 422,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3 text-right",
									children: "Actions"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 423,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 416,
							columnNumber: 17
						}, this) }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 415,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
							className: "divide-y divide-[#1e1742]",
							children: winnersHistory.map((w) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
								className: "hover:bg-white/5 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 font-mono font-black text-cyan-300",
										children: ["MW ", w.matchweek]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 429,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0",
												children: "👑"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 434,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-black text-white block",
												children: w.winnerName
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 438,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-gray-400 font-mono",
												children: w.fixtureTitle
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 439,
												columnNumber: 27
											}, this)] }, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 437,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 433,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 432,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 font-semibold text-gray-200",
										children: w.teamName
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 445,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 text-center font-mono font-bold text-emerald-400",
										children: [
											w.votesCount,
											" / ",
											w.totalBallotsCast
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 446,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 text-center font-mono font-black text-amber-300",
										children: [w.votePercentage, "%"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 449,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 text-gray-400 font-mono text-[11px]",
										children: w.certifiedAt
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 452,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => {
												if (window.confirm(`Delete ${w.winnerName}'s MVP record from hall of fame?`)) {
													deleteWinnerFromHistory(w.id);
													onShowToast(`✓ Removed ${w.winnerName} from MVP history`);
												}
											},
											className: "p-1 rounded-lg text-gray-500 hover:text-rose-400 transition",
											title: "Delete from hall of fame",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 469,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 456,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 455,
										columnNumber: 21
									}, this)
								]
							}, w.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 428,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 426,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 414,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 413,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 390,
				columnNumber: 7
			}, this),
			showClearConfirmModal && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#100c2a] border-2 border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-3 text-rose-400 border-b border-[#2e2554] pb-3",
							children: [/* @__PURE__ */ (void 0)(RotateCcw, { className: "w-6 h-6 shrink-0" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 485,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h4", {
								className: "font-header text-base font-black text-white uppercase",
								children: "Reset Match Voting Log"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 487,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-[11px] text-gray-400",
								children: [
									"Fixture #",
									matchId,
									" • ",
									matchTitle
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 490,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 486,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 484,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "text-xs text-gray-300 space-y-2",
							children: [
								/* @__PURE__ */ (void 0)("p", { children: "Are you sure you want to clear the voting log for this match?" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 497,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-emerald-950/30 border border-emerald-400/30 rounded-xl space-y-1 text-emerald-200",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "font-bold flex items-center gap-1.5 text-xs text-emerald-300",
										children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 500,
											columnNumber: 19
										}, this), "Winner Preservation Guaranteed:"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 499,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-[11px]",
										children: [
											/* @__PURE__ */ (void 0)("strong", { children: leadingCandidate ? leadingCandidate.playerName : "Current Winner" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 504,
												columnNumber: 19
											}, this),
											" ",
											"will be permanently saved into the Cumulative MVP Winners Records Table."
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 503,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 498,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("p", {
									className: "text-gray-400 text-[11px]",
									children: "The voter ballots and tallies for this match will be reset to 0 so fresh votes can be cast for the next match."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 510,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 496,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-end gap-2 pt-3 border-t border-[#2e2554]",
							children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setShowClearConfirmModal(false),
								className: "px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 517,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: handleArchiveAndClearVotingLog,
								className: "px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black text-xs font-black uppercase transition cursor-pointer",
								children: "Archive & Clear Log"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 524,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 516,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 483,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 482,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 199,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/MatchMvpVoting.tsx";
function MatchMvpVoting({ initialMatchId, onClose }) {
	const { isSuperAdmin, currentRole } = useRoleAccess();
	const canAdminVoting = isSuperAdmin || currentRole === "TECH_MANAGER" || currentRole === "ASST_TECH_MANAGER" || currentRole === "RECORDS_MANAGER" || currentRole === "PRESIDENT";
	const [matches, setMatches] = (0, import_react.useState)(DEFAULT_FIXTURES);
	const [teams, setTeams] = (0, import_react.useState)(DEFAULT_TEAMS);
	const [selectedMatchId, setSelectedMatchId] = (0, import_react.useState)(initialMatchId || 1);
	const [pollData, setPollData] = (0, import_react.useState)({});
	const [voterName, setVoterName] = (0, import_react.useState)("");
	const [voterEmail, setVoterEmail] = (0, import_react.useState)("");
	const [selectedCandidate, setSelectedCandidate] = (0, import_react.useState)(null);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [verificationStep, setVerificationStep] = (0, import_react.useState)("unverified");
	const [verificationCodeInput, setVerificationCodeInput] = (0, import_react.useState)("");
	const [dispatchedPasscode, setDispatchedPasscode] = (0, import_react.useState)(null);
	const [verificationError, setVerificationError] = (0, import_react.useState)(null);
	const [verifiedEmail, setVerifiedEmail] = (0, import_react.useState)(null);
	const [newSchoolEmailInput, setNewSchoolEmailInput] = (0, import_react.useState)("");
	const [showVoterAudit, setShowVoterAudit] = (0, import_react.useState)(false);
	const [mvpHistory, setMvpHistory] = (0, import_react.useState)(DEFAULT_MVP_WINNERS);
	(0, import_react.useEffect)(() => {
		setMvpHistory(getMvpWinnersHistory());
		const handleUpdate = () => setMvpHistory(getMvpWinnersHistory());
		window.addEventListener("mpesa_mvp_winners_updated", handleUpdate);
		return () => window.removeEventListener("mpesa_mvp_winners_updated", handleUpdate);
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
			if (storedFixtures) {
				const parsed = JSON.parse(storedFixtures);
				if (Array.isArray(parsed) && parsed.length > 0) setMatches(parsed);
			}
			const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
			if (storedTeams) {
				const parsed = JSON.parse(storedTeams);
				if (Array.isArray(parsed) && parsed.length > 0) setTeams(parsed);
			}
			const storedPolls = localStorage.getItem("mpesa_pes_mvp_votes_v1");
			if (storedPolls) setPollData(JSON.parse(storedPolls));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (initialMatchId) setSelectedMatchId(initialMatchId);
	}, [initialMatchId]);
	const emailStatus = (0, import_react.useMemo)(() => {
		const raw = voterEmail.trim();
		if (!raw) return null;
		return {
			isConfirmed: isRegisteredSchoolEmail(raw),
			displayName: getEmailDisplayName(raw)
		};
	}, [voterEmail]);
	const handleEmailChange = (newVal) => {
		setVoterEmail(newVal);
		if (verifiedEmail && newVal.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
			setVerificationStep("unverified");
			setVerifiedEmail(null);
			setVerificationError(null);
			setDispatchedPasscode(null);
			setVerificationCodeInput("");
		}
		if (!voterName && isRegisteredSchoolEmail(newVal)) setVoterName(getEmailDisplayName(newVal));
	};
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 4e3);
	};
	const persistPollData = (updated) => {
		setPollData(updated);
		try {
			localStorage.setItem("mpesa_pes_mvp_votes_v1", JSON.stringify(updated));
		} catch {}
	};
	const currentMatch = (0, import_react.useMemo)(() => matches.find((m) => m.id === selectedMatchId) || matches[0], [matches, selectedMatchId]);
	const homeTeam = (0, import_react.useMemo)(() => teams.find((t) => t.id === currentMatch.homeId) || {
		id: currentMatch.homeId,
		name: "Home Team",
		shortCode: "HOM",
		color: "#00f0ff",
		homePitch: "School Pitch"
	}, [teams, currentMatch.homeId]);
	const awayTeam = (0, import_react.useMemo)(() => teams.find((t) => t.id === currentMatch.awayId) || {
		id: currentMatch.awayId,
		name: "Away Team",
		shortCode: "AWY",
		color: "#ffe600",
		homePitch: "School Pitch"
	}, [teams, currentMatch.awayId]);
	const matchCandidates = (0, import_react.useMemo)(() => {
		const homeClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === currentMatch.homeId);
		const awayClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === currentMatch.awayId);
		const homeSquad = homeClub?.squad || homeTeam?.squad || [];
		const awaySquad = awayClub?.squad || awayTeam?.squad || [];
		return [...homeSquad.map((p) => ({
			name: p.name,
			position: p.position,
			number: p.number,
			photoUrl: p.photoUrl,
			teamName: homeTeam.name,
			teamColor: homeTeam.color
		})), ...awaySquad.map((p) => ({
			name: p.name,
			position: p.position,
			number: p.number,
			photoUrl: p.photoUrl,
			teamName: awayTeam.name,
			teamColor: awayTeam.color
		}))];
	}, [
		homeTeam,
		awayTeam,
		currentMatch.homeId,
		currentMatch.awayId
	]);
	const currentPoll = (0, import_react.useMemo)(() => {
		if (pollData[selectedMatchId]) return pollData[selectedMatchId];
		if (selectedMatchId === 1) return {
			matchId: 1,
			isOpen: true,
			votes: {
				Wokabi: {
					votesCount: 0,
					teamName: homeTeam.name,
					position: "FWD",
					number: 9
				},
				Jaycrack: {
					votesCount: 0,
					teamName: homeTeam.name,
					position: "MID",
					number: 10
				},
				"Elly Adams Otieno": {
					votesCount: 5,
					teamName: awayTeam.name,
					position: "FWD",
					number: 7
				},
				"John Kamau": {
					votesCount: 2,
					teamName: awayTeam.name,
					position: "GK",
					number: 1
				}
			},
			voterEmails: ["student.council@mpesa.ac.ke", "sports.captain@mpesa.ac.ke"]
		};
		return {
			matchId: selectedMatchId,
			isOpen: true,
			votes: {},
			voterEmails: []
		};
	}, [
		pollData,
		selectedMatchId,
		homeTeam.name,
		awayTeam.name
	]);
	const totalVotes = (0, import_react.useMemo)(() => {
		return Object.values(currentPoll.votes).reduce((sum, item) => sum + item.votesCount, 0);
	}, [currentPoll]);
	const sortedVoteTally = (0, import_react.useMemo)(() => {
		return Object.entries(currentPoll.votes).map(([name, data]) => ({
			name,
			...data,
			percentage: totalVotes > 0 ? Math.round(data.votesCount / totalVotes * 100) : 0
		})).sort((a, b) => b.votesCount - a.votesCount);
	}, [currentPoll, totalVotes]);
	const leadingCandidate = sortedVoteTally.length > 0 ? sortedVoteTally[0] : null;
	const normalizedInputEmail = voterEmail.trim().toLowerCase();
	const hasAlreadyVoted = Boolean(normalizedInputEmail && currentPoll.voterEmails.includes(normalizedInputEmail));
	const handleRequestVerification = () => {
		setVerificationError(null);
		const emailNorm = voterEmail.trim().toLowerCase();
		if (!emailNorm || !emailNorm.includes("@")) {
			setVerificationError("Please enter a valid school email address.");
			return;
		}
		if (!isRegisteredSchoolEmail(emailNorm)) {
			setVerificationError("Email address not confirmed in the official academy voter roster. Only verified M-Pesa Foundation Academy student and staff emails from the authorized list are permitted to vote.");
			return;
		}
		if (currentPoll.voterEmails.includes(emailNorm)) {
			setVerificationError("⛔ You have already voted for this match MVP. Only 1 vote per registered school email is permitted.");
			return;
		}
		const { code } = generateVerificationCode(emailNorm);
		setDispatchedPasscode(code);
		setVerificationStep("code_sent");
		setVerificationCodeInput("");
		showToast(`✓ Verification passcode dispatched for ${emailNorm}`);
	};
	const handleConfirmVerificationCode = () => {
		setVerificationError(null);
		const emailNorm = voterEmail.trim().toLowerCase();
		const result = verifySchoolEmailCode(emailNorm, verificationCodeInput);
		if (result.valid) {
			setVerificationStep("verified");
			setVerifiedEmail(emailNorm);
			setDispatchedPasscode(null);
			showToast("✓ School email verified! You may now cast your single official ballot.");
		} else setVerificationError(result.message);
	};
	const isCurrentMatchFinished = (0, import_react.useMemo)(() => {
		const st = (currentMatch?.status || "").toUpperCase();
		return st === "COMPLETED" || st === "FINISHED";
	}, [currentMatch?.status]);
	const handleCastVote = (e) => {
		e.preventDefault();
		if (!isCurrentMatchFinished) {
			showToast("⚠️ MVP Balloting is strictly reserved for matches that have finished and been certified.");
			return;
		}
		if (!currentPoll.isOpen) {
			showToast("⚠️ MVP Voting for this match is currently closed.");
			return;
		}
		const emailNorm = voterEmail.trim().toLowerCase();
		if (verificationStep !== "verified" || verifiedEmail !== emailNorm) {
			showToast("⚠️ Your registered school email must be verified first before casting your ballot.");
			return;
		}
		if (currentPoll.voterEmails.includes(emailNorm)) {
			showToast("⛔ You have already voted for this match MVP. Only 1 vote per member is permitted.");
			return;
		}
		if (!selectedCandidate) {
			showToast("⚠️ Please select a player candidate to cast your vote.");
			return;
		}
		const candidateObj = matchCandidates.find((c) => c.name === selectedCandidate);
		const existingCandidateVotes = currentPoll.votes[selectedCandidate] || {
			votesCount: 0,
			teamName: candidateObj?.teamName || "Academy Player",
			position: candidateObj?.position || "FWD",
			number: candidateObj?.number || 10,
			playerPhoto: candidateObj?.photoUrl,
			voters: []
		};
		const voterEntry = {
			name: voterName.trim() || getEmailDisplayName(emailNorm),
			email: emailNorm,
			votedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}) + " • " + (/* @__PURE__ */ new Date()).toLocaleDateString()
		};
		const currentVoters = existingCandidateVotes.voters || [];
		const updatedPoll = {
			...currentPoll,
			votes: {
				...currentPoll.votes,
				[selectedCandidate]: {
					...existingCandidateVotes,
					votesCount: existingCandidateVotes.votesCount + 1,
					voters: [...currentVoters, voterEntry]
				}
			},
			voterEmails: [...currentPoll.voterEmails, emailNorm]
		};
		const updatedAll = {
			...pollData,
			[selectedMatchId]: updatedPoll
		};
		persistPollData(updatedAll);
		showToast(`✓ Ballot officially recorded for ${selectedCandidate}!`);
		setSelectedCandidate(null);
	};
	const handleCopyVotingLink = () => {
		const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/mvp-voting?matchId=${selectedMatchId}`;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(shareUrl);
			showToast("✓ Shareable MVP Voting link copied to clipboard!");
		}
	};
	const handleToggleVotingStatus = () => {
		if (!canAdminVoting) return;
		const newStatus = !currentPoll.isOpen;
		let winnerObj = currentPoll.officialWinner;
		if (!newStatus && leadingCandidate) winnerObj = {
			playerName: leadingCandidate.name,
			teamName: leadingCandidate.teamName,
			photoUrl: leadingCandidate.playerPhoto,
			votes: leadingCandidate.votesCount,
			percentage: leadingCandidate.percentage
		};
		const updatedPoll = {
			...currentPoll,
			isOpen: newStatus,
			officialWinner: winnerObj
		};
		const updatedAll = {
			...pollData,
			[selectedMatchId]: updatedPoll
		};
		persistPollData(updatedAll);
		showToast(newStatus ? "✓ Voting poll reopened for ballots." : `✓ Poll concluded! ${leadingCandidate ? leadingCandidate.name : "Winner"} officially crowned MVP.`);
	};
	const handleResetPoll = () => {
		if (!canAdminVoting) return;
		if (window.confirm("Are you sure you want to reset all votes for this match?")) {
			const updatedPoll = {
				matchId: selectedMatchId,
				isOpen: true,
				votes: {},
				voterEmails: []
			};
			const updatedAll = {
				...pollData,
				[selectedMatchId]: updatedPoll
			};
			persistPollData(updatedAll);
			showToast("✓ Match poll has been reset.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			toastMessage && /* @__PURE__ */ (void 0)("div", {
				className: "fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2",
				children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-4 h-4 text-black" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 532,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", {
					className: "text-xs",
					children: toastMessage
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 533,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 531,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black",
								children: "Official eFootball Ballot"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 541,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${currentPoll.isOpen ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30" : "bg-rose-400/20 text-rose-300 border border-rose-400/30"}`,
								children: currentPoll.isOpen ? "Voting Live" : "Voting Concluded"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 544,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-gray-400 font-mono flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 554,
									columnNumber: 15
								}, this), "Verified School Emails Only (1 Vote)"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 553,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 540,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Match MVP Voting" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 560,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "w-7 h-7 text-amber-400" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 561,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 559,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs sm:text-sm text-gray-300",
						children: "Cast your official vote for the match's most outstanding performer. Strict single-vote enforcement."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 563,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 539,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 bg-[#141029] border border-[#2e2554] p-2 rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-gray-400 font-bold uppercase pl-1",
								children: "Match:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 573,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: selectedMatchId,
								onChange: (e) => {
									setSelectedMatchId(Number(e.target.value));
									setVerificationStep("unverified");
									setVerifiedEmail(null);
									setDispatchedPasscode(null);
								},
								"aria-label": "Select match for MVP voting",
								className: "bg-transparent text-xs font-black text-[#00f0ff] focus:outline-none cursor-pointer pr-2",
								children: matches.map((m) => {
									const h = teams.find((t) => t.id === m.homeId)?.shortCode || `C${m.homeId}`;
									const a = teams.find((t) => t.id === m.awayId)?.shortCode || `C${m.awayId}`;
									const isFinished = (m.status || "").toUpperCase() === "COMPLETED" || (m.status || "").toUpperCase() === "FINISHED";
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: m.id,
										className: "bg-[#141029] text-white",
										children: [
											"MW ",
											m.matchweek,
											": ",
											h,
											" vs ",
											a,
											" (",
											isFinished ? "✅ Finished" : "⏳ " + (m.status || "Scheduled"),
											")"
										]
									}, m.id, true, {
										fileName: _jsxFileName,
										lineNumber: 592,
										columnNumber: 19
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 574,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 572,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: handleCopyVotingLink,
							className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition cursor-pointer",
							title: "Copy shareable link for league members to vote",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 606,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Copy Link" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 607,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 601,
							columnNumber: 11
						}, this),
						canAdminVoting && /* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (void 0)("button", {
									onClick: handleToggleVotingStatus,
									className: `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${currentPoll.isOpen ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500 hover:text-white" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500 hover:text-black"}`,
									children: [currentPoll.isOpen ? /* @__PURE__ */ (void 0)(Lock, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 622,
										columnNumber: 19
									}, this) : /* @__PURE__ */ (void 0)(LockOpen, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 624,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", { children: currentPoll.isOpen ? "Close Poll" : "Reopen" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 626,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 613,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									onClick: () => setShowVoterAudit(!showVoterAudit),
									className: `px-3 py-2 rounded-xl text-xs font-bold border transition ${showVoterAudit ? "bg-cyan-500/20 text-[#00f0ff] border-cyan-400/40" : "bg-[#141029] text-gray-300 border-[#2e2554] hover:text-white"}`,
									children: [
										"Voter Audit (",
										currentPoll.voterEmails.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 629,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									onClick: handleResetPoll,
									className: "p-2 rounded-xl bg-[#141029] border border-[#2e2554] text-gray-400 hover:text-rose-400 transition cursor-pointer",
									title: "Reset Poll Votes",
									children: /* @__PURE__ */ (void 0)(RefreshCw, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 645,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 640,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 612,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 570,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 538,
				columnNumber: 7
			}, this),
			canAdminVoting && showVoterAudit && /* @__PURE__ */ (void 0)(AdminVotingVoterAudit, {
				matchId: selectedMatchId,
				matchweek: currentMatch.matchweek,
				matchTitle: `${homeTeam.name} vs ${awayTeam.name}`,
				matchDate: currentMatch.date,
				currentPoll,
				onUpdatePoll: (updated) => {
					const updatedAll = {
						...pollData,
						[selectedMatchId]: updated
					};
					persistPollData(updatedAll);
				},
				onShowToast: showToast
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 654,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-gradient-to-r from-[#141029] via-[#1a1438] to-[#141029] border border-[#2e2554] p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "px-3 py-1.5 rounded-xl font-black text-xs text-black",
								style: { backgroundColor: homeTeam.color || "#00f0ff" },
								children: homeTeam.shortCode
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 675,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-black text-sm text-white",
								children: homeTeam.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 681,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 674,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "px-3 py-1 rounded-xl bg-black/50 border border-white/10 font-mono text-xs font-black text-amber-300",
							children: currentMatch.status === "FINISHED" ? `${currentMatch.homeScore} - ${currentMatch.awayScore}` : "VS"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 684,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-black text-sm text-white",
								children: awayTeam.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 691,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "px-3 py-1.5 rounded-xl font-black text-xs text-black",
								style: { backgroundColor: awayTeam.color || "#ffe600" },
								children: awayTeam.shortCode
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 692,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 690,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 673,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-right text-xs text-gray-400",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-bold text-gray-300 block",
						children: ["📍 ", currentMatch.venue || "Academy Ground"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 702,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-mono text-[11px] text-[#00f0ff]",
						children: currentMatch.date
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 705,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 701,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 672,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-7 bg-[#0d0a21]/90 border border-[#2e2554] p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between border-b border-[#2e2554] pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Vote, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 715,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "text-base font-black uppercase text-white tracking-wide",
									children: "Cast Your MVP Ballot"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 716,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 714,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-gray-400 font-mono",
								children: ["Total Votes Cast: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-[#00f0ff]",
									children: totalVotes
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 721,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 720,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 713,
							columnNumber: 11
						}, this),
						!isCurrentMatchFinished ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1a1236] to-[#0c0922] border-2 border-amber-400/40 text-center space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center border border-amber-400/30 shadow-lg",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "w-6 h-6" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 728,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 727,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "text-sm font-black uppercase text-amber-300 tracking-wide",
									children: "MVP Balloting Opens When Match Finishes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 730,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-gray-300 leading-relaxed max-w-md mx-auto",
									children: [
										"Matchweek ",
										currentMatch.matchweek,
										" (",
										homeTeam.name,
										" vs ",
										awayTeam.name,
										") is currently",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/30 uppercase",
											children: currentMatch.status || "SCHEDULED"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 735,
											columnNumber: 17
										}, this),
										". In accordance with league governance, MVP voting is strictly enabled only for completed matches once certified by match officials."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 733,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 726,
							columnNumber: 13
						}, this) : currentPoll.isOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
							onSubmit: handleCastVote,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "text-[11px] font-black uppercase text-gray-400 block mb-1",
												children: "Your Full Name"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 747,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
												type: "text",
												required: true,
												placeholder: "e.g. Student Name",
												value: voterName,
												onChange: (e) => setVoterName(e.target.value),
												className: "w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 750,
												columnNumber: 21
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 746,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center justify-between mb-1",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
														className: "text-[11px] font-black uppercase text-gray-400 block",
														children: "Registered School Email"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 762,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[10px] text-amber-400 font-mono",
														children: "1 vote per member"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 765,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 761,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
													type: "email",
													required: true,
													placeholder: "e.g. student@mpesa.ac.ke",
													value: voterEmail,
													onChange: (e) => handleEmailChange(e.target.value),
													disabled: verificationStep === "verified",
													className: `w-full bg-[#141029] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${verificationStep === "verified" ? "border-emerald-400/60 bg-emerald-950/20 text-emerald-200" : "border-[#2e2554] focus:border-amber-400"}`
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 769,
													columnNumber: 21
												}, this),
												voterEmail.trim().length > 3 && /* @__PURE__ */ (void 0)("div", {
													className: "mt-1.5 flex items-center gap-1.5 text-[11px]",
													children: emailStatus?.isConfirmed ? /* @__PURE__ */ (void 0)("span", {
														className: "text-emerald-400 font-bold flex items-center gap-1",
														children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 787,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("span", { children: ["Confirmed Academy Voter: ", emailStatus.displayName] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 788,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 786,
														columnNumber: 27
													}, this) : voterEmail.includes("@") ? /* @__PURE__ */ (void 0)("span", {
														className: "text-rose-400 font-bold flex items-center gap-1",
														children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-3.5 h-3.5 text-rose-400" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 792,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("span", { children: "Email not found in confirmed 344-member academy voter list" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 793,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 791,
														columnNumber: 27
													}, this) : null
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 784,
													columnNumber: 23
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 760,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 745,
											columnNumber: 17
										}, this),
										hasAlreadyVoted && /* @__PURE__ */ (void 0)("div", {
											className: "p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5",
											children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-5 h-5 shrink-0 text-rose-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 804,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", {
												className: "block font-black uppercase",
												children: "Ballot Already Cast"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 806,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("span", { children: [
												"This registered school email (",
												/* @__PURE__ */ (void 0)("strong", { children: normalizedInputEmail }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 808,
													columnNumber: 55
												}, this),
												") has already voted for this fixture. Exactly 1 vote per member is permitted."
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 807,
												columnNumber: 23
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 805,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 803,
											columnNumber: 19
										}, this),
										!hasAlreadyVoted && /* @__PURE__ */ (void 0)("div", {
											className: "p-3.5 rounded-2xl bg-[#141029] border border-[#2e2554] space-y-2.5",
											children: [
												verificationStep === "unverified" && /* @__PURE__ */ (void 0)("div", {
													className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (void 0)(Mail, { className: "w-4 h-4 text-cyan-400 shrink-0" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 822,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", {
															className: "text-xs text-gray-300",
															children: "Registered school emails must be verified first before balloting."
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 823,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 821,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: handleRequestVerification,
														disabled: !voterEmail.trim(),
														className: "px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1.5 cursor-pointer",
														children: [/* @__PURE__ */ (void 0)(ShieldCheck, { className: "w-3.5 h-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 833,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", { children: "Verify School Email" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 834,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 827,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 820,
													columnNumber: 23
												}, this),
												verificationStep === "code_sent" && /* @__PURE__ */ (void 0)("div", {
													className: "space-y-3",
													children: [dispatchedPasscode && /* @__PURE__ */ (void 0)("div", {
														className: "p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between gap-2 text-xs",
														children: [/* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-2 text-cyan-200",
															children: [/* @__PURE__ */ (void 0)(Send, { className: "w-4 h-4 text-cyan-400 shrink-0" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 846,
																columnNumber: 31
															}, this), /* @__PURE__ */ (void 0)("span", { children: [
																"Passcode dispatched to ",
																/* @__PURE__ */ (void 0)("strong", { children: voterEmail }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 848,
																	columnNumber: 56
																}, this),
																"."
															] }, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 847,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 845,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg border border-cyan-400/30",
															children: [/* @__PURE__ */ (void 0)("span", {
																className: "text-[10px] text-gray-400 uppercase font-mono",
																children: "Code:"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 852,
																columnNumber: 31
															}, this), /* @__PURE__ */ (void 0)("strong", {
																className: "text-cyan-300 font-mono tracking-widest text-sm",
																children: dispatchedPasscode
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 855,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 851,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 844,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "flex flex-col sm:flex-row items-center gap-2",
														children: [/* @__PURE__ */ (void 0)("div", {
															className: "relative flex-1 w-full",
															children: [/* @__PURE__ */ (void 0)(KeyRound, { className: "w-4 h-4 text-amber-400 absolute left-3 top-2.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 864,
																columnNumber: 29
															}, this), /* @__PURE__ */ (void 0)("input", {
																type: "text",
																maxLength: 6,
																placeholder: "Enter 4-Digit Passcode",
																value: verificationCodeInput,
																onChange: (e) => setVerificationCodeInput(e.target.value),
																className: "w-full bg-[#090615] border border-amber-400/40 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-amber-300 tracking-widest placeholder-gray-500 outline-none"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 865,
																columnNumber: 29
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 863,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-2 w-full sm:w-auto",
															children: [/* @__PURE__ */ (void 0)("button", {
																type: "button",
																onClick: handleConfirmVerificationCode,
																className: "flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase transition cursor-pointer",
																children: "Confirm Code"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 876,
																columnNumber: 29
															}, this), /* @__PURE__ */ (void 0)("button", {
																type: "button",
																onClick: handleRequestVerification,
																className: "px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition",
																children: "Resend"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 883,
																columnNumber: 29
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 875,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 862,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 841,
													columnNumber: 23
												}, this),
												verificationStep === "verified" && /* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "flex items-center gap-2 text-xs font-black text-emerald-300",
														children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 899,
															columnNumber: 27
														}, this), /* @__PURE__ */ (void 0)("span", { children: ["Verified School Voter: ", verifiedEmail] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 900,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 898,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("button", {
														type: "button",
														onClick: () => {
															setVerificationStep("unverified");
															setVerifiedEmail(null);
														},
														className: "text-[10px] text-gray-400 hover:text-white underline font-mono",
														children: "Change Email"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 902,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 897,
													columnNumber: 23
												}, this),
												verificationError && /* @__PURE__ */ (void 0)("div", {
													className: "p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2",
													children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-4 h-4 shrink-0" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 918,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("span", { children: verificationError }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 919,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 917,
													columnNumber: 23
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 817,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 744,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "text-[11px] font-black uppercase text-gray-400 block",
											children: "Select Match MVP Candidate"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 929,
											columnNumber: 19
										}, this), verificationStep !== "verified" && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] text-amber-400 font-bold flex items-center gap-1",
											children: [/* @__PURE__ */ (void 0)(Lock, { className: "w-3 h-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 934,
												columnNumber: 23
											}, this), "Verify school email first to unlock candidates"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 933,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 928,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: `grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar ${verificationStep !== "verified" ? "opacity-50 pointer-events-none" : ""}`,
										children: matchCandidates.map((c, idx) => {
											const isSelected = selectedCandidate === c.name;
											return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												onClick: () => {
													if (verificationStep === "verified") setSelectedCandidate(c.name);
												},
												className: `p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${isSelected ? "bg-amber-400/20 border-amber-400 shadow-lg shadow-amber-400/10" : "bg-[#141029]/80 border-[#2e2554] hover:border-gray-500 hover:bg-[#181335]"}`,
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-black shrink-0",
														style: { backgroundColor: c.teamColor || "#00f0ff" },
														children: ["#", c.number || idx + 1]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 962,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "text-xs font-black text-white block truncate",
															children: c.name
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 969,
															columnNumber: 29
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "text-[10px] text-gray-400 block truncate",
															children: [
																c.position || "FWD",
																" • ",
																c.teamName
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 972,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 968,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 961,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: `w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-amber-400 bg-amber-400 text-black" : "border-gray-600"}`,
													children: isSelected && /* @__PURE__ */ (void 0)("span", {
														className: "text-[10px] font-black",
														children: "✓"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 985,
														columnNumber: 42
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 978,
													columnNumber: 25
												}, this)]
											}, idx, true, {
												fileName: _jsxFileName,
												lineNumber: 948,
												columnNumber: 23
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 940,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 927,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "submit",
									disabled: verificationStep !== "verified" || !selectedCandidate || hasAlreadyVoted || !currentPoll.isOpen,
									className: "w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Vote, { className: "w-4 h-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1004,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: hasAlreadyVoted ? "Ballot Already Cast for This Match (1 Allowed)" : verificationStep !== "verified" ? "Verify School Email to Cast Ballot" : !selectedCandidate ? "Select Player Candidate Above" : "Submit Official MVP Vote (1 Vote Allowed)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1005,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 994,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 742,
							columnNumber: 13
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-6 bg-[#141029] rounded-2xl border border-rose-500/30 text-center space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "w-8 h-8 text-rose-400 mx-auto" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1018,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "text-sm font-black text-white uppercase",
									children: "Voting Has Concluded"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1019,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-gray-400 max-w-md mx-auto",
									children: "The ballot box for this match is locked. The final winner has been certified below."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1020,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1017,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "pt-3 border-t border-[#2e2554] space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[11px] font-black uppercase text-gray-400 block",
								children: "Live Vote Distribution"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1028,
								columnNumber: 13
							}, this), sortedVoteTally.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-gray-500 italic py-2",
								children: "No votes recorded yet for this fixture."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1033,
								columnNumber: 15
							}, this) : sortedVoteTally.map((item, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-white flex items-center gap-1.5",
										children: [
											idx === 0 && /* @__PURE__ */ (void 0)(Crown, { className: "w-3.5 h-3.5 text-amber-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1041,
												columnNumber: 37
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: item.name }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1042,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-gray-400 font-normal",
												children: [
													"(",
													item.teamName,
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1043,
												columnNumber: 23
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1040,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-mono text-gray-300",
										children: [
											item.votesCount,
											" ",
											item.votesCount === 1 ? "vote" : "votes",
											" (",
											item.percentage,
											"%)"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1047,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1039,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-full bg-[#141029] h-2 rounded-full overflow-hidden border border-[#2e2554]",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: `h-full rounded-full transition-all duration-500 ${idx === 0 ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-gradient-to-r from-cyan-400 to-blue-500"}`,
										style: { width: `${item.percentage}%` }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1053,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1052,
									columnNumber: 19
								}, this)]
							}, idx, true, {
								fileName: _jsxFileName,
								lineNumber: 1038,
								columnNumber: 17
							}, this))]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1027,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 712,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-5 space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-gradient-to-br from-[#18113c] via-[#100c2a] to-[#0a071d] border-2 border-amber-400/40 p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1072,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-3 h-3 text-amber-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1076,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: currentPoll.isOpen ? "Current Poll Leader" : "Official Match MVP Winner" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1077,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1075,
									columnNumber: 15
								}, this), leadingCandidate && /* @__PURE__ */ (void 0)("span", {
									className: "text-xs font-mono font-bold text-[#00f0ff]",
									children: [leadingCandidate.percentage, "% of Ballots"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1083,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1074,
								columnNumber: 13
							}, this),
							leadingCandidate ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-center space-y-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "relative inline-block",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 mx-auto shadow-2xl shadow-amber-500/30",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "w-full h-full bg-[#0e0a26] rounded-[22px] flex items-center justify-center overflow-hidden",
												children: leadingCandidate.playerPhoto ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
													src: leadingCandidate.playerPhoto,
													alt: leadingCandidate.name,
													className: "w-full h-full object-cover"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1095,
													columnNumber: 25
												}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Award, { className: "w-12 h-12 text-amber-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1101,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1093,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1092,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase shadow-md flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Crown, { className: "w-3 h-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1106,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "#1 MVP" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1107,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1105,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1091,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
										className: "text-xl font-black text-white uppercase tracking-wider",
										children: leadingCandidate.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1112,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-amber-300 font-bold",
										children: [
											leadingCandidate.teamName,
											" • #",
											leadingCandidate.number || 10,
											" •",
											" ",
											leadingCandidate.position || "FWD"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1115,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1111,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid grid-cols-2 gap-2 pt-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "p-3 bg-[#141029] rounded-2xl border border-[#2e2554]",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-gray-400 uppercase font-bold block",
												children: "Poll Votes"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1123,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-lg font-black text-white font-mono",
												children: leadingCandidate.votesCount
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1126,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1122,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "p-3 bg-[#141029] rounded-2xl border border-[#2e2554]",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-gray-400 uppercase font-bold block",
												children: "Vote Share"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1131,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-lg font-black text-[#00f0ff] font-mono",
												children: [leadingCandidate.percentage, "%"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1134,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1130,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1121,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1090,
								columnNumber: 15
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-center py-10 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Award, { className: "w-12 h-12 text-gray-600 mx-auto" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1142,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
										className: "text-sm font-bold text-gray-400 uppercase",
										children: "Awaiting First Ballot"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1143,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-gray-500",
										children: "Verify your school email and cast the opening vote for this match."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1144,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1141,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1070,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1069,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 710,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						className: "font-header text-base font-black text-white uppercase flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1158,
							columnNumber: 15
						}, this), "Official MVP Hall of Fame • Cumulative Winners Records Table"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1157,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-gray-400 mt-0.5",
						children: "Certified matchweek winners remain permanently preserved in this records table even when individual match voting logs are cleared."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1161,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1156,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30",
						children: [mvpHistory.length, " Certified Champions"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1167,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1155,
					columnNumber: 9
				}, this), mvpHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-gray-500 italic py-4 text-center",
					children: "No MVP champions certified yet. Once a matchweek poll concludes, the winner will be archived here."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1173,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
						className: "w-full text-xs text-left",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
							className: "border-b border-[#2e2554] text-[10px] uppercase font-bold text-gray-400 bg-[#141029]/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "MW"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1182,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "MVP Champion"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1183,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "Club"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1184,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3 text-center",
									children: "Ballots Won"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1185,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3 text-center",
									children: "Vote Share"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1186,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
									className: "py-2.5 px-3",
									children: "Certified On"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1187,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1181,
							columnNumber: 17
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1180,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
							className: "divide-y divide-[#1e1742]",
							children: mvpHistory.map((w) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
								className: "hover:bg-white/5 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 font-mono font-black text-cyan-300",
										children: ["MW ", w.matchweek]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1193,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0",
												children: "👑"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1198,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-black text-white block",
												children: w.winnerName
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1202,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-gray-400 font-mono",
												children: w.fixtureTitle
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1203,
												columnNumber: 27
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1201,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1197,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1196,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 font-semibold text-gray-200",
										children: w.teamName
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1209,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 text-center font-mono font-bold text-emerald-400",
										children: [
											w.votesCount,
											" / ",
											w.totalBallotsCast
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1210,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 text-center font-mono font-black text-amber-300",
										children: [w.votePercentage, "%"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1213,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "py-3 px-3 text-gray-400 font-mono text-[11px]",
										children: w.certifiedAt
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1216,
										columnNumber: 21
									}, this)
								]
							}, w.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1192,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1190,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1179,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1178,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1154,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 528,
		columnNumber: 5
	}, this);
}
//#endregion
export { OFFICIAL_CLUBS_DATA as a, MatchMvpVoting as i, DEFAULT_FIXTURES as n, isTeamDeleted as o, DEFAULT_TEAMS as r, AdminVotingVoterAudit as t };
