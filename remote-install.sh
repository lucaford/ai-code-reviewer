#!/bin/bash

#########################################################
# AI Code Reviewer - Instalación Remota
#########################################################
# Este script descarga e instala el AI Code Reviewer
# desde GitHub en un solo comando
#
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/lucaford/ai-code-reviewer/main/remote-install.sh | bash
#
# O con un repositorio específico:
#   curl -fsSL https://raw.githubusercontent.com/lucaford/ai-code-reviewer/main/remote-install.sh | bash -s /path/to/target/repo
#########################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
REPO_URL="https://github.com/lucaford/ai-code-reviewer.git"
REPO_BRANCH="main"
TEMP_DIR=$(mktemp -d)
TARGET_DIR="${1:-.}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🤖 AI Code Reviewer - Instalación Remota    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Cleanup en caso de error
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

# Verificar git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Error: Git no está instalado${NC}"
    exit 1
fi

# Verificar que el directorio destino sea un repo Git
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
if [ ! -d "$TARGET_DIR/.git" ]; then
    echo -e "${RED}❌ Error: $TARGET_DIR no es un repositorio Git${NC}"
    echo -e "${YELLOW}💡 Ejecuta 'git init' primero o especifica un repositorio válido${NC}"
    exit 1
fi

echo -e "${YELLOW}📥 Descargando AI Code Reviewer desde GitHub...${NC}"
git clone --quiet --depth 1 --branch "$REPO_BRANCH" "$REPO_URL" "$TEMP_DIR"
echo -e "${GREEN}✓${NC} Repositorio descargado"
echo ""

echo -e "${YELLOW}🚀 Ejecutando instalación...${NC}"
echo ""

# Ejecutar el script de instalación
bash "$TEMP_DIR/install-ai-reviewer.sh" "$TARGET_DIR"

echo ""
echo -e "${GREEN}✨ Instalación remota completada!${NC}"
