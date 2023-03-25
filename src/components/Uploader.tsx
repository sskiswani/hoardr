import { Box, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhotoPlus, IconPhotoUp, IconPhotoX } from '@tabler/icons-react';
import { useInvalidateCache } from '~/util/invalidate';
import logger from '~/util/logger';

interface UploaderProps {
  onSubmit?: (files: FileWithPath[]) => void;
}

function DropzoneContent() {
  const theme = useMantineTheme();
  return (
    <Box sx={{ pointerEvents: 'none' }}>
      <Group position="center" spacing="xl" sx={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconPhotoPlus color={theme.colors.green[5]} size={50} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconPhotoX color={theme.colors.red[5]} size={50} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhotoUp size={50} />
        </Dropzone.Idle>
      </Group>
      <Stack align="center" mb="xl" mt="lg" spacing="xs">
        <Text fw={500} size="lg">
          <Dropzone.Idle>Upload image(s)</Dropzone.Idle>
          <Dropzone.Accept>Begin upload</Dropzone.Accept>
          <Dropzone.Reject>Files Not Supported</Dropzone.Reject>
        </Text>
        <Text inline color="dimmed" size="sm">
          <Dropzone.Idle>Drop images here to upload them or click to open a file browser.</Dropzone.Idle>
          <Dropzone.Accept>Begin upload</Dropzone.Accept>
          <Dropzone.Reject>Files either contain unrecognized images or exceed the max size.</Dropzone.Reject>
        </Text>
      </Stack>
    </Box>
  );
}

async function onUpload(files: FileWithPath[]) {
  const formData = new FormData();
  files.forEach(file => formData.append('file', file));
  return await fetch('/api/upload', { method: 'POST', body: formData });
}

export function Uploader(_props: UploaderProps) {
  const invalidate = useInvalidateCache();

  return (
    <Dropzone
      accept={IMAGE_MIME_TYPE}
      onDrop={files => {
        void onUpload(files).then(() => invalidate());
      }}
      onReject={files => logger.info('rejected files', files)}>
      <DropzoneContent />
    </Dropzone>
  );
}
