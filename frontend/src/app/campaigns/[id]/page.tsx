"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CampaignDetail, CampaignStatus, Campaign } from "@/lib/types";
import { fetchCampaignById, updateCampaign, deleteCampaign } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusStepper } from "@/components/campaigns/StatusStepper";
import { CampaignDetailsEditor } from "@/components/campaigns/CampaignDetailsEditor";
import { ActivityTimeline } from "@/components/campaigns/ActivityTimeline";
import { AICopilotDrawer } from "@/components/ai/AICopilotDrawer";

export default function CampaignWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const campaignId = parseInt(resolvedParams.id, 10);
  const router = useRouter();

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaignById(campaignId);
      setCampaign(data);
    } catch (err: any) {
      setError(err.message || "Failed to load campaign.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(campaignId)) {
      loadCampaign();
    }
  }, [campaignId]);

  const handleStatusChange = async (newStatus: CampaignStatus) => {
    if (!campaign) return;
    try {
      await updateCampaign(campaign.id, { status: newStatus });
      await loadCampaign();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleSaveDetails = async (updatedFields: Partial<Campaign>) => {
    if (!campaign) return;
    await updateCampaign(campaign.id, updatedFields);
    await loadCampaign();
  };

  const handleApplyAISummary = async (newSummary: string) => {
    if (!campaign) return;
    await updateCampaign(campaign.id, { story_summary: newSummary });
    await loadCampaign();
  };

  const handleApplyAINextAction = async (newAction: string) => {
    if (!campaign) return;
    await updateCampaign(campaign.id, { next_action: newAction });
    await loadCampaign();
  };

  const handleDelete = async () => {
    if (!campaign) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete campaign "${campaign.title}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteCampaign(campaign.id);
      router.push("/");
    } catch (err: any) {
      alert(`Failed to delete campaign: ${err.message}`);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-400">Loading Campaign Workspace...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen text-slate-100 p-8 flex flex-col items-center justify-center space-y-5">
        <div className="glass-panel border-rose-500/30 rounded-2xl p-8 text-center max-w-md text-rose-300 space-y-3 shadow-xl">
          <p className="font-bold text-lg">Campaign Not Found</p>
          <p className="text-sm text-slate-400">{error || "Invalid Campaign ID"}</p>
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
        >
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Top Glass Header */}
      <header className="border-b border-white/10 glass-panel sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 transition-all border border-white/10 shadow-sm"
            >
              ← Dashboard
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {campaign.title}
                </h1>
                <StatusBadge status={campaign.status} size="sm" />
                <PriorityBadge priority={campaign.priority} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Client: <span className="text-slate-200 font-semibold">{campaign.client_name}</span>
                {campaign.target_publication && (
                  <> • Target: <span className="text-indigo-300 font-semibold">{campaign.target_publication}</span></>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAIDrawerOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
            >
              <span>🤖</span> AI Copilot
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Interactive Lifecycle Stepper */}
        <StatusStepper
          currentStatus={campaign.status}
          onStatusChange={handleStatusChange}
        />

        {/* 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Details & Notes Editor (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-8">
            <CampaignDetailsEditor
              campaign={campaign}
              onSave={handleSaveDetails}
            />
          </div>

          {/* Audit Activity Timeline (1 Column wide) */}
          <div className="space-y-8">
            <ActivityTimeline logs={campaign.activity_logs} />
          </div>
        </div>
      </main>

      {/* AI Assistant Copilot Slide-over Drawer */}
      <AICopilotDrawer
        campaign={campaign}
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        onApplySummary={handleApplyAISummary}
        onApplyNextAction={handleApplyAINextAction}
      />
    </div>
  );
}
