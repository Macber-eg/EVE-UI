import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AppError } from '../../core/error/AppError';
import { Logger } from '../../core/logger/Logger';
import { requestInterceptor, responseInterceptor } from '../interceptors';

export class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      requestInterceptor,
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      responseInterceptor,
      error => {
        const appError = AppError.fromError(error);
        this.logger.error('API Error:', appError);
        throw appError;
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client(config);
      return response.data;
    } catch (error) {
      throw AppError.fromError(error);
    }
  }

  async get<T>(url: string, config = {}): Promise<T> {
    return this.request({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: any, config = {}): Promise<T> {
    return this.request({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any, config = {}): Promise<T> {
    return this.request({ ...config, method: 'PUT', url, data });
  }

  async delete<T>(url: string, config = {}): Promise<T> {
    return this.request({ ...config, method: 'DELETE', url });
  }
}