import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Mentor from "@/models/Mentor";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "mentor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const mentor = await Mentor.findOne({ userId }).lean();

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    return NextResponse.json({
      payoutConfig: mentor.payoutConfig || null
    });
  } catch (error) {
    console.error("Error fetching payout config:", error);
    return NextResponse.json({ error: "Failed to fetch payout config" }, { status: 500 });
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
    const { payoutConfig } = body;

    // Calculate next payout date
    let nextPayoutDate: Date | undefined;
    if (payoutConfig.enabled && payoutConfig.payoutDay) {
      const now = new Date();
      const day = payoutConfig.payoutDay;
      nextPayoutDate = new Date(now.getFullYear(), now.getMonth(), day);
      
      // If the day has passed this month, set for next month
      if (nextPayoutDate < now) {
        nextPayoutDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
      }
    }

    mentor.payoutConfig = {
      ...payoutConfig,
      nextPayoutDate,
    };

    await mentor.save();

    return NextResponse.json({
      payoutConfig: mentor.payoutConfig
    });
  } catch (error) {
    console.error("Error updating payout config:", error);
    return NextResponse.json({ error: "Failed to update payout config" }, { status: 500 });
  }
}

