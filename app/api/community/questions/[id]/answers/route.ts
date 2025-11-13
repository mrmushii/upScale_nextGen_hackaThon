import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import Notification from "@/models/Notification";

// POST - Add an answer to a question
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Answer content is required" },
        { status: 400 }
      );
    }

    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Add answer
    question.answers.push({
      userId,
      content,
      upvotes: 0,
      upvotedBy: [],
      isAccepted: false,
    });

    await question.save();
    await question.populate("userId", "fullName email avatar role");
    await question.populate("answers.userId", "fullName email avatar role");

    const newAnswer = question.answers[question.answers.length - 1];

    // Notify question owner (unless they answered their own question)
    if (question.userId.toString() !== userId) {
      await Notification.create({
        userId: question.userId,
        type: "info",
        title: "New Answer",
        message: `${(session.user as any).name || "Someone"} answered your question: "${question.title}"`,
        link: `/dashboard/community/${question._id}`,
      });
    }

    return NextResponse.json({ answer: newAnswer, question }, { status: 201 });
  } catch (error) {
    console.error("Error adding answer:", error);
    return NextResponse.json(
      { error: "Failed to add answer" },
      { status: 500 }
    );
  }
}

// PATCH - Update answer (upvote)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const body = await request.json();
    const { answerId, action } = body;

    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    if (action === "upvote") {
      const hasUpvoted = answer.upvotedBy.some(
        (id) => id.toString() === userId
      );

      if (hasUpvoted) {
        answer.upvotedBy = answer.upvotedBy.filter(
          (id) => id.toString() !== userId
        );
        answer.upvotes = Math.max(0, answer.upvotes - 1);
      } else {
        answer.upvotedBy.push(userId);
        answer.upvotes += 1;
      }
    }

    await question.save();
    await question.populate("userId", "fullName email avatar role");
    await question.populate("answers.userId", "fullName email avatar role");

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error updating answer:", error);
    return NextResponse.json(
      { error: "Failed to update answer" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an answer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const answerId = searchParams.get("answerId");

    if (!answerId) {
      return NextResponse.json(
        { error: "Answer ID is required" },
        { status: 400 }
      );
    }

    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // Only answer owner or admin can delete
    const userRole = (session.user as any)?.role;
    if (answer.userId.toString() !== userId && userRole !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized to delete this answer" },
        { status: 403 }
      );
    }

    answer.deleteOne();
    await question.save();
    await question.populate("userId", "fullName email avatar role");
    await question.populate("answers.userId", "fullName email avatar role");

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return NextResponse.json(
      { error: "Failed to delete answer" },
      { status: 500 }
    );
  }
}

