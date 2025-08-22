// Sicherheits-Utilities für die E-Rechnung App

/**
 * Escaped HTML-Sonderzeichen um XSS-Angriffe zu verhindern
 * @param {string} text - Der zu escaped Text
 * @returns {string} - Der escaped Text
 */
export const escapeHtml = (text) => {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Validiert und escaped XML-Werte
 * @param {string} value - Der zu validierende Wert
 * @returns {object} - {isValid: boolean, value: string, error?: string}
 */
export const validateAndEscapeXml = (value) => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: 'Ungültiger Wert' };
  }

  // Prüfe String-Länge
  if (value.length > 1000) {
    return { isValid: false, error: 'Wert ist zu lang (max. 1000 Zeichen)' };
  }

  // Prüfe auf ungültige XML-Zeichen
  const invalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
  if (invalidChars.test(value)) {
    return { isValid: false, error: 'Wert enthält ungültige XML-Zeichen' };
  }

  // Escape XML-Sonderzeichen
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  return { isValid: true, value: escaped };
};

/**
 * Validiert Datei-Uploads
 * @param {File} file - Die zu validierende Datei
 * @returns {object} - {isValid: boolean, error?: string}
 */
export const validateFileUpload = (file) => {
  if (!file) {
    return { isValid: false, error: 'Keine Datei ausgewählt' };
  }

  // Prüfe Dateityp
  const allowedTypes = ['text/xml', 'application/xml', 'application/pdf'];
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  const isXmlFile = fileType === 'text/xml' || 
                    fileType === 'application/xml' || 
                    fileName.endsWith('.xml');
  const isPdfFile = fileType === 'application/pdf' || 
                    fileName.endsWith('.pdf');

  if (!isXmlFile && !isPdfFile) {
    return { isValid: false, error: 'Dateityp nicht unterstützt (nur XML und PDF)' };
  }

  // Prüfe Dateigröße (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'Datei ist zu groß (max. 5MB)' };
  }

  // Prüfe Dateiname auf gefährliche Zeichen
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (dangerousChars.test(file.name)) {
    return { isValid: false, error: 'Dateiname enthält ungültige Zeichen' };
  }

  return { isValid: true };
};

/**
 * Sanitized Benutzer-Eingaben
 * @param {string} input - Die zu sanitizierende Eingabe
 * @returns {string} - Die sanitizierte Eingabe
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Entferne gefährliche Zeichen und Scripts
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Begrenze Länge
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000);
  }
  
  return sanitized;
};

/**
 * Validiert E-Mail-Adressen
 * @param {string} email - Die zu validierende E-Mail
 * @returns {boolean} - true wenn gültig
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validiert deutsche IBANs
 * @param {string} iban - Die zu validierende IBAN
 * @returns {boolean} - true wenn gültig
 */
export const validateIBAN = (iban) => {
  if (!iban || typeof iban !== 'string') return false;
  
  // Entferne Leerzeichen
  const cleanIban = iban.replace(/\s/g, '');
  
  // Deutsche IBAN: DE + 2 Prüfziffern + 8 Bankleitzahl + 10 Kontonummer
  const germanIbanRegex = /^DE\d{20}$/;
  
  if (!germanIbanRegex.test(cleanIban)) return false;
  
  // Einfache Prüfziffern-Validierung (vereinfacht)
  const bankCode = cleanIban.substring(4, 12);
  const accountNumber = cleanIban.substring(12);
  
  return /^\d{8}$/.test(bankCode) && /^\d{10}$/.test(accountNumber);
};

/**
 * Validiert BIC/SWIFT-Codes
 * @param {string} bic - Der zu validierende BIC
 * @returns {boolean} - true wenn gültig
 */
export const validateBIC = (bic) => {
  if (!bic || typeof bic !== 'string') return false;
  
  // BIC Format: 4 Buchstaben (Bank) + 2 Buchstaben (Land) + 2 Buchstaben/Ziffern (Ort) + 3 Buchstaben/Ziffern (Branch, optional)
  const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  
  return bicRegex.test(bic.toUpperCase());
};
