import request from 'supertest';
import app from '../../app.js';
import { Database } from '../../../src/Database/data-source.js';
import { testHelper } from '../testUtils/testHelper.js';
import { User } from '../../../src/Database/Entities/user.js';
import { Footprint } from '../../../src/Database/Entities/footprint.js';

describe('GET /api/1.0/user/{userId}/footprints', () => {
  let fakeUsers: User[];
  let fakeFootprints: Footprint[];
  let accessToken: string;
  const sortAlphabetically = (arr: string[]): string[] =>
    [...arr].sort((a, b) => a.localeCompare(b));
  const fakeHashtags = sortAlphabetically([
    '#personal achievement',
    '#fitness',
  ]);
  beforeAll(async () => {
    await Database.initialize();
    await testHelper.clearDatabase(Database);
    fakeUsers = await testHelper.createFakeUsers(Database);
    accessToken = await testHelper.generateToken(fakeUsers[0].id);
    fakeFootprints = await testHelper.createFakeFootprints(
      Database,
      fakeUsers[0].id,
    );
    await testHelper.addHashtagsToFootprint(
      Database,
      fakeFootprints[0].id,
      fakeHashtags,
    );
    await testHelper.addReactionsToFootprint(
      Database,
      fakeFootprints[0].id,
      fakeUsers.map((user) => user.id),
      ['like', 'love'],
    );
  });

  afterAll(async () => {
    await Database.destroy();
    console.log('Database destroyed');
  });

  it('should get all footprints of a user', async () => {
    const response = await request(app)
      .get(`/api/1.0/user/${fakeUsers[0].id}/footprints`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const footprint = response.body.data.footprints[0];
    const objectToMatch = fakeFootprints[0];

    expect(footprint).toMatchObject({
      title: objectToMatch.title,
      category: objectToMatch.category,
      titleImage: objectToMatch.titleImage,
      totalLike: objectToMatch.totalLike + fakeUsers.length,
      status: objectToMatch.status,
      milestone: objectToMatch.milestone,
      userId: objectToMatch.userId,
      hashtags: fakeHashtags,
      reactionCounts: { love: 1, like: 1, fire: 0, laugh: 0 },
    });

    expect(footprint).toHaveProperty('id');
    expect(footprint).toHaveProperty('createdAt');
    expect(footprint).toHaveProperty('occurAt');
    expect(new Date(footprint.createdAt)).toBeInstanceOf(Date);
    expect(new Date(footprint.occurAt)).toBeInstanceOf(Date);

    const response_secondPage = await request(app)
      .get(`/api/1.0/user/${fakeUsers[0].id}/footprints?page=2`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response_secondPage.body.data.footprints).toHaveLength(0);
  });
});
