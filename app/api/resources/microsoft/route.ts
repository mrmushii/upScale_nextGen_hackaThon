import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

interface MicrosoftCourse {
  id: string;
  title: string;
  description: string;
  url: string;
  duration?: string;
  products?: string[];
  roles?: string[];
  levels?: string[];
  type?: string;
  thumbnail?: string;
}

const MICROSOFT_API_BASE = "https://learn.microsoft.com/api/catalog/";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    // Check for both 'search' (from skill gap suggestions) and 'query' (from general browsing)
    const searchParam = searchParams.get("search") || searchParams.get("query");

    // If search parameter is provided (from skill gap suggestions), use it
    // Otherwise, fall back to user preferences
    const baseQuery =
      searchParam ||
      user.preferredTrack ||
      user.targetRoles?.[0] ||
      (Array.isArray(user.skills) && user.skills.length ? user.skills[0] : "") ||
      "developer";

    // For skill gap suggestions, don't use user's existing skills as secondary query
    // Only use secondary query when browsing general resources
    const secondaryQuery = searchParam
      ? "" // Don't filter by user skills when searching for missing skills
      : user.skills?.slice(0, 3).join(" ") ||
        user.preferredTrack ||
        "";
    
    if (searchParam) {
      console.log("Microsoft API - Using missing skill for search:", searchParam);
    } else {
      console.log("Microsoft API - Using user preferences for search:", baseQuery);
    }

    const courses = await fetchMicrosoftCourses(baseQuery, secondaryQuery);

    if (courses.length === 0) {
      return NextResponse.json({
        courses: getMockMicrosoftCourses(baseQuery),
        message:
          "No Microsoft Learn results found for your profile. Showing curated recommendations instead.",
      });
    }

    return NextResponse.json({
      courses,
      metadata: {
        query: baseQuery,
        secondaryQuery,
      },
    });
  } catch (error: any) {
    console.warn("Microsoft Learn API error:", error?.message || error);
    return NextResponse.json(
      {
        courses: getMockMicrosoftCourses("developer"),
        message:
          "Unable to reach Microsoft Learn catalog right now. Displaying curated recommendations.",
      },
      { status: 200 }
    );
  }
}

async function fetchMicrosoftCourses(
  primaryQuery: string,
  secondaryQuery: string
): Promise<MicrosoftCourse[]> {
  try {
    const url = new URL(MICROSOFT_API_BASE);
    if (primaryQuery) {
      url.searchParams.set("search", primaryQuery);
    }
    if (secondaryQuery) {
      url.searchParams.set("facetFilter", secondaryQuery);
    }
    url.searchParams.set("locale", "en-us");
    url.searchParams.set("learningPaths", "true");
    url.searchParams.set("modules", "true");
    url.searchParams.set("pageSize", "20");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "UpscalePlatform/1.0 (+https://upscale.local)",
      },
    });

    if (!response.ok) {
      console.warn(
        `Microsoft Learn API returned ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    const items: any[] =
      data?.modules ||
      data?.learningPaths ||
      data?.results ||
      data?.items ||
      [];

    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    return items.slice(0, 30).map((item) => ({
      id: String(item.uid || item.id || item.slug || item.title),
      title: item.title || item.name || "Microsoft Learn Module",
      description:
        item.summary ||
        item.description ||
        "Learn with Microsoft official guided material.",
      url:
        item.urls?.length > 0
          ? item.urls[0]?.url
          : item.url ||
            `https://learn.microsoft.com/training/${item.slug || ""}`,
      duration: formatDuration(item.durationInMinutes || item.duration),
      products: normalizeArray(item.products),
      roles: normalizeArray(item.roles),
      levels: normalizeArray(item.levels || item.level),
      type: item.type || (item.learningContentType === "module" ? "Module" : undefined),
      thumbnail:
        item.thumbnailUrl ||
        item.iconUrl ||
        "https://learn.microsoft.com/favicon.ico",
    }));
  } catch (error) {
    console.warn("Error fetching Microsoft courses:", error);
    return [];
  }
}

function normalizeArray(value: any): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function formatDuration(duration: any): string | undefined {
  const minutes = Number(duration);
  if (!minutes || Number.isNaN(minutes)) {
    return undefined;
  }

  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs} hr${hrs > 1 ? "s" : ""}${mins ? ` ${mins} min` : ""}`;
  }

  return `${minutes} min`;
}

function getMockMicrosoftCourses(query: string): MicrosoftCourse[] {
  const topic = capitalize(query || "developer");

  return [
    {
      id: "mslearn-azure-dev-1",
      title: `${topic} Fundamentals Microsoft Learn Path`,
      description:
        "Learn the core concepts, hands-on labs, and best practices to start building with Microsoft technologies.",
      url: "https://learn.microsoft.com/training/paths/azure-fundamentals/",
      duration: "4 hrs",
      products: ["Azure"],
      roles: ["Developer"],
      levels: ["Beginner"],
      type: "Learning Path",
      thumbnail: "https://learn.microsoft.com/favicon.ico",
    },
    {
      id: "mslearn-azure-dev-2",
      title: `Build ${topic} solutions with Azure services`,
      description:
        "Follow guided modules to design, implement, and deploy scalable cloud-native applications.",
      url: "https://learn.microsoft.com/training/modules/create-serverless-logic-with-azure-functions/",
      duration: "45 min",
      products: ["Azure Functions"],
      roles: ["Developer"],
      levels: ["Intermediate"],
      type: "Module",
      thumbnail: "https://learn.microsoft.com/favicon.ico",
    },
    {
      id: "mslearn-azure-dev-3",
      title: `Secure your ${topic} workloads with Microsoft Entra ID`,
      description:
        "Learn how to integrate authentication and authorization into your applications using Microsoft Entra ID.",
      url: "https://learn.microsoft.com/training/modules/secure-app-with-microsoft-entra/",
      duration: "55 min",
      products: ["Microsoft Entra ID"],
      roles: ["Developer", "Security Engineer"],
      levels: ["Intermediate"],
      type: "Module",
      thumbnail: "https://learn.microsoft.com/favicon.ico",
    },
  ];
}

function capitalize(value: string): string {
  if (!value) return "Developer";
  return value.charAt(0).toUpperCase() + value.slice(1);
}


