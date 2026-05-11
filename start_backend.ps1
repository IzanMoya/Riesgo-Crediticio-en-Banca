#Requires -Version 5.1
$ErrorActionPreference = "Stop"
$BackendDir = Join-Path $PSScriptRoot "frontend\backend"

if (-not (Test-Path $BackendDir)) {
    Write-Error "No se encuentra el directorio backend: $BackendDir"
    exit 1
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python no esta en el PATH. Instalalo o activa el entorno virtual."
    exit 1
}

Write-Host ""
Write-Host "  Riesgo Crediticio TFM - Backend" -ForegroundColor Cyan
Write-Host "  Directorio : $BackendDir" -ForegroundColor DarkGray
Write-Host "  URL        : http://localhost:8000" -ForegroundColor Green
Write-Host "  Docs API   : http://localhost:8000/docs" -ForegroundColor Green
Write-Host "  Presiona Ctrl+C para detener." -ForegroundColor DarkGray
Write-Host ""

Set-Location $BackendDir
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
