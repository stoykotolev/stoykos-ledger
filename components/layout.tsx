import Head from 'next/head';
import Image from 'next/image';
import logo from '../public/img/stoykos-ledger-background.jpg';

type LayoutPropsType = {
  children: React.ReactNode;
};

const siteTitle: string = 'A ledge of my previous projects and ideas.';

const Layout = ({ children }: LayoutPropsType) =>
  (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Learn how to build a personal website using Next.js'
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <menu className='main-menu'>
        <Image src={logo} width={115} height={115} alt='The Logo' className='website-logo' />
      </menu>
      <main>{children}</main>
    </>
  );

export default Layout;
