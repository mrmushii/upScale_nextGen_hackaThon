import { generateTextUnified, parseJSONFromText } from "./unifiedAI";

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
  const summaryPrompt = `Generate a professional summary (2-3 sentences) for a resume based on:

Skills: ${skills.join(", ")}
Experience Level: ${user.experienceLevel || "Entry level"}
Preferred Track: ${user.preferredTrack || "Not specified"}
Target Roles: ${(user.targetRoles || []).join(", ")}

Make it professional, concise, and highlight key strengths.`;

  let professionalSummary = "";
  try {
    const summary = await generateTextUnified({
      prompt: summaryPrompt,
      system: "You are a professional resume writer. Create compelling professional summaries.",
    });
    professionalSummary = summary.trim();
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

