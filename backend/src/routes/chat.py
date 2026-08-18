from fastapi import APIRouter

from src.schemas import ChatRequest, ChatResponse, RecommendationResponse
from src.services.recommendation_service import build_recommendation_response
from src.services.career_matcher import score_careers
from src.services.graph_service import build_graph


router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    return build_recommendation_response(request)


@router.post("/recommendations", response_model=RecommendationResponse)
def recommendations(request: ChatRequest) -> RecommendationResponse:
    matched = score_careers(request)
    return RecommendationResponse(
        recommendations=matched[:5],
        graph=build_graph(request.qualification, matched[:5]) if request.wants_graph else None,
        source="rule-based",
    )
