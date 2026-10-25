import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Team Performance Dashboard | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Tactical team performance radar charts visualizing wins, losses, and goals scored across all clubs in the M-Pesa Sunday League.",
      },
    ],
  }),
  component: PerformancePage,
});

function PerformancePage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode="viewer" initialTab="radar" />
      </div>
    </div>
  );
}
