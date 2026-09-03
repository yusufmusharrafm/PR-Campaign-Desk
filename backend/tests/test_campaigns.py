import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_create_and_get_campaign():
    payload = {
        "title": "Quantum Computing Series",
        "client_name": "DeepTech Labs",
        "priority": "HIGH",
        "assigned_person": "Alex Vance",
        "target_publication": "Wired",
        "story_summary": "Breakthrough in quantum error correction.",
        "notes": "Exclusive pitch embargoed until Friday.",
        "next_action": "Draft article outline"
    }

    # 1. Create Campaign
    response = client.post("/api/campaigns", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == "Quantum Computing Series"
    assert data["status"] == "NEW"
    assert data["priority"] == "HIGH"
    campaign_id = data["id"]

    # 2. Get Detailed Campaign
    detail_res = client.get(f"/api/campaigns/{campaign_id}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["id"] == campaign_id
    assert len(detail_data["activity_logs"]) == 1
    assert detail_data["activity_logs"][0]["action_type"] == "CREATED"


def test_update_campaign_and_status_transition_logging():
    # Create initial campaign
    payload = {"title": "Green Energy Launch", "client_name": "EcoVolt"}
    res = client.post("/api/campaigns", json=payload)
    campaign_id = res.json()["id"]

    # Patch status transition: NEW -> STORY_DEVELOPMENT
    patch_payload = {
        "status": "STORY_DEVELOPMENT",
        "next_action": "Interview lead engineer"
    }
    patch_res = client.patch(f"/api/campaigns/{campaign_id}", json=patch_payload)
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "STORY_DEVELOPMENT"

    # Verify Activity Log recorded STATUS_CHANGE
    activity_res = client.get(f"/api/campaigns/{campaign_id}/activity")
    assert activity_res.status_code == 200
    logs = activity_res.json()
    action_types = [log["action_type"] for log in logs]
    assert "STATUS_CHANGE" in action_types
    assert "CREATED" in action_types


def test_list_and_filter_campaigns():
    # Seed 2 campaigns
    client.post("/api/campaigns", json={"title": "AI Summit", "client_name": "CloudCorp", "priority": "HIGH", "status": "APPROVED"})
    client.post("/api/campaigns", json={"title": "BioTech Breakthrough", "client_name": "BioHealth", "priority": "LOW", "status": "NEW"})

    # Filter by status=APPROVED
    res_status = client.get("/api/campaigns?status=APPROVED")
    assert res_status.status_code == 200
    assert len(res_status.json()) == 1
    assert res_status.json()[0]["title"] == "AI Summit"

    # Filter by priority=HIGH
    res_priority = client.get("/api/campaigns?priority=HIGH")
    assert res_priority.status_code == 200
    assert len(res_priority.json()) == 1

    # Search filter
    res_search = client.get("/api/campaigns?search=BioTech")
    assert res_search.status_code == 200
    assert len(res_search.json()) == 1
    assert res_search.json()[0]["client_name"] == "BioHealth"


def test_delete_campaign():
    res = client.post("/api/campaigns", json={"title": "Temporary PR", "client_name": "Temp Client"})
    campaign_id = res.json()["id"]

    del_res = client.delete(f"/api/campaigns/{campaign_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/campaigns/{campaign_id}")
    assert get_res.status_code == 404
