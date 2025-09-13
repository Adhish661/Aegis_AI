@echo off
echo Starting Aegis Unified Platform...
echo.

echo Starting Hardhat node...
start "Hardhat Node" cmd /k "cd contracts && npm run node"

echo Waiting for Hardhat to start...
timeout /t 5 /nobreak >nul

echo Deploying contracts...
cd contracts
call npm run deploy
cd ..

echo Starting Oracle service...
start "Oracle Service" cmd /k "cd oracle && npm start"

echo Waiting for Oracle to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services started!
echo.
echo Frontend: http://localhost:3000
echo Oracle API: http://localhost:3001
echo Hardhat RPC: http://localhost:8545
echo.
pause

