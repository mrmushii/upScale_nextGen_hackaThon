export type EvidenceSource = "LLM" | "Heuristic";

export interface RoleSuggestion {
  name: string;
  confidence: number;
  category?: string;
  rationale?: string;
}

export interface EvidenceItem {
  item: string;
  source: EvidenceSource;
  rationale: string;
  matchedTerms?: string[];
}

export interface CVAnalysisResult {
  skills: string[];
  tools: string[];
  roles: RoleSuggestion[];
  evidence: EvidenceItem[];
}

export interface PersistedProfileUpdate {
  skills: string[];
  tools: string[];
  roles: string[];
}

export interface SkillExtractionRequest {
  text?: string;
  resumeId?: string;
  useProfile?: boolean;
  source?: "resume" | "profile" | "text" | "upload";
}

export interface SkillExtractionResponse {
  result: CVAnalysisResult;
  usedFallback: boolean;
  message?: string;
}

