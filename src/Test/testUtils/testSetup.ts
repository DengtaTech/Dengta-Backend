import { Database } from '../../Database/data-source.js';
import { testHelper, TFootprintJson } from './testHelper.js';

let fakeUserIds: string[];
let fakeFootprintIds: string[];
let accessToken: string;
const userToFootprintsMap = testHelper.userToFootprintsMap;
const userToFootprintsMapSorted: Record<string, TFootprintJson[]> = {};

beforeAll(async () => {
  await Database.initialize();
  await testHelper.clearDatabase(Database);
  testHelper.initReactionTypes(Database);
  fakeUserIds = await testHelper.createFakeUsers(Database);
  fakeFootprintIds = await testHelper.createFakeFootprints(
    Database,
    fakeUserIds,
  );
  fakeUserIds.forEach((userId) => {
    const footprints = userToFootprintsMap[userId] || [];
    userToFootprintsMapSorted[userId] = testHelper.sortByOccurAt(footprints);
  });

  accessToken = await testHelper.generateToken(fakeUserIds[0]);
});

afterAll(async () => {
  await Database.destroy();
});

export {
  fakeUserIds,
  fakeFootprintIds,
  userToFootprintsMapSorted,
  accessToken,
};
