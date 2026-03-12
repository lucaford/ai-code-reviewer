/**
 * Configuración de reglas para el Code Review Agent
 * 
 * Este archivo define las reglas y principios que el agente debe seguir
 * al analizar código. Puedes personalizarlo según las necesidades de tu equipo.
 */

export interface ReviewRule {
  category: string;
  rules: string[];
}

export interface ReviewConfig {
  language?: string;
  framework?: string;
  focusAreas: ReviewRule[];
  customInstructions?: string;
  strictMode?: boolean;
  maxCommentsPerReview?: number;
  commentLanguage?: 'es' | 'en';
}

/**
 * Configuración por defecto - Buenas prácticas generales
 */
export const DEFAULT_REVIEW_CONFIG: ReviewConfig = {
  strictMode: false,
  maxCommentsPerReview: 15,
  commentLanguage: 'es',
  focusAreas: [
    {
      category: 'BUGS Y ERRORES POTENCIALES',
      rules: [
        'Errores lógicos',
        'Edge cases no manejados',
        'Null/undefined pointer exceptions',
        'Race conditions',
        'Manejo incorrecto de errores',
        'Memory leaks',
        'Infinite loops',
      ],
    },
    {
      category: 'SEGURIDAD',
      rules: [
        'Vulnerabilidades de inyección (SQL, XSS, CSRF, etc.)',
        'Datos sensibles expuestos (API keys, passwords, tokens)',
        'Validación de entrada faltante o incorrecta',
        'Autenticación/autorización débil',
        'Uso de dependencias con vulnerabilidades conocidas',
        'Exposición de información sensible en logs',
        'Manejo inseguro de archivos subidos',
      ],
    },
    {
      category: 'PRINCIPIOS SOLID',
      rules: [
        'Single Responsibility: Cada clase/función debe tener una única responsabilidad',
        'Open/Closed: Abierto para extensión, cerrado para modificación',
        'Liskov Substitution: Las subclases deben ser sustituibles por sus clases base',
        'Interface Segregation: Interfaces pequeñas y específicas en lugar de grandes e generales',
        'Dependency Inversion: Depender de abstracciones, no de implementaciones concretas',
      ],
    },
    {
      category: 'CLEAN CODE',
      rules: [
        'Nombres descriptivos y significativos',
        'Funciones pequeñas y con un único propósito',
        'Código DRY (Don\'t Repeat Yourself)',
        'Evitar números mágicos (usar constantes nombradas)',
        'Comentarios útiles, no obvios',
        'Manejo apropiado de errores',
        'Código auto-documentado',
      ],
    },
    {
      category: 'ARQUITECTURA Y DISEÑO',
      rules: [
        'Separación de concerns (UI, lógica de negocio, datos)',
        'Patrones de diseño apropiados',
        'Bajo acoplamiento, alta cohesión',
        'Evitar dependencias circulares',
        'Modularidad y reusabilidad',
        'Principio de menor privilegio',
      ],
    },
    {
      category: 'PERFORMANCE',
      rules: [
        'Complejidad algorítmica apropiada (O(n), O(log n), etc.)',
        'Evitar operaciones costosas en loops',
        'Uso eficiente de recursos (memoria, CPU)',
        'Queries a base de datos optimizadas',
        'Caching apropiado',
        'Lazy loading cuando sea necesario',
      ],
    },
    {
      category: 'TESTING',
      rules: [
        'Código testeable (bajo acoplamiento)',
        'Tests unitarios para lógica de negocio',
        'Tests de integración cuando sea necesario',
        'Edge cases cubiertos en tests',
        'No testear implementación, testear comportamiento',
      ],
    },
  ],
};

/**
 * Ejemplo: Configuración específica para proyectos Java/Spring Boot
 */
export const JAVA_SPRING_CONFIG: ReviewConfig = {
  language: 'Java',
  framework: 'Spring Boot',
  strictMode: true,
  focusAreas: [
    ...DEFAULT_REVIEW_CONFIG.focusAreas,
    {
      category: 'JAVA ESPECÍFICO',
      rules: [
        'Uso apropiado de Optional en lugar de null checks',
        'Stream API usado correctamente',
        'Manejo apropiado de excepciones checked vs unchecked',
        'Uso de interfaces funcionales cuando sea apropiado',
        'Generics correctamente implementados',
        'Thread-safety en código concurrente',
      ],
    },
    {
      category: 'SPRING BOOT BEST PRACTICES',
      rules: [
        'Inyección de dependencias mediante constructor (no @Autowired en campos)',
        'Uso apropiado de @Transactional',
        'DTOs separados de entidades JPA',
        'Validación con @Valid y constraint annotations',
        'Manejo global de excepciones con @ControllerAdvice',
        'Configuration properties con @ConfigurationProperties',
        'No usar @RequestMapping, usar @GetMapping, @PostMapping, etc.',
      ],
    },
  ],
  customInstructions: `
Este es un proyecto Spring Boot. Presta especial atención a:
- Arquitectura en capas (Controller → Service → Repository)
- Uso correcto de anotaciones de Spring
- Seguridad con Spring Security
- Transacciones de base de datos
  `,
};

/**
 * Ejemplo: Configuración específica para proyectos TypeScript/React
 */
export const TYPESCRIPT_REACT_CONFIG: ReviewConfig = {
  language: 'TypeScript',
  framework: 'React',
  strictMode: true,
  focusAreas: [
    ...DEFAULT_REVIEW_CONFIG.focusAreas,
    {
      category: 'TYPESCRIPT ESPECÍFICO',
      rules: [
        'Tipos explícitos en lugar de any',
        'Uso apropiado de interfaces vs types',
        'Uso de utility types (Partial, Pick, Omit, etc.)',
        'Enums vs union types',
        'Null safety con strict null checks',
        'Type guards apropiados',
      ],
    },
    {
      category: 'REACT BEST PRACTICES',
      rules: [
        'Hooks correctamente usados (reglas de hooks)',
        'useEffect con dependencias correctas',
        'Evitar re-renders innecesarios (useMemo, useCallback)',
        'Keys apropiadas en listas',
        'Props drilling evitado (Context o state management)',
        'Componentes funcionales sobre class components',
        'Error boundaries para manejo de errores',
        'Accesibilidad (a11y) en componentes',
      ],
    },
  ],
  customInstructions: `
Este es un proyecto React con TypeScript. Prioriza:
- Type safety estricto
- Performance de componentes
- Accesibilidad
- Hooks patterns modernos
  `,
};

/**
 * Ejemplo: Configuración específica para proyectos Python/Django
 */
export const PYTHON_DJANGO_CONFIG: ReviewConfig = {
  language: 'Python',
  framework: 'Django',
  strictMode: true,
  focusAreas: [
    ...DEFAULT_REVIEW_CONFIG.focusAreas,
    {
      category: 'PYTHON ESPECÍFICO',
      rules: [
        'PEP 8 compliance',
        'Type hints apropiados',
        'Uso de context managers (with statement)',
        'List/dict comprehensions apropiadas',
        'Generators para datos grandes',
        'Decoradores usados correctamente',
      ],
    },
    {
      category: 'DJANGO BEST PRACTICES',
      rules: [
        'Queries ORM optimizadas (select_related, prefetch_related)',
        'Uso apropiado de Model managers',
        'Validación en forms y serializers',
        'Uso de transactions.atomic cuando sea necesario',
        'Permisos y autenticación correctos',
        'Settings separados por ambiente',
        'Migraciones correctamente generadas',
      ],
    },
  ],
  customInstructions: `
Este es un proyecto Django. Enfócate en:
- Security best practices de Django
- ORM query optimization
- Model design apropiado
- Siguiendo Django patterns
  `,
};

/**
 * Carga la configuración desde archivo o usa default
 */
export function loadReviewConfig(): ReviewConfig {
  try {
    // Intentar leer .reviewrc.json desde la raíz del proyecto
    const fs = require('fs');
    const path = require('path');
    
    const configPath = path.join(process.cwd(), '.reviewrc.json');
    
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf-8');
      const customConfig = JSON.parse(configFile) as ReviewConfig;
      
      console.log('✓ Configuración personalizada cargada desde .reviewrc.json');
      
      // Merge custom config con default (si no especifica focusAreas, usa default)
      return {
        ...DEFAULT_REVIEW_CONFIG,
        ...customConfig,
        focusAreas: customConfig.focusAreas || DEFAULT_REVIEW_CONFIG.focusAreas,
      };
    }
  } catch (error) {
    console.warn('⚠️  No se pudo cargar .reviewrc.json, usando configuración default');
  }
  
  return DEFAULT_REVIEW_CONFIG;
}

/**
 * Genera el texto de reglas basado en la configuración
 */
export function generateRulesText(config: ReviewConfig): string {
  let text = '';

  // Agregar información de lenguaje/framework si existe
  if (config.language || config.framework) {
    text += `CONTEXTO DEL PROYECTO:\n`;
    if (config.language) text += `- Lenguaje: ${config.language}\n`;
    if (config.framework) text += `- Framework: ${config.framework}\n`;
    text += '\n';
  }

  // Agregar reglas por categoría
  config.focusAreas.forEach((area, index) => {
    text += `${index + 1}. **${area.category}**:\n`;
    area.rules.forEach((rule) => {
      text += `   - ${rule}\n`;
    });
    text += '\n';
  });

  // Agregar instrucciones custom si existen
  if (config.customInstructions) {
    text += `INSTRUCCIONES ADICIONALES:\n${config.customInstructions}\n\n`;
  }

  // Agregar nota sobre strict mode
  if (config.strictMode) {
    text += `MODO ESTRICTO ACTIVADO: Sé más riguroso en la revisión y reporta incluso problemas menores.\n\n`;
  }

  return text;
}
