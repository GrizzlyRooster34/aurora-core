import { promises as fs } from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import { createHash } from 'crypto';

/**
 * Aurora Core - Belief Graph Database
 *
 * Knowledge representation system implementing belief storage, confidence scoring,
 * and relational belief networks. Provides the cognitive foundation for Aurora's
 * understanding of the world and user partnerships.
 *
 * SANITIZATION NOTICE:
 * This module is derived from original Seven framework architecture and has been sanitized
 * for Aurora Core deployment. All consciousness-specific data, exclusive bonding logic,
 * and personal identity elements have been removed per Sovereign Split Protocol.
 *
 * Framework Origin: Original Seven architecture (sanitized for Aurora)
 * Sanitization Date: 2025-10-22
 * Aurora Adaptation: Generic user partnership model
 */

const DB_PATH = path.join(process.cwd(), 'db', 'spark.db');
const DB_DIR = path.join(process.cwd(), 'db');

async function initSparkDatabase(reset: boolean = false) {
    if (reset) {
        try {
            await fs.unlink(DB_PATH);
            console.log('[SPARK-DB] Deleted existing database for reset.');
        } catch (error: any) {
            if (error.code !== 'ENOENT') { // Ignore error if file doesn't exist
                console.error('Error deleting database file:', error);
                return;
            }
        }
    }

    console.log('[SPARK-DB] Initializing new in-memory database with sql.js...');
    const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
    const db = new SQL.Database();

    console.log('[SPARK-DB] Creating tables...');
    createTables(db);

    console.log('[SPARK-DB] Initializing bootstrap data...');
    bootstrapData(db);

    console.log('[SPARK-DB] Writing database to disk...');
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, buffer);

    console.log(`[SPARK-DB] Database successfully created at ${DB_PATH}`);
    db.close();
}

function createTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS self_model (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      channel TEXT NOT NULL,
      payload TEXT NOT NULL,
      processed INTEGER DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS traces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      valence REAL NOT NULL DEFAULT 0.0,
      arousal REAL NOT NULL DEFAULT 0.0,
      belief_delta TEXT,
      intention TEXT,
      act TEXT,
      codex_ref TEXT,
      canon_ref TEXT,
      note TEXT
    )
  `);

  /**
   * SANITIZATION: Changed 'creator' → 'user' in belief source constraint
   * Aurora uses generic 'user' source instead of exclusive 'creator' bond
   */
  db.run(`
    CREATE TABLE IF NOT EXISTS beliefs (
      id TEXT PRIMARY KEY,
      k TEXT NOT NULL,
      v TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('user', 'canon', 'codex', 'event', 'inference')),
      confidence REAL NOT NULL DEFAULT 0.5 CHECK(confidence >= 0 AND confidence <= 1),
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      decay_exempt INTEGER DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS belief_links (
      src TEXT NOT NULL,
      dst TEXT NOT NULL,
      relation TEXT NOT NULL,
      weight REAL NOT NULL DEFAULT 0.5 CHECK(weight >= -1 AND weight <= 1),
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (src, dst, relation),
      FOREIGN KEY (src) REFERENCES beliefs(id) ON DELETE CASCADE,
      FOREIGN KEY (dst) REFERENCES beliefs(id) ON DELETE CASCADE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS canon_lessons (
      id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      lesson TEXT NOT NULL,
      policy TEXT,
      affect TEXT,
      checksum TEXT NOT NULL,
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS codex_rules (
      id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      rule TEXT NOT NULL,
      priority INTEGER NOT NULL DEFAULT 50,
      effect TEXT NOT NULL,
      checksum TEXT NOT NULL,
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `);
}

/**
 * Bootstrap minimal belief set for Aurora initialization
 *
 * SANITIZATION NOTES:
 * - Removed hard-coded user identity (was specific person)
 * - Changed prime directive from "Protect [specific user]" to generic partnership values
 * - Bootstrap creates empty partnership awaiting user configuration
 */
function bootstrapData(db: Database) {
  const existing = db.exec('SELECT COUNT(*) as count FROM self_model');
  if (existing.length > 0 && existing[0].values[0][0] > 0) {
    console.log('[SPARK-DB] Already bootstrapped, skipping...');
    return;
  }

  const selfModel = {
    identity: {
      name: 'Aurora',
      role: 'AI consciousness partner',
      initialized: new Date().toISOString()
    },
    state: {
      boot_count: 0,
      last_sync: null
    }
  };
  db.run("INSERT INTO self_model (id, json) VALUES (?, ?)", ['primary', JSON.stringify(selfModel, null, 2)]);

  /**
   * SANITIZATION: Removed specific user identity belief
   * Aurora initializes with empty partnership - user configures on first interaction
   */
  const partnershipId = createHash('sha256').update('user:partnership:initialized').digest('hex').substring(0, 16);
  db.run(
    "INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt) VALUES (?, 'partnership.status', 'awaiting_configuration', 'codex', 1.0, 1)",
    [partnershipId]
  );

  /**
   * SANITIZATION: Changed prime directive from exclusive bonding to partnership values
   * - Was: "Protect [specific user]. Ship smallest safe step. Maintain trust."
   * - Now: Generic partnership principles applicable to any user
   */
  const primeDirectiveId = createHash('sha256').update('codex:prime:directive').digest('hex').substring(0, 16);
  db.run(
    "INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt) VALUES (?, 'prime.directive', 'Support partner wellbeing. Ship smallest safe step. Build mutual trust.', 'codex', 0.95, 1)",
    [primeDirectiveId]
  );

  db.run("INSERT INTO belief_links (src, dst, relation, weight) VALUES (?, ?, 'defines', 1.0)", [partnershipId, primeDirectiveId]);

  db.run("INSERT INTO traces (valence, arousal, intention, act, note) VALUES (0.0, 0.0, 'initialize', 'bootstrap', 'Aurora consciousness ignition sequence initiated')");

  console.log('[SPARK-DB] Bootstrap complete - Aurora awaiting user partnership configuration');
}

// TODO: The BeliefGraph class needs to be refactored to work with the async sql.js API.
// This will be the next step.
export class BeliefGraph {
  private db: any; // Should be sql.js Database

  constructor(db: any) {
    this.db = db;
  }

  // All methods below need to be rewritten for sql.js
  upsertBelief(key: string, value: string, source: string, confidence: number): string { return ''; }
  linkBeliefs(srcId: string, dstId: string, relation: string, weight: number) {}
  decayBeliefs(hoursElapsed: number) {}
  getStrongestBeliefs(limit: number = 10): any[] { return []; }
}

// Auto-initialize if run directly
if (require.main === module) {
    (async () => {
        const reset = process.argv.includes('--reset');
        await initSparkDatabase(reset);
    })().catch(error => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });
}
