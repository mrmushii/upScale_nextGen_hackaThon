import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const COVER_THEMES = [
  "indigo",
  "emerald",
  "coral",
  "amber",
  "violet",
  "cyan",
  "slate",
] as const;

export type CoverTheme = (typeof COVER_THEMES)[number];

const QUESTIONS_PROMPT = (
  role: string,
  level: string,
  techstack: string[],
  type: string,
  amount: number
) => `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack.join(", ") || "Generalist"}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]
Keep each question concise and focused on a single idea.`;

const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;

export const PRO_TIERS: Array<"pro" | "ultimate"> = ["pro", "ultimate"];

export const isProTier = (tier?: string | null): tier is "pro" | "ultimate" => {
  if (!tier) return false;
  const normalized = tier.toLowerCase().trim();
  return PRO_TIERS.includes(normalized as "pro" | "ultimate");
};

export function getRandomCoverTheme(): CoverTheme {
  const index = Math.floor(Math.random() * COVER_THEMES.length);
  return COVER_THEMES[index];
}

function parseQuestionsResponse(response: string): string[] {
  try {
    // Try to parse as JSON first
    const cleaned = response.trim();
    // Remove markdown code blocks if present
    const jsonMatch = cleaned.match(/\[.*\]/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean);
      }
    }
  } catch (error) {
    console.warn("Failed to parse interview questions as JSON, trying fallback", error);
  }
  
  // Fallback: parse line by line
  return response
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").replace(/^[-*]\s*/, "").replace(/^["']|["']$/g, "").trim())
    .filter(Boolean)
    .filter((line) => line.length > 10); // Filter out very short lines
}

// Cached model instance
let cachedModel: any = null;

function getGeminiModel() {
  if (cachedModel) {
    return cachedModel;
  }

  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  cachedModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-001",
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });

  return cachedModel;
}

export async function generateInterviewQuestions(options: {
  role: string;
  level: string;
  techstack: string[];
  type: string;
  amount: number;
}): Promise<string[]> {
  try {
    const { role, level, techstack, type, amount } = options;
    const model = getGeminiModel();

    const prompt = QUESTIONS_PROMPT(role, level, techstack, type, amount);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return parseQuestionsResponse(text);
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    throw new Error(`Failed to generate interview questions: ${error.message}`);
  }
}

export async function generateInterviewFeedback(options: {
  transcript: Array<{ role: string; content: string }>;
}): Promise<FeedbackSchema> {
  try {
    const model = getGeminiModel();
    const transcriptLines = options.transcript
      .map(({ role, content }) => `- ${role}: ${content}`)
      .join("\n");

    const prompt = `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
Transcript:
${transcriptLines}

Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
- Communication Skills: Clarity, articulation, structured responses.
- Technical Knowledge: Understanding of key concepts for the role.
- Problem Solving: Ability to analyze problems and propose solutions.
- Cultural & Role Fit: Alignment with company values and job role.
- Confidence & Clarity: Confidence in responses, engagement, and clarity.

Return your analysis as a valid JSON object in this exact format:
{
  "totalScore": 75,
  "categoryScores": [
    {
      "name": "Communication Skills",
      "score": 80,
      "comment": "Clear and articulate responses"
    },
    {
      "name": "Technical Knowledge",
      "score": 70,
      "comment": "Good understanding but could be deeper"
    },
    {
      "name": "Problem Solving",
      "score": 75,
      "comment": "Shows logical thinking"
    },
    {
      "name": "Cultural & Role Fit",
      "score": 80,
      "comment": "Good alignment with role requirements"
    },
    {
      "name": "Confidence & Clarity",
      "score": 70,
      "comment": "Could be more confident"
    }
  ],
  "strengths": ["strength 1", "strength 2"],
  "areasForImprovement": ["area 1", "area 2"],
  "finalAssessment": "Overall assessment of the candidate"
}

Return ONLY the JSON object, no other text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    let parsed: any;
    try {
      // Clean the response (remove markdown code blocks if present)
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse feedback JSON:", text);
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    // Validate with Zod schema
    const validated = feedbackSchema.parse(parsed);
    return validated;
  } catch (error: any) {
    console.error("Error generating interview feedback:", error);
    
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid feedback structure: ${error.errors.map(e => e.message).join(", ")}`);
    }
    
    throw new Error(`Failed to generate interview feedback: ${error.message}`);
  }
}

export function normalizeTechstack(raw: string[] | string): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => item?.toString().trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}
