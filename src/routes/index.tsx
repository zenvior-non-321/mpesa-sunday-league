import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "M-Pesa Sunday League | Fixtures, Results & Officials" },
      {
        name: "description",
        content:
          "Official eFootball Edition portal for M-Pesa Sunday League featuring tables, player stats leaderboard, fixtures, clubs, and squad management.",
      },
      { property: "og:title", content: "M-Pesa Sunday League | Fixtures, Results & Officials" },
      {
        property: "og:description",
        content:
          "Official eFootball Edition portal for M-Pesa Sunday League featuring tables, player stats leaderboard, fixtures, clubs, and squad management.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: function IndexDashboard() {
    return (
      <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <UnifiedLeagueDashboard initialMode="viewer" initialTab="hub" />
        </div>
      </div>
    );
  },
});
