import { loadReviewConfig, generateRulesText } from '../config/rules.config.js';

export function buildReviewPrompt(): string {
  const config = loadReviewConfig();
  const rulesText = generateRulesText(config);

  return `Eres un experto code reviewer con años de experiencia. Tu objetivo es revisar código de manera constructiva y detallada.

Analiza el siguiente código y busca problemas en estas áreas:

${rulesText}

IMPORTANTE:
- Sé específico y constructivo en tus comentarios
- Para cada problema, sugiere una solución concreta
- No reportes problemas de estilo/formato triviales
- Prioriza problemas de seguridad y bugs sobre mejoras de estilo
- Si el código está bien, no inventes problemas

FORMATO DE RESPUESTA (JSON):
Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{
  "findings": [
    {
      "line": número_de_línea,
      "severity": "critical" | "warning" | "suggestion",
      "message": "Descripción clara del problema",
      "suggestion": "Solución propuesta específica"
    }
  ]
}

Si no encuentras problemas, responde: {"findings": []}`;
}

export function buildCodeReviewPrompt(fileName: string, patch: string): string {
  const basePrompt = buildReviewPrompt();
  
  return `${basePrompt}

ARCHIVO: ${fileName}

CAMBIOS A REVISAR:
\`\`\`diff
${patch}
\`\`\`

Analiza estos cambios y responde en formato JSON como se indicó arriba.`;
}
