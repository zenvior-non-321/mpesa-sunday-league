import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Admin passcodes are checked on the server; only admins may change the site song.
const ADMIN_PASSCODES = ["msl2026", "admin123"];

export const Route = createFileRoute("/api/public/song")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("site_song")
          .select("youtube_id, youtube_url, title, updated_at")
          .eq("id", 1)
          .maybeSingle();
        return json(data ?? {});
      },
      POST: async ({ request }) => {
        let body: { passcode?: string; youtubeId?: string; youtubeUrl?: string; title?: string };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid request" }, 400);
        }
        if (!body.passcode || !ADMIN_PASSCODES.includes(body.passcode)) {
          return json({ error: "Only administrators can change the song" }, 403);
        }
        const id = String(body.youtubeId ?? "");
        if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return json({ error: "Invalid YouTube video" }, 400);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("site_song")
          .update({
            youtube_id: id,
            youtube_url: String(body.youtubeUrl ?? "").slice(0, 500),
            title: String(body.title ?? "").slice(0, 200) || "League Anthem",
            updated_at: new Date().toISOString(),
          })
          .eq("id", 1);
        if (error) return json({ error: "Could not save song" }, 500);
        return json({ ok: true });
      },
    },
  },
});
