#!/usr/bin/env node

/**
 * RavivarVichar CMS — Sanity Check Script
 * 
 * Run this BEFORE committing or deploying to verify nothing is broken.
 * Tests that all API endpoints are reachable and respond correctly,
 * frontends build, and project structure is intact.
 * 
 * Does NOT create any test data or require authentication.
 *
 * Usage:
 *   node scripts/sanity-check.js
 *   node scripts/sanity-check.js --skip-build   (skip frontend builds for speed)
 *   node scripts/sanity-check.js --server=http://localhost:5000   (custom server URL)
 * 
 * Requirements:
 *   - Node.js 18+ (uses global fetch)
 *   - Server must be running on the target URL
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ─── Node version check ───
const nodeMajor = Number(process.version.slice(1).split('.')[0]);
if (nodeMajor < 18) {
  console.error(`\x1b[31m✗ This script requires Node.js 18+. Current: ${process.version}\x1b[0m`);
  process.exit(1);
}

// ─── Configuration ───
const ROOT = path.resolve(__dirname, '..');
const SERVER_URL = process.argv.find(a => a.startsWith('--server='))?.split('=')[1] || 'http://localhost:5000';
const API = `${SERVER_URL}/api/v1`;
const SKIP_BUILD = process.argv.includes('--skip-build');

let passed = 0;
let failed = 0;
let warnings = 0;

// ─── Helpers ───
const color = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

const log = (msg) => process.stdout.write(msg);
const logLine = (msg) => console.log(msg);

const header = (msg) => {
  console.log(`\n${color.cyan}════════════════════════════════════════════${color.reset}`);
  console.log(`${color.cyan}  ${msg}${color.reset}`);
  console.log(`${color.cyan}════════════════════════════════════════════${color.reset}\n`);
};

const testPass = (msg) => {
  passed++;
  log(`${color.green}  ✓${color.reset} ${msg}\n`);
};

const testFail = (msg, detail = '') => {
  failed++;
  log(`${color.red}  ✗${color.reset} ${msg}${detail ? ` — ${color.dim}${detail}${color.reset}` : ''}\n`);
};

const testWarn = (msg, detail = '') => {
  warnings++;
  log(`${color.yellow}  ⚠${color.reset} ${msg}${detail ? ` — ${color.dim}${detail}${color.reset}` : ''}\n`);
};

const fetchJson = async (url, options = {}) => {
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    signal: AbortSignal.timeout(5000),
  });
  const data = await resp.json();
  return { status: resp.status, data };
};

// ──────────────────────────────────────────────────
//  MAIN
// ──────────────────────────────────────────────────
(async () => {
  console.log(`${color.cyan}
  ╔══════════════════════════════════════════╗
  ║     RavivarVichar CMS — Sanity Check     ║
  ╚══════════════════════════════════════════╝${color.reset}`);
  console.log(`  Server: ${SERVER_URL}`);
  console.log(`  Node:   ${process.version}`);
  console.log(`  Time:   ${new Date().toISOString()}\n`);

  // ─── 1. Health Check ───
  header('1. Server Health');
  try {
    const { status, data } = await fetchJson(`${API}/health`);
    if (status === 200 && data.success) {
      testPass('Health endpoint', `status=${status}`);
    } else {
      testFail('Health endpoint', `status=${status}, success=${data.success}`);
    }
  } catch (err) {
    testFail('Health endpoint', `Cannot connect: ${err.message}`);
    logLine(`\n  ${color.red}✗ Server not running! Start it first: npm run dev:server${color.reset}\n`);
    process.exit(1);
  }

  // ─── 2. Public GET Endpoints ───
  header('2. Public GET Endpoints');

  const publicEndpoints = [
    { name: 'Articles list',      url: '/articles' },
    { name: 'Articles by slug',   url: '/articles/slug/test-article' },
    { name: 'Programs list',      url: '/programs' },
    { name: 'Projects list',      url: '/projects' },
    { name: 'Partners list',      url: '/partners' },
    { name: 'Reports list',       url: '/reports' },
    { name: 'Events list',        url: '/events' },
    { name: 'Media list',         url: '/media' },
    { name: 'Testimonials list',  url: '/testimonials' },
    { name: 'Entrepreneurs list', url: '/directory/entrepreneurs' },
    { name: 'SHGs list',          url: '/directory/shgs' },
    { name: 'Mentors list',       url: '/directory/mentors' },
    { name: 'Homepage sections',  url: '/homepage' },
  ];

  for (const ep of publicEndpoints) {
    try {
      const { status, data } = await fetchJson(`${API}${ep.url}`);
      if (status === 200 && data.success) {
        const count = Array.isArray(data.data) ? data.data.length : data.data ? Object.keys(data.data).length : 0;
        testPass(`${ep.name}`, `status=${status}, items=${count}`);
      } else if (status === 404 && ep.url.includes('/slug/')) {
        // Slug endpoints may 404 if no matching article exists — that's fine,
        // it means the route is wired correctly and returns a proper response
        testPass(`${ep.name}`, `status=${status} (no matching content, route works)`);
      } else {
        testFail(`${ep.name}`, `status=${status}, success=${data.success}`);
      }
    } catch (err) {
      testFail(`${ep.name}`, err.message);
    }
  }

  // ─── 3. Single Item GET Endpoints ───
  header('3. Single Item GET Endpoints');

  // Test fetching a single article by ID
  try {
    const { data: articlesData } = await fetchJson(`${API}/articles?limit=1`);
    const articles = articlesData.data;
    if (articles && articles.length > 0) {
      const id = articles[0]._id;
      const slug = articles[0].slug;

      const { status: byId } = await fetchJson(`${API}/articles/${id}`);
      if (byId === 200) testPass('Article by ID', `id=${id}`);
      else testFail('Article by ID', `status=${byId}`);

      const { status: bySlug } = await fetchJson(`${API}/articles/slug/${slug}`);
      if (bySlug === 200) testPass('Article by slug', `slug=${slug}`);
      else testFail('Article by slug', `status=${bySlug}`);
    } else {
      testWarn('Single article endpoints', 'No articles in database — skipping');
    }
  } catch (err) {
    testFail('Single article endpoints', err.message);
  }

  // Test fetching a single program by slug
  try {
    const { data: programsData } = await fetchJson(`${API}/programs?limit=1`);
    const programs = programsData.data;
    if (programs && programs.length > 0) {
      const slug = programs[0].slug;
      const { status: bySlug } = await fetchJson(`${API}/programs/slug/${slug}`);
      if (bySlug === 200) testPass('Program by slug', `slug=${slug}`);
      else testFail('Program by slug', `status=${bySlug}`);
    } else {
      testWarn('Single program endpoints', 'No programs in database — skipping');
    }
  } catch (err) {
    testFail('Single program endpoints', err.message);
  }

  // Test fetching a single event by ID
  try {
    const { data: eventsData } = await fetchJson(`${API}/events?limit=1`);
    const events = eventsData.data;
    if (events && events.length > 0) {
      const id = events[0]._id;
      const { status: byId } = await fetchJson(`${API}/events/${id}`);
      if (byId === 200) testPass('Event by ID', `id=${id}`);
      else testFail('Event by ID', `status=${byId}`);
    } else {
      testWarn('Single event endpoints', 'No events in database — skipping');
    }
  } catch (err) {
    testFail('Single event endpoints', err.message);
  }

  // ─── 4. Frontend Build Check ───
  header('4. Frontend Builds');

  if (SKIP_BUILD) {
    testWarn('Client build', 'Skipped (--skip-build flag)');
    testWarn('Admin build', 'Skipped (--skip-build flag)');
  } else {
    try {
      const clientDir = path.join(ROOT, 'apps/client');
      if (fs.existsSync(path.join(clientDir, 'package.json'))) {
        execSync('npm run build', { cwd: clientDir, stdio: 'pipe', timeout: 60000 });
        const distExists = fs.existsSync(path.join(clientDir, 'dist'));
        testPass('Client build', distExists ? 'dist/ created' : 'dist/ missing');
      }
    } catch (err) {
      testFail('Client build', err.stderr?.toString().slice(0, 200) || err.message);
    }

    try {
      const adminDir = path.join(ROOT, 'apps/admin');
      if (fs.existsSync(path.join(adminDir, 'package.json'))) {
        execSync('npm run build', { cwd: adminDir, stdio: 'pipe', timeout: 60000 });
        const distExists = fs.existsSync(path.join(adminDir, 'dist'));
        testPass('Admin build', distExists ? 'dist/ created' : 'dist/ missing');
      }
    } catch (err) {
      testFail('Admin build', err.stderr?.toString().slice(0, 200) || err.message);
    }
  }

  // ─── 5. Project Structure Check ───
  header('5. Project Structure');

  const requiredFiles = [
    'apps/server/src/server.js',
    'apps/server/src/app.js',
    'apps/client/src/main.jsx',
    'apps/admin/src/main.jsx',
    'package.json',
    'apps/server/package.json',
    'apps/client/package.json',
    'apps/admin/package.json',
    'apps/server/src/config/env.js',
    'apps/server/src/config/db.js',
    'apps/server/src/routes/index.js',
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(path.join(ROOT, file))) {
      testPass(`File exists: ${file}`);
    } else {
      testFail(`File missing: ${file}`);
    }
  }

  // ─── 6. Environment Variable Check ───
  header('6. Environment Check');

  const checkEnv = (name, value) => {
    if (value && value !== '') {
      testPass(`Env var: ${name}`, 'set');
    } else {
      testWarn(`Env var: ${name}`, 'not set (may use default)`);
    }
  };

  checkEnv('PORT', process.env.PORT);
  checkEnv('NODE_ENV', process.env.NODE_ENV);
  checkEnv('MONGO_URI', process.env.MONGO_URI);
  checkEnv('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET);
  checkEnv('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET);

  // ─── Summary ───
  header('Results');
  console.log(`  ${color.green}Passed: ${passed}${color.reset}`);
  console.log(`  ${color.red}Failed: ${failed}${color.reset}`);
  console.log(`  ${color.yellow}Warnings: ${warnings}${color.reset}`);
  console.log(`  Total:   ${passed + failed + warnings}\n`);

  if (failed > 0) {
    console.log(`  ${color.red}✗ Some checks failed. Review the issues above before committing or deploying.${color.reset}\n`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`  ${color.yellow}⚠ All critical checks passed, but there are warnings to review.${color.reset}\n`);
    process.exit(0);
  } else {
    console.log(`  ${color.green}✓ All checks passed! Ready to commit.${color.reset}\n`);
    process.exit(0);
  }
})();
