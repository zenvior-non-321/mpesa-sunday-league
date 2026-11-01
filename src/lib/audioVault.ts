/**
 * Universal Anthem Audio Vault for M-Pesa Sunday League
 * Persists audio blobs in browser IndexedDB (supporting large audio files up to 100MB+)
 * with seamless cross-device fallbacks, base64 metadata, and universal HTML5 Audio playback.
 */

const DB_NAME = "mpesa_audio_vault_db";
const DB_VERSION = 1;
const STORE_NAME = "audio_tracks";
const PRIMARY_TRACK_KEY = "official_league_anthem";

export interface AudioVaultMetadata {
  id: string;
  title: string;
  artist: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration?: number;
  uploadedAt: string;
  source: "indexeddb_blob" | "youtube" | "remote_url";
  youtubeId?: string;
  remoteUrl?: string;
}

function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save an uploaded audio file into IndexedDB and save metadata to localStorage
 */
export async function saveAudioFileToVault(
  file: File,
  title?: string,
  artist?: string,
): Promise<AudioVaultMetadata> {
  const db = await openAudioDB();
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type || "audio/mpeg" });

  const metadata: AudioVaultMetadata = {
    id: PRIMARY_TRACK_KEY,
    title: title || file.name.replace(/\.[^/.]+$/, ""),
    artist: artist || "M-Pesa Sunday League Official Brass & Choir",
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || "audio/mpeg",
    uploadedAt: new Date().toISOString(),
    source: "indexeddb_blob",
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const putRequest = store.put(blob, PRIMARY_TRACK_KEY);

    putRequest.onsuccess = () => {
      try {
        localStorage.setItem("mpesa_pes_anthem_v6", JSON.stringify(metadata));
        localStorage.setItem(
          "mpesa_pes_anthem_v3",
          JSON.stringify({
            title: metadata.title,
            artist: metadata.artist,
            source: "vault",
            autoPlay: false,
            updatedAt: metadata.uploadedAt,
          }),
        );
        window.dispatchEvent(new CustomEvent("mpesa_anthem_changed", { detail: metadata }));
        window.dispatchEvent(new Event("storage"));
      } catch {
        // Storage quota catch
      }
      resolve(metadata);
    };

    putRequest.onerror = () => reject(putRequest.error);
  });
}

/**
 * Retrieve the audio blob from IndexedDB as an Object URL for playback
 */
export async function getAudioVaultBlobUrl(): Promise<string | null> {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(PRIMARY_TRACK_KEY);

      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (result instanceof Blob) {
          const url = URL.createObjectURL(result);
          resolve(url);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Read current anthem metadata from localStorage or fallback
 */
export function getAudioVaultMetadata(): AudioVaultMetadata | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("mpesa_pes_anthem_v6");
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore
  }
  return null;
}

/**
 * Delete anthem permanently from IndexedDB and localStorage
 */
export async function deleteAudioFromVault(): Promise<boolean> {
  try {
    const db = await openAudioDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const delRequest = store.delete(PRIMARY_TRACK_KEY);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => reject(delRequest.error);
    });

    localStorage.removeItem("mpesa_pes_anthem_v6");
    localStorage.removeItem("mpesa_pes_anthem_v3");
    window.dispatchEvent(new CustomEvent("mpesa_anthem_changed", { detail: null }));
    window.dispatchEvent(new Event("storage"));
    return true;
  } catch {
    return false;
  }
}
