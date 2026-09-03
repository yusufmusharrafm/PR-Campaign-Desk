import {
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  CampaignDetail,
  ActivityLog,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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
