export interface LeetCodeQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  content: string;
}

export interface NormalizedQuestion {
  original: LeetCodeQuestion;
  normalized: string;
  isProcessing: boolean;
  error?: string;
  culturalReport?: CulturalReport;
  selectedCode?: string;
}

export interface CulturalReport {
  percentage: number;
  culturalTerms: string[];
  totalWords: number;
  culturalWordCount: number;
  culturalOrigin: string;
  biasPercentage: number;
  analysis: string;
}

