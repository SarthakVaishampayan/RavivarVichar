const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Article = require('../models/Article');
const Partner = require('../models/Partner');
const Event = require('../models/Event');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');
const ContactMessage = require('../models/ContactMessage');
const data = require('./data.json');

const seed = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ravivarvichar';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear all existing data
    await Promise.all([
      User.deleteMany({}),
      Article.deleteMany({}),
      Partner.deleteMany({}),
      Event.deleteMany({}),
      Testimonial.deleteMany({}),
      Newsletter.deleteMany({}),
      ContactMessage.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed users
    const users = await User.create(data.users);
    console.log(`✅ ${users.length} user(s) created`);

    // Seed articles (link to first admin user)
    const articlesWithAuthor = data.articles.map((a) => ({
      ...a,
      author: users[0]._id,
    }));
    const articles = await Article.create(articlesWithAuthor);
    console.log(`✅ ${articles.length} article(s) created`);

    // Seed partners
    const partners = await Partner.create(data.partners);
    console.log(`✅ ${partners.length} partner(s) created`);

    // Seed events
    const events = await Event.create(data.events);
    console.log(`✅ ${events.length} event(s) created`);

    // Seed testimonials
    const testimonials = await Testimonial.create(data.testimonials);
    console.log(`✅ ${testimonials.length} testimonial(s) created`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('📋 Admin login: admin@ravivarvichar.org / Admin@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
