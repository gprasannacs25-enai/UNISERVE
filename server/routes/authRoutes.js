
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ==========================================
// STUDENT REGISTRATION
// POST /api/auth/register
// ==========================================

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, usn, branch, sem } = req.body;

    if (!name || !email || !password || !usn) {
      return res.status(400).json({
        message: 'Please fill all required fields.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUSN = usn.trim().toUpperCase();

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { usn: normalizedUSN }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email or USN is already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      usn: normalizedUSN,
      branch,
      sem,
      role: 'student',
      isActive: true
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        role: user.role,
        branch: user.branch,
        sem: user.sem
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      message: 'Registration failed.'
    });
  }
});

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const identifier = email.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { usn: identifier.toUpperCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    // Check whether account is active
    if (user.isActive === false) {
      return res.status(403).json({
        message: 'Your account has been deactivated. Please contact the administrator.'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        role: user.role,
        branch: user.branch,
        sem: user.sem,
        dept: user.dept,
        title: user.title
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Login failed.'
    });
  }
});

module.exports = router;
