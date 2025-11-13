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
  const [activeTab, setActiveTab] = useState<"all" | "udemy" | "youtube" | "suggested">("all");
  const [udemyCourses, setUdemyCourses] = useState<UdemyCourse[]>([]);
  const [youtubeCourses, setYoutubeCourses] = useState<YouTubeCourse[]>([]);
  const [suggestedCourses, setSuggestedCourses] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchAllCourses();
    fetchProgress();
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

      if (suggestedRes.ok) {
        const suggestedData = await suggestedRes.json();
        setSuggestedCourses(suggestedData.suggestions || null);
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

      // Update local progress state
      setProgress((prev) => ({
        ...prev,
        [course.id]: {
          ...prev[course.id],
          progress: progressValue,
          lastWatchedTimestamp: timestamp,
          completed: progressValue >= 90,
        },
      }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const getDisplayCourses = () => {
    if (activeTab === "udemy") return { udemy: udemyCourses, youtube: [] };
    if (activeTab === "youtube") return { udemy: [], youtube: youtubeCourses };
    if (activeTab === "suggested") {
      return {
        udemy: suggestedCourses?.udemyCourses || [],
        youtube: suggestedCourses?.youtubeCourses || [],
      };
    }
    return { udemy: udemyCourses, youtube: youtubeCourses };
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "all", label: "All Courses", icon: BookOpen },
          { id: "suggested", label: "Suggested", icon: TrendingUp },
          { id: "udemy", label: "Udemy", icon: GraduationCap },
          { id: "youtube", label: "YouTube", icon: Youtube },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
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
      {activeTab === "suggested" && suggestedCourses && (
        <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Based on Your Roadmap: {suggestedCourses.stageName}
          </h3>
          <p className="text-gray-700">{suggestedCourses.message}</p>
        </div>
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
                  // Update progress in database
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

