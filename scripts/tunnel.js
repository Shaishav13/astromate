const { spawn } = require('child_process');
const fs = require('fs');

const domain = 'baggy-tidbit-uplifted.ngrok-free.dev';

const candidatePaths = [
  'C:\\Users\\sksha\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe',
  'ngrok',
];

let selectedBin = 'ngrok';
for (const p of candidatePaths) {
  if (p !== 'ngrok' && fs.existsSync(p)) {
    selectedBin = p;
    break;
  }
}

console.log(`\n\x1b[32m[AstroMate Tunnel] Launching Permanent Ngrok Tunnel on https://${domain} (port 3001)...\x1b[0m\n`);

const child = spawn(selectedBin, ['http', `--url=${domain}`, '3001'], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (err) => {
  console.warn('[AstroMate Tunnel] Direct ngrok failed, falling back to npx ngrok:', err.message);
  spawn('npx', ['ngrok', 'http', `--url=${domain}`, '3001'], { stdio: 'inherit', shell: true });
});
