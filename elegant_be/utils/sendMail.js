const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendMail = async (to, subject, text, html = null, cc = [], bcc = []) => {
  const msg = {
    to,
    from: {
      email: process.env.FROM_EMAIL,        // ✅ Must be a verified sender in SendGrid
      name: process.env.FROM_NAME || 'No-Reply',
    },
    subject,
    text,
    ...(html && { html }),                   // include html only if provided
    ...(cc.length > 0 && { cc }),            // include cc only if array has emails
    ...(bcc.length > 0 && { bcc }),          // include bcc only if array has emails
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
