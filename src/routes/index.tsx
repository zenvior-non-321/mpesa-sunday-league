import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      window.location.replace("/league.html");
    }
    throw redirect({ href: "/league.html" });
  },
  component: () => null,
});
