# Sicherheitsrichtlinien für E-Rechnung App

## Sicherheits-Scanning mit Snyk

### Installation
```bash
npm install -g snyk
```

### Authentifizierung
```bash
snyk auth
```

### Sicherheits-Audit durchführen
```bash
# Vollständiger Sicherheits-Scan
npm run security:audit

# Oder direkt mit Snyk
snyk test

# Monitoring aktivieren
npm run security:monitor
```

### Automatische Fixes
```bash
npm run security:fix
```

## Code-Qualitäts-Analyse mit SonarQube

### Voraussetzungen
- SonarQube Server installiert und konfiguriert
- SonarScanner installiert

### Installation SonarScanner
```bash
# Windows
# Download von: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

# Linux/macOS
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747-linux.zip
unzip sonar-scanner-cli-4.7.0.2747-linux.zip
export PATH=$PATH:./sonar-scanner-4.7.0.2747-linux/bin
```

### Code-Qualitäts-Analyse durchführen
```bash
npm run code:quality
```

### Manuelle Konfiguration
```bash
# SonarQube Server URL setzen
export SONAR_HOST_URL=http://localhost:9000

# Token setzen (aus SonarQube UI)
export SONAR_TOKEN=your-sonar-token

# Analyse starten
sonar-scanner
```

## Code-Qualitäts-Tools

### ESLint
```bash
# Code-Linting
npm run code:lint

# Automatische Fixes
npx eslint src --ext .js,.jsx --fix
```

### Prettier
```bash
# Code-Formatierung
npm run code:format

# Formatierung prüfen
npx prettier --check src/**/*.{js,jsx}
```

### Test Coverage
```bash
# Test-Coverage generieren
npm run test:coverage
```

## Pre-Commit Hooks

### Husky Setup (optional)
```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run precommit"
```

### Pre-Commit Validierung
```bash
npm run precommit
```

## Sicherheits-Checkliste

### Vor jedem Commit
- [ ] `npm run security:audit` - Keine kritischen Schwachstellen
- [ ] `npm run code:lint` - Keine Linting-Fehler
- [ ] `npm run code:format` - Code formatiert
- [ ] Tests laufen durch

### Vor jedem Release
- [ ] Vollständiger Snyk-Scan
- [ ] SonarQube-Analyse
- [ ] Test-Coverage > 80%
- [ ] Sicherheits-Review durchgeführt

## Bekannte Sicherheitsmaßnahmen

### Implementierte Sicherheitsfeatures
- ✅ HTML-Escaping für alle Benutzer-Eingaben
- ✅ XML-Validierung und Escaping
- ✅ Sichere Datei-Upload-Validierung
- ✅ Input-Sanitization
- ✅ E-Mail-Validierung
- ✅ IBAN/BIC-Validierung
- ✅ Zentrale Error-Behandlung
- ✅ XSS-Schutz

### Zu beachtende Sicherheitsaspekte
- 🔒 Alle Benutzer-Eingaben werden validiert und escaped
- 🔒 Datei-Uploads sind auf XML-Dateien beschränkt
- 🔒 Maximale Dateigröße: 5MB
- 🔒 String-Längen sind begrenzt (1000 Zeichen)
- 🔒 Keine eval() oder ähnliche gefährliche Funktionen
- 🔒 Zentrale Error-Behandlung ohne Informationslecks

## Troubleshooting

### Snyk-Probleme
```bash
# Cache leeren
snyk test --clear-cache

# Debug-Modus
snyk test --debug
```

### SonarQube-Probleme
```bash
# Logs prüfen
tail -f .scannerwork/report-task.txt

# Manuelle Analyse
sonar-scanner -Dsonar.host.url=http://localhost:9000
```

## Support

Bei Sicherheitsproblemen oder Fragen:
1. Snyk-Dokumentation: https://docs.snyk.io/
2. SonarQube-Dokumentation: https://docs.sonarqube.org/
3. Projekt-Issues: GitHub Issues
