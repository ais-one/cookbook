// upload.ts — Multer helpers for memory and disk storage with sensible defaults

import type { Options } from 'multer';
import multer from 'multer';

/**
 * Returns a Multer instance configured for in-memory storage.
 * Defaults to 1 file and 500 KB limit. Pass `options` to override.
 *
 * @example
 * router.post('/upload', memoryUpload().single('file'), handler)
 */
const memoryUpload = (options?: Partial<Options>) =>
  multer(
    Object.assign(
      {
        storage: multer.memoryStorage(),
        limits: { files: 1, fileSize: 500000 },
      },
      options,
    ),
  );

/**
 * Returns a Multer instance configured for disk storage.
 * Defaults to 1 file and 8 MB limit. Pass `options` to override.
 *
 * @param folder - Destination directory for uploaded files.
 * @param options - Additional Multer options to merge.
 *
 * @example
 * router.post('/upload', storageUpload({ folder: 'uploads/' }).single('file'), handler)
 */
const storageUpload = ({ folder, options }: { folder: string; options?: Partial<Options> }) =>
  multer(
    Object.assign(
      {
        storage: multer.diskStorage({
          destination: (_req: unknown, _file: unknown, cb: (err: Error | null, dest: string) => void) =>
            cb(null, folder),
          filename: (_req: unknown, file: Express.Multer.File, cb: (err: Error | null, name: string) => void) =>
            cb(null, file.originalname),
        }),
        limits: { files: 1, fileSize: 8000000 },
      },
      options,
    ),
  );

export { memoryUpload, storageUpload };
