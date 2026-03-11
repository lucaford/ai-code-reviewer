import Anthropic from '@anthropic-ai/sdk';
import { buildCodeReviewPrompt } from '../prompts/review-prompts.js';
import { ReviewComment } from '../types/index.js';

export class ClaudeAnalyzer {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async analyzeCode(fileName: string, patch: string): Promise<ReviewComment[]> {
    try {
      const prompt = buildCodeReviewPrompt(fileName, patch);

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = message.content[0];
      if (response.type !== 'text') {
        throw new Error('Respuesta inesperada de Claude');
      }

      // Parsear la respuesta JSON
      const parsed = this.parseClaudeResponse(response.text);
      
      // Mapear findings a ReviewComments
      const comments: ReviewComment[] = parsed.findings.map((finding: any) => ({
        path: fileName,
        line: finding.line,
        severity: finding.severity,
        message: finding.message,
        suggestion: finding.suggestion,
      }));

      return comments;
    } catch (error) {
      console.error(`Error analizando ${fileName}:`, error);
      return [];
    }
  }

  private parseClaudeResponse(text: string): { findings: any[] } {
    try {
      // Intentar extraer JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No se encontró JSON en la respuesta');
        return { findings: [] };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      console.error('Error parseando respuesta de Claude:', error);
      console.error('Texto recibido:', text);
      return { findings: [] };
    }
  }

  async generateSummary(allComments: ReviewComment[]): Promise<string> {
    if (allComments.length === 0) {
      return '✅ No se encontraron problemas significativos en este PR. ¡Buen trabajo!';
    }

    const critical = allComments.filter(c => c.severity === 'critical').length;
    const warnings = allComments.filter(c => c.severity === 'warning').length;
    const suggestions = allComments.filter(c => c.severity === 'suggestion').length;

    let summary = '## 🤖 Resumen del Code Review\n\n';
    
    if (critical > 0) {
      summary += `🚨 **${critical} problema(s) crítico(s)** que deben ser resueltos\n`;
    }
    if (warnings > 0) {
      summary += `⚠️ **${warnings} advertencia(s)** que deberían ser revisadas\n`;
    }
    if (suggestions > 0) {
      summary += `💡 **${suggestions} sugerencia(s)** para mejorar el código\n`;
    }

    summary += '\n---\n';
    summary += '_Generado automáticamente por AI Code Review Agent powered by Claude_';

    return summary;
  }
}
