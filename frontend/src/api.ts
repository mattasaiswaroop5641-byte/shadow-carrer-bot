import type { ChatResponse, UserProfile } from './types';
import { runClientSideCareerEngine } from './lib/careerEngine';

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

// Safe access for Vite environment variables
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const API_BASE = (metaEnv.VITE_API_BASE_URL || '').replace(/\/$/, '');

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

  try {
    const endpoint = API_BASE ? `${API_BASE}/api/chat` : '/api/chat';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return (await response.json()) as ChatResponse;
    }
  } catch (networkError) {
    // If backend is not available (e.g. standalone Vercel preview), use seamless client-side intelligence
    console.info('Backend unreachable, seamlessly executing client-side intelligence engine');
  }

  // Graceful zero-downtime client-side career matcher
  return runClientSideCareerEngine(message, userProfile);
}
