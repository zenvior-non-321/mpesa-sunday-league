import { createFileRoute } from "@tanstack/react-router";
import { PlayerLeaderboard } from "../components/PlayerLeaderboard";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Player Stats Leaderboard | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Golden Boot race, top scorers, playmakers, and top performers in the M-Pesa Sunday League eFootball Championship.",
      },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <PlayerLeaderboard />
      </div>
    </div>
  );
}
