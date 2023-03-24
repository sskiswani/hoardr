import { Button, Text } from '@mantine/core';
import type { Upload } from '@prisma/client';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { UploadItem } from '~/components/UploadItem';
import { Uploader } from '~/components/Uploader';
import styles from '~/styles/Home.module.css';
import logger from '~/util/logger';

export default function Home() {
  const mutatator = useSWRMutation('/api/uploads', key => fetch(key, { method: 'DELETE' }));

  const uploads = useSWR<Upload[]>('/api/uploads');
  const data = uploads.data;
  const count = data?.length ?? 0;

  const onDelete = async () => {
    const result = await mutatator.trigger();
    const data = await result?.json();
    logger.info('deletion count', data);
  };

  return (
    <main className={styles.main}>
      <Button onClick={() => void onDelete()}>Delete</Button>
      <div className={styles.description}>
        <Uploader />
      </div>
      <Text>Got data {count}</Text>
      {data?.map(item => (
        <UploadItem key={item.id} upload={item} />
      ))}
      <pre>{JSON.stringify(data ?? [], null, 2)}</pre>
    </main>
  );
}
