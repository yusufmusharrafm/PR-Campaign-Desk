"use client";

import React, { useState, useEffect } from "react";
import { Campaign, CampaignPriority, ALL_PRIORITIES } from "@/lib/types";

interface CampaignDetailsEditorProps {
  campaign: Campaign;
  onSave: (updatedFields: Partial<Campaign>) => Promise<void>;
}

export const CampaignDetailsEditor: React.FC<CampaignDetailsEditorProps> = ({
  campaign,
  onSave,
}) => {
  const [title, setTitle] = useState(campaign.title);
  const [clientName, setClientName] = useState(campaign.client_name);
  const [priority, setPriority] = useState<CampaignPriority>(campaign.priority);
  const [targetPublication, setTargetPublication] = useState(campaign.target_publication || "");
  const [assignedPerson, setAssignedPerson] = useState(campaign.assigned_person || "");
  const [deadline, setDeadline] = useState(campaign.deadline || "");
  const [storySummary, setStorySummary] = useState(campaign.story_summary || "");
  const [notes, setNotes] = useState(campaign.notes || "");
  const [nextAction, setNextAction] = useState(campaign.next_action || "");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setTitle(campaign.title);
    setClientName(campaign.client_name);
    setPriority(campaign.priority);
    setTargetPublication(campaign.target_publication || "");
    setAssignedPerson(campaign.assigned_person || "");
    setDeadline(campaign.deadline || "");
    setStorySummary(campaign.story_summary || "");
    setNotes(campaign.notes || "");
    setNextAction(campaign.next_action || "");
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        client_name: clientName.trim(),
        priority,
        target_publication: targetPublication.trim() || null,
        assigned_person: assignedPerson.trim() || null,
        deadline: deadline || null,
        story_summary: storySummary.trim() || null,
        notes: notes.trim() || null,
        next_action: nextAction.trim() || null,
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Campaign Configuration & Strategy
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage metadata, pitch angles, and action priorities
          </p>
        </div>

        {successMsg && (
          <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full animate-in fade-in shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            ✓ Details Updated
          </span>
        )}
      </div>

      {/* Basic Info Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Campaign Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Client Name *
          </label>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as CampaignPriority)}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
          >
            {ALL_PRIORITIES.map((p) => (
              <option key={p.key} value={p.key} className="bg-slate-900 text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Target Publication
          </label>
          <input
            type="text"
            value={targetPublication}
            onChange={(e) => setTargetPublication(e.target.value)}
            placeholder="e.g. Forbes Tech"
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Assigned Pro
          </label>
          <input
            type="text"
            value={assignedPerson}
            onChange={(e) => setAssignedPerson(e.target.value)}
            placeholder="e.g. Marcus Chen"
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Target Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Immediate Next Action Highlight Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/25 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.05)]">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">
            Immediate Next Action Strategy
          </label>
        </div>
        <input
          type="text"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          placeholder="Define the immediate next step for this campaign..."
          className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none font-medium border-indigo-500/30"
        />
      </div>

      {/* Textareas */}
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Story / Article Pitch Summary
          </label>
          <textarea
            rows={3}
            value={storySummary}
            onChange={(e) => setStorySummary(e.target.value)}
            placeholder="Describe story angle, pitch summary, key hook..."
            className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Internal Campaign Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal agency notes, client background, embargo dates..."
            className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 active:scale-95"
        >
          {saving ? "Saving..." : "Save Campaign Details"}
        </button>
      </div>
    </form>
  );
};
