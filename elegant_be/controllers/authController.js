const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const sendMail = require('../utils/sendMail');

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    // const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const [insert] = await db.query(
      'INSERT INTO users (name, email, phone, password, is_verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, false]
    );

      const userId = insert.insertId;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await db.query(
      'INSERT INTO user_otps (user_id, otp, expires_at) VALUES (?, ?, ?)',
      [userId, otp, expiresAt]
    );
        await sendMail(email, 'Your OTP Code', `Your OTP is ${otp}`);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Step 1: Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(404).json({ message: 'User not found' });

    const user = users[0];

    // ✅ If user already verified, send direct response
    if (user.is_verified) {
      const alreadyVerifiedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_verified: true,
        created_at: user.created_at,
        updated_at: user.updated_at
      };

      return res.status(200).json({
        message: 'User already verified.',
        user: alreadyVerifiedUser
      });
    }

    // Step 2: Get latest OTP for that user
    const [otps] = await db.query(
      'SELECT * FROM user_otps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (!otps.length) {
      return res.status(400).json({ message: 'No OTP found. Please login again.' });
    }

    const otpData = otps[0];

    // Step 3: Compare OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Step 4: Check if OTP expired
    const now = new Date();
    const expiry = new Date(otpData.expires_at);
    if (now > expiry) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Step 5: Mark user as verified and clean up OTPs
    await db.query('UPDATE users SET is_verified = ? WHERE id = ?', [true, user.id]);
    await db.query('DELETE FROM user_otps WHERE user_id = ?', [user.id]);

    // Step 6: Prepare response with updated verified status
    const verifiedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      is_verified: true, // forcefully true after update
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.status(200).json({
      message: 'Email verified successfully! You can now login.',
      user: verifiedUser
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Something went wrong during OTP verification.' });
  }
};



exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // ✅ If already verified, return 200 with message & full user info
    if (user.is_verified) {
      return res.status(200).json({
        message: 'User already verified.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_verified: true,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.query(
      'INSERT INTO user_otps (user_id, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)',
      [user.id, otp, expiresAt]
    );

    await sendMail(email, 'Verify your email', `Your OTP is ${otp}`);

    res.status(200).json({
      message: 'OTP resent successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_verified: false,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error in resendOtp:', error);
    res.status(500).json({ message: 'Something went wrong while resending OTP' });
  }
};




exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

   if (!user.is_verified) {
      // Send info to frontend: "User not verified" + email so frontend can send OTP and redirect
      return res.status(200).json({
        success: true,
        message: 'User not verified. OTP required.',
        isActive: false,
        email: user.email
      });
    }
    const token = generateToken(user.id);

    await db.query('INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))', [user.id, token]);

    res.status(200).json({
      success: true,
      isActive: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not registered',
        data: null
      });
    }

    const userId = users[0].id;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins

    // Store OTP - update if already exists
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

    // Send OTP to email
    await sendMail(email, 'Reset Your Password', `Your OTP for password reset is ${otp}. This OTP will expire in 5 minutes.`);

    // Success response
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email.',
      data: {
        email,
        otpSent: true,
        expiresIn: 300 // in seconds (5 mins)
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
  const { email, otp } = req.body;

  try {
    // Step 1: Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Invalid email' });
    }

    const userId = users[0].id;

    // Step 2: Get latest OTP for this user
    const [rows] = await db.query(
      'SELECT otp, expires_at FROM user_otps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'No OTP found. Please request again.' });
    }

    const { otp: dbOtp, expires_at } = rows[0];

    // Step 3: Compare OTP
    if (dbOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Step 4: Check if OTP is expired
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
  const { email, newPassword } = req.body;

  try {
    // 1. Check if the user exists
    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Invalid email address' });
    }

    const userId = users[0].id;

    // 2. Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.',
      email: email,
    });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
