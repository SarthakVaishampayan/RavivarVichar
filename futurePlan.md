# Future Plan — RavivarVichar CMS

## Phase: Local Image Storage Migration

**Status:** 🟡 Planned (not started)

### Overview
Move from Cloudinary to local server storage for all image uploads. The app already supports this via a fallback (no Cloudinary env vars → saves to `apps/server/uploads/`). Need to:

### Steps
1. **Remove Cloudinary dependency**
   - Stop setting `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in production env
   - The upload controller already handles local storage as fallback — no code changes needed
   - Can also remove `cloudinary` npm package if not used elsewhere

2. **Set up backup for uploads**
   - Add `apps/server/uploads/` to backup scripts
   - Or add a cron job: `rsync` to another location daily

3. **Optimize disk storage**
   - Set up image compression on upload (sharp.js or similar) to reduce file sizes
   - Consider limiting upload size per user/IP

### Why This Works
- 25GB Digital Ocean storage is plenty (NGO site with hundreds of images ≈ 1-3GB)
- One less third-party dependency
- No API keys to manage
- Faster for local users (same server)

### Rollback
To switch back to Cloudinary, just set the env vars again — no code changes needed.

---

## Phase: Newsletter Email Setup (Deferred)

**Status:** 🟡 Deferred — not yet started

### Description
Set up automated email sending for the newsletter signup flow. Currently, the newsletter signup endpoint stores emails in the DB but doesn't send a welcome email.

### Steps
1. **Choose email provider** — Resend (recommended, generous free tier) or Nodemailer with SMTP (Gmail/SendGrid)
2. **Install dependency** — `resend` or `nodemailer` npm package
3. **Create email service** — `apps/server/src/services/email.service.js` with welcome email template
4. **Wire into newsletter controller** — Call email service after a successful signup
5. **Admin: broadcast option** — Send newsletter to all subscribed emails (future scope)

### Why Deferred
- Newsletter signup (email storage) already works end-to-end
- Emails can be manually exported from the admin panel for now
- Can be set up later without any schema or API changes

---

## Phase: Seed Data Population

**Status:** 🟡 Planned (not started)

### Description
Populate the database with sample content so the site looks complete on first deploy:

- **Media Mentions** — Add 3-4 sample mentions via admin panel so the homepage section shows up
- **Success Stories** — Add more articles tagged with "Success Stories" category for the knowledge hub section
- **Interviews** — Add sample interview articles so the section shows "More" button
- **Testimonials** — Already has 3, can add more
- **Partner Logos** — Upload actual partner logo images via admin
- **Gallery Images** — Add sample images

---

## Phase: Remove Unused Server Code

**Status:** ✅ Complete

### Description
Removed all unused server models, controllers, and routes that were no longer used after the frontend/admin UI cleanup:

| Component | Status |
|-----------|--------|
| Program model/controller/routes | ✅ Removed |
| Project model/controller/routes | ✅ Removed |
| Report model/controller/routes | ✅ Removed |
| Entrepreneur model/controller/routes | ✅ Removed |
| SHG model/controller/routes | ✅ Removed |
| Mentor model/controller/routes | ✅ Removed |
| Donation model/controller/routes | ✅ Removed |
| Membership model/controller/routes | ✅ Removed |
| `enum` in PageSection model (remove old keys) | ✅ Already done |

### Additional cleanup
- Removed `projectSchema` from `packages/shared/index.js`
- Removed `PROGRAM_STATUSES` and `PROJECT_STATUSES` from admin constants
- Removed special-case column logic for shgs/entrepreneurs/mentors in ContentList
- Removed "Ongoing Projects" stat card from Analytics page
- Removed unused endpoint checks from `scripts/sanity-check.js`
- Cleaned up `seed/data.json` — removed programs, projects, reports, entrepreneurs, shgs, mentors data
- Cleaned up `seed/seed.js` — removed unused model imports and seed calls

---

## Phase: Production Deployment

**Status:** 🟡 Planned (not started)

### Description
Final deployment setup and verification:

1. **Environment Variables** — Verify all required env vars
2. **Database Migration** — MongoDB schema changes (status enums, new fields) will auto-apply since Mongoose doesn't enforce strict schema on existing documents
3. **Build** — Run `npm run build -w apps/client` and `npm run build -w apps/admin` before deploy
4. **Start Script** — Use `node apps/server/src/server.js` or PM2 process manager
5. **Nginx/Reverse Proxy** — Configure to serve client/admin static builds + proxy API requests
6. **SSL** — Certbot/Let's Encrypt for HTTPS
7. **Health Check** — Verify `/api/v1/health` endpoint responds

### Known Schema Changes (auto-safe, no migration needed)
- ✅ `status` field added to ContactMessage, Newsletter, FeatureRequest, JoinInitiative, PartnerApplication (mongoose won't retroactively validate)
- ✅ `mediaMentions` added to PageSection enum (new documents will validate, old ones ignored)
- ❌ Old `PageSection` documents with keys like `'mission'`, `'articles'` will remain in DB but won't cause errors (can optionally clean up)

---

## Phase: Analytics Expansion (Deferred)

**Status:** 🟡 Deferred — all analytics features beyond traffic tracking and SEO are planned but not started.

### Overview
These analytics features were identified in the analytics implementation plan but are deprioritized below traffic tracking and SEO analytics. They will be implemented after the core visitor data and SEO data are operational.

### Phases

---

#### Phase: Microsoft Clarity Integration

**Description:** Add Microsoft Clarity for heatmaps, session recordings, and user behavior analysis.

**Implementation:**
1. Sign up for Microsoft Clarity (free)
2. Add Clarity tracking script to the client app (`apps/client/index.html` or via React Helmet)
3. Add a link to Clarity dashboard in the admin sidebar
4. No backend integration needed — Clarity handles everything on their side

**Why Deferred:** Clarity provides heatmaps and session recordings but is a separate dashboard (not embedded in admin). Valuable for UX optimization but not essential for core metrics.

**Cost:** ✅ Free

---

#### Phase: Custom Read Analytics

**Description:** Build in-house tracking for article scroll depth and read completion (data that Google Analytics cannot accurately measure).

**Backend:**
1. Create a new `ReadAnalytics` model in MongoDB:
   ```js
   {
     articleId: ObjectId,
     sessionId: String,
     events: [{ type: 'opened' | '25%' | '50%' | '75%' | '100%', timestamp: Date }],
     startedAt: Date,
     completedAt: Date,
     timeOnPage: Number, // seconds
   }
   ```
2. Create API endpoint: `POST /api/v1/analytics/read-event`
3. Store aggregated stats per article (completion rate, avg scroll depth, avg reading time)

**Frontend:**
1. Create `useReadTracking` hook on article detail page
2. Fire events at scroll milestones (25%, 50%, 75%, 100%)
3. Send `read-event` payload to the server

**Admin Dashboard:**
1. Add "Read Rate" column to article list showing: Opened / Finished / Completion %
2. Add per-article read stats panel on the article detail/edit page

**Why Deferred:** Requires new model, API endpoint, frontend hook, and dashboard widgets. Can be done independently later.

**Cost:** ✅ Free (self-built)

---

#### Phase: Author Analytics

**Description:** Show per-author statistics: articles published, total views, avg views, avg read time, most popular article, average completion rate, performance score (100-point system).

**Implementation:**
1. Build aggregation pipeline in analytics controller using existing Article data
2. Aggregate by `author` field, using `views` + read analytics data
3. Display in admin on a new "Authors" section or within the Users page

**Why Deferred:** Depends on traffic tracking (for views data) and read analytics (for completion rate).

**Cost:** ✅ Free

---

#### Phase: NGO Impact Analytics

**Description:** Track organization activity with dashboard cards, donation funnels, and volunteer funnels using data that already exists in MongoDB.

**Dashboard Cards:**
- Campaign Views
- Donation Page Views
- Volunteer Registrations → Already tracked in `JoinInitiative` model
- Newsletter Subscribers → Already tracked in `Newsletter` model
- Contact Form Submissions → Already tracked in `ContactMessage` model
- Resource Downloads
- Research Downloads
- Event Registrations → Already tracked in `Event` model
- Partnership Requests → Already tracked in `PartnerApplication` model

**Donation Funnel (future):**
Visitors → Donation Page → Payment Started → Donation Completed

**Volunteer Funnel:**
Visitors → Volunteer Form → Application Submitted → Approved

**Why Deferred:** Much of this data already exists in the database. The implementation is mostly frontend charts and aggregation queries. Low effort, but deferred until traffic tracking provides visitor-count context for these metrics.

**Cost:** ✅ Free

---

#### Phase: Content Analytics

**Description:** Show top articles by time period (today, week, month), most shared, most commented, most read categories, trending categories, most visited authors.

**Implementation:**
1. Build MongoDB aggregation pipelines with date filters
2. Add new API endpoint: `GET /api/v1/analytics/content`
3. Display as dashboard widgets on the Analytics page

**Why Deferred:** Depends on traffic tracking data (views data for articles).

**Cost:** ✅ Free

---

#### Phase: Audience Insights

**Description:** Show audience demographics: countries, cities, languages, devices, operating systems, browsers, screen sizes.

**Implementation:**
- Countries/cities/devices/browsers → Requires traffic tracking (GA4/Umami)
- Age/gender → Requires Google Signals (GA4 with user logged-in state)

**Why Deferred:** Requires a traffic analytics service (GA4 or Umami) to have this data.

**Cost:** ✅ Free (GA4) or Free (self-hosted Umami)

---

#### Phase: AI Insights (Optional)

**Description:** Generate automatic AI summaries of analytics trends, e.g.:
- "Traffic increased 18% this week"
- "Women Empowerment articles performed 43% above average"
- "Publishing between 7PM–9PM generates the highest engagement"

**Implementation:**
1. Integrate with an LLM API (OpenAI, Claude, etc.)
2. Write a prompt that takes analytics data and generates natural-language insights
3. Display as an "AI Insights" card on the dashboard

**Why Deferred:** Requires ongoing LLM API cost. Also needs sufficient historical data (3+ months) for meaningful insights.

**Cost:** 💰 Paid (LLM API usage)

---

#### Phase: Trending Topics

**Description:** Show trending searches, categories, keywords, and emerging topics from multiple sources.

**Sources:**
- Google Trends (community libraries — fragile, may break)
- Search Console data (most-viewed articles, top queries)
- Internal search logs (if search is implemented)

**Why Deferred:** Google Trends community APIs are unreliable. Internal search requires the search feature to be built first. Search Console integration is in the SEO tracking plan.

**Cost:** ✅ Free (but fragile)

---

#### Phase: Internal Search Analytics

**Description:** Track what visitors search for on the website. Show most searched terms, searches with no results, popular filters, and recent searches.

**Implementation:**
1. Create a `SearchLog` model in MongoDB
2. Log every search query from the client site to the API
3. Build admin dashboard to display search analytics

**Why Deferred:** Requires the client site search feature to be functional first.

**Cost:** ✅ Free (self-built)

---

#### Phase: Notification Center

**Description:** Notify admin when:
- Traffic spikes or drops significantly
- An article goes viral
- Google indexing error occurs
- Donation campaign reaches a milestone
- Volunteer registrations increase significantly

**Implementation:**
1. Create a background check (setInterval or cron job in Node.js)
2. Compare current analytics against thresholds
3. Send in-app notifications (stored in DB) or email alerts

**Why Deferred:** Requires traffic tracking data and defined thresholds.

**Cost:** ✅ Free

---

#### Phase: Export Reports

**Description:** Allow admin to export analytics data as PDF, Excel, or CSV with date filters (daily, weekly, monthly, yearly).

**Implementation:**
1. Install `jspdf` or `pdfmake` for PDF, `xlsx` for Excel
2. Add "Export" button to Analytics page sections
3. Server generates file, client downloads

**Why Deferred:** Standard feature, low urgency. Best implemented after analytics data sources are stable.

**Cost:** ✅ Free (open-source libraries)

---

#### Phase: Admin Dashboard Layout Expansion

**Description:** Expand the current admin dashboard with additional summary cards and charts from all analytics phases:

**Top Summary Cards:**
Total Visitors | Active Users | Article Views | New Users | Donations | Volunteer Signups | Newsletter Subscribers | Campaign Views

**Charts:**
Visitor Trend | Traffic Sources | Devices | Countries | Top Articles | Read Completion | Donation Funnel | Volunteer Funnel

**Tables:**
Latest Articles | Top Authors | Trending Topics | Recent Visitors | Recent Donations | Search Keywords | Top Campaigns

**Why Deferred:** This is the final UI that ties all other analytics phases together. Best done after the underlying data sources are implemented.

**Cost:** ✅ Free (uses existing Recharts + Tailwind)
