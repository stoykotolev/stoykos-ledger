import Layout from '../components/layout';

const HomePage = () =>
  (
    <Layout>
      <header id='header-section' className='h1'>
        <h3>Welcome to</h3>
        <h1 className='page-title'>Stoyko&apos;s Ledger</h1>
      </header>
      <section id='intro-section'>
        <p>
          {/* <h2>My personal website.</h2> */}
          It will server as both a continious project and a ledger, where I can
          keep notes and present how I come up with project ideas, the process in
          building such a project, deploying it and anything inbetween.
        </p>
      </section>
      <section id='about-me'>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, fugit
          magni porro voluptatum iste totam deserunt voluptas, deleniti a itaque
          exercitationem. Necessitatibus eveniet repellat recusandae inventore
          voluptate voluptatem, possimus est!
        </p>
      </section>
      <section id='contact-me'>
        <p>
          If you want to share something, are in need of a developer or have an
          interesting idea in mind, hit me up. I&apos;ll be happy to hear from you.
        </p>
      </section>
    </Layout>
  );

export default HomePage;
