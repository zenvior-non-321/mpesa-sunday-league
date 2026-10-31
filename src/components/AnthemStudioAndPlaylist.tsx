import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Repeat,
  Shuffle,
  Radio,
  ListMusic,
  Disc3,
  Flame,
  Shield,
  Crown,
} from "lucide-react";
import {
  type AnthemSong,
  getPlaylist,
  savePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylist,
  setPrimaryAnthem,
  extractYouTubeId,
  getYouTubeThumbnail,
} from "../lib/playlistManager";
import { useRoleAccess } from "../hooks/useRoleAccess";

export function AnthemStudioAndPlaylist() {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const canManageSongs =
    isSuperAdmin ||
    currentRole === "TECH_MANAGER" ||
    currentRole === "ASST_TECH_MANAGER" ||
    currentRole === "PRESIDENT";

  const [playlist, setPlaylist] = useState<AnthemSong[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoopEnabled, setIsLoopEnabled] = useState<boolean>(true);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add song form
  const [urlInput, setUrlInput] = useState<string>("");
  const [titleInput, setTitleInput] = useState<string>("");
  const [artistInput, setArtistInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<AnthemSong["category"]>("ANTHEM");
  const [detectedId, setDetectedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Web Audio Synth Backup Engine
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load and listen to playlist changes
  useEffect(() => {
    const list = getPlaylist();
    setPlaylist(list);

    const handleUpdate = () => {
      setPlaylist(getPlaylist());
    };
    window.addEventListener("mpesa_playlist_updated", handleUpdate);
    return () => window.removeEventListener("mpesa_playlist_updated", handleUpdate);
  }, []);

  // Detect YouTube video ID dynamically as user types
  useEffect(() => {
    const id = extractYouTubeId(urlInput);
    setDetectedId(id);
    if (urlInput && !id) {
      setFormError("Could not detect valid YouTube video ID or URL.");
    } else {
      setFormError(null);
    }
  }, [urlInput]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentSong = playlist[currentSongIndex] || playlist[0];

  // Auto-advance listener when song finishes
  useEffect(() => {
    const handleSongEnded = () => {
      if (playlist.length === 0) return;

      if (isShuffleEnabled && playlist.length > 1) {
        let nextIdx = Math.floor(Math.random() * playlist.length);
        if (nextIdx === currentSongIndex) {
          nextIdx = (nextIdx + 1) % playlist.length;
        }
        playSongAtIndex(nextIdx);
        return;
      }

      if (currentSongIndex < playlist.length - 1) {
        playSongAtIndex(currentSongIndex + 1);
      } else if (isLoopEnabled) {
        playSongAtIndex(0);
      } else {
        setIsPlaying(false);
      }
    };

    window.addEventListener("pes_song_ended", handleSongEnded);
    return () => window.removeEventListener("pes_song_ended", handleSongEnded);
  }, [currentSongIndex, playlist, isLoopEnabled, isShuffleEnabled]);

  const playSongAtIndex = (index: number) => {
    if (index < 0 || index >= playlist.length) return;
    const song = playlist[index];
    setCurrentSongIndex(index);
    setIsPlaying(true);

    // 1. Play in YouTube Iframe
    if (
      typeof window !== "undefined" &&
      (window as unknown as { PesAnthem?: { play: (id: string) => void } }).PesAnthem
    ) {
      (window as unknown as { PesAnthem: { play: (id: string) => void } }).PesAnthem.play(
        song.youtubeId,
      );
    }

    // 2. Fallback Web Audio Synth if needed
    triggerSynthChime();
    showToast(`▶ Now Playing: ${song.title}`);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (
        typeof window !== "undefined" &&
        (window as unknown as { PesAnthem?: { pause: () => void } }).PesAnthem
      ) {
        (window as unknown as { PesAnthem: { pause: () => void } }).PesAnthem.pause();
      }
    } else {
      playSongAtIndex(currentSongIndex);
    }
  };

  const handleNextTrack = () => {
    if (playlist.length <= 1) return;
    if (isShuffleEnabled) {
      const nextIdx = Math.floor(Math.random() * playlist.length);
      playSongAtIndex(nextIdx);
    } else {
      const next = (currentSongIndex + 1) % playlist.length;
      playSongAtIndex(next);
    }
  };

  const handlePrevTrack = () => {
    if (playlist.length <= 1) return;
    const prev = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSongAtIndex(prev);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (
      typeof window !== "undefined" &&
      (window as unknown as { PesAnthem?: { setVolume: (v: number) => void } }).PesAnthem
    ) {
      (window as unknown as { PesAnthem: { setVolume: (v: number) => void } }).PesAnthem.setVolume(
        newVol,
      );
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const target = nextMuted ? 0 : volume || 0.7;
    if (
      typeof window !== "undefined" &&
      (window as unknown as { PesAnthem?: { setVolume: (v: number) => void } }).PesAnthem
    ) {
      (window as unknown as { PesAnthem: { setVolume: (v: number) => void } }).PesAnthem.setVolume(
        target,
      );
    }
  };

  const triggerSynthChime = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // High C
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E

      const v = isMuted ? 0 : volume * 0.08;
      gain.gain.setValueAtTime(v, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // ignore
    }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detectedId) {
      setFormError("Please enter a valid YouTube video URL or ID.");
      return;
    }
    if (!titleInput.trim()) {
      setFormError("Please provide a song title.");
      return;
    }

    const created = addSongToPlaylist({
      title: titleInput.trim(),
      artist: artistInput.trim() || "Sunday League Artist",
      youtubeId: detectedId,
      category: categoryInput,
    });

    if (created) {
      setUrlInput("");
      setTitleInput("");
      setArtistInput("");
      setDetectedId(null);
      setFormError(null);
      showToast(`✓ Added "${created.title}" to playlist!`);
    }
  };

  const handleRemoveSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.length <= 1) {
      showToast("Cannot remove the last remaining anthem from playlist.");
      return;
    }
    removeSongFromPlaylist(id);
    showToast("✓ Track removed from playlist.");
  };

  const handleMoveUp = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (idx === 0) return;
    reorderPlaylist(idx, idx - 1);
  };

  const handleMoveDown = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (idx === playlist.length - 1) return;
    reorderPlaylist(idx, idx + 1);
  };

  const handleSetPrimary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrimaryAnthem(id);
    showToast("✓ Set as Primary Stadium Anthem!");
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#180a3a] via-[#100827] to-[#070512] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Official Stadium Audio & Continuous Playlist Engine</span>
          </div>

          <h2 className="font-header text-2xl sm:text-4xl font-black text-white uppercase tracking-wider leading-tight">
            Stadium Anthem & YouTube Playlist Studio
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
            Upload custom YouTube anthems, curate stadium matchday hype chants, and configure automated
            continuous web playback that plays stadium sound uninterrupted as fans navigate the
            league portal.
          </p>
        </div>
      </div>

      {/* MAIN MEDIA PLAYER CONSOLE */}
      {currentSong && (
        <div className="bg-[#0b0821] border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Visualizer & Album Thumbnail */}
            <div className="relative w-44 h-32 sm:w-56 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-400/40 shrink-0 group">
              <img
                src={getYouTubeThumbnail(currentSong.youtubeId)}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/80 text-white backdrop-blur-sm">
                  {currentSong.category}
                </span>
              </div>

              {/* Animated Sound Equalizer Waves */}
              {isPlaying && (
                <div className="absolute top-2 right-2 flex items-end gap-1 h-6 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm">
                  <div className="w-1 bg-[#00f0ff] rounded-full animate-bounce [animation-delay:0.1s] h-4" />
                  <div className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.3s] h-5" />
                  <div className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s] h-3" />
                  <div className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s] h-6" />
                </div>
              )}
            </div>

            {/* Currently Playing Track Details & Controls */}
            <div className="flex-1 min-w-0 space-y-3 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                  Track #{currentSongIndex + 1} of {playlist.length}
                </span>
                {currentSong.isOfficialAnthem && (
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Official League Anthem</span>
                  </span>
                )}
                <span className="text-[10px] font-mono text-cyan-300">
                  YT ID: {currentSong.youtubeId}
                </span>
              </div>

              <h3 className="font-header text-xl sm:text-2xl font-black text-white uppercase truncate">
                {currentSong.title}
              </h3>
              <p className="text-sm font-semibold text-gray-400 truncate">
                {currentSong.artist} •{" "}
                <span className="text-emerald-400">Automatic Web Playback Enabled</span>
              </p>

              {/* Control Buttons Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                {/* Shuffle Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsShuffleEnabled(!isShuffleEnabled);
                    showToast(
                      isShuffleEnabled ? "Shuffle Mode Disabled" : "Shuffle Mode Active 🔀",
                    );
                  }}
                  className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                    isShuffleEnabled
                      ? "bg-purple-500 text-white border-purple-400"
                      : "bg-[#141029] text-gray-400 hover:text-white border-[#2e2554]"
                  }`}
                  title="Toggle Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Prev Track */}
                <button
                  type="button"
                  onClick={handlePrevTrack}
                  className="p-2.5 rounded-2xl bg-[#141029] hover:bg-[#1e1742] text-white border border-[#2e2554] transition cursor-pointer shadow"
                  title="Previous Track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Large Play/Pause Button */}
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-purple-500 to-[#00ff85] text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition cursor-pointer active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-black" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-black" />
                      <span>Play Track</span>
                    </>
                  )}
                </button>

                {/* Next Track */}
                <button
                  type="button"
                  onClick={handleNextTrack}
                  className="p-2.5 rounded-2xl bg-[#141029] hover:bg-[#1e1742] text-white border border-[#2e2554] transition cursor-pointer shadow"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Loop Mode */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoopEnabled(!isLoopEnabled);
                    showToast(isLoopEnabled ? "Looping Disabled" : "Continuous Loop Active 🔁");
                  }}
                  className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                    isLoopEnabled
                      ? "bg-cyan-500 text-black border-cyan-400 font-bold"
                      : "bg-[#141029] text-gray-400 hover:text-white border-[#2e2554]"
                  }`}
                  title="Toggle Loop Playlist"
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Volume Slider & Mute */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#141029] border border-[#2e2554]">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-gray-400 w-8 text-right">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>

                {/* External YouTube link */}
                <a
                  href={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-2xl bg-[#141029] hover:bg-[#1e1742] text-gray-400 hover:text-white border border-[#2e2554] transition"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TWO COLUMN GRID: ADD YOUTUBE SONG & PLAYLIST QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: UPLOAD / ADD YOUTUBE SONG TO PLAYLIST (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="border-b border-[#2e2554] pb-3">
            <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block">
              Curator & Administrator Studio
            </span>
            <h4 className="font-header text-lg font-black text-white uppercase mt-0.5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Upload YouTube Song to Playlist
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Paste any YouTube video link or 11-digit video code to add it to the automatic web
              soundtrack.
            </p>
          </div>

          <form onSubmit={handleAddSong} className="space-y-4">
            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                YouTube URL or Video ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. https://www.youtube.com/watch?v=kXYiU_JCYtU"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
              />
              {detectedId ? (
                <div className="mt-1.5 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Detected YouTube ID: {detectedId}</span>
                </div>
              ) : formError ? (
                <div className="mt-1.5 flex items-center gap-2 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formError}</span>
                </div>
              ) : null}
            </div>

            {/* Video preview thumbnail if detected */}
            {detectedId && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-cyan-400/40 bg-black">
                <img
                  src={getYouTubeThumbnail(detectedId)}
                  alt="YouTube Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full bg-cyan-400 text-black text-xs font-black uppercase">
                    Preview Verified
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                Song Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunday League Faith & Victory Fanfare"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                Artist / Ministry / Choir
              </label>
              <input
                type="text"
                placeholder="e.g. M-Pesa Academy Youth Brass Band"
                value={artistInput}
                onChange={(e) => setArtistInput(e.target.value)}
                className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                Song Category
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value as AnthemSong["category"])}
                className="w-full bg-[#141029] border border-[#2e2554] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              >
                <option value="ANTHEM">Stadium Anthem</option>
                <option value="CELEBRATION">Victory Celebration</option>
                <option value="KICKOFF">Kickoff Fanfare</option>
                <option value="DEVOTIONAL">Devotional Chant</option>
                <option value="CHAMPIONSHIP">Championship Trophy</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-cyan-500/20 transition cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Song to Continuous Web Playlist</span>
            </button>
          </form>
        </div>

        {/* RIGHT: COMPLETE PLAYLIST QUEUE & REORDERING (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0821] border border-[#2e2554] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-3">
            <div>
              <h4 className="font-header text-lg font-black text-white uppercase flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-purple-400" />
                Active League Playlist Queue ({playlist.length} Songs)
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Tracks will automatically play one after the other in continuous sequence across the
                portal.
              </p>
            </div>

            <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Auto-Play Web Queue
            </span>
          </div>

          {/* Song Queue List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {playlist.map((song, idx) => {
              const isCurrent = idx === currentSongIndex;

              return (
                <div
                  key={song.id}
                  onClick={() => playSongAtIndex(idx)}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer group ${
                    isCurrent
                      ? "bg-purple-950/40 border-purple-400/80 shadow-lg shadow-purple-500/20"
                      : "bg-[#141029] border-[#2e2554] hover:bg-[#1a1438] hover:border-purple-500/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Index or Playing Animation */}
                    <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-gray-400">
                      {isCurrent && isPlaying ? (
                        <Disc3 className="w-4 h-4 text-[#00f0ff] animate-spin" />
                      ) : (
                        <span>#{idx + 1}</span>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                      <img
                        src={getYouTubeThumbnail(song.youtubeId)}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5
                          className={`text-xs font-black truncate leading-tight uppercase ${
                            isCurrent ? "text-[#00f0ff]" : "text-white group-hover:text-cyan-300"
                          }`}
                        >
                          {song.title}
                        </h5>
                        {song.isOfficialAnthem && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                            Anthem
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">
                        {song.artist} • <span className="font-mono">{song.category}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Controls for Track */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => handleMoveUp(idx, e)}
                      title="Move Up"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === playlist.length - 1}
                      onClick={(e) => handleMoveDown(idx, e)}
                      title="Move Down"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Set Primary Anthem Button */}
                    {!song.isOfficialAnthem && canManageSongs && (
                      <button
                        type="button"
                        onClick={(e) => handleSetPrimary(song.id, e)}
                        title="Set as Default League Anthem"
                        className="p-1.5 rounded-lg text-amber-400/60 hover:text-amber-300 hover:bg-amber-400/10 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete Song */}
                    {canManageSongs && playlist.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveSong(song.id, e)}
                        title="Delete Song"
                        className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
