const fs = require('fs');
const path = require('path');

const appendCss = (filename, css) => {
  const filePath = path.join(__dirname, 'src', filename);
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, '\n' + css + '\n');
    console.log(`Updated ${filename}`);
  }
};

// 1. index.css global resets
appendCss('index.css', `
@media (max-width: 768px) {
  :root { --section-padding: 3rem 1rem; }
  .container { padding: 0 1.25rem; }
  h1 { font-size: 2.5rem !important; }
  h2 { font-size: 2rem !important; }
  h3 { font-size: 1.5rem !important; }
  .hero-title { font-size: 2.25rem !important; line-height: 1.2; }
  .hero-subtitle { font-size: 1rem !important; }
  .section-title { font-size: 1.75rem !important; }
}
`);

// 2. Hero.css
appendCss('components/Hero.css', `
@media (max-width: 576px) {
  .card-main { width: 95%; height: 300px; }
  .visual-circle { width: 300px; height: 300px; }
  .mockup-body { flex-direction: column; }
  .mockup-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border-color); padding-right: 0; padding-bottom: 1rem; flex-direction: row; }
}
`);

// 3. ForStudents.css
appendCss('components/ForStudents.css', `
@media (max-width: 576px) {
  .students-visual { transform: scale(0.8); height: 400px; margin-top: 0; }
  .features-list { grid-template-columns: 1fr; }
}
`);

// 4. ForUniversities.css
appendCss('components/ForUniversities.css', `
@media (max-width: 576px) {
  .uni-visual { transform: scale(0.85); height: auto; padding: 1rem 0; }
  .enterprise-ui { padding: 1.5rem; }
  .stat-num { font-size: 2rem; }
  .stat-box { padding: 1rem; }
}
`);

// 5. ProductShowcase.css
appendCss('components/ProductShowcase.css', `
@media (max-width: 576px) {
  .product-mockup { height: 280px; }
  .showcase-visual { padding: 0; }
}
`);
