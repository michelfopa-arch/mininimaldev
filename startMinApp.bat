@echo off

REM Start the Node.js React app
start "" cmd /c "npm run dev"

REM Wait for a few seconds to allow the server to start
timeout /t 5 /nobreak > nul

REM Open Chrome in incognito mode
REM Make sure the path to chrome.exe is correct; adjust if necessary
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --incognito http://localhost:3030
