"use client";

import { useState, useEffect } from "react";
import { Search, Star, Calendar, DollarSign, Award, Filter } from "lucide-react";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, [verifiedOnly]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const url = verifiedOnly ? "/api/mentors?verified=true" : "/api/mentors";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors || []);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find a Mentor</h1>
        <p className="text-gray-600 mt-2">
          Get 1-on-1 guidance from industry professionals
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by skill, role, or name..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="font-semibold">Verified Only</span>
          </label>
        </div>
      </div>

      {/* Mentor Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600">
                  {mentor.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {mentor.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {mentor.roles?.[0] || "Professional Mentor"}
                      </p>
                    </div>
                    {mentor.verified && (
                      <Award size={20} className="text-blue-600" title="Verified" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Star size={16} fill="currentColor" />
                      {mentor.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      {mentor.sessionsCompleted} sessions
                    </span>
                    <span className="text-gray-600">
                      {mentor.yearsOfExperience} years exp.
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{mentor.bio}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.skills.slice(0, 5).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
                {mentor.skills.length > 5 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                    +{mentor.skills.length - 5} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign size={18} />
                  <span className="font-bold">৳{mentor.hourlyRate}/hour</span>
                </div>
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2">
                  <Calendar size={18} />
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchTerm ? "No mentors found" : "No mentors available yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Mentors will be available soon. Check back later!"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
