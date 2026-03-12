export interface ReviewComment {
  path: string;
  line: number;
  severity: 'critical' | 'warning' | 'suggestion';
  message: string;
  suggestion?: string;
  body?: string; // Formato markdown completo del comentario
}

export interface FileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  patch?: string;
}

export interface PRContext {
  owner: string;
  repo: string;
  pull_number: number;
  sha: string;
}

export interface AnalysisResult {
  comments: ReviewComment[];
  summary: string;
}
