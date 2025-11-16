"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MockInterview from "@/components/ai/MockInterview";
import CVAnalyzer from "@/components/ai/CVAnalyzer";
import JobMatching from "@/components/ai/JobMatching";
import CareerRoadmap from "@/components/ai/CareerRoadmap";
import MentorSession from "@/components/ai/MentorSession";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FeaturesPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);

    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-coral-200 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-300 rounded-full blur-3xl opacity-10 animate-pulse-slow"></div>

      <Navbar />
      
      <div className="pt-24 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div 
            ref={headerRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 animate-fade-in">
              <Sparkles size={16} className="text-primary-600 animate-spin-slow" />
              <span className="text-sm font-medium text-gray-700">
                AI-Powered Solutions
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Transform Your Career with{" "}
              <span className="text-primary-600 relative inline-block">
                AI
                <svg 
                  className="absolute -bottom-2 left-0 w-full animate-draw-underline" 
                  height="12" 
                  viewBox="0 0 200 12" 
                  fill="none"
                >
                  <path 
                    d="M2 10C60 2 140 2 198 10" 
                    stroke="#f43f5e" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className="animate-draw-path"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our cutting-edge AI features designed to accelerate your career growth. 
              From personalized roadmaps to intelligent job matching, we've got you covered.
            </p>
          </div>

          {/* AI Features */}
          <div className="space-y-16">
            <div 
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[0] = el;
              }}
              className={`transition-all duration-1000 ${
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "0.1s" }}
            >
              <CareerRoadmap />
            </div>
            
            <div 
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[1] = el;
              }}
              className={`transition-all duration-1000 ${
                visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <MockInterview />
            </div>
            
            <div 
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[2] = el;
              }}
              className={`transition-all duration-1000 ${
                visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              <CVAnalyzer />
            </div>
            
            <div 
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[3] = el;
              }}
              className={`transition-all duration-1000 ${
                visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "0.4s" }}
            >
              <JobMatching />
            </div>
            
            <div 
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[4] = el;
              }}
              className={`transition-all duration-1000 ${
                visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "0.5s" }}
            >
              <MentorSession />
            </div>
          </div>

          {/* Enhanced CTA */}
          <div 
            className={`text-center mt-20 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white rounded-3xl p-12 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
              {/* Background gradient animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-coral-50 to-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-primary-100 rounded-full mb-6 animate-bounce-slow">
                  <Sparkles size={32} className="text-primary-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Transform Your Career?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                  Join thousands of job seekers who are already using our AI-powered platform 
                  to land their dream jobs faster.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/register"
                    className="group bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-200 font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/#pricing"
                    className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-primary-300 font-semibold"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

