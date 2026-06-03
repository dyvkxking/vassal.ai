const fs = require('fs');
let data = fs.readFileSync('src/lib/mock-data.ts', 'utf8');

// Fix missing description in output items
data = data.replace(
  /output: \[\{ name: "predictions", type: "array" \}\]/g,
  'output: [{ name: "predictions", type: "array", description: "Classification results" }]'
).replace(
  /output: \[\{ name: "insights", type: "array" \}\]/g,
  'output: [{ name: "insights", type: "array", description: "Key findings from analysis" }]'
).replace(
  /output: \[\{ name: "riskScore", type: "number" \}\]/g,
  'output: [{ name: "riskScore", type: "number", description: "Security score 0-100" }]'
).replace(
  /output: \[\{ name: "openapiSpec", type: "object" \}\]/g,
  'output: [{ name: "openapiSpec", type: "object", description: "OpenAPI 3.0 specification" }]'
).replace(
  /output: \[\{ name: "result", type: "string" \}\]/g,
  'output: [{ name: "result", type: "string", description: "Base64 PNG with transparent background" }]'
).replace(
  /output: \[\{ name: "savingsPotential", type: "number" \}\]/g,
  'output: [{ name: "savingsPotential", type: "number", description: "Estimated monthly savings in USD" }]'
).replace(
  /output: \[\{ name: "overall", type: "object" \}\]/g,
  'output: [{ name: "overall", type: "object", description: "Overall sentiment score and label" }]'
);

fs.writeFileSync('src/lib/mock-data.ts', data);
console.log('Fixed output descriptions');