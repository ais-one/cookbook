// AWS S3 interface — mirrors ali.ts API surface
import crypto from 'node:crypto';
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

const { AWS_ACCESS_ID, AWS_ACCESS_KEY, AWS_REGION, AWS_BUCKET } = process.env;

const client =
  AWS_ACCESS_ID && AWS_ACCESS_KEY && AWS_REGION
    ? new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_ID,
          secretAccessKey: AWS_ACCESS_KEY,
        },
      })
    : null;

/**
 * Get the total object count of a bucket by paginating through all objects.
 *
 * @param bucketName - Target bucket name. Defaults to the configured AWS_BUCKET.
 */
const countBucketObjects = async (bucketName: string | null = null): Promise<{ status: number; count: number }> => {
  const bucket = bucketName ?? AWS_BUCKET;
  try {
    let count = 0;
    let continuationToken: string | undefined;
    do {
      const result = await client?.send(
        new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: continuationToken }),
      );
      count += result?.KeyCount ?? 0;
      continuationToken = result?.NextContinuationToken;
    } while (continuationToken);
    return { status: 200, count };
  } catch (e) {
    const status = e instanceof S3ServiceException ? (e.$metadata.httpStatusCode ?? 500) : 500;
    return { status, count: 0 };
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
} = {}): Promise<{ status: number; statusMessage?: string; objects?: unknown[] }> => {
  try {
    const result = await client?.send(
      new ListObjectsV2Command({ Bucket: AWS_BUCKET, Prefix: prefix, MaxKeys: maxKeys }),
    );
    return {
      status: 200,
      statusMessage: 'OK',
      objects: result?.Contents ?? [],
    };
  } catch (e) {
    const status = e instanceof S3ServiceException ? (e.$metadata.httpStatusCode ?? 500) : 500;
    return { status, statusMessage: String(e) };
  }
};

/**
 * Upload an object to the configured bucket.
 *
 * @param key - Object key, e.g. `'folder/file.txt'`.
 * @param payload - File data as string, Buffer, or ReadableStream.
 */
const putObject = async (
  key: string,
  payload: string | Buffer | NodeJS.ReadableStream,
): Promise<{ status: number; statusMessage?: string }> => {
  try {
    await client?.send(new PutObjectCommand({ Bucket: AWS_BUCKET, Key: key, Body: payload as Buffer }));
    return { status: 200, statusMessage: 'OK' };
  } catch (e) {
    const status = e instanceof S3ServiceException ? (e.$metadata.httpStatusCode ?? 500) : 500;
    return { status, statusMessage: String(e) };
  }
};

/**
 * Download an object from the configured bucket.
 *
 * @param key - Object key, e.g. `'folder/file.txt'`.
 */
const getObject = async (key: string): Promise<{ status: number; statusMessage?: string; buffer?: Buffer }> => {
  try {
    const result = await client?.send(new GetObjectCommand({ Bucket: AWS_BUCKET, Key: key }));
    const buffer = result?.Body ? Buffer.from(await result.Body.transformToByteArray()) : undefined;
    return { status: 200, statusMessage: 'OK', buffer };
  } catch (e) {
    const status = e instanceof S3ServiceException ? (e.$metadata.httpStatusCode ?? 500) : 500;
    return { status, statusMessage: String(e) };
  }
};

/**
 * Delete multiple objects from the configured bucket.
 *
 * @param keys - Array of object keys to delete.
 */
const deleteObjects = async (
  keys: string[],
): Promise<{ status: number; statusMessage?: string; deleted?: unknown[] }> => {
  try {
    const result = await client?.send(
      new DeleteObjectsCommand({
        Bucket: AWS_BUCKET,
        Delete: { Objects: keys.map(k => ({ Key: k })) },
      }),
    );
    return { status: 200, statusMessage: 'OK', deleted: result?.Deleted ?? [] };
  } catch (e) {
    const status = e instanceof S3ServiceException ? (e.$metadata.httpStatusCode ?? 500) : 500;
    return { status, statusMessage: String(e) };
  }
};

/**
 * Generate a pre-signed URL for direct client access.
 *
 * @param method - HTTP method: `'GET'` or `'PUT'`.
 * @param expires - Expiry in seconds.
 * @param key - Object key.
 */
const getSignedUrl = async (method: string, expires: number, key: string): Promise<string> => {
  if (!client) return '';
  const command =
    method.toUpperCase() === 'PUT'
      ? new PutObjectCommand({ Bucket: AWS_BUCKET, Key: key })
      : new GetObjectCommand({ Bucket: AWS_BUCKET, Key: key });
  return awsGetSignedUrl(client, command, { expiresIn: expires });
};

/**
 * Generate a pre-signed upload URL for a client to PUT a file directly to S3.
 *
 * @param directory - Target directory prefix in the bucket.
 * @param filename - Original filename (used to derive the stored name and extension).
 * @param contentType - MIME type of the file.
 * @param action - `'write'` (default) or `'read'`.
 * @param expiration - URL expiry in seconds. Defaults to 7200.
 */
const getUploadURL = async (
  directory: string,
  filename: string,
  contentType: string,
  action = 'write',
  expiration = 7200,
): Promise<{ url?: string; error?: string }> => {
  if (!action || !filename) return { error: 'filename and action required' };
  if (!client) return { error: 'S3 client not initialised — check AWS env vars' };

  try {
    let url: string;

    if (action === 'write') {
      const arr = filename.split('.');
      arr[0] = crypto
        .createHash('sha256')
        .update(arr[0] + Date.now())
        .digest('hex');
      const newFilename = arr.join('.');
      const fullPath = directory ? `${directory}/${newFilename}` : newFilename;

      url = await awsGetSignedUrl(
        client,
        new PutObjectCommand({ Bucket: AWS_BUCKET, Key: fullPath, ContentType: contentType }),
        { expiresIn: expiration },
      );
    } else {
      url = await awsGetSignedUrl(client, new GetObjectCommand({ Bucket: AWS_BUCKET, Key: filename }), {
        expiresIn: expiration,
      });
    }

    return { url };
  } catch (e) {
    return { error: String(e) };
  }
};

export { countBucketObjects, deleteObjects, getObject, getSignedUrl, getUploadURL, listObjects, putObject };
