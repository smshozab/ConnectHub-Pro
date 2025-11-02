@echo off
echo ================================
echo ConnectHub Pro Server Status
echo ================================
echo.

echo Checking processes...
netstat -an | findstr :3000 >nul
if %errorlevel%==0 (
    echo ✅ Backend Server: RUNNING on port 3000
    echo    URL: http://localhost:3000/api/health
) else (
    echo ❌ Backend Server: NOT RUNNING
    echo    To start: cd backend ^&^& node minimal-backend.js
)

netstat -an | findstr :8080 >nul
if %errorlevel%==0 (
    echo ✅ Frontend Server: RUNNING on port 8080
    echo    URL: http://localhost:8080/pages/homepage.html
) else (
    echo ❌ Frontend Server: NOT RUNNING
    echo    To start: cd frontend-server ^&^& node minimal-frontend.js
)

echo.
echo ================================
echo Quick Access Links:
echo ================================
echo 🏠 Homepage: http://localhost:8080/pages/homepage.html
echo 🧪 Auth Test: http://localhost:8080/test-auth.html
echo 📊 Server Status: http://localhost:8080/server-status.html
echo 🔌 API Health: http://localhost:3000/api/health
echo.
echo ================================
echo Demo Accounts:
echo ================================
echo Business: john@brewconnect.com / password123
echo Professional: alex@example.com / password123
echo.

pause
