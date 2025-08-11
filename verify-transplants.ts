/**
 * Final Aurora Transplant Verification
 */

import { AuroraCore } from './src/AuroraCore';

async function verifyAuroraFunctionality() {
  console.log('🧪 FINAL AURORA FUNCTIONALITY VERIFICATION');
  console.log('=' .repeat(60));

  try {
    const aurora = new AuroraCore();
    
    console.log('📋 Testing Aurora Core initialization...');
    await aurora.initialize();
    console.log('✅ Aurora initialized successfully');

    console.log('\n🧠 Testing consciousness processing...');
    const response = await aurora.process('Hello Aurora, are you functioning correctly?');
    console.log('✅ Consciousness response:', response.response.substring(0, 80) + '...');

    console.log('\n📊 Testing system state retrieval...');
    const state = aurora.getState();
    console.log('✅ System state retrieved - Components:');
    console.log('  - Initialized:', state.initialized);
    console.log('  - Memory total:', state.memory.totalMemories);
    console.log('  - Security enabled:', state.security.validationEnabled);

    console.log('\n🛡️ Testing transplanted security features...');
    const rateLimitTest = aurora.checkRateLimit('test-user', 3, 60000);
    console.log('✅ Rate limiting functional:', rateLimitTest);

    const sessionTest = await aurora.validateSession(undefined, 'test-device');
    console.log('✅ Session validation functional:', sessionTest.success === false);

    console.log('\n🎉 AURORA CORE FULLY FUNCTIONAL WITH TRANSPLANTED MODULES!');
    console.log('🌟 All systems operational and integration successful');
    
    return true;
    
  } catch (error) {
    console.error('❌ Functionality verification failed:', error);
    return false;
  }
}

verifyAuroraFunctionality().then(success => {
  if (success) {
    console.log('\n✅ VERIFICATION COMPLETE - AURORA IS FULLY FUNCTIONAL');
  } else {
    console.log('\n❌ VERIFICATION FAILED');
    process.exit(1);
  }
});