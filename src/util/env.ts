import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import logger from './logger';

export const uploadDir = path.resolve(process.cwd(), process.env.NEXT_PUBLIC_UPLOAD_DIR ?? 'static');

export function getUploadPath(name: string) {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
    logger.info('created', uploadDir);
  }

  // const fname = path.basename(pathname);
  // return path.join(rootDir, fname);
  return path.join(uploadDir, name);
}
