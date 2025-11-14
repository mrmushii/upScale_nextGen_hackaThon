# Project Structure & Workflow Documentation

## 📁 Complete File Structure

```
upScale_nextGen_hackaThon/
│
├── 📄 Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── next.config.js                  # Next.js configuration
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── postcss.config.js               # PostCSS configuration
│   ├── middleware.ts                   # Next.js middleware (auth, routing)
│   ├── env.template                    # Environment variables template
│   └── .env.local                      # Local environment variables (not in repo)
│
├── 📁 app/                             # Next.js 14 App Router
│   │
│   ├── 📄 Root Files
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── page.tsx                   # Landing page
│   │   ├── providers.tsx              # React context providers
│   │   ├── globals.css                # Global styles
│   │   └── features/
│   │       └── page.tsx               # Features showcase page
│   │
│   ├── 📁 (auth)/                      # Auth route group
│   │   ├── layout.tsx                 # Auth layout
│   │   ├── login/page.tsx             # Login page
│   │   ├── register/page.tsx          # User registration
│   │   ├── register-recruiter/page.tsx # Recruiter registration
│   │   └── forgot-password/page.tsx   # Password reset
│   │
│   ├── 📁 (dashboard)/                 # User dashboard route group
│   │   ├── layout.tsx                 # Dashboard layout with nav
│   │   └── dashboard/
│   │       ├── page.tsx               # Dashboard home
│   │       ├── profile/               # User profile management
│   │       │   ├── page.tsx
│   │       │   └── complete/page.tsx  # Profile completion
│   │       ├── resumes/               # Resume management
│   │       │   ├── page.tsx           # Resume list
│   │       │   ├── upload/page.tsx    # Upload resume
│   │       │   └── [id]/page.tsx      # Resume details & analysis
│   │       ├── roadmap/               # Career roadmap
│   │       │   └── page.tsx
│   │       ├── learn/[roadmapId]/     # Learning path
│   │       │   └── page.tsx
│   │       ├── interviews/            # Mock interviews
│   │       │   ├── page.tsx           # Interview list
│   │       │   ├── [id]/page.tsx     # Interview session
│   │       │   └── [id]/feedback/page.tsx # Interview feedback
│   │       ├── jobs/                  # Job listings
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── applications/          # Job applications
│   │       │   └── page.tsx
│   │       ├── mentors/               # Mentor marketplace
│   │       │   ├── page.tsx
│   │       │   ├── [id]/book/page.tsx # Book mentor session
│   │       │   └── my-sessions/page.tsx # My sessions
│   │       ├── community/             # Q&A community
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── resources/              # Learning resources
│   │       │   └── page.tsx
│   │       ├── portfolio/             # Portfolio builder
│   │       │   └── page.tsx
│   │       ├── cv-analyzer/            # CV analyzer (legacy)
│   │       │   └── page.tsx
│   │       ├── interview/             # Voice interview
│   │       │   └── page.tsx
│   │       ├── notifications/         # Notifications
│   │       │   └── page.tsx
│   │       ├── payment/                # Payment/subscription
│   │       │   └── page.tsx
│   │       └── settings/               # User settings
│   │           └── page.tsx
│   │
│   ├── 📁 (admin)/                     # Admin route group
│   │   ├── layout.tsx                 # Admin layout
│   │   └── admin/
│   │       ├── dashboard/page.tsx     # Admin dashboard
│   │       ├── users/page.tsx         # User management
│   │       ├── mentors/page.tsx       # Mentor management
│   │       ├── recruiters/page.tsx    # Recruiter management
│   │       ├── jobs/page.tsx          # Job management
│   │       ├── analytics/page.tsx     # Analytics
│   │       └── settings/page.tsx      # Admin settings
│   │
│   ├── 📁 (mentor)/                    # Mentor route group
│   │   ├── layout.tsx                 # Mentor layout
│   │   └── mentor/
│   │       ├── dashboard/page.tsx     # Mentor dashboard
│   │       ├── students/page.tsx      # Student list
│   │       ├── schedule/page.tsx      # Session schedule
│   │       ├── earnings/page.tsx      # Earnings
│   │       └── settings/page.tsx      # Mentor settings
│   │
│   ├── 📁 (recruiter)/                 # Recruiter route group
│   │   ├── layout.tsx                 # Recruiter layout
│   │   └── recruiter/
│   │       ├── dashboard/page.tsx     # Recruiter dashboard
│   │       ├── jobs/                  # Job postings
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── analytics/page.tsx     # Job analytics
│   │       └── settings/page.tsx      # Recruiter settings
│   │
│   ├── 📁 api/                         # API Routes (Next.js Route Handlers)
│   │   │
│   │   ├── 📁 auth/                    # Authentication
│   │   │   ├── [...nextauth]/route.ts # NextAuth.js handler
│   │   │   ├── register/route.ts      # User registration
│   │   │   └── register-recruiter/route.ts # Recruiter registration
│   │   │
│   │   ├── 📁 resumes/                 # Resume API
│   │   │   ├── route.ts                # GET: list, POST: upload
│   │   │   └── [id]/
│   │   │       ├── route.ts           # GET: details, DELETE: remove
│   │   │       ├── analyze/route.ts   # POST: analyze resume
│   │   │       └── download/route.ts  # GET: download resume
│   │   │
│   │   ├── 📁 roadmap/                 # Roadmap API
│   │   │   ├── route.ts                # GET: list roadmaps
│   │   │   ├── generate/route.ts      # POST: generate roadmap
│   │   │   ├── [id]/route.ts          # GET: details, DELETE: remove
│   │   │   ├── reset-usage/route.ts   # POST: reset usage limits
│   │   │   └── [id]/exercises/[exerciseId]/complete/route.ts # POST: complete exercise
│   │   │
│   │   ├── 📁 ai-interviews/           # AI Interview API
│   │   │   ├── route.ts                # GET: list, POST: create
│   │   │   └── [id]/
│   │   │       ├── route.ts           # GET: details, DELETE: remove
│   │   │       └── feedback/route.ts  # POST: generate feedback
│   │   │
│   │   ├── 📁 jobs/                    # Jobs API
│   │   │   ├── route.ts                # GET: list jobs
│   │   │   ├── [id]/route.ts          # GET: job details
│   │   │   ├── match/route.ts         # POST: job matching
│   │   │   ├── findwork/route.ts      # GET: external jobs (RapidAPI)
│   │   │   └── unified/route.ts       # GET: unified job search
│   │   │
│   │   ├── 📁 applications/             # Job Applications API
│   │   │   ├── route.ts                # GET: list, POST: create
│   │   │   └── [id]/route.ts          # GET: details, DELETE: withdraw
│   │   │
│   │   ├── 📁 mentors/                 # Mentors API
│   │   │   ├── route.ts                # GET: list mentors
│   │   │   ├── [id]/route.ts          # GET: mentor details
│   │   │   ├── book/route.ts          # POST: book session
│   │   │   └── sessions/
│   │   │       ├── route.ts           # GET: list sessions
│   │   │       └── [id]/route.ts      # GET: details, PUT: update
│   │   │
│   │   ├── 📁 mentor/                  # Mentor-specific API
│   │   │   ├── dashboard/route.ts     # GET: mentor stats
│   │   │   ├── students/route.ts      # GET: student list
│   │   │   ├── schedule/route.ts      # GET: schedule, POST: create slot
│   │   │   ├── earnings/route.ts      # GET: earnings
│   │   │   ├── payout/route.ts        # POST: request payout
│   │   │   └── stats/route.ts         # GET: statistics
│   │   │
│   │   ├── 📁 recruiter/               # Recruiter API
│   │   │   ├── my-jobs/route.ts       # GET: recruiter's jobs
│   │   │   ├── job-analytics/route.ts # GET: job analytics
│   │   │   └── stats/route.ts         # GET: recruiter stats
│   │   │
│   │   ├── 📁 admin/                   # Admin API
│   │   │   ├── users/route.ts         # GET: all users, PUT: update
│   │   │   ├── mentors/route.ts       # GET: all mentors
│   │   │   ├── mentors/[id]/route.ts  # PUT: update mentor
│   │   │   ├── recruiters/route.ts    # GET: all recruiters
│   │   │   ├── jobs/route.ts          # GET: all jobs
│   │   │   ├── all-jobs/route.ts      # GET: all jobs (detailed)
│   │   │   ├── analytics/route.ts     # GET: platform analytics
│   │   │   └── stats/route.ts         # GET: platform stats
│   │   │
│   │   ├── 📁 community/               # Community API
│   │   │   └── questions/
│   │   │       ├── route.ts           # GET: list, POST: create
│   │   │       ├── [id]/route.ts      # GET: details, PUT: update
│   │   │       └── [id]/answers/route.ts # POST: add answer
│   │   │
│   │   ├── 📁 resources/               # Learning Resources API
│   │   │   ├── youtube/route.ts       # GET: YouTube courses
│   │   │   ├── udemy/route.ts         # GET: Udemy courses
│   │   │   ├── microsoft/route.ts     # GET: Microsoft Learn
│   │   │   ├── suggest/route.ts       # POST: suggest resources
│   │   │   ├── bookmarks/route.ts     # GET/POST: bookmarks
│   │   │   ├── history/route.ts       # GET: watch history
│   │   │   └── progress/route.ts      # GET/POST: progress tracking
│   │   │
│   │   ├── 📁 portfolio/               # Portfolio API
│   │   │   └── route.ts                # GET: list, POST: create/update
│   │   │
│   │   ├── 📁 notifications/          # Notifications API
│   │   │   └── route.ts                # GET: list, PUT: mark read
│   │   │
│   │   ├── 📁 settings/                # Settings API
│   │   │   ├── profile/route.ts       # PUT: update profile
│   │   │   └── preferences/route.ts   # PUT: update preferences
│   │   │
│   │   ├── 📁 subscription/           # Subscription API
│   │   │   └── route.ts                # GET: status, POST: upgrade
│   │   │
│   │   ├── 📁 upload/                  # File Upload API
│   │   │   └── avatar/route.ts        # POST: upload avatar
│   │   │
│   │   ├── 📁 user/                    # User API
│   │   │   ├── profile/route.ts       # GET: profile
│   │   │   └── profile/completion/route.ts # GET: completion status
│   │   │
│   │   ├── 📁 cv/                      # CV Analyzer (legacy)
│   │   │   └── analyze/route.ts       # POST: analyze CV
│   │   │
│   │   ├── 📁 interview/               # Voice Interview
│   │   │   └── start/route.ts          # POST: start interview
│   │   │
│   │   └── 📁 test/                    # Testing endpoints
│   │       ├── route.ts                # Test endpoint
│   │       └── gemini/route.ts         # Test Gemini API
│   │
│   └── 📁 portfolio/[publicUrl]/       # Public portfolio view
│       └── page.tsx
│
├── 📁 lib/                              # Utility libraries & services
│   ├── unifiedAI.ts                     # ⭐ Unified AI service (Gemini v1)
│   ├── aiInterview.ts                   # Mock interview AI service
│   ├── analyzerService.ts              # Resume analysis service
│   ├── geminiAI.ts                     # Roadmap generation (basic)
│   ├── geminiAIEnhanced.ts             # Roadmap generation (enhanced)
│   ├── pdfParser.ts                    # PDF text extraction
│   ├── resumeService.ts                # Resume validation (client-safe)
│   ├── resumeFileService.ts            # Resume file operations (server-only)
│   ├── roadmapGenerator.ts             # Roadmap template generator
│   ├── mongodb.ts                      # MongoDB connection
│   ├── profileCompletion.ts           # Profile completion checker
│   ├── usageLimits.ts                  # Usage limits checker
│   ├── roleRedirect.ts                 # Role-based redirects
│   ├── vapiClient.ts                   # Vapi voice interview client
│   ├── constants.ts                    # App constants
│   └── utils.ts                        # General utilities
│
├── 📁 components/                       # React components
│   │
│   ├── 📁 ai/                           # AI feature components
│   │   ├── CareerRoadmap.tsx          # Roadmap display
│   │   ├── CVAnalyzer.tsx             # CV analyzer UI
│   │   ├── JobMatching.tsx            # Job matching UI
│   │   └── MockInterview.tsx          # Mock interview UI
│   │
│   ├── 📁 ai-interview/                 # Interview components
│   │   ├── InterviewAgent.tsx         # Interview agent UI
│   │   ├── InterviewCard.tsx          # Interview card
│   │   └── TechStackIcons.tsx         # Tech stack icons
│   │
│   ├── 📁 resumes/                     # Resume components
│   │   ├── ResumeUploadWidget.tsx     # Upload widget
│   │   ├── ResumeCard.tsx             # Resume card
│   │   ├── ATSFeedback.tsx            # ATS feedback display
│   │   ├── FeedbackAccordion.tsx      # Feedback accordion
│   │   ├── ScoreBadge.tsx             # Score badge
│   │   ├── ScoreCircle.tsx            # Score circle
│   │   └── ScoreGauge.tsx             # Score gauge
│   │
│   ├── 📁 dashboard/                    # Dashboard components
│   │   ├── DashboardNav.tsx            # Dashboard navigation
│   │   ├── DynamicDashboardNav.tsx    # Dynamic nav based on role
│   │   └── NotificationDropdown.tsx   # Notification dropdown
│   │
│   ├── 📁 learning/                     # Learning components
│   │   └── CodeEditor.tsx              # Code editor for exercises
│   │
│   ├── 📁 resources/                    # Resource components
│   │   └── YouTubePlayer.tsx          # YouTube player
│   │
│   └── 📄 Shared Components
│       ├── Navbar.tsx                  # Main navigation
│       ├── Footer.tsx                  # Footer
│       ├── Hero.tsx                    # Landing hero
│       ├── Features.tsx                 # Features section
│       ├── Pricing.tsx                 # Pricing section
│       ├── FAQ.tsx                     # FAQ section
│       ├── Testimonials.tsx            # Testimonials
│       ├── Statistics.tsx              # Statistics
│       ├── HowItWorks.tsx              # How it works
│       ├── Steps.tsx                   # Steps section
│       ├── WhyStandOut.tsx             # Why stand out
│       ├── CTA.tsx                     # Call to action
│       ├── PaymentPartners.tsx         # Payment partners
│       └── Toaster.tsx                 # Toast notifications
│
├── 📁 models/                           # MongoDB models (Mongoose)
│   ├── index.ts                        # Model exports
│   ├── User.ts                         # User model
│   ├── Resume.ts                       # Resume model
│   ├── Roadmap.ts                      # Roadmap model
│   ├── Interview.ts                   # Interview model
│   ├── InterviewFeedback.ts           # Interview feedback model
│   ├── Job.ts                          # Job model
│   ├── Application.ts                  # Job application model
│   ├── Mentor.ts                       # Mentor model
│   ├── Session.ts                      # Mentor session model
│   ├── Question.ts                     # Community question model
│   ├── Portfolio.ts                    # Portfolio model
│   ├── Notification.ts                 # Notification model
│   ├── CourseBookmark.ts               # Course bookmark model
│   ├── CourseProgress.ts               # Course progress model
│   └── Exercise.ts                     # Exercise model
│
├── 📁 types/                            # TypeScript type definitions
│   ├── index.ts                        # Shared types
│   └── next-auth.d.ts                  # NextAuth type extensions
│
├── 📁 constants/                        # Constants
│   └── aiInterview.ts                   # Interview constants
│
├── 📁 scripts/                          # Utility scripts
│   ├── create-admin.ts                 # Create admin user
│   └── seedJobs.ts                     # Seed jobs data
│
├── 📁 public/                           # Static assets
│   ├── logo.png                        # Logo
│   ├── uploads/                        # User uploads
│   │   ├── avatar-*.png               # User avatars
│   │   └── resumes/                   # Resume files
│   │       └── *.pdf
│   └── [payment logos]                 # Payment partner logos
│
├── 📁 Documentation
│   ├── README.md                       # Main README
│   ├── PROJECT_STRUCTURE.md           # This file
│   ├── SETUP.md                        # Setup guide
│   ├── PDF_PARSING_SETUP.md           # PDF parsing guide
│   ├── GEMINI_V1_DIRECT_SDK_REPORT.md # AI unification report
│   ├── GEMINI_V1_UNIFICATION_REPORT.md # Previous unification report
│   ├── AI_MODEL_COMPATIBILITY.md      # Model compatibility guide
│   └── INTEGRATION_LOG.md             # Integration log
│
└── 📁 Configuration
    ├── auth.ts                         # NextAuth configuration
    └── auth.config.ts                  # Auth config helper
```

---

## 🔄 Workflow Documentation

### 1. Authentication Flow

```
User Registration/Login
    ↓
app/(auth)/login/page.tsx
    ↓
POST /api/auth/[...nextauth]
    ↓
NextAuth.js (auth.ts)
    ↓
MongoDB User Model
    ↓
Role-based Redirect (lib/roleRedirect.ts)
    ↓
Dashboard (User/Admin/Mentor/Recruiter)
```

**Key Files:**
- `app/(auth)/login/page.tsx` - Login UI
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `auth.ts` - NextAuth configuration
- `lib/roleRedirect.ts` - Role-based routing

---

### 2. Resume Upload & Analysis Flow

```
User Uploads Resume
    ↓
components/resumes/ResumeUploadWidget.tsx
    ↓
POST /api/resumes
    ↓
app/api/resumes/route.ts
    ↓
lib/resumeFileService.ts (saveResumeFile)
    ↓
lib/pdfParser.ts (extractTextFromPdf)
    ↓
MongoDB Resume Model (save metadata)
    ↓
User Clicks "Analyze"
    ↓
POST /api/resumes/[id]/analyze
    ↓
app/api/resumes/[id]/analyze/route.ts
    ↓
lib/analyzerService.ts (analyzeResumeAgainstJD)
    ↓
lib/unifiedAI.ts (generateObjectUnified)
    ↓
Gemini API (gemini-2.0-flash-001)
    ↓
Return Analysis Results
    ↓
components/resumes/ATSFeedback.tsx (display)
```

**Key Files:**
- `components/resumes/ResumeUploadWidget.tsx` - Upload UI
- `app/api/resumes/route.ts` - Upload endpoint
- `lib/pdfParser.ts` - PDF text extraction
- `app/api/resumes/[id]/analyze/route.ts` - Analysis endpoint
- `lib/analyzerService.ts` - Analysis logic
- `lib/unifiedAI.ts` - AI service

---

### 3. Roadmap Generation Flow

```
User Requests Roadmap
    ↓
app/(dashboard)/dashboard/roadmap/page.tsx
    ↓
POST /api/roadmap/generate
    ↓
app/api/roadmap/generate/route.ts
    ↓
lib/geminiAIEnhanced.ts (generateInteractiveRoadmap)
    ↓
lib/unifiedAI.ts (generateTextUnified)
    ↓
Gemini API (gemini-2.0-flash-001)
    ↓
Parse JSON Response
    ↓
MongoDB Roadmap Model (save)
    ↓
Display Roadmap
    ↓
components/ai/CareerRoadmap.tsx
```

**Key Files:**
- `app/(dashboard)/dashboard/roadmap/page.tsx` - Roadmap UI
- `app/api/roadmap/generate/route.ts` - Generation endpoint
- `lib/geminiAIEnhanced.ts` - Enhanced roadmap generation
- `lib/unifiedAI.ts` - AI service
- `models/Roadmap.ts` - Roadmap model

---

### 4. Mock Interview Flow

```
User Starts Interview
    ↓
app/(dashboard)/dashboard/interview/page.tsx
    ↓
components/ai/MockInterview.tsx
    ↓
POST /api/ai-interviews
    ↓
app/api/ai-interviews/route.ts
    ↓
lib/aiInterview.ts (generateInterviewQuestions)
    ↓
Gemini API (gemini-2.0-flash-001)
    ↓
User Answers Questions
    ↓
POST /api/ai-interviews/[id]/feedback
    ↓
app/api/ai-interviews/[id]/feedback/route.ts
    ↓
lib/aiInterview.ts (generateInterviewFeedback)
    ↓
Gemini API (gemini-2.0-flash-001)
    ↓
Display Feedback
    ↓
app/(dashboard)/dashboard/interviews/[id]/feedback/page.tsx
```

**Key Files:**
- `app/(dashboard)/dashboard/interview/page.tsx` - Interview UI
- `components/ai/MockInterview.tsx` - Interview component
- `app/api/ai-interviews/route.ts` - Create interview
- `lib/aiInterview.ts` - Interview AI logic
- `models/Interview.ts` - Interview model

---

### 5. Job Application Flow

```
User Browses Jobs
    ↓
app/(dashboard)/dashboard/jobs/page.tsx
    ↓
GET /api/jobs
    ↓
app/api/jobs/route.ts
    ↓
MongoDB Job Model (query)
    ↓
User Views Job Details
    ↓
app/(dashboard)/dashboard/jobs/[id]/page.tsx
    ↓
User Clicks "Apply"
    ↓
POST /api/applications
    ↓
app/api/applications/route.ts
    ↓
MongoDB Application Model (create)
    ↓
Notification Created
    ↓
MongoDB Notification Model
```

**Key Files:**
- `app/(dashboard)/dashboard/jobs/page.tsx` - Jobs list
- `app/api/jobs/route.ts` - Jobs API
- `app/api/applications/route.ts` - Applications API
- `models/Application.ts` - Application model

---

### 6. Mentor Booking Flow

```
User Browses Mentors
    ↓
app/(dashboard)/dashboard/mentors/page.tsx
    ↓
GET /api/mentors
    ↓
app/api/mentors/route.ts
    ↓
MongoDB Mentor Model (query)
    ↓
User Views Mentor Profile
    ↓
app/(dashboard)/dashboard/mentors/[id]/book/page.tsx
    ↓
User Books Session
    ↓
POST /api/mentors/book
    ↓
app/api/mentors/book/route.ts
    ↓
MongoDB Session Model (create)
    ↓
Notifications Sent
```

**Key Files:**
- `app/(dashboard)/dashboard/mentors/page.tsx` - Mentors list
- `app/api/mentors/route.ts` - Mentors API
- `app/api/mentors/book/route.ts` - Booking endpoint
- `models/Session.ts` - Session model

---

## 🏗️ Architecture Overview

### Frontend Architecture

```
Next.js 14 App Router
    ↓
Route Groups (auth, dashboard, admin, mentor, recruiter)
    ↓
Server Components (default) + Client Components ('use client')
    ↓
React Components (components/)
    ↓
API Routes (app/api/)
```

### Backend Architecture

```
API Routes (Next.js Route Handlers)
    ↓
Service Layer (lib/)
    ↓
Database Layer (models/)
    ↓
MongoDB Atlas
```

### AI Integration Architecture

```
All AI Features
    ↓
lib/unifiedAI.ts (Single Entry Point)
    ↓
@google/generative-ai SDK
    ↓
Gemini API (gemini-2.0-flash-001)
```

**AI Features:**
- Resume Analysis → `lib/analyzerService.ts` → `lib/unifiedAI.ts`
- Roadmap Generation → `lib/geminiAIEnhanced.ts` → `lib/unifiedAI.ts`
- Mock Interviews → `lib/aiInterview.ts` → Direct Gemini API

---

## 🔑 Key Paths & Entry Points

### User Entry Points

1. **Landing Page:** `app/page.tsx`
2. **Login:** `app/(auth)/login/page.tsx`
3. **Dashboard:** `app/(dashboard)/dashboard/page.tsx`

### Admin Entry Points

1. **Admin Dashboard:** `app/(admin)/admin/dashboard/page.tsx`
2. **User Management:** `app/(admin)/admin/users/page.tsx`

### API Entry Points

1. **Resume Upload:** `POST /api/resumes`
2. **Resume Analysis:** `POST /api/resumes/[id]/analyze`
3. **Roadmap Generation:** `POST /api/roadmap/generate`
4. **Interview Creation:** `POST /api/ai-interviews`
5. **Job Matching:** `POST /api/jobs/match`

### Service Entry Points

1. **Unified AI:** `lib/unifiedAI.ts`
2. **Database:** `lib/mongodb.ts`
3. **PDF Parsing:** `lib/pdfParser.ts`
4. **Resume Analysis:** `lib/analyzerService.ts`

---

## 📊 Data Flow Examples

### Example 1: Resume Analysis

```
1. User uploads PDF → public/uploads/resumes/
2. PDF parsed → lib/pdfParser.ts
3. Text extracted → MongoDB Resume.text
4. User provides JD → Frontend
5. Analysis request → POST /api/resumes/[id]/analyze
6. AI analysis → lib/unifiedAI.ts → Gemini API
7. Results saved → MongoDB Resume.analysis
8. Results displayed → components/resumes/ATSFeedback.tsx
```

### Example 2: Roadmap Generation

```
1. User profile data → MongoDB User
2. Roadmap request → POST /api/roadmap/generate
3. AI generation → lib/unifiedAI.ts → Gemini API
4. JSON parsed → lib/geminiAIEnhanced.ts
5. Roadmap saved → MongoDB Roadmap
6. Roadmap displayed → components/ai/CareerRoadmap.tsx
7. User tracks progress → MongoDB Roadmap.completed
```

---

## 🛠️ Development Workflow

### Adding a New Feature

1. **Create Model** (if needed)
   - `models/NewFeature.ts`
   - Export in `models/index.ts`

2. **Create API Route**
   - `app/api/new-feature/route.ts`
   - Or `app/api/new-feature/[id]/route.ts`

3. **Create Service** (if needed)
   - `lib/newFeatureService.ts`

4. **Create Component**
   - `components/new-feature/NewFeatureComponent.tsx`

5. **Create Page**
   - `app/(dashboard)/dashboard/new-feature/page.tsx`

6. **Update Navigation**
   - `components/dashboard/DynamicDashboardNav.tsx`

---

## 🔐 Security & Authentication

### Authentication Flow

```
Middleware (middleware.ts)
    ↓
NextAuth Session Check
    ↓
Role-based Access Control
    ↓
Route Protection
```

### Protected Routes

- All `/dashboard/*` routes require authentication
- All `/admin/*` routes require admin role
- All `/mentor/*` routes require mentor role
- All `/recruiter/*` routes require recruiter role

### API Security

- All API routes check authentication via `auth()` from NextAuth
- File uploads validated for type and size
- User ownership verified for resource access

---

## 📝 Environment Variables

Required in `.env.local`:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# AI Services
GEMINI_API_KEY=...

# Voice Interview
NEXT_PUBLIC_VAPI_WEB_TOKEN=...
NEXT_PUBLIC_VAPI_WORKFLOW_ID=...

# External APIs
RAPIDAPI_KEY=...
```

---

## 🚀 Deployment Workflow

1. **Build:** `npm run build`
2. **Start:** `npm start`
3. **Environment:** Set all env variables in production
4. **Database:** MongoDB Atlas connection
5. **File Storage:** `public/uploads/` (consider S3 for production)

---

## 📚 Additional Documentation

- **Setup Guide:** `SETUP.md`
- **PDF Parsing:** `PDF_PARSING_SETUP.md`
- **AI Unification:** `GEMINI_V1_DIRECT_SDK_REPORT.md`
- **Main README:** `README.md`

---

**Last Updated:** 2024-12-19  
**Maintained by:** Development Team

