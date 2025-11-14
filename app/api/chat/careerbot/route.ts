import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { runInterviewPrompt } from "@/lib/unifiedAI";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { message, conversationHistory = [] } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build context-aware prompt
    const userContext = `
User Profile:
- Skills: ${(user.skills || []).join(", ") || "None specified"}
- Preferred Track: ${user.preferredTrack || "Not specified"}
- Experience Level: ${user.experienceLevel || "Not specified"}
- Target Roles: ${(user.targetRoles || []).join(", ") || "None specified"}
`;

    const systemPrompt = `You are CareerBot, a helpful career mentor assistant focused on helping youth access decent work opportunities (SDG 8).

Your role:
- Provide career guidance and advice
- Help users understand which roles fit their skills
- Suggest learning paths and next steps
- Offer tips for improving job application success
- Be encouraging and supportive

IMPORTANT:
- Always indicate when you're making suggestions, not guarantees
- Focus on practical, actionable advice
- Consider the user's current skills and experience level
- Align advice with SDG 8 goals (decent work for youth)
- Keep responses concise and helpful

User Context:
${userContext}

Conversation History:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}

User Question: ${message}

Provide a helpful, encouraging response that addresses their question while considering their profile.`;

    // Use unified AI service
    const response = await runInterviewPrompt(systemPrompt);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("CareerBot error:", error);
    return NextResponse.json(
      {
        error: "Failed to get response from CareerBot",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

