"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";

interface AboutEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export default function AboutEditor({ content, onChange }: AboutEditorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(content.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        onChange({ ...content, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onChange({ ...content, image: null });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profile Image (Optional)
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-primary-500 transition">
            <Upload size={24} className="text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          About Me
        </label>
        <textarea
          value={content.text || ""}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          placeholder="Write about yourself, your background, interests, and what makes you unique..."
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none min-h-[200px] resize-y"
        />
        <p className="text-xs text-gray-500 mt-1">
          {content.text?.length || 0} characters
        </p>
      </div>
    </div>
  );
}

