// Pricing Information
export const PRICING = {
  basic: {
    name: "Basic",
    price: 0,
    currency: "BDT",
    features: [
      "One-time evaluation interview",
      "Generate one career roadmap",
      "One-time CV analyzer (no feedback)",
      "Basic job matching",
      "Community Q&A access",
      "Portfolio builder (basic)",
    ],
  },
  pro: {
    name: "Pro",
    price: 999,
    currency: "BDT",
    features: [
      "10 evaluation interviews/month",
      "5 career roadmaps/month",
      "AI mock interviews with feedback",
      "AI resume checker with feedback",
      "Advanced portfolio builder",
      "AI-powered job matching",
      "Priority community support",
      "1 mentor session included",
      "Application tracker",
    ],
  },
  ultimate: {
    name: "Ultimate",
    price: 2499,
    currency: "BDT",
    features: [
      "Unlimited evaluation interviews",
      "Unlimited career roadmaps",
      "Unlimited AI mock interviews",
      "Advanced AI resume optimization",
      "Premium portfolio templates",
      "Priority AI job matching",
      "Unlimited mentor sessions",
      "Dedicated career advisor",
      "Interview guarantee program",
      "Exclusive job opportunities",
      "Priority customer support",
      "Early access to new features",
    ],
  },
} as const;

// Career Tracks
export const CAREER_TRACKS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "Quality Assurance",
  "Cybersecurity",
] as const;

// Experience Levels
export const EXPERIENCE_LEVELS = [
  "Fresh Graduate",
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5-10 years)",
  "Lead/Principal (10+ years)",
] as const;

// Education Levels
export const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Bootcamp Graduate",
  "Self-Taught",
] as const;

// Job Types
export const JOB_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Freelance",
  "Internship",
] as const;

// Skill Categories
export const SKILL_CATEGORIES = [
  "Programming Languages",
  "Frameworks & Libraries",
  "Databases",
  "Cloud & DevOps",
  "Design Tools",
  "Soft Skills",
  "Testing",
  "Tools & Technologies",
] as const;

// Popular Skills by Track
export const TRACK_SKILLS = {
  "Frontend Development": [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Angular",
    "Tailwind CSS",
    "Next.js",
    "Responsive Design",
  ],
  "Backend Development": [
    "Node.js",
    "Python",
    "Java",
    "PostgreSQL",
    "MongoDB",
    "Express.js",
    "Django",
    "Spring Boot",
    "REST API",
    "GraphQL",
  ],
  "Full Stack Development": [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "Next.js",
    "REST API",
    "Git",
    "Docker",
  ],
  "Mobile Development": [
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "iOS Development",
    "Android Development",
    "Mobile UI/UX",
  ],
  "Data Science": [
    "Python",
    "R",
    "SQL",
    "Machine Learning",
    "Statistics",
    "Pandas",
    "NumPy",
    "Data Visualization",
    "Jupyter",
  ],
  "UI/UX Design": [
    "Figma",
    "Adobe XD",
    "Sketch",
    "User Research",
    "Wireframing",
    "Prototyping",
    "Design Systems",
    "Usability Testing",
  ],
} as const;

// Bangladeshi Cities
export const BD_CITIES = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
] as const;

// Application Status
export const APPLICATION_STATUS = {
  applied: { label: "Applied", color: "blue" },
  interview: { label: "Interview Scheduled", color: "yellow" },
  offer: { label: "Offer Received", color: "green" },
  rejected: { label: "Rejected", color: "red" },
  accepted: { label: "Offer Accepted", color: "purple" },
} as const;

// Mentor Commission Rate
export const MENTOR_COMMISSION_RATE = 0.15; // 15%

// Platform Limits
export const LIMITS = {
  maxSkills: 50,
  maxTargetRoles: 5,
  maxCVLength: 10000, // characters
  maxProjectsInPortfolio: 20,
  maxApplicationNotes: 1000, // characters
} as const;

// Feature Flags (for gradual rollout)
export const FEATURES = {
  aiMockInterview: false,
  aiCVAnalyzer: false,
  aiJobMatching: false,
  aiRoadmapGeneration: false,
  mentorBooking: true,
  portfolioBuilder: true,
  communityQA: true,
  applicationTracker: true,
} as const;

// API Endpoints (when backend is ready)
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
  },
  users: {
    profile: "/api/users/profile",
    skills: "/api/users/skills",
    updateProfile: "/api/users/update",
  },
  jobs: {
    list: "/api/jobs",
    detail: "/api/jobs/:id",
    match: "/api/jobs/match",
    apply: "/api/jobs/apply",
  },
  resources: {
    list: "/api/resources",
    recommend: "/api/resources/recommend",
  },
  roadmap: {
    generate: "/api/roadmap/generate",
    get: "/api/roadmap/:id",
    updateProgress: "/api/roadmap/progress",
  },
  interview: {
    start: "/api/interview/start",
    submit: "/api/interview/submit",
    feedback: "/api/interview/feedback",
  },
  mentors: {
    list: "/api/mentors",
    detail: "/api/mentors/:id",
    book: "/api/mentors/book",
    sessions: "/api/mentors/sessions",
  },
  portfolio: {
    get: "/api/portfolio",
    update: "/api/portfolio/update",
    publish: "/api/portfolio/publish",
  },
} as const;

// Regex Patterns
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+88)?01[3-9]\d{8}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
} as const;

