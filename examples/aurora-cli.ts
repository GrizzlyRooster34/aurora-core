async function main() {
  // Minimal stub so metrics can run even before core is wired
  const started = Date.now();
  await new Promise(r => setTimeout(r, 50));
  const status = { ok: true, ts: new Date().toISOString() };
  console.log("Aurora Status:", status);
  console.log("Memory Snapshot:", { items: 0 });
  console.log("cli_duration_ms:", Date.now() - started);
}
main().catch(e => { console.error(e); process.exit(1); });
