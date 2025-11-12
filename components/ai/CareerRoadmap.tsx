"use client";

import { Map, BookOpen, Award, TrendingUp } from "lucide-react";

export default function CareerRoadmap() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="py-12">
        <div className="text-center mb-8">
          <div className="inline-flex p-6 bg-primary-50 rounded-full mb-6">
            <Map size={48} className="text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            AI Career Roadmap Generator
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get a personalized, step-by-step career roadmap powered by AI. 
            Our system analyzes your current skills and target role to create 
            the perfect learning path.
          </p>
        </div>
        
        {/* Sample Roadmap Preview */}
        <div className="max-w-3xl mx-auto space-y-6 mb-8">
          {/* Stage 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="w-0.5 h-full bg-primary-300 mt-2"></div>
            </div>
            <div className="flex-1 bg-primary-50 rounded-xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={20} className="text-primary-600" />
                <h4 className="font-bold text-gray-900">Prerequisites</h4>
              </div>
              <p className="text-sm text-gray-600">
                Master the fundamentals: HTML, CSS, JavaScript basics
              </p>
              <div className="mt-3 text-xs text-primary-600 font-semibold">
                Estimated: 4-6 weeks
              </div>
            </div>
          </div>
          
          {/* Stage 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-coral-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="w-0.5 h-full bg-coral-300 mt-2"></div>
            </div>
            <div className="flex-1 bg-coral-50 rounded-xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-coral-600" />
                <h4 className="font-bold text-gray-900">Core Skills</h4>
              </div>
              <p className="text-sm text-gray-600">
                React, Node.js, Database fundamentals, API design
              </p>
              <div className="mt-3 text-xs text-coral-600 font-semibold">
                Estimated: 8-10 weeks
              </div>
            </div>
          </div>
          
          {/* Stage 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
            <div className="flex-1 bg-primary-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-primary-600" />
                <h4 className="font-bold text-gray-900">Advanced & Projects</h4>
              </div>
              <p className="text-sm text-gray-600">
                Advanced patterns, testing, deployment, portfolio projects
              </p>
              <div className="mt-3 text-xs text-primary-600 font-semibold">
                Estimated: 6-8 weeks
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition">
            Generate My Roadmap
          </button>
          
          <div className="mt-8 text-sm text-gray-500">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

