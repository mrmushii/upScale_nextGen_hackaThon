import { DEFAULT_SKILL_DICTIONARY, SkillDictionaryEntry, SkillExtractionDictionary } from "./dictionary";
import { CVAnalysisResult, EvidenceItem, RoleSuggestion } from "./types";

const WORD_BOUNDARY = /[^a-z0-9\+#]/gi;

function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function buildMatcher(entry: SkillDictionaryEntry): RegExp[] {
  const terms = [entry.name, ...(entry.variants || [])]
    .filter(Boolean)
    .map((term) => term.trim().toLowerCase());

  return terms.map((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i");
  });
}

function collectMatches(
  normalizedText: string,
  rawText: string,
  entries: SkillDictionaryEntry[],
  source: "skills" | "tools"
): { values: string[]; evidence: EvidenceItem[] } {
  const values: string[] = [];
  const evidence: EvidenceItem[] = [];

  entries.forEach((entry) => {
    const matchers = buildMatcher(entry);
    const matches = matchers
      .map((regex) => normalizedText.match(regex)?.[0])
      .filter(Boolean) as string[];

    if (matches.length > 0) {
      values.push(entry.name);
      evidence.push({
        item: entry.name,
        source: "Heuristic",
        rationale:
          entry.evidenceHint ||
          `Matched ${matches.length > 1 ? "terms" : "term"}: ${matches
            .slice(0, 3)
            .join(", ")}`,
        matchedTerms: matches.slice(0, 5),
      });
    }
  });

  return { values, evidence };
}

function collectRoles(
  normalizedText: string,
  entries: SkillExtractionDictionary["roles"]
): RoleSuggestion[] {
  const roles: RoleSuggestion[] = [];

  entries.forEach((entry) => {
    const matchers = buildMatcher(entry);
    const matches = matchers
      .map((regex) => normalizedText.match(regex)?.[0])
      .filter(Boolean) as string[];

    if (matches.length > 0) {
      const confidence = Math.min(0.5 + matches.length * 0.2, 0.95);
      roles.push({
        name: entry.name,
        confidence: parseFloat(confidence.toFixed(2)),
        category: entry.category,
        rationale: `Matched ${matches.length} ${
          matches.length > 1 ? "signals" : "signal"
        } (${matches.slice(0, 3).join(", ")})`,
      });
    }
  });

  // Deduplicate by role name
  const uniqueRoles = new Map<string, RoleSuggestion>();
  roles.forEach((role) => {
    const existing = uniqueRoles.get(role.name);
    if (!existing || role.confidence > existing.confidence) {
      uniqueRoles.set(role.name, role);
    }
  });

  return Array.from(uniqueRoles.values()).sort((a, b) => b.confidence - a.confidence);
}

export async function analyzeCVHeuristic(
  cvText: string,
  dict: SkillExtractionDictionary = DEFAULT_SKILL_DICTIONARY
): Promise<CVAnalysisResult> {
  const normalized = normalizeText(cvText);

  const skillMatches = collectMatches(normalized, cvText, dict.skills, "skills");
  const toolMatches = collectMatches(normalized, cvText, dict.tools, "tools");
  const roles = collectRoles(normalized, dict.roles).slice(0, 5);

  const evidence = [...skillMatches.evidence, ...toolMatches.evidence];

  // Add rationale for roles
  roles.forEach((role) => {
    evidence.push({
      item: role.name,
      source: "Heuristic",
      rationale: role.rationale || "Matched role indicators in CV text",
    });
  });

  return {
    skills: Array.from(new Set(skillMatches.values)).slice(0, 30),
    tools: Array.from(new Set(toolMatches.values)).slice(0, 30),
    roles,
    evidence,
  };
}

