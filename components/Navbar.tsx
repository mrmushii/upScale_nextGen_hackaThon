"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Upscale
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition">
              Testimonials
            </a>
            <a href="#faq" className="text-gray-700 hover:text-primary-600 transition">
              FAQ
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-primary-600 transition font-semibold">
              Sign In
            </Link>
            <Link href="/register" className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition transform hover:scale-105">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
            >
              FAQ
            </a>
            <div className="pt-4 space-y-2">
              <Link href="/login" className="block w-full text-center py-2 text-gray-700 hover:text-primary-600 transition font-semibold">
                Sign In
              </Link>
              <Link href="/register" className="block w-full bg-primary-600 text-white py-2 rounded-full hover:bg-primary-700 transition text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

