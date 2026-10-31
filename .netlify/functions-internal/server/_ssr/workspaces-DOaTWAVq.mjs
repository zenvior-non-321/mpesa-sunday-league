import { n as useRoleAccess } from "./useRoleAccess-qpujIbxr.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { s as getCurrentRbacUser } from "./rbacSystem-BzvRxIUR.mjs";
import { t as UnifiedLeagueDashboard } from "./UnifiedLeagueDashboard-yQkQu3mR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspaces-DOaTWAVq.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/workspaces.tsx?tsr-split=component";
function WorkspacesPage() {
	const { isSuperAdmin, currentRole } = useRoleAccess();
	const rbacUser = typeof window !== "undefined" ? getCurrentRbacUser() : null;
	const isAdmin = isSuperAdmin || rbacUser?.role === "admin";
	const isBoard = !isAdmin && (rbacUser?.role === "board" || currentRole !== "GUEST" && currentRole !== void 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-7xl mx-auto",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UnifiedLeagueDashboard, { initialMode: isAdmin ? "admin" : isBoard ? "board" : "viewer" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 14,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 13,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 12,
		columnNumber: 10
	}, this);
}
//#endregion
export { WorkspacesPage as component };
