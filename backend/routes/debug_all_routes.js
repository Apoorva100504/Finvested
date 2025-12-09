export default async function debugAllRoutes(fastify, options) {
    fastify.get('/all-routes', async (request, reply) => {
        try {
            const routes = [];
            
            // Get all registered routes
            fastify.routes.forEach(route => {
                routes.push(`${route.method} ${route.url}`);
            });
            
            return {
                success: true,
                totalRoutes: routes.length,
                routes: routes.sort()
            };
        } catch (error) {
            console.error('Error listing routes:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
