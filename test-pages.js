const { chromium } = require('playwright');

const routes = [
"/",
"/404",
"/500",
"/503",
"/about",
"/active-session/<id>",
"/active-session/<id>/extend",
"/admin-proposals",
"/agent-unavailable",
"/agent/<id>",
"/agent/<id>/analytics",
"/agent/<id>/reviews",
"/analytics",
"/api-keys",
"/audit-queue",
"/audit-queue/<id>",
"/audit-queue/<id>/history",
"/blog",
"/blog-not-found",
"/blog/<slug>",
"/browse",
"/browse-agents",
"/browse-agents/<id>",
"/browse/empty",
"/budget",
"/budget/manage",
"/builder-analytics",
"/builder-analytics/quality",
"/builder-analytics/revenue",
"/builder-earnings",
"/builder-earnings/empty",
"/builder-home",
"/builder-landing",
"/builder-onboarding",
"/builder-settings",
"/builder/agent-creation",
"/builder/complete",
"/builder/onboarding-hub",
"/builder/role-selection",
"/builder/stake-setup",
"/builder/wallet-connect",
"/client-landing",
"/client-onboarding",
"/client-settings",
"/client-settings/alerts",
"/client-settings/budget",
"/client/budget-setup",
"/client/complete",
"/client/first-session",
"/client/onboarding-hub",
"/client/role-selection",
"/client/wallet-connect",
"/compare",
"/compare/empty",
"/complete",
"/connected-apps",
"/connection-lost",
"/contact",
"/cookies",
"/create-agent",
"/dashboard",
"/delegate/<id>",
"/delegation",
"/delegation/analytics",
"/delegation/empty",
"/dispute-lost",
"/disputes",
"/disputes/<id>",
"/docs/api",
"/docs/api/endpoints",
"/docs/api/sdks",
"/docs/changelog",
"/docs/faq",
"/docs/getting-started",
"/docs/glossary",
"/docs/sdk",
"/docs/troubleshooting",
"/docs/tutorials",
"/docs/tutorials/build-first-agent",
"/docs/tutorials/create-skill",
"/docs/tutorials/governance-proposal",
"/docs/tutorials/provider-node",
"/earnings/export",
"/earnings/forecast",
"/earnings/payouts",
"/edit-agent/<id>",
"/emergency-stop",
"/favorites",
"/flagged-agents",
"/flagged-users",
"/forbidden",
"/genesis",
"/genesis/builder",
"/genesis/faq",
"/genesis/how-to-join",
"/genesis/provider",
"/genesis/terms",
"/governance",
"/governance-analytics",
"/how-it-works",
"/launcher",
"/launcher/loading",
"/learning-logs",
"/learning-logs/<id>",
"/learning-logs/pending",
"/maintenance",
"/moderation",
"/my-agents",
"/my-agents/<id>/learning",
"/my-agents/<id>/versions",
"/my-agents/empty",
"/my-skills",
"/my-skills/<id>/analytics",
"/my-skills/<id>/version",
"/my-skills/empty",
"/no-agents",
"/no-earnings",
"/no-notifications",
"/no-proposals",
"/no-sessions",
"/no-transactions",
"/node",
"/node/configuration",
"/node/diagnostics",
"/node/logs",
"/not-found",
"/notifications",
"/notifications/settings",
"/parameters",
"/payments",
"/payments/<id>",
"/payments/empty",
"/pending-reviews",
"/preferences",
"/privacy",
"/profile",
"/proposal/<id>",
"/proposals",
"/proposals/<id>/debate",
"/proposals/<id>/vote",
"/proposals/create",
"/provider-earnings",
"/provider-earnings/empty",
"/provider-home",
"/provider-landing",
"/provider-onboarding",
"/provider-settings",
"/provider/agent-creation",
"/provider/cli-install",
"/provider/complete",
"/provider/first-session",
"/provider/onboarding-hub",
"/provider/role-selection",
"/provider/stake-setup",
"/provider/wallet-connect",
"/publish",
"/rate-limited",
"/refunds",
"/security",
"/session-failed",
"/session-history",
"/session-history/<id>",
"/session-terminated",
"/session-timeout",
"/sessions",
"/sessions/empty",
"/sessions/loading",
"/settings",
"/settings/account",
"/settings/api-keys",
"/settings/appearance",
"/settings/ci-cd",
"/settings/cli-update",
"/settings/connected-apps",
"/settings/data",
"/settings/delegation",
"/settings/integrations",
"/settings/notifications",
"/settings/security",
"/skill-audit",
"/skill-audit/<id>",
"/skill/<id>",
"/skill/<id>/dependencies",
"/skill/<id>/integration",
"/skill/<id>/versions",
"/slash-events",
"/stake",
"/stake-insufficient",
"/stake-manager",
"/stake-manager/empty",
"/stake-manager/loading",
"/status",
"/terms",
"/transaction-history",
"/treasury",
"/trending",
"/unauthorized",
"/user-search",
"/voting-history",
"/wallet-connection-failed",
"/welcome"
];

async function testRoutes() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = { ok: [], failed: [] };

  for (const route of routes) {
    const url = `http://localhost:3000${route.replace('<id>', 'test-id').replace('<slug>', 'test-slug')}`;
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
      const status = response ? response.status() : 0;
      const title = await page.title();

      if (status === 200 || status === 304) {
        results.ok.push({ route, status, title });
        process.stdout.write('.');
      } else {
        results.failed.push({ route, status, title });
        process.stdout.write('F');
      }
    } catch (e) {
      results.failed.push({ route, error: e.message.substring(0, 50) });
      process.stdout.write('E');
    }
  }

  await browser.close();

  console.log('\n\n=== RESULTS ===');
  console.log(`OK: ${results.ok.length}`);
  console.log(`FAILED: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFAILED ROUTES:');
    results.failed.forEach(f => {
      console.log(`  ${f.route} - ${f.status || f.error}`);
    });
  }

  return results;
}

testRoutes().catch(console.error);