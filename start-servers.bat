@echo off
echo ================================
echo Starting ConnectHub Pro Servers
echo ================================
echo.

echo Starting Backend Server (Port 3000)...
start "ConnectHub Backend" cmd /k "cd /d "%~dp0backend" && node minimal-backend.js"

timeout /t 3 >nul

echo Starting Frontend Server (Port 8080)...
start "ConnectHub Frontend" cmd /k "cd /d "%~dp0frontend-server" && node minimal-frontend.js"

timeout /t 3 >nul

echo.
echo ================================
echo Servers Starting...
echo ================================
echo Backend: http://localhost:3000/api/health
echo Frontend: http://localhost:8080/pages/homepage.html
echo.
echo Demo Accounts:
echo Business: john@brewconnect.com / password123
echo Professional: alex@example.com / password123
echo.
echo Press any key to open homepage...
pause >nul

start http://localhost:8080/pages/homepage.html
