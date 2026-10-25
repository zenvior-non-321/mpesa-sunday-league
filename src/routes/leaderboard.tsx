import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Golden Boot & Player Leaderboard | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Official Golden Boot race with scoring trend visualizations, top goalscorers, playmakers, and all-star player records.",
      },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode="viewer" initialTab="stats" />
      </div>
    </div>
  );
}
