import { useCallback } from 'react';
import type { ProcessOptions } from '../engine/types';
import { processImage } from '../engine/pipeline';

let workerInstance: Worker | null = null;

function getWorker(): Worker | null {
  if (typeof Worker === 'undefined') return null;
  if (!workerInstance) {
    try {
      workerInstance = new Worker(new URL('../engine/worker.ts', import.meta.url), {
        type: 'module',
      });
    } catch {
      return null;
    }
  }
  return workerInstance;
}

export function usePixelEngine() {
  const process = useCallback(
    async (imageData: ImageData, options: ProcessOptions): Promise<ImageData> => {
      const worker = getWorker();
      if (!worker) {
        // Fallback to main thread (e.g. in jsdom)
        return processImage(imageData, options);
      }

      return new Promise((resolve, reject) => {
        const handleMessage = (e: MessageEvent) => {
          worker.removeEventListener('message', handleMessage);
          if (e.data.error) {
            reject(new Error(e.data.error));
          } else {
            resolve(e.data.result);
          }
        };

        worker.addEventListener('message', handleMessage);
        worker.postMessage({ imageData, options }, [imageData.data.buffer]);
      });
    },
    []
  );

  return { process };
}
