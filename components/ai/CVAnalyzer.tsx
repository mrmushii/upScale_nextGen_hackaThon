"use client";

import { FileText, Upload, Zap, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CVAnalyzer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-gradient-to-br from-primary-50 to-coral-50 rounded-full mb-6 group hover:scale-110 transition-transform duration-300 animate-bounce-slow">
          <FileText size={48} className="text-primary-600 group-hover:rotate-12 transition-transform" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          AI Resume Analyzer
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          Upload your resume and get instant AI-powered analysis with suggestions 
          for improvement, keyword optimization, and ATS compatibility checks.
        </p>
        
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-12 mb-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
            isHovered 
              ? "border-primary-400 bg-primary-50 scale-105" 
              : "border-gray-300 bg-gray-50"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-primary-100 to-coral-100 opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}></div>
          <div className="relative z-10">
            <Upload 
              size={48} 
              className={`mx-auto mb-4 transition-all duration-300 ${
                isHovered ? "text-primary-600 scale-110" : "text-gray-400"
              }`}
            />
            <p className="text-gray-600 mb-2 font-medium">
              <span className="text-primary-600 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOC, DOCX (max. 5MB)
            </p>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
          <div className={`flex flex-col items-center p-3 bg-primary-50 rounded-lg transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.1s" }}>
            <CheckCircle2 size={20} className="text-primary-600 mb-1" />
            <p className="text-xs font-semibold text-gray-700">ATS Check</p>
          </div>
          <div className={`flex flex-col items-center p-3 bg-coral-50 rounded-lg transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.2s" }}>
            <Sparkles size={20} className="text-coral-600 mb-1" />
            <p className="text-xs font-semibold text-gray-700">AI Analysis</p>
          </div>
          <div className={`flex flex-col items-center p-3 bg-primary-50 rounded-lg transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.3s" }}>
            <Zap size={20} className="text-primary-600 mb-1" />
            <p className="text-xs font-semibold text-gray-700">Instant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 justify-center text-sm text-gray-600 mb-6">
          <Zap size={16} className="text-yellow-500 animate-pulse" />
          <span className="font-medium">Get detailed feedback in seconds</span>
        </div>

        <Link 
          href="/dashboard/cv-analyzer"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-200 font-semibold group"
        >
          <FileText size={18} />
          <span>Analyze My Resume</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}

