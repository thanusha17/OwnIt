import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOTP } from '../utils/sendEmail.js';

dotenv.config()

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // 2. Check if user exists
    const [userRows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '2h' }
    );

    // 5. Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Check if user already exists
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user
    const [insertResult] = await db.promise().query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

     const newUser = {
      id: insertResult.insertId,
      name,
      email
    };

    // 4. Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 5. Send response with token and user
    res.status(201).json({
      message: 'User registered and logged in successfully!',
      token,
      user: newUser
    });


  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};



export const sendOtpToEmail = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Insert OTP
    await db.promise().query(
      'INSERT INTO user_otps (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent to your email', name, email, password });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};


export const verifyOtpAndRegister = async (req, res) => {
  const { name, email, password, otp } = req.body;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM user_otps WHERE email = ? ORDER BY id DESC LIMIT 1',
      [email]
    );

    if (rows.length === 0 || rows[0].otp !== otp)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    if (new Date(rows[0].expires_at) < new Date())
      return res.status(400).json({ message: 'OTP expired' });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("All good");
    const [result] = await db
      .promise()
      .query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        name,
        email,
        hashedPassword,
      ]);

    // Remove used OTP
    await db.promise().query('DELETE FROM user_otps WHERE email = ?', [email]);

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: 'Registered successfully!',
      token,
      user: {
        id: result.insertId,
        email,
        name,
      },
    });
  } catch (err) {
    console.error('OTP verification failed:', err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};