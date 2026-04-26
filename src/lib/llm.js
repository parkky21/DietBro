export async function generateContentWithFallback(prompt) {
  // 1. Try Google Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
        console.warn('Gemini failed, falling back to Groq...', await response.text());
      }
    } catch (err) {
      console.warn('Gemini error, falling back to Groq...', err.message);
    }
  }

  // 2. Try Groq (Llama 3.3)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-32b',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: "json_object" }
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } else {
        console.warn('Groq failed, falling back to OpenRouter...', await response.text());
      }
    } catch (err) {
      console.warn('Groq error, falling back to OpenRouter...', err.message);
    }
  }

  // 3. Try OpenRouter
  const orKey = process.env.OPENROUTER_API_KEY;
  if (orKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${orKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2.6',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: "json_object" }
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } else {
        console.error('OpenRouter failed.', await response.text());
      }
    } catch (err) {
      console.error('OpenRouter error.', err.message);
    }
  }

  throw new Error('All LLM providers failed or no API keys available.');
}
