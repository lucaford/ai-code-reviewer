import OpenAI from 'openai';
import { buildCodeReviewPrompt } from '../prompts/review-prompts.js';
import { ReviewComment } from '../types/index.js';
import { formatComment, getSeverityStats } from '../utils/comment-formatter.js';

export class KimiAnalyzer {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'kimi-k2.5') {
    // Kimi usa una API compatible con OpenAI
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.moonshot.ai/v1',
    });
    this.model = model;
  }

  async analyzeCode(fileName: string, patch: string): Promise<ReviewComment[]> {
    try {
      const prompt = buildCodeReviewPrompt(fileName, patch);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 1,
        max_tokens: 4096,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Respuesta vacía de Kimi');
      }

      // Parsear la respuesta JSON
      const parsed = this.parseKimiResponse(content);
      
      // Mapear findings a ReviewComments con formato
      const comments: ReviewComment[] = parsed.findings.map((finding: any) => ({
        path: fileName,
        line: finding.line,
        severity: finding.severity,
        message: finding.message,
        suggestion: finding.suggestion,
        body: formatComment({
          path: fileName,
          line: finding.line,
          severity: finding.severity,
          message: finding.message,
          suggestion: finding.suggestion,
        }),
      }));

      return comments;
    } catch (error) {
      console.error(`Error analizando ${fileName} con Kimi:`, error);
      return [];
    }
  }

  private parseKimiResponse(text: string): { findings: any[] } {
    try {
      // Intentar extraer JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No se encontró JSON en la respuesta de Kimi');
        return { findings: [] };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      console.error('Error parseando respuesta de Kimi:', error);
      console.error('Texto recibido:', text);
      return { findings: [] };
    }
  }

  async generateSummary(
    allComments: ReviewComment[],
    totalCount?: number,
    omittedCount?: number
  ): Promise<string> {
    if (allComments.length === 0) {
      return '✅ No se encontraron problemas significativos en este PR. ¡Buen trabajo!';
    }

    const stats = getSeverityStats(allComments);
    const actualTotal = totalCount || allComments.length;

    let summary = '## 🤖 Resumen del Code Review\n\n';

    // Mostrar mensaje de problemas totales vs mostrados si hay omisiones
    if (omittedCount && omittedCount > 0) {
      summary += `⚠️ **Se encontraron ${actualTotal} problema(s), mostrando los ${allComments.length} más críticos**\n\n`;
    }
    
    if (stats.critical > 0) {
      summary += `🔴 **${stats.critical} problema(s) crítico(s)** que deben ser resueltos\n`;
    }
    if (stats.warning > 0) {
      summary += `🟡 **${stats.warning} advertencia(s)** que deberían ser revisadas\n`;
    }
    if (stats.suggestion > 0) {
      summary += `🟢 **${stats.suggestion} sugerencia(s)** para mejorar el código\n`;
    }

    summary += '\n---\n';
    summary += '_Generado automáticamente por AI Code Review Agent powered by Kimi K2.5_';

    return summary;
  }
}
