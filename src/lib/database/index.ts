// src/lib/database/index.ts
import { initializeDatabase } from './initialize';
import { dbConnection } from './connection';
export type { Database, DatabaseConfig } from './types';

export const DatabaseInstance = {  
  async testConnection() {
    try {
      const client = await dbConnection();
      const result = await client.query('SELECT 1');
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  },
  // ... your database related logic ... 
};

async function main() {
  await initializeDatabase();
}

main();