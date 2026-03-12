import { ReviewComment } from '../types/index.js';

/**
 * Iconos y colores para cada severidad
 */
const SEVERITY_CONFIG = {
  critical: {
    icon: '🔴',
    label: '**CRITICAL**',
    priority: 3,
  },
  warning: {
    icon: '🟡',
    label: '**WARNING**',
    priority: 2,
  },
  suggestion: {
    icon: '🟢',
    label: '**SUGGESTION**',
    priority: 1,
  },
};

/**
 * Formatea un comentario con icono y negrita según la severidad
 */
export function formatComment(comment: ReviewComment): string {
  const config = SEVERITY_CONFIG[comment.severity as keyof typeof SEVERITY_CONFIG];
  
  if (!config) {
    return `${comment.message}\n\n**Sugerencia:** ${comment.suggestion}`;
  }

  return `${config.icon} ${config.label}

${comment.message}

**💡 Sugerencia:**
${comment.suggestion}`;
}

/**
 * Prioriza y limita comentarios según configuración
 */
export function prioritizeComments(
  comments: ReviewComment[],
  maxComments: number = 15
): { filtered: ReviewComment[]; totalCount: number; omittedCount: number } {
  const totalCount = comments.length;

  // Ordenar por severidad (critical > warning > suggestion)
  const sorted = [...comments].sort((a, b) => {
    const priorityA = SEVERITY_CONFIG[a.severity as keyof typeof SEVERITY_CONFIG]?.priority || 0;
    const priorityB = SEVERITY_CONFIG[b.severity as keyof typeof SEVERITY_CONFIG]?.priority || 0;
    return priorityB - priorityA;
  });

  // Tomar solo los primeros maxComments
  const filtered = sorted.slice(0, maxComments);
  const omittedCount = Math.max(0, totalCount - maxComments);

  return {
    filtered,
    totalCount,
    omittedCount,
  };
}

/**
 * Obtiene estadísticas de severidad
 */
export function getSeverityStats(comments: ReviewComment[]): {
  critical: number;
  warning: number;
  suggestion: number;
} {
  return {
    critical: comments.filter(c => c.severity === 'critical').length,
    warning: comments.filter(c => c.severity === 'warning').length,
    suggestion: comments.filter(c => c.severity === 'suggestion').length,
  };
}
