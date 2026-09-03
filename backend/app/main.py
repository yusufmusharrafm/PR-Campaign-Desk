from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import campaigns, ai

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PR Campaign Desk API",
    description="Backend API for PR Campaign Desk workspace",
    version="0.1.0"
)

# Enable CORS for Next.js frontend dev & production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local dev server & Vercel production domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(campaigns.router)
app.include_router(ai.router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PR Campaign Desk API",
        "version": "0.1.0"
    }
