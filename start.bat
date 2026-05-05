@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ========================================
echo   Wangchu Official Site Startup
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not available in PATH.
  echo Please install Node.js first: https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm is not installed or not available in PATH.
  pause
  exit /b 1
)

if not exist "server\.env" (
  if exist "server\.env.example" (
    echo [INFO] server\.env not found. Creating it from server\.env.example...
    copy "server\.env.example" "server\.env" >nul
  ) else (
    echo [ERROR] server\.env.example not found.
    pause
    exit /b 1
  )
)

if not exist "server\data" (
  mkdir "server\data"
)

if not exist "node_modules" (
  echo [INFO] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo [INFO] Syncing database schema...
call npm --workspace server exec prisma -- db push --accept-data-loss
if errorlevel 1 (
  echo [ERROR] Database schema sync failed.
  pause
  exit /b 1
)

echo [INFO] Seeding initial data...
call npm run db:seed
if errorlevel 1 (
  echo [ERROR] Database seed failed.
  pause
  exit /b 1
)

echo.
echo ========================================
echo   Website: http://localhost:4000/
echo   Admin:   http://localhost:4000/admin
echo   API:     http://localhost:4000/api/health
echo.
echo   Default admin account is configured in server\.env
echo ========================================
echo.

call npm run dev
pause
