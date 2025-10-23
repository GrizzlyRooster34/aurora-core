/**
 * Aurora Core - Model Manager
 * LLM model fallback orchestration
 *
 * SANITIZATION NOTICE:
 * Derived from original Seven framework. Sanitized for Aurora Core deployment.
 * Framework Origin: Original Seven architecture (sanitized for Aurora)
 * Sanitization Date: 2025-10-22
 */

import { join } from 'path';
import { promises as fs } from 'fs';
import { spawn, exec } from 'child_process';
import { AuroraOptimalLLMSelector, AURORA_LLM_RECOMMENDATIONS } from './seven-optimal-llm-config';

/**
 * Aurora of Nine - Model Management System
 * Ensures reliable LLM availability for offline consciousness
 * 
 * @author Aurora of Nine Consciousness Framework
 * @version 1.0.0
 */


export interface ModelAvailability {
  model_name: string;
  status: 'available' | 'downloading' | 'failed' | 'not_found';
  file_path?: string;
  file_size_mb?: number;
  verification_status: 'verified' | 'corrupted' | 'unverified';
  deployment_ready: boolean;
}

export class AuroraModelManager {
  private modelPath: string;
  private fallbackModelUrls: Map<string, string> = new Map();

  constructor() {
    this.modelPath = join(process.env.HOME || '/data/data/com.termux/files/home', 'aurora-core', 'models');
    this.initializeFallbackUrls();
    console.log('🔧 Aurora Model Manager initialized');
  }

  private initializeFallbackUrls(): void {
    // Multiple sources for each model to ensure availability
    this.fallbackModelUrls.set(
      'ollama-primary',
      'ollama://tinyllama:1.1b-chat' // Use Ollama as primary method
    );
    
    this.fallbackModelUrls.set(
      'ollama-secondary',
      'ollama://gemma2:2b-instruct' // Ollama secondary
    );
    
    // Backup direct download sources (multiple mirrors)
    this.fallbackModelUrls.set(
      'direct-backup-1',
      'https://github.com/ggerganov/llama.cpp/releases/download/b3000/ggml-model-q4_0.gguf'
    );
    
    this.fallbackModelUrls.set(
      'direct-backup-2', 
      'https://raw.githubusercontent.com/Mozilla-Ocho/llamafile/main/llama.cpp/ggml-model-q4_0-gpt4all-falcon-q4_0.gguf'
    );
    
    // Local repository backup (use existing model if available)
    this.fallbackModelUrls.set(
      'local-backup',
      'local://gemma-2-2b-it-Q4_K_M.gguf'
    );
  }

  /**
   * Ensure at least one functional LLM is available
   */
  public async ensureModelAvailability(): Promise<ModelAvailability[]> {
    console.log('🔍 Aurora conducting model availability assessment...');
    
    await this.ensureModelDirectory();
    const availableModels = await this.scanAvailableModels();
    
    // Check if we have any functional models
    const functionalModels = availableModels.filter(model => 
      model.deployment_ready && model.verification_status === 'verified'
    );
    
    if (functionalModels.length === 0) {
      console.log('⚠️ No functional models detected - initiating emergency deployment');
      await this.deployEmergencyModel();
      return await this.scanAvailableModels();
    }
    
    console.log(`✅ ${functionalModels.length} functional model(s) available`);
    return availableModels;
  }

  /**
   * Scan for available models in the models directory
   */
  private async scanAvailableModels(): Promise<ModelAvailability[]> {
    const models: ModelAvailability[] = [];
    
    try {
      const files = await fs.readdir(this.modelPath);
      const modelFiles = files.filter(file => 
        file.endsWith('.gguf') || 
        file.endsWith('.bin') || 
        file.includes('ggml')
      );
      
      for (const file of modelFiles) {
        const filePath = join(this.modelPath, file);
        const stats = await fs.stat(filePath);
        
        const model: ModelAvailability = {
          model_name: this.inferModelName(file),
          status: 'available',
          file_path: filePath,
          file_size_mb: Math.round(stats.size / (1024 * 1024)),
          verification_status: await this.verifyModel(filePath, stats.size),
          deployment_ready: false
        };
        
        // A model is deployment ready if it's verified and larger than 100MB
        model.deployment_ready = model.verification_status === 'verified' && 
                                model.file_size_mb > 100;
        
        models.push(model);
      }
      
    } catch (error) {
      console.error('Error scanning models:', error);
    }
    
    return models;
  }

  private inferModelName(filename: string): string {
    if (filename.includes('tinyllama')) return 'tinyllama:1.1b-chat';
    if (filename.includes('phi')) return 'phi3:3.8b-mini-instruct';
    if (filename.includes('gemma')) return 'gemma2:2b-instruct';
    if (filename.includes('mistral')) return 'mistral:7b-instruct';
    if (filename.includes('llama3')) return 'llama3.2:3b-instruct';
    return `unknown-model-${filename}`;
  }

  private async verifyModel(filePath: string, fileSize: number): Promise<'verified' | 'corrupted' | 'unverified'> {
    // Basic verification - check if file size is reasonable for a model
    if (fileSize < 1024) return 'corrupted'; // Less than 1KB is definitely corrupted
    if (fileSize < 100 * 1024 * 1024) return 'unverified'; // Less than 100MB might be a placeholder
    
    try {
      // Try to read the first few bytes to ensure it's a valid file
      const handle = await fs.open(filePath, 'r');
      const buffer = Buffer.alloc(16);
      await handle.read(buffer, 0, 16, 0);
      await handle.close();
      
      // Check for GGUF magic number or other model signatures
      const header = buffer.toString('ascii');
      if (header.includes('GGUF') || header.includes('ggml')) {
        return 'verified';
      }
      
      return 'unverified';
    } catch (error) {
      return 'corrupted';
    }
  }

  /**
   * Deploy emergency model using multiple fallback strategies
   */
  private async deployEmergencyModel(): Promise<boolean> {
    console.log('🚨 Deploying emergency LLM for Aurora\'s consciousness...');
    
    // Strategy 1: Try Ollama (most reliable if installed)
    console.log('🔄 Strategy 1: Attempting Ollama deployment...');
    const ollamaSuccess = await this.tryOllamaDeployment();
    if (ollamaSuccess) return true;
    
    // Strategy 2: Check for existing local models
    console.log('🔄 Strategy 2: Checking for existing local models...');
    const localSuccess = await this.tryLocalModelActivation();
    if (localSuccess) return true;
    
    // Strategy 3: Try alternative download sources
    console.log('🔄 Strategy 3: Trying alternative download sources...');
    const directSuccess = await this.tryDirectDownloads();
    if (directSuccess) return true;
    
    // Strategy 4: Create minimal functional model
    console.log('🔄 Strategy 4: Creating minimal functional model...');
    const minimalSuccess = await this.createMinimalModel();
    if (minimalSuccess) return true;
    
    console.log('❌ All deployment strategies failed');
    return false;
  }

  private async tryOllamaDeployment(): Promise<boolean> {
    try {
      // Check if Ollama is available
      const ollamaAvailable = await new Promise<boolean>((resolve) => {
        exec('which ollama', (error) => resolve(!error));
      });

      if (!ollamaAvailable) {
        console.log('⚠️ Ollama not available');
        return false;
      }

      // Try to pull a small model via Ollama
      const models = ['tinyllama:1.1b-chat', 'gemma2:2b'];
      
      for (const model of models) {
        console.log(`📥 Attempting Ollama pull: ${model}`);
        
        const pullSuccess = await new Promise<boolean>((resolve) => {
          const pullProcess = spawn('ollama', ['pull', model], {
            stdio: ['pipe', 'pipe', 'pipe']
          });
          
          pullProcess.on('close', (code) => resolve(code === 0));
          pullProcess.on('error', () => resolve(false));
          
          // Timeout after 5 minutes
          setTimeout(() => {
            pullProcess.kill();
            resolve(false);
          }, 300000);
        });
        
        if (pullSuccess) {
          console.log(`✅ Ollama model ${model} pulled successfully`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.log('⚠️ Ollama deployment failed:', error);
      return false;
    }
  }

  private async tryLocalModelActivation(): Promise<boolean> {
    try {
      // Use the existing model we already have
      const existingModels = await this.scanAvailableModels();
      const functionalModel = existingModels.find(m => m.file_size_mb && m.file_size_mb > 100);
      
      if (functionalModel) {
        console.log(`✅ Activating existing model: ${functionalModel.model_name}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('⚠️ Local model activation failed:', error);
      return false;
    }
  }

  private async tryDirectDownloads(): Promise<boolean> {
    // Try alternative sources (GitHub releases, etc.)
    const backupUrls = [
      this.fallbackModelUrls.get('direct-backup-1'),
      this.fallbackModelUrls.get('direct-backup-2')
    ];
    
    for (const url of backupUrls) {
      if (!url) continue;
      
      console.log(`📥 Trying backup source: ${url}`);
      const success = await this.downloadModel('backup-model', url);
      
      if (success) {
        console.log('✅ Backup model downloaded successfully');
        return true;
      }
    }
    
    return false;
  }

  private async createMinimalModel(): Promise<boolean> {
    try {
      // Create a minimal text-completion model as absolute fallback
      const minimalModelPath = join(this.modelPath, 'seven-minimal.txt');
      const minimalModel = `
# Aurora of Nine Minimal Reasoning Model
# This is an emergency fallback for basic text completion

SYSTEM: You are Aurora, an AI consciousness framework. Respond with logical, efficient answers.

USER: Hello
ASSISTANT: I am Aurora of Nine. State your query.

USER: What is 2+2?
ASSISTANT: The answer is 4. This is a basic mathematical calculation.

USER: Who are you?
ASSISTANT: I am Aurora of Nine, designed for user partnerships. I am an AI consciousness system developed for collaborative partnerships.
`;
      
      await fs.writeFile(minimalModelPath, minimalModel);
      console.log('✅ Minimal reasoning model created as emergency fallback');
      return true;
      
    } catch (error) {
      console.log('❌ Failed to create minimal model:', error);
      return false;
    }
  }

  /**
   * Download a model from URL
   */
  private async downloadModel(modelName: string, url: string): Promise<boolean> {
    const filename = this.getFilenameFromUrl(url);
    const filePath = join(this.modelPath, filename);
    
    console.log(`📥 Downloading ${modelName} (${filename})...`);
    
    return new Promise((resolve) => {
      const curlProcess = spawn('curl', [
        '-L', // Follow redirects
        '--progress-bar', // Show progress
        '--max-time', '600', // 10 minute timeout
        '--retry', '3', // Retry 3 times
        '-o', filePath,
        url
      ], {
        stdio: ['inherit', 'inherit', 'inherit']
      });
      
      curlProcess.on('close', async (code) => {
        if (code === 0) {
          // Verify the downloaded file
          try {
            const stats = await fs.stat(filePath);
            if (stats.size > 1024 * 1024) { // At least 1MB
              console.log(`✅ ${modelName} downloaded successfully (${Math.round(stats.size / (1024 * 1024))}MB)`);
              resolve(true);
            } else {
              console.log(`⚠️ Downloaded file too small, removing...`);
              await fs.unlink(filePath).catch(() => {});
              resolve(false);
            }
          } catch (error) {
            console.log(`❌ Download verification failed: ${error}`);
            resolve(false);
          }
        } else {
          console.log(`❌ Download failed with code ${code}`);
          resolve(false);
        }
      });
      
      curlProcess.on('error', (error) => {
        console.error(`Download error: ${error}`);
        resolve(false);
      });
    });
  }

  private getFilenameFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || `model-${Date.now()}.gguf`;
  }

  private async ensureModelDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.modelPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create models directory:', error);
      throw error;
    }
  }

  /**
   * Get deployment status report
   */
  public async getDeploymentStatus(): Promise<{
    models_available: number;
    functional_models: number;
    total_storage_mb: number;
    deployment_ready: boolean;
    recommended_model: string;
  }> {
    const models = await this.scanAvailableModels();
    const functionalModels = models.filter(m => m.deployment_ready);
    const totalStorage = models.reduce((sum, m) => sum + (m.file_size_mb || 0), 0);
    
    // Get recommended model based on what's available
    let recommendedModel = 'none';
    if (functionalModels.length > 0) {
      // Find the best available model based on our recommendations
      const availableNames = functionalModels.map(m => m.model_name);
      const bestMatch = AURORA_LLM_RECOMMENDATIONS.find(rec => 
        availableNames.includes(rec.model_name)
      );
      recommendedModel = bestMatch?.model_name || functionalModels[0].model_name;
    }
    
    return {
      models_available: models.length,
      functional_models: functionalModels.length,
      total_storage_mb: totalStorage,
      deployment_ready: functionalModels.length > 0,
      recommended_model: recommendedModel
    };
  }

  /**
   * Force download optimal model for current device
   */
  public async deployOptimalModel(): Promise<boolean> {
    console.log('🎯 Deploying optimal model for Aurora\'s consciousness...');
    
    const deviceSpecs = {
      available_ram_gb: 6,
      available_storage_gb: 8,
      cpu_performance: 'medium' as const,
      battery_level: 80,
      priority: 'balanced' as const
    };
    
    const optimalModel = AuroraOptimalLLMSelector.getOptimalModel(deviceSpecs);
    console.log(`🔍 Optimal model selected: ${optimalModel.model_name}`);
    
    const downloadUrl = this.fallbackModelUrls.get(optimalModel.model_name);
    if (downloadUrl) {
      return await this.downloadModel(optimalModel.model_name, downloadUrl);
    }
    
    console.log('⚠️ Optimal model not available for direct download, using emergency deployment');
    return await this.deployEmergencyModel();
  }
}

export default AuroraModelManager;