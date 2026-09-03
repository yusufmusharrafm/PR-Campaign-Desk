import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./pr_campaign_desk.db"
    OPENAI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def __init__(self, **values):
        super().__init__(**values)
        # Handle serverless read-only filesystem on Vercel
        if os.getenv("VERCEL") and self.DATABASE_URL == "sqlite:///./pr_campaign_desk.db":
            self.DATABASE_URL = "sqlite:////tmp/pr_campaign_desk.db"


settings = Settings()
