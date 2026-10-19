import { createFileRoute } from "@tanstack/react-router";
import { MatchMvpVoting } from "../components/MatchMvpVoting";
import { z } from "zod";

const searchSchema = z.object({
  matchId: z.coerce.number().optional().default(1),
});

export const Route = createFileRoute("/mvp-voting")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Match MVP Voting | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Official Match MVP Balloting portal. Cast your vote for the best performer of the match and view live results.",
      },
    ],
  }),
  component: MvpVotingPage,
});

function MvpVotingPage() {
  const { matchId } = Route.useSearch();

  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <MatchMvpVoting initialMatchId={matchId || 1} />
      </div>
    </div>
  );
}
