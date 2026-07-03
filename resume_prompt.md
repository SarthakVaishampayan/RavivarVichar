# Resume Prompt — RavivarVichar CMS

> **Instructions to Codebuff**: Read this file first to restore full project context. After reading, the user will tell you which phase to begin.

---

## Project Overview

Building a **full-stack CMS platform** for **RavivarVichar** — an NGO/research organization focused on rural women's entrepreneurship and financial inclusion in Rajasthan, India.

### Architecture
```
ravivarvichar-cms/                  ← Monorepo (npm workspaces)
├── apps/
│   ├── client/                    ← Public website (React 18 + Vite + Tailwind)
│   ├── admin/                     ← Admin dashboard (React 18 + Vite + Tailwind)
│   └── server/                    ← Express API
├── packages/
│   └── shared/                    ← Shared Zod validation schemas
├── phase.md                       ← Phase tracking & progress
├── resume_prompt.md               ← This file
├── RavivarVichar_CMS_Implementation_Plan.md  ← Full implementation plan
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
7. **UI Design Spec** — public website follows a specific design spec: minimalistic, elegant, editorial, spacious, premium. Colors: warm orange (#F5A623), soft green (#6AA84F), muted blue (#5DADE2), soft red (#D96C6C). Fonts: Playfair Display (headings), Inter (body). Pill buttons (999px), 28px card radii, 24px image radii.

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

### Content Models (18+ Mongoose schemas)
Article, Program, Project, Partner, Report, Entrepreneur, SHG, Mentor, Event, MediaItem, Testimonial, Newsletter, Donation, Membership, PageSection, SeoMeta, ActivityLog

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
| 5 — Integrations | ⏳ Not started |
| 6 — Polish & Deploy | ⏳ Not started |

### Files Created

**Phase 1 — Foundation** (Session 1)
- `RavivarVichar_CMS_Implementation_Plan.md` — Full implementation plan
- `phase.md` — Detailed phase tracking with task breakdowns and checklists
- `resume_prompt.md` — This file
- `package.json` — Root workspace config
- `.gitignore` — Standard Node.js gitignore
- `.env.example` — Environment variables template
- `apps/server/` — Complete Express server with auth, 18 models, middleware, seed script
- `packages/shared/` — Shared Zod validation schemas

**Phase 2 — Core CMS APIs** (Session 2)
- 11 CRUD controllers + routes (Articles, Programs, Projects, Partners, Reports, Entrepreneurs, SHGs, Mentors, Events, Media, Testimonials)
- Upload controller (Cloudinary via Multer)
- Analytics summary endpoint (content counts + activity log)
- Homepage builder API (PageSection order/visibility)
- Activity logging on all write operations
- All routes mounted under `/api/v1`

**Phase 3 — Admin Dashboard** (Session 3)
32 files in `apps/admin/src/`:
- `main.jsx`, `App.jsx`, `index.css` — Entry point with Tailwind + custom component classes
- `lib/axios.js` — Axios with auth interceptor (auto-refresh + redirect on 401)
- `lib/constants.js` — Resource configs, nav items, statuses, homepage sections
- `store/authStore.js` — Zustand JWT store with localStorage persistence
- Auth: `Login.jsx`, `ProtectedRoute.jsx`
- Layout: `DashboardLayout.jsx`, `Sidebar.jsx` (collapsible), `Topbar.jsx`
- Dashboard: `Dashboard.jsx` — stat cards, pie chart, bar chart, activity feed, quick actions
- UI: `DataTable.jsx` (TanStack w/ sort/search/paginate), `RichTextEditor.jsx` (TipTap), `ImageUpload.jsx`, `ConfirmDialog.jsx`, `StatusBadge.jsx`, `StatCard.jsx`, `LoadingSpinner.jsx`
- Content management: `ContentHub.jsx` (content type grid), `ContentList.jsx` (reusable list), `ContentListPages.jsx` (11 wrappers), `EditorForm.jsx` (reusable), `Editors.jsx` (9 editor implementations)
- Pages: `Analytics.jsx`, `SEO.jsx`, `HomepageBuilder.jsx` (dnd-kit), `Users.jsx`, `Settings.jsx`
- Routes: `AdminRoutes.jsx` — all routes with ProtectedRoute

**Phase 4 — Public Website** (Session 4)
36 files in `apps/client/src/`:
- `main.jsx`, `App.jsx`, `index.css` — Vite entry, routing, Tailwind + design spec CSS
- `lib/axios.js` — Axios instance pointing to `/api/v1`
- Layout: `Navbar.jsx` (transparent→solid on scroll, mobile hamburger), `Footer.jsx` (large, newsletter), `PageLayout.jsx` (wrapper)
- Shared components: `Button.jsx` (primary/secondary/outline), `Card.jsx` (hover lift, image zoom), `SectionHeading.jsx`, `FloatingDots.jsx`
- Homepage (14 sections): Hero (blob-masked image collage), Mission, ProgramsGrid, FeaturedResearch, LatestArticles, ImpactStats, CurrentProjects, Partners, VideosSection, Testimonials (carousel), EventsPreview, MembershipCTA, DonateCTA, Newsletter
- Inner pages (11 pages): About, Programs (list), ProgramDetail, KnowledgeHub (articles), ArticleDetail, Events, Contact, Donate, Research, Media (gallery/video/press tabs)
- SEO: react-helmet-async on every page, Open Graph, Twitter Card, JSON-LD structured data on Home

### Phase 1 Completed ✅
- Monorepo with npm workspaces set up
- Express server starts on port 5000
- Local MongoDB connected (MONGO_URI: `mongodb://localhost:27017/ravivarvichar`)
- JWT auth: login, register, refresh, logout, getMe (access + refresh tokens)
- Zod validation on auth routes via shared package
- 18 Mongoose models
- Middleware: error handler, JWT auth, Zod validate, Multer upload, Express rate limiter
- Seed script with sample data (run: `npm run seed`)
- Single admin role, JavaScript only (no TypeScript)

### Phase 2 Completed ✅
- Full CRUD REST APIs for all 11 content types
- Pagination, search, sorting on list endpoints
- Admin auth gates write operations; public GET routes accessible without token
- Cloudinary upload endpoint (single + multiple)
- Analytics summary endpoint
- Activity logging on all create/update/delete operations
- Homepage builder API for PageSection order/visibility

### Phase 3 Completed ✅
- Admin Vite app on port 5174
- Login/logout with JWT refresh flow
- Collapsible sidebar, topbar with user info
- Dashboard with Recharts pie + bar charts
- ContentHub → DataTable → Editor flow for all 11 content types
- TipTap rich text editor with full toolbar
- dnd-kit homepage drag-and-drop builder
- SEO panel, Analytics page, Users page, Settings page
- Image upload component

### Phase 4 Completed ✅
- Client Vite app on port 5173 with all design spec tokens
- Navbar (transparent→solid, mobile menu), Footer (links, newsletter, social)
- 14 homepage sections with static demo content (not yet wired to API)
- 11 inner pages: About, Programs (list + detail), Knowledge Hub (list + detail), Events, Contact, Donate, Research, Media
- SEO meta tags on every page, Open Graph, JSON-LD on Home
- PageLayout wrapper component for consistent layout

### Last Session Summary
- Built all 11 inner pages for the public website
- Fixed CSS error from `text-text-primary` → `text-ink-primary` color name conflict
- Renamed color key from `text` to `ink` to avoid Tailwind utility namespace collision
- Fixed nesting bug in tailwind.config (fontFamily inside colors block)
- Added ArticleDetail content for all 9 article slugs
- Cleaned up dead imports across all page files
- Design tokens updated to match user's exact UI spec
- All 11 routes wired in App.jsx

---

## Next Steps

Phase 5 — Integrations: Newsletter signup + email, donations (Razorpay/Stripe), membership, contact form backend, pageview analytics tracking.

See `phase.md` for the complete Phase 5 task breakdown.
