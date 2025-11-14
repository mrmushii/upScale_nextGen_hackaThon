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

## 📚 Documentation

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete file structure, paths, and workflow documentation
- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration guide (includes Resume Analyzer setup)
- **[README_RESUME_ANALYZER.md](./README_RESUME_ANALYZER.md)** - Complete Resume Analyzer guide with API docs and usage
- **[SKILL_EXTRACTION_ISSUE_LOG.md](./SKILL_EXTRACTION_ISSUE_LOG.md)** - Smart Skill Extraction issues, fixes, and edge cases
- **[INTEGRATION_ISSUE_LOG.md](./INTEGRATION_ISSUE_LOG.md)** - Resume Analyzer integration log and decisions
- **[PDF_PARSING_SETUP.md](./PDF_PARSING_SETUP.md)** - PDF parsing setup and troubleshooting
- **[GEMINI_V1_DIRECT_SDK_REPORT.md](./GEMINI_V1_DIRECT_SDK_REPORT.md)** - AI service unification documentation

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
- **Smart Skill Extraction (integrated in Profile)** automatically detects skills, tools, and relevant roles from pasted CV text or the user profile. It's seamlessly integrated into the Profile page's CV/Resume Text section. When you paste your CV text, the extraction panel appears below, allowing you to:
  - Extract skills, tools, and target roles using AI (Gemini) or heuristic fallback
  - Review and edit extracted tags before applying
  - See evidence for each detected item
  - Apply extracted data directly to your profile with one click
- **CV Generator** (`/dashboard/cv`) - Generate professional CVs from your profile data

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

### AI Service Architecture

The application uses a **unified AI service** (`lib/unifiedAI.ts`) that provides consistent AI functionality across all features using the **Google Generative AI SDK** directly.

- **SDK:** `@google/generative-ai` (direct SDK usage)
- **Model:** `gemini-2.0-flash-001` (single unified model for all tasks)
- **Initialization:** `new GoogleGenerativeAI(process.env.GEMINI_API_KEY)`
- **Pattern:** Cached model singleton with direct `generateContent()` calls

**Core Functions:**
- ✅ `analyzeCV(cvText: string)` - CV/Resume analysis (HR Assistant role)
- ✅ `generateRoadmap(goal: string, skills: string[])` - Career roadmap generation (Career Coach role)
- ✅ `runInterviewPrompt(prompt: string)` - Interview assistance (Interview Assistant role)

**Backward Compatibility:**
- ✅ `generateTextUnified()` - Text generation wrapper
- ✅ `generateObjectUnified()` - Structured output with Zod validation
- ✅ `parseJSONFromText()` - JSON parsing with graceful fallback
- ✅ `validateAPIKey()` - API key validation

**Features using unified AI:**
- ✅ Roadmap Generation (`lib/geminiAI.ts`, `lib/geminiAIEnhanced.ts`)
- ✅ Resume Analyzer (`lib/analyzerService.ts`)
- ✅ Mock Interviews (`lib/aiInterview.ts`)

**Benefits:**
- Direct SDK control with full feature access
- Single model ensures consistency across all features
- Centralized error handling with meaningful messages
- Better performance with cached model instance
- Easier maintenance and updates
- Graceful JSON parsing with fallback
- Schema validation with Zod for structured outputs

**Error Handling:**
- API key validation with clear error messages
- Rate limit detection and user-friendly messages
- Safety filter detection
- Graceful JSON parsing fallback for malformed responses

See `GEMINI_V1_DIRECT_SDK_REPORT.md` for detailed technical documentation.

### Optional Dependencies (for Enhanced PDF Parsing)
For production use, install `pdf-parse` for server-side PDF text extraction:
```bash
npm install pdf-parse @types/pdf-parse
```

**Note:** Smart Skill Extraction is integrated into the Profile page. Simply paste your CV/resume text in the Profile's "CV / Resume Text" section, and the extraction panel will appear automatically below it.

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
  - `GEMINI_API_KEY` (required for all AI features: roadmaps, resume analysis, mock interviews)
  - `NEXT_PUBLIC_VAPI_WEB_TOKEN`, `NEXT_PUBLIC_VAPI_WORKFLOW_ID` (for voice interviews)
  - RapidAPI keys for job and course integrations

> **AI Service Note:** The unified AI service uses `GEMINI_API_KEY` and the direct `@google/generative-ai` SDK. All AI features (roadmaps, resume analysis, mock interviews) use the same unified service and model (`gemini-2.0-flash-001`). The service provides core functions (`analyzeCV`, `generateRoadmap`, `runInterviewPrompt`) and maintains backward compatibility with existing code.

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
- **Unified Job Details Flow**: All jobs (both recruiter-posted and Findwork API) now show a Job Details page before applying:
  - Recruiter jobs: Show match score, full description, and allow in-app application
  - Findwork jobs: Show job description, required skills, and track application before redirecting to external site
  - Both job types are tracked in the Application Tracker for consistent management

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

### 8. Application Tracker (`/dashboard/applications`)
- Track all job applications in one place, regardless of source (recruiter-posted or external Findwork jobs).
- Features include:
  - **Unified Tracking**: All applications appear in the tracker, whether from internal recruiter jobs or external job boards.
  - **Status Management**: Update application status (Applied, Interview, Offer, Rejected, Accepted).
  - **External Job Support**: External applications show an "External" badge and link to the original job posting.
  - **Notes & Dates**: Add notes, follow-up dates, and interview dates to each application.
  - **Manual Entry**: Manually add applications for jobs applied outside the platform.
- Applications are automatically tracked when you apply through the platform, or can be added manually.

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
| `/api/jobs/[id]` | GET | Unified job details (handles both recruiter and Findwork jobs) |
| `/api/jobs/match` | GET | Top job matches for dashboard widgets |
| `/api/recruiter/my-jobs` | GET | Recruiter vacancy management |
| `/api/applications` | GET / POST | Application tracker (supports both internal and external jobs) |

### AI Mock Interviews (Pro & Ultimate only)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai-interviews` | GET | Fetch personal and community interviews for the signed-in user |
| `/api/ai-interviews` | POST | Generate a new interview scenario (Google Gemini) |
| `/api/ai-interviews/[id]` | GET | Retrieve interview details and questions |
| `/api/ai-interviews/[id]/feedback` | GET | Fetch the signed-in user's feedback for an interview |
| `/api/ai-interviews/[id]/feedback` | POST | Generate structured feedback from an interview transcript |

> **Access control:** all AI interview endpoints enforce Pro/Ultimate tiers and require an authenticated session. Attempts from Basic users return HTTP 403 with guidance to upgrade.

### Smart Skill Extraction
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/skills/extract` | POST | Extract skills, tools, and roles from CV text, uploaded file, or user profile. Accepts JSON with `cvText`, `useProfile`, or `resumeId`, or multipart/form-data with `file` |

**Request Examples:**

**Extract from CV Text:**
```bash
curl -X POST /api/skills/extract \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cvText": "Experienced software engineer with 5 years in React and Node.js..."
  }'
```

**Extract from Uploaded File:**
```bash
curl -X POST /api/skills/extract \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

**Extract from Profile:**
```bash
curl -X POST /api/skills/extract \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"useProfile": true}'
```

**Response Example (Analysis):**
```json
{
  "success": true,
  "analysis": {
    "overallScore": 75,
    "ATS": {
      "score": 80,
      "tips": [
        { "type": "good", "tip": "Well-structured format" },
        { "type": "improve", "tip": "Add more keywords" }
      ]
    },
    "toneAndStyle": {
      "score": 70,
      "tips": [
        { "type": "good", "tip": "Professional tone", "explanation": "..." },
        { "type": "improve", "tip": "Vary sentence length", "explanation": "..." }
      ]
    },
    "content": { "score": 75, "tips": [...] },
    "structure": { "score": 80, "tips": [...] },
    "skills": { "score": 70, "tips": [...] }
  },
  "resume": { ... }
}
```

> **Security:** All API endpoints require authentication. Users can only access their own data. File uploads are validated for type (PDF/DOC/DOCX) and size (max 20MB).

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