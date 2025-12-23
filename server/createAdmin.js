const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminEmail = 'admin@pepiniere.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', adminEmail);
      console.log('Use password: admin123 (if you created it with this script before)');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Pépinière',
      email: adminEmail,
      password: 'admin123', // Change this password!
      role: 'admin',
      phone: '0123456789'
    });

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Email:', adminEmail);
    console.log('Password: admin123');
    console.log('-----------------------------------');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
