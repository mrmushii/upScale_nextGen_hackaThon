import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency (BDT)
export function formatCurrency(amount: number, currency: string = "BDT"): string {
  if (currency === "BDT") {
    return `৳${amount.toLocaleString()}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

// Format date
export function formatDate(date: Date | string, format: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (format === "short") {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Calculate days ago
export function daysAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// Calculate match percentage
export function calculateMatchPercentage(
  userSkills: string[],
  requiredSkills: string[]
): number {
  if (requiredSkills.length === 0) return 0;
  
  const matchedSkills = userSkills.filter((skill) =>
    requiredSkills.some((req) => req.toLowerCase() === skill.toLowerCase())
  );
  
  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
}

// Get skill overlap and gaps
export function getSkillAnalysis(
  userSkills: string[],
  requiredSkills: string[]
): {
  overlap: string[];
  missing: string[];
  matchPercentage: number;
} {
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map((s) => s.toLowerCase());
  
  const overlap = requiredSkills.filter((skill) =>
    userSkillsLower.includes(skill.toLowerCase())
  );
  
  const missing = requiredSkills.filter(
    (skill) => !userSkillsLower.includes(skill.toLowerCase())
  );
  
  const matchPercentage = calculateMatchPercentage(userSkills, requiredSkills);
  
  return { overlap, missing, matchPercentage };
}

// Truncate text
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (Bangladesh)
export function isValidBDPhone(phone: string): boolean {
  const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
  return phoneRegex.test(phone);
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Calculate reading time
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Random ID generator (for demo purposes)
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Sleep/delay function
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check if user has access to feature based on tier
export function hasFeatureAccess(
  tier: "basic" | "pro" | "ultimate",
  feature: string
): boolean {
  const tierHierarchy = { basic: 1, pro: 2, ultimate: 3 };
  const featureTiers: Record<string, number> = {
    "basic-features": 1,
    "ai-mock-interview": 2,
    "ai-cv-analyzer": 2,
    "advanced-portfolio": 2,
    "unlimited-access": 3,
    "dedicated-advisor": 3,
    "interview-guarantee": 3,
  };
  
  return tierHierarchy[tier] >= (featureTiers[feature] || 1);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// Get badge color based on match percentage
export function getMatchBadgeColor(percentage: number): string {
  if (percentage >= 80) return "bg-green-100 text-green-700";
  if (percentage >= 60) return "bg-yellow-100 text-yellow-700";
  if (percentage >= 40) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

