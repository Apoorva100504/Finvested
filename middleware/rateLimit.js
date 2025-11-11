// middleware/rateLimit.js
export const rateLimitConfig = {
  global: false, // We'll apply per-route
  max: 100, // Maximum number of requests
  timeWindow: '1 minute',
  cache: 10000,
  allowList: ['127.0.0.1'],
  keyGenerator: (request) => {
    return request.user?.id || request.ip;
  },
  errorResponseBuilder: (request, context) => {
    return {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Try again in ${context.after}`,
        retryAfter: context.after
      }
    };
  }
};

// Route-specific rate limits
export const routeRateLimits = {
  '/api/v1/auth/*': {
    max: 5,
    timeWindow: '1 minute'
  },
  '/api/v1/orders/*': {
    max: 30,
    timeWindow: '1 minute'
  },
  '/api/v1/stocks': {
    max: 60,
    timeWindow: '1 minute'
  },
  '/api/v1/websocket': {
    max: 10,
    timeWindow: '1 minute'
  }
};