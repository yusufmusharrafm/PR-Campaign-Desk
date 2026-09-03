import React from "react";
import { CampaignPriority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: CampaignPriority;
}

const PRIORITY_CONFIG: Record<CampaignPriority, { label: string; bg: string; text: string; border: string }> = {
  LOW: {
    label: "Low Priority",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  },
  MEDIUM: {
    label: "Medium Priority",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  HIGH: {
    label: "High Priority",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};
