import request from 'supertest';
import app from '../src/server';
import { prisma } from '../src/utils/prisma';

jest.setTimeout(10000);

describe('Posts API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Clean database
    await prisma.session.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Register a user for testing
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Author',
        email: 'author@example.com',
        password: 'password123'
      });

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/posts', () => {
    it('should return empty array when no posts', async () => {
      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return published posts', async () => {
      // Create a published post
      await prisma.post.create({
        data: {
          title: 'Published Post',
          content: 'This is published',
          published: true,
          authorId: userId
        }
      });

      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Published Post');
      expect(response.body[0].published).toBe(true);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid auth', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'This is a test post',
          published: true
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Post');
      expect(response.body.authorId).toBe(userId);
    });

    it('should reject post creation without auth', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'This is a test post'
        });

      expect(response.status).toBe(401);
    });
  });
});