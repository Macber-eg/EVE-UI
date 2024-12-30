import { z } from 'zod';

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  API_URL: z.string().url('Invalid API URL').optional(),
});

export class ConfigService {
  private static instance: ConfigService;
  private config: z.infer<typeof ConfigSchema>;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig() {
    const config = {
      NODE_ENV: import.meta.env.MODE,
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      API_URL: import.meta.env.VITE_API_URL,
    };

    const result = ConfigSchema.safeParse(config);

    if (!result.success) {
      if (import.meta.env.DEV) {
        console.warn('Config validation errors:', result.error.errors);
        return config;
      }
      throw new Error('Invalid configuration');
    }

    return result.data;
  }

  get<K extends keyof z.infer<typeof ConfigSchema>>(key: K) {
    return this.config[key];
  }
}