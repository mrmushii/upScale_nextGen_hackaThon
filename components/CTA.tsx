"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-coral-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-coral-400 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-fade-in">
          <Sparkles size={16} className="text-white" />
          <span className="text-sm font-medium text-white">
            Join 5,000+ Job Seekers
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
          Build Your Dream Career <br />
          Starting Today
        </h2>

        {/* Description */}
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Stop wondering where to start. Get your personalized roadmap, practice with AI, 
          connect with mentors, and land the job you deserve.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/register" className="group bg-white text-primary-600 px-8 py-4 rounded-full hover:bg-gray-50 transition transform hover:scale-105 flex items-center space-x-2 shadow-2xl font-semibold text-lg">
            <span>Get Started Free</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </Link>
          <a href="#pricing" className="text-white px-8 py-4 rounded-full border-2 border-white hover:bg-white hover:text-primary-600 transition font-semibold text-lg">
            View Pricing
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>30-day money-back</span>
          </div>
        </div>
      </div>
    </section>
  );
}

