#!/usr/bin/env bash
set -e
TS="$(date +%Y%m%d-%H%M%S)"
LOG="logs/aurora-capability-$TS.log"
mkdir -p logs
echo "=== AURORA CAPABILITY SWEEP $TS ===" | tee -a "$LOG"
echo "device: $(uname -a)" | tee -a "$LOG"
echo "node: $(node -v 2>/dev/null || echo 'n/a')" | tee -a "$LOG"
# Lightweight inventory for Aurora repo
for d in "src" "core" "interfaces" "modules" "docs"; do
  if [ -d "$d" ]; then
    CNT=$(find "$d" -type f | wc -l | tr -d ' ')
    echo "inventory:$d:$CNT files" | tee -a "$LOG"
  fi
done
# CLI timing test
echo "--- CLI test ---" | tee -a "$LOG"
START=$(date +%s%3N 2>/dev/null || date +%s)
npm run -s aurora-cli 2>&1 | tee -a "$LOG" || npx ts-node examples/aurora-cli.ts 2>&1 | tee -a "$LOG" || true
END=$(date +%s%3N 2>/dev/null || date +%s)
DUR=$((END-START))
echo "cli_duration_ms: $DUR" | tee -a "$LOG"
echo "log: $LOG"