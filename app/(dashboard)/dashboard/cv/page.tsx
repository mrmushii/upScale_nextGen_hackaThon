"use client";

import { useState, useEffect } from "react";
import CVPreview from "@/components/cv/CVPreview";
import { CVData } from "@/lib/cvGenerator";

export default function CVPage() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateCV();
  }, []);

  const generateCV = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ includeSuggestions: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate CV");
      }

      const data = await response.json();
      setCvData(data.cv);
      setSuggestions(data.suggestions);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Failed to generate CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your CV...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={generateCV}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Failed to generate CV. Please try again.</p>
          <button
            onClick={generateCV}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your CV</h1>
        <p className="text-gray-600">Auto-generated from your profile with AI enhancements</p>
      </div>
      
      <CVPreview cvData={cvData} />
      
      {suggestions && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Improvement Suggestions</h2>
          
          <div className="space-y-4">
            {suggestions.summarySuggestions && suggestions.summarySuggestions.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Professional Summary Alternatives</h3>
                <ul className="list-disc list-inside space-y-1">
                  {suggestions.summarySuggestions.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{s}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {suggestions.linkedinTips && suggestions.linkedinTips.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">LinkedIn Tips</h3>
                <ul className="list-disc list-inside space-y-1">
                  {suggestions.linkedinTips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {suggestions.portfolioTips && suggestions.portfolioTips.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Portfolio Tips</h3>
                <ul className="list-disc list-inside space-y-1">
                  {suggestions.portfolioTips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

