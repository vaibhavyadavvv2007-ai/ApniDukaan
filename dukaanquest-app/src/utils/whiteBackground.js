// Turns a staged catalogue photo into a marketplace-ready asset by replacing a
// flat studio backdrop with pure white (#FFFFFF).
//
// This is the local stand-in for the Gemini image route: it performs the same
// "background replaced with pure white #FFFFFF" pass that gemini-3.1-flash-image
// will perform once billing is enabled, using nothing but canvas. No package is
// added and no API call is pretended to be live.
//
// The product pixels are never recoloured. Only pixels belonging to the
// connected backdrop are dropped, so model, garment, pose and framing stay
// identical to the source photo and the white runs unbroken to the image edges.
//
// The transform only runs on a photo whose border is actually a flat studio
// backdrop. Outdoor or lifestyle frames are detected and left untouched, because
// removing "the background" from a garden or a sky would chew holes through the
// garment. In that case the caller keeps the original asset.

const MAX_PIXELS = 2_400_000; // keeps the working canvas under ~1560x1560
const LOCAL_TOLERANCE = 34; // backdrop drift allowed between neighbours
const GLOBAL_TOLERANCE = 92; // hard stop, so the fill cannot cross into fabric
const MIN_BACKDROP_SHARE = 0.15; // below this there is no backdrop to remove
const MAX_BACKDROP_SHARE = 0.93; // above this the whole frame was consumed
const MAX_BORDER_DEVIATION = 38; // per-channel sd of the border ring
const MAX_SUBJECT_BLOBS = 3; // distinct foreground shapes allowed
const MIN_BLOB_SHARE = 0.005; // ignore speckle below this fraction of the frame
const BORDER_RING = 3; // depth of the sampled border ring, in pixels
const SHADOW_MAX_DISTANCE = 78; // an enclosed region this close to the backdrop is a shadow
const MAX_SHADOW_SHARE = 0.06; // a shadow pocket is small; the product is not
const MIN_SHADOW_SCALE = 0.3; // darkest exposure accepted as backdrop shadow
const MAX_SHADOW_SCALE = 1.15; // brightest exposure accepted as backdrop
const SHADOW_TOLERANCE = 46; // residual allowed after fitting the exposure
const GREEN_RATIO_TOLERANCE = 0.07; // how far green may drift when shadowed
const EDGE_FEATHER_RADIUS = 2;
const OUTPUT_SIZE = 1000; // Amazon main images are square, 1000px or larger
const PRODUCT_OCCUPANCY = 0.85; // product should fill 85% of the frame

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Unsplash serves Access-Control-Allow-Origin: *, so the canvas stays
    // untainted and getImageData is allowed. Without this the read would throw.
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('white-background: image failed to load'));
    img.src = src;
  });
}

function deviation(values) {
  const n = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  return { mean, sd: Math.sqrt(variance) };
}

// Samples the outer ring of the frame. A seamless studio backdrop scores near
// zero here; sky, foliage and props do not.
function readBorder(data, width, height) {
  const reds = [];
  const greens = [];
  const blues = [];
  const push = (x, y) => {
    const i = (y * width + x) * 4;
    reds.push(data[i]);
    greens.push(data[i + 1]);
    blues.push(data[i + 2]);
  };

  for (let x = 0; x < width; x++) {
    for (let k = 0; k < BORDER_RING && k < height; k++) {
      push(x, k);
      push(x, height - 1 - k);
    }
  }
  for (let y = 0; y < height; y++) {
    for (let k = 0; k < BORDER_RING && k < width; k++) {
      push(k, y);
      push(width - 1 - k, y);
    }
  }

  const r = deviation(reds);
  const g = deviation(greens);
  const b = deviation(blues);
  // Normalised so it is independent of exposure.
  const refGreenRatio = r.mean > 1 ? g.mean / r.mean : 0;

  return {
    ref: [r.mean, g.mean, b.mean],
    refGreenRatio,
    maxSd: Math.max(r.sd, g.sd, b.sd),
  };
}

// A lit seamless sweep and the shadowed part of that same sweep share a hue but
// not an exposure, so a raw RGB distance rejects the shadowed area and it
// survives as a dark island touching the product. Fitting a brightness scale
// against the reference absorbs that difference.
//
// Scale alone is not a safe test: fitting will happily shrink the reference
// until it nearly matches any dark fabric. So the fit is only accepted when the
// pixel's green-to-red ratio also matches the reference. Shadow multiplies
// every channel by the same factor and so preserves that ratio exactly, whereas
// silk saree and gold zari sit far higher in green than the sweep does.
function shadowDistance(pr, pg, pb, lr, lg, lb, refGreenRatio) {
  const pr2 = pr * pr;
  if (pr2 < 25) return Number.POSITIVE_INFINITY; // too dark to judge a ratio

  const greenRatio = pg / Math.sqrt(pr2);
  if (Math.abs(greenRatio - refGreenRatio) > GREEN_RATIO_TOLERANCE) {
    return Number.POSITIVE_INFINITY;
  }

  const denom = lr * lr + lg * lg + lb * lb;
  if (denom < 1) return Number.POSITIVE_INFINITY;

  let k = (pr * lr + pg * lg + pb * lb) / denom;
  if (k < MIN_SHADOW_SCALE) k = MIN_SHADOW_SCALE;
  else if (k > MAX_SHADOW_SCALE) k = MAX_SHADOW_SCALE;

  const dr = pr - lr * k;
  const dg = pg - lg * k;
  const db = pb - lb * k;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// Region-growing flood fill seeded from every border pixel. Each queued pixel
// carries the colour that admitted it, so a graded backdrop is followed, while
// the global reference keeps the fill from creeping across a soft edge and into
// the garment.
function floodBackdrop(data, width, height, ref, refGreenRatio) {
  const [refR, refG, refB] = ref;
  const mask = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  const localR = new Float32Array(width * height);
  const localG = new Float32Array(width * height);
  const localB = new Float32Array(width * height);
  let head = 0;
  let tail = 0;

  const seed = (x, y) => {
    const p = y * width + x;
    if (mask[p]) return;
    const i = p * 4;
    mask[p] = 1;
    localR[p] = data[i];
    localG[p] = data[i + 1];
    localB[p] = data[i + 2];
    queue[tail++] = p;
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  const fill = (x, y, parent) => {
    const p = y * width + x;
    if (mask[p]) return;
    const i = p * 4;
    const pr = data[i];
    const pg = data[i + 1];
    const pb = data[i + 2];

    const lr = localR[parent];
    const lg = localG[parent];
    const lb = localB[parent];

    const dr = pr - lr;
    const dg = pg - lg;
    const db = pb - lb;
    const flat = Math.sqrt(dr * dr + dg * dg + db * db);
    const shaded = shadowDistance(pr, pg, pb, lr, lg, lb, refGreenRatio);

    if (flat > LOCAL_TOLERANCE && shaded > SHADOW_TOLERANCE) return;

    const gr = pr - refR;
    const gg = pg - refG;
    const gb = pb - refB;
    const globalFlat = Math.sqrt(gr * gr + gg * gg + gb * gb);
    if (globalFlat > GLOBAL_TOLERANCE && shadowDistance(pr, pg, pb, refR, refG, refB, refGreenRatio) > SHADOW_TOLERANCE) return;

    mask[p] = 1;
    localR[p] = pr;
    localG[p] = pg;
    localB[p] = pb;
    queue[tail++] = p;
  };

  while (head < tail) {
    const p = queue[head++];
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) fill(x - 1, y, p);
    if (x < width - 1) fill(x + 1, y, p);
    if (y > 0) fill(x, y - 1, p);
    if (y < height - 1) fill(x, y + 1, p);
  }

  return { mask, share: tail / (width * height) };
}

// A seamless backdrop is often lit unevenly, so a darker pocket of backdrop can
// end up enclosed by the product (for example the fall of a saree hem against
// the floor sweep). The border flood cannot reach such a pocket.
//
// An enclosed region is only treated as backdrop when BOTH tests agree:
//
//   - it is small, because a shadow pocket left by uneven lighting is a modest
//     fraction of the frame while the product itself is the largest thing in it;
//   - its mean colour still sits close to the backdrop, so it is a differently
//     lit patch of the same sweep rather than fabric with its own colour.
//
// Requiring both is what keeps the product safe. The product usually does not
// touch the frame edge, so it is itself an enclosed region, and colour alone is
// not a reliable enough test to act on.
function removeEnclosedBackdropShadows(mask, data, width, height, ref) {
  const total = width * height;
  const seen = new Uint8Array(total);
  const [refR, refG, refB] = ref;
  const maxSize = total * MAX_SHADOW_SHARE;
  let removed = 0;

  for (let start = 0; start < total; start++) {
    if (mask[start] || seen[start]) continue;

    const stack = [start];
    const region = [];
    seen[start] = 1;
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    while (stack.length) {
      const p = stack.pop();
      const i = p * 4;
      sumR += data[i];
      sumG += data[i + 1];
      sumB += data[i + 2];
      region.push(p);

      const x = p % width;
      const y = (p - x) / width;
      if (x > 0 && !mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1); }
      if (x < width - 1 && !mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1); }
      if (y > 0 && !mask[p - width] && !seen[p - width]) { seen[p - width] = 1; stack.push(p - width); }
      if (y < height - 1 && !mask[p + width] && !seen[p + width]) { seen[p + width] = 1; stack.push(p + width); }
    }

    const size = region.length;
    const mr = sumR / size;
    const mg = sumG / size;
    const mb = sumB / size;
    const distance = Math.sqrt((mr - refR) ** 2 + (mg - refG) ** 2 + (mb - refB) ** 2);

    if (distance > SHADOW_MAX_DISTANCE) continue; // own colour: this is the product
    if (size > maxSize) continue; // too large to be a shadow pocket: this is the product

    for (const p of region) {
      mask[p] = 1;
      removed++;
    }
  }

  return removed;
}

// Closes every backdrop region that is completely surrounded by product.
//
// On a seamless studio sweep there is nothing to see through the garment, so any
// fully enclosed gap is either a shadow the flood could not reach or a fold that
// was mistaken for backdrop. Either way it belongs to the product, and leaving it
// open produces white holes inside the saree. Regions touching the frame edge are
// left alone, because those are genuine backdrop.
function fillEnclosedHoles(mask, width, height) {
  const total = width * height;
  const seen = new Uint8Array(total);
  let filled = 0;

  for (let start = 0; start < total; start++) {
    if (!mask[start] || seen[start]) continue;

    const stack = [start];
    const region = [];
    seen[start] = 1;
    let touchesEdge = false;

    while (stack.length) {
      const p = stack.pop();
      region.push(p);
      const x = p % width;
      const y = (p - x) / width;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesEdge = true;

      if (x > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1); }
      if (x < width - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1); }
      if (y > 0 && mask[p - width] && !seen[p - width]) { seen[p - width] = 1; stack.push(p - width); }
      if (y < height - 1 && mask[p + width] && !seen[p + width]) { seen[p + width] = 1; stack.push(p + width); }
    }

    if (touchesEdge) continue;
    for (const p of region) {
      mask[p] = 0;
      filled++;
    }
  }

  return filled;
}

// Counts distinct foreground shapes left standing after the fill. A single
// product on a plain backdrop yields one. A garden or a crowd yields many,
// which means this is not a studio shot and must not be cut out.
function countSubjectBlobs(mask, width, height) {
  const total = width * height;
  const minSize = total * MIN_BLOB_SHARE;
  const seen = new Uint8Array(total);
  let blobs = 0;

  for (let start = 0; start < total; start++) {
    if (mask[start] || seen[start]) continue;
    const stack = [start];
    seen[start] = 1;
    let size = 0;
    let touchesEdge = false;

    while (stack.length) {
      const p = stack.pop();
      size++;
      const x = p % width;
      const y = (p - x) / width;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesEdge = true;

      if (x > 0 && !mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1); }
      if (x < width - 1 && !mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1); }
      if (y > 0 && !mask[p - width] && !seen[p - width]) { seen[p - width] = 1; stack.push(p - width); }
      if (y < height - 1 && !mask[p + width] && !seen[p + width]) { seen[p + width] = 1; stack.push(p + width); }
    }

    // Speckle left by a soft edge is ignored; it is feathered away later.
    if (!touchesEdge && size >= minSize) blobs++;
    if (blobs > MAX_SUBJECT_BLOBS) return blobs;
  }

  return blobs;
}

// Erodes the product silhouette by one pixel before feathering.
//
// Without this, the feather is centred on the product/backdrop boundary, so the
// outermost ring of still-backdrop pixels picks up a partial alpha. Those pixels
// are dark, and a dark pixel at partial alpha over white composites to grey,
// which showed up as a smudge hugging the hem. Pulling the boundary in by a
// pixel moves the whole alpha ramp inside product-coloured pixels, so the ramp
// blends fabric into white instead of shadow into white.
function erodeAlpha(mask, width, height) {
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      let keep = mask[p] ? 0 : 255;
      if (keep) {
        if (x > 0 && mask[p - 1]) keep = 0;
        else if (x < width - 1 && mask[p + 1]) keep = 0;
        else if (y > 0 && mask[p - width]) keep = 0;
        else if (y < height - 1 && mask[p + width]) keep = 0;
      }
      out[p] = keep;
    }
  }
  return out;
}

// Small box blur on the alpha channel, so the cut-out edge reads as a soft
// photographic boundary rather than a jagged stencil.
function featherAlpha(mask, width, height, radius) {
  const src = erodeAlpha(mask, width, height);

  const tmp = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let k = -radius; k <= radius; k++) {
        const xx = x + k;
        if (xx < 0 || xx >= width) continue;
        sum += src[y * width + xx];
        count++;
      }
      tmp[y * width + x] = sum / count;
    }
  }

  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let k = -radius; k <= radius; k++) {
        const yy = y + k;
        if (yy < 0 || yy >= height) continue;
        sum += tmp[yy * width + x];
        count++;
      }
      out[y * width + x] = sum / count;
    }
  }
  return out;
}

// Bounding box of everything the backdrop fill did NOT claim, which is the
// product. Returns null when there is nothing left standing.
function measureProduct(mask, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mask[y * width + x]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) return null;
  return { minX, minY, maxX, maxY };
}

// Geometry for the square marketplace frame.
//
// Two rules, in this order:
//
//  1. Scale so the product's larger axis occupies PRODUCT_OCCUPANCY of the
//     square, centred, leaving an even white margin. This is the marketplace
//     framing rule.
//  2. Clamp that scale down to whichever of size/width and size/height is
//     smaller, so the ENTIRE source image always fits inside the canvas.
//
// The clamp matters. A product that occupies only a small part of a large source
// frame would otherwise scale up past the canvas and get cropped, taking the
// head or the hem with it. Contain logic is the guarantee that nothing is ever
// cut off, whatever the photo looks like.
//
// One scale value drives both axes, so the source aspect ratio is preserved and
// the subject can never be stretched or squashed.
function squareFraming(bbox, width, height, size) {
  const spanX = bbox.maxX - bbox.minX + 1;
  const spanY = bbox.maxY - bbox.minY + 1;
  const span = Math.max(spanX, spanY);

  const occupancyScale = (size * PRODUCT_OCCUPANCY) / span;
  const fitScale = Math.min(size / width, size / height);
  const scale = Math.min(occupancyScale, fitScale);

  const centreX = (bbox.minX + bbox.maxX + 1) / 2;
  const centreY = (bbox.minY + bbox.maxY + 1) / 2;

  const dw = width * scale;
  const dh = height * scale;

  // Centre the subject, then correct so the scaled source sits centred in the
  // square. When the clamp is active these two disagree, and the image must
  // still be centred as a whole.
  let dx = size / 2 - centreX * scale;
  let dy = size / 2 - centreY * scale;

  if (occupancyScale > fitScale) {
    dx = (size - dw) / 2;
    dy = (size - dh) / 2;
  }

  return { dx, dy, dw, dh, size };
}

// Paints the uncut source into the same square frame as the white version, so
// the two halves of the comparison slider line up pixel for pixel.
//
// The letterbox margin is filled with the flat backdrop colour measured from the
// photo border. An earlier version stretched the photo's outermost pixels into
// that margin, which dragged the dark corners of the frame outwards as visible
// bands and made the "before" image look worse than the original photo.
function renderFramedSource(sourceCanvas, frame, backdrop) {
  const { dx, dy, dw, dh, size } = frame;
  const out = document.createElement('canvas');
  out.width = size;
  out.height = size;
  const ctx = out.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, size, size);

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, dx, dy, dw, dh);
  return out.toDataURL('image/png');
}

/**
 * Prepare a flat studio photo as a marketplace main image: the backdrop is
 * replaced with pure white and the product is placed on a square 1:1 white
 * frame at marketplace occupancy.
 *
 * Returns { white, framed }, where `white` is the cut-out product on white and
 * `framed` is the untouched photo in the identical square frame. The Studio
 * screen shows `white` on the right of the comparison and `framed` on the left,
 * so the slider reveals the background change and nothing else.
 *
 * Returns null when the photo is not a flat-backdrop studio shot, or when the
 * result would not be trustworthy. The caller keeps the original asset then.
 */
export async function prepareWhiteBackgroundAsset(src) {
  if (!src) return null;

  let img;
  try {
    img = await loadImage(src);
  } catch {
    return null;
  }

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width || !height) return null;

  let scale = 1;
  if (width * height > MAX_PIXELS) {
    scale = Math.sqrt(MAX_PIXELS / (width * height));
  }

  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const work = document.createElement('canvas');
  work.width = w;
  work.height = h;
  const wctx = work.getContext('2d', { willReadFrequently: true });
  if (!wctx) return null;
  wctx.drawImage(img, 0, 0, w, h);

  let imageData;
  try {
    imageData = wctx.getImageData(0, 0, w, h);
  } catch {
    // Canvas tainted, or decode failed. Keep the original asset.
    return null;
  }

  const data = imageData.data;
  const { ref, refGreenRatio, maxSd } = readBorder(data, w, h);

  // Not a seamless backdrop: sky, foliage, props or a busy scene. Cutting the
  // background out of this would damage the garment, so leave it alone.
  if (maxSd > MAX_BORDER_DEVIATION) return null;

  const { mask, share } = floodBackdrop(data, w, h, ref, refGreenRatio);
  if (share < MIN_BACKDROP_SHARE) return null; // already a white-background shot
  if (share > MAX_BACKDROP_SHARE) {
    console.warn(
      '[studio] backdrop fill consumed %.0f%% of the frame; keeping the source asset.',
      share * 100
    );
    return null;
  }

// Shadowed backdrop trapped behind the product is only removed when it forms a
// small region of its own that still reads as backdrop. A second pass used to
// grow from the product boundary inwards to catch wider shadows, but that also
// ate shadowed folds of the saree and left white holes in the garment. Keeping
// only the enclosed-region test means the garment is never eroded from its
// outline, and any residual gap inside the subject is closed by the hole fill
// below.
removeEnclosedBackdropShadows(mask, data, w, h, ref);
fillEnclosedHoles(mask, w, h);

  const blobs = countSubjectBlobs(mask, w, h);
  if (blobs > MAX_SUBJECT_BLOBS) {
    console.warn(
      '[studio] backdrop fill left %d separate shapes, so this is not a studio shot; keeping the source asset.',
      blobs
    );
    return null;
  }

  const alpha = featherAlpha(mask, w, h, EDGE_FEATHER_RADIUS);

  // Cut-out on transparent, at source resolution.
  const cutout = document.createElement('canvas');
  cutout.width = w;
  cutout.height = h;
  const cctx = cutout.getContext('2d');
  if (!cctx) return null;

  const cutoutData = cctx.createImageData(w, h);
  const cd = cutoutData.data;

  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    let r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Despill: on the feathered boundary, pull back residual backdrop colour
    // that bled onto the fabric edge. Interior pixels are left untouched.
    const a = alpha[p];
    if (a > 0 && a < 255) {
      const ceiling = Math.max(g, b);
      if (r > ceiling) r = ceiling + (r - ceiling) * 0.25;
    }

    cd[i] = r;
    cd[i + 1] = g;
    cd[i + 2] = b;
    cd[i + 3] = Math.round(a);
  }

  cctx.putImageData(cutoutData, 0, 0);

  const bbox = measureProduct(mask, w, h);
  if (!bbox) return null;
  const frame = squareFraming(bbox, w, h, OUTPUT_SIZE);

  // Fill first, so the composite is genuinely white behind the product rather
  // than a red photo sitting inside a white box.
  const out = document.createElement('canvas');
  out.width = frame.size;
  out.height = frame.size;
  const octx = out.getContext('2d');
  if (!octx) return null;

  octx.fillStyle = '#FFFFFF';
  octx.fillRect(0, 0, frame.size, frame.size);
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(cutout, frame.dx, frame.dy, frame.dw, frame.dh);

  const framed = renderFramedSource(work, frame, `rgb(${ref[0] | 0}, ${ref[1] | 0}, ${ref[2] | 0})`);
  if (!framed) return null;

  return { white: out.toDataURL('image/png'), framed };
}