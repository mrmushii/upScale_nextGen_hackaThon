/**
 * Simplified Resume Analyzer
 * 
 * Flow:
 * 1. Extract text from PDF
 * 2. Send text as JSON to Gemini API
 * 3. Get feedback based on job type
 * 4. Return suggestions for improvements
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ResumeAnalysis {
  overallScore: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  jobMatch: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  };
}

/**
 * Analyze resume text against a job description
 */
export async function analyzeResume(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
): Promise<ResumeAnalysis> {
  try {
    // Validate inputs
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Resume text is too short. Please ensure the PDF contains readable text.");
    }

    if (!jobTitle && !jobDescription) {
      throw new Error("Job title or description is required for analysis.");
    }

    // Get API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.");
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Prepare the prompt
    const prompt = `You are an expert resume analyzer and career advisor. Analyze the following resume and provide feedback based on the job requirements.

Job Title: ${jobTitle || "Not specified"}
Job Description: ${jobDescription || "Not provided"}

Resume Content:
${resumeText.substring(0, 30000)}${resumeText.length > 30000 ? "\n\n[Content truncated...]" : ""}

Please analyze this resume and provide:
1. Overall score (0-100) based on how well it matches the job requirements
2. Strengths - List 3-5 key strengths of the resume
3. Weaknesses - List 3-5 areas that need improvement
4. Suggestions - Provide 5-7 actionable suggestions to improve the resume
5. Job Match Analysis:
   - Match score (0-100) for how well the resume matches the job
   - Matched skills - List skills from the resume that match job requirements
   - Missing skills - List important skills from job requirements that are missing

Return your response as a valid JSON object in this exact format:
{
  "overallScore": 75,
  "feedback": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  "jobMatch": {
    "score": 70,
    "matchedSkills": ["skill 1", "skill 2"],
    "missingSkills": ["skill 3", "skill 4"]
  }
}

Return ONLY the JSON object, no other text or markdown formatting.`;

    // Call Gemini API
    console.log("Sending resume analysis request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let analysis: ResumeAnalysis;
    try {
      // Clean the response (remove markdown code blocks if present)
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    // Validate and normalize the response
    if (!analysis.overallScore || typeof analysis.overallScore !== "number") {
      analysis.overallScore = 0;
    }

    if (!analysis.feedback) {
      analysis.feedback = {
        strengths: [],
        weaknesses: [],
        suggestions: [],
      };
    }

    if (!analysis.jobMatch) {
      analysis.jobMatch = {
        score: 0,
        matchedSkills: [],
        missingSkills: [],
      };
    }

    // Ensure arrays exist
    if (!Array.isArray(analysis.feedback.strengths)) {
      analysis.feedback.strengths = [];
    }
    if (!Array.isArray(analysis.feedback.weaknesses)) {
      analysis.feedback.weaknesses = [];
    }
    if (!Array.isArray(analysis.feedback.suggestions)) {
      analysis.feedback.suggestions = [];
    }
    if (!Array.isArray(analysis.jobMatch.matchedSkills)) {
      analysis.jobMatch.matchedSkills = [];
    }
    if (!Array.isArray(analysis.jobMatch.missingSkills)) {
      analysis.jobMatch.missingSkills = [];
    }

    // Clamp scores to 0-100
    analysis.overallScore = Math.max(0, Math.min(100, Math.round(analysis.overallScore)));
    analysis.jobMatch.score = Math.max(0, Math.min(100, Math.round(analysis.jobMatch.score)));

    console.log("Resume analysis completed successfully");
    return analysis;
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    
    // Provide user-friendly error messages
    if (error.message?.includes("API key")) {
      throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.");
    } else if (error.message?.includes("rate limit") || error.message?.includes("quota")) {
      throw new Error("API rate limit exceeded. Please wait a moment and try again.");
    } else if (error.message?.includes("safety")) {
      throw new Error("Content was blocked by safety filters. Please ensure your resume content is appropriate.");
    }
    
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}

