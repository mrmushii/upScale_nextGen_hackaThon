"use client";

import { Target, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "AI-Powered Skill Gap Analysis",
    description: "Get instant insights into your skill gaps with our intelligent radar system that maps your current skills against target roles.",
    color: "bg-primary-50",
    iconColor: "text-primary-600",
  },
  {
    icon: Zap,
    title: "Personalized Career Roadmaps",
    description: "Receive a customized, step-by-step roadmap tailored to your goals, experience, and learning pace.",
    color: "bg-coral-50",
    iconColor: "text-coral-600",
  },
  {
    icon: Shield,
    title: "Expert 1-on-1 Mentorship",
    description: "Connect with industry professionals for personalized guidance, mock interviews, and career advice.",
    color: "bg-primary-50",
    iconColor: "text-primary-600",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Job Matching",
    description: "Get matched with opportunities that truly fit your skills, with transparent explanations for every recommendation.",
    color: "bg-coral-50",
    iconColor: "text-coral-600",
  },
];

export default function WhyStandOut() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why We Stand Out
          </h2>
          <p className="text-xl text-gray-600">
            More than just a job board – a complete career readiness ecosystem designed for your success
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={32} className={feature.iconColor} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-coral-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

