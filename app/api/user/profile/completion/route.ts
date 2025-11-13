import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { checkProfileCompletion } from "@/lib/profileCompletion";

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

    const completion = checkProfileCompletion(user);

    // Update user's profile completion status
    await User.findByIdAndUpdate(session.user.id, {
      profileCompleted: completion.isComplete,
      profileCompletionPercentage: completion.percentage,
    });

    return NextResponse.json({ completion });
  } catch (error: any) {
    console.error("Error checking profile completion:", error);
    return NextResponse.json(
      { error: "Failed to check profile completion", details: error.message },
      { status: 500 }
    );
  }
}

