"use client";

import { Map, BookOpen, Award, TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CareerRoadmap() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="py-12">
        <div className="text-center mb-8">
          <div className="inline-flex p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full mb-6 group hover:scale-110 transition-transform duration-300 animate-bounce-slow">
            <Map size={48} className="text-primary-600 group-hover:rotate-12 transition-transform" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            AI Career Roadmap Generator
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get a personalized, step-by-step career roadmap powered by AI. 
            Our system analyzes your current skills and target role to create 
            the perfect learning path.
          </p>
        </div>
        
        {/* Sample Roadmap Preview */}
        <div className="max-w-3xl mx-auto space-y-6 mb-8">
          {/* Stage 1 */}
          <div className={`flex gap-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`} style={{ transitionDelay: "0.1s" }}>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform animate-bounce-slow">
                1
              </div>
              <div className="w-0.5 h-full bg-gradient-to-b from-primary-300 to-coral-300 mt-2 animate-pulse-slow"></div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 mb-4 hover:shadow-lg transition-all duration-300 group border border-primary-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={20} className="text-primary-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition">Prerequisites</h4>
              </div>
              <p className="text-sm text-gray-600">
                Master the fundamentals: HTML, CSS, JavaScript basics
              </p>
              <div className="mt-3 text-xs text-primary-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
                Estimated: 4-6 weeks
              </div>
            </div>
          </div>
          
          {/* Stage 2 */}
          <div className={`flex gap-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`} style={{ transitionDelay: "0.3s" }}>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-coral-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform animate-bounce-slow" style={{ animationDelay: "0.2s" }}>
                2
              </div>
              <div className="w-0.5 h-full bg-gradient-to-b from-coral-300 to-primary-300 mt-2 animate-pulse-slow"></div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-coral-50 to-coral-100 rounded-xl p-6 mb-4 hover:shadow-lg transition-all duration-300 group border border-coral-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-coral-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-gray-900 group-hover:text-coral-600 transition">Core Skills</h4>
              </div>
              <p className="text-sm text-gray-600">
                React, Node.js, Database fundamentals, API design
              </p>
              <div className="mt-3 text-xs text-coral-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 bg-coral-600 rounded-full animate-pulse"></span>
                Estimated: 8-10 weeks
              </div>
            </div>
          </div>
          
          {/* Stage 3 */}
          <div className={`flex gap-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`} style={{ transitionDelay: "0.5s" }}>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform animate-bounce-slow" style={{ animationDelay: "0.4s" }}>
                3
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group border border-primary-200">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-primary-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition">Advanced & Projects</h4>
              </div>
              <p className="text-sm text-gray-600">
                Advanced patterns, testing, deployment, portfolio projects
              </p>
              <div className="mt-3 text-xs text-primary-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
                Estimated: 6-8 weeks
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/dashboard/roadmap"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-200 font-semibold group"
          >
            <Sparkles size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Generate My Roadmap</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

