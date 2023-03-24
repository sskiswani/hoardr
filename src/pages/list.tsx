import { Button } from '@mantine/core';
import type { Upload } from '@prisma/client';
import useSWRInfinite from 'swr/infinite';
import { UploadItem } from '~/components/UploadItem';

export default function List() {
  const {
    data,
    // isValidating, isLoading
    // mutate,
    size,
    setSize
  } = useSWRInfinite<Upload[]>((index, prevData) => {
    if (index === 0) {
      return `/api/file?max=${1}`;
    }

    const lastItem = prevData?.at(-1);
    if (!lastItem) return null;
    return `/api/file?max=${1}&cursor=${lastItem.id}`;
  });
  // const [cursor, setCursor] = useState<string>();
  // const uploads = useSWR<Upload[]>(`/api/file?max=1${cursor ? `&cursor=${cursor}` : ''}`);
  // const data = uploads.data;
  // const count = data?.length ?? 0;

  // useEffect(() => {
  //   const lastItem = data?.at(-1);
  //   if (lastItem) {
  //     setCursor(lastItem.id);
  //   }
  // }, [data]);

  return (
    <div>
      <Button onClick={() => void setSize(size + 1)}>More</Button>
      {data?.flat().map(item => (
        <UploadItem key={item.id} upload={item} />
      ))}
    </div>
  );
}
