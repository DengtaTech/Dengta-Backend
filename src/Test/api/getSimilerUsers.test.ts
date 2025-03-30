import request from 'supertest';
import app from '../../app.js';
import { testHelper } from '../testUtils/testHelper.js';
import { RECOMMENDATION_LIMIT } from '../../Config/constants.js';
import { initMilvus } from '../../Database/VectorDB/vector-db.js';

const fakeUserIdsForRecommendation: string[] = [];

describe('GET /api/1.0/recommendation/similar_users', () => {
  beforeAll(async () => {
    await initMilvus(true);

    const newFakeUserIdsForRecommendation =
      await testHelper.createFakeUsersForRecommendation(12);
    fakeUserIdsForRecommendation.push(...newFakeUserIdsForRecommendation);
  }, 100000);

  it('should get similar users', async () => {
    const accessToken = await testHelper.generateToken(
      fakeUserIdsForRecommendation[0],
    );

    const response = await request(app)
      .post('/api/1.0/recommendation/similar_users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        goal: 'backend engineer',
      });

    const similarUsers = response.body.data.similarUsers;

    expect(similarUsers.length).toBe(RECOMMENDATION_LIMIT);

    for (const similarUser of similarUsers) {
      expect(similarUser).toHaveProperty('user');
      expect(typeof similarUser.user.id).toBe('string');

      expect(similarUser).toHaveProperty('similarity');
      expect(typeof similarUser.similarity).toBe('number');

      expect(similarUser).toHaveProperty('startFootprintId');
      expect(typeof similarUser.startFootprintId).toBe('string');

      expect(similarUser).toHaveProperty('endFootprintId');
      expect(typeof similarUser.endFootprintId).toBe('string');

      expect(similarUser).toHaveProperty('startFootprintAge');
      expect(typeof similarUser.startFootprintAge).toBe('number');

      expect(similarUser).toHaveProperty('endFootprintAge');
      expect(typeof similarUser.endFootprintAge).toBe('number');
    }
  });
  it('should get similar users for a user with only 2 footprints', async () => {
    const accessToken = await testHelper.generateToken(
      fakeUserIdsForRecommendation[1],
    );

    const response = await request(app)
      .post('/api/1.0/recommendation/similar_users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        goal: 'backend engineer',
      });

    const similarUsers = response.body.data.similarUsers;

    expect(similarUsers.length).toBe(RECOMMENDATION_LIMIT);

    for (const similarUser of similarUsers) {
      expect(similarUser).toHaveProperty('user');
      expect(typeof similarUser.user.id).toBe('string');

      expect(similarUser).toHaveProperty('similarity');
      expect(typeof similarUser.similarity).toBe('number');

      expect(similarUser).toHaveProperty('startFootprintId');
      expect(typeof similarUser.startFootprintId).toBe('string');

      expect(similarUser).toHaveProperty('endFootprintId');
      expect(typeof similarUser.endFootprintId).toBe('string');

      expect(similarUser).toHaveProperty('startFootprintAge');
      expect(typeof similarUser.startFootprintAge).toBe('number');

      expect(similarUser).toHaveProperty('endFootprintAge');
      expect(typeof similarUser.endFootprintAge).toBe('number');
    }
  });
  it('should get similar users for a user with no footprints', async () => {
    const accessToken = await testHelper.generateToken(
      fakeUserIdsForRecommendation[2],
    );

    const response = await request(app)
      .post('/api/1.0/recommendation/similar_users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        goal: 'backend engineer',
      });

    const similarUsers = response.body.data.similarUsers;

    expect(similarUsers.length).toBe(RECOMMENDATION_LIMIT);

    for (const similarUser of similarUsers) {
      expect(similarUser).toHaveProperty('user');
      expect(typeof similarUser.user.id).toBe('string');

      expect(similarUser).toHaveProperty('similarity');
      expect(typeof similarUser.similarity).toBe('number');

      expect(similarUser).toHaveProperty('startFootprintId');
      expect(typeof similarUser.startFootprintId).toBe('string');

      expect(similarUser).toHaveProperty('endFootprintId');
      expect(typeof similarUser.endFootprintId).toBe('string');

      expect(similarUser).toHaveProperty('startFootprintAge');
      expect(typeof similarUser.startFootprintAge).toBe('number');

      expect(similarUser).toHaveProperty('endFootprintAge');
      expect(typeof similarUser.endFootprintAge).toBe('number');
    }
  });
});
