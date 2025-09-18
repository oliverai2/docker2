const fs = require('fs');
const path = require('path');

function updateAppJs() {
    // Read the original file - correct path
    const filePath = path.join(__dirname, 'App.js');
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log('🔄 Starting sticky headers implementation...');
    
    // Step 1: Add sticky header state after uploadStatus
    const statePattern = /(const \[uploadStatus, setUploadStatus\] = useState\(null\);.*?\n)/s;
    const stateReplacement = '$1  const [activeSection, setActiveSection] = useState(\'\');\n';
    
    if (!content.includes('activeSection')) {
        content = content.replace(statePattern, stateReplacement);
        console.log('✓ Added activeSection state');
    }
    
    // Step 2: Add Intersection Observer useEffect after the existing useEffect
    const useEffectPattern = /(  }, \[formData\.lineItems, formData\.taxRate\];\n)/;
    
    const intersectionObserverCode = `
  // Intersection Observer für Sticky Headers
  useEffect(() => {
    const observers = [];
    
    const sectionConfig = [
      { id: 'rechnungssteller' },
      { id: 'rechnungsempfaenger' },
      { id: 'rechnungsdetails' },
      { id: 'rechnungspositionen' },
      { id: 'gesamtbetraege' },
      { id: 'zahlungsinformationen' }
    ];

    sectionConfig.forEach(section => {
      const sectionElement = document.querySelector(\`[data-section="\${section.id}"]\`);
      if (sectionElement) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveSection(section.id);
            } else if (!entry.isIntersecting && activeSection === section.id) {
              setActiveSection('');
            }
          },
          { 
            threshold: [0, 0.3, 0.7],
            rootMargin: '-80px 0px -50% 0px'
          }
        );
        
        observer.observe(sectionElement);
        observers.push(observer);
      }
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, [activeSection]);
`;
    
    const useEffectReplacement = `$1${intersectionObserverCode}\n`;
    
    if (!content.includes('Intersection Observer für Sticky Headers')) {
        content = content.replace(useEffectPattern, useEffectReplacement);
        console.log('✓ Added Intersection Observer useEffect');
    }
    
    // Step 3: Update block containers with data-section attributes and sticky headers
    
    // Helper function to create sticky header replacements
    const createStickyHeader = (sectionId, headerText, isSpecialCase = false) => {
        if (isSpecialCase) {
            // For Rechnungspositionen with button
            return `$1 data-section="${sectionId}">
              <div className={\`flex justify-between items-center transition-all duration-200 \${activeSection === '${sectionId}' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}\`}>
                  <h3 className="font-semibold text-lg text-gray-800">${headerText}</h3>`;
        } else {
            return `$1 data-section="${sectionId}">
              <h3 className={\`font-semibold text-lg text-gray-800 transition-all duration-200 \${activeSection === '${sectionId}' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}\`}>
                ${headerText}
              </h3>`;
        }
    };
    
    // Apply replacements
    let replacements = 0;
    
    // Rechnungssteller
    const oldContent1 = content;
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungssteller<\/h3>/g,
        createStickyHeader('rechnungssteller', 'Rechnungssteller')
    );
    if (content !== oldContent1) replacements++;
    
    // Rechnungsempfänger
    const oldContent2 = content;
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungsempfänger<\/h3>/g,
        createStickyHeader('rechnungsempfaenger', 'Rechnungsempfänger')
    );
    if (content !== oldContent2) replacements++;
    
    // Rechnungsdetails
    const oldContent3 = content;
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungsdetails<\/h3>/g,
        createStickyHeader('rechnungsdetails', 'Rechnungsdetails')
    );
    if (content !== oldContent3) replacements++;
    
    // Rechnungspositionen (special case with button)
    const oldContent4 = content;
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s*<div className="flex justify-between items-center">\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungspositionen<\/h3>/g,
        createStickyHeader('rechnungspositionen', 'Rechnungspositionen', true)
    );
    if (content !== oldContent4) replacements++;
    
    // Gesamtbeträge
    const oldContent5 = content;
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Gesamtbeträge<\/h3>/g,
        createStickyHeader('gesamtbetraege', 'Gesamtbeträge')
    );
    if (content !== oldContent5) replacements++;
    
    // Zahlungsinformationen
    const oldContent6 = content;
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Zahlungsinformationen<\/h3>/g,
        createStickyHeader('zahlungsinformationen', 'Zahlungsinformationen')
    );
    if (content !== oldContent6) replacements++;
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`✓ Updated ${replacements} block containers with sticky headers`);
    console.log('✅ Sticky headers implementation completed!');
}

updateAppJs();

