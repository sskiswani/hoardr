import { glob } from 'glob';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import logger from './logger';

const staticDir = process.env.NEXT_PUBLIC_UPLOAD_DIR ?? 'static';
export const uploadDir = path.resolve(process.cwd(), staticDir);

export function getUploadPath(uploadName: string) {
  const fname = path.basename(uploadName);
  return path.join(uploadDir, fname);
}

function deleteFiles(deleteIds: string[]) {
  return glob(`${staticDir}/{${deleteIds.join(',')}}*`, { nodir: true });
}

export async function clearUploads(deleteIds?: string[]) {
  const files = await (deleteIds != null ? deleteFiles(deleteIds) : glob(`${staticDir}/*`));
  for (const file of files) {
    await rm(file);
    logger.info('deleted ', file);
  }
  return files;
}
