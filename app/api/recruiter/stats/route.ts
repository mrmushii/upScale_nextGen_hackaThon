import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET() {
  try {
    const session = await auth();
    
    if (session?.user?.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // Get recruiter's jobs (in production, filter by postedBy: userId)
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });

    const stats = {
      totalJobs,
      activeJobs,
      totalViews: totalJobs * 25, // Mock views
      totalApplications: totalJobs * 8, // Mock applications
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Recruiter stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

