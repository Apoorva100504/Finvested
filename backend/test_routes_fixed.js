// test_routes_fixed.js
import Fastify from 'fastify';

async function testRoutes() {
  const fastify = Fastify({ 
    logger: { level: 'error' }
  });

  // Mock database and user for testing
  fastify.decorate('db', {
    prepare: (sql) => ({
      get: () => ({}),
      all: () => ([]),
      run: () => ({})
    })
  });

  fastify.decorateRequest('user', {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  });

  try {
    // Register your routes
    const usersRoute = await import('./routes/users.js');
    const walletRoute = await import('./routes/wallet.js');
    
    await fastify.register(usersRoute);
    await fastify.register(walletRoute);

    // Test if routes load without syntax errors
    await fastify.ready();
    
    console.log('✅ All routes loaded successfully');
    console.log('Registered routes:');
    
    // Safe route listing
    const routes = fastify.routes || [];
    routes.forEach(route => {
      console.log(`  ${route.method} ${route.url}`);
    });

    await fastify.close();
    
  } catch (error) {
    console.error('❌ Route loading error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRoutes();
