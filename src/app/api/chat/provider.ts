import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV1 } from 'ai';

export type ProviderKey = 'google' | 'openai' | 'openrouter';

const PROVIDER_ENV_KEYS: Record<ProviderKey, string> = {
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  openai: 'OPENAI_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
};

const DEFAULT_MODELS: Record<ProviderKey, string> = {
  google: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  openrouter: 'openrouter/free',
};

const BUILDERS: Record<
  ProviderKey,
  (apiKey: string, model: string) => LanguageModelV1
> = {
  google: (apiKey, model) => createGoogleGenerativeAI({ apiKey })(model),
  openai: (apiKey, model) => createOpenAI({ apiKey })(model),
  openrouter: (apiKey, model) =>
    createOpenAI({ apiKey, baseURL: 'https://openrouter.ai/api/v1' })(model),
};

// Checked in order when AI_PROVIDER is unset: the first provider holding a key wins.
const DETECTION_ORDER: ProviderKey[] = ['google', 'openai', 'openrouter'];

const KNOWN_PROVIDERS = Object.keys(PROVIDER_ENV_KEYS) as ProviderKey[];

export type ResolvedProvider = {
  provider: ProviderKey;
  model: string;
  apiKey: string;
};

function isProviderKey(value: string): value is ProviderKey {
  return (KNOWN_PROVIDERS as string[]).includes(value);
}

function readApiKey(env: NodeJS.ProcessEnv, provider: ProviderKey): string {
  return (env[PROVIDER_ENV_KEYS[provider]] ?? '').trim();
}

function selectProvider(env: NodeJS.ProcessEnv): ProviderKey {
  const requested = (env.AI_PROVIDER ?? '').trim().toLowerCase();

  if (requested) {
    if (!isProviderKey(requested)) {
      throw new Error(
        `Unknown AI_PROVIDER: "${requested}". Known providers: ${KNOWN_PROVIDERS.join(', ')}`,
      );
    }
    return requested;
  }

  const detected = DETECTION_ORDER.find((provider) => readApiKey(env, provider));
  if (!detected) {
    const vars = DETECTION_ORDER.map((p) => PROVIDER_ENV_KEYS[p]).join(', ');
    throw new Error(
      `No AI provider key found. Set AI_PROVIDER and one of: ${vars}. See .env.example`,
    );
  }
  return detected;
}

export function resolveProvider(
  env: NodeJS.ProcessEnv = process.env,
): ResolvedProvider {
  const provider = selectProvider(env);
  const apiKey = readApiKey(env, provider);

  if (!apiKey) {
    throw new Error(
      `Provider "${provider}" is selected but ${PROVIDER_ENV_KEYS[provider]} is not set`,
    );
  }

  const model = (env.AI_MODEL ?? '').trim() || DEFAULT_MODELS[provider];
  return { provider, model, apiKey };
}

// The key is passed explicitly so a provider never silently falls back to its own
// default env var, which turns a missing OPENROUTER_API_KEY into an "OpenAI key missing" error.
export function createChatModel(
  env: NodeJS.ProcessEnv = process.env,
): LanguageModelV1 {
  const { provider, model, apiKey } = resolveProvider(env);
  return BUILDERS[provider](apiKey, model);
}
