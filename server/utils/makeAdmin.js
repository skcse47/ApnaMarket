require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function makeAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    user.role = 'admin';
    await user.save();
    console.log('User updated to admin');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAdmin('admin2@example.com');
