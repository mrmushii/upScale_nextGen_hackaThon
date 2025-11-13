import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import Notification from "@/models/Notification";

// GET - Fetch user's portfolio
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const publicUrl = searchParams.get("publicUrl");

    // Public portfolio view
    if (publicUrl) {
      const portfolio = await Portfolio.findOne({ publicUrl, published: true }).lean();
      if (!portfolio) {
        return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
      }

      // Increment views
      await Portfolio.updateOne({ _id: portfolio._id }, { $inc: { views: 1 } });

      return NextResponse.json({ portfolio });
    }

    // User's own portfolio
    let portfolio = await Portfolio.findOne({ userId }).lean();

    // Create default portfolio if doesn't exist
    if (!portfolio) {
      const defaultSections = [
        {
          id: "about",
          type: "about" as const,
          title: "About Me",
          content: { text: "" },
          order: 1,
          visible: true,
        },
        {
          id: "skills",
          type: "skills" as const,
          title: "Skills",
          content: { items: [] },
          order: 2,
          visible: true,
        },
        {
          id: "projects",
          type: "projects" as const,
          title: "Projects",
          content: { items: [] },
          order: 3,
          visible: true,
        },
        {
          id: "contact",
          type: "contact" as const,
          title: "Contact",
          content: { email: "", phone: "", social: {} },
          order: 4,
          visible: true,
        },
      ];

      portfolio = await Portfolio.create({
        userId,
        template: "basic",
        sections: defaultSections,
        published: false,
      });
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

// POST - Create or update portfolio
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const body = await request.json();
    const { template, sections, published } = body;

    let portfolio = await Portfolio.findOne({ userId });

    if (portfolio) {
      // Update existing portfolio
      portfolio.template = template || portfolio.template;
      portfolio.sections = sections || portfolio.sections;
      portfolio.published = published !== undefined ? published : portfolio.published;
      
      if (published && !portfolio.publicUrl) {
        portfolio.publicUrl = `portfolio-${userId}-${Date.now()}`;
        
        // Create notification
        await Notification.create({
          userId,
          type: "success",
          title: "Portfolio Published",
          message: "Your portfolio has been published successfully!",
          link: `/portfolio/${portfolio.publicUrl}`,
        });
      }
      
      await portfolio.save();
    } else {
      // Create new portfolio
      portfolio = await Portfolio.create({
        userId,
        template: template || "basic",
        sections: sections || [],
        published: published || false,
        publicUrl: published ? `portfolio-${userId}-${Date.now()}` : undefined,
      });
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Error saving portfolio:", error);
    return NextResponse.json(
      { error: "Failed to save portfolio" },
      { status: 500 }
    );
  }
}

// DELETE - Delete portfolio
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    await Portfolio.deleteOne({ userId });

    return NextResponse.json({ message: "Portfolio deleted" });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}

