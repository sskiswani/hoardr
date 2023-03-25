import type { Arguments } from 'swr';
import { useSWRConfig } from 'swr';

export function useInvalidateCache(matcher?: (key?: Arguments) => boolean) {
  const { mutate } = useSWRConfig();
  return () => mutate(matcher ?? (_ => true), undefined, { revalidate: true });
}
