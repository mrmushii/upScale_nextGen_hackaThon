"use client";

import { X, Check } from "lucide-react";

const TEMPLATES = [
  { id: "basic", name: "Basic", description: "Clean and simple design", color: "from-blue-100 to-blue-200" },
  { id: "professional", name: "Professional", description: "Corporate and polished", color: "from-gray-100 to-gray-200" },
  { id: "creative", name: "Creative", description: "Bold and artistic", color: "from-purple-100 to-pink-200" },
];

interface TemplateSelectorProps {
  currentTemplate: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({
  currentTemplate,
  isOpen,
  onClose,
  onSelect,
}: TemplateSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer border-2 ${
              currentTemplate === template.id
                ? "border-primary-600 ring-2 ring-primary-200"
                : "border-gray-200 hover:border-primary-300"
            }`}
          >
            <div
              className={`aspect-video bg-gradient-to-br ${template.color} rounded-xl mb-4 flex items-center justify-center text-6xl`}
            >
              📄
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            {currentTemplate === template.id && (
              <div className="flex items-center gap-2 text-primary-600 font-semibold">
                <Check size={20} />
                Current Template
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

