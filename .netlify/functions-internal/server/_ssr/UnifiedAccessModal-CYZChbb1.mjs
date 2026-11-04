import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { Lt as CircleAlert, St as EyeOff, Zt as ArrowRight, et as Lock, jt as Compass, n as X, o as Users, w as ShieldCheck, xt as Eye } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as authenticateWithRbac } from "./rbacSystem-BzvRxIUR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/UnifiedAccessModal-CYZChbb1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/**
* Universal Anthem Audio Vault for M-Pesa Sunday League
* Persists audio blobs in browser IndexedDB (supporting large audio files up to 100MB+)
* with seamless cross-device fallbacks, base64 metadata, and universal HTML5 Audio playback.
*/
var DB_NAME = "mpesa_audio_vault_db";
var DB_VERSION = 1;
var STORE_NAME = "audio_tracks";
var PRIMARY_TRACK_KEY = "official_league_anthem";
function openAudioDB() {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined" || !window.indexedDB) {
			reject(/* @__PURE__ */ new Error("IndexedDB is not supported in this environment"));
			return;
		}
		const request = window.indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
/**
* Save an uploaded audio file into IndexedDB and save metadata to localStorage
*/
async function saveAudioFileToVault(file, title, artist) {
	const db = await openAudioDB();
	const arrayBuffer = await file.arrayBuffer();
	const blob = new Blob([arrayBuffer], { type: file.type || "audio/mpeg" });
	const metadata = {
		id: PRIMARY_TRACK_KEY,
		title: title || file.name.replace(/\.[^/.]+$/, ""),
		artist: artist || "M-Pesa Sunday League Official Brass & Choir",
		fileName: file.name,
		fileSize: file.size,
		mimeType: file.type || "audio/mpeg",
		uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source: "indexeddb_blob"
	};
	return new Promise((resolve, reject) => {
		const putRequest = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(blob, PRIMARY_TRACK_KEY);
		putRequest.onsuccess = () => {
			try {
				localStorage.setItem("mpesa_pes_anthem_v6", JSON.stringify(metadata));
				localStorage.setItem("mpesa_pes_anthem_v3", JSON.stringify({
					title: metadata.title,
					artist: metadata.artist,
					source: "vault",
					autoPlay: false,
					updatedAt: metadata.uploadedAt
				}));
				window.dispatchEvent(new CustomEvent("mpesa_anthem_changed", { detail: metadata }));
				window.dispatchEvent(new Event("storage"));
			} catch {}
			resolve(metadata);
		};
		putRequest.onerror = () => reject(putRequest.error);
	});
}
/**
* Retrieve the audio blob from IndexedDB as an Object URL for playback
*/
async function getAudioVaultBlobUrl() {
	try {
		const db = await openAudioDB();
		return new Promise((resolve) => {
			const getRequest = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(PRIMARY_TRACK_KEY);
			getRequest.onsuccess = () => {
				const result = getRequest.result;
				if (result instanceof Blob) resolve(URL.createObjectURL(result));
				else resolve(null);
			};
			getRequest.onerror = () => resolve(null);
		});
	} catch {
		return null;
	}
}
/**
* Read current anthem metadata from localStorage or fallback
*/
function getAudioVaultMetadata() {
	if (typeof window === "undefined") return null;
	try {
		const stored = localStorage.getItem("mpesa_pes_anthem_v6");
		if (stored) return JSON.parse(stored);
	} catch {}
	return null;
}
/**
* Delete anthem permanently from IndexedDB and localStorage
*/
async function deleteAudioFromVault() {
	try {
		const db = await openAudioDB();
		await new Promise((resolve, reject) => {
			const delRequest = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(PRIMARY_TRACK_KEY);
			delRequest.onsuccess = () => resolve();
			delRequest.onerror = () => reject(delRequest.error);
		});
		localStorage.removeItem("mpesa_pes_anthem_v6");
		localStorage.removeItem("mpesa_pes_anthem_v3");
		window.dispatchEvent(new CustomEvent("mpesa_anthem_changed", { detail: null }));
		window.dispatchEvent(new Event("storage"));
		return true;
	} catch {
		return false;
	}
}
var _jsxFileName = "/app/applet/src/components/UnifiedAccessModal.tsx";
function UnifiedAccessModal({ isOpen, onClose, onSuccess }) {
	const { switchRole } = useRoleAccess();
	const [activeTab, setActiveTab] = (0, import_react.useState)("staff");
	const [selectedOffice, setSelectedOffice] = (0, import_react.useState)("executive");
	const [accessCredential, setAccessCredential] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const handleSubmit = (e) => {
		e.preventDefault();
		setError(null);
		const cleaned = accessCredential.trim();
		if (!cleaned) {
			setError("Please enter your assigned authorization passkey.");
			return;
		}
		setIsSubmitting(true);
		const result = authenticateWithRbac(cleaned);
		if (result.success && result.user) {
			const user = result.user;
			switchRole(user.leagueRole);
			if (onSuccess) onSuccess(user.leagueRole, user.role === "admin" ? "admin" : user.role === "board" ? "board" : "viewer", user.displayName);
			setAccessCredential("");
			setIsSubmitting(false);
			onClose();
			return;
		}
		setIsSubmitting(false);
		setError(result.error || "Invalid authorization credentials. Please verify your confidential passkey or contact the League Operations Secretariat.");
	};
	const handleSpectatorEnter = () => {
		switchRole("GUEST");
		if (onSuccess) onSuccess("GUEST", "viewer", "Spectator / Student");
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "bg-[#0e0927] border border-[#3b2d6e] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: onClose,
					className: "absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "w-5 h-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3.5 border-b border-[#261e4f] pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: "/mpesa-academy-logo.svg",
						alt: "M-Pesa Foundation Academy Crest",
						className: "w-12 h-12 object-contain shrink-0 drop-shadow-md"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] font-bold uppercase tracking-wider text-emerald-400 block",
							children: "M-Pesa Foundation Academy"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-header text-lg font-black text-white uppercase tracking-wide",
							children: "League Management Portal"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 106,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] text-gray-400",
							children: "Official Sports Management & Records Gateway"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 109,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 96,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-1.5 p-1 bg-[#140f35] rounded-2xl border border-[#2e2554]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => {
							setActiveTab("staff");
							setError(null);
						},
						className: `py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${activeTab === "staff" ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md shadow-amber-400/20" : "text-gray-400 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Staff Sign-In" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 117,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => {
							setActiveTab("spectator");
							setError(null);
						},
						className: `py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${activeTab === "spectator" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20" : "text-gray-400 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Compass, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Public Spectator" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 146,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 133,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 116,
					columnNumber: 9
				}, this),
				activeTab === "staff" && /* @__PURE__ */ (void 0)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
							className: "block text-gray-400 font-bold uppercase text-[10px] mb-1.5",
							children: "Authorized Department / Office"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 154,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("select", {
							value: selectedOffice,
							onChange: (e) => setSelectedOffice(e.target.value),
							className: "w-full bg-[#161033] border border-[#3b2d6e] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400",
							children: [
								/* @__PURE__ */ (void 0)("option", {
									value: "executive",
									children: "Executive Council & League Administration"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("option", {
									value: "referees",
									children: "Match Officiating & Referee Bench"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 163,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("option", {
									value: "technical",
									children: "Technical Bench & Pia Coaches"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 164,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("option", {
									value: "records",
									children: "Records & Disciplinary Desk"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 165,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 157,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 153,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
							className: "block text-gray-400 font-bold uppercase text-[10px] mb-1.5 flex items-center justify-between",
							children: [/* @__PURE__ */ (void 0)("span", { children: "Confidential Authorization Passkey" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] text-emerald-400 flex items-center gap-1 font-mono",
								children: [/* @__PURE__ */ (void 0)(ShieldCheck, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 19
								}, this), "Protected Gateway"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 170,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (void 0)("input", {
								type: showPassword ? "text" : "password",
								autoFocus: true,
								value: accessCredential,
								onChange: (e) => {
									setAccessCredential(e.target.value);
									if (error) setError(null);
								},
								placeholder: "Enter your authorization passkey",
								className: "w-full bg-[#161033] border border-[#3b2d6e] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl px-4 py-3 text-sm text-white outline-none pr-12 transition"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 179,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition cursor-pointer",
								title: showPassword ? "Hide passkey" : "Show passkey",
								children: showPassword ? /* @__PURE__ */ (void 0)(EyeOff, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 196,
									columnNumber: 35
								}, this) : /* @__PURE__ */ (void 0)(Eye, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 196,
									columnNumber: 68
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 190,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 178,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 169,
							columnNumber: 13
						}, this),
						error && /* @__PURE__ */ (void 0)("div", {
							className: "p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in",
							children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 203,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", { children: error }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 204,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 202,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2 pt-2",
							children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: onClose,
								className: "flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 209,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: "flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50",
								children: [/* @__PURE__ */ (void 0)("span", { children: "Authorize & Sign In" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 221,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 222,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 216,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 208,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 152,
					columnNumber: 11
				}, this),
				activeTab === "spectator" && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-4 py-2",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "p-4 bg-cyan-950/20 border border-cyan-400/30 rounded-2xl space-y-2 text-center",
						children: [
							/* @__PURE__ */ (void 0)(Users, { className: "w-8 h-8 text-cyan-400 mx-auto" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 232,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("h4", {
								className: "text-white font-bold text-sm uppercase",
								children: "Open Spectator & Student Viewer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-gray-300 leading-relaxed",
								children: "Explore real-time match schedules, certified league standings, live scorecards, match highlight reels, and the official Golden Boot race."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 236,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 231,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("button", {
						type: "button",
						onClick: handleSpectatorEnter,
						className: "w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (void 0)("span", { children: "Continue as Spectator" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 246,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 247,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 241,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 230,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-3 border-t border-[#261f4d] flex items-center justify-between text-[11px] text-gray-400",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-1.5 text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 255,
							columnNumber: 13
						}, this), "Zero Code Exposure Policy"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 254,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Verified League Registry" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 258,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 253,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 85,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 84,
		columnNumber: 5
	}, this);
}
//#endregion
export { saveAudioFileToVault as a, getAudioVaultMetadata as i, deleteAudioFromVault as n, getAudioVaultBlobUrl as r, UnifiedAccessModal as t };
