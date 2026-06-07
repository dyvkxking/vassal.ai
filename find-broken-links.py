import os
import re

# Get all actual routes from folder structure
actual_routes = set()
for root, dirs, files in os.walk('src/app'):
    if 'page.tsx' in files:
        path = root.replace('src/app', '').replace('\\', '/')
        # Remove route groups like (name)
        clean_path = re.sub(r'/\([^)]+\)', '', path)
        # Convert to URL
        url = clean_path.replace('/[', '/').replace(']', '').replace('//', '/').rstrip('/')
        if url:
            actual_routes.add(url)

# Add root
actual_routes.add('')

print(f"Found {len(actual_routes)} actual routes")
for r in sorted(actual_routes)[:30]:
    print(f"  /{r}")

# Find all links in pages
broken_links = []
for root, dirs, files in os.walk('src/app'):
    for f in files:
        if f.endswith('.tsx'):
            filepath = os.path.join(root, f)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as file:
                    content = file.read()

                # Find all href patterns
                hrefs = re.findall(r'href=["\']([^"\']+)["\']', content)
                for href in hrefs:
                    if href.startswith('/') and not href.startswith('//'):
                        # Check if it's a valid route
                        clean_href = href.rstrip('/')
                        # Remove query params
                        clean_href_base = clean_href.split('?')[0]

                        # Check various possible matches
                        is_valid = False
                        for route in actual_routes:
                            if clean_href_base == route or \
                               clean_href_base == route + '/page' or \
                               clean_href_base.endswith(route) or \
                               route.endswith(clean_href_base):
                                is_valid = True
                                break

                        # Also check for dynamic routes
                        if '[' in clean_href_base:
                            is_valid = True  # Assume dynamic routes are valid

                        if not is_valid and clean_href_base not in ['/', '/404', '/500']:
                            broken_links.append({
                                'file': filepath.replace('src/app/', ''),
                                'href': href
                            })
            except Exception as e:
                print(f"Error reading {filepath}: {e}")

print(f"\nFound {len(broken_links)} potentially broken links:")
for item in broken_links[:50]:
    print(f"  {item['file']}: {item['href']}")