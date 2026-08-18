export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, qualification, skills = [], target_career, history = [] } = req.body || {};
  const apiKey = process.env.GROQ_API_KEY || '';

  try {
    const historyLines = history.slice(-6).map((h) => `${h.role}: ${h.content}`).join('\n');
    const prompt = `User Message: ${message}\nKnown Skills: ${skills.join(', ')}\nTarget Role: ${target_career || 'Exploring'}\nQualification: ${qualification || 'None'}\n\nHistory:\n${historyLines}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
            content: 'You are an expert AI Career Guidance Mentor. Provide structured, encouraging advice with markdown tables, roadmaps, and actionable next steps.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.35,
        max_tokens: 650
      })
    });

    if (groqRes.ok) {
      const data = await groqRes.json();
      const answer = data.choices?.[0]?.message?.content || 'Career guidance generated.';
      return res.status(200).json({
        answer,
        recommendations: [],
        source: 'vercel-groq'
      });
    }
  } catch (err) {
    console.error('Vercel serverless Groq error:', err);
  }

  return res.status(200).json({
    answer: `### 🎯 Career Guidance for: ${message}\n\nBased on your background, focusing on building high-demand projects, mastering modern frameworks, and tracking your missing skills will prepare you for high-impact roles.`,
    recommendations: [],
    source: 'fallback'
  });
}
