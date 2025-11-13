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

    // Get recruiter's jobs
    const jobs = await Job.find({ postedBy: userId });
    
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === "active").length;
    
    // Mock view and application data
    const totalViews = jobs.reduce((sum) => sum + Math.floor(Math.random() * 100 + 50), 0);
    const totalApplications = jobs.reduce((sum) => sum + Math.floor(Math.random() * 20 + 5), 0);

    // Monthly job posting data
    const monthlyData = [
      { month: "Jan", jobs: 2, applications: 15 },
      { month: "Feb", jobs: 3, applications: 25 },
      { month: "Mar", jobs: 4, applications: 35 },
      { month: "Apr", jobs: 3, applications: 28 },
      { month: "May", jobs: 5, applications: 42 },
      { month: "Jun", jobs: 4, applications: 38 }
    ];

    // Top performing jobs
    const topJobs = jobs.slice(0, 5).map(job => ({
      id: job._id,
      title: job.title,
      views: Math.floor(Math.random() * 200 + 50),
      applications: Math.floor(Math.random() * 30 + 10)
    }));

    return NextResponse.json({
      totalJobs,
      activeJobs,
      totalViews,
      totalApplications,
      monthlyData,
      topJobs
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}


