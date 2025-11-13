import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import Notification from "@/models/Notification";
import User from "@/models/User";

// GET - Fetch all questions
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") || "recent"; // recent, popular, unanswered
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    let sortQuery: any = { createdAt: -1 };
    if (sort === "popular") {
      sortQuery = { upvotes: -1, createdAt: -1 };
    } else if (sort === "unanswered") {
      query.isAnswered = false;
    }

    const questions = await Question.find(query)
      .populate("userId", "fullName email avatar role")
      .sort(sortQuery)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Question.countDocuments(query);

    return NextResponse.json({
      questions,
      total,
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST - Create a new question
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const body = await request.json();
    const { title, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const question = await Question.create({
      userId,
      title,
      content,
      tags: tags || [],
    });

    // Populate user info
    await question.populate("userId", "fullName email avatar role");

    // Notify admins, mentors, and recruiters about new question
    const experts = await User.find({
      role: { $in: ["admin", "mentor", "recruiter"] },
    }).select("_id");

    const notifications = experts.map((expert) => ({
      userId: expert._id,
      type: "info" as const,
      title: "New Question Posted",
      message: `${(session.user as any).name || "A user"} asked: ${title}`,
      link: `/dashboard/community/${question._id}`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

