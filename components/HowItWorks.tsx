"use client";

import { UserPlus, Target, Rocket, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and tell us about your skills, experience, and career goals. Our AI analyzes your profile to understand your unique strengths.",
  },
  {
    icon: Target,
    step: "02",
    title: "Get Your Roadmap",
    description: "Receive a personalized career roadmap with skill gap analysis, curated resources, and clear milestones to achieve your goals.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Learn & Practice",
    description: "Access tailored learning resources, practice with AI mock interviews, and connect with expert mentors for 1-on-1 guidance.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Land Your Dream Job",
    description: "Build your portfolio, get matched with relevant opportunities, track applications, and secure interviews with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Four simple steps to transform your career
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-300 to-coral-300"></div>
              )}

              {/* Card */}
              <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl group">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="inline-flex p-4 bg-primary-50 rounded-xl mb-4 group-hover:bg-primary-100 transition">
                  <item.icon size={32} className="text-primary-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

