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
| directory.routes.js | ✅ Removed |
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
