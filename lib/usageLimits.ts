import User from "@/models/User";
import { TIER_LIMITS } from "@/types";

export async function checkUsageLimit(
  userId: string,
  feature: keyof typeof TIER_LIMITS.basic
): Promise<{ allowed: boolean; message?: string; current?: number; limit?: number }> {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { allowed: false, message: "User not found" };
    }

    const tier = user.subscription?.tier || "basic";
    const limit = TIER_LIMITS[tier][feature];
    const current = user.usageLimits?.[feature] || 0;

    // Unlimited access
    if (limit === Infinity) {
      return { allowed: true, current, limit };
    }

    if (current >= limit) {
      return {
        allowed: false,
        message: `You've reached your monthly limit for ${feature}. Upgrade your plan for more access.`,
        current,
        limit,
      };
    }

    return { allowed: true, current, limit };
  } catch (error) {
    console.error("Usage limit check error:", error);
    return { allowed: false, message: "Failed to check usage limit" };
  }
}

export async function incrementUsage(
  userId: string,
  feature: keyof typeof TIER_LIMITS.basic
): Promise<boolean> {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { [`usageLimits.${feature}`]: 1 },
    });
    return true;
  } catch (error) {
    console.error("Usage increment error:", error);
    return false;
  }
}

export async function resetMonthlyLimits(userId: string): Promise<boolean> {
  try {
    const nextResetDate = new Date();
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);

    await User.findByIdAndUpdate(userId, {
      $set: {
        "usageLimits.evaluationInterviews": 0,
        "usageLimits.careerRoadmaps": 0,
        "usageLimits.mockInterviews": 0,
        "usageLimits.cvAnalyses": 0,
        "usageLimits.mentorSessions": 0,
        "usageLimits.resetDate": nextResetDate,
      },
    });
    return true;
  } catch (error) {
    console.error("Usage reset error:", error);
    return false;
  }
}

