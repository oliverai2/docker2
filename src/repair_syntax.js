const fs = require('fs');

function repairSyntax() {
    let content = fs.readFileSync('App.js', 'utf8');
    
    console.log('🚨 Repairing syntax errors...');
    
    // Fix the malformed data-section attributes
    // The issue is that there's a space before data-section
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s+data-section="([^"]+)">/g,
        '$1 data-section="$2">'
    );
    
    // Completely revert the malformed className changes and use simple approach
    
    // Fix Rechnungssteller - back to simple
    content = content.replace(
        /<h3 className=\{activeSection === "rechnungssteller"[^}]+\}>/g,
        '<h3 className="font-semibold text-lg text-gray-800">Rechnungssteller</h3>'
    );
    
    // Fix Rechnungsempfänger - back to simple
    content = content.replace(
        /<h3 className=\{activeSection === "rechnungsempfaenger"[^}]+\}>/g,
        '<h3 className="font-semibold text-lg text-gray-800">Rechnungsempfänger</h3>'
    );
    
    // Fix Rechnungsdetails - back to simple
    content = content.replace(
        /<h3 className=\{activeSection === "rechnungsdetails"[^}]+\}>/g,
        '<h3 className="font-semibold text-lg text-gray-800">Rechnungsdetails</h3>'
    );
    
    // Fix Rechnungspositionen div - back to simple
    content = content.replace(
        /<div className=\{activeSection === "rechnungspositionen"[^}]+\}>/g,
        '<div className="flex justify-between items-center">'
    );
    
    // Fix Gesamtbeträge - back to simple
    content = content.replace(
        /<h3 className=\{activeSection === "gesamtbetraege"[^}]+\}>/g,
        '<h3 className="font-semibold text-lg text-gray-800">Gesamtbeträge</h3>'
    );
    
    // Fix Zahlungsinformationen - back to simple
    content = content.replace(
        /<h3 className=\{activeSection === "zahlungsinformationen"[^}]+\}>/g,
        '<h3 className="font-semibold text-lg text-gray-800">Zahlungsinformationen</h3>'
    );
    
    fs.writeFileSync('App.js', content, 'utf8');
    console.log('✅ Syntax errors repaired! Reverted to working state.');
}

repairSyntax();

