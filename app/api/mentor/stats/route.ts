import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Mentor from "@/models/Mentor";
import Session from "@/models/Session";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "mentor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const mentor = await Mentor.findOne({ userId }).lean();

    if (!mentor) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    // Get real session data
    const totalSessions = await Session.countDocuments({ mentorId: mentor._id });
    const upcomingSessionsCount = await Session.countDocuments({
      mentorId: mentor._id,
      status: "scheduled",
      scheduledDate: { $gte: new Date() }
    });

    // Get unique students count
    const uniqueStudents = await Session.distinct("studentId", { mentorId: mentor._id });
    const totalStudents = uniqueStudents.length;

    // Get upcoming sessions for dashboard
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 7);
    const upcomingSessionsData = await Session.find({
      mentorId: mentor._id,
      scheduledDate: { $gte: new Date(), $lte: upcomingDate },
      status: "scheduled"
    })
      .populate("studentId", "fullName")
      .sort({ scheduledDate: 1 })
      .limit(5)
      .lean();

    const upcomingSessions = upcomingSessionsData.map((s: any) => ({
      studentName: s.studentId.fullName,
      topic: s.topic,
      time: new Date(s.scheduledDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      duration: s.duration
    }));

    const stats = {
      totalSessions: totalSessions || mentor.sessionsCompleted || 0,
      upcomingSessions: upcomingSessionsCount,
      totalEarnings: mentor.totalEarnings || 0,
      rating: mentor.rating || 0,
      totalStudents: totalStudents,
    };

    return NextResponse.json({ stats, upcomingSessions });
  } catch (error) {
    console.error("Mentor stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

