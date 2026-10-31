import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as objectType, t as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mvp-voting-BtEhruck.js
var $$splitComponentImporter = () => import("./mvp-voting-CL-nEnOD.mjs");
var searchSchema = objectType({ matchId: coerce.number().optional().default(1) });
var Route = createFileRoute("/mvp-voting")({
	validateSearch: (search) => searchSchema.parse(search),
	head: () => ({ meta: [{ title: "Match MVP Voting | M-Pesa Sunday League" }, {
		name: "description",
		content: "Official Match MVP Balloting portal. Cast your vote for the best performer of the match and view live results."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
