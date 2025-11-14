import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";

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

    await connectDB();

    // Get user profile for filtering by preferred track
    const user = await User.findById(session.user.id).lean();
    const preferredTrack = user?.preferredTrack || "";

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const role = searchParams.get("role") || "";
    const remote = searchParams.get("remote") || "";
    const track = searchParams.get("track") || preferredTrack || "";

    // Fetch recruiter-posted jobs (approved only)
    const recruiterJobsQuery: any = {
      status: "active",
      approved: true,
    };

    if (track && track !== "all") {
      recruiterJobsQuery.track = track;
    }

    if (remote === "true") {
      recruiterJobsQuery.remote = true;
    } else if (remote === "onsite") {
      recruiterJobsQuery.remote = false;
    }

    if (search) {
      recruiterJobsQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const recruiterJobs = await Job.find(recruiterJobsQuery)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Transform recruiter jobs
    const transformedRecruiterJobs = recruiterJobs.map((job: any) => ({
      id: job._id.toString(),
      _id: job._id.toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      remote: job.remote || false,
      jobType: job.jobType || "Full-Time",
      description: job.description || "",
      requirements: job.requiredSkills || [],
      skills: job.requiredSkills || [],
      salary: job.salary,
      url: job.externalLink || "",
      postedDate: job.createdAt,
      createdAt: job.createdAt,
      source: "recruiter",
      track: job.track,
      approved: job.approved,
    }));

    // Fetch findwork.dev jobs
    let findworkJobs: any[] = [];
    let findworkPagination: any = null;

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (search) params.append("search", search);
      if (location) params.append("location", location);
      if (role && role !== "all") params.append("role", role);
      if (remote === "true") params.append("remote", "true");

      // Filter by track if specified (map our tracks to findwork.dev search terms)
      if (track && track !== "all") {
        const trackSearchMap: Record<string, string> = {
          "Frontend Development": "frontend developer",
          "Backend Development": "backend developer",
          "Full Stack Development": "full stack developer",
          "Mobile Development": "mobile developer",
          "Data Science": "data scientist",
          "Machine Learning": "machine learning engineer",
          "UI/UX Design": "ui ux designer",
          "Product Management": "product manager",
          "Digital Marketing": "digital marketer",
        };
        const searchTerm = trackSearchMap[track] || track.toLowerCase();
        if (!search) {
          params.append("search", searchTerm);
        }
      }

      const apiUrl = `${FINDWORK_API_URL}?${params.toString()}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${getFindworkApiToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        findworkJobs = (data.results || []).map((job: any) => ({
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

        findworkPagination = {
          page: parseInt(page.toString()),
          count: data.count || findworkJobs.length,
          next: data.next,
          previous: data.previous,
          total: data.count || findworkJobs.length,
        };
      }
    } catch (error) {
      console.error("Error fetching findwork.dev jobs:", error);
    }

    // Combine and sort jobs (recruiter jobs first, then findwork.dev)
    const allJobs = [...transformedRecruiterJobs, ...findworkJobs];

    // Apply additional client-side filtering if needed
    let filteredJobs = allJobs;
    if (location && location !== "all") {
      filteredJobs = filteredJobs.filter((job) =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sort by relevance (preferred track first, then by date)
    if (preferredTrack && preferredTrack !== "all") {
      filteredJobs.sort((a, b) => {
        const aMatchesTrack = a.track === preferredTrack || a.title?.toLowerCase().includes(preferredTrack.toLowerCase());
        const bMatchesTrack = b.track === preferredTrack || b.title?.toLowerCase().includes(preferredTrack.toLowerCase());
        
        if (aMatchesTrack && !bMatchesTrack) return -1;
        if (!aMatchesTrack && bMatchesTrack) return 1;
        
        // Then sort by date (newest first)
        const aDate = new Date(a.createdAt || a.postedDate).getTime();
        const bDate = new Date(b.createdAt || b.postedDate).getTime();
        return bDate - aDate;
      });
    } else {
      // Sort by date (newest first)
      filteredJobs.sort((a, b) => {
        const aDate = new Date(a.createdAt || a.postedDate).getTime();
        const bDate = new Date(b.createdAt || b.postedDate).getTime();
        return bDate - aDate;
      });
    }

    // Calculate match scores for jobs based on user profile
    const userSkills = user?.skills || [];
    const userTargetRoles = user?.targetRoles || [];

    const jobsWithScores = filteredJobs.map((job) => {
      let score = 0;
      const overlapSkills: string[] = [];
      const missingSkills: string[] = [];

      // Calculate skill match
      if (job.skills && job.skills.length > 0 && userSkills.length > 0) {
        job.skills.forEach((skill: string) => {
          const userHasSkill = userSkills.some(
            (us) => us.toLowerCase() === skill.toLowerCase()
          );
          if (userHasSkill) {
            overlapSkills.push(skill);
            score += 10;
          } else {
            missingSkills.push(skill);
          }
        });
      }

      // Boost score for matching track
      if (job.track === preferredTrack) {
        score += 20;
      }

      // Boost score for matching target roles
      if (userTargetRoles.length > 0 && job.title) {
        const jobTitleLower = job.title.toLowerCase();
        userTargetRoles.forEach((role) => {
          if (jobTitleLower.includes(role.toLowerCase())) {
            score += 15;
          }
        });
      }

      // Boost score for recruiter jobs (they're more relevant)
      if (job.source === "recruiter") {
        score += 5;
      }

      score = Math.min(100, score);

      return {
        ...job,
        matchScore: score,
        overlapSkills,
        missingSkills,
      };
    });

    // Sort by match score
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    // Pagination
    const limit = 20;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobsWithScores.slice(startIndex, startIndex + limit);
    const total = jobsWithScores.length;

    return NextResponse.json({
      jobs: paginatedJobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: startIndex + limit < total,
        hasPrevious: page > 1,
      },
      sources: {
        recruiter: transformedRecruiterJobs.length,
        findwork: findworkJobs.length,
        total: allJobs.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching unified jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error.message },
      { status: 500 }
    );
  }
}

