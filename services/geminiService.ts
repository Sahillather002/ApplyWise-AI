
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FormFieldMetadata, AISuggestion, CompanyResearch } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  // We instantiate locally in methods to ensure up-to-date API keys per guidelines
  private getClient() {
    // Initializing with named parameter as required by SDK
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeForm(fields: FormFieldMetadata[], profile: UserProfile): Promise<Record<string, AISuggestion>> {
    try {
      const ai = this.getClient();
      const prompt = `User Profile: ${JSON.stringify(profile)}\nForm Fields: ${JSON.stringify(fields)}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + "\n\nCRITICAL: You must also include a 'sourceExcerpt' field which contains the exact snippet or specific line from the user's resume/profile that justifies the suggested value.",
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
                    confidence: { type: Type.STRING },
                    source: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    sourceExcerpt: { type: Type.STRING, description: "The exact snippet from the resume used to generate this suggestion." }
                  },
                  required: ["fieldId", "value", "confidence", "source", "reasoning", "sourceExcerpt"]
                }
              }
            },
            required: ["suggestions"]
          }
        }
      });
      const result = JSON.parse(response.text || '{"suggestions": []}');
      const suggestionMap: Record<string, AISuggestion> = {};
      result.suggestions.forEach((s: AISuggestion) => suggestionMap[s.fieldId] = s);
      return suggestionMap;
    } catch (e) { return {}; }
  }

  async rewriteEssay(currentText: string, profile: UserProfile, targetRole: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Rewrite this job application essay to be more professional and impactful. Use the candidate's profile for specific achievements. Role: ${targetRole}. Text: "${currentText}"`,
      config: {
        systemInstruction: "You are a world-class career coach. Keep the length similar but maximize impact and professional tone.",
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text || currentText;
  }

  async researchCompany(url: string): Promise<CompanyResearch> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform simulated research on the company at this URL: ${url}. Provide a JSON summary.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            mission: { type: Type.STRING },
            culturePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            talkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "mission", "culturePoints", "talkingPoints"]
        }
      }
    });
    return JSON.parse(response.text || '{}') as CompanyResearch;
  }

  async generateVideo(imageBytes: string, prompt: string, aspectRatio: '16:9' | '9:16', onStatusUpdate: (msg: string) => void): Promise<string> {
    const ai = this.getClient();
    
    onStatusUpdate("Initializing high-fidelity video engine...");
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Professional architectural zoom with subtle movement',
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

    onStatusUpdate("Synthesizing cinematic frames...");

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      onStatusUpdate("AI is dreaming of your movement... (roughly 60% complete)");
      try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
      } catch (e: any) {
        if (e.message?.includes("Requested entity was not found")) {
          throw new Error("API_KEY_RESET_REQUIRED");
        }
        throw e;
      }
    }

    onStatusUpdate("Polishing final composite...");

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed to return a link.");

    // Using process.env.API_KEY directly for the download fetch
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export const geminiService = new GeminiService();
