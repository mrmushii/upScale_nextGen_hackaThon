"use client";

import { MessageSquare, Mic, Video } from "lucide-react";

export default function MockInterview() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-primary-50 rounded-full mb-6">
          <Video size={48} className="text-primary-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          AI Mock Interview
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Practice interviews with our AI interviewer. Get real-time feedback on your responses, 
          body language, and communication skills.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition flex items-center gap-2 justify-center">
            <Video size={20} />
            Start Video Interview
          </button>
          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition flex items-center gap-2 justify-center">
            <MessageSquare size={20} />
            Text Interview
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}

