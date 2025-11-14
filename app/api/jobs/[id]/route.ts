import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { auth } from "@/auth";
import mongoose from "mongoose";

const FINDWORK_API_TOKEN = "c6dc3e4923b38120c5e2f14d4d55be3cd96e9f0a";
const FINDWORK_API_URL = "https://findwork.dev/api/jobs/";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Check if the ID is a valid MongoDB ObjectId
    // If not, it's likely a Findwork job ID, so skip database query
    const isValidObjectId = mongoose.Types.ObjectId.isValid(params.id);
    
    let job = null;
    if (isValidObjectId) {
      // First, try to find the job in our database (recruiter-posted jobs)
      job = await Job.findById(params.id).lean();
    }

    if (job) {
      // It's a recruiter-posted job
      return NextResponse.json({ 
        job: {
          ...job,
          source: "recruiter",
        }
      });
    }

    // If not found in DB (or ID is not a valid ObjectId), it might be a Findwork API job
    // Try to fetch from Findwork API
    try {
      const findworkResponse = await fetch(`${FINDWORK_API_URL}${params.id}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${FINDWORK_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (findworkResponse.ok) {
        const findworkJob = await findworkResponse.json();
        
        // Transform to our format
        const transformedJob = {
          id: findworkJob.id?.toString() || params.id,
          _id: findworkJob.id?.toString() || params.id,
          title: findworkJob.role || findworkJob.title || "Untitled Position",
          company: findworkJob.company_name || findworkJob.company || "Unknown Company",
          location: findworkJob.location || "Not specified",
          remote: findworkJob.remote === true || findworkJob.location?.toLowerCase().includes("remote"),
          jobType: findworkJob.employment_type || "Full-Time",
          description: findworkJob.description || findworkJob.summary || "",
          requirements: findworkJob.requirements || [],
          skills: findworkJob.keywords || [],
          salary: findworkJob.salary_min && findworkJob.salary_max
            ? {
                min: findworkJob.salary_min,
                max: findworkJob.salary_max,
                currency: findworkJob.salary_currency || "USD",
              }
            : undefined,
          url: findworkJob.url || findworkJob.link || "",
          postedDate: findworkJob.date_posted || new Date().toISOString(),
          createdAt: findworkJob.date_posted || new Date().toISOString(),
          source: "findwork.dev",
          externalId: findworkJob.id?.toString(),
        };

        return NextResponse.json({ job: transformedJob });
      }
    } catch (findworkError) {
      console.error("Error fetching from Findwork API:", findworkError);
      // Continue to return 404 if Findwork also fails
    }

    // If neither found, return 404
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const updates = body.updates || body;

    const job = await Job.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const job = await Job.findByIdAndDelete(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
