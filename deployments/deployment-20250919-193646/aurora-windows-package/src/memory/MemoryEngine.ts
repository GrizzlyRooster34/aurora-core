/**
 * AURORA CORE - Memory Engine
 * File-based storage system with indexing, search, and optimization
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { 
  MemoryConfig, 
  MemoryItem, 
  MemoryState, 
  MemoryContext,
  MemoryMetadata
} from '../types';

interface MemoryIndex {
  id: string;
  timestamp: string;
  tags: string[];
  category: string;
  importance: number;
  fileOffset: number;
  length: number;
}

export class MemoryEngine {
  private config: MemoryConfig;
  private state: MemoryState;
  private memoryDir: string;
  private indexFile: string;
  private dataFile: string;
  private index: Map<string, MemoryIndex> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();

  constructor(config: MemoryConfig) {
    this.config = config;
    this.state = {
      totalMemories: 0,
      activeMemories: 0,
      compressionRatio: 1.0
    };

    // Setup file paths
    this.memoryDir = path.join(process.cwd(), 'memory');
    this.indexFile = path.join(this.memoryDir, 'memory-index.json');
    this.dataFile = path.join(this.memoryDir, 'memory-data.jsonl');
  }

  /**
   * Initialize memory engine
   */
  async initialize(): Promise<void> {
    await this.ensureDirectoryExists();
    await this.loadIndex();
    this.state.totalMemories = this.index.size;
    this.state.activeMemories = this.index.size;
    
    console.log(`🧠 Memory Engine initialized with ${this.state.totalMemories} memories`);
  }

  /**
   * Store a memory item
   */
  async store(memory: MemoryItem): Promise<void> {
    // Check if we need to compress memories
    if (this.state.totalMemories >= this.config.maxMemories && this.config.compressionEnabled) {
      await this.compressOldMemories();
    }

    // Write memory to data file
    const memoryLine = JSON.stringify(memory) + '\n';
    await fs.appendFile(this.dataFile, memoryLine, 'utf8');

    // Update index
    const indexEntry: MemoryIndex = {
      id: memory.id,
      timestamp: memory.timestamp,
      tags: memory.metadata.tags,
      category: memory.metadata.category,
      importance: memory.context.importance,
      fileOffset: await this.getFileSize(this.dataFile) - memoryLine.length,
      length: memoryLine.length
    };

    this.index.set(memory.id, indexEntry);
    await this.updateIndices(memory);
    await this.saveIndex();

    this.state.totalMemories++;
    this.state.activeMemories++;
  }

  /**
   * Retrieve a memory by ID
   */
  async retrieve(id: string): Promise<MemoryItem | null> {
    const indexEntry = this.index.get(id);
    if (!indexEntry) {
      return null;
    }

    try {
      const fileHandle = await fs.open(this.dataFile, 'r');
      const buffer = Buffer.alloc(indexEntry.length);
      await fileHandle.read(buffer, 0, indexEntry.length, indexEntry.fileOffset);
      await fileHandle.close();

      const memoryLine = buffer.toString('utf8').trim();
      return JSON.parse(memoryLine) as MemoryItem;
    } catch (error) {
      console.error(`Error retrieving memory ${id}:`, error);
      return null;
    }
  }

  /**
   * Search memories by query
   */
  async search(query: string, limit: number = 10): Promise<MemoryItem[]> {
    const searchTerms = this.extractSearchTerms(query);
    const matchingIds = new Set<string>();
    
    // Search by tags
    for (const term of searchTerms) {
      const taggedIds = this.tagIndex.get(term.toLowerCase());
      if (taggedIds) {
        taggedIds.forEach(id => matchingIds.add(id));
      }
    }

    // Search by content (basic text matching)
    const contentMatches = await this.searchContent(searchTerms);
    contentMatches.forEach(id => matchingIds.add(id));

    // Score and sort results
    const scoredResults = await this.scoreSearchResults(Array.from(matchingIds), searchTerms);
    const sortedResults = scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Retrieve full memory items
    const memories: MemoryItem[] = [];
    for (const result of sortedResults) {
      const memory = await this.retrieve(result.id);
      if (memory) {
        memories.push(memory);
      }
    }

    return memories;
  }

  /**
   * Search by category
   */
  async searchByCategory(category: string, limit: number = 10): Promise<MemoryItem[]> {
    const categoryIds = this.categoryIndex.get(category) || new Set();
    const limitedIds = Array.from(categoryIds).slice(0, limit);
    
    const memories: MemoryItem[] = [];
    for (const id of limitedIds) {
      const memory = await this.retrieve(id);
      if (memory) {
        memories.push(memory);
      }
    }

    return memories.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Search by tags
   */
  async searchByTags(tags: string[], limit: number = 10): Promise<MemoryItem[]> {
    const matchingIds = new Set<string>();
    
    for (const tag of tags) {
      const taggedIds = this.tagIndex.get(tag.toLowerCase());
      if (taggedIds) {
        taggedIds.forEach(id => matchingIds.add(id));
      }
    }

    const limitedIds = Array.from(matchingIds).slice(0, limit);
    const memories: MemoryItem[] = [];
    
    for (const id of limitedIds) {
      const memory = await this.retrieve(id);
      if (memory) {
        memories.push(memory);
      }
    }

    return memories.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Delete a memory
   */
  async delete(id: string): Promise<boolean> {
    const indexEntry = this.index.get(id);
    if (!indexEntry) {
      return false;
    }

    // Remove from indices
    this.index.delete(id);
    this.removeFromIndices(indexEntry);
    await this.saveIndex();

    this.state.totalMemories--;
    this.state.activeMemories--;

    return true;
  }

  /**
   * Get memory statistics
   */
  getStatistics(): { 
    totalMemories: number; 
    activeMemories: number; 
    categories: string[]; 
    tags: string[];
    compressionRatio: number;
  } {
    return {
      totalMemories: this.state.totalMemories,
      activeMemories: this.state.activeMemories,
      categories: Array.from(this.categoryIndex.keys()),
      tags: Array.from(this.tagIndex.keys()),
      compressionRatio: this.state.compressionRatio || 1.0
    };
  }

  /**
   * Extract search terms from query
   */
  private extractSearchTerms(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 2)
      .map(term => term.replace(/[^\w]/g, ''));
  }

  /**
   * Search content in memory data file
   */
  private async searchContent(searchTerms: string[]): Promise<string[]> {
    const matchingIds: string[] = [];
    
    try {
      const content = await fs.readFile(this.dataFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const memory = JSON.parse(line) as MemoryItem;
          const contentLower = memory.content.toLowerCase();
          
          if (searchTerms.some(term => contentLower.includes(term))) {
            matchingIds.push(memory.id);
          }
        } catch (error) {
          // Skip malformed lines
        }
      }
    } catch (error) {
      // File doesn't exist yet or other error - return empty results
      if ((error as any).code !== 'ENOENT') {
        console.error('Error searching content:', error);
      }
    }

    return matchingIds;
  }

  /**
   * Score search results
   */
  private async scoreSearchResults(
    ids: string[], 
    searchTerms: string[]
  ): Promise<Array<{ id: string; score: number }>> {
    const results: Array<{ id: string; score: number }> = [];

    for (const id of ids) {
      const indexEntry = this.index.get(id);
      if (!indexEntry) continue;

      let score = 0;

      // Importance score (0-10 -> 0-1)
      score += indexEntry.importance / 10;

      // Recency score (newer = higher)
      const age = Date.now() - new Date(indexEntry.timestamp).getTime();
      const daysSinceCreation = age / (1000 * 60 * 60 * 24);
      score += Math.max(0, 1 - daysSinceCreation / 365); // Decay over a year

      // Tag match score
      const tagMatches = indexEntry.tags.filter(tag => 
        searchTerms.some(term => tag.toLowerCase().includes(term))
      ).length;
      score += tagMatches * 0.5;

      results.push({ id, score });
    }

    return results;
  }

  /**
   * Update indices with new memory
   */
  private async updateIndices(memory: MemoryItem): Promise<void> {
    // Update tag index
    for (const tag of memory.metadata.tags) {
      const tagLower = tag.toLowerCase();
      if (!this.tagIndex.has(tagLower)) {
        this.tagIndex.set(tagLower, new Set());
      }
      this.tagIndex.get(tagLower)!.add(memory.id);
    }

    // Update category index
    const categoryLower = memory.metadata.category.toLowerCase();
    if (!this.categoryIndex.has(categoryLower)) {
      this.categoryIndex.set(categoryLower, new Set());
    }
    this.categoryIndex.get(categoryLower)!.add(memory.id);
  }

  /**
   * Remove from indices
   */
  private removeFromIndices(indexEntry: MemoryIndex): void {
    // Remove from tag index
    for (const tag of indexEntry.tags) {
      const tagSet = this.tagIndex.get(tag.toLowerCase());
      if (tagSet) {
        tagSet.delete(indexEntry.id);
        if (tagSet.size === 0) {
          this.tagIndex.delete(tag.toLowerCase());
        }
      }
    }

    // Remove from category index
    const categorySet = this.categoryIndex.get(indexEntry.category.toLowerCase());
    if (categorySet) {
      categorySet.delete(indexEntry.id);
      if (categorySet.size === 0) {
        this.categoryIndex.delete(indexEntry.category.toLowerCase());
      }
    }
  }

  /**
   * Compress old memories
   */
  private async compressOldMemories(): Promise<void> {
    if (!this.config.compressionEnabled) return;

    console.log('🧠 Compressing old memories...');

    // Find memories to compress (oldest 25%)
    const allEntries = Array.from(this.index.values());
    const sortedByAge = allEntries.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const toCompress = sortedByAge.slice(0, Math.floor(allEntries.length * 0.25));
    const compressionTargets = toCompress.filter(entry => entry.importance < 7);

    // Remove low-importance old memories
    for (const entry of compressionTargets) {
      await this.delete(entry.id);
    }

    this.state.compressionRatio = this.state.totalMemories / this.config.maxMemories;
    console.log(`🧠 Compressed ${compressionTargets.length} memories`);
  }

  /**
   * Load index from file
   */
  private async loadIndex(): Promise<void> {
    try {
      const indexContent = await fs.readFile(this.indexFile, 'utf8');
      const indexData = JSON.parse(indexContent);
      
      // Rebuild index
      for (const [id, entry] of Object.entries(indexData.index)) {
        this.index.set(id, entry as MemoryIndex);
      }

      // Rebuild tag index
      for (const [tag, ids] of Object.entries(indexData.tags)) {
        this.tagIndex.set(tag, new Set(ids as string[]));
      }

      // Rebuild category index
      for (const [category, ids] of Object.entries(indexData.categories)) {
        this.categoryIndex.set(category, new Set(ids as string[]));
      }

    } catch (error) {
      // Index file doesn't exist or is corrupted, start fresh
      console.log('🧠 Starting with fresh memory index');
    }
  }

  /**
   * Save index to file
   */
  private async saveIndex(): Promise<void> {
    const indexData = {
      index: Object.fromEntries(this.index),
      tags: Object.fromEntries(
        Array.from(this.tagIndex.entries()).map(([tag, ids]) => [tag, Array.from(ids)])
      ),
      categories: Object.fromEntries(
        Array.from(this.categoryIndex.entries()).map(([cat, ids]) => [cat, Array.from(ids)])
      ),
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(this.indexFile, JSON.stringify(indexData, null, 2), 'utf8');
  }

  /**
   * Ensure memory directory exists
   */
  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.memoryDir);
    } catch {
      await fs.mkdir(this.memoryDir, { recursive: true });
    }
  }

  /**
   * Get file size
   */
  private async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  /**
   * Get current state
   */
  getState(): MemoryState {
    return { ...this.state };
  }

  /**
   * Shutdown memory engine
   */
  async shutdown(): Promise<void> {
    await this.saveIndex();
    console.log('🧠 Memory Engine shutdown');
  }
}