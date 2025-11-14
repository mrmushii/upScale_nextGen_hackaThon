"use client";

import { Briefcase, Target, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function JobMatching() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-gradient-to-br from-primary-50 to-coral-50 rounded-full mb-6 group hover:scale-110 transition-transform duration-300 animate-bounce-slow">
          <Target size={48} className="text-primary-600 group-hover:rotate-12 transition-transform" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          AI Job Matching
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          Our advanced AI analyzes your profile, skills, and preferences to match you 
          with the perfect job opportunities. Every match comes with a clear explanation.
        </p>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200 hover:shadow-lg transition-all duration-300 group ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.1s" }}>
            <Target size={32} className="text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform animate-bounce-slow" />
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">Smart Matching</h4>
            <p className="text-sm text-gray-600">
              AI-powered precision matching
            </p>
          </div>
          <div className={`bg-gradient-to-br from-coral-50 to-coral-100 p-6 rounded-xl border border-coral-200 hover:shadow-lg transition-all duration-300 group ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.2s" }}>
            <TrendingUp size={32} className="text-coral-600 mx-auto mb-3 group-hover:scale-110 transition-transform animate-bounce-slow" style={{ animationDelay: "0.1s" }} />
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-coral-600 transition">Career Growth</h4>
            <p className="text-sm text-gray-600">
              Opportunities aligned with goals
            </p>
          </div>
          <div className={`bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200 hover:shadow-lg transition-all duration-300 group ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.3s" }}>
            <Briefcase size={32} className="text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform animate-bounce-slow" style={{ animationDelay: "0.2s" }} />
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">Transparent</h4>
            <p className="text-sm text-gray-600">
              Clear match explanations
            </p>
          </div>
        </div>
        
        <Link 
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-200 font-semibold group"
        >
          <Sparkles size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          <span>Find My Perfect Jobs</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

