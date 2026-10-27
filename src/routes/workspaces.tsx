import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLeagueDashboard } from "../components/UnifiedLeagueDashboard";
import { useRoleAccess } from "../hooks/useRoleAccess";
import { getCurrentRbacUser } from "../lib/rbacSystem";

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
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const rbacUser = typeof window !== "undefined" ? getCurrentRbacUser() : null;
  const isAdmin = isSuperAdmin || rbacUser?.role === "admin";
  const isBoard =
    !isAdmin &&
    (rbacUser?.role === "board" || (currentRole !== "GUEST" && currentRole !== undefined));

  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <UnifiedLeagueDashboard initialMode={isAdmin ? "admin" : isBoard ? "board" : "viewer"} />
      </div>
    </div>
  );
}
