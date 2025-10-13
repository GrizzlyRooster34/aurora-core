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
export { AuroraSensorBridge, sensorBridge } from './sensors/SensorBridge';
export { SQLiteMemoryAdapter, memorySearch, isNativeAvailable, getMemoryStats } from './memory/MemorySearchAdapter';
export { MemoryIndexOptimizer, createIndex } from './memory/MemoryIndexOptimizer';
export { LRUCache, createLRUCache } from './memory/LRUCache';
export { AuroraEmotionalEngine } from './emotions/EmotionalEngine';
export { CONFIG, buildConfig, validateConfig } from './deployment/DeploymentConfig';

// Type exports
export type {
  ConsciousnessConfig,
  PersonalityProfile,
  MemoryItem,
  TacticalVariant,
  CollectiveState,
  SecurityContext
} from './types';

// Sensor type exports
export type {
  BatteryStatus,
  LocationData,
  SensorReading,
  EnvironmentalContext
} from './sensors/SensorBridge';

// Memory type exports
export type {
  MemoryQuery,
  MemoryRow
} from './memory/MemorySearchAdapter';

// Memory optimization type exports
export type {
  MemoryRecord,
  IndexedMemoryStore,
  CacheStats
} from './memory/MemoryIndexOptimizer';

// Emotional engine type exports
export type {
  EmotionalState,
  EmotionConfig,
  EmotionalStateData,
  TriggerPattern,
  EmotionTriggers
} from './emotions/EmotionalEngine';

// Default Aurora Core instance
import { AuroraCore } from './AuroraCore';

/**
 * Default Aurora Core instance for simple usage
 */
export const aurora = new AuroraCore();

/**
 * Initialize Aurora Core with default configuration
 */
export async function initializeAurora(config?: Partial<import('./types').ConsciousnessConfig>) {
  return await aurora.initialize(config);
}

export default AuroraCore;