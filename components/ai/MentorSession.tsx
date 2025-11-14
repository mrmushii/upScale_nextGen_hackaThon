"use client";

import { Users, Calendar, Video, MessageCircle, Star, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MentorSession() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-gradient-to-br from-primary-50 to-coral-50 rounded-full mb-6 group hover:scale-110 transition-transform duration-300 animate-bounce-slow">
          <Users size={48} className="text-primary-600 group-hover:rotate-12 transition-transform" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          One-on-One Mentor Sessions
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          Connect with industry professionals for personalized career guidance, 
          skill development, and expert advice tailored to your goals.
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <div className={`bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200 hover:shadow-lg transition-all duration-300 group ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.1s" }}>
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary-600 rounded-full">
                <Video size={24} className="text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">Video Sessions</h4>
            <p className="text-sm text-gray-600">
              Face-to-face guidance via video calls
            </p>
          </div>
          
          <div className={`bg-gradient-to-br from-coral-50 to-coral-100 p-6 rounded-xl border border-coral-200 hover:shadow-lg transition-all duration-300 group ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.2s" }}>
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-coral-600 rounded-full">
                <Calendar size={24} className="text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-coral-600 transition">Flexible Scheduling</h4>
            <p className="text-sm text-gray-600">
              Book sessions at your convenience
            </p>
          </div>
          
          <div className={`bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200 hover:shadow-lg transition-all duration-300 group ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.3s" }}>
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary-600 rounded-full">
                <MessageCircle size={24} className="text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">Personalized Advice</h4>
            <p className="text-sm text-gray-600">
              Tailored guidance for your career path
            </p>
          </div>
          
          <div className={`bg-gradient-to-br from-coral-50 to-coral-100 p-6 rounded-xl border border-coral-200 hover:shadow-lg transition-all duration-300 group ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`} style={{ transitionDelay: "0.4s" }}>
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-coral-600 rounded-full">
                <Star size={24} className="text-white group-hover:scale-110 transition-transform animate-pulse-slow" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-coral-600 transition">Expert Mentors</h4>
            <p className="text-sm text-gray-600">
              Verified professionals from top companies
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
            <Sparkles size={16} className="text-primary-600 animate-spin-slow" />
            <span className="font-medium">Career Guidance</span>
          </div>
          <div className="flex items-center gap-2 bg-coral-50 px-4 py-2 rounded-full">
            <Star size={16} className="text-coral-600 animate-pulse-slow" />
            <span className="font-medium">Skill Development</span>
          </div>
          <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
            <Users size={16} className="text-primary-600 animate-bounce-slow" />
            <span className="font-medium">Industry Insights</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard/mentors"
            className="group bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-200 flex items-center gap-2 justify-center font-semibold"
          >
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            Find a Mentor
          </Link>
          <Link 
            href="/dashboard/mentors/my-sessions"
            className="group bg-gray-100 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-primary-300 flex items-center gap-2 justify-center font-semibold"
          >
            <Calendar size={20} className="group-hover:scale-110 transition-transform" />
            My Sessions
          </Link>
        </div>
      </div>
    </div>
  );
}

