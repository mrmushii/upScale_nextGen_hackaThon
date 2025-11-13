import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";
import User from "@/models/User";
import { auth } from "@/auth";
import { checkProfileCompletion } from "@/lib/profileCompletion";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const applications = await Application.find({ userId: session.user.id })
      .sort({ appliedAt: -1 })
      .populate("jobId")
      .lean();

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Applications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Check profile completion
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completion = checkProfileCompletion(user);
    if (!completion.isComplete) {
      return NextResponse.json(
        {
          error: "Profile incomplete",
          message: "Please complete your profile before applying to jobs.",
          completion: completion,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { jobId, externalLink, companyName, position, notes } = body;

    if (!companyName || !position) {
      return NextResponse.json(
        { error: "Company name and position are required" },
        { status: 400 }
      );
    }

    const application = await Application.create({
      userId: session.user.id,
      jobId,
      externalLink,
      companyName,
      position,
      status: "applied",
      notes,
      appliedAt: new Date(),
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Application creation error:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

