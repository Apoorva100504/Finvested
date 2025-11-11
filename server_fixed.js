// This will create the fixed server.js content
// Let me show you the exact lines to change

echo "The fix needs to be applied to lines 169-170 in server.js"
echo "Current lines 169-170:"
sed -n '169,170p' server.js
echo ""
echo "They should become:"
echo "    priceTracker.setDatabase(db);"
echo "    priceTracker.initialize(fastify.server);"
