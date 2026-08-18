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

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Determine active endpoint
  let endpoint = '/api/chat';
  if (isLocal) {
    endpoint = 'http://127.0.0.1:3001/api/chat';
  } else if (API_BASE) {
    endpoint = `${API_BASE}/api/chat`;
  }

  // 1. Try server endpoint (Direct local backend or Vercel serverless)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.answer) {
        const localEnriched = runClientSideCareerEngine(message, userProfile);
        return {
          answer: data.answer,
          recommendations: (data.recommendations && data.recommendations.length > 0) ? data.recommendations : localEnriched.recommendations,
          graph: data.graph || localEnriched.graph,
          user_profile: data.user_profile || localEnriched.user_profile,
          what_to_learn_next: (data.what_to_learn_next && data.what_to_learn_next.length > 0) ? data.what_to_learn_next : localEnriched.what_to_learn_next,
          source: data.source || 'api'
        };
      }
    }
  } catch (err) {
    console.info('Server API unreachable, using instant local engine');
  }

  // 2. Guaranteed instant local reasoning engine
  return runClientSideCareerEngine(message, userProfile);
}
