import re
import datetime
import os

with open('src/config/tools.ts', 'r') as f:
    tools_file = f.read()

slugs = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", tools_file)

base_url = 'https://imgforge.com'
lastmod = datetime.datetime.now().strftime('%Y-%m-%d')

sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

def add_url(url, priority):
    global sitemap
    sitemap += f"  <url>\n"
    sitemap += f"    <loc>{base_url}{url}</loc>\n"
    sitemap += f"    <lastmod>{lastmod}</lastmod>\n"
    sitemap += f"    <changefreq>weekly</changefreq>\n"
    sitemap += f"    <priority>{priority}</priority>\n"
    sitemap += f"  </url>\n"

static_routes = [
    ('/', '1.0'),
    ('/tools', '0.9'),
    ('/compress', '0.8'),
    ('/resize', '0.8'),
    ('/convert', '0.8'),
    ('/pdf-tools', '0.8'),
    ('/edit', '0.8'),
    ('/about', '0.5'),
    ('/privacy', '0.5'),
    ('/terms', '0.5'),
    ('/contact', '0.5'),
]

for url, priority in static_routes:
    add_url(url, priority)

for slug in slugs:
    add_url(f'/tool/{slug}', '0.7')

sitemap += '</urlset>'

os.makedirs('public', exist_ok=True)
with open('public/sitemap.xml', 'w') as f:
    f.write(sitemap)

print(f"Generated sitemap.xml with {len(static_routes) + len(slugs)} URLs")
