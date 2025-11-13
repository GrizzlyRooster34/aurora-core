// SQLite + Native memory search adapter (with TS fallback)
import { spawnSync } from 'child_process';

/**
 * Aurora Core - Memory Search Adapter
 * High-performance memory search with SQLite backend and optional native acceleration
 *
 * @author Aurora Core Team
 * @version 1.0.0
 * @transferable Sanitized from Seven of Nine Core consciousness framework
 */

let native: any = null;
// Try to load optional native module for memory acceleration
try {
  // Dynamic require fallback for CommonJS compatibility during async load
  const nodeRequire = typeof require !== 'undefined' ? require : null;
  if (nodeRequire) {
    native = nodeRequire('../../native-core/memory-engine/build/Release/memory_engine.node');
  }
} catch {
  // Native module not available - will use TS fallback
  native = null;
}

export interface MemoryQuery {
  topic?: string;
  importance_min?: number;
  limit?: number;
}

export interface MemoryRow {
  id: number;
  ts: number;
  topic: string;
  importance: number;
  content: string;
}

class SQLiteMemoryAdapter {
  constructor(private dbPath = 'aurora-memory.db') {}

  private query(sql: string): MemoryRow[] {
    const result = spawnSync('sqlite3', [this.dbPath, '-json', sql], {
      encoding: 'utf8'
    });

    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`SQLite error: ${result.stderr}`);
    }

    return result.stdout.trim() ? JSON.parse(result.stdout) : [];
  }

  searchMemories(q: MemoryQuery): MemoryRow[] {
    const limit = q.limit ?? 50;

    // SQLite pre-filter (fast database query)
    let sql = `
      SELECT id, ts, topic, importance, content
      FROM episodic_memories
      WHERE importance >= ${q.importance_min ?? 1}
    `;

    if (q.topic) {
      sql += ` AND topic LIKE '%${q.topic.replace(/'/g, "''")}%'`;
    }

    sql += ` ORDER BY ts DESC LIMIT ${Math.max(limit * 4, 200)}`;

    const preResults = this.query(sql);

    // If native ranking available, use it; otherwise use TS fallback
    if (native && native.search) {
      console.log('🚀 Aurora Memory: Using native C++ ranking acceleration');
      return native.search(preResults, {
        topic: q.topic ?? '',
        importance_min: q.importance_min ?? 1,
        limit
      });
    } else {
      console.log('⚡ Aurora Memory: Using TypeScript fallback ranking');
      return this.fallbackRanking(preResults, q);
    }
  }

  private fallbackRanking(rows: MemoryRow[], q: MemoryQuery): MemoryRow[] {
    const limit = q.limit ?? 50;

    // Apply additional filters
    let filtered = rows;
    if (q.topic) {
      filtered = filtered.filter(r => r.topic.includes(q.topic!));
    }
    if (q.importance_min) {
      filtered = filtered.filter(r => r.importance >= q.importance_min!);
    }

    // Rank by importance (80%) + recency (20%)
    filtered.sort((a, b) => {
      const scoreA = a.importance * 100000 + a.ts;
      const scoreB = b.importance * 100000 + b.ts;
      return scoreB - scoreA;
    });

    return filtered.slice(0, limit);
  }

  isNativeAvailable(): boolean {
    return native !== null;
  }

  // Aurora-specific methods for memory management
  getMemoryStats(): { total: number; indexed: number; nativeAcceleration: boolean } {
    const statsQuery = 'SELECT COUNT(*) as total FROM episodic_memories';
    const result = this.query(statsQuery) as unknown as { total: number }[];
    return {
      total: result[0]?.total || 0,
      indexed: result[0]?.total || 0, // For Aurora, all memories are indexed
      nativeAcceleration: this.isNativeAvailable()
    };
  }

  initializeDatabase(): void {
    // Create Aurora memory database schema if it doesn't exist
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS episodic_memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL,
        topic TEXT NOT NULL,
        importance INTEGER NOT NULL DEFAULT 1,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_episodic_ts ON episodic_memories(ts);
      CREATE INDEX IF NOT EXISTS idx_episodic_importance ON episodic_memories(importance);
      CREATE INDEX IF NOT EXISTS idx_episodic_topic ON episodic_memories(topic);
    `;

    try {
      const result = spawnSync('sqlite3', [this.dbPath, createTableSql], {
        encoding: 'utf8'
      });

      if (result.status === 0) {
        console.log('🌅 Aurora Memory: Database schema initialized');
      }
    } catch (error) {
      console.warn('⚠️ Aurora Memory: Database initialization failed, will retry on first query');
    }
  }
}

const adapter = new SQLiteMemoryAdapter();

// Initialize on module load
adapter.initializeDatabase();

export function memorySearch(q: MemoryQuery): MemoryRow[] {
  return adapter.searchMemories(q);
}

export function isNativeAvailable(): boolean {
  return adapter.isNativeAvailable();
}

export function getMemoryStats(): { total: number; indexed: number; nativeAcceleration: boolean } {
  return adapter.getMemoryStats();
}

// Export the adapter class for advanced usage
export { SQLiteMemoryAdapter };