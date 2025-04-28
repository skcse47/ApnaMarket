const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Authentication Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/register')
        .send(testUser)
        .expect(201);

      // Check response
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body.role).toBe('user');

      // Check cookie
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('token=');

      // Check database
      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(testUser.name);
    });

    it('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/register')
        .send(testUser);

      // Try to register again with same email
      const res = await request(app)
        .post('/api/register')
        .send(testUser)
        .expect(400);

      expect(res.body.error).toContain('already in use');
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post('/api/register')
        .send(testUser);
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      // Check response
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body).not.toHaveProperty('password');

      // Check cookie
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('token=');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.error).toContain('Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);

      expect(res.body.error).toContain('Invalid email or password');
    });
  });
});
