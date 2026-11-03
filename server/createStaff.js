
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createStaff() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'staff@uniserve.com';
    const password = 'Staff@12345';

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('This email already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const staff = await User.create({
      name: 'Estate Staff',
      email,
      password: hashedPassword,
      role: 'staff',
      dept: 'estate',
      title: 'Estate & Maintenance Staff',
    });

    console.log('Staff account created successfully!');
    console.log('Email:', staff.email);
    console.log('Role:', staff.role);
    console.log('Department:', staff.dept);

  } catch (error) {
    console.error('Error creating staff:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createStaff();
