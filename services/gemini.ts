
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WebsiteProposal } from "../types";

const PROPOSAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    businessName: { type: Type.STRING },
    targetAudience: { type: Type.STRING },
    suggestedStyle: { type: Type.STRING },
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          sections: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "sections"]
      }
    },
    colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
    copyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
    marketInsights: { type: Type.STRING, description: "Real-time market trends gathered from search grounding." }
  },
  required: ["businessName", "targetAudience", "suggestedStyle", "pages", "colorPalette", "copyConcepts", "marketInsights"]
};

export async function generateWebsiteProposal(userInput: string): Promise<WebsiteProposal> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a senior web design consultant at "Code-Set". Create a comprehensive website proposal for: "${userInput}". Use Google Search to find current design trends and competitor strategies for this niche.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: PROPOSAL_SCHEMA
    }
  });

  const jsonStr = response.text || '{}';
  return JSON.parse(jsonStr) as WebsiteProposal;
}

export async function generateStrategyAudio(proposal: WebsiteProposal): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `TTS the following conversation between an Architect (Joe) and a Client Manager (Jane) about the project "${proposal.businessName}":
  Joe: I've finalized the architectural roadmap for ${proposal.businessName}. We are going with a ${proposal.suggestedStyle} aesthetic.
  Jane: Excellent. The market insights suggest the target audience of ${proposal.targetAudience} is looking for exactly that. Let's push to production.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            { speaker: 'Joe', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            { speaker: 'Jane', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
          ]
        }
      }
    }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
}

export async function generateBrandAsset(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `High-end commercial photography, professional lighting, minimal: ${prompt}` }] },
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return '';
}

export async function startLaunchVideoGeneration(prompt: string): Promise<any> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  return await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic brand launch video, high production value, 4k: ${prompt}`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
}

export async function iterateWebsiteCode(
  currentFiles: any[], 
  request: string, 
  proposal: WebsiteProposal
): Promise<{ files: any[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `Lead Developer at "Code-Set". Update code for ${proposal.businessName}. 
  Request: "${request}". 
  FILES: ${currentFiles.map(f => `\nFILE: ${f.name}\n${f.content}`).join('')}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || '{"files": []}');
}
