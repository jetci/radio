// Serverless Function for Gemini API Proxy
// This protects the API key from being exposed in client-side code
// Deploy to Vercel/Netlify Functions

import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI with server-side API key
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenAI({ apiKey });
};

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, payload } = req.body;
    const ai = getAI();

    switch (action) {
      case 'getRecommendations': {
        const { userInput } = payload;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `The user is looking for radio stations. Input: "${userInput}". 
          Analyze the mood or intent and provide exactly 3 specific radio tags or genres (like 'jazz', 'lofi', 'techno', 'news') that would best match this request. 
          Return the output as a clean JSON array of strings.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        });

        const tags = JSON.parse(response.text || '[]');
        return res.status(200).json({ success: true, data: tags });
      }

      case 'getCityFact': {
        const { city, country } = payload;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Generate a brief, interesting cultural fact about ${city}, ${country}. 
          Focus on music, culture, or local traditions. Keep it under 100 characters and engaging.
          Return ONLY the fact text, no quotes or extra formatting.`,
          config: {
            responseMimeType: "text/plain"
          }
        });

        const fact = response.text?.trim() || 'A vibrant city with rich cultural heritage.';
        return res.status(200).json({ success: true, data: fact });
      }

      case 'getAiJourney': {
        const { mood } = payload;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `The user wants an AI-powered radio journey with this mood/request: "${mood}".
          Suggest ONE specific country and ONE music genre/tag that would match this mood perfectly.
          Also provide a brief reason (under 50 chars) why this combination fits.
          Return as JSON: { "country": "CountryName", "tag": "genre", "reason": "why it fits" }`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                country: { type: Type.STRING },
                tag: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["country", "tag", "reason"]
            }
          }
        });

        const journey = JSON.parse(response.text || '{"country":"France","tag":"jazz","reason":"Classic elegance"}');
        return res.status(200).json({ success: true, data: journey });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ 
      error: 'AI service error', 
      message: error.message 
    });
  }
}
