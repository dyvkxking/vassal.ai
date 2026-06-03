const fs = require('fs');
const data = fs.readFileSync('src/lib/mock-data.ts', 'utf8');

// Fix missing description in parameters
const fixed = data.replace(
  /parameters: \[\{ name: "strict", type: "boolean", default: "false" \}\]/g,
  'parameters: [{ name: "strict", type: "boolean", default: "false", description: "Enable strict validation" }]'
).replace(
  /parameters: \[\{ name: "threshold", type: "number", default: "0.5" \}\]/g,
  'parameters: [{ name: "threshold", type: "number", default: "0.5", description: "Confidence threshold" }]'
).replace(
  /parameters: \[\{ name: "confidence", type: "number", default: "0.95" \}\]/g,
  'parameters: [{ name: "confidence", type: "number", default: "0.95", description: "Confidence level for tests" }]'
).replace(
  /parameters: \[\{ name: "depth", type: "string", default: "standard" \}\]/g,
  'parameters: [{ name: "depth", type: "string", default: "standard", description: "Analysis depth" }]'
).replace(
  /parameters: \[\{ name: "version", type: "string", default: "3.0.0" \}\]/g,
  'parameters: [{ name: "version", type: "string", default: "3.0.0", description: "OpenAPI version" }]'
).replace(
  /parameters: \[\{ name: "edgeSmoothing", type: "boolean", default: "true" \}\]/g,
  'parameters: [{ name: "edgeSmoothing", type: "boolean", default: "true", description: "Apply edge refinement" }]'
).replace(
  /parameters: \[\{ name: "includeReserved", type: "boolean", default: "true" \}\]/g,
  'parameters: [{ name: "includeReserved", type: "boolean", default: "true", description: "Include reserved instance recommendations" }]'
).replace(
  /parameters: \[\{ name: "granularity", type: "string", default: "document" \}\]/g,
  'parameters: [{ name: "granularity", type: "string", default: "document", description: "Analysis level" }]'
);

fs.writeFileSync('src/lib/mock-data.ts', fixed);
console.log('Fixed parameters descriptions');