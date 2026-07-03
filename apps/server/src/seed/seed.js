const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Article = require('../models/Article');
const Program = require('../models/Program');
const Project = require('../models/Project');
const Partner = require('../models/Partner');
const Report = require('../models/Report');
const Entrepreneur = require('../models/Entrepreneur');
const SHG = require('../models/SHG');
const Mentor = require('../models/Mentor');
const Event = require('../models/Event');
const MediaItem = require('../models/MediaItem');
const Testimonial = require('../models/Testimonial');
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
      Program.deleteMany({}),
      Project.deleteMany({}),
      Partner.deleteMany({}),
      Report.deleteMany({}),
      Entrepreneur.deleteMany({}),
      SHG.deleteMany({}),
      Mentor.deleteMany({}),
      Event.deleteMany({}),
      MediaItem.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed users
    const users = await User.create(data.users);
    console.log(`✅ ${users.length} user(s) created`);

    // Seed programs
    const programs = await Program.create(data.programs);
    console.log(`✅ ${programs.length} program(s) created`);

    // Seed articles (link to first admin user)
    const articlesWithAuthor = data.articles.map((a) => ({
      ...a,
      author: users[0]._id,
    }));
    const articles = await Article.create(articlesWithAuthor);
    console.log(`✅ ${articles.length} article(s) created`);

    // Seed projects
    const projects = await Project.create(data.projects);
    console.log(`✅ ${projects.length} project(s) created`);

    // Seed partners
    const partners = await Partner.create(data.partners);
    console.log(`✅ ${partners.length} partner(s) created`);

    // Seed reports
    const reports = await Report.create(data.reports);
    console.log(`✅ ${reports.length} report(s) created`);

    // Seed entrepreneurs
    const entrepreneurs = await Entrepreneur.create(data.entrepreneurs);
    console.log(`✅ ${entrepreneurs.length} entrepreneur(s) created`);

    // Seed SHGs
    const shgs = await SHG.create(data.shgs);
    console.log(`✅ ${shgs.length} SHG(s) created`);

    // Seed mentors
    const mentors = await Mentor.create(data.mentors);
    console.log(`✅ ${mentors.length} mentor(s) created`);

    // Seed events
    const events = await Event.create(data.events);
    console.log(`✅ ${events.length} event(s) created`);

    // Seed media items
    const mediaItems = await MediaItem.create(data.mediaItems);
    console.log(`✅ ${mediaItems.length} media item(s) created`);

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
