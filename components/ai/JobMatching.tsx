"use client";

import { Briefcase, Target, TrendingUp } from "lucide-react";

export default function JobMatching() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-primary-50 rounded-full mb-6">
          <Target size={48} className="text-primary-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          AI Job Matching
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Our advanced AI analyzes your profile, skills, and preferences to match you 
          with the perfect job opportunities. Every match comes with a clear explanation.
        </p>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-50 p-6 rounded-xl">
            <Target size={32} className="text-primary-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Smart Matching</h4>
            <p className="text-sm text-gray-600">
              AI-powered precision matching
            </p>
          </div>
          <div className="bg-coral-50 p-6 rounded-xl">
            <TrendingUp size={32} className="text-coral-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Career Growth</h4>
            <p className="text-sm text-gray-600">
              Opportunities aligned with goals
            </p>
          </div>
          <div className="bg-primary-50 p-6 rounded-xl">
            <Briefcase size={32} className="text-primary-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Transparent</h4>
            <p className="text-sm text-gray-600">
              Clear match explanations
            </p>
          </div>
        </div>
        
        <button className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition">
          Find My Perfect Jobs
        </button>
        
        <div className="mt-8 text-sm text-gray-500">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}

