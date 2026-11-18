@echo off
cd /d "%~dp0"
start "" cmd /c "pnpm dev"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"
