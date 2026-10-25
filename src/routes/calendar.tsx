import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

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
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode="viewer" initialTab="calendar" />
      </div>
    </div>
  );
}
