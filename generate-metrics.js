const fs=require('fs'), path=require('path');
const dir='logs';
if (!fs.existsSync(dir)) {
  console.log(`# Aurora Core – Quick Metrics Snapshot
- Trials analyzed: 0
- Median CLI duration (ms): n/a
- Logs: (no logs directory found)

Notes:
- Device was in Airplane Mode during capture.
- This is a CLI-duration proxy; final recall latency will use real memory calls once wired.`);
  process.exit(0);
}
const files=fs.readdirSync(dir).filter(f=>f.startsWith('aurora-metrics-')).sort().slice(-3);
function parse(f){
  const t=fs.readFileSync(path.join(dir,f),'utf8');
  const m=/duration_ms:\s*(\d+)/.exec(t);
  return {file:f, ms:m?+m[1]:null};
}
const rows=files.map(parse).filter(r=>r.ms!=null);
const med=rows.map(r=>r.ms).sort((a,b)=>a-b)[Math.floor(rows.length/2)] || null;
console.log(`# Aurora Core – Quick Metrics Snapshot
- Trials analyzed: ${rows.length}
- Median CLI duration (ms): ${med===null?'n/a':med}
- Logs:
${rows.map(r=>`  - ${r.file}: ${r.ms} ms`).join('\n')}

Notes:
- Device was in Airplane Mode during capture.
- This is a CLI-duration proxy; final recall latency will use real memory calls once wired.`);