const fs = require('fs');

function finalFix() {
    let content = fs.readFileSync('App.js', 'utf8');
    
    console.log('🔧 Applying final fixes...');
    
    // Fix data-section attributes placement
    content = content.replace(
        /(<div className="space-y-4 p-5 bg-white\/30 backdrop-blur-xl border border-white\/30 rounded-2xl shadow-lg">)\s+data-section="([^"]+)">/g,
        '$1 data-section="$2">'
    );
    
    // Add Intersection Observer if missing
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
        console.log('✓ Added missing Intersection Observer');
    }
    
    fs.writeFileSync('App.js', content, 'utf8');
    console.log('✅ All fixes applied!');
}

finalFix();

