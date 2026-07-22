// ══════════════════════════════════════════════════════════════════
//  IMMORTAL GLOBAL MEDIA STORE — Firestore Chunked Media Engine
//  Stores audio (.mp3) and video (.mp4) in chunked Firestore documents
//  so EVERY visitor globally on ANY device can play custom music & videos.
// ══════════════════════════════════════════════════════════════════

import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const IDB_DB_NAME = 'ImmortalMediaStoreDB';
const IDB_STORE_NAME = 'media_files';
const CHUNK_SIZE = 450000; // ~450KB chunks to safely respect Firestore 1MB document limit

let idbPromise = null;

function getIDB() {
  if (!idbPromise) {
    idbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      const request = indexedDB.open(IDB_DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME);
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }
  return idbPromise;
}

/**
 * Save a File/Blob to local IndexedDB.
 */
export async function saveMediaToIDB(key, blob) {
  try {
    const dbInst = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = dbInst.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve(`idb://${key}`);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('[MediaStore] IDB save error:', err);
    throw err;
  }
}

/**
 * Retrieve Blob from local IndexedDB.
 */
export async function getMediaFromIDB(key) {
  try {
    const dbInst = await getIDB();
    return new Promise((resolve) => {
      const tx = dbInst.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Save Base64 Data URL into Firestore as chunked documents.
 * Accessible to ALL visitors globally on ANY device!
 */
export async function saveFirestoreMedia(mediaKey, base64Data) {
  if (!db || !base64Data) return null;

  try {
    const totalLength = base64Data.length;
    const chunksCount = Math.ceil(totalLength / CHUNK_SIZE);

    console.log(`[FirestoreMedia] Uploading ${mediaKey} in ${chunksCount} chunks...`);

    // Save metadata
    await setDoc(doc(db, 'media_store', mediaKey), {
      chunksCount,
      totalLength,
      updatedAt: new Date().toISOString(),
    });

    // Save each chunk document
    for (let i = 0; i < chunksCount; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalLength);
      const chunkStr = base64Data.substring(start, end);
      await setDoc(doc(db, 'media_store', `${mediaKey}_chunk_${i}`), {
        chunk: chunkStr,
      });
    }

    console.log(`[FirestoreMedia] ${mediaKey} saved to Firestore successfully!`);
    return `firestore_media://${mediaKey}`;
  } catch (err) {
    console.error('[FirestoreMedia] Save error:', err);
    return null;
  }
}

/**
 * Fetch Chunked Base64 Data URL from Firestore and convert to streaming Blob URL.
 */
export async function loadFirestoreMedia(mediaKey) {
  if (!db) return null;

  try {
    const metaSnap = await getDoc(doc(db, 'media_store', mediaKey));
    if (!metaSnap.exists()) return null;

    const { chunksCount } = metaSnap.data();
    let fullBase64 = '';

    for (let i = 0; i < chunksCount; i++) {
      const chunkSnap = await getDoc(doc(db, 'media_store', `${mediaKey}_chunk_${i}`));
      if (chunkSnap.exists()) {
        fullBase64 += chunkSnap.data().chunk;
      }
    }

    if (!fullBase64) return null;

    // Convert Base64 Data URL to Blob URL for instant browser streaming
    const res = await fetch(fullBase64);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('[FirestoreMedia] Load error:', err);
    return null;
  }
}

const mediaUrlCache = new Map();

/**
 * Resolve any media URL reference.
 * - Handles 'firestore_media://<key>' -> loads from Firestore collection
 * - Handles 'idb://<key>' -> loads from local IndexedDB
 */
export async function resolveMediaUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return urlStr;

  if (mediaUrlCache.has(urlStr)) {
    return mediaUrlCache.get(urlStr);
  }

  if (urlStr.startsWith('firestore_media://')) {
    const key = urlStr.replace('firestore_media://', '');
    const blobUrl = await loadFirestoreMedia(key);
    if (blobUrl) {
      mediaUrlCache.set(urlStr, blobUrl);
      return blobUrl;
    }
  }

  if (urlStr.startsWith('idb://')) {
    const key = urlStr.replace('idb://', '');
    const blob = await getMediaFromIDB(key);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      mediaUrlCache.set(urlStr, blobUrl);
      return blobUrl;
    }
  }

  return urlStr;
}

/**
 * Resolves all media URLs in a settings object asynchronously.
 */
export async function resolveSettingsMedia(settingsObj) {
  if (!settingsObj || typeof settingsObj !== 'object') return settingsObj;

  const copy = { ...settingsObj };
  const keysToResolve = ['bg_music_url', 'motion_bg_url', 'custom_banner_url', 'seo_logo_url', 'favicon_url'];

  for (const key of keysToResolve) {
    if (copy[key] && typeof copy[key] === 'string' && (copy[key].startsWith('firestore_media://') || copy[key].startsWith('idb://'))) {
      copy[key] = await resolveMediaUrl(copy[key]);
    }
  }
  return copy;
}
