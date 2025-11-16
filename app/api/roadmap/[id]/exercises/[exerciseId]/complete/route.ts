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
    const stage = roadmap.stages[stageIndex];
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    const totalExercises = stage.exercises?.length ?? 0;
    if (totalExercises === 0) {
      return NextResponse.json(
        { error: "Stage has no exercises to complete" },
        { status: 400 }
      );
    }

    if (
      typeof exerciseIndex === "number" &&
      stage.exercises &&
      stage.exercises[exerciseIndex]
    ) {
      stage.exercises[exerciseIndex].completed = true;
      stage.exercises[exerciseIndex].lastSubmission = code || "";
    }

    stage.completedExercises = (stage.completedExercises || 0) + 1;
    stage.completedExercises = Math.min(stage.completedExercises, totalExercises);

    if (stage.completedExercises >= totalExercises) {
      stage.completed = true;
    }

    roadmap.stages[stageIndex] = stage;

    // Update overall progress
    const completedStages = roadmap.stages.filter((s: any) => s.completed).length;
    roadmap.progress = Math.round((completedStages / roadmap.stages.length) * 100);

    roadmap.markModified("stages");
    await roadmap.save();

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






