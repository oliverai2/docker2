const fs = require('fs');

function simpleFix() {
    let content = fs.readFileSync('App.js', 'utf8');
    
    console.log('🔧 Applying simple fix for sticky headers...');
    
    // Replace template literals with simple conditional className
    
    // Fix Rechnungssteller
    content = content.replace(
        /className=\{.*?activeSection === 'rechnungssteller'.*?\}/g,
        'className={activeSection === "rechnungssteller" ? "font-semibold text-lg text-gray-800 transition-all duration-200 sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm" : "font-semibold text-lg text-gray-800 transition-all duration-200"}'
    );
    
    // Fix Rechnungsempfänger
    content = content.replace(
        /className=\{.*?activeSection === 'rechnungsempfaenger'.*?\}/g,
        'className={activeSection === "rechnungsempfaenger" ? "font-semibold text-lg text-gray-800 transition-all duration-200 sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm" : "font-semibold text-lg text-gray-800 transition-all duration-200"}'
    );
    
    // Fix Rechnungsdetails
    content = content.replace(
        /className=\{.*?activeSection === 'rechnungsdetails'.*?\}/g,
        'className={activeSection === "rechnungsdetails" ? "font-semibold text-lg text-gray-800 transition-all duration-200 sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm" : "font-semibold text-lg text-gray-800 transition-all duration-200"}'
    );
    
    // Fix Rechnungspositionen (div)
    content = content.replace(
        /className=\{.*?activeSection === 'rechnungspositionen'.*?flex justify-between items-center.*?\}/g,
        'className={activeSection === "rechnungspositionen" ? "flex justify-between items-center transition-all duration-200 sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm" : "flex justify-between items-center transition-all duration-200"}'
    );
    
    // Fix Gesamtbeträge
    content = content.replace(
        /className=\{.*?activeSection === 'gesamtbetraege'.*?\}/g,
        'className={activeSection === "gesamtbetraege" ? "font-semibold text-lg text-gray-800 transition-all duration-200 sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm" : "font-semibold text-lg text-gray-800 transition-all duration-200"}'
    );
    
    // Fix Zahlungsinformationen
    content = content.replace(
        /className=\{.*?activeSection === 'zahlungsinformationen'.*?\}/g,
        'className={activeSection === "zahlungsinformationen" ? "font-semibold text-lg text-gray-800 transition-all duration-200 sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm" : "font-semibold text-lg text-gray-800 transition-all duration-200"}'
    );
    
    fs.writeFileSync('App.js', content, 'utf8');
    console.log('✅ Applied simple fix!');
}

simpleFix();

