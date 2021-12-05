import { FC } from 'react';

const Modal:FC = ({ children }) =>
  (
    <>
      <div id='modal'>
        <h2>This is a modal</h2>
        <p />
        <div />
        <div className='close'>X</div>
      </div>
      {children}
    </>
  );

export default Modal;
