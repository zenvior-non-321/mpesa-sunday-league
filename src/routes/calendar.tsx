import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LeagueCalendarView } from "../components/LeagueCalendarView";
import { DEFAULT_FIXTURES, DEFAULT_TEAMS } from "../lib/fixturesData";
import type { MatchFixture, Team } from "../components/Fixtures";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Season Match Calendar | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Monthly interactive fixture calendar highlighting past results and upcoming clashes for the M-Pesa Sunday League eFootball Championship.",
      },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [fixtures, setFixtures] = useState<MatchFixture[]>(DEFAULT_FIXTURES);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);

  useEffect(() => {
    // Load stored fixtures
    try {
      const storedDeleted = new Set<number>(
        JSON.parse(localStorage.getItem("mpesa_pes_deleted_fixtures_v6") || "[]"),
      );
      const storedFixtures = localStorage.getItem("mpesa_pes_matches_v6");
      if (storedFixtures) {
        const parsed = JSON.parse(storedFixtures);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFixtures(parsed.filter((f: MatchFixture) => !storedDeleted.has(f.id)));
        } else {
          setFixtures(DEFAULT_FIXTURES.filter((f) => !storedDeleted.has(f.id)));
        }
      } else {
        setFixtures(DEFAULT_FIXTURES.filter((f) => !storedDeleted.has(f.id)));
      }
    } catch {
      // Ignore
    }

    // Load stored teams
    try {
      const storedTeams = localStorage.getItem("mpesa_pes_teams_v6");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-[#2e2554] pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00f0ff] to-emerald-400 text-black">
              Official Season Calendar
            </span>
            <span className="text-xs text-gray-400 font-mono">Season 2026/27</span>
          </div>
          <h1 className="font-header text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mt-1">
            Championship Match Calendar
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Interactive fixture schedule highlighting upcoming clashes and completed matchday
            scorelines.
          </p>
        </div>

        <LeagueCalendarView fixtures={fixtures} teams={teams} />
      </div>
    </div>
  );
}
