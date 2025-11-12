"use client";

import { FileText, Upload, Zap } from "lucide-react";

export default function CVAnalyzer() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-primary-50 rounded-full mb-6">
          <FileText size={48} className="text-primary-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          AI Resume Analyzer
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Upload your resume and get instant AI-powered analysis with suggestions 
          for improvement, keyword optimization, and ATS compatibility checks.
        </p>
        
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6 hover:border-primary-400 transition cursor-pointer">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            <span className="text-primary-600 font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            PDF, DOC, DOCX (max. 5MB)
          </p>
        </div>
        
        <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
          <Zap size={16} className="text-yellow-500" />
          <span>Get detailed feedback in seconds</span>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}

