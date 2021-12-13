import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

import { ApolloProvider } from '@apollo/client';
import AuthContextProvider from '../src/context/AuthContextProvider';
import client from '../src/apollo/client';

import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
	emotionCache?: EmotionCache;
};

export default function MyApp(props: AppPropsWithLayout) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>My page</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<ApolloProvider client={client}>
				<AuthContextProvider>
					<ThemeProvider theme={theme}>
						{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
						<CssBaseline />
						{getLayout(<Component {...pageProps} />)}
					</ThemeProvider>
				</AuthContextProvider>
			</ApolloProvider>
		</CacheProvider>
	);
}
