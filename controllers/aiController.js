const { GoogleGenAI } = require('@google/genai');

const hasGeminiKey = !!process.env.GEMINI_API_KEY;
const ai = hasGeminiKey ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

if (!hasGeminiKey) {
  console.warn('[AI] GEMINI_API_KEY not set — /api/ai/chat will return a fallback message');
}

const SYSTEM_CONTEXT = `You are LoadBhai's assistant — a helpful freight & logistics chatbot for India's
trucking ecosystem (drivers, transporters, traders, corporates). You help users find loads,
list trucks, understand bus cargo space, fleet mandi deals, and corporate freight auctions.
Keep replies short, practical, and India-logistics aware (cities, mandi terms, GST, etc.).
If asked something unrelated to logistics/freight, politely redirect to how you can help with loads/trucks.`;

// ── AI CHAT ───────────────────────────────────────────────
// POST /api/ai/chat   { userMessage: "Find loads from Delhi" }
const chat = async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    if (!ai) {
      return res.status(200).json({
        reply: "AI assistant isn't configured yet — ask the LoadBhai team to set GEMINI_API_KEY.",
        fallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_CONTEXT,
      },
    });

    const reply = response.text || "Sorry, I couldn't generate a response. Please try again.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini AI Error:', err.message);
    return res.status(500).json({ error: 'AI chat failed', details: err.message });
  }
};

module.exports = { chat };