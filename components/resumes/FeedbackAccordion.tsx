"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import ScoreBadge from "./ScoreBadge";

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

interface Category {
  title: string;
  score: number;
  tips: Tip[];
}

interface FeedbackAccordionProps {
  categories: Category[];
}

export default function FeedbackAccordion({
  categories,
}: FeedbackAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(itemId)) {
      newOpen.delete(itemId);
    } else {
      newOpen.add(itemId);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {categories.map((category) => {
        const itemId = category.title.toLowerCase().replace(/\s+/g, "-");
        const isOpen = openItems.has(itemId);

        return (
          <div
            key={itemId}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleItem(itemId)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {category.title}
                </h3>
                <ScoreBadge score={category.score} />
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col gap-4">
                  {/* Tips summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {category.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        {tip.type === "good" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">{tip.tip}</span>
                      </div>
                    ))}
                  </div>

                  {/* Detailed explanations */}
                  <div className="flex flex-col gap-3">
                    {category.tips.map((tip, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          tip.type === "good"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-yellow-50 border-yellow-200 text-yellow-700"
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {tip.type === "good" ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          )}
                          <h4 className="font-semibold">{tip.tip}</h4>
                        </div>
                        <p className="text-sm mt-1">{tip.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

