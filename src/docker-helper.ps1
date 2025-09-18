# Docker Helper Script für PowerShell
# Dieses Script behebt die Syntax-Probleme bei der Befehlsverkettung

param(
    [Parameter(Mandatory=$true)]
    [string]$Action
)

function Start-DevContainer {
    Write-Host "Starte Development Container..." -ForegroundColor Green
    docker-compose up dev
}

function Stop-DevContainer {
    Write-Host "Stoppe Development Container..." -ForegroundColor Yellow
    docker-compose down
}

function Get-ContainerStatus {
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "Docker Container Details:" -ForegroundColor Cyan
    docker ps --filter "name=xrechnung-app"
}

function Start-DevContainerBackground {
    Write-Host "Starte Development Container im Hintergrund..." -ForegroundColor Green
    docker-compose up -d dev
    Start-Sleep 3
    Get-ContainerStatus
}

function Show-Logs {
    Write-Host "Container Logs:" -ForegroundColor Cyan
    docker-compose logs dev
}

function Restart-DevContainer {
    Write-Host "Starte Development Container neu..." -ForegroundColor Yellow
    docker-compose restart dev
    Start-Sleep 3
    Get-ContainerStatus
}

switch ($Action.ToLower()) {
    "start" { Start-DevContainer }
    "start-bg" { Start-DevContainerBackground }
    "stop" { Stop-DevContainer }
    "status" { Get-ContainerStatus }
    "logs" { Show-Logs }
    "restart" { Restart-DevContainer }
    default {
        Write-Host "Verwendung: .\docker-helper.ps1 [start|start-bg|stop|status|logs|restart]" -ForegroundColor Red
        Write-Host ""
        Write-Host "Verfügbare Aktionen:" -ForegroundColor White
        Write-Host "  start     - Startet den Dev-Container im Vordergrund" -ForegroundColor Gray
        Write-Host "  start-bg  - Startet den Dev-Container im Hintergrund" -ForegroundColor Gray
        Write-Host "  stop      - Stoppt den Dev-Container" -ForegroundColor Gray
        Write-Host "  status    - Zeigt den Status der Container" -ForegroundColor Gray
        Write-Host "  logs      - Zeigt die Container-Logs" -ForegroundColor Gray
        Write-Host "  restart   - Startet den Dev-Container neu" -ForegroundColor Gray
    }
}
