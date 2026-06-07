import os
import re

# Get all page routes
routes = []
for root, dirs, files in os.walk('src/app'):
    for f in files:
        if f == 'page.tsx':
            path = root.replace('src/app', '').replace('\\', '/')
            # Remove route groups
            path = re.sub(r'/\([^)]+\)', '', path)
            # Handle dynamic routes
            path = re.sub(r'\[([^\]]+)\]', r'<\1>', path)
            path = path.replace('//', '/').rstrip('/')
            routes.append(path if path else '/')

routes = sorted(set(routes))
print(f"Total routes: {len(routes)}")
for r in routes:
    print(r)