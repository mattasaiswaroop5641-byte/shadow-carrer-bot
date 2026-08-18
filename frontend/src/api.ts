import type { ChatResponse, UserProfile } from './types';

export type ChatRequest = {
  message: string;
  domain?: string | null;
  qualification?: string | null;
  skills: string[];
  interests: string[];
  target_career?: string | null;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  wants_graph: boolean;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function sendChatMessage(
  message: string,
  userProfile: UserProfile,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ChatResponse> {
  const payload: ChatRequest = {
    message,
    domain: userProfile.domain || userProfile.target_career,
    qualification: userProfile.qualification,
    skills: userProfile.skills || [],
    interests: userProfile.interests || [],
    target_career: userProfile.target_career,
    history,
    wants_graph: true,
  };

  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server returned error: ${response.status}`);
  }

  return response.json() as Promise<ChatResponse>;
}
