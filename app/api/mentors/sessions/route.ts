import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import Mentor from "@/models/Mentor";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    let sessions;

    if (userRole === "user") {
      // Get all sessions for this user (student)
      sessions = await Session.find({ studentId: userId })
        .populate("mentorId", "name hourlyRate avatar")
        .sort({ scheduledDate: -1 })
        .lean();
    } else if (userRole === "mentor") {
      // Get all sessions for this mentor
      const mentor = await Mentor.findOne({ userId });
      if (!mentor) {
        return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
      }
      sessions = await Session.find({ mentorId: mentor._id })
        .populate("studentId", "fullName email avatar")
        .sort({ scheduledDate: -1 })
        .lean();
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

