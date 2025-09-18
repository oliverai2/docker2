const fs = require('fs');

function fixEslintErrors() {
    let content = fs.readFileSync('App.js', 'utf8');
    
    console.log('🔧 Fixing ESLint errors...');
    
    // Fix the template literal syntax in className attributes
    // Replace the malformed template literals with proper ones
    
    // Fix Rechnungssteller
    content = content.replace(
        /className=\{`font-semibold text-lg text-gray-800 transition-all duration-200 \$\{activeSection === 'rechnungssteller' \? 'sticky top-20 z-20 bg-white\/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''\}`\}/g,
        'className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'rechnungssteller\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}'
    );
    
    // Fix Rechnungsempfänger  
    content = content.replace(
        /className=\{`font-semibold text-lg text-gray-800 transition-all duration-200 \$\{activeSection === 'rechnungsempfaenger' \? 'sticky top-20 z-20 bg-white\/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''\}`\}/g,
        'className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'rechnungsempfaenger\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}'
    );
    
    // Fix Rechnungsdetails
    content = content.replace(
        /className=\{`font-semibold text-lg text-gray-800 transition-all duration-200 \$\{activeSection === 'rechnungsdetails' \? 'sticky top-20 z-20 bg-white\/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''\}`\}/g,
        'className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'rechnungsdetails\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}'
    );
    
    // Fix Rechnungspositionen (div container)
    content = content.replace(
        /className=\{`flex justify-between items-center transition-all duration-200 \$\{activeSection === 'rechnungspositionen' \? 'sticky top-20 z-20 bg-white\/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''\}`\}/g,
        'className={`flex justify-between items-center transition-all duration-200 ${activeSection === \'rechnungspositionen\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}'
    );
    
    // Fix Gesamtbeträge
    content = content.replace(
        /className=\{`font-semibold text-lg text-gray-800 transition-all duration-200 \$\{activeSection === 'gesamtbetraege' \? 'sticky top-20 z-20 bg-white\/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''\}`\}/g,
        'className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'gesamtbetraege\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}'
    );
    
    // Fix Zahlungsinformationen
    content = content.replace(
        /className=\{`font-semibold text-lg text-gray-800 transition-all duration-200 \$\{activeSection === 'zahlungsinformationen' \? 'sticky top-20 z-20 bg-white\/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''\}`\}/g,
        'className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'zahlungsinformationen\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}'
    );
    
    fs.writeFileSync('App.js', content, 'utf8');
    console.log('✅ Fixed ESLint errors!');
}

fixEslintErrors();

