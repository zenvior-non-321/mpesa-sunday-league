import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

export const Route = createFileRoute("/fixtures")({
  head: () => ({
    meta: [
      { title: "Fixtures & Schedule | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Upcoming football matches, date, time, and competing teams in the M-Pesa Sunday League eFootball Championship.",
      },
    ],
  }),
  component: FixturesPage,
});

function FixturesPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode="viewer" initialTab="fixtures" />
      </div>
    </div>
  );
}
