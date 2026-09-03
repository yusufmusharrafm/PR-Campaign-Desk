"use client";

import React from "react";
import Link from "next/link";
import { Campaign, ALL_STATUSES } from "@/lib/types";
import { PriorityBadge } from "../ui/PriorityBadge";

interface StatusGroupViewProps {
  campaigns: Campaign[];
}

export const StatusGroupView: React.FC<StatusGroupViewProps> = ({ campaigns }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {ALL_STATUSES.map((statusObj) => {
        const stageCampaigns = campaigns.filter((c) => c.status === statusObj.key);

        return (
          <div
            key={statusObj.key}
            className="glass-panel rounded-2xl p-4 flex flex-col h-full min-h-[340px] shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                {statusObj.label}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 border border-white/10 text-indigo-300">
                {stageCampaigns.length}
              </span>
            </div>

            {/* Campaign Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {stageCampaigns.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl bg-slate-950/30">
                  No campaigns
                </div>
              ) : (
                stageCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className="block glass-panel glass-panel-hover rounded-xl p-4 transition-all shadow-md group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {campaign.title}
                      </h4>
                      <PriorityBadge priority={campaign.priority} />
                    </div>

                    <p className="text-xs text-slate-400 mb-2">
                      Client: <span className="text-slate-200 font-medium">{campaign.client_name}</span>
                    </p>

                    {campaign.target_publication && (
                      <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                        <span className="text-slate-500">Target:</span>
                        <span className="text-indigo-300 font-semibold">{campaign.target_publication}</span>
                      </div>
                    )}

                    {campaign.next_action && (
                      <div className="mt-2.5 pt-2 border-t border-white/5 text-[11px] text-slate-300 line-clamp-1 bg-indigo-500/5 px-2 py-1 rounded border border-indigo-500/10">
                        <span className="text-indigo-400 font-bold">Next: </span>
                        {campaign.next_action}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{campaign.assigned_person || "Unassigned"}</span>
                      {campaign.deadline && <span className="text-slate-400">Due {campaign.deadline}</span>}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
