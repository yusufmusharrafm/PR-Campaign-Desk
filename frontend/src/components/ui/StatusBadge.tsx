import React from "react";
import { CampaignStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: CampaignStatus;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; bg: string; text: string; border: string; glow: string }
> = {
  NEW: {
    label: "New",
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/30",
    glow: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]",
  },
  STORY_DEVELOPMENT: {
    label: "Story Dev",
    bg: "bg-indigo-500/15",
    text: "text-indigo-300",
    border: "border-indigo-500/30",
    glow: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]",
  },
  ARTICLE_DRAFT: {
    label: "Article Draft",
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    border: "border-purple-500/30",
    glow: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]",
  },
  CLIENT_REVIEW: {
    label: "Client Review",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/30",
    glow: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    glow: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  },
  MEDIA_OUTREACH: {
    label: "Media Outreach",
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
    glow: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]",
  },
  PUBLISHED: {
    label: "Published",
    bg: "bg-teal-500/15",
    text: "text-teal-300",
    border: "border-teal-500/30",
    glow: "bg-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.6)]",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-slate-500/15",
    text: "text-slate-300",
    border: "border-slate-500/30",
    glow: "bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;
  const padding = size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md ${config.bg} ${config.text} ${config.border} ${padding} shadow-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.glow}`} />
      {config.label}
    </span>
  );
};
