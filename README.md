# Upscale - Career Readiness Ecosystem

A modern, AI-powered SaaS platform connecting youth skills to real opportunities with personalized career roadmaps, expert mentorship, and transparent job matching.

## 🎯 Mission

Transform fragmented learning into clear, evidence-backed career roadmaps. Connect job seekers with real opportunities through AI-powered guidance, hands-on practice, and professional mentorship.

## ✨ Features

### Core Platform Features
- **AI-Powered Skill Gap Analysis**: Intelligent radar system mapping current skills against target roles
- **Personalized Career Roadmaps**: Step-by-step learning paths tailored to individual goals
- **Expert 1-on-1 Mentorship**: Direct sessions with industry professionals
- **AI Mock Interviews**: Practice with feedback on technical and behavioral questions
- **Smart CV Analyzer**: AI-driven resume analysis with improvement suggestions
- **Portfolio Builder**: Professional portfolio creation with project showcases
- **Transparent Job Matching**: Clear explanations for every job recommendation
- **Community Q&A**: Peer learning and mentor-led discussions
- **Application Tracker**: Centralized tracking for all job applications

### Pricing Tiers

#### 🆓 Basic (Free)
- One-time evaluation interview
- Generate one career roadmap
- One-time CV analyzer (no feedback)
- Basic job matching
- Community access
- Basic portfolio builder

#### 🚀 Pro (৳999/month)
- 10 evaluation interviews/month
- 5 career roadmaps/month
- AI mock interviews with feedback
- AI resume checker with feedback
- Advanced portfolio builder
- AI-powered job matching
- 1 mentor session included
- Application tracker
- Priority support

#### 👑 Ultimate (৳2,499/month)
- **Unlimited** evaluation interviews
- **Unlimited** career roadmaps
- **Unlimited** AI mock interviews
- Advanced AI resume optimization
- Premium portfolio templates
- Priority AI job matching
- **Unlimited** mentor sessions
- Dedicated career advisor
- Interview guarantee program
- Exclusive job opportunities
- Early access to new features

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Custom CSS animations + Framer Motion ready
- **Deployment**: Vercel (Frontend), Railway/Render (Backend when implemented)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Upscale
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Upscale/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles & Tailwind
├── components/
│   ├── Navbar.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section
│   ├── WhyStandOut.tsx     # Key differentiators
│   ├── Features.tsx        # Feature showcase
│   ├── HowItWorks.tsx      # Process steps
│   ├── Statistics.tsx      # Platform statistics
│   ├── Steps.tsx           # Getting started steps
│   ├── Pricing.tsx         # 3-tier pricing section
│   ├── Testimonials.tsx    # User testimonials
│   ├── FAQ.tsx             # Frequently asked questions
│   ├── CTA.tsx             # Call-to-action section
│   ├── Footer.tsx          # Footer with links
│   └── ai/                 # AI feature placeholders
│       ├── MockInterview.tsx
│       ├── CVAnalyzer.tsx
│       ├── JobMatching.tsx
│       └── CareerRoadmap.tsx
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies

```

## 🎨 Design System

### Color Palette
- **Primary**: Pink/Rose tones (#f43f5e, #fecdd3, #fff1f2)
- **Coral Accent**: Coral/Red tones (#ff4444, #ffa3a3)
- **Neutral**: Grays for text and backgrounds

### Gradients
- `gradient-hero`: Pink to coral gradient for hero sections
- `gradient-primary`: Soft pink gradient for backgrounds
- Custom gradient utilities for CTAs and accents

### Animations
- Fade in/out effects
- Slide transitions
- Float animations for decorative elements
- Hover transforms and scale effects

## 🔮 AI Features (Placeholders)

The following AI features have placeholder components ready for integration:

1. **AI Mock Interview** (`/components/ai/MockInterview.tsx`)
   - Video/text interview modes
   - Real-time feedback system
   - Response evaluation

2. **CV Analyzer** (`/components/ai/CVAnalyzer.tsx`)
   - Resume upload interface
   - ATS compatibility check
   - Keyword optimization

3. **Job Matching** (`/components/ai/JobMatching.tsx`)
   - Smart matching algorithm
   - Transparent explanations
   - Career growth alignment

4. **Career Roadmap** (`/components/ai/CareerRoadmap.tsx`)
   - Personalized learning paths
   - Skill progression tracking
   - Resource recommendations

## 📋 Implementation Roadmap

### Phase 1 - Foundation (Current)
- ✅ Landing page with all sections
- ✅ 3-tier pricing model
- ✅ AI feature placeholders
- ✅ Responsive design
- ✅ Animations and gradients

### Phase 2 - Backend & Auth
- [ ] User authentication system
- [ ] Database schema setup (PostgreSQL + Prisma)
- [ ] API routes for user management
- [ ] Payment integration (bKash/Nagad/Stripe)

### Phase 3 - Core Features
- [ ] Profile creation & skill management
- [ ] Career roadmap generation
- [ ] Job listing & matching system
- [ ] Application tracker
- [ ] Portfolio builder

### Phase 4 - Mentorship
- [ ] Mentor profiles & vetting
- [ ] Booking system with calendar
- [ ] Payment escrow for sessions
- [ ] Session notes & summaries

### Phase 5 - AI Integration
- [ ] CV parsing & skill extraction
- [ ] Semantic job matching with embeddings
- [ ] AI mock interview system
- [ ] Adaptive learning recommendations
- [ ] Resume optimization AI

## 🌐 Deployment

### Vercel (Recommended for Frontend)
1. Push your code to GitHub
2. Import project to Vercel
3. Deploy automatically

### Environment Variables (When Backend is Ready)
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
BKASH_API_KEY=
NAGAD_API_KEY=
OPENAI_API_KEY=
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 📧 Contact

- **Email**: support@upscale.com
- **Phone**: +880 1234-567890
- **Location**: Dhaka, Bangladesh

## 🙏 Acknowledgments

- Design inspiration from modern SaaS platforms
- Bangladesh tech community for feedback
- All contributors and early adopters

---

**Built with ❤️ for the career success of Bangladesh's youth**

