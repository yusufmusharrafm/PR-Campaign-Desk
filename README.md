# PR Campaign Desk

> Campaign operations workspace for modern PR teams.

**PR Campaign Desk** is an internal web application designed to help PR professionals manage client campaigns through story development, article drafting, client review, media outreach, and publication tracking, supported by a human-in-the-loop AI Assistant.

---

## 🏗️ Architecture

PR Campaign Desk uses a lightweight monorepo architecture:

```
PR-Campaign-Desk/
├── backend/    # FastAPI REST API + SQLAlchemy ORM (SQLite)
├── frontend/   # Next.js (App Router) + TypeScript + Tailwind CSS
├── .gitignore
├── .env.example
└── README.md
```

### Technology Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Python 3.12+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy
- **Database**: SQLite
- **Testing**: `pytest` + `httpx` (FastAPI TestClient)
- **AI Integration**: OpenAI API (Stateless human-in-the-loop assistant)

---

## 🚀 Quick Setup & Local Running

### Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Default settings:
```env
DATABASE_URL=sqlite:///./pr_campaign_desk.db
OPENAI_API_KEY=your_openai_api_key_here # Optional
```

---

### Backend Setup & Server

1. **Navigate to backend and setup environment**:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run FastAPI Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Health Check*: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

3. **Run Tests**:
   ```bash
   pytest tests
   ```

---

### Frontend Setup & Server

1. **Navigate to frontend and install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Next.js Dev Server**:
   ```bash
   npm run dev
   ```
   *Application URL*: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing Strategy
- Automated unit and API integration tests are located in `backend/tests/`.
- Run pytest suite: `backend/.venv/bin/pytest backend/tests`
