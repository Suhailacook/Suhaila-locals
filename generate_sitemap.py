
import os
from datetime import datetime

def generate_sitemap():
    base_url = "https://suhailacook.github.io/Suhaila-locals/"
    files = [f for f in os.listdir('.') if f.endswith('.html') and 'google' not in f and 'Product.html' not in f]

    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for file in files:
        # Get the last modification time of the file
        last_mod_timestamp = os.path.getmtime(file)
        last_mod_date = datetime.fromtimestamp(last_mod_timestamp).strftime('%Y-%m-%d')

        sitemap_content += '    <url>\n'
        sitemap_content += f'        <loc>{base_url}{file}</loc>\n'
        sitemap_content += f'        <lastmod>{last_mod_date}</lastmod>\n'
        sitemap_content += '        <changefreq>monthly</changefreq>\n' 
        sitemap_content += '        <priority>0.8</priority>\n' 
        sitemap_content += '    </url>\n'

    sitemap_content += '</urlset>\n'

    with open('sitemap.xml', 'w') as f:
        f.write(sitemap_content)

    print("Sitemap generated successfully!")

generate_sitemap()
