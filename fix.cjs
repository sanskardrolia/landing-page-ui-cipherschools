const fs = require('fs');
const path = require('path');

// 1. Fix Border Radius in all CSS files
const srcDir = './src';
const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace all border-radius pixel values with 4px, except small structural ones maybe?
      // Actually the user said "use 4PX border radius for the landing page design components"
      content = content.replace(/border-radius:\s*(?!50%)\d+px;/g, 'border-radius: 4px;');
      content = content.replace(/border-radius:\s*var\(--radius-lg\);/g, 'border-radius: 4px;');
      content = content.replace(/--radius-lg:\s*8px;/g, '--radius-lg: 4px;');
      content = content.replace(/--radius:\s*4px;/g, '--radius: 4px;'); // keep 4px
      
      fs.writeFileSync(fullPath, content);
    }
  }
};
walk(srcDir);

// 2. Fix Alternating Colors
// We need to ensure no two dark sections are back to back.
// Current:
// 1. Hero (Light)
// 2. ImpactBar (Light)
// 3. Ecosystem (Dark - #121212)
// 4. ForStudents (Dark - #0a0a0a) -> Change to Light (#FAFAFA)
// 5. ForUniversities (Dark - #050505)
// 6. ExperienceLayer (Dark - var(--text-primary)) -> Change to Light (#FAFAFA)
// 7. ProductShowcase (Light)
// 8. Testimonials (Light) -> Change to Dark (#232323)
// 9. Footer (Light)

// Update ForStudents to Light
let studentsCss = fs.readFileSync('./src/components/ForStudents.css', 'utf8');
studentsCss = studentsCss.replace(/background-color: #0a0a0a;/g, 'background-color: #FAFAFA;');
studentsCss = studentsCss.replace(/color: #ffffff !important;/g, 'color: var(--text-primary) !important;');
studentsCss = studentsCss.replace(/rgba\(255, 255, 255,/g, 'rgba(0, 0, 0,'); // Invert white glass to black glass
studentsCss = studentsCss.replace(/background: rgba\(20, 20, 20, 0\.6\);/g, 'background: rgba(255, 255, 255, 0.8);'); // Dashboard glass
fs.writeFileSync('./src/components/ForStudents.css', studentsCss);

let studentsJsx = fs.readFileSync('./src/components/ForStudents.jsx', 'utf8');
studentsJsx = studentsJsx.replace(/text-white/g, 'text-primary'); // removing white text overrides
fs.writeFileSync('./src/components/ForStudents.jsx', studentsJsx);

// Update ExperienceLayer to Light
let expCss = fs.readFileSync('./src/components/ExperienceLayer.css', 'utf8');
expCss = expCss.replace(/background-color: var\(--text-primary\);/g, 'background-color: var(--bg-color);');
expCss = expCss.replace(/color: var\(--bg-color\);/g, 'color: var(--text-primary);');
expCss = expCss.replace(/color: #fff;/g, 'color: var(--text-primary);');
expCss = expCss.replace(/color: rgba\(255, 255, 255, 0\.7\);/g, 'color: var(--text-secondary);');
expCss = expCss.replace(/color: rgba\(255, 255, 255, 0\.8\);/g, 'color: var(--text-secondary);');
expCss = expCss.replace(/background: rgba\(255, 255, 255, 0\.05\);/g, 'background: rgba(0, 0, 0, 0.02);');
expCss = expCss.replace(/border: 1px solid rgba\(255, 255, 255, 0\.1\);/g, 'border: 1px solid var(--border-color);');
expCss = expCss.replace(/background: rgba\(255, 255, 255, 0\.03\);/g, 'background: #fff;');
expCss = expCss.replace(/border: 1px solid rgba\(255, 255, 255, 0\.05\);/g, 'border: 1px solid var(--border-color);');
expCss = expCss.replace(/background: rgba\(255, 255, 255, 0\.08\);/g, 'background: #f8f9fa;');
fs.writeFileSync('./src/components/ExperienceLayer.css', expCss);

// Update Testimonials to Dark
let testCss = fs.readFileSync('./src/components/Testimonials.css', 'utf8');
testCss = testCss.replace(/\.testimonials {/g, '.testimonials {\n  background-color: #121212;\n  color: #fff;');
testCss = testCss.replace(/color: var\(--text-primary\);/g, 'color: #fff;');
testCss = testCss.replace(/color: var\(--text-secondary\);/g, 'color: rgba(255,255,255,0.7);');
testCss = testCss.replace(/background-color: var\(--bg-color\);/g, 'background-color: #1e1e1e;');
testCss = testCss.replace(/border-color: var\(--primary-light\);/g, 'border-color: var(--primary);');
testCss = testCss.replace(/background: linear-gradient\(180deg, var\(--bg-color\) 0%, rgba\(255, 161, 3, 0\.03\) 100%\);/g, 'background: linear-gradient(180deg, #1e1e1e 0%, rgba(255, 161, 3, 0.1) 100%);');
fs.writeFileSync('./src/components/Testimonials.css', testCss);

// Update Testimonials JSX to add text-white to title
let testJsx = fs.readFileSync('./src/components/Testimonials.jsx', 'utf8');
testJsx = testJsx.replace(/<h2 className="section-title">/g, '<h2 className="section-title" style={{color: "#fff"}}>');
fs.writeFileSync('./src/components/Testimonials.jsx', testJsx);

console.log('Fixes applied.');
