import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const body = await request.json();

    // Find session and verify ownership
    const existingSession = await Session.findById(params.id)
      .populate("studentId", "_id")
      .populate("mentorId", "userId");

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if user is the student or mentor
    const isStudent = (existingSession.studentId as any)._id.toString() === userId;
    const isMentor = (existingSession.mentorId as any).userId.toString() === userId;

    if (!isStudent && !isMentor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow status updates
    if (body.status) {
      existingSession.status = body.status;
      await existingSession.save();
    }

    const updatedSession = await Session.findById(params.id)
      .populate("mentorId", "name hourlyRate")
      .populate("studentId", "fullName email")
      .lean();

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

