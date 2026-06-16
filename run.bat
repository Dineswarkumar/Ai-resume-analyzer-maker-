@echo off
title AI Resume Maker - Launcher
color 0A
echo.
echo  ============================================
echo    AI Resume Maker - Starting Services
echo  ============================================
echo.

:: Kill any existing processes on port 8000
echo [1/3] Clearing port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
)

:: Start Backend using python -m uvicorn (no PATH issues)
echo [2/3] Starting FastAPI backend on http://localhost:8000 ...
start "ResumeAI Backend" cmd /k "cd /d "%~dp0backend" && echo Starting backend... && python -m uvicorn main:app --reload --port 8000"

:: Wait a moment for backend to initialize
timeout /t 4 /nobreak >nul

:: Start Frontend
echo [3/3] Starting React frontend on http://localhost:5173 ...
start "ResumeAI Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo  ============================================
echo   OPEN: http://localhost:5173
echo   API:  http://localhost:8000/docs
echo  ============================================
echo.
echo  Close the two terminal windows to stop.
pause
