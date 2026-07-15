# RavivarVichar CMS — Roadmap

> **Living document**: current project status, completed phases, upcoming features, and future plans.
>
> For detailed schema/API references, see `DEPLOYMENT_REFERENCE.md`.  
> For deployment instructions, see `DEPLOYMENT_GUIDE.md`.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Current Status](#2-current-status)
- [3. Phase 1-4 — Complete ✅](#3-phase-1-4--complete-)
- [4. Phase 5 — Integrations ⏳ Pending](#4-phase-5--integrations--pending)
- [5. Phase 6 — Polish & Deploy ⏳ Pending](#5-phase-6--polish--deploy--pending)
- [6. Future Features](#6-future-features)
- [7. Execution Priority](#7-execution-priority)

---

## 1. Project Overview

**RavivarVichar** is a full-stack CMS platform for an NGO/research organization focused on rural women's entrepreneurship and financial inclusion in Rajasthan, India.

### Architecture

```
ravivarVichar/                     ← Monorepo (npm workspaces)
├── apps/
│   ├── client/                    ← Public website (React 18 + Vite + Tailwind)
│   ├── admin/                     ← Admin dashboard (React 18 + Vite + Tailwind)
│   └── server/                    ← Express API + MongoDB
├── packages/
│   └── shared/                    ← Shared Zod validation schemas
├── DEPLOYMENT_GUIDE.md            ← Deployment instructions
├── DEPLOYMENT_REFERENCE.md        ← Schema/API reference (actively maintained)
├── OriginalDeploymentGuide.md     ← Lessons learned for final production deploy
└── ROADMAP.md                     ← ← YOU ARE HERE
```

### Design Tokens

```css
--color-primary: #F5A623;       /* warm orange */
--color-secondary: #6AA84F;     /* soft sage green */
--color-accent-blue: #5DADE2;
--color-accent-red: #D96C6C;
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Client) | React 18 + Vite + Tailwind CSS 3 + React Router v6 + Framer Motion + react-helmet-async + lucide-react |
| Frontend (Admin) | React 18 + Vite + Tailwind CSS 3 + Zustand + TanStack Table + TipTap + Recharts + React Hook Form + Zod + dnd-kit |
| Backend | Express + Mongoose + JWT + bcrypt + Multer + Cloudinary (optional) |
| Shared | Zod validation schemas |
| Planned | Resend/Nodemailer (email), Razorpay/Stripe (payments) |

---

## 2. Current Status

| Phase | Description | Status | Progress |
|-------|-------------|--------|----------|
| 1 | Foundation (Monorepo, Express, MongoDB, Auth, Models) | ✅ Complete | 100% |
| 2 | Core CMS APIs (CRUD for all resources) | ✅ Complete | 100% |
| 3 | Admin Dashboard (Login, DataTable, Editors, Charts) | ✅ Complete | 100% |
| 4 | Public Website (All pages, SEO, responsive) | ✅ Complete | 100% |
| 4b | Mobile Responsive Polish (Phases 1-3) | ✅ Complete | 100% |
| 5 | Integrations (Email, Payments, Analytics) | ⏳ Pending | 0% |
| 6 | Final Polish & Production Deploy | ⏳ Pending | 0% |

**Overall Progress**: ~70% — Core product is built, integrations and final deploy remain.

---

## 3. Phase 1-4 — Complete ✅

### Key Decisions Made

1. **Single admin role** — not 4 roles. Auth check is `protect` middleware with JWT.
2. **SEO is high priority** — semantic HTML, react-helmet-async, Open Graph, JSON-LD, clean URLs.
3. **Admin content flow**: Login → Dashboard → ContentHub → DataTable → Editor form → Publish.
4. **JavaScript only** — no TypeScript.
5. **Local MongoDB** — not Atlas for development.
6. **No hardcoded data** — All homepage sections fetch from API and return null/hide when no data.
7. **Status system**: `under-consideration` / `approved` / `posted` / `denied` (deny does NOT delete).
8. **Breakpoint**: `lg: 1150px` — below 1150px = mobile view, above = desktop.

### Recent Changes (July 2026) — Mobile Responsive Polish

| Task | File(s) | Change |
|------|---------|--------|
| Hero fonts (42px mobile) | 12 files | Added `max-lg:text-hero-mobile` before `text-3xl lg:text-5xl` |
| Hero padding (12vh mobile) | 12 files | Added `max-lg:pt-[12vh]` |
| Content padding | 12 files | Added `max-lg:px-6` for both sides on mobile |
| Gallery grid fix | Gallery.jsx | Masonry only at `md:`+ |
| Navbar hamburger | Navbar.jsx | `p-2` → `p-3` (48px touch target), `ml-auto` for right alignment |
| Brand text on mobile | Navbar.jsx | `hidden sm:block` → `block` |
| Footer social icons | Footer.jsx | `max-lg:h-11 max-lg:w-11` (44px) |
| Footer newsletter form | Footer.jsx | `max-lg:flex-col` (stacks on mobile) |
| Gallery spacing | Gallery.jsx | `max-lg:py-16` |
| Media tabs overflow | Media.jsx | `max-lg:text-xs max-lg:px-3` |
| Testimonial dots | Testimonials.jsx | `max-lg:w-3 max-lg:h-3` (12px) |
| FloatingDots hidden | FloatingDots.jsx | `max-lg:hidden` |
| KnowledgeHub scroll | KnowledgeHub.jsx | `overflow-x-auto flex-nowrap` on mobile |
| Breakpoint | tailwind.config.js | `lg` changed from 1024px → **1150px** |

### Content Models (16 Collections)

User, Article, Event, ContactMessage, Newsletter, GalleryImage, Partner, PartnerApplication, Testimonial, FeatureRequest, JoinInitiative, MediaMention, PageSection, PageView, ActivityLog, SeoMeta

*Note: Several models from the original plan (Program, Project, Report, Entrepreneur, SHG, Mentor, Donation, Membership) were removed from the server code as part of cleanup.*

---

## 4. Phase 5 — Integrations ⏳ Pending

### 4.1 Newsletter Email Setup

Set up automated email sending for newsletter signups.

**Steps:**
1. Choose email provider — Resend (recommended, generous free tier) or Nodemailer (SMTP)
2. Install dependency — `resend` or `nodemailer`
3. Create `apps/server/src/services/email.service.js` with welcome email template
4. Wire into newsletter controller — call email service after successful signup
5. Future scope: Admin broadcast option to send newsletter to all subscribers

**Status:** 🟡 Not started — signup (DB storage) already works, emails can be manually exported

### 4.2 Donations (Razorpay/Stripe)

Integrate payment gateway for donation flow.

**Steps:**
1. Choose provider — Razorpay (India-focused, simpler) or Stripe
2. Create donation model and API endpoint
3. Build donation form component on client
4. Payment success/cancel pages
5. Admin: Donations list view

**Status:** 🔴 Not started

### 4.3 Contact Form Backend

- ✅ Contact form endpoint already exists and stores messages
- ⬜ Send notification email to admin on new submission

### 4.4 Analytics Expansion

- ✅ In-House Pageview Tracking — Complete (PageView model, traffic dashboard)
- Google Search Console Integration — 🟡 Waiting for domain
- Umami Analytics — 🔴 Deferred

### 4.5 Wire Up Remaining Frontend to Backend

- ✅ Most pages already fetch from API
- ⬜ ProgramsGrid.jsx — still has hardcoded "What We Do" content
- ⬜ About.jsx — still has hardcoded stats, timeline, team, values
- ⬜ Hero.jsx — has hardcoded images

---

## 5. Phase 6 — Polish & Deploy ⏳ Pending

### Animations & Polish
- Framer Motion scroll-triggered animations on all pages
- Loading skeleton components for data fetching
- Toast notifications for form submissions

### Performance
- Lighthouse audit: Performance ≥ 85, SEO ≥ 90, Accessibility ≥ 85
- Image optimization, lazy loading, bundle size optimization

### Production Deploy
- Current server (DigitalOcean droplet) is a **testing/staging server**
- Final production deploy on a **new server** — see `OriginalDeploymentGuide.md` for lessons learned
- Set up domains, SSL, CI/CD

---

## 6. Future Features

### Local Image Storage Migration

**Priority:** Medium — Cloudinary works but adds unnecessary dependency.

Move from Cloudinary to local server storage. The app already supports this as fallback (no Cloudinary env vars → saves to `apps/server/uploads/`).

**Steps:**
1. Stop setting CLOUDINARY env vars in production → upload controller auto-falls back to local storage
2. Optionally remove `cloudinary` npm package
3. Set up backup for uploads folder (cron job with rsync)
4. Add image compression on upload (sharp.js)

**Why:** 25GB DigitalOcean storage is plenty for an NGO site (1-3GB for images). One less third-party dependency.

### Admin Maintenance Mode Toggle

**Priority:** Low — SSH toggle works fine for admin.

Add a toggle button in admin panel so team members can enable/disable maintenance mode without SSH access.

### Seed Data Population

**Priority:** Medium

Populate database with sample content so the site looks complete on first deploy: media mentions, success stories, interviews, testimonials, partner logos, gallery images.

---

## 7. Execution Priority

| Priority | Feature | Depends On | Effort |
|----------|---------|------------|--------|
| 🥇 High | Wire up ProgramsGrid & About page to API | — | Small |
| 🥇 High | Seed data population | — | Medium |
| 🥈 Medium | Local image storage migration | — | Small |
| 🥈 Medium | Newsletter email setup | API key | Small |
| 🥈 Medium | Final production deploy (new server) | Domains | Large |
| 🥉 Low | Donations integration | Payment gateway | Medium |
| 🥉 Low | Admin maintenance toggle | — | Small |
| 🥉 Low | Contact form email notification | — | Small |
| 🔵 Deferred | Google Search Console integration | Domain required | Medium |
| 🔵 Deferred | Umami Analytics | — | Medium |
| 🔵 Deferred | Analytics expansion (Read analytics, Author analytics, etc.) | Traffic data | Large |
