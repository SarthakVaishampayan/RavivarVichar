# To Be Done — RavivarVichar CMS

**Purpose:** All planned features that haven't been implemented yet, organized by phase.

---

## Phase 1 — In-House Pageview Tracking

**Status:** ✅ Complete

**Goal:** Track visitors, pageviews, top pages, and referrers using your own MongoDB — no external services.

### What Was Built

**Backend Files:**
- `apps/server/src/models/PageView.js` — PageView MongoDB model with indexes for aggregation
- `apps/server/src/middlewares/rateLimiter.middleware.js` — Added `pageviewLimiter` (60 req/min per IP)
- `apps/server/src/controllers/analytics.controller.js` — Added `recordPageview` + `getTraffic` methods
- `apps/server/src/routes/analytics.routes.js` — Added `POST /pageview` (public, rate-limited) + `GET /traffic` (protected)

**Frontend (Client):**
- `apps/client/src/hooks/usePageviewTracking.js` — React hook that fires pageview on every route change (30s debounce, persistent session in localStorage)
- `apps/client/src/App.jsx` — Wired via `<PageviewTracker />` component

**Frontend (Admin):**
- `apps/admin/src/pages/Traffic.jsx` — Full traffic dashboard with stat cards (Active Now, Today, This Week, This Period, Pageviews, Sessions), visitor trend bar chart (7/30/90/365 day toggle), top pages table, top referrers table
- `apps/admin/src/lib/constants.js` — Added Traffic nav item with Activity icon
- `apps/admin/src/routes/AdminRoutes.jsx` — Added `/traffic` route

### How It Works
- Client side: `usePageviewTracking` hook sends `POST /api/v1/analytics/pageview` with path, sessionId, referrer on every route change
- Server side: IP is hashed for privacy (never stored raw), rate-limited to 60 req/min per IP
- Admin: `GET /api/v1/analytics/traffic?days=30` returns aggregated stats (visitors, pageviews, top pages, top referrers, daily trend)
- Works identically on localhost and server — no env vars or configuration needed

---

## Phase 2 — Google Search Console Integration (SEO)

**Status:** 🟡 Waiting for domain purchase

**Goal:** Pull real Google search performance data into admin dashboard — clicks, impressions, keyword rankings, index status.

### Prerequisites (After Domain Purchase)
1. Verify domain in [Google Search Console](https://search.google.com/search-console) (add DNS TXT record)
2. Create Google Cloud project → enable **Search Console API**
3. Create Service Account → download JSON key
4. Add service account email as user in GSC (read-only)
5. Add to `.env`:
   ```
   GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   GSC_CLIENT_EMAIL="your-sa@project.iam.gserviceaccount.com"
   GSC_SITE_URL="sc-domain:yourdomain.com"
   ```

### Backend Implementation
- Install `googleapis` npm package
- Create `services/searchConsole.service.js`
  - `getPerformance({ days, dimension })` — clicks, impressions, CTR, position
  - `getKeywords({ days, limit })` — top search queries
  - `getTopPages({ days, limit })` — most clicked pages from Google
  - `getSitemapStatus()` — sitemap submission & index status
- Add `GET /api/v1/analytics/seo?days=28` to analytics controller
- Cache GSC responses in MongoDB (6-12hr TTL) to avoid hitting API quota
- Graceful error when credentials not configured

### Frontend — Update SEO Page
- **Summary Cards:** Total Clicks, Total Impressions, Avg CTR, Avg Position (with % change)
- **Trend Line Chart:** Daily clicks + impressions over time (dual Y-axis)
- **Keywords Table:** Query, Clicks, Impressions, CTR, Position — sortable
- **Top Pages Table:** Page, Clicks, Impressions, CTR, Position — clickable
- **SEO Health Card:** Indexed, Not Indexed, Errors, Warnings
- **Date Filter:** 7 / 28 / 90 days

---

## Phase 3 — Umami Analytics Setup

**Status:** 🔴 Deferred

**Goal:** Add country-level, device-level, and session-level visitor data alongside your in-house tracking.

### What Umami Would Give You
- Pageviews, unique visitors, bounce rate, session duration
- Countries & cities (map view)
- Devices, browsers, operating systems
- Traffic sources (referrers, search, social, direct)
- Real-time data (no 24h delay)
- Cookieless, GDPR-compliant

### Server Setup (When Ready)
```bash
# 1. Install PostgreSQL
apt install postgresql postgresql-contrib

# 2. Create Umami database + user
sudo -u postgres psql -c "CREATE DATABASE umami;"
sudo -u postgres psql -c "CREATE USER umami WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE umami TO umami;"

# 3. Run Umami via Docker
docker run -d \
  --name umami \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://umami:your-password@localhost:5432/umami \
  -e HASH_SALT=$(openssl rand -hex 32) \
  ghcr.io/umami-software/umami:latest
```

### Client Setup (When Ready)
1. Open `http://YOUR_DROPLET_IP:3000` in browser → create admin account → add website → copy tracking script
2. Add the tracking script to `apps/client/index.html` inside `<head>`
3. Add a sidebar link in admin pointing to the Umami dashboard

---

## Phase 4 — Maintenance Mode + HTTP Basic Auth (Deployment Enhancement)

**Status:** ✅ Complete

**Goal:** When deploying new code, show a branded maintenance page to visitors while only you can privately test the new version before making it live.

### What Was Built

**`apps/client/maintenance.html`** — Branded maintenance page with:
- RavivarVichar logo and NGO branding colors (primary orange, secondary green)
- "Under Scheduled Maintenance" message
- Status indicator with pulsing dot
- Social media links (Facebook, Twitter, LinkedIn, Instagram)
- No JavaScript dependencies — works even when the app is down
- Responsive, clean design matching the website theme

**`scripts/maintenance-on.sh`** — Enables maintenance mode:
- Copies maintenance page to Nginx web root
- Creates/updates `.htpasswd` file for HTTP Basic Auth (username: admin)
- Generates a maintenance Nginx config:
  - **Root `/`** → Protected with HTTP Basic Auth. 
    • Public: login dialog → cancel → sees maintenance page (200 OK, no more dialogs)
    • **You:** `http://admin:password@yourdomain.com` → sees the actual client SPA to test
  - **`/admin`** → NOT in maintenance (already JWT-protected by the app, accessible normally)
  - **`/api/`** → Protected with HTTP Basic Auth
  - **`/uploads/`** → Protected with HTTP Basic Auth
- Switches Nginx to the maintenance config and reloads
- Supports `--dry-run` mode and password as argument (non-interactive)

**`scripts/maintenance-off.sh`** — Disables maintenance mode:
- Restores normal Nginx config
- Removes the maintenance page
- Reloads Nginx to bring the site back live
- Supports `--dry-run` mode

**`scripts/deploy.sh`** — Kept as original (no auto-maintenance toggle).

### Your Workflow
```
1. bash scripts/maintenance-on.sh mypassword     ← Enable maintenance
   → Public sees login dialog → cancel → maintenance page

2. bash scripts/deploy.sh                         ← Deploy new code
   → Pulls code, installs deps, builds, restarts server

3. Test everything while maintenance is ON:
   - Visit http://admin:mypassword@yourdomain.com   → see client SPA
   - Visit http://yourdomain.com/admin              → log in normally
   - curl -u admin:mypassword http://.../api/v1/... → test API

4. Found a bug? Fix code → git push → run deploy.sh again
   (maintenance stays ON the whole time — no toggling)

5. Satisfied? → bash scripts/maintenance-off.sh    ← Disable maintenance
   → Site is LIVE for everyone
```

---

## Summary — Execution Order

| Phase | What | Status | Needs Domain? |
|---|---|---|---|
| **Phase 1** | In-House Pageview Tracking | ✅ Complete | ❌ No |
| **Phase 2** | Google Search Console (SEO) | 🟡 Waiting for domain | ✅ Yes |
| **Phase 3** | Umami Analytics | 🔴 Deferred | ❌ No |
| **Phase 4** | Maintenance Mode + HTTP Auth | ✅ Complete | ❌ No |
