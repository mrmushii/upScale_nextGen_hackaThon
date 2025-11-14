import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
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
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);
    }
  } catch (error) {
    console.warn("Failed to parse interview questions", error);
  }
  return response
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

let cachedGoogleProvider:
  | ReturnType<typeof createGoogleGenerativeAI>
  | null = null;

function resolveGoogleProvider() {
  if (cachedGoogleProvider) {
    return cachedGoogleProvider;
  }

  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY."
    );
  }

  cachedGoogleProvider = createGoogleGenerativeAI({ apiKey });
  return cachedGoogleProvider;
}

export async function generateInterviewQuestions(options: {
  role: string;
  level: string;
  techstack: string[];
  type: string;
  amount: number;
}): Promise<string[]> {
  const { role, level, techstack, type, amount } = options;
  const google = resolveGoogleProvider();

  const { text } = await generateText({
    model: google("gemini-2.0-flash-001"),
    prompt: QUESTIONS_PROMPT(role, level, techstack, type, amount),
  });

  return parseQuestionsResponse(text);
}

export async function generateInterviewFeedback(options: {
  transcript: Array<{ role: string; content: string }>;
}): Promise<FeedbackSchema> {
  const google = resolveGoogleProvider();
  const transcriptLines = options.transcript
    .map(({ role, content }) => `- ${role}: ${content}`)
    .join("\n");

  const { object } = await generateObject({
    model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
    schema: feedbackSchema,
    prompt: `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
Transcript:
${transcriptLines}

Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
- Communication Skills: Clarity, articulation, structured responses.
- Technical Knowledge: Understanding of key concepts for the role.
- Problem Solving: Ability to analyze problems and propose solutions.
- Cultural & Role Fit: Alignment with company values and job role.
- Confidence & Clarity: Confidence in responses, engagement, and clarity.
`,
    system:
      "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories.",
  });

  return object;
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


