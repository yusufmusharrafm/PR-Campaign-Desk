import json
from typing import Optional
from fastapi import HTTPException, status
from google import genai
from google.genai import types as genai_types
from app.config import settings
from app.schemas import (
    AISummarizeResponse,
    AINextActionResponse,
    AIDraftFollowupResponse
)

SYSTEM_PROMPT = """You are an AI PR Assistant for PR Campaign Desk, an internal tool for PR professionals.
Your role is purely advisory to assist human decisions.

CRITICAL GUARDRAILS:
1. Do NOT invent real or fake journalists, media contacts, email addresses, or phone numbers. Use placeholders like [Editor Name] or [Target Reporter].
2. Do NOT guarantee publication or media placements.
3. Do NOT make automatic status changes or claims of automated sending.
4. Output must strictly follow the requested JSON schema.
"""


def _generate_ai_json(prompt: str) -> dict:
    """
    Calls Google Gemini API using GEMINI_API_KEY.
    """
    gemini_key = settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip()

    if not gemini_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI Assistant unavailable. Configure GEMINI_API_KEY in backend environment."
        )

    try:
        client = genai.Client(api_key=gemini_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai_types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.7,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini AI Assistant request failed: {str(e)}"
        )


def summarize_campaign(story_summary: Optional[str], notes: Optional[str]) -> AISummarizeResponse:
    user_content = f"Story Summary: {story_summary or 'None provided.'}\nBackground Notes: {notes or 'None provided.'}"
    prompt = f"{user_content}\n\nProvide a concise 2-sentence campaign summary and 3 bullet-point key talking points as JSON format: {{\"concise_summary\": \"...\", \"key_talking_points\": [\"...\", \"...\", \"...\"]}}"

    try:
        data = _generate_ai_json(prompt)
        return AISummarizeResponse(
            concise_summary=data.get("concise_summary", "Summary unavailable."),
            key_talking_points=data.get("key_talking_points", [])
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process AI summary: {str(e)}"
        )


def suggest_next_action(
    status_stage: str,
    target_publication: Optional[str],
    story_summary: Optional[str],
    notes: Optional[str]
) -> AINextActionResponse:
    prompt = f"""Current Campaign Stage: {status_stage}
Target Publication: {target_publication or 'Not specified'}
Story Summary: {story_summary or 'None provided.'}
Notes: {notes or 'None provided.'}

Based on the PR campaign workflow, suggest the single most effective immediate next action for the PR professional to take.
Return JSON format: {{\"suggested_next_action\": \"...\", \"reasoning\": \"...\"}}"""

    try:
        data = _generate_ai_json(prompt)
        return AINextActionResponse(
            suggested_next_action=data.get("suggested_next_action", "Review campaign details."),
            reasoning=data.get("reasoning", "Recommended step based on workflow stage.")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to suggest next action: {str(e)}"
        )


def draft_followup(
    client_name: str,
    target_publication: Optional[str],
    story_summary: Optional[str],
    tone: Optional[str]
) -> AIDraftFollowupResponse:
    prompt = f"""Client: {client_name}
Target Publication/Category: {target_publication or 'Tech Media'}
Story Summary: {story_summary or 'New product launch'}
Desired Tone: {tone or 'Professional and persuasive'}

Draft a media outreach/follow-up email pitch for a PR professional to send to an editor/reporter.
Use placeholders like [Editor Name] or [Target Reporter].
Return JSON format: {{\"subject\": \"...\", \"body\": \"...\"}}"""

    try:
        data = _generate_ai_json(prompt)
        return AIDraftFollowupResponse(
            subject=data.get("subject", "Media Pitch"),
            body=data.get("body", "Pitch draft text.")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to draft follow-up email: {str(e)}"
        )
