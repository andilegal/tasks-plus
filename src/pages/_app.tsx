import { Header } from '@/components';
import '../styles/globals.css'; // <-- aqui pode importar CSS global

import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/provider/toast-provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ToastProvider>
        <Layout>
          <Header />
          <Component {...pageProps} />
        </Layout>
      </ToastProvider>
    </SessionProvider>
  );
}

export default MyApp;
