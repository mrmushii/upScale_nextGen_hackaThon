import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

/**
 * Test API route to verify MongoDB connection
 * 
 * Usage: GET http://localhost:3000/api/test
 */
export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful! ✅",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed ❌",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

