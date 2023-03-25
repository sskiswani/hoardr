import { Container } from '@mantine/core';
import type { Upload } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ImageGrid } from '~/components/ImageGrid';
import { Uploader } from '~/components/Uploader';
import { useInvalidateCache } from '~/util/invalidate';

export default function Home() {
  const [filter, setFilter] = useState<string>();
  const uploads = useSWR<Upload[]>(filter ? `/api/file?filter=${filter}` : '/api/file');
  const data = uploads.data;
  const invalidate = useInvalidateCache(key => key === '/api/count' || (key as string).includes('filter'));

  const mutatator = useSWRMutation(
    '/api/file',
    (key, { arg: data }: { arg?: string[] }) => axios.delete(key, data ? { data } : undefined),
    { revalidate: true }
  );

  const onDelete = async (ids?: string[]) => {
    await mutatator.trigger(ids);
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
