/**
 * S3 Signed URL Backend (Node.js / Express)
 *
 * Install deps:
 *   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner express
 *
 * Env vars required:
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME
 */

import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Request, Response } from 'express';
import express from 'express';

const app = express();
app.use(express.json());

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const BUCKET = process.env.S3_BUCKET_NAME;
const URL_EXPIRY = 3600; // signed URL valid for 1 hour

// ─── Single endpoint that handles all upload phases ──────────────────────────
// POST /api/s3/sign
// Body: { type, key, contentType?, size?, uploadId?, partNumber?, parts? }

app.post('/api/s3/sign', async (req: Request, res: Response) => {
  const { type, key, contentType, size, uploadId, partNumber, parts } = req.body;

  try {
    switch (type) {
      // ── 1. Single-file upload (≤5MB) ─────────────────────────────────────
      case 'single': {
        const command = new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          ContentType: contentType,
          ContentLength: size,
          // Optional: enforce public/private ACL, SSE, etc.
          // ServerSideEncryption: 'AES256',
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRY });
        const location = `https://${BUCKET}.s3.amazonaws.com/${key}`;
        return res.json({ signedUrl, location });
      }

      // ── 2. Initiate multipart upload ──────────────────────────────────────
      case 'initiate': {
        const command = new CreateMultipartUploadCommand({
          Bucket: BUCKET,
          Key: key,
          ContentType: contentType,
        });
        const response = await s3.send(command);
        return res.json({ uploadId: response.UploadId });
      }

      // ── 3. Sign an individual part ────────────────────────────────────────
      case 'part': {
        if (!uploadId || !partNumber) {
          return res.status(400).json({ error: 'uploadId and partNumber are required' });
        }
        const command = new UploadPartCommand({
          Bucket: BUCKET,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRY });
        return res.json({ signedUrl });
      }

      // ── 4. Complete multipart upload ──────────────────────────────────────
      case 'complete': {
        if (!uploadId || !parts?.length) {
          return res.status(400).json({ error: 'uploadId and parts[] are required' });
        }
        const command = new CompleteMultipartUploadCommand({
          Bucket: BUCKET,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts }, // [{ PartNumber, ETag }, ...]
        });
        const response = await s3.send(command);
        return res.json({ location: response.Location });
      }

      // ── 5. Abort multipart upload (cleanup on error/cancel) ───────────────
      case 'abort': {
        if (!uploadId) return res.status(400).json({ error: 'uploadId is required' });
        const command = new AbortMultipartUploadCommand({
          Bucket: BUCKET,
          Key: key,
          UploadId: uploadId,
        });
        await s3.send(command);
        return res.json({ success: true });
      }

      default:
        return res.status(400).json({ error: `Unknown type: ${type}` });
    }
  } catch (err) {
    const e = err as Error;
    logger.error('[S3 sign error]', e);
    res.status(500).json({ error: e.message });
  }
});
