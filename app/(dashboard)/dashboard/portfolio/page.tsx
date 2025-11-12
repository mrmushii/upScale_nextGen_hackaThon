"use client";

import { FileText, Eye, Download, Share2, Plus, Edit } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Portfolio Builder</h1>
        <p className="text-gray-600 mt-2">Create a professional portfolio to showcase your work</p>
      </div>

      {/* Template Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {["Basic", "Professional", "Creative"].map((template, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer group">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-coral-100 rounded-xl mb-4 flex items-center justify-center text-6xl">
              📄
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{template} Template</h3>
            <p className="text-gray-600 text-sm mb-4">Perfect for {template.toLowerCase()} profiles</p>
            <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold">
              Use Template
            </button>
          </div>
        ))}
      </div>

      {/* Portfolio Sections */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Sections</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            <Plus size={20} />
            Add Section
          </button>
        </div>

        <div className="space-y-4">
          {["About Me", "Skills", "Projects", "Experience", "Education"].map((section, index) => (
            <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-primary-600" />
                <span className="font-semibold text-gray-900">{section}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Edit size={18} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold">
          <Eye size={20} />
          Preview
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 transition font-semibold">
          <Download size={20} />
          Export PDF
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 transition font-semibold">
          <Share2 size={20} />
          Share Link
        </button>
      </div>
    </div>
  );
}

