// Aliyun OSS interface - https://github.com/ali-sdk/ali-oss
// suitable for files that are not large... limit to 10Mb file size

import crypto from 'node:crypto';
import OSS from 'ali-oss';

const { OSS_ACCESS_ID, OSS_ACCESS_KEY, OSS_REGION, OSS_BUCKET } = process.env;

const store =
  OSS_ACCESS_ID && OSS_ACCESS_KEY && OSS_REGION
    ? new OSS({
        region: OSS_REGION,
        accessKeyId: OSS_ACCESS_ID,
        accessKeySecret: OSS_ACCESS_KEY,
        bucket: OSS_BUCKET,
      })
    : null;

interface OssResult {
  status: number;
  statusMessage?: string;
}

interface CallbackConfig {
  callback_url?: string;
  body?: Record<string, unknown>;
}

/**
 * Get the total object count of a bucket.
 *
 * @param bucketName - Target bucket name. Defaults to the configured OSS_BUCKET.
 */
const countBucketObjects = async (bucketName: string | null = null): Promise<{ status: number; count: number }> => {
  try {
    const result = await store?.getBucketStat(bucketName ?? undefined);
    return { status: 200, count: result?.stat?.ObjectCount ?? 0 };
  } catch (e) {
    return { status: (e as { status: number }).status ?? 500, count: 0 };
  }
};

/**
 * List objects in the configured bucket.
 *
 * @param prefix - Key prefix filter.
 * @param maxKeys - Maximum number of keys to return.
 */
const listObjects = async ({
  prefix = '',
  maxKeys = 10,
}: {
  prefix?: string;
  maxKeys?: number;
} = {}): Promise<OssResult & { objects?: unknown[] }> => {
  try {
    const result = await store?.listV2({ prefix, 'max-keys': maxKeys });
    const { status, statusMessage } = result?.res ?? {};
    return { status: status ?? 200, statusMessage, objects: result?.objects };
  } catch (e) {
    return { status: 500, statusMessage: String(e) };
  }
};

/**
 * Upload an object to the configured bucket.
 *
 * @param key - Object key, e.g. `'folder/file.txt'`.
 * @param payload - File data as string, Buffer, or ReadableStream.
 */
const putObject = async (key: string, payload: string | Buffer | NodeJS.ReadableStream): Promise<OssResult> => {
  try {
    const result = await store?.put(key, payload);
    const { status, statusMessage } = result?.res ?? {};
    return { status: status ?? 200, statusMessage };
  } catch (e) {
    return { status: 500, statusMessage: String(e) };
  }
};

/**
 * Download an object from the configured bucket.
 *
 * @param key - Object key, e.g. `'folder/file.txt'`.
 */
const getObject = async (key: string): Promise<OssResult & { buffer?: Buffer }> => {
  try {
    const result = await store?.get(key);
    const { status, statusMessage } = result?.res ?? {};
    return { status: status ?? 200, statusMessage, buffer: result?.content };
  } catch (e) {
    return { status: 500, statusMessage: String(e) };
  }
};

/**
 * Delete multiple objects from the configured bucket.
 *
 * @param keys - Array of object keys to delete.
 */
const deleteObjects = async (keys: string[]): Promise<OssResult & { deleted?: unknown[] }> => {
  try {
    const result = await store?.deleteMulti(keys, {});
    const { status, statusMessage } = result?.res ?? {};
    return { status: status ?? 200, statusMessage, deleted: result?.deleted };
  } catch (e) {
    return { status: 500, statusMessage: String(e) };
  }
};

/**
 * Generate a pre-signed URL for direct client access.
 *
 * @param method - HTTP method: `'GET'` or `'PUT'`.
 * @param expires - Expiry in seconds.
 * @param key - Object key.
 * @param headers - Optional request headers.
 * @param additional - Optional additional signed headers.
 */
const getSignedUrl = async (
  method: string,
  expires: number,
  key: string,
  headers: Record<string, unknown> | null = null,
  additional: string[] | null = null,
): Promise<string> => {
  const signedUrl = await store?.signatureUrlV4(method, expires, headers ?? undefined, key, additional ?? undefined);
  return signedUrl ?? '';
};

/**
 * Generate a pre-signed upload URL for a client to PUT a file directly to OSS.
 *
 * @param directory - Target directory prefix in the bucket.
 * @param filename - Original filename (used to derive the stored name and extension).
 * @param contentType - MIME type of the file.
 * @param action - `'write'` (default) or `'read'`.
 * @param expiration - URL expiry in seconds. Defaults to 7200.
 * @param callbackConfig - Optional OSS callback config for write actions.
 */
const getUploadURL = async (
  directory: string,
  filename: string,
  contentType: string,
  action = 'write',
  expiration = 7200,
  callbackConfig?: CallbackConfig,
): Promise<{ url?: string; error?: string }> => {
  if (!action || !filename) return { error: 'filename and action required' };

  try {
    // biome-ignore lint/suspicious/noImplicitAnyLet: assigned conditionally below
    let url;

    if (action === 'write') {
      const arr = filename.split('.');
      arr[0] = crypto
        .createHash('sha256')
        .update(arr[0] + Date.now())
        .digest('hex');
      const newFilename = arr.join('.');
      const fullPath = directory ? `${directory}/${newFilename}` : newFilename;

      url = await store?.signatureUrl(fullPath, {
        expires: expiration,
        method: 'PUT',
        'Content-Type': contentType,
        callback: {
          url: callbackConfig?.callback_url,
          body: JSON.stringify({ ...callbackConfig?.body, filename, filepath: fullPath }),
          contentType: 'application/json',
        },
      });
    } else {
      url = await store?.signatureUrl(filename);
    }

    return { url };
  } catch (e) {
    return { error: String(e) };
  }
};

export { countBucketObjects, deleteObjects, getObject, getSignedUrl, getUploadURL, listObjects, putObject };
