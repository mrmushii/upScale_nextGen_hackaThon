"use client";

import { Save, Share2, Globe, Eye, Download } from "lucide-react";
import toast from "react-hot-toast";

interface PortfolioHeaderProps {
  portfolio: any;
  saving: boolean;
  onSave: () => void;
  onPublish: () => void;
  onCopyLink: () => void;
}

export default function PortfolioHeader({
  portfolio,
  saving,
  onSave,
  onPublish,
  onCopyLink,
}: PortfolioHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Portfolio Builder</h1>
        <p className="text-gray-600 mt-2">
          Create a professional portfolio to showcase your work
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {saving ? "Saving..." : "Save"}
        </button>
        {portfolio.published && portfolio.publicUrl && (
          <button
            onClick={onCopyLink}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
          >
            <Share2 size={20} />
            Copy Link
          </button>
        )}
        {!portfolio.published && (
          <button
            onClick={onPublish}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-coral-600 text-white rounded-xl hover:from-primary-700 hover:to-coral-700 transition font-semibold"
          >
            <Globe size={20} />
            Publish
          </button>
        )}
        {portfolio.published && portfolio.publicUrl && (
          <a
            href={`/portfolio/${portfolio.publicUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition font-semibold"
          >
            <Eye size={20} />
            Preview
          </a>
        )}
      </div>
    </div>
  );
}

