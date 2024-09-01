import request from 'supertest';
import app from '../../app.js';
import { GetFootprints } from '../../Application/Features/User/GetFootprints/Types/api.js';

import {
  fakeUserIds,
  userToFootprintsMapSorted,
} from '../testUtils/testSetup.js';
import { testHelper, TFootprintJson } from '../testUtils/testHelper.js';

describe('GET /api/1.0/user/{userId}/footprints', () => {
  const fetchAndAssertFootprints = async (
    userId: string,
    accessToken: string,
    expectedFootprints: TFootprintJson[],
    filterPublic: boolean = false,
  ) => {
    const response = await request(app)
      .get(`/api/1.0/user/${userId}/footprints`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const responseData: GetFootprints.TFootprintResponse = response.body.data;
    const footprints = responseData.footprints;
    let objectToMatch = expectedFootprints;

    if (filterPublic) {
      objectToMatch = objectToMatch.filter(
        (item) => item.status === 'published',
      );
    }

    expect(footprints.length).toBe(objectToMatch.length);

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
  };

  it('should get all footprints of a user', async () => {
    const testUserId1 = fakeUserIds[0];
    const testUserId2 = fakeUserIds[1];
    const accessToken1 = await testHelper.generateToken(testUserId1);

    await fetchAndAssertFootprints(
      testUserId1,
      accessToken1,
      userToFootprintsMapSorted[testUserId1],
    );

    await fetchAndAssertFootprints(
      testUserId2,
      accessToken1,
      userToFootprintsMapSorted[testUserId2],
      true,
    );
  });
});
