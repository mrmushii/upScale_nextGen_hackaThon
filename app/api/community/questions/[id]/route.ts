import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import Notification from "@/models/Notification";

// GET - Fetch a single question with answers
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const question = await Question.findById(params.id)
      .populate("userId", "fullName email avatar role")
      .populate("answers.userId", "fullName email avatar role")
      .lean();

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Increment views
    await Question.updateOne({ _id: params.id }, { $inc: { views: 1 } });

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// PATCH - Update question (upvote, accept answer, etc.)
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
    const { action, answerId } = body;

    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (action === "upvote") {
      const hasUpvoted = question.upvotedBy.some(
        (id) => id.toString() === userId
      );

      if (hasUpvoted) {
        question.upvotedBy = question.upvotedBy.filter(
          (id) => id.toString() !== userId
        );
        question.upvotes = Math.max(0, question.upvotes - 1);
      } else {
        question.upvotedBy.push(userId);
        question.upvotes += 1;
      }
    } else if (action === "acceptAnswer" && answerId) {
      // Only question owner can accept answer
      if (question.userId.toString() !== userId) {
        return NextResponse.json(
          { error: "Only question owner can accept answers" },
          { status: 403 }
        );
      }

      // Unaccept previous answer if any
      question.answers.forEach((answer) => {
        answer.isAccepted = false;
      });

      // Accept new answer
      const acceptedIndex = question.answers.findIndex(
        (answer) => answer._id?.toString() === answerId
      );
      if (acceptedIndex !== -1) {
        question.answers[acceptedIndex].isAccepted = true;
        question.isAnswered = true;
        question.acceptedAnswerId = question.answers[acceptedIndex]._id;

        // Notify answer author
        await Notification.create({
          userId: question.answers[acceptedIndex].userId,
          type: "success",
          title: "Answer Accepted",
          message: `Your answer to "${question.title}" was accepted!`,
          link: `/dashboard/community/${question._id}`,
        });
      } else {
        question.isAnswered = false;
        question.acceptedAnswerId = undefined;
      }
    }

    question.markModified("answers");
    await question.save();
    await question.populate("userId", "fullName email avatar role");
    await question.populate("answers.userId", "fullName email avatar role");

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE - Delete question
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
    const question = await Question.findById(params.id);

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Only question owner or admin can delete
    const userRole = (session.user as any)?.role;
    if (question.userId.toString() !== userId && userRole !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized to delete this question" },
        { status: 403 }
      );
    }

    await Question.deleteOne({ _id: params.id });

    return NextResponse.json({ message: "Question deleted" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}

