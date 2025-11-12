import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mentor from "@/models/Mentor";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill");
    const role = searchParams.get("role");
    const verified = searchParams.get("verified");

    let query: any = { status: "active" };

    if (skill) {
      query.skills = { $in: [skill] };
    }

    if (role) {
      query.roles = { $in: [role] };
    }

    if (verified === "true") {
      query.verified = true;
    }

    const mentors = await Mentor.find(query)
      .sort({ rating: -1, sessionsCompleted: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ mentors });
  } catch (error) {
    console.error("Mentors fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}

