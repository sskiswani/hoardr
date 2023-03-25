import { Container } from '@mantine/core';
import type { Upload } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ImageGrid } from '~/components/ImageGrid';
import { Uploader } from '~/components/Uploader';
import { useInvalidateCache } from '~/util/invalidate';
import logger from '~/util/logger';

export default function Home() {
  const invalidate = useInvalidateCache();
  const [filter, setFilter] = useState<string>();
  const uploads = useSWR<Upload[]>(filter ? `/api/file?filter=${filter}` : '/api/file');
  const data = uploads.data;

  const mutatator = useSWRMutation('/api/file', (key, { arg: data }: { arg?: string[] }) =>
    axios.delete(key, data ? { data } : undefined)
  );

  const onDelete = async (ids?: string[]) => {
    const result = await mutatator.trigger(ids);
    const data = result?.data;
    logger.info('deletion count', data);
    void invalidate();
  };

  return (
    <main>
      <Container mb="md" size="xs">
        <Uploader />
      </Container>
      <ImageGrid uploads={data ?? []} onDelete={ids => void onDelete(ids)} onSearch={value => setFilter(value)} />
    </main>
  );
}
