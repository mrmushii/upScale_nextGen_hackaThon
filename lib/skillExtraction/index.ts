import { analyzeCvWithLLM } from "./llm";
import { analyzeCVHeuristic } from "./heuristic";
import { CVAnalysisResult, SkillExtractionResponse } from "./types";
import { DEFAULT_SKILL_DICTIONARY } from "./dictionary";

function normalizeSnippet(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export async function extractSkillsFromText(options: {
  text: string;
  profileContext?: string;
}): Promise<SkillExtractionResponse> {
  const { text, profileContext } = options;

  if (!text || text.trim().length < 40) {
    throw new Error("Provided text is too short to analyze. Please provide more details.");
  }

  const normalizedText = normalizeSnippet(text).slice(0, 60000);

  // Try LLM path first
  try {
    const llmResult = await analyzeCvWithLLM(normalizedText, profileContext);
    validateResult(llmResult);
    return {
      result: limitResult(llmResult),
      usedFallback: false,
    };
  } catch (error) {
    console.warn("LLM skill extraction failed, falling back to heuristic:", error);
  }

  const heuristicResult = await analyzeCVHeuristic(normalizedText, DEFAULT_SKILL_DICTIONARY);
  validateResult(heuristicResult);
  return {
    result: limitResult(heuristicResult),
    usedFallback: true,
    message:
      "Fell back to heuristic extraction because the AI service was unavailable. You can retry later for richer insights.",
  };
}

function validateResult(result: CVAnalysisResult) {
  if (!Array.isArray(result.skills) || !Array.isArray(result.tools) || !Array.isArray(result.roles)) {
    throw new Error("Invalid extraction result format.");
  }
}

function limitResult(result: CVAnalysisResult): CVAnalysisResult {
  return {
    skills: result.skills.slice(0, 20),
    tools: result.tools.slice(0, 20),
    roles: result.roles.slice(0, 5),
    evidence: result.evidence.slice(0, 40),
  };
}

