import { Database } from '../../Database/data-source.js';
import { testHelper, TFootprintJson } from './testHelper.js';

import { Notification } from '../../Database/Entities/notification.js';

const fakeUserIds: string[] = [];
const fakeFootprintIds: string[] = [];
const userToFootprintsMap = testHelper.userToFootprintsMap;
const userToFootprintsMapSorted: Record<string, TFootprintJson[]> = {};

const fakeNotifications: Notification[] = [];

beforeAll(async () => {
  await Database.initialize();
  await testHelper.clearDatabase(Database);
  testHelper.initReactionTypes(Database);
  const newfakeUserIds = await testHelper.createFakeUsers(Database);
  fakeUserIds.push(...newfakeUserIds);
  const newFootprintIds = await testHelper.createFakeFootprints(
    Database,
    fakeUserIds,
  );
  fakeFootprintIds.push(...newFootprintIds);
  fakeUserIds.forEach((userId) => {
    const footprints = userToFootprintsMap[userId] || [];
    userToFootprintsMapSorted[userId] = testHelper.sortByOccurAt(footprints);
  });

  fakeNotifications = await testHelper.createFakeOfficialNotifications(
    Database,
    fakeUserIds[0],
  );
});

afterAll(async () => {
  await Database.destroy();
});

export {
  fakeUserIds,
  fakeFootprintIds,
  userToFootprintsMapSorted,
  fakeNotifications,
};
