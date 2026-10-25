import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const Route = createFileRoute("/api/public/song")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return json({ error: "Anthem unavailable." }, 503);
        const db = createClient(url, key, {
          auth: { persistSession: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });
        const { data, error } = await db
          .from("site_song")
          .select("youtube_id,youtube_url,title,updated_at")
          .eq("id", 1)
          .maybeSingle();
        return error ? json({ error: "Anthem unavailable." }, 503) : json(data || {});
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        url.pathname = "/api/public/portal";
        url.search = "?action=song";
        return (await import("@/lib/portal.server")).handlePortal(new Request(url, request));
      },
    },
  },
});
