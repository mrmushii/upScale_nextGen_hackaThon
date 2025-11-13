import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Reset usage limits for testing/development
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset career roadmaps usage to 0
    await User.findByIdAndUpdate(session.user.id, {
      $set: { "usageLimits.careerRoadmaps": 0 },
    });

    return NextResponse.json({
      success: true,
      message: "Usage limit reset successfully",
      usage: {
        careerRoadmaps: 0,
      },
    });
  } catch (error: any) {
    console.error("Reset usage error:", error);
    return NextResponse.json(
      { error: "Failed to reset usage", details: error.message },
      { status: 500 }
    );
  }
}

// Get current usage
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tier = user.subscription?.tier || "basic";
    const currentUsage = user.usageLimits?.careerRoadmaps || 0;

    return NextResponse.json({
      tier,
      currentUsage,
      usageLimits: user.usageLimits,
    });
  } catch (error: any) {
    console.error("Get usage error:", error);
    return NextResponse.json(
      { error: "Failed to get usage", details: error.message },
      { status: 500 }
    );
  }
}

