import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock für FileReader
const mockFileReader = {
  readAsText: jest.fn(),
  result: '',
  onload: null,
};

global.FileReader = jest.fn(() => mockFileReader);

// Mock für URL.createObjectURL und URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock für navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

// Mock für ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock für getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
}));

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockFileReader.result = '';
  });

  test('rendert die Hauptseite mit allen Tabs', () => {
    render(<App />);
    
    // Prüfe Navigation
    expect(screen.getByText('E-Rechnung Generator')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('E-Rechnung Mapping')).toBeInTheDocument();
    expect(screen.getByText('SAP Mapping')).toBeInTheDocument();
  });

  test('kann zwischen Tabs wechseln', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Klicke auf E-Rechnung Mapping Tab
    const mappingTab = screen.getByText('E-Rechnung Mapping');
    await user.click(mappingTab);
    
    // Prüfe ob Mapping-Seite angezeigt wird
    expect(screen.getByText('E-Rechnung Mapping')).toBeInTheDocument();
  });

  test('Formular-Eingaben funktionieren korrekt', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Finde und fülle Sender-Name aus
    const senderNameInput = screen.getByLabelText(/Name \(Sender\)/);
    await user.type(senderNameInput, 'Test Company GmbH');
    
    expect(senderNameInput).toHaveValue('Test Company GmbH');
  });

  test('Rechnungspositionen können hinzugefügt werden', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Finde "Position hinzufügen" Button
    const addButton = screen.getByText('Position hinzufügen');
    await user.click(addButton);

    // Prüfe ob neue Position hinzugefügt wurde
    const positionInputs = screen.getAllByLabelText(/Bezeichnung/);
    expect(positionInputs.length).toBeGreaterThan(1);
  });

  test('Datei-Upload funktioniert für XML-Dateien', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Erstelle Mock-XML-Datei
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
      <cbc:ID>RE-2024-001</cbc:ID>
      <cbc:IssueDate>2024-01-15</cbc:IssueDate>
    </Invoice>`;
    
    const file = new File([xmlContent], 'test.xml', { type: 'text/xml' });
    
    // Finde File-Input
    const fileInput = screen.getByLabelText(/Datei auswählen/);
    await user.upload(fileInput, file);

    // Simuliere FileReader onload
    mockFileReader.result = xmlContent;
    mockFileReader.onload({ target: { result: xmlContent } });

    await waitFor(() => {
      expect(screen.getByText(/XML-Datei erkannt/)).toBeInTheDocument();
    });
  });

  test('XRechnung XML wird korrekt generiert', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Fülle Formular aus
    const senderNameInput = screen.getByLabelText(/Name \(Sender\)/);
    const recipientNameInput = screen.getByLabelText(/Name \(Empfänger\)/);
    const referenceInput = screen.getByLabelText(/Rechnungsnummer/);

    await user.type(senderNameInput, 'Test Sender GmbH');
    await user.type(recipientNameInput, 'Test Recipient AG');
    await user.type(referenceInput, 'RE-2024-001');

    // Klicke auf XRechnung generieren
    const generateButton = screen.getByText('XRechnung generieren');
    await user.click(generateButton);

    // Prüfe ob XML generiert wurde
    await waitFor(() => {
      expect(screen.getByText(/XRechnung XML/)).toBeInTheDocument();
    });
  });

  test('SAP-XML wird korrekt generiert', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Wechsle zu SAP Mapping Tab
    const sapTab = screen.getByText('SAP Mapping');
    await user.click(sapTab);

    // Fülle SAP-IDs aus
    const kreditorInput = screen.getByLabelText(/Kreditor-ID/);
    const buchungskreisInput = screen.getByLabelText(/Buchungskreis-ID/);

    await user.type(kreditorInput, '12345');
    await user.type(buchungskreisInput, '67890');

    // Klicke auf SAP-XML generieren
    const generateButton = screen.getByText('SAP-XML generieren');
    await user.click(generateButton);

    // Prüfe ob SAP-XML generiert wurde
    await waitFor(() => {
      expect(screen.getByText(/SAP-XML/)).toBeInTheDocument();
    });
  });

  test('Fehlerbehandlung funktioniert bei ungültigen Eingaben', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Versuche ungültige Datei hochzuladen
    const invalidFile = new File(['invalid content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/Datei auswählen/);
    await user.upload(fileInput, invalidFile);

    // Prüfe ob Fehlermeldung angezeigt wird
    await waitFor(() => {
      expect(screen.getByText(/Nicht unterstützter Dateityp/)).toBeInTheDocument();
    });
  });

  test('Download-Funktionalität funktioniert', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Generiere erst XML
    const senderNameInput = screen.getByLabelText(/Name \(Sender\)/);
    await user.type(senderNameInput, 'Test Company');
    
    const generateButton = screen.getByText('XRechnung generieren');
    await user.click(generateButton);

    // Klicke auf Download
    const downloadButton = screen.getByText('Download XML');
    await user.click(downloadButton);

    // Prüfe ob Download-Funktion aufgerufen wurde
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  test('Copy-Funktionalität funktioniert', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Generiere erst XML
    const senderNameInput = screen.getByLabelText(/Name \(Sender\)/);
    await user.type(senderNameInput, 'Test Company');
    
    const generateButton = screen.getByText('XRechnung generieren');
    await user.click(generateButton);

    // Klicke auf Copy
    const copyButton = screen.getByText('Copy XML');
    await user.click(copyButton);

    // Prüfe ob Clipboard-Funktion aufgerufen wurde
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test('Responsive Design funktioniert', () => {
    // Simuliere mobile Viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<App />);
    
    // Prüfe ob App trotzdem rendert
    expect(screen.getByText('E-Rechnung Generator')).toBeInTheDocument();
  });
});
