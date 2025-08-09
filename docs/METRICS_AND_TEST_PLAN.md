# Aurora Core – Metrics & Test Plan (Disruptioneering)

## Metrics (targets for pilot/demo)
- **Recall latency (recent memory)**: median < 2s
- **Sync correctness (CRDT+HLC)**: 0 unresolved conflicts across N merges
- **Offline capability**: >80% core functions available with radio off
- **Network hygiene**: 0 unsolicited outbound connections (verified)
- **Auditability**: exportable signed event log on request

## Test Procedures (quick demo level)
1. **Offline run**: enable airplane mode; start Aurora CLI; perform 3 tasks; record latency.
2. **Conflict simulation**: create two divergent states; merge; confirm CRDT convergence; record result.
3. **Network hygiene**: run CLI while `tcpdump`/`ss` captures; verify no unsolicited egress.
4. **Audit export**: trigger export; verify signature/hash present and consistent.

## Data Collection Artifacts
- `logs/aurora-metrics-*.log` (timestamped)
- Screenshots of successful runs (optional)
- Repo Guard CI result screenshot (PR fails on foreign paths/terms)

## Acceptance Snapshot for Proposal
- Provide one clean offline log with <2s recall line
- Provide one convergence log with no conflicts
- Provide one hygiene note: "no unsolicited egress observed" (capture summary)