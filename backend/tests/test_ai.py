import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)


def test_ai_unavailable_when_key_missing():
    with patch.object(settings, "OPENAI_API_KEY", None):
        res = client.post("/api/ai/summarize", json={"story_summary": "Test story"})
        assert res.status_code == 503
        assert "AI Assistant unavailable" in res.json()["detail"]


@patch("app.services.ai_service.OpenAI")
def test_ai_summarize_mocked(mock_openai_cls):
    with patch.object(settings, "OPENAI_API_KEY", "sk-mock-test-key"):
        # Setup mock OpenAI completion response
        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(
                message=MagicMock(
                    content='{"concise_summary": "NeuroTech AI raised $15M for BCI tech.", "key_talking_points": ["Series A funding", "Led by Sequoia", "SDK launch"]}'
                )
            )
        ]
        mock_client.chat.completions.create.return_value = mock_response

        res = client.post(
            "/api/ai/summarize",
            json={"story_summary": "NeuroTech AI $15M funding", "notes": "Emabargoed"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["concise_summary"] == "NeuroTech AI raised $15M for BCI tech."
        assert len(data["key_talking_points"]) == 3


@patch("app.services.ai_service.OpenAI")
def test_ai_suggest_next_action_mocked(mock_openai_cls):
    with patch.object(settings, "OPENAI_API_KEY", "sk-mock-test-key"):
        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(
                message=MagicMock(
                    content='{"suggested_next_action": "Draft press release outline for client review.", "reasoning": "Campaign is in STORY_DEVELOPMENT stage."}'
                )
            )
        ]
        mock_client.chat.completions.create.return_value = mock_response

        res = client.post(
            "/api/ai/suggest-next-action",
            json={"status": "STORY_DEVELOPMENT", "target_publication": "TechCrunch"}
        )
        assert res.status_code == 200
        data = res.json()
        assert "Draft press release" in data["suggested_next_action"]
        assert "STORY_DEVELOPMENT" in data["reasoning"]


@patch("app.services.ai_service.OpenAI")
def test_ai_draft_followup_mocked(mock_openai_cls):
    with patch.object(settings, "OPENAI_API_KEY", "sk-mock-test-key"):
        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(
                message=MagicMock(
                    content='{"subject": "Exclusive: NeuroTech AI Series A Funding", "body": "Hi [Editor Name], I wanted to share..."}'
                )
            )
        ]
        mock_client.chat.completions.create.return_value = mock_response

        res = client.post(
            "/api/ai/draft-followup",
            json={"client_name": "NeuroTech AI", "target_publication": "TechCrunch"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["subject"] == "Exclusive: NeuroTech AI Series A Funding"
        assert "[Editor Name]" in data["body"]
