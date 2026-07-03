# RavivarVichar CMS — Phase Tracking

> **Project**: Full-stack NGO/research-org content platform (MERN stack)
> **Structure**: Monorepo — `apps/client` (public), `apps/admin` (dashboard), `apps/server` (API), `packages/shared` (Zod schemas)
> **Auth**: Single admin role with JWT (access + refresh tokens)
> **SEO Priority**: High — semantic HTML, Open Graph, JSON-LD, sitemap, react-helmet-async
> **UI Design Spec**: Minimalistic, elegant, editorial, spacious, premium. Colors: orange #F5A623, green #6AA84F, blue #5DADE2, red #D96C6C. Fonts: Playfair Display + Inter.

---

## Phase Overview

| # | Phase | Status | Timeline |
|---|-------|--------|----------|
| 1 | Foundation | ✅ Complete | Week 1 |
| 2 | Core CMS APIs | ✅ Complete | Week 2 |
| 3 | Admin Dashboard | ✅ Complete | Weeks 3–4 |
| 4 | Public Website | ✅ Complete | Weeks 5–6 |
| 5 | Integrations | ⏳ Pending | Week 7 |
| 6 | Polish & Deploy | ⏳ Pending | Week 8 |

---

## Phase 1 — Foundation ✅ Complete

### Objective
Set up the entire monorepo from scratch: project structure, Express server with middleware, MongoDB connection, JWT authentication, all Mongoose models, and a seed script to load sample data.

### Detailed Task Breakdown

#### 1.1 — Monorepo Setup
- [x] Initialize root `package.json` with npm workspaces
- [x] Create directory structure: `apps/server`, `apps/client`, `apps/admin`, `packages/shared`
- [x] Create `packages/shared/package.json` with Zod dependency
- [x] Create initial shared schemas (Zod): `index.js`, article/project schemas
- [x] Root `.gitignore` (node_modules, .env, dist, build)
- [x] Root `.env.example` with all environment variables

#### 1.2 — Express Server Skeleton
- [x] `apps/server/package.json` with all dependencies
- [x] `src/server.js` — entry point, starts HTTP server
- [x] `src/app.js` — Express app wiring: CORS, JSON parser, cookie parser, morgan, rate limiter, routes mount, error handler
- [x] `src/config/env.js` — validate environment variables with Zod
- [x] `src/config/db.js` — Mongoose connection
- [x] `src/config/cloudinary.js` — Cloudinary SDK configuration

#### 1.3 — Utility Functions
- [x] `src/utils/apiResponse.js` — Standard response helper
- [x] `src/utils/catchAsync.js` — Async error wrapper
- [x] `src/utils/paginate.js` — Mongoose pagination helper
- [x] `src/utils/generateSlug.js` — Slug generator

#### 1.4 — Error & Auth Middleware
- [x] `src/middlewares/error.middleware.js` — Global error handler
- [x] `src/middlewares/auth.middleware.js` — JWT verification
- [x] `src/middlewares/validate.middleware.js` — Zod validation
- [x] `src/middlewares/upload.middleware.js` — Multer memory storage
- [x] `src/middlewares/rateLimiter.middleware.js` — Rate limiting

#### 1.5 — Auth System
- [x] `src/models/User.js` — Mongoose schema (name, email, password, role: 'admin')
- [x] `src/controllers/auth.controller.js` — Login, register, refresh, logout, getMe
- [x] `src/routes/auth.routes.js` — POST /login, POST /register, POST /refresh, POST /logout, GET /me
- [x] Password hashing with bcrypt (pre-save hook)
- [x] Access token (15 min) + Refresh token (7 days, httpOnly cookie)

#### 1.6 — All Mongoose Models
- [x] Article, Program, Project, Partner, Report, Entrepreneur, SHG, Mentor, Event, MediaItem, Testimonial, Newsletter, Donation, Membership, PageSection, SeoMeta, ActivityLog

#### 1.7 — Seed Script
- [x] `src/seed/data.json` — All sample data
- [x] `src/seed/seed.js` — Script to clear and reload database
- [x] NPM script: `"seed": "node src/seed/seed.js"`

#### 1.8 — Verification
- [x] Server starts without errors
- [x] MongoDB connects successfully
- [x] Auth endpoints work (login returns JWT, refresh works)
- [x] Seed script loads sample data
- [x] All 18+ Mongoose models compile

### Phase 1 Completion Checklist
| Item | Done |
|------|------|
| Monorepo structure created | ✅ |
| Express server starts on `:5000` | ✅ |
| MongoDB (local) connected | ✅ |
| JWT login/register/refresh/logout working | ✅ |
| All Mongoose models (18) created | ✅ |
| Seed script loads sample data | ✅ |
| `.env.example` documented | ✅ |
| Zod validation wired on auth routes | ✅ |
| Shared package with Zod schemas | ✅ |

---

## Phase 2 — Core CMS APIs ✅ Complete

### Objective
Build full CRUD REST APIs for every content resource with pagination, search, sorting, and admin-gated write access.

### Detailed Task Breakdown

#### 2.1 — API Structure
- [x] `src/routes/index.js` — Mount all routers under `/api/v1`
- [x] Standard conventions: list (GET), detail (GET /:id or /:slug), create (POST), update (PUT /:id), delete (DELETE /:id)
- [x] All list endpoints: `?page=&limit=&sort=&search=&status=&category=`
- [x] Admin auth required for POST/PUT/DELETE; public GET for client

#### 2.2 — Controllers & Routes (each resource)
- [x] Article — CRUD + filter by status/category/featured + increment views
- [x] Program — CRUD
- [x] Project — CRUD + filter by status
- [x] Partner — CRUD + filter by category/status
- [x] Report — CRUD + filter by category/year
- [x] Entrepreneur — CRUD + filter by district/sector
- [x] SHG — CRUD + filter by district
- [x] Mentor — CRUD + filter by skills
- [x] Event — CRUD + filter by type (upcoming/past)
- [x] MediaItem — CRUD + filter by type
- [x] Testimonial — CRUD + filter by featured

#### 2.3 — Upload Endpoint
- [x] `src/controllers/upload.controller.js` — Upload image to Cloudinary via Multer
- [x] `src/routes/upload.routes.js` — POST /upload (single & multiple)

#### 2.4 — Analytics Endpoint
- [x] `src/controllers/analytics.controller.js` — GET /analytics/summary
- [x] Activity logging — every create/update/delete action logged to ActivityLog

#### 2.5 — Homepage Builder API
- [x] CRUD for PageSection — get/set order and visibility of homepage sections

#### 2.6 — Verification
- [x] All 11+ resource routes respond correctly
- [x] Pagination, search, sort work on list endpoints
- [x] Admin auth gates write operations
- [x] Public GET routes accessible without token
- [x] Upload to Cloudinary works (dev mode fallback)
- [x] Analytics summary returns counts

### Phase 2 Completion Checklist
| Item | Done |
|------|------|
| All CRUD controllers written | ✅ |
| All routes mounted under `/api/v1` | ✅ |
| Pagination/search/sort on list endpoints | ✅ |
| Auth middleware on write routes | ✅ |
| Cloudinary upload endpoint | ✅ |
| Analytics summary endpoint | ✅ |
| Activity logging implemented | ✅ |

---

## Phase 3 — Admin Dashboard ✅ Complete

### Objective
Build the full React admin dashboard with login, sidebar, content management flow, analytics, and homepage builder.

### Detailed Task Breakdown

#### 3.1 — Project Setup
- [x] Initialize Vite + React admin app in `apps/admin` on port 5174
- [x] Install dependencies: react-router-dom, @tanstack/react-table, react-hook-form, @hookform/resolvers, zod, @tiptap/react, @tiptap/starter-kit, recharts, zustand, axios, react-helmet-async, clsx, tailwind-merge
- [x] Configure Tailwind with project design tokens (orange/green palette, inter/playfair fonts)
- [x] Custom CSS component classes: pill buttons, card styles, containers, section spacing, decorative dots
- [x] Vite proxy: `/api` → `http://localhost:5000`

#### 3.2 — Auth & Layout
- [x] Login page — email + password form with demo credentials pre-filled
- [x] Zustand auth store — manages JWT token, user info, localStorage persistence
- [x] Axios interceptor — attaches Authorization header, auto-refresh on 401, redirect to login
- [x] Sidebar component — collapsible, nav groups (Dashboard, Manage Content, Analytics, Admin)
- [x] Topbar component — user info, logout button
- [x] ProtectedRoute wrapper — redirects to `/login` if not authenticated
- [x] DashboardLayout — Sidebar + Topbar + Outlet

#### 3.3 — Dashboard Page
- [x] Content overview stat cards (total articles, programs, projects, events, partners) — clickable
- [x] ContentPieChart — Recharts pie chart showing distribution across content types
- [x] MonthlyPostChart — Recharts bar chart showing posts per month
- [x] Recent Activity feed — last 20 actions from ActivityLog
- [x] Quick action buttons: "Add Article", "Add Project", "Add Event"

#### 3.4 — Content Management Flow
- [x] **ContentHub** page — grid of 11 content type cards with live counts from API
- [x] **DataTable** reusable component (TanStack Table) with:
  - Column sorting (click header)
  - Search/filter input
  - Pagination controls
  - Row actions (Edit, Delete, Toggle status)
- [x] **Content List pages** — 11 list page wrappers using DataTable
- [x] **EditorForm** reusable component — uses react-hook-form with Zod validation
- [x] **9 Editor implementations** — Article, Program, Project, Report, Event, Partner, Directory (3), Media, Testimonial
- [x] **RichTextEditor** — TipTap with full toolbar: Bold/Italic/Underline/Strikethrough, H1/H2/H3, Lists, Blockquote, Link, Image, Undo/Redo

#### 3.5 — Additional Admin Pages
- [x] **Analytics page** — expanded charts + content breakdown table
- [x] **SEO panel** — global SEO settings (UI only, no backend endpoint yet)
- [x] **HomepageBuilder** — dnd-kit drag & drop section ordering with visibility toggles
- [x] **Users page** — view admin user + add new user modal
- [x] **Settings page** — site name, tagline, contact info, social links (UI only)

#### 3.6 — UI Components
- [x] ImageUpload — click-to-upload via API with preview
- [x] ConfirmDialog — delete confirmation modal
- [x] StatusBadge — published/draft/archived pill badges
- [x] StatCard — metric card with icon and trend
- [x] LoadingSpinner — centered spinner

#### 3.7 — Verification
- [x] Login/logout flow works
- [x] Sidebar navigation renders correctly
- [x] ContentHub shows correct counts from API
- [x] DataTable displays and paginates content
- [x] Editor forms save and load data correctly
- [x] TipTap editor produces valid HTML
- [x] Charts render with data
- [x] Homepage builder drag-and-drop works
- [x] Build passes (`npx vite build`)

### Phase 3 Completion Checklist
| Item | Done |
|------|------|
| Admin Vite app initialized on port 5174 | ✅ |
| Login + auth flow working (JWT refresh) | ✅ |
| Sidebar + Topbar layout | ✅ |
| Dashboard with stats + charts | ✅ |
| ContentHub page (11 content types) | ✅ |
| DataTable component (sort/search/paginate) | ✅ |
| All editor forms (9 types) | ✅ |
| TipTap rich text editor with toolbar | ✅ |
| Homepage drag-drop builder | ✅ |
| SEO panel, Analytics, Users, Settings pages | ✅ |
| Admin build passes | ✅ |

---

## Phase 4 — Public Website ✅ Complete

### Objective
Build the complete public-facing website with all pages, homepage sections, and SEO optimization.

### Detailed Task Breakdown

#### 4.1 — Project Setup
- [x] Initialize Vite + React client app in `apps/client` on port 5173
- [x] Install dependencies: react-router-dom, axios, react-helmet-async, framer-motion, clsx, lucide-react, tailwind-merge
- [x] Configure Tailwind with full design spec tokens (colors, fonts, radii, shadows, animations, spacing, max widths)
- [x] Custom CSS component classes: pill buttons, card hover effects, container widths, section spacing, decorative dots, blob masks, scroll animations
- [x] Vite proxy: `/api` → `http://localhost:5000`
- [x] Axios client instance pointing to `/api/v1`

#### 4.2 — Layout Components
- [x] **Navbar** — 90px height, logo left / nav center / CTA right, transparent→solid white on scroll, mobile hamburger menu with animated entry, active route highlighting
- [x] **Footer** — brand column with mission, 3 link columns (Quick Links, Programs, Resources), social icons (Facebook/Twitter/Instagram/LinkedIn), newsletter signup form, copyright bar
- [x] **PageLayout** — re-usable wrapper with Navbar + main + Footer

#### 4.3 — Shared Components
- [x] **Button** — primary/secondary/outline variants, href/to/onClick, arrow support
- [x] **Card** — image zoom on hover, category badge, date/author metadata, read-more link, hover lift + shadow
- [x] **SectionHeading** — label (orange uppercase) + serif title + description, center/left alignment
- [x] **FloatingDots** — decorative animated colored dots (orange/green/blue/red) with float animation

#### 4.4 — Homepage Sections (14 sections, in order)
- [x] **Hero** — Two-column 45/55, 64px heading, organic blob-masked image collage (3 overlapping images with different masks), floating dots, primary + secondary CTAs
- [x] **Mission** — Circular image collage (3 overlapping circles + dotted pattern), mission statement, reverse layout
- [x] **ProgramsGrid** — 3 program cards, 28px radius, staggered fade-up animation, hover lift
- [x] **FeaturedResearch** — 2 alternating text/image items, tags + author + date metadata
- [x] **LatestArticles** — 3 blog cards with image placeholders, category badges, date/author, read-more link
- [x] **ImpactStats** — 4 stat counters in green rounded cards, decorative patterned background
- [x] **CurrentProjects** — 2 project cards with status badges, location, progress bars, impact tags
- [x] **Partners** — 6 partner logo cards with initials, hover lift effect
- [x] **VideosSection** — 2 video cards with Play overlay, duration badges, title/date
- [x] **Testimonials** — AnimatePresence carousel with left/right arrows + dot indicators, quote styling
- [x] **EventsPreview** — 2 event cards, image-left/content-right layout, date badges
- [x] **MembershipCTA** — Gradient card with icon, heading, 2 CTAs (Join / Learn More)
- [x] **DonateCTA** — Dark gradient card with heart icon, CTAs
- [x] **Newsletter** — Email input + submit, success state message

#### 4.5 — Inner Pages (11 pages)
- [x] **About** — Hero with stats, Mission/Vision/Approach cards, 6-event timeline with alternating layout, 4 team cards, CTA section
- [x] **Programs** — 6 program cards with icons, categories, stats, hover effects, link to detail
- [x] **ProgramDetail** — Dynamic slug-based render, hero with program colors, 4 stats, 4 approach steps, impact checklist, CTA
- [x] **Knowledge Hub** — 9 article cards, category filters (All/Research/Case Study/Impact Story/Policy Brief/Opinion), search bar
- [x] **ArticleDetail** — Dynamic slug-based render, full HTML content with `generateContent` helper for all 9 articles, share sidebar (Twitter/LinkedIn/Facebook), tags, 3 related articles
- [x] **Events** — 6 event cards, upcoming/past/all filter, date badges, location/time/attendees, Register/View buttons
- [x] **Contact** — Contact info (map/phone/email/hours), form with name/email/subject/message + validation + loading state + success state, FAQ accordion with 4 questions
- [x] **Donate** — 4 donation tiers (₹500 to ₹10,000) with "Most Popular" badge, custom amount input, impact stats, "Why Donate" benefits, 3 "Other Ways to Support" cards
- [x] **Research** — 6 reports, search bar, 4 category filters, download buttons
- [x] **Media** — 3 tabs (Gallery/Videos/Press Releases), gallery grid with hover overlays, video cards with play button, press release items with source + date

#### 4.6 — SEO Implementation
- [x] Every page has unique `<title>` and `<meta>` via react-helmet-async
- [x] Open Graph tags (og:title, og:description, og:type, og:url)
- [x] Twitter Card tags (summary_large_image)
- [x] JSON-LD structured data (NGO schema on Home)
- [x] Semantic HTML (header, nav, main, article, section, footer)
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [ ] XML sitemap generation endpoint — not yet built

#### 4.7 — Verification
- [x] All 11 pages render without errors
- [x] Homepage loads with all 14 sections in correct order
- [x] Navigation works (routes, links, mobile menu)
- [x] SEO meta tags present in head
- [x] Responsive design across mobile/tablet/desktop
- [x] Build passes (`npx vite build`)

### Phase 4 Completion Checklist
| Item | Done |
|------|------|
| Client Vite app initialized on port 5173 | ✅ |
| Layout components (Navbar, Footer, PageLayout) | ✅ |
| Shared components (Button, Card, SectionHeading, FloatingDots) | ✅ |
| All 14 homepage sections | ✅ |
| Inner pages (About, Programs, Knowledge Hub, Events, Contact, Donate, Research, Media) | ✅ |
| Dynamic detail pages (ProgramDetail, ArticleDetail) | ✅ |
| SEO meta tags on every page | ✅ |
| JSON-LD structured data on Home | ✅ |
| Responsive design | ✅ |
| Build passes | ✅ |
| XML sitemap + robots.txt | ❌ |

---

## Phase 5 — Integrations

### Objective
Add external service integrations: newsletter, donations, membership, contact form, and analytics tracking.

### Detailed Task Breakdown

#### 5.1 — Newsletter
- [ ] Resend/Nodemailer email service setup
- [ ] Newsletter signup endpoint (store email in DB)
- [ ] Welcome email on signup
- [ ] Admin: Newsletter list view + send broadcast option

#### 5.2 — Donations
- [ ] Razorpay/Stripe integration (test mode)
- [ ] Donation form component (amount, purpose, donor info)
- [ ] Payment success/cancel pages
- [ ] Donation model stores transaction details
- [ ] Admin: Donations list view

#### 5.3 — Membership
- [ ] Membership form (name, email, phone, type)
- [ ] Admin: Members list view

#### 5.4 — Contact Form
- [ ] Contact form endpoint → stores message + sends notification email
- [ ] Admin: Contact submissions view

#### 5.5 — Analytics Tracking
- [ ] Pageview logging → ActivityLog model
- [ ] Simple analytics middleware logs each page visit
- [ ] Admin analytics page shows pageview trends

#### 5.6 — Wire Up Frontend to Backend
- [ ] Homepage sections fetch real data from API (articles, programs, stats, etc.)
- [ ] Knowledge Hub fetches articles from API
- [ ] Events page fetches from API
- [ ] Programs detail fetches from API
- [ ] Replace all hardcoded data with API calls

#### 5.7 — Verification
- [ ] Newsletter signup stores email and sends welcome email
- [ ] Donation flow works end-to-end (test mode)
- [ ] Membership form saves to DB
- [ ] Contact form stores + emails notification
- [ ] Pageviews tracked in ActivityLog
- [ ] Public site shows real content from API

### Phase 5 Completion Checklist
| Item | Done |
|------|------|
| Newsletter signup + welcome email | ❌ |
| Donation flow (Razorpay/Stripe) | ❌ |
| Membership form | ❌ |
| Contact form + email notification | ❌ |
| Pageview analytics tracking | ❌ |
| Wire up frontend to backend API | ❌ |
| Admin views for all submissions | ❌ |

---

## Phase 6 — Polish & Deploy

### Objective
Add animations, performance optimization, responsive QA, and deploy all apps to production.

### Detailed Task Breakdown

#### 6.1 — Animations & Polish
- [ ] Framer Motion scroll-triggered animations (fade-up, stagger) on all pages
- [ ] Smooth page transitions between routes
- [ ] Loading skeleton components for data fetching
- [ ] Toast notifications for form submissions
- [ ] Hover states and micro-interactions throughout

#### 6.2 — QA & Performance
- [ ] Responsive testing: mobile, tablet, desktop
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Lighthouse audit: Performance ≥ 85, SEO ≥ 90, Accessibility ≥ 85
- [ ] Image optimization (Cloudinary transformations)
- [ ] Bundle size analysis and optimization
- [ ] Lazy loading for below-fold content

#### 6.3 — Documentation
- [ ] README.md — project overview, setup instructions, architecture
- [ ] API documentation — all endpoints, request/response examples
- [ ] Environment variables guide

#### 6.4 — Deploy
- [ ] Server → Render (or Railway)
  - [ ] Health check endpoint
  - [ ] Production CORS config
  - [ ] Environment variables on Render dashboard
- [ ] Client → Vercel
  - [ ] Vercel project linked to GitHub
  - [ ] Custom domain (if applicable)
  - [ ] Environment variables configured
- [ ] Admin → Vercel (separate project)
  - [ ] Password-protected or SSO (optional)
  - [ ] Environment variables configured
- [ ] Database → MongoDB Atlas free tier
  - [ ] IP whitelist for Render/Vercel
  - [ ] Database user created
- [ ] Post-deployment smoke test
  - [ ] All pages load
  - [ ] Admin login works
  - [ ] CRUD operations succeed
  - [ ] Public site fetches data from API

### Phase 6 Completion Checklist
| Item | Done |
|------|------|
| Framer Motion scroll animations | ❌ |
| Page transitions | ❌ |
| Loading skeletons | ❌ |
| Lighthouse scores met | ❌ |
| README + API docs written | ❌ |
| Server deployed on Render | ❌ |
| Client deployed on Vercel | ❌ |
| Admin deployed on Vercel | ❌ |
| MongoDB Atlas configured | ❌ |
| Post-deployment tests pass | ❌ |

---

## Phase History

| Date | Phase | Action | Notes |
|------|-------|--------|-------|
| Session 1 | 1 | Foundation built | Monorepo, Express, MongoDB, JWT auth, 18 models, seed script |
| Session 2 | 2 | Core CMS APIs built | 11 CRUD controllers, routes, pagination, upload, analytics, activity logging |
| Session 3 | 3 | Admin Dashboard built | 32 files: login, sidebar, DataTable, TipTap editors, charts, homepage builder, all pages |
| Session 4 | 4 | Public Website built | 36 files: layout, 14 homepage sections, 11 inner pages, SEO, design spec tokens |

---

## Project Completion

| Phase | Status | Completed Date | Notes |
|-------|--------|----------------|-------|
| 1 — Foundation | ✅ Complete | Session 1 | Monorepo, Express, MongoDB, JWT auth, 18 models, seed |
| 2 — Core CMS APIs | ✅ Complete | Session 2 | Full CRUD with pagination/search/sort, auth-gated writes, upload, analytics, activity logging |
| 3 — Admin Dashboard | ✅ Complete | Session 3 | 32 files: ContentHub, DataTable, TipTap editors (9 types), charts, drag-drop homepage builder, all admin pages |
| 4 — Public Website | ✅ Complete | Session 4 | 36 files: Navbar/Footer, 14 homepage sections, 11 inner pages, shared components, SEO |
| 5 — Integrations | ⏳ Not started | — | Newsletter, donations, membership, contact form, API wiring |
| 6 — Polish & Deploy | ⏳ Not started | — | Animations, QA, deploy to Vercel/Render/MongoDB Atlas |

**Overall Progress**: ~65% — 🏁 Phases 1–4 complete. Ready for Phase 5 (Integrations).
