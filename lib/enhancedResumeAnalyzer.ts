/**
 * Enhanced Resume Analyzer
 * 
 * This module provides detailed ATS analysis similar to ai-resume-analyzer-main
 * but uses the unified AI service (Gemini v1) from unifiedAI.ts
 * 
 * Analysis Structure:
 * - Overall Score (0-100)
 * - ATS Score with tips
 * - Tone & Style Score with tips and explanations
 * - Content Score with tips and explanations
 * - Structure Score with tips and explanations
 * - Skills Score with tips and explanations
 */

// Import from unifiedAI - use internal function directly
import { GoogleGenerativeAI } from "@google/generative-ai";

// Cached model instance
let cachedModel: any = null;

function getUnifiedModel() {
  if (cachedModel) {
    return cachedModel;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set GEMINI_API_KEY in your .env.local file."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const generationConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
  };
  
  cachedModel = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-001",
    generationConfig,
  });
  
  return cachedModel;
}

async function generateContent(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    const model = getUnifiedModel();

    const fullPrompt = systemInstruction 
      ? `${systemInstruction}\n\n${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("AI service returned empty response");
    }

    return text;
  } catch (error: any) {
    console.error("AI content generation error:", error);
    throw new Error(`AI service unavailable: ${error.message || "Unknown error"}`);
  }
}

function parseJSONFromText(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                     text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    try {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch (parseError) {
      throw new Error("Failed to parse JSON from AI response");
    }
  }
}

export interface EnhancedResumeAnalysis {
  overallScore: number;
  ATS: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
    }>;
  };
  toneAndStyle: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  content: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  structure: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
  skills: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }>;
  };
}

/**
 * Prepare analysis instructions for the AI
 */
function prepareAnalysisInstructions(
  jobTitle: string,
  jobDescription: string
): string {
  return `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
The rating can be low if the resume is bad.
Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
If available, use the job description for the job user is applying to to give more detailed feedback.
If provided, take the job description into consideration.

The job title is: ${jobTitle || "Not specified"}
The job description is: ${jobDescription || "Not provided"}

Provide the feedback using the following format:
{
  "overallScore": number, // max 100
  "ATS": {
    "score": number, // rate based on ATS suitability
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string // give 3-4 tips
      }
    ]
  },
  "toneAndStyle": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  },
  "content": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  },
  "structure": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  },
  "skills": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  }
}

Return the analysis as a JSON object, without any other text and without the backticks.
Do not include any other text or comments.`;
}

/**
 * Analyze resume with detailed ATS feedback
 */
export async function analyzeResumeEnhanced(
  resumeText: string,
  jobTitle: string = "",
  jobDescription: string = ""
): Promise<EnhancedResumeAnalysis> {
  try {
    // Validate inputs
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error(
        "Resume text is too short. Please ensure the PDF contains readable text."
      );
    }

    // Prepare the full prompt
    const instructions = prepareAnalysisInstructions(jobTitle, jobDescription);
    const prompt = `${instructions}

Resume Content:
${resumeText.substring(0, 50000)}${
      resumeText.length > 50000 ? "\n\n[Content truncated for length...]" : ""
    }`;

    const systemInstruction =
      "You are an expert in ATS (Applicant Tracking System) and resume analysis. Provide thorough and detailed feedback.";

    // Generate analysis using unified AI
    const text = await generateContent(prompt, systemInstruction);
    const analysis = parseJSONFromText(text) as EnhancedResumeAnalysis;

    // Validate and normalize the response
    if (!analysis.overallScore || typeof analysis.overallScore !== "number") {
      analysis.overallScore = 0;
    }

    // Ensure all categories exist with default values
    if (!analysis.ATS) {
      analysis.ATS = { score: 0, tips: [] };
    }
    if (!analysis.toneAndStyle) {
      analysis.toneAndStyle = { score: 0, tips: [] };
    }
    if (!analysis.content) {
      analysis.content = { score: 0, tips: [] };
    }
    if (!analysis.structure) {
      analysis.structure = { score: 0, tips: [] };
    }
    if (!analysis.skills) {
      analysis.skills = { score: 0, tips: [] };
    }

    // Ensure arrays exist
    if (!Array.isArray(analysis.ATS.tips)) analysis.ATS.tips = [];
    if (!Array.isArray(analysis.toneAndStyle.tips))
      analysis.toneAndStyle.tips = [];
    if (!Array.isArray(analysis.content.tips)) analysis.content.tips = [];
    if (!Array.isArray(analysis.structure.tips)) analysis.structure.tips = [];
    if (!Array.isArray(analysis.skills.tips)) analysis.skills.tips = [];

    // Clamp scores to 0-100
    analysis.overallScore = Math.max(
      0,
      Math.min(100, Math.round(analysis.overallScore))
    );
    analysis.ATS.score = Math.max(0, Math.min(100, Math.round(analysis.ATS.score)));
    analysis.toneAndStyle.score = Math.max(
      0,
      Math.min(100, Math.round(analysis.toneAndStyle.score))
    );
    analysis.content.score = Math.max(
      0,
      Math.min(100, Math.round(analysis.content.score))
    );
    analysis.structure.score = Math.max(
      0,
      Math.min(100, Math.round(analysis.structure.score))
    );
    analysis.skills.score = Math.max(
      0,
      Math.min(100, Math.round(analysis.skills.score))
    );

    console.log("Enhanced resume analysis completed successfully");
    return analysis;
  } catch (error: any) {
    console.error("Error analyzing resume:", error);

    // Provide user-friendly error messages
    if (error.message?.includes("API key")) {
      throw new Error(
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file."
      );
    } else if (
      error.message?.includes("rate limit") ||
      error.message?.includes("quota")
    ) {
      throw new Error(
        "API rate limit exceeded. Please wait a moment and try again."
      );
    } else if (error.message?.includes("safety")) {
      throw new Error(
        "Content was blocked by safety filters. Please ensure your resume content is appropriate."
      );
    }

    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}

