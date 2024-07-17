import request from 'supertest';
import app from '../../app.js';
import { Database } from '../../Database/data-source.js';
import { testHelper } from '../testUtils/testHelper.js';

describe('POST /api/1.0/user/signup', () => {
  beforeAll(async () => {
    await Database.initialize();
    await testHelper.clearDatabase(Database);
  });

  afterAll(async () => {
    await Database.destroy();
    console.log('Database destroyed');
  });
  it('should register a user successfully', async () => {
    const response = await request(app).post('/api/1.0/user/signup').send({
      realName: 'test',
      accountName: 'test',
      email: 'test@test.com',
      password: 'test',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('should not allow duplicate email', async () => {
    const response1 = await request(app).post('/api/1.0/user/signup').send({
      realName: 'test',
      accountName: 'test',
      email: 'test@test.com',
      password: 'test',
    });
    const response2 = await request(app).post('/api/1.0/user/signup').send({
      realName: 'test',
      accountName: 'test',
      email: 'test@test.com',
      password: 'test',
    });
    expect(response2.status).toBe(403);
  });
});
