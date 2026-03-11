# 🚀 Script de Instalación - AI Code Reviewer

Este script permite instalar el AI Code Reviewer en **cualquier repositorio Git** de forma automática, sin importar el lenguaje de programación (Java, Python, Node.js, Go, etc.).

## 📋 Requisitos

- **Git** instalado
- **Node.js** v18 o superior (para compilar TypeScript)
- **npm** (viene con Node.js)
- Estar en un repositorio Git válido

## 🎯 Uso Básico

### Opción 1: Instalación Remota (Más Fácil) ⚡

Instala directamente desde GitHub sin clonar el repositorio:

```bash
cd /path/to/your/project
curl -fsSL https://raw.githubusercontent.com/lucaford/ai-code-reviewer/main/remote-install.sh | bash
```

O con wget:
```bash
cd /path/to/your/project
wget -qO- https://raw.githubusercontent.com/lucaford/ai-code-reviewer/main/remote-install.sh | bash
```

### Opción 2: Script Local

Si ya clonaste el repositorio:

```bash
cd /path/to/your/project
bash /path/to/ai-code-reviewer/install-ai-reviewer.sh
```

### Opción 3: Especificando la ruta del proyecto

```bash
bash /path/to/ai-code-reviewer/install-ai-reviewer.sh /path/to/your/project
```

## 💡 Modos de Instalación

El script te preguntará cómo deseas instalar el reviewer:

### 1️⃣ Subdirectorio (Recomendado)

Instala todo en una carpeta `ai-reviewer/` separada:

```
your-project/
├── ai-reviewer/          ← Todo el código del reviewer aquí
│   ├── src/
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── code-review.yml
└── tu código existente...
```

**Ventajas:**
- ✅ No interfiere con el código de tu proyecto
- ✅ Ideal para proyectos grandes
- ✅ Fácil de actualizar o eliminar

### 2️⃣ Root (Más simple)

Instala los archivos directamente en la raíz:

```
your-project/
├── src/                  ← Código del reviewer
├── dist/
├── package.json
├── tsconfig.json
├── .github/
│   └── workflows/
│       └── code-review.yml
└── tu código existente...
```

**Ventajas:**
- ✅ Configuración más simple
- ✅ Menos carpetas anidadas

**Desventajas:**
- ⚠️ Puede mezclarse con tu proyecto si también usa TypeScript

## 🔄 Proceso de Instalación

El script ejecuta los siguientes pasos automáticamente:

1. **Validaciones**
   - ✓ Verifica que estés en un repositorio Git
   - ✓ Verifica que Node.js y npm estén instalados
   - ✓ Detecta archivos existentes y pregunta antes de sobrescribir

2. **Copia de archivos**
   - 📦 Copia el código fuente
   - 📦 Copia configuración (package.json, tsconfig.json)
   - 📦 Copia el workflow de GitHub Actions

3. **Configuración**
   - 🔧 Ajusta el workflow según el método elegido
   - 📝 Actualiza .gitignore para excluir node_modules y dist

4. **Instalación y compilación**
   - 📥 Instala dependencias con npm
   - 🔨 Compila TypeScript a JavaScript

## ✅ Después de la Instalación

### 1. Configurar API Key en GitHub

Ve a tu repositorio en GitHub:

**Settings → Secrets and variables → Actions → Secrets**

#### Para usar Kimi K2.5 (Recomendado - Más económico)

- Crea un secret: `KIMI_API_KEY`
- Obtén tu key en: https://platform.moonshot.ai/

#### Para usar Claude 3.5 Sonnet (Alternativa)

- Crea un secret: `ANTHROPIC_API_KEY`
- Obtén tu key en: https://console.anthropic.com/
- En **Variables**, crea `AI_PROVIDER` con valor `claude`

### 2. Hacer commit y push

```bash
# Si instalaste en subdirectorio
git add .github/workflows/code-review.yml ai-reviewer/ .gitignore
git commit -m "Add AI Code Reviewer"
git push

# Si instalaste en root
git add .github/workflows/code-review.yml src/ package.json tsconfig.json .gitignore
git commit -m "Add AI Code Reviewer"
git push
```

### 3. Crear un Pull Request

El AI Code Reviewer se activará automáticamente en todos los PRs futuros.

## 🎬 Ejemplos Completos

### Ejemplo 1: Instalación Remota (Más Fácil)

```bash
# Instalar en un proyecto Java directamente desde GitHub
cd ~/projects/my-java-api
curl -fsSL https://raw.githubusercontent.com/lucaford/ai-code-reviewer/main/remote-install.sh | bash

# El script automáticamente:
# ✓ Descarga el repositorio
# ✓ Copia archivos
# ✓ Instala dependencias
# ✓ Compila TypeScript
# ✅ Instalación completada!

# Configurar API key en GitHub y listo!
```

### Ejemplo 2: Instalación Local

```bash
# Instalar en un proyecto Python desde repositorio local
cd ~/projects/my-python-api
bash ~/ai-code-reviewer/install-ai-reviewer.sh

# El script preguntará:
# ¿Cómo deseas instalar el reviewer?
#   1) En subdirectorio 'ai-reviewer/' (recomendado)
#   2) En el root del proyecto
# 
# Selecciona: 1

# Luego automáticamente:
# ✓ Copia archivos
# ✓ Instala dependencias
# ✓ Compila TypeScript
# ✅ Instalación completada!

# Configurar API key en GitHub y listo!
```

## 🛠️ Solución de Problemas

### Error: "No es un repositorio Git"

```bash
cd /path/to/your/project
git init
git remote add origin <your-repo-url>
```

### Error: "Node.js no está instalado"

Instala Node.js desde: https://nodejs.org/

```bash
# Verificar instalación
node -v
npm -v
```

### Archivos existentes

El script detecta archivos existentes y pregunta antes de sobrescribir. Si tienes:
- Un workflow llamado `code-review.yml` existente
- Una carpeta `ai-reviewer/` o `src/` existente
- Archivos `tsconfig.json` o `package.json` en root

El script te preguntará si deseas sobrescribirlos.

### Permisos de ejecución

Si el script no se ejecuta:

```bash
chmod +x /path/to/agent-code-review/install-ai-reviewer.sh
```

## 🔒 Seguridad

- ✅ El script **NO** modifica tu código fuente
- ✅ Solo agrega archivos nuevos (workflow + reviewer)
- ✅ Las API keys se guardan como secrets en GitHub (no en código)
- ✅ Pregunta antes de sobrescribir archivos existentes

## 📊 Compatible con

El AI Code Reviewer funciona con **cualquier lenguaje**:

- ✅ JavaScript / TypeScript
- ✅ Python
- ✅ Java / Kotlin
- ✅ Go
- ✅ Ruby
- ✅ PHP
- ✅ C# / .NET
- ✅ Rust
- ✅ Y muchos más...

## 🆘 Soporte

Si tienes problemas:

1. Verifica los logs del script
2. Revisa los requisitos (Git, Node.js instalados)
3. Lee la documentación completa en `README.md`
4. Abre un issue en el repositorio

## 📚 Documentación Adicional

- **README.md**: Guía completa del proyecto
- **QUICKSTART.md**: Guía de inicio rápido
- **CHANGELOG.md**: Historial de cambios

---

¡Disfruta de las code reviews automáticas con IA! 🎉
