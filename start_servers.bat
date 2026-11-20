@echo off
title GharSeva Server Starter
echo ==============================================
echo       Starting GharSeva Full-Stack System
echo ==============================================
echo Starting MongoDB...
net start MongoDB >nul 2>&1

echo Starting Backend Server on port 5000...
start "GharSeva Backend (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"

echo Starting Frontend Server on port 5173...
start "GharSeva Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo GharSeva is now running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
