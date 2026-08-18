# ✨ Shadow Career Finder

> **AI-Powered Career Intelligence, Qualification Roadmaps & Skill Gap Engine**

Shadow Career Finder is a full-stack career guidance platform with a glassy, modern hybrid interface. It analyzes qualifications, tracks known programming skills, matches industry domains, and produces tailored step-by-step learning roadmaps and dynamic visual career graphs.

---

## 🚀 Features

- **Dual-Engine Intelligence**:
  - **Live Groq LLM API**: Fast conversational mentoring powered by Groq (`openai/gpt-oss-120b`, `qwen/qwen3.6-27b`).
  - **Local Rule-Based Reasoning Engine**: Zero-downtime offline fallback for calculating exact skill gaps, match percentages, and milestone roadmaps.
- **Entity & Intent Recognition**:
  - Automatic qualification parsing (`MCA`, `BCA`, `B.Tech`, etc.).
  - Distinguishes English auxiliary verbs (e.g. *"want to be"*) from degrees.
  - Shorthand skill detection (e.g. *"ik py and java coding"* ➔ `Python`, `Java`).
- **Interactive "What You Need to Learn Next" Checklist**: Clickable milestone checkboxes to track progress toward target roles.
- **Dynamic Career Path Graph**: Interactive multi-tier SVG visualization connecting user profiles to target roles and learning milestones.
- **Glassmorphism Design System**: Frosted acrylic cards (`backdrop-filter: blur(20px)`), ambient light orbs, and dark/light theme switcher.
- **One-Click Markdown Export**: Download personalized career reports.

---

## 🛠️ Project Structure

```
├── backend/                  # Python FastAPI API
│   ├── src/
│   │   ├── data/             # Career definitions & skill mappings
│   │   ├── routes/           # /api/chat endpoints
│   │   ├── services/         # NLP extractor, career matcher, graph service, groq service
│   │   └── main.py           # FastAPI entrypoint
│   └── requirements.txt
├── frontend/                 # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx           # Glassy split-view UI (Chat + Dashboard)
│   │   ├── api.ts            # Backend API client
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── styles.css        # Glassmorphic design tokens
│   └── vercel.json           # Vercel SPA routing
└── .env                      # API keys & ports
```

---

## 💻 Local Development

### 1. Backend Setup
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.main:app --host 127.0.0.1 --port 3001 --reload
```

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🌐 Deploying to Vercel (Frontend) & Render / Railway (Backend)

1. **Backend**: Deploy the `backend/` folder on [Render](https://render.com) or [Railway](https://railway.app) as a Python web service.
   - Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variable: `GROQ_API_KEY=your_key_here`
2. **Frontend**: Deploy the `frontend/` folder on [Vercel](https://vercel.com).
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable: `VITE_API_BASE_URL=https://your-backend-service.onrender.com`
