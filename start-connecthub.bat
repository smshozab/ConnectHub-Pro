@echo off
echo ================================
echo ConnectHub Pro - Start Options
echo ================================
echo.
echo Choose how you want to run ConnectHub Pro:
echo.
echo 1. Local Demo (No server needed - works offline)
echo 2. Full Server Mode (Backend + Frontend servers)
echo 3. Server Status Check
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto local_demo
if "%choice%"=="2" goto server_mode
if "%choice%"=="3" goto status_check
if "%choice%"=="4" goto exit
goto invalid_choice

:local_demo
echo.
echo Starting Local Demo...
echo ================================
echo Opening local demo (no authentication popup)
start local-demo.html
echo.
echo ✅ Local demo opened in your browser
echo ✅ No servers needed - works completely offline
echo ✅ Demo accounts: john@brewconnect.com / password123
echo.
pause
goto end

:server_mode
echo.
echo Starting Server Mode...
echo ================================
echo Starting Backend Server (Port 3000)...
start "ConnectHub Backend" cmd /k "cd /d "%~dp0backend" && node minimal-backend.js"

timeout /t 3 >nul

echo Starting Frontend Server (Port 8080)...
start "ConnectHub Frontend" cmd /k "cd /d "%~dp0frontend-server" && node no-auth-server.js"

timeout /t 5 >nul

echo.
echo ✅ Servers starting...
echo Backend: http://localhost:3000/api/health
echo Frontend: http://localhost:8080/pages/homepage.html
echo Direct Test: http://localhost:8080/direct-test.html
echo.
echo Demo Accounts:
echo Business: john@brewconnect.com / password123
echo Professional: alex@example.com / password123
echo.
start http://localhost:8080/direct-test.html
pause
goto end

:status_check
echo.
echo Checking Server Status...
echo ================================
netstat -an | findstr :3000 >nul
if %errorlevel%==0 (
    echo ✅ Backend Server: RUNNING on port 3000
) else (
    echo ❌ Backend Server: NOT RUNNING
)

netstat -an | findstr :8080 >nul
if %errorlevel%==0 (
    echo ✅ Frontend Server: RUNNING on port 8080
) else (
    echo ❌ Frontend Server: NOT RUNNING
)
echo.
pause
goto end

:invalid_choice
echo.
echo ❌ Invalid choice. Please enter 1, 2, 3, or 4.
pause
goto end

:exit
echo.
echo Goodbye! 👋
goto end

:end
