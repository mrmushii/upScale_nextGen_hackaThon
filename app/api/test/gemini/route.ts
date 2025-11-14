import { NextRequest, NextResponse } from "next/server";
import { generateTextUnified, validateAPIKey } from "@/lib/unifiedAI";
import { auth } from "@/auth";

/**
 * Test endpoint for Gemini API configuration
 * 
 * WARNING: This endpoint is public for testing purposes.
 * In production, this should be protected with authentication or removed.
 * 
 * Usage: GET http://localhost:3000/api/test/gemini
 */
export async function GET(request: NextRequest) {
  // Require authentication in production
  if (process.env.NODE_ENV === "production") {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  
  try {
    // Validate API key using unified service
    if (!validateAPIKey()) {
      return NextResponse.json({
        success: false,
        error: "Gemini API key not configured",
        message: "Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file",
        apiKeyStatus: "missing_or_invalid",
      });
    }

    try {
      const testPrompt = "Say 'Hello, Gemini is working!' and nothing else.";

      console.log("Testing unified AI service...");
      const startTime = Date.now();
      
      const text = await generateTextUnified({
        prompt: testPrompt,
        system: "You are a helpful assistant.",
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log("Unified AI Response:", text);
      console.log("Response time:", responseTime, "ms");

      return NextResponse.json({
        success: true,
        message: "Unified AI service is working correctly!",
        response: text.trim(),
        responseTime: `${responseTime}ms`,
        apiKeyStatus: "configured",
        model: "gemini-2.0-flash-001",
        service: "unifiedAI",
        timestamp: new Date().toISOString(),
        note: "This is a test endpoint. In production, consider adding authentication.",
      });
    } catch (aiError: any) {
      console.error("Unified AI Service Error:", aiError);
      
      // Provide helpful error messages
      let errorMessage = "Unified AI service call failed";
      let helpfulHint = "";
      
      if (aiError.message?.includes("API key") || aiError.message?.includes("Missing Gemini")) {
        errorMessage = "Invalid API Key";
        helpfulHint = "Check that GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is set correctly in .env.local";
      } else if (aiError.message?.includes("rate limit") || aiError.message?.includes("quota")) {
        errorMessage = "Rate Limit Exceeded";
        helpfulHint = "You've exceeded the API quota. Wait a moment or upgrade your plan.";
      } else if (aiError.message?.includes("not found") || aiError.message?.includes("not available")) {
        errorMessage = "Model Not Available";
        helpfulHint = "The unified AI model (gemini-2.0-flash-001) is not available. Check your API key and model access.";
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        message: aiError.message || "Unknown error",
        hint: helpfulHint,
        details: {
          name: aiError.name,
          code: aiError.code,
          status: aiError.status,
        },
        apiKeyStatus: validateAPIKey() ? "configured_but_error" : "missing_or_invalid",
        service: "unifiedAI",
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

