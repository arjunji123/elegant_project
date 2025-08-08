const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, text) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL, // must be a verified sender
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendMail;
