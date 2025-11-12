"use client";

import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Sparkles,
  Heart,
  Share2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // Mock job data
  const job = {
    id: params.id,
    title: "Frontend Developer",
    company: "Tech Solutions Ltd",
    location: "Dhaka, Bangladesh",
    remote: true,
    type: "Full-Time",
    salary: { min: 40000, max: 60000, currency: "BDT" },
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Git"],
    recommendedSkills: ["Node.js", "GraphQL"],
    match: 92,
    posted: "2 days ago",
    saved: false,
    description: `We are looking for a talented Frontend Developer to join our growing team. You will be responsible for building and maintaining user-facing features for our web applications.

## Responsibilities
- Develop new user-facing features using React and Next.js
- Build reusable components and front-end libraries
- Collaborate with designers to implement pixel-perfect UIs
- Optimize applications for maximum speed and scalability
- Participate in code reviews and team meetings

## Requirements
- 2+ years of experience with React
- Strong understanding of TypeScript
- Experience with modern CSS frameworks (Tailwind CSS preferred)
- Proficient with Git and version control
- Good communication skills in English`,
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Flexible working hours",
      "Remote work options",
      "Annual bonuses",
      "Learning & development budget",
    ],
  };

  // Calculate skill match
  const userSkills = ["React", "TypeScript", "Tailwind CSS", "Git"]; // Mock user skills
  const overlapSkills = job.requiredSkills.filter((skill) =>
    userSkills.includes(skill)
  );
  const missingSkills = job.requiredSkills.filter(
    (skill) => !userSkills.includes(skill)
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Jobs
      </Link>

      {/* Job Header */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-6">
              {/* Company Logo */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-600 flex-shrink-0">
                {job.company.charAt(0)}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <div className="text-xl text-gray-600 mb-4">{job.company}</div>

                {/* Job Meta */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <MapPin size={18} />
                    {job.location}
                    {job.remote && " (Remote)"}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase size={18} />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-2">
                    <DollarSign size={18} />
                    ৳{job.salary.min.toLocaleString()} - ৳
                    {job.salary.max.toLocaleString()}/mo
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    Posted {job.posted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold ${
                job.match >= 85
                  ? "bg-green-100 text-green-700"
                  : job.match >= 70
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              <Sparkles size={20} />
              {job.match}% Match
            </div>

            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold">
              Apply Now
              <ExternalLink size={18} />
            </button>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition font-semibold">
                <Heart size={18} />
                Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition font-semibold">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Match Analysis */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why You're a {job.match}% Match
            </h2>

            {/* Matching Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={20} className="text-green-600" />
                <h3 className="font-bold text-gray-900">
                  You have {overlapSkills.length} matching skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {overlapSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 size={14} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={20} className="text-orange-600" />
                  <h3 className="font-bold text-gray-900">
                    Skills to develop ({missingSkills.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold flex items-center gap-1"
                    >
                      <XCircle size={14} />
                      {skill}
                    </span>
                  ))}
                </div>
                <Link
                  href="/dashboard/roadmap"
                  className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                >
                  Add to learning roadmap
                  <ExternalLink size={16} />
                </Link>
              </div>
            )}

            {/* Recommended Skills */}
            {job.recommendedSkills && job.recommendedSkills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">
                  Nice to have (Bonus skills)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.recommendedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Job Description
            </h2>
            <div className="prose prose-primary max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: job.description.replace(/## /g, "<h3 class='font-bold text-xl mt-6 mb-3'>").replace(/\n/g, "<br />"),
                }}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Benefits & Perks
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {job.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl"
                >
                  <CheckCircle2 size={20} className="text-primary-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Apply */}
          <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-3xl p-6 text-white sticky top-6">
            <h3 className="text-xl font-bold mb-4">Ready to apply?</h3>
            <p className="text-white/90 mb-6 text-sm">
              Your profile is {job.match}% compatible with this role. Apply now to increase your chances!
            </p>
            <button className="w-full bg-white text-primary-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition mb-3">
              Apply with Upscale
            </button>
            <p className="text-xs text-white/80 text-center">
              Your profile and resume will be sent
            </p>
          </div>

          {/* Similar Jobs */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Similar Jobs</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Link
                  key={i}
                  href={`/dashboard/jobs/${i}`}
                  className="block p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition group"
                >
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600">
                    React Developer
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Tech Company Inc</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Remote</span>
                    <span className="font-semibold text-green-600">85% Match</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

