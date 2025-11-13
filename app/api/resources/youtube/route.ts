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

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    // Get user preferences
    const searchQuery = user.preferredTrack || user.targetRoles?.[0] || "programming";
    const skills = user.skills || [];

    // Build search query
    const query = `${searchQuery} ${skills.slice(0, 2).join(" ")} tutorial`;

    // Fetch from FreeCodeCamp channel
    const freeCodeCampVideos = await fetchYouTubeVideos(
      YOUTUBE_API_KEY,
      "UC8butISFwT-Wl7EV0hUK0BQ", // FreeCodeCamp channel ID
      query
    );

    // Fetch from JavaScriptMastery channel
    const jsMasteryVideos = await fetchYouTubeVideos(
      YOUTUBE_API_KEY,
      "UCmXmlB4-HJytD7wek0U6BNg", // JavaScriptMastery channel ID
      query
    );

    // Combine and format results
    const courses = [
      ...freeCodeCampVideos.map((video) => ({
        ...video,
        channel: "FreeCodeCamp",
        channelId: "UC8butISFwT-Wl7EV0hUK0BQ",
      })),
      ...jsMasteryVideos.map((video) => ({
        ...video,
        channel: "JavaScriptMastery",
        channelId: "UCmXmlB4-HJytD7wek0U6BNg",
      })),
    ];

    const fallbackChannels = [];
    if (freeCodeCampVideos.some((video) => String(video.id).startsWith("mock-"))) {
      fallbackChannels.push("FreeCodeCamp");
    }
    if (jsMasteryVideos.some((video) => String(video.id).startsWith("mock-"))) {
      fallbackChannels.push("JavaScriptMastery");
    }

    return NextResponse.json({
      courses,
      metadata: {
        fallbackChannels,
        query,
      },
      message:
        fallbackChannels.length > 0
          ? `Showing cached videos for: ${fallbackChannels.join(", ")}.`
          : undefined,
    });
  } catch (error: any) {
    console.error("Error fetching YouTube courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error.message },
      { status: 500 }
    );
  }
}

async function fetchYouTubeVideos(
  apiKey: string,
  channelId: string,
  searchQuery: string
): Promise<any[]> {
  try {
    // First, search for videos in the channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&q=${encodeURIComponent(searchQuery)}&part=snippet&type=video&maxResults=10&order=relevance`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      if (searchResponse.status === 403) {
        console.warn(
          `YouTube API access issue (status 403) for channel ${channelId}. Falling back to mock data.`
        );
        return getMockYouTubeVideos(channelId);
      }
      throw new Error(`YouTube API error: ${searchResponse.status} ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Get video IDs
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");

    // Fetch detailed video information
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,contentDetails,statistics`;

    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      if (detailsResponse.status === 403) {
        console.warn(
          `YouTube API details access issue (status 403) for channel ${channelId}. Falling back to mock data.`
        );
        return getMockYouTubeVideos(channelId);
      }
      throw new Error(`YouTube API error: ${detailsResponse.status} ${detailsResponse.statusText}`);
    }

    const detailsData = await detailsResponse.json();

    // Format videos
    return detailsData.items.map((item: any) => {
      const duration = parseDuration(item.contentDetails.duration);
      return {
        id: item.id,
        videoId: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: duration, // in seconds
        durationFormatted: formatDuration(duration),
        viewCount: parseInt(item.statistics.viewCount || "0"),
        likeCount: parseInt(item.statistics.likeCount || "0"),
        url: `https://www.youtube.com/watch?v=${item.id}`,
      };
    });
  } catch (error: any) {
    console.warn(`Error fetching videos from channel ${channelId}:`, error?.message || error);
    // Return mock data if API fails
    return getMockYouTubeVideos(channelId);
  }
}

function parseDuration(duration: string): number {
  // Parse ISO 8601 duration (e.g., PT1H2M10S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function getMockYouTubeVideos(channelId: string): any[] {
  const isFreeCodeCamp = channelId === "UC8butISFwT-Wl7EV0hUK0BQ";
  
  if (isFreeCodeCamp) {
    return [
      {
        id: "mock-fcc-1",
        videoId: "jS4aFq5-91M",
        title: "JavaScript Full Course for Beginners",
        description: "Complete JavaScript course for absolute beginners",
        thumbnail: "https://via.placeholder.com/480x270?text=JavaScript+Course",
        channelTitle: "freeCodeCamp.org",
        publishedAt: new Date().toISOString(),
        duration: 10800, // 3 hours
        durationFormatted: "3:00:00",
        viewCount: 5000000,
        likeCount: 150000,
        url: "https://www.youtube.com/watch?v=jS4aFq5-91M",
      },
    ];
  } else {
    return [
      {
        id: "mock-jsm-1",
        videoId: "b9eMGE7QtTk",
        title: "React Tutorial for Beginners",
        description: "Learn React from scratch",
        thumbnail: "https://via.placeholder.com/480x270?text=React+Tutorial",
        channelTitle: "JavaScript Mastery",
        publishedAt: new Date().toISOString(),
        duration: 7200, // 2 hours
        durationFormatted: "2:00:00",
        viewCount: 2000000,
        likeCount: 80000,
        url: "https://www.youtube.com/watch?v=b9eMGE7QtTk",
      },
    ];
  }
}

