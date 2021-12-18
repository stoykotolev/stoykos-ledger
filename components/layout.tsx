import Head from 'next/head';
import React, { useState } from 'react';
import Loader from './Loader';
import NextLink from './NextLink';

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
          `
          }}
        />
        <title>Stoyko&apos;s Dossier</title>
        <meta
          name='description'
          content='My personal website, which will server as both a portfolio and a dossier, where I can store and show how I come up with project ideas, the process in building a project and deploying it and anything inbetween.'
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <div className='container'>
        {isLoading && home ? (
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
