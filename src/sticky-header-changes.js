// STICKY HEADER IMPLEMENTATION - ÄNDERUNGEN FÜR APP.JS

// 1. NACH ZEILE 1572 - NEUE STATES UND REFS HINZUFÜGEN:
  // Sticky Header States
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef({
    rechnungssteller: null,
    rechnungsempfaenger: null, 
    rechnungsdetails: null,
    rechnungspositionen: null,
    gesamtbetraege: null,
    zahlungsinformationen: null
  });

// 2. NACH DEN BESTEHENDEN useEffects - INTERSECTION OBSERVER HINZUFÜGEN:
  // Intersection Observer für Sticky Headers
  useEffect(() => {
    const observers = [];
    
    const sectionConfig = [
      { id: 'rechnungssteller', selector: '[data-section="rechnungssteller"]' },
      { id: 'rechnungsempfaenger', selector: '[data-section="rechnungsempfaenger"]' },
      { id: 'rechnungsdetails', selector: '[data-section="rechnungsdetails"]' },
      { id: 'rechnungspositionen', selector: '[data-section="rechnungspositionen"]' },
      { id: 'gesamtbetraege', selector: '[data-section="gesamtbetraege"]' },
      { id: 'zahlungsinformationen', selector: '[data-section="zahlungsinformationen"]' }
    ];

    sectionConfig.forEach(section => {
      const sectionElement = document.querySelector(section.selector);
      if (sectionElement) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
              setActiveSection(section.id);
            } else if (activeSection === section.id) {
              // Nur deaktivieren wenn diese Sektion gerade aktiv war
              const nextSection = sectionConfig.find(s => {
                const nextEl = document.querySelector(s.selector);
                return nextEl && nextEl.getBoundingClientRect().top < window.innerHeight * 0.5;
              });
              if (!nextSection || nextSection.id !== section.id) {
                setActiveSection('');
              }
            }
          },
          { 
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '-80px 0px -60% 0px'
          }
        );
        
        observer.observe(sectionElement);
        observers.push(observer);
      }
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, [activeSection]);

// 3. BLOCK-CONTAINER ÄNDERUNGEN:

// RECHNUNGSSTELLER BLOCK (ca. Zeile 1242):
// VON:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-800">Rechnungssteller</h3>

// ZU:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg" data-section="rechnungssteller">
              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === 'rechnungssteller' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}`}>
                Rechnungssteller
              </h3>

// RECHNUNGSEMPFÄNGER BLOCK (ca. Zeile 1263):
// VON:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-800">Rechnungsempfänger</h3>

// ZU:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg" data-section="rechnungsempfaenger">
              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === 'rechnungsempfaenger' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}`}>
                Rechnungsempfänger
              </h3>

// RECHNUNGSDETAILS BLOCK (ca. Zeile 1281):
// VON:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-800">Rechnungsdetails</h3>

// ZU:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg" data-section="rechnungsdetails">
              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === 'rechnungsdetails' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}`}>
                Rechnungsdetails
              </h3>

// RECHNUNGSPOSITIONEN BLOCK (ca. Zeile 1298):
// VON:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-800">Rechnungspositionen</h3>

// ZU:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg" data-section="rechnungspositionen">
              <div className={`flex justify-between items-center transition-all duration-200 ${activeSection === 'rechnungspositionen' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}`}>
                  <h3 className="font-semibold text-lg text-gray-800">Rechnungspositionen</h3>

// GESAMTBETRÄGE BLOCK (ca. Zeile 1327):
// VON:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-lg text-gray-800">Gesamtbeträge</h3>

// ZU:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg" data-section="gesamtbetraege">
            <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === 'gesamtbetraege' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}`}>
              Gesamtbeträge
            </h3>

// ZAHLUNGSINFORMATIONEN BLOCK (ca. Zeile 1346):
// VON:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-800">Zahlungsinformationen</h3>

// ZU:
          <div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg" data-section="zahlungsinformationen">
              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === 'zahlungsinformationen' ? 'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm' : ''}`}>
                Zahlungsinformationen
              </h3>
