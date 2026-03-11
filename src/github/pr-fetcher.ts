import { Octokit } from '@octokit/rest';
import { FileChange, PRContext } from '../types/index.js';

export class PRFetcher {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async getFileChanges(context: PRContext): Promise<FileChange[]> {
    try {
      const { data: files } = await this.octokit.pulls.listFiles({
        owner: context.owner,
        repo: context.repo,
        pull_number: context.pull_number,
      });

      // Filtrar archivos que queremos analizar
      const reviewableFiles = files.filter(file => {
        // Solo analizar archivos agregados o modificados
        if (file.status === 'removed') return false;

        // Filtrar por extensiones de archivo relevantes
        const extensions = [
          '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
          '.py', '.go', '.java', '.cpp', '.c', '.h',
          '.rb', '.php', '.cs', '.rs', '.swift', '.kt'
        ];

        return extensions.some(ext => file.filename.endsWith(ext));
      });

      const fileChanges: FileChange[] = reviewableFiles.map(file => ({
        filename: file.filename,
        status: file.status as 'added' | 'modified' | 'removed' | 'renamed',
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch,
      }));

      return fileChanges;
    } catch (error) {
      console.error('Error obteniendo cambios del PR:', error);
      throw error;
    }
  }

  async getPRDetails(context: PRContext) {
    try {
      const { data: pr } = await this.octokit.pulls.get({
        owner: context.owner,
        repo: context.repo,
        pull_number: context.pull_number,
      });

      return {
        title: pr.title,
        body: pr.body || '',
        author: pr.user?.login || 'unknown',
        base: pr.base.ref,
        head: pr.head.ref,
      };
    } catch (error) {
      console.error('Error obteniendo detalles del PR:', error);
      throw error;
    }
  }
}
