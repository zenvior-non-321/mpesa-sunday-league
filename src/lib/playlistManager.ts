export interface AnthemSong {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  category: "ANTHEM" | "CELEBRATION" | "KICKOFF" | "DEVOTIONAL" | "CHAMPIONSHIP";
  duration?: string;
  addedAt: string;
  isOfficialAnthem?: boolean;
}

export const DEFAULT_PLAYLIST: AnthemSong[] = [
  {
    id: "anthem-1",
    title: "M-Pesa Sunday League Official Stadium Anthem",
    artist: "eFootball Championship Band & Arena Orchestra",
    youtubeId: "2yJgwwDcgV8",
    category: "ANTHEM",
    duration: "3:45",
    addedAt: "2026-10-01",
    isOfficialAnthem: true,
  },
  {
    id: "anthem-2",
    title: "Champions Arena Kickoff March (High Energy Fanfare)",
    artist: "Sunday League Philharmonic",
    youtubeId: "kXYiU_JCYtU",
    category: "KICKOFF",
    duration: "4:12",
    addedAt: "2026-10-10",
  },
  {
    id: "anthem-3",
    title: "Electric Arena Kickoff Fanfare & Horns",
    artist: "Sunday League Sound Lab",
    youtubeId: "JGwWNGJdvx8",
    category: "KICKOFF",
    duration: "2:50",
    addedAt: "2026-10-15",
  },
  {
    id: "anthem-4",
    title: "Crown Of Champions (Full Matchday Theme)",
    artist: "Samba & Rangers Combined Band",
    youtubeId: "uelHwf8o7_U",
    category: "CHAMPIONSHIP",
    duration: "3:20",
    addedAt: "2026-10-18",
  },
];

const PLAYLIST_STORAGE_KEY = "mpesa_pes_playlist_v2";

/**
 * Extracts a standard 11-character YouTube video ID from various YouTube URL formats or raw ID.
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const urlMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/,
  );
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  return null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function getPlaylist(): AnthemSong[] {
  if (typeof window === "undefined") return DEFAULT_PLAYLIST;
  try {
    const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_PLAYLIST;
}

export function savePlaylist(playlist: AnthemSong[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlist));
    window.dispatchEvent(new Event("mpesa_playlist_updated"));
  } catch (err) {
    console.error("Failed to save playlist", err);
  }
}

export function addSongToPlaylist(song: Omit<AnthemSong, "id" | "addedAt">): AnthemSong | null {
  const videoId = extractYouTubeId(song.youtubeId);
  if (!videoId) return null;

  const current = getPlaylist();
  const newSong: AnthemSong = {
    ...song,
    id: `song-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    youtubeId: videoId,
    addedAt: new Date().toISOString().split("T")[0],
  };

  const updated = [...current, newSong];
  savePlaylist(updated);
  return newSong;
}

export function removeSongFromPlaylist(id: string): void {
  const current = getPlaylist();
  const updated = current.filter((s) => s.id !== id);
  savePlaylist(updated.length > 0 ? updated : DEFAULT_PLAYLIST);
}

export function reorderPlaylist(startIndex: number, endIndex: number): void {
  const current = [...getPlaylist()];
  if (
    startIndex < 0 ||
    startIndex >= current.length ||
    endIndex < 0 ||
    endIndex >= current.length
  ) {
    return;
  }
  const [removed] = current.splice(startIndex, 1);
  current.splice(endIndex, 0, removed);
  savePlaylist(current);
}

export function setPrimaryAnthem(id: string): void {
  const current = getPlaylist();
  const target = current.find((s) => s.id === id);
  const updated = current.map((s) => ({
    ...s,
    isOfficialAnthem: s.id === id,
  }));
  savePlaylist(updated);

  if (target && typeof window !== "undefined") {
    try {
      const anthemConfig = {
        title: target.title,
        artist: target.artist,
        youtubeId: target.youtubeId,
        volume: 0.7,
        mode: "audio",
        autoPlay: true,
      };
      localStorage.setItem("mpesa_pes_anthem_v3", JSON.stringify(anthemConfig));
      window.dispatchEvent(new CustomEvent("mpesa_anthem_changed"));
    } catch {
      // Ignore
    }
  }
}
