export default async function minimalTestRoutes(fastify, options) {
    console.log('🔧 minimal_test.js loaded');
    
    // Simple route in the same prefix
    fastify.get('/minimal-test', async (request, reply) => {
        console.log('🔧 minimal-test route called');
        return { 
            success: true, 
            message: 'Minimal test works!',
            file: 'minimal_test.js'
        };
    });
    
    console.log('🔧 Minimal routes registered');
}
