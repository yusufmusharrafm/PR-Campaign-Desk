import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models import Campaign, ActivityLog
from seed import seed_data

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_seed_data_populates_all_stages(db_session):
    seed_data(db_session)

    campaigns = db_session.query(Campaign).all()
    assert len(campaigns) == 8

    # Verify all 8 workflow stages are covered
    expected_stages = {
        "NEW",
        "STORY_DEVELOPMENT",
        "ARTICLE_DRAFT",
        "CLIENT_REVIEW",
        "APPROVED",
        "MEDIA_OUTREACH",
        "PUBLISHED",
        "COMPLETED"
    }
    actual_stages = {c.status for c in campaigns}
    assert actual_stages == expected_stages

    # Verify activity logs
    activity_logs = db_session.query(ActivityLog).all()
    assert len(activity_logs) >= 8
