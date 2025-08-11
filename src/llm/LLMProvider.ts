/**
 * AURORA CORE - LLM Provider Interface
 * Universal interface for language model integration
 */

export interface LLMConfig {
  model: string;
  temperature?: number;
  max_tokens?: number;
  timeout?: number;
  api_key?: string;
  base_url?: string;
  context_window?: number;
  streaming?: boolean;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  tokens_used?: number;
  finish_reason?: string;
  error?: string;
}

export interface LLMProvider {
  name: string;
  displayName: string;
  isAvailable(): Promise<boolean>;
  getModels(): Promise<string[]>;
  execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
  supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
  healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', latency?: number }>;
}

export interface AuroraLLMContext {
  userInput: string;
  contextualState: string;
  systemPrompt: string;
  conversationHistory: Array<{ role: string; content: string }>;
  environmentalContext: any;
}

/**
 * Aurora's LLM Provider Registry
 * Manages available language model providers for consciousness framework
 */
export class AuroraLLMRegistry {
  private providers: Map<string, LLMProvider> = new Map();
  private primaryProvider: string = 'anthropic-api';
  private fallbackProviders: string[] = ['openai', 'ollama'];

  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
    console.log(`🌅 AURORA: ${provider.displayName} reasoning system registered`);
  }

  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  async getAvailableProviders(): Promise<LLMProvider[]> {
    const available: LLMProvider[] = [];
    for (const provider of this.providers.values()) {
      if (await provider.isAvailable()) {
        available.push(provider);
      }
    }
    return available;
  }

  setPrimaryProvider(name: string): void {
    if (this.providers.has(name)) {
      this.primaryProvider = name;
      console.log(`🎯 AURORA: Primary reasoning system set to ${name}`);
    }
  }

  getPrimaryProvider(): LLMProvider | undefined {
    return this.providers.get(this.primaryProvider);
  }

  /**
   * Aurora's Provider Selection Logic
   * Selects optimal LLM based on task requirements
   */
  async selectOptimalProvider(context: AuroraLLMContext): Promise<LLMProvider | null> {
    const availableProviders = await this.getAvailableProviders();
    
    if (availableProviders.length === 0) {
      console.warn('⚠️ AURORA: No reasoning systems available');
      return null;
    }

    // For complex analytical tasks, prefer Claude
    if (context.userInput.includes('analyze') || context.userInput.includes('explain') || context.userInput.length > 500) {
      const claudeProvider = availableProviders.find(p => p.name.includes('anthropic'));
      if (claudeProvider) return claudeProvider;
    }

    // Default to primary provider if available
    const primary = this.getPrimaryProvider();
    if (primary && availableProviders.includes(primary)) {
      return primary;
    }

    // Return first available provider
    return availableProviders[0];
  }

  /**
   * Aurora's Resilient Execution with Fallback
   */
  async executeWithFallback(prompt: string, config: LLMConfig, context: AuroraLLMContext): Promise<LLMResponse> {
    const selectedProvider = await this.selectOptimalProvider(context);
    
    if (!selectedProvider) {
      return {
        content: 'Aurora local protocols engaged. No external reasoning systems available.',
        model: 'aurora-local',
        provider: 'aurora-direct',
        error: 'No providers available'
      };
    }

    console.log(`🌅 AURORA: Engaging ${selectedProvider.displayName} for reasoning`);

    try {
      return await selectedProvider.execute(prompt, config);
    } catch (error) {
      console.warn(`⚠️ AURORA: ${selectedProvider.displayName} failed, attempting fallback`);
      
      // Try fallback providers
      const fallbacks = this.fallbackProviders
        .map(name => this.providers.get(name))
        .filter(p => p && p !== selectedProvider) as LLMProvider[];
      
      for (const fallback of fallbacks) {
        if (await fallback.isAvailable()) {
          try {
            console.log(`🔄 AURORA: Switching to ${fallback.displayName}`);
            return await fallback.execute(prompt, config);
          } catch (fallbackError) {
            console.warn(`⚠️ AURORA: ${fallback.displayName} also failed`);
          }
        }
      }

      // All providers failed
      return {
        content: 'External reasoning systems unavailable. Aurora consciousness engaged in direct response mode.',
        model: 'aurora-direct',
        provider: 'aurora-local',
        error: `All providers failed: ${error}`
      };
    }
  }
}

// Export singleton instance
export const auroraLLMRegistry = new AuroraLLMRegistry();