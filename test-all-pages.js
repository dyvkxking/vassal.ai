const { chromium } = require('playwright');

async function getAllRoutes() {
  const routes = [];
  const { execSync } = require('child_process');

  // Get all page.tsx files
  const result = execSync('find src/app -name "page.tsx" -type f', { encoding: 'utf8' });
  const files = result.trim().split('\n');

  for (const file of files) {
    let route = file
      .replace('src/app', '')
      .replace('page.tsx', '')
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');

    if (!route) route = '/';

    // Convert to URL path
    route = route.replace(/^\//, '/');
    if (!route.startsWith('/')) route = '/' + route;

    routes.push(route);
  }

  return [...new Set(routes)];
}

async function testPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const routes = await getAllRoutes();
  console.log(`Testing ${routes.length} routes...\n`);

  const errors = [];
  const checked = [];

  for (const route of routes) {
    try {
      const url = `http://localhost:3000${route}`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

      const status = response ? response.status() : 'no-response';
      const title = await page.title();

      if (status === 404 || title.includes('404')) {
        errors.push({ route, status, title: '404 Not Found' });
      } else if (status >= 500) {
        errors.push({ route, status, title: 'Server Error' });
      } else {
        checked.push({ route, status });
      }

      // Check for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('404')) {
          consoleErrors.push(msg.text());
        }
      });

    } catch (e) {
      errors.push({ route, error: e.message });
    }
  }

  console.log('\n=== RESULTS ===');
  console.log(`Checked: ${checked.length}`);
  console.log(`Errors: ${errors.length}\n`);

  if (errors.length > 0) {
    console.log('BROKEN ROUTES:');
    errors.forEach(e => console.log(`  ${e.route} - ${e.status || e.error}`));
  }

  await browser.close();
  return errors;
}

testPages().catch(console.error);