import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";

/**
 * Test API route to verify MongoDB connection
 * 
 * NOTE: This endpoint should be protected in production.
 * Consider adding authentication or removing this endpoint.
 * 
 * Usage: GET http://localhost:3000/api/test
 */
export async function GET() {
  // Require authentication in production
  if (process.env.NODE_ENV === "production") {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  
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

