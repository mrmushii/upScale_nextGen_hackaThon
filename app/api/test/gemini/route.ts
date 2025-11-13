import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-api-key-here" || GEMINI_API_KEY === "AIzaSyDummy-Key-For-Testing") {
      return NextResponse.json({
        success: false,
        error: "Gemini API key not configured",
        message: "Please set GEMINI_API_KEY in your .env.local file",
        apiKeyStatus: "missing_or_invalid",
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      // Use gemini-2.5-flash
      const modelName = "gemini-2.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });

      const testPrompt = "Say 'Hello, Gemini is working!' and nothing else.";

      console.log("Testing Gemini API...");
      const startTime = Date.now();
      
      const result = await model.generateContent(testPrompt);
      const response = await result.response;
      const text = response.text();
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log("Gemini API Response:", text);
      console.log("Response time:", responseTime, "ms");

      return NextResponse.json({
        success: true,
        message: "Gemini API is working correctly!",
        response: text.trim(),
        responseTime: `${responseTime}ms`,
        apiKeyStatus: "configured",
        model: modelName,
        timestamp: new Date().toISOString(),
      });
    } catch (geminiError: any) {
      console.error("Gemini API Error:", geminiError);
      
      return NextResponse.json({
        success: false,
        error: "Gemini API call failed",
        message: geminiError.message || "Unknown error",
        details: {
          name: geminiError.name,
          code: geminiError.code,
          status: geminiError.status,
        },
        apiKeyStatus: "configured_but_error",
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

