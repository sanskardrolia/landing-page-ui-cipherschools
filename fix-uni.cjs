const fs = require('fs');

// --- Fix Testimonials ---
let testCss = fs.readFileSync('./src/components/Testimonials.css', 'utf8');
// Remove the overriding var(--card-bg)
testCss = testCss.replace(/background-color: var\(--card-bg\);\n/g, '');
// Make sure .section-subtitle inside testimonials is light
testCss += '\n.testimonials .section-subtitle { color: rgba(255,255,255,0.7); }\n';
fs.writeFileSync('./src/components/Testimonials.css', testCss);

let testJsx = fs.readFileSync('./src/components/Testimonials.jsx', 'utf8');
// The h2 style was forced to #fff, we can keep it or remove it if .testimonials sets color: #fff and section-title inherits
// .section-title in index.css has color: var(--text-primary). So inline style is needed or CSS override.
testCss = fs.readFileSync('./src/components/Testimonials.css', 'utf8');
testCss += '\n.testimonials .section-title { color: #fff; }\n';
fs.writeFileSync('./src/components/Testimonials.css', testCss);
testJsx = testJsx.replace(/ style={{color: "#fff"}}/g, ''); // clean up
fs.writeFileSync('./src/components/Testimonials.jsx', testJsx);


// --- Fix ForUniversities (Invert to Light Mode) ---
let uniJsx = fs.readFileSync('./src/components/ForUniversities.jsx', 'utf8');
uniJsx = uniJsx.replace(/cred-dark-section/g, '');
uniJsx = uniJsx.replace(/text-white/g, ''); // remove white text overrides
uniJsx = uniJsx.replace(/cred-subtitle/g, 'text-muted'); // Use text-muted instead of cred-subtitle
fs.writeFileSync('./src/components/ForUniversities.jsx', uniJsx);

let uniCss = fs.readFileSync('./src/components/ForUniversities.css', 'utf8');
// Remove dark background
uniCss = uniCss.replace(/background-color: #050505; \/\* Deep dark for enterprise \*\//g, 'background-color: var(--bg-color);');
// Invert mesh gradient to be visible on light
uniCss = uniCss.replace(/hsla\(38, 100%, 51%, 0\.1\)/g, 'hsla(38, 100%, 51%, 0.05)');
uniCss = uniCss.replace(/hsla\(210, 100%, 56%, 0\.05\)/g, 'hsla(210, 100%, 56%, 0.03)');

// Invert glass cards
uniCss = uniCss.replace(/background: rgba\(255, 255, 255, 0\.03\);/g, 'background: rgba(0, 0, 0, 0.02);');
uniCss = uniCss.replace(/border: 1px solid rgba\(255, 255, 255, 0\.05\);/g, 'border: 1px solid rgba(0, 0, 0, 0.05);');

// program item hover
uniCss = uniCss.replace(/background: rgba\(255, 255, 255, 0\.08\);/g, 'background: rgba(0, 0, 0, 0.05);');
uniCss = uniCss.replace(/border-color: rgba\(255, 161, 3, 0\.2\);/g, 'border-color: rgba(255, 161, 3, 0.3);');

// Enterprise UI Panel
uniCss = uniCss.replace(/\.enterprise-ui \{\n  padding: 2\.5rem;\n  transform: rotateY\(5deg\) rotateX\(2deg\);\n\}/g, 
  '.enterprise-ui {\n  padding: 2.5rem;\n  transform: rotateY(5deg) rotateX(2deg);\n  background: rgba(255, 255, 255, 0.9);\n  border: 1px solid rgba(0,0,0,0.1);\n  box-shadow: 0 10px 30px rgba(0,0,0,0.05);\n}');

uniCss = uniCss.replace(/box-shadow: 0 30px 60px rgba\(0,0,0,0\.6\), 0 0 40px rgba\(255,161,3,0\.1\);/g, 
  'box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(255,161,3,0.1);');

// Enterprise Header
uniCss = uniCss.replace(/border-bottom: 1px solid rgba\(255, 255, 255, 0\.1\);/g, 'border-bottom: 1px solid rgba(0, 0, 0, 0.1);');

// Stat Box Hover
uniCss = uniCss.replace(/background: rgba\(255, 255, 255, 0\.05\);/g, 'background: rgba(0, 0, 0, 0.03);');
uniCss = uniCss.replace(/border-color: rgba\(255, 255, 255, 0\.1\);/g, 'border-color: rgba(0, 0, 0, 0.05);');

// Workflow Diagram Nodes
uniCss = uniCss.replace(/color: rgba\(255,255,255,0\.5\);/g, 'color: var(--text-secondary);');
uniCss = uniCss.replace(/color: #fff;\n  text-shadow: 0 0 10px rgba\(255,255,255,0\.5\);/g, 'color: var(--text-primary); text-shadow: none;');
uniCss = uniCss.replace(/text-shadow: 0 0 15px rgba\(255,161,3,0\.5\);/g, 'text-shadow: none;');
uniCss = uniCss.replace(/color: rgba\(255,255,255,0\.2\);/g, 'color: rgba(0,0,0,0.1);');

// text-muted global helper if not exists
if (!uniCss.includes('.text-muted')) {
  uniCss += '\n.text-muted { color: var(--text-secondary); }\n';
}

fs.writeFileSync('./src/components/ForUniversities.css', uniCss);
console.log('Fixes applied successfully.');
