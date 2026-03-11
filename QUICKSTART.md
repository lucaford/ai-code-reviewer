# 🚀 Guía de Inicio Rápido

## Para usar este agente en TU repositorio

### Opción 1: Copiar archivos a tu repo existente

1. **Copia el workflow de GitHub Actions:**
   ```bash
   mkdir -p .github/workflows
   cp agent-code-review/.github/workflows/code-review.yml .github/workflows/
   ```

2. **Copia el código del agente:**
   ```bash
   mkdir -p ai-reviewer
   cp -r agent-code-review/src ai-reviewer/
   cp agent-code-review/package.json ai-reviewer/
   cp agent-code-review/tsconfig.json ai-reviewer/
   ```

3. **Instala dependencias:**
   ```bash
   cd ai-reviewer
   npm install
   npm run build
   ```

4. **Actualiza el workflow** para apuntar a la ubicación correcta:
   ```yaml
   # En .github/workflows/code-review.yml
   - name: Install dependencies
     run: cd ai-reviewer && npm ci
   
   - name: Build TypeScript
     run: cd ai-reviewer && npm run build
   
   - name: Run AI Code Review
     run: node ai-reviewer/dist/index.js
   ```

5. **Configura los secrets en GitHub:**
   - Ve a Settings → Secrets and variables → Actions
   - **Para usar Kimi (recomendado)**: Agrega `KIMI_API_KEY` con tu key de Moonshot AI
   - **Para usar Claude**: Agrega `ANTHROPIC_API_KEY` con tu key de Anthropic
   - Opcionalmente, agrega una variable `AI_PROVIDER` (en la pestaña Variables) con valor `kimi` o `claude`

6. **Commit y push:**
   ```bash
   git add .github/workflows/code-review.yml ai-reviewer/
   git commit -m "Add AI code review agent"
   git push
   ```

### Opción 2: Usar como GitHub Action reutilizable (Futuro)

Esta funcionalidad se implementará en el futuro para permitir usar el agente sin copiar archivos.

## Probar el Agente

1. **Crea un branch nuevo:**
   ```bash
   git checkout -b test-ai-review
   ```

2. **Haz algunos cambios de prueba:**
   ```bash
   # Crea un archivo con código problemático intencionalmente
   echo 'function test() { var x = null; return x.value; }' > test.js
   git add test.js
   git commit -m "Test AI review with buggy code"
   git push origin test-ai-review
   ```

3. **Abre un Pull Request en GitHub**

4. **Espera a que el workflow se ejecute** (30-60 segundos)

5. **Revisa los comentarios del agente** en el PR

## Personalización

### Cambiar qué archivos analizar

Edita `src/github/pr-fetcher.ts`:

```typescript
const extensions = [
  '.ts', '.tsx', '.js', '.jsx',  // Tu stack aquí
];
```

### Ajustar el análisis

Edita `src/prompts/review-prompts.ts` para cambiar:
- Aspectos a revisar
- Tono de los comentarios
- Severidad de los problemas

### Cambiar el proveedor de IA

**Opción 1: Variable en GitHub**
1. Settings → Secrets and variables → Actions → Variables
2. Crea `AI_PROVIDER` con valor `kimi` o `claude`

**Opción 2: Variable de entorno local**
En tu archivo `.env`:
```bash
AI_PROVIDER=kimi  # o 'claude'
```

### Cambiar el modelo de IA

**Para Kimi** (edita `src/analyzer/kimi-client.ts`):
```typescript
// Diferentes tamaños de contexto
constructor(apiKey: string, model: string = 'moonshot-v1-128k')  // 128K tokens
// Alternativas: moonshot-v1-32k, moonshot-v1-8k
```

**Para Claude** (edita `src/analyzer/claude-client.ts`):
```typescript
// Más rápido y económico
constructor(apiKey: string, model: string = 'claude-3-haiku-20240307')

// Más profundo y preciso
constructor(apiKey: string, model: string = 'claude-3-opus-20240229')
```

## Costos Aproximados

**Con Kimi K2.5 (Recomendado):**
- PR pequeño: ~¥0.10-0.30 (~$0.014-0.042)
- PR mediano: ~¥0.30-0.80 (~$0.042-0.112)
- PR grande: ~¥0.80-2.00 (~$0.112-0.280)

**Con Claude 3.5 Sonnet:**
- PR pequeño: ~$0.05-0.15
- PR mediano: ~$0.15-0.40
- PR grande: ~$0.40-1.00

## Solución de Problemas

**El workflow no se ejecuta:**
- Verifica que GitHub Actions está habilitado
- Revisa los permisos del workflow

**Error de API key:**
- Confirma que el secret correspondiente está configurado (`KIMI_API_KEY` o `ANTHROPIC_API_KEY`)
- Verifica que la key es válida en platform.moonshot.ai o console.anthropic.com
- Asegúrate que el proveedor configurado coincide con la key que proporcionaste

**Sin comentarios en el PR:**
- Revisa los logs del workflow en GitHub Actions
- Verifica que los archivos modificados tienen extensiones soportadas
- Asegúrate que hay cambios de código real (no solo README/docs)

## Siguientes Pasos

- [ ] Ajusta los prompts para tu proyecto específico
- [ ] Configura reglas específicas de tu stack
- [ ] Integra con tus linters existentes
- [ ] Agrega métricas y analytics
- [ ] Crea feedback loop para mejorar el agente

## Soporte

Si tienes problemas:
1. Revisa los logs de GitHub Actions
2. Verifica la configuración de secrets
3. Consulta la documentación en README.md
