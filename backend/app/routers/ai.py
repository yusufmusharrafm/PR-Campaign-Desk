from fastapi import APIRouter
from app.schemas import (
    AISummarizeRequest,
    AISummarizeResponse,
    AINextActionRequest,
    AINextActionResponse,
    AIDraftFollowupRequest,
    AIDraftFollowupResponse
)
from app.services import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


@router.post("/summarize", response_model=AISummarizeResponse)
def summarize_campaign(req: AISummarizeRequest):
    return ai_service.summarize_campaign(
        story_summary=req.story_summary,
        notes=req.notes
    )


@router.post("/suggest-next-action", response_model=AINextActionResponse)
def suggest_next_action(req: AINextActionRequest):
    return ai_service.suggest_next_action(
        status_stage=req.status,
        target_publication=req.target_publication,
        story_summary=req.story_summary,
        notes=req.notes
    )


@router.post("/draft-followup", response_model=AIDraftFollowupResponse)
def draft_followup(req: AIDraftFollowupRequest):
    return ai_service.draft_followup(
        client_name=req.client_name,
        target_publication=req.target_publication,
        story_summary=req.story_summary,
        tone=req.tone
    )
