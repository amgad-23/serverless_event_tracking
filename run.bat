                                                                                  @echo off
REM Change directory to script location
cd /d "%~dp0"

REM Check for venv folder
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate the virtual environment
call venv\Scripts\activate

REM Install backend requirements
echo Installing requirements...
pip install -r serverless_event_backend\requirements.txt

REM Start Chalice backend in new window
echo Starting Chalice backend on http://localhost:8000 ...
start "Chalice Backend" cmd /k "cd serverless_event_backend && ..\venv\Scripts\activate && chalice local --port 8000"

REM Start frontend server in new window
echo Starting frontend on http://localhost:3000 ...
start "Frontend" cmd /k "cd frontend && ..\venv\Scripts\activate && python -m http.server 3000"

REM Wait a few seconds to ensure servers are up
timeout /t 3 /nobreak >nul

REM Open backend and frontend in default browser
start http://localhost:8000/
start http://localhost:3000/

echo.
echo ==========================================
echo Both backend and frontend are now running!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo (Close their windows to stop the servers.)
echo ==========================================
pause