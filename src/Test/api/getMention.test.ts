import request from 'supertest';
import app from '../../app.js';
import { testHelper } from '../testUtils/testHelper.js';
import { initMilvus } from '../../Database/VectorDB/vector-db.js';

describe('GET /api/1.0/volume/mention', () => {
  beforeAll(async () => {
    await initMilvus(true);

    await testHelper.createFakeUsersForRecommendation(1);
  }, 10000);

  it('should get all mentions of this week', async () => {
    const response = await request(app).get('/api/1.0/volume/mention').send();

    const mentions = response.body.data;

    expect(Array.isArray(mentions)).toBe(true);
    expect(mentions.length).toBeGreaterThan(0);

    expect(typeof mentions[0].keyword).toBe('string');
    expect(typeof mentions[0].totalCount).toBe('number');
  });
});
