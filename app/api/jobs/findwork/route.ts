import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const FINDWORK_API_URL = "https://findwork.dev/api/jobs/";

function getFindworkApiToken(): string {
  const token = process.env.FINDWORK_API_TOKEN;
  if (!token) {
    throw new Error("FINDWORK_API_TOKEN environment variable is not set");
  }
  return token;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const role = searchParams.get("role") || "";
    const remote = searchParams.get("remote") || "";

    // Build query parameters for findwork.dev API
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (search) params.append("search", search);
    if (location) params.append("location", location);
    if (role) params.append("role", role);
    if (remote === "true") params.append("remote", "true");

    const apiUrl = `${FINDWORK_API_URL}?${params.toString()}`;

    console.log("Fetching from findwork.dev:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Token ${getFindworkApiToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Findwork API error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch jobs from findwork.dev", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform findwork.dev job format to our format
    const transformedJobs = (data.results || []).map((job: any) => ({
      id: job.id?.toString() || Math.random().toString(),
      _id: job.id?.toString() || Math.random().toString(),
      title: job.role || job.title || "Untitled Position",
      company: job.company_name || job.company || "Unknown Company",
      location: job.location || "Not specified",
      remote: job.remote === true || job.location?.toLowerCase().includes("remote"),
      jobType: job.employment_type || "Full-Time",
      description: job.description || job.summary || "",
      requirements: job.requirements || [],
      skills: job.keywords || [],
      salary: job.salary_min && job.salary_max
        ? {
            min: job.salary_min,
            max: job.salary_max,
            currency: job.salary_currency || "USD",
          }
        : undefined,
      url: job.url || job.link || "",
      postedDate: job.date_posted || new Date().toISOString(),
      createdAt: job.date_posted || new Date().toISOString(),
      source: "findwork.dev",
      externalId: job.id?.toString(),
    }));

    return NextResponse.json({
      jobs: transformedJobs,
      pagination: {
        page: parseInt(page),
        count: data.count || transformedJobs.length,
        next: data.next,
        previous: data.previous,
        total: data.count || transformedJobs.length,
      },
      source: "findwork.dev",
    });
  } catch (error: any) {
    console.error("Error fetching jobs from findwork.dev:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error.message },
      { status: 500 }
    );
  }
}

