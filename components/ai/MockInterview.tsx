"use client";

import { MessageSquare, Mic, Video, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MockInterview() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-gradient-to-br from-primary-50 to-coral-50 rounded-full mb-6 group hover:scale-110 transition-transform duration-300 animate-bounce-slow">
          <Video size={48} className="text-primary-600 group-hover:scale-110 transition-transform" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          AI Mock Interview
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          Practice interviews with our AI interviewer. Get real-time feedback on your responses, 
          body language, and communication skills.
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className={`bg-primary-50 p-4 rounded-xl border border-primary-200 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.1s" }}>
            <Zap size={24} className="text-primary-600 mx-auto mb-2 animate-pulse-slow" />
            <p className="text-sm font-semibold text-gray-900">Real-time Feedback</p>
          </div>
          <div className={`bg-coral-50 p-4 rounded-xl border border-coral-200 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.2s" }}>
            <Sparkles size={24} className="text-coral-600 mx-auto mb-2 animate-spin-slow" />
            <p className="text-sm font-semibold text-gray-900">AI-Powered</p>
          </div>
          <div className={`bg-primary-50 p-4 rounded-xl border border-primary-200 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.3s" }}>
            <MessageSquare size={24} className="text-primary-600 mx-auto mb-2 animate-bounce-slow" />
            <p className="text-sm font-semibold text-gray-900">Detailed Analysis</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard/interviews"
            className="group bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-200 flex items-center gap-2 justify-center font-semibold"
          >
            <Video size={20} className="group-hover:scale-110 transition-transform" />
            Start Video Interview
          </Link>
          <Link 
            href="/dashboard/interviews"
            className="group bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-primary-300 flex items-center gap-2 justify-center font-semibold"
          >
            <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
            Text Interview
          </Link>
        </div>
      </div>
    </div>
  );
}

