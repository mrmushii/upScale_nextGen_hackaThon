// User Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  educationLevel: string;
  experienceLevel: string;
  preferredTrack: string;
  targetRoles: string[];
  skills: string[];
  cvText?: string;
  country: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  category: string;
  aliases: string[];
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  requiredSkills: string[];
  recommendedExperience: string;
  jobType: string;
  description: string;
  tags: string[];
  track: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: Date;
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  platform: string;
  url: string;
  relatedSkills: string[];
  costIndicator: "free" | "paid" | "freemium";
  level: "beginner" | "intermediate" | "advanced";
  durationMinutes?: number;
  tags: string[];
  rating?: number;
}

// Roadmap Types
export interface RoadmapStage {
  name: string;
  goals: string[];
  resources: Resource[];
  projects: string[];
  estimatedWeeks: number;
}

export interface Roadmap {
  id: string;
  userId: string;
  targetRole: string;
  stages: RoadmapStage[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interview Types
export interface InterviewQuestion {
  id: string;
  question: string;
  type: "technical" | "behavioral";
  difficulty: "easy" | "medium" | "hard";
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  questions: InterviewQuestion[];
  answers: string[];
  feedback: string[];
  score: number;
  createdAt: Date;
}

// Mentor Types
export interface Mentor {
  id: string;
  name: string;
  bio: string;
  skills: string[];
  roles: string[];
  hourlyRate: number;
  availability: string[];
  rating: number;
  verified: boolean;
  sessionsCompleted: number;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  mentorId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  price: number;
  commissionRate: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentId?: string;
  notes?: string;
}

// Portfolio Types
export interface PortfolioSection {
  type: "about" | "skills" | "projects" | "experience" | "education" | "certifications";
  content: any;
}

export interface Portfolio {
  id: string;
  userId: string;
  sections: PortfolioSection[];
  publishedUrl?: string;
  lastUpdated: Date;
}

// Application Types
export interface Application {
  id: string;
  userId: string;
  jobId?: string;
  externalLink?: string;
  status: "applied" | "interview" | "offer" | "rejected" | "accepted";
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

// Match Explanation Types
export interface MatchExplanation {
  id: string;
  entityType: "job" | "resource";
  entityId: string;
  userId: string;
  overlapSkills: string[];
  missingSkills: string[];
  score: number;
  rationaleText: string;
}

// Subscription/Pricing Types
export type PricingTier = "basic" | "pro" | "ultimate";

export interface Subscription {
  id: string;
  userId: string;
  tier: PricingTier;
  status: "active" | "cancelled" | "expired";
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

export interface UsageLimit {
  userId: string;
  tier: PricingTier;
  evaluationInterviews: number;
  careerRoadmaps: number;
  mockInterviews: number;
  cvAnalyses: number;
  mentorSessions: number;
  resetDate: Date;
}

// Feature Limits by Tier
export const TIER_LIMITS = {
  basic: {
    evaluationInterviews: 1,
    careerRoadmaps: 1,
    cvAnalyses: 1,
    mockInterviews: 0,
    mentorSessions: 0,
    portfolioTemplates: "basic",
    jobMatching: "basic",
  },
  pro: {
    evaluationInterviews: 10,
    careerRoadmaps: 5,
    cvAnalyses: 10,
    mockInterviews: 20,
    mentorSessions: 1,
    portfolioTemplates: "advanced",
    jobMatching: "ai-powered",
  },
  ultimate: {
    evaluationInterviews: Infinity,
    careerRoadmaps: Infinity,
    cvAnalyses: Infinity,
    mockInterviews: Infinity,
    mentorSessions: Infinity,
    portfolioTemplates: "premium",
    jobMatching: "priority-ai",
  },
} as const;

