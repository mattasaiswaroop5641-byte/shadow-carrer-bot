export type UserProfile = {
  qualification?: string | null;
  skills: string[];
  target_career?: string | null;
  domain?: string | null;
  interests: string[];
};

export type LearningMilestone = {
  phase: string;
  skills: string[];
};

export type CareerRecommendation = {
  career: string;
  category: string;
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  why: string[];
  learning_roadmap?: LearningMilestone[];
};

export type GraphNode = {
  id: string;
  label: string;
  type?: string;
};

export type GraphEdge = {
  source: string;
  target: string;
  label?: string | null;
};

export type CareerGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type ChatResponse = {
  answer: string;
  recommendations: CareerRecommendation[];
  graph?: CareerGraph | null;
  user_profile?: UserProfile | null;
  what_to_learn_next: string[];
  source: string;
};
