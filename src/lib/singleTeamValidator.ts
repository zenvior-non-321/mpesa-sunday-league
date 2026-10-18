/**
 * Single-Team Registration Enforcer
 * Enforces the strict rule: "Ensure one player is only registered in ONE team only"
 */

export interface SquadPlayer {
  name: string;
  number?: number;
  position?: string;
  photoUrl?: string;
  email?: string;
  role?: string;
  foot?: string;
  admissionNumber?: string;
}

export interface LeagueTeamWithSquad {
  id: number;
  name: string;
  shortCode?: string;
  color?: string;
  squad?: SquadPlayer[];
}

export interface RegistrationValidationResult {
  valid: boolean;
  conflictingTeam?: string;
  message?: string;
}

/**
 * Validates that a player is not already registered under another team.
 */
export function validateSingleTeamRegistration(
  playerName: string,
  targetTeamId: number,
  allTeams: LeagueTeamWithSquad[],
): RegistrationValidationResult {
  const normalizedName = playerName.trim().toLowerCase();
  if (!normalizedName) {
    return { valid: true };
  }

  for (const team of allTeams) {
    if (team.id === targetTeamId) continue;
    const squad = team.squad || [];
    const exists = squad.some((p) => p.name.trim().toLowerCase() === normalizedName);
    if (exists) {
      return {
        valid: false,
        conflictingTeam: team.name,
        message: `Player "${playerName}" is already registered under "${team.name}". League rules strictly require each player to be registered in ONE team only.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Returns a deduplicated map of unique players across all clubs,
 * ensuring no athlete appears more than once.
 */
export function auditAllRegistrations(allTeams: LeagueTeamWithSquad[]): {
  uniqueCount: number;
  conflicts: { player: string; teams: string[] }[];
} {
  const playerTeamsMap = new Map<string, string[]>();

  for (const team of allTeams) {
    for (const player of team.squad || []) {
      const key = player.name.trim();
      if (!playerTeamsMap.has(key)) {
        playerTeamsMap.set(key, []);
      }
      playerTeamsMap.get(key)!.push(team.name);
    }
  }

  const conflicts: { player: string; teams: string[] }[] = [];
  playerTeamsMap.forEach((teams, player) => {
    if (teams.length > 1) {
      conflicts.push({ player, teams });
    }
  });

  return {
    uniqueCount: playerTeamsMap.size,
    conflicts,
  };
}
