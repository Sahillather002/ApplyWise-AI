
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geminiService } from '../geminiService';

// Mock the @google/genai module
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            suggestions: [
              {
                fieldId: 'full-name',
                value: 'Test User',
                confidence: 'high',
                source: 'Test',
                reasoning: 'Testing',
                sourceExcerpt: 'User Test'
              }
            ]
          })
        })
      }
    })),
    Type: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING'
    }
  };
});

describe('GeminiService', () => {
  const mockProfile = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '123',
    location: 'Mars',
    linkedin: '',
    github: '',
    website: '',
    summary: 'Developer',
    experience: [],
    education: [],
    skills: []
  };

  it('should successfully analyze form fields', async () => {
    const fields = [
      { id: 'full-name', type: 'text', label: 'Full Name', tagName: 'input', rect: null }
    ];
    
    const results = await geminiService.analyzeForm(fields, mockProfile);
    
    expect(results).toHaveProperty('full-name');
    expect(results['full-name'].value).toBe('Test User');
    expect(results['full-name'].confidence).toBe('high');
  });

  it('should return empty object on total failure', async () => {
    // Force the client to throw
    vi.spyOn(geminiService as any, 'getClient').mockImplementation(() => {
      throw new Error('API Down');
    });

    const results = await geminiService.analyzeForm([], mockProfile);
    expect(results).toEqual({});
  });
});
