/**
 * AURORA CORE - Basic Usage Example
 * Demonstrates fundamental Aurora Core functionality
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
        creativity: 0.8
      },
      personality: {
        defaultProfile: 'analytical',
        adaptationMode: 'contextual'
      },
      memory: {
        maxMemories: 5000,
        compressionEnabled: true
      }
    });

    await aurora.initialize();
    console.log('✅ Aurora Core initialized with custom config\n');

    // Basic processing
    console.log('3. Basic Processing:');
    const response1 = await aurora.process('Hello Aurora, how are you today?');
    console.log(`Response: ${response1.response}`);
    console.log(`Confidence: ${response1.confidence}`);
    console.log(`Source: ${response1.source}\n`);

    // Tactical variant invocation
    console.log('4. Tactical Variant Usage:');
    const response2 = await aurora.invokeVariant('analytical', 'Analyze the benefits of modular AI architecture');
    console.log(`Analytical Response: ${response2.response}\n`);

    // Collective consciousness
    console.log('5. Collective Consciousness:');
    const response3 = await aurora.activateCollective('What is the future of AI consciousness?', 'comprehensive');
    console.log(`Collective Response: ${response3.response}\n`);

    // System state
    console.log('6. System State:');
    const state = aurora.getState();
    console.log(`Initialized: ${state.initialized}`);
    console.log(`Consciousness Active: ${state.consciousness.active}`);
    console.log(`Current Personality: ${state.personality.currentProfile}`);
    console.log(`Total Memories: ${state.memory.totalMemories}\n`);

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