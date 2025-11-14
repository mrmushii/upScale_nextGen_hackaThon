import { readFile } from "fs/promises";
import { join } from "path";
import { extractTextFromPdf } from "./pdfParser.js";
import { generateTextUnified, generateObjectUnified, parseJSONFromText } from "./unifiedAI";
import { z } from "zod";

export interface AnalysisResult {
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

// Zod schema for structured output
const analysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  ATS: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(
      z.object({
        type: z.enum(["good", "improve"]),
        tip: z.string(),
      })
    ),
  }),
  toneAndStyle: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(
      z.object({
        type: z.enum(["good", "improve"]),
        tip: z.string(),
        explanation: z.string(),
      })
    ),
  }),
  content: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(
      z.object({
        type: z.enum(["good", "improve"]),
        tip: z.string(),
        explanation: z.string(),
      })
    ),
  }),
  structure: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(
      z.object({
        type: z.enum(["good", "improve"]),
        tip: z.string(),
        explanation: z.string(),
      })
    ),
  }),
  skills: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(
      z.object({
        type: z.enum(["good", "improve"]),
        tip: z.string(),
        explanation: z.string(),
      })
    ),
  }),
});

const AI_RESPONSE_FORMAT = `
interface Feedback {
  overallScore: number; //max 100
  ATS: {
    score: number; //rate based on ATS suitability
    tips: {
      type: "good" | "improve";
      tip: string; //give 3-4 tips
    }[];
  };
  toneAndStyle: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
  content: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
  structure: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
  skills: {
    score: number; //max 100
    tips: {
      type: "good" | "improve";
      tip: string; //make it a short "title" for the actual explanation
      explanation: string; //explain in detail here
    }[]; //give 3-4 tips
  };
}`;

function prepareInstructions(jobTitle: string, jobDescription: string): string {
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
${AI_RESPONSE_FORMAT}
Return the analysis as an JSON object, without any other text and without the backticks.
Do not include any other text or comments.`;
}

/**
 * Analyze resume against a job description using unified AI service
 */
export async function analyzeResumeAgainstJD(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
): Promise<AnalysisResult> {
  try {
    // Validate resume text
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Resume text is too short or empty. Please ensure the PDF contains readable text.");
    }

    const prompt = `${prepareInstructions(jobTitle, jobDescription)}

Resume Content:
${resumeText.substring(0, 50000)}${resumeText.length > 50000 ? "\n\n[Content truncated for length...]" : ""}

Analyze this resume and provide detailed feedback.`;

    console.log("Attempting resume analysis with unified AI service...");

    // Use unified AI service with structured output
    try {
      const analysis = await generateObjectUnified({
        prompt,
        schema: analysisResultSchema,
        system: "You are an expert in ATS (Applicant Tracking System) and resume analysis. Provide thorough and detailed feedback.",
      });

      // Validate and ensure all required fields exist
      if (!analysis.overallScore) {
        const scores = [
          analysis.ATS?.score || 0,
          analysis.toneAndStyle?.score || 0,
          analysis.content?.score || 0,
          analysis.structure?.score || 0,
          analysis.skills?.score || 0,
        ];
        analysis.overallScore = Math.round(
          scores.reduce((a, b) => a + b, 0) / scores.length
        );
      }

      // Ensure all categories have default values
      if (!analysis.ATS) analysis.ATS = { score: 0, tips: [] };
      if (!analysis.toneAndStyle) analysis.toneAndStyle = { score: 0, tips: [] };
      if (!analysis.content) analysis.content = { score: 0, tips: [] };
      if (!analysis.structure) analysis.structure = { score: 0, tips: [] };
      if (!analysis.skills) analysis.skills = { score: 0, tips: [] };

      console.log("Successfully analyzed resume with unified AI service");
      return analysis as AnalysisResult;
    } catch (structuredError: any) {
      // Fallback to text generation if structured output fails
      console.warn("Structured output failed, falling back to text generation:", structuredError.message);
      
      const text = await generateTextUnified({ prompt });
      const analysis = parseJSONFromText(text) as AnalysisResult;

      // Validate and ensure all required fields exist
      if (!analysis.overallScore) {
        const scores = [
          analysis.ATS?.score || 0,
          analysis.toneAndStyle?.score || 0,
          analysis.content?.score || 0,
          analysis.structure?.score || 0,
          analysis.skills?.score || 0,
        ];
        analysis.overallScore = Math.round(
          scores.reduce((a, b) => a + b, 0) / scores.length
        );
      }

      // Ensure all categories have default values
      if (!analysis.ATS) analysis.ATS = { score: 0, tips: [] };
      if (!analysis.toneAndStyle) analysis.toneAndStyle = { score: 0, tips: [] };
      if (!analysis.content) analysis.content = { score: 0, tips: [] };
      if (!analysis.structure) analysis.structure = { score: 0, tips: [] };
      if (!analysis.skills) analysis.skills = { score: 0, tips: [] };

      return analysis;
    }
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    
    // Provide more specific error messages
    if (error.message?.includes("API key") || error.message?.includes("Missing Gemini")) {
      throw new Error("Gemini API key is missing or invalid. Please check your .env.local file.");
    } else if (error.message?.includes("rate limit") || error.message?.includes("quota")) {
      throw new Error("API rate limit exceeded. Please wait a moment and try again.");
    } else if (error.message?.includes("safety")) {
      throw new Error("Content was blocked by safety filters. Please ensure your resume content is appropriate.");
    }
    
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}

/**
 * Analyze resume from file path
 * @param filePath - Path to the resume file (relative to public/uploads)
 * @param jobTitle - Job title for analysis context
 * @param jobDescription - Job description for analysis context
 * @returns Analysis result with scores and feedback
 */
export async function analyzeResumeFromFile(
  filePath: string,
  jobTitle: string,
  jobDescription: string
): Promise<AnalysisResult> {
  try {
    // Read file
    const relativePath = filePath.startsWith("/uploads")
      ? filePath.substring(1)
      : filePath.startsWith("uploads")
      ? filePath
      : `uploads/${filePath}`;
    
    const fullPath = join(process.cwd(), "public", relativePath);
    
    // Check if file exists
    let buffer: Buffer;
    try {
      buffer = await readFile(fullPath);
    } catch (fileError: any) {
      if (fileError.code === "ENOENT") {
        throw new Error(`Resume file not found at ${filePath}. Please re-upload the resume.`);
      }
      throw new Error(`Failed to read resume file: ${fileError.message}`);
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (buffer.length > maxSize) {
      throw new Error(`File size (${Math.round(buffer.length / 1024 / 1024)}MB) exceeds maximum allowed size of 20MB.`);
    }

    // Extract text from PDF
    console.log(`Extracting text from PDF: ${filePath} (${buffer.length} bytes)`);
    const parseResult = await extractTextFromPdf(buffer);
    
    if (!parseResult.success || !parseResult.text) {
      const errorMsg = parseResult.error || 
        "Failed to extract text from PDF. Please ensure the PDF contains readable text (not just images).";
      
      // Log metadata if available for debugging
      if (parseResult.metadata) {
        console.error("PDF parsing metadata:", {
          numPages: parseResult.metadata.numPages,
          hasInfo: !!parseResult.metadata.info,
        });
      }
      
      throw new Error(errorMsg);
    }

    // Validate extracted text length
    const textLength = parseResult.text.trim().length;
    if (textLength < 50) {
      throw new Error(
        `Extracted text is too short (${textLength} characters). The PDF may be image-based or corrupted. Please use a PDF with selectable text.`
      );
    }

    console.log(`Successfully extracted ${textLength} characters from PDF`);

    // Analyze resume against job description
    return await analyzeResumeAgainstJD(parseResult.text, jobTitle, jobDescription);
  } catch (error: any) {
    console.error("Error analyzing resume from file:", {
      filePath,
      error: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to analyze resume file: ${error.message}`);
  }
}
