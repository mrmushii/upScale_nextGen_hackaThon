import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { auth } from "@/auth";

// Uses auth and cookies; mark as dynamic to avoid static export warnings
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use unified jobs API to get both recruiter and findwork.dev jobs
    const { searchParams } = new URL(request.url);
    const track = user.preferredTrack || "";
    
    // Fetch from unified API
    const baseUrl = request.nextUrl.origin;
    const unifiedParams = new URLSearchParams();
    unifiedParams.append("page", "1");
    unifiedParams.append("track", track || "all");
    
    try {
      const unifiedResponse = await fetch(`${baseUrl}/api/jobs/unified?${unifiedParams.toString()}`, {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      });

      if (unifiedResponse.ok) {
        const unifiedData = await unifiedResponse.json();
        // Return top matches (already sorted by match score)
        const topMatches = unifiedData.jobs.slice(0, 10).map((job: any) => ({
          job,
          score: job.matchScore || 0,
          overlapSkills: job.overlapSkills || [],
          missingSkills: job.missingSkills || [],
          explanation: `You match ${job.overlapSkills?.length || 0} out of ${job.skills?.length || 0} required skills`,
        }));

        return NextResponse.json({ matches: topMatches });
      }
    } catch (error) {
      console.error("Error fetching from unified API:", error);
    }

    // Fallback to old method (recruiter jobs only)
    const userSkills = user.skills || [];
    const jobs = await Job.find({ status: "active", approved: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Calculate match scores
    const matches = jobs.map((job) => {
      const requiredSkills = job.requiredSkills || [];
      const overlapSkills = requiredSkills.filter((skill) =>
        userSkills.some((us) => us.toLowerCase() === skill.toLowerCase())
      );
      const missingSkills = requiredSkills.filter(
        (skill) => !userSkills.some((us) => us.toLowerCase() === skill.toLowerCase())
      );

      let score = 0;
      if (requiredSkills.length > 0) {
        score = Math.round((overlapSkills.length / requiredSkills.length) * 100);
      }

      // Boost score for matching track
      if (job.track === user.preferredTrack) {
        score = Math.min(100, score + 10);
      }

      return {
        job,
        score,
        overlapSkills,
        missingSkills,
        explanation: `You match ${overlapSkills.length} out of ${requiredSkills.length} required skills`,
      };
    });

    // Sort by score
    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({ matches: matches.slice(0, 20) });
  } catch (error) {
    console.error("Job matching error:", error);
    return NextResponse.json(
      { error: "Failed to match jobs" },
      { status: 500 }
    );
  }
}

