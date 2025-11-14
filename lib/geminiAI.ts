/**
 * Roadmap Generation Service (Unified AI)
 * 
 * This file uses the unified AI service for consistency across the application.
 * The implementation follows the same pattern as aiInterview.ts.
 */

import { generateTextUnified, parseJSONFromText } from "./unifiedAI";

export async function generateRoadmapWithGemini(
  userProfile: {
    skills: string[];
    preferredTrack: string;
    experienceLevel: string;
    targetRole: string;
  }
): Promise<any> {
  try {
    const prompt = `Create a detailed 3-stage career roadmap for someone who wants to become a ${userProfile.targetRole}.

Current Profile:
- Current Skills: ${userProfile.skills.join(", ") || "None"}
- Preferred Track: ${userProfile.preferredTrack}
- Experience Level: ${userProfile.experienceLevel}

Please create a JSON roadmap with exactly 3 stages following this structure:
{
  "stages": [
    {
      "name": "Stage name (e.g., Foundation & Prerequisites)",
      "goals": ["goal 1", "goal 2", "goal 3", "goal 4", "goal 5"],
      "resources": ["resource 1", "resource 2", "resource 3"],
      "projects": ["project 1", "project 2", "project 3"],
      "estimatedWeeks": number (realistic time estimate),
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
6. Consider their existing skills - mark goals they likely already know with a checkmark
7. Make it specific to ${userProfile.targetRole} role
8. Focus on practical, industry-relevant skills

Return ONLY the JSON object, no other text.`;

    const text = await generateTextUnified({
      prompt,
      system: "You are an expert career advisor. Create detailed, actionable learning roadmaps.",
    });

    const roadmapData = parseJSONFromText(text);
    return roadmapData.stages || [];
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    // Fallback to template-based generation
    return null;
  }
}
