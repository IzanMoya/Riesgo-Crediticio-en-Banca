#Requires -Version 5.1
$ErrorActionPreference = "Stop"
$FrontendDir = Join-Path $PSScriptRoot "frontend\ui"

if (-not (Test-Path $FrontendDir)) {
    Write-Error "No se encuentra el directorio frontend: $FrontendDir"
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm no esta en el PATH. Instala Node.js 22+."
    exit 1
}

if (-not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Host "  node_modules no encontrado. Ejecutando npm install..." -ForegroundColor Yellow
    Set-Location $FrontendDir
    npm install
}

Write-Host ""
Write-Host "  Riesgo Crediticio TFM - Frontend" -ForegroundColor Cyan
Write-Host "  Directorio : $FrontendDir" -ForegroundColor DarkGray
Write-Host "  URL        : http://localhost:5173" -ForegroundColor Green
Write-Host "  Presiona Ctrl+C para detener." -ForegroundColor DarkGray
Write-Host ""

Set-Location $FrontendDir
npm run dev
