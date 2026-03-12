/**
 * AI Code Reviewer - Update Command
 * 
 * Actualiza el AI Code Reviewer a la última versión
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, cpSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '..');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function detectInstallPath(targetDir) {
  // Detectar si está instalado en subdirectorio o root
  if (existsSync(join(targetDir, '.ai-reviewer', 'src'))) {
    return '.ai-reviewer';
  } else if (existsSync(join(targetDir, 'ai-reviewer', 'src'))) {
    return 'ai-reviewer';
  } else if (existsSync(join(targetDir, 'src', 'index.ts'))) {
    // Verificar que es el AI Code Reviewer y no el proyecto del usuario
    try {
      const indexContent = readFileSync(join(targetDir, 'src', 'index.ts'), 'utf-8');
      if (indexContent.includes('AI Code Reviewer') || indexContent.includes('analyzePR')) {
        return '.';
      }
    } catch (error) {
      // Ignorar error de lectura
    }
  }

  return null;
}

function getInstalledVersion(targetDir, installPath) {
  try {
    const packageJsonPath = join(targetDir, installPath, 'package.json');
    if (!existsSync(packageJsonPath)) return null;

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
  } catch (error) {
    return null;
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf-8'));
  return packageJson.version;
}

function backupNodeModules(targetDir, installPath) {
  const nodeModulesPath = join(targetDir, installPath, 'node_modules');
  const backupPath = join(targetDir, installPath, 'node_modules.backup');

  if (existsSync(nodeModulesPath)) {
    log('📦 Haciendo backup de node_modules...', COLORS.yellow);
    
    // Remover backup anterior si existe
    if (existsSync(backupPath)) {
      rmSync(backupPath, { recursive: true, force: true });
    }

    // Mover node_modules a backup
    cpSync(nodeModulesPath, backupPath, { recursive: true });
    log('✓ Backup creado', COLORS.green);
  }
}

function restoreNodeModules(targetDir, installPath) {
  const nodeModulesPath = join(targetDir, installPath, 'node_modules');
  const backupPath = join(targetDir, installPath, 'node_modules.backup');

  if (existsSync(backupPath)) {
    log('📦 Restaurando node_modules...', COLORS.yellow);
    
    // Remover node_modules actual si existe
    if (existsSync(nodeModulesPath)) {
      rmSync(nodeModulesPath, { recursive: true, force: true });
    }

    // Restaurar desde backup
    cpSync(backupPath, nodeModulesPath, { recursive: true });
    
    // Limpiar backup
    rmSync(backupPath, { recursive: true, force: true });
    
    log('✓ node_modules restaurado', COLORS.green);
  }
}

function updateFiles(targetDir, installPath) {
  log('\n📦 Actualizando archivos...', COLORS.yellow);

  const installDir = join(targetDir, installPath);

  // Actualizar src/
  const srcPath = join(installDir, 'src');
  if (existsSync(srcPath)) {
    rmSync(srcPath, { recursive: true, force: true });
  }
  cpSync(
    join(PACKAGE_ROOT, 'src'),
    srcPath,
    { recursive: true }
  );
  log('✓ Código fuente actualizado', COLORS.green);

  // Actualizar package.json (preservando scripts personalizados si existen)
  const targetPackageJson = join(installDir, 'package.json');
  const sourcePackageJson = join(PACKAGE_ROOT, 'package.json');
  
  cpSync(sourcePackageJson, targetPackageJson);
  log('✓ package.json actualizado', COLORS.green);

  // Actualizar tsconfig.json
  cpSync(
    join(PACKAGE_ROOT, 'tsconfig.json'),
    join(installDir, 'tsconfig.json')
  );
  log('✓ tsconfig.json actualizado', COLORS.green);

  // Actualizar workflow
  const workflowPath = join(targetDir, '.github', 'workflows', 'code-review.yml');
  if (existsSync(workflowPath)) {
    cpSync(
      join(PACKAGE_ROOT, '.github', 'workflows', 'code-review.yml'),
      workflowPath
    );

    // Re-configurar para subdirectorio si es necesario
    if (installPath !== '.') {
      log('🔧 Re-configurando workflow...', COLORS.yellow);
      let workflow = readFileSync(workflowPath, 'utf-8');
      workflow = workflow.replace(/npm ci/g, `cd ${installPath} && npm ci`);
      workflow = workflow.replace(/npm run build/g, `cd ${installPath} && npm run build`);
      workflow = workflow.replace(/node dist\/index.js/g, `node ${installPath}/dist/index.js`);
      require('fs').writeFileSync(workflowPath, workflow);
    }

    log('✓ Workflow actualizado', COLORS.green);
  }
}

function reinstallDependencies(targetDir, installPath) {
  log('\n📥 Re-instalando dependencias...', COLORS.yellow);

  const installDir = join(targetDir, installPath);

  // Limpiar node_modules y package-lock.json
  const nodeModulesPath = join(installDir, 'node_modules');
  const packageLockPath = join(installDir, 'package-lock.json');

  if (existsSync(nodeModulesPath)) {
    rmSync(nodeModulesPath, { recursive: true, force: true });
  }
  if (existsSync(packageLockPath)) {
    rmSync(packageLockPath, { force: true });
  }

  // Instalar dependencias frescas
  execSync('npm install', { cwd: installDir, stdio: 'inherit' });

  log('✓ Dependencias instaladas', COLORS.green);
}

function rebuild(targetDir, installPath) {
  log('\n🔨 Re-compilando TypeScript...', COLORS.yellow);

  const installDir = join(targetDir, installPath);

  // Limpiar dist/
  const distPath = join(installDir, 'dist');
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
  }

  // Compilar
  execSync('npm run build', { cwd: installDir, stdio: 'inherit' });

  log('✓ TypeScript compilado exitosamente', COLORS.green);
}

export async function update() {
  const targetDir = process.cwd();

  try {
    log('╔════════════════════════════════════════════════╗', COLORS.blue);
    log('║   🤖 AI Code Reviewer - Actualización         ║', COLORS.blue);
    log('╚════════════════════════════════════════════════╝', COLORS.blue);

    // Detectar instalación
    log('\n🔍 Detectando instalación existente...', COLORS.yellow);
    const installPath = detectInstallPath(targetDir);

    if (!installPath) {
      throw new Error(
        'No se encontró una instalación del AI Code Reviewer en este proyecto.\n' +
        'Usa el comando "install" primero: npx @lucaford/ai-code-reviewer install'
      );
    }

    log(`✓ Instalación encontrada en: ${installPath === '.' ? 'root' : installPath}`, COLORS.green);

    // Obtener versiones
    const installedVersion = getInstalledVersion(targetDir, installPath);
    const currentVersion = getCurrentVersion();

    log(`\n📦 Versión instalada: ${installedVersion || 'desconocida'}`, COLORS.blue);
    log(`📦 Versión disponible: ${currentVersion}`, COLORS.blue);

    if (installedVersion === currentVersion) {
      log('\n✅ Ya tienes la última versión instalada', COLORS.green);
      return;
    }

    // Hacer backup de node_modules
    backupNodeModules(targetDir, installPath);

    try {
      // Actualizar archivos
      updateFiles(targetDir, installPath);

      // Reinstalar dependencias
      reinstallDependencies(targetDir, installPath);

      // Recompilar
      rebuild(targetDir, installPath);

      // Limpiar backup
      const backupPath = join(targetDir, installPath, 'node_modules.backup');
      if (existsSync(backupPath)) {
        rmSync(backupPath, { recursive: true, force: true });
      }

      log('\n╔════════════════════════════════════════════════╗', COLORS.green);
      log('║   ✅ Actualización completada exitosamente    ║', COLORS.green);
      log('╚════════════════════════════════════════════════╝', COLORS.green);

      log(`\n✨ Actualizado de v${installedVersion} a v${currentVersion}\n`, COLORS.blue);

      log('📋 Próximos pasos:\n', COLORS.blue);
      log('1. Verifica los cambios:', COLORS.yellow);
      console.log('   git diff\n');

      log('2. Haz commit de los cambios:', COLORS.yellow);
      console.log('   git add .');
      console.log(`   git commit -m "Update AI Code Reviewer to v${currentVersion}"`);
      console.log('   git push\n');

      log('3. La próxima PR usará la versión actualizada 🎉\n', COLORS.green);

    } catch (error) {
      // Si hay error, restaurar backup
      log('\n⚠️  Error durante la actualización, restaurando backup...', COLORS.yellow);
      restoreNodeModules(targetDir, installPath);
      throw error;
    }

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, COLORS.red);
    process.exit(1);
  }
}
