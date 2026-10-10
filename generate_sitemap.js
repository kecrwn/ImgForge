const fs = require('fs');
const path = require('path');

// Extract tools from src/config/tools.ts
const toolsFile = fs.readFileSync(path.join(__dirname, 'src/config/tools.ts'), 'utf-8');

const slugs = [];
const regex = /slug:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(toolsFile)) !== null) {
  slugs.push(match[1]);
}

const baseUrl = 'https://imgforge.com';
const lastmod = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

const addUrl = (url, priority) => {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${baseUrl}${url}</loc>\n`;
  sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
  sitemap += `    <changefreq>weekly</changefreq>\n`;
  sitemap += `    <priority>${priority}</priority>\n`;
  sitemap += `  </url>\n`;
}

// Static routes
addUrl('/', '1.0');
addUrl('/tools', '0.9');
addUrl('/compress', '0.8');
addUrl('/resize', '0.8');
addUrl('/convert', '0.8');
addUrl('/pdf-tools', '0.8');
addUrl('/edit', '0.8');
addUrl('/about', '0.5');
addUrl('/privacy', '0.5');
addUrl('/terms', '0.5');
addUrl('/contact', '0.5');

// Tool routes
for (const slug of slugs) {
  addUrl(`/tool/${slug}`, '0.7');
}

sitemap += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public/sitemap.xml'), sitemap);
console.log('Generated sitemap.xml with ' + (11 + slugs.length) + ' URLs');
