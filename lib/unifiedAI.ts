/**
 * Unified AI Service
 * 
 * This service provides a single, consistent interface for all AI functionality
 * across the application using Google Generative AI SDK directly.
 * 
 * All AI features (roadmap generation, resume analysis, interview features, etc.) 
 * use this unified service with gemini-2.0-flash-001 model.
 * 
 * SDK: @google/generative-ai
 * Model: gemini-2.0-flash-001
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Cached model instance (singleton pattern)
let cachedModel: any = null;

/**
 * Get or create the unified Gemini model instance
 */
function getUnifiedModel() {
  if (cachedModel) {
    return cachedModel;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set GEMINI_API_KEY in your .env.local file."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Configure model with generation settings
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

/**
 * Generate content using the unified model
 * Internal helper function
 */
async function generateContent(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    const model = getUnifiedModel();

    // Build the full prompt with system instruction if provided
    const fullPrompt = systemInstruction 
      ? `${systemInstruction}\n\n${prompt}`
      : prompt;

    // Generate content (generationConfig is already set in model initialization)
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("AI service returned empty response");
    }

    return text;
  } catch (error: any) {
    console.error("AI content generation error:", error);
    
    // Provide meaningful error messages
    if (error.message?.includes("API_KEY")) {
      throw new Error("Invalid or missing Gemini API key. Please check your .env.local file.");
    } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      throw new Error("API rate limit exceeded. Please wait a moment and try again.");
    } else if (error.message?.includes("safety")) {
      throw new Error("Content was blocked by safety filters. Please ensure your content is appropriate.");
    }
    
    throw new Error(`AI service unavailable: ${error.message || "Unknown error"}`);
  }
}

/**
 * Parse JSON from text response with graceful fallback
 */
export function parseJSONFromText(text: string): any {
  try {
    // Try direct JSON parse first
    return JSON.parse(text);
  } catch {
    // Extract JSON from markdown code blocks or other text
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

/**
 * Validate API key is configured
 */
export function validateAPIKey(): boolean {
  try {
    getUnifiedModel();
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Core AI Functions
// ============================================================================

/**
 * CV Analysis Result Interface
 */
export interface CVAnalysis {
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedRoles: string[];
  recommendations: string[];
  overallScore?: number;
}

/**
 * Analyze CV/Resume text
 * Role: HR Assistant
 */
export async function analyzeCV(cvText: string): Promise<CVAnalysis> {
  try {
    if (!cvText || cvText.trim().length < 50) {
      throw new Error("CV text is too short or empty. Please provide a valid resume.");
    }

    const prompt = `You are an expert HR assistant analyzing a resume. Analyze the following resume text and provide a structured JSON response.

Resume Text:
${cvText.substring(0, 50000)}${cvText.length > 50000 ? "\n\n[Content truncated for length...]" : ""}

Please provide a JSON response with the following structure:
{
  "skills": ["skill1", "skill2", "skill3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendedRoles": ["role1", "role2", "role3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "overallScore": 85
}

Requirements:
1. Extract all technical and soft skills mentioned in the resume
2. Identify 3-5 key strengths
3. Identify 2-4 areas for improvement (weaknesses)
4. Suggest 3-5 job roles that match the candidate's profile
5. Provide 3-5 actionable recommendations for improvement
6. Provide an overall score (0-100) based on resume quality

Return ONLY valid JSON, no markdown or additional text.`;

    const systemInstruction = "You are an expert HR assistant specializing in resume analysis and career guidance. Provide accurate, constructive feedback.";

    const text = await generateContent(prompt, systemInstruction);
    const analysis = parseJSONFromText(text) as CVAnalysis;

    // Validate and ensure all required fields exist
    if (!analysis.skills) analysis.skills = [];
    if (!analysis.strengths) analysis.strengths = [];
    if (!analysis.weaknesses) analysis.weaknesses = [];
    if (!analysis.recommendedRoles) analysis.recommendedRoles = [];
    if (!analysis.recommendations) analysis.recommendations = [];
    if (!analysis.overallScore) analysis.overallScore = 70;

    return analysis;
  } catch (error: any) {
    console.error("CV analysis error:", error);
    throw new Error(`Failed to analyze CV: ${error.message}`);
  }
}

/**
 * Roadmap Stage Interface
 */
export interface RoadmapStage {
  name: string;
  goals: string[];
  resources: string[];
  projects: string[];
  estimatedWeeks: number;
  completed: boolean;
  exercises?: any[];
  suggestedCourses?: {
    youtube?: string[];
    udemy?: string[];
  };
}

/**
 * Generate Career Roadmap
 * Role: Career Coach
 */
export async function generateRoadmap(
  goal: string,
  skills: string[]
): Promise<RoadmapStage[]> {
  try {
    if (!goal || goal.trim().length === 0) {
      throw new Error("Goal is required for roadmap generation");
    }

    const prompt = `You are an expert career coach. Create a detailed 3-stage career roadmap for achieving the following goal.

Goal: ${goal}
Current Skills: ${skills.length > 0 ? skills.join(", ") : "None specified"}

Please create a JSON roadmap with exactly 3 stages following this structure:
{
  "stages": [
    {
      "name": "Stage name (e.g., Foundation & Prerequisites)",
      "goals": ["goal 1", "goal 2", "goal 3", "goal 4", "goal 5"],
      "resources": ["resource 1", "resource 2", "resource 3"],
      "projects": ["project 1", "project 2", "project 3"],
      "estimatedWeeks": 8,
      "completed": false
    }
  ]
}

Requirements:
1. Create exactly 3 stages: Beginner → Intermediate → Advanced
2. Each stage should have 4-6 specific, actionable goals
3. Recommend 3-4 free/popular learning resources per stage
4. Suggest 2-3 hands-on projects per stage
5. Provide realistic time estimates in weeks
6. Consider existing skills - adjust difficulty accordingly
7. Make it specific to the goal: ${goal}
8. Focus on practical, industry-relevant skills

Return ONLY valid JSON, no markdown or additional text.`;

    const systemInstruction = "You are an expert career advisor. Create detailed, actionable learning roadmaps with month-by-month tasks.";

    const text = await generateContent(prompt, systemInstruction);
    const roadmapData = parseJSONFromText(text);

    if (!roadmapData.stages || !Array.isArray(roadmapData.stages)) {
      throw new Error("Invalid roadmap structure in AI response");
    }

    return roadmapData.stages as RoadmapStage[];
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    throw new Error(`Failed to generate roadmap: ${error.message}`);
  }
}

/**
 * Run Interview Prompt
 * Role: Interview Assistant
 */
export async function runInterviewPrompt(prompt: string): Promise<string> {
  try {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Interview prompt is required");
    }

    const systemInstruction = "You are a professional interview assistant. Provide helpful, structured responses to interview-related questions.";

    const response = await generateContent(prompt, systemInstruction);
    return response;
  } catch (error: any) {
    console.error("Interview prompt error:", error);
    throw new Error(`Failed to process interview prompt: ${error.message}`);
  }
}

// ============================================================================
// Backward Compatibility Functions
// ============================================================================

/**
 * Generate text using the unified AI model
 * Backward compatibility wrapper for existing code
 */
export async function generateTextUnified(options: {
  prompt: string;
  system?: string;
}): Promise<string> {
  return generateContent(options.prompt, options.system);
}

/**
 * Generate structured object using the unified AI model
 * Backward compatibility wrapper for existing code
 */
export async function generateObjectUnified<T extends z.ZodTypeAny>(options: {
  prompt: string;
  schema: T;
  system?: string;
}): Promise<z.infer<T>> {
  try {
    // Generate text first
    const text = await generateContent(options.prompt, options.system);
    
    // Parse JSON from response
    const parsed = parseJSONFromText(text);
    
    // Validate against schema if provided
    if (options.schema) {
      const validated = options.schema.parse(parsed);
      return validated;
    }
    
    return parsed as z.infer<T>;
  } catch (error: any) {
    console.error("Structured object generation error:", error);
    
    // If schema validation fails, try to return parsed JSON anyway
    if (error.name === "ZodError") {
      console.warn("Schema validation failed, returning parsed JSON:", error.errors);
      const text = await generateContent(options.prompt, options.system);
      return parseJSONFromText(text) as z.infer<T>;
    }
    
    throw new Error(`AI object generation failed: ${error.message}`);
  }
}
