import { InternalAxiosRequestConfig } from 'axios';
import { securityService } from '../../core/security/SecurityService';

export function requestInterceptor(config: InternalAxiosRequestConfig) {
  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add CSRF token for non-GET requests
  if (config.method !== 'get') {
    config.headers['X-CSRF-Token'] = securityService.getCSRFToken();
  }

  // Sanitize request data
  if (config.data) {
    config.data = securityService.sanitizeObject(config.data);
  }

  return config;
}