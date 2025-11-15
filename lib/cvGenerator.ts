import { generateTextUnified, parseJSONFromText } from "./unifiedAI";

/**
 * Clean summary text to extract only the actual summary, removing explanations and formatting
 */
function cleanSummaryText(text: string, user?: any): string {
  if (!text) return "";
  
  let cleaned = text.trim();
  
  // Remove markdown formatting
  cleaned = cleaned.replace(/^#+\s*/gm, ""); // Remove markdown headers
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1"); // Remove bold
  cleaned = cleaned.replace(/\*(.*?)\*/g, "$1"); // Remove italic
  cleaned = cleaned.replace(/`(.*?)`/g, "$1"); // Remove code blocks
  
  // Remove common prefixes that indicate explanations
  cleaned = cleaned.replace(/^(Here are|Here's|Here is|Options?|Option \d+|Professional Summary|Summary:?)\s*/gim, "");
  
  // Remove text that looks like explanations (contains "Option", "Key improvements", etc.)
  const lines = cleaned.split("\n");
  const summaryLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip lines that are clearly explanations
    if (
      trimmed.length === 0 ||
      trimmed.match(/^(Option \d+|Key improvements|Why|Requirements|Format|Return)/i) ||
      trimmed.match(/^\*\s*(Quantifiable|Keywords|Action|Focus|Tailored|Concise)/i) ||
      trimmed.includes("**Option") ||
      trimmed.includes("**Key improvements") ||
      trimmed.startsWith(">") && trimmed.length > 200 // Long quoted text is likely explanation
    ) {
      continue;
    }
    
    // If line starts with ">" it might be the actual summary
    if (trimmed.startsWith(">")) {
      summaryLines.push(trimmed.replace(/^>\s*/, ""));
    } else if (trimmed.length > 20 && !trimmed.match(/^[A-Z][^.!?]*$/)) {
      // Regular sentence (has punctuation or is long enough)
      summaryLines.push(trimmed);
    }
  }
  
  // If we found summary lines, use them
  if (summaryLines.length > 0) {
    cleaned = summaryLines.join(" ").trim();
  }
  
  // Remove any remaining markdown or formatting
  cleaned = cleaned.replace(/^>\s*/gm, ""); // Remove blockquote markers
  cleaned = cleaned.replace(/\n{2,}/g, " "); // Replace multiple newlines with space
  cleaned = cleaned.replace(/\s{2,}/g, " "); // Replace multiple spaces with single space
  
  // Extract first 2-3 sentences if text is too long
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  if (sentences.length > 3) {
    cleaned = sentences.slice(0, 3).join(" ").trim();
  }
  
  // Final cleanup
  cleaned = cleaned.trim();
  
  // If cleaned text is still too long or contains explanation markers, try to extract just the summary
  if (cleaned.length > 500 || cleaned.includes("Option") || cleaned.includes("Key improvements") || cleaned.includes("Here are")) {
    // Try to find the actual summary by looking for quoted text (>) or first substantial paragraph
    const paragraphs = text.split(/\n\n+/);
    for (const para of paragraphs) {
      const p = para.trim();
      // Look for paragraphs that:
      // 1. Start with ">" (quoted summary)
      // 2. Are between 50-500 chars
      // 3. Don't start with explanation markers
      // 4. Contain actual summary content (sentences with periods)
      if (
        p.length > 50 &&
        p.length < 500 &&
        !p.match(/^(Option \d+|Key improvements|Here are|Here's|Here is|Requirements|Format|Return|Professional Summary)/i) &&
        !p.match(/^\*\s*(Quantifiable|Keywords|Action|Focus|Tailored|Concise)/i) &&
        (p.startsWith(">") || (p.includes(".") && (p.includes("experience") || p.includes("developer") || p.includes("professional") || p.includes("skills"))))
      ) {
        cleaned = p.replace(/^>\s*/, "").trim();
        // Remove any remaining markdown
        cleaned = cleaned.replace(/\*\*/g, "").replace(/\*/g, "").trim();
        break;
      }
    }
    
    // If still not found, try extracting from lines that look like summaries
    if (cleaned.length > 500 || cleaned.includes("Option")) {
      const allLines = text.split(/\n/);
      const candidateLines: string[] = [];
      
      for (const line of allLines) {
        const l = line.trim();
        // Look for lines that are actual sentences (have periods and reasonable length)
        if (
          l.length > 30 &&
          l.length < 300 &&
          l.includes(".") &&
          !l.match(/^(Option|Key|Here|Requirements|Format|Return|\*)/i) &&
          !l.includes("**") &&
          (l.includes("experience") || l.includes("developer") || l.includes("professional") || l.includes("skills") || l.includes("proficient"))
        ) {
          candidateLines.push(l.replace(/^>\s*/, "").replace(/\*\*/g, "").replace(/\*/g, "").trim());
        }
      }
      
      if (candidateLines.length > 0) {
        // Take first 2-3 sentences
        cleaned = candidateLines.slice(0, 3).join(" ").trim();
      }
    }
  }
  
  // Final validation - ensure it's a reasonable summary
  if (cleaned.length < 20 || cleaned.length > 500) {
    const fallback = user?.preferredTrack 
      ? `Experienced ${user.preferredTrack} professional with expertise in ${(user?.skills || []).slice(0, 3).join(", ") || "relevant technologies"}.`
      : `Experienced professional with expertise in ${(user?.skills || []).slice(0, 3).join(", ") || "relevant technologies"}.`;
    return fallback;
  }
  
  return cleaned;
}

export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
  };
  professionalSummary: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration?: string;
    description: string[];
    technologies?: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    field?: string;
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export async function generateCVFromProfile(user: any): Promise<CVData> {
  // Extract user data - use consistent field names from User model
  const personalInfo = {
    name: user.fullName || user.name || "Your Name",
    email: user.email || "",
    phone: user.phone || "",
    location: user.city && user.country 
      ? `${user.city}, ${user.country}` 
      : user.location || user.city || user.country || "",
    linkedin: user.linkedin || "",
    portfolio: user.portfolio || user.website || "",
  };

  const skills = user.skills || [];
  const experience = user.experience || [];
  // Use education array if available, otherwise construct from educationLevel
  const education = user.education && user.education.length > 0
    ? user.education
    : user.educationLevel
    ? [{
        degree: user.educationLevel,
        institution: user.educationDepartment || "Not specified",
        year: "",
      }]
    : [];
  const projects = user.projects || [];

  // Generate professional summary using AI
  const summaryPrompt = `Generate a professional summary for a resume. Return ONLY the summary text (2-3 sentences), no explanations, no options, no markdown formatting.

User Profile:
- Skills: ${skills.join(", ")}
- Experience Level: ${user.experienceLevel || "Entry level"}
- Preferred Track: ${user.preferredTrack || "Not specified"}
- Target Roles: ${(user.targetRoles || []).join(", ")}

Requirements:
- Write 2-3 sentences only
- Professional and concise
- Highlight key strengths and relevant skills
- Tailored to the target roles
- Use action-oriented language

Return ONLY the professional summary text, nothing else.`;

  let professionalSummary = "";
  try {
    const summary = await generateTextUnified({
      prompt: summaryPrompt,
      system: "You are a professional resume writer. Return ONLY the professional summary text (2-3 sentences) with no explanations, options, or additional formatting.",
    });
    
    // Clean up the summary - remove any markdown, explanations, or extra text
    professionalSummary = cleanSummaryText(summary, user);
  } catch (error) {
    professionalSummary = `Experienced ${user.preferredTrack || "professional"} with expertise in ${skills.slice(0, 3).join(", ")}.`;
  }

  // Enhance experience descriptions with AI
  const enhancedExperience = await Promise.all(
    experience.map(async (exp: any) => {
      // Check if description is already an array with content
      if (exp.description && Array.isArray(exp.description) && exp.description.length > 0) {
        // Calculate duration if not provided
        const duration = exp.duration || (exp.startDate && exp.endDate
          ? `${new Date(exp.startDate).getFullYear()} - ${exp.current ? "Present" : new Date(exp.endDate).getFullYear()}`
          : exp.current ? "Present" : "");
        
        return {
          ...exp,
          duration,
        };
      }

      // Generate bullet points if description is missing or not an array
      const bulletPrompt = `Generate 3-4 strong, action-oriented bullet points for a resume based on:

Job Title: ${exp.title || "Position"}
Company: ${exp.company || "Company"}
Start Date: ${exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ""}
End Date: ${exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ""}
Technologies: ${exp.technologies?.join(", ") || skills.slice(0, 5).join(", ")}

Format as JSON array: ["bullet point 1", "bullet point 2", ...]`;

      try {
        const bullets = await generateTextUnified({
          prompt: bulletPrompt,
          system: "You are a professional resume writer. Create impactful bullet points.",
        });
        const parsed = parseJSONFromText(bullets);
        
        // Calculate duration
        const duration = exp.duration || (exp.startDate && (exp.endDate || exp.current)
          ? `${new Date(exp.startDate).getFullYear()} - ${exp.current ? "Present" : new Date(exp.endDate).getFullYear()}`
          : exp.current ? "Present" : "");
        
        return {
          ...exp,
          description: Array.isArray(parsed) ? parsed : [bullets],
          duration,
        };
      } catch (error) {
        const duration = exp.duration || (exp.startDate && (exp.endDate || exp.current)
          ? `${new Date(exp.startDate).getFullYear()} - ${exp.current ? "Present" : new Date(exp.endDate).getFullYear()}`
          : "");
        
        return {
          ...exp,
          description: ["• Accomplished key objectives", "• Collaborated with team members"],
          duration,
        };
      }
    })
  );

  // Format education data consistently
  const formattedEducation = education.map((edu: any) => ({
    degree: edu.degree || "",
    institution: edu.institution || "",
    year: edu.year || edu.field || "",
    field: edu.field,
    gpa: edu.gpa,
  }));

  return {
    personalInfo,
    professionalSummary,
    skills,
    experience: enhancedExperience,
    education: formattedEducation,
    projects,
  };
}

export async function generateCVSuggestions(cvData: CVData): Promise<{
  summarySuggestions: string[];
  linkedinTips: string[];
  portfolioTips: string[];
}> {
  const prompt = `Analyze this CV data and provide suggestions:

Professional Summary: ${cvData.professionalSummary}
Skills: ${cvData.skills.join(", ")}
Experience: ${cvData.experience.length} positions
Projects: ${cvData.projects.length} projects

Provide:
1. 2-3 alternative professional summaries
2. LinkedIn profile improvement tips (3-4 tips)
3. Portfolio/online presence tips (3-4 tips)

Return as JSON:
{
  "summarySuggestions": ["suggestion1", "suggestion2"],
  "linkedinTips": ["tip1", "tip2"],
  "portfolioTips": ["tip1", "tip2"]
}`;

  try {
    const response = await generateTextUnified({
      prompt,
      system: "You are a career advisor providing CV and profile improvement suggestions.",
    });
    return parseJSONFromText(response);
  } catch (error) {
    return {
      summarySuggestions: ["Consider highlighting your key achievements", "Emphasize your technical skills"],
      linkedinTips: ["Complete your profile", "Add a professional headshot", "List all relevant skills"],
      portfolioTips: ["Showcase your best projects", "Include live demos", "Write clear project descriptions"],
    };
  }
}

