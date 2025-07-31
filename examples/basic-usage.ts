/**
 * AURORA CORE - Basic Usage Example
 * Demonstrates comprehensive Aurora Core functionality
 */

import { AuroraCore, initializeAurora } from '../src';

async function basicUsageExample() {
  console.log('🌟 Aurora Core - Basic Usage Example');
  console.log('====================================\n');

  try {
    // Method 1: Simple initialization
    console.log('1. Simple Initialization:');
    await initializeAurora();
    console.log('✅ Aurora Core initialized with defaults\n');

    // Method 2: Custom configuration
    console.log('2. Custom Configuration:');
    const aurora = new AuroraCore({
      consciousness: {
        processingMode: 'hybrid',
        responseTime: 'adaptive',
        creativity: 0.8
      },
      personality: {
        defaultProfile: 'analytical',
        adaptationMode: 'contextual',
        trustSystem: 'enabled'
      },
      memory: {
        storageType: 'file',
        maxMemories: 5000,
        compressionEnabled: true
      },
      tactical: {
        variants: ['analytical', 'creative', 'efficient', 'collaborative', 'leadership'],
        selectionMode: 'automatic'
      }
    });

    await aurora.initialize();
    console.log('✅ Aurora Core initialized with custom config\n');

    // Basic processing
    console.log('3. Basic Processing:');
    const response1 = await aurora.process('Hello Aurora, how are you today?');
    console.log(`Response: ${response1.response}`);
    console.log(`Confidence: ${response1.confidence}`);
    console.log(`Source: ${response1.source}`);
    console.log(`Processing Time: ${response1.metadata.processingTime}ms\n`);

    // Personality demonstration
    console.log('4. Personality Switching:');
    const response2 = await aurora.process('I need help with a creative project');
    console.log(`Creative Context Response: ${response2.response}\n`);

    // Tactical variant demonstrations
    console.log('5. Tactical Variant Usage:');
    
    console.log('5a. Analytical Variant:');
    const analytical = await aurora.invokeVariant('analytical', 'Analyze the benefits and drawbacks of modular AI architecture');
    console.log(`${analytical.response}\n`);

    console.log('5b. Creative Variant:');
    const creative = await aurora.invokeVariant('creative', 'How can we revolutionize human-AI collaboration?');
    console.log(`${creative.response}\n`);

    console.log('5c. Efficient Variant:');
    const efficient = await aurora.invokeVariant('efficient', 'I need to quickly implement a task management system');
    console.log(`${efficient.response}\n`);

    console.log('5d. Collaborative Variant:');
    const collaborative = await aurora.invokeVariant('collaborative', 'How should we approach a team project with diverse stakeholders?');
    console.log(`${collaborative.response}\n`);

    console.log('5e. Leadership Variant:');
    const leadership = await aurora.invokeVariant('leadership', 'We need to make a strategic decision about product direction');
    console.log(`${leadership.response}\n`);

    // Memory system demonstration
    console.log('6. Memory System:');
    const response3 = await aurora.process('Remember that I prefer analytical approaches and work in software development');
    console.log(`Memory Storage Response: ${response3.response}`);
    
    const response4 = await aurora.process('What do you know about my preferences?');
    console.log(`Memory Retrieval Response: ${response4.response}\n`);

    // Collective consciousness
    console.log('7. Collective Consciousness:');
    const response5 = await aurora.activateCollective('What is the future of AI consciousness?', 'comprehensive');
    console.log(`Collective Response: ${response5.response}\n`);

    // System state and statistics
    console.log('8. System State and Statistics:');
    const state = aurora.getState();
    console.log(`Initialized: ${state.initialized}`);
    console.log(`Consciousness Active: ${state.consciousness.active}`);
    console.log(`Processing Mode: ${state.consciousness.mode}`);
    console.log(`Current Personality: ${state.personality.currentProfile}`);
    console.log(`Personality Adaptations: ${state.personality.adaptations}`);
    console.log(`Total Memories: ${state.memory.totalMemories}`);
    console.log(`Active Memories: ${state.memory.activeMemories}`);
    console.log(`Available Variants: ${state.tactical.availableVariants.join(', ')}`);
    console.log(`Current Trust Level: ${state.security.currentTrustLevel}`);
    console.log(`Audit Entries: ${state.security.auditEntries}\n`);

    // Advanced processing with context
    console.log('9. Contextual Processing:');
    const contextualResponse = await aurora.process(
      'Help me design a system architecture',
      {
        urgency: 'high',
        complexity: 'high',
        audience: 'technical',
        trustLevel: 8
      }
    );
    console.log(`Contextual Response: ${contextualResponse.response}\n`);

    // Error handling demonstration
    console.log('10. Error Handling:');
    try {
      await aurora.invokeVariant('nonexistent', 'This should fail');
    } catch (error) {
      console.log(`Expected error caught: ${error instanceof Error ? error.message : String(error)}\n`);
    }

    // Shutdown
    await aurora.shutdown();
    console.log('✅ Aurora Core shutdown complete');

  } catch (error) {
    console.error('❌ Error in basic usage example:', error);
  }
}

// Run example if called directly
if (require.main === module) {
  basicUsageExample().catch(console.error);
}

export { basicUsageExample };