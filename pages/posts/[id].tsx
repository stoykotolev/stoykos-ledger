import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getAllPostIds, getPostById } from '../../lib/posts';
import { PostDataType } from '../../utils/types';

const Post = ({ postData }: PostDataType) =>
  (
    <Layout>
      <Head>
        <meta
          property='og:url'
          content={`https://stoykotolev.com/posts/${postData.id}`}
        />
        <meta property='og:type' content='article' />
        <meta property='og:description' content={postData.firstParagraph} />
        <meta property='og:title' content={postData.title} />

        <meta
          property='og:url'
          content={`https://stoykotolev.com/posts/${postData.id}`}
        />
        <title>{postData.title}</title>
      </Head>
      <article id='post'>
        <h1 className='post-title'>{postData.title}</h1>
        <section id='first-paragraph' className='paragraph'>
          <p>{postData.firstParagraph}</p>
        </section>
        <section id='second-paragraph' className='paragraph'>
          <p>{postData.secondParagraph}</p>
        </section>
        <section id='third-paragraph' className='paragraph'>
          <p>{postData.thirdParagraph}</p>
        </section>
        <section id='fourth-paragraph' className='paragraph'>
          <p>{postData.fourthParagraph}</p>
        </section>
        <section id='fifth-paragraph' className='paragraph'>
          <p>{postData.fifthParagraph}</p>
        </section>
        <section id='epilogue' className='paragraph'>
          <p>{postData.epilogue}</p>
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
