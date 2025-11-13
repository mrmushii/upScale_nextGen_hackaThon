import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const PLAN_PRICES = {
  basic: 0,
  pro: 999,
  ultimate: 2499,
};

const PLAN_FEATURES = {
  basic: {
    mockInterviews: 3,
    careerRoadmaps: 1,
    cvAnalyses: 2,
    mentorSessions: 0,
    evaluationInterviews: 1,
  },
  pro: {
    mockInterviews: 10,
    careerRoadmaps: 5,
    cvAnalyses: 10,
    mentorSessions: 2,
    evaluationInterviews: 5,
  },
  ultimate: {
    mockInterviews: -1, // Unlimited
    careerRoadmaps: -1,
    cvAnalyses: -1,
    mentorSessions: 5,
    evaluationInterviews: -1,
  },
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById((session.user as any).id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      subscription: user.subscription || null,
      usageLimits: user.usageLimits || null,
      currentTier: user.subscription?.tier || "basic",
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { tier, paymentMethod, paymentDetails } = body;

    if (!tier || !["basic", "pro", "ultimate"].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid subscription tier" },
        { status: 400 }
      );
    }

    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate payment for paid plans
    if (tier !== "basic" && PLAN_PRICES[tier as keyof typeof PLAN_PRICES] > 0) {
      if (!paymentMethod) {
        return NextResponse.json(
          { error: "Payment method is required" },
          { status: 400 }
        );
      }

      // Validate payment details based on method
      if (paymentMethod === "bkash" || paymentMethod === "nagad") {
        if (!paymentDetails?.phoneNumber || !/^01\d{9}$/.test(paymentDetails.phoneNumber)) {
          return NextResponse.json(
            { error: "Valid phone number is required" },
            { status: 400 }
          );
        }
      } else if (paymentMethod === "card") {
        if (!paymentDetails?.cardNumber || !paymentDetails?.expiryDate || !paymentDetails?.cvv) {
          return NextResponse.json(
            { error: "Complete card details are required" },
            { status: 400 }
          );
        }
      }

      // Simulate payment processing (in production, integrate with actual payment gateway)
      // For now, we'll just validate and accept
      console.log("Processing payment:", { tier, paymentMethod, paymentDetails });
    }

    // Calculate subscription dates
    const now = new Date();
    const startDate = user.subscription?.startDate || now;
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    // Update user subscription
    user.subscription = {
      tier: tier as "basic" | "pro" | "ultimate",
      status: "active",
      startDate,
      endDate,
      autoRenew: true,
    };

    // Reset usage limits based on new tier
    const features = PLAN_FEATURES[tier as keyof typeof PLAN_FEATURES];
    user.usageLimits = {
      mockInterviews: 0,
      careerRoadmaps: 0,
      cvAnalyses: 0,
      mentorSessions: 0,
      evaluationInterviews: 0,
      resetDate: new Date(),
    };

    await user.save();

    return NextResponse.json({
      success: true,
      subscription: user.subscription,
      usageLimits: user.usageLimits,
      message: `Successfully upgraded to ${tier} plan!`,
    });
  } catch (error: any) {
    console.error("Error processing subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process subscription" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { action, autoRenew } = body;

    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.subscription) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    if (action === "cancel") {
      user.subscription.status = "cancelled";
      user.subscription.autoRenew = false;
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Subscription cancelled successfully",
        subscription: user.subscription,
      });
    }

    if (action === "updateAutoRenew" && typeof autoRenew === "boolean") {
      user.subscription.autoRenew = autoRenew;
      await user.save();

      return NextResponse.json({
        success: true,
        message: `Auto-renew ${autoRenew ? "enabled" : "disabled"}`,
        subscription: user.subscription,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update subscription" },
      { status: 500 }
    );
  }
}

