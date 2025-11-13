import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";
import Mentor from "@/models/Mentor";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // Get counts
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalMentors = await Mentor.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });

    // Get user growth data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Get role distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get subscription tier distribution
    const tierDistribution = await User.aggregate([
      {
        $group: {
          _id: "$subscription.tier",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .select("fullName email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      counts: {
        totalUsers,
        totalJobs,
        totalMentors,
        activeJobs
      },
      userGrowth,
      roleDistribution,
      tierDistribution,
      recentUsers
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}


