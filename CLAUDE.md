@AGENTS.md

## Backend Task Checklists — Testing Requirement

When working with backend task checklists in `docs/superpowers/specs/`, you MUST follow this rule before checking off ANY item:

> **Before marking a checkbox complete, you MUST run Playwright tests for that feature and verify `npm run build` returns no build errors.**

### The Rule
1. Implement the feature or fix
2. Run `npm run build` — must complete with **zero errors**
3. Run Playwright tests covering that feature — must pass
4. Only THEN check the box

### Why This Matters
Checklists in `docs/superpowers/specs/` represent production readiness gates. An item is only truly complete when:
- The code compiles without errors
- The feature works correctly (Playwright verification)
- No regressions were introduced

### Shortcut: Verify Before You Check
When you see an unchecked box, don't just write the code — test it first. If you implement a feature and the build fails, the box stays unchecked. If you implement a feature and it works but breaks something else, the box stays unchecked until everything is green.

### Playwright Integration
Use the Playwright MCP tools to:
- `mcp__playwright__navigate` — open the relevant page
- `mcp__playwright__click` — interact with UI elements
- `mcp__playwright__evaluate` — check DOM state
- `mcp__playwright__screenshot` — visually verify the result

For API features, use `mcp__playwright__request` or direct API testing to verify endpoint behavior.