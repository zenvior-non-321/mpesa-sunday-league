import { createFileRoute } from "@tanstack/react-router";
import { BoardWorkspaces } from "../components/BoardWorkspaces";

export const Route = createFileRoute("/workspaces")({
  head: () => ({
    meta: [
      { title: "Executive Board Workspaces | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Comprehensive role-synchronized executive workspaces for President, Deputy President, Regulations, Officiating, Records, Tech Managers, and Super Admin.",
      },
    ],
  }),
  component: WorkspacesPage,
});

function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <BoardWorkspaces />
      </div>
    </div>
  );
}
