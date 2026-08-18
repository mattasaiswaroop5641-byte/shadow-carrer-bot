from src.config import settings
from src.schemas import CareerRecommendation, ChatRequest, UserProfile
import re

CANDIDATE_MODELS = [
    "groq/compound-mini",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "groq/compound",
    "qwen/qwen3.6-27b",
]


def extract_name(text: str) -> str | None:
    match = re.search(r'\b(?:my name is|i am|im|this is|call me)\s+([a-zA-Z]+)\b', text, re.IGNORECASE)
    if match:
        name = match.group(1).capitalize()
        if name.lower() not in {"doing", "studying", "working", "interested", "trying", "looking", "learning", "a", "an", "the"}:
            return name
    return None


def generate_groq_reply(
    request: ChatRequest,
    user_profile: UserProfile,
    recommendations: list[CareerRecommendation],
    what_to_learn: list[str]
) -> str:
    if not settings.groq_api_key:
        return ""

    try:
        from groq import Groq
        client = Groq(api_key=settings.groq_api_key)
        history_lines = [f"{item.get('role', 'user')}: {item.get('content', '')}" for item in request.history[-8:]]
        
        detected_name = extract_name(request.message)

        profile_summary = [
            f"User Message: {request.message}",
            f"User Name (if detected): {detected_name or 'Friend'}",
            f"Detected Qualification: {user_profile.qualification or 'Not specified'}",
            f"Detected Known Skills: {', '.join(user_profile.skills) if user_profile.skills else 'None detected yet'}",
            f"Target Goal/Domain: {user_profile.target_career or user_profile.domain or 'Open/Not locked'}",
            f"Interests: {', '.join(user_profile.interests) if user_profile.interests else 'General'}",
            f"Top Recommended Path: {recommendations[0].career if recommendations else 'Analyzing'}",
            f"Identified Missing Skills to Learn: {', '.join(what_to_learn) if what_to_learn else 'None'}"
        ]

        system_instruction = (
            "You are an expert AI Career Mentor. Provide warm, encouraging, and highly structured career guidance.\n"
            "Guidelines:\n"
            "1. If the user shares their name (e.g. 'my name is Sai'), greet them warmly by name ('Great to meet you, Sai!').\n"
            "2. Read the conversation history carefully. NEVER repeat the exact same roadmap or table if it was already sent in recent turns.\n"
            "3. If the user already received their skills roadmap, suggest practical next steps: portfolio project ideas, real-world architecture tips, or mock interview questions.\n"
            "4. Format replies with clean markdown (tables, bold headings, bullet points)."
        )

        for model_name in CANDIDATE_MODELS:
            try:
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": "\n".join(profile_summary) + "\n\nConversation History:\n" + ("\n".join(history_lines) if history_lines else "None")},
                    ],
                    temperature=0.35,
                    max_tokens=750,
                )
                content = completion.choices[0].message.content
                if content and len(content.strip()) > 10:
                    return content.strip()
            except Exception:
                continue

        return ""
    except Exception:
        return ""
