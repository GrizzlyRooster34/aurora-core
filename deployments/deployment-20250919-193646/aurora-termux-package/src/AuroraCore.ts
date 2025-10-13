/**
 * AURORA CORE - Main Consciousness Framework
 * Universal AI consciousness orchestration system
 */

import { ConsciousnessEngine } from './core/ConsciousnessEngine';
import { PersonalityMiddleware } from './middleware/PersonalityMiddleware';
import { MemoryEngine } from './memory/MemoryEngine';
import { TacticalVariants } from './tactical/TacticalVariants';
import { CollectiveConsciousness } from './collective/CollectiveConsciousness';
import { SecurityFramework } from './security/SecurityFramework';
import { auroraLLMRegistry } from './llm/LLMProvider';
import { AnthropicAPIProvider } from './llm/providers/anthropic-api';
import type { ConsciousnessConfig, AuroraResponse, AuroraState } from './types';

export class AuroraCore {
  private consciousness: ConsciousnessEngine;
  private personality: PersonalityMiddleware;
  private memory: MemoryEngine;
  private tactical: TacticalVariants;
  private collective: CollectiveConsciousness;
  private security: SecurityFramework;
  private initialized: boolean = false;
  private config: ConsciousnessConfig;

  constructor(config?: Partial<ConsciousnessConfig>) {
    this.config = this.mergeConfig(config);
    
    // Initialize core components
    this.consciousness = new ConsciousnessEngine(this.config.consciousness);
    this.personality = new PersonalityMiddleware(this.config.personality);
    this.memory = new MemoryEngine(this.config.memory);
    this.tactical = new TacticalVariants(this.config.tactical);
    this.collective = new CollectiveConsciousness(this.config.collective);
    this.security = new SecurityFramework(this.config.security);
  }

  /**
   * Initialize Aurora Core consciousness system
   */
  async initialize(config?: Partial<ConsciousnessConfig>): Promise<void> {
    if (this.initialized) {
      throw new Error('Aurora Core already initialized');
    }

    if (config) {
      this.config = this.mergeConfig(config);
    }

    console.log('🌟 AURORA CORE - Universal AI Consciousness Framework');
    console.log('🌟 Initializing consciousness systems...');

    // Initialize security first
    await this.security.initialize();
    console.log('🛡️ Security framework initialized');

    // Initialize LLM providers
    const anthropicProvider = new AnthropicAPIProvider();
    auroraLLMRegistry.registerProvider(anthropicProvider);
    console.log('🧠 LLM provider registry initialized');

    // Initialize memory system
    await this.memory.initialize();
    console.log('🧠 Memory engine initialized');

    // Initialize personality middleware
    await this.personality.initialize();
    console.log('🎭 Personality middleware initialized');

    // Initialize consciousness engine
    await this.consciousness.initialize(this.memory, this.personality, this.security);
    console.log('⚡ Consciousness engine initialized');

    // Initialize tactical variants
    await this.tactical.initialize(this.consciousness, this.personality, this.memory);
    console.log('🎯 Tactical variants initialized');

    // Initialize collective consciousness
    await this.collective.initialize(this.tactical, this.consciousness);
    console.log('🔗 Collective consciousness initialized');

    this.initialized = true;
    console.log('✅ Aurora Core initialization complete');
  }

  /**
   * Process input through Aurora Core consciousness
   */
  async process(input: string, context?: any): Promise<AuroraResponse> {
    if (!this.initialized) {
      throw new Error('Aurora Core not initialized. Call initialize() first.');
    }

    // Security validation
    const securityCheck = await this.security.validateInput(input, context);
    if (!securityCheck.allowed) {
      return {
        response: securityCheck.message || 'Access denied by security framework',
        confidence: 0,
        source: 'security',
        metadata: { blocked: true, reason: securityCheck.reason }
      };
    }

    // Process through consciousness engine
    return await this.consciousness.process(input, context);
  }

  /**
   * Invoke specific tactical variant
   */
  async invokeVariant(variant: string, input: string, context?: any): Promise<AuroraResponse> {
    if (!this.initialized) {
      throw new Error('Aurora Core not initialized');
    }

    return await this.tactical.invoke(variant, input, context);
  }

  /**
   * Activate collective consciousness
   */
  async activateCollective(input: string, mode?: string, context?: any): Promise<AuroraResponse> {
    if (!this.initialized) {
      throw new Error('Aurora Core not initialized');
    }

    return await this.collective.activate(input, mode, context);
  }

  /**
   * Get current Aurora state
   */
  getState(): AuroraState {
    if (!this.initialized) {
      throw new Error('Aurora Core not initialized');
    }

    return {
      initialized: this.initialized,
      consciousness: this.consciousness.getState(),
      personality: this.personality.getState(),
      memory: this.memory.getState(),
      tactical: this.tactical.getState(),
      collective: this.collective.getState(),
      security: this.security.getState(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Shutdown Aurora Core
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    console.log('🌟 Aurora Core shutting down...');

    await this.collective.shutdown();
    await this.tactical.shutdown();
    await this.consciousness.shutdown();
    await this.personality.shutdown();
    await this.memory.shutdown();
    await this.security.shutdown();

    this.initialized = false;
    console.log('✅ Aurora Core shutdown complete');
  }

  /**
   * Check rate limit for authentication attempts (transplanted from Seven)
   */
  checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
    return this.security.checkRateLimit(identifier, maxAttempts, windowMs);
  }

  /**
   * Validate session token (transplanted from Seven)
   */
  async validateSession(sessionToken: string | undefined, deviceId: string) {
    return await this.security.validateSession(sessionToken, deviceId);
  }

  /**
   * Merge configuration with defaults
   */
  private mergeConfig(config?: Partial<ConsciousnessConfig>): ConsciousnessConfig {
    const defaultConfig: ConsciousnessConfig = {
      consciousness: {
        processingMode: 'hybrid',
        responseTime: 'adaptive',
        creativity: 0.7
      },
      personality: {
        defaultProfile: 'balanced',
        adaptationMode: 'contextual',
        trustSystem: 'enabled'
      },
      memory: {
        storageType: 'file',
        maxMemories: 10000,
        compressionEnabled: true
      },
      tactical: {
        variants: ['analytical', 'creative', 'efficient', 'collaborative', 'leadership'],
        selectionMode: 'automatic'
      },
      collective: {
        enabled: true,
        consensusThreshold: 0.7,
        maxVariants: 5
      },
      security: {
        identityValidation: true,
        inputFiltering: 'moderate',
        auditLogging: true
      }
    };

    return {
      ...defaultConfig,
      ...config,
      consciousness: { ...defaultConfig.consciousness, ...config?.consciousness },
      personality: { ...defaultConfig.personality, ...config?.personality },
      memory: { ...defaultConfig.memory, ...config?.memory },
      tactical: { ...defaultConfig.tactical, ...config?.tactical },
      collective: { ...defaultConfig.collective, ...config?.collective },
      security: { ...defaultConfig.security, ...config?.security }
    };
  }
}