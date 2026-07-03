# RavivarVichar CMS — Full Implementation Plan

A full-stack NGO/research-org content platform: public website + admin CMS, built on the MERN stack.

---

## 1. Project Structure (Monorepo)

```
ravivarvichar-cms/
├── apps/
│   ├── client/                 # Public-facing website (React + Vite)
│   ├── admin/                  # Admin dashboard (React + Vite, separate app)
│   └── server/                 # Node/Express API (shared by both)
├── packages/
│   └── shared/                 # Shared Zod validation schemas & constants
├── .env.example
├── package.json                # root, npm workspaces
└── README.md
```

Using **npm workspaces** keeps client, admin, and server independently deployable but sharing Zod validation schemas — this avoids duplicating validation logic and is a strong resume point ("monorepo with shared validation contracts").

---

## 2. Backend — `apps/server/`

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                  # Mongoose connection
│   │   ├── cloudinary.js
│   │   └── env.js                 # validates process.env with Zod
│   ├── models/
│   │   ├── User.js
│   │   ├── Article.js
│   │   ├── Program.js
│   │   ├── Project.js
│   │   ├── Partner.js
│   │   ├── Collaboration.js
│   │   ├── Report.js              # Research Centre
│   │   ├── Entrepreneur.js
│   │   ├── SHG.js
│   │   ├── Mentor.js
│   │   ├── Event.js
│   │   ├── MediaItem.js           # news/press/podcast/video
│   │   ├── Testimonial.js
│   │   ├── Newsletter.js
│   │   ├── Donation.js
│   │   ├── Membership.js
│   │   ├── PageSection.js         # homepage builder ordering
│   │   ├── SeoMeta.js
│   │   └── ActivityLog.js         # "Recent Activity" feed
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── article.controller.js
│   │   ├── program.controller.js
│   │   ├── project.controller.js
│   │   ├── partner.controller.js
│   │   ├── collaboration.controller.js
│   │   ├── report.controller.js
│   │   ├── directory.controller.js  # entrepreneurs/SHGs/mentors
│   │   ├── event.controller.js
│   │   ├── media.controller.js
│   │   ├── testimonial.controller.js
│   │   ├── newsletter.controller.js
│   │   ├── donation.controller.js
│   │   ├── membership.controller.js
│   │   ├── analytics.controller.js
│   │   ├── seo.controller.js
│   │   ├── homepage.controller.js
│   │   └── upload.controller.js
│   ├── routes/
│   │   ├── index.js                # mounts all routers under /api
│   │   ├── auth.routes.js
│   │   ├── article.routes.js
│   │   ├── program.routes.js
│   │   ├── project.routes.js
│   │   ├── partner.routes.js
│   │   ├── collaboration.routes.js
│   │   ├── report.routes.js
│   │   ├── directory.routes.js
│   │   ├── event.routes.js
│   │   ├── media.routes.js
│   │   ├── testimonial.routes.js
│   │   ├── newsletter.routes.js
│   │   ├── donation.routes.js
│   │   ├── membership.routes.js
│   │   ├── analytics.routes.js
│   │   ├── seo.routes.js
│   │   ├── homepage.routes.js
│   │   └── upload.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verify
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js   # Zod schema validation
│   │   ├── upload.middleware.js     # Multer memory storage
│   │   └── rateLimiter.middleware.js
│   ├── utils/
│   │   ├── generateSlug.js
│   │   ├── sendEmail.js             # Nodemailer/Resend
│   │   ├── apiResponse.js           # standard {success, data, message}
│   │   ├── catchAsync.js
│   │   └── paginate.js
│   ├── validators/                  # Zod schemas per resource
│   │   ├── article.schema.js
│   │   ├── project.schema.js
│   │   └── ...
│   ├── seed/
│   │   └── seed.js                  # loads temp data below into MongoDB
│   ├── app.js                       # express app, middleware wiring
│   └── server.js                    # entry point, starts HTTP server
├── .env
└── package.json
```

### Auth
- JWT access token (short-lived, ~15 min) + refresh token (httpOnly cookie, 7 days)
- **Single admin role** — the only auth check is `isAdmin: true/false`. Simple and effective.
- Bcrypt for password hashing

### Standard API conventions
- Base URL: `/api/v1`
- All list endpoints support `?page=&limit=&sort=&search=`
- All mutating routes (`POST/PUT/PATCH/DELETE`) require admin auth
- Public `GET` routes for the client website (no auth needed)
- Response shape: `{ success: true/false, data: object/array, message: string, meta: { page, total, totalCounts } }`

---

## 3. Public Website — `apps/client/`

```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MegaMenu.jsx         # About/Programs/Knowledge Hub dropdowns
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── Mission.jsx
│   │   │   ├── ProgramsGrid.jsx
│   │   │   ├── FeaturedResearch.jsx
│   │   │   ├── LatestArticles.jsx
│   │   │   ├── ImpactStats.jsx
│   │   │   ├── CurrentProjects.jsx
│   │   │   ├── Partners.jsx
│   │   │   ├── VideosSection.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── EventsPreview.jsx
│   │   │   ├── MembershipCTA.jsx
│   │   │   ├── DonateCTA.jsx
│   │   │   └── Newsletter.jsx
│   │   ├── shared/
│   │   │   ├── Card.jsx
│   │   │   ├── SectionHeading.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── FloatingDots.jsx     # decorative accent
│   │   │   └── SEOHead.jsx          # react-helmet-async wrapper
│   │   └── directory/
│   │       ├── EntrepreneurCard.jsx
│   │       ├── SHGCard.jsx
│   │       └── MentorCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── about/
│   │   │   ├── Story.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── AdvisoryBoard.jsx
│   │   │   └── PartnersPage.jsx
│   │   ├── programs/
│   │   │   ├── ProgramsList.jsx
│   │   │   └── ProgramDetail.jsx
│   │   ├── knowledge-hub/
│   │   │   ├── ArticleList.jsx
│   │   │   ├── ArticleDetail.jsx
│   │   │   ├── Interviews.jsx
│   │   │   ├── CaseStudies.jsx
│   │   │   └── Explainers.jsx
│   │   ├── research/
│   │   │   ├── Reports.jsx
│   │   │   ├── ReportDetail.jsx
│   │   │   ├── PolicyBriefs.jsx
│   │   │   └── OpenData.jsx
│   │   ├── directory/
│   │   │   ├── Entrepreneurs.jsx
│   │   │   ├── SHGs.jsx
│   │   │   └── Mentors.jsx
│   │   ├── media/
│   │   │   ├── News.jsx
│   │   │   ├── PressReleases.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Videos.jsx
│   │   │   └── Podcasts.jsx
│   │   ├── Events.jsx
│   │   ├── EventDetail.jsx
│   │   ├── Collaborate.jsx
│   │   ├── Donate.jsx
│   │   ├── Contact.jsx
│   │   └── ProjectDetail.jsx
│   ├── hooks/
│   │   ├── useArticles.js           # React Query wrappers
│   │   ├── usePrograms.js
│   │   └── useProjects.js
│   ├── lib/
│   │   ├── axios.js                 # base API client
│   │   └── queryClient.js
│   ├── routes/
│   │   └── AppRoutes.jsx            # React Router v6 config
│   ├── styles/
│   │   └── index.css                # Tailwind base + custom fonts
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
└── vite.config.js
```

### Design tokens
```css
--color-primary: #F4A43B;   /* orange */
--color-secondary: #2A8C75; /* dark green */
--color-bg: #FFFFFF;
--color-bg-section: #FAFAFA;
--color-heading: #1B1B1B;
--color-paragraph: #5F5F5F;

--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
```

---

## 4. Admin Dashboard — `apps/admin/`

```
admin/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── DashboardCard.jsx
│   │   ├── charts/
│   │   │   ├── ContentPieChart.jsx        # distribution of content types
│   │   │   ├── MonthlyPostChart.jsx       # posts per month
│   │   │   └── TrafficChart.jsx
│   │   ├── forms/
│   │   │   ├── ArticleForm.jsx      # React Hook Form + Zod + TipTap
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProgramForm.jsx
│   │   │   ├── PartnerForm.jsx
│   │   │   ├── EventForm.jsx
│   │   │   └── ReportForm.jsx
│   │   ├── table/
│   │   │   └── DataTable.jsx        # TanStack Table wrapper (sort/filter/paginate)
│   │   ├── editor/
│   │   │   └── RichTextEditor.jsx   # TipTap wrapper
│   │   └── homepage-builder/
│   │       ├── SectionList.jsx      # dnd-kit drag & drop
│   │       └── SectionPreview.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── manage-content/          # *** MAIN CONTENT MANAGEMENT FLOW ***
│   │   │   ├── ContentHub.jsx       # Landing: pick content type to manage
│   │   │   ├── Articles.jsx         # List all articles (DataTable)
│   │   │   ├── ArticleEditor.jsx    # Create/edit article (form + TipTap)
│   │   │   ├── Programs.jsx
│   │   │   ├── ProgramEditor.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectEditor.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── ReportEditor.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventEditor.jsx
│   │   │   ├── Partners.jsx
│   │   │   ├── Directory.jsx        # Entrepreneurs / SHGs / Mentors
│   │   │   ├── Media.jsx
│   │   │   └── Testimonials.jsx
│   │   ├── Analytics.jsx            # Dashboard with content stats
│   │   ├── Users.jsx                # Admin user management
│   │   ├── SEO.jsx                  # Global SEO settings
│   │   ├── HomepageBuilder.jsx      # Drag & drop section ordering
│   │   └── Settings.jsx
│   ├── hooks/
│   ├── lib/
│   │   ├── axios.js                 # base API client with auth interceptor
│   │   └── queryClient.js
│   ├── store/
│   │   └── authStore.js            # Zustand or Context for auth state
│   ├── routes/
│   │   └── AdminRoutes.jsx
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── vite.config.js
```

### Admin Panel — Content Management Flow
The admin panel has a clean, intuitive workflow:
1. **Login** → Dashboard
2. **Sidebar → "Manage Content"** → ContentHub page shows content type cards:
   - Articles | Programs | Projects | Reports | Events | Partners | Directory | Media | Testimonials
3. **Click a card** → List page with a **DataTable** showing all existing content of that type (with search, sort, filter, paginate)
4. **Action buttons on list page**:
   - **"Add New"** → Opens the editor form for that content type
   - **Click a row** → Opens that item in the editor for editing
   - **Delete / Toggle visibility** actions
5. **Editor form** → React Hook Form + Zod validation + TipTap rich text (for long content)
   - Save as Draft / Publish toggle
   - Once saved → content instantly reflects on the public website via API

### Admin Dashboard (Analytics)
When admin logs in, the Dashboard shows:
- **Content Overview Cards**: Total Articles | Programs | Projects | Reports | Events | Partners | Directory entries
- **Recent Activity**: Latest 10 actions (content created/updated)
- **Chart - Content Distribution**: Pie chart showing % breakdown of all content types
- **Chart - Monthly Posts**: Bar chart showing how much content was added per month
- **Quick Actions**: "Add Article", "Add Project", etc.

---

## 5. Database Schemas (Mongoose)

Only key fields shown — expand as needed.

```js
// Article
{
  title, slug, category, tags: [String],
  thumbnail, gallery: [String], videoUrl,
  content: String,          // HTML from TipTap
  status: 'draft' | 'published',
  publishedAt,
  featured: Boolean,
  seo: { metaTitle, metaDescription, ogImage, keywords: [String] },
  views: Number,
  createdAt, updatedAt
}

// Project
{
  title, coverImage, gallery: [String], videoUrl,
  location: { district, state, lat, lng },
  status: 'ongoing' | 'completed',
  budget: Number, startDate, endDate,
  impactNumbers: [{ label, value }],
  volunteers: [{ name, role }],
  partners: [{ type: ObjectId, ref: 'Partner' }],
  description: String,
  updates: [{ date, title, content, images: [String] }]
}

// Program
{
  title, banner, description, objectives: [String],
  gallery: [String],
  successStories: [{ title, summary, image }],
  faqs: [{ question, answer }],
  downloads: [{ label, fileUrl }],
  relatedArticles: [{ type: ObjectId, ref: 'Article' }]
}

// Partner
{
  name, logo, website, description,
  category: 'government' | 'corporate' | 'ngo' | 'educational',
  status: 'active' | 'inactive'
}

// Report (Research Centre)
{
  title, pdfUrl, thumbnail, category, tags: [String],
  downloadsCount: Number, citation, author,
  summary, references: [String], doi, year
}

// Entrepreneur / SHG / Mentor — see Directory section
// Event
{
  title, type: 'upcoming' | 'past', gallery: [String],
  speakers: [{ name, photo, bio }],
  agenda: [{ time, title }],
  sponsors: [{ type: ObjectId, ref: 'Partner' }],
  location: { address, lat, lng }, ticketUrl,
  volunteerFormUrl, registrationDeadline
}

// Donation
{ donorName, email, amount, currency, purpose, paymentStatus, transactionId, createdAt }

// PageSection (homepage builder)
{ key: 'hero'|'mission'|..., order: Number, visible: Boolean }
```

---

## 6. Temp / Seed Data

Save as `apps/server/src/seed/data.json` and load with `seed.js` (using `mongoose` + `dotenv`, run via `npm run seed`).

```json
{
  "users": [
    {
      "name": "Admin User",
      "email": "admin@ravivarvichar.org",
      "password": "Admin@123",
      "role": "admin"
    }
  ],
  "programs": [
    {
      "title": "Women Entrepreneurs Program",
      "description": "Supporting rural women to launch and scale micro-enterprises through mentorship, seed funding, and market access.",
      "objectives": ["Skill development", "Access to microfinance", "Market linkages"],
      "status": "active"
    },
    {
      "title": "SHG Development Initiative",
      "description": "Strengthening Self-Help Groups through capacity building and financial literacy.",
      "objectives": ["Group formation", "Bookkeeping training", "Bank linkage"],
      "status": "active"
    },
    {
      "title": "Financial Literacy Workshops",
      "description": "Community workshops on savings, credit, and digital banking.",
      "objectives": ["Digital payments awareness", "Savings habit building"],
      "status": "active"
    }
  ],
  "articles": [
    {
      "title": "How Rural Women Are Redefining Entrepreneurship in Rajasthan",
      "slug": "rural-women-entrepreneurship-rajasthan",
      "category": "Case Study",
      "tags": ["entrepreneurship", "women", "rajasthan"],
      "status": "published",
      "featured": true,
      "excerpt": "A look at three women-led enterprises that emerged from our SHG network."
    },
    {
      "title": "The State of Microfinance in India: 2026 Outlook",
      "slug": "microfinance-india-2026-outlook",
      "category": "Research",
      "tags": ["microfinance", "policy"],
      "status": "published",
      "featured": false
    },
    {
      "title": "Explainer: What Is a Self-Help Group?",
      "slug": "explainer-what-is-shg",
      "category": "Explainer",
      "tags": ["basics", "shg"],
      "status": "draft"
    }
  ],
  "projects": [
    {
      "title": "Marwar Livelihoods Project",
      "location": { "district": "Jodhpur", "state": "Rajasthan" },
      "status": "ongoing",
      "budget": 4500000,
      "startDate": "2025-04-01",
      "impactNumbers": [
        { "label": "Women trained", "value": 320 },
        { "label": "SHGs formed", "value": 28 }
      ]
    },
    {
      "title": "Digital Literacy for SHGs",
      "location": { "district": "Udaipur", "state": "Rajasthan" },
      "status": "completed",
      "budget": 1200000,
      "startDate": "2024-01-15",
      "endDate": "2024-12-20",
      "impactNumbers": [{ "label": "Women onboarded to UPI", "value": 540 }]
    }
  ],
  "partners": [
    { "name": "NABARD", "category": "government", "status": "active" },
    { "name": "Tata Trusts", "category": "corporate", "status": "active" },
    { "name": "SEWA Bharat", "category": "ngo", "status": "active" },
    { "name": "IIM Udaipur", "category": "educational", "status": "active" }
  ],
  "reports": [
    {
      "title": "Impact of SHG-Bank Linkage on Rural Household Income",
      "category": "Policy Brief",
      "year": 2025,
      "author": "Dr. Ananya Rao",
      "summary": "An empirical study across 12 districts showing a 22% average income increase post SHG-bank linkage."
    }
  ],
  "entrepreneurs": [
    {
      "name": "Kavita Devi",
      "district": "Jodhpur",
      "sector": "Handicrafts",
      "bio": "Runs a block-printing collective employing 15 women."
    },
    {
      "name": "Meena Kumari",
      "district": "Udaipur",
      "sector": "Food Processing",
      "bio": "Founder of a pickle and papad micro-enterprise supplying to 3 districts."
    }
  ],
  "shgs": [
    {
      "groupName": "Ekta Mahila Samuh",
      "members": 14,
      "district": "Jodhpur",
      "achievements": ["Bank-linked in 2023", "Started a tailoring unit"]
    }
  ],
  "mentors": [
    {
      "name": "Rahul Mehta",
      "skills": ["Business Strategy", "Marketing"],
      "availability": "Weekends",
      "experience": "12 years in retail and D2C brands"
    }
  ],
  "events": [
    {
      "title": "Annual Women Entrepreneurs Summit 2026",
      "type": "upcoming",
      "location": { "address": "Jaipur, Rajasthan" },
      "speakers": [{ "name": "Dr. Ananya Rao", "bio": "Development economist" }]
    },
    {
      "title": "SHG Bookkeeping Bootcamp",
      "type": "past",
      "location": { "address": "Udaipur, Rajasthan" }
    }
  ],
  "testimonials": [
    {
      "name": "Sunita Bai",
      "role": "SHG Member, Jodhpur",
      "quote": "The training gave me the confidence to open my own shop."
    },
    {
      "name": "Vikram Singh",
      "role": "Partner, NABARD",
      "quote": "Their ground-level execution and reporting transparency stand out."
    }
  ],
  "mediaItems": [
    { "title": "RavivarVichar featured in The Hindu", "type": "news" },
    { "title": "Press Release: New Rural Livelihoods Grant", "type": "press-release" },
    { "title": "Field Podcast Ep. 1: Voices from Jodhpur", "type": "podcast" }
  ]
}
```

---

## 7. Environment Variables (`.env.example`)

```
# Server
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ravivarvichar
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Client / Admin (Vite)
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 8. SEO Strategy (High Priority)

The public website must achieve a high SEO score. Implementation approach:

| Strategy | Implementation |
|----------|---------------|
| **SSR-friendly meta tags** | react-helmet-async for dynamic `<head>` per page |
| **Unique meta per page** | Every page/article/project gets unique title, description, OG image, keywords |
| **Semantic HTML** | Proper `<h1>`-`<h6>` hierarchy, `<article>`, `<section>`, alt texts on all images |
| **Open Graph / Twitter Cards** | og:title, og:description, og:image, twitter:card on every public page |
| **JSON-LD Structured Data** | Schema.org Organization, Article, Event, Project markup |
| **XML Sitemap** | Auto-generated `/sitemap.xml` listing all published content |
| **Clean URLs** | Slug-based URLs: `/knowledge-hub/rural-women-entrepreneurship-rajasthan` |
| **Fast Performance** | Vite build, image lazy loading, optimized bundles |
| **Mobile-first** | Fully responsive with Tailwind |
| **Accessibility** | ARIA labels, keyboard navigation, contrast compliance |

SEO data is managed through the admin **SEO panel** — admin can set global site metadata, and per-page SEO overrides in each content editor.

---

## 9. Implementation Roadmap (6 phases, self-paced)

**Phase 1 — Foundation (Week 1)**
Repo setup, npm workspaces, Express skeleton, MongoDB Atlas connection, JWT auth (login with admin role check), all Mongoose models, seed script with the temp data above.

**Phase 2 — Core CMS APIs (Week 2)**
CRUD for Articles, Programs, Projects, Partners, Reports, Directory (entrepreneurs/SHGs/mentors), Events, Media, Testimonials — with pagination, search, admin-gated write access. Cloudinary upload endpoint wired through Multer. Analytics summary endpoint.

**Phase 3 — Admin Dashboard (Weeks 3–4)**
Login page, sidebar layout, ContentHub page (pick content type), DataTable-driven list pages for every resource, editor forms (React Hook Form + Zod + TipTap), Dashboard with content stats & charts, SEO settings panel, homepage builder (drag/drop with dnd-kit).

**Phase 4 — Public Website (Weeks 5–6)**
Navbar/mega-menu, Hero and all homepage sections, About/Programs/Knowledge Hub/Research/Directory/Media/Events/Collaborate/Donate/Contact pages, react-helmet-async SEO wiring pulling from admin-set SEO data, sitemap generation.

**Phase 5 — Integrations (Week 7)**
Newsletter (Resend/Nodemailer), donation flow (Razorpay/Stripe test mode), membership form, contact form, analytics event tracking (pageview logging into ActivityLog).

**Phase 6 — Polish & Deploy (Week 8)**
Framer Motion/GSAP micro-animations on hero and cards, responsive QA, Lighthouse SEO/performance audit, deploy: client → Vercel, admin → Vercel, server → Render, DB → MongoDB Atlas free tier.

---

## 10. Content Management Flow (Visual Summary)

```
        ┌─────────────────────────────────────────────┐
        │                 LOGIN PAGE                   │
        │         (email + password → JWT token)       │
        └─────────────────────┬───────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │              ADMIN DASHBOARD                 │
        │  ┌──────┐ ┌──────┐ ┌──────┐ ┌───────────┐ │
        │  │Total │ │Total │ │Total │ │ Recent    │ │
        │  │Articles│Programs│Projects│ │ Activity  │ │
        │  │  12  │ │  5   │ │  8   │ │ Feed      │ │
        │  └──────┘ └──────┘ └──────┘ └───────────┘ │
        │  [Charts: Content Distribution & Monthly]   │
        └─────────────────────┬───────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │   Sidebar: "Manage Content"    │
              │                                │
              ▼                                ▼
   ┌──────────────────────────┐    ┌──────────────────────┐
   │       CONTENT HUB        │    │      ANALYTICS       │
   │   Pick content type:     │    │  All content stats   │
   │                          │    │  Views, downloads    │
   │  ┌────────┐ ┌────────┐   │    │  Activity timeline   │
   │  │Articles│ │Programs│   │    └──────────────────────┘
   │  │  12   │  │  5    │   │
   │  └────────┘ └────────┘   │
   │  ┌────────┐ ┌────────┐   │
   │  │Projects│ │ Events │   │
   │  │  8    │  │  3    │   │
   │  └────────┘ └────────┘   │
   └────────────┬─────────────┘
                │ Click card
                ▼
   ┌─────────────────────────────────────┐
   │         CONTENT LIST (DataTable)     │
   │                                      │
   │  ┌──────────────────────────────┐   │
   │  │ Search | Sort | Filter       │   │
   │  ├──────────────────────────────┤   │
   │  │ Article 1    [Edit] [Delete] │   │
   │  │ Article 2    [Edit] [Delete] │   │
   │  │ Article 3    [Edit] [Delete] │   │
   │  │ ...                           │   │
   │  └──────────────────────────────┘   │
   │                                      │
   │  [+ Add New Article]  [Page 1 of 3] │
   └────────────────────┬────────────────┘
                        │ Click "Add New" or "Edit"
                        ▼
   ┌───────────────────────────────────────┐
   │        CONTENT EDITOR (Form)          │
   │                                       │
   │  Title: [______________________]      │
   │  Category: [dropdown]                 │
   │  Tags: [tag1] [tag2] [+]              │
   │  Thumbnail: [Upload]                  │
   │                                       │
   │  Content:                             │
   │  ┌───────────────────────────────┐   │
   │  │ TipTap Rich Text Editor       │   │
   │  │ (B / I / H1/H2 / Lists /     │   │
   │  │  Link / Image / Video...)     │   │
   │  └───────────────────────────────┘   │
   │                                       │
   │  SEO: [Meta Title] [Description]     │
   │  Status: ○ Draft  ● Published        │
   │                                       │
   │  [Save Draft]  [Publish]  [Cancel]   │
   └───────────────────────────────────────┘
                        │
                        ▼ (API saves to MongoDB)
   ┌───────────────────────────────────────┐
   │   PUBLIC WEBSITE REFLECTS CHANGES     │
   │   ✓ Articles page shows new article   │
   │   ✓ Homepage featured section updates │
   │   ✓ Sitemap regenerated               │
   └───────────────────────────────────────┘
```

---

## 11. Summary of Changes from Original Plan

1. **Auth Simplified**: Removed 4-role RBAC. Single `admin` role with full access.
2. **Admin Content Flow**: ContentHub → Content List (DataTable) → Editor form — unified pattern for all content types.
3. **Analytics Dashboard**: Shows content counts, charts (content distribution + monthly posts), recent activity feed.
4. **SEO Priority**: Added dedicated SEO section with full strategy for high search ranking.
5. **Role Middleware Removed**: No need for `role.middleware.js` — just an `auth.middleware.js` that checks admin status.
6. **Seed Data Updated**: Single admin user instead of multiple roles.
