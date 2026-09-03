from datetime import date, datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, ConfigDict, Field

# Core Enums/Types
CampaignStatus = Literal[
    "NEW",
    "STORY_DEVELOPMENT",
    "ARTICLE_DRAFT",
    "CLIENT_REVIEW",
    "APPROVED",
    "MEDIA_OUTREACH",
    "PUBLISHED",
    "COMPLETED"
]

CampaignPriority = Literal["LOW", "MEDIUM", "HIGH"]


# --- Activity Log Schemas ---
class ActivityLogBase(BaseModel):
    action_type: str = Field(..., description="E.g. CREATED, STATUS_CHANGE, NOTE_ADDED, AI_ASSIST_USED")
    description: str
    actor: str = "PR Professional"


class ActivityLogCreate(ActivityLogBase):
    campaign_id: int


class ActivityLogResponse(ActivityLogBase):
    id: int
    campaign_id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Campaign Schemas ---
class CampaignBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    client_name: str = Field(..., min_length=1, max_length=255)
    status: CampaignStatus = "NEW"
    priority: CampaignPriority = "MEDIUM"
    deadline: Optional[date] = None
    assigned_person: Optional[str] = Field(None, max_length=100)
    target_publication: Optional[str] = Field(None, max_length=255)
    story_summary: Optional[str] = None
    notes: Optional[str] = None
    next_action: Optional[str] = None


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    client_name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[CampaignStatus] = None
    priority: Optional[CampaignPriority] = None
    deadline: Optional[date] = None
    assigned_person: Optional[str] = Field(None, max_length=100)
    target_publication: Optional[str] = Field(None, max_length=255)
    story_summary: Optional[str] = None
    notes: Optional[str] = None
    next_action: Optional[str] = None


class CampaignResponse(CampaignBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CampaignDetailResponse(CampaignResponse):
    activity_logs: List[ActivityLogResponse] = []

    model_config = ConfigDict(from_attributes=True)


# --- AI Assistant Schemas ---
class AISummarizeRequest(BaseModel):
    story_summary: Optional[str] = None
    notes: Optional[str] = None


class AISummarizeResponse(BaseModel):
    concise_summary: str
    key_talking_points: List[str]


class AINextActionRequest(BaseModel):
    status: str
    target_publication: Optional[str] = None
    story_summary: Optional[str] = None
    notes: Optional[str] = None


class AINextActionResponse(BaseModel):
    suggested_next_action: str
    reasoning: str


class AIDraftFollowupRequest(BaseModel):
    client_name: str
    target_publication: Optional[str] = None
    story_summary: Optional[str] = None
    tone: Optional[str] = "Professional and persuasive"


class AIDraftFollowupResponse(BaseModel):
    subject: str
    body: str

