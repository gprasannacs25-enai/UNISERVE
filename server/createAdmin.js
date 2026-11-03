
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'admin@bmsce.ac.in';
    const password = 'Admin@12345';

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin account already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: 'UniServe Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      title: 'System Administrator',
    });

    console.log('Admin created successfully!');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);

  } catch (error) {
    console.error('Admin creation error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
