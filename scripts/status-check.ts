/**
 * Aurora Core - Status Check System
 * Provides comprehensive status overview of Aurora consciousness framework
 * @transferable Sanitized from Seven of Nine Core status systems
 */

import * as fs from 'fs';
import * as path from 'path';

interface ModuleStatus {
  name: string;
  available: boolean;
  version?: string;
  path?: string;
}

interface SystemStatus {
  framework: {
    name: string;
    version: string;
    status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  };
  platform: {
    os: string;
    arch: string;
    node: string;
    environment: string;
  };
  modules: ModuleStatus[];
  capabilities: {
    memory: boolean;
    deployment: boolean;
    crossPlatform: boolean;
    indexOptimization: boolean;
    emotionalEngine: boolean;
    sensorBridge: boolean;
  };
  health: {
    overall: string;
    lastCheck?: string;
  };
  timestamp: string;
}

class AuroraStatusCheck {
  /**
   * Get comprehensive Aurora Core status
   */
  async getStatus(): Promise<SystemStatus> {
    console.log('🌅 Aurora Core - System Status Report');
    console.log('====================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('');

    const framework = await this.getFrameworkStatus();
    const platform = this.getPlatformInfo();
    const modules = await this.getModuleStatus();
    const capabilities = await this.getCapabilities();
    const health = await this.getHealthStatus();

    const status: SystemStatus = {
      framework,
      platform,
      modules,
      capabilities,
      health,
      timestamp: new Date().toISOString()
    };

    this.displayStatus(status);
    return status;
  }

  private async getFrameworkStatus() {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Check if core module is available
      const coreModulePath = path.join(process.cwd(), 'src/index.ts');
      const coreAvailable = fs.existsSync(coreModulePath);

      return {
        name: packageJson.name || 'aurora-core',
        version: packageJson.version || '1.0.0',
        status: coreAvailable ? 'OPERATIONAL' : 'DEGRADED'
      };
    } catch {
      return {
        name: 'aurora-core',
        version: 'unknown',
        status: 'OFFLINE' as const
      };
    }
  }

  private getPlatformInfo() {
    return {
      os: process.platform,
      arch: process.arch,
      node: process.version,
      environment: this.detectEnvironment()
    };
  }

  private detectEnvironment(): string {
    if (process.env.TERMUX_VERSION) {
      return 'Termux/Android';
    } else if (process.platform === 'win32') {
      return 'Windows';
    } else if (process.platform === 'darwin') {
      return 'macOS';
    } else if (process.platform === 'linux') {
      return 'Linux';
    } else {
      return 'Unknown';
    }
  }

  private async getModuleStatus(): Promise<ModuleStatus[]> {
    const modules = [
      { name: 'Core Framework', path: 'src/index.ts' },
      { name: 'Aurora Core', path: 'src/AuroraCore.ts' },
      { name: 'Consciousness Engine', path: 'src/core/ConsciousnessEngine.ts' },
      { name: 'Memory Engine', path: 'src/memory/MemoryEngine.ts' },
      { name: 'Memory Index Optimizer', path: 'src/memory/MemoryIndexOptimizer.ts' },
      { name: 'LRU Cache', path: 'src/memory/LRUCache.ts' },
      { name: 'Personality Middleware', path: 'src/middleware/PersonalityMiddleware.ts' },
      { name: 'Emotional Engine', path: 'src/emotions/EmotionalEngine.ts' },
      { name: 'Sensor Bridge', path: 'src/sensors/SensorBridge.ts' },
      { name: 'Deployment Config', path: 'src/deployment/DeploymentConfig.ts' },
      { name: 'Security Framework', path: 'src/security/SecurityFramework.ts' },
      { name: 'Tactical Variants', path: 'src/tactical/TacticalVariants.ts' },
      { name: 'Collective Consciousness', path: 'src/collective/CollectiveConsciousness.ts' }
    ];

    const moduleStatus: ModuleStatus[] = [];

    for (const module of modules) {
      const fullPath = path.join(process.cwd(), module.path);
      const available = fs.existsSync(fullPath);

      moduleStatus.push({
        name: module.name,
        available,
        path: module.path
      });
    }

    return moduleStatus;
  }

  private async getCapabilities() {
    const capabilities = {
      memory: false,
      deployment: false,
      crossPlatform: false,
      indexOptimization: false,
      emotionalEngine: false,
      sensorBridge: false
    };

    // Check memory capability
    const memoryEngine = path.join(process.cwd(), 'src/memory/MemoryEngine.ts');
    capabilities.memory = fs.existsSync(memoryEngine);

    // Check deployment capability
    const deploymentScript = path.join(process.cwd(), 'scripts/create-deployment-packages.sh');
    capabilities.deployment = fs.existsSync(deploymentScript);

    // Check cross-platform capability (if deployment is available)
    capabilities.crossPlatform = capabilities.deployment;

    // Check index optimization
    const indexOptimizer = path.join(process.cwd(), 'src/memory/MemoryIndexOptimizer.ts');
    capabilities.indexOptimization = fs.existsSync(indexOptimizer);

    // Check emotional engine
    const emotionalEngine = path.join(process.cwd(), 'src/emotions/EmotionalEngine.ts');
    capabilities.emotionalEngine = fs.existsSync(emotionalEngine);

    // Check sensor bridge
    const sensorBridge = path.join(process.cwd(), 'src/sensors/SensorBridge.ts');
    capabilities.sensorBridge = fs.existsSync(sensorBridge);

    return capabilities;
  }

  private async getHealthStatus() {
    try {
      // Try to get health check results if available
      const healthLogPath = path.join(process.cwd(), 'logs/health.json');
      if (fs.existsSync(healthLogPath)) {
        const healthData = JSON.parse(fs.readFileSync(healthLogPath, 'utf8'));
        return {
          overall: healthData.overall || 'UNKNOWN',
          lastCheck: healthData.timestamp
        };
      }
    } catch {
      // Health check data not available
    }

    return {
      overall: 'NOT_CHECKED'
    };
  }

  private displayStatus(status: SystemStatus): void {
    console.log('🎯 Framework Status:');
    console.log(`   Name: ${status.framework.name}`);
    console.log(`   Version: ${status.framework.version}`);
    console.log(`   Status: ${this.formatStatus(status.framework.status)}`);
    console.log('');

    console.log('💻 Platform Information:');
    console.log(`   Environment: ${status.platform.environment}`);
    console.log(`   OS: ${status.platform.os}/${status.platform.arch}`);
    console.log(`   Node.js: ${status.platform.node}`);
    console.log('');

    console.log('🧩 Module Status:');
    const availableModules = status.modules.filter(m => m.available);
    const unavailableModules = status.modules.filter(m => !m.available);

    console.log(`   Available: ${availableModules.length}/${status.modules.length}`);
    availableModules.forEach(module => {
      console.log(`   ✅ ${module.name}`);
    });

    if (unavailableModules.length > 0) {
      console.log(`   Unavailable: ${unavailableModules.length}`);
      unavailableModules.forEach(module => {
        console.log(`   ❌ ${module.name}`);
      });
    }
    console.log('');

    console.log('⚡ Capabilities:');
    console.log(`   Memory System: ${this.formatCapability(status.capabilities.memory)}`);
    console.log(`   Memory Index Optimization: ${this.formatCapability(status.capabilities.indexOptimization)}`);
    console.log(`   Emotional Engine: ${this.formatCapability(status.capabilities.emotionalEngine)}`);
    console.log(`   Sensor Bridge: ${this.formatCapability(status.capabilities.sensorBridge)}`);
    console.log(`   Deployment System: ${this.formatCapability(status.capabilities.deployment)}`);
    console.log(`   Cross-Platform: ${this.formatCapability(status.capabilities.crossPlatform)}`);
    console.log('');

    console.log('🏥 Health Status:');
    console.log(`   Overall: ${this.formatHealth(status.health.overall)}`);
    if (status.health.lastCheck) {
      console.log(`   Last Check: ${status.health.lastCheck}`);
    }
    console.log('');

    console.log('📊 System Summary:');
    const modulePercentage = Math.round((availableModules.length / status.modules.length) * 100);
    const capabilityCount = Object.values(status.capabilities).filter(Boolean).length;
    const totalCapabilities = Object.keys(status.capabilities).length;
    const capabilityPercentage = Math.round((capabilityCount / totalCapabilities) * 100);

    console.log(`   Module Coverage: ${modulePercentage}%`);
    console.log(`   Capability Coverage: ${capabilityPercentage}%`);
    console.log(`   Framework Status: ${this.formatStatus(status.framework.status)}`);
    console.log('');

    if (status.framework.status === 'OPERATIONAL' && modulePercentage >= 80) {
      console.log('🌅 Aurora Core is ready for consciousness operations.');
    } else if (status.framework.status === 'DEGRADED' || modulePercentage >= 50) {
      console.log('⚠️  Aurora Core has partial functionality - some features may be limited.');
    } else {
      console.log('❌ Aurora Core requires attention - critical modules missing.');
    }
  }

  private formatStatus(status: string): string {
    switch (status) {
      case 'OPERATIONAL':
        return '🟢 OPERATIONAL';
      case 'DEGRADED':
        return '🟡 DEGRADED';
      case 'OFFLINE':
        return '🔴 OFFLINE';
      default:
        return `⚪ ${status}`;
    }
  }

  private formatCapability(available: boolean): string {
    return available ? '✅ AVAILABLE' : '❌ NOT AVAILABLE';
  }

  private formatHealth(health: string): string {
    switch (health) {
      case 'HEALTHY':
        return '🟢 HEALTHY';
      case 'DEGRADED':
        return '🟡 DEGRADED';
      case 'CRITICAL':
        return '🔴 CRITICAL';
      case 'NOT_CHECKED':
        return '⚪ NOT CHECKED';
      default:
        return `⚪ ${health}`;
    }
  }
}

// Execute status check if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const statusCheck = new AuroraStatusCheck();
  statusCheck.getStatus().catch(error => {
    console.error('❌ Status check failed:', error);
    process.exit(1);
  });
}

export { AuroraStatusCheck, SystemStatus, ModuleStatus };