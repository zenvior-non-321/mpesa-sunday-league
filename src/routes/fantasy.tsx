import { createFileRoute } from "@tanstack/react-router";
import { FantasyTeamBuilder } from "../components/FantasyTeamBuilder";

export const Route = createFileRoute("/fantasy")({
  head: () => ({
    meta: [
      { title: "Fantasy MSL Football | £100m Squad Builder & Leagues" },
      {
        name: "description",
        content:
          "Build your 15-player M-Pesa Sunday League fantasy football squad within a £100m budget, pick captains, activate chips, and compete in public and private mini-leagues.",
      },
    ],
  }),
  component: FantasyPage,
});

function FantasyPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <FantasyTeamBuilder />
      </div>
    </div>
  );
}
