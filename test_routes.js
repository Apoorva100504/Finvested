// test_routes.js
import Fastify from 'fastify';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testRoutes() {
  const fastify = Fastify({ 
    logger: { level: 'error' } // Suppress logs for testing
  });

  try {
    // Register your routes
    const usersRoute = await import('./routes/users.js');
    const walletRoute = await import('./routes/wallet.js');
    
    fastify.register(usersRoute);
    fastify.register(walletRoute);

    // Test if routes load without syntax errors
    await fastify.ready();
    
    console.log('✅ All routes loaded successfully');
    console.log('Registered routes:');
    
    fastify.routes.forEach(route => {
      console.log(`  ${route.method} ${route.url}`);
    });

    await fastify.close();
    
  } catch (error) {
    console.error('❌ Route loading error:', error.message);
    process.exit(1);
  }
}

testRoutes();