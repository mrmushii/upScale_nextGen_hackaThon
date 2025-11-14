"use client";

interface CustomEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export default function CustomEditor({ content, onChange }: CustomEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Custom Content
        </label>
        <textarea
          value={content.html || content.text || ""}
          onChange={(e) => onChange({ ...content, text: e.target.value, html: e.target.value })}
          placeholder="Add your custom content here. You can use HTML for rich formatting."
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none min-h-[200px] resize-y font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          HTML is supported for custom formatting
        </p>
      </div>
    </div>
  );
}

