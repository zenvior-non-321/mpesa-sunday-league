import { createFileRoute } from "@tanstack/react-router";
import { FanCommunityComments } from "../components/FanCommunityComments";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Fan Cheers & Stadium Community Wall | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Official fan community board: cheer on your academy football team, share match predictions, and celebrate school sportsmanship in the M-Pesa Sunday League.",
      },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <FanCommunityComments />
      </div>
    </div>
  );
}
