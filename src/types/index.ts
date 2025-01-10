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
}