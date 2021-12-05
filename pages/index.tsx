import Layout from '../components/Layout';

const HomePage = () =>
  (
    <Layout>
      <header>
        <h2>Welcome to Stoyko&apos;s Dossier</h2>
      </header>
      <section id='about-me'>
        <p>
          I&apos;m a web-developer, who builds full-scale projects, using
          {' '}
          <span
            id='node'
            className='underline'
          >
            Node.js
          </span>
          ,
          {' '}
          <span
            id='react'
            className='underline'
          >
            React.js
            {' '}
          </span>
          {' '}
          and
          {' '}
          <span
            id='other-tools'
            className='underline'
          >
            other tools
          </span>
          .
        </p>
      </section>
      <section id='intro-section'>
        <p>
          This website will be used as both a continious project and a ledger,
          where I can keep notes and present how I come up with new project
          ideas, the development process, deploying it and anything inbetween.
        </p>
      </section>
      <section id='projects'>
        <h3>
          Next entry in:
          {new Date().getFullYear()}
        </h3>

      </section>
    </Layout>
  );

export default HomePage;
