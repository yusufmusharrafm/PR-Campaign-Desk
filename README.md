# PR Campaign Desk

> **A production-ready internal campaign-management workspace for modern PR agencies.**

PR Campaign Desk enables PR professionals to manage client campaigns through every stage of story development—from initial pitch creation to media publication—with automated audit activity logging and human-in-the-loop AI assistance.

---

## 🌟 Key Product Features

- **8-Stage Workflow Engine**: Explicit status management across `NEW` → `STORY_DEVELOPMENT` → `ARTICLE_DRAFT` → `CLIENT_REVIEW` → `APPROVED` → `MEDIA_OUTREACH` → `PUBLISHED` → `COMPLETED`.
- **Audit Activity Trail**: Automatic history logging of status transitions, field edits, and AI assistance with actor attribution and timestamps.
- **Human-in-the-Loop AI Assistant**:
  - **Summarize Campaign**: Synthesizes story angles and background notes into talking points.
  - **Suggest Next Action**: Recommends immediate strategic next steps based on stage and publication.
  - **Draft Pitch Email**: Generates tailored media pitch emails with customizable tone.
  - *Human Control*: AI output is advisory-only and must be explicitly applied by the user. Does not mutate database directly.
  - *Graceful Fallback*: Clear 503 message if `OPENAI_API_KEY` is missing while maintaining core campaign operations.
- **Dual Dashboard Views**: Toggle between a sortable **Table View** and **Visual Status Grouping**.
- **RESTful API**: Fast and clean OpenAPI endpoints built on FastAPI and SQLite.

---

## 📐 Monorepo Architecture

```
PR-Campaign-Desk/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── config.py         # Pydantic BaseSettings
│   │   ├── database.py       # SQLAlchemy SQLite connection
│   │   ├── main.py           # FastAPI entrypoint & router registration
│   │   ├── models.py         # Campaign & ActivityLog ORM models
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── campaigns.py  # REST CRUD endpoints
│   │   │   └── ai.py         # AI Assistant endpoints
│   │   └── services/
│   │       ├── campaign_service.py # Business logic & audit logging
│   │       └── ai_service.py       # OpenAI client & prompt guardrails
│   ├── tests/                # Automated pytest suite
│   ├── seed.py               # Database seeding script (8 campaigns across 8 stages)
│   └── requirements.txt
│
└── frontend/                 # Next.js App Router Application
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                  # Dashboard & Campaign List
    │   │   └── campaigns/[id]/page.tsx   # Campaign Workspace
    │   ├── components/
    │   │   ├── ui/                       # Badges (StatusBadge, PriorityBadge)
    │   │   ├── campaigns/                # Stepper, Details Editor, Status Grouping
    │   │   └── ai/                       # AICopilotDrawer (Slide-over panel)
    │   └── lib/
    │       ├── api.ts                    # REST fetch client wrappers
    │       └── types.ts                  # Shared TypeScript interfaces
    └── package.json
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Python 3.12+
- Node.js 18+ and npm

### 1. Backend Setup

```bash
cd backend

# Create and activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment config (optional: set OPENAI_API_KEY for live AI)
cp ../.env.example .env

# Populate SQLite database with fictional demo data (8 campaigns across all 8 stages)
python seed.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
*Backend runs at `http://127.0.0.1:8000`. Interactive API Docs are available at `http://127.0.0.1:8000/docs`.*

---

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install Node dependencies
npm install

# Run Next.js development server
npm run dev
```
*Frontend app runs at `http://localhost:3000`.*

---

## 🧪 Running Automated Tests

### Backend Test Suite (Pytest)

Run unit and integration tests (in-memory SQLite, CRUD operations, activity log triggers, seed verification, and mocked AI endpoints):

```bash
backend/.venv/bin/pytest backend/tests
```

### Frontend Type-Checking & Build

```bash
npm --prefix frontend run build
```

---

## 🛡️ AI Safety & Guardrails

1. **Advisory Role**: The AI Assistant cannot directly modify database records. Suggestions must be manually applied by the user.
2. **Negative Prompting**: The system prompt explicitly forbids inventing journalist names, email addresses, or publication guarantees.
3. **Fail-Safe Fallback**: If `OPENAI_API_KEY` is not present, the system displays a clear "AI Assistant Unavailable" alert, allowing the user to manage campaigns uninterrupted.
