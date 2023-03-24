import type { ImageProps } from '@mantine/core';
import { Image } from '@mantine/core';
import type { Upload } from '@prisma/client';

interface UploadItemProps extends Omit<ImageProps, 'src'> {
  upload: Upload;
}

export function UploadItem({ upload: { id, name }, ...props }: UploadItemProps) {
  return <Image width={80} fit="contain" src={`/api/file/${id}`} alt={name} caption={name} {...props} />;
}
