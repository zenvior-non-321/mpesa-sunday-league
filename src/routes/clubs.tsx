import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Clubs & Squads Directory | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Official club directory, registered youth football teams, coach profiles, and 15-player squad limit rosters in the M-Pesa Sunday League.",
      },
    ],
  }),
  component: ClubsPage,
});

function ClubsPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode="viewer" initialTab="clubs" />
      </div>
    </div>
  );
}
