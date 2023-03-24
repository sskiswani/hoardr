import { Box, Group, Text } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhotoPlus, IconPhotoUp, IconPhotoX } from '@tabler/icons-react';
import { useSWRConfig } from 'swr';

interface UploaderProps {
  onSubmit?: (files: FileWithPath[]) => void;
}

function DropzoneContent() {
  return (
    <Group position="center" spacing="xl" sx={{ pointerEvents: 'none' }}>
      <Dropzone.Accept>
        <IconPhotoPlus size={32} />
      </Dropzone.Accept>
      <Dropzone.Reject>
        <IconPhotoX size={32} />
      </Dropzone.Reject>
      <Dropzone.Idle>
        <IconPhotoUp size={32} />
      </Dropzone.Idle>
      <Box>
        <Text inline color="dimmed" size="sm">
          <Dropzone.Accept>Begin upload</Dropzone.Accept>
          <Dropzone.Reject>Unrecognized file type.</Dropzone.Reject>
          <Dropzone.Idle>Drag images here or click to select them.</Dropzone.Idle>
        </Text>
      </Box>
    </Group>
  );
}

async function onUpload(files: FileWithPath[]) {
  const formData = new FormData();
  files.forEach(file => formData.append('file', file));
  const response = await fetch('/api/file', {
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
        void onUpload(files).then(() =>
          mutate(
            key => {
              return typeof key === 'string' && key.startsWith('/api/file');
            },
            undefined,
            { revalidate: true }
          )
        );
      }}
      onReject={files => console.log('rejected files', files)}>
      <DropzoneContent />
    </Dropzone>
  );
}

export function UploaderFullscreen() {
  return (
    <Dropzone.FullScreen
      accept={IMAGE_MIME_TYPE}
      onDrop={files => console.log('accepted files', files)}
      onReject={files => console.log('rejected files', files)}>
      <DropzoneContent />
    </Dropzone.FullScreen>
  );
}
