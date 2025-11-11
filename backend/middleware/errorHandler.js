// middleware/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ErrorHandler {
  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  handleError(error, request, reply) {
    const { statusCode = 500, message, errorCode } = error;

    // Log error
    request.log.error({
      error: {
        message: error.message,
        stack: error.stack,
        code: errorCode,
        url: request.url,
        method: request.method,
        ip: request.ip
      }
    });

    // Send error response
    const errorResponse = {
      success: false,
      error: {
        code: errorCode || 'INTERNAL_ERROR',
        message: statusCode === 500 ? 'Internal server error' : message,
        timestamp: new Date().toISOString()
      }
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = error.stack;
    }

    reply.status(statusCode).send(errorResponse);
  }

  // Validation error handler
  handleValidationError(error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return new AppError('Validation failed', 400, 'VALIDATION_ERROR', { errors });
  }

  // Database error handler
  handleDatabaseError(error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return new AppError('Resource already exists', 409, 'DUPLICATE_RESOURCE');
    }
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return new AppError('Referenced resource not found', 404, 'FOREIGN_KEY_VIOLATION');
    }
    return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
  }

  // Authentication error handler
  handleAuthError() {
    return new AppError('Authentication failed', 401, 'AUTHENTICATION_FAILED');
  }

  // Authorization error handler
  handleAuthorizationError() {
    return new AppError('Access denied', 403, 'AUTHORIZATION_FAILED');
  }

  // Rate limit error handler
  handleRateLimitError() {
    return new AppError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export const errorHandler = new ErrorHandler();
export { AppError };