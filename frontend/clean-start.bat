@echo off
echo Cleaning Next.js cache and build artifacts...

if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Cache cleaned successfully!
echo Starting development server...
echo.
echo IMPORTANT: After the server starts, open your browser in INCOGNITO/PRIVATE mode
echo and visit: http://localhost:3000
echo.
echo This will prevent browser cache issues.
echo.

npm run dev
