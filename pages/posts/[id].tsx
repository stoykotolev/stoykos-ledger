import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getAllPostIds, getPostById } from '../../lib/posts';
import { PostDataType } from '../../utils/types';

const Post = ({ postData }:PostDataType) =>
  (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1>{postData.title}</h1>
        <p>
          {postData.firstParagraph}
        </p>
        <p>
          {postData.secondParagraph}
        </p>
        <p>
          {postData.thirdParagraph}
        </p>
      </article>
    </Layout>
  );

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostById(params.id as string);
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
