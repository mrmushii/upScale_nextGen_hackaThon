import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Mentor from "@/models/Mentor";

export async function GET() {
  try {
    const session = await auth();
    
    if (session?.user?.role !== "mentor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const mentor = await Mentor.findOne({ userId: session.user.id }).lean();

    if (!mentor) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    const stats = {
      totalSessions: mentor.sessionsCompleted,
      upcomingSessions: 0, // Mock - would fetch from bookings
      totalEarnings: mentor.totalEarnings,
      rating: mentor.rating,
      totalStudents: Math.floor(mentor.sessionsCompleted / 2), // Mock estimation
    };

    const upcomingSessions = [
      // Mock data - would fetch from Booking model
      { studentName: "John Doe", topic: "Resume Review", time: "Tomorrow 3:00 PM", duration: 60 },
      { studentName: "Sarah Ahmed", topic: "Mock Interview", time: "Friday 10:00 AM", duration: 90 },
    ];

    return NextResponse.json({ stats, upcomingSessions });
  } catch (error) {
    console.error("Mentor stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

