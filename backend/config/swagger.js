// config/swagger.js
export const swaggerConfig = {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Finvested Stock Trading Platform API',
      description: 'Complete backend API for stock trading platform',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true
};