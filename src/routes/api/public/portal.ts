import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/api/public/portal')({
  server: { handlers: {
    GET: async ({ request }) => (await import('@/lib/portal.server')).handlePortal(request),
    POST: async ({ request }) => (await import('@/lib/portal.server')).handlePortal(request),
  } },
});