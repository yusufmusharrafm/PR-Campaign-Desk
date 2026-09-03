import pytest
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import Campaign, ActivityLog
from app.schemas import CampaignCreate, CampaignUpdate, CampaignResponse, ActivityLogCreate, ActivityLogResponse

# In-memory SQLite DB for testing models
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture
def db_session():
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_create_campaign_model(db_session):
    campaign = Campaign(
        title="AI Series Launch",
        client_name="TechCorp",
        status="NEW",
        priority="HIGH",
        deadline=date(2026, 10, 15),
        assigned_person="Sarah Jenkins",
        target_publication="TechCrunch",
        story_summary="Launching a series on enterprise AI agents.",
        notes="Client wants tech publication priority.",
        next_action="Draft initial outline"
    )
    db_session.add(campaign)
    db_session.commit()
    db_session.refresh(campaign)

    assert campaign.id is not None
    assert campaign.title == "AI Series Launch"
    assert campaign.client_name == "TechCorp"
    assert campaign.status == "NEW"
    assert campaign.priority == "HIGH"
    assert campaign.created_at is not None


def test_campaign_activity_log_relationship(db_session):
    campaign = Campaign(
        title="Fintech App Pitch",
        client_name="PayQuick",
        status="STORY_DEVELOPMENT"
    )
    db_session.add(campaign)
    db_session.commit()
    db_session.refresh(campaign)

    log1 = ActivityLog(
        campaign_id=campaign.id,
        action_type="CREATED",
        description="Campaign created.",
        actor="Sarah Jenkins"
    )
    log2 = ActivityLog(
        campaign_id=campaign.id,
        action_type="STATUS_CHANGE",
        description="Moved status to STORY_DEVELOPMENT.",
        actor="Sarah Jenkins"
    )
    db_session.add_all([log1, log2])
    db_session.commit()
    db_session.refresh(campaign)

    assert len(campaign.activity_logs) == 2
    assert campaign.activity_logs[0].action_type in ["CREATED", "STATUS_CHANGE"]


def test_pydantic_schema_validation():
    # Valid Campaign Create
    valid_data = CampaignCreate(
        title="Product Launch",
        client_name="Acme Inc",
        priority="HIGH"
    )
    assert valid_data.title == "Product Launch"
    assert valid_data.status == "NEW"  # Default value

    # Invalid status should raise ValidationError
    with pytest.raises(Exception):
        CampaignCreate(
            title="Product Launch",
            client_name="Acme Inc",
            status="INVALID_STATUS"  # Not in Literal enum
        )
