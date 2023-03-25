import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { Navbar } from '~/components/Navbar';
import '~/fonts';

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Hoardr</title>
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>
      <SWRConfig value={{ fetcher }}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
          <Navbar />
          <Component {...pageProps} />
        </MantineProvider>
      </SWRConfig>
    </>
  );
}
