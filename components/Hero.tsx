"use client";

import { ArrowRight, Sparkles, Target, Rocket, Lightbulb, Star, User, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-hero overflow-hidden"
    >
      {/* Animated Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-coral-200 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300 rounded-full blur-2xl opacity-40 animate-float" style={{ animationDelay: "2s" }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div 
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div 
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Sparkles size={16} className="text-primary-600 animate-spin-slow" />
              <span className="text-sm font-medium text-gray-700">
                Transform Your Career Journey
              </span>
            </div>
            
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              Land Your Dream Job in{" "}
              <span className="text-primary-600 relative inline-block">
                Weeks
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
              , Not Months
            </h1>
            
            <p 
              className={`text-xl text-gray-600 leading-relaxed transition-all duration-1000 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              Connect your skills to real opportunities with AI-powered roadmaps, 
              personalized mentorship, and hands-on practice. Your career transformation starts here.
            </p>
            
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <Link 
                href="/register" 
                className="group bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg shadow-primary-200 animate-pulse-slow"
              >
                <span className="font-semibold">Start Your Journey</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/features" 
                className="bg-white text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 transition-all border-2 border-gray-200 font-semibold text-center hover:border-primary-300 hover:shadow-md"
              >
                Watch Demo
              </Link>
            </div>
            
            {/* Animated Stats */}
            <div 
              className={`flex flex-wrap gap-8 pt-4 transition-all duration-1000 delay-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <div className="group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-gray-900 animate-count-up">5,000+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-gray-900 animate-count-up" style={{ animationDelay: "0.1s" }}>500+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-gray-900 animate-count-up" style={{ animationDelay: "0.2s" }}>85%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Animated Illustration */}
          <div 
            className={`relative transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500 animate-card-float">
              <div className="space-y-6">
                {/* Mock UI Card */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-coral-50 rounded-xl animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce-slow">
                      MR
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Mushfiqur Rahman</div>
                      <div className="text-sm text-gray-600">Full Stack Developer</div>
                    </div>
                  </div>
                  <div className="text-primary-600 font-semibold text-lg animate-pulse-slow">92%</div>
                </div>
                
                {/* Animated Progress bars */}
                <div className="space-y-4">
                  <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Career Roadmap</span>
                      <span className="text-primary-600 font-semibold">75%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full animate-progress-bar" 
                        style={{ width: "75%", animationDelay: "0.5s" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Skills Mastered</span>
                      <span className="text-primary-600 font-semibold">12/15</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full animate-progress-bar" 
                        style={{ width: "80%", animationDelay: "0.6s" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Mock Interviews</span>
                      <span className="text-primary-600 font-semibold">8/10</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-coral-500 rounded-full animate-progress-bar" 
                        style={{ width: "80%", animationDelay: "0.7s" }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Achievement badges with proper icons */}
                <div className="grid grid-cols-4 gap-3 pt-4">
                  <div className="bg-primary-100 p-3 rounded-lg text-center hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
                    <Target className="w-6 h-6 mx-auto text-primary-600 mb-1 animate-bounce-slow" />
                    <div className="text-xs text-gray-600 mt-1">Goal Setter</div>
                  </div>
                  <div className="bg-coral-100 p-3 rounded-lg text-center hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                    <Rocket className="w-6 h-6 mx-auto text-coral-600 mb-1 animate-bounce-slow" style={{ animationDelay: "0.1s" }} />
                    <div className="text-xs text-gray-600 mt-1">Fast Learner</div>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg text-center hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
                    <Lightbulb className="w-6 h-6 mx-auto text-primary-600 mb-1 animate-bounce-slow" style={{ animationDelay: "0.2s" }} />
                    <div className="text-xs text-gray-600 mt-1">Problem Solver</div>
                  </div>
                  <div className="bg-coral-100 p-3 rounded-lg text-center hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: "1s" }}>
                    <Star className="w-6 h-6 mx-auto text-coral-600 mb-1 animate-bounce-slow" style={{ animationDelay: "0.3s" }} />
                    <div className="text-xs text-gray-600 mt-1">Top Performer</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-3xl -z-10 blur-2xl opacity-30 animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-coral-200 rounded-3xl -z-10 blur-2xl opacity-30 animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

