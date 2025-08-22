import {
  ERROR_TYPES,
  categorizeError,
  getUserFriendlyMessage,
  handleError,
  withErrorHandling
} from './errorHandler';

describe('Error Handler Utilities', () => {
  describe('ERROR_TYPES', () => {
    test('enthält alle erforderlichen Fehlertypen', () => {
      expect(ERROR_TYPES).toHaveProperty('VALIDATION');
      expect(ERROR_TYPES).toHaveProperty('NETWORK');
      expect(ERROR_TYPES).toHaveProperty('SECURITY');
      expect(ERROR_TYPES).toHaveProperty('SYSTEM');
      expect(ERROR_TYPES).toHaveProperty('UNKNOWN');
    });
  });

  describe('categorizeError', () => {
    test('kategorisiert Validierungsfehler korrekt', () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      
      const result = categorizeError(validationError);
      expect(result.type).toBe(ERROR_TYPES.VALIDATION);
    });

    test('kategorisiert Netzwerkfehler korrekt', () => {
      const networkError = new Error('Network request failed');
      networkError.name = 'NetworkError';
      
      const result = categorizeError(networkError);
      expect(result.type).toBe(ERROR_TYPES.NETWORK);
    });

    test('kategorisiert Sicherheitsfehler korrekt', () => {
      const securityError = new Error('Access denied');
      securityError.name = 'SecurityError';
      
      const result = categorizeError(securityError);
      expect(result.type).toBe(ERROR_TYPES.SECURITY);
    });

    test('kategorisiert unbekannte Fehler korrekt', () => {
      const unknownError = new Error('Something went wrong');
      
      const result = categorizeError(unknownError);
      expect(result.type).toBe(ERROR_TYPES.UNKNOWN);
    });

    test('behandelt null/undefined Fehler korrekt', () => {
      const result = categorizeError(null);
      expect(result.type).toBe(ERROR_TYPES.UNKNOWN);
      expect(result.message).toBe('Unbekannter Fehler');
    });
  });

  describe('getUserFriendlyMessage', () => {
    test('gibt benutzerfreundliche Nachrichten für Validierungsfehler zurück', () => {
      const error = {
        type: ERROR_TYPES.VALIDATION,
        message: 'Invalid email format'
      };
      
      const result = getUserFriendlyMessage(error);
      expect(result).toContain('Eingabefehler');
      expect(result).toContain('Bitte überprüfen Sie Ihre Eingaben');
    });

    test('gibt benutzerfreundliche Nachrichten für Netzwerkfehler zurück', () => {
      const error = {
        type: ERROR_TYPES.NETWORK,
        message: 'Failed to fetch'
      };
      
      const result = getUserFriendlyMessage(error);
      expect(result).toContain('Verbindungsfehler');
      expect(result).toContain('Bitte versuchen Sie es später erneut');
    });

    test('gibt benutzerfreundliche Nachrichten für Sicherheitsfehler zurück', () => {
      const error = {
        type: ERROR_TYPES.SECURITY,
        message: 'Access denied'
      };
      
      const result = getUserFriendlyMessage(error);
      expect(result).toContain('Sicherheitsfehler');
      expect(result).toContain('Bitte kontaktieren Sie den Administrator');
    });

    test('gibt benutzerfreundliche Nachrichten für Systemfehler zurück', () => {
      const error = {
        type: ERROR_TYPES.SYSTEM,
        message: 'Internal server error'
      };
      
      const result = getUserFriendlyMessage(error);
      expect(result).toContain('Systemfehler');
      expect(result).toContain('Bitte versuchen Sie es später erneut');
    });

    test('gibt benutzerfreundliche Nachrichten für unbekannte Fehler zurück', () => {
      const error = {
        type: ERROR_TYPES.UNKNOWN,
        message: 'Something went wrong'
      };
      
      const result = getUserFriendlyMessage(error);
      expect(result).toContain('Unbekannter Fehler');
      expect(result).toContain('Bitte versuchen Sie es später erneut');
    });
  });

  describe('handleError', () => {
    test('behandelt Fehler korrekt und gibt strukturiertes Ergebnis zurück', () => {
      const error = new Error('Test error');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = handleError(error);
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('userMessage');
      expect(result).toHaveProperty('timestamp');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('behandelt verschiedene Fehlertypen korrekt', () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      
      const result = handleError(validationError);
      expect(result.type).toBe(ERROR_TYPES.VALIDATION);
      expect(result.userMessage).toContain('Eingabefehler');
    });

    test('behandelt Fehler ohne Stack Trace korrekt', () => {
      const error = { message: 'Simple error' };
      
      const result = handleError(error);
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Simple error');
    });
  });

  describe('withErrorHandling', () => {
    test('führt Funktion erfolgreich aus', async () => {
      const mockFunction = jest.fn().mockResolvedValue('success');
      const errorHandler = jest.fn();
      
      const wrappedFunction = withErrorHandling(mockFunction, errorHandler);
      const result = await wrappedFunction('test');
      
      expect(result).toBe('success');
      expect(mockFunction).toHaveBeenCalledWith('test');
      expect(errorHandler).not.toHaveBeenCalled();
    });

    test('fängt Fehler ab und ruft Error Handler auf', async () => {
      const mockFunction = jest.fn().mockRejectedValue(new Error('Test error'));
      const errorHandler = jest.fn();
      
      const wrappedFunction = withErrorHandling(mockFunction, errorHandler);
      await wrappedFunction('test');
      
      expect(mockFunction).toHaveBeenCalledWith('test');
      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0]).toHaveProperty('type');
      expect(errorHandler.mock.calls[0][0]).toHaveProperty('message');
    });

    test('behandelt synchrone Funktionen korrekt', () => {
      const mockFunction = jest.fn().mockReturnValue('success');
      const errorHandler = jest.fn();
      
      const wrappedFunction = withErrorHandling(mockFunction, errorHandler);
      const result = wrappedFunction('test');
      
      expect(result).toBe('success');
      expect(mockFunction).toHaveBeenCalledWith('test');
      expect(errorHandler).not.toHaveBeenCalled();
    });

    test('behandelt synchrone Fehler korrekt', () => {
      const mockFunction = jest.fn().mockImplementation(() => {
        throw new Error('Sync error');
      });
      const errorHandler = jest.fn();
      
      const wrappedFunction = withErrorHandling(mockFunction, errorHandler);
      wrappedFunction('test');
      
      expect(mockFunction).toHaveBeenCalledWith('test');
      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0]).toHaveProperty('type');
      expect(errorHandler.mock.calls[0][0]).toHaveProperty('message');
    });

    test('verwendet Standard Error Handler wenn keiner angegeben', async () => {
      const mockFunction = jest.fn().mockRejectedValue(new Error('Test error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const wrappedFunction = withErrorHandling(mockFunction);
      await wrappedFunction('test');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
