import { z } from "zod";
import { generateObjectUnified } from "@/lib/unifiedAI";
import { CVAnalysisResult } from "./types";

const aiExtractionSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string(),
      rationale: z.string().optional(),
    })
  ),
  tools: z.array(
    z.object({
      name: z.string(),
      rationale: z.string().optional(),
    })
  ),
  roles: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1),
      rationale: z.string().optional(),
    })
  ),
  evidence: z.array(
    z.object({
      item: z.string(),
      rationale: z.string(),
    })
  ),
});

export async function analyzeCvWithLLM(cvText: string, profileContext?: string): Promise<CVAnalysisResult> {
  const prompt = `You are a senior career intelligence system. Extract skills, tools/technologies, and relevant roles from the following CV/profile content.

${profileContext ? `Profile context:\n${profileContext}\n\n` : ""}
CV/Resume Text:
${cvText.substring(0, 40000)}

Return ONLY valid JSON matching this structure:
{
  "skills": [{"name": "Skill", "rationale": "Why detected"}],
  "tools": [{"name": "Tool", "rationale": "Why detected"}],
  "roles": [{"name": "Role", "confidence": 0.82, "rationale": "Why"}],
  "evidence": [{"item": "Skill or Role", "rationale": "Short explanation"}]
}

Guidelines:
- Include both technical and soft skills if clearly stated.
- Tools include frameworks, languages, platforms, analytics suites, design tools, etc.
- Roles should reflect likely job titles aligned with the candidate experience. Set confidence 0-1.
- Provide concise evidence referencing bullet points or achievements, not generic statements.
- Prefer normalized names (e.g., "JavaScript" instead of "JS").
- Limit to top 15 skills, 15 tools, and 5 roles.`;

  const response = await generateObjectUnified({
    prompt,
    schema: aiExtractionSchema,
    system:
      "You are an explainable career intelligence assistant. Always return normalized JSON with clear rationales. Never include markdown.",
  });

  const skills = response.skills.map((skill) => skill.name.trim()).filter(Boolean);
  const tools = response.tools.map((tool) => tool.name.trim()).filter(Boolean);

  return {
    skills: Array.from(new Set(skills)),
    tools: Array.from(new Set(tools)),
    roles: response.roles.map((role) => ({
      name: role.name.trim(),
      confidence: Number(role.confidence.toFixed(2)),
      rationale: role.rationale,
    })),
    evidence: response.evidence.map((item) => ({
      item: item.item.trim(),
      source: "LLM" as const,
      rationale: item.rationale,
    })),
  };
}

