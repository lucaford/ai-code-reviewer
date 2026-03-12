# 📋 Configuración de Reglas de Code Review

El AI Code Review Agent permite personalizar las reglas y principios que debe seguir al analizar tu código. Esto es especialmente útil para equipos con estándares específicos o proyectos con tecnologías particulares.

## 🎯 Configuración Rápida

### 1. Crear archivo de configuración

Crea un archivo `.reviewrc.json` en la **raíz de tu proyecto**:

```json
{
  "language": "Java",
  "framework": "Spring Boot",
  "strictMode": true,
  "focusAreas": [
    {
      "category": "PRINCIPIOS SOLID",
      "rules": [
        "Single Responsibility: Cada clase debe tener una única responsabilidad",
        "Open/Closed: Abierto para extensión, cerrado para modificación",
        "Liskov Substitution: Las subclases deben ser sustituibles",
        "Interface Segregation: Interfaces pequeñas y específicas",
        "Dependency Inversion: Depender de abstracciones"
      ]
    }
  ],
  "customInstructions": "Este es un proyecto enterprise. Prioriza arquitectura limpia."
}
```

### 2. Hacer commit

```bash
git add .reviewrc.json
git commit -m "Add custom code review rules"
git push
```

¡Listo! El reviewer usará tu configuración en todos los PRs futuros.

## 📝 Estructura del Archivo

### Propiedades Disponibles

| Propiedad | Tipo | Descripción | Opcional |
|-----------|------|-------------|----------|
| `language` | string | Lenguaje principal (Java, TypeScript, Python, etc.) | ✅ |
| `framework` | string | Framework usado (Spring Boot, React, Django, etc.) | ✅ |
| `strictMode` | boolean | Activa modo estricto (más riguroso) | ✅ (default: false) |
| `focusAreas` | array | Categorías de reglas personalizadas | ✅ |
| `customInstructions` | string | Instrucciones adicionales para el reviewer | ✅ |

### Estructura de focusAreas

```json
{
  "focusAreas": [
    {
      "category": "NOMBRE DE LA CATEGORÍA",
      "rules": [
        "Regla 1: descripción",
        "Regla 2: descripción",
        "Regla 3: descripción"
      ]
    }
  ]
}
```

## 🔧 Ejemplos por Tecnología

### Java + Spring Boot

```json
{
  "language": "Java",
  "framework": "Spring Boot",
  "strictMode": true,
  "focusAreas": [
    {
      "category": "PRINCIPIOS SOLID",
      "rules": [
        "Single Responsibility: Cada clase debe tener una única responsabilidad",
        "Dependency Inversion: Usar interfaces en lugar de clases concretas"
      ]
    },
    {
      "category": "SPRING BOOT",
      "rules": [
        "Inyección de dependencias mediante constructor",
        "Uso apropiado de @Transactional",
        "DTOs separados de entidades JPA",
        "Validación con @Valid"
      ]
    },
    {
      "category": "JPA/HIBERNATE",
      "rules": [
        "Uso de fetch types apropiados (LAZY vs EAGER)",
        "Queries optimizadas con @Query",
        "Cascade types correctos en relaciones"
      ]
    }
  ],
  "customInstructions": "Arquitectura en capas: Controller → Service → Repository"
}
```

### TypeScript + React

```json
{
  "language": "TypeScript",
  "framework": "React",
  "strictMode": true,
  "focusAreas": [
    {
      "category": "TYPESCRIPT",
      "rules": [
        "Evitar 'any', usar tipos específicos",
        "Usar interfaces para props de componentes",
        "Type guards apropiados"
      ]
    },
    {
      "category": "REACT BEST PRACTICES",
      "rules": [
        "Hooks correctamente usados (reglas de hooks)",
        "useEffect con dependencias correctas",
        "Evitar re-renders innecesarios (useMemo, useCallback)",
        "Keys apropiadas en listas",
        "Componentes funcionales sobre class components"
      ]
    },
    {
      "category": "PERFORMANCE",
      "rules": [
        "Code splitting con lazy loading",
        "Memoización apropiada",
        "Optimización de bundle size"
      ]
    }
  ],
  "customInstructions": "Priorizar type safety y performance de componentes"
}
```

### Python + Django

```json
{
  "language": "Python",
  "framework": "Django",
  "strictMode": true,
  "focusAreas": [
    {
      "category": "PYTHON PEP 8",
      "rules": [
        "Convenciones de naming (snake_case)",
        "Type hints en funciones públicas",
        "Docstrings en clases y funciones"
      ]
    },
    {
      "category": "DJANGO BEST PRACTICES",
      "rules": [
        "Queries ORM optimizadas (select_related, prefetch_related)",
        "Validación en forms y serializers",
        "Uso de transactions.atomic",
        "Permisos y autenticación correctos"
      ]
    },
    {
      "category": "SEGURIDAD",
      "rules": [
        "CSRF protection habilitado",
        "Queries parametrizadas (nunca string concatenation)",
        "XSS prevention en templates"
      ]
    }
  ],
  "customInstructions": "Seguir Django patterns y security best practices"
}
```

### Node.js + Express

```json
{
  "language": "TypeScript",
  "framework": "Express",
  "strictMode": false,
  "focusAreas": [
    {
      "category": "API REST",
      "rules": [
        "Uso correcto de métodos HTTP (GET, POST, PUT, DELETE)",
        "Códigos de respuesta apropiados (200, 201, 400, 404, 500)",
        "Validación de request body",
        "Manejo de errores con middleware"
      ]
    },
    {
      "category": "SEGURIDAD",
      "rules": [
        "Validación y sanitización de input",
        "Rate limiting en endpoints públicos",
        "JWT tokens manejados correctamente",
        "No exponer stack traces en producción"
      ]
    },
    {
      "category": "ASYNC/AWAIT",
      "rules": [
        "Usar async/await en lugar de callbacks",
        "Manejo apropiado de errores con try/catch",
        "Evitar callback hell"
      ]
    }
  ],
  "customInstructions": "API RESTful siguiendo convenciones estándar"
}
```

## 🎨 Configuraciones Pre-definidas

El proyecto incluye configuraciones predefinidas que puedes usar como base. Estas están en `src/config/rules.config.ts`:

- `DEFAULT_REVIEW_CONFIG` - Configuración general (buenas prácticas universales)
- `JAVA_SPRING_CONFIG` - Específica para Java + Spring Boot
- `TYPESCRIPT_REACT_CONFIG` - Específica para TypeScript + React
- `PYTHON_DJANGO_CONFIG` - Específica para Python + Django

### Usar una configuración predefinida

Para usar una configuración predefinida como base, copia el ejemplo correspondiente:

```bash
# Para Spring Boot
cp .reviewrc.example.json .reviewrc.json
```

Luego edita `.reviewrc.json` según tus necesidades.

## 🔍 Modo Estricto

El modo estricto (`"strictMode": true`) hace que el reviewer sea más riguroso:

- ✅ Reporta problemas menores de código
- ✅ Más estricto con principios SOLID
- ✅ Revisa convenciones de naming más detalladamente
- ✅ Identifica code smells sutiles

**Cuándo usar strictMode:**
- ✅ Proyectos nuevos donde quieres establecer altos estándares
- ✅ Código crítico (seguridad, finanzas, salud)
- ✅ Equipos que priorizan calidad sobre velocidad

**Cuándo NO usar strictMode:**
- ❌ Proyectos legacy con mucho código existente
- ❌ Prototipado rápido
- ❌ Equipos que prefieren feedback menos estricto

## 🎯 Categorías de Reglas Comunes

### Principios SOLID
```json
{
  "category": "PRINCIPIOS SOLID",
  "rules": [
    "Single Responsibility: Una clase, una responsabilidad",
    "Open/Closed: Abierto para extensión, cerrado para modificación",
    "Liskov Substitution: Subclases sustituibles por clase base",
    "Interface Segregation: Interfaces específicas, no generales",
    "Dependency Inversion: Depender de abstracciones"
  ]
}
```

### Clean Code
```json
{
  "category": "CLEAN CODE",
  "rules": [
    "Nombres descriptivos y significativos",
    "Funciones pequeñas (< 20 líneas idealmente)",
    "DRY - Don't Repeat Yourself",
    "Evitar números mágicos (usar constantes)",
    "Comentarios útiles, no obvios"
  ]
}
```

### Seguridad
```json
{
  "category": "SEGURIDAD",
  "rules": [
    "Validación de input en todos los entry points",
    "No hardcodear credenciales o API keys",
    "Uso de prepared statements (prevenir SQL injection)",
    "Autenticación y autorización en endpoints sensibles",
    "Sanitización de output (prevenir XSS)"
  ]
}
```

### Performance
```json
{
  "category": "PERFORMANCE",
  "rules": [
    "Complejidad algorítmica apropiada (O(n), O(log n))",
    "Evitar N+1 queries en ORMs",
    "Caching de datos frecuentemente accedidos",
    "Lazy loading apropiado",
    "Optimización de queries de base de datos"
  ]
}
```

## 💡 Tips y Mejores Prácticas

### 1. Empieza Simple

No agregues demasiadas reglas desde el inicio. Comienza con lo más importante:

```json
{
  "focusAreas": [
    {
      "category": "SEGURIDAD",
      "rules": [
        "Validación de input",
        "No hardcodear credenciales"
      ]
    },
    {
      "category": "BUGS COMUNES",
      "rules": [
        "Null checks apropiados",
        "Manejo de errores"
      ]
    }
  ]
}
```

### 2. Itera Basado en Feedback

Ajusta las reglas según el feedback del equipo:
- ¿El reviewer es muy estricto? → Reduce reglas o desactiva `strictMode`
- ¿Faltan cosas importantes? → Agrega reglas específicas

### 3. Documenta Reglas Custom

Sé específico en la descripción de reglas personalizadas:

```json
{
  "rules": [
    "Uso de DTOs: Nunca exponer entidades JPA en controllers, siempre usar DTOs",
    "Logging: Usar SLF4J con nivel apropiado (DEBUG, INFO, WARN, ERROR)"
  ]
}
```

### 4. Comparte con el Equipo

El archivo `.reviewrc.json` debe estar en el repositorio y ser compartido:

```bash
git add .reviewrc.json
git commit -m "docs: add code review rules for Spring Boot"
git push
```

### 5. Revisa Periódicamente

Las reglas deben evolucionar con tu proyecto. Revisa `.reviewrc.json` cada trimestre.

## 🧪 Probar tu Configuración

1. Crea `.reviewrc.json` con tus reglas
2. Abre un PR con cambios de código
3. Revisa los comentarios del AI reviewer
4. Ajusta las reglas según sea necesario

## 📚 Schema de Validación

Para autocompletado en editores, el proyecto incluye `.reviewrc.schema.json`. En VS Code, agrega a tu `settings.json`:

```json
{
  "json.schemas": [
    {
      "fileMatch": [".reviewrc.json"],
      "url": "./.reviewrc.schema.json"
    }
  ]
}
```

## ❓ FAQ

### ¿Puedo tener diferentes reglas por directorio?

Actualmente no, pero está en el roadmap. Por ahora, usa un solo `.reviewrc.json` en la raíz.

### ¿Las reglas sobrescriben las default?

No, se combinan. Si defines `focusAreas`, se **reemplazan** las categorías default. Si no defines `focusAreas`, se usan las default.

### ¿Puedo deshabilitar completamente ciertas categorías?

Sí, simplemente no las incluyas en `focusAreas`:

```json
{
  "focusAreas": [
    {
      "category": "SEGURIDAD",
      "rules": ["..."]
    }
    // No incluir PERFORMANCE si no quieres que la revise
  ]
}
```

### ¿El archivo debe llamarse exactamente .reviewrc.json?

Sí, debe ser exactamente `.reviewrc.json` en la raíz del proyecto.

## 🔗 Recursos Adicionales

- **Ejemplos**: Ver `.reviewrc.example.json` en el repositorio
- **Configs predefinidas**: Ver `src/config/rules.config.ts`
- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID
- **Clean Code**: "Clean Code" por Robert C. Martin

---

¿Tienes dudas sobre configuración? Abre un issue en GitHub.
