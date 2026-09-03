"use client";

import React from "react";
import { ActivityLog } from "@/lib/types";

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "CREATED":
        return { icon: "✨", color: "text-blue-400 bg-blue-500/15 border-blue-500/30 shadow-[0_0_10px_rgba(96,165,250,0.2)]" };
      case "STATUS_CHANGE":
        return { icon: "🔄", color: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30 shadow-[0_0_10px_rgba(129,140,248,0.2)]" };
      case "FIELD_UPDATE":
        return { icon: "📝", color: "text-purple-400 bg-purple-500/15 border-purple-500/30 shadow-[0_0_10px_rgba(192,132,252,0.2)]" };
      case "AI_ASSIST_USED":
        return { icon: "🤖", color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]" };
      default:
        return { icon: "📌", color: "text-slate-400 bg-slate-500/15 border-slate-500/30" };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Audit Activity Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Immutable record of campaign actions</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
          {logs.length} Log Entries
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="py-10 text-center text-xs text-slate-500">
          No activity logs recorded yet.
        </div>
      ) : (
        <div className="relative pl-7 space-y-4 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/40 before:via-purple-500/20 before:to-transparent">
          {logs.map((log) => {
            const { icon, color } = getActionIcon(log.action_type);

            return (
              <div key={log.id} className="relative group">
                {/* Timeline Node Icon */}
                <div
                  className={`absolute -left-7 top-0.5 w-7 h-7 rounded-full border flex items-center justify-center text-xs backdrop-blur-md ${color}`}
                >
                  {icon}
                </div>

                <div className="glass-panel rounded-xl p-3.5 space-y-1 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-200">{log.actor}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{log.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
