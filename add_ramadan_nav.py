import os
import re

def update_nav(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if Ramadan Iftar is already in the menu
    if 'iftar-experience-aqaba.html' in content:
        return False

    # Define the link to add
    ramadan_link = '          <a href="iftar-experience-aqaba.html" role="menuitem">Ramadan Iftar</a>\n'
    
    # Pattern for dropdown content
    dropdown_pattern = r'(<div [^>]*class="dropdown-content"[^>]*>)(.*?)(</div>)'
    
    def add_link(match):
        prefix = match.group(1)
        inner = match.group(2)
        suffix = match.group(3)
        
        # Check if it's using role="menuitem" or not
        if 'role="menuitem"' in inner:
            link = '          <a href="iftar-experience-aqaba.html" role="menuitem">Ramadan Iftar</a>\n'
        else:
            link = '          <a href="iftar-experience-aqaba.html">Ramadan Iftar</a>\n'
            
        # Add the link at the end of the dropdown content
        new_inner = inner.rstrip() + '\n' + link
        return prefix + new_inner + suffix

    new_content = re.sub(dropdown_pattern, add_link, content, flags=re.DOTALL)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
updated_count = 0
for html_file in html_files:
    if update_nav(html_file):
        updated_count += 1
        print(f"Updated {html_file}")

print(f"Total updated: {updated_count}")
