from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    CampaignCreate,
    CampaignUpdate,
    CampaignResponse,
    CampaignDetailResponse,
    ActivityLogResponse
)
from app.services import campaign_service

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])


@router.get("", response_model=List[CampaignResponse])
def list_campaigns(
    status: Optional[str] = Query(None, description="Filter by campaign status"),
    priority: Optional[str] = Query(None, description="Filter by priority (LOW, MEDIUM, HIGH)"),
    search: Optional[str] = Query(None, description="Search term for title or client name"),
    db: Session = Depends(get_db)
):
    return campaign_service.get_campaigns(db, status=status, priority=priority, search=search)


@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    campaign_in: CampaignCreate,
    db: Session = Depends(get_db)
):
    return campaign_service.create_campaign(db, campaign_in)


@router.get("/{campaign_id}", response_model=CampaignDetailResponse)
def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db)
):
    campaign = campaign_service.get_campaign_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campaign with ID {campaign_id} not found"
        )
    return campaign


@router.patch("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    campaign_id: int,
    campaign_update: CampaignUpdate,
    db: Session = Depends(get_db)
):
    campaign = campaign_service.update_campaign(db, campaign_id, campaign_update)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campaign with ID {campaign_id} not found"
        )
    return campaign


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: int,
    db: Session = Depends(get_db)
):
    success = campaign_service.delete_campaign(db, campaign_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campaign with ID {campaign_id} not found"
        )
    return None


@router.get("/{campaign_id}/activity", response_model=List[ActivityLogResponse])
def get_campaign_activity(
    campaign_id: int,
    db: Session = Depends(get_db)
):
    campaign = campaign_service.get_campaign_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campaign with ID {campaign_id} not found"
        )
    return campaign_service.get_activity_logs(db, campaign_id)
