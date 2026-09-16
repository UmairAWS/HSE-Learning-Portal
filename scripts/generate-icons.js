import fs from "fs";
import path from "path";
import zlib from "zlib";

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(len + 12);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, len + 8));
  buf.writeUInt32BE(crc, len + 8);
  return buf;
}

function createPng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk("IHDR", ihdr);

  // Scanlines with filter byte 0
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 100;
  const safeMargin = isMaskable ? 0.75 : 0.9;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter: none

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Base background: Deep Slate Emerald Gradient
      const ny = y / height;
      const rBg = Math.round(15 * (1 - ny) + 5 * ny);
      const gBg = Math.round(30 * (1 - ny) + 150 * ny * 0.4);
      const bBg = Math.round(40 * (1 - ny) + 105 * ny * 0.4);

      // Distance from center for shield icon
      const dx = (x - cx) / (scale * 36 * safeMargin);
      const dy = (y - cy) / (scale * 40 * safeMargin);

      // Shield mathematical curve: top is rounded arch, bottom tapers to a point
      const inShield = (dy >= -0.85 && dy <= 0.95 && Math.abs(dx) <= (1.0 - (dy > 0 ? (dy * 0.7) : 0)));

      // Cross / Star symbol inside shield
      const crossDx = Math.abs(x - cx) / (scale * safeMargin);
      const crossDy = Math.abs((y - (cy - scale * 2))) / (scale * safeMargin);
      const inCross = (crossDx < 4 && crossDy < 14) || (crossDx < 14 && crossDy < 4);

      let r = rBg;
      let g = gBg;
      let b = bBg;
      let a = 255;

      if (inShield) {
        // Shield fill: vivid emerald gradient
        r = 16;
        g = Math.min(255, Math.round(185 + (1 - ny) * 40));
        b = 129;

        // Subtle shield border check
        const edgeDist = Math.abs(dx) - (1.0 - (dy > 0 ? (dy * 0.7) : 0));
        if (edgeDist > -0.12 || dy < -0.75 || dy > 0.85) {
          // Gold / Bright Teal accent border
          r = 52;
          g = 211;
          b = 153;
        }

        if (inCross) {
          // White safety cross
          r = 255;
          g = 255;
          b = 255;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk("IDAT", compressedData);
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve("public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, "pwa-192x192.png"), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, "pwa-512x512.png"), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, "pwa-maskable-512x512.png"), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, "favicon.ico"), createPng(64, 64, false));

console.log("Successfully generated PWA PNG icons in /public!");
