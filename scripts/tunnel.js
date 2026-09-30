const { spawn } = require('child_process');
const fs = require('fs');

const candidatePaths = [
  'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe',
  'C:\\Program Files\\cloudflared\\cloudflared.exe',
  'cloudflared',
];

let selectedBin = null;
for (const p of candidatePaths) {
  if (p !== 'cloudflared' && fs.existsSync(p)) {
    selectedBin = p;
    break;
  }
}
if (!selectedBin) {
  selectedBin = 'cloudflared';
}

console.log(`\n\x1b[36m[AstroMate Tunnel] Launching Cloudflare Tunnel on http://localhost:3001...\x1b[0m\n`);

const child = spawn(selectedBin, ['tunnel', '--url', 'http://localhost:3001'], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (err) => {
  console.warn('[AstroMate Tunnel] Cloudflare tunnel failed, falling back to localtunnel:', err.message);
  spawn('npx', ['localtunnel', '--port', '3001'], { stdio: 'inherit', shell: true });
});
