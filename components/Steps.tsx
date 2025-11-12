"use client";

import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up in minutes with your email. No credit card required to start.",
    time: "2 mins",
  },
  {
    title: "Complete Your Profile",
    description: "Tell us about your skills, education, and career aspirations.",
    time: "5 mins",
  },
  {
    title: "Get Your Roadmap",
    description: "Receive a personalized learning path based on your goals.",
    time: "Instant",
  },
  {
    title: "Start Learning",
    description: "Access resources, practice interviews, and connect with mentors.",
    time: "Ongoing",
  },
];

export default function Steps() {
  return (
    <section className="py-20 bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple Steps to Get Started
          </h2>
          <p className="text-xl text-gray-600">
            Begin your career transformation journey today
          </p>
        </div>

        {/* Steps List */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-coral-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition transform hover:scale-105 shadow-lg shadow-primary-200 font-semibold text-lg">
              Get Started Free →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

