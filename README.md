# Upscale – Next-Gen Career Platform

Upscale is a full-stack career-readiness platform for Bangladeshi youth. It blends AI-assisted learning with human mentorship, tailored job discovery, portfolio tooling and recruiter dashboards so each persona can move from fragmented learning to verifiable employment pathways.

- Landing experience: `/` (marketing site, pricing, testimonials, CTA)
- Auth flows: `/login`, `/register`, `/register-recruiter`, `/forgot-password`
- Role dashboards: `/dashboard`, `/admin/dashboard`, `/recruiter/dashboard`, `/mentor/dashboard`

---

## Architecture & Tech Stack

- Next.js 14 (App Router, Server/Client Components, Route Handlers)
- TypeScript across app, API routes, scripts and models
- Tailwind CSS with custom gradients and component library
- NextAuth v5 credentials provider + middleware-based route protection
- MongoDB + Mongoose models for users, jobs, mentors, roadmap, community, notifications and resources
- Google Gemini SDK for AI roadmap generation, plus fetch-based integrations (findwork.dev, YouTube, Udemy)
- Supporting libs: framer-motion, lucide-react, chart.js/react-chartjs-2, bcryptjs, jose/jsonwebtoken, tailwind-merge

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (or `pnpm`/`yarn` equivalent)
- MongoDB connection string (local or Atlas)
- API keys as needed (Gemini, OpenAI, payment gateways)

### Environment Variables

Create `.env.local` from `env.template` and fill the required secrets:

| Purpose | Keys |
| - | - |
| Core runtime | `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| AI providers | `GEMINI_API_KEY`, `OPENAI_API_KEY` |
| Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BKASH_API_KEY`, `NAGAD_API_KEY` |
| Email (optional) | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` |
| Storage (optional) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` |
| Feature flags | `ENABLE_AI_FEATURES`, `ENABLE_MENTOR_BOOKING`, `ENABLE_PAYMENTS` |

### Install & Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (uses Mongo connection)
npm start        # serve production build
```

Database helpers:

- Seed featured jobs: `npm run seed:jobs`
- Create admin/recruiter accounts: `npm run create:admin`

> The seed scripts rely on `.env.local`; run them once per environment.

---

## Usage Guide

- **Public marketing**: Explore hero, pricing, testimonials, FAQ and CTA sections to understand the product.
- **Registration**: `user` and `recruiter` flows collect minimal info and immediately provision MongoDB records.
- **Login**: Credentials-based sign-in; verified recruiter enforcement happens during authorize callback.
- **Forgot password**: Temporary manual flow that logs requests and instructs users to contact support (`/forgot-password`).
- **Dashboard (`/dashboard`)**: Personalized cards for profile completion, job matches, roadmap progress, mentor sessions and subscription status.
- **Admin suite**: User management, mentor approvals, job moderation and analytics.
- **Recruiter workspace**: Manage postings, view analytics, inspect pipeline stats, create new jobs.
- **Mentor workspace**: Track sessions, availability, earnings, students and payout configuration.
- **Resources & AI tools**: CV analyser, interview prep, learning roadmap, bookmarking/history, interactive code practice.

Navigation is powered by `DynamicDashboardNav`, which adapts menu items to the authenticated role while keeping `/dashboard` canonical for learners.

---

## API Reference (Route Handlers)

Paths live under `app/api`. All routes expect authenticated JWT sessions unless marked public.

### Auth & Profile

| Method | Path | Description | Auth |
| - | - | - | - |
| POST | `/api/auth/register` | Create learner account | Public |
| POST | `/api/auth/register-recruiter` | Recruiter onboarding (awaits admin approval) | Public |
| GET  | `/api/user/profile` | Current user profile (sans password) | Session |
| PATCH | `/api/user/profile` | Update profile fields | Session |
| GET  | `/api/user/profile/completion` | Calculates completion score and flags | Session |
| GET/PUT | `/api/settings/profile` | Profile read/update with password change guard | Session |
| POST | `/api/upload/avatar` | Upload avatar (<=5 MB images) to `public/uploads` | Session |

### Dashboard & Learner

| Method | Path | Description |
| - | - | - |
| GET | `/api/jobs` & `/api/jobs/[id]` | Internal recruiter jobs CRUD |
| GET | `/api/jobs/findwork` | Proxy to findwork.dev (server runtime) |
| GET | `/api/jobs/unified` | Merges internal + external jobs for matching |
| GET | `/api/jobs/match` | Personalized matches based on skills/track |
| POST | `/api/roadmap/generate` | Gemini-backed roadmap generation |
| GET | `/api/roadmap` | List user roadmaps |
| POST | `/api/roadmap/[id]/exercises/[exerciseId]/complete` | Mark exercise complete, update progress |
| POST | `/api/cv/analyze` | AI CV analysis |
| POST | `/api/interview/start` | Kick off mock interview |

### Community & Notifications

| Method | Path | Description |
| - | - | - |
| GET/POST | `/api/community/questions` | Create & paginate questions |
| PATCH/DELETE | `/api/community/questions/[id]` | Upvote, accept answer, delete |
| POST/PATCH/DELETE | `/api/community/questions/[id]/answers` | Answer lifecycle |
| GET | `/api/notifications` | Fetch notifications (sorted unread first) |

### Mentors & Recruiters

| Path | Capabilities |
| - | - |
| `/api/mentors`, `/api/mentors/[id]`, `/api/mentors/book` | Mentor discovery, detail, booking |
| `/api/mentors/sessions`, `/api/mentors/sessions/[id]` | Session management |
| `/api/mentor/schedule`, `/api/mentor/stats`, `/api/mentor/earnings`, `/api/mentor/payout` | Mentor dashboards |
| `/api/recruiter/my-jobs`, `/api/recruiter/jobs/[id]`, `/api/recruiter/jobs/new` | Recruiter job CRUD |
| `/api/recruiter/stats`, `/api/recruiter/job-analytics` | Funnel and job analytics |

### Admin

| Path | Capabilities |
| - | - |
| `/api/admin/users` | Pagination, update roles, delete users |
| `/api/admin/mentors`, `/api/admin/mentors/[id]` | List/approve mentors |
| `/api/admin/recruiters` | Verify recruiters |
| `/api/admin/jobs`, `/api/admin/stats`, `/api/admin/analytics` | Platform metrics and moderation |

> Most route handlers read cookies/headers. When deploying to edge runtimes, set `export const runtime = "nodejs"` or `export const dynamic = "force-dynamic"` to avoid static export warnings.

---

## Data & File Handling

- **MongoDB**: Connection pooling with cached client (`lib/mongodb.ts`), executed per route.
- **Models**: Normalized Mongoose schemas with indexes for query-heavy collections (users, jobs, mentors, questions, roadmaps, notifications).
- **Roadmaps**: Persist exercises, progress and suggested courses (`models/Roadmap.ts`). Exercise completion endpoint updates per-stage progress and stores last submission for audit trails.
- **Usage limits**: Tier-aware guard rails use `TIER_LIMITS` map with strongly typed features (`lib/usageLimits.ts`).
- **Uploads**: Avatar upload validates size/type, creates directories on demand and stores under `public/uploads`. For cloud deployment, swap out local write with S3 or similar.

---

## Quality & Tooling

- Type-safe across app, API and scripts (`npx tsc --noEmit`).
- Next.js build (`npm run build`) validates routes; expect warnings for dynamic APIs until `dynamic` or `runtime` hints are added.
- No ESLint config was generated yet. Run `npx next lint` to scaffold and enforce lint rules.
- Manual QA steps executed: type-check, production build, static analysis of routing, review of navigation component, verification of admin/dashboard flows, confirmation of upload validation.

---

## Known Issues & Follow-Up Work

- Dynamic route warnings during `next build` because several APIs read `headers`/`request.url`. Add `export const dynamic = "force-dynamic"` or migrate to RSC-friendly data loaders.
- Password reset flow is manual-only; implement tokenized email workflow before production launch.
- Payment integration uses mock values; connect to live bKash/Nagad/Stripe gateways and harden webhook handlers.
- Avatar uploads rely on local filesystem; replace with object storage (S3, Cloudinary) for stateless deployments.
- No automated tests yet. Add unit/integration coverage for API routes (community, roadmap, admin) and component-level testing via Playwright/Testing Library.

---

## Contributing

- Fork the repository
- Create a feature branch (`git checkout -b feature/<name>`)
- Keep TypeScript + build passing
- Open a PR describing scope, testing and screenshots where relevant

---

## License

Copyright © Upscale. All rights reserved. Redistribution or commercial use without written permission is prohibited.

