"use client";

import { Search, Star, Calendar, DollarSign, Award } from "lucide-react";

const mentors = [
  { name: "Sarah Ahmed", role: "Senior Frontend Developer", skills: ["React", "TypeScript"], rating: 4.9, sessions: 120, rate: 1500, available: true },
  { name: "Karim Hassan", role: "Full Stack Engineer", skills: ["Node.js", "MongoDB"], rating: 4.8, sessions: 95, rate: 2000, available: true },
  { name: "Nadia Khan", role: "UI/UX Designer", skills: ["Figma", "Design Systems"], rating: 4.7, sessions: 80, rate: 1200, available: false },
];

export default function MentorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find a Mentor</h1>
        <p className="text-gray-600 mt-2">Get 1-on-1 guidance from industry professionals</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by skill, role, or name..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {mentors.map((mentor, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600">
                {mentor.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                <p className="text-gray-600 mb-2">{mentor.role}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Star size={16} fill="currentColor" />
                    {mentor.rating}
                  </span>
                  <span className="text-gray-600">{mentor.sessions} sessions</span>
                  {mentor.available && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Available
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign size={18} />
                <span className="font-bold">৳{mentor.rate}/hour</span>
              </div>
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2">
                <Calendar size={18} />
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

