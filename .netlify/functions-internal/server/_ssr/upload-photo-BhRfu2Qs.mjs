import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { At as Copy, C as Shield, Ct as ExternalLink, It as CircleCheck, Ut as Camera, _ as Sparkles, c as UserCheck, l as Upload } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as OFFICIAL_CLUBS_DATA } from "./teamSquadsData-CHaV0Ocp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-photo-BhRfu2Qs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/PlayerPhotoUploadPortal.tsx";
function PlayerPhotoUploadPortal() {
	const [teams, setTeams] = (0, import_react.useState)([]);
	const [selectedTeamId, setSelectedTeamId] = (0, import_react.useState)("");
	const [selectedPlayerName, setSelectedPlayerName] = (0, import_react.useState)("");
	const [previewPhoto, setPreviewPhoto] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [uploadSuccess, setUploadSuccess] = (0, import_react.useState)(false);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem("mpesa_pes_teams_v6");
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					setTeams(parsed);
					setSelectedTeamId(parsed[0].id);
					return;
				}
			}
		} catch (e) {
			console.warn("Could not load teams:", e);
		}
		const defaultTeams = OFFICIAL_CLUBS_DATA.map((c) => ({
			id: c.id,
			name: c.name,
			shortCode: c.shortCode,
			color: c.color,
			homePitch: c.homePitch,
			squad: c.squad.map((s) => ({
				name: s.name,
				number: s.number,
				position: s.position,
				foot: s.foot || "Right",
				admissionNumber: `MFA-2026-${(c.id * 100 + (s.number || 1)).toString().padStart(4, "0")}`,
				photoUrl: s.photoUrl || ""
			}))
		}));
		setTeams(defaultTeams);
		setSelectedTeamId(defaultTeams[0].id);
	}, []);
	const currentTeam = teams.find((t) => t.id === Number(selectedTeamId));
	const currentSquad = (0, import_react.useMemo)(() => currentTeam?.squad || [], [currentTeam]);
	const currentPlayer = currentSquad.find((p) => p.name === selectedPlayerName) || null;
	(0, import_react.useEffect)(() => {
		if (currentSquad.length > 0 && !selectedPlayerName) {
			setSelectedPlayerName(currentSquad[0].name);
			setPreviewPhoto(currentSquad[0].photoUrl || "");
		}
	}, [currentSquad, selectedPlayerName]);
	const handlePlayerChange = (name) => {
		setSelectedPlayerName(name);
		const p = currentSquad.find((item) => item.name === name);
		setPreviewPhoto(p?.photoUrl || "");
		setUploadSuccess(false);
	};
	const handleImageFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			alert("Please select a valid image file (PNG, JPG, WebP).");
			return;
		}
		const reader = new FileReader();
		reader.onload = (event) => {
			const result = event.target?.result;
			if (result) {
				setPreviewPhoto(result);
				setUploadSuccess(false);
			}
		};
		reader.readAsDataURL(file);
	};
	const handleSavePhoto = () => {
		if (!selectedTeamId || !selectedPlayerName || !previewPhoto) {
			alert("Please select your club, player profile, and upload an image.");
			return;
		}
		setIsSubmitting(true);
		try {
			const updatedTeams = teams.map((team) => {
				if (team.id === Number(selectedTeamId)) {
					const updatedSquad = (team.squad || []).map((player) => {
						if (player.name === selectedPlayerName) return {
							...player,
							photoUrl: previewPhoto
						};
						return player;
					});
					return {
						...team,
						squad: updatedSquad
					};
				}
				return team;
			});
			setTeams(updatedTeams);
			localStorage.setItem("mpesa_pes_teams_v6", JSON.stringify(updatedTeams));
			const storedStats = localStorage.getItem("mpesa_pes_stats_v6");
			if (storedStats) try {
				const stats = JSON.parse(storedStats);
				if (Array.isArray(stats)) {
					const updatedStats = stats.map((s) => {
						if (s.name === selectedPlayerName) return {
							...s,
							photoUrl: previewPhoto
						};
						return s;
					});
					localStorage.setItem("mpesa_pes_stats_v6", JSON.stringify(updatedStats));
				}
			} catch (e) {
				console.warn("Stats sync warning:", e);
			}
			window.dispatchEvent(new Event("storage"));
			setIsSubmitting(false);
			setUploadSuccess(true);
		} catch (e) {
			console.error("Error saving player photo:", e);
			setIsSubmitting(false);
			alert("Failed to save photo. Please try again.");
		}
	};
	const copyShareLink = () => {
		const shareUrl = `${window.location.origin}/upload-photo`;
		navigator.clipboard.writeText(shareUrl);
		setCopiedLink(true);
		setTimeout(() => setCopiedLink(false), 2500);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "max-w-3xl mx-auto space-y-8 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "bg-gradient-to-r from-[#0d0926] via-[#1a123f] to-[#0d0926] border border-[#2e2554] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40",
								children: "Official Player Self-Service Portal"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 190,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-emerald-400 font-mono font-bold flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 194,
									columnNumber: 17
								}, this), " Instant Live Sync"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 193,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 189,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "font-header text-3xl sm:text-4xl font-black text-white uppercase tracking-wider leading-none",
							children: "Player Profile Photo Upload"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 197,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs sm:text-sm text-gray-300 max-w-xl",
							children: "Student athletes: Select your club and name, then upload your official headshot. Once saved, your portrait immediately reflects across the Admin Personnel Module, Matchday Lineups, and Player Leaderboard!"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 200,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 188,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "shrink-0 flex sm:flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: copyShareLink,
						className: "bg-[#141029] hover:bg-[#1f1744] border border-[#2e2554] hover:border-[#00f0ff] text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-lg",
						title: "Copy link to share with players",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "w-4 h-4 text-[#00f0ff]" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 213,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: copiedLink ? "Link Copied!" : "Copy Share Link" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 214,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 208,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/league.html",
						className: "bg-gradient-to-r from-purple-600 to-[#e6007e] text-white px-3.5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Back to League Hub" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 220,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 221,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 216,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 207,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 187,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 186,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "bg-[#0e0a26]/95 border border-[#2e2554] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "block text-xs font-black uppercase text-gray-300 tracking-wider mb-2 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-4 h-4 text-[#00f0ff]" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 233,
							columnNumber: 15
						}, this), " 1. Select Your Club"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 232,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
						value: selectedTeamId,
						onChange: (e) => {
							const newId = Number(e.target.value);
							setSelectedTeamId(newId);
							const t = teams.find((item) => item.id === newId);
							if (t && t.squad && t.squad.length > 0) {
								setSelectedPlayerName(t.squad[0].name);
								setPreviewPhoto(t.squad[0].photoUrl || "");
							} else {
								setSelectedPlayerName("");
								setPreviewPhoto("");
							}
							setUploadSuccess(false);
						},
						className: "w-full bg-[#141029] border border-[#2e2554] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f0ff]",
						children: teams.map((team) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: team.id,
							children: [
								team.name,
								" (",
								team.shortCode,
								")"
							]
						}, team.id, true, {
							fileName: _jsxFileName$1,
							lineNumber: 253,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 235,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 231,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "block text-xs font-black uppercase text-gray-300 tracking-wider mb-2 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserCheck, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 262,
							columnNumber: 15
						}, this), " 2. Select Your Player Profile"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 261,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
						value: selectedPlayerName,
						onChange: (e) => handlePlayerChange(e.target.value),
						className: "w-full bg-[#141029] border border-[#2e2554] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f0ff]",
						children: currentSquad.map((player, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: player.name,
							children: [
								"#",
								player.number || idx + 1,
								" • ",
								player.name,
								" (",
								player.position || "Player",
								")"
							]
						}, idx, true, {
							fileName: _jsxFileName$1,
							lineNumber: 270,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 264,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 260,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 230,
					columnNumber: 9
				}, this),
				currentPlayer && /* @__PURE__ */ (void 0)("div", {
					className: "p-4 bg-[#141029] border border-[#2e2554] rounded-2xl flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md border border-white/20 shrink-0",
							style: { backgroundColor: currentTeam?.color || "#00f0ff" },
							children: ["#", currentPlayer.number || 10]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 282,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-extrabold text-base text-white",
								children: currentPlayer.name
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 290,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold",
								children: currentPlayer.position || "FWD"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 291,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 289,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "text-xs text-gray-400 font-mono",
							children: [
								currentPlayer.admissionNumber ? `ADM: ${currentPlayer.admissionNumber}` : "Student Athlete",
								" ",
								"• Foot: ",
								currentPlayer.foot || "Right"
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 295,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 288,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 281,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "text-right text-xs text-gray-400",
						children: [/* @__PURE__ */ (void 0)("span", {
							className: "block text-[10px] uppercase font-bold text-gray-500",
							children: "Club"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 305,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "font-bold text-[#00f0ff]",
							children: currentTeam?.name
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 306,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 304,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 280,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "block text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "w-4 h-4 text-purple-400" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 314,
							columnNumber: 13
						}, this), " 3. Upload Your Portrait Picture"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 313,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-6 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col items-center justify-center p-6 bg-[#070512] border border-[#2e2554] rounded-3xl space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] uppercase font-black tracking-wider text-gray-400",
									children: "Live Headshot Preview"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 320,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "relative w-36 h-36 rounded-3xl overflow-hidden border-2 border-[#00f0ff] shadow-xl shadow-cyan-500/20 bg-[#120d29] flex items-center justify-center",
									children: [previewPhoto ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: previewPhoto,
										alt: "Player Preview",
										className: "w-full h-full object-cover"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 326,
										columnNumber: 19
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-col items-center text-gray-500 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserCheck, { className: "w-10 h-10 text-gray-600" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 333,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] font-bold",
											children: "No Photo Yet"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 334,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 332,
										columnNumber: 19
									}, this), previewPhoto && /* @__PURE__ */ (void 0)("span", { className: "absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 339,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 324,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[11px] text-gray-400 font-mono text-center",
									children: [
										selectedPlayerName,
										" • #",
										currentPlayer?.number || 1
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 343,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 319,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "md:col-span-2 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "border-2 border-dashed border-[#2e2554] hover:border-[#00f0ff] rounded-3xl p-6 text-center cursor-pointer transition relative group bg-[#070512]/60",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/jpg",
									onChange: handleImageFile,
									className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 351,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-12 h-12 rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] mx-auto flex items-center justify-center group-hover:scale-110 transition",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "w-6 h-6" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 360,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 359,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-sm text-gray-200 font-extrabold",
											children: "Click to browse or drag & drop photo"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 362,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-gray-400",
											children: "Supports PNG, JPG, or WebP (headshot / portrait recommended)"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 365,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 358,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 350,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-[11px] font-bold text-gray-400 mb-1",
								children: "Or paste direct image URL:"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 372,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								value: previewPhoto.startsWith("data:") ? "" : previewPhoto,
								onChange: (e) => {
									setPreviewPhoto(e.target.value);
									setUploadSuccess(false);
								},
								placeholder: "https://example.com/photos/player-photo.jpg",
								className: "w-full bg-[#141029] border border-[#2e2554] rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-mono"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 375,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 371,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 349,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 317,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 312,
					columnNumber: 9
				}, this),
				uploadSuccess && /* @__PURE__ */ (void 0)("div", {
					className: "p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in duration-200",
					children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-5 h-5 text-emerald-400 shrink-0" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 393,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
						className: "block font-black text-white text-sm",
						children: "Profile Photo Updated Live!"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 395,
						columnNumber: 15
					}, this), "Your new picture has been synchronized across the admin personnel directory, player stats leaderboard, and club roster."] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 394,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 392,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-4 border-t border-[#2e2554] flex flex-col sm:flex-row items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-gray-400",
						children: "Changes save immediately to the official league roster and admin records."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 406,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: handleSavePhoto,
						disabled: isSubmitting || !previewPhoto,
						className: `w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xl ${!previewPhoto ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black hover:shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 419,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isSubmitting ? "Saving Photo..." : "Publish Official Profile Picture" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 420,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 410,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 405,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 228,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 184,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/upload-photo.tsx?tsr-split=component";
function UploadPhotoPage() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PlayerPhotoUploadPortal, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 4,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 3,
		columnNumber: 10
	}, this);
}
//#endregion
export { UploadPhotoPage as component };
