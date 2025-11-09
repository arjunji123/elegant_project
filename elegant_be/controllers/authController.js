const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const sendMail = require('../utils/sendMail');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // Check if email already exists
    const [emailCheck] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (emailCheck.length) return res.status(400).json({ message: 'Email already registered' });

    // Check if phone already exists
    const [phoneCheck] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (phoneCheck.length) return res.status(400).json({ message: 'Mobile already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [insert] = await db.query(
      'INSERT INTO users (name, email, phone, password, is_verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, false]
    );
    const userId = insert.insertId;

    // === Mobile OTP (like login) ===
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await db.query(
      `INSERT INTO user_otps (user_id, otp, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)`,
      [userId, otp, expiresAt]
    );

    // Send OTP via Twilio (or any SMS provider)
    await client.messages.create({
      body: `Your registration OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    });

    // === Email verification ===
 const emailToken = crypto.randomBytes(32).toString('hex'); // unique token
    const emailExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await db.query(
      'INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, emailToken, emailExpires]
    );

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;

    // Send email in its own try-catch
    try {
     await sendMail(
  email,
  'Verify your email',
  '', 
  `<p>Hi ${name},</p>
   <p>Click below to verify your email:</p>
   <p><a href="${verifyLink}" target="_blank" style="color:blue;">Verify Email</a></p>`
);

      console.log('✅ Verification email sent');
    } catch (emailErr) {
      console.error('❌ Failed to send verification email:', emailErr.message);
    }

    // Respond success regardless of email sending
    res.status(201).json({
      success: true,
      message: 'User registered. OTP sent to mobile. Verification email attempted.',
      phone,
      email
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(404).json({ message: 'User not found' });

    const user = users[0];

    if (user.is_verified) {
      return res.status(200).json({ message: 'User already verified.', user });
    }

    // ✅ Direct check for default OTP
    if (otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // ✅ Directly mark as verified
    await db.query('UPDATE users SET is_verified = ? WHERE id = ?', [true, user.id]);
    await db.query('DELETE FROM user_otps WHERE user_id = ?', [user.id]);

    res.status(200).json({
      message: 'Email verified successfully! You can now login.',
      user: { ...user, is_verified: true }
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Something went wrong during OTP verification.' });
  }
};

// exports.resendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }

//     const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

//     if (!users.length) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = users[0];

//     // ✅ If already verified, return 200 with message & full user info
//     if (user.is_verified) {
//       return res.status(200).json({
//         message: 'User already verified.',
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           is_verified: true,
//           created_at: user.created_at,
//           updated_at: user.updated_at
//         }
//       });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//     await db.query(
//       'INSERT INTO user_otps (user_id, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)',
//       [user.id, otp, expiresAt]
//     );

//     await sendMail(email, 'Verify your email', `Your OTP is ${otp}`);

//     res.status(200).json({
//       message: 'OTP resent successfully',
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         is_verified: false,
//         created_at: user.created_at,
//         updated_at: user.updated_at
//       }
//     });
//   } catch (error) {
//     console.error('Error in resendOtp:', error);
//     res.status(500).json({ message: 'Something went wrong while resending OTP' });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
//     const user = rows[0];
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     // ✅ If not verified, block login
//     if (!user.is_verified) {
//       return res.status(403).json({
//         success: false,
//         message: 'User not verified. Please verify OTP before logging in.',
//         email: user.email
//       });
//     }

//     const token = generateToken(user.id);
//     await db.query(
//       'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
//       [user.id, token]
//     );

//     res.status(200).json({
//       success: true,
//       isActive: true,
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ success: false, message: 'Login failed' });
//   }
// };

exports.login = async (req, res) => {
  const { email, password, phone } = req.body;

  try {
    // ✅ CASE 1: Email + Password Login
    if (email && password) {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];
      if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' });

      if (!user.is_verified) {
        return res.status(403).json({
          success: false,
          message: 'User not verified. Please verify OTP first.',
          email: user.email
        });
      }

      const token = generateToken(user.id);
      await db.query(
        'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
        [user.id, token]
      );

      return res.json({
        success: true,
        mode: 'email_login',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    }

    // ✅ CASE 2: Mobile Only Login (OTP)
    if (phone) {
      // Check if user already exists
      const [rows] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
      let user = rows[0];

      // Auto register if not exists
      if (!user) {
        const [insert] = await db.query(
          `INSERT INTO users (name, email, phone, password, is_verified)
           VALUES (NULL, NULL, ?, NULL, false)`,
          [phone]
        );
        const [[newUser]] = await db.query('SELECT * FROM users WHERE id = ?', [insert.insertId]);
        user = newUser;
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

      await db.query(
        `INSERT INTO user_otps (user_id, otp, expires_at)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)`,
        [user.id, otp, expiresAt]
      );

      // Send OTP via Twilio
      await client.messages.create({
        body: `Your login OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`
      });

      return res.json({
        success: true,
        mode: 'mobile_otp',
        message: 'OTP sent to mobile',
        phone
      });
    }

    return res.status(400).json({ success: false, message: 'Provide email+password OR phone' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { phone } = req.body;

  try {
    // Check if user exists by phone
    const [users] = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not registered',
        data: null
      });
    }

    const userId = users[0].id;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Store OTP in DB
    await db.query(
      `
      INSERT INTO user_otps (user_id, otp, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      otp = VALUES(otp),
      expires_at = VALUES(expires_at),
      created_at = CURRENT_TIMESTAMP
      `,
      [userId, otp, expiresAt]
    );

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your password reset OTP is ${otp}. It will expire in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    });

    // Success response
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your mobile number.',
      data: {
        phone,
        otpSent: true,
        expiresIn: 300 // 5 minutes
      }
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      data: null
    });
  }
};

exports.verifyForgotOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Invalid phone number' });
    }

    const userId = users[0].id;

    // Get latest OTP for this user
    const [rows] = await db.query(
      'SELECT otp, expires_at FROM user_otps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'No OTP found. Please request again.' });
    }

    const { otp: dbOtp, expires_at } = rows[0];

    // Compare OTP
    if (dbOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    return res.status(200).json({ message: 'OTP verified' });

  } catch (error) {
    console.error('OTP Verify Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.resetPassword = async (req, res) => {
  const { phone, newPassword } = req.body;

  try {
    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Invalid phone number' });
    }

    const userId = users[0].id;

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.',
      phone: phone,
    });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyMobileOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE phone=?', [phone]);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Latest OTP fetch karo aur expired ones ko delete karo
    const [otps] = await db.query(
      'SELECT otp, expires_at FROM user_otps WHERE user_id=? ORDER BY created_at DESC',
      [user.id]
    );

    if (!otps.length) return res.status(400).json({ message: 'OTP not found' });

    const latestOtp = otps[0];

    // Purane OTP clear kar do (optional, cleanup)
    await db.query('DELETE FROM user_otps WHERE user_id=? AND id != ?', [user.id, latestOtp.id]);

    if (latestOtp.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date(latestOtp.expires_at) < new Date()) return res.status(400).json({ message: 'OTP expired' });

    // OTP verify ho gaya, user ko verified mark karo
    await db.query('UPDATE users SET is_verified=? WHERE id=?', [true, user.id]);

    // OTP table se remove kar do
    await db.query('DELETE FROM user_otps WHERE user_id=?', [user.id]);

    // Token generate
    const token = generateToken(user.id);
    await db.query(
      'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [user.id, token]
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ message: 'Verification failed' });
  }
};

exports.resendMobileOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    // ✅ 1. Check if user exists
    const [[user]] = await db.query('SELECT * FROM users WHERE phone=?', [phone]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ 2. Delete old OTPs (cleanup)
    await db.query('DELETE FROM user_otps WHERE user_id=?', [user.id]);

    // ✅ 3. Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await db.query(
      'INSERT INTO user_otps (user_id, otp, expires_at) VALUES (?, ?, ?)',
      [user.id, otp, expiresAt]
    );

    // ✅ 4. Send OTP via Twilio
    await client.messages.create({
      body: `Your new OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    });

    // ✅ 5. Response
    res.json({
      success: true,
      message: 'OTP resent successfully to your mobile',
      phone
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};

exports.contactUs = async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: 'Email and message are required' });
  }

  try {
    // Ye message aapke admin/support email par jayega
    const msg = {
      to: process.env.FROM_EMAIL,  // ✅ admin/support email (verified in SendGrid)
      from: process.env.ADMIN_EMAIL, // ✅ verified sender email (SendGrid me added)
      subject: "New Contact Us Message",
      text: `Message from: ${email}\n\n${message}`,
      html: `<p><strong>From:</strong> ${email}</p><p>${message}</p>`
    };

    await sgMail.send(msg);

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Contact form error:', err.response?.body || err.message);
    res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
  }
};
