const fs = require('fs');

function implementStickyCorrect() {
    let content = fs.readFileSync('App.js', 'utf8');
    
    console.log('🔄 Implementing sticky headers correctly...');
    
    // Add Intersection Observer useEffect if missing
    if (!content.includes('Intersection Observer für Sticky Headers')) {
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
        
        content = content.replace(useEffectPattern, `$1${intersectionObserverCode}\n`);
        console.log('✓ Added Intersection Observer');
    }
    
    // Now add sticky behavior using CSS classes and conditional logic
    // We'll use a simpler approach with CSS-in-JS
    
    // Add CSS for sticky headers to the style section
    const stylePattern = /(@keyframes checkmarkPulse \{[^}]+\})/;
    const stickyCSS = `
        .sticky-header {
          position: sticky;
          top: 80px;
          z-index: 20;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 8px 0;
          margin: 0 -20px;
          padding-left: 20px;
          padding-right: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease-out;
        }`;
    
    if (!content.includes('sticky-header')) {
        content = content.replace(stylePattern, `$1${stickyCSS}`);
        console.log('✓ Added sticky header CSS');
    }
    
    // Replace headers with conditional sticky class
    // Rechnungssteller
    content = content.replace(
        /<h3 className="font-semibold text-lg text-gray-800">Rechnungssteller<\/h3>/g,
        '<h3 className={`font-semibold text-lg text-gray-800 ${activeSection === "rechnungssteller" ? "sticky-header" : ""}`}>Rechnungssteller</h3>'
    );
    
    // Rechnungsempfänger
    content = content.replace(
        /<h3 className="font-semibold text-lg text-gray-800">Rechnungsempfänger<\/h3>/g,
        '<h3 className={`font-semibold text-lg text-gray-800 ${activeSection === "rechnungsempfaenger" ? "sticky-header" : ""}`}>Rechnungsempfänger</h3>'
    );
    
    // Rechnungsdetails
    content = content.replace(
        /<h3 className="font-semibold text-lg text-gray-800">Rechnungsdetails<\/h3>/g,
        '<h3 className={`font-semibold text-lg text-gray-800 ${activeSection === "rechnungsdetails" ? "sticky-header" : ""}`}>Rechnungsdetails</h3>'
    );
    
    // Rechnungspositionen (div container)
    content = content.replace(
        /<div className="flex justify-between items-center">/g,
        '<div className={`flex justify-between items-center ${activeSection === "rechnungspositionen" ? "sticky-header" : ""}`}>'
    );
    
    // Gesamtbeträge
    content = content.replace(
        /<h3 className="font-semibold text-lg text-gray-800">Gesamtbeträge<\/h3>/g,
        '<h3 className={`font-semibold text-lg text-gray-800 ${activeSection === "gesamtbetraege" ? "sticky-header" : ""}`}>Gesamtbeträge</h3>'
    );
    
    // Zahlungsinformationen
    content = content.replace(
        /<h3 className="font-semibold text-lg text-gray-800">Zahlungsinformationen<\/h3>/g,
        '<h3 className={`font-semibold text-lg text-gray-800 ${activeSection === "zahlungsinformationen" ? "sticky-header" : ""}`}>Zahlungsinformationen</h3>'
    );
    
    fs.writeFileSync('App.js', content, 'utf8');
    console.log('✅ Sticky headers implemented correctly!');
}

implementStickyCorrect();

