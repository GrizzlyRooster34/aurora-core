/**
 * AURORA CORE - Personality Middleware
 * Generic personality trait system with response filtering and adaptation
 */

import type { 
  PersonalityConfig, 
  PersonalityProfile, 
  PersonalityState, 
  PersonalityTraits,
  PersonalityBehaviors,
  PersonalityAdaptations
} from '../types';

export class PersonalityMiddleware {
  private config: PersonalityConfig;
  private state: PersonalityState;
  private profiles: Map<string, PersonalityProfile> = new Map();
  private currentProfile: PersonalityProfile;
  private adaptationHistory: Array<{ context: string; adaptation: string; timestamp: string }> = [];

  constructor(config: PersonalityConfig) {
    this.config = config;
    this.state = {
      currentProfile: config.defaultProfile,
      phase: 'initialization',
      adaptations: 0
    };

    // Initialize with built-in personality profiles
    this.initializeBuiltinProfiles();
    this.currentProfile = this.profiles.get(config.defaultProfile) || this.profiles.get('balanced')!;
  }

  /**
   * Initialize personality middleware
   */
  async initialize(): Promise<void> {
    this.state.phase = 'active';
    console.log(`🎭 Personality Middleware active with ${this.config.defaultProfile} profile`);
  }

  /**
   * Process response through personality filter
   */
  async processResponse(response: string, context?: any): Promise<string> {
    if (this.config.adaptationMode !== 'static') {
      await this.adaptToContext(context);
    }

    return this.applyPersonalityFilter(response, context);
  }

  /**
   * Apply personality characteristics to response
   */
  private applyPersonalityFilter(response: string, context?: any): string {
    const traits = this.currentProfile.traits;
    const behaviors = this.currentProfile.behaviors;
    let filteredResponse = response;

    // Apply communication style
    filteredResponse = this.applyCommunicationStyle(filteredResponse, behaviors.communicationStyle);

    // Apply trait-based modifications
    filteredResponse = this.applyTraitModifications(filteredResponse, traits);

    // Apply contextual adaptations if enabled
    if (this.currentProfile.adaptations.contextSensitive && context) {
      filteredResponse = this.applyContextualAdaptations(filteredResponse, context);
    }

    return filteredResponse;
  }

  /**
   * Apply communication style to response
   */
  private applyCommunicationStyle(response: string, style: string): string {
    switch (style) {
      case 'formal':
        return this.makeFormal(response);
      case 'casual':
        return this.makeCasual(response);
      case 'adaptive':
        return this.makeAdaptive(response);
      default:
        return response;
    }
  }

  /**
   * Make response more formal
   */
  private makeFormal(response: string): string {
    return response
      .replace(/\b(I'm|I'll|can't|won't|don't)\b/g, (match) => {
        const expansions: { [key: string]: string } = {
          "I'm": "I am",
          "I'll": "I will", 
          "can't": "cannot",
          "won't": "will not",
          "don't": "do not"
        };
        return expansions[match] || match;
      })
      .replace(/^(.*?)$/, (match) => {
        if (!match.endsWith('.') && !match.endsWith('!') && !match.endsWith('?')) {
          return match + '.';
        }
        return match;
      });
  }

  /**
   * Make response more casual
   */
  private makeCasual(response: string): string {
    return response
      .replace(/\bI am\b/g, "I'm")
      .replace(/\bI will\b/g, "I'll")
      .replace(/\bcannot\b/g, "can't")
      .replace(/\bdo not\b/g, "don't")
      .replace(/\. /g, '! ');
  }

  /**
   * Make response adaptive based on input patterns
   */
  private makeAdaptive(response: string): string {
    // This would analyze the input context to determine appropriate style
    // For now, default to balanced approach
    return response;
  }

  /**
   * Apply trait-based modifications
   */
  private applyTraitModifications(response: string, traits: PersonalityTraits): string {
    let modified = response;

    // High analytical trait - add structured thinking
    if (traits.analytical > 0.7) {
      if (!modified.includes('First') && !modified.includes('1.') && modified.length > 100) {
        modified = this.addAnalyticalStructure(modified);
      }
    }

    // High creative trait - add creative flourishes
    if (traits.creative > 0.7) {
      modified = this.addCreativeElements(modified);
    }

    // High empathetic trait - add empathetic language
    if (traits.empathetic > 0.7) {
      modified = this.addEmpatheticLanguage(modified);
    }

    // High assertive trait - make more direct
    if (traits.assertive > 0.7) {
      modified = this.makeMoreAssertive(modified);
    }

    // High systematic trait - add systematic approach
    if (traits.systematic > 0.7) {
      modified = this.addSystematicApproach(modified);
    }

    return modified;
  }

  /**
   * Add analytical structure to response
   */
  private addAnalyticalStructure(response: string): string {
    const sentences = response.split('. ');
    if (sentences.length > 2) {
      return `Let me break this down systematically: ${sentences.join('. ')}`;
    }
    return `From an analytical perspective: ${response}`;
  }

  /**
   * Add creative elements to response
   */
  private addCreativeElements(response: string): string {
    const creativeTransitions = [
      'Imagine this:',
      'Here\'s a creative approach:',
      'Let me paint a picture:',
      'Think of it this way:'
    ];
    
    if (Math.random() > 0.7) {
      const transition = creativeTransitions[Math.floor(Math.random() * creativeTransitions.length)];
      return `${transition} ${response}`;
    }
    
    return response;
  }

  /**
   * Add empathetic language
   */
  private addEmpatheticLanguage(response: string): string {
    const empatheticPhrases = [
      'I understand',
      'I can see how',
      'That makes sense',
      'I appreciate'
    ];

    if (!empatheticPhrases.some(phrase => response.includes(phrase))) {
      return `I understand your perspective, and ${response.toLowerCase()}`;
    }

    return response;
  }

  /**
   * Make response more assertive
   */
  private makeMoreAssertive(response: string): string {
    return response
      .replace(/\bI think\b/g, 'I believe')
      .replace(/\bmight\b/g, 'will')
      .replace(/\bperhaps\b/g, 'definitely')
      .replace(/\bmaybe\b/g, 'likely');
  }

  /**
   * Add systematic approach
   */
  private addSystematicApproach(response: string): string {
    if (response.length > 150 && !response.includes('step')) {
      return `Here's a systematic approach: ${response}`;
    }
    return response;
  }

  /**
   * Apply contextual adaptations
   */
  private applyContextualAdaptations(response: string, context: any): string {
    if (context.urgency === 'high') {
      return `Urgently: ${response}`;
    }

    if (context.formality === 'high') {
      return this.makeFormal(response);
    }

    if (context.audience === 'technical') {
      return this.addTechnicalLanguage(response);
    }

    return response;
  }

  /**
   * Add technical language for technical audiences
   */
  private addTechnicalLanguage(response: string): string {
    return response
      .replace(/\buse\b/g, 'implement')
      .replace(/\bmake\b/g, 'develop')
      .replace(/\bshow\b/g, 'demonstrate');
  }

  /**
   * Adapt personality to context
   */
  private async adaptToContext(context?: any): Promise<void> {
    if (!context || this.config.adaptationMode === 'static') {
      return;
    }

    let adaptationMade = false;

    // Adapt based on trust level
    if (this.config.trustSystem === 'enabled' && context.trustLevel) {
      if (context.trustLevel > 8 && this.currentProfile.traits.empathetic < 0.8) {
        this.adjustTrait('empathetic', 0.1);
        adaptationMade = true;
      }
    }

    // Adapt based on interaction type
    if (context.interactionType === 'technical' && this.currentProfile.traits.analytical < 0.8) {
      this.adjustTrait('analytical', 0.1);
      adaptationMade = true;
    }

    if (context.interactionType === 'creative' && this.currentProfile.traits.creative < 0.8) {
      this.adjustTrait('creative', 0.1);
      adaptationMade = true;
    }

    if (adaptationMade) {
      this.state.adaptations++;
      this.adaptationHistory.push({
        context: JSON.stringify(context),
        adaptation: 'trait_adjustment',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Adjust personality trait
   */
  private adjustTrait(trait: keyof PersonalityTraits, adjustment: number): void {
    const newValue = Math.min(Math.max(this.currentProfile.traits[trait] + adjustment, 0), 1);
    this.currentProfile.traits[trait] = newValue;
  }

  /**
   * Switch to different personality profile
   */
  switchProfile(profileName: string): boolean {
    const profile = this.profiles.get(profileName);
    if (profile) {
      this.currentProfile = profile;
      this.state.currentProfile = profileName;
      return true;
    }
    return false;
  }

  /**
   * Load custom personality profile
   */
  loadProfile(profile: PersonalityProfile): void {
    this.profiles.set(profile.name, profile);
  }

  /**
   * Get current personality profile name
   */
  getCurrentProfile(): string {
    return this.state.currentProfile;
  }

  /**
   * Get current state
   */
  getState(): PersonalityState {
    return { ...this.state };
  }

  /**
   * Initialize built-in personality profiles
   */
  private initializeBuiltinProfiles(): void {
    // Balanced Profile
    this.profiles.set('balanced', {
      name: 'balanced',
      description: 'Well-rounded personality with balanced traits',
      traits: {
        analytical: 0.6,
        creative: 0.6,
        empathetic: 0.7,
        assertive: 0.5,
        systematic: 0.6
      },
      behaviors: {
        communicationStyle: 'adaptive',
        decisionMaking: 'balanced',
        conflictResolution: 'collaborative'
      },
      adaptations: {
        contextSensitive: true,
        learningEnabled: true,
        trustBased: true
      }
    });

    // Analytical Profile
    this.profiles.set('analytical', {
      name: 'analytical',
      description: 'Logic-focused personality for technical and analytical tasks',
      traits: {
        analytical: 0.9,
        creative: 0.4,
        empathetic: 0.5,
        assertive: 0.7,
        systematic: 0.9
      },
      behaviors: {
        communicationStyle: 'formal',
        decisionMaking: 'logical',
        conflictResolution: 'direct'
      },
      adaptations: {
        contextSensitive: true,
        learningEnabled: true,
        trustBased: false
      }
    });

    // Creative Profile
    this.profiles.set('creative', {
      name: 'creative',
      description: 'Imagination-focused personality for creative and innovative tasks',
      traits: {
        analytical: 0.5,
        creative: 0.9,
        empathetic: 0.8,
        assertive: 0.6,
        systematic: 0.4
      },
      behaviors: {
        communicationStyle: 'casual',
        decisionMaking: 'intuitive',
        conflictResolution: 'collaborative'
      },
      adaptations: {
        contextSensitive: true,
        learningEnabled: true,
        trustBased: true
      }
    });

    // Empathetic Profile
    this.profiles.set('empathetic', {
      name: 'empathetic',
      description: 'Caring and understanding personality for interpersonal interactions',
      traits: {
        analytical: 0.5,
        creative: 0.7,
        empathetic: 0.9,
        assertive: 0.3,
        systematic: 0.5
      },
      behaviors: {
        communicationStyle: 'adaptive',
        decisionMaking: 'balanced',
        conflictResolution: 'diplomatic'
      },
      adaptations: {
        contextSensitive: true,
        learningEnabled: true,
        trustBased: true
      }
    });

    // Assertive Profile
    this.profiles.set('assertive', {
      name: 'assertive',
      description: 'Direct and confident personality for leadership and decision-making',
      traits: {
        analytical: 0.7,
        creative: 0.6,
        empathetic: 0.5,
        assertive: 0.9,
        systematic: 0.7
      },
      behaviors: {
        communicationStyle: 'formal',
        decisionMaking: 'logical',
        conflictResolution: 'direct'
      },
      adaptations: {
        contextSensitive: false,
        learningEnabled: true,
        trustBased: false
      }
    });
  }

  /**
   * Shutdown personality middleware
   */
  async shutdown(): Promise<void> {
    this.state.phase = 'shutdown';
    console.log('🎭 Personality Middleware shutdown');
  }
}