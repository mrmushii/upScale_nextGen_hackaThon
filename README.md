# Upscale Career Platform

Upscale is a full-stack career acceleration platform built with Next.js that helps talent discover learning resources, generate tailored roadmaps, run AI-powered mock interviews, and collaborate with mentors and recruiters. The latest release integrates the **Ai-Interview** voice experience so Pro and Ultimate users can generate interview scenarios, practise in real time with an AI interviewer, and receive structured feedback without leaving the dashboard.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Project Overview

Upscale delivers an end-to-end journey for professionals and hiring teams:

- **Personalised onboarding** ensures job seekers complete the right profile data before unlocking premium tooling.
- **Roadmap generation** powered by Google Gemini outlines a three-stage learning plan using Udemy, YouTube, and Microsoft Learn content.
- **Interactive learning** keeps track of course progress, code challenges, bookmarks, and watch history in one hub.
- **Smart job discovery** scores internal job posts and Findwork listings against a user’s target roles and skills.
- **Role-based portals** give recruiters and mentors focused dashboards, while admins can curate talent pools.
- **Subscription tiers** (Basic, Pro, Ultimate) gate advanced functionality, quotas, and payment options.
- **AI Mock Interviews (new)** allow Pro & Ultimate users to:
  - Generate tailored interview question sets.
  - Launch real-time voice interviews via Vapi.
  - Capture transcripts automatically and receive structured feedback scored across key competencies.

---

## Tech Stack

| Layer             | Technologies |
|-------------------|--------------|
| Frontend          | Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons |
| Backend / API     | Next.js Route Handlers, NextAuth.js (JWT), Vercel AI SDK |
| Database          | MongoDB Atlas, Mongoose ODM |
| AI & Voice        | Google Gemini 2.0 Flash, `ai` SDK, `@ai-sdk/google`, Vapi Web Voice SDK |
| Integrations      | RapidAPI (Findwork, Paid Udemy), YouTube Data API v3, Microsoft Learn |
| Tooling           | ESLint, TypeScript, react-hot-toast |

---

## Installation & Setup

### Prerequisites
- Node.js v18 or higher & npm
- MongoDB connection string (local or Atlas)
- API keys for Google Gemini, Vapi, RapidAPI, and other integrations
- Git for cloning the repository

### 1. Clone the repository
```bash
git clone https://github.com/your-org/upscale.git
cd upscale/upScale_nextGen_hackaThon
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
- Copy the template and fill in your values:

```bash
cp env.template .env.local
```

- Required keys include (see `env.template` for the full list):
  - `MONGODB_URI`
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - `GEMINI_API_KEY` (or set `GOOGLE_GENERATIVE_AI_API_KEY` to override the AI SDK)
  - `NEXT_PUBLIC_VAPI_WEB_TOKEN`, `NEXT_PUBLIC_VAPI_WORKFLOW_ID` (for voice interviews)
  - RapidAPI keys for job and course integrations

> **Tip:** Maintain separate `.env.local` files per environment and never commit secrets.

### 4. Start the development server
```bash
npm run dev
```
The app runs at [http://localhost:3000](http://localhost:3000).

### 5. Optional tooling
- `npm run build` – production build
- `npm run start` – serve the production build
- `npm run lint` – run static analysis (accept the Next.js ESLint prompt on first run)

---

## Usage Guide

### 1. Landing & Registration
- Visit `/` for the public marketing experience and pricing plans.
- Selecting a paid plan routes guests to authentication and signed-in users to `/dashboard/payment` with the tier pre-selected.
- Users can register as job seekers, recruiters, or mentors.

### 2. Completing the Profile
- Basic users must complete `/dashboard/profile/complete` before unlocking premium tools.
- A persistent progress widget highlights missing sections and completion percentage.

### 3. Dashboard Navigation
- `/dashboard` surfaces quick stats, job matches, roadmap progress, and subscription status.
- Recruiters, mentors, and admins are redirected to their specific dashboards automatically.

### 4. Learning Resources (`/dashboard/resources`)
- Tabbed interface for Udemy coupons, curated YouTube playlists, Microsoft Learn, personalised suggestions, bookmarks, and history.
- APIs degrade gracefully with cached fallbacks when third-party quotas are reached.

### 5. Job Discovery (`/dashboard/jobs`)
- Combines recruiter-submitted posts with Findwork listings, sorted by personalised relevance scores.
- Filter by track, location, remote preference, and job type.

### 6. Subscriptions & Billing
- `/dashboard/payment` allows upgrades to Pro or Ultimate; billing preferences live in `/dashboard/settings?tab=subscription`.
- Usage quotas are enforced at the API level (roadmaps, CV analysis, mock interviews).

### 7. AI Mock Interviews (Pro & Ultimate)
- Access the new experience at `/dashboard/interviews` (visible once the subscription tier is Pro or Ultimate).
- Features include:
  - Interview generator form to capture role, level, focus, tech stack, and question count.
  - Personal library of generated interviews plus community scenarios shared by other users.
  - Real-time voice interview using Vapi with live transcript capture.
  - Automatic feedback creation scored across Communication, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence.
- Feedback pages summarise scores, comments, strengths, and suggested improvements for future practise.

---

## API Documentation

### Authentication & Profile
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | POST | NextAuth credential login/session |
| `/api/auth/register` | POST | Register a new job seeker |
| `/api/auth/register-recruiter` | POST | Register a recruiter account |
| `/api/user/profile` | GET / PATCH | Fetch or update the signed-in user's profile |
| `/api/user/profile/completion` | GET | Retrieve recalculated profile completion metrics |

### Settings & Subscriptions
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/settings/profile` | GET / PUT | Profile & password updates |
| `/api/settings/preferences` | GET / PUT | Account, notification, privacy, and billing preferences |
| `/api/subscription` | GET / POST / PUT | Manage plan selection, upgrades, cancellations |

### Learning & Roadmaps
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/roadmap/generate` | POST | Generate AI roadmaps (quota limited) |
| `/api/roadmap/[id]` | GET | Retrieve a specific roadmap |
| `/api/resources/udemy` | GET | Udemy coupon feed |
| `/api/resources/youtube` | GET | Curated YouTube playlists |
| `/api/resources/microsoft` | GET | Microsoft Learn catalogue |
| `/api/resources/bookmarks` | GET / POST | Manage saved resources |
| `/api/resources/history` | GET | Retrieve content history |

### Jobs & Recruiters
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/jobs/unified` | GET | Combined recruiter + Findwork job feed |
| `/api/jobs/match` | GET | Top job matches for dashboard widgets |
| `/api/recruiter/my-jobs` | GET | Recruiter vacancy management |

### AI Mock Interviews (Pro & Ultimate only)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai-interviews` | GET | Fetch personal and community interviews for the signed-in user |
| `/api/ai-interviews` | POST | Generate a new interview scenario (Google Gemini) |
| `/api/ai-interviews/[id]` | GET | Retrieve interview details and questions |
| `/api/ai-interviews/[id]/feedback` | GET | Fetch the signed-in user's feedback for an interview |
| `/api/ai-interviews/[id]/feedback` | POST | Generate structured feedback from an interview transcript |

> **Access control:** all AI interview endpoints enforce Pro/Ultimate tiers and require an authenticated session. Attempts from Basic users return HTTP 403 with guidance to upgrade.

For request/response examples, see the corresponding files under `app/api/**/route.ts`.

---

## Contribution Guidelines

1. **Fork** the repository and create a feature branch.
2. Run `npm install` and ensure `npm run lint` passes (accept the initial Next.js ESLint configuration prompt if presented).
3. Add tests where practical and keep pull requests focused.
4. Submit a PR that includes:
   - A descriptive title following conventional commits (`feat:`, `fix:`, etc.).
   - Summary of changes and testing performed.
   - Screenshots or cURL samples when modifying UI or APIs.
5. One reviewer approval is required before merge.

---

## License

This project is licensed under the **MIT License**. You may use, modify, and distribute it provided that all copies include the original license text.

---

Built with ❤️ by the Upscale team — accelerating careers one roadmap (and interview) at a time.