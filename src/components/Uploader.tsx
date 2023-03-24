import { Group } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconFileDislike, IconPhoto, IconUpload } from '@tabler/icons-react';
import { useSWRConfig } from 'swr';

interface UploaderProps {
  onSubmit?: (files: FileWithPath[]) => void;
}

function DropzoneContent() {
  return (
    <Group sx={{ pointerEvents: 'none' }}>
      <Dropzone.Accept>
        <IconUpload />
      </Dropzone.Accept>
      <Dropzone.Reject>
        <IconFileDislike />
      </Dropzone.Reject>
      <Dropzone.Idle>
        <IconPhoto />
      </Dropzone.Idle>
    </Group>
  );
}

async function onUpload(files: FileWithPath[]) {
  const formData = new FormData();
  files.forEach(file => formData.append('file', file));
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const body = (await response.json()) as { status: 'fail' | 'ok'; message: string };
  console.log('got result', body);
}

export function Uploader(_props: UploaderProps) {
  const { mutate } = useSWRConfig();

  return (
    <Dropzone
      accept={IMAGE_MIME_TYPE}
      onDrop={files => {
        console.log('accepted files', files);
        void onUpload(files).then(() => mutate('/api/uploads', undefined, { revalidate: true }));
      }}
      onReject={files => console.log('rejected files', files)}
      radius="md">
      <DropzoneContent />
    </Dropzone>
  );
}

export function UploaderFullscreen() {
  return (
    <Dropzone.FullScreen
      accept={IMAGE_MIME_TYPE}
      onDrop={files => console.log('accepted files', files)}
      onReject={files => console.log('rejected files', files)}
      radius="md">
      <DropzoneContent />
    </Dropzone.FullScreen>
  );
}
