"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, DollarSign, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BookMentorSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    meetingLink: "",
  });

  useEffect(() => {
    fetchMentor();
  }, []);

  const fetchMentor = async () => {
    try {
      const response = await fetch(`/api/mentors/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setMentor(data.mentor);
      }
    } catch (error) {
      console.error("Error fetching mentor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      const response = await fetch("/api/mentors/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: params.id,
          topic: formData.topic,
          description: formData.description,
          scheduledDate: scheduledDateTime.toISOString(),
          duration: formData.duration,
          meetingLink: formData.meetingLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Session booked successfully!");
        setTimeout(() => {
          router.push("/dashboard/mentors/my-sessions");
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || "Failed to book session"}`);
      }
    } catch (error) {
      console.error("Error booking session:", error);
      setMessage("❌ Error booking session");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total cost
  const totalCost = mentor
    ? (mentor.hourlyRate * formData.duration) / 60
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor details...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Mentor not found</h2>
        <Link href="/dashboard/mentors" className="text-primary-600 hover:underline mt-4 inline-block">
          ← Back to Mentors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <Link
        href="/dashboard/mentors"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Mentors
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-600">
            {mentor.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Session with {mentor.name}</h1>
            <p className="text-gray-600 mb-4">{mentor.bio}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign size={18} />
                <span className="font-bold">৳{mentor.hourlyRate}/hour</span>
              </div>
              <div className="text-gray-600">
                {mentor.sessionsCompleted} sessions completed
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl mb-6 ${
              message.includes("✅")
                ? "bg-green-50 text-green-700 border-2 border-green-200"
                : "bg-red-50 text-red-700 border-2 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Session Topic *
            </label>
            <input
              type="text"
              required
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Resume Review, Mock Interview, Career Guidance"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What would you like to discuss in this session?"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration (minutes) *
            </label>
            <select
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meeting Link (Optional)
            </label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              placeholder="https://meet.google.com/..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Leave empty if you want the mentor to provide the meeting link
            </p>
          </div>

          {/* Cost Summary */}
          <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Session Cost</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-700">
                <span>Hourly Rate:</span>
                <span className="font-semibold">৳{mentor.hourlyRate}/hour</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span>Duration:</span>
                <span className="font-semibold">{formData.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between text-gray-700 pt-2 border-t-2 border-primary-200">
                <span className="font-bold text-lg">Total Cost:</span>
                <span className="font-bold text-2xl text-primary-600">৳{totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-coral-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Confirm Booking
                </>
              )}
            </button>
            <Link
              href="/dashboard/mentors"
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

