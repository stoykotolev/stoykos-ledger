import moment from 'moment';
import { GetStaticProps } from 'next';
import Card from '../components/Card';
import Layout from '../components/Layout';
import { getSortedPostsData } from '../lib/posts';
import { AllPostsDataType } from '../utils/types';

const HomePage = ({ allPostsData }: AllPostsDataType) => {
  const postDate = moment(allPostsData[0].date).add(14, 'days');

  return (
    <Layout home>
      <header>
        <h1>
          Welcome to Stoyko&apos;s Dossier
          <span>&#95;</span>
        </h1>
      </header>
      <section id='about-me'>
        <p>
          I&apos;m a web-developer, who builds full-scale projects, using
          {' '}
          <span id='node' className='underline'>
            Node.js
          </span>
          ,
          {' '}
          <span id='react' className='underline'>
            React.js
            {' '}
          </span>
          {' '}
          and
          {' '}
          <span id='other-tools' className='underline'>
            other tools
          </span>
          .
        </p>
      </section>
      <section id='intro-section'>
        <p>
          This website will be used as both a continious project and an archive,
          where I can keep notes and present the process of coming up with new
          project ideas, their development, deployment and anything inbetween.
        </p>
      </section>
      <section id='blog-posts'>
        <h3>
          Next entry
          {' '}
          {postDate.fromNow()}
        </h3>
        <section className='posts-grid'>
          {allPostsData.length
            && allPostsData?.map(({
              id, date, title, snippet
            }) =>
              (
                <Card
                  key={id}
                  id={id}
                  date={date}
                  title={title}
                  snippet={snippet}
                />
              ))}
        </section>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default HomePage;
