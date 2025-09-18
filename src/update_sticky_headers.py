#!/usr/bin/env python3
"""
Script to implement sticky headers in App.js
"""

import re

def update_app_js():
    # Read the original file
    with open('src/App.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Step 1: Add sticky header state after uploadStatus
    state_pattern = r"(const \[uploadStatus, setUploadStatus\] = useState\(null\);.*?\n)"
    state_replacement = r"\1  const [activeSection, setActiveSection] = useState('');\n"
    
    if "activeSection" not in content:
        content = re.sub(state_pattern, state_replacement, content, flags=re.DOTALL)
        print("✓ Added activeSection state")
    
    # Step 2: Add Intersection Observer useEffect after the existing useEffect
    useeffect_pattern = r"(  }, \[formData\.lineItems, formData\.taxRate\];\n)"
    
    intersection_observer_code = '''
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
      const sectionElement = document.querySelector(`[data-section="${section.id}"]`);
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
'''
    
    useeffect_replacement = r"\1" + intersection_observer_code + "\n"
    
    if "Intersection Observer für Sticky Headers" not in content:
        content = re.sub(useeffect_pattern, useeffect_replacement, content, flags=re.DOTALL)
        print("✓ Added Intersection Observer useEffect")
    
    # Step 3: Update block containers with data-section attributes and sticky headers
    
    # Rechnungssteller
    content = re.sub(
        r'(<div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungssteller</h3>',
        r'\1 data-section="rechnungssteller">\n              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'rechnungssteller\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}>\n                Rechnungssteller\n              </h3>',
        content
    )
    
    # Rechnungsempfänger
    content = re.sub(
        r'(<div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungsempfänger</h3>',
        r'\1 data-section="rechnungsempfaenger">\n              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'rechnungsempfaenger\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}>\n                Rechnungsempfänger\n              </h3>',
        content
    )
    
    # Rechnungsdetails
    content = re.sub(
        r'(<div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungsdetails</h3>',
        r'\1 data-section="rechnungsdetails">\n              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'rechnungsdetails\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}>\n                Rechnungsdetails\n              </h3>',
        content
    )
    
    # Rechnungspositionen (special case with button)
    content = re.sub(
        r'(<div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">)\s*<div className="flex justify-between items-center">\s*<h3 className="font-semibold text-lg text-gray-800">Rechnungspositionen</h3>',
        r'\1 data-section="rechnungspositionen">\n              <div className={`flex justify-between items-center transition-all duration-200 ${activeSection === \'rechnungspositionen\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}>\n                  <h3 className="font-semibold text-lg text-gray-800">Rechnungspositionen</h3>',
        content
    )
    
    # Gesamtbeträge
    content = re.sub(
        r'(<div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Gesamtbeträge</h3>',
        r'\1 data-section="gesamtbetraege">\n            <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'gesamtbetraege\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}>\n              Gesamtbeträge\n            </h3>',
        content
    )
    
    # Zahlungsinformationen
    content = re.sub(
        r'(<div className="space-y-4 p-5 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">)\s*<h3 className="font-semibold text-lg text-gray-800">Zahlungsinformationen</h3>',
        r'\1 data-section="zahlungsinformationen">\n              <h3 className={`font-semibold text-lg text-gray-800 transition-all duration-200 ${activeSection === \'zahlungsinformationen\' ? \'sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-2 -mx-5 px-5 shadow-sm\' : \'\'}`}>\n                Zahlungsinformationen\n              </h3>',
        content
    )
    
    # Write the updated content back to the file
    with open('src/App.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ Updated all block containers with sticky headers")
    print("✅ Sticky headers implementation completed!")

if __name__ == "__main__":
    update_app_js()

