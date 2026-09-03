export type CampaignStatus =
  | "NEW"
  | "STORY_DEVELOPMENT"
  | "ARTICLE_DRAFT"
  | "CLIENT_REVIEW"
  | "APPROVED"
  | "MEDIA_OUTREACH"
  | "PUBLISHED"
  | "COMPLETED";

export type CampaignPriority = "LOW" | "MEDIUM" | "HIGH";

export const ALL_STATUSES: { key: CampaignStatus; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "STORY_DEVELOPMENT", label: "Story Dev" },
  { key: "ARTICLE_DRAFT", label: "Article Draft" },
  { key: "CLIENT_REVIEW", label: "Client Review" },
  { key: "APPROVED", label: "Approved" },
  { key: "MEDIA_OUTREACH", label: "Media Outreach" },
  { key: "PUBLISHED", label: "Published" },
  { key: "COMPLETED", label: "Completed" },
];

export const ALL_PRIORITIES: { key: CampaignPriority; label: string }[] = [
  { key: "LOW", label: "Low" },
  { key: "MEDIUM", label: "Medium" },
  { key: "HIGH", label: "High" },
];

export interface Campaign {
  id: number;
  title: string;
  client_name: string;
  status: CampaignStatus;
  priority: CampaignPriority;
  deadline?: string | null;
  assigned_person?: string | null;
  target_publication?: string | null;
  story_summary?: string | null;
  notes?: string | null;
  next_action?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignCreate {
  title: string;
  client_name: string;
  status?: CampaignStatus;
  priority?: CampaignPriority;
  deadline?: string | null;
  assigned_person?: string | null;
  target_publication?: string | null;
  story_summary?: string | null;
  notes?: string | null;
  next_action?: string | null;
}

export interface CampaignUpdate {
  title?: string;
  client_name?: string;
  status?: CampaignStatus;
  priority?: CampaignPriority;
  deadline?: string | null;
  assigned_person?: string | null;
  target_publication?: string | null;
  story_summary?: string | null;
  notes?: string | null;
  next_action?: string | null;
}

export interface ActivityLog {
  id: number;
  campaign_id: number;
  action_type: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface CampaignDetail extends Campaign {
  activity_logs: ActivityLog[];
}

// --- AI Assistant Types ---
export interface AISummarizeResponse {
  concise_summary: string;
  key_talking_points: string[];
}

export interface AINextActionResponse {
  suggested_next_action: string;
  reasoning: string;
}

export interface AIDraftFollowupResponse {
  subject: string;
  body: string;
}
