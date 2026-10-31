import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { E as Send, K as MessageSquare, Ot as CircleCheck, f as Trash2, rt as Heart, st as Funnel, x as Shield, xt as Crown, z as Pin } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { s as getCurrentRbacUser } from "./rbacSystem-BzvRxIUR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FanCommunityComments-TQtl1nMh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var DEFAULT_COMMENTS = [
	{
		id: "cmt-1",
		author: "Samuel Mwangi",
		role: "Club Staff",
		clubSupported: "Royal Rangers",
		message: "Proud of the Rangers for executing our high-press tactical game plan today. Superb teamwork and discipline across 90 minutes!",
		category: "TACTICAL",
		timestamp: "Sunday, Oct 25, 2026 • 3:45 PM",
		status: "APPROVED",
		isPinned: true
	},
	{
		id: "cmt-2",
		author: "Grace Wanjiku",
		role: "Parent",
		clubSupported: "Samba Boys",
		message: "Great game from Wokabi and the whole squad! Keep working hard and stay disciplined on the pitch.",
		category: "CHEER",
		timestamp: "Sunday, Oct 25, 2026 • 4:10 PM",
		status: "APPROVED"
	},
	{
		id: "cmt-3",
		author: "David Kiprop",
		role: "Supporter",
		clubSupported: "Mzinga Boyz",
		message: "Incredible defensive discipline. Respect to the referee and opposing team today. Top tier sportsmanship!",
		category: "SPORTSMANSHIP",
		timestamp: "Saturday, Oct 24, 2026 • 6:30 PM",
		status: "APPROVED"
	}
];
var STORAGE_KEY = "mpesa_pes_comments_v1";
function getComments() {
	if (typeof window === "undefined") return DEFAULT_COMMENTS;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		}
	} catch {}
	return DEFAULT_COMMENTS;
}
function saveComments(list) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
		window.dispatchEvent(new Event("mpesa_comments_updated"));
	} catch (e) {
		console.error("Failed to save comments", e);
	}
}
function submitFanComment(data) {
	const current = getComments();
	const newComment = {
		id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
		...data,
		timestamp: "Just now",
		status: "APPROVED",
		isPinned: false
	};
	saveComments([newComment, ...current]);
	return newComment;
}
function deleteComment(id) {
	saveComments(getComments().filter((c) => c.id !== id));
}
function togglePinComment(id) {
	saveComments(getComments().map((c) => c.id === id ? {
		...c,
		isPinned: !c.isPinned
	} : c));
}
var _jsxFileName = "/app/applet/src/components/FanCommunityComments.tsx";
function FanCommunityComments() {
	const { isSuperAdmin, currentRole } = useRoleAccess();
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const checkAdmin = () => {
			const rbacUser = getCurrentRbacUser();
			const admin = isSuperAdmin || currentRole === "SUPER_ADMIN" || rbacUser?.role === "admin" || rbacUser?.isSuperAdmin === true;
			setIsAdmin(Boolean(admin));
		};
		checkAdmin();
		window.addEventListener("mpesa_rbac_changed", checkAdmin);
		window.addEventListener("mpesa_role_changed", checkAdmin);
		window.addEventListener("storage", checkAdmin);
		return () => {
			window.removeEventListener("mpesa_rbac_changed", checkAdmin);
			window.removeEventListener("mpesa_role_changed", checkAdmin);
			window.removeEventListener("storage", checkAdmin);
		};
	}, [isSuperAdmin, currentRole]);
	const [comments, setComments] = (0, import_react.useState)([]);
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("ALL");
	const [selectedClub, setSelectedClub] = (0, import_react.useState)("ALL");
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [authorName, setAuthorName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("Supporter");
	const [clubSupported, setClubSupported] = (0, import_react.useState)("Samba Boys");
	const [category, setCategory] = (0, import_react.useState)("CHEER");
	const [message, setMessage] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setComments(getComments());
		const handleUpdate = () => setComments(getComments());
		window.addEventListener("mpesa_comments_updated", handleUpdate);
		return () => window.removeEventListener("mpesa_comments_updated", handleUpdate);
	}, []);
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3e3);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!authorName.trim() || !message.trim()) return;
		setIsSubmitting(true);
		submitFanComment({
			author: authorName.trim(),
			role,
			clubSupported,
			message: message.trim(),
			category
		});
		setMessage("");
		setIsSubmitting(false);
		showToast("✓ Message posted to the Fan & Community Board!");
	};
	const handleDelete = (id) => {
		deleteComment(id);
		showToast("✓ Comment removed by administrator.");
	};
	const handleTogglePin = (id) => {
		togglePinComment(id);
		showToast("✓ Pin status updated.");
	};
	const filteredComments = comments.filter((c) => {
		const matchCat = selectedCategory === "ALL" || c.category === selectedCategory;
		const matchClub = selectedClub === "ALL" || c.clubSupported === selectedClub;
		return matchCat && matchClub;
	}).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			toastMessage && /* @__PURE__ */ (void 0)("div", {
				className: "fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2",
				children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "w-4 h-4 text-black shrink-0" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 118,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", {
					className: "text-xs",
					children: toastMessage
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 117,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative rounded-3xl overflow-hidden border border-cyan-400/30 bg-gradient-to-r from-[#0d0726] via-[#120a36] to-[#070512] p-6 sm:p-8 shadow-2xl",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative z-10 max-w-3xl space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-3.5 h-3.5 text-cyan-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Christian Sportsmanship & Fan Encouragement Hub" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-header text-2xl sm:text-4xl font-black text-white uppercase tracking-wider leading-tight",
							children: "Fan Cheers & Community Stadium Wall"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl",
							children: "Cheer on your academy youth football club, post matchday encouragement, and celebrate fair play across the M-Pesa Sunday League."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 124,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-5 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "border-b border-[#2e2554] pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] text-cyan-400 uppercase font-black tracking-wider block",
							children: "Share Your Voice"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 147,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-header text-lg font-black text-white uppercase mt-0.5 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "w-5 h-5 text-cyan-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 151,
								columnNumber: 15
							}, this), "Post a Matchday Cheer"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 150,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 146,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "Your Full Name"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Samuel Mark",
								value: authorName,
								onChange: (e) => setAuthorName(e.target.value),
								className: "w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 157,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
									children: "I am a..."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
									value: role,
									onChange: (e) => setRole(e.target.value),
									className: "w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Supporter",
											children: "Supporter"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 181,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Parent",
											children: "Parent / Guardian"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 182,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Student Athlete",
											children: "Student Athlete"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 183,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Club Staff",
											children: "Club Staff"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 184,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Alumni Supporter",
											children: "Alumni Supporter"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 185,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 176,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 172,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
									children: "Team Supported"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 190,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
									value: clubSupported,
									onChange: (e) => setClubSupported(e.target.value),
									className: "w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3 py-2 text-xs text-white outline-none font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Samba Boys",
											children: "Samba Boys"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 198,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Royal Rangers",
											children: "Royal Rangers"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 199,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Mzinga Boyz",
											children: "Mzinga Boyz"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 200,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
											value: "Young Stars City",
											children: "Young Stars City"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 201,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 189,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "Message Category"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 207,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										id: "CHEER",
										label: "Match Cheer",
										icon: "⚽"
									},
									{
										id: "TACTICAL",
										label: "Tactical Note",
										icon: "📋"
									},
									{
										id: "SPORTSMANSHIP",
										label: "Fair Play",
										icon: "🤝"
									}
								].map((cat) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setCategory(cat.id),
									className: `py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${category === cat.id ? "bg-[#00f0ff] text-black border-cyan-300 font-black shadow-md shadow-cyan-500/20" : "bg-[#141029] text-gray-300 border-[#2e2554] hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: cat.icon }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 226,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: cat.label }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 227,
										columnNumber: 21
									}, this)]
								}, cat.id, true, {
									fileName: _jsxFileName,
									lineNumber: 216,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 210,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 206,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "block text-gray-400 font-bold uppercase text-[10px] mb-1",
								children: "Your Words of Encouragement"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 234,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
								required: true,
								rows: 4,
								placeholder: "Share a cheering message, tactical reaction, or word of encouragement...",
								value: message,
								onChange: (e) => setMessage(e.target.value),
								className: "w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 237,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: "w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 252,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Post Encouragement" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 247,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 156,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 145,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-7 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4",
					children: isAdmin ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-header text-lg font-black text-white uppercase flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Crown, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 265,
									columnNumber: 21
								}, this),
								"Admin Moderation Feed (",
								filteredComments.length,
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 264,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-amber-300 font-bold mt-0.5",
							children: "👑 Exclusive Administrator View: Only admins can view and moderate submitted messages."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 268,
							columnNumber: 19
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 263,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Funnel, { className: "w-3.5 h-3.5 text-gray-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 276,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								value: selectedCategory,
								onChange: (e) => setSelectedCategory(e.target.value),
								className: "bg-[#141029] border border-[#2e2554] rounded-xl px-2.5 py-1 text-xs text-white font-bold outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "ALL",
										children: "All Categories"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 282,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "CHEER",
										children: "⚽ Match Cheers"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 283,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "TACTICAL",
										children: "📋 Tactical Notes"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 284,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "SPORTSMANSHIP",
										children: "🤝 Fair Play"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 285,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 277,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 275,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 262,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-3 max-h-[560px] overflow-y-auto pr-1",
						children: filteredComments.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-center py-12 text-gray-400 text-xs",
							children: "No submitted messages found in this category."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 293,
							columnNumber: 19
						}, this) : filteredComments.map((comment) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `p-4 rounded-2xl border transition space-y-2.5 ${comment.isPinned ? "bg-amber-950/20 border-amber-400/50 shadow-lg shadow-amber-500/10" : "bg-[#141029] border-[#2e2554]"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-black text-xs flex items-center justify-center shrink-0",
											children: comment.author.charAt(0).toUpperCase()
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 308,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-black text-xs text-white",
													children: comment.author
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 313,
													columnNumber: 31
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[10px] text-gray-400 font-mono",
													children: ["• ", comment.role]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 316,
													columnNumber: 31
												}, this),
												comment.isPinned && /* @__PURE__ */ (void 0)("span", {
													className: "text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 flex items-center gap-0.5",
													children: [/* @__PURE__ */ (void 0)(Pin, { className: "w-2.5 h-2.5 fill-amber-300" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 321,
														columnNumber: 35
													}, this), /* @__PURE__ */ (void 0)("span", { children: "Pinned" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 322,
														columnNumber: 35
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 320,
													columnNumber: 33
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 312,
											columnNumber: 29
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] text-emerald-400 font-bold",
											children: ["Supporting: ", comment.clubSupported]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 326,
											columnNumber: 29
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 311,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 307,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: `text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${comment.category === "TACTICAL" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : comment.category === "SPORTSMANSHIP" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"}`,
											children: comment.category
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 333,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-1 ml-1 pl-1 border-l border-white/10",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												onClick: () => handleTogglePin(comment.id),
												title: comment.isPinned ? "Unpin comment" : "Pin comment to top",
												className: "p-1.5 rounded-lg text-gray-400 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pin, { className: "w-3.5 h-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 353,
													columnNumber: 31
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 347,
												columnNumber: 29
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												onClick: () => handleDelete(comment.id),
												title: "Delete comment (Admin action)",
												className: "p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 361,
													columnNumber: 31
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 355,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 346,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 332,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 306,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-gray-200 leading-relaxed font-sans pl-1",
									children: [
										"\"",
										comment.message,
										"\""
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 368,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[10px] text-gray-500 font-mono flex items-center justify-between pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: comment.timestamp }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 373,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-emerald-500 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-3 h-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 375,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Verified Submitter" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 376,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 374,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 372,
									columnNumber: 23
								}, this)
							]
						}, comment.id, true, {
							fileName: _jsxFileName,
							lineNumber: 298,
							columnNumber: 21
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 291,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 261,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-center py-14 px-6 space-y-5 bg-[#0e0a26] rounded-2xl border border-amber-400/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-xl",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Crown, { className: "w-8 h-8 text-amber-400" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 387,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 386,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2 max-w-md mx-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-3.5 h-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 392,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Confidential Administration Desk" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 393,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 391,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
										className: "font-header text-xl font-black text-white uppercase tracking-wider",
										children: "Comments Can Only Be Seen by Admin"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 395,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-gray-300 leading-relaxed",
										children: "In accordance with M-Pesa Sunday League policies and competition integrity standards, all fan cheers, tactical feedback, and community notes are submitted directly to League Administration."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 398,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-gray-400 leading-relaxed",
										children: "Public spectators cannot view submitted comments. Only authorized administrators have access to view and moderate the community feed."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 403,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 390,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-2 flex flex-col sm:flex-row items-center justify-center gap-3",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => {
										if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open_unified_login"));
									},
									className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Crown, { className: "w-4 h-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 419,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Administrator Sign-In" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 420,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 410,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 409,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-4 border-t border-[#2e2554]/60 text-[11px] text-gray-400 flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 425,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "You can still submit comments and cheers on the left; they will be delivered privately to admins." }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 426,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 424,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 385,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 259,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 143,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 114,
		columnNumber: 5
	}, this);
}
//#endregion
export { FanCommunityComments as t };
