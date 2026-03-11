# 🎉 Soporte Multi-Proveedor de IA - Kimi K2.5 + Claude

## ✅ Cambios Implementados

Se ha agregado soporte completo para **Kimi K2.5** (Moonshot AI) además de Claude, con Kimi configurado como el proveedor por defecto.

### 📁 Nuevos Archivos

1. **`src/analyzer/kimi-client.ts`**
   - Cliente completo para Kimi API (Moonshot AI)
   - Usa API compatible con OpenAI
   - Modelo por defecto: `moonshot-v1-128k` (128K tokens de contexto)

2. **`src/analyzer/types.ts`**
   - Definiciones de tipos para múltiples proveedores
   - Interface `AIAnalyzer` común
   - Tipo `AIProvider` con opciones 'kimi' | 'claude'

3. **`src/analyzer/index.ts`**
   - Factory pattern para crear el analyzer correcto
   - Función `createAnalyzer()` basada en configuración

### 🔄 Archivos Modificados

1. **`src/index.ts`**
   - Ahora detecta el proveedor de IA (por defecto: kimi)
   - Lee `KIMI_API_KEY` y `ANTHROPIC_API_KEY`
   - Variable de entorno `AI_PROVIDER` para cambiar proveedor
   - Validación de API key según proveedor seleccionado

2. **`.github/workflows/code-review.yml`**
   - Agrega `KIMI_API_KEY` a secrets
   - Agrega variable `AI_PROVIDER` (por defecto: 'kimi')
   - Mantiene soporte para `ANTHROPIC_API_KEY`

3. **`.env.example`**
   - Documentación de `KIMI_API_KEY` (recomendado)
   - Documentación de `AI_PROVIDER`
   - Mantiene `ANTHROPIC_API_KEY` como opcional

4. **`README.md`**
   - Sección completa sobre ambos proveedores
   - Instrucciones para obtener API key de Kimi
   - Comparación de costos entre proveedores
   - Guía para cambiar entre proveedores
   - Troubleshooting actualizado

5. **`QUICKSTART.md`**
   - Instrucciones actualizadas con ambos proveedores
   - Configuración de secrets para Kimi y Claude
   - Costos comparativos

6. **`package.json`**
   - Nueva dependencia: `openai` (para cliente de Kimi)

## 🚀 Cómo Usar

### Por defecto (Kimi K2.5)

1. **Obtén tu API key de Kimi:**
   - Ve a https://platform.moonshot.ai/
   - Crea una cuenta
   - Genera una API key

2. **Configura en GitHub:**
   - Settings → Secrets and variables → Actions
   - Agrega secret `KIMI_API_KEY` con tu key

3. **¡Listo!** El agente usará Kimi automáticamente

### Para usar Claude

**Opción 1: Variable de repositorio**
1. Settings → Secrets and variables → Actions
2. En la pestaña "Variables", crea `AI_PROVIDER` con valor `claude`
3. En "Secrets", agrega `ANTHROPIC_API_KEY`

**Opción 2: Editar workflow**
```yaml
env:
  AI_PROVIDER: 'claude'
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Para desarrollo local

En tu archivo `.env`:
```bash
# Usar Kimi (por defecto)
AI_PROVIDER=kimi
KIMI_API_KEY=sk-xxxxxxxxxxxxx

# O usar Claude
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

## 💰 Comparación de Costos

| Tipo de PR | Kimi K2.5 | Claude 3.5 Sonnet |
|-----------|-----------|-------------------|
| Pequeño (1-3 archivos) | ~¥0.10-0.30 (~$0.014-0.042) | ~$0.05-0.15 |
| Mediano (4-10 archivos) | ~¥0.30-0.80 (~$0.042-0.112) | ~$0.15-0.40 |
| Grande (10+ archivos) | ~¥0.80-2.00 (~$0.112-0.280) | ~$0.40-1.00 |

**Kimi es aproximadamente 3-5x más económico que Claude** para la mayoría de casos de uso.

## 🔧 Modelos Disponibles

### Kimi (Moonshot AI)
- `moonshot-v1-128k` (por defecto) - 128K tokens de contexto
- `moonshot-v1-32k` - 32K tokens de contexto
- `moonshot-v1-8k` - 8K tokens de contexto

### Claude (Anthropic)
- `claude-3-5-sonnet-20241022` (por defecto) - Balance óptimo
- `claude-3-opus-20240229` - Análisis más profundo
- `claude-3-haiku-20240307` - Más rápido y económico

## ✨ Ventajas de Kimi K2.5

1. **Precio competitivo**: 3-5x más económico que Claude
2. **Contexto grande**: 128K tokens de contexto por defecto
3. **Optimizado para código**: Entrenado específicamente para análisis de código
4. **Soporte bilingüe**: Excelente en chino e inglés
5. **API compatible**: Usa el formato estándar OpenAI

## 🎯 Arquitectura

```
Usuario configura API key
         ↓
   index.ts detecta proveedor
         ↓
   createAnalyzer() factory
         ↓
    ┌─────────────┐
    │  AI_PROVIDER │
    └──────┬───────┘
           │
    ┌──────┴────────┐
    ↓               ↓
KimiAnalyzer  ClaudeAnalyzer
    ↓               ↓
Moonshot API   Anthropic API
```

## 🧪 Testing

Para probar ambos proveedores:

```bash
# Probar con Kimi
AI_PROVIDER=kimi KIMI_API_KEY=your-key npm start

# Probar con Claude
AI_PROVIDER=claude ANTHROPIC_API_KEY=your-key npm start
```

## 📚 Recursos

- **Kimi (Moonshot AI)**: https://platform.moonshot.ai/docs
- **Anthropic Claude**: https://docs.anthropic.com/
- **OpenAI SDK**: https://github.com/openai/openai-node

---

**Nota**: Por defecto, el agente usa Kimi K2.5 por su excelente relación precio-rendimiento. Puedes cambiar a Claude en cualquier momento sin modificar código.
