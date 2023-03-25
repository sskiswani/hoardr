import { Button, Container, Text } from '@mantine/core';
import type { Upload } from '@prisma/client';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ImageGrid } from '~/components/ImageGrid';
import { Uploader } from '~/components/Uploader';
import logger from '~/util/logger';

export default function Home() {
  const mutatator = useSWRMutation('/api/file', key => fetch(key, { method: 'DELETE' }));

  const uploads = useSWR<Upload[]>('/api/file');
  const data = uploads.data;
  const count = data?.length ?? 0;

  const onDelete = async () => {
    const result = await mutatator.trigger();
    const data = await result?.json();
    logger.info('deletion count', data);
  };

  return (
    <main>
      <Button onClick={() => void onDelete()}>Delete</Button>
      <Container size="xs">
        <Uploader />
      </Container>
      <Text>Got data {count}</Text>
      <ImageGrid uploads={data ?? []} />
      <pre>{JSON.stringify(data ?? [], null, 2)}</pre>
    </main>
  );
}
