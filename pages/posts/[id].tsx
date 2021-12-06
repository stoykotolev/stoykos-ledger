import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/layout';
import { getAllPostIds, getPostById } from '../../lib/posts';
import { PostDataType } from '../../utils/types';

const Post = ({ postData }:PostDataType) =>
  (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article id='post'>
        <h1 className='post-title'>{postData.title}</h1>
        <section id='first-paragraph' className='paragraph'>
          <p>
            {postData.firstParagraph}
          </p>
        </section>
        <section id='second-paragraph' className='paragraph'>
          <p>
            {postData.secondParagraph}
          </p>
        </section>
        <section id='third-paragraph' className='paragraph'>
          <p>
            {postData.thirdParagraph}
          </p>
        </section>
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
