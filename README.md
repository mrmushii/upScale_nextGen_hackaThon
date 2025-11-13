# Upscale Career Platform

Upscale is a full-stack career acceleration platform built with Next.js that helps job seekers discover learning resources, generate tailored roadmaps, track progress, and move quickly from learning to landing a role. Recruiters and mentors get dedicated dashboards, while an integrated payment system unlocks premium features for power users.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Known Issues & Future Improvements](#known-issues--future-improvements)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Project Overview

Upscale provides an end-to-end experience for aspiring professionals:

- **Personalised onboarding** that enforces completion of critical profile data before unlocking premium features.
- **Roadmap generation** powered by Google Gemini AI that blends paid Udemy content, curated YouTube playlists, and Microsoft Learn modules.
- **Interactive learning pages** with code challenges, YouTube player progress tracking, bookmarking, and history.
- **Smart job discovery** combining our recruiter postings with the Findwork API, scored against a user’s profile.
- **Subscription tiers** (Basic, Pro, Ultimate) with payment processing and usage limits managed per plan.
- **Role-based portals** for recruiters, mentors, admins, and job seekers.

---

## Tech Stack

| Layer              | Technologies |
|--------------------|--------------|
| Frontend           | Next.js 13 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons |
| Backend / API      | Next.js API Routes, NextAuth.js, Google Gemini AI SDK |
| Database           | MongoDB Atlas, Mongoose ODM |
| Authentication     | NextAuth (Credentials + Session) |
| External Services  | RapidAPI (Findwork, Paid Udemy Courses), YouTube Data API v3, Microsoft Learn Catalog |
| Tooling            | ESLint, Prettier, react-hot-toast |

---

## Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** (or yarn/pnpm) and **Git**
- **MongoDB Atlas** connection string
- API keys for all external services (RapidAPI, Google, Gemini, etc.)

### 1. Clone the repository
```bash
git clone https://github.com/your-org/upscale.git
cd upscale
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Populate the file with your own values:
```
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
MONGODB_URI=your_mongodb_connection

# Authentication providers
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_key

# RapidAPI keys
RAPIDAPI_KEY=your_global_rapidapi_key
PAID_UDEMY_API_HOST=paid-udemy-course-for-free.p.rapidapi.com
PAID_UDEMY_API_KEY=your_specific_paid_udemy_key
FINDWORK_API_TOKEN=your_findwork_api_token

# Optional email / storage settings
EMAIL_FROM=noreply@upscale.com

```

> **Tip:** Keep different `.env.local` files per environment. Never commit secrets.

### 4. Run the development server
```bash
npm run dev
```
The app is now available at **http://localhost:3000**.

---

## Usage Guide

### 1. Landing & Registration
- Navigate to `/` to view the marketing landing page.
- Choose a plan in **Pricing**. Signed-in users are routed to `/dashboard/payment` with the correct plan preselected; guests are taken to login.
- Complete registration for job seeker, recruiter, or mentor roles.

### 2. Completing the Profile
- Basic users are redirected to `/dashboard/profile/complete` until required information is provided.
- Progress indicators update in real time and the dashboard visualises completion status.

### 3. Exploring the Dashboard
- Access personalised stats, quick actions, and “Top Job Matches”.
- A persistent profile completion card highlights missing data and the user’s current tier.

### 4. Learning Resources (`/dashboard/resources`)
- Tabs for **Udemy**, **YouTube**, **Microsoft Learn**, **Suggested**, **Bookmarks**, and **History**.
- External APIs load lazily (Udemy coupons, curated YouTube playlists, Microsoft Learn catalog) and fall back to cached data during outages or rate limits.
- Track progress with the custom YouTube player, bookmark courses, and resume from history.

### 5. Job Board (`/dashboard/jobs`)
- Combines recruiter-approved posts with Findwork listings.
- Filters by job type, remote status, location, and career track. Results are sorted using profile match scoring.

### 6. Subscription & Payments
- Use `/dashboard/payment` to upgrade plans (Pro/Ultimate). Auto-renew can be managed in **Settings → Billing**.
- Usage limits are enforced at the API level (`/api/subscription`, `/api/roadmap/generate`, etc.).

> _Screenshots:_ Place PNGs or GIFs in `public/docs/` and reference them, e.g.:
> ```markdown
> ![Dashboard](public/docs/dashboard.png)
> ```

---

## API Documentation

### Authentication & Profile
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | POST | NextAuth credential login & session handling |
| `/api/auth/register` | POST | Create a new job seeker account |
| `/api/auth/register-recruiter` | POST | Create a recruiter account |
| `/api/user/profile` | GET | Fetch current user profile |
| `/api/user/profile` | PATCH | Update core profile fields, experience, projects, etc. |
| `/api/user/profile/completion` | GET | Retrieve recalculated profile completion metrics |

### Settings
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/settings/profile` | GET / PUT | Fetch & update account profile and password |
| `/api/settings/preferences` | GET / PUT | Manage account, notification, privacy, and billing preferences |

### Subscriptions & Billing
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/subscription` | GET | Get current plan & usage limits |
| `/api/subscription` | POST | Upgrade or change subscription tier |
| `/api/subscription` | PUT | Cancel plan or toggle auto-renew |

### Roadmaps & Learning
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/roadmap/generate` | POST | Generate AI-assisted roadmap (usage-limited) |
| `/api/roadmap/[id]` | GET | Fetch specific roadmap |
| `/api/resources/udemy` | GET | Fetch Udemy coupons via RapidAPI (with fallback) |
| `/api/resources/youtube` | GET | Fetch curated YouTube content (FreeCodeCamp, JavaScript Mastery) |
| `/api/resources/microsoft` | GET | Fetch Microsoft Learn catalog |
| `/api/resources/suggest` | GET | Roadmap-aware course suggestions |
| `/api/resources/bookmarks` | GET / POST | Manage course bookmarks |
| `/api/resources/history` | GET | Retrieve watch history |
| `/api/resources/progress` | GET / POST | Persist course progress |

### Jobs & Recruiters
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/jobs/unified` | GET | Unified job feed (recruiter + Findwork) |
| `/api/jobs/match` | GET | Get top scored jobs for dashboard widgets |
| `/api/recruiter/my-jobs` | GET | Recruiter job management |

> For complete request/response samples, check the corresponding files in `app/api/**/route.ts`.

---

## Known Issues & Future Improvements

- **External API rate limits:** RapidAPI and YouTube enforce quotas. We currently fall back to cached data when hitting limits; adding persistent caching (Redis) would improve resilience.
- **Payment flow:** The payment experience is simulated. Integrating an actual PSP (Stripe, SSLCOMMERZ, etc.) is planned.
- **Automated testing:** End-to-end and integration tests are limited. Adding Playwright/Cypress coverage is a priority.
- **Accessibility & localisation:** Additional a11y audits and multi-language support would expand reach.
- **Realtime notifications:** WebSockets (or Pusher) could enhance recruiter ↔ candidate messaging.

---

## Contribution Guidelines

1. **Fork** the repository and create a local branch.
2. Run `npm install` and ensure `npm run lint` passes.
3. Make changes (include tests where possible).
4. Submit a PR with:
   - A descriptive title
   - Summary of changes
   - Screenshots or curl samples (when applicable)
5. One reviewer approval is required before merging.

Please follow conventional commits (`feat:`, `fix:`, etc.) and keep pull requests focused.

---

## License

This project is released under the **MIT License**. You are free to use, modify, and distribute it as long as the license terms are respected.

---

Built with ❤️ by the Upscale team — accelerating careers one roadmap at a time.

