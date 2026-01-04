
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FormFieldMetadata, AISuggestion, CompanyResearch, ChatMessage } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeForm(fields: FormFieldMetadata[], profile: UserProfile): Promise<Record<string, AISuggestion>> {
    try {
      const ai = this.getClient();
      const prompt = `Analyze this job application form and map it to the user's career profile.
      User Profile: ${JSON.stringify(profile)}
      Detected Fields: ${JSON.stringify(fields)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + "\n\nCRITICAL: Extract a 'sourceExcerpt' field for every suggestion as proof.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fieldId: { type: Type.STRING },
                    value: { type: Type.STRING },
                    confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
                    source: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    sourceExcerpt: { type: Type.STRING }
                  },
                  required: ["fieldId", "value", "confidence", "source", "reasoning", "sourceExcerpt"]
                }
              }
            },
            required: ["suggestions"]
          }
        }
      });
      
      const text = response.text || '{"suggestions": []}';
      const result = JSON.parse(text);
      const suggestionMap: Record<string, AISuggestion> = {};
      result.suggestions.forEach((s: AISuggestion) => suggestionMap[s.fieldId] = s);
      return suggestionMap;
    } catch (e) { 
      console.error("Form analysis failed:", e);
      return {}; 
    }
  }

  async rewriteEssay(currentText: string, profile: UserProfile, targetRole: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Rewrite this application essay for the role of ${targetRole}. 
      Original Draft: "${currentText}"
      Candidate context: ${JSON.stringify(profile.experience)}`,
      config: {
        systemInstruction: "You are a world-class career coach. Refine this essay to be more impactful, using the provided candidate context to highlight specific achievements. Keep it professional and concise.",
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return response.text || currentText;
  }

  async chat(message: string, history: ChatMessage[], profile: UserProfile): Promise<string> {
    const ai = this.getClient();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are ApplyWise Advisor. 
        User Profile: ${JSON.stringify(profile)}.
        Help with applications, interview prep, and career strategy. Be professional and data-driven.`,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    // Provide history manually since ai.chats doesn't take history in create() in this SDK version
    // Instead we use generateContent for multi-turn if we need to manage history manually
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction: `You are ApplyWise Advisor. Help ${profile.fullName} with career moves.`,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  }

  async generateVideo(imageBytes: string, prompt: string, aspectRatio: '16:9' | '9:16', onStatusUpdate: (msg: string) => void): Promise<string> {
    const ai = this.getClient();
    onStatusUpdate("Initializing video generation engine...");
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Subtle cinematic headshot animation with soft focus and high-end professional lighting.',
      image: {
        imageBytes,
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio
      }
    });

    onStatusUpdate("Processing image frames...");

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      onStatusUpdate("Synthesizing animation vectors (this may take a minute)...");
      try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
      } catch (e: any) {
        if (e.message?.includes("not found")) {
          throw new Error("API_KEY_RESET_REQUIRED");
        }
        throw e;
      }
    }

    onStatusUpdate("Compiling final video artifact...");
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation completed but no link was provided.");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export const geminiService = new GeminiService();
