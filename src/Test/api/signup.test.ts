import request from 'supertest';
import app from '../../app.js';
import { tool } from '../../utils/tool.js';
import { Database } from '../../Database/data-source.js';
import { testHelper } from '../testUtils/testHelper.js';

describe('POST /api/1.0/user/signup', () => {
  beforeAll(async () => {
    await Database.query('DROP DATABASE IF EXISTS test_db; CREATE DATABASE test_db;');
    if (!Database.isInitialized) await Database.initialize();
    await testHelper.clearDatabase(Database);
  });

  afterAll(async () => {
    await Database.destroy();
    console.log('Database destroyed');
  });
  it('should register a user successfully', async () => {
    const hashedPassword = await tool.generateHashPassword('test');
    const response = await request(app).post('/api/1.0/user/signup').send({
      name: 'test',
      lifeRole: 'test',
      gender: 1,
      birthday: "12/11/1981",
      email: 'test@test.com',
      password: hashedPassword,
      links: [{
          type: "facebook",
          url: "https://test.com"
      }]
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('should not allow duplicate email', async () => {
    const hashedPassword = await tool.generateHashPassword('test');
    const response = await request(app).post('/api/1.0/user/signup').send({
      name: 'test',
      lifeRole: 'test',
      gender: 1,
      birthday: "12/11/1981",
      email: 'test@test.com',
      password: hashedPassword,
      links: [{
          type: "facebook",
          url: "https://test.com"
      }]
    });
    expect(response.status).toBe(403);
  });
});
