import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Admin-only route using auth; must run dynamically
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "pending" or "verified"

    let query: any = { role: "recruiter" };
    
    if (status === "pending") {
      query.verified = false;
    } else if (status === "verified") {
      query.verified = true;
    }

    const recruiters = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const pendingCount = await User.countDocuments({ role: "recruiter", verified: false });
    const verifiedCount = await User.countDocuments({ role: "recruiter", verified: true });

    return NextResponse.json({
      recruiters,
      counts: {
        pending: pendingCount,
        verified: verifiedCount,
        total: pendingCount + verifiedCount
      }
    });
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return NextResponse.json({ error: "Failed to fetch recruiters" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { recruiterId, action } = body; // action: "approve" or "reject"

    if (!recruiterId || !action) {
      return NextResponse.json({ error: "Recruiter ID and action required" }, { status: 400 });
    }

    if (action === "approve") {
      const recruiter = await User.findByIdAndUpdate(
        recruiterId,
        { verified: true },
        { new: true }
      ).select("-password");

      return NextResponse.json({
        success: true,
        message: "Recruiter approved successfully",
        recruiter
      });
    } else if (action === "reject") {
      // Delete the unverified recruiter
      await User.findByIdAndDelete(recruiterId);

      return NextResponse.json({
        success: true,
        message: "Recruiter rejected and removed"
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error managing recruiter:", error);
    return NextResponse.json({ error: "Failed to manage recruiter" }, { status: 500 });
  }
}

