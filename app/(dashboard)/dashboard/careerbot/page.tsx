"use client";

import CareerBot from "@/components/career/CareerBot";

export default function CareerBotPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">CareerBot</h1>
        <p className="text-gray-600">
          Your AI career mentor assistant. Ask questions about career paths, skills to learn, or job search tips!
        </p>
      </div>
      <CareerBot />
    </div>
  );
}

