import { DatabaseError } from './database-error';

export class ConnectionError extends DatabaseError {
  constructor(message = 'Database connection failed') {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}