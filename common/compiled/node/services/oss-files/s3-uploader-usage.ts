/**
 * Usage example — drop this in your frontend
 * Works with vanilla JS, React, Vue, etc.
 */
import S3Uploader from './s3-uploader-client.ts';

// ─── Setup ────────────────────────────────────────────────────────────────────

const uploader = new S3Uploader({
  getSignedUrlEndpoint: '/api/s3/sign', // your backend
  chunkSize: 10 * 1024 * 1024, // 10MB parts
  maxConcurrent: 3, // 3 parallel part uploads
});

// ─── Basic upload ─────────────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<void> {
  try {
    const result = await uploader.upload(file, {
      key: `uploads/${Date.now()}-${file.name}`, // custom S3 key (optional)
      onProgress: pct => {
        logger.info(`Upload progress: ${pct}%`);
        (document.getElementById('progress') as HTMLProgressElement).value = String(pct);
      },
    });

    logger.info('Upload complete!', result);
    // result = { key: 'uploads/...', location: 'https://bucket.s3.amazonaws.com/...' }
  } catch (err) {
    logger.error('Upload failed:', (err as Error).message);
  }
}

// ─── With cancellation support ────────────────────────────────────────────────

// biome-ignore lint/suspicious/noImplicitAnyLet: assigned in uploadWithCancel below
let controller;

async function uploadWithCancel(file: File): Promise<void> {
  controller = new AbortController();

  try {
    const result = await uploader.upload(file, {
      onProgress: pct => {
        logger.info(`${pct}%`);
      },
      signal: controller.signal,
    });
    logger.info('Done:', result);
  } catch (err) {
    const e = err as Error;
    if (e.name === 'AbortError') {
      logger.info('Upload cancelled by user');
      // Optionally call your backend to abort the multipart upload in S3
      // to avoid storage costs for incomplete uploads
    } else {
      logger.error('Error:', e);
    }
  }
}

function cancelUpload(): void {
  controller?.abort();
}

// ─── Wire up to a file input ──────────────────────────────────────────────────

document.getElementById('fileInput')?.addEventListener('change', e => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) uploadWithCancel(file);
});

document.getElementById('cancelBtn').addEventListener('click', cancelUpload);

/*
  Minimal HTML to go with this:

  <input type="file" id="fileInput" />
  <progress id="progress" max="100" value="0"></progress>
  <button id="cancelBtn">Cancel</button>
*/
