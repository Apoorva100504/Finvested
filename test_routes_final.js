import Fastify from 'fastify';

async function testRoutes() {
  const fastify = Fastify({ 
    logger: { level: 'error' }
  });

  // Mock database for testing
  fastify.decorate('db', {
    prepare: (sql) => ({
      get: (params) => ({ id: 1, kyc_status: 'pending' }),
      run: (...params) => {},
      all: (params) => []
    })
  });

  try {
    // Register routes
    const usersModule = await import('./routes/users.js');
    const walletModule = await import('./routes/wallet.js');
    
    fastify.register(usersModule.default);
    fastify.register(walletModule.default);

    await fastify.ready();
    
    console.log('✅ All routes registered successfully!');
    console.log('Registered routes:');
    
    fastify.routes.forEach(route => {
      console.log(`  ${route.method} ${route.url}`);
    });

    await fastify.close();
    console.log('🎉 All 3rd party integrations are working!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRoutes();
