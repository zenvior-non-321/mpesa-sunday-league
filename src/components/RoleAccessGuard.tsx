import React, { type ReactNode } from 'react';
import { useRoleAccess, type LeagueRole, type PermissionKey } from '../hooks/useRoleAccess';

interface RoleAccessGuardProps {
  children: ReactNode;
  requiredPermission?: PermissionKey;
  requiredRole?: LeagueRole | LeagueRole[];
  maxTier?: number; // e.g. 1 for President only, 2 for Executive, 3 for Regulations Manager or above
  fallback?: ReactNode;
  showRestrictedBanner?: boolean;
}

/**
 * Declarative component guard that checks the user's role and restricts access
 * to child UI components based on the defined 7-tier role hierarchy.
 */
export function RoleAccessGuard({
  children,
  requiredPermission,
  requiredRole,
  maxTier,
  fallback,
  showRestrictedBanner = false,
}: RoleAccessGuardProps) {
  const { canAccess, hasRole, isAtLeastRole, currentRole, roleDetails } = useRoleAccess();

  let isAllowed = true;

  if (requiredPermission && !canAccess(requiredPermission)) {
    isAllowed = false;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    isAllowed = false;
  }

  if (maxTier !== undefined && !isAtLeastRole(maxTier)) {
    isAllowed = false;
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showRestrictedBanner) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-rose-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V9a4 4 0 00-8 0v2" />
          </svg>
          Access Restricted by Executive Role Hierarchy
        </div>
        <p className="mt-1 text-gray-300">
          Your current assigned role (<span className="font-semibold text-white">{roleDetails.title}</span>, Tier {roleDetails.tier}) does not have permission to view or execute this action.
        </p>
      </div>
    );
  }

  return null;
}
