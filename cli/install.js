/**
 * AI Code Reviewer - Install Command
 * 
 * Instala el AI Code Reviewer en el proyecto actual
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'fs';
import { execSync } from 'child_process';
import * as readline from 'readline';

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

function question(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function validateEnvironment(targetDir) {
  log('\n📋 Validando entorno...', COLORS.yellow);

  // Verificar que estamos en un repositorio Git
  if (!existsSync(join(targetDir, '.git'))) {
    throw new Error(`${targetDir} no es un repositorio Git. Ejecuta 'git init' primero.`);
  }
  log('✓ Repositorio Git válido', COLORS.green);

  // Verificar que Node.js está instalado
  try {
    const nodeVersion = execSync('node -v', { encoding: 'utf-8' }).trim();
    log(`✓ Node.js ${nodeVersion} detectado`, COLORS.green);
  } catch (error) {
    throw new Error('Node.js no está instalado. Instálalo desde https://nodejs.org/');
  }

  // Verificar npm
  try {
    const npmVersion = execSync('npm -v', { encoding: 'utf-8' }).trim();
    log(`✓ npm ${npmVersion} detectado`, COLORS.green);
  } catch (error) {
    throw new Error('npm no está instalado');
  }
}

async function chooseInstallMethod() {
  log('\n❓ ¿Cómo deseas instalar el reviewer?', COLORS.yellow);
  console.log('  1) En subdirectorio .ai-reviewer/ (recomendado)');
  console.log('  2) En el root del proyecto (más simple)\n');

  const answer = await question('Selecciona una opción [1/2] (default: 1): ');
  const choice = answer.trim() || '1';

  if (choice === '1') {
    log('✓ Se instalará en subdirectorio .ai-reviewer/', COLORS.green);
    return { useSubdir: true, installPath: '.ai-reviewer' };
  } else if (choice === '2') {
    log('✓ Se instalará en el root del proyecto', COLORS.green);
    return { useSubdir: false, installPath: '.' };
  } else {
    throw new Error('Opción inválida');
  }
}

async function checkConflicts(targetDir, installPath) {
  log('\n🔍 Verificando archivos existentes...', COLORS.yellow);

  const conflicts = [];
  const workflowPath = join(targetDir, '.github', 'workflows', 'code-review.yml');
  const installDir = join(targetDir, installPath);

  if (existsSync(workflowPath)) {
    conflicts.push('.github/workflows/code-review.yml');
  }

  if (installPath !== '.' && existsSync(installDir)) {
    conflicts.push(`${installPath}/`);
  }

  if (conflicts.length > 0) {
    log('⚠️  Los siguientes archivos/directorios ya existen:', COLORS.yellow);
    conflicts.forEach(item => console.log(`   - ${item}`));
    console.log('');

    const answer = await question('¿Deseas sobrescribirlos? [s/N]: ');
    if (!answer.match(/^[sS]$/)) {
      log('Instalación cancelada', COLORS.yellow);
      process.exit(0);
    }
    log('✓ Se sobrescribirán los archivos existentes', COLORS.green);
  }
}

function copyFiles(targetDir, installPath) {
  log('\n📦 Copiando archivos...', COLORS.yellow);

  const installDir = join(targetDir, installPath);

  // Crear directorio de instalación
  if (installPath !== '.') {
    mkdirSync(installDir, { recursive: true });
  }

  // Copiar workflow
  const workflowDir = join(targetDir, '.github', 'workflows');
  mkdirSync(workflowDir, { recursive: true });
  cpSync(
    join(PACKAGE_ROOT, '.github', 'workflows', 'code-review.yml'),
    join(workflowDir, 'code-review.yml')
  );
  log('✓ Workflow copiado', COLORS.green);

  // Copiar src/
  cpSync(
    join(PACKAGE_ROOT, 'src'),
    join(installDir, 'src'),
    { recursive: true }
  );
  log('✓ Código fuente copiado', COLORS.green);

  // Copiar package.json
  cpSync(
    join(PACKAGE_ROOT, 'package.json'),
    join(installDir, 'package.json')
  );
  log('✓ package.json copiado', COLORS.green);

  // Copiar tsconfig.json
  cpSync(
    join(PACKAGE_ROOT, 'tsconfig.json'),
    join(installDir, 'tsconfig.json')
  );
  log('✓ tsconfig.json copiado', COLORS.green);

  // Copiar archivos de ejemplo
  if (existsSync(join(PACKAGE_ROOT, '.reviewrc.example.json'))) {
    cpSync(
      join(PACKAGE_ROOT, '.reviewrc.example.json'),
      join(targetDir, '.reviewrc.example.json')
    );
    log('✓ .reviewrc.example.json copiado', COLORS.green);
  }
}

function configureWorkflow(targetDir, installPath) {
  if (installPath === '.') return;

  log('\n🔧 Configurando workflow para subdirectorio...', COLORS.yellow);

  const workflowPath = join(targetDir, '.github', 'workflows', 'code-review.yml');
  let workflow = readFileSync(workflowPath, 'utf-8');

  // Ajustar rutas en el workflow
  workflow = workflow.replace(/npm ci/g, `cd ${installPath} && npm ci`);
  workflow = workflow.replace(/npm run build/g, `cd ${installPath} && npm run build`);
  workflow = workflow.replace(/node dist\/index.js/g, `node ${installPath}/dist/index.js`);

  writeFileSync(workflowPath, workflow);
  log('✓ Workflow configurado', COLORS.green);
}

function updateGitignore(targetDir, installPath) {
  log('\n📝 Actualizando .gitignore...', COLORS.yellow);

  const gitignorePath = join(targetDir, '.gitignore');
  let gitignore = existsSync(gitignorePath) ? readFileSync(gitignorePath, 'utf-8') : '';

  const entries = [];
  if (installPath === '.') {
    if (!gitignore.includes('node_modules')) entries.push('node_modules');
    if (!gitignore.includes('dist')) entries.push('dist');
  } else {
    if (!gitignore.includes(`${installPath}/node_modules`)) entries.push(`${installPath}/node_modules`);
    if (!gitignore.includes(`${installPath}/dist`)) entries.push(`${installPath}/dist`);
  }

  if (entries.length > 0) {
    gitignore += '\n# AI Code Reviewer\n';
    entries.forEach(entry => {
      gitignore += `${entry}\n`;
      log(`✓ Agregado '${entry}' a .gitignore`, COLORS.green);
    });
    writeFileSync(gitignorePath, gitignore);
  } else {
    log('✓ .gitignore ya está actualizado', COLORS.green);
  }
}

function installDependencies(targetDir, installPath) {
  log('\n📥 Instalando dependencias de Node.js...', COLORS.yellow);

  const installDir = join(targetDir, installPath);
  execSync('npm install', { cwd: installDir, stdio: 'inherit' });

  log('✓ Dependencias instaladas', COLORS.green);
}

function buildTypeScript(targetDir, installPath) {
  log('\n🔨 Compilando TypeScript...', COLORS.yellow);

  const installDir = join(targetDir, installPath);
  execSync('npm run build', { cwd: installDir, stdio: 'inherit' });

  log('✓ TypeScript compilado exitosamente', COLORS.green);
}

function printNextSteps(installPath) {
  log('\n╔════════════════════════════════════════════════╗', COLORS.green);
  log('║   ✅ Instalación completada exitosamente      ║', COLORS.green);
  log('╚════════════════════════════════════════════════╝', COLORS.green);

  log('\n📋 Próximos pasos:\n', COLORS.blue);

  log('1. Configurar API Key en GitHub:', COLORS.yellow);
  console.log('   - Ve a tu repositorio en GitHub');
  console.log('   - Settings → Secrets and variables → Actions → Secrets\n');

  log('   Para usar Kimi K2.5 (Recomendado):', COLORS.blue);
  log('   - Crea un secret llamado: KIMI_API_KEY', COLORS.green);
  console.log('   - Obtén tu API key en: https://platform.moonshot.ai/\n');

  log('   Para usar Claude (Alternativa):', COLORS.blue);
  log('   - Crea un secret llamado: ANTHROPIC_API_KEY', COLORS.green);
  console.log('   - Obtén tu API key en: https://console.anthropic.com/');
  log('   - Crea una variable AI_PROVIDER con valor \'claude\' en Variables\n', COLORS.green);

  log('2. Hacer commit de los cambios:', COLORS.yellow);
  console.log('   git add .github/workflows/code-review.yml');
  if (installPath !== '.') {
    console.log(`   git add ${installPath}/ .gitignore`);
  } else {
    console.log('   git add src/ package.json tsconfig.json .gitignore');
  }
  console.log('   git commit -m "Add AI Code Reviewer"');
  console.log('   git push\n');

  log('3. Crear un Pull Request:', COLORS.yellow);
  console.log('   El AI Code Reviewer se activará automáticamente en todos');
  console.log('   los PRs futuros y analizará el código con IA\n');

  log('Para actualizar en el futuro:', COLORS.blue);
  log('   npx @lucaford/ai-code-reviewer update\n', COLORS.green);

  log('¡Listo! 🎉\n', COLORS.green);
}

export async function install() {
  const targetDir = process.cwd();

  try {
    log('╔════════════════════════════════════════════════╗', COLORS.blue);
    log('║   🤖 AI Code Reviewer - Instalación           ║', COLORS.blue);
    log('╚════════════════════════════════════════════════╝', COLORS.blue);

    // Paso 1: Validar entorno
    await validateEnvironment(targetDir);

    // Paso 2: Elegir método de instalación
    const { useSubdir, installPath } = await chooseInstallMethod();

    // Paso 3: Verificar conflictos
    await checkConflicts(targetDir, installPath);

    // Paso 4: Copiar archivos
    copyFiles(targetDir, installPath);

    // Paso 5: Configurar workflow si es subdirectorio
    if (useSubdir) {
      configureWorkflow(targetDir, installPath);
    }

    // Paso 6: Actualizar .gitignore
    updateGitignore(targetDir, installPath);

    // Paso 7: Instalar dependencias
    installDependencies(targetDir, installPath);

    // Paso 8: Compilar TypeScript
    buildTypeScript(targetDir, installPath);

    // Paso 9: Mostrar próximos pasos
    printNextSteps(installPath);

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, COLORS.red);
    process.exit(1);
  }
}
