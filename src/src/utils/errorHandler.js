// Error Handler Utilities für die E-Rechnung App

// Fehlertypen
export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  SECURITY: 'SECURITY',
  SYSTEM: 'SYSTEM',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Kategorisiert Fehler basierend auf Typ und Nachricht
 * @param {Error} error - Der zu kategorisierende Fehler
 * @returns {object} - {type: string, message: string}
 */
export const categorizeError = (error) => {
  if (!error) {
    return {
      type: ERROR_TYPES.UNKNOWN,
      message: 'Unbekannter Fehler'
    };
  }

  const message = error.message || error.toString();
  const name = error.name || '';

  // Validierungsfehler
  if (name.includes('Validation') || 
      message.includes('validation') || 
      message.includes('ungültig') ||
      message.includes('erforderlich')) {
    return {
      type: ERROR_TYPES.VALIDATION,
      message: message
    };
  }

  // Netzwerkfehler
  if (name.includes('Network') || 
      message.includes('network') || 
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('connection')) {
    return {
      type: ERROR_TYPES.NETWORK,
      message: message
    };
  }

  // Sicherheitsfehler
  if (name.includes('Security') || 
      message.includes('security') || 
      message.includes('access') ||
      message.includes('permission') ||
      message.includes('forbidden')) {
    return {
      type: ERROR_TYPES.SECURITY,
      message: message
    };
  }

  // Systemfehler
  if (name.includes('System') || 
      message.includes('system') || 
      message.includes('internal') ||
      message.includes('server')) {
    return {
      type: ERROR_TYPES.SYSTEM,
      message: message
    };
  }

  // Unbekannte Fehler
  return {
    type: ERROR_TYPES.UNKNOWN,
    message: message
  };
};

/**
 * Generiert benutzerfreundliche Fehlermeldungen
 * @param {object} error - Der kategorisierte Fehler
 * @returns {string} - Benutzerfreundliche Nachricht
 */
export const getUserFriendlyMessage = (error) => {
  const { type, message } = error;

  switch (type) {
    case ERROR_TYPES.VALIDATION:
      return `Eingabefehler: ${message}. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.`;
    
    case ERROR_TYPES.NETWORK:
      return `Verbindungsfehler: ${message}. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es später erneut.`;
    
    case ERROR_TYPES.SECURITY:
      return `Sicherheitsfehler: ${message}. Bitte kontaktieren Sie den Administrator.`;
    
    case ERROR_TYPES.SYSTEM:
      return `Systemfehler: ${message}. Bitte versuchen Sie es später erneut.`;
    
    case ERROR_TYPES.UNKNOWN:
    default:
      return `Unbekannter Fehler: ${message}. Bitte versuchen Sie es später erneut.`;
  }
};

/**
 * Zentrale Fehlerbehandlung
 * @param {Error} error - Der zu behandelnde Fehler
 * @returns {object} - Strukturiertes Fehlerobjekt
 */
export const handleError = (error) => {
  const categorized = categorizeError(error);
  const userMessage = getUserFriendlyMessage(categorized);

  // Logge Fehler für Debugging
  console.error('Error occurred:', {
    type: categorized.type,
    message: categorized.message,
    stack: error?.stack,
    timestamp: new Date().toISOString()
  });

  return {
    type: categorized.type,
    message: categorized.message,
    userMessage: userMessage,
    timestamp: new Date().toISOString(),
    stack: error?.stack
  };
};

/**
 * Wrapper für Funktionen mit automatischer Fehlerbehandlung
 * @param {Function} fn - Die zu wrappende Funktion
 * @param {Function} errorHandler - Optionaler Error Handler
 * @returns {Function} - Wrapped Funktion
 */
export const withErrorHandling = (fn, errorHandler = null) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const handledError = handleError(error);
      
      if (errorHandler) {
        errorHandler(handledError);
      } else {
        // Standard Error Handler
        console.error('Unhandled error:', handledError);
      }
      
      // Re-throw für weitere Behandlung
      throw handledError;
    }
  };
};

/**
 * Erstellt einen Error Boundary für React-Komponenten
 * @param {React.Component} Component - Die zu wrappende Komponente
 * @returns {React.Component} - Error Boundary Komponente
 */
export const createErrorBoundary = (Component) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      const handledError = handleError(error);
      console.error('React Error Boundary caught error:', handledError, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        const error = this.state.error;
        const handledError = handleError(error);
        
        return (
          <div className="error-boundary">
            <h2>Ein Fehler ist aufgetreten</h2>
            <p>{handledError.userMessage}</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Erneut versuchen
            </button>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};
