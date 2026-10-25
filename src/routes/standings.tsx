import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

export const Route = createFileRoute("/standings")({
  head: () => ({
    meta: [
      { title: "League Standings & Table | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Official sortable League Standings table with points, goal difference, matches played, form guide, and club rankings.",
      },
    ],
  }),
  component: StandingsPage,
});

function StandingsPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode="viewer" initialTab="standings" />
      </div>
    </div>
  );
}
