// ══════════════════════════════════════════════════════════════════
//  IMMORTAL MEDIA STORE — IndexedDB Binary Persistence Engine
//  Allows storing videos (.mp4, .webm) and music (.mp3, .wav) of ANY
//  size permanently in browser storage. Survives page refreshes, tab
//  closes, and offline sessions without hitting Firestore size limits.
// ══════════════════════════════════════════════════════════════════

const DB_NAME = 'ImmortalMediaStoreDB';
const STORE_NAME = 'media_files';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }
  return dbPromise;
}

/**
 * Save a File or Blob to IndexedDB under a unique key.
 * @param {string} key - e.g. 'motion_bg_url' or 'bg_music_url'
 * @param {Blob|File} blob - Binary media payload
 * @returns {Promise<string>} 'idb://<key>'
 */
export async function saveMediaToIDB(key, blob) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve(`idb://${key}`);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('[MediaStore] IndexedDB save error:', err);
    throw err;
  }
}

/**
 * Retrieve a Blob from IndexedDB by key.
 */
export async function getMediaFromIDB(key) {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// In-memory cache for created object URLs so we reuse them during the session
const blobUrlCache = new Map();

/**
 * Resolve a setting URL string.
 * If urlStr starts with 'idb://<key>', fetches binary Blob from IndexedDB
 * and converts it into a usable Blob URL.
 */
export async function resolveMediaUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return urlStr;

  if (urlStr.startsWith('idb://')) {
    const key = urlStr.replace('idb://', '');
    if (blobUrlCache.has(key)) {
      return blobUrlCache.get(key);
    }
    const blob = await getMediaFromIDB(key);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      blobUrlCache.set(key, blobUrl);
      return blobUrl;
    }
  }
  return urlStr;
}

/**
 * Resolves all media properties in a settings object asynchronously.
 */
export async function resolveSettingsMedia(settingsObj) {
  if (!settingsObj || typeof settingsObj !== 'object') return settingsObj;

  const copy = { ...settingsObj };
  const keysToResolve = ['bg_music_url', 'motion_bg_url', 'custom_banner_url', 'seo_logo_url', 'favicon_url'];

  for (const key of keysToResolve) {
    if (copy[key] && typeof copy[key] === 'string' && copy[key].startsWith('idb://')) {
      copy[key] = await resolveMediaUrl(copy[key]);
    }
  }
  return copy;
}
