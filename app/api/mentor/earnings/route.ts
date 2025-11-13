import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";

// Mock session model - you can create this properly later
const mockSessions = [
  { date: "2025-01", earnings: 15000, sessions: 10 },
  { date: "2025-02", earnings: 18000, sessions: 12 },
  { date: "2025-03", earnings: 22000, sessions: 14 },
  { date: "2025-04", earnings: 20000, sessions: 13 },
  { date: "2025-05", earnings: 25000, sessions: 16 },
  { date: "2025-06", earnings: 28000, sessions: 18 },
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "mentor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // Calculate totals
    const totalEarnings = mockSessions.reduce((sum, s) => sum + s.earnings, 0);
    const totalSessions = mockSessions.reduce((sum, s) => sum + s.sessions, 0);
    const avgSessionRate = totalEarnings / totalSessions;

    // Get monthly data for charts
    const monthlyData = mockSessions.map(s => ({
      month: s.date,
      earnings: s.earnings,
      sessions: s.sessions
    }));

    return NextResponse.json({
      totalEarnings,
      totalSessions,
      avgSessionRate: Math.round(avgSessionRate),
      monthlyData,
      recentPayouts: [
        { date: "2025-06-01", amount: 28000, status: "completed" },
        { date: "2025-05-01", amount: 25000, status: "completed" },
        { date: "2025-04-01", amount: 20000, status: "completed" }
      ]
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 });
  }
}


