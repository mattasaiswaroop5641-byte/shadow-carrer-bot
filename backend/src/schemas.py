from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    qualification: str | None = None
    skills: list[str] = Field(default_factory=list)
    target_career: str | None = None
    domain: str | None = None
    interests: list[str] = Field(default_factory=list)


class LearningMilestone(BaseModel):
    phase: str
    skills: list[str] = Field(default_factory=list)


class CareerRecommendation(BaseModel):
    career: str
    category: str = "Engineering"
    score: int
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    why: list[str] = Field(default_factory=list)
    learning_roadmap: list[LearningMilestone] = Field(default_factory=list)


class GraphNode(BaseModel):
    id: str
    label: str
    type: str = "default"  # start | target | matched_skill | missing_skill | career


class GraphEdge(BaseModel):
    source: str
    target: str
    label: str | None = None


class CareerGraph(BaseModel):
    nodes: list[GraphNode] = Field(default_factory=list)
    edges: list[GraphEdge] = Field(default_factory=list)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    domain: str | None = None
    qualification: str | None = None
    skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    target_career: str | None = None
    history: list[dict[str, str]] = Field(default_factory=list)
    wants_graph: bool = True


class ChatResponse(BaseModel):
    answer: str
    recommendations: list[CareerRecommendation] = Field(default_factory=list)
    graph: CareerGraph | None = None
    user_profile: UserProfile | None = None
    what_to_learn_next: list[str] = Field(default_factory=list)
    source: str = "rule-based"


class RecommendationResponse(BaseModel):
    recommendations: list[CareerRecommendation] = Field(default_factory=list)
    graph: CareerGraph | None = None
    user_profile: UserProfile | None = None
    source: str = "rule-based"
