"use client";

interface SectionType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface AddSectionMenuProps {
  sections: SectionType[];
  onSelect: (type: string) => void;
  onClose: () => void;
}

export default function AddSectionMenu({ sections, onSelect, onClose }: AddSectionMenuProps) {
  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-10">
      <div className="p-2 max-h-96 overflow-y-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-left group"
          >
            <span className="text-2xl group-hover:scale-110 transition">{section.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{section.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

