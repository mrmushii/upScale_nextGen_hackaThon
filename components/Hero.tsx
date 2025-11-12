"use client";

import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-hero overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-coral-200 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: "1s" }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Sparkles size={16} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                Transform Your Career Journey
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Land Your Dream Job in{" "}
              <span className="text-primary-600 relative">
                Weeks
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C60 2 140 2 198 10" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              , Not Months
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Connect your skills to real opportunities with AI-powered roadmaps, 
              personalized mentorship, and hands-on practice. Your career transformation starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg shadow-primary-200">
                <span className="font-semibold">Start Your Journey</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
              <button className="bg-white text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 transition border-2 border-gray-200 font-semibold">
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">5,000+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Illustration */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
              <div className="space-y-6">
                {/* Mock UI Card */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      JS
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">John Smith</div>
                      <div className="text-sm text-gray-600">Full Stack Developer</div>
                    </div>
                  </div>
                  <div className="text-primary-600 font-semibold">92%</div>
                </div>
                
                {/* Progress bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Career Roadmap</span>
                      <span className="text-primary-600 font-semibold">75%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Skills Mastered</span>
                      <span className="text-primary-600 font-semibold">12/15</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Mock Interviews</span>
                      <span className="text-primary-600 font-semibold">8/10</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Achievement badges */}
                <div className="grid grid-cols-4 gap-3 pt-4">
                  <div className="bg-primary-100 p-3 rounded-lg text-center">
                    <div className="text-2xl">🎯</div>
                    <div className="text-xs text-gray-600 mt-1">Goal Setter</div>
                  </div>
                  <div className="bg-coral-100 p-3 rounded-lg text-center">
                    <div className="text-2xl">🚀</div>
                    <div className="text-xs text-gray-600 mt-1">Fast Learner</div>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg text-center">
                    <div className="text-2xl">💡</div>
                    <div className="text-xs text-gray-600 mt-1">Problem Solver</div>
                  </div>
                  <div className="bg-coral-100 p-3 rounded-lg text-center">
                    <div className="text-2xl">⭐</div>
                    <div className="text-xs text-gray-600 mt-1">Top Performer</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-3xl -z-10 blur-2xl opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-coral-200 rounded-3xl -z-10 blur-2xl opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

