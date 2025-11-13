import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("-password").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const allowedFields = [
      "fullName",
      "skills",
      "targetRoles",
      "preferredTrack",
      "educationLevel",
      "educationDepartment",
      "experienceLevel",
      "city",
      "country",
      "phone",
      "bio",
      "linkedin",
      "github",
      "portfolio",
      "website",
      "dateOfBirth",
      "gender",
      "languages",
      "availability",
      "salaryExpectation",
      "workAuthorization",
      "experience",
      "projects",
      "careerInterests",
      "cvText",
    ];

    const updateData: any = {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        // Handle dateOfBirth conversion
        if (field === "dateOfBirth") {
          if (body[field] && String(body[field]).trim() !== "") {
            try {
              updateData[field] = new Date(body[field]);
            } catch (e) {
              console.error("Invalid date format:", body[field]);
            }
          }
          // If empty, don't include it in updateData
        } else if (field === "experience" && Array.isArray(body[field])) {
          // Convert experience dates
          updateData[field] = body[field].map((exp: any) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          }));
        } else if (field === "projects" && Array.isArray(body[field])) {
          // Convert project dates
          updateData[field] = body[field].map((project: any) => ({
            ...project,
            startDate: project.startDate ? new Date(project.startDate) : undefined,
            endDate: project.endDate ? new Date(project.endDate) : undefined,
          }));
        } else {
          // For other fields, include empty strings (they can be cleared)
          updateData[field] = body[field];
        }
      }
    });

    console.log("Updating user profile with:", updateData);

    // Update user profile
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    // Re-fetch user to get all fields (including defaults)
    const updatedUser = await User.findById(session.user.id).select("-password");

    // Update profile completion status based on updated user
    const { checkProfileCompletion } = await import("@/lib/profileCompletion");
    const completion = checkProfileCompletion(updatedUser);
    
    console.log("Profile completion check:", {
      isComplete: completion.isComplete,
      percentage: completion.percentage,
      missingFields: completion.missingFields,
    });
    
    await User.findByIdAndUpdate(session.user.id, {
      profileCompleted: completion.isComplete,
      profileCompletionPercentage: completion.percentage,
    });

    // Return updated user with completion status
    const finalUser = await User.findById(session.user.id).select("-password");

    return NextResponse.json({ 
      user: finalUser,
      completion: {
        isComplete: completion.isComplete,
        percentage: completion.percentage,
        missingFields: completion.missingFields,
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

