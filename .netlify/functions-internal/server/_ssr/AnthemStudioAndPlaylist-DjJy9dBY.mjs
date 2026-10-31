import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { $ as ListMusic, Ht as ArrowUp, L as Plus, M as Repeat, Ot as CircleCheck, P as Radio, R as Play, V as Pause, Wt as ArrowDown, b as Shuffle, f as Trash2, gt as ExternalLink, i as Volume2, kt as CircleAlert, r as VolumeX, v as SkipForward, xt as Crown, y as SkipBack, yt as Disc3 } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AnthemStudioAndPlaylist-DjJy9dBY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var DEFAULT_PLAYLIST = [
	{
		id: "anthem-1",
		title: "M-Pesa Sunday League Official Stadium Anthem",
		artist: "eFootball Championship Band & Arena Orchestra",
		youtubeId: "2yJgwwDcgV8",
		category: "ANTHEM",
		duration: "3:45",
		addedAt: "2026-10-01",
		isOfficialAnthem: true
	},
	{
		id: "anthem-2",
		title: "Champions Arena Kickoff March (High Energy Fanfare)",
		artist: "Sunday League Philharmonic",
		youtubeId: "kXYiU_JCYtU",
		category: "KICKOFF",
		duration: "4:12",
		addedAt: "2026-10-10"
	},
	{
		id: "anthem-3",
		title: "Electric Arena Kickoff Fanfare & Horns",
		artist: "Sunday League Sound Lab",
		youtubeId: "JGwWNGJdvx8",
		category: "KICKOFF",
		duration: "2:50",
		addedAt: "2026-10-15"
	},
	{
		id: "anthem-4",
		title: "Crown Of Champions (Full Matchday Theme)",
		artist: "Samba & Rangers Combined Band",
		youtubeId: "uelHwf8o7_U",
		category: "CHAMPIONSHIP",
		duration: "3:20",
		addedAt: "2026-10-18"
	}
];
var PLAYLIST_STORAGE_KEY = "mpesa_pes_playlist_v2";
/**
* Extracts a standard 11-character YouTube video ID from various YouTube URL formats or raw ID.
*/
function extractYouTubeId(input) {
	if (!input) return null;
	const trimmed = input.trim();
	if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
	const urlMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
	if (urlMatch && urlMatch[1]) return urlMatch[1];
	return null;
}
function getYouTubeThumbnail(videoId) {
	return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
function getPlaylist() {
	if (typeof window === "undefined") return DEFAULT_PLAYLIST;
	try {
		const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		}
	} catch {}
	return DEFAULT_PLAYLIST;
}
function savePlaylist(playlist) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlist));
		window.dispatchEvent(new Event("mpesa_playlist_updated"));
	} catch (err) {
		console.error("Failed to save playlist", err);
	}
}
function addSongToPlaylist(song) {
	const videoId = extractYouTubeId(song.youtubeId);
	if (!videoId) return null;
	const current = getPlaylist();
	const newSong = {
		...song,
		id: `song-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
		youtubeId: videoId,
		addedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	};
	savePlaylist([...current, newSong]);
	return newSong;
}
function removeSongFromPlaylist(id) {
	const updated = getPlaylist().filter((s) => s.id !== id);
	savePlaylist(updated.length > 0 ? updated : DEFAULT_PLAYLIST);
}
function reorderPlaylist(startIndex, endIndex) {
	const current = [...getPlaylist()];
	if (startIndex < 0 || startIndex >= current.length || endIndex < 0 || endIndex >= current.length) return;
	const [removed] = current.splice(startIndex, 1);
	current.splice(endIndex, 0, removed);
	savePlaylist(current);
}
function setPrimaryAnthem(id) {
	const current = getPlaylist();
	const target = current.find((s) => s.id === id);
	savePlaylist(current.map((s) => ({
		...s,
		isOfficialAnthem: s.id === id
	})));
	if (target && typeof window !== "undefined") try {
		const anthemConfig = {
			title: target.title,
			artist: target.artist,
			youtubeId: target.youtubeId,
			volume: .7,
			mode: "audio",
			autoPlay: true
		};
		localStorage.setItem("mpesa_pes_anthem_v3", JSON.stringify(anthemConfig));
		window.dispatchEvent(new CustomEvent("mpesa_anthem_changed"));
	} catch {}
}
var _jsxFileName = "/app/applet/src/components/AnthemStudioAndPlaylist.tsx";
function AnthemStudioAndPlaylist() {
	const { isSuperAdmin, currentRole } = useRoleAccess();
	const canManageSongs = isSuperAdmin || currentRole === "TECH_MANAGER" || currentRole === "ASST_TECH_MANAGER" || currentRole === "PRESIDENT";
	const [playlist, setPlaylist] = (0, import_react.useState)([]);
	const [currentSongIndex, setCurrentSongIndex] = (0, import_react.useState)(0);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [volume, setVolume] = (0, import_react.useState)(.75);
	const [isMuted, setIsMuted] = (0, import_react.useState)(false);
	const [isLoopEnabled, setIsLoopEnabled] = (0, import_react.useState)(true);
	const [isShuffleEnabled, setIsShuffleEnabled] = (0, import_react.useState)(false);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [urlInput, setUrlInput] = (0, import_react.useState)("");
	const [titleInput, setTitleInput] = (0, import_react.useState)("");
	const [artistInput, setArtistInput] = (0, import_react.useState)("");
	const [categoryInput, setCategoryInput] = (0, import_react.useState)("ANTHEM");
	const [detectedId, setDetectedId] = (0, import_react.useState)(null);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const audioCtxRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const list = getPlaylist();
		setPlaylist(list);
		const handleUpdate = () => {
			setPlaylist(getPlaylist());
		};
		window.addEventListener("mpesa_playlist_updated", handleUpdate);
		return () => window.removeEventListener("mpesa_playlist_updated", handleUpdate);
	}, []);
	(0, import_react.useEffect)(() => {
		const id = extractYouTubeId(urlInput);
		setDetectedId(id);
		if (urlInput && !id) setFormError("Could not detect valid YouTube video ID or URL.");
		else setFormError(null);
	}, [urlInput]);
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3e3);
	};
	const currentSong = playlist[currentSongIndex] || playlist[0];
	(0, import_react.useEffect)(() => {
		const handleSongEnded = () => {
			if (playlist.length === 0) return;
			if (isShuffleEnabled && playlist.length > 1) {
				let nextIdx = Math.floor(Math.random() * playlist.length);
				if (nextIdx === currentSongIndex) nextIdx = (nextIdx + 1) % playlist.length;
				playSongAtIndex(nextIdx);
				return;
			}
			if (currentSongIndex < playlist.length - 1) playSongAtIndex(currentSongIndex + 1);
			else if (isLoopEnabled) playSongAtIndex(0);
			else setIsPlaying(false);
		};
		window.addEventListener("pes_song_ended", handleSongEnded);
		return () => window.removeEventListener("pes_song_ended", handleSongEnded);
	}, [
		currentSongIndex,
		playlist,
		isLoopEnabled,
		isShuffleEnabled
	]);
	const playSongAtIndex = (index) => {
		if (index < 0 || index >= playlist.length) return;
		const song = playlist[index];
		setCurrentSongIndex(index);
		setIsPlaying(true);
		if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.play(song.youtubeId);
		triggerSynthChime();
		showToast(`▶ Now Playing: ${song.title}`);
	};
	const togglePlayPause = () => {
		if (isPlaying) {
			setIsPlaying(false);
			if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.pause();
		} else playSongAtIndex(currentSongIndex);
	};
	const handleNextTrack = () => {
		if (playlist.length <= 1) return;
		if (isShuffleEnabled) {
			const nextIdx = Math.floor(Math.random() * playlist.length);
			playSongAtIndex(nextIdx);
		} else {
			const next = (currentSongIndex + 1) % playlist.length;
			playSongAtIndex(next);
		}
	};
	const handlePrevTrack = () => {
		if (playlist.length <= 1) return;
		const prev = (currentSongIndex - 1 + playlist.length) % playlist.length;
		playSongAtIndex(prev);
	};
	const handleVolumeChange = (newVol) => {
		setVolume(newVol);
		setIsMuted(newVol === 0);
		if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.setVolume(newVol);
	};
	const toggleMute = () => {
		const nextMuted = !isMuted;
		setIsMuted(nextMuted);
		const target = nextMuted ? 0 : volume || .7;
		if (typeof window !== "undefined" && window.PesAnthem) window.PesAnthem.setVolume(target);
	};
	const triggerSynthChime = () => {
		if (typeof window === "undefined") return;
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
			if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
			const ctx = audioCtxRef.current;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(523.25, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + .15);
			const v = isMuted ? 0 : volume * .08;
			gain.gain.setValueAtTime(v, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .3);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + .32);
		} catch {}
	};
	const handleAddSong = (e) => {
		e.preventDefault();
		if (!detectedId) {
			setFormError("Please enter a valid YouTube video URL or ID.");
			return;
		}
		if (!titleInput.trim()) {
			setFormError("Please provide a song title.");
			return;
		}
		const created = addSongToPlaylist({
			title: titleInput.trim(),
			artist: artistInput.trim() || "Sunday League Artist",
			youtubeId: detectedId,
			category: categoryInput
		});
		if (created) {
			setUrlInput("");
			setTitleInput("");
			setArtistInput("");
			setDetectedId(null);
			setFormError(null);
			showToast(`✓ Added "${created.title}" to playlist!`);
		}
	};
	const handleRemoveSong = (id, e) => {
		e.stopPropagation();
		if (playlist.length <= 1) {
			showToast("Cannot remove the last remaining anthem from playlist.");
			return;
		}
		removeSongFromPlaylist(id);
		showToast("✓ Track removed from playlist.");
	};
	const handleMoveUp = (idx, e) => {
		e.stopPropagation();
		if (idx === 0) return;
		reorderPlaylist(idx, idx - 1);
	};
	const handleMoveDown = (idx, e) => {
		e.stopPropagation();
		if (idx === playlist.length - 1) return;
		reorderPlaylist(idx, idx + 1);
	};
	const handleSetPrimary = (id, e) => {
		e.stopPropagation();
		setPrimaryAnthem(id);
		showToast("✓ Set as Primary Stadium Anthem!");
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			toastMessage && /* @__PURE__ */ (void 0)("div", {
				className: "fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2",
				children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-4 h-4 text-black shrink-0" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 295,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", {
					className: "text-xs",
					children: toastMessage
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 296,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 294,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#180a3a] via-[#100827] to-[#070512] p-6 sm:p-8 shadow-2xl",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative z-10 max-w-3xl space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Radio, { className: "w-3.5 h-3.5 text-purple-400 animate-pulse" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 304,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Official Stadium Audio & Continuous Playlist Engine" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 305,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 303,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-header text-2xl sm:text-4xl font-black text-white uppercase tracking-wider leading-tight",
							children: "Stadium Anthem & YouTube Playlist Studio"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 308,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl",
							children: "Upload custom YouTube anthems, curate stadium matchday hype chants, and configure automated continuous web playback that plays stadium sound uninterrupted as fans navigate the league portal."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 312,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 302,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 301,
				columnNumber: 7
			}, this),
			currentSong && /* @__PURE__ */ (void 0)("div", {
				className: "bg-[#0b0821] border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "flex flex-col lg:flex-row items-center gap-6",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "relative w-44 h-32 sm:w-56 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-400/40 shrink-0 group",
						children: [
							/* @__PURE__ */ (void 0)("img", {
								src: getYouTubeThumbnail(currentSong.youtubeId),
								alt: currentSong.title,
								className: "w-full h-full object-cover group-hover:scale-105 transition duration-500"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 326,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3",
								children: /* @__PURE__ */ (void 0)("span", {
									className: "text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/80 text-white backdrop-blur-sm",
									children: currentSong.category
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 332,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 331,
								columnNumber: 15
							}, this),
							isPlaying && /* @__PURE__ */ (void 0)("div", {
								className: "absolute top-2 right-2 flex items-end gap-1 h-6 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm",
								children: [
									/* @__PURE__ */ (void 0)("div", { className: "w-1 bg-[#00f0ff] rounded-full animate-bounce [animation-delay:0.1s] h-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 340,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", { className: "w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.3s] h-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 341,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", { className: "w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s] h-3" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 342,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", { className: "w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s] h-6" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 343,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 339,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 325,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "flex-1 min-w-0 space-y-3 text-center lg:text-left",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap items-center justify-center lg:justify-start gap-2",
								children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300",
										children: [
											"Track #",
											currentSongIndex + 1,
											" of ",
											playlist.length
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 351,
										columnNumber: 17
									}, this),
									currentSong.isOfficialAnthem && /* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1",
										children: [/* @__PURE__ */ (void 0)(Crown, { className: "w-3 h-3 text-amber-400" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 356,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Official League Anthem" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 357,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 355,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] font-mono text-cyan-300",
										children: ["YT ID: ", currentSong.youtubeId]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 360,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 350,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("h3", {
								className: "font-header text-xl sm:text-2xl font-black text-white uppercase truncate",
								children: currentSong.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 365,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-sm font-semibold text-gray-400 truncate",
								children: [
									currentSong.artist,
									" •",
									" ",
									/* @__PURE__ */ (void 0)("span", {
										className: "text-emerald-400",
										children: "Automatic Web Playback Enabled"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 370,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 368,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2",
								children: [
									/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => {
											setIsShuffleEnabled(!isShuffleEnabled);
											showToast(isShuffleEnabled ? "Shuffle Mode Disabled" : "Shuffle Mode Active 🔀");
										},
										className: `p-2.5 rounded-2xl border transition cursor-pointer ${isShuffleEnabled ? "bg-purple-500 text-white border-purple-400" : "bg-[#141029] text-gray-400 hover:text-white border-[#2e2554]"}`,
										title: "Toggle Shuffle",
										children: /* @__PURE__ */ (void 0)(Shuffle, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 391,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 376,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: handlePrevTrack,
										className: "p-2.5 rounded-2xl bg-[#141029] hover:bg-[#1e1742] text-white border border-[#2e2554] transition cursor-pointer shadow",
										title: "Previous Track",
										children: /* @__PURE__ */ (void 0)(SkipBack, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 401,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 395,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: togglePlayPause,
										className: "px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-purple-500 to-[#00ff85] text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition cursor-pointer active:scale-95",
										children: isPlaying ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Pause, { className: "w-5 h-5 fill-black" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 412,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Pause Audio" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 413,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 411,
											columnNumber: 21
										}, this) : /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Play, { className: "w-5 h-5 fill-black" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 417,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Play Track" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 418,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 416,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 405,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: handleNextTrack,
										className: "p-2.5 rounded-2xl bg-[#141029] hover:bg-[#1e1742] text-white border border-[#2e2554] transition cursor-pointer shadow",
										title: "Next Track",
										children: /* @__PURE__ */ (void 0)(SkipForward, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 430,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 424,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => {
											setIsLoopEnabled(!isLoopEnabled);
											showToast(isLoopEnabled ? "Looping Disabled" : "Continuous Loop Active 🔁");
										},
										className: `p-2.5 rounded-2xl border transition cursor-pointer ${isLoopEnabled ? "bg-cyan-500 text-black border-cyan-400 font-bold" : "bg-[#141029] text-gray-400 hover:text-white border-[#2e2554]"}`,
										title: "Toggle Loop Playlist",
										children: /* @__PURE__ */ (void 0)(Repeat, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 447,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 434,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#141029] border border-[#2e2554]",
										children: [
											/* @__PURE__ */ (void 0)("button", {
												type: "button",
												onClick: toggleMute,
												className: "text-gray-300 hover:text-white transition cursor-pointer",
												children: isMuted || volume === 0 ? /* @__PURE__ */ (void 0)(VolumeX, { className: "w-4 h-4 text-rose-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 458,
													columnNumber: 23
												}, this) : /* @__PURE__ */ (void 0)(Volume2, { className: "w-4 h-4 text-cyan-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 460,
													columnNumber: 23
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 452,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (void 0)("input", {
												type: "range",
												min: "0",
												max: "1",
												step: "0.05",
												value: isMuted ? 0 : volume,
												onChange: (e) => handleVolumeChange(parseFloat(e.target.value)),
												className: "w-20 accent-cyan-400 cursor-pointer"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 463,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] font-mono text-gray-400 w-8 text-right",
												children: [Math.round((isMuted ? 0 : volume) * 100), "%"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 472,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 451,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("a", {
										href: `https://www.youtube.com/watch?v=${currentSong.youtubeId}`,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "p-2.5 rounded-2xl bg-[#141029] hover:bg-[#1e1742] text-gray-400 hover:text-white border border-[#2e2554] transition",
										title: "Watch on YouTube",
										children: /* @__PURE__ */ (void 0)(ExternalLink, { className: "w-4 h-4 text-gray-400" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 485,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 478,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 374,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 349,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 323,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 322,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-5 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "border-b border-[#2e2554] pb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-cyan-400 uppercase font-black tracking-wider block",
								children: "Curator & Administrator Studio"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 498,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: "font-header text-lg font-black text-white uppercase mt-0.5 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-5 h-5 text-cyan-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 502,
									columnNumber: 15
								}, this), "Upload YouTube Song to Playlist"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 501,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-gray-400 mt-1",
								children: "Paste any YouTube video link or 11-digit video code to add it to the automatic web soundtrack."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 505,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 497,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						onSubmit: handleAddSong,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
									children: "YouTube URL or Video ID"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 513,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. https://www.youtube.com/watch?v=kXYiU_JCYtU",
									value: urlInput,
									onChange: (e) => setUrlInput(e.target.value),
									className: "w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 516,
									columnNumber: 15
								}, this),
								detectedId ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 flex items-center gap-2 text-xs text-emerald-400 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 526,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Detected YouTube ID: ", detectedId] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 527,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 525,
									columnNumber: 17
								}, this) : formError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1.5 flex items-center gap-2 text-xs text-rose-400",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleAlert, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 531,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: formError }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 532,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 530,
									columnNumber: 17
								}, this) : null
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 512,
								columnNumber: 13
							}, this),
							detectedId && /* @__PURE__ */ (void 0)("div", {
								className: "relative w-full h-32 rounded-xl overflow-hidden border border-cyan-400/40 bg-black",
								children: [/* @__PURE__ */ (void 0)("img", {
									src: getYouTubeThumbnail(detectedId),
									alt: "YouTube Preview",
									className: "w-full h-full object-cover"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 540,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "absolute inset-0 bg-black/40 flex items-center justify-center",
									children: /* @__PURE__ */ (void 0)("span", {
										className: "px-3 py-1 rounded-full bg-cyan-400 text-black text-xs font-black uppercase",
										children: "Preview Verified"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 546,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 545,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 539,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "Song Title"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 554,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Sunday League Faith & Victory Fanfare",
								value: titleInput,
								onChange: (e) => setTitleInput(e.target.value),
								className: "w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 557,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 553,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "Artist / Ministry / Choir"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 568,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								placeholder: "e.g. M-Pesa Academy Youth Brass Band",
								value: artistInput,
								onChange: (e) => setArtistInput(e.target.value),
								className: "w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 571,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 567,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "Song Category"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 581,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: categoryInput,
								onChange: (e) => setCategoryInput(e.target.value),
								className: "w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "ANTHEM",
										children: "Stadium Anthem"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 589,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "CELEBRATION",
										children: "Victory Celebration"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 590,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "KICKOFF",
										children: "Kickoff Fanfare"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 591,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "DEVOTIONAL",
										children: "Devotional Chant"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 592,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "CHAMPIONSHIP",
										children: "Championship Trophy"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 593,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 584,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 580,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "submit",
								className: "w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-cyan-500/20 transition cursor-pointer active:scale-98 flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 601,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Add Song to Continuous Web Playlist" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 602,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 597,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 511,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 496,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-7 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-header text-lg font-black text-white uppercase flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListMusic, { className: "w-5 h-5 text-purple-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 612,
									columnNumber: 17
								}, this),
								"Active League Playlist Queue (",
								playlist.length,
								" Songs)"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 611,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-gray-400 mt-0.5",
							children: "Tracks will automatically play one after the other in continuous sequence across the portal."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 615,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 610,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
							children: "Auto-Play Web Queue"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 621,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 609,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2.5 max-h-[520px] overflow-y-auto pr-1",
						children: playlist.map((song, idx) => {
							const isCurrent = idx === currentSongIndex;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								onClick: () => playSongAtIndex(idx),
								className: `p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer group ${isCurrent ? "bg-purple-950/40 border-purple-400/80 shadow-lg shadow-purple-500/20" : "bg-[#141029] border-[#2e2554] hover:bg-[#1a1438] hover:border-purple-500/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-gray-400",
											children: isCurrent && isPlaying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Disc3, { className: "w-4 h-4 text-[#00f0ff] animate-spin" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 645,
												columnNumber: 25
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["#", idx + 1] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 647,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 643,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
												src: getYouTubeThumbnail(song.youtubeId),
												alt: song.title,
												className: "w-full h-full object-cover"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 653,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 652,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h5", {
													className: `text-xs font-black truncate leading-tight uppercase ${isCurrent ? "text-[#00f0ff]" : "text-white group-hover:text-cyan-300"}`,
													children: song.title
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 662,
													columnNumber: 25
												}, this), song.isOfficialAnthem && /* @__PURE__ */ (void 0)("span", {
													className: "shrink-0 text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30",
													children: "Anthem"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 670,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 661,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-[11px] text-gray-400 truncate",
												children: [
													song.artist,
													" • ",
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-mono",
														children: song.category
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 676,
														columnNumber: 41
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 675,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 660,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 641,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-1 shrink-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											disabled: idx === 0,
											onClick: (e) => handleMoveUp(idx, e),
											title: "Move Up",
											className: "p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUp, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 691,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 684,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											disabled: idx === playlist.length - 1,
											onClick: (e) => handleMoveDown(idx, e),
											title: "Move Down",
											className: "p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowDown, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 702,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 695,
											columnNumber: 21
										}, this),
										!song.isOfficialAnthem && canManageSongs && /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: (e) => handleSetPrimary(song.id, e),
											title: "Set as Default League Anthem",
											className: "p-1.5 rounded-lg text-amber-400/60 hover:text-amber-300 hover:bg-amber-400/10 cursor-pointer",
											children: /* @__PURE__ */ (void 0)(Crown, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 713,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 707,
											columnNumber: 23
										}, this),
										canManageSongs && playlist.length > 1 && /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: (e) => handleRemoveSong(song.id, e),
											title: "Delete Song",
											className: "p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer ml-1",
											children: /* @__PURE__ */ (void 0)(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 725,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 719,
											columnNumber: 23
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 682,
									columnNumber: 19
								}, this)]
							}, song.id, true, {
								fileName: _jsxFileName,
								lineNumber: 632,
								columnNumber: 17
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 627,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 608,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 494,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 291,
		columnNumber: 5
	}, this);
}
//#endregion
export { AnthemStudioAndPlaylist as t };
