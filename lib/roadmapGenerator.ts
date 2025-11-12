// AI-Powered Roadmap Generation Logic
// This provides intelligent, personalized roadmaps based on user profile

interface UserProfile {
  skills: string[];
  preferredTrack: string;
  experienceLevel: string;
  targetRoles: string[];
}

interface RoadmapStage {
  name: string;
  goals: string[];
  resources: string[];
  projects: string[];
  estimatedWeeks: number;
  completed: boolean;
}

// Comprehensive roadmap templates for different tracks
const ROADMAP_TEMPLATES: Record<string, RoadmapStage[]> = {
  "Frontend Development": [
    {
      name: "Foundation & Prerequisites",
      goals: [
        "Master HTML5 semantic elements and structure",
        "Learn CSS3 including Flexbox and Grid",
        "Understand JavaScript fundamentals (ES6+)",
        "Version control with Git and GitHub",
        "Responsive design principles",
      ],
      resources: [
        "freeCodeCamp Responsive Web Design",
        "MDN Web Docs - JavaScript Guide",
        "Git & GitHub Crash Course",
      ],
      projects: [
        "Personal Portfolio Website",
        "Landing Page with Responsive Design",
        "Simple Blog Layout",
      ],
      estimatedWeeks: 6,
      completed: false,
    },
    {
      name: "Modern Frontend Development",
      goals: [
        "Master React fundamentals and hooks",
        "Learn TypeScript for type safety",
        "State management (Context API, Redux)",
        "Modern CSS frameworks (Tailwind CSS)",
        "API integration and async operations",
        "Component-based architecture",
      ],
      resources: [
        "React Official Documentation",
        "TypeScript Handbook",
        "Tailwind CSS Course",
        "REST API Integration Tutorial",
      ],
      projects: [
        "Todo App with React & TypeScript",
        "Weather Dashboard with API",
        "E-commerce Product Listing",
        "Social Media Feed Clone",
      ],
      estimatedWeeks: 10,
      completed: false,
    },
    {
      name: "Advanced & Production Ready",
      goals: [
        "Next.js framework and SSR/SSG",
        "Testing (Jest, React Testing Library)",
        "Performance optimization techniques",
        "CI/CD and deployment strategies",
        "Accessibility (WCAG) standards",
        "SEO best practices",
      ],
      resources: [
        "Next.js Documentation",
        "Testing Library Course",
        "Web Performance Guide",
        "Deployment with Vercel",
      ],
      projects: [
        "Full-Featured Blog with Next.js",
        "Dashboard with Real-time Data",
        "Complete SaaS Landing Page",
        "Portfolio with CMS Integration",
      ],
      estimatedWeeks: 8,
      completed: false,
    },
  ],

  "Backend Development": [
    {
      name: "Backend Fundamentals",
      goals: [
        "Server-side programming (Node.js or Python)",
        "HTTP protocols and REST principles",
        "Database basics (SQL and NoSQL)",
        "API design fundamentals",
        "Git version control",
      ],
      resources: [
        "Node.js Complete Guide",
        "HTTP Protocol Essentials",
        "Database Design Principles",
      ],
      projects: [
        "Simple REST API with Express",
        "CRUD Application Backend",
        "Authentication System",
      ],
      estimatedWeeks: 8,
      completed: false,
    },
    {
      name: "Core Backend Skills",
      goals: [
        "Advanced Node.js & Express.js",
        "Database design & optimization",
        "Authentication & Authorization (JWT, OAuth)",
        "API security best practices",
        "Testing (Unit, Integration)",
        "Error handling & logging",
      ],
      resources: [
        "Advanced Node.js Patterns",
        "MongoDB University",
        "API Security Checklist",
        "Jest Testing Framework",
      ],
      projects: [
        "User Management API",
        "E-commerce Backend",
        "Real-time Chat Server",
        "Payment Integration System",
      ],
      estimatedWeeks: 12,
      completed: false,
    },
    {
      name: "Production & Scale",
      goals: [
        "Microservices architecture",
        "Docker & containerization",
        "Cloud deployment (AWS/Azure/GCP)",
        "Performance monitoring",
        "Message queues & caching",
        "CI/CD pipelines",
      ],
      resources: [
        "Microservices Guide",
        "Docker Mastery",
        "AWS Certified Developer",
        "Redis Caching Course",
      ],
      projects: [
        "Microservices E-commerce",
        "Scalable API with Load Balancer",
        "Automated Deployment Pipeline",
      ],
      estimatedWeeks: 10,
      completed: false,
    },
  ],

  "Full Stack Development": [
    {
      name: "Full Stack Foundations",
      goals: [
        "HTML, CSS, JavaScript mastery",
        "Basic backend with Node.js",
        "Database fundamentals",
        "Version control (Git)",
        "Web architecture understanding",
      ],
      resources: [
        "Full Stack Open Course",
        "MDN Web Development",
        "Node.js & Express Basics",
      ],
      projects: [
        "Personal Blog (Frontend + Backend)",
        "Task Manager App",
        "Contact Form with Database",
      ],
      estimatedWeeks: 8,
      completed: false,
    },
    {
      name: "Modern Full Stack",
      goals: [
        "React or Vue.js mastery",
        "Node.js & Express advanced",
        "MongoDB or PostgreSQL",
        "RESTful API development",
        "Authentication systems",
        "State management",
      ],
      resources: [
        "React Complete Guide",
        "Node.js API Development",
        "MongoDB University",
        "JWT Authentication",
      ],
      projects: [
        "Social Media Platform",
        "E-commerce Store",
        "Project Management Tool",
        "Real-time Collaboration App",
      ],
      estimatedWeeks: 14,
      completed: false,
    },
    {
      name: "Production Full Stack",
      goals: [
        "Next.js or similar framework",
        "Advanced database patterns",
        "Docker & deployment",
        "Testing (E2E, Unit, Integration)",
        "Cloud services integration",
        "Performance & security",
      ],
      resources: [
        "Next.js Mastery",
        "Docker for Developers",
        "AWS or Vercel Deployment",
        "Cypress E2E Testing",
      ],
      projects: [
        "SaaS Platform MVP",
        "Marketplace with Payments",
        "Dashboard with Analytics",
      ],
      estimatedWeeks: 12,
      completed: false,
    },
  ],

  "Mobile Development": [
    {
      name: "Mobile Fundamentals",
      goals: [
        "JavaScript/TypeScript mastery",
        "Mobile UI/UX principles",
        "React basics",
        "Component architecture",
      ],
      resources: [
        "React Native Docs",
        "Mobile Design Patterns",
      ],
      projects: [
        "Todo App",
        "Weather App",
      ],
      estimatedWeeks: 6,
      completed: false,
    },
    {
      name: "React Native Development",
      goals: [
        "React Native core concepts",
        "Navigation (React Navigation)",
        "State management",
        "Native modules & APIs",
        "Platform-specific code",
      ],
      resources: [
        "React Native Course",
        "Navigation Guide",
        "Expo Documentation",
      ],
      projects: [
        "Social Media App",
        "E-commerce Mobile App",
        "Fitness Tracker",
      ],
      estimatedWeeks: 10,
      completed: false,
    },
    {
      name: "Production Mobile Apps",
      goals: [
        "Performance optimization",
        "App deployment (Play Store, App Store)",
        "Push notifications",
        "Offline functionality",
        "Testing & debugging",
      ],
      resources: [
        "App Publishing Guide",
        "Performance Optimization",
        "Testing Best Practices",
      ],
      projects: [
        "Feature-complete App",
        "App with Payments",
      ],
      estimatedWeeks: 8,
      completed: false,
    },
  ],

  "Data Science": [
    {
      name: "Data Science Foundations",
      goals: [
        "Python programming fundamentals",
        "Statistics & probability",
        "Data manipulation with Pandas",
        "Data visualization",
        "SQL for data analysis",
      ],
      resources: [
        "Python for Data Science",
        "Statistics Course",
        "Pandas Documentation",
      ],
      projects: [
        "Data Analysis Report",
        "Visualization Dashboard",
      ],
      estimatedWeeks: 8,
      completed: false,
    },
    {
      name: "Machine Learning",
      goals: [
        "ML algorithms & concepts",
        "Scikit-learn library",
        "Model training & evaluation",
        "Feature engineering",
        "Deep learning basics",
      ],
      resources: [
        "Machine Learning Course (Coursera)",
        "Scikit-learn Documentation",
        "Deep Learning Specialization",
      ],
      projects: [
        "Prediction Model",
        "Classification Project",
        "Recommendation System",
      ],
      estimatedWeeks: 12,
      completed: false,
    },
    {
      name: "Advanced Data Science",
      goals: [
        "Deep learning frameworks (TensorFlow/PyTorch)",
        "NLP & Computer Vision",
        "Big Data tools (Spark)",
        "Model deployment",
        "MLOps practices",
      ],
      resources: [
        "TensorFlow Course",
        "NLP Specialization",
        "MLOps Guide",
      ],
      projects: [
        "Image Classification Model",
        "Text Analysis Project",
        "Deployed ML Model",
      ],
      estimatedWeeks: 12,
      completed: false,
    },
  ],
};

// AI-powered roadmap generation
export function generatePersonalizedRoadmap(
  user: UserProfile,
  targetRole?: string
): RoadmapStage[] {
  // Determine the track based on target role or preferred track
  const track = targetRole || user.preferredTrack || "Frontend Development";
  
  // Get base template
  let stages = ROADMAP_TEMPLATES[track] || ROADMAP_TEMPLATES["Frontend Development"];
  
  // Clone to avoid mutations
  stages = JSON.parse(JSON.stringify(stages));

  // Personalize based on user's existing skills
  const userSkills = user.skills.map(s => s.toLowerCase());

  // Adjust first stage based on existing skills
  if (userSkills.length > 0) {
    // If user has basic skills, mark some prerequisites as completed
    const basicSkills = ["html", "css", "javascript", "git"];
    const hasBasicSkills = basicSkills.some(skill => 
      userSkills.some(us => us.includes(skill))
    );

    if (hasBasicSkills && stages[0]) {
      // User might be able to skip some goals in the first stage
      stages[0].goals = stages[0].goals.map(goal => {
        const goalLower = goal.toLowerCase();
        const hasRelatedSkill = userSkills.some(skill => goalLower.includes(skill));
        return hasRelatedSkill ? `✓ ${goal}` : goal;
      });
    }
  }

  // Adjust timeline based on experience level
  const experienceMultiplier = getExperienceMultiplier(user.experienceLevel);
  stages = stages.map(stage => ({
    ...stage,
    estimatedWeeks: Math.round(stage.estimatedWeeks * experienceMultiplier),
  }));

  return stages;
}

function getExperienceMultiplier(experienceLevel: string): number {
  if (experienceLevel.includes("Fresh") || experienceLevel.includes("Entry")) {
    return 1.2; // Beginners need more time
  } else if (experienceLevel.includes("Junior")) {
    return 1.0; // Normal pace
  } else if (experienceLevel.includes("Mid") || experienceLevel.includes("Senior")) {
    return 0.8; // Experienced developers learn faster
  }
  return 1.0;
}

export function calculateRoadmapProgress(stages: RoadmapStage[]): number {
  if (stages.length === 0) return 0;
  
  const completedStages = stages.filter(s => s.completed).length;
  return Math.round((completedStages / stages.length) * 100);
}

export function getNextMilestone(stages: RoadmapStage[]): string | null {
  const nextStage = stages.find(s => !s.completed);
  if (nextStage && nextStage.goals.length > 0) {
    return nextStage.goals[0];
  }
  return null;
}

export function getAvailableTracks(): string[] {
  return Object.keys(ROADMAP_TEMPLATES);
}

