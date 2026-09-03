#!/usr/bin/env node
/**
 * Sitemap Audit Script
 *
 * Compares the CMS published-article set against the live /sitemap.xml.
 * Read-only — does NOT modify any data, slugs, or URLs.
 *
 * Usage:
 *   MONGO_URI=mongodb://... node scripts/audit-sitemap.js
 *   (falls back to mongodb://localhost:27017/ravivarvichar if MONGO_URI is unset)
 */

const mongoose = require('mongoose');

// ── Configuration ──────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ravivarvichar';
const SITE_URL = process.env.SITE_URL || 'https://ravivarvichar.in';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// ── Article schema (minimal, just what we need) ────────────────────────
const articleSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, lowercase: true },
    category: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
    updatedAt: Date,
    seo: {
      excludeFromSearch: { type: Boolean, default: false },
    },
  },
  { collection: 'articles', strict: false }
);

const Article = mongoose.model('Article', articleSchema);

// ── Helpers ────────────────────────────────────────────────────────────
const encodeSitemapUri = (str) => encodeURI(str);

function parseSitemapUrls(xml) {
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function slugToPublicUrl(base, slug) {
  return encodeSitemapUri(`${base}/articles/${slug}`);
}

function extractSlugFromSitemapUrl(url, base) {
  const prefix = `${base}/articles/`;
  if (url.startsWith(prefix)) {
    return url.slice(prefix.length);
  }
  return null;
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║              SITEMAP AUDIT vs CMS — READ-ONLY               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();
  console.log(`  MongoDB : ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')}`);
  console.log(`  Site    : ${SITE_URL}`);
  console.log(`  Sitemap : ${SITEMAP_URL}`);
  console.log();

  // ── 1. Connect to MongoDB ──────────────────────────────────────────
  console.log('① Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('   ✅ Connected\n');
  } catch (err) {
    console.error('   ❌ Connection failed:', err.message);
    console.error('   Set MONGO_URI env var to point at the CMS database.');
    process.exit(1);
  }

  // ── 2. Fetch ALL articles from CMS ─────────────────────────────────
  console.log('② Fetching all articles from CMS...');
  const allArticles = await Article.find({})
    .select('title slug status category publishedAt updatedAt seo.excludeFromSearch')
    .lean();

  const totalRecords = allArticles.length;
  const publishedRecords = allArticles.filter((a) => a.status === 'published');
  const draftRecords = allArticles.filter((a) => a.status === 'draft');
  const excludedFromSearch = allArticles.filter(
    (a) => a.status === 'published' && a.seo?.excludeFromSearch === true
  );
  const publishedWithNullSlug = publishedRecords.filter(
    (a) => !a.slug || a.slug.trim() === ''
  );

  console.log(`   Total records in DB   : ${totalRecords}`);
  console.log(`   Published records     : ${publishedRecords.length}`);
  console.log(`   Draft records         : ${draftRecords.length}`);
  console.log(`   Excluded from search  : ${excludedFromSearch.length}`);
  console.log(`   Published + no slug   : ${publishedWithNullSlug.length}`);
  console.log();

  // ── 3. Determine indexable records (what SHOULD be in sitemap) ─────
  // Mirrors the exact query in seo.routes.js:
  //   status: 'published', seo.excludeFromSearch != true, slug != null
  const indexableRecords = publishedRecords.filter(
    (a) => a.slug && a.slug.trim() !== '' && a.seo?.excludeFromSearch !== true
  );

  console.log('③ Indexable records (should appear in sitemap):');
  console.log(`   Count: ${indexableRecords.length}`);
  console.log();

  // Build the canonical URL set from CMS
  const cmsUrls = new Set();
  const cmsUrlToRecord = new Map();
  for (const record of indexableRecords) {
    const url = slugToPublicUrl(SITE_URL, record.slug);
    cmsUrls.add(url);
    cmsUrlToRecord.set(url, record);
  }

  // ── 4. Fetch live sitemap.xml ──────────────────────────────────────
  console.log('④ Fetching live sitemap.xml...');
  let sitemapRaw;
  try {
    const res = await fetch(SITEMAP_URL, {
      headers: { 'User-Agent': 'SitemapAudit/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`   ❌ HTTP ${res.status} — could not fetch sitemap`);
      process.exit(1);
    }
    sitemapRaw = await res.text();
    console.log(`   ✅ Fetched (${sitemapRaw.length} bytes)\n`);
  } catch (err) {
    console.error(`   ❌ Fetch failed: ${err.message}`);
    process.exit(1);
  }

  // ── 5. Parse sitemap ───────────────────────────────────────────────
  console.log('⑤ Parsing sitemap.xml...');
  const allSitemapUrls = parseSitemapUrls(sitemapRaw);
  console.log(`   Total <loc> entries: ${allSitemapUrls.length}`);

  // Separate article URLs from other URLs (static, what-we-do, recognitions)
  const sitemapArticleUrls = allSitemapUrls.filter((u) => {
    return extractSlugFromSitemapUrl(u, SITE_URL) !== null;
  });
  const sitemapNonArticleUrls = allSitemapUrls.filter((u) => {
    return extractSlugFromSitemapUrl(u, SITE_URL) === null;
  });

  console.log(`   Article URLs (/articles/*) : ${sitemapArticleUrls.length}`);
  console.log(`   Non-article URLs           : ${sitemapNonArticleUrls.length}`);
  console.log();
  console.log('   Non-article URLs in sitemap:');
  for (const u of sitemapNonArticleUrls) {
    console.log(`     • ${u}`);
  }
  console.log();

  // ── 6. Compare ─────────────────────────────────────────────────────
  console.log('⑥ Comparing CMS indexable set vs sitemap article URLs...\n');

  const sitemapUrlSet = new Set(sitemapArticleUrls);
  const cmsUrlSet = cmsUrls;

  // Missing from sitemap (in CMS but not in sitemap)
  const missingFromSitemap = [];
  for (const url of cmsUrlSet) {
    if (!sitemapUrlSet.has(url)) {
      const record = cmsUrlToRecord.get(url);
      missingFromSitemap.push({ url, slug: record.slug, title: record.title });
    }
  }

  // Extra in sitemap (in sitemap but not in CMS indexable set)
  const extraInSitemap = [];
  for (const url of sitemapUrlSet) {
    if (!cmsUrlSet.has(url)) {
      const slug = extractSlugFromSitemapUrl(url, SITE_URL);
      extraInSitemap.push({ url, slug });
    }
  }

  // Duplicates in sitemap
  const slugCounts = {};
  for (const url of sitemapArticleUrls) {
    slugCounts[url] = (slugCounts[url] || 0) + 1;
  }
  const duplicates = Object.entries(slugCounts).filter(([, count]) => count > 1);

  // ── 7. Print report ────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('                        AUDIT REPORT');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log();
  console.log('┌─ CMS Summary ──────────────────────────────────────────────────┐');
  console.log(`│  Published records (total)       : ${String(publishedRecords.length).padStart(4)}                       │`);
  console.log(`│  Indexable records               : ${String(indexableRecords.length).padStart(4)}                       │`);
  console.log(`│  Draft records                   : ${String(draftRecords.length).padStart(4)}                       │`);
  console.log(`│  Excluded from search (noindex)  : ${String(excludedFromSearch.length).padStart(4)}                       │`);
  console.log(`│  Published with missing/empty slug: ${String(publishedWithNullSlug.length).padStart(3)}                       │`);
  console.log('└────────────────────────────────────────────────────────────────┘');
  console.log();
  console.log('┌─ Sitemap Summary ──────────────────────────────────────────────┐');
  console.log(`│  Total <loc> entries             : ${String(allSitemapUrls.length).padStart(4)}                       │`);
  console.log(`│  Article URLs (/articles/*)      : ${String(sitemapArticleUrls.length).padStart(4)}                       │`);
  console.log(`│  Non-article URLs                : ${String(sitemapNonArticleUrls.length).padStart(4)}                       │`);
  console.log('└────────────────────────────────────────────────────────────────┘');
  console.log();
  console.log('┌─ Comparison ───────────────────────────────────────────────────┐');
  console.log(`│  Missing from sitemap (in CMS)   : ${String(missingFromSitemap.length).padStart(4)}                       │`);
  console.log(`│  Extra in sitemap (not in CMS)   : ${String(extraInSitemap.length).padStart(4)}                       │`);
  console.log(`│  Duplicate URLs in sitemap       : ${String(duplicates.length).padStart(4)}                       │`);
  console.log('└────────────────────────────────────────────────────────────────┘');
  console.log();

  // ── Detailed listings ──────────────────────────────────────────────
  if (missingFromSitemap.length > 0) {
    console.log('⚠️  MISSING FROM SITEMAP (published in CMS but not in sitemap.xml):');
    for (const m of missingFromSitemap) {
      console.log(`   • slug: "${m.slug}"`);
      console.log(`     title: "${m.title}"`);
      console.log(`     url: ${m.url}`);
    }
    console.log();
  }

  if (extraInSitemap.length > 0) {
    console.log('⚠️  EXTRA IN SITEMAP (in sitemap.xml but not in CMS indexable set):');
    for (const e of extraInSitemap) {
      console.log(`   • slug: "${e.slug}"`);
      console.log(`     url: ${e.url}`);
    }
    console.log();
  }

  if (duplicates.length > 0) {
    console.log('⚠️  DUPLICATE URLs IN SITEMAP:');
    for (const [url, count] of duplicates) {
      console.log(`   • ${url} (appears ${count} times)`);
    }
    console.log();
  }

  if (publishedWithNullSlug.length > 0) {
    console.log('⚠️  PUBLISHED RECORDS WITH MISSING/EMPTY SLUG:');
    for (const a of publishedWithNullSlug) {
      console.log(`   • title: "${a.title}" (category: ${a.category || 'N/A'})`);
    }
    console.log();
  }

  // ── 8. Per-record audit ────────────────────────────────────────────
  console.log('⑦ Per-record audit (all published records):');
  console.log();
  console.log('  #  │ Status    │ Slug                          │ Category        │ In Sitemap │ URL');
  console.log('─────┼───────────┼───────────────────────────────┼─────────────────┼────────────┼──────────────────────────────────────');

  for (let i = 0; i < publishedRecords.length; i++) {
    const a = publishedRecords[i];
    const slug = a.slug || '(none)';
    const cat = a.category || '(none)';
    const excluded = a.seo?.excludeFromSearch === true;
    const hasSlug = !!a.slug;
    const url = hasSlug ? slugToPublicUrl(SITE_URL, a.slug) : null;
    const inSitemap = url ? sitemapUrlSet.has(url) : false;

    let status;
    if (excluded) {
      status = 'EXCLUDED';
    } else if (!hasSlug) {
      status = 'NO SLUG';
    } else if (inSitemap) {
      status = '✅ OK';
    } else {
      status = '❌ MISS';
    }

    const num = String(i + 1).padStart(3);
    const slugPadded = slug.padEnd(29).slice(0, 29);
    const catPadded = cat.padEnd(15).slice(0, 15);
    const inSitemapStr = inSitemap ? 'Yes' : (excluded ? 'n/a' : 'No');
    const urlStr = url || '(cannot generate — no slug)';

    console.log(`  ${num} │ ${status.padEnd(9)} │ ${slugPadded} │ ${catPadded} │ ${inSitemapStr.padEnd(10)} │ ${urlStr}`);
  }

  console.log();

  // ── 9. Final verdict ───────────────────────────────────────────────
  const issues =
    missingFromSitemap.length + extraInSitemap.length + duplicates.length + publishedWithNullSlug.length;

  if (issues === 0 && indexableRecords.length === 12) {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('  ✅  PASS — All 12 published records appear exactly once in sitemap.xml');
    console.log('═══════════════════════════════════════════════════════════════════');
  } else if (issues === 0 && indexableRecords.length !== 12) {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`  ⚠️  PARTIAL PASS — sitemap is consistent but CMS has ${indexableRecords.length} indexable records (expected 12)`);
    console.log('═══════════════════════════════════════════════════════════════════');
  } else {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`  ❌  FAIL — ${issues} issue(s) found`);
    console.log('═══════════════════════════════════════════════════════════════════');
  }

  console.log();
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
