const ContactForm = () =>
  (
    <form name='contact-form' method='POST' action='contact/?success=true'>
      <label htmlFor='name'>
        Name
        <input id='name' name='name' required type='text' />
      </label>
      <label htmlFor='company'>
        Company
        <input id='company' name='company' required type='text' />
      </label>
      <label htmlFor='email'>
        E-mail Address
        <input id='email' type='email' name='email' required />
      </label>
      <label htmlFor='message'>
        Message
        <textarea id='message' name='message' required />
      </label>
      <button type='submit'>Submit</button>
    </form>
  );

export default ContactForm;
