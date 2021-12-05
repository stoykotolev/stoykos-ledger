import Head from 'next/head';

type LayoutPropsType = {
  children: React.ReactNode;
};

const siteTitle: string = 'A ledge of my previous projects and ideas.';

const Layout = ({ children }: LayoutPropsType) =>
  (
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
      <main className='container'>{children}</main>
    </>
  );

export default Layout;
