import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { Bt as ChevronLeft, C as Shield, F as RefreshCw, H as Pen, Ht as Check, It as CircleCheck, Lt as CircleAlert, Nt as Clock, Ot as Crown, Qt as ArrowRightLeft, W as PenLine, Wt as Calendar, Yt as Award, Zt as ArrowRight, _ as Sparkles, et as Lock, h as Star, ht as Flame, k as Search, n as X, o as Users, p as Trash2, st as Info, t as Zap, u as Trophy, z as Plus, zt as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as markTeamAsDeleted, r as isTeamDeleted, t as DEFAULT_FIXTURES } from "./fixturesData-BnrG_cg0.mjs";
import { n as getAllRegisteredPlayers, t as OFFICIAL_CLUBS_DATA } from "./teamSquadsData-CHaV0Ocp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FantasyTeamBuilder-Datm_fmm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/**
* Inbuilt Real-Time Database Engine & Synchronizer
* Connects Teams, Squad Players, Fixtures, Match Reports, and Standings
* Enforces permanent deletions ("once deleted, gone forever") and automatic
* real-time recalculation of standings from verified match reports.
*/
var STORAGE_KEYS = {
	TEAMS: "mpesa_pes_teams_v6",
	STANDINGS: "mpesa_pes_standings_v6",
	PLAYERS: "mpesa_pes_players_v6",
	DELETED_PLAYERS: "mpesa_pes_deleted_players_v6",
	FIXTURES: "mpesa_pes_matches_v6",
	DELETED_FIXTURES: "mpesa_pes_deleted_fixtures_v6",
	REPORTS: "mpesa_pes_matchreports_v1",
	TABLE_CLEARED: "mpesa_table_cleared_v6"
};
/**
* Dispatch real-time cross-tab & component update events
*/
function broadcastDbChange(tableName) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("mpesa_db_updated", { detail: { tableName } }));
	window.dispatchEvent(new CustomEvent("mpesa_standings_updated"));
	window.dispatchEvent(new CustomEvent("mpesa_matchsheet_updated"));
	window.dispatchEvent(new CustomEvent("mpesa_matchreport_saved"));
	window.dispatchEvent(new Event("storage"));
}
/**
* Load all active teams from database
*/
function getDbTeams() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.TEAMS);
		const tableCleared = localStorage.getItem(STORAGE_KEYS.TABLE_CLEARED) === "true";
		let teams = [];
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed) && parsed.length > 0) teams = parsed;
		}
		if (teams.length === 0) {
			teams = OFFICIAL_CLUBS_DATA.map((c) => ({
				id: c.id,
				name: c.name,
				shortCode: c.shortCode,
				color: c.color,
				homePitch: c.homePitch,
				coachName: c.coachName,
				assistantCoach: c.assistantCoach,
				captainName: c.squad.find((s) => s.isCaptain)?.name || "Team Captain",
				mp: 0,
				w: 0,
				d: 0,
				l: 0,
				gf: 0,
				ga: 0,
				gd: 0,
				pts: 0,
				squadCount: c.squad.length
			}));
			localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
			localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(teams));
		}
		const active = teams.filter((t) => !isTeamDeleted(t.id, t.name));
		if (tableCleared) return active.map((t) => ({
			...t,
			mp: 0,
			w: 0,
			d: 0,
			l: 0,
			gf: 0,
			ga: 0,
			gd: 0,
			pts: 0
		}));
		return active;
	} catch {
		return [];
	}
}
/**
* Save updated teams to database
*/
function saveDbTeams(teams) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
	localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(teams));
	broadcastDbChange("teams");
}
/**
* Permanently delete a team ("once deleted, gone forever")
*/
function permanentlyDeleteDbTeam(teamId, teamName) {
	markTeamAsDeleted(teamId, teamName);
	saveDbTeams(getDbTeams().filter((t) => t.id !== teamId));
	syncDeletedTeamToServer(teamId).catch(() => {});
}
/**
* Load all active players from database
*/
function getDbPlayers() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.PLAYERS);
		const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_PLAYERS);
		const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
		let players = [];
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed) && parsed.length > 0) players = parsed;
		}
		if (players.length === 0) {
			players = getAllRegisteredPlayers().map((p, pIdx) => ({
				id: p.id ?? p.teamId * 100 + (p.number || pIdx + 1),
				name: p.name,
				teamId: p.teamId,
				teamName: p.teamName,
				teamColor: p.teamColor,
				teamCode: p.teamCode,
				number: p.number,
				position: p.position,
				role: p.role,
				foot: p.foot,
				goals: 0,
				assists: 0,
				cleanSheets: p.position === "GK" ? 0 : 0,
				yellowCards: 0,
				redCards: 0
			}));
			localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
		}
		return players.filter((p) => !deletedIds.includes(p.id));
	} catch {
		return [];
	}
}
/**
* Save players list to database
*/
function saveDbPlayers(players) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
	broadcastDbChange("players");
}
/**
* Permanently delete a player ("once deleted, gone forever")
*/
function permanentlyDeleteDbPlayer(playerId) {
	if (typeof window === "undefined") return;
	try {
		const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_PLAYERS);
		const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
		if (!deletedIds.includes(playerId)) {
			deletedIds.push(playerId);
			localStorage.setItem(STORAGE_KEYS.DELETED_PLAYERS, JSON.stringify(deletedIds));
		}
		saveDbPlayers(getDbPlayers().filter((p) => p.id !== playerId));
	} catch {}
}
/**
* Load all active fixtures from database
*/
function getDbFixtures() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.FIXTURES);
		const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_FIXTURES);
		const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
		let fixtures = [];
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed) && parsed.length > 0) fixtures = parsed.map((f) => ({
				id: f.id,
				matchweek: f.matchweek || 1,
				homeId: f.homeId,
				awayId: f.awayId,
				homeTeamName: f.homeTeamName || f.homeTeam?.name || "Home",
				awayTeamName: f.awayTeamName || f.awayTeam?.name || "Away",
				homeScore: f.homeScore,
				awayScore: f.awayScore,
				date: f.date || "Sunday, Nov 1, 2026",
				time: f.time || "3:00 PM",
				venue: f.venue || "M-Pesa Academy Main Arena",
				status: f.status || "SCHEDULED",
				referee: f.referee,
				scorersSummary: f.scorers || f.scorersSummary || ""
			}));
		}
		if (fixtures.length === 0) {
			fixtures = DEFAULT_FIXTURES.map((f) => {
				const homeClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === f.homeId);
				const awayClub = OFFICIAL_CLUBS_DATA.find((c) => c.id === f.awayId);
				return {
					id: f.id,
					matchweek: f.matchweek,
					homeId: f.homeId,
					awayId: f.awayId,
					homeTeamName: homeClub?.name || `Club #${f.homeId}`,
					awayTeamName: awayClub?.name || `Club #${f.awayId}`,
					homeScore: f.homeScore,
					awayScore: f.awayScore,
					date: f.date,
					time: f.time,
					venue: f.venue,
					status: f.status || "SCHEDULED",
					referee: f.referee,
					scorersSummary: f.scorers || ""
				};
			});
			localStorage.setItem(STORAGE_KEYS.FIXTURES, JSON.stringify(fixtures));
		}
		return fixtures.filter((f) => !deletedIds.includes(f.id));
	} catch {
		return [];
	}
}
/**
* Save fixtures to database
*/
function saveDbFixtures(fixtures) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.FIXTURES, JSON.stringify(fixtures));
	broadcastDbChange("fixtures");
}
/**
* Permanently delete a fixture ("once deleted, gone forever")
*/
function permanentlyDeleteDbFixture(fixtureId) {
	if (typeof window === "undefined") return;
	try {
		const deletedRaw = localStorage.getItem(STORAGE_KEYS.DELETED_FIXTURES);
		const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
		if (!deletedIds.includes(fixtureId)) {
			deletedIds.push(fixtureId);
			localStorage.setItem(STORAGE_KEYS.DELETED_FIXTURES, JSON.stringify(deletedIds));
		}
		saveDbFixtures(getDbFixtures().filter((f) => f.id !== fixtureId));
	} catch {}
}
/**
* Load all submitted match reports from database
*/
function getDbMatchReports() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
/**
* Permanently delete a match report ("once deleted, gone forever")
*/
function permanentlyDeleteDbMatchReport(reportId) {
	if (typeof window === "undefined") return;
	try {
		const reports = getDbMatchReports().filter((r) => r.id !== reportId);
		localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
		broadcastDbChange("match_reports");
		recalculateStandingsFromReports();
	} catch {}
}
/**
* Hard Reset Standings Table to Absolute Zero (0-0-0-0, 0 Pts)
* Sets persistent flag so no stale cache can revive old points.
*/
function purgeStandingsTableToZero() {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEYS.TABLE_CLEARED, "true");
		const teams = getDbTeams().map((t) => ({
			...t,
			mp: 0,
			w: 0,
			d: 0,
			l: 0,
			gf: 0,
			ga: 0,
			gd: 0,
			pts: 0
		}));
		localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
		localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(teams));
		broadcastDbChange("standings");
	} catch {}
}
/**
* Recalculate Standings strictly based on submitted match reports and completed fixtures
* No bonus points, no fair-play point padding: Standard FIFA (Win=3, Draw=1, Loss=0)
*/
function recalculateStandingsFromReports() {
	if (typeof window === "undefined") return;
	try {
		const teams = getDbTeams();
		const reports = getDbMatchReports();
		const fixtures = getDbFixtures().filter((f) => f.status === "COMPLETED");
		const statsMap = {};
		teams.forEach((t) => {
			statsMap[t.id] = {
				mp: 0,
				w: 0,
				d: 0,
				l: 0,
				gf: 0,
				ga: 0,
				pts: 0
			};
		});
		const processedMatchIds = /* @__PURE__ */ new Set();
		reports.forEach((rep) => {
			processedMatchIds.add(rep.matchId);
			const homeTeam = teams.find((t) => t.name.toLowerCase() === rep.homeTeamName.toLowerCase() || t.id === rep.matchId);
			const awayTeam = teams.find((t) => t.name.toLowerCase() === rep.awayTeamName.toLowerCase());
			if (homeTeam && awayTeam && statsMap[homeTeam.id] && statsMap[awayTeam.id]) {
				const hId = homeTeam.id;
				const aId = awayTeam.id;
				const hs = Number(rep.homeScore) || 0;
				const as = Number(rep.awayScore) || 0;
				statsMap[hId].mp += 1;
				statsMap[aId].mp += 1;
				statsMap[hId].gf += hs;
				statsMap[hId].ga += as;
				statsMap[aId].gf += as;
				statsMap[aId].ga += hs;
				if (hs > as) {
					statsMap[hId].w += 1;
					statsMap[hId].pts += 3;
					statsMap[aId].l += 1;
				} else if (as > hs) {
					statsMap[aId].w += 1;
					statsMap[aId].pts += 3;
					statsMap[hId].l += 1;
				} else {
					statsMap[hId].d += 1;
					statsMap[hId].pts += 1;
					statsMap[aId].d += 1;
					statsMap[aId].pts += 1;
				}
			}
		});
		fixtures.forEach((fix) => {
			if (!processedMatchIds.has(fix.id)) {
				if (typeof fix.homeScore === "number" && typeof fix.awayScore === "number" && statsMap[fix.homeId] && statsMap[fix.awayId]) {
					const hId = fix.homeId;
					const aId = fix.awayId;
					const hs = fix.homeScore;
					const as = fix.awayScore;
					statsMap[hId].mp += 1;
					statsMap[aId].mp += 1;
					statsMap[hId].gf += hs;
					statsMap[hId].ga += as;
					statsMap[aId].gf += as;
					statsMap[aId].ga += hs;
					if (hs > as) {
						statsMap[hId].w += 1;
						statsMap[hId].pts += 3;
						statsMap[aId].l += 1;
					} else if (as > hs) {
						statsMap[aId].w += 1;
						statsMap[aId].pts += 3;
						statsMap[hId].l += 1;
					} else {
						statsMap[hId].d += 1;
						statsMap[hId].pts += 1;
						statsMap[aId].d += 1;
						statsMap[aId].pts += 1;
					}
				}
			}
		});
		const updated = teams.map((t) => {
			const s = statsMap[t.id] || {
				mp: 0,
				w: 0,
				d: 0,
				l: 0,
				gf: 0,
				ga: 0,
				pts: 0
			};
			return {
				...t,
				mp: s.mp,
				w: s.w,
				d: s.d,
				l: s.l,
				gf: s.gf,
				ga: s.ga,
				gd: s.gf - s.ga,
				pts: s.pts
			};
		});
		localStorage.removeItem(STORAGE_KEYS.TABLE_CLEARED);
		saveDbTeams(updated);
	} catch {}
}
/**
* Compute real-time Form (Last 5 matches) strictly from completed matches.
* If 0 matches played, returns empty [] (blank in UI).
*/
function computeTeamFormFromFixtures(teamId, fixtures) {
	if (!Array.isArray(fixtures) || fixtures.length === 0) return [];
	const completed = fixtures.filter((f) => {
		const s = String(f.status || "");
		return (s === "COMPLETED" || s === "FINISHED" || typeof f.homeScore === "number" && typeof f.awayScore === "number" && s !== "SCHEDULED" && s !== "POSTPONED" && s !== "UPCOMING") && (f.homeId === teamId || f.awayId === teamId);
	});
	completed.sort((a, b) => (a.matchweek || 0) - (b.matchweek || 0));
	const results = [];
	completed.forEach((f) => {
		if (typeof f.homeScore !== "number" || typeof f.awayScore !== "number") return;
		if (f.homeId === teamId) if (f.homeScore > f.awayScore) results.push("W");
		else if (f.homeScore < f.awayScore) results.push("L");
		else results.push("D");
		else if (f.awayId === teamId) if (f.awayScore > f.homeScore) results.push("W");
		else if (f.awayScore < f.homeScore) results.push("L");
		else results.push("D");
	});
	return results.slice(-5);
}
/**
* Push deleted team to portal API for transactional database synchronization
*/
async function syncDeletedTeamToServer(teamId, revision = 0) {
	if (typeof window === "undefined") return false;
	try {
		return (await fetch("/api/public/portal?action=delete-team", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				teamId,
				revision
			})
		})).ok;
	} catch {
		return false;
	}
}
/**
* Fetch authoritative shared league state from Supabase portal API
*/
async function fetchSharedLeagueState() {
	if (typeof window === "undefined") return false;
	try {
		const res = await fetch("/api/public/portal?action=state", { cache: "no-store" });
		if (!res.ok) return false;
		const body = await res.json();
		if (!body || !body.data) return false;
		const data = body.data;
		const deletedIds = Array.isArray(body.deleted_team_ids) ? body.deleted_team_ids : [];
		for (const did of deletedIds) markTeamAsDeleted(did, `Team #${did}`);
		let changed = false;
		if (Array.isArray(data.teams) && data.teams.length > 0) {
			const activeTeams = data.teams.filter((t) => !deletedIds.includes(t.id) && !isTeamDeleted(t.id, t.name));
			localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(activeTeams));
			localStorage.setItem(STORAGE_KEYS.STANDINGS, JSON.stringify(activeTeams));
			changed = true;
		}
		if (Array.isArray(data.matches) && data.matches.length > 0) {
			const activeMatches = data.matches.filter((m) => !deletedIds.includes(m.homeId) && !deletedIds.includes(m.awayId));
			localStorage.setItem(STORAGE_KEYS.FIXTURES, JSON.stringify(activeMatches));
			changed = true;
		}
		if (Array.isArray(data.playerStatsList) && data.playerStatsList.length > 0) {
			localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(data.playerStatsList));
			changed = true;
		}
		if (body.revision) localStorage.setItem("mpesa_shared_revision_v1", String(body.revision));
		if (changed) broadcastDbChange("all");
		return true;
	} catch {
		return false;
	}
}
var _jsxFileName$4 = "/app/applet/src/components/MatchweekSelector.tsx";
/**
* Reusable Matchweek Selector Component
* Allows users to toggle between different game weeks to view stats, fixtures,
* and fantasy leaderboards specific to that week.
* Matches the official FPL / eFootball top navigation bar design.
*/
function MatchweekSelector({ currentWeek, totalWeeks = 10, onSelectWeek, deadlineDate = "Sunday 17:00", isDeadlinePassed = false, className = "" }) {
	const [showDropdown, setShowDropdown] = (0, import_react.useState)(false);
	const canGoPrev = currentWeek > 1;
	const canGoNext = currentWeek < totalWeeks;
	const handlePrev = () => {
		if (canGoPrev) onSelectWeek(currentWeek - 1);
	};
	const handleNext = () => {
		if (canGoNext) onSelectWeek(currentWeek + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `w-full flex items-center justify-between py-2.5 px-3 sm:px-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md relative select-none ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				onClick: handlePrev,
				disabled: !canGoPrev,
				"aria-label": "Previous Gameweek",
				className: `px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${canGoPrev ? "bg-white text-gray-900 hover:bg-gray-100 hover:shadow active:scale-95 border border-gray-200" : "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5 opacity-40"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronLeft, { className: "w-4 h-4 stroke-[2.5]" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 56,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden xs:inline",
					children: "Previous"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 57,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 45,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setShowDropdown(!showDropdown),
					className: "flex items-center gap-2 group cursor-pointer focus:outline-none",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-header text-lg sm:text-2xl font-black text-white tracking-wide uppercase group-hover:text-cyan-400 transition",
								children: ["Gameweek ", currentWeek]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 69,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-gray-400 group-hover:text-gray-300",
								children: "▼"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 72,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 68,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-gray-300",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "w-3 h-3 text-cyan-400" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 75,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isDeadlinePassed ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-rose-400 font-bold",
								children: "Deadline Passed"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 78,
								columnNumber: 19
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Deadline: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-amber-300 font-mono",
								children: deadlineDate
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 80,
								columnNumber: 35
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 80,
								columnNumber: 19
							}, this) }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 76,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 74,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 67,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 62,
					columnNumber: 9
				}, this), showDropdown && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("div", {
					className: "fixed inset-0 z-40",
					onClick: () => setShowDropdown(false)
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 90,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#0d0926] border border-[#382b6b] rounded-2xl shadow-2xl p-2.5 w-64 animate-in fade-in zoom-in-95",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "text-[10px] uppercase font-bold text-gray-400 px-2 pb-1.5 border-b border-white/10 flex items-center justify-between",
						children: [/* @__PURE__ */ (void 0)("span", { children: "Jump to Gameweek" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 96,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "text-cyan-400",
							children: ["1 to ", totalWeeks]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 97,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 95,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-5 gap-1.5 mt-2",
						children: Array.from({ length: totalWeeks }, (_, i) => i + 1).map((gw) => /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => {
								onSelectWeek(gw);
								setShowDropdown(false);
							},
							className: `py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${gw === currentWeek ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-md shadow-cyan-500/30 scale-105" : "bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/5"}`,
							children: ["GW", gw]
						}, gw, true, {
							fileName: _jsxFileName$4,
							lineNumber: 101,
							columnNumber: 19
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 99,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 94,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 89,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				onClick: handleNext,
				disabled: !canGoNext,
				"aria-label": "Next Gameweek",
				className: `px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${canGoNext ? "bg-white text-gray-900 hover:bg-gray-100 hover:shadow active:scale-95 border border-gray-200" : "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5 opacity-40"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden xs:inline",
					children: "Next"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 135,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "w-4 h-4 stroke-[2.5]" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 136,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 124,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 41,
		columnNumber: 5
	}, this);
}
/**
* Fantasy MSL (MSL Fantasy Football) Engine
* Virtual management game based on real-world M-Pesa Sunday League matches.
* 
* Rules:
* - Fixed £100.0m Virtual Budget
* - 15-Player Squad: 2 GK, 5 DEF, 5 MID, 3 FWD
* - Starting 11 + 4 Bench
* - Maximum 2 players per real-world MSL club
* - Valid Formations: At least 1 GK, 3 DEF, 2 MID, 1 FWD
* - Captain (2x points) & Vice-Captain
* - Special Chips: Wildcard, Triple Captain (3x), Bench Boost, Free Hit
* - Realistic FIFA/FPL point matrix (Goals by pos, assists, clean sheets, saves, cards)
*/
var DEFAULT_GAMEWEEK_CHALLENGES = {
	1: {
		gameweek: 1,
		title: "Championship Kickoff",
		description: "Earn +2 points for every clean sheet kept and +3 points for team captains who score first in the opening round. Maximum 3 players per club.",
		badgeText: "Season Opener",
		specialBonus: "+2 Clean Sheet Bonus"
	},
	2: {
		gameweek: 2,
		title: "Academy Derby Clásico",
		description: "Double bonus points (+4) for midfielders providing assists from open play in local rivalry fixtures. Maximum 3 players per club.",
		badgeText: "Rivalry Round",
		specialBonus: "Double Assist Points"
	},
	3: {
		gameweek: 3,
		title: "Tactical Masterclass",
		description: "Defenders who complete 90 minutes without conceding a goal or receiving cards receive +3 tactical bonus points. Maximum 3 players per club.",
		badgeText: "Defensive Fortress",
		specialBonus: "+3 Discipline Points"
	},
	4: {
		gameweek: 4,
		title: "Midfield Maestros",
		description: "All midfielders receive +1 point for every 3 successful key passes and +5 points for outside-the-box goals. Maximum 3 players per club.",
		badgeText: "Playmaker Focus",
		specialBonus: "+5 Long Range Goals"
	},
	5: {
		gameweek: 5,
		title: "Golden Boot Sprint",
		description: "Forwards earn +6 points per goal (boosted from +4) and an extra +3 bonus for hat-tricks. Maximum 3 players per club.",
		badgeText: "Striker Surge",
		specialBonus: "+6 Forward Goals"
	},
	10: {
		gameweek: 10,
		title: "Spectacular",
		description: "Your players earn +1 point for every shot on target from outside the penalty area and +5 points for every goal scored from outside the penalty area. Maximum 3 players per club. Unlimited budget.",
		badgeText: "Spectacular",
		specialBonus: "+5 Long Range Goals"
	}
};
var GW_CHALLENGES_STORAGE_KEY = "mpesa_fantasy_gw_challenges_v1";
function getGameweekChallenge(gameweek) {
	if (typeof window !== "undefined") try {
		const stored = localStorage.getItem(GW_CHALLENGES_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (parsed[gameweek]) return parsed[gameweek];
		}
	} catch {}
	return DEFAULT_GAMEWEEK_CHALLENGES[gameweek] || {
		gameweek,
		title: `Gameweek ${gameweek} Challenge`,
		description: `Compete for maximum matchweek points under certified MSL rules. Maximum 3 players per club.`,
		badgeText: `GW${gameweek}`,
		specialBonus: "Standard Rules"
	};
}
function saveGameweekChallenge(challenge) {
	if (typeof window === "undefined") return;
	try {
		let all = { ...DEFAULT_GAMEWEEK_CHALLENGES };
		const stored = localStorage.getItem(GW_CHALLENGES_STORAGE_KEY);
		if (stored) all = {
			...all,
			...JSON.parse(stored)
		};
		all[challenge.gameweek] = {
			...challenge,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		localStorage.setItem(GW_CHALLENGES_STORAGE_KEY, JSON.stringify(all));
		window.dispatchEvent(new CustomEvent("mpesa_fantasy_challenge_updated", { detail: challenge }));
	} catch {}
}
var ADMIN_RATINGS_STORAGE_KEY = "mpesa_fantasy_admin_ratings_v2";
function getAdminPlayerRatings(matchweek) {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(ADMIN_RATINGS_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (matchweek) {
				const filtered = {};
				Object.entries(parsed).forEach(([key, val]) => {
					if (val && (val.matchweek === matchweek || key.startsWith(`gw${matchweek}_`))) filtered[val.playerId] = val;
				});
				if (Object.keys(filtered).length > 0) return filtered;
			}
			return parsed;
		}
	} catch {}
	return {};
}
function saveAdminPlayerRating(rating) {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(ADMIN_RATINGS_STORAGE_KEY);
		const current = raw ? JSON.parse(raw) : {};
		current[rating.playerId] = rating;
		if (rating.matchweek) current[`gw${rating.matchweek}_p${rating.playerId}`] = rating;
		localStorage.setItem(ADMIN_RATINGS_STORAGE_KEY, JSON.stringify(current));
		window.dispatchEvent(new CustomEvent("mpesa_fantasy_ratings_updated", { detail: rating }));
	} catch {}
}
function generateFantasyMarket(customRatings, matchweek) {
	const dbPlayers = getDbPlayers();
	const dbTeams = getDbTeams().filter((t) => !isTeamDeleted(t.id, t.name));
	const teamColorMap = {};
	dbTeams.forEach((t) => {
		teamColorMap[t.id] = {
			name: t.name,
			code: t.shortCode,
			color: t.color
		};
	});
	const clubMap = {
		1: {
			name: "Samba",
			code: "SAM",
			color: "#00ff85"
		},
		6: {
			name: "Royal Rangers",
			code: "RR",
			color: "#3b82f6"
		},
		7: {
			name: "Young Stars City",
			code: "YSC",
			color: "#f97316"
		},
		8: {
			name: "Mzinga Boyz",
			code: "MZB",
			color: "#eab308"
		},
		...teamColorMap
	};
	const registeredSource = dbPlayers.length > 0 ? dbPlayers.filter((p) => !isTeamDeleted(p.teamId, p.teamName)) : getAllRegisteredPlayers().filter((p) => !isTeamDeleted(p.teamId, p.teamName));
	const adminRatings = customRatings || getAdminPlayerRatings(matchweek);
	return registeredSource.map((p, idx) => {
		const playerId = p.id || p.teamId * 100 + (p.number || idx + 1);
		const club = clubMap[p.teamId] || {
			name: p.teamName || "Club",
			code: p.teamCode || "CLB",
			color: p.teamColor || "#00f0ff"
		};
		let rawPrice = 5;
		if (p.position === "FWD") rawPrice = p.isCaptain ? 8.5 : 6.5 + idx % 3 * .5;
		else if (p.position === "MID") rawPrice = p.isCaptain ? 7.5 : 5.5 + idx % 4 * .5;
		else if (p.position === "DEF") rawPrice = p.isCaptain ? 6 : 4.5 + idx % 3 * .5;
		else if (p.position === "GK") rawPrice = idx % 2 === 0 ? 5.5 : 4.5;
		const price = Math.min(Number(rawPrice.toFixed(1)), 8.8);
		const adminData = (matchweek ? adminRatings[`gw${matchweek}_p${playerId}`] : void 0) || adminRatings[playerId];
		const isRatedByAdmin = Boolean(adminData && typeof adminData.matchRating === "number");
		const matchRating = isRatedByAdmin ? adminData.matchRating : void 0;
		const adminBonus = isRatedByAdmin ? adminData.bonusPoints || 0 : 0;
		const goals = adminData?.goalsScored ?? p.goals ?? 0;
		const assists = adminData?.assistsLogged ?? p.assists ?? 0;
		const cleanSheets = (adminData?.cleanSheetLogged ? 1 : p.cleanSheets) ?? 0;
		const saves = p.saves ?? (p.position === "GK" ? 4 : 0);
		let gameweekPoints = 0;
		if (isRatedByAdmin && matchRating !== void 0) gameweekPoints = Math.round(matchRating * 2) + adminBonus + goals * (p.position === "FWD" ? 4 : 5) + assists * 3 + cleanSheets * 4 + Math.floor(saves / 3);
		else if (customRatings && adminData?.matchRating) gameweekPoints = Math.round(adminData.matchRating * 2) + adminBonus;
		const totalPoints = gameweekPoints + goals * 4 + assists * 3;
		const form = isRatedByAdmin && matchRating !== void 0 ? matchRating : Number((6.5 + idx % 4 * .4).toFixed(1));
		return {
			id: playerId,
			name: p.name,
			clubId: p.teamId,
			clubName: club.name,
			clubShortCode: club.code,
			clubColor: club.color,
			position: p.position,
			price,
			jerseyNumber: p.number,
			totalPoints,
			gameweekPoints,
			isRatedByAdmin,
			adminRating: matchRating,
			adminBonusPoints: adminBonus,
			goals,
			assists,
			cleanSheets,
			saves,
			yellowCards: p.yellowCards || 0,
			redCards: p.redCards || 0,
			form,
			selectedPercent: Number((14 + idx % 7 * 4.2).toFixed(1))
		};
	});
}
/**
* Validate Formation:
* Must have exactly 11 starting players:
* - Exactly 1 Goalkeeper
* - At least 3 Defenders (Max 5)
* - At least 2 Midfielders (Max 5)
* - At least 1 Forward (Max 3)
*/
function validateFormation(starters) {
	const gkCount = starters.filter((p) => p.position === "GK").length;
	const defCount = starters.filter((p) => p.position === "DEF").length;
	const midCount = starters.filter((p) => p.position === "MID").length;
	const fwdCount = starters.filter((p) => p.position === "FWD").length;
	const total = starters.length;
	const formationName = `${defCount}-${midCount}-${fwdCount}`;
	if (total !== 11) return {
		isValid: false,
		gkCount,
		defCount,
		midCount,
		fwdCount,
		formationName,
		errorMessage: `Starting 11 incomplete: ${total}/11 selected.`
	};
	if (gkCount !== 1) return {
		isValid: false,
		gkCount,
		defCount,
		midCount,
		fwdCount,
		formationName,
		errorMessage: `Must field exactly 1 Goalkeeper (Currently ${gkCount}).`
	};
	if (defCount < 3 || defCount > 5) return {
		isValid: false,
		gkCount,
		defCount,
		midCount,
		fwdCount,
		formationName,
		errorMessage: `Defenders must be between 3 and 5 (Currently ${defCount}).`
	};
	if (midCount < 2 || midCount > 5) return {
		isValid: false,
		gkCount,
		defCount,
		midCount,
		fwdCount,
		formationName,
		errorMessage: `Midfielders must be between 2 and 5 (Currently ${midCount}).`
	};
	if (fwdCount < 1 || fwdCount > 3) return {
		isValid: false,
		gkCount,
		defCount,
		midCount,
		fwdCount,
		formationName,
		errorMessage: `Forwards must be between 1 and 3 (Currently ${fwdCount}).`
	};
	return {
		isValid: true,
		gkCount,
		defCount,
		midCount,
		fwdCount,
		formationName
	};
}
/**
* Check Maximum 3-Players Per Club Rule
*/
function checkClubLimit(squad, maxPerClub = 3) {
	const clubCounts = {};
	const violatedClubs = [];
	squad.forEach((p) => {
		clubCounts[p.clubName] = (clubCounts[p.clubName] || 0) + 1;
	});
	Object.entries(clubCounts).forEach(([club, count]) => {
		if (count > maxPerClub) violatedClubs.push(`${club} (${count}/${maxPerClub})`);
	});
	return {
		isCompliant: violatedClubs.length === 0,
		clubCounts,
		violatedClubs
	};
}
/**
* Generate default seed fantasy squad conforming to £100m budget and club quota rules
*/
function getDefaultFantasySquad(market, maxPerClub = 4) {
	const squad = [];
	const clubCount = {};
	const canAdd = (p) => {
		return (clubCount[p.clubId] || 0) < maxPerClub;
	};
	const addPlayer = (p, isStarter, benchIdx) => {
		squad.push({
			...p,
			isStarter,
			benchIndex: benchIdx
		});
		clubCount[p.clubId] = (clubCount[p.clubId] || 0) + 1;
	};
	const gks = market.filter((p) => p.position === "GK");
	for (const gk of gks) if (squad.filter((p) => p.position === "GK").length === 0 && canAdd(gk)) addPlayer(gk, true);
	else if (squad.filter((p) => p.position === "GK").length === 1 && canAdd(gk)) {
		addPlayer(gk, false, 0);
		break;
	}
	const defs = market.filter((p) => p.position === "DEF");
	for (const def of defs) {
		const currentDefs = squad.filter((p) => p.position === "DEF");
		if (currentDefs.length < 4 && canAdd(def)) addPlayer(def, true);
		else if (currentDefs.length === 4 && canAdd(def)) {
			addPlayer(def, false, 1);
			if (squad.filter((p) => p.position === "DEF").length === 5) break;
		}
	}
	const mids = market.filter((p) => p.position === "MID");
	for (const mid of mids) {
		const currentMids = squad.filter((p) => p.position === "MID");
		if (currentMids.length < 4 && canAdd(mid)) addPlayer(mid, true);
		else if (currentMids.length === 4 && canAdd(mid)) {
			addPlayer(mid, false, 2);
			if (squad.filter((p) => p.position === "MID").length === 5) break;
		}
	}
	const fwds = market.filter((p) => p.position === "FWD");
	for (const fwd of fwds) {
		const currentFwds = squad.filter((p) => p.position === "FWD");
		if (currentFwds.length < 2 && canAdd(fwd)) addPlayer(fwd, true);
		else if (currentFwds.length === 2 && canAdd(fwd)) {
			addPlayer(fwd, false, 3);
			if (squad.filter((p) => p.position === "FWD").length === 3) break;
		}
	}
	if (squad.length > 0) {
		const starters = squad.filter((p) => p.isStarter);
		if (starters[0]) starters[0].isCaptain = true;
		if (starters[1]) starters[1].isViceCaptain = true;
	}
	return squad;
}
var DEFAULT_CHIPS = {
	wildcard: {
		id: "wildcard",
		name: "Wildcard",
		description: "Make unlimited free transfers for a Gameweek to permanently overhaul your squad.",
		isAvailable: true,
		isActiveThisGameweek: false
	},
	triple_captain: {
		id: "triple_captain",
		name: "Triple Captain",
		description: "Triples (3x) your captain's score for one Gameweek instead of the usual double.",
		isAvailable: true,
		isActiveThisGameweek: false
	},
	bench_boost: {
		id: "bench_boost",
		name: "Bench Boost",
		description: "Allows all 4 bench players to score points alongside your starting 11 for one Gameweek.",
		isAvailable: true,
		isActiveThisGameweek: false
	},
	free_hit: {
		id: "free_hit",
		name: "Free Hit",
		description: "Make unlimited transfers for one Gameweek, after which your squad reverts to its exact previous setup.",
		isAvailable: true,
		isActiveThisGameweek: false
	}
};
var DEFAULT_PUBLIC_LEAGUE_ENTRIES = {
	id: "global-overall",
	name: "Overall Public League (All MSL Managers)",
	code: "MSL-GLOBAL",
	type: "classic",
	creator: "MSL Executive Secretariat",
	createdAt: "2026-09-01",
	membersCount: 8,
	entries: [
		{
			rank: 1,
			managerName: "Austin Brian Omondi",
			teamName: "Samba Galácticos",
			gameweekPoints: 68,
			totalPoints: 245,
			chipActive: "None",
			gameweekScores: {
				1: 48,
				2: 44,
				3: 42,
				4: 43,
				5: 68
			}
		},
		{
			rank: 2,
			managerName: "Levis Wanyama",
			teamName: "Royal Ranger Elite",
			gameweekPoints: 61,
			totalPoints: 238,
			chipActive: "None",
			gameweekScores: {
				1: 45,
				2: 46,
				3: 44,
				4: 42,
				5: 61
			}
		},
		{
			rank: 3,
			managerName: "You (Your Squad)",
			teamName: "M-Pesa Academy XI",
			gameweekPoints: 59,
			totalPoints: 231,
			chipActive: "None",
			gameweekScores: {
				1: 42,
				2: 43,
				3: 45,
				4: 42,
				5: 59
			}
		},
		{
			rank: 4,
			managerName: "George Victor Kibet",
			teamName: "Tactical Counterpress FC",
			gameweekPoints: 54,
			totalPoints: 224,
			chipActive: "None",
			gameweekScores: {
				1: 44,
				2: 42,
				3: 43,
				4: 41,
				5: 54
			}
		},
		{
			rank: 5,
			managerName: "Mitchelle Muthoni",
			teamName: "Golden Whistle United",
			gameweekPoints: 49,
			totalPoints: 216,
			chipActive: "None",
			gameweekScores: {
				1: 40,
				2: 42,
				3: 41,
				4: 44,
				5: 49
			}
		},
		{
			rank: 6,
			managerName: "Bidan Mwaura",
			teamName: "Clean Sheet Crusaders",
			gameweekPoints: 47,
			totalPoints: 209,
			chipActive: "None",
			gameweekScores: {
				1: 41,
				2: 39,
				3: 40,
				4: 42,
				5: 47
			}
		},
		{
			rank: 7,
			managerName: "Tonny Odundo",
			teamName: "Disciplinary Dominators",
			gameweekPoints: 42,
			totalPoints: 198,
			chipActive: "None",
			gameweekScores: {
				1: 38,
				2: 39,
				3: 39,
				4: 40,
				5: 42
			}
		},
		{
			rank: 8,
			managerName: "Alex Haro",
			teamName: "Presidential Strikers",
			gameweekPoints: 38,
			totalPoints: 185,
			chipActive: "None",
			gameweekScores: {
				1: 36,
				2: 37,
				3: 36,
				4: 38,
				5: 38
			}
		}
	]
};
/**
* Return Gameweek Leaderboard sorted strictly by the points earned in that specific matchweek
*/
function getGameweekLeaderboard(entries, matchweek) {
	return [...entries].map((e) => {
		const gwPts = e.gameweekScores?.[matchweek] ?? e.gameweekPoints;
		return {
			...e,
			gameweekPoints: gwPts
		};
	}).sort((a, b) => b.gameweekPoints - a.gameweekPoints).map((entry, idx) => ({
		...entry,
		rank: idx + 1
	}));
}
/**
* Return Overall Season Leaderboard sorted by the cumulative sum of all weeks played
*/
function getOverallSeasonLeaderboard(entries, maxWeek = 5) {
	return [...entries].map((e) => {
		let sum = 0;
		if (e.gameweekScores) {
			for (let w = 1; w <= maxWeek; w++) if (typeof e.gameweekScores[w] === "number") sum += e.gameweekScores[w];
		} else sum = e.totalPoints;
		return {
			...e,
			totalPoints: sum
		};
	}).sort((a, b) => b.totalPoints - a.totalPoints).map((entry, idx) => ({
		...entry,
		rank: idx + 1
	}));
}
var _jsxFileName$3 = "/app/applet/src/components/JoinMiniLeagueModal.tsx";
var MINI_LEAGUES_STORAGE_KEY$1 = "fantasy_msl_minileagues_real_v3";
function JoinMiniLeagueModal({ isOpen, onClose, userSquadName = "M-Pesa Academy XI", userGameweekPoints = 59, userTotalPoints = 231, onJoinSuccess }) {
	const [codeInput, setCodeInput] = (0, import_react.useState)("");
	const [isValidating, setIsValidating] = (0, import_react.useState)(false);
	const [foundLeague, setFoundLeague] = (0, import_react.useState)(null);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [isSuccess, setIsSuccess] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const getPersistedLeagues = () => {
		if (typeof window === "undefined") return [];
		try {
			const raw = localStorage.getItem(MINI_LEAGUES_STORAGE_KEY$1);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			}
		} catch {}
		return [];
	};
	const handleValidateCode = (e) => {
		e.preventDefault();
		setErrorMessage(null);
		setFoundLeague(null);
		const cleanCode = codeInput.trim().toUpperCase();
		if (!cleanCode) {
			setErrorMessage("Please enter a valid mini-league code.");
			return;
		}
		setIsValidating(true);
		setTimeout(() => {
			const target = getPersistedLeagues().find((l) => l.code.toUpperCase() === cleanCode);
			if (!target) {
				setErrorMessage(`League code "${cleanCode}" was not found in the official database. Please verify the code with your league commissioner.`);
				setIsValidating(false);
				return;
			}
			if (target.entries.some((entry) => entry.managerName.toLowerCase().includes("you") || entry.teamName === userSquadName)) {
				setErrorMessage(`You are already a member of "${target.name}". Check your active standings in the leagues tab.`);
				setIsValidating(false);
				return;
			}
			setFoundLeague(target);
			setIsValidating(false);
		}, 250);
	};
	const handleConfirmJoin = () => {
		if (!foundLeague) return;
		try {
			const allLeagues = getPersistedLeagues();
			const newEntry = {
				rank: foundLeague.entries.length + 1,
				managerName: "You (Your Squad)",
				teamName: userSquadName,
				gameweekPoints: userGameweekPoints,
				totalPoints: userTotalPoints,
				gameweekScores: {}
			};
			const updatedEntries = [...foundLeague.entries, newEntry].sort((a, b) => b.totalPoints - a.totalPoints);
			const updatedLeague = {
				...foundLeague,
				membersCount: foundLeague.membersCount + 1,
				entries: updatedEntries.map((item, idx) => ({
					...item,
					rank: idx + 1
				}))
			};
			const updatedAllLeagues = allLeagues.map((l) => l.id === updatedLeague.id ? updatedLeague : l);
			localStorage.setItem(MINI_LEAGUES_STORAGE_KEY$1, JSON.stringify(updatedAllLeagues));
			window.dispatchEvent(new CustomEvent("mpesa_fantasy_leagues_updated", { detail: updatedLeague }));
			window.dispatchEvent(new Event("storage"));
			setIsSuccess(true);
			setTimeout(() => {
				onJoinSuccess(updatedLeague);
				handleClose();
			}, 1200);
		} catch {
			setErrorMessage("Failed to join league. Please try again.");
		}
	};
	const handleClose = () => {
		setCodeInput("");
		setFoundLeague(null);
		setErrorMessage(null);
		setIsSuccess(false);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "bg-[#0b1222] border-2 border-cyan-400 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: handleClose,
					className: "absolute top-5 right-5 text-slate-400 hover:text-white transition",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "w-5 h-5" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 161,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 157,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3 mb-4 pb-3 border-b border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-[#00f0ff]",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "w-6 h-6" }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 167,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 166,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						className: "text-lg font-black text-white",
						children: "Join Private Mini-League"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 170,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-slate-400",
						children: "Enter your invitation code to verify and enter the league."
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 171,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 169,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 165,
					columnNumber: 9
				}, this),
				isSuccess && foundLeague ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "p-6 text-center space-y-3 bg-[#00ff85]/10 border border-[#00ff85]/30 rounded-2xl my-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-10 h-10 text-[#00ff85] mx-auto animate-bounce" }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 180,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "text-base font-black text-white",
							children: "Joined Successfully!"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 181,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-slate-300",
							children: [
								"Your squad ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: userSquadName }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 183,
									columnNumber: 26
								}, this),
								" is now competing in",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-[#00ff85]",
									children: foundLeague.name
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 184,
									columnNumber: 15
								}, this),
								"."
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 182,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 179,
					columnNumber: 11
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
							onSubmit: handleValidateCode,
							className: "space-y-3",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "text-xs font-bold text-slate-300 block mb-1",
								children: "Unique League Code"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 192,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "text",
									required: true,
									autoFocus: true,
									placeholder: "e.g. ACA-101 or MSL-782",
									value: codeInput,
									onChange: (e) => {
										setCodeInput(e.target.value.toUpperCase());
										if (errorMessage) setErrorMessage(null);
										if (foundLeague) setFoundLeague(null);
									},
									className: "w-full px-4 py-2.5 bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl text-sm font-mono text-white tracking-wider outline-none transition uppercase"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 196,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "submit",
									disabled: isValidating || !codeInput.trim(),
									className: "absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition disabled:opacity-50 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 214,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isValidating ? "Checking..." : "Verify" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 215,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 209,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 195,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 191,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 190,
							columnNumber: 13
						}, this),
						errorMessage && /* @__PURE__ */ (void 0)("div", {
							className: "p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in",
							children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-4 h-4 shrink-0 text-red-400 mt-0.5" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 224,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "leading-relaxed",
								children: errorMessage
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 225,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 223,
							columnNumber: 15
						}, this),
						foundLeague && /* @__PURE__ */ (void 0)("div", {
							className: "p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/50 space-y-3 animate-in fade-in",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-[#00f0ff] border border-cyan-400/30 text-[10px] font-black uppercase",
										children: "League Verified in Database"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 233,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-mono text-white font-bold",
										children: foundLeague.code
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 236,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 232,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h4", {
									className: "text-base font-black text-white",
									children: foundLeague.name
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 240,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "text-xs text-slate-300 mt-1 flex flex-wrap gap-x-4 gap-y-1",
									children: [
										/* @__PURE__ */ (void 0)("span", { children: ["Format: ", /* @__PURE__ */ (void 0)("strong", {
											className: "text-white capitalize",
											children: foundLeague.type.replace("_", " ")
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 242,
											columnNumber: 35
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 242,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: ["Created by: ", /* @__PURE__ */ (void 0)("strong", {
											className: "text-white",
											children: foundLeague.creator
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 243,
											columnNumber: 39
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 243,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: ["Members: ", /* @__PURE__ */ (void 0)("strong", {
											className: "text-[#00ff85]",
											children: foundLeague.membersCount
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 244,
											columnNumber: 36
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 244,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 241,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 239,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "pt-2 border-t border-white/10 flex items-center justify-end gap-2",
									children: [/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setFoundLeague(null),
										className: "px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition",
										children: "Cancel"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 249,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: handleConfirmJoin,
										className: "px-4 py-2 rounded-xl bg-[#00ff85] hover:bg-[#00ff85]/90 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-[#00ff85]/20",
										children: [/* @__PURE__ */ (void 0)("span", { children: "Confirm & Enter League" }, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 261,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)(ArrowRight, { className: "w-3.5 h-3.5" }, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 262,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 256,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 248,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 231,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 188,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 156,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 155,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/FantasyTeamSelection.tsx";
function FantasyTeamSelection({ initialGameweek = 10, onSaved, className = "" }) {
	const [selectedGameweek, setSelectedGameweek] = (0, import_react.useState)(initialGameweek);
	const [teamName, setTeamName] = (0, import_react.useState)("Zenvior");
	const [managerName, setManagerName] = (0, import_react.useState)("Tonnie Mark");
	const [isEditingTeamName, setIsEditingTeamName] = (0, import_react.useState)(false);
	const [formation, setFormation] = (0, import_react.useState)("4-3-3");
	const [lineup, setLineup] = (0, import_react.useState)({});
	const [captainId, setCaptainId] = (0, import_react.useState)(null);
	const [viceCaptainId, setViceCaptainId] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [positionFilter, setPositionFilter] = (0, import_react.useState)("ALL");
	const [sortBy, setSortBy] = (0, import_react.useState)("points");
	const [maxCostFilter, setMaxCostFilter] = (0, import_react.useState)(15.8);
	const [activeSlotTarget, setActiveSlotTarget] = (0, import_react.useState)(null);
	const [inspectingPlayer, setInspectingPlayer] = (0, import_react.useState)(null);
	const [showDeadlinesModal, setShowDeadlinesModal] = (0, import_react.useState)(false);
	const { currentRole, isSuperAdmin } = useRoleAccess();
	const canEditChallengeOrRatings = (0, import_react.useMemo)(() => {
		if (isSuperAdmin) return true;
		if (!currentRole || currentRole === "GUEST") return false;
		return [
			"SUPER_ADMIN",
			"PRESIDENT",
			"DEPUTY_PRESIDENT",
			"REGULATIONS_MANAGER",
			"MATCH_OFFICIATING_MANAGER",
			"RECORDS_MANAGER",
			"TECH_MANAGER"
		].includes(currentRole);
	}, [isSuperAdmin, currentRole]);
	const [challenge, setChallenge] = (0, import_react.useState)(() => getGameweekChallenge(selectedGameweek));
	const [showChallengeEditor, setShowChallengeEditor] = (0, import_react.useState)(false);
	const [editChallengeTitle, setEditChallengeTitle] = (0, import_react.useState)("");
	const [editChallengeDesc, setEditChallengeDesc] = (0, import_react.useState)("");
	const [editChallengeBonus, setEditChallengeBonus] = (0, import_react.useState)("");
	const [showRatingModal, setShowRatingModal] = (0, import_react.useState)(false);
	const [targetPlayerForRating, setTargetPlayerForRating] = (0, import_react.useState)(null);
	const [ratingScoreInput, setRatingScoreInput] = (0, import_react.useState)(8);
	const [ratingBonusInput, setRatingBonusInput] = (0, import_react.useState)(0);
	const [ratingGoalsInput, setRatingGoalsInput] = (0, import_react.useState)(0);
	const [ratingAssistsInput, setRatingAssistsInput] = (0, import_react.useState)(0);
	const [ratingCleanSheetInput, setRatingCleanSheetInput] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setChallenge(getGameweekChallenge(selectedGameweek));
	}, [selectedGameweek]);
	(0, import_react.useEffect)(() => {
		const handleChallengeUpdate = (e) => {
			const custom = e;
			if (custom.detail && custom.detail.gameweek === selectedGameweek) setChallenge(custom.detail);
			else setChallenge(getGameweekChallenge(selectedGameweek));
		};
		window.addEventListener("mpesa_fantasy_challenge_updated", handleChallengeUpdate);
		return () => window.removeEventListener("mpesa_fantasy_challenge_updated", handleChallengeUpdate);
	}, [selectedGameweek]);
	const [toast, setToast] = (0, import_react.useState)(null);
	const storageKey = `fantasy_selection_gw_${selectedGameweek}_v1`;
	const [adminRatings, setAdminRatings] = (0, import_react.useState)(() => getAdminPlayerRatings(selectedGameweek));
	(0, import_react.useEffect)(() => {
		const handleUpdate = () => setAdminRatings(getAdminPlayerRatings(selectedGameweek));
		window.addEventListener("mpesa_fantasy_ratings_updated", handleUpdate);
		return () => window.removeEventListener("mpesa_fantasy_ratings_updated", handleUpdate);
	}, [selectedGameweek]);
	const marketPlayers = (0, import_react.useMemo)(() => {
		return generateFantasyMarket(adminRatings, selectedGameweek);
	}, [adminRatings, selectedGameweek]);
	const pitchSlots = (0, import_react.useMemo)(() => {
		const slots = [];
		slots.push({
			slotId: "slot_gk_1",
			position: "GK",
			label: "Goalkeeper",
			rowIndex: 0,
			colIndex: 0
		});
		if (formation === "1-1-3") {
			slots.push({
				slotId: "slot_def_1",
				position: "DEF",
				label: "Defender",
				rowIndex: 1,
				colIndex: 0
			});
			slots.push({
				slotId: "slot_mid_1",
				position: "MID",
				label: "Midfielder",
				rowIndex: 2,
				colIndex: 0
			});
			for (let i = 0; i < 3; i++) slots.push({
				slotId: `slot_fwd_${i + 1}`,
				position: "FWD",
				label: "Forward",
				rowIndex: 3,
				colIndex: i
			});
			return slots;
		}
		const parts = formation.split("-").map(Number);
		const defCount = parts[0] || 4;
		const midCount = parts[1] || 3;
		const fwdCount = parts[2] || 3;
		for (let i = 0; i < defCount; i++) slots.push({
			slotId: `slot_def_${i + 1}`,
			position: "DEF",
			label: "Defender",
			rowIndex: 1,
			colIndex: i
		});
		for (let i = 0; i < midCount; i++) slots.push({
			slotId: `slot_mid_${i + 1}`,
			position: "MID",
			label: "Midfielder",
			rowIndex: 2,
			colIndex: i
		});
		for (let i = 0; i < fwdCount; i++) slots.push({
			slotId: `slot_fwd_${i + 1}`,
			position: "FWD",
			label: "Forward",
			rowIndex: 3,
			colIndex: i
		});
		return slots;
	}, [formation]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		try {
			const saved = localStorage.getItem(storageKey);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed.lineup) setLineup(parsed.lineup);
				if (parsed.formation) setFormation(parsed.formation);
				if (parsed.captainId) setCaptainId(parsed.captainId);
				if (parsed.viceCaptainId) setViceCaptainId(parsed.viceCaptainId);
				if (parsed.teamName) setTeamName(parsed.teamName);
				if (parsed.managerName) setManagerName(parsed.managerName);
				return;
			}
		} catch (e) {}
		const initialMap = {};
		pitchSlots.forEach((slot) => {
			initialMap[slot.slotId] = null;
		});
		setLineup(initialMap);
		setCaptainId(null);
		setViceCaptainId(null);
	}, [
		selectedGameweek,
		storageKey,
		pitchSlots
	]);
	const selectedPlayers = (0, import_react.useMemo)(() => {
		return Object.values(lineup).filter((p) => p !== null);
	}, [lineup]);
	const clubValidation = (0, import_react.useMemo)(() => {
		return checkClubLimit(selectedPlayers, 3);
	}, [selectedPlayers]);
	(0, import_react.useMemo)(() => {
		return validateFormation(selectedPlayers);
	}, [selectedPlayers]);
	const totalBudget = 100;
	const spentBudget = (0, import_react.useMemo)(() => {
		return Number(selectedPlayers.reduce((sum, p) => sum + p.price, 0).toFixed(1));
	}, [selectedPlayers]);
	const remainingBudget = Number(Math.max(0, totalBudget - spentBudget).toFixed(1));
	const currentTotalPoints = (0, import_react.useMemo)(() => {
		return selectedPlayers.reduce((sum, p) => {
			const multiplier = p.id === captainId ? 2 : 1;
			return sum + p.gameweekPoints * multiplier;
		}, 0);
	}, [selectedPlayers, captainId]);
	const showToast = (message, type = "success") => {
		setToast({
			message,
			type
		});
		setTimeout(() => setToast(null), 3500);
	};
	const handleAssignToTargetSlot = (player, targetSlot) => {
		if (lineup[targetSlot.slotId]?.id === player.id) {
			showToast(`${player.name} is already assigned to this slot.`);
			return;
		}
		const existingInTarget = lineup[targetSlot.slotId];
		const isAlreadyInLineup = selectedPlayers.some((p) => p.id === player.id);
		if (!isAlreadyInLineup) {
			if (selectedPlayers.filter((p) => p.clubName === player.clubName && (!existingInTarget || p.id !== existingInTarget.id)).length >= 3) {
				showToast(`Club limit reached: Maximum 3 players allowed from ${player.clubName}.`, "error");
				return;
			}
		}
		const existingCost = existingInTarget ? existingInTarget.price : 0;
		const netCost = isAlreadyInLineup ? 0 : player.price - existingCost;
		if (!isAlreadyInLineup && spentBudget + netCost > totalBudget) {
			showToast(`Budget exceeded: Remaining £${remainingBudget}m is not enough for £${player.price}m.`, "error");
			return;
		}
		const updatedLineup = { ...lineup };
		if (isAlreadyInLineup) Object.keys(updatedLineup).forEach((sId) => {
			if (updatedLineup[sId]?.id === player.id) updatedLineup[sId] = existingInTarget || null;
		});
		updatedLineup[targetSlot.slotId] = player;
		setLineup(updatedLineup);
		if (!captainId) setCaptainId(player.id);
		else if (!viceCaptainId && player.id !== captainId) setViceCaptainId(player.id);
		setActiveSlotTarget(null);
		showToast(`✓ Placed ${player.name} into ${targetSlot.label}!`);
	};
	const handleAddPlayer = (player) => {
		if (selectedPlayers.some((p) => p.id === player.id)) {
			showToast(`${player.name} is already in your starting lineup.`, "error");
			return;
		}
		if (selectedPlayers.filter((p) => p.clubName === player.clubName).length >= 3) {
			showToast(`Club limit reached: Maximum 3 players allowed from ${player.clubName}.`, "error");
			return;
		}
		if (spentBudget + player.price > totalBudget) {
			showToast(`Budget exceeded: Remaining £${remainingBudget}m is not enough for £${player.price}m.`, "error");
			return;
		}
		if (activeSlotTarget && activeSlotTarget.position === player.position) {
			handleAssignToTargetSlot(player, activeSlotTarget);
			return;
		}
		const emptySlot = pitchSlots.find((s) => s.position === player.position && !lineup[s.slotId]);
		if (emptySlot) {
			setLineup((prev) => ({
				...prev,
				[emptySlot.slotId]: player
			}));
			if (!captainId) setCaptainId(player.id);
			else if (!viceCaptainId && player.id !== captainId) setViceCaptainId(player.id);
			showToast(`Added ${player.name} to your squad.`);
			return;
		}
		showToast(`No open ${player.position} slots in current formation (${formation}). Remove a player first.`, "error");
	};
	const handleRemoveSlot = (slotId) => {
		const player = lineup[slotId];
		if (!player) return;
		if (captainId === player.id) setCaptainId(null);
		if (viceCaptainId === player.id) setViceCaptainId(null);
		setLineup((prev) => ({
			...prev,
			[slotId]: null
		}));
		showToast(`Removed ${player.name} from lineup.`);
	};
	const handleReset = () => {
		const emptyMap = {};
		pitchSlots.forEach((s) => {
			emptyMap[s.slotId] = null;
		});
		setLineup(emptyMap);
		setCaptainId(null);
		setViceCaptainId(null);
		setActiveSlotTarget(null);
		showToast("Lineup cleared.");
	};
	const handleAutoPick = () => {
		const picked = {};
		const clubCountMap = {};
		const usedPlayerIds = /* @__PURE__ */ new Set();
		let runningBudget = 0;
		pitchSlots.forEach((slot) => {
			const candidates = marketPlayers.filter((p) => p.position === slot.position && !usedPlayerIds.has(p.id) && (clubCountMap[p.clubName] || 0) < 3 && runningBudget + p.price <= totalBudget).map((p) => {
				return {
					player: p,
					score: (p.totalPoints || 0) * .5 + (p.form || 6) * 2.5 + Math.random() * 25 - p.price * .4
				};
			}).sort((a, b) => b.score - a.score);
			if (candidates.length > 0) {
				const poolSize = Math.min(3, candidates.length);
				const choice = candidates[Math.floor(Math.random() * poolSize)].player;
				picked[slot.slotId] = choice;
				usedPlayerIds.add(choice.id);
				clubCountMap[choice.clubName] = (clubCountMap[choice.clubName] || 0) + 1;
				runningBudget += choice.price;
			} else picked[slot.slotId] = null;
		});
		setLineup(picked);
		const validList = Object.values(picked).filter((p) => p !== null);
		if (validList.length > 0) {
			const topCandidates = [...validList].sort((a, b) => b.totalPoints - a.totalPoints);
			setCaptainId(topCandidates[0]?.id || null);
			setViceCaptainId(topCandidates[1]?.id || null);
		}
		showToast(`✨ Generated varied squad: ${validList.length}/${pitchSlots.length} players selected within £100m!`);
	};
	const handleSaveTeam = () => {
		if (selectedPlayers.length !== 11 && formation !== "1-1-3") {
			showToast(`Incomplete lineup: ${selectedPlayers.length}/11 players selected. Please fill all slots.`, "error");
			return;
		}
		if (!clubValidation.isCompliant) {
			showToast(`Club rule violated: ${clubValidation.violatedClubs.join(", ")}. Max 3 players per club.`, "error");
			return;
		}
		if (spentBudget > totalBudget) {
			showToast(`Budget exceeded: Total value £${spentBudget}m exceeds £${totalBudget}m.`, "error");
			return;
		}
		if (!captainId && selectedPlayers.length > 0) setCaptainId(selectedPlayers[0].id);
		const payload = {
			gameweek: selectedGameweek,
			teamName,
			managerName,
			formation,
			lineup,
			captainId: captainId || selectedPlayers[0]?.id || null,
			viceCaptainId: viceCaptainId || selectedPlayers[1]?.id || null,
			savedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			localStorage.setItem(storageKey, JSON.stringify(payload));
			localStorage.setItem("fantasy_msl_last_active_lineup", JSON.stringify(payload));
			window.dispatchEvent(new CustomEvent("mpesa_fantasy_lineup_saved", { detail: payload }));
			if (onSaved) onSaved(selectedPlayers, selectedGameweek);
			showToast(`✓ Gameweek ${selectedGameweek} fantasy lineup successfully saved and locked!`);
		} catch (e) {
			showToast("Failed to save lineup to local storage.", "error");
		}
	};
	const getPlayerOpponent = (player) => {
		const fix = getDbFixtures().find((f) => f.matchweek === selectedGameweek && (f.homeTeamName.toLowerCase().includes(player.clubName.toLowerCase()) || f.awayTeamName.toLowerCase().includes(player.clubName.toLowerCase()) || f.homeId === player.clubId || f.awayId === player.clubId));
		if (!fix) {
			const opps = [
				"TOT (H)",
				"HUL (H)",
				"SUN (A)",
				"BRE (H)",
				"ARS (A)",
				"CRY (A)",
				"NFO (A)"
			];
			return {
				badge: opps[player.id % opps.length],
				difficulty: player.id % 3 === 0 ? "easy" : player.id % 3 === 1 ? "med" : "hard"
			};
		}
		const isHome = fix.homeTeamName.toLowerCase().includes(player.clubName.toLowerCase()) || fix.homeId === player.clubId;
		return {
			badge: `${(isHome ? fix.awayTeamName : fix.homeTeamName).slice(0, 3).toUpperCase()} (${isHome ? "H" : "A"})`,
			difficulty: isHome ? "easy" : "med"
		};
	};
	const filteredPlayers = (0, import_react.useMemo)(() => {
		return marketPlayers.filter((p) => {
			if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.clubName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
			if (positionFilter !== "ALL" && p.position !== positionFilter) return false;
			if (p.price > maxCostFilter) return false;
			return true;
		}).sort((a, b) => {
			if (sortBy === "points") return b.totalPoints - a.totalPoints;
			if (sortBy === "price") return b.price - a.price;
			if (sortBy === "form") return b.form - a.form;
			if (sortBy === "goals") return b.goals - a.goals;
			if (sortBy === "selected") return b.selectedPercent - a.selectedPercent;
			return 0;
		});
	}, [
		marketPlayers,
		searchQuery,
		positionFilter,
		maxCostFilter,
		sortBy
	]);
	const groupedPlayers = (0, import_react.useMemo)(() => {
		return {
			Goalkeepers: filteredPlayers.filter((p) => p.position === "GK"),
			Defenders: filteredPlayers.filter((p) => p.position === "DEF"),
			Midfielders: filteredPlayers.filter((p) => p.position === "MID"),
			Forwards: filteredPlayers.filter((p) => p.position === "FWD")
		};
	}, [filteredPlayers]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `space-y-6 ${className}`,
		children: [
			toast && /* @__PURE__ */ (void 0)("div", {
				className: `fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border text-xs font-bold animate-in fade-in slide-in-from-top-3 ${toast.type === "success" ? "bg-[#00f0ff] text-black border-cyan-300 shadow-cyan-500/20" : "bg-rose-500 text-white border-rose-400 shadow-rose-500/20"}`,
				children: [toast.type === "success" ? /* @__PURE__ */ (void 0)(CircleCheck, { className: "w-4 h-4 text-black shrink-0" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 647,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (void 0)(CircleAlert, { className: "w-4 h-4 text-white shrink-0" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 649,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("span", { children: toast.message }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 651,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 639,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MatchweekSelector, {
				currentWeek: selectedGameweek,
				totalWeeks: 10,
				onSelectWeek: (w) => setSelectedGameweek(w),
				deadlineDate: "Sun 08 Nov 17:00"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 658,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "bg-gradient-to-r from-[#00f0ff] via-[#00df89] to-[#00ff85] rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-[#0e0927] border border-[#2b2158] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-full h-full bg-[#120b33] rounded-[14px] flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-6 h-6 text-amber-400" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 675,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 674,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 673,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: isEditingTeamName ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: "text",
											value: teamName,
											onChange: (e) => setTeamName(e.target.value),
											className: "bg-white/10 text-white font-header text-lg font-black px-2 py-0.5 rounded outline-none border border-cyan-400"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 682,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setIsEditingTeamName(false),
											className: "p-1 rounded bg-cyan-400 text-black cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName$2,
												lineNumber: 693,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 688,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 681,
										columnNumber: 21
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "font-header text-xl sm:text-2xl font-black text-white tracking-wide truncate",
											children: teamName
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 698,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setIsEditingTeamName(true),
											className: "text-gray-400 hover:text-white transition cursor-pointer",
											title: "Edit squad name",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pen, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName$2,
												lineNumber: 707,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 701,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 697,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 679,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-gray-400 block truncate",
									children: managerName
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 712,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 678,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 672,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-[#08041a] rounded-xl p-3 border border-white/5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-header text-4xl sm:text-5xl font-black text-white leading-none",
									children: currentTotalPoints
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 721,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[11px] text-gray-400 uppercase font-bold tracking-wider",
									children: "Total points"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 724,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 720,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1 text-right text-[11px] font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-end gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-gray-400",
										children: "Global rank"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 731,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-white font-bold",
										children: "-"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 732,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 730,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-end gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-gray-400",
										children: "Highest points"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 735,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-white font-bold",
										children: "-"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 736,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 734,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 729,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 719,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 671,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 text-black",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[11px] font-black uppercase tracking-wider text-[#0e0927] block",
									children: [
										"Gameweek ",
										selectedGameweek,
										" Challenge"
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 746,
									columnNumber: 17
								}, this), canEditChallengeOrRatings && /* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => {
										setEditChallengeTitle(challenge.title);
										setEditChallengeDesc(challenge.description);
										setEditChallengeBonus(challenge.specialBonus || "");
										setShowChallengeEditor(true);
									},
									className: "px-2.5 py-1 rounded-lg bg-[#0e0927] hover:bg-black text-[#00ff85] font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition shadow cursor-pointer",
									title: "Admin: Edit what appears for this gameweek challenge",
									children: [/* @__PURE__ */ (void 0)(Pen, { className: "w-3 h-3 text-[#00ff85]" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 761,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", { children: "Admin Edit Challenge" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 762,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 750,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 745,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-header text-2xl sm:text-3xl font-black text-[#0e0927] uppercase tracking-wide",
								children: challenge.title
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 766,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-[#0e0927]/90 leading-relaxed mt-1 flex items-start gap-1.5 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "w-3.5 h-3.5 text-[#0e0927] shrink-0 mt-0.5 fill-[#0e0927]" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 770,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: challenge.description }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 771,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 769,
								columnNumber: 15
							}, this),
							challenge.specialBonus && /* @__PURE__ */ (void 0)("div", {
								className: "mt-1 text-[11px] font-bold text-[#0e0927] flex items-center gap-1",
								children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "w-3 h-3 text-[#0e0927]" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 775,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", { children: ["Bonus: ", challenge.specialBonus] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 776,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 774,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 744,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-emerald-100/80 border border-emerald-300 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-black text-[#0e0927]",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Players selected: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [
								selectedPlayers.length,
								" / ",
								pitchSlots.length
							] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 784,
								columnNumber: 35
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 783,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Remaining budget: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "font-mono",
								children: [
									"£",
									remainingBudget,
									"m"
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 787,
								columnNumber: 35
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 786,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 782,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 743,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 669,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 668,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-7 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/40 bg-[#09351e]",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-[#2a0e44] border-b-2 border-purple-400/30 px-6 py-2.5 flex items-center justify-between text-white font-header text-xs sm:text-sm font-black tracking-wider shadow-inner",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 text-purple-200",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "w-4 h-4 text-amber-400" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 807,
										columnNumber: 17
									}, this), "Fantasy Challenge"]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 806,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 text-purple-200",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-4 h-4 text-cyan-300" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 811,
										columnNumber: 17
									}, this), "Fantasy Challenge"]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 810,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 805,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-4 sm:p-6 min-h-[580px] sm:min-h-[640px] flex flex-col justify-between relative",
								style: { background: "repeating-linear-gradient(0deg, #0b4928, #0b4928 40px, #0f5832 40px, #0f5832 80px)" },
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-x-6 top-0 h-28 border-x-2 border-b-2 border-white/20 rounded-b-xl pointer-events-none" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 825,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-x-16 top-0 h-14 border-x-2 border-b-2 border-white/20 rounded-b-xl pointer-events-none" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 826,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-20 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40 pointer-events-none" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 827,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-x-2 border-white/20 rounded-t-full pointer-events-none" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 829,
										columnNumber: 15
									}, this),
									[
										0,
										1,
										2,
										3
									].map((rowIdx) => {
										const rowSlots = pitchSlots.filter((s) => s.rowIndex === rowIdx);
										if (rowSlots.length === 0) return null;
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-around gap-2 sm:gap-4 relative z-10 py-1",
											children: rowSlots.map((slot) => {
												const player = lineup[slot.slotId];
												const isCaptain = player && player.id === captainId;
												const isViceCaptain = player && player.id === viceCaptainId;
												const isTargeted = activeSlotTarget?.slotId === slot.slotId;
												const opp = player ? getPlayerOpponent(player) : null;
												if (!player) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													onClick: () => {
														setActiveSlotTarget(slot);
														setPositionFilter(slot.position);
														showToast(`Targeting ${slot.label} slot. Click any ${slot.position} in the list to assign!`);
													},
													className: `flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer group ${isTargeted ? "bg-cyan-400/25 border-2 border-cyan-400 ring-4 ring-cyan-400/50 scale-105 shadow-lg shadow-cyan-500/30 animate-pulse" : "bg-black/20 hover:bg-black/35 border border-white/20 hover:border-white/40"}`,
													style: { minWidth: "90px" },
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white mb-1.5 transition",
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-5 h-5 stroke-[2.5]" }, void 0, false, {
															fileName: _jsxFileName$2,
															lineNumber: 867,
															columnNumber: 31
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName$2,
														lineNumber: 866,
														columnNumber: 29
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[11px] sm:text-xs font-bold text-white border-b border-dotted border-white/60",
														children: slot.label
													}, void 0, false, {
														fileName: _jsxFileName$2,
														lineNumber: 869,
														columnNumber: 29
													}, this)]
												}, slot.slotId, true, {
													fileName: _jsxFileName$2,
													lineNumber: 851,
													columnNumber: 27
												}, this);
												return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													onClick: () => {
														setActiveSlotTarget(slot);
														setPositionFilter(slot.position);
														showToast(`Targeting ${slot.label} (${player.name}). Click another ${slot.position} to replace!`);
													},
													className: `flex flex-col items-center relative group cursor-pointer transition-all rounded-xl p-1 ${isTargeted ? "bg-cyan-400/25 ring-4 ring-cyan-400 ring-offset-2 ring-offset-[#09351e] shadow-lg shadow-cyan-500/30 scale-105" : "hover:bg-black/20"}`,
													style: { minWidth: "95px" },
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "bg-[#106b3a] border border-emerald-300/40 text-white font-mono text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-t-md shadow-md",
															children: [
																"£",
																player.price.toFixed(1),
																"m"
															]
														}, void 0, true, {
															fileName: _jsxFileName$2,
															lineNumber: 893,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "relative my-0.5 cursor-pointer transform group-hover:scale-105 transition",
															children: [
																isCaptain && /* @__PURE__ */ (void 0)("div", {
																	className: "absolute -top-1 -left-2 z-20 w-5 h-5 rounded-full bg-amber-400 border border-black text-black font-black text-[9px] flex items-center justify-center shadow-lg",
																	title: "Designated Captain (2x points)",
																	children: "C"
																}, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 901,
																	columnNumber: 31
																}, this),
																isViceCaptain && /* @__PURE__ */ (void 0)("div", {
																	className: "absolute -top-1 -left-2 z-20 w-5 h-5 rounded-full bg-cyan-400 border border-black text-black font-black text-[8px] flex items-center justify-center shadow-lg",
																	title: "Designated Vice Captain",
																	children: "VC"
																}, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 909,
																	columnNumber: 31
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
																	viewBox: "0 0 64 64",
																	className: "w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																			d: "M16 14 L24 4 L40 4 L48 14 L56 22 L48 30 L44 26 L44 58 L20 58 L20 26 L16 30 L8 22 Z",
																			fill: player.clubColor || "#00ff85",
																			stroke: "#111827",
																			strokeWidth: "2"
																		}, void 0, false, {
																			fileName: _jsxFileName$2,
																			lineNumber: 922,
																			columnNumber: 31
																		}, this),
																		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																			d: "M26 4 C28 10, 36 10, 38 4 Z",
																			fill: "#ffffff"
																		}, void 0, false, {
																			fileName: _jsxFileName$2,
																			lineNumber: 928,
																			columnNumber: 31
																		}, this),
																		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("text", {
																			x: "32",
																			y: "44",
																			textAnchor: "middle",
																			fill: "#ffffff",
																			fontWeight: "900",
																			fontSize: "16",
																			fontFamily: "sans-serif",
																			children: player.jerseyNumber
																		}, void 0, false, {
																			fileName: _jsxFileName$2,
																			lineNumber: 932,
																			columnNumber: 31
																		}, this)
																	]
																}, void 0, true, {
																	fileName: _jsxFileName$2,
																	lineNumber: 918,
																	columnNumber: 29
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$2,
															lineNumber: 898,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "bg-white text-black font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-sm shadow-md w-full text-center truncate max-w-[110px]",
															children: player.name
														}, void 0, false, {
															fileName: _jsxFileName$2,
															lineNumber: 947,
															columnNumber: 27
														}, this),
														opp && /* @__PURE__ */ (void 0)("div", {
															className: `text-[9px] font-black uppercase px-2 py-0.5 rounded-b-md shadow-md text-black mt-0.5 ${opp.difficulty === "easy" ? "bg-[#00ff85]" : opp.difficulty === "med" ? "bg-amber-400" : "bg-rose-400 text-white"}`,
															children: opp.badge
														}, void 0, false, {
															fileName: _jsxFileName$2,
															lineNumber: 953,
															columnNumber: 29
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center gap-1 bg-black/90 p-1 rounded-xl shadow-xl border border-white/20",
															children: [
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
																	type: "button",
																	onClick: () => setCaptainId(player.id),
																	className: "px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black hover:brightness-110",
																	title: "Make Captain",
																	children: "(C)"
																}, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 968,
																	columnNumber: 29
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
																	type: "button",
																	onClick: () => setViceCaptainId(player.id),
																	className: "px-1.5 py-0.5 rounded bg-cyan-400 text-black text-[9px] font-black hover:brightness-110",
																	title: "Make Vice-Captain",
																	children: "(VC)"
																}, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 976,
																	columnNumber: 29
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
																	type: "button",
																	onClick: () => handleRemoveSlot(slot.slotId),
																	className: "px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-black hover:brightness-110",
																	title: "Remove Player",
																	children: "✕"
																}, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 984,
																	columnNumber: 29
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$2,
															lineNumber: 967,
															columnNumber: 27
														}, this)
													]
												}, slot.slotId, true, {
													fileName: _jsxFileName$2,
													lineNumber: 878,
													columnNumber: 25
												}, this);
											})
										}, rowIdx, false, {
											fileName: _jsxFileName$2,
											lineNumber: 837,
											columnNumber: 19
										}, this);
									})
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 817,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 803,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-[#100a2a] border border-[#2c2058] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] uppercase font-bold text-gray-400 block",
									children: "Choose formation"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1006,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
									value: formation,
									onChange: (e) => setFormation(e.target.value),
									className: "bg-[#170e3b] border border-white/20 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-400 cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "4-3-3",
											children: "4-3-3 (Default)"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1014,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "4-4-2",
											children: "4-4-2"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1015,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "3-5-2",
											children: "3-5-2"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1016,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "3-4-3",
											children: "3-4-3"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1017,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "5-3-2",
											children: "5-3-2"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1018,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "5-4-1",
											children: "5-4-1"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1019,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "4-5-1",
											children: "4-5-1"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1020,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "1-1-3",
											children: "1-1-3 (Challenge Preview)"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1021,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1009,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1005,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2 ml-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: handleReset,
										className: "px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer",
										children: "Reset"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1027,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: handleAutoPick,
										className: "px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-3.5 h-3.5 text-cyan-400" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1040,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Auto pick" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1041,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1035,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: handleSaveTeam,
										className: "px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/30 flex items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1049,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Save team" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1050,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1044,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1026,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1003,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-[#1e0b38] border border-purple-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: "font-header text-lg sm:text-xl font-black text-white uppercase tracking-wider",
								children: [
									"Gameweek ",
									selectedGameweek,
									" Fixtures"
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1058,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-gray-300",
								children: ["Final Deadline: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-amber-300 font-mono",
									children: "Sun 08 Nov 17:00"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1062,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1061,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1057,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setShowDeadlinesModal(true),
								className: "px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow cursor-pointer shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Deadlines explained" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1071,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1072,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1066,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1056,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 801,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-5 bg-[#0e0927] border border-[#2b2158] rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between border-b border-white/10 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-header text-xl sm:text-2xl font-black text-white uppercase tracking-wider",
								children: "Player Selection"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1083,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] font-mono text-cyan-300",
								children: "Max 3 per Club"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1086,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1082,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search for player...",
								className: "w-full bg-[#160f38] border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none pr-9 transition"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1093,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1100,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1092,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-[10px] uppercase font-bold text-gray-400 mb-1",
								children: "View"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1107,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: positionFilter,
								onChange: (e) => setPositionFilter(e.target.value),
								className: "w-full bg-[#160f38] border border-white/10 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400 cursor-pointer text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "ALL",
										children: "All players"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1115,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "GK",
										children: "Goalkeepers"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1116,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "DEF",
										children: "Defenders"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1117,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "MID",
										children: "Midfielders"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1118,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "FWD",
										children: "Forwards"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1119,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1110,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1106,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-[10px] uppercase font-bold text-gray-400 mb-1",
								children: "Sorted by"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1125,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: sortBy,
								onChange: (e) => setSortBy(e.target.value),
								className: "w-full bg-[#160f38] border border-white/10 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400 cursor-pointer text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "points",
										children: "Total points"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1133,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "price",
										children: "Price"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1134,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "form",
										children: "Form rating"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1135,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "goals",
										children: "Goals scored"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1136,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "selected",
										children: "Selected %"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1137,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1128,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1124,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1104,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-[#140e33] border border-white/5 rounded-xl p-2.5 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between text-[11px] text-gray-300",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-bold",
									children: "Max cost:"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1145,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-mono text-cyan-300",
									children: [
										"Between 4.0 and ",
										maxCostFilter,
										"m"
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1146,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1144,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "range",
								min: "4.5",
								max: "15.8",
								step: "0.1",
								value: maxCostFilter,
								onChange: (e) => setMaxCostFilter(Number(e.target.value)),
								className: "w-full accent-cyan-400 cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1148,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1143,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-[#240e3d] text-purple-200 font-bold text-xs py-1.5 px-3 rounded-lg text-center shadow-inner",
							children: [filteredPlayers.length, " players shown"]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1160,
							columnNumber: 11
						}, this),
						activeSlotTarget && /* @__PURE__ */ (void 0)("div", {
							className: "bg-cyan-500/15 border-2 border-cyan-400 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-lg shadow-cyan-500/15 animate-in fade-in",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (void 0)("span", { className: "w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1168,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xs font-black text-cyan-300 truncate",
									children: [
										"Targeting ",
										activeSlotTarget.label,
										" (",
										activeSlotTarget.position,
										"): Click any player below to assign"
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1169,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1167,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setActiveSlotTarget(null),
								className: "text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1173,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1166,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-4 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar",
							children: Object.entries(groupedPlayers).map(([positionTitle, players]) => {
								if (players.length === 0) return null;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
											className: "font-header text-sm font-black text-white uppercase tracking-wider sticky top-0 bg-[#0e0927] py-1 z-10 border-b border-white/10 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: positionTitle }, void 0, false, {
												fileName: _jsxFileName$2,
												lineNumber: 1191,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] font-mono text-gray-400 font-normal",
												children: [players.length, " available"]
											}, void 0, true, {
												fileName: _jsxFileName$2,
												lineNumber: 1192,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$2,
											lineNumber: 1190,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-12 text-[10px] font-bold uppercase text-gray-400 px-2 py-1 border-b border-white/5",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "col-span-6",
													children: "Player"
												}, void 0, false, {
													fileName: _jsxFileName$2,
													lineNumber: 1199,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "col-span-2 text-center",
													children: "OPP"
												}, void 0, false, {
													fileName: _jsxFileName$2,
													lineNumber: 1200,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "col-span-2 text-center",
													children: "Pts"
												}, void 0, false, {
													fileName: _jsxFileName$2,
													lineNumber: 1201,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "col-span-2 text-right",
													children: "Price"
												}, void 0, false, {
													fileName: _jsxFileName$2,
													lineNumber: 1202,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$2,
											lineNumber: 1198,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "space-y-1",
											children: players.map((p) => {
												const isSelected = selectedPlayers.some((sp) => sp.id === p.id);
												const isClubLocked = selectedPlayers.filter((sp) => sp.clubName === p.clubName).length >= 3 && !isSelected;
												const isTargetEligible = Boolean(activeSlotTarget && activeSlotTarget.position === p.position);
												const opp = getPlayerOpponent(p);
												return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													onClick: () => {
														if (activeSlotTarget) if (activeSlotTarget.position === p.position) handleAssignToTargetSlot(p, activeSlotTarget);
														else handleAddPlayer(p);
														else if (!isSelected && !isClubLocked) handleAddPlayer(p);
													},
													className: `grid grid-cols-12 items-center px-2 py-1.5 rounded-xl border transition-all text-xs cursor-pointer select-none ${isTargetEligible ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10 hover:bg-cyan-500/25" : isSelected ? "bg-emerald-500/10 border-emerald-500/40 text-white hover:bg-emerald-500/15" : isClubLocked ? "bg-black/20 border-white/5 opacity-40 cursor-not-allowed" : "bg-black/30 hover:bg-black/50 hover:border-cyan-400/50 border-white/5 text-gray-200"}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "col-span-6 flex items-center gap-2 min-w-0",
															children: [
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
																	type: "button",
																	onClick: (e) => {
																		e.stopPropagation();
																		setInspectingPlayer(p);
																	},
																	className: "w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-[10px] font-serif shrink-0 cursor-pointer",
																	title: "View full player stats",
																	children: "i"
																}, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 1240,
																	columnNumber: 29
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
																	viewBox: "0 0 64 64",
																	className: "w-6 h-6 shrink-0",
																	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
																		d: "M16 14 L24 4 L40 4 L48 14 L56 22 L48 30 L44 26 L44 58 L20 58 L20 26 L16 30 L8 22 Z",
																		fill: p.clubColor || "#00ff85",
																		stroke: "#111827",
																		strokeWidth: "2"
																	}, void 0, false, {
																		fileName: _jsxFileName$2,
																		lineNumber: 1254,
																		columnNumber: 31
																	}, this)
																}, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 1253,
																	columnNumber: 29
																}, this),
																/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
																	className: "min-w-0 truncate",
																	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																		className: "font-black text-white truncate block text-[11px] sm:text-xs",
																		children: p.name
																	}, void 0, false, {
																		fileName: _jsxFileName$2,
																		lineNumber: 1263,
																		columnNumber: 31
																	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																		className: "text-[9px] text-gray-400 font-mono uppercase",
																		children: [
																			p.clubShortCode,
																			" • ",
																			p.position === "GK" ? "GKP" : p.position
																		]
																	}, void 0, true, {
																		fileName: _jsxFileName$2,
																		lineNumber: 1266,
																		columnNumber: 31
																	}, this)]
																}, void 0, true, {
																	fileName: _jsxFileName$2,
																	lineNumber: 1262,
																	columnNumber: 29
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName$2,
															lineNumber: 1239,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "col-span-2 text-center",
															children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																className: `text-[9px] font-black uppercase px-1.5 py-0.5 rounded text-black ${opp.difficulty === "easy" ? "bg-[#00ff85]" : opp.difficulty === "med" ? "bg-amber-400" : "bg-rose-400 text-white"}`,
																children: opp.badge
															}, void 0, false, {
																fileName: _jsxFileName$2,
																lineNumber: 1274,
																columnNumber: 29
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName$2,
															lineNumber: 1273,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "col-span-2 text-center font-mono font-bold text-white text-xs flex items-center justify-center gap-1",
															children: [p.isRatedByAdmin ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																className: "text-emerald-400 font-black",
																title: "Admin Rated",
																children: p.gameweekPoints
															}, void 0, false, {
																fileName: _jsxFileName$2,
																lineNumber: 1290,
																columnNumber: 31
															}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																className: "text-gray-500 font-bold",
																title: "Points count after admin logs rating",
																children: "0"
															}, void 0, false, {
																fileName: _jsxFileName$2,
																lineNumber: 1294,
																columnNumber: 31
															}, this), canEditChallengeOrRatings && /* @__PURE__ */ (void 0)("button", {
																type: "button",
																onClick: (e) => {
																	e.stopPropagation();
																	setTargetPlayerForRating(p);
																	setRatingScoreInput(p.adminRating || 8);
																	setRatingBonusInput(p.adminBonusPoints || 0);
																	setRatingGoalsInput(p.goals || 0);
																	setRatingAssistsInput(p.assists || 0);
																	setRatingCleanSheetInput(p.cleanSheets > 0);
																	setShowRatingModal(true);
																},
																className: "w-3.5 h-3.5 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black flex items-center justify-center transition cursor-pointer",
																title: "Admin: Log matchweek rating & stats",
																children: /* @__PURE__ */ (void 0)(Pen, { className: "w-2 h-2" }, void 0, false, {
																	fileName: _jsxFileName$2,
																	lineNumber: 1316,
																	columnNumber: 33
																}, this)
															}, void 0, false, {
																fileName: _jsxFileName$2,
																lineNumber: 1301,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName$2,
															lineNumber: 1288,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "col-span-2 flex items-center justify-end gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																className: "font-mono text-xs text-gray-300",
																children: [
																	"£",
																	p.price.toFixed(1),
																	"m"
																]
															}, void 0, true, {
																fileName: _jsxFileName$2,
																lineNumber: 1323,
																columnNumber: 29
															}, this), isSelected ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
																type: "button",
																onClick: (e) => {
																	e.stopPropagation();
																	const slotEntry = Object.entries(lineup).find(([_, pl]) => pl?.id === p.id);
																	if (slotEntry) handleRemoveSlot(slotEntry[0]);
																},
																className: "w-5 h-5 rounded bg-emerald-500 text-black flex items-center justify-center font-black text-xs cursor-pointer hover:bg-rose-500 hover:text-white transition",
																title: "Click to remove from squad",
																children: "✓"
															}, void 0, false, {
																fileName: _jsxFileName$2,
																lineNumber: 1328,
																columnNumber: 31
															}, this) : isClubLocked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																className: "text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-bold",
																title: "Max 3 players from this club already selected",
																children: "Max 3"
															}, void 0, false, {
																fileName: _jsxFileName$2,
																lineNumber: 1341,
																columnNumber: 31
															}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
																type: "button",
																onClick: (e) => {
																	e.stopPropagation();
																	if (activeSlotTarget && activeSlotTarget.position === p.position) handleAssignToTargetSlot(p, activeSlotTarget);
																	else handleAddPlayer(p);
																},
																className: "w-5 h-5 rounded bg-white/10 hover:bg-cyan-400 hover:text-black text-white flex items-center justify-center font-black text-xs transition cursor-pointer",
																title: "Add to lineup",
																children: "+"
															}, void 0, false, {
																fileName: _jsxFileName$2,
																lineNumber: 1348,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName$2,
															lineNumber: 1322,
															columnNumber: 27
														}, this)
													]
												}, p.id, true, {
													fileName: _jsxFileName$2,
													lineNumber: 1215,
													columnNumber: 25
												}, this);
											})
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 1206,
											columnNumber: 19
										}, this)
									]
								}, positionTitle, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1189,
									columnNumber: 17
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 1184,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 1080,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 797,
				columnNumber: 7
			}, this),
			inspectingPlayer && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#100a2f] border border-[#3b2d6e] rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setInspectingPlayer(null),
							className: "absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-xl",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1387,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 1382,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-3.5 border-b border-white/10 pb-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "w-12 h-12 rounded-2xl flex items-center justify-center text-black font-black text-sm shadow-md",
								style: { backgroundColor: inspectingPlayer.clubColor || "#00ff85" },
								children: inspectingPlayer.clubShortCode
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1391,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-header text-xl font-black text-white uppercase",
								children: [
									inspectingPlayer.name,
									" (#",
									inspectingPlayer.jerseyNumber,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1398,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-xs text-cyan-300",
								children: [
									inspectingPlayer.clubName,
									" • ",
									inspectingPlayer.position,
									" • £",
									inspectingPlayer.price,
									"m"
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1401,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1397,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1390,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-2 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-gray-400 block text-[10px]",
										children: "Total Points"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1409,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", {
										className: "text-lg font-black text-cyan-400",
										children: inspectingPlayer.totalPoints
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1410,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1408,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-gray-400 block text-[10px]",
										children: "Gameweek Points"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1413,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", {
										className: "text-lg font-black text-emerald-400",
										children: inspectingPlayer.gameweekPoints
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1414,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1412,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-gray-400 block text-[10px]",
										children: "Admin Match Rating"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1417,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", {
										className: "text-lg font-black text-amber-400",
										children: [inspectingPlayer.adminRating || 7.5, " / 10"]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1418,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1416,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-gray-400 block text-[10px]",
										children: "Selected By"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1421,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", {
										className: "text-lg font-black text-purple-400",
										children: [inspectingPlayer.selectedPercent, "%"]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1422,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1420,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1407,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-1 text-xs text-gray-300 pt-2 border-t border-white/10",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Goals Scored:" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1428,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", { children: inspectingPlayer.goals }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1429,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1427,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Assists:" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1432,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", { children: inspectingPlayer.assists }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1433,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1431,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Clean Sheets:" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1436,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", { children: inspectingPlayer.cleanSheets }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1437,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1435,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Goalkeeper Saves:" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1440,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("strong", { children: inspectingPlayer.saves }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1441,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1439,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1426,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => {
								handleAddPlayer(inspectingPlayer);
								setInspectingPlayer(null);
							},
							className: "w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 cursor-pointer",
							children: "Add To Starting 11"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 1445,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 1381,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 1380,
				columnNumber: 9
			}, this),
			showDeadlinesModal && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#120a33] border border-purple-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-4",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setShowDeadlinesModal(false),
							className: "absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1470,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 1465,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-3 border-b border-white/10 pb-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300",
								children: /* @__PURE__ */ (void 0)(Clock, { className: "w-5 h-5" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1475,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1474,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-header text-xl font-black text-white uppercase",
								children: "Fantasy MSL Deadlines & Rules"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1478,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-xs text-gray-400",
								children: "Certified Matchweek Protocol"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1481,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1477,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1473,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 text-xs text-gray-300 leading-relaxed",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5 space-y-1",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "font-bold text-white block",
										children: "1. Final Lineup Lock"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1489,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", { children: "All squad submissions and captaincy designations lock 90 minutes before Sunday kickoff." }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1490,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1488,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5 space-y-1",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "font-bold text-white block",
										children: "2. Maximum 3 Players Per Club"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1494,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", { children: "You can field at most 3 players from any single real-world MSL club (e.g. max 3 from Samba, max 3 from Royal Rangers)." }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1495,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1493,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5 space-y-1",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "font-bold text-white block",
										children: "3. Captain 2x Multiplier"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1499,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", { children: "Your designated Captain earns double points (2x). If your Captain does not participate, Vice-Captain assumes the 2x multiplier." }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1500,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1498,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-black/40 rounded-xl border border-white/5 space-y-1",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "font-bold text-white block",
										children: "4. Official Admin Ratings Integration"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1504,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", { children: "Weekly points combine real on-pitch statistical events (goals, assists, clean sheets, saves) and verified Admin Match Ratings (0–10)." }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1505,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1503,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1487,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setShowDeadlinesModal(false),
							className: "w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer",
							children: "Understood"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 1509,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 1464,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 1463,
				columnNumber: 9
			}, this),
			showChallengeEditor && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0f0927] border-2 border-cyan-400/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-4",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setShowChallengeEditor(false),
							className: "absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl cursor-pointer",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1531,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 1526,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-3 border-b border-white/10 pb-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300",
								children: /* @__PURE__ */ (void 0)(Sparkles, { className: "w-5 h-5" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1536,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1535,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-header text-xl font-black text-white uppercase",
								children: [
									"Edit Gameweek ",
									selectedGameweek,
									" Challenge"
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1539,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-xs text-gray-400",
								children: "What you write here appears dynamically on the Gameweek Challenge card"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1542,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1538,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1534,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "block text-[11px] uppercase font-bold text-gray-300 mb-1",
									children: "Challenge Title"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1550,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									value: editChallengeTitle,
									onChange: (e) => setEditChallengeTitle(e.target.value),
									placeholder: "e.g. Spectacular, Clean Sheet Wall, Derby Day",
									className: "w-full bg-[#18103d] border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-bold"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1553,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1549,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "block text-[11px] uppercase font-bold text-gray-300 mb-1",
									children: "Challenge Description & Rules"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1563,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("textarea", {
									rows: 3,
									value: editChallengeDesc,
									onChange: (e) => setEditChallengeDesc(e.target.value),
									placeholder: "e.g. Your players earn +1 point for every shot on target from outside the penalty area and +5 points for outside goals...",
									className: "w-full bg-[#18103d] border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1566,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1562,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "block text-[11px] uppercase font-bold text-gray-300 mb-1",
									children: "Special Bonus / Multiplier Notice"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1576,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									value: editChallengeBonus,
									onChange: (e) => setEditChallengeBonus(e.target.value),
									placeholder: "e.g. +3 Outside Box Bonus, Double Clean Sheet Pts",
									className: "w-full bg-[#18103d] border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 1579,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1575,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1548,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-white/10",
							children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setShowChallengeEditor(false),
								className: "px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1590,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => {
									saveGameweekChallenge({
										gameweek: selectedGameweek,
										title: editChallengeTitle.trim() || `Gameweek ${selectedGameweek} Challenge`,
										description: editChallengeDesc.trim() || `Compete for maximum matchweek points under certified MSL rules. Maximum 3 players per club.`,
										specialBonus: editChallengeBonus.trim() || "Standard Rules",
										badgeText: `GW${selectedGameweek}`,
										updatedBy: managerName || "League Admin"
									});
									setShowChallengeEditor(false);
									showToast(`✓ Gameweek ${selectedGameweek} challenge published!`);
								},
								className: "px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 cursor-pointer",
								children: "Save & Publish Challenge"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1597,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1589,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 1525,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 1524,
				columnNumber: 9
			}, this),
			showRatingModal && targetPlayerForRating && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#100a2f] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-4",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setShowRatingModal(false),
							className: "absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl cursor-pointer",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1633,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 1628,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-3 border-b border-white/10 pb-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-xs shadow-md",
								style: { backgroundColor: targetPlayerForRating.clubColor || "#00ff85" },
								children: targetPlayerForRating.clubShortCode
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1637,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "font-header text-lg font-black text-white uppercase",
								children: ["Log Rating: ", targetPlayerForRating.name]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1644,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-xs text-amber-300 font-bold",
								children: [
									"Gameweek ",
									selectedGameweek,
									" Official Performance"
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1647,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 1643,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1636,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-[11px] uppercase font-bold text-gray-300 mb-1",
										children: "Match Rating (0 - 10)"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1656,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "number",
										step: "0.1",
										min: "1",
										max: "10",
										value: ratingScoreInput,
										onChange: (e) => setRatingScoreInput(Number(e.target.value)),
										className: "w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none font-bold"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1659,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1655,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-[11px] uppercase font-bold text-gray-300 mb-1",
										children: "Bonus Points (0 - 5)"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1670,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "number",
										min: "0",
										max: "5",
										value: ratingBonusInput,
										onChange: (e) => setRatingBonusInput(Number(e.target.value)),
										className: "w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none font-bold"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1673,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1669,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1654,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-[11px] uppercase font-bold text-gray-300 mb-1",
										children: "Goals Scored"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1686,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "number",
										min: "0",
										max: "10",
										value: ratingGoalsInput,
										onChange: (e) => setRatingGoalsInput(Number(e.target.value)),
										className: "w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1689,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1685,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-[11px] uppercase font-bold text-gray-300 mb-1",
										children: "Assists Logged"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1699,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "number",
										min: "0",
										max: "10",
										value: ratingAssistsInput,
										onChange: (e) => setRatingAssistsInput(Number(e.target.value)),
										className: "w-full bg-[#18103d] border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1702,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 1698,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1684,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("label", {
									className: "flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: ratingCleanSheetInput,
										onChange: (e) => setRatingCleanSheetInput(e.target.checked),
										className: "rounded text-amber-400 focus:ring-0 w-4 h-4"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1714,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-gray-200 font-bold",
										children: "Clean Sheet Recorded (Played 60+ mins without conceding)"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 1720,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1713,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-200",
									children: [
										"Points will calculate and count immediately for Gameweek ",
										selectedGameweek,
										" fantasy managers!"
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 1725,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1653,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-white/10",
							children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setShowRatingModal(false),
								className: "px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer",
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1731,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => {
									saveAdminPlayerRating({
										playerId: targetPlayerForRating.id,
										playerName: targetPlayerForRating.name,
										clubName: targetPlayerForRating.clubName,
										position: targetPlayerForRating.position,
										matchRating: Number(ratingScoreInput),
										bonusPoints: Number(ratingBonusInput),
										matchweek: selectedGameweek,
										goalsScored: Number(ratingGoalsInput),
										assistsLogged: Number(ratingAssistsInput),
										cleanSheetLogged: Boolean(ratingCleanSheetInput),
										ratedByAdmin: managerName || "Super Admin",
										updatedAt: (/* @__PURE__ */ new Date()).toISOString()
									});
									setShowRatingModal(false);
									showToast(`✓ Logged rating for ${targetPlayerForRating.name} (GW${selectedGameweek})! Points calculated.`);
								},
								className: "px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 cursor-pointer",
								children: "Certify & Save Rating"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 1738,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 1730,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 1627,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 1626,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 636,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/MyFantasySquad.tsx";
function MyFantasySquad({ initialGameweek = 10, onEditLineup, className = "" }) {
	const [selectedGameweek, setSelectedGameweek] = (0, import_react.useState)(initialGameweek);
	const [savedData, setSavedData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const loadSquad = () => {
			if (typeof window === "undefined") return;
			try {
				const key = `fantasy_selection_gw_${selectedGameweek}_v1`;
				const raw = localStorage.getItem(key);
				if (raw) {
					setSavedData(JSON.parse(raw));
					return;
				}
				const fallbackRaw = localStorage.getItem("fantasy_msl_last_active_lineup");
				if (fallbackRaw) {
					setSavedData(JSON.parse(fallbackRaw));
					return;
				}
			} catch (e) {}
			setSavedData(null);
		};
		loadSquad();
		window.addEventListener("mpesa_fantasy_lineup_saved", loadSquad);
		return () => window.removeEventListener("mpesa_fantasy_lineup_saved", loadSquad);
	}, [selectedGameweek]);
	const starters = (0, import_react.useMemo)(() => {
		if (!savedData || !savedData.lineup) return [];
		return Object.values(savedData.lineup).filter((p) => p !== null);
	}, [savedData]);
	const clubValidation = (0, import_react.useMemo)(() => {
		return checkClubLimit(starters, 3);
	}, [starters]);
	(0, import_react.useMemo)(() => {
		return validateFormation(starters);
	}, [starters]);
	const captainId = savedData?.captainId || null;
	const viceCaptainId = savedData?.viceCaptainId || null;
	const totalPoints = (0, import_react.useMemo)(() => {
		return starters.reduce((acc, p) => {
			const multiplier = p.id === captainId ? 2 : 1;
			return acc + (p.gameweekPoints || 0) * multiplier;
		}, 0);
	}, [starters, captainId]);
	const grouped = (0, import_react.useMemo)(() => {
		return {
			Goalkeeper: starters.filter((p) => p.position === "GK"),
			Defenders: starters.filter((p) => p.position === "DEF"),
			Midfielders: starters.filter((p) => p.position === "MID"),
			Forwards: starters.filter((p) => p.position === "FWD")
		};
	}, [starters]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `bg-gradient-to-br from-[#0c0824] via-[#100a30] to-[#080517] border border-[#2e235e] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MatchweekSelector, {
				currentWeek: selectedGameweek,
				totalWeeks: 10,
				onSelectWeek: (w) => setSelectedGameweek(w),
				deadlineDate: "Sun 08 Nov 17:00"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 119,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "w-full h-full bg-[#120b33] rounded-[14px] flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-6 h-6 text-amber-400" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 131,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 130,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 129,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 text-black",
								children: "My Fantasy Squad"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 136,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-gray-400 font-mono",
								children: ["Gameweek ", selectedGameweek]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 139,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 135,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-header text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-0.5",
							children: savedData?.teamName || "Zenvior"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 143,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs text-gray-300",
							children: [
								"Manager: ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: savedData?.managerName || "Tonnie Mark" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 147,
									columnNumber: 24
								}, this),
								" • Formation:",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-cyan-400",
									children: savedData?.formation || "4-3-3"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 148,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 146,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 134,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 128,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-[#150f38] border border-cyan-400/30 rounded-2xl p-3 text-center min-w-[110px]",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] text-gray-400 uppercase font-bold block",
							children: "Gameweek Points"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 156,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-header text-2xl sm:text-3xl font-black text-cyan-400",
							children: [totalPoints, " pts"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 159,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 155,
						columnNumber: 11
					}, this), onEditLineup && /* @__PURE__ */ (void 0)("button", {
						type: "button",
						onClick: onEditLineup,
						className: "px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-purple-500/25 flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (void 0)(PenLine, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 170,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("span", { children: "Modify Squad" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 171,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 165,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 154,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 127,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${clubValidation.isCompliant ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/15 border-rose-500/40 text-rose-300"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [clubValidation.isCompliant ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-5 h-5 text-emerald-400 shrink-0" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 189,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleAlert, { className: "w-5 h-5 text-rose-400 shrink-0" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 191,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
						className: "block font-black uppercase text-sm",
						children: clubValidation.isCompliant ? "3-Player Club Quota: Fully Compliant" : "Rule Violation: 3-Player Club Quota Exceeded"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 194,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-gray-300",
						children: clubValidation.isCompliant ? "Every real-world club has 3 or fewer players selected in this starting 11." : `Violated clubs: ${clubValidation.violatedClubs.join(", ")}. Maximum 3 players allowed per team.`
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 199,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 193,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 187,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: Object.entries(clubValidation.clubCounts).map(([club, count]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: `px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${count > 3 ? "bg-rose-500 text-white animate-pulse" : "bg-white/10 text-gray-200"}`,
						children: [
							club,
							": ",
							count,
							"/3"
						]
					}, club, true, {
						fileName: _jsxFileName$1,
						lineNumber: 210,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 208,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 180,
				columnNumber: 7
			}, this),
			starters.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "py-14 text-center bg-black/30 rounded-2xl border border-white/5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "w-10 h-10 text-gray-500 mx-auto" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 229,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
						className: "text-white font-bold text-base",
						children: ["No Lineup Saved Yet for Gameweek ", selectedGameweek]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 230,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-gray-400 max-w-md mx-auto",
						children: "Build and lock your starting 11 players before the final matchweek kickoff to participate in public and mini-league leaderboards."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 231,
						columnNumber: 11
					}, this),
					onEditLineup && /* @__PURE__ */ (void 0)("button", {
						type: "button",
						onClick: onEditLineup,
						className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg",
						children: "Select 11 Players Now"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 235,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 228,
				columnNumber: 9
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: Object.entries(grouped).map(([posTitle, players]) => {
					if (players.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between border-b border-white/10 pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-header text-sm font-black text-gray-300 uppercase tracking-wider",
								children: [
									posTitle,
									" (",
									players.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 252,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-gray-400 font-mono",
								children: "Points • Value"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 255,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 251,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
							children: players.map((player) => {
								const isCap = player.id === captainId;
								const isVice = player.id === viceCaptainId;
								const pts = isCap ? player.gameweekPoints * 2 : player.gameweekPoints;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "bg-[#120d2e] border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md hover:border-cyan-400/40 transition",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative shrink-0",
											children: [
												isCap && /* @__PURE__ */ (void 0)("div", {
													className: "absolute -top-1.5 -left-1.5 z-10 w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[8px] flex items-center justify-center border border-black shadow",
													title: "Captain (2x Points)",
													children: "C"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 275,
													columnNumber: 31
												}, this),
												isVice && /* @__PURE__ */ (void 0)("div", {
													className: "absolute -top-1.5 -left-1.5 z-10 w-4 h-4 rounded-full bg-cyan-400 text-black font-black text-[7px] flex items-center justify-center border border-black shadow",
													title: "Vice Captain",
													children: "VC"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 283,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
													viewBox: "0 0 64 64",
													className: "w-8 h-8",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
														d: "M16 14 L24 4 L40 4 L48 14 L56 22 L48 30 L44 26 L44 58 L20 58 L20 26 L16 30 L8 22 Z",
														fill: player.clubColor || "#00ff85",
														stroke: "#111827",
														strokeWidth: "2"
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 291,
														columnNumber: 31
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 290,
													columnNumber: 29
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 273,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-black text-white text-xs block truncate",
												children: player.name
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 301,
												columnNumber: 29
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-gray-400 truncate block",
												children: [
													player.clubShortCode,
													" • ",
													player.position
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 304,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 300,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 271,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-right shrink-0 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs font-black text-cyan-300 block",
											children: [
												pts,
												" pts ",
												isCap && /* @__PURE__ */ (void 0)("span", {
													className: "text-[9px] text-amber-300",
													children: "(2x)"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 312,
													columnNumber: 49
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 311,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] text-gray-400",
											children: [
												"£",
												player.price.toFixed(1),
												"m"
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 314,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 310,
										columnNumber: 25
									}, this)]
								}, player.id, true, {
									fileName: _jsxFileName$1,
									lineNumber: 267,
									columnNumber: 23
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 260,
							columnNumber: 17
						}, this)]
					}, posTitle, true, {
						fileName: _jsxFileName$1,
						lineNumber: 250,
						columnNumber: 15
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 245,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 115,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/FantasyTeamBuilder.tsx";
var STORAGE_KEY = "fantasy_msl_squad_v3";
var MINI_LEAGUES_STORAGE_KEY = "fantasy_msl_minileagues_real_v3";
var SQUAD_SLOT_DEFINITIONS = [
	{
		slotId: "pitch_gk_1",
		position: "GK",
		label: "Goalkeeper",
		isStarter: true
	},
	{
		slotId: "pitch_def_1",
		position: "DEF",
		label: "Def 1",
		isStarter: true
	},
	{
		slotId: "pitch_def_2",
		position: "DEF",
		label: "Def 2",
		isStarter: true
	},
	{
		slotId: "pitch_def_3",
		position: "DEF",
		label: "Def 3",
		isStarter: true
	},
	{
		slotId: "pitch_def_4",
		position: "DEF",
		label: "Def 4",
		isStarter: true
	},
	{
		slotId: "pitch_def_5",
		position: "DEF",
		label: "Def 5",
		isStarter: true
	},
	{
		slotId: "pitch_mid_1",
		position: "MID",
		label: "Mid 1",
		isStarter: true
	},
	{
		slotId: "pitch_mid_2",
		position: "MID",
		label: "Mid 2",
		isStarter: true
	},
	{
		slotId: "pitch_mid_3",
		position: "MID",
		label: "Mid 3",
		isStarter: true
	},
	{
		slotId: "pitch_mid_4",
		position: "MID",
		label: "Mid 4",
		isStarter: true
	},
	{
		slotId: "pitch_mid_5",
		position: "MID",
		label: "Mid 5",
		isStarter: true
	},
	{
		slotId: "pitch_fwd_1",
		position: "FWD",
		label: "Fwd 1",
		isStarter: true
	},
	{
		slotId: "pitch_fwd_2",
		position: "FWD",
		label: "Fwd 2",
		isStarter: true
	},
	{
		slotId: "pitch_fwd_3",
		position: "FWD",
		label: "Fwd 3",
		isStarter: true
	},
	{
		slotId: "bench_gk_sub",
		position: "GK",
		label: "GK Sub",
		isStarter: false,
		benchIndex: 0
	},
	{
		slotId: "bench_sub_1",
		position: "DEF",
		label: "Sub 1",
		isStarter: false,
		benchIndex: 1
	},
	{
		slotId: "bench_sub_2",
		position: "MID",
		label: "Sub 2",
		isStarter: false,
		benchIndex: 2
	},
	{
		slotId: "bench_sub_3",
		position: "FWD",
		label: "Sub 3",
		isStarter: false,
		benchIndex: 3
	}
];
function FantasyTeamBuilder() {
	const [adminRatingsMap, setAdminRatingsMap] = (0, import_react.useState)(() => getAdminPlayerRatings());
	(0, import_react.useEffect)(() => {
		const handleRatingsUpdate = () => {
			setAdminRatingsMap(getAdminPlayerRatings());
		};
		window.addEventListener("mpesa_fantasy_ratings_updated", handleRatingsUpdate);
		window.addEventListener("storage", handleRatingsUpdate);
		return () => {
			window.removeEventListener("mpesa_fantasy_ratings_updated", handleRatingsUpdate);
			window.removeEventListener("storage", handleRatingsUpdate);
		};
	}, []);
	const marketPlayers = (0, import_react.useMemo)(() => {
		return generateFantasyMarket(adminRatingsMap);
	}, [adminRatingsMap]);
	const [slotAssignments, setSlotAssignments] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed && typeof parsed.slotAssignments === "object") return parsed.slotAssignments;
			}
		} catch (e) {
			console.error("Failed to load saved fantasy squad slots", e);
		}
		const defaultList = getDefaultFantasySquad(generateFantasyMarket(), 2);
		const initialMap = {};
		SQUAD_SLOT_DEFINITIONS.forEach((slot) => {
			initialMap[slot.slotId] = null;
		});
		const gks = defaultList.filter((p) => p.position === "GK");
		const defs = defaultList.filter((p) => p.position === "DEF");
		const mids = defaultList.filter((p) => p.position === "MID");
		const fwds = defaultList.filter((p) => p.position === "FWD");
		if (gks[0]) initialMap["pitch_gk_1"] = {
			...gks[0],
			isStarter: true
		};
		if (gks[1]) initialMap["bench_gk_sub"] = {
			...gks[1],
			isStarter: false,
			benchIndex: 0
		};
		defs.slice(0, 4).forEach((d, idx) => {
			initialMap[`pitch_def_${idx + 1}`] = {
				...d,
				isStarter: true
			};
		});
		if (defs[4]) initialMap["bench_sub_1"] = {
			...defs[4],
			isStarter: false,
			benchIndex: 1
		};
		mids.slice(0, 4).forEach((m, idx) => {
			initialMap[`pitch_mid_${idx + 1}`] = {
				...m,
				isStarter: true
			};
		});
		if (mids[4]) initialMap["bench_sub_2"] = {
			...mids[4],
			isStarter: false,
			benchIndex: 2
		};
		fwds.slice(0, 2).forEach((f, idx) => {
			initialMap[`pitch_fwd_${idx + 1}`] = {
				...f,
				isStarter: true
			};
		});
		if (fwds[2]) initialMap["bench_sub_3"] = {
			...fwds[2],
			isStarter: false,
			benchIndex: 3
		};
		return initialMap;
	});
	const [captainId, setCaptainId] = (0, import_react.useState)(() => {
		return 9;
	});
	const [viceCaptainId, setViceCaptainId] = (0, import_react.useState)(() => {
		return 10;
	});
	const [activeChip, setActiveChip] = (0, import_react.useState)(null);
	const [chipsState, setChipsState] = (0, import_react.useState)({ ...DEFAULT_CHIPS });
	const [activeTab, setActiveTab] = (0, import_react.useState)("selection");
	const [selectedSlotForPicker, setSelectedSlotForPicker] = (0, import_react.useState)(null);
	const [pickerSearch, setPickerSearch] = (0, import_react.useState)("");
	const [pickerClubFilter, setPickerClubFilter] = (0, import_react.useState)("ALL");
	const [inspectingPlayer, setInspectingPlayer] = (0, import_react.useState)(null);
	const { currentRole, isSuperAdmin } = useRoleAccess();
	const canEditRatings = (0, import_react.useMemo)(() => {
		if (isSuperAdmin) return true;
		if (!currentRole || currentRole === "GUEST") return false;
		return [
			"SUPER_ADMIN",
			"PRESIDENT",
			"DEPUTY_PRESIDENT",
			"REGULATIONS_MANAGER",
			"MATCH_OFFICIATING_MANAGER",
			"RECORDS_MANAGER",
			"TECH_MANAGER"
		].includes(currentRole);
	}, [isSuperAdmin, currentRole]);
	const [selectedMatchweek, setSelectedMatchweek] = (0, import_react.useState)(5);
	const [lockedMatchweeks, setLockedMatchweeks] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const raw = localStorage.getItem("mpesa_fantasy_locked_weeks");
			if (raw) return JSON.parse(raw);
		} catch {}
		return {
			1: true,
			2: true,
			3: true,
			4: true,
			5: false
		};
	});
	const [leaderboardViewMode, setLeaderboardViewMode] = (0, import_react.useState)("overall");
	const [adminRatingTargetPlayer, setAdminRatingTargetPlayer] = (0, import_react.useState)(null);
	const [adminScoreInput, setAdminScoreInput] = (0, import_react.useState)(8);
	const [adminBonusInput, setAdminBonusInput] = (0, import_react.useState)(0);
	const [adminNotesInput, setAdminNotesInput] = (0, import_react.useState)("");
	const [realLeagues, setRealLeagues] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem(MINI_LEAGUES_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			}
		} catch {}
		return [DEFAULT_PUBLIC_LEAGUE_ENTRIES, {
			id: "acacia-dorm-cup",
			name: "Acacia Dormitory Championship",
			code: "ACA-101",
			type: "classic",
			creator: "Levis Wanyama",
			createdAt: "2026-09-05",
			membersCount: 4,
			entries: [
				{
					rank: 1,
					managerName: "Levis Wanyama",
					teamName: "Royal Ranger Elite",
					gameweekPoints: 61,
					totalPoints: 238,
					gameweekScores: {
						1: 45,
						2: 46,
						3: 44,
						4: 42,
						5: 61
					}
				},
				{
					rank: 2,
					managerName: "You (Your Squad)",
					teamName: "M-Pesa Academy XI",
					gameweekPoints: 59,
					totalPoints: 231,
					gameweekScores: {
						1: 42,
						2: 43,
						3: 45,
						4: 42,
						5: 59
					}
				},
				{
					rank: 3,
					managerName: "Bidan Mwaura",
					teamName: "Mara Strikers",
					gameweekPoints: 47,
					totalPoints: 209,
					gameweekScores: {
						1: 41,
						2: 39,
						3: 40,
						4: 42,
						5: 47
					}
				},
				{
					rank: 4,
					managerName: "Alex Haro",
					teamName: "Acacia Lions",
					gameweekPoints: 38,
					totalPoints: 185,
					gameweekScores: {
						1: 36,
						2: 37,
						3: 36,
						4: 38,
						5: 38
					}
				}
			]
		}];
	});
	const [showCreateLeagueModal, setShowCreateLeagueModal] = (0, import_react.useState)(false);
	const [showJoinLeagueModal, setShowJoinLeagueModal] = (0, import_react.useState)(false);
	const [newLeagueName, setNewLeagueName] = (0, import_react.useState)("");
	const [newLeagueType, setNewLeagueType] = (0, import_react.useState)("classic");
	const [joinLeagueCodeInput, setJoinLeagueCodeInput] = (0, import_react.useState)("");
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3800);
	};
	const currentSquadList = (0, import_react.useMemo)(() => {
		const list = [];
		Object.entries(slotAssignments).forEach(([slotId, player]) => {
			if (player) {
				const def = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === slotId);
				list.push({
					...player,
					isStarter: def ? def.isStarter : true,
					benchIndex: def ? def.benchIndex : void 0,
					isCaptain: player.id === captainId,
					isViceCaptain: player.id === viceCaptainId
				});
			}
		});
		return list;
	}, [
		slotAssignments,
		captainId,
		viceCaptainId
	]);
	const starters = (0, import_react.useMemo)(() => {
		return currentSquadList.filter((p) => p.isStarter);
	}, [currentSquadList]);
	(0, import_react.useMemo)(() => {
		return currentSquadList.filter((p) => !p.isStarter);
	}, [currentSquadList]);
	const currentSquadValue = (0, import_react.useMemo)(() => {
		const sum = currentSquadList.reduce((acc, p) => acc + p.price, 0);
		return Number(sum.toFixed(1));
	}, [currentSquadList]);
	const bankRemaining = (0, import_react.useMemo)(() => {
		return Number((100 - currentSquadValue).toFixed(1));
	}, [currentSquadValue]);
	const clubCompliance = (0, import_react.useMemo)(() => {
		return checkClubLimit(currentSquadList, 3);
	}, [currentSquadList]);
	const formationStatus = (0, import_react.useMemo)(() => {
		return validateFormation(starters);
	}, [starters]);
	const gkCount = starters.filter((p) => p.position === "GK").length;
	const defCount = starters.filter((p) => p.position === "DEF").length;
	const midCount = starters.filter((p) => p.position === "MID").length;
	const fwdCount = starters.filter((p) => p.position === "FWD").length;
	const isGkInvalid = gkCount !== 1;
	const isDefInvalid = defCount < 3 || defCount > 5;
	const isMidInvalid = midCount < 2 || midCount > 5;
	const isFwdInvalid = fwdCount < 1 || fwdCount > 3;
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				slotAssignments,
				captainId,
				viceCaptainId,
				activeChip
			}));
		} catch {}
	}, [
		slotAssignments,
		captainId,
		viceCaptainId,
		activeChip
	]);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(MINI_LEAGUES_STORAGE_KEY, JSON.stringify(realLeagues));
		} catch {}
	}, [realLeagues]);
	const handleLockGameweekLineup = () => {
		if (!formationStatus.isValid) {
			showToast(`⚠ Cannot lock lineup: ${formationStatus.errorMessage || "Invalid formation"}`);
			return;
		}
		if (!clubCompliance.isCompliant) {
			showToast(`⚠ Cannot lock lineup: Exceeds 3 players per club (${clubCompliance.violatedClubs.join(", ")})`);
			return;
		}
		if (currentSquadList.length !== 15) {
			showToast(`⚠ Lineup incomplete: ${currentSquadList.length}/15 squad members selected.`);
			return;
		}
		setLockedMatchweeks((prev) => {
			const updated = {
				...prev,
				[selectedMatchweek]: true
			};
			try {
				localStorage.setItem("mpesa_fantasy_locked_weeks", JSON.stringify(updated));
				localStorage.setItem(`mpesa_fantasy_squad_gw_${selectedMatchweek}`, JSON.stringify(slotAssignments));
			} catch {}
			return updated;
		});
		showToast(`✓ Matchweek ${selectedMatchweek} Lineup Officially Locked & Registered for Scoring!`);
	};
	const handleClearTeam = () => {
		const emptyMap = {};
		SQUAD_SLOT_DEFINITIONS.forEach((slot) => {
			emptyMap[slot.slotId] = null;
		});
		setSlotAssignments(emptyMap);
		setCaptainId(null);
		setViceCaptainId(null);
		showToast("✓ Squad cleared. Click any slot on the pitch grid to draft your players!");
	};
	const handleAutoFillTeam = () => {
		const defaultList = getDefaultFantasySquad(marketPlayers, 3);
		const newMap = {};
		SQUAD_SLOT_DEFINITIONS.forEach((slot) => {
			newMap[slot.slotId] = null;
		});
		const gks = defaultList.filter((p) => p.position === "GK");
		const defs = defaultList.filter((p) => p.position === "DEF");
		const mids = defaultList.filter((p) => p.position === "MID");
		const fwds = defaultList.filter((p) => p.position === "FWD");
		if (gks[0]) newMap["pitch_gk_1"] = {
			...gks[0],
			isStarter: true
		};
		if (gks[1]) newMap["bench_gk_sub"] = {
			...gks[1],
			isStarter: false,
			benchIndex: 0
		};
		defs.slice(0, 4).forEach((d, idx) => {
			newMap[`pitch_def_${idx + 1}`] = {
				...d,
				isStarter: true
			};
		});
		if (defs[4]) newMap["bench_sub_1"] = {
			...defs[4],
			isStarter: false,
			benchIndex: 1
		};
		mids.slice(0, 4).forEach((m, idx) => {
			newMap[`pitch_mid_${idx + 1}`] = {
				...m,
				isStarter: true
			};
		});
		if (mids[4]) newMap["bench_sub_2"] = {
			...mids[4],
			isStarter: false,
			benchIndex: 2
		};
		fwds.slice(0, 2).forEach((f, idx) => {
			newMap[`pitch_fwd_${idx + 1}`] = {
				...f,
				isStarter: true
			};
		});
		if (fwds[2]) newMap["bench_sub_3"] = {
			...fwds[2],
			isStarter: false,
			benchIndex: 3
		};
		setSlotAssignments(newMap);
		const firstStarter = defaultList.find((p) => p.isStarter);
		const secondStarter = defaultList.filter((p) => p.isStarter)[1];
		setCaptainId(firstStarter ? firstStarter.id : null);
		setViceCaptainId(secondStarter ? secondStarter.id : null);
		showToast("✓ Recommended 15-player balanced squad loaded within £100m budget and 3-players/club rule.");
	};
	const handleRemoveSlot = (slotId, e) => {
		if (e) e.stopPropagation();
		const removedPlayer = slotAssignments[slotId];
		if (!removedPlayer) return;
		setSlotAssignments((prev) => ({
			...prev,
			[slotId]: null
		}));
		if (captainId === removedPlayer.id) setCaptainId(null);
		if (viceCaptainId === removedPlayer.id) setViceCaptainId(null);
		showToast(`Removed ${removedPlayer.name} from slot.`);
	};
	const handleSelectPlayerForSlot = (player) => {
		if (!selectedSlotForPicker) return;
		const targetSlotId = selectedSlotForPicker.slotId;
		const existingPlayerInSlot = slotAssignments[targetSlotId];
		if (Object.keys(slotAssignments).find((sId) => sId !== targetSlotId && slotAssignments[sId]?.id === player.id)) {
			showToast(`⚠ ${player.name} is already in your squad!`);
			return;
		}
		const priceDelta = player.price - (existingPlayerInSlot ? existingPlayerInSlot.price : 0);
		if (bankRemaining - priceDelta < 0) {
			showToast(`⚠ Insufficient budget! Need £${(priceDelta - bankRemaining).toFixed(1)}m more.`);
			return;
		}
		const compliance = checkClubLimit(currentSquadList.filter((p) => !existingPlayerInSlot || p.id !== existingPlayerInSlot.id).concat({
			...player,
			isStarter: selectedSlotForPicker.isStarter,
			benchIndex: selectedSlotForPicker.benchIndex
		}), 3);
		if (!compliance.isCompliant) {
			showToast(`⚠ Club limit exceeded: Maximum 3 players permitted from ${compliance.violatedClubs.join(", ")}.`);
			return;
		}
		setSlotAssignments((prev) => ({
			...prev,
			[targetSlotId]: {
				...player,
				isStarter: selectedSlotForPicker.isStarter,
				benchIndex: selectedSlotForPicker.benchIndex
			}
		}));
		if (!captainId && selectedSlotForPicker.isStarter) setCaptainId(player.id);
		setSelectedSlotForPicker(null);
		showToast(`✓ Added ${player.name} (${player.clubShortCode}) to ${selectedSlotForPicker.label}!`);
	};
	const handleOpenRatingEditor = (player) => {
		if (!canEditRatings) {
			showToast("🔒 Official Ratings are certified by the MSL Board. Viewers have read-only access.");
			return;
		}
		setAdminRatingTargetPlayer(player);
		setAdminScoreInput(player.adminRating || 7.5);
		setAdminBonusInput(player.adminBonusPoints || 0);
		setAdminNotesInput("");
	};
	const handleSaveAdminRating = (e) => {
		e.preventDefault();
		if (!canEditRatings) {
			showToast("🔒 Permission Denied: Viewers cannot update official player ratings.");
			setAdminRatingTargetPlayer(null);
			return;
		}
		if (!adminRatingTargetPlayer) return;
		const newRatingRecord = {
			playerId: adminRatingTargetPlayer.id,
			playerName: adminRatingTargetPlayer.name,
			clubName: adminRatingTargetPlayer.clubName,
			position: adminRatingTargetPlayer.position,
			matchRating: Number(adminScoreInput.toFixed(1)),
			bonusPoints: Number(adminBonusInput),
			matchweek: selectedMatchweek,
			notes: adminNotesInput.trim() || "Official Admin Match Performance Rating",
			ratedByAdmin: "MSL Chief Match Commissioner",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		saveAdminPlayerRating(newRatingRecord);
		setAdminRatingsMap(getAdminPlayerRatings());
		setAdminRatingTargetPlayer(null);
		showToast(`✓ Saved official rating for ${newRatingRecord.playerName}: ${newRatingRecord.matchRating} / 10 ⭐ (${newRatingRecord.bonusPoints} bonus pts)`);
	};
	const handleCreateMiniLeague = (e) => {
		e.preventDefault();
		if (!newLeagueName.trim()) return;
		const randomCode = `MSL-${Math.floor(100 + Math.random() * 900)}`;
		const newLeague = {
			id: `real-league-${Date.now()}`,
			name: newLeagueName.trim(),
			code: randomCode,
			type: newLeagueType,
			creator: "Academy Manager",
			createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			membersCount: 1,
			entries: [{
				rank: 1,
				managerName: "You (Your Squad)",
				teamName: "M-Pesa Academy XI",
				gameweekPoints: 59,
				totalPoints: 231,
				gameweekScores: {}
			}]
		};
		setRealLeagues((prev) => [...prev, newLeague]);
		setNewLeagueName("");
		setShowCreateLeagueModal(false);
		showToast(`✓ Created Mini-League "${newLeague.name}"! Share code [${newLeague.code}] with friends.`);
	};
	const pickerCandidates = (0, import_react.useMemo)(() => {
		if (!selectedSlotForPicker) return [];
		return marketPlayers.filter((p) => {
			if (p.position !== selectedSlotForPicker.position) return false;
			if (pickerClubFilter !== "ALL" && p.clubName !== pickerClubFilter) return false;
			if (pickerSearch.trim()) {
				const q = pickerSearch.toLowerCase();
				return p.name.toLowerCase().includes(q) || p.clubName.toLowerCase().includes(q);
			}
			return true;
		}).sort((a, b) => (b.adminRating || 0) - (a.adminRating || 0) || b.totalPoints - a.totalPoints);
	}, [
		marketPlayers,
		selectedSlotForPicker,
		pickerClubFilter,
		pickerSearch
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			toastMessage && /* @__PURE__ */ (void 0)("div", {
				className: "fixed bottom-6 right-6 z-50 bg-[#0a1020] border-2 border-[#00ff85] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce",
				children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "w-5 h-5 text-[#00ff85] shrink-0" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 705,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", {
					className: "text-sm font-semibold",
					children: toastMessage
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 706,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 704,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1527] via-[#101b38] to-[#0d1527] border border-cyan-500/30 p-6 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 712,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap items-center gap-2 mb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "px-3 py-1 text-xs font-black uppercase tracking-wider bg-[#00ff85]/20 text-[#00ff85] border border-[#00ff85]/40 rounded-full flex items-center gap-1.5 shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flame, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 717,
												columnNumber: 17
											}, this),
											"Matchweek ",
											selectedMatchweek,
											" Active"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 716,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/30 rounded-full",
										children: "Virtual £100.0m Budget"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 720,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full",
										children: "Strict Max 3 / Club Rule"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 723,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "px-3 py-1 text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full",
										children: "Points Driven by Admin Match Ratings"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 726,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 715,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "w-8 h-8 text-[#00ff85]" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 731,
									columnNumber: 15
								}, this), "Fantasy MSL Football"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 730,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm sm:text-base text-slate-300 mt-1 max-w-2xl",
								children: "Build your 15-player squad on the tactical pitch grid. Select and lock in your fantasy lineup every matchweek within £100M budget and 3-player-per-club rule."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 734,
								columnNumber: 13
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 714,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-[#080d1a]/90 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-4 sm:gap-6 backdrop-blur-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold",
										children: "Remaining Bank"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 742,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: `text-2xl font-black ${bankRemaining < 0 ? "text-red-400" : "text-[#00ff85]"}`,
										children: [
											"£",
											bankRemaining.toFixed(1),
											"m"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 743,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[11px] text-slate-400",
										children: "Total: £100.0m"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 746,
										columnNumber: 15
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 741,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-10 w-px bg-white/10" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 748,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold",
										children: "Squad Value"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 750,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-2xl font-black text-white",
										children: [
											"£",
											currentSquadValue.toFixed(1),
											"m"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 751,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[11px] text-cyan-400",
										children: [currentSquadList.length, "/15 Selected"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 752,
										columnNumber: 15
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 749,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-10 w-px bg-white/10" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 754,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: handleClearTeam,
										className: "px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
										title: "Clear all 15 squad slots to start from scratch",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 761,
											columnNumber: 17
										}, this), "Clear Team"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 756,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: handleAutoFillTeam,
										className: "px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
										title: "Auto-fill recommended balanced squad",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: "w-3.5 h-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 769,
											columnNumber: 17
										}, this), "Auto-Fill 15"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 764,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 755,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 740,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 713,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-5 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-bold text-slate-300 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-4 h-4 text-cyan-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 780,
									columnNumber: 15
								}, this), "Gameweek:"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 779,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1.5",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((gw) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => {
										setSelectedMatchweek(gw);
										showToast(`Switched view to Matchweek ${gw}`);
									},
									className: `px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${selectedMatchweek === gw ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20" : "bg-white/5 text-slate-300 hover:text-white border border-white/10"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["GW ", gw] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 798,
										columnNumber: 19
									}, this), lockedMatchweeks[gw] && /* @__PURE__ */ (void 0)(Lock, { className: "w-3 h-3 text-slate-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 799,
										columnNumber: 44
									}, this)]
								}, gw, true, {
									fileName: _jsxFileName,
									lineNumber: 785,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 783,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 778,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: lockedMatchweeks[selectedMatchweek] ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "px-3.5 py-1.5 rounded-xl bg-[#00ff85]/20 text-[#00ff85] border border-[#00ff85]/40 text-xs font-black flex items-center gap-1.5 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-4 h-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 808,
										columnNumber: 17
									}, this),
									"Matchweek ",
									selectedMatchweek,
									" Lineup Locked & Certified"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 807,
								columnNumber: 15
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: handleLockGameweekLineup,
								className: "px-4 py-2 rounded-xl bg-gradient-to-r from-[#00ff85] to-emerald-400 hover:brightness-110 text-slate-950 text-xs font-black transition shadow-lg shadow-[#00ff85]/20 flex items-center gap-1.5 cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 817,
										columnNumber: 17
									}, this),
									"Confirm & Lock Matchweek ",
									selectedMatchweek,
									" Lineup"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 812,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 805,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 777,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 text-slate-300 font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-4 h-4 text-[#00f0ff]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 827,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Strict Club Quota (Max 3 Players per Club):" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 828,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 826,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center gap-2 sm:gap-3",
							children: [
								"Samba",
								"Royal Rangers",
								"Young Stars City",
								"Mzinga Boyz"
							].map((club) => {
								const count = clubCompliance.clubCounts[club] || 0;
								const isFull = count === 3;
								const isOver = count > 3;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: `px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 border transition ${isOver ? "bg-red-500/30 text-red-200 border-red-500 shadow-md shadow-red-500/30 animate-pulse" : isFull ? "bg-[#00ff85]/20 text-[#00ff85] border-[#00ff85]/40 font-black" : "bg-white/5 text-slate-300 border-white/10"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [club, ":"] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 846,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: isOver ? "text-red-400 font-black text-sm" : isFull ? "text-[#00ff85] font-black" : "text-white",
										children: [
											count,
											"/3 ",
											isOver ? "(Limit Exceeded!)" : isFull ? "(Max 3)" : ""
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 847,
										columnNumber: 19
									}, this)]
								}, club, true, {
									fileName: _jsxFileName,
									lineNumber: 836,
									columnNumber: 17
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 830,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 825,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 711,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2 bg-[#0d1527] p-1.5 rounded-2xl border border-white/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("selection"),
							className: `px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${activeTab === "selection" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-400/25" : "text-slate-300 hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 868,
								columnNumber: 13
							}, this), "11-Player Pitch Selection"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 860,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("my_squad"),
							className: `px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${activeTab === "my_squad" ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25" : "text-slate-300 hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-4 h-4 text-cyan-300" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 879,
								columnNumber: 13
							}, this), "My Fantasy Squad"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 871,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("pitch"),
							className: `px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${activeTab === "pitch" ? "bg-[#00ff85] text-slate-950 shadow-md shadow-[#00ff85]/20" : "text-slate-300 hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 890,
								columnNumber: 13
							}, this), "15-Squad Roster (11 + 4)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 882,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("ratings"),
							className: `px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${activeTab === "ratings" ? "bg-purple-500 text-white shadow-md shadow-purple-500/20" : "text-slate-300 hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Star, { className: "w-4 h-4 text-amber-300" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 901,
								columnNumber: 13
							}, this), "Admin Match Ratings Desk"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 893,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("leagues"),
							className: `px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${activeTab === "leagues" ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20" : "text-slate-300 hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 912,
								columnNumber: 13
							}, this), "Real Mini-Leagues"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 904,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("rules"),
							className: `px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${activeTab === "rules" ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20" : "text-slate-300 hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Info, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 923,
								columnNumber: 13
							}, this), "Scoring Rules Matrix"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 915,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 859,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: formationStatus.isValid ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-[#00ff85] border border-emerald-500/40 text-xs font-black flex items-center gap-1.5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 931,
								columnNumber: 15
							}, this),
							"Valid Formation: ",
							formationStatus.formationName
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 930,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 border-2 border-red-500 text-xs font-black flex items-center gap-1.5 animate-pulse shadow-md shadow-red-500/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleAlert, { className: "w-4 h-4 text-red-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 936,
								columnNumber: 15
							}, this),
							"Invalid Formation (",
							starters.length,
							"/11 Starters)"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 935,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 928,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 858,
				columnNumber: 7
			}, this),
			!formationStatus.isValid && /* @__PURE__ */ (void 0)("div", {
				className: "bg-red-950/80 border-2 border-red-500/90 rounded-2xl p-4 shadow-xl shadow-red-500/20 text-red-100 space-y-2 animate-in fade-in duration-200",
				children: [
					/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-6 h-6 text-red-400 shrink-0 animate-bounce" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 947,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("h3", {
							className: "text-sm font-black uppercase tracking-wider text-red-300",
							children: "Formation Validation Alert: Formation Does Not Meet Official League Requirements"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 948,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 946,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("p", {
						className: "text-xs text-red-200 pl-8 leading-relaxed",
						children: formationStatus.errorMessage || "Lineup incomplete or fails minimum tactical balance rules."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 952,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "pl-8 flex flex-wrap gap-2 pt-1 text-[11px] font-bold",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: `px-2 py-0.5 rounded border ${isGkInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`,
								children: [
									"GK: ",
									gkCount,
									"/1 ",
									isGkInvalid ? "(Requires exactly 1 GK)" : "✓"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 956,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								className: `px-2 py-0.5 rounded border ${isDefInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`,
								children: [
									"DEF: ",
									defCount,
									"/5 ",
									defCount < 3 ? "(Needs at least 3 Defenders)" : defCount > 5 ? "(Max 5 Defenders)" : "✓"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 959,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								className: `px-2 py-0.5 rounded border ${isMidInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`,
								children: [
									"MID: ",
									midCount,
									"/5 ",
									midCount < 2 ? "(Needs at least 2 Midfielders)" : midCount > 5 ? "(Max 5 Midfielders)" : "✓"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 962,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								className: `px-2 py-0.5 rounded border ${isFwdInvalid ? "bg-red-500/30 text-red-300 border-red-500 font-black" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`,
								children: [
									"FWD: ",
									fwdCount,
									"/3 ",
									fwdCount < 1 ? "(Needs at least 1 Forward)" : fwdCount > 3 ? "(Max 3 Forwards)" : "✓"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 965,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 955,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 945,
				columnNumber: 9
			}, this),
			!clubCompliance.isCompliant && /* @__PURE__ */ (void 0)("div", {
				className: "bg-red-950/80 border-2 border-red-500 rounded-2xl p-4 shadow-xl text-red-100 flex items-center gap-3",
				children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-6 h-6 text-red-400 shrink-0" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 975,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "text-xs",
					children: [
						/* @__PURE__ */ (void 0)("span", {
							className: "font-bold text-red-300",
							children: "Club Limit Rule Violation: "
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 977,
							columnNumber: 13
						}, this),
						"A maximum of 2 players is permitted from any single club. Overloaded clubs:",
						" ",
						/* @__PURE__ */ (void 0)("strong", { children: clubCompliance.violatedClubs.join(", ") }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 979,
							columnNumber: 13
						}, this),
						". Please remove surplus players to comply with the 2-player rule."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 976,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 974,
				columnNumber: 9
			}, this),
			activeTab === "selection" && /* @__PURE__ */ (void 0)(FantasyTeamSelection, {
				initialGameweek: selectedMatchweek,
				onSaved: () => {
					showToast("Lineup saved! Check 'My Fantasy Squad' to view match performance.");
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 988,
				columnNumber: 9
			}, this),
			activeTab === "my_squad" && /* @__PURE__ */ (void 0)(MyFantasySquad, {
				initialGameweek: selectedMatchweek,
				onEditLineup: () => setActiveTab("selection")
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1e3,
				columnNumber: 9
			}, this),
			activeTab === "pitch" && /* @__PURE__ */ (void 0)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (void 0)("div", {
					className: "relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-[#0b2416]",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "absolute inset-0 pointer-events-none opacity-40",
							style: { backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18) 70px, transparent 70px, transparent 140px),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)
                ` }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1014,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "absolute inset-4 pointer-events-none border-2 border-white/20 rounded-2xl",
							children: [
								/* @__PURE__ */ (void 0)("div", { className: "absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1026,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { className: "absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border-2 border-white/20 rounded-full" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1027,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-20 border-b-2 border-x-2 border-white/20 rounded-b-xl" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1028,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-20 border-t-2 border-x-2 border-white/20 rounded-t-xl" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1029,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1025,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "relative z-10 flex flex-wrap items-center justify-between p-4 bg-slate-950/60 backdrop-blur-md border-b border-white/10",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)("span", { className: "w-2.5 h-2.5 rounded-full bg-[#00ff85] animate-pulse" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1035,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xs font-black uppercase tracking-wider text-emerald-300",
									children: [
										"Starting 11 Pitch Grid · ",
										formationStatus.formationName,
										" Formation"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1036,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1034,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-slate-300",
								children: "Click any position slot to draft or change players. All prices below £10M."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1040,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1033,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "relative z-10 p-6 sm:p-8 flex flex-col justify-between gap-6 min-h-[620px]",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: `p-2.5 rounded-2xl transition ${isGkInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`,
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-[10px] uppercase font-bold text-center mb-2 tracking-wider text-amber-300",
										children: "Goalkeeper (1 Slot)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1049,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex justify-center items-center",
										children: /* @__PURE__ */ (void 0)(TacticalGridSlot, {
											slotDef: SQUAD_SLOT_DEFINITIONS[0],
											player: slotAssignments["pitch_gk_1"],
											captainId,
											viceCaptainId,
											onClickSlot: () => setSelectedSlotForPicker(SQUAD_SLOT_DEFINITIONS[0]),
											onRemoveSlot: () => handleRemoveSlot("pitch_gk_1"),
											onSetCaptain: () => setCaptainId(slotAssignments["pitch_gk_1"]?.id || null),
											onSetViceCaptain: () => setViceCaptainId(slotAssignments["pitch_gk_1"]?.id || null),
											onInspect: () => setInspectingPlayer(slotAssignments["pitch_gk_1"])
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1053,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1052,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1048,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: `p-2.5 rounded-2xl transition ${isDefInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`,
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between mb-2 px-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: `text-[10px] uppercase font-bold tracking-wider ${isDefInvalid ? "text-red-400 font-black animate-pulse" : "text-blue-300"}`,
											children: [
												"Defensive Line (Currently ",
												defCount,
												" DEF · Required: 3 to 5)"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1070,
											columnNumber: 19
										}, this), isDefInvalid && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-black",
											children: "Formation Alert: Need at least 3 Defenders"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1074,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1069,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 justify-items-center",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((idx) => {
											const slotDef = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === `pitch_def_${idx}`);
											if (!slotDef) return null;
											return /* @__PURE__ */ (void 0)(TacticalGridSlot, {
												slotDef,
												player: slotAssignments[slotDef.slotId],
												captainId,
												viceCaptainId,
												onClickSlot: () => setSelectedSlotForPicker(slotDef),
												onRemoveSlot: () => handleRemoveSlot(slotDef.slotId),
												onSetCaptain: () => setCaptainId(slotAssignments[slotDef.slotId]?.id || null),
												onSetViceCaptain: () => setViceCaptainId(slotAssignments[slotDef.slotId]?.id || null),
												onInspect: () => setInspectingPlayer(slotAssignments[slotDef.slotId])
											}, slotDef.slotId, false, {
												fileName: _jsxFileName,
												lineNumber: 1084,
												columnNumber: 23
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1079,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1068,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: `p-2.5 rounded-2xl transition ${isMidInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`,
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between mb-2 px-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: `text-[10px] uppercase font-bold tracking-wider ${isMidInvalid ? "text-red-400 font-black animate-pulse" : "text-emerald-300"}`,
											children: [
												"Midfield Line (Currently ",
												midCount,
												" MID · Required: 2 to 5)"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1104,
											columnNumber: 19
										}, this), isMidInvalid && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-black",
											children: "Formation Alert: Need at least 2 Midfielders"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1108,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1103,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 justify-items-center",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((idx) => {
											const slotDef = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === `pitch_mid_${idx}`);
											if (!slotDef) return null;
											return /* @__PURE__ */ (void 0)(TacticalGridSlot, {
												slotDef,
												player: slotAssignments[slotDef.slotId],
												captainId,
												viceCaptainId,
												onClickSlot: () => setSelectedSlotForPicker(slotDef),
												onRemoveSlot: () => handleRemoveSlot(slotDef.slotId),
												onSetCaptain: () => setCaptainId(slotAssignments[slotDef.slotId]?.id || null),
												onSetViceCaptain: () => setViceCaptainId(slotAssignments[slotDef.slotId]?.id || null),
												onInspect: () => setInspectingPlayer(slotAssignments[slotDef.slotId])
											}, slotDef.slotId, false, {
												fileName: _jsxFileName,
												lineNumber: 1118,
												columnNumber: 23
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1113,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1102,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: `p-2.5 rounded-2xl transition ${isFwdInvalid ? "border-2 border-red-500/80 bg-red-500/10 shadow-lg shadow-red-500/20" : ""}`,
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between mb-2 px-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: `text-[10px] uppercase font-bold tracking-wider ${isFwdInvalid ? "text-red-400 font-black animate-pulse" : "text-red-300"}`,
											children: [
												"Forward Attackers (Currently ",
												fwdCount,
												" FWD · Required: 1 to 3)"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1138,
											columnNumber: 19
										}, this), isFwdInvalid && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-black",
											children: "Formation Alert: Need at least 1 Forward"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1142,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1137,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "grid grid-cols-3 gap-2 sm:gap-6 justify-items-center max-w-xl mx-auto",
										children: [
											1,
											2,
											3
										].map((idx) => {
											const slotDef = SQUAD_SLOT_DEFINITIONS.find((s) => s.slotId === `pitch_fwd_${idx}`);
											if (!slotDef) return null;
											return /* @__PURE__ */ (void 0)(TacticalGridSlot, {
												slotDef,
												player: slotAssignments[slotDef.slotId],
												captainId,
												viceCaptainId,
												onClickSlot: () => setSelectedSlotForPicker(slotDef),
												onRemoveSlot: () => handleRemoveSlot(slotDef.slotId),
												onSetCaptain: () => setCaptainId(slotAssignments[slotDef.slotId]?.id || null),
												onSetViceCaptain: () => setViceCaptainId(slotAssignments[slotDef.slotId]?.id || null),
												onInspect: () => setInspectingPlayer(slotAssignments[slotDef.slotId])
											}, slotDef.slotId, false, {
												fileName: _jsxFileName,
												lineNumber: 1152,
												columnNumber: 23
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1147,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1136,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1046,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1012,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0b1222] border border-white/10 rounded-3xl p-5 shadow-xl",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(Shield, { className: "w-5 h-5 text-cyan-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1175,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("h3", {
								className: "text-sm font-black uppercase tracking-wider text-white",
								children: "Substitutes Bench Dugout (4 Squad Members)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1176,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1174,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-slate-400",
							children: "1 Goalkeeper Sub + 3 Outfield Reserves (Auto-substitute if a starter doesn't play)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1180,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1173,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
						children: SQUAD_SLOT_DEFINITIONS.filter((s) => !s.isStarter).map((slotDef) => {
							const player = slotAssignments[slotDef.slotId];
							return /* @__PURE__ */ (void 0)("div", {
								className: "p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition flex flex-col justify-between",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300",
										children: [
											slotDef.label,
											" (",
											slotDef.position,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1194,
										columnNumber: 23
									}, this), player && /* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-black text-[#00ff85]",
										children: [
											"£",
											player.price.toFixed(1),
											"m"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1198,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1193,
									columnNumber: 21
								}, this), player ? /* @__PURE__ */ (void 0)("div", {
									className: "my-2",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (void 0)("p", {
												className: "text-sm font-bold text-white truncate",
												children: player.name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1205,
												columnNumber: 27
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] font-bold text-amber-300 flex items-center gap-0.5",
												children: ["⭐ ", player.adminRating || 7.5]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1206,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1204,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("p", {
											className: "text-xs text-slate-400",
											children: [
												player.clubShortCode,
												" · ",
												player.totalPoints,
												" pts"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1210,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10",
											children: [/* @__PURE__ */ (void 0)("button", {
												onClick: () => setSelectedSlotForPicker(slotDef),
												className: "flex-1 py-1 text-[11px] font-bold rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-[#00f0ff] transition",
												children: "Replace"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1214,
												columnNumber: 27
											}, this), /* @__PURE__ */ (void 0)("button", {
												onClick: (e) => handleRemoveSlot(slotDef.slotId, e),
												className: "p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition",
												title: "Remove",
												children: /* @__PURE__ */ (void 0)(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1225,
													columnNumber: 29
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1220,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1213,
											columnNumber: 25
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1203,
									columnNumber: 23
								}, this) : /* @__PURE__ */ (void 0)("button", {
									onClick: () => setSelectedSlotForPicker(slotDef),
									className: "my-3 py-6 rounded-xl border-2 border-dashed border-white/20 hover:border-cyan-400 bg-white/[0.02] hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 transition flex flex-col items-center justify-center gap-1",
									children: [/* @__PURE__ */ (void 0)(Plus, { className: "w-5 h-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1234,
										columnNumber: 25
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-bold",
										children: ["+ Add ", slotDef.label]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1235,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1230,
									columnNumber: 23
								}, this)]
							}, slotDef.slotId, true, {
								fileName: _jsxFileName,
								lineNumber: 1189,
								columnNumber: 19
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1185,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1172,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1010,
				columnNumber: 9
			}, this),
			activeTab === "ratings" && /* @__PURE__ */ (void 0)("div", {
				className: "bg-[#0b1222] border border-white/10 rounded-3xl p-6 space-y-6",
				children: [
					/* @__PURE__ */ (void 0)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4",
						children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h2", {
							className: "text-xl font-black text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(Star, { className: "w-6 h-6 text-amber-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1254,
								columnNumber: 17
							}, this), "Admin Match Ratings Portal"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1253,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-slate-400 mt-1",
							children: "Official Match Commissioners grade player performances (1.0 to 10.0 scale) and award bonus points. Fantasy points recalculate instantly!"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1257,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1252,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2",
							children: canEditRatings ? /* @__PURE__ */ (void 0)("span", {
								className: "px-3 py-1 bg-emerald-500/20 text-[#00ff85] border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1264,
									columnNumber: 19
								}, this), "Admin Editing Clearance"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1263,
								columnNumber: 17
							}, this) : /* @__PURE__ */ (void 0)("span", {
								className: "px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (void 0)(Lock, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1269,
									columnNumber: 19
								}, this), "Public Viewer (Read-Only)"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1268,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1261,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1251,
						columnNumber: 11
					}, this),
					!canEditRatings ? /* @__PURE__ */ (void 0)("div", {
						className: "p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-200 text-xs",
						children: [/* @__PURE__ */ (void 0)(Lock, { className: "w-5 h-5 text-amber-400 shrink-0" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1279,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
							className: "font-bold text-sm",
							children: "Public Viewer Mode Active: Read-Only Ratings"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1281,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-amber-300/80 mt-0.5",
							children: "Public viewers and spectators cannot modify match ratings. All athlete scores and bonus points are certified exclusively by MSL League Commissioners & Referees."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1282,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1280,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1278,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (void 0)("div", {
						className: "p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-purple-200 text-xs",
						children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "w-5 h-5 text-purple-400 shrink-0" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1289,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
							className: "font-bold text-sm",
							children: "Official Commissioner Clearance Active"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1291,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-purple-300/80 mt-0.5",
							children: "You are authorized as an official to grade players and award bonus points. Changes immediately update all fantasy league scores."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1292,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1290,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1288,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "overflow-x-auto rounded-2xl border border-white/10",
						children: /* @__PURE__ */ (void 0)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (void 0)("thead", {
								className: "bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10",
								children: /* @__PURE__ */ (void 0)("tr", { children: [
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-4",
										children: "Player"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1303,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-3",
										children: "Club"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1304,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-3",
										children: "Pos"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1305,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-3 text-right",
										children: "Price (<10M)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1306,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-3 text-center",
										children: "Admin Rating"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1307,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-3 text-center",
										children: "Bonus Pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1308,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-3 text-right",
										children: "Total Pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1309,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("th", {
										className: "py-3 px-4 text-center",
										children: "Status / Action"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1310,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1302,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1301,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("tbody", {
								className: "divide-y divide-white/5",
								children: marketPlayers.map((player) => {
									const rating = player.adminRating || 7;
									const bonus = player.adminBonusPoints || 0;
									return /* @__PURE__ */ (void 0)("tr", {
										className: "hover:bg-white/[0.02] transition",
										children: [
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-4 font-bold text-white flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)("span", { children: player.name }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1320,
													columnNumber: 25
												}, this), player.id === captainId && /* @__PURE__ */ (void 0)("span", {
													className: "px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black",
													children: "(C)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1322,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1319,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-3 text-slate-300",
												children: player.clubName
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1327,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-3",
												children: /* @__PURE__ */ (void 0)("span", {
													className: "px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300",
													children: player.position
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1329,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1328,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-3 text-right font-black text-[#00ff85]",
												children: [
													"£",
													player.price.toFixed(1),
													"m"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1333,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-3 text-center",
												children: /* @__PURE__ */ (void 0)("span", {
													className: "px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-black border border-amber-400/30",
													children: [
														"⭐ ",
														rating.toFixed(1),
														" / 10"
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1337,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1336,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-3 text-center font-bold text-cyan-300",
												children: ["+", bonus]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1341,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-3 text-right font-black text-white text-sm",
												children: player.totalPoints
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1344,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (void 0)("td", {
												className: "py-3 px-4 text-center",
												children: canEditRatings ? /* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => handleOpenRatingEditor(player),
													className: "px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-bold transition flex items-center gap-1 mx-auto cursor-pointer",
													children: [/* @__PURE__ */ (void 0)(PenLine, { className: "w-3.5 h-3.5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1354,
														columnNumber: 29
													}, this), "Update Rating"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1349,
													columnNumber: 27
												}, this) : /* @__PURE__ */ (void 0)("span", {
													className: "px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-bold text-[11px] flex items-center gap-1.5 mx-auto w-fit",
													children: [/* @__PURE__ */ (void 0)(Lock, { className: "w-3.5 h-3.5 text-slate-500" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1359,
														columnNumber: 29
													}, this), "Official Verified"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1358,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1347,
												columnNumber: 23
											}, this)
										]
									}, player.id, true, {
										fileName: _jsxFileName,
										lineNumber: 1318,
										columnNumber: 21
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1313,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1300,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1299,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1250,
				columnNumber: 9
			}, this),
			activeTab === "leagues" && /* @__PURE__ */ (void 0)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (void 0)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h2", {
							className: "text-xl font-black text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(Trophy, { className: "w-6 h-6 text-amber-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1381,
								columnNumber: 17
							}, this), "Real MSL Fantasy Leagues & Competitions"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1380,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-slate-400 mt-1",
							children: "Every matchweek managers pick fantasy squads. Review the Matchweek Leaderboard or the Overall Season Standings that sum up all weeks played."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1384,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1379,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "bg-[#0b1222] border border-white/10 p-1 rounded-2xl flex items-center gap-1",
									children: [/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setLeaderboardViewMode("gameweek"),
										className: `px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${leaderboardViewMode === "gameweek" ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20" : "text-slate-400 hover:text-white"}`,
										children: [
											/* @__PURE__ */ (void 0)(Calendar, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1401,
												columnNumber: 19
											}, this),
											"GW ",
											selectedMatchweek,
											" Leaderboard"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1392,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setLeaderboardViewMode("overall"),
										className: `px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${leaderboardViewMode === "overall" ? "bg-[#00ff85] text-slate-950 shadow-md shadow-[#00ff85]/20" : "text-slate-400 hover:text-white"}`,
										children: [/* @__PURE__ */ (void 0)(Trophy, { className: "w-3.5 h-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1413,
											columnNumber: 19
										}, this), "Overall (Sum All Weeks)"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1404,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1391,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									onClick: () => setShowJoinLeagueModal(true),
									className: "px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition flex items-center gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (void 0)(Plus, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1422,
										columnNumber: 17
									}, this), "Join with Code"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1418,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									onClick: () => setShowCreateLeagueModal(true),
									className: "px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer",
									children: [/* @__PURE__ */ (void 0)(Crown, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1429,
										columnNumber: 17
									}, this), "Create Mini-League"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1425,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1389,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1378,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2 text-slate-300",
							children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "w-4 h-4 text-amber-400 shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1438,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("span", { children: leaderboardViewMode === "gameweek" ? `Displaying verified scores strictly earned during Matchweek ${selectedMatchweek}.` : `Displaying overall cumulative standings summing all completed matchweeks (Weeks 1 to 5).` }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1439,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1437,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "text-slate-400",
								children: "Matchweek:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1446,
								columnNumber: 15
							}, this), [
								1,
								2,
								3,
								4,
								5
							].map((gw) => /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setSelectedMatchweek(gw),
								className: `px-2 py-0.5 rounded text-[11px] font-black transition cursor-pointer ${selectedMatchweek === gw ? "bg-amber-400 text-slate-950 font-black" : "bg-white/5 text-slate-400 hover:text-white"}`,
								children: ["GW", gw]
							}, gw, true, {
								fileName: _jsxFileName,
								lineNumber: 1448,
								columnNumber: 17
							}, this))]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1445,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1436,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-1 gap-6",
						children: realLeagues.map((league) => {
							const sortedEntries = leaderboardViewMode === "gameweek" ? getGameweekLeaderboard(league.entries, selectedMatchweek) : getOverallSeasonLeaderboard(league.entries, 5);
							return /* @__PURE__ */ (void 0)("div", {
								className: "bg-[#0b1222] border border-white/10 rounded-3xl p-5 shadow-xl",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black",
											children: /* @__PURE__ */ (void 0)(Trophy, { className: "w-5 h-5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1480,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1479,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
											className: "text-base font-black text-white flex items-center gap-2",
											children: [/* @__PURE__ */ (void 0)("span", { children: league.name }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1484,
												columnNumber: 27
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
												children: leaderboardViewMode === "gameweek" ? `GW ${selectedMatchweek} View` : "Cumulative Overall"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1485,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1483,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-xs text-slate-400",
											children: [
												"Format: ",
												/* @__PURE__ */ (void 0)("span", {
													className: "text-cyan-400 capitalize",
													children: league.type.replace("_", " ")
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1490,
													columnNumber: 35
												}, this),
												" · Created by ",
												league.creator,
												" · ",
												league.membersCount,
												" Managers"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1489,
											columnNumber: 25
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1482,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1478,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-xs text-slate-400",
											children: "Code:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1496,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "px-3 py-1 bg-white/5 border border-white/15 text-white font-mono text-xs font-bold rounded-xl",
											children: league.code
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1497,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1495,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1477,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "overflow-x-auto rounded-xl border border-white/10",
									children: /* @__PURE__ */ (void 0)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (void 0)("thead", {
											className: "bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10",
											children: /* @__PURE__ */ (void 0)("tr", { children: [
												/* @__PURE__ */ (void 0)("th", {
													className: "py-2.5 px-3 text-center",
													children: "Rank"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1507,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "py-2.5 px-4",
													children: "Manager & Squad"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1508,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "py-2.5 px-3 text-center",
													children: "GW Breakdown"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1509,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "py-2.5 px-3 text-right",
													children: leaderboardViewMode === "gameweek" ? `GW ${selectedMatchweek} Pts` : "Active GW"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1510,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "py-2.5 px-4 text-right",
													children: "Overall Total Pts"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1513,
													columnNumber: 27
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1506,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1505,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("tbody", {
											className: "divide-y divide-white/5",
											children: sortedEntries.map((entry) => {
												const isUser = entry.managerName.includes("You");
												const gwPointsForDisplay = entry.gameweekScores?.[selectedMatchweek] ?? entry.gameweekPoints;
												return /* @__PURE__ */ (void 0)("tr", {
													className: isUser ? "bg-[#00ff85]/10 font-bold" : "hover:bg-white/[0.02]",
													children: [
														/* @__PURE__ */ (void 0)("td", {
															className: "py-2.5 px-3 text-center",
															children: entry.rank === 1 ? /* @__PURE__ */ (void 0)("span", {
																className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs",
																children: "1"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1529,
																columnNumber: 35
															}, this) : entry.rank === 2 ? /* @__PURE__ */ (void 0)("span", {
																className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs",
																children: "2"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1533,
																columnNumber: 35
															}, this) : entry.rank === 3 ? /* @__PURE__ */ (void 0)("span", {
																className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs",
																children: "3"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1537,
																columnNumber: 35
															}, this) : /* @__PURE__ */ (void 0)("span", {
																className: "text-slate-400",
																children: entry.rank
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1541,
																columnNumber: 35
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1527,
															columnNumber: 31
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "py-2.5 px-4",
															children: [/* @__PURE__ */ (void 0)("p", {
																className: `text-sm ${isUser ? "text-[#00ff85] font-black" : "text-white"}`,
																children: entry.teamName
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1545,
																columnNumber: 33
															}, this), /* @__PURE__ */ (void 0)("p", {
																className: "text-[11px] text-slate-400",
																children: entry.managerName
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1548,
																columnNumber: 33
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1544,
															columnNumber: 31
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "py-2.5 px-3 text-center",
															children: /* @__PURE__ */ (void 0)("div", {
																className: "flex items-center justify-center gap-1 text-[10px]",
																children: [
																	1,
																	2,
																	3,
																	4,
																	5
																].map((w) => /* @__PURE__ */ (void 0)("span", {
																	className: `px-1.5 py-0.5 rounded font-mono ${selectedMatchweek === w ? "bg-amber-400/30 text-amber-300 font-bold border border-amber-400/40" : "bg-white/5 text-slate-400"}`,
																	children: [
																		"W",
																		w,
																		":",
																		entry.gameweekScores?.[w] ?? "-"
																	]
																}, w, true, {
																	fileName: _jsxFileName,
																	lineNumber: 1553,
																	columnNumber: 37
																}, this))
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1551,
																columnNumber: 33
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1550,
															columnNumber: 31
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "py-2.5 px-3 text-right",
															children: /* @__PURE__ */ (void 0)("span", {
																className: `font-mono font-bold ${leaderboardViewMode === "gameweek" ? "text-amber-300 text-sm font-black" : "text-slate-300"}`,
																children: [gwPointsForDisplay, " pts"]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 1567,
																columnNumber: 33
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1566,
															columnNumber: 31
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "py-2.5 px-4 text-right",
															children: /* @__PURE__ */ (void 0)("span", {
																className: `text-base font-black ${leaderboardViewMode === "overall" ? "text-[#00ff85]" : "text-white"}`,
																children: [entry.totalPoints, " pts"]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 1576,
																columnNumber: 33
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1575,
															columnNumber: 31
														}, this)
													]
												}, entry.rank, true, {
													fileName: _jsxFileName,
													lineNumber: 1523,
													columnNumber: 29
												}, this);
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1516,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1504,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1503,
									columnNumber: 19
								}, this)]
							}, league.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1473,
								columnNumber: 17
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1464,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1377,
				columnNumber: 9
			}, this),
			activeTab === "rules" && /* @__PURE__ */ (void 0)("div", {
				className: "bg-[#0b1222] border border-white/10 rounded-3xl p-6 space-y-6",
				children: [/* @__PURE__ */ (void 0)("div", {
					className: "border-b border-white/10 pb-4",
					children: [/* @__PURE__ */ (void 0)("h2", {
						className: "text-xl font-black text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (void 0)(Award, { className: "w-6 h-6 text-[#00ff85]" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1604,
							columnNumber: 15
						}, this), "Official Fantasy MSL Scoring & Rulebook"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1603,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("p", {
						className: "text-sm text-slate-400 mt-1",
						children: "Virtual players score points based on Admin Match Ratings and official Sunday on-pitch events."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1607,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1602,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "text-sm font-black uppercase tracking-wider text-[#00ff85] flex items-center gap-2",
							children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1615,
								columnNumber: 17
							}, this), "Points Awarded"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1614,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between text-purple-200",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Official Admin Match Rating (e.g. 8.5/10)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1620,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-black text-purple-300 text-sm",
										children: "Rating x 2 pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1621,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1619,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Goal scored by a Forward (FWD)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1624,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-black text-[#00ff85] text-sm",
										children: "+4 pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1625,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1623,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Goal scored by a Midfielder (MID)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1628,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-black text-[#00ff85] text-sm",
										children: "+5 pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1629,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1627,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Goal scored by a Defender or Goalkeeper (DEF/GK)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1632,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-black text-[#00ff85] text-sm",
										children: "+6 pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1633,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1631,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Assist (Final pass or touch before goal)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1636,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-black text-cyan-400 text-sm",
										children: "+3 pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1637,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1635,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Clean Sheet by Goalkeeper or Defender (played 60+ mins)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1640,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-black text-[#00ff85] text-sm",
										children: "+4 pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1641,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1639,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl flex items-center justify-between",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Every 3 Saves made by a Goalkeeper" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1644,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-black text-amber-400 text-sm",
										children: "+1 pt"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1645,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1643,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1618,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1613,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (void 0)("h3", {
								className: "text-sm font-black uppercase tracking-wider text-red-400 flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1652,
									columnNumber: 17
								}, this), "Deductions & Squad Governance"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1651,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2 text-xs",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-red-200",
										children: [/* @__PURE__ */ (void 0)("span", { children: "Red Card" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1657,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-black text-red-400 text-sm",
											children: "-3 pts"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1658,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1656,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-red-200",
										children: [/* @__PURE__ */ (void 0)("span", { children: "Yellow Card" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1661,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-black text-red-400 text-sm",
											children: "-1 pt"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1662,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1660,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-red-200",
										children: [/* @__PURE__ */ (void 0)("span", { children: "Every 2 Goals Conceded by DEF / GK" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1665,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-black text-red-400 text-sm",
											children: "-1 pt"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1666,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1664,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1655,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "p-4 bg-slate-900 border border-white/10 rounded-2xl space-y-2 text-xs text-slate-300",
								children: [/* @__PURE__ */ (void 0)("h4", {
									className: "font-bold text-white text-sm",
									children: "Squad Rules:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1671,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("ul", {
									className: "list-disc list-inside space-y-1",
									children: [
										/* @__PURE__ */ (void 0)("li", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Budget:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1673,
											columnNumber: 23
										}, this), " £100.0m Virtual Budget."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1673,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("li", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Player Prices:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1674,
											columnNumber: 23
										}, this), " All players priced strictly below 10M."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1674,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("li", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Club Limit:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1675,
											columnNumber: 23
										}, this), " Strictly max 2 players per real club."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1675,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("li", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Starting 11:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1676,
											columnNumber: 23
										}, this), " Exactly 1 GK, 3-5 DEF, 2-5 MID, 1-3 FWD."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1676,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("li", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Captaincy:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1677,
											columnNumber: 23
										}, this), " Captain scores 2x; Vice-Captain inherits 2x if Captain is absent."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1677,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1672,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1670,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1650,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1612,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1601,
				columnNumber: 9
			}, this),
			selectedSlotForPicker && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0b1222] border-2 border-cyan-400 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative text-left max-h-[85vh] flex flex-col",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							onClick: () => setSelectedSlotForPicker(null),
							className: "absolute top-5 right-5 text-slate-400 hover:text-white",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1695,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1691,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "mb-4 pb-3 border-b border-white/10",
							children: [
								/* @__PURE__ */ (void 0)("span", {
									className: "text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/40",
									children: [
										"Selecting ",
										selectedSlotForPicker.label,
										" (",
										selectedSlotForPicker.position,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1700,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("h3", {
									className: "text-xl font-black text-white mt-1",
									children: ["Pick a Real ", selectedSlotForPicker.position === "GK" ? "Goalkeeper" : selectedSlotForPicker.position === "DEF" ? "Defender" : selectedSlotForPicker.position === "MID" ? "Midfielder" : "Forward"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1703,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-slate-400 mt-0.5",
									children: [
										"Bank Remaining: ",
										/* @__PURE__ */ (void 0)("strong", {
											className: "text-[#00ff85]",
											children: [
												"£",
												bankRemaining.toFixed(1),
												"m"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1707,
											columnNumber: 33
										}, this),
										" · Club Limit: ",
										/* @__PURE__ */ (void 0)("strong", {
											className: "text-amber-300",
											children: "Max 3 per Club"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1707,
											columnNumber: 120
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1706,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1699,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (void 0)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1714,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									placeholder: `Search ${selectedSlotForPicker.position} by name...`,
									value: pickerSearch,
									onChange: (e) => setPickerSearch(e.target.value),
									className: "w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1715,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1713,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("select", {
								value: pickerClubFilter,
								onChange: (e) => setPickerClubFilter(e.target.value),
								className: "bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400",
								children: [
									/* @__PURE__ */ (void 0)("option", {
										value: "ALL",
										children: "All MSL Clubs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1729,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "Samba",
										children: "Samba"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1730,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "Royal Rangers",
										children: "Royal Rangers"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1731,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "Young Stars City",
										children: "Young Stars City"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1732,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "Mzinga Boyz",
										children: "Mzinga Boyz"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1733,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1724,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1712,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "overflow-y-auto flex-1 space-y-2 pr-1",
							children: pickerCandidates.length === 0 ? /* @__PURE__ */ (void 0)("div", {
								className: "p-8 text-center text-slate-400 text-xs",
								children: [
									"No ",
									selectedSlotForPicker.position,
									" found matching your filters."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1740,
								columnNumber: 17
							}, this) : pickerCandidates.map((candidate) => {
								const existingInSlot = slotAssignments[selectedSlotForPicker.slotId];
								const alreadyInSlot = existingInSlot?.id === candidate.id;
								const alreadyInSquad = currentSquadList.some((p) => p.id === candidate.id && p.id !== existingInSlot?.id);
								const clubCount = clubCompliance.clubCounts[candidate.clubName] || 0;
								const isExistingFromSameClub = existingInSlot && existingInSlot.clubName === candidate.clubName;
								const clubLimitReached = !alreadyInSlot && !isExistingFromSameClub && clubCount >= 3;
								const costDiff = candidate.price - (existingInSlot ? existingInSlot.price : 0);
								const canAfford = bankRemaining - costDiff >= 0;
								return /* @__PURE__ */ (void 0)("div", {
									className: `p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${alreadyInSlot ? "bg-[#00ff85]/10 border-[#00ff85]/40" : clubLimitReached || !canAfford || alreadyInSquad ? "bg-white/[0.02] border-white/5 opacity-60" : "bg-slate-900/60 border-white/10 hover:border-cyan-400/50"}`,
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border",
											style: {
												backgroundColor: `${candidate.clubColor}22`,
												borderColor: candidate.clubColor,
												color: candidate.clubColor
											},
											children: candidate.jerseyNumber
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1768,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
											className: "text-sm font-bold text-white flex items-center gap-2",
											children: [/* @__PURE__ */ (void 0)("span", { children: candidate.name }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1780,
												columnNumber: 29
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold",
												children: ["⭐ ", candidate.adminRating || 7.5]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1781,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1779,
											columnNumber: 27
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-xs text-slate-400",
											children: [
												candidate.clubName,
												" · ",
												candidate.totalPoints,
												" pts"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1785,
											columnNumber: 27
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1778,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1767,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (void 0)("p", {
												className: "text-sm font-black text-[#00ff85]",
												children: [
													"£",
													candidate.price.toFixed(1),
													"m"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1793,
												columnNumber: 27
											}, this), /* @__PURE__ */ (void 0)("p", {
												className: "text-[10px] text-slate-400",
												children: [
													"Club: ",
													clubCount,
													"/3"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1794,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1792,
											columnNumber: 25
										}, this), alreadyInSlot ? /* @__PURE__ */ (void 0)("span", {
											className: "px-3 py-1.5 rounded-xl bg-[#00ff85] text-slate-950 font-black text-xs",
											children: "Active Slot"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1798,
											columnNumber: 27
										}, this) : alreadyInSquad ? /* @__PURE__ */ (void 0)("span", {
											className: "px-3 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-bold",
											children: "In Squad"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1802,
											columnNumber: 27
										}, this) : clubLimitReached ? /* @__PURE__ */ (void 0)("span", {
											className: "px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold",
											children: "Club Max (3/3)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1806,
											columnNumber: 27
										}, this) : !canAfford ? /* @__PURE__ */ (void 0)("span", {
											className: "px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold",
											children: "Over Budget"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1810,
											columnNumber: 27
										}, this) : /* @__PURE__ */ (void 0)("button", {
											onClick: () => handleSelectPlayerForSlot(candidate),
											className: "px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition shadow-sm",
											children: "Select"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1814,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1791,
										columnNumber: 23
									}, this)]
								}, candidate.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1757,
									columnNumber: 21
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1738,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1690,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1689,
				columnNumber: 9
			}, this),
			adminRatingTargetPlayer && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0b1222] border-2 border-purple-500 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							onClick: () => setAdminRatingTargetPlayer(null),
							className: "absolute top-5 right-5 text-slate-400 hover:text-white",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1841,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1837,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("h3", {
							className: "text-lg font-black text-white flex items-center gap-2 mb-1",
							children: [/* @__PURE__ */ (void 0)(Star, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1844,
								columnNumber: 15
							}, this), "Set Admin Match Rating"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1843,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-slate-400 mb-4",
							children: [
								"For ",
								/* @__PURE__ */ (void 0)("strong", { children: adminRatingTargetPlayer.name }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1848,
									columnNumber: 19
								}, this),
								" (",
								adminRatingTargetPlayer.position,
								" - ",
								adminRatingTargetPlayer.clubName,
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1847,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("form", {
							onSubmit: handleSaveAdminRating,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex justify-between text-xs font-bold text-slate-300 mb-1",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Match Performance Rating (1.0 - 10.0)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1854,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-amber-400 font-black text-sm",
										children: ["⭐ ", adminScoreInput.toFixed(1)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1855,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1853,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "range",
									min: "3.0",
									max: "10.0",
									step: "0.1",
									value: adminScoreInput,
									onChange: (e) => setAdminScoreInput(Number(e.target.value)),
									className: "w-full accent-amber-400"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1857,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1852,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "text-xs font-bold text-slate-300 block mb-1",
									children: "Bonus Points (0 to 5 pts)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1869,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("select", {
									value: adminBonusInput,
									onChange: (e) => setAdminBonusInput(Number(e.target.value)),
									className: "w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white",
									children: [
										/* @__PURE__ */ (void 0)("option", {
											value: 0,
											children: "0 Bonus Points"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1877,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("option", {
											value: 1,
											children: "+1 Bonus Point"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1878,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("option", {
											value: 2,
											children: "+2 Bonus Points"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1879,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("option", {
											value: 3,
											children: "+3 Bonus Points (Man of the Match)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1880,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("option", {
											value: 4,
											children: "+4 Bonus Points"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1881,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("option", {
											value: 5,
											children: "+5 Bonus Points (Outstanding Record)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1882,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1872,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1868,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "text-xs font-bold text-slate-300 block mb-1",
									children: "Commissioner Match Notes"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1887,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									placeholder: "e.g. Masterclass defensive coordination in Derby",
									value: adminNotesInput,
									onChange: (e) => setAdminNotesInput(e.target.value),
									className: "w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1890,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1886,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl text-xs text-slate-300",
									children: [
										"Formula Result: ",
										/* @__PURE__ */ (void 0)("strong", { children: [Math.round(adminScoreInput * 2) + adminBonusInput, " fantasy base points"] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1900,
											columnNumber: 33
										}, this),
										" will be instantly awarded."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1899,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "flex justify-end gap-2 pt-2",
									children: [/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setAdminRatingTargetPlayer(null),
										className: "px-4 py-2 text-xs font-bold text-slate-400 hover:text-white",
										children: "Cancel"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1904,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "submit",
										className: "px-4 py-2 text-xs font-black text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition shadow-md shadow-purple-600/30",
										children: "Save & Update Points"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1911,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1903,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1851,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1836,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1835,
				columnNumber: 9
			}, this),
			inspectingPlayer && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0b1222] border-2 border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							onClick: () => setInspectingPlayer(null),
							className: "absolute top-4 right-4 text-slate-400 hover:text-white",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1933,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1929,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-3 mb-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "w-12 h-12 rounded-2xl bg-[#00ff85]/20 border border-[#00ff85]/30 flex items-center justify-center text-[#00ff85] font-black text-lg",
								children: inspectingPlayer.jerseyNumber
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1937,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
								className: "text-xl font-black text-white",
								children: inspectingPlayer.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1941,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-slate-400",
								children: [
									inspectingPlayer.position,
									" · ",
									inspectingPlayer.clubName,
									" (",
									inspectingPlayer.clubShortCode,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1942,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1940,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1936,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-3 gap-3 mb-4",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl text-center",
									children: [/* @__PURE__ */ (void 0)("p", {
										className: "text-[10px] text-slate-400 uppercase font-semibold",
										children: "Price"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1950,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-base font-black text-[#00ff85]",
										children: [
											"£",
											inspectingPlayer.price.toFixed(1),
											"m"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1951,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1949,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl text-center",
									children: [/* @__PURE__ */ (void 0)("p", {
										className: "text-[10px] text-slate-400 uppercase font-semibold",
										children: "Admin Rating"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1954,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-base font-black text-amber-400",
										children: ["⭐ ", inspectingPlayer.adminRating || 7.5]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1955,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1953,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "p-3 bg-white/5 rounded-xl text-center",
									children: [/* @__PURE__ */ (void 0)("p", {
										className: "text-[10px] text-slate-400 uppercase font-semibold",
										children: "Total Pts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1958,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-base font-black text-cyan-400",
										children: inspectingPlayer.totalPoints
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1959,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1957,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1948,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("button", {
							onClick: () => setInspectingPlayer(null),
							className: "w-full py-2 bg-white/10 hover:bg-white/20 text-xs font-bold text-white rounded-xl transition",
							children: "Close"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1963,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1928,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1927,
				columnNumber: 9
			}, this),
			showCreateLeagueModal && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "bg-[#0b1222] border-2 border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left",
					children: [
						/* @__PURE__ */ (void 0)("button", {
							onClick: () => setShowCreateLeagueModal(false),
							className: "absolute top-4 right-4 text-slate-400 hover:text-white",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1983,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1979,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("h3", {
							className: "text-lg font-black text-white flex items-center gap-2 mb-3",
							children: [/* @__PURE__ */ (void 0)(Crown, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1986,
								columnNumber: 15
							}, this), "Create Real Mini-League"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1985,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("form", {
							onSubmit: handleCreateMiniLeague,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "text-xs font-bold text-slate-300 block mb-1",
									children: "Mini-League Name"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1991,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Mara Dormitory Invitational",
									value: newLeagueName,
									onChange: (e) => setNewLeagueName(e.target.value),
									className: "w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1994,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1990,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "text-xs font-bold text-slate-300 block mb-1",
									children: "Competition Format"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 2005,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("select", {
									value: newLeagueType,
									onChange: (e) => setNewLeagueType(e.target.value),
									className: "w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400",
									children: [/* @__PURE__ */ (void 0)("option", {
										value: "classic",
										children: "Classic Points League (Cumulative Points)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2013,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("option", {
										value: "head_to_head",
										children: "Head-to-Head League (Weekly 1v1)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2014,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2008,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2004,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "pt-2 flex justify-end gap-2",
									children: [/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setShowCreateLeagueModal(false),
										className: "px-4 py-2 text-xs font-bold text-slate-400 hover:text-white",
										children: "Cancel"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2019,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "submit",
										className: "px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition",
										children: "Create & Get Code"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2026,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2018,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1989,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1978,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1977,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(JoinMiniLeagueModal, {
				isOpen: showJoinLeagueModal,
				onClose: () => setShowJoinLeagueModal(false),
				userSquadName: "M-Pesa Academy XI",
				userGameweekPoints: 59,
				userTotalPoints: 231,
				onJoinSuccess: (joinedLeague) => {
					showToast(`✓ Welcome to "${joinedLeague.name}"! Standings synchronized.`);
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 2041,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 701,
		columnNumber: 5
	}, this);
}
function TacticalGridSlot({ slotDef, player, captainId, viceCaptainId, onClickSlot, onRemoveSlot, onSetCaptain, onSetViceCaptain, onInspect }) {
	const [showMenu, setShowMenu] = (0, import_react.useState)(false);
	if (!player) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		onClick: onClickSlot,
		className: "w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 border-dashed border-white/30 hover:border-[#00ff85] bg-black/30 hover:bg-[#00ff85]/10 text-white/70 hover:text-white transition flex flex-col items-center justify-center gap-1 group shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-8 h-8 rounded-xl bg-white/10 group-hover:bg-[#00ff85]/20 flex items-center justify-center transition",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-4 h-4 text-slate-300 group-hover:text-[#00ff85]" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 2090,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 2089,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-[10px] font-black uppercase text-slate-300 group-hover:text-[#00ff85]",
			children: ["+ ", slotDef.position]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 2092,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 2085,
		columnNumber: 7
	}, this);
	const isCaptain = player.id === captainId;
	const isViceCaptain = player.id === viceCaptainId;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative group flex flex-col items-center",
		children: [
			isCaptain && /* @__PURE__ */ (void 0)("span", {
				className: "absolute -top-2.5 -right-2 z-20 px-1.5 py-0.5 text-[10px] font-black rounded-full shadow-lg bg-amber-400 text-slate-950 border border-slate-900",
				title: "Captain (2x Points)",
				children: "(C)"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 2106,
				columnNumber: 9
			}, this),
			isViceCaptain && /* @__PURE__ */ (void 0)("span", {
				className: "absolute -top-2.5 -right-2 z-20 px-1.5 py-0.5 text-[10px] font-black rounded-full shadow-lg bg-[#00f0ff] text-slate-950 border border-slate-900",
				title: "Vice-Captain (Inherits 2x)",
				children: "VC"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 2114,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => setShowMenu((prev) => !prev),
				className: "relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition transform group-hover:scale-105 shadow-xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-white/20 hover:border-[#00ff85]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-[11px] sm:text-xs font-black text-white",
					children: player.jerseyNumber
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 2127,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-[9px] font-black uppercase px-1 rounded",
					style: {
						backgroundColor: `${player.clubColor}33`,
						color: player.clubColor
					},
					children: player.clubShortCode
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 2128,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 2123,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-1 bg-slate-950/95 border border-white/20 rounded-md px-1.5 py-0.5 text-center shadow-lg max-w-[85px] sm:max-w-[95px]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-[11px] font-bold text-white truncate leading-tight",
					children: player.name
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 2138,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-[10px] font-black text-[#00ff85] leading-none mt-0.5",
					children: [
						"£",
						player.price.toFixed(1),
						"m · ⭐",
						player.adminRating || 7.5
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 2139,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 2137,
				columnNumber: 7
			}, this),
			showMenu && /* @__PURE__ */ (void 0)("div", {
				className: "absolute top-16 z-30 bg-[#090e1c] border border-cyan-500/40 rounded-xl p-2 shadow-2xl w-44 flex flex-col gap-1 text-left backdrop-blur-md animate-in fade-in zoom-in-95",
				children: [
					/* @__PURE__ */ (void 0)("button", {
						onClick: () => {
							onClickSlot();
							setShowMenu(false);
						},
						className: "w-full px-2.5 py-1.5 text-xs text-white hover:bg-[#00f0ff] hover:text-slate-950 rounded-lg font-bold flex items-center gap-1.5 transition",
						children: [/* @__PURE__ */ (void 0)(ArrowRightLeft, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 2154,
							columnNumber: 13
						}, this), "Change Player"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2147,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						onClick: () => {
							onSetCaptain();
							setShowMenu(false);
						},
						className: "w-full px-2.5 py-1.5 text-xs text-white hover:bg-amber-400 hover:text-slate-950 rounded-lg font-bold flex items-center gap-1.5 transition",
						children: [/* @__PURE__ */ (void 0)(Crown, { className: "w-3.5 h-3.5 text-amber-400" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 2164,
							columnNumber: 13
						}, this), "Make Captain (2x)"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2157,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						onClick: () => {
							onSetViceCaptain();
							setShowMenu(false);
						},
						className: "w-full px-2.5 py-1.5 text-xs text-white hover:bg-cyan-400 hover:text-slate-950 rounded-lg font-bold flex items-center gap-1.5 transition",
						children: [/* @__PURE__ */ (void 0)(Star, { className: "w-3.5 h-3.5 text-cyan-400" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 2174,
							columnNumber: 13
						}, this), "Make Vice-Captain"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2167,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						onClick: () => {
							onInspect();
							setShowMenu(false);
						},
						className: "w-full px-2.5 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg font-medium flex items-center gap-1.5 transition",
						children: [/* @__PURE__ */ (void 0)(Info, { className: "w-3.5 h-3.5 text-slate-400" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 2184,
							columnNumber: 13
						}, this), "Stats Breakdown"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2177,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (void 0)("button", {
						onClick: () => {
							onRemoveSlot();
							setShowMenu(false);
						},
						className: "w-full px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/20 rounded-lg font-bold flex items-center gap-1.5 transition border-t border-white/5 pt-1 mt-1",
						children: [/* @__PURE__ */ (void 0)(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 2194,
							columnNumber: 13
						}, this), "Clear Slot"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2187,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 2146,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 2103,
		columnNumber: 5
	}, this);
}
//#endregion
export { recalculateStandingsFromReports as _, fetchSharedLeagueState as a, saveDbPlayers as b, getDbFixtures as c, getDbTeams as d, permanentlyDeleteDbFixture as f, purgeStandingsTableToZero as g, permanentlyDeleteDbTeam as h, computeTeamFormFromFixtures as i, getDbMatchReports as l, permanentlyDeleteDbPlayer as m, MatchweekSelector as n, generateFantasyMarket as o, permanentlyDeleteDbMatchReport as p, broadcastDbChange as r, getAdminPlayerRatings as s, FantasyTeamBuilder as t, getDbPlayers as u, saveAdminPlayerRating as v, saveDbTeams as x, saveDbFixtures as y };
