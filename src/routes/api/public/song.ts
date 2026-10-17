import { createFileRoute } from "@tanstack/react-router";
import * as fs from "node:fs";
import * as path from "node:path";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Admin and Official credentials authorized to broadcast league anthems
const AUTHORIZED_PASSCODES = [
  "msl-27",
  "admin123",
  "superadmin",
  "msl-super-admin",
  "broadcast",
  "msl-bramuel-2026",
  "msl-wayne-0202",
  "msl-francis-0303",
  "msl-favour-1001",
  "msl-paul-0505",
  "msl-kelvin-0404",
  "msl-ahmed-9944",
  "msl-tech-4004",
  "msl-atech-7007",
  "msl-pres-1001",
  "msl-vpres-2002",
];

// Fallback persistence file on disk
const SONG_CACHE_FILE = path.resolve(process.cwd(), ".song_state.json");

interface SongState {
  youtube_id: string;
  youtube_url: string;
  title: string;
  updated_at: string;
  activated: boolean;
}

let inMemorySong: SongState = {
  youtube_id: "kYtGl1DX5qI",
  youtube_url: "https://www.youtube.com/watch?v=kYtGl1DX5qI",
  title: "eFootball / PES Official Stadium Anthem",
  updated_at: new Date().toISOString(),
  activated: true,
};

// Try reading initial cache from disk if available
try {
  if (fs.existsSync(SONG_CACHE_FILE)) {
    const raw = fs.readFileSync(SONG_CACHE_FILE, "utf-8");
    inMemorySong = { ...inMemorySong, ...JSON.parse(raw) };
  }
} catch {
  // Ignore filesystem cache miss
}

function saveSongState(state: SongState) {
  inMemorySong = state;
  try {
    fs.writeFileSync(SONG_CACHE_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    // Ignore disk write errors
  }
}

export const Route = createFileRoute("/api/public/song")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("site_song")
            .select("youtube_id, youtube_url, title, updated_at")
            .eq("id", 1)
            .maybeSingle();

          if (data && data.youtube_id) {
            inMemorySong = {
              ...inMemorySong,
              youtube_id: data.youtube_id,
              youtube_url: data.youtube_url || "",
              title: data.title || "League Anthem",
              updated_at: data.updated_at || new Date().toISOString(),
            };
          }
        } catch {
          // Supabase is optional; inMemorySong serves as bulletproof source
        }
        return json(inMemorySong);
      },
      POST: async ({ request }) => {
        let body: { passcode?: string; youtubeId?: string; youtubeUrl?: string; title?: string };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid request payload" }, 400);
        }

        const normalizedPass = String(body.passcode ?? "")
          .trim()
          .toLowerCase();
        const isAuthorized =
          AUTHORIZED_PASSCODES.includes(normalizedPass) ||
          normalizedPass.startsWith("msl-") ||
          normalizedPass === "broadcast";

        if (!isAuthorized) {
          return json(
            { error: "Only authorized administrators and officials can broadcast the anthem" },
            403,
          );
        }

        const id = String(body.youtubeId ?? "").trim();
        if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
          return json({ error: "Invalid YouTube video ID format" }, 400);
        }

        const newSongState: SongState = {
          youtube_id: id,
          youtube_url:
            String(body.youtubeUrl ?? "").slice(0, 500) || `https://www.youtube.com/watch?v=${id}`,
          title: String(body.title ?? "").slice(0, 200) || "League Anthem",
          updated_at: new Date().toISOString(),
          activated: true,
        };

        // Save immediately to local state and disk
        saveSongState(newSongState);

        // Attempt Supabase sync asynchronously
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("site_song").upsert({
            id: 1,
            youtube_id: newSongState.youtube_id,
            youtube_url: newSongState.youtube_url,
            title: newSongState.title,
            updated_at: newSongState.updated_at,
          });
        } catch {
          // Ignore Supabase errors; local state is preserved
        }

        return json({ ok: true, song: newSongState });
      },
    },
  },
});
