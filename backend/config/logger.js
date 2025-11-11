// config/logger.js - Simple version
class SimpleLogger {
  info(message, data = {}) {
    console.log(`[INFO] ${new Date().toISOString()} ${message}`, data);
  }

  error(message, error = null) {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}`, error);
  }

  warn(message, data = {}) {
    console.warn(`[WARN] ${new Date().toISOString()} ${message}`, data);
  }

  debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} ${message}`, data);
    }
  }
}

export const logger = new SimpleLogger();

export const requestLogger = (request, reply, next) => {
  const start = Date.now();
  
  reply.raw.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      user: request.user?.id,
      ip: request.ip
    });
  });
  
  next();
};

export const tradeLogger = (tradeData) => {
  logger.info('Trade executed', tradeData);
};

export const errorLogger = (error, context = {}) => {
  logger.error('Error occurred', { message: error.message, ...context });
};

export const securityLogger = (event, user, details = {}) => {
  logger.warn('Security event', { event, user, ...details });
};