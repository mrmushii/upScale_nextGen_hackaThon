import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Auth-protected preferences route; must run dynamically
export const dynamic = "force-dynamic";

const DEFAULT_PREFERENCES = {
  account: {
    twoFactorEnabled: false,
    loginAlerts: true,
    backupEmail: "",
  },
  notifications: {
    emailUpdates: true,
    productUpdates: true,
    jobAlerts: true,
    mentorReminders: true,
  },
  privacy: {
    profileVisibility: "public" as "public" | "community" | "private",
    showSkills: true,
    showProjects: true,
    showActivity: false,
    allowMessages: true,
  },
  billing: {
    defaultPaymentMethod: "card",
    sendInvoices: true,
    taxId: "",
  },
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById((session.user as any).id)
      .select("preferences subscription")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      preferences: {
        account: { ...DEFAULT_PREFERENCES.account, ...user.preferences?.account },
        notifications: {
          ...DEFAULT_PREFERENCES.notifications,
          ...user.preferences?.notifications,
        },
        privacy: { ...DEFAULT_PREFERENCES.privacy, ...user.preferences?.privacy },
        billing: { ...DEFAULT_PREFERENCES.billing, ...user.preferences?.billing },
      },
      subscription: user.subscription || null,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { section, data } = body as {
      section: "account" | "notifications" | "privacy" | "billing";
      data: Record<string, any>;
    };

    if (!section || !["account", "notifications", "privacy", "billing"].includes(section)) {
      return NextResponse.json({ error: "Invalid preferences section" }, { status: 400 });
    }

    const updates: Record<string, any> = {};

    switch (section) {
      case "account":
        updates["preferences.account"] = {
          ...DEFAULT_PREFERENCES.account,
          twoFactorEnabled: Boolean(data.twoFactorEnabled),
          loginAlerts: data.loginAlerts === undefined ? true : Boolean(data.loginAlerts),
          backupEmail: data.backupEmail || "",
        };
        break;
      case "notifications":
        updates["preferences.notifications"] = {
          ...DEFAULT_PREFERENCES.notifications,
          emailUpdates: data.emailUpdates === undefined ? true : Boolean(data.emailUpdates),
          productUpdates: data.productUpdates === undefined ? true : Boolean(data.productUpdates),
          jobAlerts: data.jobAlerts === undefined ? true : Boolean(data.jobAlerts),
          mentorReminders:
            data.mentorReminders === undefined ? true : Boolean(data.mentorReminders),
        };
        break;
      case "privacy":
        updates["preferences.privacy"] = {
          ...DEFAULT_PREFERENCES.privacy,
          profileVisibility: ["public", "community", "private"].includes(data.profileVisibility)
            ? data.profileVisibility
            : DEFAULT_PREFERENCES.privacy.profileVisibility,
          showSkills: data.showSkills === undefined ? true : Boolean(data.showSkills),
          showProjects: data.showProjects === undefined ? true : Boolean(data.showProjects),
          showActivity: data.showActivity === undefined ? false : Boolean(data.showActivity),
          allowMessages: data.allowMessages === undefined ? true : Boolean(data.allowMessages),
        };
        break;
      case "billing":
        updates["preferences.billing"] = {
          ...DEFAULT_PREFERENCES.billing,
          defaultPaymentMethod: data.defaultPaymentMethod || "card",
          sendInvoices: data.sendInvoices === undefined ? true : Boolean(data.sendInvoices),
          taxId: data.taxId || "",
        };
        break;
      default:
        break;
    }

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      { $set: updates },
      { new: true }
    )
      .select("preferences subscription")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Preferences updated",
      preferences: user?.preferences,
      subscription: user?.subscription || null,
    });
  } catch (error: any) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update preferences" },
      { status: 500 }
    );
  }
}
