import {
  escapeHtml,
  validateAndEscapeXml,
  validateFileUpload,
  sanitizeInput,
  validateEmail,
  validateIBAN,
  validateBIC
} from './security';

describe('Security Utilities', () => {
  describe('escapeHtml', () => {
    test('escaped HTML-Sonderzeichen korrekt', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(escapeHtml('& < > " \'')).toBe('&amp; &lt; &gt; &quot; &#x27;');
    });

    test('lässt normale Texte unverändert', () => {
      expect(escapeHtml('Normaler Text')).toBe('Normaler Text');
      expect(escapeHtml('123')).toBe('123');
    });

    test('behandelt leere Strings korrekt', () => {
      expect(escapeHtml('')).toBe('');
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });
  });

  describe('validateAndEscapeXml', () => {
    test('validiert und escaped gültige XML-Werte', () => {
      const result = validateAndEscapeXml('Test & < > " \'');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('Test &amp; &lt; &gt; &quot; &apos;');
    });

    test('erkennt ungültige XML-Zeichen', () => {
      const result = validateAndEscapeXml('Test\x00\x01\x02');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('ungültige XML-Zeichen');
    });

    test('prüft String-Länge', () => {
      const longString = 'a'.repeat(1001);
      const result = validateAndEscapeXml(longString);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('zu lang');
    });
  });

  describe('validateFileUpload', () => {
    test('akzeptiert gültige XML-Dateien', () => {
      const file = new File(['<xml>test</xml>'], 'test.xml', { type: 'text/xml' });
      const result = validateFileUpload(file);
      expect(result.isValid).toBe(true);
    });

    test('akzeptiert gültige PDF-Dateien', () => {
      const file = new File(['%PDF-1.4'], 'test.pdf', { type: 'application/pdf' });
      const result = validateFileUpload(file);
      expect(result.isValid).toBe(true);
    });

    test('lehnt ungültige Dateitypen ab', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateFileUpload(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('nicht unterstützt');
    });

    test('prüft Dateigröße', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.xml', { type: 'text/xml' });
      const result = validateFileUpload(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('zu groß');
    });

    test('prüft Dateiname', () => {
      const file = new File(['test'], 'test<script>.xml', { type: 'text/xml' });
      const result = validateFileUpload(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('ungültige Zeichen');
    });
  });

  describe('sanitizeInput', () => {
    test('entfernt gefährliche Zeichen', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
    });

    test('lässt normale Eingaben unverändert', () => {
      expect(sanitizeInput('Normaler Text')).toBe('Normaler Text');
      expect(sanitizeInput('123-456')).toBe('123-456');
    });

    test('begrenzt String-Länge', () => {
      const longString = 'a'.repeat(1001);
      const result = sanitizeInput(longString);
      expect(result.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('validateEmail', () => {
    test('akzeptiert gültige E-Mail-Adressen', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('test@subdomain.example.org')).toBe(true);
    });

    test('lehnt ungültige E-Mail-Adressen ab', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });

    test('behandelt leere Eingaben korrekt', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validateIBAN', () => {
    test('akzeptiert gültige deutsche IBANs', () => {
      expect(validateIBAN('DE89370400440532013000')).toBe(true);
      expect(validateIBAN('DE89 3704 0044 0532 0130 00')).toBe(true);
    });

    test('lehnt ungültige IBANs ab', () => {
      expect(validateIBAN('DE123456789')).toBe(false);
      expect(validateIBAN('INVALID')).toBe(false);
      expect(validateIBAN('')).toBe(false);
    });
  });

  describe('validateBIC', () => {
    test('akzeptiert gültige BIC-Codes', () => {
      expect(validateBIC('DEUTDEFF')).toBe(true);
      expect(validateBIC('COBADEFFXXX')).toBe(true);
    });

    test('lehnt ungültige BIC-Codes ab', () => {
      expect(validateBIC('INVALID')).toBe(false);
      expect(validateBIC('DEUT')).toBe(false);
      expect(validateBIC('')).toBe(false);
    });
  });
});
