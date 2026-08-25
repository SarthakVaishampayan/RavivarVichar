const express = require('express');
const router = express.Router();

// ─── Old Website URL Redirects ─────────────────────────────────────────
// Add any old URLs that had real content and should redirect to their new
// location.  Format: { '/old-path': '/new-path' }
//
// If an old URL has NO replacement (content was deleted), leave it out —
// nginx already returns 404 for unknown paths.
//
// If you're unsure whether an old URL had content, check the database or
// Google Search Console "Crawled - currently not indexed" list.
const REDIRECTS = {
  // Example (uncomment and fill in as needed):
  // '/old-article-slug': '/articles/new-article-slug',
  // '/bank-sakhi': '/articles/bank-sakhi-story',
  // '/kahaniyan': '/articles',
};

// Apply redirects
Object.entries(REDIRECTS).forEach(([from, to]) => {
  router.get(from, (req, res) => {
    res.redirect(301, to);
  });
});

// Also handle trailing-slash variants
Object.entries(REDIRECTS).forEach(([from, to]) => {
  if (!from.endsWith('/')) {
    router.get(`${from}/`, (req, res) => {
      res.redirect(301, to);
    });
  }
});

module.exports = router;
