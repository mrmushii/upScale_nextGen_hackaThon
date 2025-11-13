"use client";

import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const plans = [
  {
    name: "Basic",
    icon: Sparkles,
    price: "Free",
    period: "Forever",
    description: "Perfect for exploring and trying out our platform",
    badge: "Free Trial",
    badgeColor: "bg-gray-100 text-gray-700",
    buttonText: "Start Free",
    buttonStyle: "bg-gray-900 hover:bg-gray-800 text-white",
    popular: false,
    features: [
      "One-time evaluation interview",
      "Generate one career roadmap",
      "One-time CV analyzer (no feedback)",
      "Basic job matching",
      "Community Q&A access",
      "Portfolio builder (basic)",
    ],
  },
  {
    name: "Pro",
    icon: Zap,
    price: "৳999",
    period: "per month",
    description: "For serious job seekers ready to accelerate their career",
    badge: "Most Popular",
    badgeColor: "bg-primary-600 text-white",
    buttonText: "Get Started",
    buttonStyle: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200",
    popular: true,
    features: [
      "Multiple evaluation interviews (10/month)",
      "Generate multiple roadmaps (5/month)",
      "AI mock interviews with feedback",
      "AI resume checker with detailed feedback",
      "Advanced portfolio builder",
      "AI-powered job matching",
      "Priority community support",
      "1 mentor session included",
      "Application tracker",
    ],
  },
  {
    name: "Ultimate",
    icon: Crown,
    price: "৳2,499",
    period: "per month",
    description: "Unlimited access to everything for maximum career growth",
    badge: "Best Value",
    badgeColor: "bg-gradient-to-r from-primary-600 to-coral-600 text-white",
    buttonText: "Go Ultimate",
    buttonStyle: "bg-gradient-to-r from-primary-600 to-coral-600 hover:from-primary-700 hover:to-coral-700 text-white shadow-lg",
    popular: false,
    features: [
      "Unlimited evaluation interviews",
      "Unlimited career roadmaps",
      "Unlimited AI mock interviews",
      "Advanced AI resume optimization",
      "Premium portfolio templates",
      "Priority AI job matching",
      "Unlimited mentor sessions",
      "Dedicated career advisor",
      "Interview guarantee program",
      "Exclusive job opportunities",
      "Priority customer support",
      "Early access to new features",
    ],
  },
];

export default function Pricing() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSelectPlan = (planName: string) => {
    const planParam = planName.toLowerCase();
    if (session?.user) {
      router.push(`/dashboard/payment?plan=${planParam}`);
    } else {
      router.push(`/login?redirect=/dashboard/payment?plan=${planParam}`);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you're ready. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl animate-fade-in-up ${
                plan.popular
                  ? "border-primary-500 shadow-xl scale-105"
                  : "border-gray-200 hover:border-primary-300"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <span className={`${plan.badgeColor} px-6 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-primary-50 rounded-xl">
                  <plan.icon size={32} className="text-primary-600" />
                </div>
                {!plan.popular && plan.badge && (
                  <span className={`${plan.badgeColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period !== "Forever" && (
                    <span className="text-gray-600">/ month</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {plan.period}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${plan.buttonStyle} mb-8`}
              >
                {plan.buttonText}
              </button>

              {/* Features */}
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-900 mb-4">
                  What's included:
                </div>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="text-primary-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Background decoration for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-coral-50 rounded-3xl opacity-50 -z-10"></div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-gray-600">
            All plans include access to our community and basic features
          </p>
          <p className="text-sm text-gray-500">
            30-day money-back guarantee • Cancel anytime • Secure payment
          </p>
        </div>
      </div>
    </section>
  );
}

