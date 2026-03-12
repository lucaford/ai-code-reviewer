#!/usr/bin/env node

/**
 * AI Code Reviewer - CLI
 * 
 * Comandos disponibles:
 *   install  - Instala el AI Code Reviewer en el proyecto actual
 *   update   - Actualiza a la última versión
 *   version  - Muestra la versión instalada
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer package.json para obtener la versión
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const VERSION = packageJson.version;

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function printBanner() {
  console.log(`${COLORS.blue}╔════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.blue}║   🤖 AI Code Reviewer v${VERSION.padEnd(20)}║${COLORS.reset}`);
  console.log(`${COLORS.blue}╚════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');
}

function printHelp() {
  printBanner();
  console.log(`${COLORS.bright}Uso:${COLORS.reset} npx @lucaford/ai-code-reviewer <comando>\n`);
  console.log(`${COLORS.bright}Comandos disponibles:${COLORS.reset}\n`);
  console.log(`  ${COLORS.green}install${COLORS.reset}   Instala el AI Code Reviewer en el proyecto actual`);
  console.log(`  ${COLORS.green}update${COLORS.reset}    Actualiza a la última versión`);
  console.log(`  ${COLORS.green}version${COLORS.reset}   Muestra la versión instalada`);
  console.log(`  ${COLORS.green}help${COLORS.reset}      Muestra esta ayuda\n`);
  console.log(`${COLORS.bright}Ejemplos:${COLORS.reset}\n`);
  console.log(`  ${COLORS.cyan}# Instalar en el proyecto actual${COLORS.reset}`);
  console.log(`  npx @lucaford/ai-code-reviewer install\n`);
  console.log(`  ${COLORS.cyan}# Actualizar a la última versión${COLORS.reset}`);
  console.log(`  npx @lucaford/ai-code-reviewer update\n`);
  console.log(`${COLORS.bright}Documentación completa:${COLORS.reset}`);
  console.log(`  https://github.com/lucaford/ai-code-reviewer\n`);
}

function printVersion() {
  console.log(`AI Code Reviewer v${VERSION}`);
}

async function runCommand(command) {
  try {
    switch (command) {
      case 'install':
        const { install } = await import('./install.js');
        await install();
        break;
      case 'update':
        const { update } = await import('./update.js');
        await update();
        break;
      case 'version':
        printVersion();
        break;
      case 'help':
      case '--help':
      case '-h':
        printHelp();
        break;
      default:
        console.log(`${COLORS.red}❌ Comando desconocido: ${command}${COLORS.reset}\n`);
        printHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`${COLORS.red}❌ Error: ${error.message}${COLORS.reset}`);
    process.exit(1);
  }
}

// Ejecutar CLI
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  printHelp();
  process.exit(0);
}

runCommand(command);
