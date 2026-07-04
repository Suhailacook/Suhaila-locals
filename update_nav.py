import os
import re

def update_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove online related links from any dropdown content
    # Look for links to cookingclass-online.html and online-booking.html inside any div
    # but specifically those that look like they are in a dropdown
    
    # Remove cookingclass-online.html links
    new_content = re.sub(r'<a [^>]*href="cookingclass-online\.html"[^>]*>.*?</a>\s*', '', content)
    # Remove online-booking.html links IF they are inside a dropdown-content div
    # We'll do this more carefully to not remove the new top-level link
    
    dropdown_content_pattern = r'(<div [^>]*class="dropdown-content"[^>]*>)(.*?)(</div>)'
    def clean_dropdown(match):
        prefix = match.group(1)
        inner = match.group(2)
        suffix = match.group(3)
        inner = re.sub(r'<a [^>]*href="online-booking\.html"[^>]*>.*?</a>\s*', '', inner)
        return prefix + inner + suffix
    
    new_content = re.sub(dropdown_content_pattern, clean_dropdown, new_content, flags=re.DOTALL)

    # 2. Add "Online Experience" tab if it doesn't exist
    if 'Online Experience' not in new_content:
        # Find the end of the Experiences dropdown container
        # It can be <div class="dropdown">...</div> or similar
        dropdown_container_pattern = r'(<div [^>]*class="dropdown"[^>]*>.*?</div>\s*)'
        if re.search(dropdown_container_pattern, new_content, flags=re.DOTALL):
            new_content = re.sub(dropdown_container_pattern, r'\1<a href="online-booking.html">Online Experience</a>\n', new_content, flags=re.DOTALL, count=1)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
updated_count = 0
for html_file in html_files:
    if update_html(html_file):
        updated_count += 1
        print(f"Updated {html_file}")

print(f"Total updated: {updated_count}")
