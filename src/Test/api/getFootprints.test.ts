import request from 'supertest';
import app from '../../app.js';
import { GetFootprints } from '../../Application/Features/User/GetFootprints/Types/api.js';

import {
  fakeUserIds,
  userToFootprintsMapSorted,
} from '../testUtils/testSetup.js';
import { testHelper } from '../testUtils/testHelper.js';

describe('GET /api/1.0/user/{userId}/footprints', () => {
  it('should get all footprints of a user', async () => {
    const testUserId = fakeUserIds[0];
    const accessToken = await testHelper.generateToken(testUserId);
    const response = await request(app)
      .get(`/api/1.0/user/${testUserId}/footprints`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const responseData: GetFootprints.TFootprintResponse = response.body.data;
    const footprints = responseData.footprints;
    const objectToMatch = userToFootprintsMapSorted[testUserId];
    footprints
      .map((item) => ({
        title: item.title,
        category: item.category,
        content: item.content,
        milestone: item.milestone,
        occurAt: new Date(item.occurAt),
        status: item.status,
        reactions: item.reactionCounts,
        hashtags: item.hashtags,
      }))
      .every((footprintItem, index: number) => {
        const expectedItem = objectToMatch[index];
        expectedItem.hashtags = testHelper.sortAlphabetically(
          expectedItem.hashtags,
        );
        expectedItem.occurAt = new Date(expectedItem.occurAt);
        return expect(footprintItem).toEqual(expectedItem);
      });
  });
});
