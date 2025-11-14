/**
 * Skill Gap Analysis
 * Compares job requirements with user skills to identify gaps
 */

interface UserSkills {
  skills: string[];
  tools: string[];
  experience?: string;
  education?: string;
}

interface JobRequirements {
  requiredSkills?: string[];
  description?: string;
  requirements?: string;
  qualifications?: string;
}

interface SkillGapResult {
  missingSkills: string[];
  existingSkills: string[];
  matchPercentage: number;
  recommendations: string[];
}

/**
 * Normalize skill names for comparison
 */
function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Extract skills from text using common patterns
 */
function extractSkillsFromText(text: string | string[] | any): string[] {
  // Handle null/undefined
  if (!text) return [];

  // Convert to string if it's an array
  if (Array.isArray(text)) {
    text = text.join(" ");
  }

  // Convert to string if it's an object
  if (typeof text === "object") {
    text = JSON.stringify(text);
  }

  // Ensure it's a string
  if (typeof text !== "string") {
    text = String(text);
  }

  const skillPatterns = [
    // Common programming languages
    /\b(javascript|js|typescript|ts|python|java|c\+\+|cpp|c#|csharp|php|ruby|go|golang|rust|swift|kotlin|dart|scala|r|matlab)\b/gi,
    // Frameworks
    /\b(react|vue|angular|node\.?js|express|django|flask|spring|laravel|rails|asp\.?net|\.net|next\.?js|nuxt|svelte)\b/gi,
    // Databases
    /\b(mysql|postgresql|mongodb|redis|cassandra|elasticsearch|sqlite|oracle|sql server)\b/gi,
    // Tools & Technologies
    /\b(docker|kubernetes|aws|azure|gcp|git|jenkins|ci\/cd|terraform|ansible|linux|unix)\b/gi,
    // Methodologies
    /\b(agile|scrum|devops|microservices|rest api|graphql|tdd|bdd)\b/gi,
  ];

  const skills = new Set<string>();
  const lowerText = text.toLowerCase();

  // Extract from patterns
  skillPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        skills.add(normalizeSkill(match));
      });
    }
  });

  // Extract from common phrases like "experience with X", "knowledge of Y"
  const phrasePatterns = [
    /(?:experience|knowledge|proficient|familiar|expert|skilled)\s+(?:with|in|of)\s+([a-z\s+]+?)(?:\.|,|;|$)/gi,
    /(?:must|should|required|preferred)\s+(?:have|know|be)\s+(?:experience|knowledge|skills?)\s+(?:with|in|of)?\s*([a-z\s+]+?)(?:\.|,|;|$)/gi,
  ];

  phrasePatterns.forEach((pattern) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach((match) => {
      if (match[1]) {
        const skill = normalizeSkill(match[1]);
        if (skill.length > 2 && skill.length < 50) {
          skills.add(skill);
        }
      }
    });
  });

  return Array.from(skills);
}

/**
 * Analyze skill gaps between job requirements and user skills
 */
export async function analyzeSkillGaps(
  jobRequirements: JobRequirements,
  userSkills: UserSkills
): Promise<SkillGapResult> {
  // Extract required skills from job
  const requiredSkillsSet = new Set<string>();

  // From requiredSkills array
  if (jobRequirements.requiredSkills && Array.isArray(jobRequirements.requiredSkills)) {
    jobRequirements.requiredSkills.forEach((skill) => {
      requiredSkillsSet.add(normalizeSkill(skill));
    });
  }

  // From description
  if (jobRequirements.description) {
    try {
      const skills = extractSkillsFromText(jobRequirements.description);
      skills.forEach((skill) => requiredSkillsSet.add(skill));
    } catch (error) {
      console.error("Error extracting skills from description:", error);
    }
  }

  // From requirements text
  if (jobRequirements.requirements) {
    try {
      const skills = extractSkillsFromText(jobRequirements.requirements);
      skills.forEach((skill) => requiredSkillsSet.add(skill));
    } catch (error) {
      console.error("Error extracting skills from requirements:", error);
    }
  }

  // From qualifications
  if (jobRequirements.qualifications) {
    try {
      const skills = extractSkillsFromText(jobRequirements.qualifications);
      skills.forEach((skill) => requiredSkillsSet.add(skill));
    } catch (error) {
      console.error("Error extracting skills from qualifications:", error);
    }
  }

  const requiredSkills = Array.from(requiredSkillsSet);

  // Normalize user skills
  const userSkillsNormalized = new Set<string>();
  userSkills.skills?.forEach((skill) => {
    userSkillsNormalized.add(normalizeSkill(skill));
  });
  userSkills.tools?.forEach((tool) => {
    userSkillsNormalized.add(normalizeSkill(tool));
  });

  // Find matches and gaps
  const existingSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach((requiredSkill) => {
    let found = false;

    // Exact match
    if (userSkillsNormalized.has(requiredSkill)) {
      existingSkills.push(requiredSkill);
      found = true;
    } else {
      // Partial match (skill contains or is contained by user skill)
      for (const userSkill of userSkillsNormalized) {
        if (
          userSkill.includes(requiredSkill) ||
          requiredSkill.includes(userSkill) ||
          userSkill.split(/\s+/).some((word) => requiredSkill.includes(word)) ||
          requiredSkill.split(/\s+/).some((word) => userSkill.includes(word))
        ) {
          existingSkills.push(requiredSkill);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      missingSkills.push(requiredSkill);
    }
  });

  // Calculate match percentage
  const matchPercentage =
    requiredSkills.length > 0
      ? Math.round((existingSkills.length / requiredSkills.length) * 100)
      : 100;

  // Generate recommendations
  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    recommendations.push(
      `Focus on learning: ${missingSkills.slice(0, 5).join(", ")}`
    );
  }
  if (matchPercentage < 50) {
    recommendations.push("Consider building more projects to strengthen your skills");
  }
  if (matchPercentage >= 50 && matchPercentage < 80) {
    recommendations.push("You're close! Focus on the missing skills to increase your match");
  }

  return {
    missingSkills,
    existingSkills,
    matchPercentage,
    recommendations,
  };
}

