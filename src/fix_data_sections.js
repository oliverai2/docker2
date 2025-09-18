const fs = require('fs');
const path = require('path');

function fixDataSections() {
    const filePath = path.join(__dirname, 'App.js');
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log('🔧 Fixing data-section attributes...');
    
    // Fix the data-section attributes that got malformed
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s+data-section="([^"]+)">/g,
        '$1 data-section="$2">'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed data-section attributes!');
}

fixDataSections();

