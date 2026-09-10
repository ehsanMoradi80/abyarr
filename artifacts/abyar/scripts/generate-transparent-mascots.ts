import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

type Asset = {
  input: string;
  output: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const assets: Asset[] = [
  {
    input: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_happy_1788352192771.jpg'),
    output: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_happy_1788352192771.png'),
  },
  {
    input: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_missyou_1788352208455.jpg'),
    output: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_missyou_1788352208455.png'),
  },
  {
    input: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_celebrate_1788352221766.jpg'),
    output: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_celebrate_1788352221766.png'),
  },
  {
    input: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_sad_1788352236506.jpg'),
    output: path.join(rootDir, 'src', 'assets', 'images', 'noosh_mascot_sad_1788352236506.png'),
  },
];

function isWhiteBackground(r: number, g: number, b: number, a: number, threshold = 248) {
  return a > 0 && r >= threshold && g >= threshold && b >= threshold;
}

async function removeBackground(input: string, output: string) {
  const image = await Jimp.read(input);
  const { width, height, data } = image.bitmap;
  const totalPixels = width * height;
  const background = new Uint8Array(totalPixels);
  const visited = new Uint8Array(totalPixels);
  const queue: number[] = [];

  const enqueue = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;

    const offset = index * 4;
    if (!isWhiteBackground(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])) {
      return;
    }

    visited[index] = 1;
    background[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (queue.length > 0) {
    const index = queue.pop() as number;
    const x = index % width;
    const y = Math.floor(index / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  for (let index = 0; index < totalPixels; index += 1) {
    if (background[index]) {
      data[index * 4 + 3] = 0;
    }
  }

  await mkdir(path.dirname(output), { recursive: true });
  await image.write(output);
}

async function main() {
  for (const asset of assets) {
    await removeBackground(asset.input, asset.output);
    console.log(`wrote ${path.relative(rootDir, asset.output)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
