const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const User = require('../models/User');
const data = require('./data.json');

const seed = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ravivarvichar';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing users so a fresh admin is always created
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Seed only the admin user. All other content (articles, partners,
    // events, testimonials, etc.) is added manually via the admin panel.
    const users = await User.create(data.users);
    console.log(`✅ ${users.length} admin user(s) created`);

    console.log('\n🎉 Seed completed successfully!');
    console.log(`📋 Admin login: ${data.users[0].email} / ${data.users[0].password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
