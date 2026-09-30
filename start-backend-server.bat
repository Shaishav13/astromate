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

:: 2. Check if Server and Ngrok are already running
echo [2/3] Checking backend and tunnel status...
powershell -Command "$srv = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue; $ng = Get-Process -Name 'ngrok' -ErrorAction SilentlyContinue; if ($srv -and $ng) { exit 2 } elseif ($srv) { exit 1 } else { exit 0 }"
set STATUS=%errorlevel%

if %STATUS% equ 2 (
    echo.
    echo ========================================================
    echo  [ALL ACTIVE] AstroMate Server ^& Ngrok Tunnel are ALREADY running!
    echo ========================================================
    echo.
    echo  Permanent Backend URL: https://baggy-tidbit-uplifted.ngrok-free.dev
    echo  Live Vercel Frontend:  https://astromate-ruby.vercel.app
    echo.
    echo  Everything is already connected and operational.
    echo  You can open the website on your phone or PC right now!
    echo.
    pause
    exit /b 0
)

if %STATUS% equ 1 (
    echo       [OK] AstroMate Server is already running on port 3001!
    echo.
    echo [3/3] Launching Public HTTPS Tunnel...
    echo.
    echo --------------------------------------------------------
    echo PERMANENT URL FOR VERCEL DEPLOYMENT:
    echo https://baggy-tidbit-uplifted.ngrok-free.dev
    echo --------------------------------------------------------
    echo.
    npm run tunnel
) else (
    echo       Starting AstroMate Server on port 3001...
    echo.
    echo [3/3] Launching Server + Fixed Public HTTPS Tunnel...
    echo.
    echo --------------------------------------------------------
    echo PERMANENT URL FOR VERCEL DEPLOYMENT:
    echo https://baggy-tidbit-uplifted.ngrok-free.dev
    echo --------------------------------------------------------
    echo.
    npm run server:tunnel
)

pause
