from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes.chat import router as chat_router
from src.routes.health import router as health_router


app = FastAPI(
    title="Shadow Career Finder API",
    version="0.1.0",
    description="Qualification-based career guidance backend powered by Groq and rule-based recommendations.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(chat_router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Career Guidance Bot API is running"}
