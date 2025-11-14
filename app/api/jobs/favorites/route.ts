import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import FavoriteJob from "@/models/FavoriteJob";
import User from "@/models/User";
import { analyzeSkillGaps } from "@/lib/skillGapAnalysis";

// GET - Fetch user's favorite jobs
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const favoriteJobs = await FavoriteJob.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ favoriteJobs });
  } catch (error: any) {
    console.error("Error fetching favorite jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite jobs", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add a job to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { jobId, jobTitle, company, jobData } = body;

    if (!jobId || !jobTitle || !company) {
      return NextResponse.json(
        { error: "Missing required fields: jobId, jobTitle, company" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await FavoriteJob.findOne({
      userId: session.user.id,
      jobId: jobId.toString(),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Job already in favorites", favoriteJob: existing },
        { status: 409 }
      );
    }

    // Get user skills for gap analysis
    const user = await User.findById(session.user.id).lean();
    const userSkills = user?.skills || [];
    const userTools = user?.tools || [];

    // Prepare job requirements for analysis
    // Ensure all fields are properly formatted
    const getStringValue = (value: any): string => {
      if (!value) return "";
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.join(" ");
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };

    const getArrayValue = (value: any): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) return value.map(String);
      if (typeof value === "string") return [value];
      return [];
    };

    const jobRequirements = {
      requiredSkills: getArrayValue(jobData.requiredSkills || jobData.skills || jobData.requirements),
      description: getStringValue(jobData.description || ""),
      requirements: getStringValue(jobData.requirements || jobData.qualifications || ""),
      qualifications: getStringValue(jobData.qualifications || ""),
    };

    // Analyze skill gaps
    const skillGaps = await analyzeSkillGaps(jobRequirements, {
      skills: userSkills,
      tools: userTools,
    });

    // Create favorite job
    const favoriteJob = await FavoriteJob.create({
      userId: session.user.id,
      jobId: jobId.toString(),
      jobTitle,
      company,
      jobData: jobData || {},
      skillGaps,
    });

    return NextResponse.json(
      {
        message: "Job added to favorites",
        favoriteJob,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding favorite job:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Job already in favorites" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add favorite job", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove a job from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId parameter is required" },
        { status: 400 }
      );
    }

    const result = await FavoriteJob.deleteOne({
      userId: session.user.id,
      jobId: jobId.toString(),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Favorite job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Job removed from favorites" });
  } catch (error: any) {
    console.error("Error removing favorite job:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite job", details: error.message },
      { status: 500 }
    );
  }
}

