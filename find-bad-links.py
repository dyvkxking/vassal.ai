import os
import re

# Get all actual URL routes
routes = set()
for root, dirs, files in os.walk('src/app'):
    if 'page.tsx' in files:
        path = root.replace('src/app', '').replace('\\', '/')
        path = re.sub(r'/\([^)]+\)', '', path)
        path = re.sub(r'\[([^\]]+)\]', r'\1', path)
        path = path.replace('//', '/').strip('/')
        if path:
            routes.add('/' + path)
        else:
            routes.add('/')

# Add common variations
routes.add('/404')
routes.add('/500')

broken = []
checked = set()

for root, dirs, files in os.walk('src/app'):
    for f in files:
        if f.endswith('.tsx'):
            fpath = os.path.join(root, f)
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()

                hrefs = re.findall(r'href=["\']([^"\']+)["\']', content)
                for href in hrefs:
                    if href.startswith('/') and not href.startswith('//'):
                        # Normalize
                        normalized = href.split('?')[0].rstrip('/')
                        if normalized not in checked:
                            checked.add(normalized)

                            # Check if valid
                            is_valid = False
                            for route in routes:
                                if normalized == route or normalized == route.rstrip('/'):
                                    is_valid = True
                                    break
                                # Handle dynamic routes
                                if '<' in route and '>' in route:
                                    route_pattern = route.replace('<', '').replace('>', '')
                                    if normalized.startswith(route_pattern) or route.startswith(normalized):
                                        is_valid = True
                                        break

                            if not is_valid and normalized not in ['/', '/404', '/500', '/503']:
                                broken.append((fpath.replace('src/app/', ''), href))
            except:
                pass

print(f"Checked {len(checked)} unique routes")
print(f"Found {len(broken)} broken links:")
for fpath, href in broken[:30]:
    print(f"  {fpath}: {href}")