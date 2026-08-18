# Local Startup

## From Workspace Root

- `npm run dev` starts the frontend from the `frontend/` folder.
- `npm run dev:backend` starts the Python backend from the `backend/` folder.

## Backend

1. Go to `backend/`.
2. Create a virtual environment if needed.
3. Install dependencies with `pip install -r requirements.txt`.
4. Start the API with `python -m uvicorn src.main:app --host 127.0.0.1 --port 3001`.

## Frontend

1. Go to `frontend/`.
2. Install dependencies with `npm install`.
3. Start the UI with `npm run dev`.

## Environment

Copy `.env.example` to `.env` and set your local `GROQ_API_KEY`.
