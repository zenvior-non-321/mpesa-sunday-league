// Keeps every saved league record (fantasy, ratings, votes, comments, reports, calendar...)
// in the online database so all devices see the same data.
(function () {
  if (window.__mpesaCloudSync) return;
  window.__mpesaCloudSync = true;
  var API = "/api/public/portal?action=store";
  var SKIP = ["mpesa_pes_auth_user", "mpesa_pes_super_admin", "mpesa_pes_auth_role", "mpesa_admin_active_section",
    "mpesa_board_sub_tab", "mpesa_shared_revision", "mpesa_sync_audit", "mpesa_audio_vault", "mpesa_cloud_device"];
  var proto = Storage.prototype;
  var rawSet = proto.setItem, rawRemove = proto.removeItem;
  var device = localStorage.getItem("mpesa_cloud_device");
  if (!device) {
    device = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(36).slice(2)).toLowerCase();
    rawSet.call(localStorage, "mpesa_cloud_device", device);
  }
  var applying = false, timers = {};
  function synced(key) {
    return /^mpesa_[A-Za-z0-9_-]+$/.test(key) && !SKIP.some(function (p) { return key.indexOf(p) === 0; });
  }
  function push(key) {
    clearTimeout(timers[key]);
    timers[key] = setTimeout(function () {
      var raw = localStorage.getItem(key), data;
      try { data = raw === null ? null : JSON.parse(raw); } catch (e) { data = raw; }
      fetch(API, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key, data: data, device: device }) }).catch(function () {});
    }, 600);
  }
  proto.setItem = function (key, value) {
    rawSet.call(this, key, value);
    if (this === localStorage && !applying && synced(key)) push(key);
  };
  proto.removeItem = function (key) {
    rawRemove.call(this, key);
    if (this === localStorage && !applying && synced(key)) push(key);
  };
  function pull() {
    return fetch(API + "&device=" + encodeURIComponent(device), { credentials: "same-origin", cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : { rows: [] }; })
      .then(function (res) {
        var changed = [];
        applying = true;
        try {
          (res.rows || []).forEach(function (row) {
            var key = row.key.indexOf("device:") === 0 ? row.key.split(":").slice(2).join(":") : row.key;
            if (!synced(key)) return;
            var next = row.data === null ? null : typeof row.data === "string" ? row.data : JSON.stringify(row.data);
            if (localStorage.getItem(key) === next) return;
            if (next === null) rawRemove.call(localStorage, key); else rawSet.call(localStorage, key, next);
            changed.push(key);
          });
        } finally { applying = false; }
        changed.forEach(function (key) {
          window.dispatchEvent(new StorageEvent("storage", { key: key }));
          window.dispatchEvent(new CustomEvent("mpesa_db_updated", { detail: { tableName: key } }));
        });
        if (changed.length) window.dispatchEvent(new CustomEvent("mpesa_cloud_synced", { detail: { keys: changed } }));
      }).catch(function () {});
  }
  window.MpesaCloudSync = { pull: pull, push: push };
  pull();
  setInterval(function () { if (document.visibilityState === "visible") pull(); }, 30000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") pull(); });
})();
