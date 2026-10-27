import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
  // Override the default Cloudflare Nitro preset to Netlify
  nitro: {
    preset: "netlify",
  },
});
