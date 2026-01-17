
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, FormFieldMetadata, AISuggestion, CompanyResearch, ChatMessage, JobOpportunity, AuditResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

export class GeminiService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && (error?.status === 429 || error?.status >= 500)) {
        await new Promise(r => setTimeout(r, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
        return this.withRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  async findOpportunities(profile: UserProfile): Promise<JobOpportunity[]> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: `Based on this professional profile: ${JSON.stringify(profile)}, find 5 currently active job openings that would be a high-tier match. Focus on recent postings.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                description: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["id", "title", "company", "location", "matchScore", "description", "url"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  }

  async auditResume(jobDescription: string, profile: UserProfile): Promise<AuditResult> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: `Audit this candidate's profile against the following job description.
        Candidate: ${JSON.stringify(profile)}
        Job Description: ${jobDescription}`,
        config: {
          thinkingConfig: { thinkingBudget: 4096 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "strengths", "gaps", "recommendations", "keywords"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  }

  async analyzeForm(fields: FormFieldMetadata[], profile: UserProfile): Promise<Record<string, AISuggestion>> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const prompt = `Analyze this job application form and map it to the user's career profile.
      User Profile: ${JSON.stringify(profile)}
      Detected Fields: ${JSON.stringify(fields)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
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
    }).catch(e => {
      console.error("Form analysis failed:", e);
      return {};
    });
  }

  async generateInterviewDiagnostic(transcript: string[], profile: UserProfile): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: `Analyze this interview transcript for ${profile.fullName}.
      Transcript: ${transcript.join('\n')}`,
      config: { thinkingConfig: { thinkingBudget: 4096 } }
    });
    return response.text || "Diagnostic failed.";
  }

  async researchCompany(companyName: string): Promise<{ research: CompanyResearch, sources: { title: string, uri: string }[] }> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: `Research the company "${companyName}".`,
        config: { tools: [{ googleSearch: {} }] }
      });
      const research = JSON.parse(response.text || '{}');
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || ""
      })) || [];
      return { research, sources };
    });
  }

  async chat(message: string, history: ChatMessage[], profile: UserProfile): Promise<string> {
    const ai = this.getClient();
    const contents = history.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
    contents.push({ role: 'user', parts: [{ text: message }] });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents,
      config: { systemInstruction: `You are ApplyWise Advisor.`, thinkingConfig: { thinkingBudget: 1024 } }
    });
    return response.text || "No response.";
  }

  async generateVideo(imageBytes: string, prompt: string, aspectRatio: '16:9' | '9:16', onStatusUpdate: (msg: string) => void): Promise<string> {
    const ai = this.getClient();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Professional portrait.',
      image: { imageBytes, mimeType: 'image/png' },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
    });
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async parseResume(fileData: string, mimeType: string): Promise<Partial<UserProfile>> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ inlineData: { data: fileData, mimeType } }, { text: "Parse resume." }]
    });
    return JSON.parse(response.text || '{}');
  }
}

export const geminiService = new GeminiService();
