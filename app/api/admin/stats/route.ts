import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";
import Mentor from "@/models/Mentor";

export async function GET() {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    await connectDB();

    // Fetch stats
    const [totalUsers, totalJobs, totalMentors, activeUsers, pendingMentors] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Mentor.countDocuments({ status: "active" }),
      User.countDocuments({ "subscription.status": "active" }),
      Mentor.countDocuments({ status: "pending" }),
    ]);

    const stats = {
      totalUsers,
      totalJobs,
      totalMentors,
      totalRevenue: 50000, // Mock value - calculate from actual payments
      activeUsers,
      pendingMentors,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

