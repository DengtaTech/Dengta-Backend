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
  console.log('Initializing Database success');
  await testHelper.clearDatabase(Database);
  await testHelper.initReactionTypes(Database);
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

  const newFakeNotifications = await testHelper.createFakeOfficialNotifications(
    Database,
    fakeUserIds[0],
  );
  fakeNotifications.push(...newFakeNotifications);
}, 50000);

afterAll(async () => {
  try {
    console.log('Destroying Database...');
    await Database.destroy();
    console.log('Database destroyed.');
  } catch (error) {
    console.error('Error during test teardown:', error);
    throw error;
  }
});

export {
  fakeUserIds,
  fakeFootprintIds,
  userToFootprintsMapSorted,
  fakeNotifications,
};
