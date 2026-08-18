from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables securely from .env (never committed to git)
load_dotenv()
root_env = Path(__file__).resolve().parent.parent.parent / ".env"
if root_env.exists():
    load_dotenv(dotenv_path=root_env)


class Settings(BaseModel):
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    backend_port: int = int(os.getenv("BACKEND_PORT", "3001"))


settings = Settings()
