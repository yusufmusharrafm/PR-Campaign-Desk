from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    client_name = Column(String(255), nullable=False, index=True)
    status = Column(String(50), nullable=False, default="NEW", index=True)
    priority = Column(String(20), nullable=False, default="MEDIUM", index=True)
    deadline = Column(Date, nullable=True)
    assigned_person = Column(String(100), nullable=True)
    target_publication = Column(String(255), nullable=True)
    story_summary = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    next_action = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    activity_logs = relationship(
        "ActivityLog",
        back_populates="campaign",
        cascade="all, delete-orphan",
        order_by="desc(ActivityLog.timestamp)"
    )


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True)
    action_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    actor = Column(String(100), nullable=False, default="PR Professional")
    timestamp = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    campaign = relationship("Campaign", back_populates="activity_logs")
