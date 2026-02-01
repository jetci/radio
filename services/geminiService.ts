
// Gemini Service - Now using secure API proxy
// API key is protected on the server side

const API_ENDPOINT = '/api/gemini'; // Serverless function endpoint

async function callGeminiAPI(action: string, payload: any): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload })
    });

    if (!response.ok) {
      // Silent fail - Gemini is optional feature
      return null;
    }

    const result = await response.json();
    
    if (!result.success) {
      return null;
    }

    return result.data;
  } catch (error) {
    // Silent fail - Gemini is optional, fallbacks will handle it
    return null;
  }
}

export const geminiService = {
  async getAiRecommendations(userInput: string): Promise<string[]> {
    const tags = await callGeminiAPI('getRecommendations', { userInput });
    // Return tags if valid, otherwise fallback
    if (Array.isArray(tags) && tags.length > 0) {
      return tags;
    }
    // Fallback to generic tags
    return ['pop', 'rock', 'jazz', 'news', 'classical'];
  },

  async getCityFact(city: string, country: string): Promise<string> {
    const fact = await callGeminiAPI('getCityFact', { city, country });
    // Return fact if valid, otherwise fallback
    if (fact && typeof fact === 'string') {
      return fact;
    }
    // Fallback message
    return `Tune into ${city}, ${country} - Discover local culture through radio waves...`;
  },

  async getAiJourney(mood: string): Promise<{ country: string; tag: string; reason: string }> {
    const journey = await callGeminiAPI('getAiJourney', { mood });
    // Return journey if valid, otherwise fallback
    if (journey && journey.country && journey.tag) {
      return journey;
    }
    // Fallback journey
    return { 
      country: "France", 
      tag: "jazz", 
      reason: "Timeless elegance and smooth vibes" 
    };
  }
};
