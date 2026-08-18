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

// Direct Groq API caller with strict 3.5s timeout and CORS catch
async function callGroqDirect(
  message: string,
  userProfile: UserProfile,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string | null> {
  const apiKey = (localStorage.getItem('shadow_groq_key') || '').trim();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

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
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (e) {
    clearTimeout(timeoutId);
    console.warn('Groq direct call timed out / blocked by CORS, using client engine');
  }
  return null;
}

export async function sendChatMessage(
  message: string,
  userProfile: UserProfile,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ChatResponse> {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // 1. If running locally or API_BASE is set, try backend
  if (isLocal || API_BASE) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

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
      console.info('Backend endpoint unavailable, falling through');
    }
  }

  // 2. Try direct Groq with timeout protection
  try {
    const directGroqAnswer = await callGroqDirect(message, userProfile, history);
    const clientResponse = runClientSideCareerEngine(message, userProfile);

    if (directGroqAnswer) {
      clientResponse.answer = directGroqAnswer;
      clientResponse.source = 'groq-direct';
    }

    return clientResponse;
  } catch (err) {
    return runClientSideCareerEngine(message, userProfile);
  }
}
