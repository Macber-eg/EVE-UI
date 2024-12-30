import { AxiosResponse } from 'axios';
import { AppError } from '../../core/error/AppError';

export function responseInterceptor(response: AxiosResponse) {
  // Handle successful responses
  return response;
}

export function responseErrorInterceptor(error: any) {
  if (!error.response) {
    // Network error
    throw new AppError(
      'Unable to connect to the server. Please check your internet connection.',
      'NETWORK_ERROR',
      0
    );
  }

  if (error.response.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('token');
    window.location.href = '/auth';
    throw new AppError('Session expired. Please sign in again.', 'AUTH_ERROR', 401);
  }

  throw AppError.fromError(error);
}