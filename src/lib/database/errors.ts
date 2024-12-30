export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message = 'Database connection failed') {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}