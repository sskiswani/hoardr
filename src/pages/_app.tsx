import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Hoardr</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <SWRConfig value={{ fetcher }}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
          <Component {...pageProps} />
        </MantineProvider>
      </SWRConfig>
    </>
  );
}
