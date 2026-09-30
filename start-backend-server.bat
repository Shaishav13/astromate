@echo off
title AstroMate - Local Backend & Model Server
color 0b

echo ========================================================
echo        ASTROMATE LOCAL BACKEND & MODEL SERVER
echo ========================================================
echo.

:: 1. Check Ollama
echo [1/3] Verifying Local Ollama Engine (port 11434)...
powershell -Command "$r = try { (Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -UseBasicParsing -TimeoutSec 2).StatusCode } catch { 0 }; if ($r -eq 200) { exit 0 } else { exit 1 }"
if %errorlevel% equ 0 (
    echo       [OK] Ollama is active and ready.
) else (
    echo       [WARN] Ollama is not running on port 11434!
    echo       Please make sure Ollama is open in your taskbar or run 'ollama serve' in another terminal.
    echo.
)

:: 2. Start Backend & Tunnel
echo.
echo [2/3] Starting AstroMate Express Server (port 3001)...
echo [3/3] Launching Secure HTTPS Tunnel (Cloudflare)...
echo.
echo --------------------------------------------------------
echo NOTE FOR VERCEL DEPLOYMENT:
echo Look for the public HTTPS URL displayed below by the tunnel.
echo (It will look like: https://xxxx.trycloudflare.com)
echo.
echo Copy that HTTPS URL and set it in your Vercel Dashboard:
echo Project Settings -^> Environment Variables:
echo Key:   NEXT_PUBLIC_SERVER_URL
echo Value: https://xxxx.trycloudflare.com
echo --------------------------------------------------------
echo.

npm run server:tunnel
pause
