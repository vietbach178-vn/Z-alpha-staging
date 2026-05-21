import { put, del, list, type PutBlobResult } from '@vercel/blob';

/**
 * Upload a file to Vercel Blob.
 * Returns the public URL of the uploaded asset.
 *
 * @param file  Blob/File/Buffer to upload.
 * @param path  Suggested storage path (eg. "images/2026/05/hero-72h.jpg"). Vercel adds
 *              a content hash suffix to ensure uniqueness.
 */
export async function uploadAsset(file: File | Blob | Buffer | ArrayBuffer, path: string): Promise<PutBlobResult> {
  return await put(path, file, {
    access: 'public',
    addRandomSuffix: true,
  });
}

export async function deleteAsset(url: string) {
  return del(url);
}

export async function listAssets(prefix?: string) {
  return list({ prefix });
}
