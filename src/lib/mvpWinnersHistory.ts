/**
 * MVP Winners Cumulative History Records
 * Preserves certified MVP winners across all matchweeks even when
 * match voting logs are reset or cleared for upcoming fixtures.
 */

export interface MvpWinnerRecord {
  id: string;
  matchId: number;
  matchweek: number;
  fixtureTitle: string;
  date: string;
  winnerName: string;
  teamName: string;
  photoUrl?: string;
  position?: string;
  number?: number;
  votesCount: number;
  votePercentage: number;
  totalBallotsCast: number;
  certifiedAt: string;
  certifiedBy: string;
  notes?: string;
}

const STORAGE_KEY = "mpesa_pes_mvp_winners_history_v1";

export const DEFAULT_MVP_WINNERS: MvpWinnerRecord[] = [];

export function getMvpWinnersHistory(): MvpWinnerRecord[] {
  if (typeof window === "undefined") return DEFAULT_MVP_WINNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MVP_WINNERS));
      return DEFAULT_MVP_WINNERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_MVP_WINNERS;
  } catch {
    return DEFAULT_MVP_WINNERS;
  }
}

export function saveMvpWinnersHistory(records: MvpWinnerRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event("mpesa_mvp_winners_updated"));
  } catch (err) {
    console.error("Failed to persist MVP winners history", err);
  }
}

export function archiveMvpWinner(
  winner: Omit<MvpWinnerRecord, "id" | "certifiedAt">,
): MvpWinnerRecord {
  const current = getMvpWinnersHistory();
  // Check if winner for this matchId already exists; update or prepend
  const existingIdx = current.findIndex((w) => w.matchId === winner.matchId);
  const newRecord: MvpWinnerRecord = {
    ...winner,
    id: existingIdx >= 0 ? current[existingIdx].id : `mvp-win-${Date.now()}`,
    certifiedAt: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  let updated: MvpWinnerRecord[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newRecord;
  } else {
    updated = [newRecord, ...current];
  }

  saveMvpWinnersHistory(updated);
  return newRecord;
}

export function deleteWinnerFromHistory(id: string): MvpWinnerRecord[] {
  const current = getMvpWinnersHistory();
  const updated = current.filter((w) => w.id !== id);
  saveMvpWinnersHistory(updated);
  return updated;
}
