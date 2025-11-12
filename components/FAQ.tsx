"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI-powered career roadmap work?",
    answer: "Our AI analyzes your current skills, experience, and target roles to create a personalized learning path. It identifies skill gaps and recommends specific resources, courses, and practice exercises to help you reach your goals efficiently.",
  },
  {
    question: "What's included in the mentor sessions?",
    answer: "Mentor sessions are 1-on-1 video calls with industry professionals. They provide career guidance, conduct mock interviews, review your portfolio, answer technical questions, and help you prepare for real job interviews. All mentors are carefully vetted by our team.",
  },
  {
    question: "Can I switch between plans?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll get immediate access to new features. If you downgrade, changes take effect at the end of your current billing cycle.",
  },
  {
    question: "How does the AI mock interview work?",
    answer: "Our AI conducts realistic interview simulations based on your target role. It asks technical and behavioral questions, evaluates your responses, and provides detailed feedback on areas for improvement. You can practice unlimited times on Pro and Ultimate plans.",
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with Upscale, contact us within 30 days of purchase for a full refund, no questions asked.",
  },
  {
    question: "How are jobs matched to my profile?",
    answer: "We use transparent, rule-based matching that considers your skills, experience level, preferred track, and career goals. Every job recommendation comes with a clear explanation of why it matches your profile and which skills you might need to develop.",
  },
  {
    question: "Can I use Upscale if I'm a complete beginner?",
    answer: "Absolutely! Upscale is designed for job seekers at all levels. Whether you're a fresh graduate, career changer, or experienced professional, our platform adapts to your current level and creates an appropriate roadmap for your goals.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major payment methods including bKash, Nagad, credit/debit cards, and international cards via Stripe. All transactions are secure and encrypted.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Upscale
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-primary-200 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  size={24}
                  className={`text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <button className="text-primary-600 font-semibold hover:text-primary-700 transition">
            Contact our support team →
          </button>
        </div>
      </div>
    </section>
  );
}

