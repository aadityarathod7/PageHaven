// server/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import your User model
const User = require('./models/userModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => { })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Admin details - you can customize these
const adminData = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',  // You should change this to a secure password
  role: 'admin'
};

// Create the admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email });

    if (adminExists) {
      return;
    }

    // Create new admin
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,  // Model will hash this via pre-save hook
      role: adminData.role
    });
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the function
createAdmin();