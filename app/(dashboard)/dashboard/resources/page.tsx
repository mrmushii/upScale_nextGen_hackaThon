"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Play,
  ExternalLink,
  Clock,
  Users,
  Star,
  TrendingUp,
  Youtube,
  GraduationCap,
  CheckCircle2,
  Loader2,
  Search,
  Bookmark,
  BookmarkCheck,
  History,
  Map,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import YouTubePlayer from "@/components/resources/YouTubePlayer";

interface UdemyCourse {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
  originalPrice?: string;
  thumbnail: string;
  url: string;
  description: string;
  level: string;
  duration: string;
  language: string;
}

interface YouTubeCourse {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channel: string;
  duration: number;
  durationFormatted: string;
  viewCount: number;
  likeCount: number;
  url: string;
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "udemy" | "youtube" | "suggested" | "bookmarks" | "history">("all");
  const [udemyCourses, setUdemyCourses] = useState<UdemyCourse[]>([]);
  const [youtubeCourses, setYoutubeCourses] = useState<YouTubeCourse[]>([]);
  const [suggestedCourses, setSuggestedCourses] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
    fetchAllCourses();
    fetchProgress();
    fetchBookmarks();
    fetchHistory();
    fetchRoadmap();

    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab && ["all", "udemy", "youtube", "suggested", "bookmarks", "history"].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, []);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const [udemyRes, youtubeRes, suggestedRes] = await Promise.all([
        fetch("/api/resources/udemy"),
        fetch("/api/resources/youtube"),
        fetch("/api/resources/suggest"),
      ]);

      if (udemyRes.ok) {
        const udemyData = await udemyRes.json();
        setUdemyCourses(udemyData.courses || []);
      }

      if (youtubeRes.ok) {
        const youtubeData = await youtubeRes.json();
        setYoutubeCourses(youtubeData.courses || []);
      }

      // Only fetch suggestions if profile is complete (this requires completion)
      try {
        const suggestedRes = await fetch("/api/resources/suggest");
        if (suggestedRes.ok) {
          const suggestedData = await suggestedRes.json();
          setSuggestedCourses(suggestedData.suggestions || null);
        } else if (suggestedRes.status === 403) {
          // Profile incomplete - suggestions not available
          setSuggestedCourses(null);
        }
      } catch (error) {
        // Silently fail if profile incomplete - suggestions tab will show message
        console.log("Suggestions not available - profile may be incomplete");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/resources/progress");
      if (res.ok) {
        const data = await res.json();
        const progressMap: Record<string, any> = {};
        data.progress.forEach((p: any) => {
          progressMap[p.courseId] = p;
        });
        setProgress(progressMap);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/resources/bookmarks");
      if (res.ok) {
        const data = await res.json();
        const bookmarkMap: Record<string, boolean> = {};
        data.bookmarks.forEach((b: any) => {
          bookmarkMap[b.courseId] = true;
        });
        setBookmarks(bookmarkMap);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/resources/history");
      if (res.ok) {
        const data = await res.json();
        setWatchHistory(data.history || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const fetchRoadmap = async () => {
    try {
      const res = await fetch("/api/roadmap");
      if (res.ok) {
        const data = await res.json();
        if (data.roadmaps && data.roadmaps.length > 0) {
          setRoadmap(data.roadmaps[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    }
  };

  const handleVideoSelect = (course: YouTubeCourse) => {
    setSelectedVideo(course);
  };

  const handleProgressUpdate = async (courseId: string, progressValue: number, timestamp: number) => {
    const course = selectedVideo || youtubeCourses.find((c) => c.id === courseId);
    if (!course) return;

    try {
      await fetch("/api/resources/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          courseType: "youtube",
          courseTitle: course.title,
          courseThumbnail: course.thumbnail,
          videoId: course.videoId,
          progress: progressValue,
          lastWatchedTimestamp: timestamp,
          duration: course.duration,
        }),
      });

      setProgress((prev) => ({
        ...prev,
        [course.id]: {
          ...prev[course.id],
          progress: progressValue,
          lastWatchedTimestamp: timestamp,
          completed: progressValue >= 90,
        },
      }));

      // Refresh history
      fetchHistory();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const toggleBookmark = async (course: UdemyCourse | YouTubeCourse, courseType: "udemy" | "youtube") => {
    const isBookmarked = bookmarks[course.id];
    
    try {
      const res = await fetch("/api/resources/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          courseType,
          courseTitle: course.title,
          courseThumbnail: course.thumbnail,
          videoId: courseType === "youtube" ? (course as YouTubeCourse).videoId : undefined,
          url: courseType === "udemy" ? (course as UdemyCourse).url : (course as YouTubeCourse).url,
          action: isBookmarked ? "remove" : "add",
        }),
      });

      if (res.ok) {
        setBookmarks((prev) => ({
          ...prev,
          [course.id]: !isBookmarked,
        }));
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const filterCourses = (courses: any[], query: string) => {
    if (!query.trim()) return courses;
    const lowerQuery = query.toLowerCase();
    return courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(lowerQuery) ||
        course.description?.toLowerCase().includes(lowerQuery) ||
        course.instructor?.toLowerCase().includes(lowerQuery) ||
        course.channel?.toLowerCase().includes(lowerQuery)
    );
  };

  const getDisplayCourses = () => {
    if (activeTab === "udemy") {
      return { udemy: filterCourses(udemyCourses, searchQuery), youtube: [] };
    }
    if (activeTab === "youtube") {
      return { udemy: [], youtube: filterCourses(youtubeCourses, searchQuery) };
    }
    if (activeTab === "suggested") {
      return {
        udemy: filterCourses(suggestedCourses?.udemyCourses || [], searchQuery),
        youtube: filterCourses(suggestedCourses?.youtubeCourses || [], searchQuery),
      };
    }
    if (activeTab === "bookmarks") {
      const bookmarkedUdemy = udemyCourses.filter((c) => bookmarks[c.id]);
      const bookmarkedYoutube = youtubeCourses.filter((c) => bookmarks[c.id]);
      return {
        udemy: filterCourses(bookmarkedUdemy, searchQuery),
        youtube: filterCourses(bookmarkedYoutube, searchQuery),
      };
    }
    if (activeTab === "history") {
      // Convert history to course format
      const historyUdemy: UdemyCourse[] = [];
      const historyYoutube: YouTubeCourse[] = [];
      
      watchHistory.forEach((h) => {
        if (h.courseType === "udemy") {
          historyUdemy.push({
            id: h.courseId,
            title: h.courseTitle,
            instructor: "Unknown",
            rating: 0,
            students: 0,
            price: "N/A",
            thumbnail: h.courseThumbnail || "",
            url: "#",
            description: "",
            level: "All Levels",
            duration: "N/A",
            language: "English",
          });
        } else {
          historyYoutube.push({
            id: h.courseId,
            videoId: h.videoId || "",
            title: h.courseTitle,
            description: "",
            thumbnail: h.courseThumbnail || "",
            channelTitle: "",
            channel: "YouTube",
            duration: h.duration || 0,
            durationFormatted: formatDuration(h.duration || 0),
            viewCount: 0,
            likeCount: 0,
            url: `https://www.youtube.com/watch?v=${h.videoId}`,
          });
        }
      });
      
      return {
        udemy: filterCourses(historyUdemy, searchQuery),
        youtube: filterCourses(historyYoutube, searchQuery),
      };
    }
    return {
      udemy: filterCourses(udemyCourses, searchQuery),
      youtube: filterCourses(youtubeCourses, searchQuery),
    };
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const displayCourses = getDisplayCourses();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="text-primary-600" size={36} />
          Learning Resources
        </h1>
        <p className="text-gray-600 mt-2">
          Discover courses tailored to your preferences and roadmap
        </p>
      </div>

      {/* Roadmap Connection */}
      {roadmap && (
        <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl p-6 border-2 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Map className="text-primary-600" size={24} />
                Your Active Roadmap: {roadmap.targetRole}
              </h3>
              <p className="text-gray-700">
                Current Stage: {roadmap.stages?.find((s: any) => !s.completed)?.name || "All stages completed"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Progress: {roadmap.progress}% • {roadmap.stages?.filter((s: any) => s.completed).length || 0}/{roadmap.stages?.length || 0} stages complete
              </p>
            </div>
            <Link
              href={`/dashboard/learn/${roadmap._id}`}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
            >
              <LinkIcon size={20} />
              Continue Learning
            </Link>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search courses by title, description, instructor, or channel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: "all", label: "All Courses", icon: BookOpen },
          { id: "suggested", label: "Suggested", icon: TrendingUp },
          { id: "udemy", label: "Udemy", icon: GraduationCap },
          { id: "youtube", label: "YouTube", icon: Youtube },
          { id: "bookmarks", label: "Bookmarks", icon: BookmarkCheck },
          { id: "history", label: "History", icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Suggested Courses Info */}
      {activeTab === "suggested" && (
        <>
          {suggestedCourses ? (
            <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Based on Your Roadmap: {suggestedCourses.stageName}
              </h3>
              <p className="text-gray-700">{suggestedCourses.message}</p>
            </div>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Complete Your Profile to Get Personalized Suggestions
              </h3>
              <p className="text-gray-700 mb-4">
                To receive course suggestions based on your roadmap, please complete your profile first.
              </p>
              <Link
                href="/dashboard/profile/complete"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Complete Profile
              </Link>
            </div>
          )}
        </>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedVideo.title}</h2>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <YouTubePlayer
                videoId={selectedVideo.videoId}
                courseId={selectedVideo.id}
                courseTitle={selectedVideo.title}
                courseThumbnail={selectedVideo.thumbnail}
                duration={selectedVideo.duration}
                initialProgress={progress[selectedVideo.id]?.progress || 0}
                initialTimestamp={progress[selectedVideo.id]?.lastWatchedTimestamp || 0}
                onProgressUpdate={(prog, timestamp) => {
                  handleProgressUpdate(selectedVideo.id, prog, timestamp);
                }}
              />

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 text-sm line-clamp-3">{selectedVideo.description}</p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {selectedVideo.viewCount.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {selectedVideo.durationFormatted}
                  </span>
                  <span className="flex items-center gap-1">
                    <Youtube size={16} />
                    {selectedVideo.channel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Udemy Courses */}
      {displayCourses.udemy.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <GraduationCap className="text-primary-600" size={28} />
            Udemy Courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.udemy.map((course: UdemyCourse) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleBookmark(course, "udemy")}
                    className="absolute top-2 left-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-lg transition"
                  >
                    {bookmarks[course.id] ? (
                      <BookmarkCheck size={20} className="text-yellow-400" />
                    ) : (
                      <Bookmark size={20} className="text-white" />
                    )}
                  </button>
                  {progress[course.id]?.completed && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Completed
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {course.students.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">{course.price}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {course.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {progress[course.id] && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress[course.id].progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all"
                          style={{ width: `${progress[course.id].progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                  >
                    View on Udemy
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YouTube Courses */}
      {displayCourses.youtube.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Youtube className="text-red-600" size={28} />
            YouTube Courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.youtube.map((course: YouTubeCourse) => {
              const courseProgress = progress[course.id];
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => handleVideoSelect(course)}
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(course, "youtube");
                      }}
                      className="absolute top-2 left-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-lg transition z-10"
                    >
                      {bookmarks[course.id] ? (
                        <BookmarkCheck size={20} className="text-yellow-400" />
                      ) : (
                        <Bookmark size={20} className="text-white" />
                      )}
                    </button>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition flex items-center justify-center">
                      <Play size={48} className="text-white opacity-0 hover:opacity-100 transition" />
                    </div>
                    {courseProgress?.completed && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Completed
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {course.durationFormatted}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Youtube size={16} className="text-red-600" />
                        {course.channel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {course.viewCount.toLocaleString()} views
                      </span>
                    </div>

                    {courseProgress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(courseProgress.progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-red-600 rounded-full transition-all"
                            style={{ width: `${courseProgress.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                      Watch Course
                      <Play size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {displayCourses.udemy.length === 0 && displayCourses.youtube.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courses Found</h3>
          <p className="text-gray-600 mb-8">
            {activeTab === "suggested"
              ? "Generate a roadmap to get personalized course suggestions."
              : activeTab === "bookmarks"
              ? "You haven't bookmarked any courses yet."
              : activeTab === "history"
              ? "You haven't watched any courses yet."
              : searchQuery
              ? "No courses match your search query."
              : "Try adjusting your preferences or check back later for new courses."}
          </p>
          {activeTab === "suggested" && (
            <Link
              href="/dashboard/roadmap"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Generate Roadmap
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
