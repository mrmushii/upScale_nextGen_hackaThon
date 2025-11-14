"use client";

import { CVData } from "@/lib/cvGenerator";
import { Download, Printer } from "lucide-react";

interface CVPreviewProps {
  cvData: CVData;
}

export default function CVPreview({ cvData }: CVPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate PDF (you can use jsPDF or similar)
    // For now, just trigger print
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:p-6">
      {/* Header with actions */}
      <div className="mb-6 flex justify-end gap-2 print:hidden">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* CV Content */}
      <div className="space-y-6">
        {/* Personal Info */}
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold">{cvData.personalInfo.name}</h1>
          <div className="mt-2 space-x-4 text-sm text-gray-600">
            {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
            {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
            {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
          </div>
          <div className="mt-2 space-x-4 text-sm">
            {cvData.personalInfo.linkedin && (
              <a href={cvData.personalInfo.linkedin} className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            )}
            {cvData.personalInfo.portfolio && (
              <a href={cvData.personalInfo.portfolio} className="text-blue-600 hover:underline">
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h2 className="text-xl font-semibold border-b mb-2">Professional Summary</h2>
          <p className="text-gray-700">{cvData.professionalSummary}</p>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold border-b mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Experience</h2>
            <div className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">{exp.duration}</span>
                  </div>
                  {exp.description && Array.isArray(exp.description) && exp.description.length > 0 && (
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Education</h2>
            <div className="space-y-2">
              {cvData.education.map((edu, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-sm text-gray-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Projects</h2>
            <div className="space-y-4">
              {cvData.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

