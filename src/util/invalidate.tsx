import { useSWRConfig } from 'swr';

export function useInvalidateCache() {
  const { mutate } = useSWRConfig();
  return () => mutate(_ => true, undefined, { revalidate: true });
}
