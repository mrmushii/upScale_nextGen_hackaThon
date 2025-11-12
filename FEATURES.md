# Upscale Features Documentation

## 🎯 SaaS Model Overview

Upscale operates on a **3-tier subscription model** designed to serve users at different stages of their career journey.

### Pricing Tiers

| Feature | Basic (Free) | Pro (৳999/mo) | Ultimate (৳2,499/mo) |
|---------|-------------|---------------|---------------------|
| **Evaluation Interviews** | 1x | 10/month | Unlimited |
| **Career Roadmaps** | 1x | 5/month | Unlimited |
| **CV Analysis** | 1x (no feedback) | 10/month with feedback | Unlimited with AI optimization |
| **Mock Interviews** | ❌ | 20/month | Unlimited |
| **Portfolio Builder** | Basic | Advanced | Premium templates |
| **Job Matching** | Basic | AI-Powered | Priority AI |
| **Mentor Sessions** | ❌ | 1 included | Unlimited |
| **Career Advisor** | ❌ | ❌ | ✅ Dedicated |
| **Interview Guarantee** | ❌ | ❌ | ✅ |
| **Support** | Community | Priority | 24/7 Priority |

## 📋 Feature Breakdown

### 1. Evaluation Interview
**What it is:** An initial assessment interview to evaluate your current skills and readiness.

**How it works:**
- User answers technical and behavioral questions
- System evaluates responses based on role requirements
- Provides a skill readiness score
- Identifies strengths and improvement areas

**Tiers:**
- Basic: 1 evaluation (one-time)
- Pro: 10 evaluations/month
- Ultimate: Unlimited

---

### 2. Career Roadmap Generator
**What it is:** AI-powered personalized learning path from current skills to target role.

**How it works:**
1. Analyzes user's current skills
2. Compares with target role requirements
3. Generates staged roadmap (Prerequisites → Core → Advanced)
4. Recommends specific resources for each stage
5. Tracks progress and adjusts dynamically

**Components:**
- Skill gap analysis
- Learning resources (courses, articles, videos)
- Project suggestions
- Time estimates
- Milestone tracking

**Tiers:**
- Basic: 1 roadmap
- Pro: 5 roadmaps/month
- Ultimate: Unlimited

---

### 3. CV/Resume Analyzer
**What it is:** Intelligent resume analysis with actionable feedback.

**How it works:**
- Uploads resume (PDF/DOC)
- Parses content and extracts information
- Checks ATS compatibility
- Analyzes keyword optimization
- Provides improvement suggestions

**Analysis includes:**
- Formatting and structure
- Keyword density for target role
- Achievement vs. responsibility ratio
- Action verb usage
- Skills presentation
- ATS score

**Tiers:**
- Basic: 1 analysis, no detailed feedback
- Pro: 10 analyses/month with feedback
- Ultimate: Unlimited with AI optimization

---

### 4. AI Mock Interview
**What it is:** Practice interviews with AI-powered feedback.

**Interview Types:**
1. **Technical Interviews**
   - Role-specific questions (Frontend, Backend, etc.)
   - Coding problem discussions
   - System design scenarios

2. **Behavioral Interviews**
   - STAR method practice
   - Company culture fit
   - Leadership and teamwork scenarios

**Feedback includes:**
- Answer quality assessment
- Communication clarity
- Technical accuracy (for technical questions)
- Suggestions for improvement
- Recommended resources to study

**Tiers:**
- Basic: Not available
- Pro: 20 interviews/month
- Ultimate: Unlimited

---

### 5. Portfolio Builder
**What it is:** Professional portfolio website to showcase work and skills.

**Features:**
- Customizable sections (About, Skills, Projects, Experience)
- Project showcases with descriptions and links
- Skill tags and endorsements
- Shareable public URL
- Resume PDF export
- Analytics (Pro/Ultimate)

**Templates:**
- Basic: 2 simple templates
- Pro: 5 advanced templates + customization
- Ultimate: 10 premium templates + full customization

---

### 6. AI Job Matching
**What it is:** Intelligent job recommendations with transparent explanations.

**Matching Algorithm:**
1. **Skill Matching**
   - Analyzes overlap between user skills and job requirements
   - Weights technical skills higher than soft skills
   - Considers skill level proficiency

2. **Experience Level**
   - Matches job seniority with user experience
   - Applies penalty for significant mismatches

3. **Track Alignment**
   - Boosts score for matching career track
   - Considers stepping-stone opportunities

4. **Transparent Explanations**
   - Shows matching skills
   - Highlights missing skills
   - Provides rationale for recommendation
   - Suggests learning resources for gaps

**Tiers:**
- Basic: Rule-based matching, 10 recommendations
- Pro: AI-powered matching, 50 recommendations
- Ultimate: Priority AI matching, unlimited

---

### 7. Mentor Sessions
**What it is:** 1-on-1 video sessions with industry professionals.

**Mentor Capabilities:**
- Career guidance
- Mock interviews
- Portfolio review
- Technical questions
- Industry insights
- Salary negotiation advice

**How it works:**
1. Browse mentor profiles (skills, experience, ratings)
2. Check availability
3. Book session (30/60 min slots)
4. Platform holds payment in escrow
5. Complete session
6. Platform releases payment to mentor (85%) after successful session

**Tiers:**
- Basic: Not available
- Pro: 1 session included/month (additional at 10% discount)
- Ultimate: Unlimited sessions

---

### 8. Application Tracker
**What it is:** Centralized system to track all job applications.

**Features:**
- Add applications (internal or external)
- Status updates (Applied, Interview, Offer, Rejected, Accepted)
- Notes and reminders
- Timeline view
- Analytics (response rate, time to interview, etc.)
- Follow-up suggestions

**Tiers:**
- Available on Pro and Ultimate

---

### 9. Community Q&A
**What it is:** Forum-style community for peer learning and mentor engagement.

**Features:**
- Ask career-related questions
- Share interview experiences
- Get advice from mentors
- Upvote helpful answers
- Search by topic/tag
- Mentor-verified answers

**Tiers:**
- Available on all tiers (Basic has view-only, Pro+ can post)

---

## 🔮 Upcoming AI Features (Placeholders Ready)

### AI Features Coming Soon:

1. **Adaptive Mock Interviews**
   - Dynamic question difficulty
   - Video analysis (body language, confidence)
   - Real-time hints and guidance

2. **Career Trajectory Modeling**
   - Predict career progression
   - Identify stepping-stone roles
   - Market demand forecasting

3. **Smart Resource Curation**
   - Personalized learning paths
   - Content difficulty adaptation
   - Multi-modal learning (video, text, interactive)

4. **AI Career Advisor**
   - 24/7 chatbot assistance
   - Personalized career advice
   - Salary negotiation guidance
   - Industry trend insights

## 💡 Feature Access Logic

```typescript
const canAccessFeature = (tier, feature, usageCount) => {
  const limits = {
    basic: { evaluationInterviews: 1, roadmaps: 1, cvAnalyses: 1 },
    pro: { evaluationInterviews: 10, roadmaps: 5, cvAnalyses: 10 },
    ultimate: { evaluationInterviews: Infinity }
  };
  
  return usageCount < limits[tier][feature];
};
```

## 🎨 UI/UX Principles

1. **Clarity**: Every feature has clear value proposition
2. **Transparency**: All AI recommendations are explainable
3. **Progress Tracking**: Visual feedback on journey
4. **Accessibility**: Keyboard navigation, screen reader support
5. **Mobile-First**: Responsive design for all devices

## 🔐 Feature Security

- Data encryption at rest and in transit
- Secure payment processing (PCI compliant)
- Private portfolios (unless published)
- Anonymous job browsing
- GDPR-compliant data handling

## 📊 Feature Analytics

Track user engagement:
- Feature usage by tier
- Conversion funnels (Basic → Pro → Ultimate)
- Time to job offer
- Most-used features
- User satisfaction scores

## 🚀 Feature Rollout Plan

**Phase 1 (Current):** Landing page + Placeholders
**Phase 2:** Auth + Profile + Basic Roadmap
**Phase 3:** Jobs + Matching + Portfolio
**Phase 4:** Payments + Subscriptions + Usage Tracking
**Phase 5:** AI Integration
**Phase 6:** Advanced Analytics + Reporting

---

For implementation details, see `types/index.ts` and `lib/constants.ts`

