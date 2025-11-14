"use client";

import Link from "next/link";
import { FileText, Calendar, Trash2, Download, Sparkles } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import ScoreCircle from "./ScoreCircle";
import { useState } from "react";
import toast from "react-hot-toast";

interface ResumeCardProps {
  resume: {
    _id: string;
    originalFilename: string;
    fileSize: number;
    createdAt: string;
    companyName?: string;
    jobTitle?: string;
    parsedStatus: string;
    analysisResult?: {
      overallScore: number;
    };
  };
  onDelete?: (id: string) => void;
}

export default function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/resumes/${resume._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Resume deleted successfully");
        onDelete?.(resume._id);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete resume");
      }
    } catch (error) {
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch(`/api/resumes/${resume._id}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = resume.originalFilename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Resume downloaded");
      } else {
        toast.error("Failed to download resume");
      }
    } catch (error) {
      toast.error("Failed to download resume");
    }
  };

  const score = resume.analysisResult?.overallScore;
  const date = new Date(resume.createdAt).toLocaleDateString();

  return (
    <Link
      href={`/dashboard/resumes/${resume._id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-100 rounded-lg flex-shrink-0">
          <FileText className="w-6 h-6 text-primary-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {resume.originalFilename}
              </h3>
              {(resume.companyName || resume.jobTitle) && (
                <p className="text-sm text-gray-600 mt-1">
                  {resume.companyName && (
                    <span className="font-medium">{resume.companyName}</span>
                  )}
                  {resume.companyName && resume.jobTitle && " • "}
                  {resume.jobTitle && <span>{resume.jobTitle}</span>}
                </p>
              )}
            </div>

            {score !== undefined && (
              <div className="flex-shrink-0">
                <ScoreCircle score={score} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <span>•</span>
            <span>{formatFileSize(resume.fileSize)}</span>
            <span>•</span>
            <span
              className={`capitalize ${
                resume.parsedStatus === "completed"
                  ? "text-green-600"
                  : resume.parsedStatus === "failed"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {resume.parsedStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {score === undefined && (
            <Link
              href={`/dashboard/resumes/${resume._id}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 hover:bg-primary-50 rounded-lg transition text-primary-600"
              title="Analyze"
            >
              <Sparkles className="w-5 h-5" />
            </Link>
          )}
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}

