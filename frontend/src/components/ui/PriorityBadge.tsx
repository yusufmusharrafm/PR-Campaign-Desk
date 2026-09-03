import React from "react";
import { CampaignPriority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: CampaignPriority;
}

const PRIORITY_CONFIG: Record<CampaignPriority, { label: string; bg: string; text: string; border: string }> = {
  LOW: {
    label: "Low Priority",
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    border: "border-slate-500/30",
  },
  MEDIUM: {
    label: "Medium Priority",
    bg: "bg-indigo-500/15",
    text: "text-indigo-300",
    border: "border-indigo-500/30",
  },
  HIGH: {
    label: "High Priority",
    bg: "bg-rose-500/20",
    text: "text-rose-300",
    border: "border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};
