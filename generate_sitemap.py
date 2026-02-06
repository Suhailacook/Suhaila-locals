import os
import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Configuration
BASE_URL = "https://suhailacook.github.io/Suhaila-locals/"
REPO_PATH = os.path.dirname(os.path.abspath(__file__))

# Define priorities for key pages
PRIORITIES = {
    "index.html": "1.0",
    "Blog.html": "0.8",
    "Product.html": "0.8",
    "Reservation.html": "0.8",
    "about.html": "0.8",
    "contact-Us.html": "0.8",
    "cookingclass.html": "0.8",
    "dinningexperience.html": "0.8",
    "food-culture.html": "0.8",
    "glassboat.html": "0.8",
    "history-aqaba.html": "0.8",
    "local-experiences.html": "0.8",
    "walkingtour.html": "0.8",
    "recommendations.html": "0.8",
    "multi-day-aqaba-tour.html": "0.8",
}

DEFAULT_PRIORITY = "0.6"
DEFAULT_CHANGEFREQ = "monthly"

def get_html_files(path):
    """Returns a list of HTML files to include in the sitemap."""
    html_files = []
    # Exclude list for files that shouldn't be in the sitemap
    exclude_files = {
        "google0eb8c41ab8997127.html",
        "google97c97fc1504c6768.html",
        "404.html"
    }
    
    for file in os.listdir(path):
        if file.endswith(".html") and file not in exclude_files:
            html_files.append(file)
    return sorted(html_files)

def generate_sitemap():
    """Generates a sitemap.xml file based on the HTML files in the repository."""
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    
    html_files = get_html_files(REPO_PATH)
    
    # Use current date for lastmod
    lastmod = datetime.date.today().isoformat()
    
    for file in html_files:
        url = ET.SubElement(urlset, "url")
        
        # Handle index.html as the root URL
        loc_val = BASE_URL + (file if file != "index.html" else "")
        ET.SubElement(url, "loc").text = loc_val
        ET.SubElement(url, "lastmod").text = lastmod
        ET.SubElement(url, "changefreq").text = DEFAULT_CHANGEFREQ
        ET.SubElement(url, "priority").text = PRIORITIES.get(file, DEFAULT_PRIORITY)

    # Convert to string and pretty print
    xml_str = ET.tostring(urlset, encoding='utf-8')
    reparsed = minidom.parseString(xml_str)
    pretty_xml = reparsed.toprettyxml(indent="    ")
    
    # Write to sitemap.xml with proper header
    sitemap_path = os.path.join(REPO_PATH, "sitemap.xml")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        # Skip the first line of pretty_xml which is the xml declaration from minidom
        lines = pretty_xml.split('\n')
        if lines[0].startswith('<?xml'):
            f.write('\n'.join(lines[1:]))
        else:
            f.write(pretty_xml)

if __name__ == "__main__":
    try:
        generate_sitemap()
        print("Successfully updated sitemap.xml with all current HTML pages.")
    except Exception as e:
        print(f"Error generating sitemap: {e}")
