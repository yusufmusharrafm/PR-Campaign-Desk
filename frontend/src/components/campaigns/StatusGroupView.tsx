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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {ALL_STATUSES.map((statusObj) => {
        const stageCampaigns = campaigns.filter((c) => c.status === statusObj.key);

        return (
          <div
            key={statusObj.key}
            className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col h-full min-h-[320px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <h3 className="text-sm font-semibold text-slate-200">{statusObj.label}</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                {stageCampaigns.length}
              </span>
            </div>

            {/* Campaign Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {stageCampaigns.length === 0 ? (
                <div className="h-28 flex items-center justify-center text-xs text-slate-600 border border-dashed border-slate-800/60 rounded-lg">
                  No campaigns
                </div>
              ) : (
                stageCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className="block bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 rounded-lg p-3.5 transition-all shadow-sm group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {campaign.title}
                      </h4>
                      <PriorityBadge priority={campaign.priority} />
                    </div>

                    <p className="text-xs text-slate-400 mb-2">
                      Client: <span className="text-slate-300 font-medium">{campaign.client_name}</span>
                    </p>

                    {campaign.target_publication && (
                      <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                        <span className="text-slate-500">Target:</span>
                        <span className="text-indigo-300 font-medium">{campaign.target_publication}</span>
                      </div>
                    )}

                    {campaign.next_action && (
                      <div className="mt-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400 line-clamp-1">
                        <span className="text-slate-500">Next: </span>
                        {campaign.next_action}
                      </div>
                    )}

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{campaign.assigned_person || "Unassigned"}</span>
                      {campaign.deadline && <span>Due {campaign.deadline}</span>}
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
