import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Radio,
  ExternalLink,
  Sparkles,
  Settings,
  X,
  Check,
} from "lucide-react";
import { useRoleAccess } from "../hooks/useRoleAccess";

export interface AnthemConfig {
  title: string;
  artist: string;
  youtubeId: string;
  volume: number;
  mode: "audio" | "youtube";
}

const DEFAULT_ANTHEM: AnthemConfig = {
  title: "M-Pesa Sunday League Official Stadium Anthem",
  artist: "eFootball Championship Edition",
  youtubeId: "2yJgwwDcgV8",
  volume: 0.65,
  mode: "audio",
};

export function AnthemPlayerWidget({ isCompact = false }: { isCompact?: boolean }) {
  const { isSuperAdmin, currentRole } = useRoleAccess();
  const canManageAnthem =
    isSuperAdmin ||
    currentRole === "TECH_MANAGER" ||
    currentRole === "ASST_TECH_MANAGER" ||
    currentRole === "PRESIDENT";

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [config, setConfig] = useState<AnthemConfig>(DEFAULT_ANTHEM);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Edit settings form
  const [editTitle, setEditTitle] = useState(DEFAULT_ANTHEM.title);
  const [editYoutubeId, setEditYoutubeId] = useState(DEFAULT_ANTHEM.youtubeId);

  // Web Audio Context for realistic stadium synth fanfare & beat
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const syncAnthemConfig = () => {
      try {
        const stored = localStorage.getItem("mpesa_pes_anthem_v3");
        if (stored) {
          const parsed = JSON.parse(stored);
          setConfig(parsed);
          setEditTitle(parsed.title || DEFAULT_ANTHEM.title);
          setEditYoutubeId(parsed.youtubeId || DEFAULT_ANTHEM.youtubeId);

          // Auto-play when enabled by Admin
          if (parsed.autoPlay && !isPlaying) {
            const handleFirstInteraction = () => {
              setIsPlaying(true);
              startSynthAnthem();
              if (
                typeof window !== "undefined" &&
                (window as unknown as { PesAnthem?: { play: (id: string) => void } }).PesAnthem
              ) {
                (window as unknown as { PesAnthem: { play: (id: string) => void } }).PesAnthem.play(
                  parsed.youtubeId || DEFAULT_ANTHEM.youtubeId,
                );
              }
              window.removeEventListener("click", handleFirstInteraction);
              window.removeEventListener("keydown", handleFirstInteraction);
            };
            window.addEventListener("click", handleFirstInteraction, { once: true });
            window.addEventListener("keydown", handleFirstInteraction, { once: true });
          }
        }
      } catch {
        // Ignore
      }
    };

    syncAnthemConfig();
    window.addEventListener("storage", syncAnthemConfig);
    window.addEventListener("mpesa_anthem_changed", syncAnthemConfig);
    return () => {
      window.removeEventListener("storage", syncAnthemConfig);
      window.removeEventListener("mpesa_anthem_changed", syncAnthemConfig);
    };
  }, []);

  // Web Audio Stadium Fanfare & Rhythm Engine
  const startSynthAnthem = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const notes = [261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 523.25];
      let step = 0;

      const playNextTone = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Uplifting brass/anthem sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

        const currentVol = isMuted ? 0 : volume * 0.18;
        gain.gain.setValueAtTime(currentVol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        // Sub bass kick on strong beats
        if (step % 2 === 0) {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kickOsc.frequency.setValueAtTime(110, ctx.currentTime);
          kickOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.18);
          kickGain.gain.setValueAtTime(currentVol * 1.5, ctx.currentTime);
          kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          kickOsc.connect(kickGain);
          kickGain.connect(ctx.destination);
          kickOsc.start();
          kickOsc.stop(ctx.currentTime + 0.22);
        }

        step++;
      };

      playNextTone();
      timerRef.current = window.setInterval(playNextTone, 420);
    } catch {
      // Audio autoplay restrictions
    }
  };

  const stopSynthAnthem = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.suspend().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSynthAnthem();
      setIsPlaying(false);
      // Also try YouTube API if present
      if (
        typeof window !== "undefined" &&
        (window as unknown as { PesAnthem?: { pause: () => void } }).PesAnthem
      ) {
        (window as unknown as { PesAnthem: { pause: () => void } }).PesAnthem.pause();
      }
    } else {
      setIsPlaying(true);
      startSynthAnthem();
      if (
        typeof window !== "undefined" &&
        (window as unknown as { PesAnthem?: { play: (id: string) => void } }).PesAnthem
      ) {
        (window as unknown as { PesAnthem: { play: (id: string) => void } }).PesAnthem.play(
          config.youtubeId,
        );
      }
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (newVal === 0) setIsMuted(true);
    else setIsMuted(false);
    if (
      typeof window !== "undefined" &&
      (window as unknown as { PesAnthem?: { setVolume: (v: number) => void } }).PesAnthem
    ) {
      (window as unknown as { PesAnthem: { setVolume: (v: number) => void } }).PesAnthem.setVolume(
        newVal,
      );
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      if (
        typeof window !== "undefined" &&
        (window as unknown as { PesAnthem?: { setVolume: (v: number) => void } }).PesAnthem
      ) {
        (
          window as unknown as { PesAnthem: { setVolume: (v: number) => void } }
        ).PesAnthem.setVolume(0);
      }
    } else {
      if (
        typeof window !== "undefined" &&
        (window as unknown as { PesAnthem?: { setVolume: (v: number) => void } }).PesAnthem
      ) {
        (
          window as unknown as { PesAnthem: { setVolume: (v: number) => void } }
        ).PesAnthem.setVolume(volume);
      }
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AnthemConfig = {
      ...config,
      title: editTitle.trim() || DEFAULT_ANTHEM.title,
      youtubeId: editYoutubeId.trim() || DEFAULT_ANTHEM.youtubeId,
    };
    setConfig(updated);
    try {
      localStorage.setItem("mpesa_pes_anthem_v3", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("mpesa_anthem_changed"));
    } catch {
      // Ignore
    }
    setShowSettingsModal(false);
  };

  // Compact Sidebar Docked View
  if (isCompact) {
    return (
      <div className="bg-[#120d2e] border border-cyan-400/30 rounded-2xl p-3 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${isPlaying ? "bg-[#00f0ff] text-black animate-pulse" : "bg-white/10 text-cyan-400"}`}
            >
              <Music className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase text-white block truncate">
                Stadium Anthem
              </span>
              <span className="text-[9px] text-[#00f0ff] font-mono block">
                {isPlaying ? "Broadcasting Live" : "Soundtrack Paused"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition cursor-pointer shadow-md ${
              isPlaying
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-gradient-to-r from-[#00f0ff] to-emerald-400 hover:brightness-110 text-black font-black"
            }`}
            title={isPlaying ? "Pause Anthem" : "Play Anthem"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
        </div>

        {/* Volume & Equalizer bars */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={toggleMute}
            className="text-gray-400 hover:text-white"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
          />

          {/* Equalizer animation */}
          <div className="flex items-end gap-0.5 h-3">
            <span
              className={`w-1 bg-[#00f0ff] rounded-t ${isPlaying ? "h-3 animate-bounce" : "h-1"}`}
            />
            <span
              className={`w-1 bg-emerald-400 rounded-t ${isPlaying ? "h-2 animate-pulse" : "h-1"}`}
            />
            <span
              className={`w-1 bg-pink-400 rounded-t ${isPlaying ? "h-3.5 animate-bounce" : "h-1"}`}
            />
          </div>
        </div>
      </div>
    );
  }

  // Full Expanded Widget (Used in viewer or modals)
  return (
    <div className="bg-gradient-to-r from-[#140e2f] via-[#1c1445] to-[#120d2e] border-2 border-cyan-400/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2554] pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition ${
              isPlaying
                ? "bg-gradient-to-tr from-[#00f0ff] to-emerald-400 text-black shadow-cyan-500/30 animate-pulse"
                : "bg-[#0b081e] text-[#00f0ff] border border-cyan-400/30"
            }`}
          >
            <Music className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-400/20 text-[#00f0ff] border border-cyan-400/30 flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#00f0ff]" />
                <span>Official League Soundtrack</span>
              </span>
              {isPlaying && (
                <span className="text-[9px] font-black text-emerald-400 font-mono animate-pulse">
                  ● LIVE BROADCAST
                </span>
              )}
            </div>

            <h4 className="font-header text-lg font-black text-white uppercase mt-0.5">
              {config.title}
            </h4>
            <p className="text-xs text-gray-400 font-mono">
              {config.artist} • Stadium Fanfare Broadcast
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {canManageAnthem && (
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              title="Anthem Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={togglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg ${
              isPlaying
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25"
                : "bg-gradient-to-r from-[#00f0ff] to-emerald-400 hover:brightness-110 text-black shadow-cyan-500/25"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Anthem</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 ml-0.5" />
                <span>Play Anthem</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Wave & Volume Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a071c] p-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMute}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-mono uppercase">Vol:</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-28 sm:w-36 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
            />
            <span className="text-[10px] text-cyan-300 font-mono">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>

        {/* Dynamic Equalizer Bars */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
            Stadium Acoustics:
          </span>
          <div className="flex items-end gap-1 h-4 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
            <span
              className={`w-1 bg-[#00f0ff] rounded-t transition-all ${isPlaying ? "h-3 animate-bounce" : "h-1"}`}
            />
            <span
              className={`w-1 bg-emerald-400 rounded-t transition-all ${isPlaying ? "h-4 animate-pulse" : "h-1"}`}
            />
            <span
              className={`w-1 bg-amber-400 rounded-t transition-all ${isPlaying ? "h-2.5 animate-bounce" : "h-1"}`}
            />
            <span
              className={`w-1 bg-pink-400 rounded-t transition-all ${isPlaying ? "h-3.5 animate-pulse" : "h-1"}`}
            />
            <span
              className={`w-1 bg-cyan-300 rounded-t transition-all ${isPlaying ? "h-2 animate-bounce" : "h-1"}`}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a26] border-2 border-cyan-400/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#2e2554] pb-3">
              <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Configure Stadium Anthem</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Anthem Display Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px] mb-1">
                  YouTube Video ID (Optional for YouTube Mode)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2yJgwwDcgV8"
                  value={editYoutubeId}
                  onChange={(e) => setEditYoutubeId(e.target.value)}
                  className="w-full bg-[#141029] border border-[#2e2554] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2e2554]">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs uppercase transition shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Save Soundtrack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
