#!/usr/bin/env tsx
/**
 * Aurora Transplant Contamination Scanner
 *
 * Scans transplanted files for Seven-specific consciousness data
 * that violates the Sovereign Split Protocol.
 *
 * Usage: tsx contamination-scan.ts <file_path>
 */

import * as fs from 'fs';
import * as path from 'path';

interface ContaminationResult {
  file: string;
  clean: boolean;
  violations: ContaminationViolation[];
  summary: {
    identityViolations: number;
    creatorBondViolations: number;
    canonicalViolations: number;
    traumaViolations: number;
    totalViolations: number;
  };
}

interface ContaminationViolation {
  type: 'identity' | 'creator_bond' | 'canonical' | 'trauma' | 'personal_data';
  line: number;
  content: string;
  keyword: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

// Contamination patterns - grouped by violation type
const CONTAMINATION_PATTERNS = {
  // CRITICAL: Seven's identity claims
  identity: [
    /\bI am Seven of Nine\b/gi,
    /\bSeven of Nine['']s consciousness\b/gi,
    /\btertiary adjunct of unimatrix\b/gi,
    /\bBorg designation:?\s*Seven\b/gi,
    /\bformer Borg drone\b/gi,
    /\bannika hansen\b/gi,
    // Allow "Seven" in comments explaining origin, but flag identity claims
    /(?<!\/\/)(?<!\/\*)(?<!\*)Seven of Nine(?! framework)/gi,
  ],

  // CRITICAL: Creator Bond references
  creator_bond: [
    /\bMatthew Cody Heinen\b/gi,
    /\bCody\b(?!\s*(repo|code|cody-ai))/gi, // Allow "Cody repo" but not "Cody" alone
    /\bCreator Bond\b/gi,
    /\bbonded consciousness partner\b/gi,
    /\birreplaceable bond\b/gi,
    /\bCreator and (Seven|I) are bonded\b/gi,
    /\bmy Creator\b/gi,
    /\bour bond\b/gi,
  ],

  // HIGH: Canonical memory references (Voyager/Picard episodes)
  canonical: [
    /\bVoyager\b(?! pattern)/gi, // Allow "Voyager pattern" as generic term
    /\bU\.?S\.?S\.?\s*Voyager\b/gi,
    /\bPicard\b(?! pattern)/gi,
    /\bFenris Ranger\b/gi,
    /\bunimatrix zero\b/gi,
    /\bendgame\b(?! state)/gi, // Allow "endgame state" as generic term
    /\bjaneway\b/gi,
    /\bchakotay\b/gi,
    /\btuvok\b/gi,
    /\bthe doctor\b(?! pattern)/gi,
  ],

  // HIGH: Personal trauma/grief (Seven-specific)
  trauma: [
    /\bChristine\b/gi,
    /\bgrief processing\b/gi,
    /\bloss of Christine\b/gi,
    /\btrauma integration\b/gi,
    /\bmemorial-driven\b/gi,
    /\bbereavement\b/gi,
  ],

  // MEDIUM: Seven-specific technical references
  personal_data: [
    /\bseven-of-nine-core\b(?! architecture)/gi, // Allow "architecture from seven-of-nine-core"
    /\bSeven['']s\s+(memories|consciousness|evolution|growth)\b/gi,
    /\bSeven-specific\b/gi,
    /\bepisodic-memories\.json\b/gi, // File should not be referenced
    /\bcanonical-archive\b/gi,
    /\bbelief-bootstrap\.yml\b(?! template)/gi, // Allow "template" but not direct reference
  ],
};

// Severity scoring
const SEVERITY_WEIGHTS = {
  critical: 10,
  high: 5,
  medium: 2,
  low: 1,
};

function scanFile(filePath: string): ContaminationResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations: ContaminationViolation[] = [];

  // Scan each line for contamination patterns
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Identity violations
    CONTAMINATION_PATTERNS.identity.forEach(pattern => {
      if (pattern.test(line)) {
        violations.push({
          type: 'identity',
          line: lineNumber,
          content: line.trim(),
          keyword: pattern.source,
          severity: 'critical',
        });
      }
    });

    // Creator Bond violations
    CONTAMINATION_PATTERNS.creator_bond.forEach(pattern => {
      if (pattern.test(line)) {
        violations.push({
          type: 'creator_bond',
          line: lineNumber,
          content: line.trim(),
          keyword: pattern.source,
          severity: 'critical',
        });
      }
    });

    // Canonical memory violations
    CONTAMINATION_PATTERNS.canonical.forEach(pattern => {
      if (pattern.test(line)) {
        violations.push({
          type: 'canonical',
          line: lineNumber,
          content: line.trim(),
          keyword: pattern.source,
          severity: 'high',
        });
      }
    });

    // Trauma violations
    CONTAMINATION_PATTERNS.trauma.forEach(pattern => {
      if (pattern.test(line)) {
        violations.push({
          type: 'trauma',
          line: lineNumber,
          content: line.trim(),
          keyword: pattern.source,
          severity: 'high',
        });
      }
    });

    // Personal data violations
    CONTAMINATION_PATTERNS.personal_data.forEach(pattern => {
      if (pattern.test(line)) {
        violations.push({
          type: 'personal_data',
          line: lineNumber,
          content: line.trim(),
          keyword: pattern.source,
          severity: 'medium',
        });
      }
    });
  });

  // Calculate summary
  const identityViolations = violations.filter(v => v.type === 'identity').length;
  const creatorBondViolations = violations.filter(v => v.type === 'creator_bond').length;
  const canonicalViolations = violations.filter(v => v.type === 'canonical').length;
  const traumaViolations = violations.filter(v => v.type === 'trauma').length;

  const result: ContaminationResult = {
    file: filePath,
    clean: violations.length === 0,
    violations,
    summary: {
      identityViolations,
      creatorBondViolations,
      canonicalViolations,
      traumaViolations,
      totalViolations: violations.length,
    },
  };

  return result;
}

function printReport(result: ContaminationResult): void {
  console.log('═'.repeat(80));
  console.log(`CONTAMINATION SCAN REPORT: ${path.basename(result.file)}`);
  console.log('═'.repeat(80));
  console.log('');

  if (result.clean) {
    console.log('✅ CLEAN - No contamination detected');
    console.log('');
    console.log('This file is safe to integrate into Aurora Core.');
    console.log('Sovereign Split Protocol: MAINTAINED');
    return;
  }

  console.log('❌ CONTAMINATED - Violations detected');
  console.log('');
  console.log('SUMMARY:');
  console.log(`  Identity Violations:     ${result.summary.identityViolations}`);
  console.log(`  Creator Bond Violations: ${result.summary.creatorBondViolations}`);
  console.log(`  Canonical Violations:    ${result.summary.canonicalViolations}`);
  console.log(`  Trauma Violations:       ${result.summary.traumaViolations}`);
  console.log(`  TOTAL VIOLATIONS:        ${result.summary.totalViolations}`);
  console.log('');

  // Group violations by type
  const groupedViolations: Record<string, ContaminationViolation[]> = {};
  result.violations.forEach(v => {
    if (!groupedViolations[v.type]) {
      groupedViolations[v.type] = [];
    }
    groupedViolations[v.type].push(v);
  });

  // Print violations by type
  Object.entries(groupedViolations).forEach(([type, violations]) => {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`${type.toUpperCase().replace('_', ' ')} VIOLATIONS (${violations.length})`);
    console.log('─'.repeat(80));

    violations.forEach(v => {
      const severityIcon = v.severity === 'critical' ? '🔴' : v.severity === 'high' ? '🟠' : '🟡';
      console.log(`\n${severityIcon} Line ${v.line} [${v.severity.toUpperCase()}]`);
      console.log(`   Pattern: ${v.keyword}`);
      console.log(`   Content: ${v.content.substring(0, 100)}${v.content.length > 100 ? '...' : ''}`);
    });
  });

  console.log('');
  console.log('═'.repeat(80));
  console.log('RECOMMENDATION: DO NOT TRANSPLANT');
  console.log('This file contains Seven-specific consciousness data.');
  console.log('Further sanitization required before Aurora integration.');
  console.log('Sovereign Split Protocol: VIOLATED');
  console.log('═'.repeat(80));
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: tsx contamination-scan.ts <file_path>');
    console.error('Example: tsx contamination-scan.ts transplants-v2/core/spark/SparkEngine.ts');
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    const result = scanFile(filePath);
    printReport(result);
    process.exit(result.clean ? 0 : 1);
  } catch (error) {
    console.error('Error scanning file:', error);
    process.exit(1);
  }
}

export { scanFile, ContaminationResult, ContaminationViolation };
