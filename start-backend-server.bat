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

:: 2. Check if Server is already running on port 3001
echo [2/3] Checking port 3001...
powershell -Command "$c = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue; if ($c) { exit 0 } else { exit 1 }"
if %errorlevel% equ 0 (
    echo       [OK] AstroMate Server is already running on port 3001!
    echo.
    echo [3/3] Launching Public HTTPS Tunnel...
    echo.
    echo --------------------------------------------------------
    echo PERMANENT URL FOR VERCEL DEPLOYMENT:
    echo Your backend has a fixed permanent link:
    echo https://astromate-shaishav-api.loca.lt
    echo.
    echo In Vercel -^> Project Settings -^> Environment Variables:
    echo   Key:   NEXT_PUBLIC_SERVER_URL
    echo   Value: https://astromate-shaishav-api.loca.lt
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
    echo Your backend has a fixed permanent link:
    echo https://astromate-shaishav-api.loca.lt
    echo.
    echo In Vercel -^> Project Settings -^> Environment Variables:
    echo   Key:   NEXT_PUBLIC_SERVER_URL
    echo   Value: https://astromate-shaishav-api.loca.lt
    echo --------------------------------------------------------
    echo.
    npm run server:tunnel
)

pause
