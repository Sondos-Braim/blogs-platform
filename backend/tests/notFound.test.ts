import request from 'supertest';
import app from '../src/server';

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not Found');
    expect(response.body.message).toContain('not found');
  });

  it('should return 404 for non-existent API endpoints', async () => {
    const response = await request(app)
      .post('/api/invalid-endpoint');

    expect(response.status).toBe(404);
  });
});