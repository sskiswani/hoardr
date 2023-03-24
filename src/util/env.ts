import path from 'node:path';

export const uploadDir = path.resolve(process.cwd(), process.env.NEXT_PUBLIC_UPLOAD_DIR ?? 'static');

export function getUploadPath(uploadName: string) {
  const fname = path.basename(uploadName);
  return path.join(uploadDir, fname);
}
