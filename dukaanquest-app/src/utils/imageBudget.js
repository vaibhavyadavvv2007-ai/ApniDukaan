/**
 * Client-side image sizing for uploads.
 *
 * Vercel Functions reject any request body larger than 4.5 MB before our code
 * runs, and a base64 payload inflates by roughly 33% over the raw bytes. A
 * modern phone photo is routinely 3-8 MB, so an unresized upload fails in
 * production while working fine in local dev.
 *
 * `fitImageToBudget` decodes the file, downscales it until the encoded JPEG is
 * under `maxBytes`, and returns a Blob. Callers keep the same pipeline (they
 * still POST to /api/studio/upload and still get Gemini analysis back); only the
 * bytes on the wire get smaller.
 *
 * The margin leaves room for multipart boundaries and the productContext field.
 */

export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

/** Longest-edge cap, matching the resolution the studio already worked at. */
const MAX_EDGE = 1280;

/** Never upscale: a small image stays small. */
function targetSize(width, height, maxBytes) {
  let scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  // A single pass at MAX_EDGE is usually enough; if the encode still lands over
  // budget (very high detail), shrink further by this factor and retry.
  let dims = { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
  return dims;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That image could not be read.')); };
    img.src = url;
  });
}

function encode(img, width, height, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  // Flatten onto white so transparent PNGs don't become black in JPEG.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
  });
}

/**
 * Returns a JPEG Blob guaranteed to be at or under maxBytes when possible.
 * Falls back to the original file (never null) so callers always have something
 * to upload, even if re-encoding fails.
 */
export async function fitImageToBudget(file, maxBytes = MAX_UPLOAD_BYTES) {
  if (!file || !file.type.startsWith('image/')) return file;
  // Already small enough — send it untouched and preserve the original format.
  if (file.size <= maxBytes) return file;

  let img;
  try {
    img = await loadImage(file);
  } catch {
    return file;
  }

  let { width, height } = targetSize(img.width, img.height, maxBytes);
  let quality = 0.85;

  // Shrink-and-retry loop. Three passes is ample for the sizes we allow in.
  for (let attempt = 0; attempt < 3; attempt++) {
    const blob = await encode(img, width, height, quality);
    if (blob && blob.size <= maxBytes) return blob;

    // Too big: reduce quality first (cheap), then pixels if quality bottoms out.
    if (quality > 0.6) {
      quality = Math.max(0.6, quality - 0.15);
    } else {
      width = Math.max(1, Math.round(width * 0.75));
      height = Math.max(1, Math.round(height * 0.75));
      quality = 0.7;
    }
  }

  // Could not reach the budget; hand back the smallest attempt we made so the
  // user gets a clear failure at the server rather than a silent truncation.
  const smallest = await encode(img, width, height, 0.6);
  return smallest || file;
}

/** Filename to use when re-encoding, so the backend still sees an image MIME type. */
export function uploadFilename(originalName = 'product.jpg') {
  return /\.jpe?g$/i.test(originalName) ? originalName : `${originalName.replace(/\.[^.]+$/, '')}.jpg`;
}