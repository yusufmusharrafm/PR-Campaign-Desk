import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)


def test_ai_unavailable_when_key_missing():
    with patch.object(settings, "GEMINI_API_KEY", None):
        res = client.post("/api/ai/summarize", json={"story_summary": "Test story"})
        assert res.status_code == 503
        assert "AI Assistant unavailable" in res.json()["detail"]


@patch("app.services.ai_service._generate_ai_json")
def test_ai_summarize_mocked(mock_ai_json):
    with patch.object(settings, "GEMINI_API_KEY", "mock-gemini-key"):
        mock_ai_json.return_value = {
            "concise_summary": "NeuroTech AI raised $15M for BCI tech.",
            "key_talking_points": ["Series A funding", "Led by Sequoia", "SDK launch"]
        }

        res = client.post(
            "/api/ai/summarize",
            json={"story_summary": "NeuroTech AI $15M funding", "notes": "Embargoed"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["concise_summary"] == "NeuroTech AI raised $15M for BCI tech."
        assert len(data["key_talking_points"]) == 3


@patch("app.services.ai_service._generate_ai_json")
def test_ai_suggest_next_action_mocked(mock_ai_json):
    with patch.object(settings, "GEMINI_API_KEY", "mock-gemini-key"):
        mock_ai_json.return_value = {
            "suggested_next_action": "Draft press release outline for client review.",
            "reasoning": "Campaign is in STORY_DEVELOPMENT stage."
        }

        res = client.post(
            "/api/ai/suggest-next-action",
            json={"status": "STORY_DEVELOPMENT", "target_publication": "TechCrunch"}
        )
        assert res.status_code == 200
        data = res.json()
        assert "Draft press release" in data["suggested_next_action"]
        assert "STORY_DEVELOPMENT" in data["reasoning"]


@patch("app.services.ai_service._generate_ai_json")
def test_ai_draft_followup_mocked(mock_ai_json):
    with patch.object(settings, "GEMINI_API_KEY", "mock-gemini-key"):
        mock_ai_json.return_value = {
            "subject": "Exclusive: NeuroTech AI Series A Funding",
            "body": "Hi [Editor Name], I wanted to share..."
        }

        res = client.post(
            "/api/ai/draft-followup",
            json={"client_name": "NeuroTech AI", "target_publication": "TechCrunch"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["subject"] == "Exclusive: NeuroTech AI Series A Funding"
        assert "[Editor Name]" in data["body"]
