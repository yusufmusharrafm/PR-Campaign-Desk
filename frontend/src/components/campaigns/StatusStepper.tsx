"use client";

import React from "react";
import { CampaignStatus, ALL_STATUSES } from "@/lib/types";

interface StatusStepperProps {
  currentStatus: CampaignStatus;
  onStatusChange: (newStatus: CampaignStatus) => Promise<void>;
  disabled?: boolean;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const currentIndex = ALL_STATUSES.findIndex((s) => s.key === currentStatus);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < ALL_STATUSES.length - 1;

  const handleStepClick = async (targetKey: CampaignStatus) => {
    if (disabled || targetKey === currentStatus) return;
    await onStatusChange(targetKey);
  };

  const handlePrevious = async () => {
    if (canGoPrevious && !disabled) {
      await onStatusChange(ALL_STATUSES[currentIndex - 1].key);
    }
  };

  const handleNext = async () => {
    if (canGoNext && !disabled) {
      await onStatusChange(ALL_STATUSES[currentIndex + 1].key);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Glow Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Workflow Lifecycle Control
            </h3>
          </div>
          <p className="text-sm font-semibold text-white mt-1">
            Current Stage:{" "}
            <span className="text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-xs ml-1">
              {ALL_STATUSES[currentIndex]?.label || currentStatus}
            </span>
          </p>
        </div>

        {/* Step Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious || disabled}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            ← Previous Stage
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext || disabled}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            Advance Stage →
          </button>
        </div>
      </div>

      {/* Stepper Interactive Timeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[760px] justify-between relative px-4">
          {/* Connector Line Background */}
          <div className="absolute top-4 left-8 right-8 h-1 bg-slate-800/80 rounded-full -z-0" />
          
          {/* Active Progress Fill Line */}
          <div
            className="absolute top-4 left-8 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 -z-0"
            style={{
              width: `${(currentIndex / (ALL_STATUSES.length - 1)) * 92}%`,
            }}
          />

          {ALL_STATUSES.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={step.key}
                onClick={() => handleStepClick(step.key)}
                disabled={disabled}
                className="relative z-10 flex flex-col items-center group cursor-pointer disabled:cursor-not-allowed"
              >
                {/* Circle Step Node */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCurrent
                      ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white ring-4 ring-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110"
                      : isCompleted
                      ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      : "bg-slate-950 border border-white/10 text-slate-500 hover:border-indigo-500/40 hover:text-slate-300"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[11px] font-semibold mt-2.5 max-w-[85px] text-center line-clamp-1 transition-all ${
                    isCurrent
                      ? "text-indigo-300 font-bold scale-105"
                      : isCompleted
                      ? "text-slate-300"
                      : "text-slate-500 group-hover:text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
