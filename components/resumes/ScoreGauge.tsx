"use client";

import { useEffect, useRef, useState } from "react";

export default function ScoreGauge({ score = 0 }: { score: number }) {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const getColor = () => {
    if (score >= 70) return "#10b981"; // green
    if (score >= 50) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Foreground arc */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            className="transition-all duration-1000"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-2xl font-bold text-gray-900 pt-4">{score}</div>
          <div className="text-xs text-gray-500">/100</div>
        </div>
      </div>
    </div>
  );
}

