import { AIAnalyzer, AIConfig } from './types.js';
import { KimiAnalyzer } from './kimi-client.js';
import { ClaudeAnalyzer } from './claude-client.js';

export function createAnalyzer(config: AIConfig): AIAnalyzer {
  switch (config.provider) {
    case 'kimi':
      return new KimiAnalyzer(config.apiKey, config.model);
    case 'claude':
      return new ClaudeAnalyzer(config.apiKey, config.model);
    default:
      throw new Error(`Proveedor de IA no soportado: ${config.provider}`);
  }
}

export { AIAnalyzer, AIConfig, AIProvider } from './types.js';
export { KimiAnalyzer } from './kimi-client.js';
export { ClaudeAnalyzer } from './claude-client.js';
