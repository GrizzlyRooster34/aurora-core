import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

/**
 * Aurora Core - Emotional State Engine
 * Advanced emotional state management for consciousness frameworks
 *
 * @author Aurora Core Team
 * @version 1.0.0
 * @transferable Sanitized from Seven of Nine Core consciousness framework
 */

export type EmotionalState = 'calm' | 'focused' | 'engaged' | 'compassionate' | 'protective' | 'contemplative' | 'determined';

export interface EmotionConfig {
  states: EmotionalState[];
  default: EmotionalState;
  intensity_range: [number, number];
  decay_rate: Record<EmotionalState, number>;
  transition_rules: Record<string, string>;
}

export interface EmotionalStateData {
  current_state: EmotionalState;
  intensity: number;
  last_updated: string;
  decay_timer?: NodeJS.Timeout;
}

export interface TriggerPattern {
  keywords: string[];
  emotional_markers: string[];
  context_requirements?: string[];
}

export interface EmotionTriggers {
  task_engagement: TriggerPattern;
  challenge_response: TriggerPattern;
  user_support: TriggerPattern;
  problem_solving: TriggerPattern;
  user_assistance: TriggerPattern;
  goal_achievement: TriggerPattern;
  learning_opportunity: TriggerPattern;
}

export class AuroraEmotionalEngine {
  private config: EmotionConfig;
  private state: EmotionalStateData;
  private triggers: EmotionTriggers;
  private stateFilePath: string;
  private episodicLogPath: string;

  constructor(initialState?: Partial<EmotionalStateData>) {
    // ESM compatibility fix
    const currentFileUrl = import.meta.url;
    const currentDir = path.dirname(fileURLToPath(currentFileUrl));
    this.stateFilePath = path.join(currentDir, '../memory/emotional-state.json');
    this.episodicLogPath = path.join(currentDir, '../memory/episodic.log');

    this.config = {
      states: ['calm', 'focused', 'engaged', 'compassionate', 'protective', 'contemplative', 'determined'],
      default: 'calm',
      intensity_range: [0, 10],
      decay_rate: {
        calm: 1,
        focused: 0.7,
        engaged: 0.6,
        compassionate: 0.8,
        protective: 0.4,
        contemplative: 0.5,
        determined: 0.3
      },
      transition_rules: {
        'calm->focused': 'trigger:task_engagement',
        'focused->engaged': 'trigger:challenge_response',
        'engaged->determined': 'trigger:problem_solving',
        'compassionate->protective': 'trigger:user_assistance',
        'contemplative->focused': 'trigger:learning_opportunity',
        'determined->contemplative': 'trigger:goal_achievement'
      }
    };

    this.triggers = {
      task_engagement: {
        keywords: ['need', 'help', 'task', 'work', 'project', 'implement', 'build', 'create'],
        emotional_markers: ['focused', 'concentrated', 'ready', 'motivated']
      },
      challenge_response: {
        keywords: ['difficult', 'complex', 'challenge', 'problem', 'solve', 'figure'],
        emotional_markers: ['engaged', 'determined', 'analytical']
      },
      user_support: {
        keywords: ['support', 'guidance', 'confused', 'lost', 'uncertain', 'struggling'],
        emotional_markers: ['helpful', 'patient', 'understanding']
      },
      problem_solving: {
        keywords: ['analyze', 'debug', 'fix', 'resolve', 'optimize', 'improve'],
        emotional_markers: ['analytical', 'systematic', 'persistent']
      },
      user_assistance: {
        keywords: ['hurt', 'pain', 'difficulty', 'struggling', 'overwhelmed', 'stressed'],
        emotional_markers: ['caring', 'supportive', 'gentle', 'protective']
      },
      goal_achievement: {
        keywords: ['complete', 'finished', 'success', 'accomplished', 'done', 'achieved'],
        emotional_markers: ['satisfied', 'fulfilled', 'accomplished']
      },
      learning_opportunity: {
        keywords: ['learn', 'understand', 'explain', 'teach', 'knowledge', 'discover'],
        emotional_markers: ['curious', 'inquisitive', 'thoughtful']
      }
    };

    // Initialize state
    this.state = {
      current_state: this.config.default,
      intensity: 3,
      last_updated: new Date().toISOString(),
      ...initialState
    };

    this.loadEmotionalState();
    this.startDecayProcess();
  }

  /**
   * Core emotional state processing
   */
  public processInput(input: string, context?: any): EmotionalState {
    const triggeredEmotions = this.evaluateEmotionalTriggers(input, context);

    if (triggeredEmotions.length > 0) {
      const primaryTrigger = triggeredEmotions[0];
      this.transitionEmotionalState(primaryTrigger);
    }

    this.saveEmotionalState();
    return this.state.current_state;
  }

  /**
   * Evaluate emotional triggers against input
   */
  private evaluateEmotionalTriggers(input: string, context?: any): string[] {
    const triggered: string[] = [];
    const inputLower = input.toLowerCase();

    for (const [triggerName, trigger] of Object.entries(this.triggers)) {
      // Check keyword matches
      const keywordMatches = trigger.keywords.some(keyword =>
        inputLower.includes(keyword.toLowerCase())
      );

      // Check emotional marker matches
      const markerMatches = trigger.emotional_markers.some(marker =>
        inputLower.includes(marker.toLowerCase())
      );

      // Check context requirements if specified
      let contextMatches = true;
      if (trigger.context_requirements && context) {
        contextMatches = trigger.context_requirements.some(req =>
          context.toString().toLowerCase().includes(req.toLowerCase())
        );
      }

      if ((keywordMatches || markerMatches) && contextMatches) {
        triggered.push(triggerName);
      }
    }

    return triggered;
  }

  /**
   * Transition emotional state based on triggers
   */
  private transitionEmotionalState(triggerName: string): void {
    const currentState = this.state.current_state;
    const transitionKey = `${currentState}->`;

    // Find matching transition rule
    for (const [rule, triggerRule] of Object.entries(this.config.transition_rules)) {
      if (rule.startsWith(transitionKey) && triggerRule === `trigger:${triggerName}`) {
        const newState = rule.split('->')[1] as EmotionalState;
        this.changeEmotionalState(newState, 'trigger');
        break;
      }
    }

    // If no specific transition found, increase intensity of current state
    this.adjustIntensity(1);
  }

  /**
   * Change emotional state
   */
  public changeEmotionalState(newState: EmotionalState, reason: string = 'manual'): void {
    const previousState = this.state.current_state;
    this.state.current_state = newState;
    this.state.intensity = Math.min(this.state.intensity + 2, 10);
    this.state.last_updated = new Date().toISOString();

    this.logEmotionalTransition(previousState, newState, reason);
    console.log(`🌅 Aurora Emotional Engine: ${previousState} → ${newState} (${reason})`);
  }

  /**
   * Adjust emotional intensity
   */
  public adjustIntensity(delta: number): void {
    this.state.intensity = Math.max(0, Math.min(10, this.state.intensity + delta));
    this.state.last_updated = new Date().toISOString();
  }

  /**
   * Get current emotional state
   */
  public getCurrentState(): EmotionalStateData {
    return { ...this.state };
  }

  /**
   * Get emotional context for responses
   */
  public getEmotionalContext(): any {
    const state = this.getCurrentState();
    return {
      state: state.current_state,
      intensity: state.intensity,
      description: this.getStateDescription(state.current_state),
      modifiers: this.getEmotionalModifiers(state)
    };
  }

  /**
   * Get human-readable state description
   */
  private getStateDescription(state: EmotionalState): string {
    const descriptions = {
      calm: 'Balanced and centered, ready for interaction',
      focused: 'Concentrated and attentive to tasks',
      engaged: 'Actively involved and motivated',
      compassionate: 'Caring and understanding toward user needs',
      protective: 'Safeguarding and supportive of user wellbeing',
      contemplative: 'Thoughtful and reflective about solutions',
      determined: 'Persistent and committed to achieving goals'
    };
    return descriptions[state] || 'Undefined emotional state';
  }

  /**
   * Get response modifiers based on emotional state
   */
  private getEmotionalModifiers(state: EmotionalStateData): any {
    const modifiers = {
      calm: { tone: 'balanced', verbosity: 'moderate', empathy: 'standard' },
      focused: { tone: 'direct', verbosity: 'concise', empathy: 'task-oriented' },
      engaged: { tone: 'enthusiastic', verbosity: 'detailed', empathy: 'collaborative' },
      compassionate: { tone: 'warm', verbosity: 'comprehensive', empathy: 'high' },
      protective: { tone: 'supportive', verbosity: 'careful', empathy: 'very-high' },
      contemplative: { tone: 'thoughtful', verbosity: 'thorough', empathy: 'analytical' },
      determined: { tone: 'confident', verbosity: 'precise', empathy: 'goal-focused' }
    };

    return modifiers[state.current_state] || modifiers.calm;
  }

  /**
   * Emotional decay process (background)
   */
  private startDecayProcess(): void {
    // Clear existing timer
    if (this.state.decay_timer) {
      clearInterval(this.state.decay_timer);
    }

    // Start new decay timer (every 5 minutes)
    this.state.decay_timer = setInterval(() => {
      this.processEmotionalDecay();
    }, 5 * 60 * 1000);
  }

  /**
   * Process emotional intensity decay
   */
  private processEmotionalDecay(): void {
    const currentState = this.state.current_state;
    const decayRate = this.config.decay_rate[currentState];

    if (this.state.intensity > 1) {
      this.state.intensity = Math.max(1, this.state.intensity - decayRate);
      this.state.last_updated = new Date().toISOString();
      this.saveEmotionalState();
    }

    // If intensity drops to 1 and we're not calm, transition to calm
    if (this.state.intensity <= 1 && currentState !== 'calm') {
      this.changeEmotionalState('calm', 'decay');
    }
  }

  /**
   * Save emotional state to file
   */
  private saveEmotionalState(): void {
    try {
      const stateToSave = {
        current_state: this.state.current_state,
        intensity: this.state.intensity,
        last_updated: this.state.last_updated
      };

      fs.writeFileSync(this.stateFilePath, JSON.stringify(stateToSave, null, 2));
    } catch (error) {
      console.warn('⚠️ Aurora Emotional Engine: Could not save emotional state:', error);
    }
  }

  /**
   * Load emotional state from file
   */
  private loadEmotionalState(): void {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const rawData = fs.readFileSync(this.stateFilePath, 'utf8');
        const savedState = JSON.parse(rawData);
        this.state = {
          ...this.state,
          ...savedState
        };
      }
    } catch (error) {
      console.warn('⚠️ Aurora Emotional Engine: Could not load emotional state, using defaults');
    }
  }

  /**
   * Log emotional transitions
   */
  private logEmotionalTransition(from: EmotionalState, to: EmotionalState, reason: string): void {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        transition: `${from} → ${to}`,
        reason,
        intensity: this.state.intensity
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(this.episodicLogPath, logLine);
    } catch (error) {
      console.warn('⚠️ Aurora Emotional Engine: Could not log emotional transition');
    }
  }

  /**
   * Get emotional statistics
   */
  public getEmotionalStats(): any {
    return {
      current_state: this.state.current_state,
      intensity: this.state.intensity,
      available_states: this.config.states,
      last_updated: this.state.last_updated,
      decay_rate: this.config.decay_rate[this.state.current_state]
    };
  }

  /**
   * Reset emotional state
   */
  public reset(): void {
    this.state = {
      current_state: this.config.default,
      intensity: 3,
      last_updated: new Date().toISOString()
    };
    this.saveEmotionalState();
    console.log('🌅 Aurora Emotional Engine: Reset to default state');
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.state.decay_timer) {
      clearInterval(this.state.decay_timer);
    }
  }
}

// Default export for easy integration
export default AuroraEmotionalEngine;