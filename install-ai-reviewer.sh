#!/bin/bash

#########################################################
# AI Code Reviewer - Script de Instalación
#########################################################
# Este script instala el AI Code Reviewer en cualquier
# repositorio de Git (Java, Node.js, Python, etc.)
#
# Uso:
#   cd /path/to/your/repository
#   bash /path/to/install-ai-reviewer.sh
#
# O desde cualquier lugar:
#   bash /path/to/install-ai-reviewer.sh /path/to/target/repo
#########################################################

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio donde está este script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Directorio destino (argumento o directorio actual)
TARGET_DIR="${1:-.}"
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🤖 AI Code Reviewer - Instalación           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

#########################################################
# Validaciones preliminares
#########################################################

echo -e "${YELLOW}📋 Validando entorno...${NC}"

# Verificar que estamos en un repositorio Git
if [ ! -d "$TARGET_DIR/.git" ]; then
    echo -e "${RED}❌ Error: $TARGET_DIR no es un repositorio Git${NC}"
    echo -e "${YELLOW}💡 Ejecuta 'git init' primero o especifica un repositorio válido${NC}"
    exit 1
fi

# Verificar que Node.js está instalado (necesario para compilar)
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js no está instalado${NC}"
    echo -e "${YELLOW}💡 Instala Node.js desde https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION detectado"

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm -v) detectado"

# Verificar que el directorio fuente existe
if [ ! -d "$SCRIPT_DIR/src" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio 'src' en $SCRIPT_DIR${NC}"
    echo -e "${YELLOW}💡 Asegúrate de ejecutar el script desde el repositorio de ai-code-reviewer${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Repositorio Git válido: $TARGET_DIR"
echo ""

#########################################################
# Preguntar método de instalación
#########################################################

echo -e "${YELLOW}❓ ¿Cómo deseas instalar el reviewer?${NC}"
echo "  1) En subdirectorio 'ai-reviewer/' (recomendado para proyectos grandes)"
echo "  2) En el root del proyecto (más simple, pero agrega archivos al root)"
echo ""
read -p "Selecciona una opción [1/2] (default: 1): " INSTALL_METHOD
INSTALL_METHOD=${INSTALL_METHOD:-1}

if [ "$INSTALL_METHOD" = "1" ]; then
    INSTALL_PATH="$TARGET_DIR/ai-reviewer"
    USE_SUBDIR=true
    echo -e "${GREEN}✓${NC} Se instalará en subdirectorio 'ai-reviewer/'"
elif [ "$INSTALL_METHOD" = "2" ]; then
    INSTALL_PATH="$TARGET_DIR"
    USE_SUBDIR=false
    echo -e "${GREEN}✓${NC} Se instalará en el root del proyecto"
else
    echo -e "${RED}❌ Opción inválida${NC}"
    exit 1
fi

echo ""

#########################################################
# Verificar archivos existentes
#########################################################

echo -e "${YELLOW}🔍 Verificando archivos existentes...${NC}"

CONFLICTS=()

if [ -f "$TARGET_DIR/.github/workflows/code-review.yml" ]; then
    CONFLICTS+=(".github/workflows/code-review.yml")
fi

if [ "$USE_SUBDIR" = true ]; then
    if [ -d "$INSTALL_PATH" ]; then
        CONFLICTS+=("ai-reviewer/")
    fi
else
    if [ -d "$TARGET_DIR/src" ]; then
        CONFLICTS+=("src/")
    fi
    if [ -f "$TARGET_DIR/tsconfig.json" ]; then
        CONFLICTS+=("tsconfig.json")
    fi
fi

if [ ${#CONFLICTS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Los siguientes archivos/directorios ya existen:${NC}"
    for item in "${CONFLICTS[@]}"; do
        echo "   - $item"
    done
    echo ""
    read -p "¿Deseas sobrescribirlos? [s/N]: " OVERWRITE
    if [[ ! "$OVERWRITE" =~ ^[sS]$ ]]; then
        echo -e "${YELLOW}Instalación cancelada${NC}"
        exit 0
    fi
    echo -e "${GREEN}✓${NC} Se sobrescribirán los archivos existentes"
fi

echo ""

#########################################################
# Copiar archivos
#########################################################

echo -e "${YELLOW}📦 Copiando archivos...${NC}"

# Crear directorio de instalación si es necesario
if [ "$USE_SUBDIR" = true ]; then
    mkdir -p "$INSTALL_PATH"
fi

# Copiar workflow
mkdir -p "$TARGET_DIR/.github/workflows"
cp "$SCRIPT_DIR/.github/workflows/code-review.yml" "$TARGET_DIR/.github/workflows/code-review.yml"
echo -e "${GREEN}✓${NC} Workflow copiado"

# Copiar archivos fuente
cp -r "$SCRIPT_DIR/src" "$INSTALL_PATH/"
echo -e "${GREEN}✓${NC} Código fuente copiado"

# Copiar package.json
cp "$SCRIPT_DIR/package.json" "$INSTALL_PATH/"
echo -e "${GREEN}✓${NC} package.json copiado"

# Copiar package-lock.json si existe
if [ -f "$SCRIPT_DIR/package-lock.json" ]; then
    cp "$SCRIPT_DIR/package-lock.json" "$INSTALL_PATH/"
    echo -e "${GREEN}✓${NC} package-lock.json copiado"
fi

# Copiar tsconfig.json
cp "$SCRIPT_DIR/tsconfig.json" "$INSTALL_PATH/"
echo -e "${GREEN}✓${NC} tsconfig.json copiado"

echo ""

#########################################################
# Modificar workflow si es instalación en subdirectorio
#########################################################

if [ "$USE_SUBDIR" = true ]; then
    echo -e "${YELLOW}🔧 Configurando workflow para subdirectorio...${NC}"
    
    # Crear un workflow modificado para subdirectorio
    cat > "$TARGET_DIR/.github/workflows/code-review.yml" << 'EOF'
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  code-review:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: cd ai-reviewer && npm ci

      - name: Build TypeScript
        run: cd ai-reviewer && npm run build

      - name: Run AI Code Review
        env:
          KIMI_API_KEY: ${{ secrets.KIMI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          AI_PROVIDER: ${{ vars.AI_PROVIDER || 'kimi' }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node ai-reviewer/dist/index.js
EOF
    echo -e "${GREEN}✓${NC} Workflow configurado para subdirectorio"
fi

echo ""

#########################################################
# Actualizar .gitignore
#########################################################

echo -e "${YELLOW}📝 Actualizando .gitignore...${NC}"

GITIGNORE_PATH="$TARGET_DIR/.gitignore"

# Crear .gitignore si no existe
if [ ! -f "$GITIGNORE_PATH" ]; then
    touch "$GITIGNORE_PATH"
fi

# Agregar entradas necesarias si no existen
GITIGNORE_ENTRIES=()

if [ "$USE_SUBDIR" = true ]; then
    if ! grep -q "^ai-reviewer/node_modules" "$GITIGNORE_PATH" 2>/dev/null; then
        GITIGNORE_ENTRIES+=("ai-reviewer/node_modules")
    fi
    if ! grep -q "^ai-reviewer/dist" "$GITIGNORE_PATH" 2>/dev/null; then
        GITIGNORE_ENTRIES+=("ai-reviewer/dist")
    fi
else
    # Solo agregar si no hay conflicto con gitignore existente del proyecto
    if ! grep -q "^node_modules" "$GITIGNORE_PATH" 2>/dev/null; then
        GITIGNORE_ENTRIES+=("node_modules")
    fi
    if ! grep -q "^dist" "$GITIGNORE_PATH" 2>/dev/null; then
        GITIGNORE_ENTRIES+=("dist")
    fi
fi

if [ ${#GITIGNORE_ENTRIES[@]} -gt 0 ]; then
    echo "" >> "$GITIGNORE_PATH"
    echo "# AI Code Reviewer" >> "$GITIGNORE_PATH"
    for entry in "${GITIGNORE_ENTRIES[@]}"; do
        echo "$entry" >> "$GITIGNORE_PATH"
        echo -e "${GREEN}✓${NC} Agregado '$entry' a .gitignore"
    done
else
    echo -e "${GREEN}✓${NC} .gitignore ya está actualizado"
fi

echo ""

#########################################################
# Instalar dependencias
#########################################################

echo -e "${YELLOW}📥 Instalando dependencias de Node.js...${NC}"

cd "$INSTALL_PATH"
npm install --silent

echo -e "${GREEN}✓${NC} Dependencias instaladas"
echo ""

#########################################################
# Compilar TypeScript
#########################################################

echo -e "${YELLOW}🔨 Compilando TypeScript...${NC}"

npm run build

echo -e "${GREEN}✓${NC} TypeScript compilado exitosamente"
echo ""

#########################################################
# Instrucciones finales
#########################################################

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Instalación completada exitosamente      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo ""

echo -e "${YELLOW}1. Configurar API Key en GitHub:${NC}"
echo "   - Ve a tu repositorio en GitHub"
echo "   - Settings → Secrets and variables → Actions → Secrets"
echo ""
echo "   ${BLUE}Para usar Kimi K2.5 (Recomendado):${NC}"
echo "   - Crea un secret llamado: ${GREEN}KIMI_API_KEY${NC}"
echo "   - Obtén tu API key en: https://platform.moonshot.ai/"
echo ""
echo "   ${BLUE}Para usar Claude (Alternativa):${NC}"
echo "   - Crea un secret llamado: ${GREEN}ANTHROPIC_API_KEY${NC}"
echo "   - Obtén tu API key en: https://console.anthropic.com/"
echo "   - Crea una variable ${GREEN}AI_PROVIDER${NC} con valor 'claude' en Variables"
echo ""

echo -e "${YELLOW}2. Hacer commit de los cambios:${NC}"
echo "   cd $TARGET_DIR"
if [ "$USE_SUBDIR" = true ]; then
    echo "   git add .github/workflows/code-review.yml ai-reviewer/ .gitignore"
else
    echo "   git add .github/workflows/code-review.yml src/ package.json tsconfig.json .gitignore"
fi
echo "   git commit -m \"Add AI Code Reviewer\""
echo "   git push"
echo ""

echo -e "${YELLOW}3. Crear un Pull Request:${NC}"
echo "   El AI Code Reviewer se activará automáticamente en todos"
echo "   los PRs futuros y analizará el código con IA"
echo ""

echo -e "${BLUE}📚 Documentación:${NC}"
if [ "$USE_SUBDIR" = true ]; then
    echo "   - README: $INSTALL_PATH/../README.md"
    echo "   - Guía rápida: $INSTALL_PATH/../QUICKSTART.md"
else
    echo "   - README: $SCRIPT_DIR/README.md"
    echo "   - Guía rápida: $SCRIPT_DIR/QUICKSTART.md"
fi
echo ""

echo -e "${GREEN}¡Listo! 🎉${NC}"
echo ""
