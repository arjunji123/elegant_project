const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, text, html = null, cc = [], bcc = []) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL, // ✅ must be a verified sender
    subject,
    text,
    ...(html && { html }),            // include html if provided
    ...(cc.length > 0 && { cc }),     // include cc if array has emails
    ...(bcc.length > 0 && { bcc }),   // include bcc if array has emails
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent to', to);
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
    throw error;
  }
};

module.exports = sendMail;
