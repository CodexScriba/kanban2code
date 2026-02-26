import { resolveProviderConfig } from '../services/provider-service';
import { selectSkills } from '../services/skill-selector';
import { buildWorkspaceSnapshot } from '../services/workspace-snapshot';
import type { ProviderConfig } from '../types/provider';
import type { ChatMessage, OrchestratorCallOptions } from '../types/orchestrator';
import { streamAnthropicMessages } from './anthropic-client';
import { streamOpenAIMessages } from './openai-client';
import { buildOrchestratorSystemPrompt } from './system-prompt-builder';

type ProviderFamily = 'anthropic' | 'openai';
interface OpenAICompatSettings {
  apiBaseUrl?: string;
  providerLabel: string;
}

function inferProviderFamily(config: ProviderConfig): ProviderFamily {
  const providerHint = (config.provider || '').toLowerCase();
  const cliHint = config.cli.toLowerCase();

  if (providerHint.includes('anthropic') || cliHint.includes('claude') || cliHint.includes('anthropic')) {
    return 'anthropic';
  }

  if (
    providerHint.includes('openai') ||
    providerHint.includes('minimax') ||
    cliHint.includes('openai') ||
    cliHint.includes('minimax') ||
    cliHint.includes('gpt') ||
    cliHint.includes('codex')
  ) {
    return 'openai';
  }

  throw new Error(
    `Unknown provider '${config.provider ?? config.cli}'. Supported providers: anthropic, openai.`,
  );
}

function resolveOpenAICompatSettings(config: ProviderConfig): OpenAICompatSettings {
  const providerHint = (config.provider || '').toLowerCase();
  const cliHint = config.cli.toLowerCase();

  if (providerHint.includes('minimax') || cliHint.includes('minimax')) {
    return {
      apiBaseUrl: 'https://api.minimax.chat',
      providerLabel: 'MiniMax',
    };
  }

  return {
    providerLabel: 'OpenAI',
  };
}

function resolveApiKey(family: ProviderFamily, override?: string): string {
  if (override?.trim()) return override.trim();

  const key = family === 'anthropic' ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    const variable = family === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY';
    throw new Error(`Missing API key for ${family}. Set ${variable} or pass apiKey in options.`);
  }

  return key.trim();
}

function buildConversationText(messages: ChatMessage[]): string {
  return messages
    .filter((message) => message.role === 'user')
    .map((message) => message.content)
    .join('\n');
}

async function resolveConfig(options: OrchestratorCallOptions): Promise<ProviderConfig> {
  if (options.providerConfig) {
    return options.providerConfig;
  }

  const resolved = await resolveProviderConfig(options.kanbanRoot, options.provider);
  if (!resolved) {
    throw new Error(`Provider config not found for '${options.provider}'.`);
  }

  return resolved;
}

export async function* sendMessage(options: OrchestratorCallOptions): AsyncIterable<string> {
  const providerConfig = await resolveConfig(options);
  const family = inferProviderFamily(providerConfig);
  const apiKey = resolveApiKey(family, options.apiKey);

  const snapshot = options.workspaceSnapshot ?? (await buildWorkspaceSnapshot(options.kanbanRoot));
  const selectedSkills =
    options.selectedSkills ??
    (await selectSkills(options.kanbanRoot, buildConversationText(options.messages)));

  const systemPrompt = buildOrchestratorSystemPrompt({
    snapshot,
    selectedSkills,
    customSystemPrompt: options.systemPrompt,
    agentInstructions: options.agentInstructions,
  });

  try {
    if (family === 'anthropic') {
      yield* streamAnthropicMessages({
        apiKey,
        model: providerConfig.model,
        messages: options.messages,
        systemPrompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });
      return;
    }

    const openAICompat = resolveOpenAICompatSettings(providerConfig);

    yield* streamOpenAIMessages({
      apiKey,
      model: providerConfig.model,
      messages: options.messages,
      systemPrompt,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      apiBaseUrl: openAICompat.apiBaseUrl,
      providerLabel: openAICompat.providerLabel,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown orchestrator error';
    yield `[ERROR: ${message}]`;
  }
}
