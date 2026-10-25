import { describe, expect, it, beforeEach } from "vitest";
import {
  extractYouTubeId,
  getPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  setPrimaryAnthem,
} from "../lib/playlistManager";
import {
  getComments,
  submitFanComment,
  togglePinComment,
  deleteComment,
} from "../lib/communityComments";

describe("YouTube Playlist and Fan Community Moderation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("YouTube ID Extraction", () => {
    it("extracts ID from standard watch URL", () => {
      expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from short youtu.be URL", () => {
      expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from embed URL", () => {
      expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("handles raw 11-character video IDs directly", () => {
      expect(extractYouTubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("returns null on empty or invalid inputs", () => {
      expect(extractYouTubeId("")).toBeNull();
      expect(extractYouTubeId("   ")).toBeNull();
      expect(extractYouTubeId("invalid-url-string")).toBeNull();
    });
  });

  describe("Playlist Management", () => {
    it("initializes with default anthem track", () => {
      const playlist = getPlaylist();
      expect(playlist.length).toBeGreaterThan(0);
      expect(playlist[0].isOfficialAnthem).toBe(true);
    });

    it("can add a custom track to the playlist queue", () => {
      const initialCount = getPlaylist().length;
      const newTrack = addSongToPlaylist({
        title: "Celebration March",
        artist: "Brass Band",
        youtubeId: "dQw4w9WgXcQ",
        category: "CELEBRATION",
        duration: "3:33",
      });

      expect(newTrack).not.toBeNull();
      expect(newTrack?.id).toBeDefined();
      const updated = getPlaylist();
      expect(updated.length).toBe(initialCount + 1);
      expect(updated.some((t) => t.title === "Celebration March")).toBe(true);
    });

    it("can remove a track from the playlist queue", () => {
      const track = addSongToPlaylist({
        title: "Temporary Song",
        artist: "Test",
        youtubeId: "dQw4w9WgXcQ",
        category: "KICKOFF",
        duration: "2:00",
      });
      expect(track).not.toBeNull();
      if (!track) return;
      expect(getPlaylist().some((t) => t.id === track.id)).toBe(true);

      removeSongFromPlaylist(track.id);
      expect(getPlaylist().some((t) => t.id === track.id)).toBe(false);
    });

    it("can designate a track as primary anthem", () => {
      const track = addSongToPlaylist({
        title: "Official New Anthem",
        artist: "Cathedral Choir",
        youtubeId: "dQw4w9WgXcQ",
        category: "ANTHEM",
        duration: "4:15",
      });
      expect(track).not.toBeNull();
      if (!track) return;

      setPrimaryAnthem(track.id);
      const playlist = getPlaylist();
      const updatedTrack = playlist.find((t) => t.id === track.id);
      expect(updatedTrack?.isOfficialAnthem).toBe(true);
    });
  });

  describe("Fan Comments & Moderation", () => {
    it("loads default verified comments initially", () => {
      const comments = getComments();
      expect(comments.length).toBeGreaterThanOrEqual(3);
    });

    it("allows spectators to submit cheers", () => {
      const created = submitFanComment({
        author: "Fan John",
        role: "Supporter",
        clubSupported: "Samba Boys",
        message: "Play hard, stay blessed!",
        category: "CHEER",
      });

      expect(created.id).toBeDefined();
      const comments = getComments();
      expect(comments.some((c) => c.author === "Fan John")).toBe(true);
    });

    it("allows admin to pin and unpin comments", () => {
      const comments = getComments();
      const firstId = comments[0].id;
      const initialPinState = !!comments[0].isPinned;

      togglePinComment(firstId);
      const afterToggle = getComments();
      const toggled = afterToggle.find((c) => c.id === firstId);
      expect(toggled?.isPinned).toBe(!initialPinState);
    });

    it("allows admin to delete comments", () => {
      const created = submitFanComment({
        author: "Spam Bot",
        role: "Supporter",
        clubSupported: "Royal Rangers",
        message: "Unwanted content",
        category: "CHEER",
      });

      expect(getComments().some((c) => c.id === created.id)).toBe(true);
      deleteComment(created.id);
      expect(getComments().some((c) => c.id === created.id)).toBe(false);
    });
  });
});
