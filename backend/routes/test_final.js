export default async function testFinalRoutes(fastify, options) {
    console.log("🔧 test_final.js loaded");
    
    fastify.get('/final-test-route', async (request, reply) => {
        console.log("🔧 final-test-route called");
        return {
            success: true,
            message: 'Final test route works!',
            timestamp: new Date().toISOString()
        };
    });
    
    console.log("🔧 test_final routes registered");
}
