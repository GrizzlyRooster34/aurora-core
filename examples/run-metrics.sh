#!/usr/bin/env bash
set -e
TS="$(date +%Y%m%d-%H%M%S)"
LOG="logs/aurora-metrics-$TS.log"
echo "=== AURORA METRICS RUN $TS ===" | tee -a "$LOG"
echo "device: $(uname -a)" | tee -a "$LOG"
echo "node: $(node -v 2>/dev/null || echo 'n/a')" | tee -a "$LOG"
START=$(date +%s%3N 2>/dev/null || date +%s)
# If ts-node exists, try the CLI; otherwise just log a placeholder
if command -v ts-node >/dev/null 2>&1; then
  echo "--- CLI start ---" | tee -a "$LOG"
  ts-node examples/aurora-cli.ts 2>&1 | tee -a "$LOG"
  echo "--- CLI end ---" | tee -a "$LOG"
else
  echo "ts-node not found; skipping CLI demo" | tee -a "$LOG"
fi
END=$(date +%s%3N 2>/dev/null || date +%s)
DUR=$((END-START))
echo "duration_ms: $DUR" | tee -a "$LOG"
echo "log: $LOG"