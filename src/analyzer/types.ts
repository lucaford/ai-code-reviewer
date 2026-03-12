import { ReviewComment } from '../types/index.js';

export interface AIAnalyzer {
  analyzeCode(fileName: string, patch: string): Promise<ReviewComment[]>;
  generateSummary(allComments: ReviewComment[], totalCount?: number, omittedCount?: number): Promise<string>;
}

export type AIProvider = 'kimi' | 'claude';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}
