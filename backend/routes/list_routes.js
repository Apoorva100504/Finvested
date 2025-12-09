export default async function listRoutes(fastify, options) {
    fastify.get('/list-all-routes', async (request, reply) => {
        try {
            const routes = [];
            
            // Correct way to get routes in Fastify
            fastify.routes.forEach(route => {
                routes.push(`${route.method} ${route.url}`);
            });
            
            return {
                total: routes.length,
                users_routes: routes.filter(r => r.includes('/users/')),
                all_routes: routes.sort()
            };
        } catch (error) {
            return {
                error: error.message,
                stack: error.stack
            };
        }
    });
}
