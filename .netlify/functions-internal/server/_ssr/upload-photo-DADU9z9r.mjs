import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Ct as Copy, Ft as Camera, Ot as CircleCheck, c as Upload, gt as ExternalLink, h as Sparkles, s as UserCheck, x as Shield } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-photo-DADU9z9r.js
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
		const defaultTeams = [
			{
				id: 1,
				name: "Samba Boys",
				shortCode: "SMB",
				color: "#00ff85",
				homePitch: "Samba Arena (School Lower Pitch)",
				squad: [
					{
						name: "Wokabi",
						number: 9,
						position: "FWD",
						foot: "Right",
						admissionNumber: "ADM-2024-0101",
						photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
					},
					{
						name: "Brian Mwangi",
						number: 7,
						position: "MID",
						foot: "Right",
						admissionNumber: "ADM-2024-0102",
						photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
					},
					{
						name: "Dan Kiprop",
						number: 1,
						position: "GK",
						foot: "Both",
						admissionNumber: "ADM-2024-0103",
						photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
					},
					{
						name: "Samuel Otieno",
						number: 4,
						position: "DEF",
						foot: "Right",
						admissionNumber: "ADM-2024-0104"
					},
					{
						name: "Faith Chemutai",
						number: 8,
						position: "MID",
						foot: "Left",
						admissionNumber: "ADM-2024-0105"
					},
					{
						name: "Victor Maina",
						number: 11,
						position: "FWD",
						foot: "Right",
						admissionNumber: "ADM-2024-0106"
					}
				]
			},
			{
				id: 2,
				name: "Grade 10 A",
				shortCode: "G10A",
				color: "#00f0ff",
				homePitch: "Academy Main Stadium",
				squad: [
					{
						name: "Emmanuel Kip",
						number: 9,
						position: "FWD",
						foot: "Left",
						admissionNumber: "ADM-2024-0201",
						photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
					},
					{
						name: "John Doe",
						number: 1,
						position: "GK",
						foot: "Right",
						admissionNumber: "ADM-2024-0202",
						photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
					},
					{
						name: "Bradley Barasa",
						number: 6,
						position: "DEF",
						foot: "Right",
						admissionNumber: "ADM-2024-0203"
					},
					{
						name: "George Ochieng",
						number: 8,
						position: "MID",
						foot: "Both",
						admissionNumber: "ADM-2024-0204"
					},
					{
						name: "Ryan Gitonga",
						number: 11,
						position: "FWD",
						foot: "Left",
						admissionNumber: "ADM-2024-0205"
					}
				]
			},
			{
				id: 3,
				name: "Grade 10 B",
				shortCode: "G10B",
				color: "#ffe600",
				homePitch: "Yellow Fortress Pitch B",
				squad: [
					{
						name: "Joshua Mutua",
						number: 5,
						position: "DEF",
						foot: "Right",
						admissionNumber: "ADM-2024-0301"
					},
					{
						name: "Ian Mercer",
						number: 10,
						position: "MID",
						foot: "Both",
						admissionNumber: "ADM-2024-0303"
					},
					{
						name: "Peter Kariuki",
						number: 1,
						position: "GK",
						foot: "Right",
						admissionNumber: "ADM-2024-0304"
					},
					{
						name: "Kelvin Njoroge",
						number: 7,
						position: "FWD",
						foot: "Right",
						admissionNumber: "ADM-2024-0305"
					}
				]
			},
			{
				id: 4,
				name: "DP 2 A",
				shortCode: "DP2A",
				color: "#ff0077",
				homePitch: "Senior DP Complex",
				squad: [
					{
						name: "Collins Wekesa",
						number: 8,
						position: "MID",
						foot: "Right",
						admissionNumber: "ADM-2023-0401"
					},
					{
						name: "Alex Rono",
						number: 11,
						position: "FWD",
						foot: "Left",
						admissionNumber: "ADM-2023-0403"
					},
					{
						name: "Timothy Cheruiyot",
						number: 1,
						position: "GK",
						foot: "Both",
						admissionNumber: "ADM-2023-0404"
					},
					{
						name: "Kelvin Korir",
						number: 9,
						position: "FWD",
						foot: "Right",
						admissionNumber: "ADM-2023-0406"
					}
				]
			},
			{
				id: 5,
				name: "DP 2 B",
				shortCode: "DP2B",
				color: "#a855f7",
				homePitch: "Purple Pitch Arena",
				squad: [
					{
						name: "Hassan Ali",
						number: 10,
						position: "MID",
						foot: "Both",
						admissionNumber: "ADM-2023-0501"
					},
					{
						name: "Rashid Mohamed",
						number: 6,
						position: "DEF",
						foot: "Right",
						admissionNumber: "ADM-2023-0503"
					},
					{
						name: "Brian Koech",
						number: 1,
						position: "GK",
						foot: "Right",
						admissionNumber: "ADM-2023-0504"
					},
					{
						name: "Caleb Kibet",
						number: 9,
						position: "FWD",
						foot: "Right",
						admissionNumber: "ADM-2023-0505"
					}
				]
			}
		];
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
								lineNumber: 392,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-emerald-400 font-mono font-bold flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 396,
									columnNumber: 17
								}, this), " Instant Live Sync"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 395,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 391,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "font-header text-3xl sm:text-4xl font-black text-white uppercase tracking-wider leading-none",
							children: "Player Profile Photo Upload"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 399,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs sm:text-sm text-gray-300 max-w-xl",
							children: "Student athletes: Select your club and name, then upload your official headshot. Once saved, your portrait immediately reflects across the Admin Personnel Module, Matchday Lineups, and Player Leaderboard!"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 402,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 390,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "shrink-0 flex sm:flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: copyShareLink,
						className: "bg-[#141029] hover:bg-[#1f1744] border border-[#2e2554] hover:border-[#00f0ff] text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-lg",
						title: "Copy link to share with players",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "w-4 h-4 text-[#00f0ff]" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 415,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: copiedLink ? "Link Copied!" : "Copy Share Link" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 416,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 410,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/league.html",
						className: "bg-gradient-to-r from-purple-600 to-[#e6007e] text-white px-3.5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Back to League Hub" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 422,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 423,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 418,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 409,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 389,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 388,
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
							lineNumber: 435,
							columnNumber: 15
						}, this), " 1. Select Your Club"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 434,
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
							lineNumber: 455,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 437,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 433,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "block text-xs font-black uppercase text-gray-300 tracking-wider mb-2 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserCheck, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 464,
							columnNumber: 15
						}, this), " 2. Select Your Player Profile"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 463,
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
							lineNumber: 472,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 466,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 462,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 432,
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
							lineNumber: 484,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-extrabold text-base text-white",
								children: currentPlayer.name
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 492,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold",
								children: currentPlayer.position || "FWD"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 493,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 491,
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
							lineNumber: 497,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 490,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 483,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "text-right text-xs text-gray-400",
						children: [/* @__PURE__ */ (void 0)("span", {
							className: "block text-[10px] uppercase font-bold text-gray-500",
							children: "Club"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 507,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "font-bold text-[#00f0ff]",
							children: currentTeam?.name
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 508,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 506,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 482,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "block text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "w-4 h-4 text-purple-400" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 516,
							columnNumber: 13
						}, this), " 3. Upload Your Portrait Picture"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 515,
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
									lineNumber: 522,
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
										lineNumber: 528,
										columnNumber: 19
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-col items-center text-gray-500 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserCheck, { className: "w-10 h-10 text-gray-600" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 535,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] font-bold",
											children: "No Photo Yet"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 536,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 534,
										columnNumber: 19
									}, this), previewPhoto && /* @__PURE__ */ (void 0)("span", { className: "absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 541,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 526,
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
									lineNumber: 545,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 521,
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
									lineNumber: 553,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-12 h-12 rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] mx-auto flex items-center justify-center group-hover:scale-110 transition",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "w-6 h-6" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 562,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 561,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-sm text-gray-200 font-extrabold",
											children: "Click to browse or drag & drop photo"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 564,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-gray-400",
											children: "Supports PNG, JPG, or WebP (headshot / portrait recommended)"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 567,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 560,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 552,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-[11px] font-bold text-gray-400 mb-1",
								children: "Or paste direct image URL:"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 574,
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
								lineNumber: 577,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 573,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 551,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 519,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 514,
					columnNumber: 9
				}, this),
				uploadSuccess && /* @__PURE__ */ (void 0)("div", {
					className: "p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in duration-200",
					children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-5 h-5 text-emerald-400 shrink-0" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 595,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
						className: "block font-black text-white text-sm",
						children: "Profile Photo Updated Live!"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 597,
						columnNumber: 15
					}, this), "Your new picture has been synchronized across the admin personnel directory, player stats leaderboard, and club roster."] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 596,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 594,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-4 border-t border-[#2e2554] flex flex-col sm:flex-row items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-gray-400",
						children: "Changes save immediately to the official league roster and admin records."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 608,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: handleSavePhoto,
						disabled: isSubmitting || !previewPhoto,
						className: `w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xl ${!previewPhoto ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black hover:shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 621,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isSubmitting ? "Saving Photo..." : "Publish Official Profile Picture" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 622,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 612,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 607,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 430,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 386,
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
