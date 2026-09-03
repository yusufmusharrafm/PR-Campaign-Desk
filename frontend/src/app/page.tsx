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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              PR
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                PR Campaign Desk
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Campaign operations workspace for modern PR teams
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <span>+</span> New Campaign
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Campaigns
            </p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Campaigns
            </p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{stats.active}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              High Priority
            </p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{stats.highPriority}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Controls & View Switcher */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, client, publication..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Stages</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Priorities</option>
                {ALL_PRIORITIES.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Switcher Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Status Grouping
            </button>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm">Loading campaigns...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 text-center text-rose-400 space-y-2">
            <p className="font-semibold">Unable to load campaigns</p>
            <p className="text-sm text-slate-400">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              Retry Connection
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto text-xl font-bold">
              📋
            </div>
            <h3 className="text-lg font-semibold text-white">No campaigns found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              No campaign matches your current search or filter criteria. Create a new campaign to get started.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              + Create Campaign
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <StatusGroupView campaigns={campaigns} />
        ) : (
          /* Table View */
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                  <tr>
                    <th className="px-6 py-3.5">Campaign & Client</th>
                    <th className="px-6 py-3.5">Stage</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Target Publication</th>
                    <th className="px-6 py-3.5">Assigned Pro</th>
                    <th className="px-6 py-3.5">Next Action</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="font-semibold text-white group-hover:text-indigo-400 transition-colors block"
                        >
                          {campaign.title}
                        </Link>
                        <span className="text-xs text-slate-400">
                          {campaign.client_name}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={campaign.status} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityBadge priority={campaign.priority} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                        {campaign.target_publication || "—"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {campaign.assigned_person || "Unassigned"}
                      </td>

                      <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-400">
                        {campaign.next_action || "—"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors"
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
