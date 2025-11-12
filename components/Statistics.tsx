"use client";

const stats = [
  {
    value: "5,000+",
    label: "Active Job Seekers",
    description: "Building their careers",
  },
  {
    value: "500+",
    label: "Partner Companies",
    description: "Hiring through our platform",
  },
  {
    value: "85%",
    label: "Success Rate",
    description: "Users landing jobs within 3 months",
  },
  {
    value: "10,000+",
    label: "Mock Interviews",
    description: "Completed successfully",
  },
];

export default function Statistics() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-coral-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white/90">
            Join the fastest-growing career platform in Bangladesh
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-white/80">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

