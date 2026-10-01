/**
 * Fix Article Dates and Slugs Migration Script
 * 
 * 1. Repairs invalid publishedAt dates (e.g. year 0002 -> 2026) that trigger GSC sitemap errors.
 * 2. Cleans up malformed slugs with spaces/trailing whitespace that cause 404s.
 * 
 * Usage:
 *   node scripts/fix-article-dates-and-slugs.js
 *   MONGO_URI="mongodb://..." node scripts/fix-article-dates-and-slugs.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../apps/server/.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ravivarvichar';

const generateSlug = (text = '') => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

async function run() {
  console.log('Connecting to MongoDB:', MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));
  await mongoose.connect(MONGO_URI);

  const collection = mongoose.connection.collection('articles');
  const articles = await collection.find({}).toArray();

  console.log(`Found ${articles.length} total articles.`);
  let updatedCount = 0;

  for (const article of articles) {
    const updates = {};

    // 1. Check publishedAt
    if (article.publishedAt) {
      const pubDate = new Date(article.publishedAt);
      if (!isNaN(pubDate.getTime()) && pubDate.getFullYear() < 2000) {
        // e.g. year was 0002 -> replace with 2026
        const fixedDate = new Date(pubDate);
        fixedDate.setFullYear(2026);
        updates.publishedAt = fixedDate;
        console.log(`📅 Fixing publishedAt for "${article.title}": ${pubDate.toISOString()} -> ${fixedDate.toISOString()}`);
      }
    }

    // 2. Check slug
    if (article.slug) {
      const trimmedSlug = article.slug.trim();
      const hasSpaces = /\s/.test(article.slug);
      const hasTrailing = article.slug !== trimmedSlug;

      if (hasSpaces || hasTrailing) {
        const cleanSlug = generateSlug(article.slug);
        updates.slug = cleanSlug;
        console.log(`🔗 Fixing slug for "${article.title}":\n   Old: "${article.slug}"\n   New: "${cleanSlug}"`);
      }
    }

    // 3. Check and clean canonicalUrl
    const unsets = {};
    if (article.seo?.canonicalUrl) {
      let canonical = String(article.seo.canonicalUrl).trim();
      if (canonical.startsWith('ttps://')) {
        canonical = `h${canonical}`;
      }
      if (!canonical.startsWith('http://') && !canonical.startsWith('https://')) {
        // Relative path or malformed string -> unset it so self-canonical takes over cleanly
        unsets['seo.canonicalUrl'] = '';
        console.log(`🔗 Removing broken relative canonical for "${article.title}": "${article.seo.canonicalUrl}" (will use self-canonical)`);
      } else {
        const cleanCanonical = canonical.replace(/\/+$/, '');
        if (cleanCanonical !== article.seo.canonicalUrl) {
          updates['seo.canonicalUrl'] = cleanCanonical;
          console.log(`🔗 Normalizing canonical URL for "${article.title}": "${article.seo.canonicalUrl}" -> "${cleanCanonical}"`);
        }
      }
    }

    const mongoOp = {};
    if (Object.keys(updates).length > 0) mongoOp.$set = updates;
    if (Object.keys(unsets).length > 0) mongoOp.$unset = unsets;

    if (Object.keys(mongoOp).length > 0) {
      await collection.updateOne({ _id: article._id }, mongoOp);
      updatedCount++;
    }
  }

  console.log(`\n✅ Finished. Updated ${updatedCount} article(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
