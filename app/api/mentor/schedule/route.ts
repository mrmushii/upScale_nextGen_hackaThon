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

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // Format: YYYY-MM
    const status = searchParams.get("status");

    // Build query
    const query: any = { mentorId: mentor._id };
    
    if (status && status !== "all") {
      query.status = status;
    }

    if (month) {
      const startDate = new Date(month + "-01");
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      query.scheduledDate = { $gte: startDate, $lt: endDate };
    }

    const sessions = await Session.find(query)
      .populate("studentId", "fullName email avatar")
      .sort({ scheduledDate: 1 })
      .lean();

    // Get upcoming sessions (next 7 days)
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 7);
    const upcomingSessions = await Session.find({
      mentorId: mentor._id,
      scheduledDate: { $gte: new Date(), $lte: upcomingDate },
      status: "scheduled"
    })
      .populate("studentId", "fullName email avatar")
      .sort({ scheduledDate: 1 })
      .lean();

    // Get stats
    const totalSessions = await Session.countDocuments({ mentorId: mentor._id });
    const completedSessions = await Session.countDocuments({ 
      mentorId: mentor._id, 
      status: "completed" 
    });
    const upcomingCount = await Session.countDocuments({ 
      mentorId: mentor._id, 
      status: "scheduled",
      scheduledDate: { $gte: new Date() }
    });

    return NextResponse.json({
      sessions,
      upcomingSessions,
      stats: {
        total: totalSessions,
        completed: completedSessions,
        upcoming: upcomingCount
      }
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { sessionId, updates } = body;

    const updatedSession = await Session.findOneAndUpdate(
      { _id: sessionId, mentorId: mentor._id },
      { $set: updates },
      { new: true }
    ).populate("studentId", "fullName email avatar");

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // If session is completed, update earnings
    if (updates.status === "completed" && !updatedSession.earnings) {
      const earnings = (mentor.hourlyRate * updatedSession.duration) / 60;
      updatedSession.earnings = earnings;
      await updatedSession.save();
      
      // Update mentor total earnings
      mentor.totalEarnings = (mentor.totalEarnings || 0) + earnings;
      mentor.sessionsCompleted = (mentor.sessionsCompleted || 0) + 1;
      await mentor.save();
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

