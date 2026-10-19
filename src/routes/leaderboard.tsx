import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayerLeaderboard } from "../components/PlayerLeaderboard";
import { GoldenBootLeaderboard } from "../components/GoldenBootLeaderboard";
import { Trophy, BarChart3 } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"golden_boot" | "all_stats">("golden_boot");

  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2554] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-md">
                Championship Honours
              </span>
              <span className="text-xs text-gray-400 font-mono">Season 2026/27</span>
            </div>
            <h1 className="font-header text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mt-1">
              League Leaderboard
            </h1>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#141029] border border-[#2e2554] rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("golden_boot")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === "golden_boot"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Golden Boot Race</span>
            </button>
            <button
              onClick={() => setActiveTab("all_stats")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === "all_stats"
                  ? "bg-gradient-to-r from-[#00f0ff] to-[#00ff85] text-black shadow-lg shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Full Player Stats</span>
            </button>
          </div>
        </div>

        {activeTab === "golden_boot" ? <GoldenBootLeaderboard /> : <PlayerLeaderboard />}
      </div>
    </div>
  );
}
