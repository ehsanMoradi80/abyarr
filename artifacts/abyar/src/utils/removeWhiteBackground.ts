type RemoveWhiteBackgroundOptions = {
  backgroundThreshold?: number;
};

const imageCache = new Map<string, Promise<string>>();

function isBackgroundPixel(r: number, g: number, b: number, a: number, threshold: number) {
  return a > 0 && r >= threshold && g >= threshold && b >= threshold;
}

function keyFor(src: string, options: RemoveWhiteBackgroundOptions) {
  return `${src}::${options.backgroundThreshold ?? 248}`;
}

export function removeWhiteBackground(
  src: string,
  options: RemoveWhiteBackgroundOptions = {},
): Promise<string> {
  const cacheKey = keyFor(src, options);
  const cached = imageCache.get(cacheKey);
  if (cached) return cached;

  const promise = new Promise<string>((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof Image === 'undefined') {
      resolve(src);
      return;
    }

    const threshold = options.backgroundThreshold ?? 248;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
          resolve(src);
          return;
        }

        context.drawImage(image, 0, 0);
        const { width, height } = canvas;
        const imageData = context.getImageData(0, 0, width, height);
        const { data } = imageData;

        const totalPixels = width * height;
        const background = new Uint8Array(totalPixels);
        const visited = new Uint8Array(totalPixels);
        const queue: number[] = [];

        const enqueue = (x: number, y: number) => {
          if (x < 0 || y < 0 || x >= width || y >= height) return;
          const pixelIndex = y * width + x;
          if (visited[pixelIndex]) return;

          const offset = pixelIndex * 4;
          if (!isBackgroundPixel(data[offset], data[offset + 1], data[offset + 2], data[offset + 3], threshold)) {
            return;
          }

          visited[pixelIndex] = 1;
          background[pixelIndex] = 1;
          queue.push(pixelIndex);
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
          const pixelIndex = queue.pop() as number;
          const x = pixelIndex % width;
          const y = Math.floor(pixelIndex / width);

          enqueue(x + 1, y);
          enqueue(x - 1, y);
          enqueue(x, y + 1);
          enqueue(x, y - 1);
        }

        for (let pixelIndex = 0; pixelIndex < totalPixels; pixelIndex += 1) {
          if (!background[pixelIndex]) continue;
          data[pixelIndex * 4 + 3] = 0;
        }

        context.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        resolve(src);
      }
    };

    image.onerror = () => resolve(src);
    image.src = src;
  }).catch(() => src);

  imageCache.set(cacheKey, promise);
  return promise;
}
