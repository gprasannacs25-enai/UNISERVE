
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  // Basic user information
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  // User role
  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student'
  },

  // Student information
  usn: {
    type: String,
    uppercase: true,
    sparse: true
  },

  branch: {
    type: String
  },

  sem: {
    type: Number
  },

  // Staff and department information
  dept: {
    type: String
  },

  title: {
    type: String
  },

  // Account activation status
  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// Create User model
module.exports = mongoose.model('User', userSchema);
