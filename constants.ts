
import { UserProfile } from './types';

export const MOCK_USER_PROFILE: UserProfile = {
  fullName: "Alex Rivera",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/arivera-dev",
  github: "github.com/arivera",
  website: "arivera.io",
  summary: "Senior Frontend Engineer with 6 years of experience building scalable web applications. Expert in React, TypeScript, and high-performance UI systems.",
  experience: [
    {
      company: "TechFlow Systems",
      role: "Senior Frontend Engineer",
      duration: "2021 - Present",
      description: "Led the migration of a legacy dashboard to React 18, improving TTI by 40%."
    },
    {
      company: "Creative Logic",
      role: "Software Developer",
      duration: "2018 - 2021",
      description: "Developed and maintained several high-traffic client-facing applications using Vue and Node.js."
    }
  ],
  education: [
    {
      school: "Stanford University",
      degree: "B.S. Computer Science",
      year: "2018"
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "System Design", "Unit Testing"]
};

export const SYSTEM_INSTRUCTION = `
You are ApplyWise, a highly intelligent job application assistant. 
Your goal is to map job application form fields to a user's canonical profile data.

RULES:
1. TRUTHFULNESS: Only use facts from the provided user profile. NEVER invent details.
2. CONTEXT: If a question is ambiguous (e.g., "Tell us about a time..."), use the user's experience to draft a tailored, professional answer.
3. FORMAT: Output MUST be a JSON object mapping field IDs to an object containing:
   - value: The string to fill in the field.
   - confidence: 'high' | 'medium' | 'low'.
   - source: Where the data came from (e.g., 'Work Experience', 'Personal Info').
   - reasoning: A 1-sentence explanation of why this was chosen.

If confidence is low or you cannot find a match, provide your best guess but label as 'low' confidence and explain why.
`;
