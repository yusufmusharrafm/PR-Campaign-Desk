from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models import Campaign, ActivityLog
from app.schemas import CampaignCreate, CampaignUpdate


def get_campaigns(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None
) -> List[Campaign]:
    query = db.query(Campaign)

    if status:
        query = query.filter(Campaign.status == status)

    if priority:
        query = query.filter(Campaign.priority == priority)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Campaign.title.ilike(search_pattern),
                Campaign.client_name.ilike(search_pattern),
                Campaign.target_publication.ilike(search_pattern)
            )
        )

    return query.order_by(Campaign.updated_at.desc()).all()


def create_campaign(db: Session, campaign_in: CampaignCreate, actor: str = "PR Professional") -> Campaign:
    campaign_data = campaign_in.model_dump()
    campaign = Campaign(**campaign_data)
    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    # Log initial creation event
    log = ActivityLog(
        campaign_id=campaign.id,
        action_type="CREATED",
        description=f"Campaign '{campaign.title}' created.",
        actor=actor
    )
    db.add(log)
    db.commit()
    db.refresh(campaign)

    return campaign


def get_campaign_by_id(db: Session, campaign_id: int) -> Optional[Campaign]:
    return db.query(Campaign).filter(Campaign.id == campaign_id).first()


def update_campaign(
    db: Session,
    campaign_id: int,
    campaign_update: CampaignUpdate,
    actor: str = "PR Professional"
) -> Optional[Campaign]:
    campaign = get_campaign_by_id(db, campaign_id)
    if not campaign:
        return None

    update_data = campaign_update.model_dump(exclude_unset=True)
    if not update_data:
        return campaign

    changes_logged = []

    # Track status change specifically
    if "status" in update_data and update_data["status"] != campaign.status:
        old_status = campaign.status
        new_status = update_data["status"]
        log = ActivityLog(
            campaign_id=campaign.id,
            action_type="STATUS_CHANGE",
            description=f"Status moved from {old_status} to {new_status}.",
            actor=actor
        )
        db.add(log)
        changes_logged.append("status")

    # Track other field changes
    other_fields = [k for k in update_data.keys() if k != "status" and getattr(campaign, k) != update_data[k]]
    if other_fields:
        field_list = ", ".join(other_fields)
        log = ActivityLog(
            campaign_id=campaign.id,
            action_type="FIELD_UPDATE",
            description=f"Updated field(s): {field_list}.",
            actor=actor
        )
        db.add(log)

    # Apply updates to ORM object
    for field, value in update_data.items():
        setattr(campaign, field, value)

    campaign.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(campaign)
    return campaign


def delete_campaign(db: Session, campaign_id: int) -> bool:
    campaign = get_campaign_by_id(db, campaign_id)
    if not campaign:
        return False

    db.delete(campaign)
    db.commit()
    return True


def get_activity_logs(db: Session, campaign_id: int) -> List[ActivityLog]:
    return db.query(ActivityLog).filter(ActivityLog.campaign_id == campaign_id).order_by(ActivityLog.timestamp.desc()).all()
