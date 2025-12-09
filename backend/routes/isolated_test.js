export default async function isolatedTestRoutes(fastify, options) {
    console.log('🔧 isolated_test.js loaded');
    
    // Simple GET route without any dependencies
    fastify.get('/isolated-test', async (request, reply) => {
        console.log('🔧 isolated-test route called');
        return { 
            success: true, 
            message: 'Isolated test works!',
            timestamp: new Date().toISOString()
        };
    });
    
    // Simple POST route
    fastify.post('/isolated-email-test', async (request, reply) => {
        console.log('🔧 isolated-email-test route called');
        return { 
            success: true, 
            message: 'Isolated email test works!',
            timestamp: new Date().toISOString()
        };
    });
    
    console.log('🔧 Isolated routes registered');
}
