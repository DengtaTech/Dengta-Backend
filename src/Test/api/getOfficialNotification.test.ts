import request from 'supertest';
import app from '../../app.js';
import { Database } from '../../Database/data-source.js';
import { testHelper } from '../testUtils/testHelper.js';
import { User } from '../../Database/Entities/user.js';
import { Notification } from '../../Database/Entities/notification.js';

describe('GET /api/1.0/notification', () => {
  let fakeUsers: User[];
  let fakeNotifications: Notification[];
  let accessToken: string;

  beforeAll(async () => {
    await Database.initialize();
    await testHelper.clearDatabase(Database);
    fakeUsers = await testHelper.createFakeUsers(Database);
    accessToken = await testHelper.generateToken(fakeUsers[0].id);
    fakeNotifications = await testHelper.createFakeOfficialNotifications(
      Database,
      fakeUsers[0].id,
    );
  });

  afterAll(async () => {
    await Database.destroy();
    console.log('Database destroyed');
  });

  it('should get all official notifications of a user', async () => {
    const response = await request(app)
      .get('/api/1.0/notification?page=1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const firstPageNotifications = response.body.data.notifications;
    const reversedFakeNotifications = fakeNotifications.reverse();
    const objectToMatch = reversedFakeNotifications
      .slice(0, 10)
      .map((notification) => {
        return {
          ...notification,
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
        return {
          ...notification,
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
