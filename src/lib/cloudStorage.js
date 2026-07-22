// ══════════════════════════════════════════════════════════════════
//  IMMORTAL MEDIA UPLOADER — Universal Firestore Chunked Storage
//  Uploads media files (videos, music, images) to Firestore Chunk Store
//  so EVERY visitor on ANY device worldwide can stream music & videos.
// ══════════════════════════════════════════════════════════════════

import { saveFirestoreMedia, saveMediaToIDB } from './mediaStore';

/**
 * Convert a File object to a Base64 Data URL.
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a media file into Firestore Chunked Global Media Store.
 * Returns a 'firestore_media://<key>' URL reference.
 */
export async function uploadMediaFile(file, folder = 'uploads') {
  if (!file) throw new Error('No file selected');

  console.log(`[MediaUploader] Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);

  // Convert File object to Base64 string
  const base64Data = await fileToBase64(file);
  const mediaKey = `${folder}_${Date.now()}`;

  // Save to Firestore Chunked Collection (Accessible globally to all visitors)
  const firestoreRef = await saveFirestoreMedia(mediaKey, base64Data);

  if (firestoreRef) {
    console.log(`[MediaUploader] Saved ${file.name} to Firestore Global Chunk Store: ${firestoreRef}`);
    return firestoreRef;
  }

  // Local IndexedDB fallback for current device
  console.warn('[MediaUploader] Falling back to IndexedDB local persistence');
  return await saveMediaToIDB(folder, file);
}
