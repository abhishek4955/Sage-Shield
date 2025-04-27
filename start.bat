@echo off
echo Starting Sage Shield...

REM Activate virtual environment
call .venv\Scripts\activate

REM Start backend server
echo Starting backend server...
start cmd /k "call .venv\Scripts\activate && cd ddos_backend && python app.py"

REM Start frontend server
echo Starting frontend server...
start cmd /k "cd frontend && npm run dev"

echo Sage Shield is starting up...
echo Backend will be available at http://localhost:5000
echo Frontend will be available at http://localhost:5173
echo.
echo Press any key to close all servers...
pause >nul

REM Kill all node and python processes started by this script
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1 