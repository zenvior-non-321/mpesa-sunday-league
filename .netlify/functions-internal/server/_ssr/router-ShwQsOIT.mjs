import { o as __toESM } from "../_runtime.mjs";
import { r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { Bt as Briefcase, E as Send, H as PanelLeft, Ht as Award, It as Camera, K as MessageSquare, Kt as Activity, Lt as Calendar, Ot as CircleCheck, P as Radio, R as Play, Rt as CalendarDays, T as Settings, U as PanelLeftClose, V as Pause, Vt as BookOpen, W as Music, Y as LogOut, a as Users, bt as Database, dt as FileText, i as Volume2, l as Trophy, n as Vote, nt as KeyRound, ot as Globe, pt as FileCheckCorner, r as VolumeX, t as X, tt as Layers, ut as Flag, x as Shield, xt as Crown } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { s as getCurrentRbacUser, u as logoutRbacUser } from "./rbacSystem-BzvRxIUR.mjs";
import { t as UnifiedAccessModal } from "./UnifiedAccessModal-BCyTMQ5z.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$16 } from "./mvp-voting-BtEhruck.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-ShwQsOIT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-CQjgYnLY.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	const message = describeThrown(error);
	if (message === "Script error." || message.includes("Script error")) return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var _jsxFileName$2 = "/app/applet/src/components/AnthemPlayerWidget.tsx";
var DEFAULT_ANTHEM = {
	title: "M-Pesa Sunday League Official Stadium Anthem",
	artist: "eFootball Championship Edition",
	youtubeId: "2yJgwwDcgV8",
	volume: .65,
	mode: "audio"
};
function AnthemPlayerWidget({ isCompact = false }) {
	const { isSuperAdmin, currentRole } = useRoleAccess();
	const canManageAnthem = isSuperAdmin || currentRole === "TECH_MANAGER" || currentRole === "ASST_TECH_MANAGER" || currentRole === "PRESIDENT";
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [volume, setVolume] = (0, import_react.useState)(.65);
	const [isMuted, setIsMuted] = (0, import_react.useState)(false);
	const [config, setConfig] = (0, import_react.useState)(DEFAULT_ANTHEM);
	const [showSettingsModal, setShowSettingsModal] = (0, import_react.useState)(false);
	const [editTitle, setEditTitle] = (0, import_react.useState)(DEFAULT_ANTHEM.title);
	const [editYoutubeId, setEditYoutubeId] = (0, import_react.useState)(DEFAULT_ANTHEM.youtubeId);
	const audioCtxRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const syncAnthemConfig = () => {
			try {
				const stored = localStorage.getItem("mpesa_pes_anthem_v3");
				if (stored) {
					const parsed = JSON.parse(stored);
					setConfig(parsed);
					setEditTitle(parsed.title || DEFAULT_ANTHEM.title);
					setEditYoutubeId(parsed.youtubeId || DEFAULT_ANTHEM.youtubeId);
					if (parsed.autoPlay && !isPlaying) {
						const handleFirstInteraction = () => {
							setIsPlaying(true);
							startSynthAnthem();
							if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.play(parsed.youtubeId || DEFAULT_ANTHEM.youtubeId);
							window.removeEventListener("click", handleFirstInteraction);
							window.removeEventListener("keydown", handleFirstInteraction);
						};
						window.addEventListener("click", handleFirstInteraction, { once: true });
						window.addEventListener("keydown", handleFirstInteraction, { once: true });
					}
				}
			} catch {}
		};
		syncAnthemConfig();
		window.addEventListener("storage", syncAnthemConfig);
		window.addEventListener("mpesa_anthem_changed", syncAnthemConfig);
		return () => {
			window.removeEventListener("storage", syncAnthemConfig);
			window.removeEventListener("mpesa_anthem_changed", syncAnthemConfig);
		};
	}, []);
	const startSynthAnthem = () => {
		if (typeof window === "undefined") return;
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
			if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
			const ctx = audioCtxRef.current;
			const notes = [
				261.63,
				329.63,
				392,
				523.25,
				440,
				392,
				329.63,
				523.25
			];
			let step = 0;
			const playNextTone = () => {
				if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "triangle";
				osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);
				const currentVol = isMuted ? 0 : volume * .18;
				gain.gain.setValueAtTime(currentVol, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .38);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + .4);
				if (step % 2 === 0) {
					const kickOsc = ctx.createOscillator();
					const kickGain = ctx.createGain();
					kickOsc.frequency.setValueAtTime(110, ctx.currentTime);
					kickOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + .18);
					kickGain.gain.setValueAtTime(currentVol * 1.5, ctx.currentTime);
					kickGain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .2);
					kickOsc.connect(kickGain);
					kickGain.connect(ctx.destination);
					kickOsc.start();
					kickOsc.stop(ctx.currentTime + .22);
				}
				step++;
			};
			playNextTone();
			timerRef.current = window.setInterval(playNextTone, 420);
		} catch {}
	};
	const stopSynthAnthem = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		if (audioCtxRef.current && audioCtxRef.current.state !== "closed") audioCtxRef.current.suspend().catch(() => {});
	};
	const togglePlay = () => {
		if (isPlaying) {
			stopSynthAnthem();
			setIsPlaying(false);
			if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.pause();
		} else {
			setIsPlaying(true);
			startSynthAnthem();
			if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.play(config.youtubeId);
		}
	};
	const handleVolumeChange = (newVal) => {
		setVolume(newVal);
		if (newVal === 0) setIsMuted(true);
		else setIsMuted(false);
		if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.setVolume(newVal);
	};
	const toggleMute = () => {
		setIsMuted(!isMuted);
		if (!isMuted) {
			if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.setVolume(0);
		} else if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.setVolume(volume);
	};
	const handleSaveSettings = (e) => {
		e.preventDefault();
		const updated = {
			...config,
			title: editTitle.trim() || DEFAULT_ANTHEM.title,
			youtubeId: editYoutubeId.trim() || DEFAULT_ANTHEM.youtubeId
		};
		setConfig(updated);
		try {
			localStorage.setItem("mpesa_pes_anthem_v3", JSON.stringify(updated));
			window.dispatchEvent(new CustomEvent("mpesa_anthem_changed"));
		} catch {}
		setShowSettingsModal(false);
	};
	if (isCompact) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "bg-[#120d2e] border border-cyan-400/30 rounded-2xl p-3 shadow-xl space-y-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: `w-6 h-6 rounded-lg flex items-center justify-center ${isPlaying ? "bg-[#00f0ff] text-black animate-pulse" : "bg-white/10 text-cyan-400"}`,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Music, { className: "w-3.5 h-3.5" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 259,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 256,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[10px] font-black uppercase text-white block truncate",
						children: "Stadium Anthem"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 262,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[9px] text-[#00f0ff] font-mono block",
						children: isPlaying ? "Broadcasting Live" : "Soundtrack Paused"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 265,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 261,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 255,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				onClick: togglePlay,
				className: `w-7 h-7 rounded-xl flex items-center justify-center transition cursor-pointer shadow-md ${isPlaying ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-gradient-to-r from-[#00f0ff] to-emerald-400 hover:brightness-110 text-black font-black"}`,
				title: isPlaying ? "Pause Anthem" : "Play Anthem",
				children: isPlaying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pause, { className: "w-3.5 h-3.5" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 282,
					columnNumber: 15
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { className: "w-3.5 h-3.5 ml-0.5" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 284,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 271,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 254,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between gap-2 pt-1 border-t border-white/10",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: toggleMute,
					className: "text-gray-400 hover:text-white",
					title: isMuted ? "Unmute" : "Mute",
					children: isMuted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { className: "w-3.5 h-3.5 text-rose-400" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 298,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "w-3.5 h-3.5 text-cyan-300" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 300,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 291,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "range",
					min: 0,
					max: 1,
					step: .05,
					value: isMuted ? 0 : volume,
					onChange: (e) => handleVolumeChange(Number(e.target.value)),
					className: "w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 304,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-end gap-0.5 h-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-[#00f0ff] rounded-t ${isPlaying ? "h-3 animate-bounce" : "h-1"}` }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 316,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-emerald-400 rounded-t ${isPlaying ? "h-2 animate-pulse" : "h-1"}` }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 319,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-pink-400 rounded-t ${isPlaying ? "h-3.5 animate-bounce" : "h-1"}` }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 322,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 315,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 290,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 253,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "bg-gradient-to-r from-[#140e2f] via-[#1c1445] to-[#120d2e] border-2 border-cyan-400/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-0 right-0 w-44 h-44 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" }, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 335,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition ${isPlaying ? "bg-gradient-to-tr from-[#00f0ff] to-emerald-400 text-black shadow-cyan-500/30 animate-pulse" : "bg-[#0b081e] text-[#00f0ff] border border-cyan-400/30"}`,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Music, { className: "w-6 h-6" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 346,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 339,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-400/20 text-[#00f0ff] border border-cyan-400/30 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Radio, { className: "w-3 h-3 text-[#00f0ff]" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 352,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Official League Soundtrack" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 353,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 351,
								columnNumber: 15
							}, this), isPlaying && /* @__PURE__ */ (void 0)("span", {
								className: "text-[9px] font-black text-emerald-400 font-mono animate-pulse",
								children: "● LIVE BROADCAST"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 356,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 350,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-header text-lg font-black text-white uppercase mt-0.5",
							children: config.title
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 362,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-gray-400 font-mono",
							children: [config.artist, " • Stadium Fanfare Broadcast"]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 365,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 349,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 338,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto",
					children: [canManageAnthem && /* @__PURE__ */ (void 0)("button", {
						type: "button",
						onClick: () => setShowSettingsModal(true),
						className: "p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition",
						title: "Anthem Settings",
						children: /* @__PURE__ */ (void 0)(Settings, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 379,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 373,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: togglePlay,
						className: `flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg ${isPlaying ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25" : "bg-gradient-to-r from-[#00f0ff] to-emerald-400 hover:brightness-110 text-black shadow-cyan-500/25"}`,
						children: isPlaying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pause, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 394,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Pause Anthem" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 395,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 393,
							columnNumber: 15
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { className: "w-4 h-4 ml-0.5" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 399,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Play Anthem" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 400,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 398,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 383,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 371,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 337,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a071c] p-3 rounded-2xl border border-white/5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: toggleMute,
						className: "text-gray-400 hover:text-white p-1 rounded hover:bg-white/5",
						title: isMuted ? "Unmute" : "Mute",
						children: isMuted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { className: "w-4 h-4 text-rose-400" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 417,
							columnNumber: 15
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "w-4 h-4 text-cyan-300" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 419,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 410,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-gray-400 font-mono uppercase",
								children: "Vol:"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 424,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .05,
								value: isMuted ? 0 : volume,
								onChange: (e) => handleVolumeChange(Number(e.target.value)),
								className: "w-28 sm:w-36 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 425,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-cyan-300 font-mono",
								children: [Math.round((isMuted ? 0 : volume) * 100), "%"]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 434,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 423,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 409,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[10px] text-gray-400 font-mono hidden sm:inline",
						children: "Stadium Acoustics:"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 442,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-end gap-1 h-4 bg-black/40 px-2 py-1 rounded-lg border border-white/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-[#00f0ff] rounded-t transition-all ${isPlaying ? "h-3 animate-bounce" : "h-1"}` }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 446,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-emerald-400 rounded-t transition-all ${isPlaying ? "h-4 animate-pulse" : "h-1"}` }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 449,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-amber-400 rounded-t transition-all ${isPlaying ? "h-2.5 animate-bounce" : "h-1"}` }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 452,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-pink-400 rounded-t transition-all ${isPlaying ? "h-3.5 animate-pulse" : "h-1"}` }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 455,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `w-1 bg-cyan-300 rounded-t transition-all ${isPlaying ? "h-2 animate-bounce" : "h-1"}` }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 458,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 445,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 441,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 408,
				columnNumber: 7
			}, this),
			showSettingsModal && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0e0a26] border-2 border-cyan-400/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between border-b border-[#2e2554] pb-3",
						children: [/* @__PURE__ */ (void 0)("h4", {
							className: "text-base font-black text-white uppercase flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(Settings, { className: "w-4 h-4 text-cyan-400" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 471,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", { children: "Configure Stadium Anthem" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 472,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 470,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setShowSettingsModal(false),
							className: "text-gray-400 hover:text-white",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 479,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 474,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 469,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("form", {
						onSubmit: handleSaveSettings,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "Anthem Display Title"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 485,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								required: true,
								value: editTitle,
								onChange: (e) => setEditTitle(e.target.value),
								className: "w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 488,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 484,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "YouTube Video ID (Optional for YouTube Mode)"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 498,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								placeholder: "e.g. 2yJgwwDcgV8",
								value: editYoutubeId,
								onChange: (e) => setEditYoutubeId(e.target.value),
								className: "w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 outline-none"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 501,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 497,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center justify-end gap-2 pt-2 border-t border-[#2e2554]",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setShowSettingsModal(false),
									className: "px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold",
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 511,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									className: "px-5 py-2 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs uppercase transition shadow-md shadow-cyan-500/20 cursor-pointer",
									children: "Save Soundtrack"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 518,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 510,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 483,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 468,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 467,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 333,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/PermanentSidebarLayout.tsx";
function PermanentSidebarLayout({ children }) {
	const router = useRouter();
	const currentPath = useRouterState().location.pathname;
	const { currentRole, isSuperAdmin, switchRole } = useRoleAccess();
	const isLoggedIn = currentRole !== "GUEST";
	const [isSidebarOpen, setIsSidebarOpen] = (0, import_react.useState)(true);
	const [showOfficialsModal, setShowOfficialsModal] = (0, import_react.useState)(false);
	const [showAccessModal, setShowAccessModal] = (0, import_react.useState)(false);
	const [officialsList, setOfficialsList] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			setIsSidebarOpen(window.innerWidth >= 1024);
			if (window.leagueOfficials) setOfficialsList(window.leagueOfficials);
			else setOfficialsList([
				{
					name: "Alex Haro",
					role: "1. President",
					responsibilities: [
						"Provides overall leadership and executive direction for the league.",
						"Oversees the work of the administrative crew and ensures rules are followed.",
						"Leads meetings and helps resolve major disputes."
					]
				},
				{
					name: "Babra Nandako",
					role: "2. Deputy President",
					responsibilities: [
						"Assists the President in managing league activities.",
						"Acts on behalf of the President when necessary.",
						"Monitors the progress of different departments."
					]
				},
				{
					name: "Whitney Juma",
					role: "3. Register and Regulations Manager",
					responsibilities: [
						"Maintains accurate records of registered clubs, players, coaches, and managers.",
						"Ensures that registration requirements and league regulations are followed.",
						"Handles eligibility checks and reports violations."
					]
				},
				{
					name: "Idi Sebantu",
					role: "4. Match Officiating Programmes Manager",
					responsibilities: [
						"Organises match officiating schedules and assigns referees to fixtures.",
						"Ensures matches are officiated fairly and impartially.",
						"Coordinates refereeing standards and addresses officiating concerns."
					]
				},
				{
					name: "Tonnie Mark Odundo",
					role: "5. Records and File Manager",
					responsibilities: [
						"Maintains official league documents, reports, fixtures, results, standings, and disciplinary records.",
						"Ensures important league information is properly organised and accessible.",
						"Keeps an accurate record of administrative decisions."
					]
				},
				{
					name: "Victor Kiplagat",
					role: "6. Technological Manager",
					responsibilities: [
						"Oversees the league’s digital platforms, website, and online updates.",
						"Publishes fixtures, results, standings, announcements, and match reports.",
						"Ensures that league information is presented accurately and promptly."
					]
				},
				{
					name: "Sturridge Ochongoi",
					role: "7. Assistant Technological Manager",
					responsibilities: [
						"Supports the Technological Manager in updating and maintaining digital platforms.",
						"Assists in publishing match reports, results, and announcements.",
						"Helps ensure continuity of digital operations."
					]
				},
				{
					name: "Bidan Mwaura",
					role: "Official Match Referee",
					responsibilities: [
						"Presides over official league fixtures and ensures fair play.",
						"Files post-match referee match reports and card sanctions.",
						"Enforces constitutional on-pitch rules and regulations."
					]
				}
			]);
		}
	}, []);
	const publicNavItems = (0, import_react.useMemo)(() => [
		{
			to: "/standings",
			label: "League Table",
			icon: Trophy,
			badge: "Standings",
			badgeColor: "bg-cyan-400/20 text-[#00f0ff] border-cyan-400/30"
		},
		{
			to: "/clubs",
			label: "Teams & Squads",
			icon: Shield,
			badge: "Rosters",
			badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
		},
		{
			to: "/fixtures",
			label: "Fixtures & Scores",
			icon: Calendar,
			badge: "Schedule",
			badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
		},
		{
			to: "/performance",
			label: "Radar Analytics",
			icon: Activity,
			badge: "Tactics",
			badgeColor: "bg-pink-400/20 text-pink-300 border-pink-400/30"
		},
		{
			to: "/calendar",
			label: "Season Calendar",
			icon: CalendarDays,
			badge: "Events",
			badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
		},
		{
			to: "/mvp-voting",
			label: "MVP Balloting",
			icon: Vote,
			badge: "Voting",
			badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
		},
		{
			to: "/community",
			label: "Fan Cheers & Comments",
			icon: MessageSquare,
			badge: "Community",
			badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
		}
	], []);
	const [isMounted, setIsMounted] = (0, import_react.useState)(false);
	const [rbacUser, setRbacUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setIsMounted(true);
		setRbacUser(getCurrentRbacUser());
		const handleRbacUpdate = () => {
			setRbacUser(getCurrentRbacUser());
		};
		window.addEventListener("mpesa_rbac_changed", handleRbacUpdate);
		window.addEventListener("mpesa_role_changed", handleRbacUpdate);
		window.addEventListener("storage", handleRbacUpdate);
		return () => {
			window.removeEventListener("mpesa_rbac_changed", handleRbacUpdate);
			window.removeEventListener("mpesa_role_changed", handleRbacUpdate);
			window.removeEventListener("storage", handleRbacUpdate);
		};
	}, []);
	const [activeAdminSection, setActiveAdminSection] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem("mpesa_admin_active_section") || "board_members";
		return "board_members";
	});
	(0, import_react.useEffect)(() => {
		const handleSection = (e) => {
			const custom = e;
			if (custom.detail) setActiveAdminSection(custom.detail);
		};
		window.addEventListener("mpesa_select_admin_section", handleSection);
		return () => {
			window.removeEventListener("mpesa_select_admin_section", handleSection);
		};
	}, []);
	const activeRbacRole = (0, import_react.useMemo)(() => {
		if (!isMounted) return "public";
		if (isSuperAdmin || rbacUser?.role === "admin") return "admin";
		if (currentRole !== "GUEST" && currentRole || rbacUser?.role === "board") return "board";
		return "public";
	}, [
		isMounted,
		isSuperAdmin,
		currentRole,
		rbacUser
	]);
	const handleNavClick = (item) => {
		if (item.adminSection && typeof window !== "undefined") {
			localStorage.setItem("mpesa_admin_active_section", item.adminSection);
			setActiveAdminSection(item.adminSection);
			window.dispatchEvent(new CustomEvent("mpesa_select_admin_section", { detail: item.adminSection }));
		}
		if (item.boardSubTab && typeof window !== "undefined") {
			localStorage.setItem("mpesa_board_sub_tab", item.boardSubTab);
			window.dispatchEvent(new CustomEvent("mpesa_select_board_sub_tab", { detail: {
				role: item.boardRole || currentRole,
				tab: item.boardSubTab
			} }));
		}
		if (typeof window !== "undefined" && window.innerWidth < 1024) setIsSidebarOpen(false);
	};
	const supremeAdminNavItems = (0, import_react.useMemo)(() => [
		{
			to: "/workspaces",
			adminSection: "board_members",
			label: "Council Board Members",
			subLabel: "Add, Edit, Suspend & RBAC",
			icon: Crown,
			badge: "Officials",
			badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "seasons_leagues",
			label: "Seasons & Rulebook",
			subLabel: "Divisions & Competition Rules",
			icon: BookOpen,
			badge: "Rules",
			badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "teams_clubs",
			label: "Clubs & Squad Rosters",
			subLabel: "15-Player Cap & Transfers",
			icon: Shield,
			badge: "15-Cap",
			badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "fixtures_scores",
			label: "Fixtures & Live Scoring",
			subLabel: "Referees & Score Certification",
			icon: Calendar,
			badge: "Scores",
			badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "standings_ledger",
			label: "Standings & Points Ledger",
			subLabel: "Tiebreakers & Overrides",
			icon: Trophy,
			badge: "Ledger",
			badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "player_stats",
			label: "Golden Boot & Player Stats",
			subLabel: "Goals, Assists & MVP Count",
			icon: Award,
			badge: "Stats",
			badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "broadcasts_alerts",
			label: "Mass Alerts & Broadcasts",
			subLabel: "Instant SMS & Email Blasts",
			icon: Send,
			badge: "SMS/Email",
			badgeColor: "bg-pink-400/20 text-pink-300 border-pink-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "anthem_studio",
			label: "Stadium Soundtrack Studio",
			subLabel: "YouTube Songs & Auto-Play",
			icon: Music,
			badge: "YouTube",
			badgeColor: "bg-red-400/20 text-red-300 border-red-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "fan_comments",
			label: "Fan Cheers & Community",
			subLabel: "Moderation, Pinning & Stadium Cheers",
			icon: MessageSquare,
			badge: "Admin Only",
			badgeColor: "bg-teal-400/20 text-teal-300 border-teal-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "voting_center",
			label: "MVP Balloting Dispatcher",
			subLabel: "Voting Links & Ballot Tallies",
			icon: Vote,
			badge: "Audits",
			badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "media_photos",
			label: "Athlete Photos & Media",
			subLabel: "Direct Upload & Share Links",
			icon: Camera,
			badge: "Uploads",
			badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "decrees_minutes",
			label: "Decrees & Council Minutes",
			subLabel: "Directives & Formal Minutes",
			icon: FileText,
			badge: "Decrees",
			badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
		},
		{
			to: "/workspaces",
			adminSection: "system_backup",
			label: "Database Backup & Audit",
			subLabel: "JSON/CSV Export & Disaster Recovery",
			icon: Database,
			badge: "Backup",
			badgeColor: "bg-violet-400/20 text-violet-300 border-violet-400/30"
		}
	], []);
	const boardRoleNavItems = (0, import_react.useMemo)(() => {
		const roleKey = rbacUser?.leagueRole || currentRole || "PRESIDENT";
		if (roleKey === "PRESIDENT") return [
			{
				to: "/workspaces",
				boardRole: "PRESIDENT",
				boardSubTab: "overview",
				label: "Executive Overview",
				subLabel: "Leadership Decrees & Status",
				icon: Crown,
				badge: "President",
				badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "PRESIDENT",
				boardSubTab: "hearings",
				label: "Dispute & Hearing Center",
				subLabel: "Protests, Appeals & Formal Rulings",
				icon: Award,
				badge: "Hearings",
				badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "PRESIDENT",
				boardSubTab: "policy",
				label: "Policy & Constitution",
				subLabel: "Rulebook Amendments & Conduct",
				icon: BookOpen,
				badge: "By-Laws",
				badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "PRESIDENT",
				boardSubTab: "voting",
				label: "Board Voting & Motions",
				subLabel: "Table Motions, Tallies & Resolutions",
				icon: Vote,
				badge: "Motions",
				badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "PRESIDENT",
				boardSubTab: "approvals",
				label: "Executive Approvals",
				subLabel: "New Club Affiliations & Budgets",
				icon: CircleCheck,
				badge: "Sign-offs",
				badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "PRESIDENT",
				boardSubTab: "meeting",
				label: "Board Meeting Planner",
				subLabel: "Council Agendas & Meeting Schedule",
				icon: CalendarDays,
				badge: "Planner",
				badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
			}
		];
		if (roleKey === "DEPUTY_PRESIDENT") return [
			{
				to: "/workspaces",
				boardRole: "DEPUTY_PRESIDENT",
				boardSubTab: "overview",
				label: "Executive Operations Hub",
				subLabel: "Supervision & Stand-in Powers",
				icon: Shield,
				badge: "Operations",
				badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "DEPUTY_PRESIDENT",
				boardSubTab: "monitoring",
				label: "Department Progress Monitor",
				subLabel: "4 Core Departments Tracking",
				icon: Activity,
				badge: "Progress",
				badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "DEPUTY_PRESIDENT",
				boardSubTab: "acting_override",
				label: "Acting Presidential Override",
				subLabel: "Emergency Stand-in Hearing Desk",
				icon: Crown,
				badge: "Override",
				badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "DEPUTY_PRESIDENT",
				boardSubTab: "task_force",
				label: "Special Task Force Manager",
				subLabel: "Active Inspections & Projects",
				icon: Briefcase,
				badge: "Task Force",
				badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "DEPUTY_PRESIDENT",
				boardSubTab: "escalations",
				label: "Inter-Department Escalations",
				subLabel: "Fast-Track Council Resolutions",
				icon: FileText,
				badge: "Escalate",
				badgeColor: "bg-rose-400/20 text-rose-300 border-rose-400/30"
			}
		];
		if (roleKey === "REGULATIONS_MANAGER") return [
			{
				to: "/workspaces",
				boardRole: "REGULATIONS_MANAGER",
				boardSubTab: "dashboard",
				label: "Registration Dashboard",
				subLabel: "Compliance & Squad Cap Monitor",
				icon: FileText,
				badge: "Registrar",
				badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "REGULATIONS_MANAGER",
				boardSubTab: "licensing",
				label: "Club & Staff Licensing",
				subLabel: "Affiliations & Manager Approvals",
				icon: Shield,
				badge: "Licensing",
				badgeColor: "bg-teal-400/20 text-teal-300 border-teal-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "REGULATIONS_MANAGER",
				boardSubTab: "player_verification",
				label: "Player Verification Desk",
				subLabel: "Digital Passes & School ID Audits",
				icon: Users,
				badge: "Passes",
				badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "REGULATIONS_MANAGER",
				boardSubTab: "eligibility_violations",
				label: "Eligibility & Violations",
				subLabel: "15-Player Cap & Suspensions",
				icon: Award,
				badge: "Audits",
				badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "REGULATIONS_MANAGER",
				boardSubTab: "compliance_waivers",
				label: "Compliance & Waivers",
				subLabel: "Parental Consent & Medical Records",
				icon: FileCheckCorner,
				badge: "Waivers",
				badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
			}
		];
		if (roleKey === "MATCH_OFFICIATING_MANAGER") return [
			{
				to: "/workspaces",
				boardRole: "MATCH_OFFICIATING_MANAGER",
				boardSubTab: "overview",
				label: "Officiating Center Overview",
				subLabel: "Matchday Referee Readiness",
				icon: Flag,
				badge: "Officiating",
				badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "MATCH_OFFICIATING_MANAGER",
				boardSubTab: "scheduler",
				label: "Referee Match Scheduler",
				subLabel: "Quad-Crews & Match Commissioners",
				icon: Calendar,
				badge: "Appointments",
				badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "MATCH_OFFICIATING_MANAGER",
				boardSubTab: "ref_reports",
				label: "Post-Match Referee Reports",
				subLabel: "Scorecard Ratings & Evaluations",
				icon: FileText,
				badge: "Scorecards",
				badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "MATCH_OFFICIATING_MANAGER",
				boardSubTab: "performance",
				label: "Disciplinary Card Hearings",
				subLabel: "Yellow/Red Sanction Reviews",
				icon: Award,
				badge: "Hearings",
				badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "MATCH_OFFICIATING_MANAGER",
				boardSubTab: "disputes",
				label: "Officiating Disputes Desk",
				subLabel: "Club Protests & Fair-Play Arbitrations",
				icon: Shield,
				badge: "Disputes",
				badgeColor: "bg-rose-400/20 text-rose-300 border-rose-400/30"
			}
		];
		if (roleKey === "RECORDS_MANAGER") return [
			{
				to: "/workspaces",
				boardRole: "RECORDS_MANAGER",
				boardSubTab: "vault_home",
				label: "Records & Archives Overview",
				subLabel: "Historical Files & Registry Vault",
				icon: BookOpen,
				badge: "Vault",
				badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "RECORDS_MANAGER",
				boardSubTab: "doc_vault",
				label: "Official Document Vault",
				subLabel: "Constitution, By-Laws & PDF Archive",
				icon: FileText,
				badge: "Documents",
				badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "RECORDS_MANAGER",
				boardSubTab: "results_archive",
				label: "Results & Standings Archive",
				subLabel: "Certify Fixture Scorecards & Points",
				icon: Trophy,
				badge: "Standings",
				badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "RECORDS_MANAGER",
				boardSubTab: "disciplinary_ledger",
				label: "Disciplinary Ledger",
				subLabel: "Historical Card & Incident Registry",
				icon: Award,
				badge: "Ledger",
				badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "RECORDS_MANAGER",
				boardSubTab: "decisions_registry",
				label: "Council Decisions Registry",
				subLabel: "Timestamped Minutes & Decree Vault",
				icon: Database,
				badge: "Minutes",
				badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
			}
		];
		if (roleKey === "TECH_MANAGER") return [
			{
				to: "/workspaces",
				boardRole: "TECH_MANAGER",
				boardSubTab: "tech_overview",
				label: "Tech Operations Overview",
				subLabel: "Digital Platforms & Live Engine",
				icon: Activity,
				badge: "Tech Lead",
				badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "TECH_MANAGER",
				boardSubTab: "website_cms",
				label: "Website CMS & Banners",
				subLabel: "Headline & Multimedia Graphics",
				icon: Globe,
				badge: "CMS",
				badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "TECH_MANAGER",
				boardSubTab: "live_publishing",
				label: "Live Publishing & Scoreboard",
				subLabel: "Pitchside LED Scoreboard Ticker",
				icon: Send,
				badge: "Broadcast",
				badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "TECH_MANAGER",
				boardSubTab: "infrastructure",
				label: "Digital Infrastructure",
				subLabel: "Server Uptime & Diagnostics",
				icon: Database,
				badge: "Uptime",
				badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "TECH_MANAGER",
				boardSubTab: "integrity_audit",
				label: "System Integrity Audits",
				subLabel: "Security Protocols & Data Health",
				icon: Shield,
				badge: "Security",
				badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30"
			}
		];
		return [
			{
				to: "/workspaces",
				boardRole: "ASST_TECH_MANAGER",
				boardSubTab: "support_desk",
				label: "Assistant Tech Support Desk",
				subLabel: "Operations & Queue Overview",
				icon: Layers,
				badge: "Support",
				badgeColor: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "ASST_TECH_MANAGER",
				boardSubTab: "content_queue",
				label: "Content Queue & Previews",
				subLabel: "Match Recaps & Fair Play Notes",
				icon: FileText,
				badge: "Drafts",
				badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "ASST_TECH_MANAGER",
				boardSubTab: "media_library",
				label: "Media Library & Gallery",
				subLabel: "Matchday Highlights & Photo Vault",
				icon: Camera,
				badge: "Media",
				badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "ASST_TECH_MANAGER",
				boardSubTab: "user_support",
				label: "User Helpdesk & Tickets",
				subLabel: "Staff & Referee Tech Support",
				icon: MessageSquare,
				badge: "Helpdesk",
				badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
			},
			{
				to: "/workspaces",
				boardRole: "ASST_TECH_MANAGER",
				boardSubTab: "data_backup",
				label: "Data Backup Assistant",
				subLabel: "Manual JSON & Archive Integrity",
				icon: Database,
				badge: "Backup",
				badgeColor: "bg-blue-400/20 text-blue-300 border-blue-400/30"
			}
		];
	}, [rbacUser, currentRole]);
	const allNavItems = (0, import_react.useMemo)(() => {
		if (activeRbacRole === "admin") return supremeAdminNavItems;
		if (activeRbacRole === "board") return boardRoleNavItems;
		return publicNavItems;
	}, [
		activeRbacRole,
		supremeAdminNavItems,
		boardRoleNavItems,
		publicNavItems
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-[#070512] text-white flex flex-col",
		children: [
			isSidebarOpen && /* @__PURE__ */ (void 0)("div", {
				onClick: () => setIsSidebarOpen(false),
				className: "lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 826,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: `fixed inset-y-0 left-0 z-50 w-80 bg-[#080517] border-r border-[#261f4d] shadow-2xl flex flex-col justify-between p-4 sm:p-5 overflow-y-auto transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between border-b border-[#261f4d] pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/standings",
								className: "flex items-center gap-3 group",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-10 h-10 rounded-2xl bg-white border border-emerald-400 p-1 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: "/mpesa-academy-icon.png",
										alt: "M-Pesa Academy",
										className: "w-full h-full object-contain"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 843,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 842,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-header text-base font-black text-white leading-none uppercase",
									children: "Sunday League"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 850,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider",
									children: "Official eFootball"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 853,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 849,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 841,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setIsSidebarOpen(false),
								title: "Hide Sidebar",
								className: "text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PanelLeftClose, { className: "w-5 h-5 text-[#00f0ff]" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 864,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 859,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 840,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "px-2 pb-1 flex items-center justify-between border-b border-[#1b153b]",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] uppercase font-black tracking-wider flex items-center gap-1.5 text-amber-300",
										children: [
											activeRbacRole === "admin" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Crown, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 874,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Supreme Admin Hub" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 875,
												columnNumber: 21
											}, this)] }, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 873,
												columnNumber: 19
											}, this),
											activeRbacRole === "board" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Briefcase, { className: "w-3.5 h-3.5 text-indigo-400 shrink-0" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 880,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Council Workspace" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 881,
												columnNumber: 21
											}, this)] }, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 879,
												columnNumber: 19
											}, this),
											activeRbacRole === "public" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Trophy, { className: "w-3.5 h-3.5 text-cyan-400 shrink-0" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 886,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("span", { children: "Public Spectator Suite" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 887,
												columnNumber: 21
											}, this)] }, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 885,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 871,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#141029] text-gray-400 border border-[#2e2554]",
										children: activeRbacRole === "admin" ? "13 Modules" : activeRbacRole === "board" ? "Executive" : "View Only"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 891,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 870,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1 max-h-[50vh] lg:max-h-[54vh] overflow-y-auto pr-1",
									children: allNavItems.map((item, index) => {
										const Icon = item.icon;
										const isActive = item.adminSection ? currentPath === "/workspaces" && activeAdminSection === item.adminSection : currentPath === item.to;
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: item.to,
											onClick: () => handleNavClick(item),
											className: `w-full flex items-center justify-between px-3 py-2 rounded-2xl transition duration-150 group cursor-pointer ${isActive ? activeRbacRole === "admin" ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-lg shadow-amber-500/20" : "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black shadow-lg shadow-cyan-500/20" : "text-gray-300 hover:text-white hover:bg-white/5 font-semibold"}`,
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-2.5 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: `w-4 h-4 shrink-0 ${isActive ? "text-black" : activeRbacRole === "admin" ? "text-amber-400" : "text-[#00f0ff]"}` }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 922,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-xs truncate font-bold leading-tight",
														children: item.label
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 932,
														columnNumber: 25
													}, this), item.subLabel && /* @__PURE__ */ (void 0)("div", {
														className: `text-[9.5px] truncate leading-tight mt-0.5 ${isActive ? "text-black/80 font-bold" : "text-gray-400 font-normal"}`,
														children: item.subLabel
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 934,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 931,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 921,
												columnNumber: 21
											}, this), item.badge && /* @__PURE__ */ (void 0)("span", {
												className: `text-[8.5px] px-1.5 py-0.5 rounded-full font-bold border shrink-0 ml-1.5 ${isActive ? "bg-black/20 text-black border-black/30" : item.badgeColor || "bg-white/10 text-gray-300 border-white/20"}`,
												children: item.badge
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 946,
												columnNumber: 23
											}, this)]
										}, `${item.to}-${item.adminSection || item.boardSubTab || index}`, true, {
											fileName: _jsxFileName$1,
											lineNumber: 909,
											columnNumber: 19
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 901,
									columnNumber: 13
								}, this),
								activeRbacRole !== "public" && /* @__PURE__ */ (void 0)("div", {
									className: "pt-2 border-t border-[#1b153b] space-y-1",
									children: [
										/* @__PURE__ */ (void 0)("span", {
											className: "text-[9px] uppercase font-bold text-gray-400 tracking-wider px-2 block",
											children: "Public Perspective"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 964,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)(Link, {
											to: "/standings",
											onClick: () => {
												if (typeof window !== "undefined" && window.innerWidth < 1024) setIsSidebarOpen(false);
											},
											className: "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(Trophy, { className: "w-3.5 h-3.5 text-cyan-400" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 977,
													columnNumber: 21
												}, this), /* @__PURE__ */ (void 0)("span", { children: "Public Standings & Table" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 978,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 976,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[9px] text-gray-500 font-mono",
												children: "View Only"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 980,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 967,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)(Link, {
											to: "/fixtures",
											onClick: () => {
												if (typeof window !== "undefined" && window.innerWidth < 1024) setIsSidebarOpen(false);
											},
											className: "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition",
											children: [/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(Calendar, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 992,
													columnNumber: 21
												}, this), /* @__PURE__ */ (void 0)("span", { children: "Public Fixtures Schedule" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 993,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 991,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[9px] text-gray-500 font-mono",
												children: "View Only"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 995,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 982,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 963,
									columnNumber: 15
								}, this),
								activeRbacRole !== "public" && /* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setShowOfficialsModal(true),
									className: "w-full flex items-center justify-between px-3 py-2 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition cursor-pointer text-xs mt-1",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (void 0)(Users, { className: "w-4 h-4 text-purple-400 shrink-0" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 1008,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", { children: "League Officials Directory" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 1009,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1007,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-[9px] px-2 py-0.5 rounded-full font-bold border bg-purple-500/20 text-purple-300 border-purple-500/30",
										children: "Council"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1011,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1002,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 869,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] uppercase font-black text-gray-400 tracking-wider px-3 block mb-1.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Music, { className: "w-3 h-3 text-cyan-400" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1021,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Stadium Soundtrack" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1022,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1020,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnthemPlayerWidget, { isCompact: true }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1024,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1019,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 838,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-4 border-t border-[#261f4d] space-y-2",
					children: !isLoggedIn && !rbacUser ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => setShowAccessModal(true),
						className: "w-full bg-[#141029] hover:bg-[#1f1744] border border-amber-400/30 text-amber-300 hover:text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "w-3.5 h-3.5 text-amber-400" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 1036,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Council Access Code Login" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 1037,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 1031,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-2.5 rounded-2xl bg-[#141029] border border-[#2e2554] space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: `text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeRbacRole === "admin" ? "bg-amber-400/20 text-amber-300 border-amber-400/30" : activeRbacRole === "board" ? "bg-indigo-400/20 text-indigo-300 border-indigo-400/30" : "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"}`,
											children: activeRbacRole === "admin" ? "👑 Super Admin" : activeRbacRole === "board" ? "👔 Council Member" : "🎓 Verified Student"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 1044,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] text-gray-500 font-mono",
											children: "RBAC"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 1059,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1043,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs font-bold text-white truncate",
										children: rbacUser?.displayName || (isSuperAdmin ? "Master Administrator" : "League Official")
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1061,
										columnNumber: 17
									}, this),
									rbacUser?.email && /* @__PURE__ */ (void 0)("div", {
										className: "text-[10px] text-gray-400 font-mono truncate",
										children: rbacUser.email
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1066,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1042,
								columnNumber: 15
							}, this),
							activeRbacRole !== "public" && /* @__PURE__ */ (void 0)(Link, {
								to: "/workspaces",
								className: "w-full bg-[#141029] hover:bg-[#1f1744] border border-amber-400/30 text-amber-300 hover:text-white py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2",
								children: [activeRbacRole === "admin" ? /* @__PURE__ */ (void 0)(Crown, { className: "w-3.5 h-3.5 text-amber-400" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1079,
									columnNumber: 21
								}, this) : /* @__PURE__ */ (void 0)(Briefcase, { className: "w-3.5 h-3.5 text-blue-400" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1081,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("span", { children: activeRbacRole === "admin" ? "Master Command" : "Council Workspace" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1083,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1074,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => {
									logoutRbacUser();
									switchRole("GUEST");
								},
								className: "w-full bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1096,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
									"Log Out (",
									activeRbacRole,
									")"
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1097,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1088,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 1040,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 1029,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 833,
				columnNumber: 7
			}, this),
			!isSidebarOpen && /* @__PURE__ */ (void 0)("div", {
				className: "fixed left-0 top-32 z-40",
				children: /* @__PURE__ */ (void 0)("button", {
					onClick: () => setIsSidebarOpen(true),
					className: "bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black font-black py-2.5 px-3 rounded-r-2xl shadow-2xl shadow-cyan-500/30 flex items-center gap-2 hover:translate-x-1 transition duration-200 border-y border-r border-cyan-300 cursor-pointer",
					title: "Show League Sidebar",
					children: [/* @__PURE__ */ (void 0)(PanelLeft, { className: "w-4 h-4" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 1112,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "text-xs uppercase tracking-wider hidden sm:inline",
						children: "Menu"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 1113,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 1107,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 1106,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-72" : "pl-0"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
					className: "sticky top-0 z-30 bg-[#080517]/90 backdrop-blur-md border-b border-[#261f4d] px-4 py-3 sm:px-6 flex items-center justify-between shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [!isSidebarOpen && /* @__PURE__ */ (void 0)("button", {
							onClick: () => setIsSidebarOpen(true),
							title: "Expand Navigation",
							className: "text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer",
							children: /* @__PURE__ */ (void 0)(PanelLeft, { className: "w-5 h-5 text-[#00f0ff]" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1133,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 1128,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-black text-white uppercase tracking-wider hidden sm:inline",
								children: "M-Pesa Sunday League"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1138,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-gray-400 font-mono hidden md:inline",
								children: "• Season 2026/27"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1141,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1137,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 1126,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: isLoggedIn ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-bold text-amber-300 font-mono hidden sm:inline",
								children: isSuperAdmin ? "👑 Master Admin" : "👔 Council Active"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1150,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/workspaces",
								className: "px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-md shadow-amber-400/20",
								children: "Workspace"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1153,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1149,
							columnNumber: 15
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/workspaces",
							className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141029] hover:bg-[#1f1744] border border-amber-400/30 text-amber-300 text-xs font-bold transition shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1165,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Council Login" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1166,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1161,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 1147,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 1125,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
					className: "p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-61px)]",
					children
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 1173,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 1119,
				columnNumber: 7
			}, this),
			showOfficialsModal && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0e0a26] border-2 border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-between border-b border-[#2e2554] pb-3",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (void 0)(Users, { className: "w-6 h-6 text-purple-400" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1182,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
									className: "font-header text-lg font-black text-white uppercase",
									children: "Public League Officials Appointments"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1184,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-gray-400",
									children: "Directory of appointed council leaders and official roles."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1187,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1183,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1181,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setShowOfficialsModal(false),
								className: "text-gray-400 hover:text-white",
								children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1197,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1192,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1180,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-1",
							children: officialsList.map((official, idx) => /* @__PURE__ */ (void 0)("div", {
								className: "bg-[#141029] border border-[#2e2554] rounded-2xl p-4 space-y-2 hover:border-purple-400/50 transition",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-start justify-between",
									children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] text-purple-300 font-mono font-bold uppercase block",
										children: official.role
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1209,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("h4", {
										className: "text-sm font-black text-white",
										children: official.name
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1212,
										columnNumber: 23
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1208,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold",
										children: "Official"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1214,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1207,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "space-y-1 text-[11px] text-gray-300 pt-1 border-t border-[#261f4d]",
									children: official.responsibilities.map((resp, rIdx) => /* @__PURE__ */ (void 0)("p", {
										className: "flex items-start gap-1.5 leading-relaxed",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-purple-400 shrink-0",
											children: "•"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 1222,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("span", { children: resp }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 1223,
											columnNumber: 25
										}, this)]
									}, rIdx, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1221,
										columnNumber: 23
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1219,
									columnNumber: 19
								}, this)]
							}, idx, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1203,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 1201,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "pt-3 border-t border-[#2e2554] flex items-center justify-between text-xs text-gray-400",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "font-mono text-[10px]",
								children: "Public League Directory • Sourced from public/league-officials.js"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1232,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setShowOfficialsModal(false),
								className: "px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs",
								children: "Close"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1235,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1231,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 1179,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 1178,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UnifiedAccessModal, {
				isOpen: showAccessModal,
				onClose: () => setShowAccessModal(false),
				onSuccess: () => {
					router.navigate({ to: "/workspaces" });
				}
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 1248,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 823,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 27,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 20,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 19,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 52,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 47,
		columnNumber: 5
	}, this);
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "M-Pesa Sunday League Hub | Official eFootball Edition" },
			{
				name: "description",
				content: "Official eFootball Edition portal for M-Pesa Sunday League featuring tables, player stats leaderboard, fixtures, clubs, and squad management."
			},
			{
				name: "author",
				content: "M-Pesa Sunday League"
			},
			{
				property: "og:title",
				content: "M-Pesa Sunday League Hub | Official eFootball Edition"
			},
			{
				property: "og:description",
				content: "Official eFootball Edition portal for M-Pesa Sunday League featuring tables, player stats leaderboard, fixtures, clubs, and squad management."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "M-Pesa Sunday League Hub"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/mpesa-academy-icon.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/mpesa-academy-icon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 118,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 117,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
			suppressHydrationWarning: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					id: "pes-yt-player-wrapper",
					suppressHydrationWarning: true,
					style: {
						position: "fixed",
						bottom: "8px",
						right: "8px",
						width: "160px",
						height: "90px",
						zIndex: 9999,
						pointerEvents: "none",
						opacity: .001,
						overflow: "hidden"
					},
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						id: "pes-yt-player",
						style: {
							width: "100%",
							height: "100%"
						}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 137,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 122,
					columnNumber: 9
				}, this),
				children,
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", {
					src: "/anthem-player.js",
					async: true
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 140,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 141,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 120,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 116,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PermanentSidebarLayout, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 154,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 153,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 151,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$12 = () => import("./routes-wZFLlSby.mjs");
var Route$14 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "M-Pesa Sunday League | Fixtures, Results & Officials" },
		{
			name: "description",
			content: "Official eFootball Edition portal for M-Pesa Sunday League featuring tables, player stats leaderboard, fixtures, clubs, and squad management."
		},
		{
			property: "og:title",
			content: "M-Pesa Sunday League | Fixtures, Results & Officials"
		},
		{
			property: "og:description",
			content: "Official eFootball Edition portal for M-Pesa Sunday League featuring tables, player stats leaderboard, fixtures, clubs, and squad management."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./anthem-C7bXGAfn.mjs");
var Route$13 = createFileRoute("/anthem")({
	head: () => ({ meta: [{ title: "Stadium Anthem & YouTube Playlist Studio | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official Stadium Anthem & YouTube Playlist Studio: upload YouTube songs, manage continuous web audio playlists, and configure stadium soundscapes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./calendar-Cs9pwSag.mjs");
var Route$12 = createFileRoute("/calendar")({
	head: () => ({ meta: [{ title: "Season Match Calendar | M-Pesa Sunday League" }, {
		name: "description",
		content: "Monthly interactive fixture calendar highlighting past results and upcoming clashes for the M-Pesa Sunday League eFootball Championship."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./clubs-CAFkGJa1.mjs");
var Route$11 = createFileRoute("/clubs")({
	head: () => ({ meta: [{ title: "Clubs & Squads Directory | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official club directory, registered youth football teams, coach profiles, and 15-player squad limit rosters in the M-Pesa Sunday League."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./community-y6Ow9e1Y.mjs");
var Route$10 = createFileRoute("/community")({
	head: () => ({ meta: [{ title: "Fan Cheers & Stadium Community Wall | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official fan community board: cheer on your academy football team, share match predictions, and celebrate school sportsmanship in the M-Pesa Sunday League."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./desk-M3axuby4.mjs");
var Route$9 = createFileRoute("/desk")({
	head: () => ({ meta: [{ title: "Public Registration & Inquiries Desk | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official public registration portal: apply for new football club admission, submit student player tryout forms, and contact the League Secretariat."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./fixtures-wjb40rAU.mjs");
var Route$8 = createFileRoute("/fixtures")({
	head: () => ({ meta: [{ title: "Fixtures & Schedule | M-Pesa Sunday League" }, {
		name: "description",
		content: "Upcoming football matches, date, time, and competing teams in the M-Pesa Sunday League eFootball Championship."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./leaderboard-BubZDK5u.mjs");
var Route$7 = createFileRoute("/leaderboard")({
	head: () => ({ meta: [{ title: "Golden Boot & Player Leaderboard | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official Golden Boot race with scoring trend visualizations, top goalscorers, playmakers, and all-star player records."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./performance-BeM4Ml3H.mjs");
var Route$6 = createFileRoute("/performance")({
	head: () => ({ meta: [{ title: "Team Performance Dashboard | M-Pesa Sunday League" }, {
		name: "description",
		content: "Tactical team performance radar charts visualizing wins, losses, and goals scored across all clubs in the M-Pesa Sunday League."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./profile-CgG8ANej.mjs");
var Route$5 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "User Profile & Role Access | M-Pesa Sunday League" }, {
		name: "description",
		content: "View your assigned league role, council tier, and list of authorized management actions in the M-Pesa Sunday League."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./standings-B580INTN.mjs");
var Route$4 = createFileRoute("/standings")({
	head: () => ({ meta: [{ title: "League Standings & Table | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official sortable League Standings table with points, goal difference, matches played, form guide, and club rankings."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./upload-photo-DADU9z9r.mjs");
var Route$3 = createFileRoute("/upload-photo")({
	head: () => ({ meta: [{ title: "Player Photo Upload Portal | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official portal for student athletes to upload and publish their profile pictures for the M-Pesa Sunday League."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./workspaces-D-Q5LlrS.mjs");
var Route$2 = createFileRoute("/workspaces")({
	head: () => ({ meta: [{ title: "Executive Board Workspaces | M-Pesa Sunday League" }, {
		name: "description",
		content: "Comprehensive role-synchronized executive workspaces for President, Deputy President, Regulations, Officiating, Records, Tech Managers, and Super Admin."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$1 = createFileRoute("/api/public/portal")({ server: { handlers: {
	GET: async ({ request }) => (await import("./portal.server-BWgY9KH1.mjs")).handlePortal(request),
	POST: async ({ request }) => (await import("./portal.server-BWgY9KH1.mjs")).handlePortal(request)
} } });
var json = (body, status = 200) => new Response(JSON.stringify(body), {
	status,
	headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	}
});
var Route = createFileRoute("/api/public/song")({ server: { handlers: {
	GET: async () => {
		const url = process.env["SUPABASE_URL"];
		const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
		if (!url || !key) return json({ error: "Anthem unavailable." }, 503);
		const { data, error } = await createClient(url, key, {
			auth: { persistSession: false },
			global: { fetch: (input, init) => {
				const headers = new Headers(init?.headers);
				headers.delete("Authorization");
				headers.set("apikey", key);
				return fetch(input, {
					...init,
					headers
				});
			} }
		}).from("site_song").select("youtube_id,youtube_url,title,updated_at").eq("id", 1).maybeSingle();
		return error ? json({ error: "Anthem unavailable." }, 503) : json(data || {});
	},
	POST: async ({ request }) => {
		const url = new URL(request.url);
		url.pathname = "/api/public/portal";
		url.search = "?action=song";
		return (await import("./portal.server-BWgY9KH1.mjs")).handlePortal(new Request(url, request));
	}
} } });
var rootRouteChildren = {
	IndexRoute: Route$14.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$15
	}),
	AnthemRoute: Route$13.update({
		id: "/anthem",
		path: "/anthem",
		getParentRoute: () => Route$15
	}),
	CalendarRoute: Route$12.update({
		id: "/calendar",
		path: "/calendar",
		getParentRoute: () => Route$15
	}),
	ClubsRoute: Route$11.update({
		id: "/clubs",
		path: "/clubs",
		getParentRoute: () => Route$15
	}),
	CommunityRoute: Route$10.update({
		id: "/community",
		path: "/community",
		getParentRoute: () => Route$15
	}),
	DeskRoute: Route$9.update({
		id: "/desk",
		path: "/desk",
		getParentRoute: () => Route$15
	}),
	FixturesRoute: Route$8.update({
		id: "/fixtures",
		path: "/fixtures",
		getParentRoute: () => Route$15
	}),
	LeaderboardRoute: Route$7.update({
		id: "/leaderboard",
		path: "/leaderboard",
		getParentRoute: () => Route$15
	}),
	MvpVotingRoute: Route$16.update({
		id: "/mvp-voting",
		path: "/mvp-voting",
		getParentRoute: () => Route$15
	}),
	PerformanceRoute: Route$6.update({
		id: "/performance",
		path: "/performance",
		getParentRoute: () => Route$15
	}),
	ProfileRoute: Route$5.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$15
	}),
	StandingsRoute: Route$4.update({
		id: "/standings",
		path: "/standings",
		getParentRoute: () => Route$15
	}),
	UploadPhotoRoute: Route$3.update({
		id: "/upload-photo",
		path: "/upload-photo",
		getParentRoute: () => Route$15
	}),
	WorkspacesRoute: Route$2.update({
		id: "/workspaces",
		path: "/workspaces",
		getParentRoute: () => Route$15
	}),
	ApiPublicPortalRoute: Route$1.update({
		id: "/api/public/portal",
		path: "/api/public/portal",
		getParentRoute: () => Route$15
	}),
	ApiPublicSongRoute: Route.update({
		id: "/api/public/song",
		path: "/api/public/song",
		getParentRoute: () => Route$15
	})
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
