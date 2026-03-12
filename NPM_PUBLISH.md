# 📦 Cómo Publicar en NPM

Esta guía explica cómo publicar `@lucaford/ai-code-reviewer` en npm.

## 📋 Pre-requisitos

1. **Cuenta en NPM**: Crear cuenta en [npmjs.com](https://www.npmjs.com/)
2. **NPM CLI configurado**: Iniciar sesión con `npm login`
3. **Acceso al scope**: Si usas `@lucaford`, necesitas crear la organización o usar tu username

## 🔧 Preparación antes de publicar

### 1. Actualizar versión en package.json

Sigue [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Cambios incompatibles
- **MINOR** (1.0.0 → 1.1.0): Nuevas funcionalidades compatibles
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

```bash
# Actualizar versión automáticamente
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

### 2. Verificar archivos que se publicarán

```bash
# Ver qué archivos se incluirán en el paquete
npm pack --dry-run

# O generar un tarball para inspeccionar
npm pack
tar -tzf lucaford-ai-code-reviewer-1.0.0.tgz
```

Asegúrate de que:
- ✅ `dist/` está incluido (código compilado)
- ✅ `src/` está incluido (código fuente)
- ✅ `cli/` está incluido (comandos CLI)
- ✅ `.github/workflows/code-review.yml` está incluido
- ✅ Archivos de configuración (.reviewrc.example.json, etc.)
- ❌ `node_modules/` NO está incluido
- ❌ `.env` NO está incluido
- ❌ Archivos de desarrollo NO están incluidos

### 3. Compilar TypeScript

```bash
npm run build
```

Verifica que `dist/` se generó correctamente.

### 4. Probar localmente

```bash
# Crear un paquete local
npm pack

# En otro proyecto de prueba
cd /path/to/test/project
npm install /path/to/ai-code-reviewer/lucaford-ai-code-reviewer-1.0.0.tgz

# Probar el CLI
npx @lucaford/ai-code-reviewer help
npx @lucaford/ai-code-reviewer install
```

## 🚀 Publicar en NPM

### Primera publicación

```bash
# Iniciar sesión (si no lo hiciste)
npm login

# Publicar el paquete como público (scoped packages son privados por defecto)
npm publish --access public
```

### Publicaciones posteriores

```bash
# 1. Actualizar versión
npm version patch  # o minor/major

# 2. Hacer commit del cambio de versión
git add package.json package-lock.json
git commit -m "Bump version to 1.0.1"
git push

# 3. Crear tag en git (opcional pero recomendado)
git tag v1.0.1
git push --tags

# 4. Publicar
npm publish
```

## 🔒 Publicación Segura

### Usar 2FA (Recomendado)

Habilitar autenticación de dos factores en npmjs.com:
1. Ir a Account Settings → Two-Factor Authentication
2. Configurar TOTP con una app como Google Authenticator
3. Al publicar, te pedirá el código OTP:
   ```bash
   npm publish
   # Enter OTP: xxxxxx
   ```

### Usar npm provenance

```bash
# Publicar con firma de provenance
npm publish --provenance
```

Esto agrega información de CI/CD al paquete (si publicas desde GitHub Actions).

## 🤖 Automatizar con GitHub Actions

Crear `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write  # Para provenance
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Configurar NPM Token

1. Crear token en npmjs.com:
   - Account Settings → Access Tokens → Generate New Token
   - Tipo: **Automation** (para CI/CD)
   
2. Agregar en GitHub:
   - Repo Settings → Secrets → Actions → New repository secret
   - Nombre: `NPM_TOKEN`
   - Valor: tu token de npm

3. Publicar creando un release:
   ```bash
   git tag v1.0.0
   git push --tags
   # En GitHub: Draft a new release usando el tag v1.0.0
   ```

## ✅ Verificar publicación

```bash
# Ver paquete en npm
npm view @lucaford/ai-code-reviewer

# Ver versiones publicadas
npm view @lucaford/ai-code-reviewer versions

# Instalar desde npm
npx @lucaford/ai-code-reviewer@latest help
```

Verificar en: https://www.npmjs.com/package/@lucaford/ai-code-reviewer

## 🔄 Despublicar (Cuidado!)

```bash
# Despublicar una versión específica (solo dentro de 72 horas)
npm unpublish @lucaford/ai-code-reviewer@1.0.0

# Marcar como deprecated (mejor opción)
npm deprecate @lucaford/ai-code-reviewer@1.0.0 "Use version 1.0.1 instead"
```

**⚠️ Importante**: No se puede despublicar después de 72 horas si el paquete tiene dependientes.

## 📊 Estadísticas

Ver descargas en:
- https://www.npmjs.com/package/@lucaford/ai-code-reviewer
- https://npm-stat.com/charts.html?package=@lucaford/ai-code-reviewer

## 🆘 Problemas comunes

### Error: 403 Forbidden

- **Causa**: No tienes permisos para publicar bajo ese scope
- **Solución**: Usar tu username como scope o crear organización en npm

### Error: Package already exists

- **Causa**: El nombre ya está tomado
- **Solución**: Cambiar el nombre en package.json

### Error: ENEEDAUTH

- **Causa**: No estás autenticado
- **Solución**: Ejecutar `npm login`

### CLI no se ejecuta

- **Causa**: Falta el shebang `#!/usr/bin/env node`
- **Solución**: Verificar que `cli/cli.js` tiene el shebang en la primera línea

### Los archivos no se incluyen

- **Causa**: Están en `.npmignore` o no están en `files` en package.json
- **Solución**: Revisar `.npmignore` y `package.json`

## 📚 Referencias

- [NPM Docs - Publishing](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Creating and publishing scoped packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [Semantic Versioning](https://semver.org/)
- [NPM Provenance](https://docs.npmjs.com/generating-provenance-statements)
