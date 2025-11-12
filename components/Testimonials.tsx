"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Ahmed",
    role: "Frontend Developer",
    company: "Tech Solutions Ltd",
    image: "👨‍💻",
    rating: 5,
    text: "Upscale transformed my career! The AI-powered roadmap helped me identify my skill gaps, and the mock interviews gave me the confidence I needed. I landed my dream job in just 6 weeks!",
  },
  {
    name: "Nadia Khan",
    role: "Full Stack Developer",
    company: "Digital Innovations",
    image: "👩‍💼",
    rating: 5,
    text: "The mentor sessions were invaluable. Having 1-on-1 guidance from industry professionals helped me prepare for interviews and negotiate my salary. Worth every taka!",
  },
  {
    name: "Farhan Islam",
    role: "UI/UX Designer",
    company: "Creative Studio",
    image: "🎨",
    rating: 5,
    text: "I loved how transparent the job matching was. Every recommendation came with clear explanations of why it fit my profile. The portfolio builder helped me showcase my work professionally.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say About Upscale
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from real people who transformed their careers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 right-8">
                <div className="bg-primary-600 p-3 rounded-full shadow-lg">
                  <Quote size={24} className="text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-primary-600">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Reviews */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-gray-900 font-semibold">4.9/5</span>
            <span className="text-gray-600">from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}

