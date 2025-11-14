# Upscale Career Platform

A full-stack career acceleration platform built with Next.js that helps professionals discover learning resources, generate tailored roadmaps, run AI-powered mock interviews, and collaborate with mentors and recruiters.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Features

- **Personalized Onboarding**: Profile completion tracking ensures users complete necessary information before accessing premium features
- **AI-Powered Roadmaps**: Generate personalized 3-stage learning plans using Google Gemini AI
- **Interactive Learning**: Track course progress, code challenges, bookmarks, and watch history
- **Smart Job Discovery**: Unified job board combining internal recruiter posts with external Findwork.dev listings, sorted by personalized relevance scores
- **Favorite Jobs & Skill Gap Analysis**: Save favorite jobs and get automatic skill gap analysis with course recommendations
- **Role-Based Dashboards**: Separate portals for users, recruiters, mentors, and admins
- **Subscription Tiers**: Basic, Pro, and Ultimate plans with usage limits and payment integration
- **AI Mock Interviews** (Pro & Ultimate): Generate interview scenarios, practice with voice AI, and receive structured feedback
- **Smart Skill Extraction**: Automatically extract skills, tools, and roles from CV text or uploaded files
- **CV Generator**: Generate professional CVs from profile data
- **Application Tracker**: Track all job applications in one place
- **Portfolio Builder**: Create and publish professional portfolios
- **Community Forum**: Ask questions and get answers from the community
- **Mentor Booking**: Book sessions with verified mentors

### Learning Resources

- **Udemy Integration**: Browse and enroll in Udemy courses via RapidAPI
- **YouTube Playlists**: Curated learning playlists from top channels
- **Microsoft Learn**: Access Microsoft Learn modules and certifications

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Next.js Route Handlers, NextAuth.js (JWT), Vercel AI SDK |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **AI & Voice** | Google Gemini 2.0 Flash, `ai` SDK, `@ai-sdk/google`, Vapi Web Voice SDK |
| **Integrations** | RapidAPI (Findwork, Udemy), YouTube Data API v3, Microsoft Learn |
| **Authentication** | NextAuth.js with Credentials provider |
| **File Storage** | Local filesystem (public/uploads) |
| **Deployment** | Vercel-ready |

---

## Installation & Setup

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB connection string (local or Atlas)
- API keys for integrations (see [Environment Variables](#environment-variables))

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/upscale.git
cd upscale/upScale_nextGen_hackaThon
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy the environment template:

```bash
cp env.template .env.local
```

Fill in all required variables (see [Environment Variables](#environment-variables) below).

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Step 5: Create Admin User (Optional)

```bash
npm run create:admin
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:jobs` - Seed sample job listings
- `npm run create:admin` - Create admin user

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```env
# Database
MONGODB_URI="mongodb://localhost:27017/upscale"
# For MongoDB Atlas:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/upscale?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# AI APIs
GEMINI_API_KEY="your-gemini-api-key-here"
GOOGLE_GENERATIVE_AI_API_KEY="" # Optional, falls back to GEMINI_API_KEY

# Voice AI (for Pro/Ultimate interviews)
NEXT_PUBLIC_VAPI_WEB_TOKEN="your-vapi-web-token"
NEXT_PUBLIC_VAPI_WORKFLOW_ID="your-vapi-workflow-id"

# RapidAPI
RAPIDAPI_KEY="your-rapidapi-key"
RAPIDAPI_UDEMY_HOST="udemy-paid-courses-for-free-api.p.rapidapi.com"

# Findwork.dev API
FINDWORK_API_TOKEN="your-findwork-api-token"
```

### Optional Variables

```env
# Payment Gateways
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
BKASH_API_KEY="your-bkash-api-key"
BKASH_API_SECRET="your-bkash-api-secret"
NAGAD_API_KEY="your-nagad-api-key"
NAGAD_API_SECRET="your-nagad-api-secret"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Storage (for production, consider AWS S3)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="upscale-assets"

# Feature Flags
ENABLE_AI_FEATURES="true"
ENABLE_MENTOR_BOOKING="true"
ENABLE_PAYMENTS="false"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

> **Security Note**: Never commit `.env.local` to version control. All secrets should be stored securely.

---

## Usage Guide

### For Job Seekers

1. **Register & Complete Profile**
   - Sign up at `/register`
   - Complete your profile at `/dashboard/profile/complete`
   - Add skills, experience, education, and target roles

2. **Generate Roadmap**
   - Navigate to `/dashboard/roadmap`
   - Select your target role
   - AI generates a personalized 3-stage learning plan

3. **Browse Jobs**
   - Visit `/dashboard/jobs` to see job listings
   - Filter by track, location, remote preference
   - Click "Favorite" to save jobs and get skill gap analysis
   - View favorite jobs at `/dashboard/jobs/favorites`

4. **Track Applications**
   - Apply to jobs through the platform
   - Track all applications at `/dashboard/applications`
   - Update status and add notes

5. **AI Mock Interviews** (Pro/Ultimate)
   - Access at `/dashboard/interviews`
   - Generate interview scenarios
   - Practice with voice AI
   - Review feedback and scores

6. **Learning Resources**
   - Browse courses at `/dashboard/resources`
   - Bookmark favorites
   - Track progress

### For Recruiters

1. **Register as Recruiter**
   - Sign up at `/register-recruiter`
   - Wait for admin approval

2. **Post Jobs**
   - Navigate to `/recruiter/jobs`
   - Create job listings
   - Jobs require admin approval before going live

3. **Analytics**
   - View job performance metrics
   - Track applications

### For Mentors

1. **Register as Mentor**
   - Sign up and complete mentor profile
   - Set availability and rates

2. **Manage Sessions**
   - View bookings at `/mentor/sessions`
   - Track earnings
   - Manage schedule

---

## API Documentation

### Authentication

All API endpoints (except public test endpoints) require authentication via NextAuth.js session.

### Core Endpoints

#### User & Profile

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/register-recruiter` | POST | Register recruiter account |
| `/api/user/profile` | GET, PATCH | Get/update user profile |
| `/api/user/profile/completion` | GET | Get profile completion metrics |
| `/api/upload/avatar` | POST | Upload profile avatar (max 5MB) |

#### Jobs & Applications

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobs/unified` | GET | Get unified job feed (recruiter + Findwork) |
| `/api/jobs/[id]` | GET | Get job details |
| `/api/jobs/match` | GET | Get top job matches for user |
| `/api/jobs/favorites` | GET, POST, DELETE | Manage favorite jobs |
| `/api/jobs/favorites/[jobId]/suggestions` | GET | Get course suggestions for skill gaps |
| `/api/applications` | GET, POST | Manage job applications |

#### Learning & Roadmaps

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/roadmap/generate` | POST | Generate AI roadmap (quota limited) |
| `/api/roadmap/[id]` | GET | Get roadmap details |
| `/api/resources/udemy` | GET | Search Udemy courses |
| `/api/resources/udemy/[id]` | GET | Get Udemy course details |
| `/api/resources/youtube` | GET | Get YouTube playlists |
| `/api/resources/microsoft` | GET | Get Microsoft Learn modules |
| `/api/resources/bookmarks` | GET, POST | Manage bookmarks |
| `/api/resources/history` | GET | Get learning history |

#### AI Features

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai-interviews` | GET, POST | List/generate AI interviews (Pro/Ultimate) |
| `/api/ai-interviews/[id]` | GET | Get interview details |
| `/api/ai-interviews/[id]/feedback` | GET, POST | Get/generate interview feedback |
| `/api/skills/extract` | POST | Extract skills from CV text/file |
| `/api/cv/analyze` | POST | Analyze CV (quota limited) |
| `/api/cv/generate` | POST | Generate CV from profile |

#### Subscriptions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subscription` | GET, POST | Get/update subscription |
| `/api/settings/preferences` | GET, PUT | Update preferences |

### Request/Response Examples

#### Generate Roadmap

```bash
POST /api/roadmap/generate
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "targetRole": "Full Stack Developer"
}
```

Response:
```json
{
  "roadmap": {
    "_id": "...",
    "targetRole": "Full Stack Developer",
    "stages": [...],
    "progress": {...}
  }
}
```

#### Add Favorite Job

```bash
POST /api/jobs/favorites
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "jobId": "123",
  "jobTitle": "Senior Developer",
  "company": "Tech Corp",
  "jobData": {...}
}
```

Response:
```json
{
  "message": "Job added to favorites",
  "favoriteJob": {
    "_id": "...",
    "jobId": "123",
    "skillGaps": {
      "missingSkills": ["React", "TypeScript"],
      "existingSkills": ["JavaScript", "Node.js"],
      "matchPercentage": 60,
      "recommendations": [...]
    }
  }
}
```

---

## Deployment

### Vercel Deployment

This application is optimized for Vercel deployment.

#### Step 1: Prepare for Production

1. Ensure all environment variables are set in Vercel dashboard
2. Update `NEXTAUTH_URL` to your production domain
3. Set `NODE_ENV=production`

#### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

#### Step 3: Configure Environment Variables

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `env.template`
3. Ensure `NEXTAUTH_URL` matches your domain

#### Step 4: Database Setup

- Use MongoDB Atlas for production
- Update `MONGODB_URI` in Vercel environment variables
- Ensure IP whitelist includes Vercel IPs

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- **Netlify**: Use Netlify's Next.js runtime
- **AWS Amplify**: Configure build settings for Next.js
- **Docker**: Use the included Dockerfile (if available)

### Production Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas connection string set
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] API keys for all integrations configured
- [ ] File upload directory has write permissions
- [ ] Test endpoints are protected or removed
- [ ] Error logging configured
- [ ] Monitoring set up

---

## Security

### Security Features

- ✅ Authentication required for all protected routes
- ✅ Role-based access control (RBAC)
- ✅ API keys stored in environment variables (never hardcoded)
- ✅ File upload validation (type and size)
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention (MongoDB with Mongoose)
- ✅ XSS protection (React's built-in escaping)
- ✅ CSRF protection (NextAuth.js)
- ✅ Rate limiting on API routes (via usage limits)
- ✅ Test endpoints protected in production

### Security Best Practices

1. **Never commit secrets**: All API keys and secrets should be in `.env.local` (gitignored)
2. **Use strong passwords**: Enforce minimum password requirements
3. **Regular updates**: Keep dependencies updated
4. **Monitor logs**: Set up error tracking (e.g., Sentry)
5. **HTTPS only**: Always use HTTPS in production
6. **File validation**: Validate all file uploads for type and size

### Reporting Security Issues

If you discover a security vulnerability, please email security@upscale.com (replace with your email) instead of using the issue tracker.

---

## Known Issues

1. **File Storage**: Currently uses local filesystem. For production, consider migrating to AWS S3 or similar.
2. **Rate Limiting**: API rate limiting is handled via usage limits. Consider implementing proper rate limiting middleware.
3. **Email Service**: Email functionality is optional and not fully implemented.
4. **Payment Integration**: Payment gateways are configured but may need additional setup for production.

---

## Future Improvements

- [ ] Implement proper rate limiting middleware
- [ ] Migrate file storage to AWS S3 or Cloudinary
- [ ] Add email notifications
- [ ] Implement real-time notifications (WebSockets)
- [ ] Add unit and integration tests
- [ ] Implement caching layer (Redis)
- [ ] Add analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search and filtering

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Run** linting (`npm run lint`)
5. **Commit** your changes (`git commit -m 'feat: Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation for new features

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Support

For support, email support@upscale.com or open an issue in the repository.

---

**Built with ❤️ by the Upscale team** — accelerating careers one roadmap at a time.
