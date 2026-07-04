// One-time cleanup: remove old PageSection documents and fix visibility
// Run: node src/seed/cleanupSections.js
const mongoose = require('mongoose');
require('../config/env');
const PageSection = require('../models/PageSection');

const VALID_KEYS = ['hero', 'programs', 'research', 'partners', 'mediaMentions', 'testimonials'];

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete old documents not in valid keys
    const deleteResult = await PageSection.deleteMany({ key: { $nin: VALID_KEYS } });
    console.log(`Deleted ${deleteResult.deletedCount} old sections`);

    // Set all valid sections to visible: true
    const updateResult = await PageSection.updateMany(
      { key: { $in: VALID_KEYS } },
      { $set: { visible: true } }
    );
    console.log(`Updated ${updateResult.modifiedCount} sections to visible`);

    // Show remaining sections
    const remaining = await PageSection.find().sort('order').lean();
    console.log('\nRemaining sections:');
    remaining.forEach((s) => {
      console.log(`  ${s.key} → order: ${s.order}, visible: ${s.visible}`);
    });

    await mongoose.disconnect();
    console.log('\nCleanup complete!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

cleanup();
