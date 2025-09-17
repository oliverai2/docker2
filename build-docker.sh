#!/bin/bash

# Build-Skript für die React-Anwendung mit Docker

set -e  # Exit bei Fehlern

echo "🚀 Starte Docker Build für E-Rechnung App..."

# Prüfe ob wir uns im richtigen Verzeichnis befinden
if [ ! -f "package.json" ]; then
    echo "❌ Fehler: package.json nicht gefunden. Stelle sicher, dass du im Projektverzeichnis bist."
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ Fehler: Dockerfile nicht gefunden."
    exit 1
fi

# Build Production Image
echo "📦 Baue Production Image..."
docker build -t e-rechnung-app:latest -f Dockerfile .

# Build Development Image (optional)
echo "🔧 Baue Development Image..."
docker build -t e-rechnung-app:dev -f Dockerfile.dev .

echo "✅ Docker Build erfolgreich abgeschlossen!"
echo ""
echo "🎉 Verfügbare Images:"
echo "   - e-rechnung-app:latest (Production)"
echo "   - e-rechnung-app:dev (Development)"
echo ""
echo "📋 Nächste Schritte:"
echo "   Production starten: docker run -p 80:80 e-rechnung-app:latest"
echo "   Development starten: docker run -p 3000:3000 e-rechnung-app:dev"
echo "   Mit docker-compose: docker-compose up"
