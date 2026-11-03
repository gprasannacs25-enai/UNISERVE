
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================
// ADMIN-ONLY ACCESS
// ==========================================

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

// Allowed departments
const allowedDepartments = [
  'exam',
  'accounts',
  'library',
  'hostel',
  'placement',
  'estate',
  'academics',
  'students',
  'hod-cse'
];

// ==========================================
// 1. GET ALL USERS
// GET /api/admin/users
// ==========================================

router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Fetch users error:', error);

    res.status(500).json({
      message: 'Unable to fetch users.'
    });
  }
});

// ==========================================
// 2. CREATE STAFF ACCOUNT
// POST /api/admin/staff
// ==========================================

router.post('/staff', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, dept, title } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !dept) {
      return res.status(400).json({
        message: 'Please provide name, email, password and department.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters.'
      });
    }

    if (!allowedDepartments.includes(dept)) {
      return res.status(400).json({
        message: 'Please select a valid department.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const staff = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'staff',
      dept,
      title: title?.trim() || 'Staff',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Staff account created successfully.',
      user: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        dept: staff.dept,
        title: staff.title,
        isActive: staff.isActive
      }
    });

  } catch (error) {
    console.error('Create staff error:', error);

    res.status(500).json({
      message: 'Unable to create staff account.'
    });
  }
});

// ==========================================
// 3. EDIT STAFF DETAILS
// PATCH /api/admin/staff/:id
// ==========================================

router.patch('/staff/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, dept, title } = req.body;

    const staff = await User.findOne({
      _id: req.params.id,
      role: 'staff'
    });

    if (!staff) {
      return res.status(404).json({
        message: 'Staff account not found.'
      });
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          message: 'Staff name cannot be empty.'
        });
      }

      staff.name = name.trim();
    }

    if (dept !== undefined) {
      if (!allowedDepartments.includes(dept)) {
        return res.status(400).json({
          message: 'Please select a valid department.'
        });
      }

      staff.dept = dept;
    }

    if (title !== undefined) {
      if (typeof title !== 'string') {
        return res.status(400).json({
          message: 'Invalid job title.'
        });
      }

      staff.title = title.trim();
    }

    await staff.save();

    res.json({
      success: true,
      message: 'Staff details updated successfully.',
      user: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        dept: staff.dept,
        title: staff.title,
        isActive: staff.isActive
      }
    });

  } catch (error) {
    console.error('Update staff error:', error);

    res.status(500).json({
      message: 'Unable to update staff details.'
    });
  }
});

// ==========================================
// 4. DEACTIVATE OR REACTIVATE STAFF
// PATCH /api/admin/staff/:id/status
// ==========================================

router.patch('/staff/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        message: 'Please provide a valid account status.'
      });
    }

    const staff = await User.findOne({
      _id: req.params.id,
      role: 'staff'
    });

    if (!staff) {
      return res.status(404).json({
        message: 'Staff account not found.'
      });
    }

    staff.isActive = isActive;

    await staff.save();

    res.json({
      success: true,
      message: isActive
        ? 'Staff account reactivated successfully.'
        : 'Staff account deactivated successfully.',
      user: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        dept: staff.dept,
        isActive: staff.isActive
      }
    });

  } catch (error) {
    console.error('Staff status update error:', error);

    res.status(500).json({
      message: 'Unable to update staff account status.'
    });
  }
});

module.exports = router;
