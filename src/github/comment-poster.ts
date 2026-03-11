import { Octokit } from '@octokit/rest';
import { ReviewComment, PRContext } from '../types/index.js';

export class CommentPoster {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async postReviewComments(
    context: PRContext,
    comments: ReviewComment[],
    summary: string
  ): Promise<void> {
    try {
      // Agrupar comentarios por severidad
      const criticalComments = comments.filter(c => c.severity === 'critical');
      const warningComments = comments.filter(c => c.severity === 'warning');
      const suggestionComments = comments.filter(c => c.severity === 'suggestion');

      // Preparar comentarios inline para la review
      const reviewComments = comments.map(comment => ({
        path: comment.path,
        line: comment.line,
        body: this.formatComment(comment),
      }));

      // Determinar el evento de la review
      let event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT' = 'COMMENT';
      if (criticalComments.length > 0) {
        event = 'REQUEST_CHANGES';
      } else if (warningComments.length === 0 && suggestionComments.length === 0) {
        event = 'APPROVE';
      }

      // Crear la review con todos los comentarios
      await this.octokit.pulls.createReview({
        owner: context.owner,
        repo: context.repo,
        pull_number: context.pull_number,
        commit_id: context.sha,
        event,
        body: summary,
        comments: reviewComments,
      });

      console.log(`✅ Review publicada exitosamente con ${comments.length} comentarios`);
    } catch (error: any) {
      // Si falla la review completa, intentar publicar solo el resumen
      console.error('Error creando review completa:', error.message);
      
      try {
        await this.postSummaryOnly(context, comments, summary);
      } catch (summaryError) {
        console.error('Error publicando resumen:', summaryError);
        throw summaryError;
      }
    }
  }

  private async postSummaryOnly(
    context: PRContext,
    comments: ReviewComment[],
    summary: string
  ): Promise<void> {
    // Crear un comentario general en el PR con todos los findings
    let fullComment = summary + '\n\n';
    
    if (comments.length > 0) {
      fullComment += '## 📋 Detalles de los problemas encontrados\n\n';
      
      comments.forEach(comment => {
        const icon = this.getSeverityIcon(comment.severity);
        fullComment += `${icon} **${comment.path}:${comment.line}**\n`;
        fullComment += `${comment.message}\n`;
        if (comment.suggestion) {
          fullComment += `💡 *Sugerencia: ${comment.suggestion}*\n`;
        }
        fullComment += '\n';
      });
    }

    await this.octokit.issues.createComment({
      owner: context.owner,
      repo: context.repo,
      issue_number: context.pull_number,
      body: fullComment,
    });

    console.log('✅ Resumen publicado como comentario general');
  }

  private formatComment(comment: ReviewComment): string {
    const icon = this.getSeverityIcon(comment.severity);
    const severityLabel = this.getSeverityLabel(comment.severity);
    
    let formatted = `${icon} **${severityLabel}**\n\n${comment.message}`;
    
    if (comment.suggestion) {
      formatted += `\n\n💡 **Sugerencia:**\n${comment.suggestion}`;
    }
    
    return formatted;
  }

  private getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      default: return 'ℹ️';
    }
  }

  private getSeverityLabel(severity: string): string {
    switch (severity) {
      case 'critical': return 'Crítico';
      case 'warning': return 'Advertencia';
      case 'suggestion': return 'Sugerencia';
      default: return 'Info';
    }
  }
}
