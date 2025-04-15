import { testHelper } from './testHelper.js';
import { Database } from '../../Database/data-source.js';

await testHelper.clearCache();
await Database.initialize();
await testHelper.clearDatabase(Database);
await testHelper.initReactionTypes(Database);
const fakeUserIds = await testHelper.createFakeUsers(Database);
const fakeFootprints = await testHelper.createFakeFootprints(
  Database,
  fakeUserIds,
);
console.log(fakeUserIds);
console.log(fakeFootprints);
console.log(testHelper.userToFootprintsMap);
await Database.destroy();
