export type SkillDictionaryEntry = {
  name: string;
  variants?: string[];
  evidenceHint?: string;
};

export type RoleDictionaryEntry = {
  name: string;
  variants?: string[];
  category: "frontend" | "backend" | "fullstack" | "data" | "mobile" | "devops" | "product" | "design" | "ai" | "other";
};

export interface SkillExtractionDictionary {
  version: string;
  skills: SkillDictionaryEntry[];
  tools: SkillDictionaryEntry[];
  roles: RoleDictionaryEntry[];
}

export const DEFAULT_SKILL_DICTIONARY: SkillExtractionDictionary = {
  version: "2025.01.15",
  skills: [
    { name: "problem solving", variants: ["problem-solving", "analytical thinking"] },
    { name: "communication", variants: ["communication skills", "stakeholder communication"] },
    { name: "leadership", variants: ["team lead", "mentorship", "led"] },
    { name: "project management", variants: ["project planning", "scrum master", "agile ceremonies"] },
    { name: "data analysis", variants: ["data analytics", "data insights", "exploratory analysis"] },
    { name: "machine learning", variants: ["ml models", "model training", "mlops"] },
    { name: "frontend development", variants: ["ui development", "client-side development"] },
    { name: "backend development", variants: ["server-side development", "api development"] },
    { name: "cloud architecture", variants: ["cloud-native", "aws architecture", "azure architecture"] },
    { name: "testing automation", variants: ["test automation", "qa automation", "selenium"] },
  ],
  tools: [
    { name: "React", variants: ["react.js", "reactjs", "next.js", "nextjs"] },
    { name: "Node.js", variants: ["nodejs", "express", "express.js"] },
    { name: "Python", variants: ["py", "django", "flask", "fastapi"] },
    { name: "TypeScript", variants: ["ts", "typescript", "typed javascript"] },
    { name: "AWS", variants: ["amazon web services", "lambda", "s3", "cloudformation"] },
    { name: "Azure", variants: ["microsoft azure", "azure functions"] },
    { name: "GCP", variants: ["google cloud", "google cloud platform"] },
    { name: "Docker", variants: ["containerization", "dockerized"] },
    { name: "Kubernetes", variants: ["k8s", "kubernetes clusters"] },
    { name: "PostgreSQL", variants: ["postgres", "postgres db"] },
    { name: "MongoDB", variants: ["mongodb atlas", "nosql db"] },
    { name: "TensorFlow", variants: ["tf", "tensorflow lite"] },
    { name: "PyTorch", variants: ["pytorch lightning"] },
    { name: "Figma", variants: ["figma prototypes", "figma components"] },
    { name: "Jira", variants: ["jira boards", "jira workflows"] },
  ],
  roles: [
    { name: "Frontend Developer", variants: ["frontend engineer", "ui developer"], category: "frontend" },
    { name: "Backend Developer", variants: ["backend engineer", "api engineer"], category: "backend" },
    { name: "Fullstack Developer", variants: ["full-stack engineer", "full stack developer"], category: "fullstack" },
    { name: "Data Analyst", variants: ["data analytics specialist", "business analyst"], category: "data" },
    { name: "Data Scientist", variants: ["machine learning engineer", "ml scientist"], category: "ai" },
    { name: "DevOps Engineer", variants: ["site reliability engineer", "sre", "platform engineer"], category: "devops" },
    { name: "Product Manager", variants: ["product owner", "pm"], category: "product" },
    { name: "UI/UX Designer", variants: ["product designer", "ux researcher"], category: "design" },
    { name: "Mobile Developer", variants: ["ios developer", "android developer", "flutter developer"], category: "mobile" },
    { name: "AI Engineer", variants: ["generative ai engineer", "ai specialist"], category: "ai" },
  ],
};

