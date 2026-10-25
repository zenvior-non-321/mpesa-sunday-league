// League anthem player built on the official YouTube IFrame API.
// The player stays visible (YouTube refuses to play hidden players) and is
// pre-loaded on page load so a tap on "Play Anthem" can start it instantly,
// which is what mobile browsers require.
(function () {
  var player = null;
  var ready = false;
  var targetId = null;
  var loadedId = null;
  var wantPlay = false;
  var volume = 60;
  var apiRequested = false;
  var listeners = [];

  function emit(state) {
    listeners.forEach(function (fn) {
      try {
        fn(state);
      } catch (e) {}
    });
  }

  function requestApi() {
    if (window.YT && window.YT.Player) return create();
    if (apiRequested) return;
    apiRequested = true;
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prev === "function") prev();
      create();
    };
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  }

  function create() {
    if (player || !targetId) return;
    var host = document.getElementById("pes-yt-player");
    if (!host) return;
    loadedId = targetId;
    player = new YT.Player("pes-yt-player", {
      width: "100%",
      height: "100%",
      videoId: targetId,
      playerVars: { playsinline: 1, controls: 1, rel: 0, modestbranding: 1, fs: 0 },
      events: {
        onReady: function () {
          ready = true;
          try {
            player.setVolume(volume);
          } catch (e) {}
          if (wantPlay) start();
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.ENDED) {
            try {
              window.dispatchEvent(
                new CustomEvent("pes_song_ended", { detail: { videoId: targetId } }),
              );
            } catch (err) {}
          }
          if (e.data === YT.PlayerState.PLAYING) wantPlay = true;
          if (e.data === YT.PlayerState.PAUSED) wantPlay = false;
          emit(e.data);
        },
        onError: function () {
          emit("error");
        },
      },
    });
  }

  function start() {
    try {
      player.unMute();
      player.setVolume(volume);
      if (loadedId !== targetId) {
        loadedId = targetId;
        player.loadVideoById(targetId);
      } else {
        player.playVideo();
      }
    } catch (e) {}
  }

  window.PesAnthem = {
    // Load a song without playing it (so the first tap starts instantly).
    cue: function (id) {
      if (!id) return;
      targetId = id;
      if (ready && loadedId !== id) {
        loadedId = id;
        player.cueVideoById(id);
      }
      requestApi();
    },
    play: function (id) {
      if (id) targetId = id;
      if (!targetId) return;
      wantPlay = true;
      if (ready) start();
      else requestApi();
    },
    pause: function () {
      wantPlay = false;
      if (ready) {
        try {
          player.pauseVideo();
        } catch (e) {}
      }
    },
    isPlaying: function () {
      return !!(ready && player.getPlayerState && player.getPlayerState() === 1);
    },
    setVolume: function (v) {
      volume = Math.round(Math.max(0, Math.min(1, Number(v) || 0)) * 100);
      if (ready) {
        try {
          player.setVolume(volume);
        } catch (e) {}
      }
    },
    onState: function (fn) {
      listeners.push(fn);
    },
  };
})();
