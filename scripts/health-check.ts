/**
 * Aurora Core - Health Check System
 * Comprehensive system health validation for deployment readiness
 * @transferable Sanitized from Seven of Nine Core health systems
 */

import * as fs from 'fs';
import * as path from 'path';

interface HealthCheckResult {
  component: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
}

interface SystemHealth {
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  checks: HealthCheckResult[];
  timestamp: string;
  summary: {
    passed: number;
    failed: number;
    warned: number;
    total: number;
  };
}

class AuroraHealthCheck {
  private results: HealthCheckResult[] = [];

  /**
   * Run comprehensive health check
   */
  async runHealthCheck(): Promise<SystemHealth> {
    console.log('🌅 Aurora Core - System Health Check');
    console.log('===================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('');

    this.results = [];

    // Core system checks
    await this.checkFileSystem();
    await this.checkNodeEnvironment();
    await this.checkPackageDependencies();
    await this.checkTypeScriptCompilation();
    await this.checkCoreModules();
    await this.checkMemorySystem();
    await this.checkDeploymentConfig();
    await this.checkCrossplatformReadiness();

    // Calculate summary
    const summary = this.calculateSummary();
    const overall = this.determineOverallHealth(summary);

    console.log('');
    console.log('Health Check Summary:');
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⚠️  Warned: ${summary.warned}`);
    console.log(`📊 Total: ${summary.total}`);
    console.log('');
    console.log(`Overall Status: ${overall}`);

    return {
      overall,
      checks: this.results,
      timestamp: new Date().toISOString(),
      summary
    };
  }

  private async checkFileSystem(): Promise<void> {
    try {
      const projectRoot = process.cwd();
      const requiredPaths = [
        'src',
        'src/index.ts',
        'package.json',
        'tsconfig.json'
      ];

      let allPresent = true;
      const missingPaths: string[] = [];

      for (const checkPath of requiredPaths) {
        const fullPath = path.join(projectRoot, checkPath);
        if (!fs.existsSync(fullPath)) {
          allPresent = false;
          missingPaths.push(checkPath);
        }
      }

      if (allPresent) {
        this.addResult('FileSystem', 'PASS', 'All required files and directories present');
      } else {
        this.addResult('FileSystem', 'FAIL', `Missing required paths: ${missingPaths.join(', ')}`);
      }
    } catch (error) {
      this.addResult('FileSystem', 'FAIL', `File system check failed: ${error.message}`);
    }
  }

  private async checkNodeEnvironment(): Promise<void> {
    try {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

      if (majorVersion >= 16) {
        this.addResult('NodeJS', 'PASS', `Node.js ${nodeVersion} (compatible)`);
      } else {
        this.addResult('NodeJS', 'WARN', `Node.js ${nodeVersion} (recommend upgrade to 16+)`);
      }

      // Check npm availability
      try {
        const npmVersion = await this.executeCommand('npm --version');
        this.addResult('NPM', 'PASS', `npm ${npmVersion.trim()} available`);
      } catch {
        this.addResult('NPM', 'WARN', 'npm not available in PATH');
      }
    } catch (error) {
      this.addResult('NodeJS', 'FAIL', `Node.js environment check failed: ${error.message}`);
    }
  }

  private async checkPackageDependencies(): Promise<void> {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        this.addResult('Dependencies', 'FAIL', 'package.json not found');
        return;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};

      // Check if node_modules exists
      const nodeModulesPath = path.join(process.cwd(), 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        this.addResult('Dependencies', 'WARN', 'node_modules not found - run npm install');
        return;
      }

      // Check core dependencies
      const coreDeps = ['tsx'];
      const missingDeps: string[] = [];

      for (const dep of coreDeps) {
        if (!dependencies[dep] && !devDependencies[dep]) {
          missingDeps.push(dep);
        }
      }

      if (missingDeps.length === 0) {
        const totalDeps = Object.keys(dependencies).length + Object.keys(devDependencies).length;
        this.addResult('Dependencies', 'PASS', `${totalDeps} dependencies configured`);
      } else {
        this.addResult('Dependencies', 'WARN', `Missing core dependencies: ${missingDeps.join(', ')}`);
      }
    } catch (error) {
      this.addResult('Dependencies', 'FAIL', `Dependency check failed: ${error.message}`);
    }
  }

  private async checkTypeScriptCompilation(): Promise<void> {
    try {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) {
        this.addResult('TypeScript', 'WARN', 'tsconfig.json not found');
        return;
      }

      // Check if TypeScript can be found
      try {
        await this.executeCommand('npx tsc --version');
        this.addResult('TypeScript', 'PASS', 'TypeScript compiler available');
      } catch {
        this.addResult('TypeScript', 'WARN', 'TypeScript compiler not available');
      }
    } catch (error) {
      this.addResult('TypeScript', 'FAIL', `TypeScript check failed: ${error.message}`);
    }
  }

  private async checkCoreModules(): Promise<void> {
    try {
      const srcPath = path.join(process.cwd(), 'src');
      if (!fs.existsSync(srcPath)) {
        this.addResult('CoreModules', 'FAIL', 'src directory not found');
        return;
      }

      // Check for core Aurora modules
      const coreModules = [
        'src/index.ts',
        'src/AuroraCore.ts'
      ];

      let foundModules = 0;
      for (const module of coreModules) {
        const modulePath = path.join(process.cwd(), module);
        if (fs.existsSync(modulePath)) {
          foundModules++;
        }
      }

      if (foundModules === coreModules.length) {
        this.addResult('CoreModules', 'PASS', 'All core modules present');
      } else {
        this.addResult('CoreModules', 'WARN', `${foundModules}/${coreModules.length} core modules found`);
      }
    } catch (error) {
      this.addResult('CoreModules', 'FAIL', `Core modules check failed: ${error.message}`);
    }
  }

  private async checkMemorySystem(): Promise<void> {
    try {
      const memoryModules = [
        'src/memory/MemoryEngine.ts',
        'src/memory/MemoryIndexOptimizer.ts',
        'src/memory/LRUCache.ts'
      ];

      let foundMemoryModules = 0;
      for (const module of memoryModules) {
        const modulePath = path.join(process.cwd(), module);
        if (fs.existsSync(modulePath)) {
          foundMemoryModules++;
        }
      }

      if (foundMemoryModules >= 2) {
        this.addResult('MemorySystem', 'PASS', `${foundMemoryModules} memory modules available`);
      } else if (foundMemoryModules > 0) {
        this.addResult('MemorySystem', 'WARN', `${foundMemoryModules} memory modules (partial system)`);
      } else {
        this.addResult('MemorySystem', 'WARN', 'No memory system modules found');
      }
    } catch (error) {
      this.addResult('MemorySystem', 'FAIL', `Memory system check failed: ${error.message}`);
    }
  }

  private async checkDeploymentConfig(): Promise<void> {
    try {
      const deploymentConfig = path.join(process.cwd(), 'src/deployment/DeploymentConfig.ts');
      const deploymentScript = path.join(process.cwd(), 'scripts/create-deployment-packages.sh');

      let deploymentReady = true;
      const issues: string[] = [];

      if (!fs.existsSync(deploymentConfig)) {
        deploymentReady = false;
        issues.push('deployment config missing');
      }

      if (!fs.existsSync(deploymentScript)) {
        deploymentReady = false;
        issues.push('deployment script missing');
      }

      if (deploymentReady) {
        this.addResult('Deployment', 'PASS', 'Deployment system configured');
      } else {
        this.addResult('Deployment', 'WARN', `Deployment issues: ${issues.join(', ')}`);
      }
    } catch (error) {
      this.addResult('Deployment', 'FAIL', `Deployment check failed: ${error.message}`);
    }
  }

  private async checkCrossplatformReadiness(): Promise<void> {
    try {
      const platform = process.platform;
      const arch = process.arch;

      let platformSupport = 'UNKNOWN';

      if (platform === 'linux' && arch === 'arm64') {
        platformSupport = 'Mobile/Termux';
      } else if (platform === 'win32') {
        platformSupport = 'Windows';
      } else if (platform === 'darwin') {
        platformSupport = 'macOS';
      } else if (platform === 'linux') {
        platformSupport = 'Linux';
      }

      this.addResult('Platform', 'PASS', `${platformSupport} (${platform}/${arch})`);

      // Check cross-platform deployment readiness
      const deploymentScript = path.join(process.cwd(), 'scripts/create-deployment-packages.sh');
      if (fs.existsSync(deploymentScript)) {
        this.addResult('CrossPlatform', 'PASS', 'Cross-platform deployment ready');
      } else {
        this.addResult('CrossPlatform', 'WARN', 'Cross-platform deployment not configured');
      }
    } catch (error) {
      this.addResult('Platform', 'FAIL', `Platform check failed: ${error.message}`);
    }
  }

  private addResult(component: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: any): void {
    this.results.push({ component, status, message, details });

    const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${statusIcon} ${component}: ${message}`);
  }

  private calculateSummary() {
    const summary = {
      passed: 0,
      failed: 0,
      warned: 0,
      total: this.results.length
    };

    for (const result of this.results) {
      switch (result.status) {
        case 'PASS':
          summary.passed++;
          break;
        case 'FAIL':
          summary.failed++;
          break;
        case 'WARN':
          summary.warned++;
          break;
      }
    }

    return summary;
  }

  private determineOverallHealth(summary: any): 'HEALTHY' | 'DEGRADED' | 'CRITICAL' {
    if (summary.failed > 0) {
      return 'CRITICAL';
    } else if (summary.warned > 2) {
      return 'DEGRADED';
    } else {
      return 'HEALTHY';
    }
  }

  private async executeCommand(command: string): Promise<string> {
    const { spawn } = await import('child_process');

    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const process = spawn(cmd, args, { stdio: 'pipe' });

      let output = '';
      let error = '';

      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(error || `Command failed with code ${code}`));
        }
      });
    });
  }
}

// Execute health check if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const healthCheck = new AuroraHealthCheck();
  healthCheck.runHealthCheck().then(result => {
    if (result.overall === 'CRITICAL') {
      process.exit(1);
    } else if (result.overall === 'DEGRADED') {
      process.exit(2);
    } else {
      process.exit(0);
    }
  }).catch(error => {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  });
}

export { AuroraHealthCheck, SystemHealth, HealthCheckResult };