import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import FavoriteJob from "@/models/FavoriteJob";
import { searchUdemyCourses } from "@/lib/udemyAPI";

// GET - Get course suggestions for a favorite job based on skill gaps
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const favoriteJob = await FavoriteJob.findOne({
      userId: session.user.id,
      jobId: params.jobId,
    }).lean();

    if (!favoriteJob) {
      return NextResponse.json(
        { error: "Favorite job not found" },
        { status: 404 }
      );
    }

    // Get missing and existing skills
    const missingSkills = favoriteJob.skillGaps?.missingSkills || [];
    const existingSkills = favoriteJob.skillGaps?.existingSkills || [];
    
    // Normalize skill names for comparison (same as skill gap analysis)
    const normalizeSkill = (skill: string): string => {
      return skill
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
    };
    
    // Validate: ensure missingSkills doesn't contain any existing skills
    // This fixes the bug where existing skills might be incorrectly in missingSkills
    const normalizedExistingSkills = new Set(
      existingSkills.map((skill: string) => normalizeSkill(skill))
    );
    
    // Filter out any skills from missingSkills that are actually in existingSkills
    const validatedMissingSkills = missingSkills.filter((skill: string) => {
      const normalizedSkill = normalizeSkill(skill);
      return !normalizedExistingSkills.has(normalizedSkill);
    });
    
    if (validatedMissingSkills.length === 0) {
      return NextResponse.json({
        suggestions: {
          udemy: [],
          youtube: [],
          microsoft: [],
        },
        message: "No skill gaps found. Great job!",
      });
    }

    // Fetch courses for missing skills
    const suggestions: any = {
      udemy: [],
      youtube: [],
      microsoft: [],
    };

    // Get top 3-5 missing skills for course suggestions
    // Use validatedMissingSkills to ensure we only suggest courses for truly missing skills
    const topMissingSkills = validatedMissingSkills.slice(0, 5);
    
    // Debug logging to verify correct skills are being used
    console.log("Course suggestions - Missing skills:", topMissingSkills);
    console.log("Course suggestions - Existing skills (excluded):", existingSkills);

    // Fetch Udemy courses
    try {
      for (const skill of topMissingSkills) {
        const udemyResult = await searchUdemyCourses(skill, 1, 3);
        suggestions.udemy.push(...udemyResult.courses);
      }
      // Remove duplicates and limit
      suggestions.udemy = suggestions.udemy
        .filter((course: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.id === course.id)
        )
        .slice(0, 10);
    } catch (error) {
      console.error("Error fetching Udemy courses:", error);
    }

    // Fetch YouTube courses
    try {
      for (const skill of topMissingSkills) {
        const youtubeResponse = await fetch(
          `${request.nextUrl.origin}/api/resources/youtube?search=${encodeURIComponent(skill)}`,
          {
            headers: {
              Cookie: request.headers.get("cookie") || "",
            },
          }
        );
        if (youtubeResponse.ok) {
          const youtubeData = await youtubeResponse.json();
          if (youtubeData.courses && Array.isArray(youtubeData.courses)) {
            suggestions.youtube.push(...youtubeData.courses.slice(0, 3));
          }
        }
      }
      // Remove duplicates and limit
      suggestions.youtube = suggestions.youtube
        .filter((course: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.id === course.id)
        )
        .slice(0, 10);
    } catch (error) {
      console.error("Error fetching YouTube courses:", error);
    }

    // Fetch Microsoft Learn courses
    try {
      for (const skill of topMissingSkills) {
        const microsoftResponse = await fetch(
          `${request.nextUrl.origin}/api/resources/microsoft?search=${encodeURIComponent(skill)}`,
          {
            headers: {
              Cookie: request.headers.get("cookie") || "",
            },
          }
        );
        if (microsoftResponse.ok) {
          const microsoftData = await microsoftResponse.json();
          if (microsoftData.courses && Array.isArray(microsoftData.courses)) {
            suggestions.microsoft.push(...microsoftData.courses.slice(0, 3));
          }
        }
      }
      // Remove duplicates and limit
      suggestions.microsoft = suggestions.microsoft
        .filter((course: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.id === course.id)
        )
        .slice(0, 10);
    } catch (error) {
      console.error("Error fetching Microsoft courses:", error);
    }

    return NextResponse.json({
      suggestions,
      missingSkills: topMissingSkills, // Return only validated missing skills
      matchPercentage: favoriteJob.skillGaps?.matchPercentage || 0,
    });
  } catch (error: any) {
    console.error("Error fetching course suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions", details: error.message },
      { status: 500 }
    );
  }
}

