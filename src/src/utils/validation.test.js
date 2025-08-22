import {
  VALIDATION_CONSTANTS,
  validators,
  validateFormData,
  validateDateRange
} from './validation';

describe('Validation Utilities', () => {
  describe('VALIDATION_CONSTANTS', () => {
    test('enthält alle erforderlichen Konstanten', () => {
      expect(VALIDATION_CONSTANTS).toHaveProperty('MAX_STRING_LENGTH');
      expect(VALIDATION_CONSTANTS).toHaveProperty('MAX_FILE_SIZE');
      expect(VALIDATION_CONSTANTS).toHaveProperty('ALLOWED_FILE_TYPES');
      expect(VALIDATION_CONSTANTS).toHaveProperty('POSTAL_CODE_PATTERN');
      expect(VALIDATION_CONSTANTS).toHaveProperty('PHONE_PATTERN');
    });

    test('hat korrekte Werte', () => {
      expect(VALIDATION_CONSTANTS.MAX_STRING_LENGTH).toBe(1000);
      expect(VALIDATION_CONSTANTS.MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
      expect(VALIDATION_CONSTANTS.ALLOWED_FILE_TYPES).toContain('text/xml');
      expect(VALIDATION_CONSTANTS.ALLOWED_FILE_TYPES).toContain('application/pdf');
    });
  });

  describe('validators', () => {
    describe('required', () => {
      test('validiert erforderliche Felder korrekt', () => {
        expect(validators.required('test')).toBe(true);
        expect(validators.required('')).toBe(false);
        expect(validators.required(null)).toBe(false);
        expect(validators.required(undefined)).toBe(false);
      });
    });

    describe('email', () => {
      test('validiert E-Mail-Adressen korrekt', () => {
        expect(validators.email('test@example.com')).toBe(true);
        expect(validators.email('user.name+tag@domain.co.uk')).toBe(true);
        expect(validators.email('invalid-email')).toBe(false);
        expect(validators.email('')).toBe(false);
      });
    });

    describe('iban', () => {
      test('validiert deutsche IBANs korrekt', () => {
        expect(validators.iban('DE89370400440532013000')).toBe(true);
        expect(validators.iban('DE89 3704 0044 0532 0130 00')).toBe(true);
        expect(validators.iban('INVALID')).toBe(false);
        expect(validators.iban('')).toBe(false);
      });
    });

    describe('bic', () => {
      test('validiert BIC-Codes korrekt', () => {
        expect(validators.bic('DEUTDEFF')).toBe(true);
        expect(validators.bic('COBADEFFXXX')).toBe(true);
        expect(validators.bic('INVALID')).toBe(false);
        expect(validators.bic('')).toBe(false);
      });
    });

    describe('date', () => {
      test('validiert Datumsformate korrekt', () => {
        expect(validators.date('2024-01-15')).toBe(true);
        expect(validators.date('2024-13-01')).toBe(false); // Ungültiger Monat
        expect(validators.date('invalid-date')).toBe(false);
        expect(validators.date('')).toBe(false);
      });
    });

    describe('number', () => {
      test('validiert Zahlen korrekt', () => {
        expect(validators.number('123')).toBe(true);
        expect(validators.number('123.45')).toBe(true);
        expect(validators.number('-123')).toBe(true);
        expect(validators.number('abc')).toBe(false);
        expect(validators.number('')).toBe(false);
      });
    });

    describe('stringLength', () => {
      test('validiert String-Längen korrekt', () => {
        expect(validators.stringLength('test', 1, 10)).toBe(true);
        expect(validators.stringLength('', 0, 10)).toBe(true);
        expect(validators.stringLength('very long string', 1, 5)).toBe(false);
        expect(validators.stringLength('', 1, 10)).toBe(false);
      });
    });

    describe('postalCode', () => {
      test('validiert deutsche PLZ korrekt', () => {
        expect(validators.postalCode('12345')).toBe(true);
        expect(validators.postalCode('1234')).toBe(false); // Zu kurz
        expect(validators.postalCode('123456')).toBe(false); // Zu lang
        expect(validators.postalCode('abcde')).toBe(false); // Nicht numerisch
        expect(validators.postalCode('')).toBe(false);
      });
    });

    describe('phone', () => {
      test('validiert Telefonnummern korrekt', () => {
        expect(validators.phone('+49 30 12345678')).toBe(true);
        expect(validators.phone('030 12345678')).toBe(true);
        expect(validators.phone('invalid-phone')).toBe(false);
        expect(validators.phone('')).toBe(false);
      });
    });
  });

  describe('validateFormData', () => {
    test('validiert vollständige Formulardaten korrekt', () => {
      const formData = {
        senderName: 'Test Company GmbH',
        senderEmail: 'test@company.com',
        recipientName: 'Test Recipient AG',
        recipientEmail: 'recipient@test.com',
        reference: 'RE-2024-001',
        invoiceDate: '2024-01-15',
        iban: 'DE89370400440532013000',
        bic: 'DEUTDEFF',
        totalNetAmount: '1000.00',
        taxRate: '19'
      };

      const result = validateFormData(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('erkennt fehlende erforderliche Felder', () => {
      const formData = {
        senderName: '', // Fehlt
        senderEmail: 'invalid-email', // Ungültig
        recipientName: 'Test Recipient AG',
        reference: 'RE-2024-001',
        invoiceDate: '2024-01-15',
        iban: 'INVALID', // Ungültig
        totalNetAmount: 'not-a-number' // Ungültig
      };

      const result = validateFormData(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('senderName');
      expect(result.errors).toHaveProperty('senderEmail');
      expect(result.errors).toHaveProperty('iban');
      expect(result.errors).toHaveProperty('totalNetAmount');
    });

    test('behandelt leere Formulardaten korrekt', () => {
      const result = validateFormData({});
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });
  });

  describe('validateDateRange', () => {
    test('validiert gültige Datumsbereiche', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      
      const result = validateDateRange(startDate, endDate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('erkennt ungültige Datumsbereiche', () => {
      const startDate = '2024-01-31';
      const endDate = '2024-01-01'; // Enddatum vor Startdatum
      
      const result = validateDateRange(startDate, endDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('dateRange');
    });

    test('erkennt ungültige Datumsformate', () => {
      const startDate = 'invalid-date';
      const endDate = '2024-01-31';
      
      const result = validateDateRange(startDate, endDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('startDate');
    });

    test('behandelt leere Datumswerte korrekt', () => {
      const result = validateDateRange('', '2024-01-31');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('startDate');
    });
  });
});
