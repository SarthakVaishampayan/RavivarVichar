# Resume Prompt — RavivarVichar CMS

> **Instructions to Codebuff**: Read this file first to restore full project context. After reading, the user will tell you which phase to begin.

---

## Project Overview

Building a **full-stack CMS platform** for **RavivarVichar** — an NGO/research organization focused on rural women's entrepreneurship and financial inclusion in Rajasthan, India.

### Architecture
```
ravivarVichar/                     ← Monorepo (npm workspaces)
├── apps/
│   ├── client/                    ← Public website (React 18 + Vite + Tailwind)
│   ├── admin/                     ← Admin dashboard (React 18 + Vite + Tailwind)
│   └── server/                    ← Express API
├── packages/
│   └── shared/                    ← Shared Zod validation schemas
├── scripts/
│   ├── deploy.sh                  ← Deploy with auto-rollback
│   ├── sanity-check.js            ← Pre-commit verification
│   ├── maintenance-on.sh          ← Enable maintenance mode
│   └── maintenance-off.sh         ← Disable maintenance mode
├── DEPLOYMENT_GUIDE.md            ← Deployment guide (merged from 3 old files)
├── DEPLOYMENT_REFERENCE.md        ← Schema/API reference (actively maintained)
├── OriginalDeploymentGuide.md     ← Lessons learned for final production deploy
├── ROADMAP.md                     ← Consolidated roadmap (merged from 4 old files)
├── resume_prompt.md               ← ← This file
├── package.json                   ← Root workspace config
└── .env.example
```

### Key Decisions Made (from user discussion)
1. **Single admin role** — not 4 roles. Auth check is simply `isAdmin: true/false`. No role.middleware.js.
2. **SEO is high priority** — semantic HTML, react-helmet-async, Open Graph, JSON-LD, sitemap, clean URLs.
3. **Admin content flow**: Login → Dashboard → Sidebar "Manage Content" → ContentHub (pick type) → DataTable list → Editor form → Publish → Public site auto-updates.
4. **Analytics Dashboard**: Content count cards, pie chart (content distribution), bar chart (monthly posts), recent activity feed.
5. **JavaScript only** — no TypeScript.
6. **Local MongoDB** — not Atlas for development.
7. **No hardcoded data** — All homepage sections must fetch from API and return null/hide when no data.
8. **Status system for submissions**: `under-consideration` / `approved` / `posted` / `denied`. Deny does NOT delete.
9. **Admin idle timeout**: Page reloads instead of redirecting to `/login` (avoids blank page when SPA is at subpath).

### Design Tokens (current)
```css
--color-primary: #F5A623;       /* warm orange */
--color-secondary: #6AA84F;     /* soft sage green */
--color-accent-blue: #5DADE2;
--color-accent-red: #D96C6C;
--color-surface-secondary: #FAF9F7;
--color-surface-section: #F8F8F6;
--color-ink-primary: #222222;
--color-ink-secondary: #6E6E6E;
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
```

Border radius system: pill = 999px, card = 28px, image = 24px, input = 18px. Shadows: soft/card/hover/nav. Container: max 1280px, content 1180px. Font sizes: hero 64px, section 46px, card 26px, body 18px, nav 14px.

### API Conventions
- Base URL: `/api/v1`
- List endpoints: `?page=&limit=&sort=&search=&status=&category=`
- Response shape: `{ success: boolean, data: any, message?: string, meta?: { page, total } }`
- All write routes require admin JWT auth
- Public GET routes require no auth

### Content Models (16 Collections)
User, Article, Event, ContactMessage, Newsletter, GalleryImage, Partner, PartnerApplication, Testimonial, FeatureRequest, JoinInitiative, MediaMention, PageSection, PageView, ActivityLog, SeoMeta

*Note: Several models from the original plan (Program, Project, Report, Entrepreneur, SHG, Mentor, Donation, Membership, MediaItem) were removed from server code as part of earlier cleanup.*

### Tech Stack
- **Frontend (client)**: React 18 + Vite + Tailwind CSS 3 + React Router v6 + Framer Motion + clsx + react-helmet-async + lucide-react
- **Frontend (admin)**: React 18 + Vite + Tailwind CSS 3 + Zustand + TanStack Table + TipTap + Recharts + React Hook Form + Zod + dnd-kit + axios
- **Backend**: Express + Mongoose + JWT + bcrypt + Multer + Cloudinary
- **Shared package**: Zod validation schemas used by both server & client forms
- **Planned**: Resend/Nodemailer (email), Razorpay/Stripe (payments), Vercel (deploy), Render (server), MongoDB Atlas (DB)

---

## Current Status

| Phase | Status |
|-------|--------|
| 1 — Foundation | ✅ Complete |
| 2 — Core CMS APIs | ✅ Complete |
| 3 — Admin Dashboard | ✅ Complete |
| 4 — Public Website | ✅ Complete |
| 4b — Mobile Responsive Polish | ✅ Complete |
| 5 — Integrations | ⏳ Not started |
| 6 — Polish & Deploy | ⏳ Not started |

### Staging Server Deployed
- **IP:** DigitalOcean droplet (current testing/staging server)
- **Deployment method:** `bash scripts/deploy.sh` with auto-rollback
- **Maintenance mode:** Cookie-based bypass via `_rv_preview` endpoint
- **Notable issues encountered:** `package-lock.json` tracking conflict, platform mismatch between Windows/Linux
- **Status:** Server is live and running with latest code

### Breakpoint Change
- `lg` breakpoint changed from 1024px → **1150px** in `apps/client/tailwind.config.js`
- Below 1150px = mobile/tablet view (iPad Pro included)
- Above 1150px = desktop view

### File Consolidation (July 13, 2026)
- Old files DELETED (7): `deployment.md`, `DEPLOYMENT_CHECKLIST.md`, `instructions.md`, `phase.md`, `RavivarVichar_CMS_Implementation_Plan.md`, `futurePlan.md`, `ToBeDone.md`
- New files CREATED (3): `DEPLOYMENT_GUIDE.md`, `ROADMAP.md`, `OriginalDeploymentGuide.md`
- Kept: `DEPLOYMENT_REFERENCE.md` (updated), `resume_prompt.md` (this file)
- See `ROADMAP.md` for full project status and execution priority
- See `DEPLOYMENT_GUIDE.md` for deployment instructions
- See `OriginalDeploymentGuide.md` for lessons learned (final production deploy prep)

### Deploy Script Updated
- `scripts/deploy.sh` — Quick Commands section updated with Deploy Workflow (5-step) and Maintenance Helpers sections

### AI Workflow Commands
- **"Run sanity check"** — Compares current code against `DEPLOYMENT_REFERENCE.md` Sections 1-8, runs builds, reports PASS/FAIL
- **"Update deployment reference"** — Only after successful push. Buffy captures current state into `DEPLOYMENT_REFERENCE.md` with version/date/metadata
- **"Pull up deployment procedure"** — Shows the deploy workflow from `DEPLOYMENT_GUIDE.md`

---

### Last Session — Summary of All Changes

#### Bug Fixes
1. **Server crash fix** — `contact.routes.js` was missing `updateStatus` in the destructured import from the controller. Caused `ReferenceError` on startup.
2. **Duplicate `module.exports`** — 4 route files (joinInitiative, featureRequest, newsletter, partnerApplication) had duplicate `module.exports = router;` lines. Cleaned up.
3. **Admin idle timeout redirect** — Changed `window.location.href = '/login'` → `window.location.reload()` in axios interceptor. Old code navigated to main site's `/login` (blank page) instead of admin SPA's internal `/login` when deployed at subpath.
4. **Upload middleware fix** — Removed invalid `image/jpg` MIME type, added `image/bmp`, `image/tiff`, `image/svg+xml`, and `startsWith('image/')` fallback to accept ALL image formats.
5. **Multer error handling** — Added MulterError handling to `error.middleware.js` with clear messages (LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, LIMIT_UNEXPECTED_FILE).

#### Status System Overhaul (All 5 Submission Types)
- **Before**: `pending` / `reviewed` / `denied` (deny auto-deleted)
- **After**: `under-consideration` / `approved` / `posted` / `denied` (deny just sets status, no delete)
- Updated all 5 models: ContactMessage, Newsletter, FeatureRequest, JoinInitiative, PartnerApplication
- Updated all 5 controllers — `updateStatus` validates against new enum
- Updated SubmissionDetail.jsx — 4 colored buttons: Approved (green), Under Consideration (yellow), Posted (blue), Deny (red)

#### Admin Panel Improvements
- **Review button** — Submission resources now show a labeled "Review" button (Search icon) instead of pencil icon
- **Status column** — Added colored StatusBadge in ContentList for submission resources
- **StatusBadge colors** — Added color styles for `under-consideration` (yellow), `approved` (green), `posted` (blue), `denied` (red)
- **"Add Medi" fix** — Changed media label from `'Media'` to `'Media Items'` so add button shows "Add Media Item"
- **New sidebar sections** — Added 3 dedicated management sections:
  - **Research & Reports** (filters articles by category "Research")
  - **Success Stories** (filters articles by category "Success Stories")
  - **Interviews** (filters articles by category "Interview")
  - Each has its own list page, editor (category pre-set), and sidebar entry
  - EditorForm now supports `defaultValues` and `singularLabel` props
  - ContentList now supports `singularLabel` field for proper singular names

#### Hardcoded Data Removed
All 4 homepage components now fetch from APIs and return `null` when no data:
- **MediaMentions.jsx** — Removed 3 hardcoded fallback entries. Fetches from `/media-mentions` API.
- **FeaturedResearch.jsx** — Removed 3 hardcoded "Success Stories". Fetches from `/articles?category=Success Stories`.
- **Partners.jsx** — Removed 6 hardcoded partners. Fetches from `/partners?status=active`. Shows logos or auto-generates initials.
- **Testimonials.jsx** — Removed 3 hardcoded testimonials. Fetches from `/testimonials`. Handles `image`/`photo`, `quote`/`content`, `role`/`designation`.

#### Database Cleanup
- **PageSection cleanup** — Deleted 9 old ghost documents (`mission`, `articles`, `stats`, `projects`, `videos`, `events`, `membership`, `donate`, `newsletter`) from before the enum was narrowed
- **Fixed `programs.visible=false`** — Was causing "What We Do" section to be hidden on homepage
- Created `apps/server/src/seed/cleanupSections.js` (one-time migration script, can be removed)

#### Knowledge Hub Screens Issues
- The 4 Knowledge Hub sections (Articles, Research & Reports, Success Stories, Interviews) are all articles with different category values
- Admin sidebar now shows dedicated entries for each with pre-set category
- Category is shown as a read-only badge in the editor form

---

## Next Steps / Remaining Work

### Immediate Items
1. **ProgramsGrid.jsx** — Still has hardcoded "What We Do" content. Needs to be dynamic.
2. **About.jsx** — Still has hardcoded stats, timeline, team, values. Needs to be dynamic.
3. **Hero.jsx** — Has hardcoded images. May need to be configurable.
4. **Deployment** — Server already deployed on staging droplet. For final production, see `OriginalDeploymentGuide.md`.
5. **See `ROADMAP.md` Future Features section** for local storage migration plan, seed data population, etc.
6. **Seed data** — `npm run seed` is outdated. New models (MediaMention, GalleryImage, FeatureRequest, JoinInitiative, PartnerApplication) aren't seeded.

### Infrastructure / CI
- PM2 process manager setup for production
- Nginx/Caddy reverse proxy config for client, admin, API
- SSL cert via Let's Encrypt
- MongoDB connection to Atlas (currently local)
- Environment vars for production

### Phase 5 — Integrations (Not Started)
- Newsletter signup + email (Resend/Nodemailer)
- Donations (Razorpay/Stripe)
- Membership management
- Contact form backend
- Pageview analytics tracking

### Known Issues
- EditorForm title uses `pluralLabel.slice(0, -1)` fallback — edge cases like "Media" → "Medi" still exist for some resources
- ContentHub shows "0 items" for the 3 new sections (researchReports, successStories, interviews) because analytics doesn't count by category
- ProgramsGrid.jsx still has hardcoded data (not yet rewritten)

---

## Resuming Work

When the user says "continue", first check:
1. Is the dev server running? If not, start it.
2. Which issue do they want to work on next?
3. Read the full conversation summary in this file for context.

See `ROADMAP.md` for the complete project roadmap and execution priority.
