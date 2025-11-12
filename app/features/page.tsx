import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MockInterview from "@/components/ai/MockInterview";
import CVAnalyzer from "@/components/ai/CVAnalyzer";
import JobMatching from "@/components/ai/JobMatching";
import CareerRoadmap from "@/components/ai/CareerRoadmap";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI-Powered Career Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our cutting-edge AI features designed to accelerate your career growth
            </p>
          </div>

          {/* AI Features */}
          <div className="space-y-12">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CareerRoadmap />
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <MockInterview />
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CVAnalyzer />
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <JobMatching />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-12 shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of job seekers who are already using our AI-powered platform 
                to land their dream jobs faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition transform hover:scale-105 shadow-lg font-semibold">
                  Get Started Free
                </button>
                <button className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full hover:bg-gray-200 transition font-semibold">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

