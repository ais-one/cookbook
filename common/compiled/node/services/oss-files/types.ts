// ─── OSS (Alibaba Cloud) uploader types ──────────────────────────────────────

export interface OSSUploaderOptions {
  signEndpoint: string;
  chunkSize?: number;
  maxConcurrent?: number;
}

export interface OSSUploadOpts {
  key?: string;
  onProgress?: (pct: number) => void;
  signal?: AbortSignal | null;
}

// ─── S3 uploader types ────────────────────────────────────────────────────────

export interface S3UploaderOptions {
  getSignedUrlEndpoint: string;
  chunkSize?: number;
  maxConcurrent?: number;
}

export interface S3UploadOpts {
  key?: string;
  onProgress?: (pct: number) => void;
  signal?: AbortSignal | null;
}
