import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as MatchMvpVoting } from "./MatchMvpVoting-BXP9mm0N.mjs";
import { t as Route } from "./mvp-voting-BtEhruck.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mvp-voting-CL-nEnOD.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/mvp-voting.tsx?tsr-split=component";
function MvpVotingPage() {
	const { matchId } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-7xl mx-auto",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MatchMvpVoting, { initialMatchId: matchId || 1 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 9,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 8,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 10
	}, this);
}
//#endregion
export { MvpVotingPage as component };
