import {
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  CampaignDetail,
  ActivityLog,
  AISummarizeResponse,
  AINextActionResponse,
  AIDraftFollowupResponse,
} from "./types";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") return "/api";
  return "http://127.0.0.1:8000/api";
};

const API_BASE_URL = getApiBaseUrl();

export async function fetchCampaigns(params?: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<Campaign[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.priority) query.append("priority", params.priority);
  if (params?.search) query.append("search", params.search);

  const url = `${API_BASE_URL}/campaigns${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch campaigns: ${res.statusText}`);
  }
  return res.json();
}

export async function createCampaign(data: CampaignCreate): Promise<Campaign> {
  const res = await fetch(`${API_BASE_URL}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create campaign: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCampaignById(id: number): Promise<CampaignDetail> {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch campaign #${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function updateCampaign(
  id: number,
  data: CampaignUpdate
): Promise<Campaign> {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update campaign #${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteCampaign(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete campaign #${id}: ${res.statusText}`);
  }
}

export async function fetchCampaignActivity(id: number): Promise<ActivityLog[]> {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}/activity`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch activity for campaign #${id}: ${res.statusText}`);
  }
  return res.json();
}

// --- AI Assistant API Calls ---
export async function aiSummarize(data: {
  story_summary?: string | null;
  notes?: string | null;
}): Promise<AISummarizeResponse> {
  const res = await fetch(`${API_BASE_URL}/ai/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "AI Assistant is unavailable.");
  }
  return res.json();
}

export async function aiSuggestNextAction(data: {
  status: string;
  target_publication?: string | null;
  story_summary?: string | null;
  notes?: string | null;
}): Promise<AINextActionResponse> {
  const res = await fetch(`${API_BASE_URL}/ai/suggest-next-action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "AI Assistant is unavailable.");
  }
  return res.json();
}

export async function aiDraftFollowup(data: {
  client_name: string;
  target_publication?: string | null;
  story_summary?: string | null;
  tone?: string;
}): Promise<AIDraftFollowupResponse> {
  const res = await fetch(`${API_BASE_URL}/ai/draft-followup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "AI Assistant is unavailable.");
  }
  return res.json();
}
