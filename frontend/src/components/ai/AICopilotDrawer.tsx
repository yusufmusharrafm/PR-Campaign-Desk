"use client";

import React, { useState } from "react";
import { CampaignDetail } from "@/lib/types";
import { aiSummarize, aiSuggestNextAction, aiDraftFollowup } from "@/lib/api";

interface AICopilotDrawerProps {
  campaign: CampaignDetail;
  isOpen: boolean;
  onClose: () => void;
  onApplySummary: (newSummary: string) => Promise<void>;
  onApplyNextAction: (newAction: string) => Promise<void>;
}

type TabType = "summary" | "next_action" | "draft_followup";

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  campaign,
  isOpen,
  onClose,
  onApplySummary,
  onApplyNextAction,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Outputs
  const [summaryOutput, setSummaryOutput] = useState<{
    summary: string;
    talkingPoints: string[];
  } | null>(null);
  const [nextActionOutput, setNextActionOutput] = useState<{
    action: string;
    reasoning: string;
  } | null>(null);
  const [draftOutput, setDraftOutput] = useState<{
    subject: string;
    body: string;
  } | null>(null);

  const [tone, setTone] = useState("Professional and persuasive");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiSummarize({
        story_summary: campaign.story_summary,
        notes: campaign.notes,
      });
      setSummaryOutput({
        summary: res.concise_summary,
        talkingPoints: res.key_talking_points,
      });
    } catch (err: any) {
      setError(err.message || "AI Assistant is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestNextAction = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiSuggestNextAction({
        status: campaign.status,
        target_publication: campaign.target_publication,
        story_summary: campaign.story_summary,
        notes: campaign.notes,
      });
      setNextActionOutput({
        action: res.suggested_next_action,
        reasoning: res.reasoning,
      });
    } catch (err: any) {
      setError(err.message || "AI Assistant is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleDraftFollowup = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiDraftFollowup({
        client_name: campaign.client_name,
        target_publication: campaign.target_publication,
        story_summary: campaign.story_summary,
        tone,
      });
      setDraftOutput({
        subject: res.subject,
        body: res.body,
      });
    } catch (err: any) {
      setError(err.message || "AI Assistant is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (!draftOutput) return;
    const textToCopy = `Subject: ${draftOutput.subject}\n\n${draftOutput.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900/95 border-l border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-500/30">
                🤖
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  AI PR Assistant
                </h2>
                <p className="text-xs text-slate-400">
                  Human-in-the-loop campaign intelligence
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-slate-950/60 p-1.5 gap-1.5">
            <button
              onClick={() => {
                setActiveTab("summary");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "summary"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Summarize
            </button>
            <button
              onClick={() => {
                setActiveTab("next_action");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "next_action"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Next Action
            </button>
            <button
              onClick={() => {
                setActiveTab("draft_followup");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "draft_followup"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Draft Pitch
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            {error && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-200 text-xs space-y-2 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <span>⚠️</span> AI Assistant Unavailable
                </div>
                <p className="leading-relaxed text-slate-300">{error}</p>
                <p className="text-[11px] text-slate-400">
                  All campaign management operations remain active. Configure GEMINI_API_KEY (Get a free key at aistudio.google.com) in your backend environment.
                </p>
              </div>
            )}

            {/* TAB 1: SUMMARIZE CAMPAIGN */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Synthesize current story angles and background notes into a structured summary and talking points for media pitches.
                </p>

                <button
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Campaign...
                    </>
                  ) : (
                    "✨ Generate AI Summary"
                  )}
                </button>

                {summaryOutput && (
                  <div className="glass-panel rounded-2xl p-4 space-y-3 animate-in fade-in">
                    <div>
                      <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                        Concise Summary
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {summaryOutput.summary}
                      </p>
                    </div>

                    {summaryOutput.talkingPoints.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Key Talking Points
                        </h4>
                        <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                          {summaryOutput.talkingPoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={async () => {
                          await onApplySummary(summaryOutput.summary);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/25"
                      >
                        ✓ Apply Summary to Campaign Field
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SUGGEST NEXT ACTION */}
            {activeTab === "next_action" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Analyze workflow stage (<span className="text-indigo-400 font-bold">{campaign.status}</span>) and target publication to recommend the optimal next action.
                </p>

                <button
                  onClick={handleSuggestNextAction}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Evaluating Strategy...
                    </>
                  ) : (
                    "🎯 Get AI Action Recommendation"
                  )}
                </button>

                {nextActionOutput && (
                  <div className="glass-panel rounded-2xl p-4 space-y-3 animate-in fade-in">
                    <div>
                      <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                        Suggested Next Action
                      </h4>
                      <p className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 p-3 rounded-xl">
                        {nextActionOutput.action}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Strategy Reasoning
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {nextActionOutput.reasoning}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={async () => {
                          await onApplyNextAction(nextActionOutput.action);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/25"
                      >
                        ✓ Apply to Campaign Next Action
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DRAFT FOLLOW-UP EMAIL */}
            {activeTab === "draft_followup" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Pitch Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Professional and persuasive" className="bg-slate-900">Professional & Persuasive</option>
                    <option value="Urgent news hook" className="bg-slate-900">Urgent News Hook</option>
                    <option value="Friendly and concise" className="bg-slate-900">Friendly & Concise</option>
                    <option value="Exclusive pitch embargo" className="bg-slate-900">Exclusive Embargo Pitch</option>
                  </select>
                </div>

                <button
                  onClick={handleDraftFollowup}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Drafting Pitch...
                    </>
                  ) : (
                    "✉️ Generate Media Pitch Email"
                  )}
                </button>

                {draftOutput && (
                  <div className="glass-panel rounded-2xl p-4 space-y-3 animate-in fade-in">
                    <div>
                      <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                        Subject Line
                      </h4>
                      <p className="text-xs font-bold text-white bg-slate-950 p-2.5 rounded-xl border border-white/10">
                        {draftOutput.subject}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Email Body
                      </h4>
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                        {draftOutput.body}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={handleCopyEmail}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25"
                      >
                        {copied ? "✓ Copied to Clipboard!" : "📋 Copy Pitch Draft to Clipboard"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
