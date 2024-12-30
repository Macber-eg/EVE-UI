import { dbConnection } from './connection';
import { supabase } from '../supabase';

export async function testConnection(): Promise<{
  success: boolean;
  error?: string;
  version?: string;
}> {
  try {
    // Test RPC call
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        error: 'Failed to connect to database'
      };
    }

    console.debug('Connected to database version:', data);
    return { 
      success: true,
      version: data
    };
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}