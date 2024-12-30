import { rest } from 'msw';

export const handlers = [
  // Auth handlers
  rest.post('/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: '123',
          email: 'test@example.com'
        },
        token: 'fake-jwt-token'
      })
    );
  }),

  // Company handlers
  rest.get('/api/companies/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        name: 'Test Company',
        type: 'corporation',
        status: 'active'
      })
    );
  }),

  // EVE handlers
  rest.get('/api/eves', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'Atlas',
          role: 'Chief EVE™ Orchestrator',
          status: 'active'
        }
      ])
    );
  })
];