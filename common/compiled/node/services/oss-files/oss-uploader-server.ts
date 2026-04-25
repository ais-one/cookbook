/**
 * Alibaba Cloud OSS — Signed URL Backend (Node.js / Express)
 * Uses the AWS SDK v3 pointed at OSS's S3-compatible endpoint.
 *
 * Install:
 *   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner express
 *
 * Required env vars:
 *   OSS_REGION          e.g. oss-ap-southeast-1
 *   OSS_BUCKET          your bucket name
 *   OSS_ACCESS_KEY_ID   Alibaba RAM user AccessKey ID
 *   OSS_ACCESS_KEY_SECRET
 *
 * OSS S3-compatible endpoint format:
 *   https://<region>.aliyuncs.com          (global/internal)
 *   https://<region>.aliyuncs.com          (use forcePathStyle: false — virtual-hosted default)
 *
 * Compatibility notes:
 *   - OSS supports Signature V4 (same as S3) via the S3-compatible API
 *   - Use forcePathStyle: false (virtual-hosted style) — OSS prefers bucket in hostname
 *   - OSS presigned URLs use x-oss-* headers, but the S3 SDK generates x-amz-* — this is
 *     fine because OSS accepts both via the S3-compat layer
 *   - ETag exposure in CORS must be configured on the OSS bucket (see notes at bottom)
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

// ─── OSS Client via S3-compatible endpoint ────────────────────────────────────

const REGION = process.env.OSS_REGION; // e.g. 'oss-ap-southeast-1'
const BUCKET = process.env.OSS_BUCKET;
const URL_TTL = 3600; // signed URL valid for 1 hour

if (!REGION || !BUCKET) {
  throw new Error('OSS_REGION and OSS_BUCKET env vars are required');
}

const ossClient = new S3Client({
  // OSS S3-compatible endpoint — region subdomain, no bucket prefix here
  endpoint: `https://${REGION}.aliyuncs.com`,

  region: REGION,

  // Virtual-hosted style: bucket is placed in the hostname (recommended for OSS)
  // e.g. https://my-bucket.oss-ap-southeast-1.aliyuncs.com/object-key
  forcePathStyle: false,

  credentials: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.OSS_ACCESS_KEY_SECRET ?? '',
  },
});

// ─── Single endpoint handling all upload lifecycle phases ─────────────────────
// POST /api/oss/sign
// Body: { type, key, contentType?, size?, uploadId?, partNumber?, parts? }

app.post('/api/oss/sign', async (req: Request, res: Response) => {
  const { type, key, contentType, size, uploadId, partNumber, parts } = req.body;

  if (!key) return res.status(400).json({ error: 'key is required' });

  try {
    switch (type) {
      // ── 1. Single PUT (≤5MB) ───────────────────────────────────────────────
      case 'single': {
        const cmd = new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          ContentType: contentType || 'application/octet-stream',
          ContentLength: size,
        });
        const signedUrl = await getSignedUrl(ossClient, cmd, { expiresIn: URL_TTL });

        // OSS virtual-hosted URL for the completed object
        const location = `https://${BUCKET}.${REGION}.aliyuncs.com/${key}`;
        return res.json({ signedUrl, location });
      }

      // ── 2. Initiate multipart ──────────────────────────────────────────────
      case 'initiate': {
        const cmd = new CreateMultipartUploadCommand({
          Bucket: BUCKET,
          Key: key,
          ContentType: contentType || 'application/octet-stream',
        });
        const response = await ossClient.send(cmd);
        return res.json({ uploadId: response.UploadId });
      }

      // ── 3. Sign a part URL ─────────────────────────────────────────────────
      case 'part': {
        if (!uploadId || !partNumber) {
          return res.status(400).json({ error: 'uploadId and partNumber are required' });
        }
        const cmd = new UploadPartCommand({
          Bucket: BUCKET,
          Key: key,
          UploadId: uploadId,
          PartNumber: Number(partNumber),
        });
        const signedUrl = await getSignedUrl(ossClient, cmd, { expiresIn: URL_TTL });
        return res.json({ signedUrl });
      }

      // ── 4. Complete multipart ──────────────────────────────────────────────
      case 'complete': {
        if (!uploadId || !Array.isArray(parts) || parts.length === 0) {
          return res.status(400).json({ error: 'uploadId and parts[] are required' });
        }
        const cmd = new CompleteMultipartUploadCommand({
          Bucket: BUCKET,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            // OSS is strict: parts must be sorted by PartNumber
            Parts: parts
              .slice()
              .sort((a, b) => a.PartNumber - b.PartNumber)
              .map(({ PartNumber, ETag }) => ({ PartNumber, ETag })),
          },
        });
        const response = await ossClient.send(cmd);
        const location = response.Location || `https://${BUCKET}.${REGION}.aliyuncs.com/${key}`;
        return res.json({ location });
      }

      // ── 5. Abort multipart (clean up on cancel/error) ──────────────────────
      case 'abort': {
        if (!uploadId) return res.status(400).json({ error: 'uploadId is required' });
        const cmd = new AbortMultipartUploadCommand({
          Bucket: BUCKET,
          Key: key,
          UploadId: uploadId,
        });
        await ossClient.send(cmd);
        return res.json({ success: true });
      }

      default:
        return res.status(400).json({ error: `Unknown type: "${type}"` });
    }
  } catch (err) {
    const e = err as Error;
    logger.error('[OSS sign error]', e);
    res.status(500).json({ error: e.message });
  }
});

/*
 * ─── OSS Bucket CORS Configuration (required) ────────────────────────────────
 *
 * In the Alibaba Cloud OSS console → Bucket → Data Security → CORS:
 *
 * Rule:
 *   Allowed Origins:   https://your-frontend-domain.com  (or * for dev)
 *   Allowed Methods:   PUT
 *   Allowed Headers:   *
 *   Exposed Headers:   ETag                  ← CRITICAL for multipart complete
 *   Max Age (seconds): 3600
 *
 * Without exposing ETag, the browser cannot read it from the PUT response
 * and multipart complete will fail.
 *
 * ─── OSS RAM Policy (minimum permissions for the signing user) ───────────────
 *
 * {
 *   "Statement": [{
 *     "Effect": "Allow",
 *     "Action": [
 *       "oss:PutObject",
 *       "oss:InitiateMultipartUpload",
 *       "oss:UploadPart",
 *       "oss:CompleteMultipartUpload",
 *       "oss:AbortMultipartUpload"
 *     ],
 *     "Resource": [
 *       "acs:oss:*:*:your-bucket-name",
 *       "acs:oss:*:*:your-bucket-name/*"
 *     ]
 *   }]
 * }
 */
