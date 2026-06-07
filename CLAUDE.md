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

## Behavior & Memory Drivers
- **Frontend/Design Source of Truth:** Whenever creating, modifying, styling, or reviewing user interfaces, components, or layout structures, you **MUST** read and strictly adhere to the guidelines, color tokens, layout systems, and 3D viewport rules defined in:
  - `@linear.app/DESIGN.md`

## 3D Web3 Frontend Execution Directives

### 1. Style & Token Compliance
- Do not introduce arbitrary Tailwind CSS classes, inline hex codes, or spacing values. 
- Map all visual properties (backgrounds, borders, layout paddings) to the tokens defined in `linear.app/DESIGN.md`.
- Use the specified background `#08080A` for 3D canvas backgrounds to maintain optimal contrast with WebGL lighting.

### 2. HTML Over-Canvas Layering
- When rendering 3D viewports (Three.js / React Three Fiber), ensure metadata tags, pricing, and buy actions are absolutely positioned layers over the WebGL canvas using the explicit z-index layering outlined in the design spec.

### 3. Asynchronous Web3 UX
- Utilize the specified skeleton pulse shimmer rules from the design file while high-fidelity mesh structures (`.glb` / `.gltf`) stream over RPC network endpoints.