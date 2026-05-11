@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%frontend\backend"
set "FRONTEND=%ROOT%frontend\ui"

echo.
echo  Riesgo Crediticio TFM
echo  =====================
echo  Iniciando backend  ^(http://localhost:8000^) ...
echo  Iniciando frontend ^(http://localhost:5173^) ...
echo.

:: Abrir backend en ventana CMD separada
start "RC-Backend" cmd /k "title RC-Backend ^& cd /d "%BACKEND%" ^& python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: Dar 2 segundos para que uvicorn empiece a cargar los artefactos
timeout /t 2 /nobreak >nul

:: Abrir frontend en ventana CMD separada
start "RC-Frontend" cmd /k "title RC-Frontend ^& cd /d "%FRONTEND%" ^& npm run dev"

:: Esperar a que Vite esté listo (~5 s) antes de abrir el navegador
timeout /t 6 /nobreak >nul

echo  Abriendo http://localhost:5173 en el navegador...
start http://localhost:5173

echo.
echo  Cierra las ventanas "RC-Backend" y "RC-Frontend" para detener los servidores.
echo.
pause
endlocal
