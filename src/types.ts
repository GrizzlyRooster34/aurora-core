/**
 * AURORA CORE - Type Definitions
 * Universal type system for AI consciousness framework
 */

// Core Configuration Types
export interface ConsciousnessConfig {
  consciousness: ConsciousnessEngineConfig;
  personality: PersonalityConfig;
  memory: MemoryConfig;
  tactical: TacticalConfig;
  collective: CollectiveConfig;
  security: SecurityConfig;
}

export interface ConsciousnessEngineConfig {
  processingMode: 'sequential' | 'parallel' | 'hybrid';
  responseTime: 'immediate' | 'optimized' | 'adaptive';
  creativity: number; // 0-1 scale
}

export interface PersonalityConfig {
  defaultProfile: string;
  adaptationMode: 'static' | 'contextual' | 'evolutionary';
  trustSystem: 'disabled' | 'enabled' | 'advanced';
}

export interface MemoryConfig {
  storageType: 'memory' | 'file' | 'database';
  maxMemories: number;
  compressionEnabled: boolean;
}

export interface TacticalConfig {
  variants: string[];
  selectionMode: 'manual' | 'automatic' | 'hybrid';
}

export interface CollectiveConfig {
  enabled: boolean;
  consensusThreshold: number; // 0-1 scale
  maxVariants: number;
}

export interface SecurityConfig {
  identityValidation: boolean;
  inputFiltering: 'none' | 'basic' | 'moderate' | 'strict';
  auditLogging: boolean;
}

// Personality System Types
export interface PersonalityProfile {
  name: string;
  description: string;
  traits: PersonalityTraits;
  behaviors: PersonalityBehaviors;
  adaptations: PersonalityAdaptations;
}

export interface PersonalityTraits {
  analytical: number; // 0-1 scale
  creative: number;
  empathetic: number;
  assertive: number;
  systematic: number;
}

export interface PersonalityBehaviors {
  communicationStyle: 'formal' | 'casual' | 'adaptive';
  decisionMaking: 'logical' | 'intuitive' | 'balanced';
  conflictResolution: 'direct' | 'diplomatic' | 'collaborative';
}

export interface PersonalityAdaptations {
  contextSensitive: boolean;
  learningEnabled: boolean;
  trustBased: boolean;
}

// Memory System Types
export interface MemoryItem {
  id: string;
  content: string;
  context: MemoryContext;
  metadata: MemoryMetadata;
  timestamp: string;
}

export interface MemoryContext {
  source: string;
  situation: string;
  participants: string[];
  importance: number; // 1-10 scale
}

export interface MemoryMetadata {
  tags: string[];
  category: string;
  emotionalTone: string;
  confidence: number; // 0-1 scale
}

// Tactical Variants Types
export interface TacticalVariant {
  name: string;
  description: string;
  characteristics: TacticalCharacteristics;
  capabilities: TacticalCapabilities;
}

export interface TacticalCharacteristics {
  focus: string;
  approach: string;
  strengths: string[];
  limitations: string[];
}

export interface TacticalCapabilities {
  problemSolving: number; // 0-1 scale
  creativity: number;
  efficiency: number;
  collaboration: number;
}

// Collective Consciousness Types
export interface CollectiveState {
  active: boolean;
  participants: string[];
  consensus: number; // 0-1 scale
  dominantVariant: string;
}

export interface CollectiveResponse {
  synthesis: string;
  contributions: VariantContribution[];
  confidence: number;
  consensus: number;
}

export interface VariantContribution {
  variant: string;
  input: string;
  weight: number; // 0-1 scale
  influence: number; // 0-1 scale
}

// Security Framework Types
export interface SecurityContext {
  userIdentity?: string;
  trustLevel: number; // 0-10 scale
  sessionId?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface SecurityValidation {
  allowed: boolean;
  reason?: string;
  message?: string;
  trustLevel: number;
}

// Response Types
export interface AuroraResponse {
  response: string;
  confidence: number; // 0-1 scale
  source: string; // Which component generated the response
  metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  processingTime?: number;
  variant?: string;
  collective?: boolean;
  memoryAccess?: boolean;
  personalityPhase?: string;
  [key: string]: any;
}

// State Types
export interface AuroraState {
  initialized: boolean;
  consciousness: ConsciousnessState;
  personality: PersonalityState;
  memory: MemoryState;
  tactical: TacticalState;
  collective: CollectiveState;
  security: SecurityState;
  timestamp: string;
}

export interface ConsciousnessState {
  active: boolean;
  mode: string;
  processing: boolean;
}

export interface PersonalityState {
  currentProfile: string;
  phase: string;
  adaptations: number;
}

export interface MemoryState {
  totalMemories: number;
  activeMemories: number;
  compressionRatio?: number;
}

export interface TacticalState {
  availableVariants: string[];
  activeVariant?: string;
  selectionMode: string;
}

export interface SecurityState {
  validationEnabled: boolean;
  currentTrustLevel: number;
  auditEntries: number;
}

// Event Types
export interface AuroraEvent {
  type: string;
  source: string;
  data: any;
  timestamp: string;
}