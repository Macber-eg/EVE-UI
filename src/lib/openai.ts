import OpenAI from 'openai';
import { z } from 'zod';

const apiKeySchema = z.string().min(1, 'OpenAI API key is required');

export class OpenAIService {
  private static instance: OpenAIService | null = null;
  private client: OpenAI | null = null;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  private constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      this.initialize(apiKey);
    }
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public initialize(apiKey: string): void {
    try {
      apiKeySchema.parse(apiKey);
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
        maxRetries: this.maxRetries,
        timeout: 30000,
      });
      console.debug('OpenAI client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw new Error('Invalid API key format');
    }
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === this.maxRetries || !this.isRetryableError(error)) {
          throw this.formatError(error);
        }
        
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        console.warn(`OpenAI API retry attempt ${attempt} of ${this.maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  private isRetryableError(error: any): boolean {
    return (
      error?.status === 429 || // Rate limit
      error?.status >= 500 || // Server errors
      error?.message?.includes('timeout') ||
      error?.message?.includes('network') ||
      error?.message?.includes('connection') ||
      error?.message?.includes('ECONNRESET')
    );
  }

  private formatError(error: any): Error {
    let message = 'OpenAI Error: ';
    
    if (error?.response?.data?.error?.message) {
      message += error.response.data.error.message;
    } else if (error?.message?.includes('timeout')) {
      message += 'Request timed out. Please try again.';
    } else if (error?.message?.includes('network') || error?.message?.includes('connection')) {
      message += 'Connection error. Please check your internet connection and try again.';
    } else if (error?.message) {
      message += error.message;
    } else {
      message += 'An unexpected error occurred';
    }

    console.error('OpenAI API error:', error);
    return new Error(message);
  }

  public async chat<T = string>(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    onProgress?: (chunk: string) => void,
    expectJson: boolean = false
  ): Promise<T> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized');
    }

    return this.retryOperation(async () => {
      console.debug('Sending chat request to OpenAI:', 
        messages.map(m => ({ role: m.role, content: m.content.substring(0, 100) + '...' }))
      );

      const response = await this.client!.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
        response_format: expectJson ? { type: "json_object" } : undefined
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response received from OpenAI');
      }

      console.debug('Received OpenAI response:', content.substring(0, 100) + '...');

      if (expectJson) {
        try {
          return JSON.parse(content) as T;
        } catch (error) {
          console.error('Failed to parse JSON response:', content);
          throw new Error('Invalid JSON response from OpenAI');
        }
      }

      return content as T;
    });
  }

  public isInitialized(): boolean {
    return !!this.client;
  }
}