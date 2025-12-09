const fs = require('fs');

// Read the server.js file
let content = fs.readFileSync('server.js', 'utf8');

// Find the specific section and add setDatabase before initialize
const targetLine = 'priceTracker.initialize(fastify.server);';
const replacement = 'priceTracker.setDatabase(db);\n    priceTracker.initialize(fastify.server);';

if (content.includes(targetLine)) {
  content = content.replace(targetLine, replacement);
  fs.writeFileSync('server.js', content);
  console.log('✅ PriceTracker database connection fixed!');
} else {
  console.log('❌ Could not find the target line');
  console.log('Looking for:', targetLine);
}
