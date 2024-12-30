export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // Handle network errors
      if (error.message.includes('Network Error')) {
        return new AppError(
          'Unable to connect to the server. Please check your internet connection.',
          'NETWORK_ERROR',
          0
        );
      }

      // Handle timeout errors
      if (error.message.includes('timeout')) {
        return new AppError(
          'Request timed out. Please try again.',
          'TIMEOUT_ERROR',
          408
        );
      }

      // Handle CORS errors
      if (error.message.includes('CORS')) {
        return new AppError(
          'Cross-origin request blocked. Please try again later.',
          'CORS_ERROR',
          0
        );
      }

      return new AppError(error.message, 'UNKNOWN_ERROR');
    }

    return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}

export const handleError = (error: unknown): AppError => {
  console.error('Error:', error);
  const appError = AppError.fromError(error);
  
  // Log error to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Add error monitoring service integration
  }
  
  return appError;
};

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    // Consider errors with status codes < 500 as operational
    return error.statusCode < 500;
  }
  return false;
};