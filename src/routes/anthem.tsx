import { createFileRoute } from "@tanstack/react-router";
import { AnthemStudioAndPlaylist } from "../components/AnthemStudioAndPlaylist";

export const Route = createFileRoute("/anthem")({
  head: () => ({
    meta: [
      { title: "Stadium Anthem & YouTube Playlist Studio | M-Pesa Sunday League" },
      {
        name: "description",
        content:
          "Official Stadium Anthem & YouTube Playlist Studio: upload YouTube songs, manage continuous web audio playlists, and configure stadium soundscapes.",
      },
    ],
  }),
  component: AnthemPlaylistPage,
});

function AnthemPlaylistPage() {
  return (
    <div className="min-h-screen bg-[#070512] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <AnthemStudioAndPlaylist />
      </div>
    </div>
  );
}
