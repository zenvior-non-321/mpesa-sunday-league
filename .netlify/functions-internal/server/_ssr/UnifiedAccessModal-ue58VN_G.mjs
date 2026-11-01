import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { Gt as ArrowRight, Q as Lock, _t as EyeOff, gt as Eye, it as KeyRound, jt as CircleAlert, t as X, x as Shield } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as authenticateWithRbac } from "./rbacSystem-BzvRxIUR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/UnifiedAccessModal-ue58VN_G.js
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
			setError("Please enter your assigned confidential Access Code.");
			return;
		}
		if (cleaned.includes("@")) {
			setError("Council login is strictly via confidential Access Code only. Email is not required or accepted here (email is exclusively reserved for Student MVP Voting).");
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
		setError(result.error || "Invalid access code. Please verify your confidential Council or Admin access credential.");
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
						lineNumber: 86,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "w-6 h-6" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30",
							children: "Council & Admin Gateway • Code Only"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 95,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						className: "font-header text-xl font-black text-white uppercase tracking-wide mt-0.5",
						children: "Portal Access Gateway"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 99,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 93,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 89,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-gray-300 leading-relaxed",
					children: [
						"Sign in exclusively with your confidential ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Council Access Code" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 106,
							columnNumber: 54
						}, this),
						" or",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Super Admin Passcode" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 11
						}, this),
						". No email is required for Council or Admin access (student email verification is strictly reserved for MVP Voting)."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "block text-gray-400 font-bold uppercase text-[10px] mb-1.5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Confidential Access Code" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 114,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-gray-400 font-mono flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "w-3 h-3 text-emerald-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 116,
									columnNumber: 17
								}, this), "Code-Only RBAC Gate"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 115,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 113,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: showPassword ? "text" : "password",
								autoFocus: true,
								value: accessCredential,
								onChange: (e) => {
									setAccessCredential(e.target.value);
									if (error) setError(null);
								},
								placeholder: "Enter authorization passkey",
								className: "w-full bg-[#161033] border border-[#3b2d6e] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl px-4 py-3 text-sm font-mono text-white outline-none pr-12 transition"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 121,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition cursor-pointer",
								title: showPassword ? "Hide code" : "Show code",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 33
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 66
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 120,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 11
						}, this),
						error && /* @__PURE__ */ (void 0)("div", {
							className: "p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in",
							children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 145,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("span", { children: error }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 146,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: onClose,
								className: "flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 151,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: "flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Authenticate" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 163,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 164,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 150,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 111,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-2 border-t border-[#261f4d] flex items-center justify-between text-[11px] text-gray-400 font-mono",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-1.5 text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 13
						}, this), "Zero Code Leakage"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 170,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Official M-Pesa League" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 174,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 169,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 80,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 79,
		columnNumber: 5
	}, this);
}
//#endregion
export { saveAudioFileToVault as a, getAudioVaultMetadata as i, deleteAudioFromVault as n, getAudioVaultBlobUrl as r, UnifiedAccessModal as t };
