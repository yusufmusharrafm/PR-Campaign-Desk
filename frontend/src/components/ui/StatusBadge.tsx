import React from "react";
import { CampaignStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: CampaignStatus;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  NEW: {
    label: "New",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  STORY_DEVELOPMENT: {
    label: "Story Dev",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    dot: "bg-indigo-400",
  },
  ARTICLE_DRAFT: {
    label: "Article Draft",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    dot: "bg-purple-400",
  },
  CLIENT_REVIEW: {
    label: "Client Review",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  MEDIA_OUTREACH: {
    label: "Media Outreach",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  PUBLISHED: {
    label: "Published",
    bg: "bg-teal-500/10",
    text: "text-teal-300",
    border: "border-teal-500/20",
    dot: "bg-teal-300",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
