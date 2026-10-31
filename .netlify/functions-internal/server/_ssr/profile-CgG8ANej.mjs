import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess, t as ROLE_HIERARCHY_DATA } from "./useRoleAccess-qpujIbxr.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CgG8ANej.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/UserProfileView.tsx";
function UserProfileView() {
	const { currentRole, roleTier, roleDetails, switchRole, authorizedActions, restrictedActions, isSuperAdmin } = useRoleAccess();
	const [activeTab, setActiveTab] = (0, import_react.useState)("authorized");
	const [filterCategory, setFilterCategory] = (0, import_react.useState)("ALL");
	const categories = [
		"ALL",
		"Governance",
		"Registration",
		"Match Officiating",
		"Records & Stats",
		"Digital & Media",
		"Master Administrative"
	];
	const filteredAuthorized = authorizedActions.filter((action) => {
		if (filterCategory === "ALL") return true;
		return action.category === filterCategory;
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8 font-sans",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-6xl mx-auto space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e2554]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative w-12 h-12 rounded-2xl bg-white border-2 border-emerald-400 p-1 flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: "/mpesa-academy-icon.png",
								alt: "M-Pesa Foundation Academy Crest",
								className: "w-full h-full object-contain",
								onError: (e) => {
									e.currentTarget.src = "/favicon.ico";
								}
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 42,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black animate-pulse" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 50,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 41,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] uppercase font-black tracking-widest text-emerald-400",
								children: "M-Pesa Foundation Academy"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 54,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-mono font-bold",
								children: "SECURITY CLEARANCE"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 57,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 53,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white",
							children: ["Official User Profile ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[#00f0ff]",
								children: "& Role Access"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 62,
								columnNumber: 39
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 61,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 52,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 40,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2.5",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "/league.html",
							className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] via-emerald-400 to-[#00ff85] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "w-4 h-4",
								fill: "none",
								stroke: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: "2",
									d: "M10 19l-7-7m0 0l7-7m-7 7h18"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 73,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 72,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Back to League Portal" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 80,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 68,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 67,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 39,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative overflow-hidden rounded-3xl border border-[#2e2554] bg-[#141029] p-6 sm:p-8 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 87,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 88,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#1f193d] to-[#2e2554] border-2 border-[#00f0ff]/50 p-2 flex items-center justify-center shrink-0 shadow-xl",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: "/mpesa-academy-icon.png",
										alt: "Official Avatar",
										className: "w-full h-full object-contain"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 93,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 92,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: `bg-gradient-to-r ${roleDetails.badgeColor} text-black font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md`,
												children: roleTier === 0 ? "👑 Master Tier" : `Tier ${roleTier} Executive`
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 102,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-xs text-gray-400 font-mono",
												children: ["Clearance: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[#00f0ff] font-bold",
													children: currentRole
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 108,
													columnNumber: 32
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 107,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 101,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
											className: "text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase",
											children: roleDetails.officialName
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 112,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-sm text-[#00f0ff] font-bold",
											children: [
												roleDetails.title,
												" •",
												" ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-gray-300 font-normal",
													children: roleDetails.department
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 118,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 116,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-gray-400 max-w-xl leading-relaxed pt-1",
											children: "Active member of the M-Pesa Sunday League official leadership council. Authorized for role-specific operations in accordance with league regulations."
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 121,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 100,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 91,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "bg-[#070512]/80 border border-[#2e2554] rounded-2xl p-4 sm:p-5 flex items-center justify-around sm:justify-start gap-6 min-w-[240px] shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-2xl sm:text-3xl font-black text-[#00ff85] block",
											children: authorizedActions.length
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 131,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] uppercase font-bold text-gray-400 tracking-wider",
											children: "Authorized Actions"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 134,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 130,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-10 w-px bg-[#2e2554]" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 138,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-2xl sm:text-3xl font-black text-amber-400 block",
											children: roleTier === 0 ? "ALL" : `Tier ${roleTier}`
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 140,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] uppercase font-bold text-gray-400 tracking-wider",
											children: "Council Rank"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 143,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 139,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 129,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 90,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 86,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 border-b border-[#2e2554] pb-2 overflow-x-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("authorized"),
							className: `px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "authorized" ? "bg-[#00f0ff] text-black font-extrabold shadow-md" : "text-gray-300 hover:bg-[#141029] hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "w-4 h-4",
								fill: "none",
								stroke: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: "2",
									d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 162,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 161,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								"Authorized Actions (",
								authorizedActions.length,
								")"
							] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 169,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 153,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("hierarchy"),
							className: `px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "hierarchy" ? "bg-[#00f0ff] text-black font-extrabold shadow-md" : "text-gray-300 hover:bg-[#141029] hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "w-4 h-4",
								fill: "none",
								stroke: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: "2",
									d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 181,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 180,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "7-Tier Hierarchy Structure" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 188,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 172,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("restricted"),
							className: `px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "restricted" ? "bg-[#00f0ff] text-black font-extrabold shadow-md" : "text-gray-300 hover:bg-[#141029] hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "w-4 h-4",
								fill: "none",
								stroke: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: "2",
									d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 200,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 199,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								"Restricted Actions (",
								restrictedActions.length,
								")"
							] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 207,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 191,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setActiveTab("switch"),
							className: `px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "switch" ? "bg-[#00f0ff] text-black font-extrabold shadow-md" : "text-gray-300 hover:bg-[#141029] hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "w-4 h-4",
								fill: "none",
								stroke: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: "2",
									d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 219,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 218,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Role Switcher (Audit & Testing)" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 226,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 210,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 152,
					columnNumber: 9
				}, this),
				activeTab === "authorized" && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-2 overflow-x-auto pb-2",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1",
								children: "Filter:"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 235,
								columnNumber: 15
							}, this), categories.map((cat) => /* @__PURE__ */ (void 0)("button", {
								onClick: () => setFilterCategory(cat),
								className: `px-3 py-1 rounded-lg text-xs font-bold transition ${filterCategory === cat ? "bg-emerald-400 text-black font-black" : "bg-[#141029] text-gray-300 hover:bg-[#1f193d]"}`,
								children: cat
							}, cat, false, {
								fileName: _jsxFileName$1,
								lineNumber: 239,
								columnNumber: 17
							}, this))]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 234,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
							children: filteredAuthorized.map((item) => /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-[#2e2554] bg-[#141029]/80 p-4.5 space-y-2.5 hover:border-[#00f0ff]/50 transition group",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-[9px] uppercase font-black tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full",
											children: item.category
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 261,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "flex items-center gap-1 text-[10px] font-black text-[#00ff85]",
											children: [/* @__PURE__ */ (void 0)("svg", {
												className: "w-3.5 h-3.5",
												fill: "none",
												stroke: "currentColor",
												viewBox: "0 0 24 24",
												children: /* @__PURE__ */ (void 0)("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													strokeWidth: "2.5",
													d: "M5 13l4 4L19 7"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 271,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 265,
												columnNumber: 23
											}, this), "Authorized"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 264,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 260,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h3", {
										className: "font-extrabold text-white text-sm group-hover:text-[#00f0ff] transition",
										children: item.action
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 282,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-gray-400 leading-relaxed",
										children: item.description
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 286,
										columnNumber: 19
									}, this)
								]
							}, item.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 256,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 254,
							columnNumber: 13
						}, this),
						filteredAuthorized.length === 0 && /* @__PURE__ */ (void 0)("div", {
							className: "text-center py-12 text-gray-400",
							children: /* @__PURE__ */ (void 0)("p", {
								className: "text-sm",
								children: [
									"No authorized actions found in this category for ",
									roleDetails.title,
									"."
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 293,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 292,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 232,
					columnNumber: 11
				}, this),
				activeTab === "hierarchy" && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "p-4 rounded-2xl bg-[#141029] border border-[#2e2554] text-xs text-gray-300 leading-relaxed",
						children: [/* @__PURE__ */ (void 0)("p", {
							className: "font-bold text-white mb-1",
							children: "Official 7-Tier Council Governance Structure"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 305,
							columnNumber: 15
						}, this), "The M-Pesa Sunday League executive authority is structured across seven appointed management portfolios. Higher tiers provide overarching direction and dispute adjudication, while department managers hold exclusive domain rights."]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 304,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "space-y-3",
						children: Object.keys(ROLE_HIERARCHY_DATA).filter((r) => r !== "GUEST").sort((a, b) => ROLE_HIERARCHY_DATA[a].tier - ROLE_HIERARCHY_DATA[b].tier).map((rKey) => {
							const meta = ROLE_HIERARCHY_DATA[rKey];
							const isCurrent = currentRole === rKey;
							return /* @__PURE__ */ (void 0)("div", {
								className: `rounded-2xl border p-4.5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${isCurrent ? "border-[#00f0ff] bg-gradient-to-r from-[#141029] via-[#1f193d] to-[#141029] shadow-lg shadow-cyan-500/10" : "border-[#2e2554] bg-[#141029]/60 hover:border-gray-500"}`,
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-start gap-3.5",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: `w-10 h-10 rounded-xl bg-gradient-to-tr ${meta.badgeColor} text-black font-black flex items-center justify-center shrink-0 shadow`,
										children: meta.tier === 0 ? "👑" : `T${meta.tier}`
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 330,
										columnNumber: 25
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "space-y-1",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (void 0)("span", {
														className: "font-extrabold text-white text-base",
														children: meta.title
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 338,
														columnNumber: 29
													}, this),
													/* @__PURE__ */ (void 0)("span", {
														className: "text-xs text-gray-400 font-mono",
														children: [
															"(",
															meta.officialName,
															")"
														]
													}, void 0, true, {
														fileName: _jsxFileName$1,
														lineNumber: 341,
														columnNumber: 29
													}, this),
													isCurrent && /* @__PURE__ */ (void 0)("span", {
														className: "bg-[#00f0ff] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
														children: "Your Active Role"
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 345,
														columnNumber: 31
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 337,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-[#00f0ff]",
												children: meta.department
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 350,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (void 0)("ul", {
												className: "text-[11px] text-gray-400 space-y-0.5 pt-1",
												children: meta.responsibilities.slice(0, 2).map((resp, idx) => /* @__PURE__ */ (void 0)("li", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (void 0)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400" }, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 354,
														columnNumber: 33
													}, this), /* @__PURE__ */ (void 0)("span", { children: resp }, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 355,
														columnNumber: 33
													}, this)]
												}, idx, true, {
													fileName: _jsxFileName$1,
													lineNumber: 353,
													columnNumber: 31
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 351,
												columnNumber: 27
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 336,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 329,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-3 shrink-0",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-bold text-gray-400",
										children: [meta.permissions.length, " actions"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 363,
										columnNumber: 25
									}, this), /* @__PURE__ */ (void 0)("button", {
										onClick: () => switchRole(rKey),
										className: `px-3 py-1.5 rounded-xl text-xs font-bold transition ${isCurrent ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"}`,
										children: isCurrent ? "Current" : "Select Role"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 366,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 362,
									columnNumber: 23
								}, this)]
							}, rKey, true, {
								fileName: _jsxFileName$1,
								lineNumber: 321,
								columnNumber: 21
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 313,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 303,
					columnNumber: 11
				}, this),
				activeTab === "restricted" && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 leading-relaxed",
						children: [
							/* @__PURE__ */ (void 0)("p", {
								className: "font-bold text-rose-200 mb-1",
								children: "Protected Actions Beyond Current Clearance"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 388,
								columnNumber: 15
							}, this),
							"Actions listed below are restricted for your current role (",
							roleDetails.title,
							") to preserve separation of executive powers, match impartiality, and regulatory integrity."
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 387,
						columnNumber: 13
					}, this), isSuperAdmin ? /* @__PURE__ */ (void 0)("div", {
						className: "text-center py-12 text-gray-400",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "text-3xl block mb-2",
								children: "👑"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 397,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-sm font-bold text-white",
								children: "Super Administrator Clearance"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 398,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-gray-400",
								children: "You hold unrestricted authority across all 7 management tiers."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 399,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 396,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
						children: restrictedActions.map((item) => /* @__PURE__ */ (void 0)("div", {
							className: "rounded-2xl border border-rose-500/20 bg-[#141029]/50 p-4.5 space-y-2 opacity-85",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-[9px] uppercase font-black tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full",
										children: item.category
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 411,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "flex items-center gap-1 text-[10px] font-bold text-rose-400",
										children: [/* @__PURE__ */ (void 0)("svg", {
											className: "w-3.5 h-3.5",
											fill: "none",
											stroke: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ (void 0)("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: "2",
												d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 421,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 415,
											columnNumber: 25
										}, this), "Restricted"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 414,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 410,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (void 0)("h3", {
									className: "font-bold text-gray-200 text-sm",
									children: item.action
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 432,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-gray-400 leading-relaxed",
									children: item.description
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 434,
									columnNumber: 21
								}, this)
							]
						}, item.id, true, {
							fileName: _jsxFileName$1,
							lineNumber: 406,
							columnNumber: 19
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 404,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 386,
					columnNumber: 11
				}, this),
				activeTab === "switch" && /* @__PURE__ */ (void 0)("div", {
					className: "rounded-3xl border border-[#2e2554] bg-[#141029] p-6 space-y-4",
					children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
						className: "text-lg font-bold text-white",
						children: "Role Access Testing & Verification Desk"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 446,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("p", {
						className: "text-xs text-gray-400",
						children: "Select any of the 7 executive management tiers, Master Super Admin, or Public Fan to instantly inspect the authorized permissions and UI visibility rules."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 449,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 445,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
						children: Object.keys(ROLE_HIERARCHY_DATA).map((rKey) => {
							const meta = ROLE_HIERARCHY_DATA[rKey];
							return /* @__PURE__ */ (void 0)("button", {
								onClick: () => switchRole(rKey),
								className: `p-4 rounded-2xl border text-left transition flex items-start gap-3 ${currentRole === rKey ? "border-[#00f0ff] bg-gradient-to-r from-[#1f193d] to-[#141029] shadow-lg shadow-cyan-500/20 scale-102" : "border-[#2e2554] bg-[#070512] hover:bg-[#141029]"}`,
								children: [/* @__PURE__ */ (void 0)("div", {
									className: `w-8 h-8 rounded-lg bg-gradient-to-tr ${meta.badgeColor} text-black font-black flex items-center justify-center shrink-0 text-xs`,
									children: meta.tier === 0 ? "👑" : `T${meta.tier}`
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 469,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("div", { children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "font-bold text-sm text-white block",
										children: meta.title
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 475,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[11px] text-[#00f0ff] block",
										children: meta.officialName
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 476,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-[10px] text-gray-400 block mt-1",
										children: [meta.permissions.length, " Authorized Actions"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 477,
										columnNumber: 23
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 474,
									columnNumber: 21
								}, this)]
							}, rKey, true, {
								fileName: _jsxFileName$1,
								lineNumber: 460,
								columnNumber: 19
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 455,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 444,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 37,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 36,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/profile.tsx?tsr-split=component";
function UserProfilePage() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserProfileView, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 3,
		columnNumber: 10
	}, this);
}
//#endregion
export { UserProfilePage as component };
