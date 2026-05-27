import sharp from 'sharp';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images');

function isDarkBackground(r, g, b) {
  return r <= 55 && g <= 60 && b <= 65;
}

function floodFillFromTransparency(data, width, height, isBackground) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const idx = (x, y) => y * width + x;
  const alpha = (i) => data[i * 4 + 3];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = idx(x, y);
    if (visited[i] || alpha(i) < 10) return;
    const px = i * 4;
    if (!isBackground(data[px], data[px + 1], data[px + 2])) return;
    visited[i] = 1;
    queue.push(i);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha(idx(x, y)) >= 10) continue;
      tryPush(x - 1, y);
      tryPush(x + 1, y);
      tryPush(x, y - 1);
      tryPush(x, y + 1);
    }
  }

  while (queue.length) {
    const i = queue.pop();
    const x = i % width;
    const y = (i - x) / width;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }

  for (let i = 0; i < width * height; i++) {
    if (visited[i]) {
      data[i * 4 + 3] = 0;
    }
  }
}

function lightenGreysForDarkBg(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isGrey = max - min < 30;
    const isCyan = g > 120 && b > 150 && r < 80;
    const isRed = r > 150 && g < 80 && b < 80;

    if (isGrey && max < 200 && !isCyan && !isRed) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
}

async function loadRaw(fileName) {
  return sharp(path.join(imagesDir, fileName)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

async function saveRaw(data, info, fileName) {
  const buffer = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(path.join(imagesDir, fileName), buffer);
  console.log(`Wrote ${fileName}`);
}

const source = await loadRaw('logo.png');
const logoData = Buffer.from(source.data);
floodFillFromTransparency(logoData, source.info.width, source.info.height, isDarkBackground);
await saveRaw(logoData, source.info, 'logo.png');

const lightData = Buffer.from(logoData);
lightenGreysForDarkBg(lightData);
await saveRaw(lightData, source.info, 'logo-light.png');
