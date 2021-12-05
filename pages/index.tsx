import { useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/modal';

const HomePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const showModal = ({ target }) => {
    switch (target.id) {
      case 'node':
        setModalIsOpen(!modalIsOpen);
        break;
      case 'react':
        setModalIsOpen(!modalIsOpen);
        break;
      case 'other-tools':
        setModalIsOpen(!modalIsOpen);
        break;
      default:
        break;
    }
  };

  return (
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
            role='button'
            tabIndex={0}
            className='underline'
            onClick={showModal}
            aria-hidden='true'
          >
            Node.js
          </span>
          ,
          {' '}
          <span
            id='react'
            role='button'
            tabIndex={-1}
            className='underline'
            onClick={showModal}
            aria-hidden='true'
          >
            React.js
            {' '}
          </span>
          {' '}
          and
          {' '}
          <span
            id='other-tools'
            role='button'
            aria-hidden='true'
            className='underline'
            onClick={showModal}
          >
            other tools
          </span>
          .
        </p>
        {modalIsOpen && (
          <Modal />
        )}
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
};

export default HomePage;
