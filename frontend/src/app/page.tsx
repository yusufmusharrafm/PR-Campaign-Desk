"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Campaign,
  CampaignCreate,
  ALL_STATUSES,
  ALL_PRIORITIES,
} from "@/lib/types";
import { fetchCampaigns, createCampaign } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { NewCampaignModal } from "@/components/campaigns/NewCampaignModal";
import { StatusGroupView } from "@/components/campaigns/StatusGroupView";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaigns({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: search.trim() || undefined,
      });
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message || "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter, search]);

  const handleCreateCampaign = async (formData: CampaignCreate) => {
    await createCampaign(formData);
    await loadData();
  };

  // Metric Stats calculations
  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status !== "COMPLETED").length;
    const highPriority = campaigns.filter((c) => c.priority === "HIGH").length;
    const completed = campaigns.filter((c) => c.status === "COMPLETED").length;
    return { total, active, highPriority, completed };
  }, [campaigns]);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative">
      {/* Top Glass Navbar */}
      <header className="border-b border-white/10 glass-panel sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-500/30">
              PR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight leading-none">
                  PR Campaign Desk
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Internal campaign operations workspace for modern PR agencies
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <span className="text-sm">+</span> New Campaign
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Total Campaigns
              </p>
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm font-bold">
                📁
              </span>
            </div>
            <p className="text-3xl font-black text-white mt-2 tracking-tight">{stats.total}</p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Active Campaigns
              </p>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-bold">
                ⚡
              </span>
            </div>
            <p className="text-3xl font-black text-indigo-400 mt-2 tracking-tight">{stats.active}</p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                High Priority
              </p>
              <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center text-sm font-bold">
                🔥
              </span>
            </div>
            <p className="text-3xl font-black text-rose-400 mt-2 tracking-tight">{stats.highPriority}</p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Completed
              </p>
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm font-bold">
                ✓
              </span>
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-2 tracking-tight">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Controls & View Switcher */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          {/* Search and Filters */}
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, client, publication..."
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none"
              >
                <option value="" className="bg-slate-900">All Stages</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s.key} value={s.key} className="bg-slate-900">
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="glass-input rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none"
              >
                <option value="" className="bg-slate-900">All Priorities</option>
                {ALL_PRIORITIES.map((p) => (
                  <option key={p.key} value={p.key} className="bg-slate-900">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Switcher Toggle */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-white/10 rounded-xl p-1.5 backdrop-blur-md">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Status Grouping
            </button>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-300">Loading campaign dashboard...</p>
          </div>
        ) : error ? (
          <div className="glass-panel border-rose-500/30 rounded-2xl p-8 text-center text-rose-300 space-y-3 shadow-xl">
            <p className="font-bold text-lg">Unable to load campaigns</p>
            <p className="text-sm text-slate-400">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto text-2xl font-bold border border-indigo-500/20">
              📋
            </div>
            <h3 className="text-xl font-bold text-white">No campaigns found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              No campaign matches your current search or filter criteria. Create a new campaign to get started.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-indigo-600/30"
            >
              + Create Campaign
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <StatusGroupView campaigns={campaigns} />
        ) : (
          /* Table View */
          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Campaign & Client</th>
                    <th className="px-6 py-4">Stage</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Target Publication</th>
                    <th className="px-6 py-4">Assigned Pro</th>
                    <th className="px-6 py-4">Next Action Strategy</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="font-bold text-white group-hover:text-indigo-300 transition-colors block text-sm"
                        >
                          {campaign.title}
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">
                          {campaign.client_name}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={campaign.status} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityBadge priority={campaign.priority} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-indigo-300 font-semibold text-xs">
                        {campaign.target_publication || "—"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-300 text-xs">
                        {campaign.assigned_person || "Unassigned"}
                      </td>

                      <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-300">
                        {campaign.next_action || "—"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-600/30 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          Open Workspace →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* New Campaign Modal */}
      <NewCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
    </div>
  );
}
