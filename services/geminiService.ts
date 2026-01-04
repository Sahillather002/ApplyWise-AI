
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
      const prompt = `User Profile Context: ${JSON.stringify(profile)}\n\nDetected Form Structure: ${JSON.stringify(fields)}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + "\n\nCRITICAL: Always return a 'sourceExcerpt' field containing the exact snippet from the profile that matches the field. If no match is found, explain why in reasoning.",
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
      
      const text = response.text?.trim() || '{"suggestions": []}';
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
      contents: `Rewrite the following job application essay. Role: ${targetRole}. Candidate History: ${JSON.stringify(profile.experience)}. Original Draft: "${currentText}"`,
      config: {
        systemInstruction: "You are an elite career counselor. Optimize for clarity, punchiness, and impact. Use active verbs.",
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text || currentText;
  }

  async chat(message: string, history: ChatMessage[], profile: UserProfile): Promise<string> {
    const ai = this.getClient();
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: `You are the ApplyWise AI Career Advisor. You have full access to the user's career profile: ${JSON.stringify(profile)}. Answer questions about their job search, provide interview tips, or help them tailor their experience to specific job descriptions. Be concise, professional, and insightful.`,
        thinkingConfig: { thinkingBudget: 1500 }
      }
    });

    return response.text || "I'm sorry, I'm unable to process that request at the moment.";
  }

  async generateVideo(imageBytes: string, prompt: string, aspectRatio: '16:9' | '9:16', onStatusUpdate: (msg: string) => void): Promise<string> {
    const ai = this.getClient();
    onStatusUpdate("Handshaking with Veo clusters...");
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Professional portrait animation, subtle cinematic lighting shift',
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

    onStatusUpdate("Generating motion vectors...");

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      onStatusUpdate("Applying temporal consistency (80% complete)...");
      try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
      } catch (e: any) {
        if (e.message?.includes("Requested entity was not found")) {
          throw new Error("API_KEY_RESET_REQUIRED");
        }
        throw e;
      }
    }

    onStatusUpdate("Finalizing MP4 container...");
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed.");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export const geminiService = new GeminiService();
