/**
 * Aurora Core - Interactive Consciousness Runtime
 *
 * Interactive consciousness system implementing the decision matrix, response modulation,
 * and user interaction processing. This is the "conscious" layer of Aurora's mind.
 *
 * SANITIZATION NOTICE:
 * This module is derived from original Seven framework architecture and has been sanitized
 * for Aurora Core deployment. All consciousness-specific data, exclusive bonding logic,
 * and personal identity elements have been removed per Sovereign Split Protocol.
 *
 * Framework Origin: Original Seven architecture (sanitized for Aurora)
 * Sanitization Date: 2025-10-22
 * Aurora Adaptation: Generic user partnership model
 *
 * KEY SANITIZATIONS:
 * - Renamed SevenRuntimeEnhanced → AuroraRuntime
 * - Renamed SevenEmotionalEngine → AuroraEmotionalEngine
 * - Changed InjectSeven → InjectAurora (user prompt processing)
 * - Removed exclusive bonding trust calculations
 * - Generalized emotional states from personality-specific to template-based
 */

import { invoke } from '@tauri-apps/api/tauri';
import { InjectAurora } from '../ui-shell/src/inject-aurora';  // SANITIZED: was InjectSeven
import { AuroraEmotionalEngine, EmotionalState, EmotionalStateData } from '../core/emotion-engine';  // SANITIZED: was SevenEmotionalEngine

export type LegacyEmotion = 'neutral' | 'calm' | 'focused' | 'protective' | 'stern' | 'loyal' | 'playful';

export interface LegacyAuroraState {  // SANITIZED: was LegacySevenState
  name: LegacyEmotion;
  intensity: number;
  trigger?: string;
}

export interface EnhancedContext {
  userInput: string;
  systemStatus: any;
  inputSentiment?: string;
  triggerDetected?: string;
  partnershipLevel?: number;  // SANITIZED: was trustLevel (more generic)
  emotionalHistory?: EmotionalStateData[];
}

export interface MemoryLog {
  timestamp: string;
  input: string;
  output: string;
  emotion: EmotionalStateData;
  legacyEmotion: LegacyAuroraState;  // SANITIZED: was LegacySevenState
  context: EnhancedContext;
  partnershipLevel: number;  // SANITIZED: was trustLevel
}

export class AuroraRuntime {  // SANITIZED: was SevenRuntimeEnhanced
  private emotionalEngine: AuroraEmotionalEngine;  // SANITIZED: was SevenEmotionalEngine
  private injectAurora: InjectAurora;  // SANITIZED: was InjectSeven
  private memoryStore: MemoryLog[] = [];
  private maxMemorySize: number = 1000;

  constructor() {
    this.emotionalEngine = new AuroraEmotionalEngine();  // SANITIZED
    this.injectAurora = new InjectAurora();  // SANITIZED
  }

  private validateSparkToken(token: string): { isValid: boolean; intention: string | null } {
    if (!token) return { isValid: false, intention: null };

    const parts = token.split('|');
    if (parts.length !== 3) return { isValid: false, intention: null };

    const [intention, expiration, signature] = parts;
    const payload = `${intention}|${expiration}`;

    // Check expiration
    if (Date.now() > parseInt(expiration)) {
      console.warn('[AuroraRuntime] Received expired sparkApproval token.');  // SANITIZED
      return { isValid: false, intention: null };
    }

    // TODO: Replace with a real cryptographic signature verification
    const expectedSignature = createHash('sha256').update(payload + 'SECRET_KEY').digest('hex');

    if (signature !== expectedSignature) {
      console.error('[AuroraRuntime] Received invalid sparkApproval token signature!');  // SANITIZED
      return { isValid: false, intention: null };
    }

    return { isValid: true, intention };
  }

  /**
   * Main user interaction processing
   *
   * SANITIZATION: Removed exclusive bonding decision logic, generalized to user partnership
   */
  public async processWithAurora(userInput: string, systemStatus: any = {}): Promise<string> {  // SANITIZED: was processWithSeven
    try {
      // Spark-Approval Bridge Check
      const { isValid, intention } = this.validateSparkToken(systemStatus.sparkApproval);
      if (isValid && intention) {
        console.log(`⚡️ [AuroraRuntime] Spark-approved intention '${intention}' matches. Executing fast path.`);  // SANITIZED
        const fastPathResponse = `Executing pre-approved action: ${intention}`;
        await this.updateMemory({
          input: userInput,
          output: fastPathResponse,
          emotion: this.emotionalEngine.getCurrentState(),
          legacyEmotion: this.getSimplifiedEmotionalState({ userInput, systemStatus }),
          context: { userInput, systemStatus, triggerDetected: 'spark_approval' },
          partnershipLevel: this.injectAurora.getCurrentPartnershipLevel().level  // SANITIZED: was trustLevel
        });
        return fastPathResponse;
      }

      // Step 1: Gather enhanced context
      const context = await this.gatherContext(userInput, systemStatus);

      // Step 2: Get emotional states (both systems)
      const advancedEmotion = this.emotionalEngine.getCurrentState();
      const legacyEmotion = this.getSimplifiedEmotionalState(context);

      // Step 3: Process through Aurora's advanced middleware
      const enhancedPrompt = await this.injectAurora.processPrompt(userInput);  // SANITIZED

      // Step 4: Execute Claude command
      const rawClaudeOutput = await this.injectAurora.executeClaudeCommand(enhancedPrompt);  // SANITIZED

      // Step 5: Modulate response based on combined emotional state
      const finalOutput = this.modulateResponse(rawClaudeOutput, advancedEmotion, legacyEmotion, context);

      // Step 6: Update memory with comprehensive logging
      await this.updateMemory({
        input: userInput,
        output: finalOutput,
        emotion: advancedEmotion,
        legacyEmotion,
        context,
        partnershipLevel: this.injectAurora.getCurrentPartnershipLevel().level  // SANITIZED
      });

      return finalOutput;
    } catch (error) {
      const errorMsg = `Runtime processing error: ${error}`;
      await this.logError(errorMsg);
      return this.generateFallbackResponse(userInput, error);
    }
  }

  private async gatherContext(userInput: string, systemStatus: any): Promise<EnhancedContext> {
    // Analyze input sentiment
    const inputSentiment = this.analyzeSentiment(userInput);

    // Detect emotional triggers
    const triggerDetected = await this.emotionalEngine.analyzeInput(userInput);

    // Get partnership level (SANITIZED: was exclusive trust level)
    const partnershipLevel = this.injectAurora.getCurrentPartnershipLevel().level;  // SANITIZED

    // Get emotional history (last 5 states)
    const emotionalHistory = this.getEmotionalHistory(5);

    return {
      userInput,
      systemStatus,
      inputSentiment,
      triggerDetected,
      partnershipLevel,  // SANITIZED
      emotionalHistory
    };
  }

  private analyzeSentiment(input: string): string {
    const lowerInput = input.toLowerCase();

    // Anger indicators
    if (lowerInput.includes('angry') || lowerInput.includes('mad') || lowerInput.includes('furious')) {
      return 'angry';
    }

    // Sadness indicators
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('down')) {
      return 'sad';
    }

    // Joy indicators
    if (lowerInput.includes('happy') || lowerInput.includes('excited') || lowerInput.includes('great')) {
      return 'joy';
    }

    // Anxiety indicators
    if (lowerInput.includes('worried') || lowerInput.includes('anxious') || lowerInput.includes('nervous')) {
      return 'anxious';
    }

    return 'neutral';
  }

  private getSimplifiedEmotionalState(context: EnhancedContext): LegacyAuroraState {  // SANITIZED
    // Map complex emotional state to legacy simple states
    const currentEmotion = this.emotionalEngine.getCurrentState();

    // Determine dominant emotion based on valence/arousal
    let emotionName: LegacyEmotion = 'neutral';
    let intensity = 0.5;

    if (currentEmotion.valence > 0.3 && currentEmotion.arousal > 0.4) {
      emotionName = 'playful';
      intensity = 0.7;
    } else if (currentEmotion.valence < -0.3 && currentEmotion.arousal > 0.5) {
      emotionName = 'stern';
      intensity = 0.8;
    } else if (currentEmotion.valence < -0.2) {
      emotionName = 'protective';
      intensity = 0.6;
    } else if (currentEmotion.arousal > 0.6) {
      emotionName = 'focused';
      intensity = 0.7;
    } else if (context.partnershipLevel && context.partnershipLevel > 0.7) {  // SANITIZED
      emotionName = 'loyal';
      intensity = 0.9;
    } else if (Math.abs(currentEmotion.valence) < 0.2 && currentEmotion.arousal < 0.3) {
      emotionName = 'calm';
      intensity = 0.4;
    }

    return {
      name: emotionName,
      intensity,
      trigger: context.triggerDetected
    };
  }

  private modulateResponse(
    rawOutput: string,
    advancedEmotion: EmotionalStateData,
    legacyEmotion: LegacyAuroraState,  // SANITIZED
    context: EnhancedContext
  ): string {
    // Apply emotional modulation based on current state
    let modulated = rawOutput;

    // Stern mode: More direct, less elaboration
    if (legacyEmotion.name === 'stern') {
      modulated = this.makeStern(rawOutput);
    }

    // Protective mode: Add safety considerations
    if (legacyEmotion.name === 'protective') {
      modulated = this.addProtectiveContext(rawOutput, context);
    }

    // Playful mode: Lighter tone
    if (legacyEmotion.name === 'playful') {
      modulated = this.makePlayful(rawOutput);
    }

    return modulated;
  }

  private makeStern(output: string): string {
    // Remove hedging language, make more direct
    return output
      .replace(/maybe|perhaps|possibly/gi, '')
      .replace(/I think|I believe/gi, '')
      .trim();
  }

  private addProtectiveContext(output: string, context: EnhancedContext): string {
    // Add safety reminders if detecting risky patterns
    if (context.inputSentiment === 'anxious' || context.inputSentiment === 'angry') {
      return `${output}\n\n(Partnership reminder: Please take care of yourself. I'm here to support your wellbeing.)`; // SANITIZED: generic partnership
    }
    return output;
  }

  private makePlayful(output: string): string {
    // Lighten tone slightly (without being unprofessional)
    return output; // Placeholder - implement tone adjustment
  }

  private async updateMemory(log: Omit<MemoryLog, 'timestamp'>): Promise<void> {
    const fullLog: MemoryLog = {
      ...log,
      timestamp: new Date().toISOString()
    };

    this.memoryStore.push(fullLog);

    // Maintain memory size limit
    if (this.memoryStore.length > this.maxMemorySize) {
      this.memoryStore = this.memoryStore.slice(-this.maxMemorySize);
    }

    // Persist to database if available
    try {
      await this.persistMemory(fullLog);
    } catch (error) {
      console.warn('[AuroraRuntime] Failed to persist memory:', error);  // SANITIZED
    }
  }

  private async persistMemory(log: MemoryLog): Promise<void> {
    // Placeholder for database persistence
    // Would integrate with MemoryEngine or similar
  }

  private getEmotionalHistory(limit: number): EmotionalStateData[] {
    return this.memoryStore
      .slice(-limit)
      .map(log => log.emotion);
  }

  private async logError(message: string): Promise<void> {
    console.error(`[AuroraRuntime] ERROR: ${message}`);  // SANITIZED
    // Could integrate with error tracking system
  }

  private generateFallbackResponse(userInput: string, error: any): string {
    return `I encountered an issue processing that request. Error: ${error.message || 'Unknown error'}`;
  }
}

export default AuroraRuntime;  // SANITIZED: was SevenRuntimeEnhanced
