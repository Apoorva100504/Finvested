// routes/users.js - Different paths
console.log("🔧 users.js with different paths loaded");

export default async function usersRoutes(fastify, options) {
    console.log("🔧 usersRoutes with different paths executing");
    
    // Use completely different paths
    fastify.get('/user-profile-test', async (request, reply) => {
        console.log("🔧 user-profile-test called");
        return {
            success: true,
            message: 'User profile test works!',
            timestamp: new Date().toISOString()
        };
    });

    fastify.post('/send-test-email-route', async (request, reply) => {
        console.log("🔧 send-test-email-route called");
        return {
            success: true,
            message: 'Send test email route works!',
            timestamp: new Date().toISOString()
        };
    });

    console.log("🔧 Different path routes registered successfully");
}
