import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      throw redirect({ href: "/league.html" });
    }
  },
  component: function IndexRedirect() {
    useEffect(() => {
      window.location.replace("/league.html");
    }, []);
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070512] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-mono text-sm text-gray-400">Loading M-Pesa Sunday League...</p>
        </div>
      </div>
    );
  },
});

