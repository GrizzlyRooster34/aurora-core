#!/usr/bin/env bash
set -e
TS="$(date +%Y%m%d-%H%M%S)"
LOG="logs/aurora-metrics-$TS.log"
mkdir -p logs
echo "=== AURORA METRICS RUN $TS ===" | tee -a "$LOG"
echo "device: $(uname -a)" | tee -a "$LOG"
echo "node: $(node -v 2>/dev/null || echo 'n/a')" | tee -a "$LOG"
START=$(date +%s%3N 2>/dev/null || date +%s)
npm run -s cli 2>&1 | tee -a "$LOG" || true
END=$(date +%s%3N 2>/dev/null || date +%s)
DUR=$((END-START))
echo "duration_ms: $DUR" | tee -a "$LOG"
echo "log: $LOG"