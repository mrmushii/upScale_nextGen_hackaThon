import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const userId = (session.user as any).id;

    // Get all jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === "active").length;
    const pendingJobs = jobs.filter(j => !j.approved).length;
    const approvedJobs = jobs.filter(j => j.approved).length;

    return NextResponse.json({
      jobs,
      stats: {
        total: totalJobs,
        active: activeJobs,
        pending: pendingJobs,
        approved: approvedJobs
      }
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

