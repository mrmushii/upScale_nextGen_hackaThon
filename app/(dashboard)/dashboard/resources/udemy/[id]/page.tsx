"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Loader2,
  GraduationCap,
  Award,
  Target,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface CourseDetails {
  id: string;
  title: string;
  instructor: string;
  instructorName: string;
  instructorJobTitle: string;
  instructorImage: string;
  instructorUrl: string;
  rating: number;
  numReviews: number;
  students: number;
  price: string;
  originalPrice?: string;
  thumbnail: string;
  url: string;
  description: string;
  fullDescription?: string;
  level: string;
  duration: string;
  language: string;
  category: string;
  subcategory: string;
  numLectures: number;
  numQuizzes: number;
  numPracticeTests: number;
  contentInfo: string;
  isPaid: boolean;
  created: string;
  lastUpdate: string;
  objectives?: string[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  targetAudiences?: string[];
  allInstructors?: Array<{
    name: string;
    display_name: string;
    job_title: string;
    image_100x100: string;
    url: string;
  }>;
}

export default function UdemyCourseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/resources/udemy/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch course details");
      }

      setCourse(data.course);
    } catch (err: any) {
      console.error("Error fetching course details:", err);
      setError(err.message || "Failed to load course details");
      toast.error(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (course?.url) {
      window.open(course.url, "_blank", "noopener,noreferrer");
      toast.success("Redirecting to Udemy...");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-700 mb-4">{error || "The course you're looking for doesn't exist."}</p>
          <Link
            href="/dashboard/resources?tab=udemy"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/resources?tab=udemy"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={20} />
        Back to Resources
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Thumbnail */}
          <div className="md:w-1/3">
            <div className="relative w-full h-64 md:h-full min-h-[300px]">
              <Image
                src={course.thumbnail || "/placeholder-course.png"}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Course Info */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                {course.category}
              </span>
              {course.subcategory && (
                <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {course.subcategory}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  {course.instructorImage ? (
                    <Image
                      src={course.instructorImage}
                      alt={course.instructor}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                      {course.instructor.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{course.instructor}</p>
                  {course.instructorJobTitle && (
                    <p className="text-sm text-gray-600">{course.instructorJobTitle}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{course.rating.toFixed(1)}</span>
                <span className="text-gray-600">({course.numReviews.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Users size={18} />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock size={18} />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <BookOpen size={18} />
                <span>{course.numLectures} lectures</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div>
                <span className="text-3xl font-bold text-primary-600">{course.price}</span>
                {course.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">{course.originalPrice}</span>
                )}
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {course.level}
              </span>
            </div>

            <button
              onClick={handleEnroll}
              className="w-full md:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-bold text-lg flex items-center justify-center gap-2"
            >
              <ExternalLink size={24} />
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {course.fullDescription || course.description}
              </p>
            </div>
          </div>

          {/* What You'll Learn */}
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target size={24} className="text-primary-600" />
                What You'll Learn
              </h2>
              <ul className="space-y-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{course.numLectures}</p>
                <p className="text-sm text-gray-600">Lectures</p>
              </div>
              {course.numQuizzes > 0 && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{course.numQuizzes}</p>
                  <p className="text-sm text-gray-600">Quizzes</p>
                </div>
              )}
              {course.numPracticeTests > 0 && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{course.numPracticeTests}</p>
                  <p className="text-sm text-gray-600">Practice Tests</p>
                </div>
              )}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{course.duration}</p>
                <p className="text-sm text-gray-600">Duration</p>
              </div>
            </div>
            {course.contentInfo && (
              <p className="mt-4 text-gray-600 text-sm">{course.contentInfo}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Course Statistics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-gray-600 text-sm">({course.numReviews.toLocaleString()})</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Students</p>
                <p className="font-semibold text-gray-900">{course.students.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Language</p>
                <p className="font-semibold text-gray-900">{course.language}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Level</p>
                <p className="font-semibold text-gray-900">{course.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-semibold text-gray-900">
                  {new Date(course.lastUpdate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Enroll Card */}
          <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-xl shadow-lg p-6 text-white">
            <div className="mb-4">
              <p className="text-3xl font-bold">{course.price}</p>
              {course.originalPrice && (
                <p className="text-lg line-through opacity-75">{course.originalPrice}</p>
              )}
            </div>
            <button
              onClick={handleEnroll}
              className="w-full px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-bold flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Enroll Now on Udemy
            </button>
            <p className="text-sm mt-4 opacity-90">
              30-day money-back guarantee • Lifetime access
            </p>
          </div>

          {/* Instructors */}
          {course.allInstructors && course.allInstructors.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Instructors</h3>
              <div className="space-y-4">
                {course.allInstructors.map((instructor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      {instructor.image_100x100 ? (
                        <Image
                          src={instructor.image_100x100}
                          alt={instructor.display_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                          {instructor.display_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{instructor.display_name}</p>
                      {instructor.job_title && (
                        <p className="text-sm text-gray-600">{instructor.job_title}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

