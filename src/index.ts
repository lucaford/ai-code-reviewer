import * as core from '@actions/core';
import * as github from '@actions/github';
import { createAnalyzer, AIProvider } from './analyzer/index.js';
import { PRFetcher } from './github/pr-fetcher.js';
import { CommentPoster } from './github/comment-poster.js';
import { ReviewComment, PRContext } from './types/index.js';
import { prioritizeComments } from './utils/comment-formatter.js';
import { loadReviewConfig } from './config/rules.config.js';

async function main() {
  try {
    // Obtener inputs de GitHub Actions
    const kimiApiKey = core.getInput('kimi_api_key') || process.env.KIMI_API_KEY;
    const anthropicApiKey = core.getInput('anthropic_api_key') || process.env.ANTHROPIC_API_KEY;
    const githubToken = core.getInput('github_token') || process.env.GITHUB_TOKEN;
    const aiProvider = (core.getInput('ai_provider') || process.env.AI_PROVIDER || 'kimi') as AIProvider;

    // Validar que tenemos la API key correspondiente al proveedor
    if (aiProvider === 'kimi' && !kimiApiKey) {
      throw new Error('KIMI_API_KEY no está configurado');
    }
    
    if (aiProvider === 'claude' && !anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY no está configurado');
    }

    if (!githubToken) {
      throw new Error('GITHUB_TOKEN no está configurado');
    }

    // Obtener contexto del PR
    const context = github.context;
    
    if (!context.payload.pull_request) {
      console.log('❌ No es un evento de pull request, saltando...');
      return;
    }

    const prContext: PRContext = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
      sha: context.payload.pull_request.head.sha,
    };

    console.log(`🔍 Analizando PR #${prContext.pull_number}`);
    console.log(`📦 Repositorio: ${prContext.owner}/${prContext.repo}`);
    console.log(`🤖 Proveedor de IA: ${aiProvider.toUpperCase()}`);

    // Inicializar clientes
    const apiKey = aiProvider === 'kimi' ? kimiApiKey! : anthropicApiKey!;
    const analyzer = createAnalyzer({ provider: aiProvider, apiKey });
    const prFetcher = new PRFetcher(githubToken);
    const commentPoster = new CommentPoster(githubToken);

    // Obtener detalles del PR
    const prDetails = await prFetcher.getPRDetails(prContext);
    console.log(`📝 PR: "${prDetails.title}" por @${prDetails.author}`);

    // Obtener archivos cambiados
    const fileChanges = await prFetcher.getFileChanges(prContext);
    console.log(`📁 Archivos a revisar: ${fileChanges.length}`);

    if (fileChanges.length === 0) {
      console.log('✅ No hay archivos de código para revisar');
      return;
    }

    // Analizar cada archivo
    const allComments: ReviewComment[] = [];

    for (const file of fileChanges) {
      if (!file.patch) {
        console.log(`⏭️  Saltando ${file.filename} (sin cambios de código)`);
        continue;
      }

      console.log(`🔎 Analizando ${file.filename}...`);
      
      try {
        const comments = await analyzer.analyzeCode(file.filename, file.patch);
        allComments.push(...comments);
        
        if (comments.length > 0) {
          console.log(`  ↳ Encontrados ${comments.length} problema(s)`);
        } else {
          console.log(`  ↳ ✅ Sin problemas`);
        }
      } catch (error) {
        console.error(`  ↳ ❌ Error analizando archivo:`, error);
      }
    }

    // Aplicar límite de comentarios y priorización
    const config = loadReviewConfig();
    const maxComments = config.maxCommentsPerReview || 15;
    const { filtered: prioritizedComments, totalCount, omittedCount } = prioritizeComments(
      allComments,
      maxComments
    );

    if (omittedCount > 0) {
      console.log(
        `\n⚠️  Se encontraron ${totalCount} problemas, mostrando los ${maxComments} más críticos\n`
      );
    }

    // Generar resumen
    const summary = await analyzer.generateSummary(prioritizedComments, totalCount, omittedCount);
    console.log(`\n${summary}\n`);

    // Publicar comentarios en el PR
    if (prioritizedComments.length > 0 || fileChanges.length > 0) {
      await commentPoster.postReviewComments(prContext, prioritizedComments, summary);
    }

    // Establecer outputs
    core.setOutput('comments_count', prioritizedComments.length.toString());
    core.setOutput('total_issues', totalCount.toString());
    core.setOutput('files_reviewed', fileChanges.length.toString());

    console.log('\n✨ Review completado exitosamente');
  } catch (error: any) {
    console.error('❌ Error ejecutando code review:', error);
    core.setFailed(error.message);
  }
}

// Ejecutar
main();
