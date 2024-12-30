import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from './api-client';
import { server } from '../test/mocks/server';

describe('ApiClient', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('handles successful requests', async () => {
    const client = ApiClient.getInstance();
    const response = await client.get('/api/test');
    expect(response).toBeDefined();
  });

  it('retries failed requests', async () => {
    const client = ApiClient.getInstance();
    server.use(
      rest.get('/api/test', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(client.get('/api/test')).rejects.toThrow();
  });

  it('adds auth token to requests', async () => {
    const client = ApiClient.getInstance();
    localStorage.setItem('token', 'test-token');
    
    const response = await client.get('/api/test');
    expect(response.config.headers.Authorization).toBe('Bearer test-token');
  });

  it('handles network errors', async () => {
    const client = ApiClient.getInstance();
    server.use(
      rest.get('/api/test', (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    await expect(client.get('/api/test')).rejects.toThrow('Network error');
  });
});