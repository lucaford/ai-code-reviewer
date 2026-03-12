# 🤖 AI Code Review Agent

Un agente automatizado de code review impulsado por IA que analiza Pull Requests en GitHub y proporciona feedback inteligente sobre bugs, seguridad y mejores prácticas.

> **⚡ Instalación en 1 comando**: Compatible con cualquier lenguaje (Java, Python, Node.js, Go, etc.)
> ```bash
> npx @lucaford/ai-code-reviewer install
> ```

## ✨ Características

- 🔍 **Análisis Automático**: Se ejecuta automáticamente en cada Pull Request
- 🧠 **Múltiples Proveedores de IA**: Soporta Kimi K2.5 (Moonshot AI) y Claude 3.5 Sonnet (Anthropic)
- 🎯 **Revisión Enfocada**: Detecta bugs, vulnerabilidades de seguridad y violaciones de mejores prácticas
- 💬 **Comentarios Inline**: Publica comentarios directamente en las líneas problemáticas
- 📊 **Resumen Ejecutivo**: Genera un resumen del análisis con severidades
- ⚡ **Rápido y Eficiente**: Analiza múltiples archivos en paralelo
- 🎨 **Reglas Personalizables**: Configura principios SOLID, estándares del equipo y reglas específicas del proyecto

## 🚀 Instalación Rápida

### Método 1: NPM Package (Recomendado) ⚡

La forma más fácil y mantenible de instalar y actualizar:

```bash
# Instalar en tu proyecto
cd /path/to/your/project
npx @lucaford/ai-code-reviewer install
```

El CLI te guiará a través del proceso de instalación. Automáticamente:
- ✅ Valida requisitos (Git, Node.js)
- ✅ Copia archivos necesarios
- ✅ Instala dependencias
- ✅ Compila TypeScript
- ✅ Configura el workflow de GitHub Actions

**Para actualizar en el futuro**:
```bash
npx @lucaford/ai-code-reviewer update
```

**Comandos disponibles**:
```bash
npx @lucaford/ai-code-reviewer install   # Instalar
npx @lucaford/ai-code-reviewer update    # Actualizar
npx @lucaford/ai-code-reviewer version   # Ver versión
npx @lucaford/ai-code-reviewer help      # Ayuda
```

### Método 2: Instalación Remota con Script

Si prefieres un script bash:

```bash
# Desde el root de tu proyecto
cd /path/to/your/project
curl -fsSL https://raw.githubusercontent.com/lucaford/ai-code-reviewer/main/remote-install.sh | bash
```

O con wget:
```bash
cd /path/to/your/project
wget -qO- https://raw.githubusercontent.com/lucaford/ai-code-reviewer/main/remote-install.sh | bash
```

**Compatible con cualquier lenguaje**: Java, Python, Node.js, Go, Ruby, PHP, C#, Rust, etc.

**📖 Documentación completa**: Ver [INSTALL.md](./INSTALL.md)

### Método 3: Script Local

Si ya clonaste el repositorio:

```bash
# Desde el root de tu proyecto
cd /path/to/your/project
bash /path/to/ai-code-reviewer/install-ai-reviewer.sh
```

### Método 4: Instalación Manual

Si prefieres hacerlo manualmente:

#### Paso 1: Clonar o copiar el repositorio

```bash
git clone <tu-repo>
cd agent-code-review
```

#### Paso 2: Instalar dependencias

```bash
npm install
```

#### Paso 3: Compilar TypeScript

```bash
npm run build
```

#### Paso 4: Configurar Secrets en GitHub

Ve a tu repositorio en GitHub:
1. Settings → Secrets and variables → Actions
2. Agrega el secret correspondiente al proveedor que uses:
   - **Para Kimi (recomendado)**: `KIMI_API_KEY`
   - **Para Claude**: `ANTHROPIC_API_KEY`

**Nota**: `GITHUB_TOKEN` es provisto automáticamente por GitHub Actions.

#### Paso 5: Obtener API Key

#### Opción A: Kimi K2.5 (Por defecto - Recomendado)

1. Ve a [platform.moonshot.ai](https://platform.moonshot.ai/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" y crea una nueva key
4. Copia la key y agrégala como secret `KIMI_API_KEY` en GitHub

**Ventajas de Kimi:**
- Modelo optimizado para código
- Ventana de contexto de 128K tokens
- Excelente relación precio-rendimiento
- Soporte nativo para chino e inglés

#### Opción B: Claude 3.5 Sonnet (Anthropic)

1. Ve a [console.anthropic.com](https://console.anthropic.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" y crea una nueva key
4. Copia la key y agrégala como secret `ANTHROPIC_API_KEY` en GitHub

#### Paso 6: Cambiar el proveedor de IA (Opcional)

Por defecto se usa **Kimi**. Para cambiar a Claude:

1. Ve a Settings → Secrets and variables → Actions → Variables
2. Crea una nueva variable llamada `AI_PROVIDER` con valor `claude`

O edita `.github/workflows/code-review.yml` y cambia:
```yaml
AI_PROVIDER: ${{ vars.AI_PROVIDER || 'kimi' }}
```

#### Paso 7: Activar el workflow

El workflow ya está configurado en `.github/workflows/code-review.yml` y se activará automáticamente cuando:
- Se abre un nuevo Pull Request
- Se hace push a un PR existente
- Se reabre un PR cerrado

## 🎨 Configurar Reglas Personalizadas (Opcional)

Personaliza las reglas de revisión según las necesidades de tu equipo. Crea un archivo `.reviewrc.json` en la raíz de tu proyecto:

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
        "Dependency Inversion: Depender de abstracciones, no de implementaciones"
      ]
    },
    {
      "category": "SPRING BOOT BEST PRACTICES",
      "rules": [
        "Inyección de dependencias mediante constructor",
        "Uso apropiado de @Transactional",
        "DTOs separados de entidades JPA"
      ]
    }
  ],
  "customInstructions": "Priorizar arquitectura limpia y código testeable"
}
```

**📖 Documentación completa**: Ver [RULES.md](./RULES.md) para guía detallada y ejemplos por tecnología (React, Django, Express, etc.)

## 🔄 Actualizar a Nueva Versión

Si instalaste usando el método NPM (recomendado), actualizar es muy simple:

```bash
cd /path/to/your/project
npx @lucaford/ai-code-reviewer update
```

El comando `update`:
- ✅ Detecta automáticamente la instalación existente (subdirectorio o root)
- ✅ Hace backup de `node_modules` por seguridad
- ✅ Actualiza el código fuente (`src/`)
- ✅ Actualiza configuración (`package.json`, `tsconfig.json`)
- ✅ Actualiza el workflow de GitHub Actions
- ✅ Reinstala dependencias limpias
- ✅ Recompila TypeScript
- ✅ Muestra el cambio de versión (v1.0.0 → v1.1.0)

Después de actualizar, solo necesitas:
```bash
git add .
git commit -m "Update AI Code Reviewer to v1.1.0"
git push
```

### Verificar versión instalada

```bash
# Ver versión del paquete NPM
npx @lucaford/ai-code-reviewer version

# Ver versión en tu proyecto (si está en subdirectorio)
cat .ai-reviewer/package.json | grep version

# Ver versión en tu proyecto (si está en root)
cat package.json | grep version
```

### Actualización manual

Si instalaste con script bash, puedes:
1. Volver a ejecutar el script de instalación (sobrescribirá archivos)
2. O migrar al método NPM:
   ```bash
   npx @lucaford/ai-code-reviewer install
   # Selecciona sobrescribir archivos existentes
   ```

## 📦 Estructura del Proyecto

```
agent-code-review/
├── .github/
│   └── workflows/
│       └── code-review.yml       # GitHub Action workflow
├── src/
│   ├── index.ts                  # Punto de entrada principal
│   ├── analyzer/
│   │   ├── kimi-client.ts        # Cliente de Kimi API
│   │   ├── claude-client.ts      # Cliente de Claude API
│   │   └── index.ts              # Factory de analyzers
│   ├── github/
│   │   ├── pr-fetcher.ts         # Obtener cambios del PR
│   │   └── comment-poster.ts     # Publicar comentarios
│   ├── prompts/
│   │   └── review-prompts.ts     # Prompts para análisis
│   └── types/
│       └── index.ts               # Definiciones de tipos
├── dist/                          # Código compilado
├── package.json
└── tsconfig.json
```

## 🎯 Qué Revisa el Agente

### 1. Bugs y Errores Potenciales
- Errores lógicos
- Edge cases no manejados
- Null/undefined pointer exceptions
- Race conditions
- Manejo incorrecto de errores

### 2. Seguridad
- Vulnerabilidades de inyección (SQL, XSS, etc.)
- Datos sensibles expuestos (API keys, passwords)
- Validación de entrada faltante
- Autenticación/autorización débil
- Dependencias con vulnerabilidades

### 3. Mejores Prácticas
- Violaciones de principios SOLID
- Código duplicado
- Funciones muy largas o complejas
- Nombres poco descriptivos
- Falta de modularidad
- Patrones de diseño incorrectos

## 📝 Ejemplo de Uso

Una vez configurado, el agente trabajará automáticamente:

1. Alguien abre un PR en tu repositorio
2. GitHub Actions se activa automáticamente
3. El agente descarga los cambios del PR
4. La IA (Kimi o Claude) analiza cada archivo modificado
5. Se publican comentarios inline en el código
6. Se genera un resumen del review

### Ejemplo de Comentario

```
🚨 Crítico

Posible inyección SQL. La entrada del usuario se concatena 
directamente en la query sin sanitización.

💡 Sugerencia:
Usa prepared statements o un ORM para prevenir inyección SQL:
`db.query('SELECT * FROM users WHERE id = ?', [userId])`
```

## ⚙️ Configuración Avanzada

### Cambiar el Proveedor de IA

Por defecto se usa **Kimi**. Puedes cambiarlo de varias formas:

**Opción 1: Variable de repositorio (Recomendado)**
1. Settings → Secrets and variables → Actions → Variables
2. Crea `AI_PROVIDER` con valor `claude` o `kimi`

**Opción 2: Variable de entorno en el workflow**
Edita `.github/workflows/code-review.yml`:
```yaml
env:
  AI_PROVIDER: 'claude'  # o 'kimi'
```

### Cambiar el Modelo de IA

**Para Kimi:**
Edita `src/analyzer/kimi-client.ts`:
```typescript
constructor(apiKey: string, model: string = 'moonshot-v1-128k') {
  // Otros modelos disponibles: moonshot-v1-32k, moonshot-v1-8k
}
```

**Para Claude:**
Edita `src/analyzer/claude-client.ts`:
```typescript
constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
  // claude-3-opus-20240229: Análisis más profundo
  // claude-3-haiku-20240307: Más rápido y económico
}
```

### Personalizar los Prompts

Edita `src/prompts/review-prompts.ts` para ajustar:
- Qué aspectos revisar
- Severidad de los problemas
- Estilo de los comentarios
- Formato de las respuestas

### Filtrar Archivos a Analizar

Edita `src/github/pr-fetcher.ts` para cambiar las extensiones de archivo:

```typescript
const extensions = [
  '.ts', '.tsx', '.js', '.jsx',  // JavaScript/TypeScript
  '.py',                          // Python
  '.go',                          // Go
  '.java',                        // Java
  // Agrega más según necesites
];
```

## 💰 Costos Estimados

### Kimi K2.5 (Moonshot AI)
Precios competitivos y excelente relación costo-beneficio:

- **PR pequeño** (1-3 archivos, ~500 líneas): ~¥0.10-0.30 (~$0.014-0.042)
- **PR mediano** (4-10 archivos, ~1000 líneas): ~¥0.30-0.80 (~$0.042-0.112)
- **PR grande** (10+ archivos, ~2000+ líneas): ~¥0.80-2.00 (~$0.112-0.280)

### Claude 3.5 Sonnet (Anthropic)
Precios premium para análisis más profundo:

- **PR pequeño** (1-3 archivos, ~500 líneas): ~$0.05-0.15
- **PR mediano** (4-10 archivos, ~1000 líneas): ~$0.15-0.40
- **PR grande** (10+ archivos, ~2000+ líneas): ~$0.40-1.00

**Nota**: Los precios son aproximados y pueden variar según el contenido específico analizado.

## 🔧 Scripts NPM

```bash
# Compilar TypeScript
npm run build

# Ejecutar localmente (requiere variables de entorno)
npm start

# Limpiar archivos compilados
npm run clean
```

## 🐛 Troubleshooting

### El workflow no se ejecuta
- Verifica que el archivo `.github/workflows/code-review.yml` existe
- Asegúrate que los permisos de GitHub Actions están habilitados en Settings → Actions

### Error: "KIMI_API_KEY no está configurado" o "ANTHROPIC_API_KEY no está configurado"
- Verifica que agregaste el secret correspondiente a tu proveedor en GitHub
- El nombre debe ser exactamente `KIMI_API_KEY` o `ANTHROPIC_API_KEY`
- Asegúrate que el proveedor configurado coincide con la API key que proporcionaste

### Error al publicar comentarios
- Verifica que el workflow tiene permisos de `pull-requests: write`
- Asegúrate que `GITHUB_TOKEN` tiene los permisos necesarios

### La IA no encuentra problemas reales
- Ajusta los prompts en `src/prompts/review-prompts.ts`
- Para análisis más profundo, considera usar Claude 3 Opus
- Proporciona más contexto sobre tu proyecto en los prompts
- Verifica que los archivos modificados tienen código real (no solo documentación)

### Cambiar entre proveedores
- Configura la variable `AI_PROVIDER` en Settings → Secrets and variables → Actions → Variables
- Asegúrate de tener la API key correspondiente configurada como secret

## 📄 Licencia

ISC

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o PR.

## 📚 Recursos

- [Documentación de Kimi (Moonshot AI)](https://platform.moonshot.ai/docs)
- [Documentación de Anthropic Claude](https://docs.anthropic.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Octokit REST API](https://octokit.github.io/rest.js/)

---

Hecho con ❤️ usando Kimi K2.5 y Claude AI
