import request from 'supertest';
import app from '../../app.js';
import { testHelper } from '../testUtils/testHelper.js';
import { fakeUserIds, fakeNotifications } from '../testUtils/testSetup.js';

describe('GET /api/1.0/notification', () => {
  it('should get all official notifications of a user', async () => {
    const accessToken = await testHelper.generateToken(fakeUserIds[0]);

    const response = await request(app)
      .get('/api/1.0/notification?page=1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const firstPageNotifications = response.body.data.notifications;
    const reversedFakeNotifications = [...fakeNotifications].reverse();
    const objectToMatch = reversedFakeNotifications
      .slice(0, 10)
      .map((notification) => {
        const { createdAt, relatedFootprintId, relatedUserId, ...rest } =
          notification;
        return {
          ...rest,
          relatedFootprint: null,
          relatedUser: null,
          createdAt: notification.createdAt.toISOString(),
        };
      });

    expect(firstPageNotifications).toEqual(objectToMatch);

    const response2 = await request(app)
      .get('/api/1.0/notification?page=2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const secondPageNotifications = response2.body.data.notifications;
    const objectToMatch2 = reversedFakeNotifications
      .slice(10, 20)
      .map((notification) => {
        const { createdAt, relatedFootprintId, relatedUserId, ...rest } =
          notification;
        return {
          ...rest,
          relatedFootprint: null,
          relatedUser: null,
          createdAt: notification.createdAt.toISOString(),
        };
      });

    expect(secondPageNotifications).toEqual(objectToMatch2);

    const response3 = await request(app)
      .get('/api/1.0/notification?page=3')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const thirdPageNotifications = response3.body.data.notifications;

    expect(thirdPageNotifications).toEqual([]);
  });
});
