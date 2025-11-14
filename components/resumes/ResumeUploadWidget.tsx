"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { RESUME_CONSTANTS } from "@/lib/resumeService";

interface ResumeUploadWidgetProps {
  onFileSelect?: (file: File | null) => void;
  maxSize?: number;
}

export default function ResumeUploadWidget({
  onFileSelect,
  maxSize = RESUME_CONSTANTS.MAX_FILE_SIZE,
}: ResumeUploadWidgetProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        setFile(droppedFile);
        onFileSelect?.(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        onFileSelect?.(selectedFile);
      }
    },
    [onFileSelect]
  );

  const handleRemove = useCallback(() => {
    setFile(null);
    onFileSelect?.(null);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all
          ${
            isDragging
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400"
          }
        `}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileInput}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="p-4 bg-primary-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOC, or DOCX (max {formatFileSize(maxSize)})
            </p>
          </label>
        )}
      </div>
    </div>
  );
}

