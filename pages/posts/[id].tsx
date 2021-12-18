import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import { PostDataType } from '../../utils/types';

const Post = ({ postData }: PostDataType) =>
  (
    <Layout>
      <Head>
        <meta
          property='og:url'
          content={`https://stoykotolev.com/posts/${postData.title}`}
        />
        <meta property='og:type' content='article' />
        <meta property='og:description' content={postData.contentHtml} />
        <meta property='og:title' content={postData.title} />

        <meta
          property='og:url'
          content={`https://stoykotolev.com/posts/${postData.title}`}
        />
        <title>{postData.title}</title>
      </Head>
      <article id='post'>
        <h1 className='post-title'>{postData.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  };
};
export default Post;
