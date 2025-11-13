import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import Mentor from "@/models/Mentor";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "mentor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const mentor = await Mentor.findOne({ userId });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // Get all unique students who have sessions with this mentor
    const sessions = await Session.find({ mentorId: mentor._id })
      .populate("studentId", "fullName email avatar")
      .lean();

    // Group by student and calculate stats
    const studentMap = new Map();
    
    sessions.forEach((s: any) => {
      const studentId = s.studentId._id.toString();
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          student: s.studentId,
          totalSessions: 0,
          completedSessions: 0,
          upcomingSessions: 0,
          totalEarnings: 0,
          lastSessionDate: null,
          nextSessionDate: null,
        });
      }
      
      const stats = studentMap.get(studentId);
      stats.totalSessions++;
      
      if (s.status === "completed") {
        stats.completedSessions++;
        stats.totalEarnings += s.earnings || 0;
      }
      
      if (s.status === "scheduled" && new Date(s.scheduledDate) > new Date()) {
        stats.upcomingSessions++;
        if (!stats.nextSessionDate || new Date(s.scheduledDate) < new Date(stats.nextSessionDate)) {
          stats.nextSessionDate = s.scheduledDate;
        }
      }
      
      if (s.status === "completed" && (!stats.lastSessionDate || new Date(s.scheduledDate) > new Date(stats.lastSessionDate))) {
        stats.lastSessionDate = s.scheduledDate;
      }
    });

    const students = Array.from(studentMap.values());

    // Sort by total sessions (most active first)
    students.sort((a, b) => b.totalSessions - a.totalSessions);

    return NextResponse.json({
      students,
      total: students.length
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

