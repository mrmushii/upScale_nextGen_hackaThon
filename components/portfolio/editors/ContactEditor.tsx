"use client";

import { Mail, Phone, Linkedin, Github, Twitter, Globe, MapPin } from "lucide-react";

interface ContactEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const SOCIAL_LINKS = [
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
  { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
  { key: "twitter", label: "Twitter/X", icon: Twitter, placeholder: "https://twitter.com/username" },
  { key: "website", label: "Website", icon: Globe, placeholder: "https://yourwebsite.com" },
];

export default function ContactEditor({ content, onChange }: ContactEditorProps) {
  const social = content.social || {};

  const updateSocial = (key: string, value: string) => {
    onChange({
      ...content,
      social: { ...social, [key]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Mail size={16} className="inline mr-1" />
          Email *
        </label>
        <input
          type="email"
          value={content.email || ""}
          onChange={(e) => onChange({ ...content, email: e.target.value })}
          placeholder="your.email@example.com"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Phone size={16} className="inline mr-1" />
          Phone
        </label>
        <input
          type="tel"
          value={content.phone || ""}
          onChange={(e) => onChange({ ...content, phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <MapPin size={16} className="inline mr-1" />
          Location
        </label>
        <input
          type="text"
          value={content.location || ""}
          onChange={(e) => onChange({ ...content, location: e.target.value })}
          placeholder="City, Country"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Social Media Links
        </label>
        <div className="space-y-3">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <div key={link.key}>
                <label className="block text-xs text-gray-600 mb-1">{link.label}</label>
                <div className="relative">
                  <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={social[link.key] || ""}
                    onChange={(e) => updateSocial(link.key, e.target.value)}
                    placeholder={link.placeholder}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

