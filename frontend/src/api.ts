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

// Direct Groq API caller for browser / Vercel
async function callGroqDirect(
  message: string,
  userProfile: UserProfile,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string | null> {
  const apiKey = localStorage.getItem('shadow_groq_key') || '';
  if (!apiKey) return null;

  try {
    const historyLines = history.slice(-6).map((h) => `${h.role}: ${h.content}`).join('\n');
    const prompt = `User Message: ${message}\nKnown Skills: ${userProfile.skills.join(', ')}\nTarget Role: ${userProfile.target_career || 'Exploring'}\nQualification: ${userProfile.qualification || 'None'}\n\nHistory:\n${historyLines}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI Career Guidance Mentor. Provide structured, warm advice with actionable roadmaps, markdown tables, and next steps.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.35,
        max_tokens: 650
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (e) {
    console.warn('Direct Groq call error', e);
  }
  return null;
}

export async function sendChatMessage(
  message: string,
  userProfile: UserProfile,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ChatResponse> {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // 1. If running locally or API_BASE is explicitly set, try backend with a fast 3s timeout
  if (isLocal || API_BASE) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const endpoint = API_BASE ? `${API_BASE}/api/chat` : '/api/chat';
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

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return (await response.json()) as ChatResponse;
      }
    } catch (e) {
      console.info('Backend call timed out / failed, using instant engine');
    }
  }

  // 2. Try calling Groq API directly from browser on Vercel
  const directGroqAnswer = await callGroqDirect(message, userProfile, history);
  const clientResponse = runClientSideCareerEngine(message, userProfile);

  if (directGroqAnswer) {
    clientResponse.answer = directGroqAnswer;
    clientResponse.source = 'groq-direct';
  }

  return clientResponse;
}
