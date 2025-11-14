"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const getBadgeConfig = () => {
    if (score > 69) {
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        label: "Strong",
        icon: CheckCircle2,
      };
    } else if (score > 49) {
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        label: "Good Start",
        icon: AlertTriangle,
      };
    } else {
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        label: "Needs Work",
        icon: AlertTriangle,
      };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg} ${config.text} ${config.border} border`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
      <span className="text-sm font-semibold">{score}/100</span>
    </div>
  );
}

