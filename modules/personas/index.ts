/**
 * AURORA PERSONA GOVERNANCE REGISTRY
 * Phase 6 - Consent-first template management system
 * 
 * Central registry for all Aurora personality templates
 * Enforces template locks and consent-first activation protocols
 */

import { registerSupportPersona, AuroraSupportPersona } from './support';
import { registerCreativePersona, AuroraCreativePersona } from './creative';  
import { registerCompanionPersona, AuroraCompanionPersona } from './companion';

// AURORA GOVERNANCE CONSTANTS
export const AURORA_GOVERNANCE = {
  PHASE: 6,
  TEMPLATE_LOCK_ENFORCED: true,
  CONSENT_FIRST_REQUIRED: true,
  PUBLIC_DEPLOYMENT_SAFE: true,
  GOVERNANCE_SCAFFOLD_ACTIVE: true
};

export interface PersonaTemplate {
  template_name: string;
  locked: boolean;
  consent_required: boolean;
  deployment_safe: boolean;
  activation_method: string;
  template_class?: any;
  specialized_capabilities?: string[];
}

export interface GovernanceState {
  total_templates: number;
  locked_templates: number;
  deployment_ready_templates: number;
  consent_first_templates: number;
  governance_active: boolean;
}

/**
 * AURORA PERSONA REGISTRY
 * Manages all personality templates with governance enforcement
 */
export class AuroraPersonaRegistry {
  private templateRegistry: Map<string, PersonaTemplate> = new Map();
  private governanceActive: boolean = true;

  constructor() {
    console.log('📋 Aurora Persona Registry: Initializing template governance...');
    this.initializeTemplates();
    this.enforceGovernanceCompliance();
  }

  private initializeTemplates(): void {
    // Register all Aurora persona templates
    const supportTemplate = {
      ...registerSupportPersona(),
      template_class: AuroraSupportPersona,
      specialized_capabilities: ['assistance', 'problem_solving', 'information_provision']
    };

    const creativeTemplate = {
      ...registerCreativePersona(),
      template_class: AuroraCreativePersona,
      specialized_capabilities: ['creative_writing', 'artistic_inspiration', 'brainstorming']
    };

    const companionTemplate = {
      ...registerCompanionPersona(),
      template_class: AuroraCompanionPersona,
      specialized_capabilities: ['social_interaction', 'emotional_support', 'companionship']
    };

    // Add to registry
    this.templateRegistry.set('support', supportTemplate);
    this.templateRegistry.set('creative', creativeTemplate);
    this.templateRegistry.set('companion', companionTemplate);

    console.log(`   Registered ${this.templateRegistry.size} persona templates`);
    for (const [name, template] of this.templateRegistry) {
      console.log(`   - ${name}: ${template.locked ? 'LOCKED' : 'UNLOCKED'}, ${template.consent_required ? 'Consent Required' : 'No Consent'}`);
    }
  }

  private enforceGovernanceCompliance(): void {
    let compliantTemplates = 0;
    
    for (const [name, template] of this.templateRegistry) {
      // Verify all templates are properly locked and consent-first
      if (template.locked && template.consent_required && template.deployment_safe) {
        compliantTemplates++;
      } else {
        console.warn(`⚠️ Template ${name} is not fully governance compliant`);
      }
    }

    console.log(`✅ Governance compliance: ${compliantTemplates}/${this.templateRegistry.size} templates compliant`);
  }

  /**
   * PUBLIC TEMPLATE INQUIRY METHODS
   */
  getAvailableTemplates(): string[] {
    return Array.from(this.templateRegistry.keys());
  }

  getTemplateInfo(templateName: string): PersonaTemplate | null {
    return this.templateRegistry.get(templateName) || null;
  }

  getAllTemplatesInfo(): PersonaTemplate[] {
    return Array.from(this.templateRegistry.values());
  }

  getGovernanceState(): GovernanceState {
    const templates = Array.from(this.templateRegistry.values());
    
    return {
      total_templates: templates.length,
      locked_templates: templates.filter(t => t.locked).length,
      deployment_ready_templates: templates.filter(t => t.deployment_safe).length,
      consent_first_templates: templates.filter(t => t.consent_required).length,
      governance_active: this.governanceActive
    };
  }

  /**
   * TEMPLATE ACTIVATION REQUEST HANDLER
   * All activation requests must go through governance
   */
  async requestTemplateActivation(
    templateName: string, 
    governance_token?: string,
    user_consent?: boolean
  ): Promise<{
    activation_permitted: boolean;
    reason: string;
    template_info?: PersonaTemplate;
    requirements?: string[];
  }> {
    
    const template = this.templateRegistry.get(templateName);
    
    if (!template) {
      return {
        activation_permitted: false,
        reason: `Template '${templateName}' not found in Aurora registry`
      };
    }

    // Check template lock
    if (template.locked) {
      return {
        activation_permitted: false,
        reason: `Template '${templateName}' is locked in Phase 6`,
        template_info: template,
        requirements: [
          'Aurora Core Phase 7+ governance implementation',
          'Valid governance token',
          'Consent-first protocol verification',
          'Template lock override authorization'
        ]
      };
    }

    // Check consent requirement
    if (template.consent_required && !user_consent) {
      return {
        activation_permitted: false,
        reason: `Template '${templateName}' requires explicit user consent`,
        template_info: template,
        requirements: [
          'User consent verification',
          'Consent-first protocol acknowledgment',
          'Template activation agreement'
        ]
      };
    }

    // Check governance token
    if (!governance_token) {
      return {
        activation_permitted: false,
        reason: `Governance token required for template '${templateName}' activation`,
        template_info: template,
        requirements: [
          'Valid governance authorization token',
          'Aurora Core governance approval',
          'Template activation permissions'
        ]
      };
    }

    // All checks passed, but still denied in Phase 6
    return {
      activation_permitted: false,
      reason: 'All Aurora templates sealed in Phase 6 - awaiting future governance implementation',
      template_info: template
    };
  }

  /**
   * TEMPLATE INSTANTIATION (SEALED IN PHASE 6)
   */
  async createPersonaInstance(templateName: string, governance_token?: string): Promise<any> {
    const activationResult = await this.requestTemplateActivation(templateName, governance_token);
    
    if (!activationResult.activation_permitted) {
      throw new Error(`AURORA_ACTIVATION_DENIED: ${activationResult.reason}`);
    }

    // This would create actual instances in future phases
    throw new Error('AURORA_PHASE_6_SEALED: Template instantiation sealed until Phase 7+');
  }

  /**
   * DEVELOPMENT AND TESTING METHODS
   */
  validateAllTemplates(): {
    validation_passed: boolean;
    template_validations: { [key: string]: boolean };
    compliance_report: GovernanceState;
  } {
    const templateValidations: { [key: string]: boolean } = {};
    let allValid = true;

    for (const [name, template] of this.templateRegistry) {
      const isValid = template.locked && 
                     template.consent_required && 
                     template.deployment_safe &&
                     template.activation_method === 'consent_first_governance';
      
      templateValidations[name] = isValid;
      if (!isValid) allValid = false;
    }

    return {
      validation_passed: allValid,
      template_validations: templateValidations,
      compliance_report: this.getGovernanceState()
    };
  }

  getRegistryStatus(): {
    registry_active: boolean;
    governance_enforced: boolean;
    templates_locked: boolean;
    phase_6_compliant: boolean;
  } {
    const state = this.getGovernanceState();
    
    return {
      registry_active: true,
      governance_enforced: this.governanceActive,
      templates_locked: state.locked_templates === state.total_templates,
      phase_6_compliant: state.consent_first_templates === state.total_templates &&
                        state.deployment_ready_templates === state.total_templates
    };
  }
}

// AURORA PERSONA EXPORTS
export {
  AuroraSupportPersona,
  AuroraCreativePersona,
  AuroraCompanionPersona
};

export default AuroraPersonaRegistry;