import Head from 'next/head';
import React, { useState } from 'react';
import Loader from './loader';
import NextLink from './next-link';

type LayoutPropsType = {
  children: React.ReactNode;
  home?: boolean;
};

const siteTitle: string = 'A ledge of my previous projects and ideas.';

const Layout = ({ children, home }: LayoutPropsType) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <title>Stoyko&apos;s Dossier</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Learn how to build a personal website using Next.js'
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <div className='container'>
        {(isLoading && home) ? (
          <Loader setLoadingState={setIsLoading} />
        ) : (
          <>
            <main>{children}</main>
            {!home && (
              <div id='link-back'>
                <NextLink href='/'>Back to home</NextLink>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

Layout.defaultProps = {
  home: false
};

export default Layout;
