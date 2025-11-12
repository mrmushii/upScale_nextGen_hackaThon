"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Sparkles, Download, Eye } from "lucide-react";

export default function CVAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setResults({
        atsScore: 82,
        overallScore: 85,
        strengths: [
          "Clear job titles and company names",
          "Quantified achievements with metrics",
          "Good use of action verbs",
          "Relevant technical skills listed",
        ],
        improvements: [
          "Add more keywords from job descriptions",
          "Improve formatting consistency",
          "Include certifications section",
          "Add a professional summary",
        ],
        keywords: { found: 12, recommended: 18, missing: ["TypeScript", "AWS", "Docker"] },
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">CV Analyzer</h1>
        <p className="text-gray-600 mt-2">Get AI-powered feedback on your resume</p>
      </div>

      {/* Usage Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Analyses This Month</div>
          <div className="text-3xl font-bold text-gray-900">6/10</div>
          <div className="text-sm text-green-600 font-semibold">4 remaining</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Latest ATS Score</div>
          <div className="text-3xl font-bold text-gray-900">82%</div>
          <div className="text-sm text-gray-600">Good compatibility</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Improvement</div>
          <div className="text-3xl font-bold text-green-600">+15%</div>
          <div className="text-sm text-gray-600">Since first analysis</div>
        </div>
      </div>

      {/* Upload Section */}
      {!results && (
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Resume</h2>
          
          <div className="max-w-2xl mx-auto">
            <div
              className="border-4 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-primary-400 hover:bg-primary-50 transition cursor-pointer"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {file ? file.name : "Click to upload or drag and drop"}
              </h3>
              <p className="text-gray-600 mb-4">PDF, DOC, DOCX (max 5MB)</p>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {file && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-coral-600 text-white py-4 rounded-xl font-bold hover:from-primary-700 hover:to-coral-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze Resume
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Score Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg">
              <div className="text-white/80 text-sm font-semibold mb-2">ATS Compatibility</div>
              <div className="text-6xl font-bold mb-2">{results.atsScore}%</div>
              <div className="text-white/90">Good - Will pass most ATS systems</div>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-coral-600 rounded-3xl p-8 text-white shadow-lg">
              <div className="text-white/80 text-sm font-semibold mb-2">Overall Score</div>
              <div className="text-6xl font-bold mb-2">{results.overallScore}%</div>
              <div className="text-white/90">Strong resume with room for improvement</div>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" />
              Strengths
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {results.strengths.map((strength: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <XCircle className="text-orange-600" />
              Recommended Improvements
            </h2>
            <div className="space-y-4">
              {results.improvements.map((improvement: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <XCircle size={20} className="text-orange-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 flex-1">{improvement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Keyword Analysis</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-primary-50 rounded-xl">
                <div className="text-3xl font-bold text-primary-600">{results.keywords.found}</div>
                <div className="text-sm text-gray-600">Keywords Found</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{results.keywords.recommended}</div>
                <div className="text-sm text-gray-600">Recommended</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">{results.keywords.missing.length}</div>
                <div className="text-sm text-gray-600">Missing</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Missing Important Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {results.keywords.missing.map((keyword: string, index: number) => (
                  <span key={index} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold">
              <Download size={20} />
              Download Report
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition font-semibold">
              <Eye size={20} />
              View Detailed Analysis
            </button>
            <button
              onClick={() => {
                setResults(null);
                setFile(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition font-semibold"
            >
              <Upload size={20} />
              Analyze Another
            </button>
          </div>
        </div>
      )}

      {/* AI Placeholder Notice */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200 text-center">
        <Sparkles size={48} className="mx-auto text-yellow-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Feature - Enhanced Version Coming Soon</h3>
        <p className="text-gray-700">
          Advanced AI analysis with detailed suggestions and auto-formatting will be available soon!
        </p>
      </div>
    </div>
  );
}

