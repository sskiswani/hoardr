import { Button, Text } from '@mantine/core';
import type { Upload } from '@prisma/client';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Uploader } from '~/components/Uploader';
import styles from '~/styles/Home.module.css';
import logger from '~/util/logger';

function ShowUpload({ upload, ...props }: Omit<ImageProps, 'alt' | 'src'> & { upload: Upload }) {
  const src = upload.path.split(process.env.NEXT_PUBLIC_UPLOAD_DIR ?? 'public').pop();
  return <>{src && <Image src={src} {...props} alt={upload.name} />}</>;
}

export default function Home() {
  const mutatator = useSWRMutation('/api/uploads', key => fetch(key, { method: 'DELETE' }));

  const uploads = useSWR<Upload[]>('/api/uploads');
  const data = uploads.data;
  const count = data?.length ?? 0;

  const onDelete = async () => {
    const result = await mutatator.trigger();
    // const result = await fetch('/api/uploads', { method: 'DELETE' });
    const data = await result?.json();
    logger.info('got result', data);
  };

  return (
    <main className={styles.main}>
      <Button onClick={() => void onDelete()}>Delete</Button>
      <div className={styles.description}>
        <Uploader />
      </div>
      <Text>Got data {count}</Text>
      <pre>{JSON.stringify(data ?? [], null, 2)}</pre>
      {data?.map(item => (
        <ShowUpload key={item.id} upload={item} width={200} height={200} />
      ))}
    </main>
  );
}
