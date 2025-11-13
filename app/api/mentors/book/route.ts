import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const body = await request.json();
    const { mentorId, topic, description, scheduledDate, duration, meetingLink } = body;

    // Validate required fields
    if (!mentorId || !topic || !scheduledDate || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if mentor exists and is active
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    if (mentor.status !== "active") {
      return NextResponse.json(
        { error: "Mentor is not available for bookings" },
        { status: 400 }
      );
    }

    // Check if scheduled date is in the future
    const scheduledDateTime = new Date(scheduledDate);
    if (scheduledDateTime <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled date must be in the future" },
        { status: 400 }
      );
    }

    // Check for conflicting sessions (same mentor at similar time)
    const conflictingSession = await Session.findOne({
      mentorId: mentor._id,
      scheduledDate: {
        $gte: new Date(scheduledDateTime.getTime() - duration * 60000),
        $lte: new Date(scheduledDateTime.getTime() + duration * 60000),
      },
      status: { $in: ["scheduled", "completed"] },
    });

    if (conflictingSession) {
      return NextResponse.json(
        { error: "Mentor has a conflicting session at this time" },
        { status: 400 }
      );
    }

    // Calculate earnings (85% of hourly rate * duration in hours)
    const hours = duration / 60;
    const totalAmount = mentor.hourlyRate * hours;
    const earnings = totalAmount * 0.85; // Mentor gets 85%

    // Create session
    const newSession = await Session.create({
      mentorId: mentor._id,
      studentId: userId,
      topic,
      description,
      scheduledDate: scheduledDateTime,
      duration,
      status: "scheduled",
      meetingLink: meetingLink || "",
      earnings: 0, // Will be set when session is completed
    });

    // Populate session with mentor and student info
    const populatedSession = await Session.findById(newSession._id)
      .populate("mentorId", "name hourlyRate")
      .populate("studentId", "fullName email")
      .lean();

    return NextResponse.json(
      {
        success: true,
        session: populatedSession,
        message: "Session booked successfully!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error booking session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to book session" },
      { status: 500 }
    );
  }
}

