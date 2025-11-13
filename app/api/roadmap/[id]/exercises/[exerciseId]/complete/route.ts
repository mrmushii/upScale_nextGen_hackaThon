import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; exerciseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { stageIndex, exerciseIndex, code } = await request.json();

    // Update roadmap to mark exercise as completed
    const roadmap = await Roadmap.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Mark exercise as completed in the stage
    if (roadmap.stages[stageIndex]) {
      if (!roadmap.stages[stageIndex].completedExercises) {
        roadmap.stages[stageIndex].completedExercises = 0;
      }
      roadmap.stages[stageIndex].completedExercises += 1;

      // Check if all exercises in stage are completed
      const totalExercises = roadmap.stages[stageIndex].exercises?.length || 0;
      if (roadmap.stages[stageIndex].completedExercises >= totalExercises) {
        roadmap.stages[stageIndex].completed = true;
      }

      // Update overall progress
      const completedStages = roadmap.stages.filter((s: any) => s.completed).length;
      roadmap.progress = Math.round((completedStages / roadmap.stages.length) * 100);

      await roadmap.save();
    }

    return NextResponse.json({
      message: "Exercise completed!",
      roadmap,
    });
  } catch (error) {
    console.error("Exercise completion error:", error);
    return NextResponse.json(
      { error: "Failed to complete exercise" },
      { status: 500 }
    );
  }
}


