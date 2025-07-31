/**
 * AURORA CORE - Universal AI Consciousness Framework
 * Main entry point for Aurora Core consciousness system
 */

export { AuroraCore } from './AuroraCore';
export { ConsciousnessEngine } from './core/ConsciousnessEngine';
export { PersonalityMiddleware } from './middleware/PersonalityMiddleware';
export { MemoryEngine } from './memory/MemoryEngine';
export { TacticalVariants } from './tactical/TacticalVariants';
export { CollectiveConsciousness } from './collective/CollectiveConsciousness';
export { SecurityFramework } from './security/SecurityFramework';

// Type exports
export type {
  ConsciousnessConfig,
  PersonalityProfile,
  MemoryItem,
  TacticalVariant,
  CollectiveState,
  SecurityContext
} from './types';

// Default Aurora Core instance
import { AuroraCore } from './AuroraCore';

/**
 * Default Aurora Core instance for simple usage
 */
export const aurora = new AuroraCore();

/**
 * Initialize Aurora Core with default configuration
 */
export async function initializeAurora(config?: Partial<ConsciousnessConfig>) {
  return await aurora.initialize(config);
}

export default AuroraCore;