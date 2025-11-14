"use client";

import { BookOpen, Users, FileText, MessageSquare, Briefcase, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: BookOpen,
    title: "Smart Learning Resources",
    description: "Curated courses and materials matched to your skill gaps and learning style",
    badge: "AI-Powered",
  },
  {
    icon: Users,
    title: "Mock Interview Practice",
    description: "Practice with AI-driven interviews and get detailed feedback to improve",
    badge: "Interactive",
  },
  {
    icon: FileText,
    title: "Portfolio Builder",
    description: "Showcase your skills, projects, and achievements with a professional portfolio",
    badge: "Professional",
  },
  {
    icon: MessageSquare,
    title: "Community Q&A",
    description: "Learn from peers and mentors in an engaging community environment",
    badge: "Collaborative",
  },
  {
    icon: Briefcase,
    title: "Application Tracker",
    description: "Keep track of all your applications and follow-ups in one place",
    badge: "Organized",
  },
  {
    icon: Award,
    title: "Skill Certifications",
    description: "Earn verifiable badges and certificates as you complete milestones",
    badge: "Credible",
  },
];

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600">
            A comprehensive platform with all the tools for your career journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ 
                transitionDelay: `${index * 0.1}s`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon size={28} className="text-primary-600" />
                </div>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full group-hover:bg-primary-100 transition">
                  {feature.badge}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

