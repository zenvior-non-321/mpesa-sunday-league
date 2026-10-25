import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";

export const Route = createFileRoute("/desk")({
  head: () => ({
    meta: [
      { title: "Public Registration & Inquiries Desk | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Official public registration portal: apply for new football club admission, submit student player tryout forms, and contact the League Secretariat.",
      },
    ],
  }),
  component: PublicDeskPage,
});

function PublicDeskPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode="viewer" initialTab="desk" />
      </div>
    </div>
  );
}
