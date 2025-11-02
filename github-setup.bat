@echo off
REM GitHub Setup Script for ConnectHub Pro
REM Run this script after creating a repository on GitHub

echo 🚀 ConnectHub Pro - GitHub Setup
echo ================================

if "%1"=="" (
    echo ❌ Error: Please provide your GitHub repository URL
    echo Usage: github-setup.bat https://github.com/yourusername/connecthub-pro.git
    exit /b 1
)

set REPO_URL=%1

echo 📦 Setting up remote origin...
git remote add origin %REPO_URL%

echo 🔄 Pushing to GitHub...
git branch -M main
git push -u origin main

echo ✅ Success! Your ConnectHub Pro project is now on GitHub
echo 📋 Next steps:
echo    1. Go to your GitHub repository
echo    2. Enable GitHub Pages in repository settings
echo    3. Set source to 'Deploy from a branch' ^> 'main'
echo    4. Your site will be available at: https://yourusername.github.io/connecthub-pro
echo.
echo 🔗 Repository: %REPO_URL%

pause
