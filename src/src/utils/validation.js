// Validierungs-Utilities für die E-Rechnung App

// Konstanten für Validierung
export const VALIDATION_CONSTANTS = {
  MAX_STRING_LENGTH: 1000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['text/xml', 'application/xml', 'application/pdf'],
  POSTAL_CODE_PATTERN: /^\d{5}$/,
  PHONE_PATTERN: /^(\+49\s?)?(\d{2,4}\s?)?(\d{6,8})$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  IBAN_PATTERN: /^DE\d{20}$/,
  BIC_PATTERN: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  DATE_PATTERN: /^\d{4}-\d{2}-\d{2}$/,
  NUMBER_PATTERN: /^-?\d+(\.\d+)?$/
};

// Validierungsfunktionen
export const validators = {
  /**
   * Prüft ob ein Wert vorhanden ist
   */
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  /**
   * Validiert E-Mail-Adressen
   */
  email: (value) => {
    if (!value || typeof value !== 'string') return false;
    return VALIDATION_CONSTANTS.EMAIL_PATTERN.test(value.trim());
  },

  /**
   * Validiert deutsche IBANs
   */
  iban: (value) => {
    if (!value || typeof value !== 'string') return false;
    const cleanIban = value.replace(/\s/g, '');
    return VALIDATION_CONSTANTS.IBAN_PATTERN.test(cleanIban);
  },

  /**
   * Validiert BIC/SWIFT-Codes
   */
  bic: (value) => {
    if (!value || typeof value !== 'string') return false;
    return VALIDATION_CONSTANTS.BIC_PATTERN.test(value.toUpperCase());
  },

  /**
   * Validiert Datumsformate (YYYY-MM-DD)
   */
  date: (value) => {
    if (!value || typeof value !== 'string') return false;
    if (!VALIDATION_CONSTANTS.DATE_PATTERN.test(value)) return false;
    
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  },

  /**
   * Validiert Zahlen
   */
  number: (value) => {
    if (!value || typeof value !== 'string') return false;
    return VALIDATION_CONSTANTS.NUMBER_PATTERN.test(value);
  },

  /**
   * Validiert String-Längen
   */
  stringLength: (value, minLength = 0, maxLength = VALIDATION_CONSTANTS.MAX_STRING_LENGTH) => {
    if (!value || typeof value !== 'string') return false;
    const length = value.trim().length;
    return length >= minLength && length <= maxLength;
  },

  /**
   * Validiert deutsche Postleitzahlen
   */
  postalCode: (value) => {
    if (!value || typeof value !== 'string') return false;
    return VALIDATION_CONSTANTS.POSTAL_CODE_PATTERN.test(value.trim());
  },

  /**
   * Validiert deutsche Telefonnummern
   */
  phone: (value) => {
    if (!value || typeof value !== 'string') return false;
    return VALIDATION_CONSTANTS.PHONE_PATTERN.test(value.trim());
  }
};

/**
 * Validiert Formulardaten für E-Rechnungen
 * @param {object} formData - Die zu validierenden Formulardaten
 * @returns {object} - {isValid: boolean, errors: object}
 */
export const validateFormData = (formData) => {
  const errors = {};

  // Sender-Validierung
  if (!validators.required(formData.senderName)) {
    errors.senderName = 'Name des Senders ist erforderlich';
  } else if (!validators.stringLength(formData.senderName, 1, 100)) {
    errors.senderName = 'Name des Senders ist zu lang (max. 100 Zeichen)';
  }

  if (formData.senderContactEmail && !validators.email(formData.senderContactEmail)) {
    errors.senderContactEmail = 'Ungültige E-Mail-Adresse';
  }

  if (formData.senderContactPhone && !validators.phone(formData.senderContactPhone)) {
    errors.senderContactPhone = 'Ungültige Telefonnummer';
  }

  if (formData.senderZip && !validators.postalCode(formData.senderZip)) {
    errors.senderZip = 'Ungültige Postleitzahl';
  }

  // Empfänger-Validierung
  if (!validators.required(formData.recipientName)) {
    errors.recipientName = 'Name des Empfängers ist erforderlich';
  } else if (!validators.stringLength(formData.recipientName, 1, 100)) {
    errors.recipientName = 'Name des Empfängers ist zu lang (max. 100 Zeichen)';
  }

  if (formData.recipientZip && !validators.postalCode(formData.recipientZip)) {
    errors.recipientZip = 'Ungültige Postleitzahl';
  }

  // Rechnungsdaten-Validierung
  if (!validators.required(formData.reference)) {
    errors.reference = 'Rechnungsnummer ist erforderlich';
  } else if (!validators.stringLength(formData.reference, 1, 50)) {
    errors.reference = 'Rechnungsnummer ist zu lang (max. 50 Zeichen)';
  }

  if (!validators.required(formData.invoiceDate)) {
    errors.invoiceDate = 'Rechnungsdatum ist erforderlich';
  } else if (!validators.date(formData.invoiceDate)) {
    errors.invoiceDate = 'Ungültiges Datumsformat (YYYY-MM-DD)';
  }

  if (formData.serviceDate && !validators.date(formData.serviceDate)) {
    errors.serviceDate = 'Ungültiges Datumsformat (YYYY-MM-DD)';
  }

  // Zahlungsdaten-Validierung
  if (formData.iban && !validators.iban(formData.iban)) {
    errors.iban = 'Ungültige IBAN';
  }

  if (formData.bic && !validators.bic(formData.bic)) {
    errors.bic = 'Ungültiger BIC/SWIFT-Code';
  }

  // Beträge-Validierung
  if (formData.totalNetAmount && !validators.number(formData.totalNetAmount)) {
    errors.totalNetAmount = 'Ungültiger Betrag';
  }

  if (formData.totalTaxAmount && !validators.number(formData.totalTaxAmount)) {
    errors.totalTaxAmount = 'Ungültiger Steuerbetrag';
  }

  if (formData.grossAmount && !validators.number(formData.grossAmount)) {
    errors.grossAmount = 'Ungültiger Bruttobetrag';
  }

  if (formData.taxRate && !validators.number(formData.taxRate)) {
    errors.taxRate = 'Ungültiger Steuersatz';
  }

  // Leitweg-ID-Validierung
  if (formData.leitwegId && !validators.stringLength(formData.leitwegId, 1, 100)) {
    errors.leitwegId = 'Leitweg-ID ist zu lang (max. 100 Zeichen)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validiert Datumsbereiche
 * @param {string} startDate - Startdatum
 * @param {string} endDate - Enddatum
 * @returns {object} - {isValid: boolean, errors: object}
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = {};

  // Validiere Startdatum
  if (!validators.required(startDate)) {
    errors.startDate = 'Startdatum ist erforderlich';
  } else if (!validators.date(startDate)) {
    errors.startDate = 'Ungültiges Startdatum';
  }

  // Validiere Enddatum
  if (!validators.required(endDate)) {
    errors.endDate = 'Enddatum ist erforderlich';
  } else if (!validators.date(endDate)) {
    errors.endDate = 'Ungültiges Enddatum';
  }

  // Prüfe Datumsbereich
  if (!errors.startDate && !errors.endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      errors.dateRange = 'Enddatum muss nach dem Startdatum liegen';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
