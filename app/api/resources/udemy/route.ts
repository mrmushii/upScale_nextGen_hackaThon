import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user preferences for filtering
    const searchQuery = user.preferredTrack || user.targetRoles?.[0] || "programming";
    const skills = user.skills || [];

    // Build search terms from user preferences
    const searchTerms = [
      searchQuery,
      ...skills.slice(0, 3), // Use top 3 skills
    ].join(" ");

    // RapidAPI Udemy API configuration
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    const UDEMY_API_HOST = process.env.UDEMY_API_HOST || "udemy-api.p.rapidapi.com";

    if (!RAPIDAPI_KEY) {
      // Fallback to mock data if RapidAPI key is not configured
      console.warn("RAPIDAPI_KEY not configured. Using mock data.");
      return NextResponse.json({
        courses: getMockUdemyCourses(searchQuery, skills),
        message: "Using mock data. Configure RAPIDAPI_KEY for real Udemy courses.",
      });
    }

    try {
      // Fetch courses from RapidAPI Udemy API
      const courses = await fetchUdemyCoursesFromRapidAPI(
        RAPIDAPI_KEY,
        UDEMY_API_HOST,
        searchTerms
      );

      if (courses && courses.length > 0) {
        return NextResponse.json({ courses });
      } else {
        // If no courses found, return filtered mock data
        return NextResponse.json({
          courses: getMockUdemyCourses(searchQuery, skills),
          message: "No courses found from API. Showing mock data.",
        });
      }
    } catch (apiError: any) {
      console.error("RapidAPI error:", apiError);
      // Fallback to mock data on API error
      return NextResponse.json({
        courses: getMockUdemyCourses(searchQuery, skills),
        message: "API error. Using mock data as fallback.",
      });
    }
  } catch (error: any) {
    console.error("Error fetching Udemy courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error.message },
      { status: 500 }
    );
  }
}

async function fetchUdemyCoursesFromRapidAPI(
  apiKey: string,
  apiHost: string,
  searchQuery: string
): Promise<any[]> {
  try {
    const baseUrl = `https://${apiHost}`;
    const hasSearch = searchQuery.trim().length > 0;
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    const path = hasSearch ? `/search?s=${encodedQuery}` : `/?page=0`;

    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 429) {
        console.warn(
          `RapidAPI Udemy endpoint returned ${response.status} for query "${searchQuery}". Falling back to mock data.`
        );
        return [];
      }
      throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const results = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

    if (results.length === 0) {
      return [];
    }

    return results.map((course: any) => mapFreeUdemyCourse(course));
  } catch (error: any) {
    console.warn("Error fetching from RapidAPI:", error?.message || error);
    throw error;
  }
}

function transformCourseData(course: any): any {
  return mapFreeUdemyCourse(course);
}

function mapFreeUdemyCourse(course: any): any {
  const fallbackId = course.id?.toString() || course.sku?.toString();
  const thumbnail =
    course.pic ||
    course.image_480x270 ||
    course.image_750x422 ||
    "https://via.placeholder.com/480x270?text=Udemy";

  const rawDuration = Number(course.duration);
  const durationHours = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : undefined;
  const durationText = durationHours
    ? `${durationHours} hour${durationHours > 1 ? "s" : ""}`
    : course.content_length_video
    ? formatDuration(course.content_length_video)
    : "N/A";

  return {
    id: fallbackId || `udemy-${Date.now()}`,
    title: course.title || course.headline || "Untitled Course",
    instructor: course.instructor_name || "Udemy Instructor",
    rating: Number(course.rating) || 0,
    students: Number(course.num_subscribers || course.num_students || 0),
    price: "Free with coupon",
    originalPrice: formatPrice(course.org_price || course.price || course.price_detail?.amount || "0"),
    thumbnail,
    url: course.coupon || course.url || course.link || "#",
    description: course.desc_text || course.description || course.title || "No description available",
    level: course.category || course.level || "All Levels",
    duration: durationText,
    language: course.language || "English",
  };
}

function formatPrice(price: string | number | null): string {
  if (!price || price === "0" || price === 0) {
    return "Free";
  }
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice)) return "Free";
  return `$${numPrice.toFixed(2)}`;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : ""}`.trim();
  }
  return `${minutes} min${minutes > 1 ? "s" : ""}`;
}

function getMockUdemyCourses(searchQuery: string, skills: string[]): any[] {
  // Mock Udemy courses filtered by user preferences
  const allCourses = [
    {
      id: "udemy-1",
      title: "Complete React Developer Course 2024",
      instructor: "John Doe",
      rating: 4.6,
      students: 125000,
      price: "$89.99",
      originalPrice: "$199.99",
      thumbnail: "https://via.placeholder.com/480x270?text=React+Course",
      url: "https://www.udemy.com/course/react-complete-guide/",
      description: "Master React from scratch. Build real-world projects and learn modern React patterns.",
      level: "Beginner to Advanced",
      duration: "45 hours",
      language: "English",
    },
    {
      id: "udemy-2",
      title: "JavaScript: The Complete Guide",
      instructor: "Jane Smith",
      rating: 4.8,
      students: 250000,
      price: "$79.99",
      originalPrice: "$189.99",
      thumbnail: "https://via.placeholder.com/480x270?text=JavaScript+Course",
      url: "https://www.udemy.com/course/javascript-complete-guide/",
      description: "Learn JavaScript from fundamentals to advanced topics. ES6+, async/await, and more.",
      level: "Beginner to Advanced",
      duration: "60 hours",
      language: "English",
    },
    {
      id: "udemy-3",
      title: "Full Stack Web Development Bootcamp",
      instructor: "Mike Johnson",
      rating: 4.7,
      students: 180000,
      price: "$99.99",
      originalPrice: "$249.99",
      thumbnail: "https://via.placeholder.com/480x270?text=Full+Stack+Course",
      url: "https://www.udemy.com/course/full-stack-web-development/",
      description: "Build complete web applications with React, Node.js, MongoDB, and more.",
      level: "Intermediate",
      duration: "80 hours",
      language: "English",
    },
    {
      id: "udemy-4",
      title: "Node.js: Advanced Concepts",
      instructor: "Sarah Williams",
      rating: 4.5,
      students: 95000,
      price: "$69.99",
      originalPrice: "$179.99",
      thumbnail: "https://via.placeholder.com/480x270?text=Node.js+Course",
      url: "https://www.udemy.com/course/nodejs-advanced/",
      description: "Master Node.js backend development with Express, authentication, and APIs.",
      level: "Intermediate to Advanced",
      duration: "35 hours",
      language: "English",
    },
    {
      id: "udemy-5",
      title: "Python for Data Science and Machine Learning",
      instructor: "David Brown",
      rating: 4.9,
      students: 300000,
      price: "$89.99",
      originalPrice: "$199.99",
      thumbnail: "https://via.placeholder.com/480x270?text=Python+ML+Course",
      url: "https://www.udemy.com/course/python-data-science/",
      description: "Learn Python, pandas, numpy, matplotlib, and machine learning algorithms.",
      level: "Beginner to Advanced",
      duration: "100 hours",
      language: "English",
    },
  ];

  // Filter courses based on user preferences
  const queryLower = searchQuery.toLowerCase();
  const skillsLower = skills.map((s) => s.toLowerCase());

  return allCourses.filter((course) => {
    const titleLower = course.title.toLowerCase();
    const descLower = course.description.toLowerCase();

    return (
      titleLower.includes(queryLower) ||
      descLower.includes(queryLower) ||
      skillsLower.some((skill) => titleLower.includes(skill) || descLower.includes(skill))
    );
  });
}

