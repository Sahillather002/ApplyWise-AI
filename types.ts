
export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
}

export interface FormFieldMetadata {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  name?: string;
  tagName: string;
  rect: DOMRect | null;
}

export interface AISuggestion {
  fieldId: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  reasoning: string;
  sourceExcerpt?: string;
}

export interface CompanyResearch {
  name: string;
  mission: string;
  culturePoints: string[];
  talkingPoints: string[];
}

export type SidebarTab = 'apply' | 'research' | 'prep' | 'vault' | 'studio';

export interface VideoState {
  isGenerating: boolean;
  progress: number;
  statusMessage: string;
  videoUrl: string | null;
  error: string | null;
}

export interface InterviewSession {
  isActive: boolean;
  transcription: string[];
  isListening: boolean;
}

export interface ApplicationState {
  fields: FormFieldMetadata[];
  suggestions: Record<string, AISuggestion>;
  filledStatus: Record<string, boolean>;
  isAnalyzing: boolean;
  activeTab: SidebarTab;
  companyInfo: CompanyResearch | null;
  isResearching: boolean;
  videoState: VideoState;
  interview: InterviewSession;
}
