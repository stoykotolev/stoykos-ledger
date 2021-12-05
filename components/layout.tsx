import Head from 'next/head';
import React, { useState } from 'react';
import NextLink from './NextLink';
import Loader from './Loader';

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
              <div>
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
